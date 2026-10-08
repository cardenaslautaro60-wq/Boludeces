import * as THREE from 'three';
import { lam, STYLE } from '../render/style.js';
import { META, MAP, FRAME as F, toAB } from './mapdata.js';
import { pointSegDist, dist, clamp, RNG } from '../util.js';
import { LeanChunks } from './geom.js';

// Pendiente máxima (metros por metro) de cada tipo de calle
const GRADE = { ruta: 0.07, avenida: 0.11, calle: 0.14, tierra: 0.2, peatonal: 0.14 };

// Red vial real de Comodoro (OpenStreetMap): nodos y aristas rectas entre nodos.
// Los nodos de grado 2 son solo de forma (curvas); los de grado 3+ son cruces.
export class RoadNetwork {
  constructor() {
    this.nodes = []; // {x,z,edges:[], h}
    this.edges = []; // {a,b,width,kind,name,len,dx,dz}
    this.build();
  }

  build() {
    const N = MAP.nodes;
    for (let i = 0; i < N.length / 2; i++) this.nodes.push({ x: N[i * 2] / 2, z: N[i * 2 + 1] / 2, edges: [], h: 0, id: i });
    const W = MAP.ways, R = MAP.refs;
    let k = 0;
    this.ways = [];
    for (let w = 0; w < W.length; w += 4) {
      const kind = META.kinds[W[w]], width = W[w + 1] / 2, name = META.names[W[w + 2]], n = W[w + 3];
      const s = { width, kind, name, way: this.ways.length };
      const ids = [];
      for (let m = 0; m < n; m++) ids.push(R[k + m]);
      k += n;
      this.ways.push({ kind, width, name, ids });
      for (let m = 0; m < n - 1; m++) if (ids[m] !== ids[m + 1]) this.addEdge(ids[m], ids[m + 1], s);
    }
    this.pruneStubs();
    this.reindex();
  }

  addEdge(a, b, s) {
    const A = this.nodes[a], B = this.nodes[b];
    for (const ei of A.edges) {
      const e = this.edges[ei];
      if ((e.a === a && e.b === b) || (e.a === b && e.b === a)) return;
    }
    const len = dist(A.x, A.z, B.x, B.z);
    if (len < 0.5) return;
    const e = { id: this.edges.length, a, b, width: s.width, kind: s.kind, name: s.name, way: s.way, len, dx: (B.x - A.x) / len, dz: (B.z - A.z) / len, dead: false };
    this.edges.push(e);
    A.edges.push(e.id);
    B.edges.push(e.id);
  }

  pruneStubs() {
    let changed = true;
    while (changed) {
      changed = false;
      for (const n of this.nodes) {
        const live = n.edges.filter((ei) => !this.edges[ei].dead);
        if (live.length === 1) {
          const e = this.edges[live[0]];
          const other = this.nodes[e.a === n.id ? e.b : e.a];
          const otherLive = other.edges.filter((ei) => !this.edges[ei].dead).length;
          if (e.len < 7 && otherLive > 2) { e.dead = true; changed = true; }
        }
      }
    }
  }

  reindex() {
    const edges = this.edges.filter((e) => !e.dead);
    const used = new Set();
    edges.forEach((e) => { used.add(e.a); used.add(e.b); });
    const map = new Map();
    const nodes = [];
    this.nodes.forEach((n, i) => {
      if (used.has(i)) { map.set(i, nodes.length); nodes.push({ x: n.x, z: n.z, edges: [], h: 0, id: nodes.length }); }
    });
    edges.forEach((e, i) => {
      e.id = i; e.a = map.get(e.a); e.b = map.get(e.b);
      nodes[e.a].edges.push(i); nodes[e.b].edges.push(i);
    });
    for (const w of this.ways) w.ids = w.ids.map((i) => map.get(i)).filter((i) => i !== undefined);
    this.nodes = nodes;
    this.edges = edges;
    for (const n of this.nodes) {
      n.maxW = 0;
      for (const ei of n.edges) n.maxW = Math.max(n.maxW, this.edges[ei].width);
    }
  }

