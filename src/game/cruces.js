import * as THREE from 'three';
import { lam } from '../render/style.js';
import { POI, META } from '../world/mapdata.js';
import { dist } from '../util.js';

// Red de caminos con nodos: qué pasa en cada esquina. Las avenidas y las rutas tienen
// semáforos (con postes de verdad en cada mano), en las demás esquinas el que viene por la
// calle más chica cede el paso, y los peatones cruzan cuando les toca.
const RANK = { ruta: 3, avenida: 2, calle: 1, tierra: 0 };
// Ciclo del semáforo (segundos): verde, amarillo y todo rojo para el eje principal, después
// lo mismo para el transversal
const G0 = 14, Y = 3, AR = 1.5, G1 = 10;
const CYCLE = G0 + Y + AR + G1 + Y + AR;

const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpP = new THREE.Vector3(), tmpS = new THREE.Vector3(1, 1, 1);
const UP = new THREE.Vector3(0, 1, 0);
const COL = {
  R: [new THREE.Color(0xff2a14), new THREE.Color(0x2a0a06)],
  Y: [new THREE.Color(0xffb014), new THREE.Color(0x2a1c06)],
  G: [new THREE.Color(0x28ff5a), new THREE.Color(0x06240e)],
};

export class Cruces {
  constructor(game) {
    this.game = game;
    this.info = new Map();
    this.signals = [];
    this.heads = [];
    this.t = 0;
    this.classify();
    this.buildProps();
  }

  // ---- Clasificar las esquinas ----
  classify() {
    const g = this.game, R = g.roads;
    const esc = Math.max(0.5, META.escala || 1);
    const sem = POI.semaforo;
    const cands = [];
    for (const n of R.nodes) {
      const es = n.edges.map((i) => R.edges[i]).filter((e) => RANK[e.kind] !== undefined);
      if (es.length < 3) continue;
      const rank = new Map();
      let maxRank = 0, big = 0, urban = false;
      for (const e of es) {
        const r = RANK[e.kind];
        rank.set(e.id, r);
        maxRank = Math.max(maxRank, r);
        if (r >= 2) big++;
        if (e.urban) urban = true;
      }
      // direcciones de salida desde la esquina
      const out = es.map((e) => {
        const o = R.nodes[R.otherNode(e, n.id)];
        const L = Math.hypot(o.x - n.x, o.z - n.z) || 1;
        return { e, x: (o.x - n.x) / L, z: (o.z - n.z) / L };
      });
      // eje principal: la calle más importante y la que sigue derecho; el resto, transversal
      out.sort((a, b) => rank.get(b.e.id) - rank.get(a.e.id) || b.e.len - a.e.len);
      const p = out[0];
      const axis = new Map();
      for (const o of out) axis.set(o.e.id, Math.abs(o.x * p.x + o.z * p.z) > 0.6 ? 0 : 1);
      const info = { id: n.id, n, x: n.x, z: n.z, rank, maxRank, axis, out, sig: false, off: 0, stop: (n.maxW || 10) / 2 + 2.5, radius: (n.maxW || 10) / 2 + 3 };
      this.info.set(n.id, info);
      // semáforo: cruces urbanos con avenida o ruta (y en el Centro, también calle con calle)
      if (!urban || es.length > 5) continue;
      if (sem && dist(n.x, n.z, sem.x, sem.z) < 4) continue; // ese lo maneja el malabarista
      if (!out.some((o) => axis.get(o.e.id) === 1)) continue;
      const zt = g.world.zoneTypeAt(n.x, n.z);
      const score = big * 2 + maxRank + (zt === 'centro' ? 2 : 0) + es.length * 0.5;
      if (big >= 1 || (zt === 'centro' && es.length >= 4)) cands.push({ info, score });
    }
    // de los más importantes a los menos, separados entre sí
    cands.sort((a, b) => b.score - a.score);
    const grid = new Map(), GS = 100;
    const minD = 85 * esc;
    for (const { info } of cands) {
      if (this.signals.length >= 450) break;
      const gi = Math.floor(info.x / GS), gj = Math.floor(info.z / GS);
      let near = false;
      for (let a = gi - 1; a <= gi + 1 && !near; a++) for (let b = gj - 1; b <= gj + 1 && !near; b++) {
        for (const o of grid.get(a * 100000 + b) || []) if (dist(o.x, o.z, info.x, info.z) < minD) { near = true; break; }
      }
      if (near) continue;
      const k = gi * 100000 + gj;
      if (!grid.has(k)) grid.set(k, []);
      grid.get(k).push(info);
      info.sig = true;
      // desfase propio para que no cambien todos juntos
      info.off = ((info.id * 2654435761) % 1000) / 1000 * CYCLE;
      this.signals.push(info);
    }
  }

