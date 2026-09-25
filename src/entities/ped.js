import * as THREE from 'three';
import { Humanoid } from './humanoid.js';
import { WEAPONS, weaponMesh, melee, shoot } from '../game/weapons.js';
import { clamp, lerp, approachAngle, angleWrap, rand, pick } from '../util.js';

let PID = 1;
const tmpV = new THREE.Vector3();

export class Ped {
  constructor(game, look, opts = {}) {
    this.game = game;
    this.id = PID++;
    this.look = look;
    this.kind = opts.kind || 'civil';
    this.name = opts.name || null;
    this.model = new Humanoid(look, game.textures.shadow);
    this.group = this.model.root;
    game.scene.add(this.group);
    this.pos = new THREE.Vector3(opts.x || 0, 0, opts.z || 0);
    this.pos.y = game.world.footGround(this.pos.x, this.pos.z);
    this.heading = opts.rot || 0;
    this.vx = 0; this.vz = 0; this.vy = 0;
    this.kx = 0; this.kz = 0; // empuje (golpes/atropellos)
    this.onGround = true;
    this.swimming = false;
    this.airT = 0;        // tiempo en el aire (para el salto "coyote")
    this.jumpHold = 0;    // mantener el salto: sube un poco más
    this.holdJump = false;
    this.jumpMul = 1;     // truco SUPERSALTO
    this.climb = null;    // trepando una pared, baranda o auto
    this.landT = 0;       // aterrizaje fuerte
    this.mag = {};        // balas en el cargador (solo el jugador recarga)
    this.reloadT = 0;
    this.maxHealth = opts.health || 100;
    this.health = this.maxHealth;
    this.armor = 0;
    this.dead = false;
    this.deadT = 0;
    this.knockT = 0;
    this.vehicle = null;
    this.seat = -1;
    this.moveX = 0; this.moveZ = 0; this.moveMag = 0;
    this.gait = 1; // 0 caminar, 1 trotar, 2 correr
    this.stamina = 100;
    this.weapon = 'punos';
    this.ammo = { punos: Infinity };
    this.owned = ['punos'];
    this.attackCD = 0;
    this.punchSide = 1;
    this.aiming = false;
    this.aimDir = new THREE.Vector3(0, 0, 1);
    this.aimPitch = 0;
    this.isPlayer = !!opts.isPlayer;
    this.brain = null;
    this.speedMul = opts.speedMul || 1;
    this.jugg = false; this.wave = false; this.dance = false;
    this.anim = {};
    this.lastAttacker = null;
    this.money = opts.money !== undefined ? opts.money : Math.floor(rand(0, 60));
    this.persistent = !!opts.persistent;
    this.enterT = 0;
    this.say = null;
    this.group.position.copy(this.pos);
  }

  give(weapon, ammo = 0) {
    if (!this.owned.includes(weapon)) this.owned.push(weapon);
    const W = WEAPONS[weapon];
    if (W.melee) this.ammo[weapon] = Infinity;
    else this.ammo[weapon] = (this.ammo[weapon] || 0) + ammo;
  }

  setWeapon(w) {
    if (!this.owned.includes(w)) return;
    if (w !== this.weapon) this.reloadT = 0;
    this.weapon = w;
    const W = WEAPONS[w];
    this.model.setHeld(W.mesh ? weaponMesh(W.mesh) : null);
  }

  cycleWeapon(dir) {
    const order = ['punos', 'clavas', 'bate', 'pistola', 'escopeta', 'uzi'].filter((w) => this.owned.includes(w) && (WEAPONS[w].melee || (this.ammo[w] || 0) > 0));
    let i = order.indexOf(this.weapon);
    i = (i + dir + order.length) % order.length;
    this.setWeapon(order[i]);
  }

