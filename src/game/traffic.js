import { rand, pick, chance, clamp, angleDiff, dist } from '../util.js';
import { POI } from '../world/mapdata.js';
import { randomLook } from '../entities/humanoid.js';

// Conductor artificial: sigue la red de calles por la mano derecha
export class DriverAI {
  constructor(game, v, mode = 'cruise', opts = {}) {
    this.game = game;
    this.v = v;
    this.mode = mode;
    this.target = opts.target || null;
    this.dest = opts.dest || null;
    this.path = null;
    this.speedMul = opts.speedMul || 1;
    this.aggressive = !!opts.aggressive;
    this.reverseT = 0;
    this.stuckT = 0;
    this.honkT = 0;
    this.replanT = 0;
    this.offroadOK = v.type.offroad;
    this.laneFrac = 0.25;
    this.placeOnRoad();
  }

  placeOnRoad() {
    const R = this.game.roads;
    const n = R.nearestEdge(this.v.pos.x, this.v.pos.z, 60);
    if (!n) { this.edge = null; return; }
    const e = n.edge;
    // elegir sentido según el rumbo actual
    const f = this.v.fwd;
    const dot = f.x * e.dx + f.z * e.dz;
    if (dot >= 0) { this.from = e.a; this.to = e.b; } else { this.from = e.b; this.to = e.a; }
    this.edge = e;
    this.next = null;
  }

  pickNext(atNode, fromEdge) {
    const R = this.game.roads;
    const node = R.nodes[atNode];
    let opts = node.edges.map((i) => R.edges[i]).filter((e) => e !== fromEdge && e.kind !== 'muelle' && (e.kind !== 'tierra' || this.offroadOK || this.mode !== 'cruise'));
    if (this.mode === 'route' && this.path && this.path.length) {
      const want = this.path[0];
      const e = node.edges.map((i) => R.edges[i]).find((ee) => R.otherNode(ee, atNode) === want);
      if (e) return e;
    }
    if (this.mode === 'flee' && this.target) {
      // alejarse del perseguidor
      const tp = this.target.pos;
      opts.sort((a, b) => {
        const na = R.nodes[R.otherNode(a, atNode)], nb = R.nodes[R.otherNode(b, atNode)];
        return dist(nb.x, nb.z, tp.x, tp.z) - dist(na.x, na.z, tp.x, tp.z);
      });
      if (opts.length > 1 && chance(0.25)) return opts[1];
      return opts[0] || fromEdge;
    }
    if (!opts.length) return fromEdge; // calle sin salida: pegar la vuelta
    // preferir seguir derecho
    const prev = fromEdge ? { x: R.nodes[atNode].x - R.nodes[R.otherNode(fromEdge, atNode)].x, z: R.nodes[atNode].z - R.nodes[R.otherNode(fromEdge, atNode)].z } : null;
    if (prev && chance(0.55)) {
      let best = null, bd = -2;
      const L = Math.hypot(prev.x, prev.z) || 1;
      for (const e of opts) {
        const o = R.nodes[R.otherNode(e, atNode)];
        const dx = o.x - node.x, dz = o.z - node.z, l = Math.hypot(dx, dz) || 1;
        const dt = (dx * prev.x + dz * prev.z) / (l * L);
        if (dt > bd) { bd = dt; best = e; }
      }
      if (best) return best;
    }
    return pick(opts);
  }

  planRoute(x, z) {
    const R = this.game.roads;
    if (!this.edge) this.placeOnRoad();
    if (!this.edge) return;
    const goal = R.nearestNode(x, z);
    const path = R.path(this.to, goal);
    if (path) { this.path = path.slice(1); this.mode = this.mode === 'chase' ? 'chase' : 'route'; }
    this.goal = { x, z };
  }

  laneOffset(e) {
    return e.width * this.laneFrac + (e.width > 13 ? 0.5 : 0);
  }