  // Alturas suavizadas de cada calle y segmentos para aplanar el terreno
  computeHeights(terrain) {
    const nodes = this.nodes;
    const land = nodes.map((n) => { n.h = terrain.heightAt(n.x, n.z); return n.h >= 0.3; });
    // suavizar alturas de nodos con sus vecinos de tierra (calles largas sin escalones ni lomos)
    for (let it = 0; it < 14; it++) {
      const hs = nodes.map((n, i) => {
        if (!n.edges.length || !land[i]) return n.h;
        let s = 0, w = 0;
        for (const ei of n.edges) { const j = this.otherNode(this.edges[ei], n.id); if (land[j]) { s += nodes[j].h; w++; } }
        return w ? n.h * 0.5 + (s / w) * 0.5 : n.h;
      });
      nodes.forEach((n, i) => { n.h = land[i] ? Math.max(hs[i], 0.4) : n.h; });
    }
    // pendiente máxima por tipo de calle: las barrancas se rellenan o se cortan en lugar de
    // dejar subidas imposibles
    const edgeGrade = (e) => GRADE[e.kind] || 0.14;
    for (let it = 0; it < 40; it++) {
      let moved = false;
      for (const e of this.edges) {
        if (!land[e.a] || !land[e.b]) continue;
        const A = nodes[e.a], B = nodes[e.b];
        const lim = edgeGrade(e) * e.len, d = B.h - A.h;
        if (Math.abs(d) > lim + 0.02) {
          const m = (Math.abs(d) - lim) * 0.35 * Math.sign(d);
          A.h += m; B.h -= m; moved = true;
        }
      }
      if (!moved) break;
    }
    const flat = [];
    for (const e of this.edges) {
      const A = nodes[e.a], B = nodes[e.b];
      const nS = Math.max(1, Math.ceil(e.len / 12));
      const coastal = !land[e.a] || !land[e.b];
      const hs = [];
      for (let k = 0; k <= nS; k++) {
        const t = k / nS;
        hs.push(terrain.heightAt(A.x + (B.x - A.x) * t, A.z + (B.z - A.z) * t));
      }
      for (let it = 0; it < (coastal ? 4 : 18); it++) {
        const c = hs.slice();
        for (let k = 1; k < nS; k++) c[k] = (hs[k - 1] + hs[k] * 2 + hs[k + 1]) / 4;
        c[0] = A.h; c[nS] = B.h;
        for (let k = 0; k <= nS; k++) hs[k] = c[k];
      }
      if (!coastal && nS > 1) {
        // dentro de cada tramo, sin pasarse de la pendiente máxima (ni de la recta entre los extremos)
        const ds = e.len / nS, gm = edgeGrade(e);
        for (let k = 1; k < nS; k++) {
          const s = k * ds;
          hs[k] = Math.min(Math.max(hs[k], A.h - gm * s, B.h - gm * (e.len - s)), A.h + gm * s, B.h + gm * (e.len - s));
        }
        for (let k = 1; k < nS; k++) hs[k] = Math.min(Math.max(hs[k], hs[k - 1] - gm * ds), hs[k - 1] + gm * ds);
        for (let k = nS - 1; k > 0; k--) hs[k] = Math.min(Math.max(hs[k], hs[k + 1] - gm * ds), hs[k + 1] + gm * ds);
      }
      e.hs = hs;
      for (let k = 0; k < nS; k++) {
        const t0 = k / nS, t1 = (k + 1) / nS;
        flat.push({
          ax: A.x + (B.x - A.x) * t0, az: A.z + (B.z - A.z) * t0, bx: A.x + (B.x - A.x) * t1, bz: A.z + (B.z - A.z) * t1,
          ha: hs[k], hb: hs[k + 1], width: e.width,
        });
      }
    }
    return flat;
  }