  handWorld() {
    const f = this.aiming ? this.aimDir : tmpV.set(Math.sin(this.heading), 0, Math.cos(this.heading));
    const rx = -Math.cos(this.heading) * 0.25, rz = Math.sin(this.heading) * 0.25;
    if (this.vehicle) {
      const p = this.vehicle.seatWorld(this.seat, new THREE.Vector3());
      return { x: p.x + f.x * 0.6, y: p.y + 1.1, z: p.z + f.z * 0.6 };
    }
    return { x: this.pos.x + rx + f.x * 0.5, y: this.pos.y + 1.4 + (this.aiming ? f.y * 0.5 : 0), z: this.pos.z + rz + f.z * 0.5 };
  }

  get speed() { return Math.hypot(this.vx, this.vz); }

  // Salto: con carrera salta más lejos, manteniendo la tecla un poco más alto, y se puede
  // saltar un instante después de salir de un cordón ("coyote"). Contra una pared o una
  // baranda baja, el jugador trepa.
  jump() {
    if (this.swimming || this.vehicle || this.knockT > 0 || this.dead || this.climb) return false;
    const coyote = !this.onGround && this.airT < 0.14 && this.vy <= 0.5 && !this.jumped;
    if (!this.onGround && !coyote) return false;
    if (this.isPlayer && this.tryClimb()) return true;
    const sprint = this.gait === 2 && this.speed > 5;
    this.vy = (sprint ? 6.1 : 5.7) * (this.jumpMul > 1 ? 2.2 : 1);
    if (sprint) {
      const fx = Math.sin(this.heading), fz = Math.cos(this.heading);
      const along = this.vx * fx + this.vz * fz;
      if (along < 7.6) { this.vx += fx * (7.6 - along); this.vz += fz * (7.6 - along); }
    }
    this.onGround = false;
    this.jumped = true;
    this.jumpHold = 0.28;
    return true;
  }

  // Altura del objeto más alto (collider o techo de un auto) bajo el punto que no pase de maxY
  topAt(x, z, maxY, withCars = false) {
    const g = this.game;
    const list = g.colliders.near(x - 0.05, x + 0.05, z - 0.05, z + 0.05, this._near || (this._near = []));
    let best = -Infinity;
    for (const c of list) {
      if (c.y1 > maxY || c.y1 <= best) continue;
      let inside = false;
      if (c.type === 'box') inside = x >= c.x0 && x <= c.x1 && z >= c.z0 && z <= c.z1;
      else if (c.type === 'obb') {
        const dx = x - c.cx, dz = z - c.cz;
        inside = Math.abs(dx * c.ax + dz * c.az) <= c.hw && Math.abs(-dx * c.az + dz * c.ax) <= c.hd;
      } else inside = (x - c.x) ** 2 + (z - c.z) ** 2 <= c.r * c.r;
      if (inside) best = c.y1;
    }
    if (withCars) {
      for (const v of g.vehicles) {
        if (v.removed || v.type.bike) continue;
        const dx = x - v.pos.x, dz = z - v.pos.z;
        if (dx * dx + dz * dz > 16) continue;
        const f = v.fwd, lx = dx * f.z - dz * f.x, lz = dx * f.x + dz * f.z;
        const top = v.pos.y + v.type.H;
        if (Math.abs(lx) <= v.type.W / 2 - 0.05 && Math.abs(lz) <= v.type.L / 2 - 0.1 && top <= maxY && top > best) best = top;
      }
    }
    return best;
  }