  update(dt) {
    const v = this.v;
    const g = this.game;
    if (v.dead || !v.driver || v.driver.isPlayer) return;
    const R = g.roads;
    const c = v.ctrl;
    const speed = v.speed;
    const vF = v.forwardSpeed;
    if (!this.edge) { this.placeOnRoad(); if (!this.edge) { c.throttle = 0; return; } }

    // reversa para desatascarse
    if (this.reverseT > 0) {
      this.reverseT -= dt;
      c.throttle = -0.8; c.steer = this.revSteer; c.handbrake = false;
      return;
    }

    let tx, tz, desired;
    const e = this.edge;
    const A = R.nodes[this.from], B = R.nodes[this.to];
    const dx = (B.x - A.x) / e.len, dz = (B.z - A.z) / e.len;
    const rx = -dz, rz = dx; // derecha
    const lane = this.laneOffset(e);
    // proyección sobre la arista
    const s = (v.pos.x - A.x) * dx + (v.pos.z - A.z) * dz;
    const remain = e.len - s;
    const direct = (this.mode === 'chase' || this.mode === 'goto') && this.target && this.directChase();
    if (direct) {
      const tp = this.targetPos();
      tx = tp.x; tz = tp.z;
      desired = v.type.maxSpeed * 0.95 * this.speedMul;
      const dd = dist(v.pos.x, v.pos.z, tx, tz);
      if (this.mode === 'goto' && dd < 6) desired = 0;
      if (this.ram === false && dd < 12) desired = Math.min(desired, 8);
    } else {
      // pasar a la siguiente arista
      if (remain < Math.max(3, speed * 0.25)) {
        const nxt = this.next || this.pickNext(this.to, e);
        this.from = this.to;
        this.to = R.otherNode(nxt, this.from);
        this.edge = nxt;
        this.next = null;
        if (this.path && this.path.length && this.path[0] === this.to) this.path.shift();
        else if (this.path && this.path.length && this.path[0] === this.from) this.path.shift();
        return;
      }
      if (!this.next && remain < 30) this.next = this.pickNext(this.to, e);
      const look = 5 + speed * 0.7;
      if (look < remain || !this.next) {
        const t = Math.min(e.len, s + look);
        tx = A.x + dx * t + rx * lane; tz = A.z + dz * t + rz * lane;
      } else {
        const n = this.next;
        const C = R.nodes[R.otherNode(n, this.to)];
        const L2 = n.len;
        const dx2 = (C.x - B.x) / L2, dz2 = (C.z - B.z) / L2;
        const over = Math.min(L2, look - remain);
        const lane2 = this.laneOffset(n);
        tx = B.x + dx2 * over + -dz2 * lane2; tz = B.z + dz2 * over + dx2 * lane2;
      }
      const limit = { ruta: 21, avenida: 15, calle: 11.5, tierra: 13, muelle: 6 }[e.kind] || 12;
      desired = limit * this.speedMul * (this.mode === 'chase' || this.mode === 'flee' ? 1.9 : 1);
      // frenar antes de doblar
      if (this.next && remain < 25) {
        const C = R.nodes[R.otherNode(this.next, this.to)];
        const ex = C.x - B.x, ez = C.z - B.z, el = Math.hypot(ex, ez) || 1;
        const turn = 1 - (ex * dx + ez * dz) / el;
        if (turn > 0.3) desired = Math.min(desired, lerpN(desired, 7, clamp(turn, 0, 1)));
        if (this.next === e) desired = Math.min(desired, 4);
      }
      // semáforo de San Martín y Rivadavia
      const tl = g.activities && g.activities.trafficLight;
      if (tl && this.mode === 'cruise') {
        const dn = dist(B.x, B.z, POI.semaforo.x, POI.semaforo.z);
        if (dn < 3 && remain < 22 && remain > 6) {
          const nsAxis = Math.abs(dz) > Math.abs(dx);
          const red = nsAxis ? tl.state !== 'NS' : tl.state !== 'EW';
          if (red) desired = Math.min(desired, Math.max(0, (remain - 9) * 0.8));
        }
      }
    }
    // obstáculos adelante
    const f = v.fwd;
    const check = 4 + Math.max(0, vF) * 1.1 + v.type.L / 2;
    let block = null, bd = check;
    for (const o of g.vehicles) {
      if (o === v || o.removed) continue;
      const ox = o.pos.x - v.pos.x, oz = o.pos.z - v.pos.z;
      const fwd = ox * f.x + oz * f.z;
      if (fwd <= 0 || fwd > bd + o.type.L / 2) continue;
      const lat = Math.abs(ox * f.z - oz * f.x);
      if (lat > (v.type.W + o.type.W) / 2 + 0.05) continue;
      if (this.mode === 'chase' && this.target && (o === this.target || o === this.target.vehicle)) continue;
      bd = fwd - o.type.L / 2; block = o;
    }
    if (this.mode === 'cruise') {
      for (const p of g.peds) {
        if (p.vehicle || p.dead || p.removed || p.hidden) continue;
        const ox = p.pos.x - v.pos.x, oz = p.pos.z - v.pos.z;
        const fwd = ox * f.x + oz * f.z;
        if (fwd <= 0 || fwd > bd) continue;
        const lat = Math.abs(ox * f.z - oz * f.x);
        if (lat > v.type.W / 2 + 0.6) continue;
        bd = fwd; block = p;
      }
    }
    if (block && !(this.aggressive && block === this.target)) {
      const stopD = bd - 2.5;
      desired = Math.min(desired, Math.max(0, stopD * 0.9));
      if (block === g.player || block === g.player.vehicle) {
        this.honkT -= dt;
        if (this.honkT <= 0 && speed < 2) { this.honkT = rand(2, 5); if (dist(v.pos.x, v.pos.z, g.camera.position.x, g.camera.position.z) < 50) g.audio.tone({ freq: 420, dur: 0.35, type: 'square', gain: 0.08, pos: v.pos }); }
      }
    }
    // dirección
    const ta = Math.atan2(tx - v.pos.x, tz - v.pos.z);
    let diff = angleDiff(v.heading, ta);
    if (vF < -0.5) diff = -diff;
    c.steer = clamp(diff * 2.2, -1, 1);
    const err = desired - vF;
    c.throttle = clamp(err * 0.35, -1, 1);
    if (desired < 0.5 && vF < 1) { c.throttle = 0; c.brake = 1; } else c.brake = 0;
    c.handbrake = this.mode === 'chase' && Math.abs(diff) > 1.2 && speed > 12;
    // atascado (o bloqueado mucho tiempo persiguiendo)
    const wantsToMove = this.mode !== 'cruise' ? desired > 3 || (block && block !== this.target) : c.throttle > 0.3 && !block;
    this.blockT = block && speed < 0.8 ? (this.blockT || 0) + dt : 0;
    if ((wantsToMove && speed < 0.8) || this.blockT > (this.mode === 'cruise' ? 8 : 2.5)) {
      this.stuckT += dt;
      if (this.blockT > 2.5) this.stuckT += dt;
      if (this.stuckT > 1.2) { this.reverseT = rand(0.8, 1.4); this.revSteer = -Math.sign(diff || 1); this.stuckT = 0; this.placeOnRoad(); }
    } else this.stuckT = Math.max(0, this.stuckT - dt);
    this.totalStuck = speed < 0.5 ? (this.totalStuck || 0) + dt : 0;
  }

