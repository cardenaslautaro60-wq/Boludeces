import * as THREE from 'three';
import { rand, pick, chance, clamp, dist } from '../util.js';
import { Brain } from './ai.js';
import { DriverAI } from './traffic.js';
import { randomLook } from '../entities/humanoid.js';
import { sayLine, PED_LINES } from '../entities/ped.js';
import { GeoBuilder, hexColor } from '../world/geom.js';

const HEAT = [0, 40, 150, 350, 700, 1200, 2000];
const CRIMES = { runOver: 18, assault: 12, kill: 55, gunshot: 12, carjack: 25, copAttack: 160, copKill: 260, copCar: 160, explosion: 60, copCarHit: 45 };

// Nivel de búsqueda ("estrellas") y la cana
export class Police {
  constructor(game) {
    this.game = game;
    this.heat = 0;
    this.level = 0;
    this.unseenT = 0;
    this.flashing = false;
    this.units = [];
    this.cops = [];
    this.spawnT = 0;
    this.neverWanted = false;
    this.maxLevel = 6;
    this.heli = null;
    this.arrestT = 0;
  }

  crime(type, pos) {
    if (this.neverWanted) return;
    const g = this.game;
    let amt = CRIMES[type] || 10;
    // testigos: policías cerca
    let witnessed = false;
    for (const p of g.peds) {
      if (p.kind === 'cana' && !p.dead && dist(p.pos.x, p.pos.z, pos.x, pos.z) < 45) { witnessed = true; break; }
    }
    for (const v of g.vehicles) {
      if (v.type.police && !v.dead && dist(v.pos.x, v.pos.z, pos.x, pos.z) < 55) { witnessed = true; break; }
    }
    if (!witnessed) {
      if (type === 'gunshot' || type === 'assault' || type === 'runOver' || type === 'carjack') {
        amt *= this.level > 0 ? 1 : chance(0.35) ? 1 : 0;
      } else amt *= 0.8;
    }
    if (this.game.missions.active && this.game.missions.active.noWanted) return;
    if (amt <= 0) return;
    this.heat = Math.min(HEAT[this.maxLevel] + 100, this.heat + amt);
    const before = this.level;
    this.recalc();
    if (this.level > before) { this.unseenT = 0; this.game.audio.beep(); }
  }

  setLevel(n) {
    this.heat = n > 0 ? HEAT[n] + 1 : 0;
    this.recalc();
  }

  recalc() {
    let l = 0;
    for (let i = 1; i < HEAT.length; i++) if (this.heat >= HEAT[i]) l = i;
    this.level = Math.min(l, this.maxLevel);
  }

  clear() {
    this.heat = 0; this.level = 0; this.unseenT = 0;
    for (const u of this.units) u.retreat = true;
    for (const c of this.cops) if (c.brain) c.brain.hostile = false;
  }

  registerPatrol(v) { v.isCopCar = true; }

  playerSeen() {
    const g = this.game;
    const pl = g.player;
    const pp = pl.vehicle ? pl.vehicle.pos : pl.pos;
    for (const c of this.cops) {
      if (c.dead || c.removed) continue;
      const cp = c.vehicle ? c.vehicle.pos : c.pos;
      const d = dist(cp.x, cp.z, pp.x, pp.z);
      if (d < 18) return true;
      if (d < 75) {
        const dx = pp.x - cp.x, dz = pp.z - cp.z, dy = pp.y - cp.y;
        const L = Math.hypot(dx, dy, dz);
        const hit = g.colliders.raycast(cp.x, cp.y + 1.5, cp.z, dx / L, dy / L, dz / L, L - 2);
        if (!hit) return true;
      }
    }
    if (this.heli && dist(this.heli.pos.x, this.heli.pos.z, pp.x, pp.z) < 80) return true;
    return false;
  }

