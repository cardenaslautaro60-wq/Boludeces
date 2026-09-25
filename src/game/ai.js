import { rand, pick, chance, clamp, dist, angleDiff } from '../util.js';
import { WEAPONS } from './weapons.js';
import { sayLine, PED_LINES } from '../entities/ped.js';
import { SW } from '../world/city.js';
void SW;

// Cerebro de los personajes no jugables
export class Brain {
  constructor(game, ped, mode = 'wander', opts = {}) {
    this.game = game;
    this.ped = ped;
    this.mode = mode;
    this.base = mode;
    this.target = null;
    this.hostile = !!opts.hostile;
    this.t = 0;
    this.wp = null;
    this.dir = chance(0.5) ? 1 : -1;
    this.block = opts.block || null;
    this.corner = 0;
    this.home = opts.home || { x: ped.pos.x, z: ped.pos.z };
    this.leashR = opts.leash || 30;
    this.fleeFrom = null;
    this.idleT = 0;
    this.shootT = rand(0.5, 1.5);
    this.aggro = opts.aggro || 0;
    this.faction = opts.faction || ped.kind;
    this.onDeathCb = null;
    this.stuckT = 0;
    this.lastPos = { x: ped.pos.x, z: ped.pos.z };
    this.sw = null;
  }

  onAttacked(attacker) {
    const p = this.ped;
    if (!attacker || attacker === p || p.dead) return;
    if (this.mode === 'follow' || this.mode === 'script') {
      if (attacker !== this.game.player && !attacker.isFriend) this.combatTarget = attacker;
      return;
    }
    if (this.mode === 'cop') return;
    const brave = p.kind !== 'civil' || (p.owned.length > 1) || chance(0.25);
    if (brave) { this.setMode('attack'); this.target = attacker; this.hostile = true; }
    else { this.setMode('flee'); this.fleeFrom = attacker; this.t = rand(6, 12); if (chance(0.5)) sayLine(p, pick(PED_LINES.hit)); }
  }

  onCarjacked(attacker) {
    if (chance(0.35) && this.ped.kind !== 'civil') { this.setMode('attack'); this.target = attacker; }
    else { this.setMode('flee'); this.fleeFrom = attacker; this.t = 8; }
  }

  setMode(m) {
    this.mode = m;
    this.wp = null;
    this.ped.aiming = false;
  }

  panic(from, by) {
    if (['attack', 'cop', 'follow', 'script', 'guard'].includes(this.mode)) {
      if (this.mode === 'guard' && by && by.isPlayer && this.ped.kind !== 'civil') { this.setMode('attack'); this.target = by; }
      return;
    }
    this.setMode('flee');
    this.fleeFrom = from;
    this.t = rand(5, 10);
    if (chance(0.2)) sayLine(this.ped, pick(PED_LINES.flee));
  }

  moveTo(x, z, gait = 1, stopDist = 0.6) {
    const p = this.ped;
    const dx = x - p.pos.x, dz = z - p.pos.z;
    const d = Math.hypot(dx, dz);
    if (d < stopDist) { p.moveMag = 0; return true; }
    p.moveX = dx / d; p.moveZ = dz / d; p.moveMag = 1; p.gait = gait;
    return false;
  }

  stop() { this.ped.moveMag = 0; }

  update(dt) {
    const p = this.ped;
    if (p.dead || p.knockT > 0) return;
    if (p.vehicle && this.mode !== 'follow' && this.mode !== 'script' && this.mode !== 'drive') {
      // pasajero o conductor manejado por otro sistema
      return;
    }
    this.t -= dt;
    // detectar atascos
    this.stuckCheck = (this.stuckCheck || 0) + dt;
    if (this.stuckCheck > 1.5) {
      const moved = Math.hypot(p.pos.x - this.lastPos.x, p.pos.z - this.lastPos.z);
      this.stuck = p.moveMag > 0.5 && moved < 0.8;
      this.lastPos = { x: p.pos.x, z: p.pos.z };
      this.stuckCheck = 0;
      if (this.stuck) { this.wp = null; this.dir = -this.dir; }
    }
    switch (this.mode) {
      case 'wander': this.wander(dt); break;
      case 'flee': this.flee(dt); break;
      case 'attack': this.attack(dt); break;
      case 'follow': this.follow(dt); break;
      case 'guard': this.guard(dt); break;
      case 'idle': this.stop(); break;
      case 'script': if (this.script) this.script(dt, this); break;
      case 'cop': this.game.police.copBrain(this, dt); break;
      default: this.stop();
    }
  }