  targetPos() {
    const t = this.target;
    if (!t) return this.goal || this.v.pos;
    if (t.vehicle) return t.vehicle.pos;
    return t.pos || t;
  }

  directChase() {
    const tp = this.targetPos();
    const v = this.v;
    const d = dist(v.pos.x, v.pos.z, tp.x, tp.z);
    if (d < 45) {
      // ir directo solo si no hay edificios en el medio
      this.losT = (this.losT || 0) - 1 / 30;
      if (this.losT <= 0) {
        this.losT = 0.3;
        const dx = tp.x - v.pos.x, dz = tp.z - v.pos.z, L = Math.hypot(dx, dz) || 1;
        this.los = !this.game.colliders.raycast(v.pos.x, v.pos.y + 1, v.pos.z, dx / L, 0, dz / L, Math.max(0, L - 2));
      }
      if (this.los || d < 8) return true;
    }
    // si el objetivo está lejos de las calles, ir directo
    if (this.game.roads.surfaceAt(tp.x, tp.z) === 0 && d < 120) return true;
    this.replanT -= 1 / 60;
    if (this.replanT <= 0 || !this.path) { this.replanT = 3; this.planRoute(tp.x, tp.z); }
    return false;
  }
}

function lerpN(a, b, t) { return a + (b - a) * t; }