  // Estado de la luz para un eje: 'G', 'Y' o 'R'
  state(info, axis) {
    const t = ((this.game.time + info.off) % CYCLE + CYCLE) % CYCLE;
    if (axis === 0) return t < G0 ? 'G' : t < G0 + Y ? 'Y' : 'R';
    const t1 = t - (G0 + Y + AR);
    return t1 >= 0 && t1 < G1 ? 'G' : t1 >= G1 && t1 < G1 + Y ? 'Y' : 'R';
  }

  // ---- Autos: velocidad máxima para llegar a la esquina nodeId por la arista e ----
  // (devuelve Infinity si puede pasar)
  limit(ai, e, nodeId, remain, speed, dt) {
    const info = this.info.get(nodeId);
    if (!info) { ai.yieldT = 0; return Infinity; }
    const stopAt = remain - info.stop;
    if (stopAt < -0.5) return Infinity; // ya está adentro del cruce: seguir
    if (info.sig) {
      const st = this.state(info, info.axis.get(e.id) || 0);
      if (st === 'G') return Infinity;
      // en amarillo frena solo si llega a frenar antes de la línea
      if (st === 'Y' && stopAt < speed * 0.9) return Infinity;
      return Math.max(0, stopAt * 0.8);
    }
    // sin semáforo: la calle principal pasa; la otra mira y cede el paso
    const r = info.rank.get(e.id) || 0;
    const minor = r < info.maxRank;
    let lim = minor ? 7 + Math.max(0, stopAt) * 0.5 : Infinity;
    if (stopAt > 16) { ai.yieldT = 0; return lim; }
    if (this.conflict(ai.v, e, info, r, minor)) {
      ai.yieldT = (ai.yieldT || 0) + dt;
      // nadie se queda trabado para siempre en una esquina
      if (ai.yieldT < 6) lim = Math.max(0, stopAt * 0.8);
    } else ai.yieldT = 0;
    return lim;
  }

  // ¿Hay alguien en el cruce, o viniendo por una calle con prioridad?
  conflict(v, e, info, r, minor) {
    const g = this.game;
    for (const o of g.vehicles) {
      if (o === v || o.removed || o.dead) continue;
      const dx = o.pos.x - info.x, dz = o.pos.z - info.z;
      if (Math.abs(dx) > 32 || Math.abs(dz) > 32) continue;
      const d = Math.hypot(dx, dz);
      const sp = o.speed;
      // adentro del cruce y moviéndose
      if (d < info.radius && sp > 1.2) {
        // el que viene detrás por la misma calle no cuenta
        if (o.ai && o.ai.edge === e && o.ai.to === info.id) continue;
        return true;
      }
      if (!minor || sp < 3 || d > 30) continue;
      // acercándose a la esquina por otra calle
      if ((-dx * o.vx - dz * o.vz) / (d * sp) < 0.75) continue;
      const oe = o.ai && o.ai.edge;
      if (oe === e) continue;
      const or = oe ? info.rank.get(oe.id) : undefined;
      if (or === undefined || or > r || (o.driver && o.driver.isPlayer)) return true;
    }
    return false;
  }

  // ---- Peatones: ¿se puede cruzar la calle e en la esquina nodeId? ----
  canCross(e, nodeId) {
    const info = this.info.get(nodeId);
    const N = this.game.roads.nodes[nodeId];
    if (info && info.sig) {
      // cruzan cuando los autos de esa calle tienen rojo
      return this.state(info, info.axis.get(e.id) || 0) === 'R';
    }
    // sin semáforo: que no venga nadie cerca por esa calle
    for (const o of this.game.vehicles) {
      if (o.removed || o.speed < 2) continue;
      const dx = o.pos.x - N.x, dz = o.pos.z - N.z;
      if (Math.abs(dx) > 26 || Math.abs(dz) > 26) continue;
      const d = Math.hypot(dx, dz) || 1;
      if ((-dx * o.vx - dz * o.vz) / (d * o.speed) > 0.5 || d < 8) return false;
    }
    return true;
  }