  // --- Caminar por las veredas (de las calles reales) ---
  lanePoint(e, side, atB) {
    const C = this.game.city, R = this.game.roads;
    const A = R.nodes[e.a];
    const t = atB ? e.len - C.trimOf(e, 1, side) : C.trimOf(e, 0, side);
    const off = (e.width / 2 + 1.3) * side;
    const tt = Math.max(0.5, Math.min(e.len - 0.5, t));
    return { x: A.x + e.dx * tt - e.dz * off, z: A.z + e.dz * tt + e.dx * off };
  }

  initSidewalk() {
    const p = this.ped, R = this.game.roads;
    const n = R.nearestEdge(p.pos.x, p.pos.z, 30, (e) => e.sw);
    if (!n) return null;
    const e = n.edge, A = R.nodes[e.a];
    const cross = e.dx * (p.pos.z - A.z) - e.dz * (p.pos.x - A.x);
    return { e, side: cross >= 0 ? 1 : -1, toB: chance(0.5) };
  }

  // Al llegar a una esquina: doblar siguiendo la vereda o cruzar la calle
  nextLane() {
    const R = this.game.roads;
    const w = this.sw;
    const e = w.e;
    const nid = w.toB ? e.b : e.a;
    const N = R.nodes[nid];
    if (N.edges.length > 1 && chance(0.78)) {
      const list = N.edges.map((i) => {
        const f = R.edges[i];
        const atA = f.a === nid;
        const ox = atA ? f.dx : -f.dx, oz = atA ? f.dz : -f.dz;
        return { f, atA, ang: Math.atan2(oz, ox), ox, oz };
      }).sort((a, b) => a.ang - b.ang);
      const k = list.findIndex((q) => q.f === e);
      const me = list[k];
      const nx = -e.dz * w.side, nz = e.dx * w.side;
      const ccw = me.ox * nz - me.oz * nx > 0;
      const nb = ccw ? list[(k + 1) % list.length] : list[(k - 1 + list.length) % list.length];
      if (nb && nb.f !== e && nb.f.sw) {
        const side = ccw ? (nb.atA ? -1 : 1) : (nb.atA ? 1 : -1);
        this.sw = { e: nb.f, side, toB: nb.atA };
        return;
      }
    }
    // cruzar al frente y volver por la otra vereda
    this.sw = { e, side: -w.side, toB: !w.toB };
    this.crossing = true;
  }

  wander(dt) {
    const p = this.ped;
    const g = this.game;
    if (this.idleT > 0) { this.idleT -= dt; this.stop(); return; }
    if (!this.sw && !this.noSidewalk) {
      this.sw = this.initSidewalk();
      if (!this.sw) this.noSidewalk = true;
    }
    if (!this.sw) {
      // fuera de la ciudad: paseo aleatorio
      if (!this.wp || this.moveTo(this.wp.x, this.wp.z, 0)) {
        const a = rand(0, Math.PI * 2);
        this.wp = { x: this.home.x + Math.cos(a) * rand(5, 25), z: this.home.z + Math.sin(a) * rand(5, 25) };
        if (chance(0.3)) this.idleT = rand(2, 6);
      }
      return;
    }
    if (!this.wp) {
      const w = this.sw;
      if (this.crossing) {
        // primero cruzar al punto de la otra vereda en la misma esquina
        this.wp = this.lanePoint(w.e, w.side, !w.toB);
        this.crossing = false;
        this.wp.crossStep = true;
      } else this.wp = this.lanePoint(w.e, w.side, w.toB);
    }
    if (this.stuck) { this.stuck = false; this.nextLane(); this.wp = null; return; }
    if (this.moveTo(this.wp.x, this.wp.z, 0, 0.9)) {
      const was = this.wp;
      this.wp = null;
      if (!was.crossStep) this.nextLane();
      if (chance(0.06)) this.idleT = rand(2, 7);
    }
    // saludar al Gordopin (es famoso)
    const pl = g.player;
    if (pl && pl === g.gordopin && !pl.vehicle && chance(dt * 0.05)) {
      const d = Math.hypot(pl.pos.x - p.pos.x, pl.pos.z - p.pos.z);
      if (d < 6 && p.kind === 'civil') { sayLine(p, pick(PED_LINES.gordopin)); p.wave = true; setTimeout(() => { p.wave = false; }, 1500); }
    }
    if (g.env.windSpeed > 24 && chance(dt * 0.02)) sayLine(p, pick(PED_LINES.wind));
  }