const ZONE_CARS = {
  centro: ['reno12', 'reno12', 'pijo504', 'remis', 'remis', 'gool', 'duna', 'falcon', 'fitito', 'jilux', 'colectivo'],
  barrio: ['reno12', 'falcon', 'fitito', 'duna', 'pijo504', 'gool', 'f100', 'reno12'],
  km: ['empresa', 'empresa', 'jilux', 'f100', 'reno12', 'falcon', 'empresa'],
  rada: ['jilux', 'gool', 'jilux', 'pijo504', 'enduro'],
  ruta: ['empresa', 'jilux', 'f100', 'reno12', 'falcon', 'cisterna', 'colectivo', 'pijo504'],
  tierra: ['empresa', 'empresa', 'jilux', 'f100', 'enduro'],
};

export class Traffic {
  constructor(game) {
    this.game = game;
    this.cars = [];
    this.parked = [];
    this.max = 16;
    this.maxParked = 14;
    this.spawnT = 0;
    this.enabled = true;
    this.density = 1;
  }

  zoneKind(x, z, e) {
    if (e && e.kind === 'tierra') return 'tierra';
    const zt = this.game.world.zoneTypeAt(x, z);
    if (zt === 'centro') return 'centro';
    if (zt === 'km' || zt === 'industrial' || zt === 'meseta') return 'km';
    if (zt === 'rada') return 'rada';
    if (zt === 'barrio' || zt === 'viviendas') return 'barrio';
    return e && e.kind === 'ruta' ? 'ruta' : 'barrio';
  }

  update(dt) {
    const g = this.game;
    const p = g.player;
    const pp = p.vehicle ? p.vehicle.pos : p.pos;
    // IA
    for (const v of this.cars) if (v.ai && !v.removed) v.ai.update(dt);
    // limpiar
    this.cars = this.cars.filter((v) => {
      if (v.removed) return false;
      const d = dist(v.pos.x, v.pos.z, pp.x, pp.z);
      const owned = v.driver && v.driver.isPlayer || v.persistent || v.missionOwned || v === g.lastPlayerVehicle;
      if (owned) return !(v.driver && v.driver.isPlayer) ? true : false;
      if (d > 300 || (v.dead && v.deadT > 25 && d > 60) || (v.ai && v.ai.totalStuck > 40 && d > 50) || (!v.driver && !v.parked && d > 120)) {
        g.removeVehicle(v);
        return false;
      }
      return true;
    });
    this.parked = this.parked.filter((v) => {
      if (v.removed) return false;
      if (v.driver) return false;
      const d = dist(v.pos.x, v.pos.z, pp.x, pp.z);
      if (d > 230 && v !== g.lastPlayerVehicle && !v.missionOwned && !v.persistent) { g.removeVehicle(v); return false; }
      return true;
    });
    // autos abandonados (por ejemplo, los que dejó el jugador)
    this.orphanT = (this.orphanT || 0) - dt;
    if (this.orphanT <= 0) {
      this.orphanT = 2;
      for (const v of [...g.vehicles]) {
        if (v.persistent || v.missionOwned || v.driver || v === g.lastPlayerVehicle) continue;
        if (this.cars.includes(v) || this.parked.includes(v)) continue;
        if (dist(v.pos.x, v.pos.z, pp.x, pp.z) > 250) g.removeVehicle(v);
      }
    }
    if (!this.enabled) return;
    this.spawnT -= dt;
    if (this.spawnT > 0) return;
    this.spawnT = 0.35;
    const moving = this.cars.filter((v) => v.ai).length;
    if (moving < this.max * this.density) this.spawnMoving(pp);
    if (this.parked.length < this.maxParked * this.density) this.spawnParked(pp);
  }