  update(dt) {
    const g = this.game;
    const pl = g.player;
    const pp = pl.vehicle ? pl.vehicle.pos : pl.pos;
    this.cops = this.cops.filter((c) => !c.removed);
    this.units = this.units.filter((u) => !u.v.removed);
    if (this.level > 0) {
      const seen = this.playerSeen();
      if (seen) { this.unseenT = 0; this.flashing = false; }
      else {
        this.unseenT += dt;
        this.flashing = this.unseenT > 2;
        if (this.unseenT > 10 + this.level * 5) {
          this.level--;
          this.heat = this.level > 0 ? HEAT[this.level] + 1 : 0;
          this.unseenT = 0;
          if (this.level === 0) this.clear();
        }
      }
      // despachar unidades
      this.spawnT -= dt;
      const want = [0, 1, 2, 3, 4, 5, 6][this.level];
      const active = this.units.filter((u) => !u.retreat && !u.v.dead).length;
      if (this.spawnT <= 0 && active < want) { this.spawnT = 3; this.spawnUnit(pp); }
      // helicóptero
      if (this.level >= 4 && !this.heli) this.spawnHeli(pp);
      // arresto dentro del auto: si el jugador está quieto y rodeado
      if (pl.vehicle && this.level > 0) {
        const near = this.cops.some((c) => !c.dead && !c.vehicle && dist(c.pos.x, c.pos.z, pp.x, pp.z) < 3.2);
        if (near && pl.vehicle.speed < 1) { this.arrestT += dt; if (this.arrestT > 1.5) { this.arrestT = 0; g.wasted(true); } }
        else this.arrestT = Math.max(0, this.arrestT - dt);
      }
    } else {
      this.flashing = false;
    }
    if (this.heli) this.updateHeli(dt, pp);
    // unidades
    for (const u of this.units) {
      const v = u.v;
      if (v.dead) continue;
      const d = dist(v.pos.x, v.pos.z, pp.x, pp.z);
      if (u.retreat || this.level === 0) {
        v.siren = false;
        if (v.ai) { v.ai.mode = 'cruise'; v.ai.target = null; v.ai.speedMul = 1; }
        for (const c of u.cops) if (c.brain && !c.vehicle) { c.brain.mode = 'cop'; }
        if (d > 200) { for (const c of u.cops) if (!c.removed) g.removePed(c); g.removeVehicle(v); }
        continue;
      }
      v.siren = true;
      if (v.ai) { v.ai.mode = 'chase'; v.ai.target = pl; v.ai.speedMul = 1.1 + this.level * 0.05; v.ai.aggressive = this.level >= 2; }
      // bajarse cuando está cerca y el jugador va a pie o está frenado
      const pSpeed = pl.vehicle ? pl.vehicle.speed : 0;
      if (d < 22 && v.speed < 4 && (!pl.vehicle || pSpeed < 3)) {
        for (const c of u.cops) if (c.vehicle === v) { c.exitVehicle(); c.brain.mode = 'cop'; }
      }
      if (d > 320) { for (const c of u.cops) if (!c.removed && !c.vehicle) g.removePed(c); g.removeVehicle(v); }
    }
    // patrulleros comunes que ven un delito
    if (this.level > 0) {
      for (const v of g.traffic.cars) {
        if (!v.isCopCar || v.dead || !v.driver || this.units.some((u) => u.v === v)) continue;
        if (dist(v.pos.x, v.pos.z, pp.x, pp.z) < 90) this.units.push({ v, cops: [v.driver] }), this.cops.push(v.driver), v.driver.brain = new Brain(g, v.driver, 'cop');
      }
    }
  }

  spawnUnit(pp) {
    const g = this.game;
    const n = g.traffic.randomRoadPoint(pp, 110, 190);
    if (!n) return;
    const e = n.edge;
    const x = n.x, z = n.z;
    for (const o of g.vehicles) if (dist(o.pos.x, o.pos.z, x, z) < 8) return;
    const toward = Math.atan2(pp.x - x, pp.z - z);
    const key = this.level >= 5 ? 'jilux' : 'patrullero';
    const v = g.spawnVehicle(key, x, z, toward, key === 'jilux' ? { color: 0x3a4a2a } : {});
    v.isCopCar = true;
    const cops = [];
    const nCops = this.level >= 3 ? 2 : 1;
    for (let i = 0; i < nCops; i++) {
      const c = g.spawnPed('cana', x, z, { look: randomLook('cana'), health: 100 });
      c.give('pistola', 200);
      if (this.level >= 4) c.give('uzi', 200);
      if (this.level >= 3 && chance(0.4)) c.give('escopeta', 40);
      c.setWeapon('pistola');
      c.enterVehicle(v, i === 0 ? 0 : 1);
      c.brain = new Brain(g, c, 'cop');
      c.spawned = true;
      cops.push(c);
      this.cops.push(c);
    }
    v.ai = new DriverAI(g, v, 'chase', { target: g.player, aggressive: true, speedMul: 1.15 });
    v.siren = true;
    this.units.push({ v, cops });
    void e;
  }

  // IA de un policía a pie
  copBrain(brain, dt) {
    const g = this.game;
    const c = brain.ped;
    const pl = g.player;
    if (c.vehicle) return;
    if (this.level === 0) {
      c.aiming = false;
      // volver al patrullero o caminar
      brain.wander(dt);
      return;
    }
    const pp = pl.vehicle ? pl.vehicle.pos : pl.pos;
    const d = dist(c.pos.x, c.pos.z, pp.x, pp.z);
    brain.hostile = true;
    brain.target = pl;
    if (this.level === 1) {
      // intentar arrestar
      c.aiming = false;
      if (pl.vehicle) { brain.moveTo(pp.x, pp.z, 2, 2.5); return; }
      if (d > 1.3) brain.moveTo(pp.x, pp.z, 2, 1.1);
      else {
        c.moveMag = 0;
        c.heading = Math.atan2(pp.x - c.pos.x, pp.z - c.pos.z);
        this.arrestT += dt;
        if (chance(dt * 0.8)) sayLine(c, pick(PED_LINES.cana));
        if (this.arrestT > 1.2 && (pl.speed < 2.5 || pl.knockT > 0)) { this.arrestT = 0; g.wasted(true); }
      }
      if (d > 1.6) this.arrestT = Math.max(0, this.arrestT - dt * 0.5);
      return;
    }
    // 2+ estrellas: tiroteo
    brain.target = pl;
    brain.attack(dt);
    brain.mode = 'cop';
    if (d < 1.4 && pl.knockT > 0) g.wasted(true);
  }