  tryClimb() {
    const W = this.game.world;
    const fx = Math.sin(this.heading), fz = Math.cos(this.heading);
    const y = this.pos.y;
    for (const d of [0.5, 0.8]) {
      const x = this.pos.x + fx * d, z = this.pos.z + fz * d;
      const top = Math.max(this.topAt(x, z, y + 2.35, true), W.footGround(x, z));
      if (top < y + 0.6) continue;
      // ¿hay dónde pararse arriba? Si no (baranda, alambrado), se pasa por encima
      const lx = x + fx * 0.55, lz = z + fz * 0.55;
      const onTop = Math.max(this.topAt(lx, lz, top + 0.3, true), W.footGround(lx, lz)) > top - 0.3;
      const ex = onTop ? lx : x + fx * 1.3, ez = onTop ? lz : z + fz * 1.3;
      this.climb = { t: 0, dur: 0.3 + (top - y) * 0.2, x0: this.pos.x, y0: y, z0: this.pos.z, xm: x, zm: z, top, x1: ex, z1: ez, over: !onTop };
      this.vx = this.vz = this.vy = 0;
      this.onGround = false;
      this.game.audio && this.game.audio.thud && this.game.audio.thud(this.pos, 0.15);
      return true;
    }
    return false;
  }

  updateClimb(dt) {
    const c = this.climb;
    c.t += dt / c.dur;
    const k = Math.min(1, c.t);
    // primero sube pegado a la pared, después pasa el cuerpo por arriba
    if (k < 0.65) {
      const u = k / 0.65;
      this.pos.x = lerp(c.x0, c.xm - Math.sin(this.heading) * 0.25, u);
      this.pos.z = lerp(c.z0, c.zm - Math.cos(this.heading) * 0.25, u);
      this.pos.y = lerp(c.y0, c.top + (c.over ? 0.25 : 0.02), u * u * (3 - 2 * u));
    } else {
      const u = (k - 0.65) / 0.35;
      this.pos.x = lerp(c.xm - Math.sin(this.heading) * 0.25, c.x1, u);
      this.pos.z = lerp(c.zm - Math.cos(this.heading) * 0.25, c.z1, u);
    }
    if (k >= 1) {
      this.climb = null;
      this.onGround = !c.over;
      this.vy = 0;
      if (c.over) { this.vx = Math.sin(this.heading) * 1.5; this.vz = Math.cos(this.heading) * 1.5; }
    }
    this.model.update(dt, { speed: 0, climb: k, air: false });
    this.group.position.copy(this.pos);
    this.group.rotation.y = this.heading;
  }

  // Cargadores: el jugador recarga (R o solo al vaciar el cargador)
  magOf(w) {
    const W = WEAPONS[w];
    if (!W || W.melee || !this.isPlayer || this.infiniteAmmo) return this.ammo[w] || 0;
    if (this.mag[w] === undefined) this.mag[w] = Math.min(W.clip || 1, this.ammo[w] || 0);
    return Math.min(this.mag[w], this.ammo[w] || 0);
  }

  reload() {
    const W = WEAPONS[this.weapon];
    if (!W || W.melee || !this.isPlayer || this.infiniteAmmo || this.reloadT > 0) return false;
    const have = this.ammo[this.weapon] || 0, inMag = this.magOf(this.weapon);
    if (inMag >= (W.clip || 1) || have <= inMag) return false;
    this.reloadT = W.reload || 1.2;
    this.reloadW = this.weapon;
    const a = this.game.audio;
    if (a && a.click) { a.click(this.pos); setTimeout(() => a.click(this.pos), (W.reload || 1.2) * 700); }
    return true;
  }

  finishReload() {
    const w = this.reloadW, W = WEAPONS[w];
    if (!W) return;
    this.mag[w] = Math.min(W.clip || 1, this.ammo[w] || 0);
  }