  // Máscara rasterizada (celdas de 3 m en el marco rotado): 0 nada, 1 asfalto, 2 ripio, 3 muelle
  buildMask() {
    const C = 3;
    this.maskC = C;
    this.maskA0 = F.a0; this.maskB0 = F.b0;
    this.maskW = Math.ceil((F.a1 - F.a0) / C) + 1;
    this.maskH = Math.ceil((F.b1 - F.b0) / C) + 1;
    const m = new Uint8Array(this.maskW * this.maskH);
    this.edgeGrid = new Map();
    for (const e of this.edges) {
      const A = this.nodes[e.a], B = this.nodes[e.b];
      const val = e.kind === 'tierra' ? 2 : e.kind === 'muelle' ? 3 : 1;
      const hw = e.width / 2 + 0.5;
      const [aa, ab] = toAB(A.x, A.z), [ba, bb] = toAB(B.x, B.z);
      const i0 = Math.max(0, Math.floor((Math.min(aa, ba) - hw - this.maskA0) / C)), i1 = Math.min(this.maskW - 1, Math.ceil((Math.max(aa, ba) + hw - this.maskA0) / C));
      const j0 = Math.max(0, Math.floor((Math.min(ab, bb) - hw - this.maskB0) / C)), j1 = Math.min(this.maskH - 1, Math.ceil((Math.max(ab, bb) + hw - this.maskB0) / C));
      const dx = ba - aa, dy = bb - ab, L2 = dx * dx + dy * dy || 1e-9;
      for (let j = j0; j <= j1; j++) {
        const b = this.maskB0 + j * C;
        for (let i = i0; i <= i1; i++) {
          const a = this.maskA0 + i * C;
          const t = clamp(((a - aa) * dx + (b - ab) * dy) / L2, 0, 1);
          if (Math.hypot(aa + dx * t - a, ab + dy * t - b) <= hw) {
            const k = j * this.maskW + i;
            if (!m[k] || val === 1) m[k] = val;
          }
        }
      }
      // grilla gruesa de aristas para búsquedas rápidas
      const G = 64;
      const x0 = Math.min(A.x, B.x) - hw, x1 = Math.max(A.x, B.x) + hw, z0 = Math.min(A.z, B.z) - hw, z1 = Math.max(A.z, B.z) + hw;
      for (let gi = Math.floor(x0 / G); gi <= Math.floor(x1 / G); gi++) for (let gj = Math.floor(z0 / G); gj <= Math.floor(z1 / G); gj++) {
        const key = gi * 100000 + gj;
        let arr = this.edgeGrid.get(key);
        if (!arr) { arr = []; this.edgeGrid.set(key, arr); }
        arr.push(e);
      }
    }
    this.mask = m;
  }

  surfaceAt(x, z) {
    if (!this.mask) return 0;
    const a = x * F.ux + z * F.uz, b = x * F.vx + z * F.vz;
    const i = Math.round((a - this.maskA0) / this.maskC), j = Math.round((b - this.maskB0) / this.maskC);
    if (i < 0 || j < 0 || i >= this.maskW || j >= this.maskH) return 0;
    return this.mask[j * this.maskW + i];
  }

  // ¿hay un bache en este punto?
  potholeAt(x, z) {
    if (!this.potGrid) return null;
    const list = this.potGrid.get(Math.floor(x / 16) * 100000 + Math.floor(z / 16));
    if (!list) return null;
    for (const p of list) if ((p.x - x) ** 2 + (p.z - z) ** 2 < p.r * p.r) return p;
    return null;
  }

  edgesNear(x, z) {
    const G = 64;
    return this.edgeGrid.get(Math.floor(x / G) * 100000 + Math.floor(z / G)) || [];
  }