  // ---- Helicóptero de la policía ----
  spawnHeli(pp) {
    const g = this.game;
    const gb = new GeoBuilder();
    const blue = hexColor(0x1d3f8f), white = hexColor(0xf2f2f2), dark = hexColor(0x1a1a1a);
    gb.box(-1.1, 1.1, 0, 1.9, -2, 2, white);
    gb.box(-1.12, 1.12, 0.5, 1.0, -2, 2, blue);
    gb.box(-0.3, 0.3, 0.9, 1.5, -6.5, -2, white);
    gb.box(-0.05, 0.05, 1.2, 2.6, -6.6, -6, blue);
    gb.box(-1.4, -1.3, -0.4, -0.3, -1.6, 1.6, dark);
    gb.box(1.3, 1.4, -0.4, -0.3, -1.6, 1.6, dark);
    gb.box(-0.9, 0.9, 0.8, 1.7, 1.9, 2.3, hexColor(0x2a3a4a));
    const body = new THREE.Mesh(gb.toGeometry(), new THREE.MeshLambertMaterial({ vertexColors: true }));
    const rotor = new THREE.Mesh(new THREE.BoxGeometry(11, 0.08, 0.35), new THREE.MeshLambertMaterial({ color: 0x222222 }));
    rotor.position.y = 2.2;
    const grp = new THREE.Group();
    grp.add(body, rotor);
    g.scene.add(grp);
    const pos = new THREE.Vector3(pp.x - 150, 60, pp.z - 150);
    this.heli = { grp, rotor, pos, shootT: 2, vx: 0, vz: 0, hp: 600, spot: null };
  }

  updateHeli(dt, pp) {
    const g = this.game;
    const h = this.heli;
    if (this.level < 4 || h.hp <= 0) {
      // retirarse
      h.pos.y += dt * 8; h.pos.x += dt * 30;
      if (h.hp <= 0 && !h.boom) { h.boom = true; g.effects.explosion(h.pos.x, h.pos.y, h.pos.z, g.player); }
      if (h.pos.y > 150 || h.boom) { g.scene.remove(h.grp); this.heli = null; }
      h.grp.position.copy(h.pos);
      h.rotor.rotation.y += dt * 30;
      return;
    }
    const tx = pp.x + Math.sin(g.time * 0.3) * 25, tz = pp.z + Math.cos(g.time * 0.3) * 25;
    const ty = g.terrain.heightAt(pp.x, pp.z) + 32;
    h.vx += (tx - h.pos.x) * dt * 0.6; h.vz += (tz - h.pos.z) * dt * 0.6;
    h.vx *= Math.exp(-1.2 * dt); h.vz *= Math.exp(-1.2 * dt);
    h.pos.x += h.vx * dt; h.pos.z += h.vz * dt;
    h.pos.y += (ty - h.pos.y) * dt * 0.8;
    h.grp.position.copy(h.pos);
    h.grp.rotation.y = Math.atan2(pp.x - h.pos.x, pp.z - h.pos.z);
    h.grp.rotation.x = clamp(Math.hypot(h.vx, h.vz) * 0.01, 0, 0.3);
    h.rotor.rotation.y += dt * 30;
    // disparar
    h.shootT -= dt;
    if (h.shootT <= 0) {
      h.shootT = rand(0.12, 0.25);
      if (Math.floor(g.time / 3) % 2 === 0) {
        const pl = g.player;
        const tpos = pl.vehicle ? pl.vehicle.pos : pl.pos;
        const ox = h.pos.x, oy = h.pos.y - 0.5, oz = h.pos.z;
        let dx = tpos.x - ox + rand(-3, 3), dy = tpos.y + 1 - oy, dz = tpos.z - oz + rand(-3, 3);
        const L = Math.hypot(dx, dy, dz); dx /= L; dy /= L; dz /= L;
        g.effects.tracer(ox, oy, oz, ox + dx * L, oy + dy * L, oz + dz * L);
        g.audio.gun('smg', h.pos);
        const hitX = ox + dx * L, hitZ = oz + dz * L;
        if (dist(hitX, hitZ, tpos.x, tpos.z) < 1.8) {
          if (pl.vehicle) pl.vehicle.damage(10, null); else pl.hurt(4, null, null);
        } else g.effects.dustPuff(hitX, g.terrain.heightAt(hitX, hitZ), hitZ, 2);
      }
    }
    // el jugador le puede disparar: se usa como vehículo "virtual"
    h.hit = (dmg) => { h.hp -= dmg; };
  }
}
