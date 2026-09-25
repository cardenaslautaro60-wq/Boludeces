import * as THREE from 'three';
import { buildCarModel, CarMaterials } from './carmodels.js';
import { clamp, lerp, approach, angleWrap, rand, pick } from '../util.js';

// Tipos de vehículos (parodias de los autos de la Argentina de los 2000)
export const VTYPES = {
  fitito: { name: 'Fitito 600', style: 'tiny', L: 3.3, W: 1.42, H: 1.38, mass: 600, power: 6.5, maxSpeed: 27, grip: 5.5, steer: 2.3, brake: 13, colors: [0xe8e0a0, 0x9ac8d8, 0xd84a3a, 0xf2f2f2, 0x7a9a6a] },
  reno12: { name: 'Renó 12', style: 'sedan', L: 4.35, W: 1.64, H: 1.43, mass: 950, power: 7.5, maxSpeed: 36, grip: 5, steer: 2.1, brake: 14, colors: [0xd8d0b0, 0x6a8ab0, 0xb03a2a, 0x3a5a3a, 0xf2f2f2, 0x8a7a5a, 0x2a4a7a] },
  falcon: { name: 'Falcón', style: 'sedan', L: 4.9, W: 1.8, H: 1.42, mass: 1300, power: 8.5, maxSpeed: 40, grip: 4.6, steer: 1.9, brake: 13, colors: [0x2f4a3a, 0x5a5a5a, 0xd8d0c0, 0x7a2a2a, 0x2a3a5a, 0x151515] },
  pijo504: { name: 'Pijó 504', style: 'sedan', L: 4.5, W: 1.7, H: 1.45, mass: 1150, power: 8, maxSpeed: 38, grip: 5.2, steer: 2.1, brake: 14, colors: [0xf2f2f2, 0x8aa0b8, 0xc8b890, 0x3a3a3a, 0x9a3a2a] },
  gool: { name: 'Gool', style: 'hatch', L: 3.9, W: 1.65, H: 1.42, mass: 950, power: 8.5, maxSpeed: 39, grip: 5.8, steer: 2.3, brake: 15, colors: [0xd81818, 0xf2f2f2, 0x2a2a2a, 0x3a6ab0, 0xa8b0b8, 0xe8c020] },
  duna: { name: 'Fiaz Duna', style: 'sedan', L: 4.1, W: 1.6, H: 1.42, mass: 900, power: 7.5, maxSpeed: 36, grip: 5.2, steer: 2.2, brake: 14, colors: [0xf2f2f2, 0x8a1a1a, 0x4a6a8a, 0xb8b8a8] },
  jilux: { name: 'Toyoda Jilux', style: 'pickup', L: 5.25, W: 1.82, H: 1.8, mass: 1700, power: 10, maxSpeed: 42, grip: 5, steer: 1.95, brake: 14, offroad: true, colors: [0xf2f2f2, 0x9a9ea2, 0x1a1a1a, 0xb01818, 0x3a4a6a] },
  empresa: { name: 'Chata de Empresa', style: 'pickup', L: 5.25, W: 1.82, H: 1.8, mass: 1700, power: 9.5, maxSpeed: 40, grip: 5, steer: 1.95, brake: 14, offroad: true, flag: true, colors: [0xf2f2f2] },
  f100: { name: 'Forz F-100', style: 'pickup', L: 5.1, W: 1.95, H: 1.85, mass: 1800, power: 8, maxSpeed: 37, grip: 4.5, steer: 1.8, brake: 12, offroad: true, colors: [0x3a5a8a, 0xb89a50, 0x7a2a1a, 0x5a6a4a, 0xd8d0c0] },
  remis: { name: 'Remís', style: 'sedan', L: 4.5, W: 1.7, H: 1.45, mass: 1150, power: 8, maxSpeed: 38, grip: 5.2, steer: 2.1, brake: 14, sign: 'REMIS', colors: [0x1a1a1a] },
  patrullero: { name: 'Patrullero', style: 'sedan', L: 4.5, W: 1.72, H: 1.45, mass: 1200, power: 10, maxSpeed: 44, grip: 5.6, steer: 2.2, brake: 16, police: true, colors: [0xf2f2f2] },
  colectivo: { name: 'Colectivo', style: 'bus', L: 11, W: 2.5, H: 3.1, mass: 9000, power: 4.5, maxSpeed: 26, grip: 4, steer: 1.3, brake: 9, colors: [0xe8c020, 0x2a6ab0, 0xf2f2f2] },
  cisterna: { name: 'Camión Cisterna', style: 'tanker', L: 9, W: 2.5, H: 3.3, mass: 12000, power: 4.2, maxSpeed: 27, grip: 4, steer: 1.3, brake: 8, colors: [0x1a1a1a] },
  bmx: { name: 'BMX', style: 'bike', L: 1.7, W: 0.5, H: 1.1, mass: 90, power: 5.5, maxSpeed: 13, grip: 7, steer: 2.8, brake: 10, bike: true, colors: [0x2a8ae0, 0xe02a2a, 0x2ae05a, 0xf2f2f2] },
  enduro: { name: 'Moto Enduro', style: 'moto', L: 2.15, W: 0.75, H: 1.2, mass: 180, power: 13, maxSpeed: 44, grip: 6.5, steer: 2.6, brake: 15, bike: true, offroad: true, colors: [0xe86a1a, 0x1a8a3a, 0xe0e020, 0x2a4ab0] },
};