  // ---- Semáforos visibles: un poste por mano en cada cruce con semáforo ----
  buildProps() {
    const g = this.game, R = g.roads, T = g.terrain;
    const heads = [];
    for (const info of this.signals) {
      const N = info.n;
      for (const o of info.out) {
        if (o.e.kind === 'peatonal') continue;
        // a la derecha de los que llegan a la esquina por esta calle, antes del cruce
        const rx = o.z, rz = -o.x;
        const back = (N.maxW || 10) / 2 + 1.6, side = o.e.width / 2 + 0.9;
        const x = N.x + o.x * back + rx * side, z = N.z + o.z * back + rz * side;
        heads.push({ info, axis: info.axis.get(o.e.id) || 0, x, z, y: T.heightAt(x, z) + 0.2, rot: Math.atan2(o.x, o.z), st: '' });
        g.colliders.addCircle(x, z, 0.2, T.heightAt(x, z) - 1, T.heightAt(x, z) + 4.3, 'semaforo');
      }
    }
    this.heads = heads;
    if (!heads.length) return;
    // poste + caja (una sola geometría instanciada)
    const pole = new THREE.BoxGeometry(0.18, 3.25, 0.18).translate(0, 1.62, 0);
    const box = new THREE.BoxGeometry(0.5, 1.15, 0.36).translate(0, 3.78, 0);
    const visor = new THREE.BoxGeometry(0.42, 0.06, 0.16).translate(0, 4.15, 0.24);
    const geo = mergeGeos([pole, box, visor]);
    this.poles = new THREE.InstancedMesh(geo, lam({ color: 0x2a2c2a }), heads.length);
    // lámparas: tres por caja, del lado que mira a los autos
    const lamp = new THREE.CircleGeometry(0.15, 10).translate(0, 0, 0.185);
    this.lamps = new THREE.InstancedMesh(lamp, new THREE.MeshBasicMaterial({ color: 0xffffff, fog: true }), heads.length * 3);
    heads.forEach((h, i) => {
      tmpQ.setFromAxisAngle(UP, h.rot);
      tmpP.set(h.x, h.y, h.z);
      tmpM.compose(tmpP, tmpQ, tmpS);
      this.poles.setMatrixAt(i, tmpM);
      for (let k = 0; k < 3; k++) {
        tmpP.set(0, 4.13 - k * 0.36, 0).applyQuaternion(tmpQ).add(new THREE.Vector3(h.x, h.y, h.z));
        tmpM.compose(tmpP, tmpQ, tmpS);
        this.lamps.setMatrixAt(i * 3 + k, tmpM);
        this.lamps.setColorAt(i * 3 + k, COL.R[1]);
      }
    });
    for (const m of [this.poles, this.lamps]) { m.frustumCulled = false; m.userData.noCull = true; g.scene.add(m); }
    this.poles.castShadow = false;
    void R;
  }

  update(dt) {
    this.t -= dt;
    if (this.t > 0 || !this.lamps) return;
    this.t = 0.2;
    const cam = this.game.camera.position;
    let changed = false;
    for (let i = 0; i < this.heads.length; i++) {
      const h = this.heads[i];
      if (Math.abs(h.x - cam.x) > 500 || Math.abs(h.z - cam.z) > 500) continue;
      const st = this.state(h.info, h.axis);
      if (st === h.st) continue;
      h.st = st;
      this.lamps.setColorAt(i * 3, COL.R[st === 'R' ? 0 : 1]);
      this.lamps.setColorAt(i * 3 + 1, COL.Y[st === 'Y' ? 0 : 1]);
      this.lamps.setColorAt(i * 3 + 2, COL.G[st === 'G' ? 0 : 1]);
      changed = true;
    }
    if (changed) this.lamps.instanceColor.needsUpdate = true;
  }
}

function mergeGeos(list) {
  let n = 0, ni = 0;
  for (const g of list) { n += g.attributes.position.count; ni += g.index.count; }
  const pos = new Float32Array(n * 3), nrm = new Float32Array(n * 3), idx = new Uint16Array(ni);
  let o = 0, oi = 0;
  for (const g of list) {
    pos.set(g.attributes.position.array, o * 3);
    nrm.set(g.attributes.normal.array, o * 3);
    for (let k = 0; k < g.index.count; k++) idx[oi + k] = g.index.array[k] + o;
    o += g.attributes.position.count; oi += g.index.count;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
  geo.setIndex(new THREE.BufferAttribute(idx, 1));
  return geo;
}