  attack() {
    if (this.reloadT > 0 && !(WEAPONS[this.weapon] || {}).melee) return false;
    if (this.dead || this.knockT > 0 || this.attackCD > 0) return false;
    const W = WEAPONS[this.weapon] || WEAPONS.punos;
    if (W.melee || (this.ammo[this.weapon] || 0) <= 0 && W.melee) {
      this.attackCD = W.rate;
      this.model.anim.punch = 1;
      this.punchSide = -this.punchSide;
      setTimeout(() => { if (!this.dead) melee(this.game, this); }, 140);
      return true;
    }
    if ((this.ammo[this.weapon] || 0) <= 0) {
      this.attackCD = 0.3;
      this.game.audio && this.game.audio.click(this.pos);
      return false;
    }
    if (this.isPlayer && this.magOf(this.weapon) <= 0) { this.reload(); return false; }
    this.attackCD = W.rate;
    const dir = this.aiming || this.vehicle ? this.aimDir : tmpV.set(Math.sin(this.heading), 0, Math.cos(this.heading)).clone();
    shoot(this.game, this, dir);
    if (this.isPlayer && !this.infiniteAmmo && this.mag[this.weapon] !== undefined) {
      this.mag[this.weapon] = Math.max(0, this.mag[this.weapon] - 1);
      if (this.mag[this.weapon] <= 0) this.reload();
    }
    return true;
  }

  hurt(dmg, attacker, knock) {
    if (this.dead || this.invincible) return;
    if (this.armor > 0) {
      const a = Math.min(this.armor, dmg * 0.7);
      this.armor -= a;
      dmg -= a;
    }
    this.health -= dmg;
    this.lastAttacker = attacker;
    this.hurtT = 0.3;
    if (knock && knock.force) {
      const f = knock.force;
      this.kx += knock.x * f * 2.2;
      this.kz += knock.z * f * 2.2;
      if (f > 1.8 || (knock.melee && Math.random() < 0.18 && !this.isPlayer)) this.knockdown(knock.x * f * 2, knock.z * f * 2, f > 3 ? 3 : 1.5);
    }
    if (this.health <= 0) this.die(attacker);
    this.onHurt && this.onHurt(dmg, attacker);
    this.game.onPedHurt && this.game.onPedHurt(this, attacker, dmg);
  }

  knockdown(vx, vz, vy = 2) {
    if (this.vehicle) return;
    this.knockT = 1.6;
    this.kx = vx; this.kz = vz;
    this.vy = vy;
    this.onGround = false;
  }

  die(attacker) {
    if (this.dead) return;
    this.dead = true;
    this.health = 0;
    this.deadT = 0;
    if (this.vehicle) this.exitVehicle(true);
    this.game.onPedDeath && this.game.onPedDeath(this, attacker);
  }

  enterVehicle(v, seat = 0) {
    if (v.seats[seat] && v.seats[seat] !== this) return false;
    this.vehicle = v;
    this.seat = seat;
    v.seats[seat] = this;
    if (seat === 0) { v.driver = this; v.parked = false; }
    this.game.scene.remove(this.group);
    v.group.add(this.group);
    const s = v.model.seats[seat];
    this.group.position.set(s[0], s[1] - 0.05, s[2]);
    this.group.rotation.set(0, 0, 0);
    this.vx = this.vz = this.vy = 0;
    this.swimming = false;
    return true;
  }

  exitVehicle(force = false) {
    const v = this.vehicle;
    if (!v) return;
    v.seats[this.seat] = null;
    if (v.driver === this) { v.driver = null; v.ctrl.throttle = 0; v.ctrl.steer = 0; v.ctrl.handbrake = false; }
    v.group.remove(this.group);
    this.game.scene.add(this.group);
    const d = v.doorPos(this.seat);
    let x = d.x, z = d.z;
    // si la puerta está bloqueada, salir por el otro lado
    const p = { x, z };
    if (this.game.colliders.resolveCircle(p, 0.35, v.pos.y)) {
      const other = v.doorPos(this.seat === 0 ? 1 : 0);
      x = other.x; z = other.z;
    }
    this.pos.set(x, Math.max(v.pos.y, this.game.world.footGround(x, z)), z);
    this.heading = v.heading;
    this.vehicle = null;
    this.seat = -1;
    if (force) { this.vx = v.vx * 0.6; this.vz = v.vz * 0.6; }
    if (v.type.bike && v.speed > 4) this.knockdown(v.vx * 0.7, v.vz * 0.7, 3);
  }

