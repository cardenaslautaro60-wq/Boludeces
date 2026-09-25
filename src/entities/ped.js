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

  jump() {
    if (this.onGround && !this.swimming && !this.vehicle && this.knockT <= 0 && !this.dead) {
      this.vy = 5.6;
      this.onGround = false;
    }
  }

  attack() {
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
    this.attackCD = W.rate;
    const dir = this.aiming || this.vehicle ? this.aimDir : tmpV.set(Math.sin(this.heading), 0, Math.cos(this.heading)).clone();
    shoot(this.game, this, dir);
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
    const tvx = mx * spd * mag, tvz = mz * spd * mag;
    const k = this.onGround || this.swimming ? 1 - Math.exp(-12 * dt) : 1 - Math.exp(-1.5 * dt);
    this.vx = lerp(this.vx, tvx, k);
    this.vz = lerp(this.vz, tvz, k);

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
      this.vy -= 20 * dt;
      this.pos.y += this.vy * dt;
      if (this.pos.y <= gy) {
        if (this.vy < -14 && !dead) this.hurt((-this.vy - 14) * 6, null, null);
        this.pos.y = gy;
        this.vy = 0;
        this.onGround = true;
      } else if (this.pos.y - gy < 0.35 && this.vy <= 0) {
        // bajar escalones / cordones pegado al piso
        this.pos.y = gy; this.vy = 0; this.onGround = true;
      } else this.onGround = false;
    }
    // colisiones
    g.colliders.resolveCircle(this.pos, 0.33, this.pos.y);
    const B = g.worldBounds;
    if (B) {
      this.pos.x = clamp(this.pos.x, B.minX + 3, B.maxX - 3);
      this.pos.z = clamp(this.pos.z, B.minZ + 3, B.maxZ - 3);
    }
  }

  remove() {
    if (this.vehicle) this.exitVehicle();
    if (this.group.parent) this.group.parent.remove(this.group);
    this.removed = true;
  }
}

export function sayLine(ped, text, dur = 2.5) {
  ped.say = { text, t: dur };
}

export const PED_LINES = {
  hit: ['¡Eh, qué hacé\', loco!', '¡Ay, la puta madre!', '¡Pará, pará!', '¡Te voy a denunciar!', '¡Salí de acá, gil!'],
  car: ['¡Mirá por dónde manejás!', '¡Aprendé a manejar, bolú!', '¡Casi me pisás!', '¡Sacaste el registro en una rifa!'],
  flee: ['¡Socorro!', '¡Llamen a la cana!', '¡Corré, corré!', '¡Está loco este!'],
  gordopin: ['¡Aguante el Lobo, Gordopin!', '¡Eh, Gordopin! ¡Hacé los malabares!', '¡Vamos Newbery!', '¡Buena, Gordo!'],
  wind: ['¡Qué viento, la puta!', 'Se me voló la gorra...', 'Hoy sopla fuerte, eh.', 'Ni el perro sale con este viento.'],
  cheto: ['¿Y vos quién sos, negro?', 'Mi viejo es gerente de la petrolera.', 'Salí de mi playa.', 'Esto es Rada, no el Km 8.'],
  cana: ['¡Alto, policía!', '¡Al suelo!', '¡Quieto ahí!', '¡Documentos!'],
};