  // ---- Consultas ----
  nearestEdge(x, z, maxD = 60, filter = null) {
    let best = null, bd = maxD;
    let list = this.edges;
    if (this.edgeGrid && maxD <= 200) {
      const G = 64, set = new Set();
      for (let gi = Math.floor((x - maxD) / G); gi <= Math.floor((x + maxD) / G); gi++) for (let gj = Math.floor((z - maxD) / G); gj <= Math.floor((z + maxD) / G); gj++) {
        const arr = this.edgeGrid.get(gi * 100000 + gj);
        if (arr) for (const e of arr) set.add(e);
      }
      list = set;
    }
    for (const e of list) {
      if (filter && !filter(e)) continue;
      const A = this.nodes[e.a], B = this.nodes[e.b];
      if (x < Math.min(A.x, B.x) - bd || x > Math.max(A.x, B.x) + bd || z < Math.min(A.z, B.z) - bd || z > Math.max(A.z, B.z) + bd) continue;
      const p = pointSegDist(x, z, A.x, A.z, B.x, B.z);
      if (p.d < bd) { bd = p.d; best = { edge: e, t: p.t, d: p.d, x: p.x, z: p.z }; }
    }
    return best;
  }

  // Distancia al borde de la calle más cercana (negativa si está sobre el asfalto)
  clearance(x, z, maxD = 30) {
    let best = maxD;
    const G = 64;
    for (let gi = Math.floor((x - maxD) / G); gi <= Math.floor((x + maxD) / G); gi++) for (let gj = Math.floor((z - maxD) / G); gj <= Math.floor((z + maxD) / G); gj++) {
      const arr = this.edgeGrid.get(gi * 100000 + gj);
      if (!arr) continue;
      for (const e of arr) {
        const A = this.nodes[e.a], B = this.nodes[e.b];
        const d = pointSegDist(x, z, A.x, A.z, B.x, B.z).d - e.width / 2;
        if (d < best) best = d;
      }
    }
    return best;
  }

  isOnRoad(x, z, pad = 0) {
    const r = this.nearestEdge(x, z, 30);
    return r && r.d < r.edge.width / 2 + pad;
  }

  nearestNode(x, z, filter = null) {
    let best = 0, bd = Infinity;
    for (const n of this.nodes) {
      if (filter && !filter(n)) continue;
      const d = (n.x - x) ** 2 + (n.z - z) ** 2;
      if (d < bd) { bd = d; best = n.id; }
    }
    return best;
  }

  otherNode(e, n) { return e.a === n ? e.b : e.a; }