  flee(dt) {
    const p = this.ped;
    const f = this.fleeFrom;
    if (this.t <= 0 || !f) { this.setMode(this.base === 'flee' ? 'wander' : this.base); this.sw = null; this.noSidewalk = false; return; }
    const fx = f.pos ? f.pos.x : f.x, fz = f.pos ? f.pos.z : f.z;
    let dx = p.pos.x - fx, dz = p.pos.z - fz;
    const d = Math.hypot(dx, dz) || 1;
    if (this.stuck) { const a = Math.atan2(dz, dx) + rand(-1.5, 1.5); dx = Math.cos(a); dz = Math.sin(a); }
    p.moveX = dx / d; p.moveZ = dz / d; p.moveMag = 1; p.gait = 2;
    if (d > 60) this.t = Math.min(this.t, 1);
  }

  attack(dt) {
    const p = this.ped;
    const tg = this.target;
    if (!tg || tg.dead || tg.removed || tg.hidden) {
      this.target = null;
      this.setMode(this.base === 'attack' ? 'guard' : this.base);
      p.aiming = false;
      return;
    }
    const tp = tg.vehicle ? tg.vehicle.pos : tg.pos;
    const dx = tp.x - p.pos.x, dz = tp.z - p.pos.z;
    const d = Math.hypot(dx, dz);
    if (d > 90 || (this.leash && Math.hypot(p.pos.x - this.home.x, p.pos.z - this.home.z) > this.leashR * 3)) {
      this.target = null; this.setMode(this.base); p.aiming = false; return;
    }
    const W = WEAPONS[p.weapon];
    const hasGun = W && !W.melee && (p.ammo[p.weapon] || 0) > 0;
    if (!hasGun && p.owned.some((w) => !WEAPONS[w].melee && (p.ammo[w] || 0) > 0)) {
      p.setWeapon(p.owned.find((w) => !WEAPONS[w].melee && (p.ammo[w] || 0) > 0));
    }
    if (hasGun) {
      const range = W.range * 0.45;
      if (d > range) { this.moveTo(tp.x, tp.z, 2, 1); p.aiming = false; }
      else if (d < 5 && chance(0.02)) { this.moveTo(p.pos.x - dx, p.pos.z - dz, 1); }
      else p.moveMag = 0;
      if (d < range * 1.1) {
        p.aiming = true;
        const ty = (tg.vehicle ? tg.vehicle.pos.y + 0.8 : tg.pos.y + 1.2) - (p.pos.y + 1.4);
        p.aimDir.set(dx, ty, dz).normalize();
        this.shootT -= dt;
        if (this.shootT <= 0) {
          // línea de visión
          const h = p.handWorld();
          const blocked = this.game.colliders.raycast(h.x, h.y, h.z, p.aimDir.x, p.aimDir.y, p.aimDir.z, d - 1);
          if (!blocked) p.attack();
          this.shootT = W.auto ? rand(0.08, 0.2) : rand(0.6, 1.4) / (p.kind === 'cana' ? 1.2 : 1);
          if (W.auto && chance(0.12)) this.shootT = rand(0.8, 1.5);
        }
      }
    } else {
      p.aiming = false;
      if (d > 1.3) this.moveTo(tp.x, tp.z, d > 4 ? 2 : 1, 1.1);
      else {
        p.moveMag = 0;
        p.heading = Math.atan2(dx, dz);
        if (!tg.vehicle) p.attack();
      }
    }
  }

  guard(dt) {
    const p = this.ped;
    const g = this.game;
    const pl = g.player;
    // volver a casa
    const dh = Math.hypot(p.pos.x - this.home.x, p.pos.z - this.home.z);
    if (dh > 4) this.moveTo(this.home.x, this.home.z, 0, 1);
    else {
      this.stop();
      if (this.faceTarget) p.heading = Math.atan2(this.faceTarget.x - p.pos.x, this.faceTarget.z - p.pos.z);
    }
    // enemigos del jugador (pandillas rivales)
    if (this.hostile && pl && !pl.dead) {
      const d = Math.hypot(pl.pos.x - p.pos.x, pl.pos.z - p.pos.z);
      if (d < (this.aggroRange || 14)) {
        this.aggro += dt;
        if (this.aggro > (this.aggroDelay || 2.5)) { this.setMode('attack'); this.target = pl; }
        else if (this.aggro < dt * 2 && chance(0.6)) sayLine(p, pick(p.kind === 'cheto' ? PED_LINES.cheto : ['¿Qué mirás?', 'Rajá de acá.', 'Este no es tu barrio.']));
      } else this.aggro = Math.max(0, this.aggro - dt);
    }
  }