  // ---------------------------------------------------------
  update(dt) {
    const g = this.game;
    this.attackCD = Math.max(0, this.attackCD - dt);
    if (this.hurtT > 0) this.hurtT -= dt;

    if (this.vehicle) {
      const v = this.vehicle;
      this.pos.copy(v.pos);
      if (v.type.bike) this.pedal = (this.pedal || 0) + (v.key === 'bmx' ? v.forwardSpeed * dt * 1.6 : 0);
      this.model.update(dt, {
        sit: true, steer: v.driver === this ? v.ctrl.steer : 0,
        ride: v.type.bike ? (v.key === 'bmx' ? 'bici' : 'moto') : null, pedal: this.pedal,
        aim: this.driveBy, aimSide: this.driveBySide,
      });
      return;
    }

    if (this.dead) {
      this.deadT += dt;
      this.kx *= Math.exp(-4 * dt); this.kz *= Math.exp(-4 * dt);
      this.physics(dt, 0, 0, true);
      this.model.update(dt, { dead: true });
      this.group.position.copy(this.pos);
      this.group.rotation.y = this.heading;
      return;
    }

    if (this.climb) { this.updateClimb(dt); return; }
    if (this.landT > 0) this.landT -= dt;
    if (this.reloadT > 0) {
      this.reloadT -= dt;
      if (this.reloadT <= 0) this.finishReload();
    }

    let mx = this.moveX, mz = this.moveZ, mag = this.moveMag;
    if (this.knockT > 0) {
      this.knockT -= dt;
      mx = 0; mz = 0; mag = 0;
    }
    // velocidad objetivo
    const fatPen = this.isPlayer && g.stats ? 1 - g.stats.fat / 400 : 1;
    let spd = [1.7, 4.6, 7.0][this.gait] * this.speedMul * fatPen;
    if (this.gait === 2 && this.isPlayer) {
      this.stamina -= dt * (18 + (g.stats ? g.stats.fat / 5 : 0));
      if (this.stamina <= 0) { this.stamina = 0; spd = 4.6 * fatPen; }
    } else this.stamina = Math.min(100, this.stamina + dt * 12);
    if (this.aiming) spd = Math.min(spd, 2.2);
    if (this.swimming) spd = 2.3;
    if (this.landT > 0) spd *= 0.35;
    const tvx = mx * spd * mag, tvz = mz * spd * mag;
    const air = !this.onGround && !this.swimming;
    // en el aire se conserva el impulso; con el jugador se puede corregir un poco la dirección
    if (!air || mag > 0.1) {
      const k = !air ? 1 - Math.exp(-12 * dt) : 1 - Math.exp(-(this.isPlayer ? 2.6 : 1.5) * dt);
      this.vx = lerp(this.vx, tvx, k);
      this.vz = lerp(this.vz, tvz, k);
    }

    // orientación
    if (this.aiming) {
      this.heading = approachAngle(this.heading, Math.atan2(this.aimDir.x, this.aimDir.z), dt * 14);
    } else if (mag > 0.1 && this.knockT <= 0) {
      this.heading = approachAngle(this.heading, Math.atan2(mx, mz), dt * 11);
    }

    this.physics(dt, this.vx, this.vz, false);

    const knocked = this.knockT > 0;
    const W = WEAPONS[this.weapon];
    this.model.update(dt, {
      speed: knocked ? 0 : Math.hypot(this.vx, this.vz) * (this.isPlayer ? 1 : 1.05),
      air: !this.onGround && !this.swimming && !knocked,
      swim: this.swimming,
      aim: (this.aiming || (W && !W.melee && this.attackCD > W.rate - 0.12)) && !knocked,
      aimPitch: this.aimPitch,
      twoHanded: W && W.twoHanded,
      melee: W && W.swing,
      punchSide: this.punchSide,
      dead: knocked,
      knock: 0,
      land: this.landT > 0 ? this.landT / 0.3 : 0,
      reload: this.reloadT > 0,
      jugg: this.jugg, wave: this.wave, dance: this.dance,
    });
    this.group.position.copy(this.pos);
    if (this.swimming) this.group.position.y = this.pos.y - 0.9;
    this.group.rotation.y = this.heading;
  }