// ---------- Construcción de modelos ----------
const geoCache = new Map();
function buildModel(key) {
  if (!geoCache.has(key)) geoCache.set(key, buildCarModel(key, VTYPES[key]));
  return geoCache.get(key);
}
let MATS = null;
export function carMaterials() { if (!MATS) MATS = new CarMaterials(); return MATS; }

const tmpV = new THREE.Vector3();
const tmpN = new THREE.Vector3();
let VID = 1;

export class Vehicle {
  constructor(game, key, opts = {}) {
    this.game = game;
    this.id = VID++;
    this.key = key;
    this.type = VTYPES[key];
    this.type.key = key;
    this.color = opts.color !== undefined ? opts.color : pick(this.type.colors);
    this.model = buildModel(key);
    const M = carMaterials();
    this.mats = M;
    this.group = new THREE.Group();
    this.body = new THREE.Group();
    this.group.add(this.body);
    this.paintMesh = new THREE.Mesh(this.model.paint, M.paint(this.color));
    this.detMesh = new THREE.Mesh(this.model.detail, M.detail);
    this.body.add(this.paintMesh, this.detMesh);
    if (this.model.chrome) { this.chromeMesh = new THREE.Mesh(this.model.chrome, M.chrome); this.body.add(this.chromeMesh); }
    if (this.model.glass) {
      this.glassMesh = new THREE.Mesh(this.model.glass, M.glass);
      this.glassMesh.renderOrder = 5;
      this.body.add(this.glassMesh);
    }
    for (const m of [this.paintMesh, this.detMesh, this.chromeMesh]) if (m) { m.castShadow = true; m.receiveShadow = true; }
    this.wheels = this.model.wheels.map(([x, y, z]) => {
      const w = new THREE.Mesh(this.model.wheel, M.wheel);
      w.castShadow = true;
      w.position.set(x, y, z);
      w.rotation.order = 'YXZ';
      this.group.add(w);
      return w;
    });
    // sombra
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(this.type.W + 0.8, this.type.L + 0.8), new THREE.MeshBasicMaterial({ map: game.textures.shadow, transparent: true, depthWrite: false, opacity: game.renderer.shadowMap.enabled ? 0.55 : 0.9 }));
    sh.rotation.x = -Math.PI / 2;
    sh.position.y = 0.06;
    sh.renderOrder = 4;
    this.shadow = sh;
    this.group.add(sh);
    if (this.type.police) {
      this.sirenR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.16, 0.25), new THREE.MeshBasicMaterial({ color: 0x400000 }));
      this.sirenB = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.16, 0.25), new THREE.MeshBasicMaterial({ color: 0x000040 }));
      this.sirenR.position.set(0.3, this.type.H + 0.16, this.model.roofZ);
      this.sirenB.position.set(-0.3, this.type.H + 0.16, this.model.roofZ);
      this.body.add(this.sirenR, this.sirenB);
    }
    this.pos = new THREE.Vector3(opts.x || 0, 0, opts.z || 0);
    this.heading = opts.rot || 0;
    this.vx = 0; this.vz = 0; this.vy = 0; this.angVel = 0;
    this.pitch = 0; this.roll = 0; this.susp = 0;
    this.pos.y = game.terrain.groundAt(this.pos.x, this.pos.z);
    this.grounded = true;
    this.health = opts.health || 1000;
    this.fireT = 0;
    this.dead = false;
    this.sinking = 0;
    this.ctrl = { throttle: 0, steer: 0, brake: 0, handbrake: false };
    this.driver = null;
    this.seats = new Array(this.model.seats.length).fill(null);
    this.siren = false;
    this.sirenT = 0;
    this.wheelSpin = 0;
    this.airTime = 0;
    this.maxAir = 0;
    this.lastImpact = 0;
    this.parked = !!opts.parked;
    this.locked = false;
    this.persistent = !!opts.persistent;
    this.stolenBy = null;
    this.radio = Math.floor(Math.random() * 5);
    this.smokeT = 0;
    this.lean = 0;
    this.hornT = 0;
    this.group.position.copy(this.pos);
    this.group.rotation.order = 'YXZ';
    game.scene.add(this.group);
    this.updateVisual(0);
  }

  setColor(c) {
    this.color = c;
    if (!this.dead) this.paintMesh.material = this.mats.paint(c);
  }

  get speed() { return Math.hypot(this.vx, this.vz); }
  get fwd() { return { x: Math.sin(this.heading), z: Math.cos(this.heading) }; }
  get forwardSpeed() { return this.vx * Math.sin(this.heading) + this.vz * Math.cos(this.heading); }

  obb() {
    return { x: this.pos.x, z: this.pos.z, fx: Math.sin(this.heading), fz: Math.cos(this.heading), hl: this.type.L / 2, hw: this.type.W / 2, y: this.pos.y, h: this.type.H };
  }

  // Posición de una puerta (lado izquierdo = conductor en la Argentina)
  doorPos(seat = 0) {
    const s = this.model.seats[seat] || [0.4, 0, 0];
    const side = s[0] >= 0 ? 1 : -1;
    const f = this.fwd;
    const lx = f.z, lz = -f.x; // izquierda
    const off = this.type.W / 2 + 0.55;
    return { x: this.pos.x + lx * off * side + f.x * s[2], z: this.pos.z + lz * off * side + f.z * s[2] };
  }

  seatWorld(seat, out = new THREE.Vector3()) {
    const s = this.model.seats[seat] || [0, 0.5, 0];
    out.set(s[0], s[1], s[2]);
    out.applyEuler(this.group.rotation);
    return out.add(this.group.position);
  }

  damage(amount, cause = null) {
    if (this.dead) return;
    this.health -= amount;
    if (cause) this.lastDamageBy = cause;
    if (this.health <= 0 && this.fireT === 0) this.fireT = 0.001;
  }

  explode() {
    if (this.dead) return;
    this.dead = true;
    this.health = 0;
    this.paintMesh.material = this.mats.burnt;
    this.detMesh.material = this.mats.burnt;
    if (this.chromeMesh) this.chromeMesh.material = this.mats.burnt;
    if (this.glassMesh) this.glassMesh.visible = false;
    this.vy = 6;
    this.angVel += rand(-2, 2);
    this.game.effects && this.game.effects.explosion(this.pos.x, this.pos.y + 1, this.pos.z, this.lastDamageBy);
    this.siren = false;
    this.deadT = 0;
  }

  update(dt) {
    const g = this.game;
    const T = this.type;
    const terrain = g.terrain;
    const c = this.ctrl;
    const sin = Math.sin(this.heading), cos = Math.cos(this.heading);
    let vF = this.vx * sin + this.vz * cos;
    let vL = this.vx * cos - this.vz * sin; // componente hacia la izquierda
    const ground = terrain.groundAt(this.pos.x, this.pos.z);
    const inWater = ground < -0.8 && this.pos.y < 0.3;
    const surf = g.roads.surfaceAt(this.pos.x, this.pos.z);
    const offroad = surf === 0 || surf === 2;
    const engineOk = !this.dead && this.sinking < 1 && (this.driver || this.aiDriving);
    this.grounded = this.pos.y <= ground + 0.25;

    if (this.grounded && !inWater) {
      // motor / freno
      const thr = engineOk ? c.throttle : 0;
      const offPen = offroad ? (T.offroad ? 0.1 : 0.45) : 0;
      if (thr > 0.05) {
        if (vF < -0.5) vF = approach(vF, 0, T.brake * dt * thr);
        else {
          const r = clamp(vF / (T.maxSpeed * (1 - offPen * 0.5)), 0, 1);
          vF += T.power * thr * (1 - r * r) * (1 - offPen * 0.4) * dt;
        }
      } else if (thr < -0.05) {
        if (vF > 0.5) vF = approach(vF, 0, T.brake * dt * -thr);
        else if (vF > -T.maxSpeed * 0.3) vF += T.power * 0.55 * thr * dt;
      }
      if (c.brake > 0) vF = approach(vF, 0, T.brake * c.brake * dt);
      // resistencia
      vF -= vF * (0.08 + offPen * 0.9 + (thr === 0 ? 0.25 : 0)) * dt;
      // pendiente
      terrain.normalAt(this.pos.x, this.pos.z, tmpN);
      vF += 9.8 * (tmpN.x * sin + tmpN.z * cos) * dt;
      // sin nadie al volante: freno de mano puesto (en las lomas de Comodoro no se va solo)
      if (!this.driver && !this.aiDriving && !this.dead && Math.abs(vF) < 4) { vF = approach(vF, 0, 14 * dt); vL *= Math.exp(-6 * dt); }
      // agarre lateral
      let grip = T.grip * (offroad && !T.offroad ? 0.7 : 1);
      if (c.handbrake) { grip *= 0.22; vF = approach(vF, 0, 5 * dt); }
      vL *= Math.exp(-grip * dt);
      // dirección
      const sp = Math.abs(vF);
      const steerAmt = c.steer * T.steer * clamp(sp / 5, 0, 1) * (1 / (1 + sp * 0.022)) * Math.sign(vF || 1) * (c.handbrake ? 1.45 : 1);
      this.angVel = lerp(this.angVel, steerAmt, 1 - Math.exp(-9 * dt));
    } else if (inWater) {
      vF *= Math.exp(-2.5 * dt); vL *= Math.exp(-2.5 * dt);
      this.angVel *= Math.exp(-2 * dt);
      this.sinking += dt;
    } else {
      // en el aire
      this.angVel *= Math.exp(-0.8 * dt);
      if (T.bike) this.angVel += c.steer * 1.5 * dt;
    }
    this.heading = angleWrap(this.heading + this.angVel * dt);
    this.vx = sin * vF + cos * vL;
    this.vz = cos * vF - sin * vL;

    // viento lateral (vehículos altos y motos)
    if (g.env && this.grounded) {
      const push = g.env.windSpeed * g.env.windSpeed * 0.0009 * (T.style === 'bus' || T.style === 'tanker' ? 1.2 : T.bike ? 0.9 : 0.35);
      this.vx += g.env.windDir.x * push * dt;
      this.vz += g.env.windDir.y * push * dt;
    }

    // integrar posición
    const prevY = this.pos.y;
    this.pos.x += this.vx * dt;
    this.pos.z += this.vz * dt;
    const gNew = terrain.groundAt(this.pos.x, this.pos.z);
    this.vy -= 22 * dt;
    this.pos.y += this.vy * dt;
    if (inWater) {
      this.pos.y = Math.max(gNew, Math.min(this.pos.y, 0.2 - Math.min(3, this.sinking * 0.7)));
      this.vy = 0;
    } else if (this.pos.y <= gNew) {
      const landing = -this.vy;
      if (this.airTime > 0.25 && landing > 8) {
        this.damage((landing - 8) * 25);
        this.susp = -0.25;
        g.audio && g.audio.thud(this.pos, 0.6);
      }
      this.pos.y = gNew;
      const rise = (gNew - prevY) / Math.max(dt, 1e-3);
      this.vy = clamp(rise, 0, 14);
      if (this.airTime > 0.4) this.lastAir = this.airTime;
      this.airTime = 0;
    } else {
      this.airTime += dt;
      this.maxAir = Math.max(this.maxAir, this.airTime);
    }

    // colisiones con el mundo
    const o = this.obb();
    const hit = g.colliders.resolveOBB(o);
    if (hit) {
      this.pos.x = o.x; this.pos.z = o.z;
      const vn = this.vx * hit.nx + this.vz * hit.nz;
      if (vn < 0) {
        const impact = -vn;
        this.vx -= hit.nx * vn * 1.25;
        this.vz -= hit.nz * vn * 1.25;
        this.vx *= 0.85; this.vz *= 0.85;
        this.angVel += (Math.random() - 0.5) * impact * 0.12;
        if (impact > 3.5) {
          this.damage((impact - 3.5) ** 1.35 * 9);
          this.lastImpact = impact;
          g.audio && g.audio.crash(this.pos, clamp(impact / 20, 0.2, 1));
          if (g.effects && impact > 6) g.effects.sparks(this.pos.x + hit.nx * -o.hl * 0.5, this.pos.y + 0.6, this.pos.z - hit.nz * o.hl * 0.5, 6);
          this.onImpact && this.onImpact(impact, hit);
        }
      }
    }
    // límites del mundo
    const W = g.worldBounds;
    if (W && W.clamp(this.pos, 5)) { this.vx *= -0.3; this.vz *= -0.3; }

    // fuego y explosión
    if (this.fireT > 0 && !this.dead) {
      this.fireT += dt;
      if (g.effects && Math.random() < dt * 30) g.effects.fire(this.pos.x + (Math.random() - 0.5), this.pos.y + this.type.H * 0.7, this.pos.z + this.fwd.z * this.type.L * 0.3);
      if (this.fireT > 4.5) this.explode();
    }
    if (!this.dead && g.effects) {
      this.smokeT -= dt;
      if (this.health < 420 && this.smokeT <= 0) {
        this.smokeT = this.health < 250 ? 0.05 : 0.12;
        const f = this.fwd;
        g.effects.smoke(this.pos.x + f.x * this.type.L * 0.4, this.pos.y + this.type.H * 0.7, this.pos.z + f.z * this.type.L * 0.4, this.health < 250 ? 0.15 : 0.7);
      }
    }
    if (this.dead) this.deadT += dt;

    // sirena
    if (this.type.police) {
      this.sirenT += dt;
      const on = this.siren;
      const ph = Math.floor(this.sirenT * 6) % 2;
      this.sirenR.material.color.setHex(on && ph ? 0xff2020 : 0x400000);
      this.sirenB.material.color.setHex(on && !ph ? 0x2040ff : 0x000040);
    }
    this.updateVisual(dt, vF);
  }

  updateVisual(dt, vF = 0) {
    const g = this.game;
    const T = this.type;
    this.group.position.copy(this.pos);
    // inclinación según el terreno
    if (this.grounded || !dt) {
      const f = this.fwd;
      const hl = T.L * 0.4, hw = T.W * 0.45;
      const t = g.terrain;
      const hF = t.groundAt(this.pos.x + f.x * hl, this.pos.z + f.z * hl);
      const hB = t.groundAt(this.pos.x - f.x * hl, this.pos.z - f.z * hl);
      const lx = f.z, lz = -f.x;
      const hLft = t.groundAt(this.pos.x + lx * hw, this.pos.z + lz * hw);
      const hRgt = t.groundAt(this.pos.x - lx * hw, this.pos.z - lz * hw);
      const tp = Math.atan2(hB - hF, 2 * hl);
      const tr = Math.atan2(hLft - hRgt, 2 * hw);
      const k = dt ? 1 - Math.exp(-12 * dt) : 1;
      this.pitch = lerp(this.pitch, tp, k);
      this.roll = lerp(this.roll, tr, k);
    } else {
      this.pitch = lerp(this.pitch, 0.25, dt * 0.8);
    }
    if (T.bike) {
      const target = -this.ctrl.steer * clamp(Math.abs(vF) / 10, 0, 1) * 0.45;
      this.lean = lerp(this.lean, target, dt ? 1 - Math.exp(-6 * dt) : 1);
    }
    this.susp = lerp(this.susp, 0, dt ? 1 - Math.exp(-6 * dt) : 1);
    this.group.rotation.set(this.pitch, this.heading, this.roll + (T.bike ? this.lean : 0));
    this.body.position.y = this.susp * 0.3;
    // ruedas
    this.wheelSpin += (vF / this.model.wheelR) * dt;
    this.wheels.forEach((w, i) => {
      w.rotation.x = this.wheelSpin;
      const steerable = T.bike ? i === 0 : i < 2;
      w.rotation.y = steerable ? this.ctrl.steer * 0.45 : 0;
    });
    this.shadow.visible = this.pos.y - this.game.terrain.groundAt(this.pos.x, this.pos.z) < 4;
  }

  dispose() {
    this.game.scene.remove(this.group);
    this.removed = true;
  }
}