  // A* entre nodos con cola de prioridad: devuelve lista de ids de nodos
  path(from, to, maxIter = 40000) {
    if (from === to) return [from];
    const N = this.nodes;
    const g = new Map([[from, 0]]);
    const came = new Map();
    const closed = new Set();
    const tx = N[to].x, tz = N[to].z;
    const h = (i) => Math.hypot(N[i].x - tx, N[i].z - tz);
    const heap = [[h(from), from]];
    const push = (item) => {
      heap.push(item);
      let i = heap.length - 1;
      while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; }
    };
    const pop = () => {
      const top = heap[0], last = heap.pop();
      if (heap.length) {
        heap[0] = last;
        let i = 0;
        for (;;) {
          const l = i * 2 + 1, r = l + 1;
          let m = i;
          if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
          if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
          if (m === i) break;
          [heap[m], heap[i]] = [heap[i], heap[m]]; i = m;
        }
      }
      return top;
    };
    let it = 0;
    while (heap.length && it++ < maxIter) {
      const [, cur] = pop();
      if (closed.has(cur)) continue;
      if (cur === to) {
        let c = cur;
        const out = [c];
        while (came.has(c)) { c = came.get(c); out.push(c); }
        return out.reverse();
      }
      closed.add(cur);
      const gc = g.get(cur);
      for (const ei of N[cur].edges) {
        const e = this.edges[ei];
        if (e.kind === 'muelle' || e.kind === 'peatonal') continue;
        const nb = this.otherNode(e, cur);
        if (closed.has(nb)) continue;
        const cost = e.len * (e.kind === 'tierra' ? 1.3 : e.kind === 'ruta' ? 0.8 : e.kind === 'avenida' ? 0.9 : 1);
        const ng = gc + cost;
        if (ng < (g.has(nb) ? g.get(nb) : Infinity)) {
          came.set(nb, cur); g.set(nb, ng); push([ng + h(nb), nb]);
        }
      }
    }
    return null;
  }

  // ---- Mallas ----
  buildMeshes(terrain, textures) {
    const group = new THREE.Group();
    const ch = new LeanChunks(420);
    const Y = 0.12;
    const gy = (x, z, off) => terrain.groundAt(x, z) + off;

    const ribbon = (mat, ax, az, bx, bz, w, yOff, uScale, trimA = 0, trimB = 0, offset = 0) => {
      const L = dist(ax, az, bx, bz);
      if (L - trimA - trimB < 0.3) return;
      const dx = (bx - ax) / L, dz = (bz - az) / L;
      const rx = -dz, rz = dx;
      const sx = ax + dx * trimA + rx * offset, sz = az + dz * trimA + rz * offset;
      const len = L - trimA - trimB;
      const n = Math.max(1, Math.ceil(len / 8));
      const lb = ch.get((ax + bx) / 2, (az + bz) / 2, mat);
      for (let k = 0; k < n; k++) {
        const t0 = (k / n) * len, t1 = ((k + 1) / n) * len;
        const p0x = sx + dx * t0, p0z = sz + dz * t0, p1x = sx + dx * t1, p1z = sz + dz * t1;
        const v = (x, z, u, vv) => [x, gy(x, z, yOff), z, u, vv];
        const a = v(p0x - rx * w / 2, p0z - rz * w / 2, 0, (trimA + t0) / uScale);
        const b = v(p0x + rx * w / 2, p0z + rz * w / 2, 1, (trimA + t0) / uScale);
        const c = v(p1x - rx * w / 2, p1z - rz * w / 2, 0, (trimA + t1) / uScale);
        const d = v(p1x + rx * w / 2, p1z + rz * w / 2, 1, (trimA + t1) / uScale);
        // normal hacia arriba
        lb.tri(...a, ...b, ...c);
        lb.tri(...b, ...d, ...c);
      }
    };
    const disc = (mat, x, z, r, yOff, seg = 12, uvS = 8) => {
      const lb = ch.get(x, z, mat);
      const yc = gy(x, z, yOff);
      for (let k = 0; k < seg; k++) {
        const a0 = (k / seg) * Math.PI * 2, a1 = ((k + 1) / seg) * Math.PI * 2;
        const x0 = x + Math.cos(a0) * r, z0 = z + Math.sin(a0) * r, x1 = x + Math.cos(a1) * r, z1 = z + Math.sin(a1) * r;
        lb.tri(x, yc, z, x / uvS, z / uvS, x1, gy(x1, z1, yOff), z1, x1 / uvS, z1 / uvS, x0, gy(x0, z0, yOff), z0, x0 / uvS, z0 / uvS);
      }
    };

    const isCross = (n) => n.edges.length > 2 || n.edges.length === 1;
    // ¿el punto está sobre una calle pavimentada? (las de tierra no se dibujan encima del asfalto)
    const onPaved = (x, z) => {
      for (const e2 of this.edgesNear(x, z)) {
        if (e2.kind === 'tierra') continue;
        const P = this.nodes[e2.a], Q = this.nodes[e2.b];
        if (pointSegDist(x, z, P.x, P.z, Q.x, Q.z).d < e2.width / 2 - 0.3) return true;
      }
      return false;
    };
    for (const e of this.edges) {
      const A = this.nodes[e.a], B = this.nodes[e.b];
      const dirt = e.kind === 'tierra';
      const mat = dirt ? 'dirt' : e.kind === 'peatonal' ? 'paving' : 'asphalt';
      if (dirt) {
        // tramos de tierra: se saltean los pedazos que caen sobre el asfalto
        const n = Math.max(1, Math.ceil(e.len / 6));
        let run = -1;
        for (let k = 0; k <= n; k++) {
          const t = (k + 0.5) / n;
          const bad = k === n || onPaved(A.x + (B.x - A.x) * t, A.z + (B.z - A.z) * t);
          if (!bad && run < 0) run = k;
          if (bad && run >= 0) {
            const t0 = run / n, t1 = k / n;
            ribbon(mat, A.x + (B.x - A.x) * t0, A.z + (B.z - A.z) * t0, A.x + (B.x - A.x) * t1, A.z + (B.z - A.z) * t1, e.width, Y - 0.03, 8);
            run = -1;
          }
        }
        continue;
      }
      ribbon(mat, A.x, A.z, B.x, B.z, e.width, dirt ? Y - 0.03 : Y, 8);
      if (dirt || e.kind === 'muelle' || e.kind === 'peatonal' || e.kind === 'calle') continue;
      const trimA = isCross(A) ? A.maxW / 2 + 1.5 : 0;
      const trimB = isCross(B) ? B.maxW / 2 + 1.5 : 0;
      if (e.kind === 'ruta') {
        ribbon('yellow', A.x, A.z, B.x, B.z, 0.22, Y + 0.03, 1, trimA, trimB, -0.18);
        ribbon('yellow', A.x, A.z, B.x, B.z, 0.22, Y + 0.03, 1, trimA, trimB, 0.18);
        ribbon('solidW', A.x, A.z, B.x, B.z, 0.2, Y + 0.03, 1, trimA, trimB, e.width / 2 - 0.6);
        ribbon('solidW', A.x, A.z, B.x, B.z, 0.2, Y + 0.03, 1, trimA, trimB, -e.width / 2 + 0.6);
      } else if (e.kind === 'avenida') {
        ribbon('white', A.x, A.z, B.x, B.z, 0.2, Y + 0.03, 6, trimA, trimB, 0);
      }
    }
    // Parches en cruces, curvas y puntas (tapan uniones y líneas superpuestas)
    for (const n of this.nodes) {
      const deg = n.edges.length;
      const es = n.edges.map((i) => this.edges[i]);
      const allDirt = es.every((e) => e.kind === 'tierra');
      if (allDirt && onPaved(n.x, n.z)) continue;
      if (deg >= 3) { disc(allDirt ? 'patchD' : 'patchA', n.x, n.z, n.maxW / 2 * 1.12 + 0.8, Y + 0.015, 12); continue; }
      if (deg === 1) { disc(allDirt ? 'patchD' : 'patchA', n.x, n.z, n.maxW / 2, Y + 0.012, 10); continue; }
      if (deg === 2) {
        const [e1, e2] = es;
        const d1x = this.nodes[this.otherNode(e1, n.id)].x - n.x, d1z = this.nodes[this.otherNode(e1, n.id)].z - n.z;
        const d2x = this.nodes[this.otherNode(e2, n.id)].x - n.x, d2z = this.nodes[this.otherNode(e2, n.id)].z - n.z;
        const cos = (d1x * d2x + d1z * d2z) / (Math.hypot(d1x, d1z) * Math.hypot(d2x, d2z) || 1);
        if (cos > -0.985) disc(allDirt ? 'patchD' : 'patchA', n.x, n.z, Math.min(e1.width, e2.width) / 2, Y + 0.008, 10);
      }
    }

    // Baches: "le faltaron las calles hechas m...". Más en las calles de barrio, algunos en las
    // avenidas y pocos en la ruta; siempre en el mismo lugar (semilla fija por calle).
    this.potholes = [];
    this.potGrid = new Map();
    const rough = (mat, x, z, r, yOff, rnd) => {
      const lb = ch.get(x, z, mat);
      const seg = 9, yc = gy(x, z, yOff);
      const rr = [];
      for (let k = 0; k < seg; k++) rr.push(r * (0.65 + rnd.next() * 0.55));
      for (let k = 0; k < seg; k++) {
        const a0 = (k / seg) * Math.PI * 2, a1 = ((k + 1) / seg) * Math.PI * 2, r0 = rr[k], r1 = rr[(k + 1) % seg];
        const x0 = x + Math.cos(a0) * r0, z0 = z + Math.sin(a0) * r0, x1 = x + Math.cos(a1) * r1, z1 = z + Math.sin(a1) * r1;
        lb.tri(x, yc, z, x / 4, z / 4, x1, gy(x1, z1, yOff), z1, x1 / 4, z1 / 4, x0, gy(x0, z0, yOff), z0, x0 / 4, z0 / 4);
      }
    };
    // Muy pocos y solo en la ruta (pedido de Nicolás): uno cada ~1,5 km
    const EVERY = { ruta: 1500 };
    this.edges.forEach((e, i) => {
      const every = EVERY[e.kind];
      if (!every || e.len < 14) return;
      const rnd = new RNG(7919 + i * 31);
      const n = Math.floor(e.len / every + rnd.next());
      const A = this.nodes[e.a];
      for (let k = 0; k < n; k++) {
        const t = rnd.range(6, e.len - 6);
        // en la mano de un lado o del otro (por donde pasan las ruedas)
        const off = rnd.sign() * e.width * rnd.range(0.12, 0.32);
        const x = A.x + e.dx * t - e.dz * off, z = A.z + e.dz * t + e.dx * off;
        const r = rnd.range(0.45, e.kind === 'calle' ? 1.1 : 0.85);
        rough('bacheBorde', x, z, r * 1.35, Y + 0.02, rnd);
        rough('bache', x, z, r, Y + 0.025, rnd);
        const pot = { x, z, r };
        this.potholes.push(pot);
        const key = Math.floor(x / 16) * 100000 + Math.floor(z / 16);
        if (!this.potGrid.has(key)) this.potGrid.set(key, []);
        this.potGrid.get(key).push(pot);
      }
    });

    const po = (mat, f) => { mat.polygonOffset = true; mat.polygonOffsetFactor = f; mat.polygonOffsetUnits = f * 2; return mat; };
    const materials = {
      asphalt: po(lam({ map: textures.asphalt }), -1),
      dirt: po(lam({ map: textures.dirt }), -1),
      paving: po(lam({ map: textures.sidewalk }), -1),
      white: po(lam({ map: textures.dash, transparent: true, alphaTest: 0.4 }), -3),
      solidW: po(lam({ color: 0xdedcd0 }), -3),
      yellow: po(lam({ color: 0xd9a826 }), -3),
      patchA: po(lam({ map: textures.asphalt }), -2),
      patchD: po(lam({ map: textures.dirt }), -2),
      bacheBorde: po(lam({ color: 0x3e3b38 }), -2.5),
      bache: po(lam({ color: 0x100f0e }), -3),
    };
    if (STYLE.realista) {
      // fotos por posición en el mundo (las esquinas empalman con los tramos) y relieve
      const P = textures.pbr, GS = STYLE.GROUND_SCALE;
      const src = { asphalt: 'asphalt', patchA: 'asphalt', dirt: 'dirt', patchD: 'dirt', paving: 'sidewalk' };
      for (const [k, key] of Object.entries(src)) {
        const m = materials[k];
        Object.assign(m, P[key]);
        m.map = textures[key];
        m.userData.key = k;
        STYLE.worldUV(m, GS[k], { vary: k === 'asphalt' || k === 'patchA' ? 0.25 : 0.2 });
        m.needsUpdate = true;
      }
      // pintura vial: un poco gastada y con brillo
      for (const k of ['white', 'solidW', 'yellow']) { materials[k].roughness = 0.6; }
    }
    ch.build(materials, group, { order: { asphalt: 1, dirt: 1, paving: 1, patchA: 2, patchD: 2, bacheBorde: 3, bache: 3, white: 3, solidW: 3, yellow: 3 } });
    this.materials = materials;
    return group;
  }
}