  // --- Seguir al jugador (el compañero) ---
  follow(dt) {
    const p = this.ped;
    const g = this.game;
    const L = g.player;
    if (!L || L === p) return;
    // combate cercano
    if (this.combatTarget && (this.combatTarget.dead || this.combatTarget.removed)) this.combatTarget = null;
    if (!this.combatTarget || chance(dt * 0.5)) {
      let best = null, bd = 25;
      for (const q of g.peds) {
        if (q.dead || q.removed || !q.brain || q === p) continue;
        if (!(q.brain.hostile && (q.brain.target === L || q.brain.target === p || q.brain.mode === 'attack'))) continue;
        if (q.kind === 'cana') continue; // con la cana no se mete
        const d = Math.hypot(q.pos.x - p.pos.x, q.pos.z - p.pos.z);
        if (d < bd) { bd = d; best = q; }
      }
      if (best) this.combatTarget = best;
    }
    if (L.vehicle) {
      const v = L.vehicle;
      if (p.vehicle === v) {
        // tiroteo desde el auto
        p.driveBy = false;
        if (this.combatTarget || this.driveTarget) this.shootFromCar(dt, this.driveTarget || this.combatTarget);
        return;
      }
      if (p.vehicle) p.exitVehicle();
      const seat = v.seats.findIndex((s, i) => i > 0 && !s);
      if (seat < 0) { this.stop(); return; }
      const door = v.doorPos(seat);
      const d = Math.hypot(door.x - p.pos.x, door.z - p.pos.z);
      if (d < 1.2 || (d < 3 && v.speed < 1)) { p.enterVehicle(v, seat); return; }
      if (d > 60) { p.enterVehicle(v, seat); return; }
      this.moveTo(door.x, door.z, 2, 0.8);
      return;
    }
    if (p.vehicle) { p.exitVehicle(); return; }
    const dx = L.pos.x - p.pos.x, dz = L.pos.z - p.pos.z;
    const d = Math.hypot(dx, dz);
    if (d > 90) {
      // teletransportar detrás del jugador (fuera de cámara)
      const bx = L.pos.x - Math.sin(L.heading) * 3, bz = L.pos.z - Math.cos(L.heading) * 3;
      p.pos.set(bx, g.world.footGround(bx, bz), bz);
      return;
    }
    if (this.combatTarget && d < 30) { this.target = this.combatTarget; this.attack(dt); this.mode = 'follow'; return; }
    p.aiming = false;
    if (d > 3.2) this.moveTo(L.pos.x - dx / d * 2, L.pos.z - dz / d * 2, d > 12 ? 2 : d > 5 ? 1 : 0, 0.5);
    else { this.stop(); if (d > 0.1 && chance(dt)) p.heading = Math.atan2(dx, dz); }
    if (L.gait === 2 && d > 4) p.gait = 2;
  }

  shootFromCar(dt, tg) {
    const p = this.ped;
    if (!tg || tg.dead || tg.removed) return;
    const tp = tg.pos;
    const hx = p.pos.x, hz = p.pos.z;
    const dx = tp.x - hx, dz = tp.z - hz;
    const d = Math.hypot(dx, dz);
    if (d > 40) return;
    if (WEAPONS[p.weapon].melee || (p.ammo[p.weapon] || 0) <= 0) {
      const gun = p.owned.find((w) => !WEAPONS[w].melee && !WEAPONS[w].twoHanded && (p.ammo[w] || 0) > 0);
      if (!gun) return;
      p.setWeapon(gun);
    }
    const ty = (tg.pos.y + (tg.type ? 0.8 : 1.1)) - (p.pos.y + 1.2);
    p.aimDir.set(dx, ty, dz).normalize();
    p.driveBy = true;
    const v = p.vehicle;
    const lx = Math.cos(v.heading), lz = -Math.sin(v.heading);
    p.driveBySide = dx * lx + dz * lz > 0 ? 1 : -1;
    this.shootT -= dt;
    if (this.shootT <= 0) {
      p.attackCD = 0;
      p.attack();
      this.shootT = rand(0.35, 0.7);
    }
  }
}

export function isHostileTo(a, b) {
  return a.brain && a.brain.hostile && a.brain.target === b;
}

void clamp; void dist; void angleDiff;