  physics(dt, vx, vz, dead) {
    const g = this.game;
    const W = g.world;
    // viento fuerte empuja (temporal)
    let wx = 0, wz = 0;
    if (g.env && g.env.windSpeed > 18 && !dead) {
      const f = (g.env.windSpeed - 18) * 0.05;
      wx = g.env.windDir.x * f; wz = g.env.windDir.y * f;
    }
    this.pos.x += (vx + this.kx + wx) * dt;
    this.pos.z += (vz + this.kz + wz) * dt;
    this.kx *= Math.exp(-5 * dt);
    this.kz *= Math.exp(-5 * dt);
    const gy = W.footGround(this.pos.x, this.pos.z);
    const water = g.terrain.heightAt(this.pos.x, this.pos.z) < -1.2 && gy < -1;
    if (water && this.pos.y < 0.3) {
      if (!this.swimming && this.vy < -3) g.effects && g.effects.splash(this.pos.x, this.pos.z);
      this.swimming = true;
      this.pos.y = lerp(this.pos.y, 0, 1 - Math.exp(-6 * dt));
      this.vy = 0;
      this.onGround = false;
      if (dead) this.pos.y = -0.3;
    } else {
      this.swimming = false;
      // mantener el salto apretado: menos gravedad mientras sube
      const hold = this.holdJump && this.vy > 0 && this.jumpHold > 0;
      if (this.jumpHold > 0) this.jumpHold -= dt;
      this.vy -= (hold ? 11 : 20) * dt;
      const vy0 = this.vy;
      this.pos.y += this.vy * dt;
      // techos de autos, contenedores, muros: se puede parar arriba (solo el jugador y si ya está arriba)
      let sy = gy;
      if (this.isPlayer || !this.onGround) sy = Math.max(gy, this.topAt(this.pos.x, this.pos.z, this.pos.y + 0.3, this.isPlayer));
      if (this.pos.y <= sy) {
        const fall = this.jumpMul > 1 ? 30 : 14;
        if (vy0 < -fall && !dead) this.hurt((-vy0 - fall) * 6, null, null);
        if (vy0 < -9 && !dead && this.isPlayer) {
          this.landT = 0.3;
          g.effects && g.effects.dustPuff && g.effects.dustPuff(this.pos.x, sy + 0.1, this.pos.z, 4, 0.8);
          if (g.cameraRig) g.cameraRig.shake = Math.max(g.cameraRig.shake, Math.min(0.6, -vy0 * 0.03));
        }
        this.pos.y = sy;
        this.vy = 0;
        this.onGround = true;
      } else if (this.pos.y - sy < 0.35 && this.vy <= 0) {
        // bajar escalones / cordones pegado al piso
        this.pos.y = sy; this.vy = 0; this.onGround = true;
      } else this.onGround = false;
      if (this.onGround) { this.airT = 0; this.jumped = false; } else this.airT += dt;
    }
    // colisiones
    g.colliders.resolveCircle(this.pos, 0.33, this.pos.y);
    const B = g.worldBounds;
    if (B) B.clamp(this.pos, 3);
  }

  remove() {
    if (this.vehicle) this.exitVehicle();
    if (this.group.parent) this.group.parent.remove(this.group);
    this.removed = true;
  }
}

export function sayLine(ped, text, dur = 2.5) {
  ped.say = { text, t: dur };
  // la gente de la calle grita en voz alta (los personajes para hablar tienen su propia voz)
  const a = ped.game && ped.game.audio;
  if (a && a.pedSay && !ped.npc && !ped.isPlayer) a.pedSay(ped, text);
}

export { PED_LINES } from '../audio/guion.js';