  randomRoadPoint(pp, rMin, rMax) {
    const R = this.game.roads;
    for (let k = 0; k < 8; k++) {
      const a = rand(0, Math.PI * 2), r = rand(rMin, rMax);
      const x = pp.x + Math.cos(a) * r, z = pp.z + Math.sin(a) * r;
      const n = R.nearestEdge(x, z, 40);
      if (!n || n.edge.kind === 'muelle' || n.edge.kind === 'peatonal') continue;
      // fuera de la vista de la cámara si está cerca
      const cam = this.game.camera;
      const cx = n.x - cam.position.x, cz = n.z - cam.position.z;
      const cd = Math.hypot(cx, cz);
      const fwd = this.game.cameraRig.forward();
      if (cd < 130 && (cx * fwd.x + cz * fwd.z) / cd > 0.3) continue;
      return n;
    }
    return null;
  }

  spawnMoving(pp) {
    const g = this.game;
    const n = this.randomRoadPoint(pp, 80, 210);
    if (!n) return;
    const e = n.edge;
    const zk = this.zoneKind(n.x, n.z, e);
    let key = pick(ZONE_CARS[zk] || ZONE_CARS.barrio);
    if (chance(0.06)) key = 'patrullero';
    if ((key === 'colectivo' || key === 'cisterna') && e.width < 11) key = 'reno12';
    if (e.kind === 'tierra' && !['empresa', 'jilux', 'f100', 'enduro'].includes(key)) key = 'empresa';
    const R = g.roads;
    const fwd = chance(0.5);
    const A = R.nodes[fwd ? e.a : e.b], B = R.nodes[fwd ? e.b : e.a];
    const dx = (B.x - A.x) / e.len, dz = (B.z - A.z) / e.len;
    const lane = e.width * 0.25;
    const x = n.x - dz * lane, z = n.z + dx * lane;
    // no superponer
    for (const o of g.vehicles) if (dist(o.pos.x, o.pos.z, x, z) < 8) return;
    const v = g.spawnVehicle(key, x, z, Math.atan2(dx, dz));
    const kind = key === 'patrullero' ? 'cana' : key === 'empresa' || key === 'cisterna' ? 'petrolero' : 'civil';
    const drv = g.spawnPed(kind, x, z, { look: randomLook(kind) });
    drv.enterVehicle(v, 0);
    drv.brain = null;
    v.ai = new DriverAI(g, v, 'cruise', { speedMul: rand(0.8, 1.1) });
    v.vx = dx * 8; v.vz = dz * 8;
    if (key === 'patrullero') { v.isCopCar = true; g.police.registerPatrol(v); }
    this.cars.push(v);
  }

  spawnParked(pp) {
    const g = this.game;
    const n = this.randomRoadPoint(pp, 40, 150);
    if (!n) return;
    const e = n.edge;
    if (e.kind === 'ruta' || e.kind === 'tierra' || e.kind === 'muelle' || e.kind === 'peatonal') return;
    const R = g.roads;
    const A = R.nodes[e.a], B = R.nodes[e.b];
    // no estacionar en las esquinas
    const t = n.t * e.len;
    if (t < 12 || e.len - t < 12) return;
    const side = chance(0.5) ? 1 : -1;
    const off = e.width / 2 - 0.65;
    const x = n.x - e.dz * off * side, z = n.z + e.dx * off * side;
    for (const o of g.vehicles) if (dist(o.pos.x, o.pos.z, x, z) < 7) return;
    const zk = this.zoneKind(x, z, e);
    let key = pick(ZONE_CARS[zk] || ZONE_CARS.barrio);
    if (key === 'colectivo' || key === 'cisterna') key = 'falcon';
    if (chance(0.08)) key = 'bmx';
    const rot = Math.atan2(e.dx, e.dz) + (side > 0 ? 0 : Math.PI);
    const v = g.spawnVehicle(key, x, z, rot, { parked: true });
    this.parked.push(v);
    void A; void B;
  }

  clearAround(pos, r) {
    for (const v of [...this.cars, ...this.parked]) {
      if (v.persistent || v.missionOwned || (v.driver && v.driver.isPlayer)) continue;
      if (dist(v.pos.x, v.pos.z, pos.x, pos.z) < r) this.game.removeVehicle(v);
    }
  }
}
