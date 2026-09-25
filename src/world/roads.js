import * as THREE from 'three';
import { GRIDS, ROADS } from './mapdata.js';
import { segIntersect, pointSegDist, dist, lerp, clamp } from '../util.js';

// Genera la red vial: polilíneas -> grafo de nodos y aristas
export class RoadNetwork {
  constructor() {
    this.nodes = []; // {x,z,edges:[], h}
    this.edges = []; // {a,b,width,kind,name,len,dx,dz, pts (samples)}
    this.build();
  }

  static gridLines(g) {
    const lines = [];
    const skip = g.skip || {};
    const ext = g.ext || {};
    const xMax = g.x0 + g.cols * g.px, zMax = g.z0 + g.rows * g.pz;
    const kind = g.type === 'centro' ? 'avenida' : 'calle';
    for (let i = 0; i <= g.cols; i++) {
      if (i === 0 && skip.W) continue;
      if (i === g.cols && skip.E) continue;
      const x = g.x0 + i * g.px;
      const zA = g.z0 - (ext.N || 0), zB = zMax + (ext.S || 0);
      lines.push({ name: g.name, kind, width: g.sw, pts: [[x, zA], [x, zB]], grid: g.id });
    }
    for (let j = 0; j <= g.rows; j++) {
      if (j === 0 && skip.N) continue;
      if (j === g.rows && skip.S) continue;
      const z = g.z0 + j * g.pz;
      const xA = g.x0 - (ext.W || 0), xB = xMax + (ext.E || 0);
      lines.push({ name: g.name, kind, width: g.sw, pts: [[xA, z], [xB, z]], grid: g.id });
    }
    return lines;
  }

  build() {
    const polys = [];
    for (const g of GRIDS) polys.push(...RoadNetwork.gridLines(g));
    for (const r of ROADS) polys.push({ name: r.name, kind: r.kind, width: r.width, pts: r.pts, id: r.id });

    // Segmentos crudos
    let segs = [];
    for (const p of polys) {
      for (let k = 0; k < p.pts.length - 1; k++) {
        const [ax, az] = p.pts[k], [bx, bz] = p.pts[k + 1];
        segs.push({ ax, az, bx, bz, width: p.width, kind: p.kind, name: p.name, cuts: [0, 1] });
      }
    }
    // Intersecciones
    for (let i = 0; i < segs.length; i++) {
      const s = segs[i];
      for (let j = i + 1; j < segs.length; j++) {
        const t = segs[j];
        if (Math.max(s.ax, s.bx) + 20 < Math.min(t.ax, t.bx) || Math.max(t.ax, t.bx) + 20 < Math.min(s.ax, s.bx)) continue;
        if (Math.max(s.az, s.bz) + 20 < Math.min(t.az, t.bz) || Math.max(t.az, t.bz) + 20 < Math.min(s.az, s.bz)) continue;
        const hit = segIntersect(s.ax, s.az, s.bx, s.bz, t.ax, t.az, t.bx, t.bz);
        if (hit) {
          s.cuts.push(clamp(hit.t, 0, 1));
          t.cuts.push(clamp(hit.u, 0, 1));
          continue;
        }
        // Uniones en T: extremo cerca de otro segmento
        const snap = (u, v, uEnd) => {
          const px = uEnd ? u.bx : u.ax, pz = uEnd ? u.bz : u.az;
          const q = pointSegDist(px, pz, v.ax, v.az, v.bx, v.bz);
          if (q.d < 4 && q.t > 0.001 && q.t < 0.999) {
            v.cuts.push(q.t);
            if (uEnd) { u.bx = q.x; u.bz = q.z; } else { u.ax = q.x; u.az = q.z; }
          }
        };
        snap(s, t, false); snap(s, t, true); snap(t, s, false); snap(t, s, true);
      }
    }
    // Nodos
    const nodeFor = (x, z) => {
      for (let k = this.nodes.length - 1; k >= 0; k--) {
        const n = this.nodes[k];
        if (Math.abs(n.x - x) < 2.5 && Math.abs(n.z - z) < 2.5) return k;
      }
      this.nodes.push({ x, z, edges: [], h: 0, id: this.nodes.length });
      return this.nodes.length - 1;
    };
    for (const s of segs) {
      const cuts = [...new Set(s.cuts.map((c) => Math.round(c * 1e5) / 1e5))].sort((a, b) => a - b);
      for (let k = 0; k < cuts.length - 1; k++) {
        const t0 = cuts[k], t1 = cuts[k + 1];
        if (t1 - t0 < 1e-4) continue;
        const x0 = lerp(s.ax, s.bx, t0), z0 = lerp(s.az, s.bz, t0);
        const x1 = lerp(s.ax, s.bx, t1), z1 = lerp(s.az, s.bz, t1);
        if (dist(x0, z0, x1, z1) < 1) continue;
        const a = nodeFor(x0, z0), b = nodeFor(x1, z1);
        if (a === b) continue;
        this.addEdge(a, b, s);
      }
    }
    this.pruneStubs();
    this.reindex();
  }

  addEdge(a, b, s) {
    const A = this.nodes[a], B = this.nodes[b];
    // evitar duplicados
    for (const ei of A.edges) {
      const e = this.edges[ei];
      if ((e.a === a && e.b === b) || (e.a === b && e.b === a)) return;
    }
    const len = dist(A.x, A.z, B.x, B.z);
    const e = { id: this.edges.length, a, b, width: s.width, kind: s.kind, name: s.name, len, dx: (B.x - A.x) / len, dz: (B.z - A.z) / len, dead: false };
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
          if (e.len < 22 && e.kind !== 'muelle') {
            e.dead = true;
            changed = true;
          }
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
    this.nodes = nodes;
    this.edges = edges;
    for (const n of this.nodes) {
      n.maxW = 0;
      for (const ei of n.edges) n.maxW = Math.max(n.maxW, this.edges[ei].width);
    }
  }

  // Alturas suavizadas de cada calle y segmentos para aplanar el terreno
  computeHeights(terrain) {
    for (const n of this.nodes) n.h = terrain.heightAt(n.x, n.z);
    const flat = [];
    for (const e of this.edges) {
      const A = this.nodes[e.a], B = this.nodes[e.b];
      const nS = Math.max(1, Math.ceil(e.len / 10));
      const hs = [];
      for (let k = 0; k <= nS; k++) {
        const t = k / nS;
        hs.push(terrain.heightAt(lerp(A.x, B.x, t), lerp(A.z, B.z, t)));
      }
      // suavizado con extremos fijos
      for (let it = 0; it < 4; it++) {
        const c = hs.slice();
        for (let k = 1; k < nS; k++) c[k] = (hs[k - 1] + hs[k] * 2 + hs[k + 1]) / 4;
        c[0] = A.h; c[nS] = B.h;
        for (let k = 0; k <= nS; k++) hs[k] = c[k];
      }
      e.hs = hs;
      for (let k = 0; k < nS; k++) {
        const t0 = k / nS, t1 = (k + 1) / nS;
        flat.push({
          ax: lerp(A.x, B.x, t0), az: lerp(A.z, B.z, t0), bx: lerp(A.x, B.x, t1), bz: lerp(A.z, B.z, t1),
          ha: hs[k], hb: hs[k + 1], width: e.width,
        });
      }
    }
    return flat;
  }

  // Máscara rasterizada de calles (celdas de 2 m): 0 nada, 1 asfalto, 2 ripio, 3 muelle
  buildMask(WORLD) {
    const C = 2;
    this.maskC = C;
    this.maskX0 = WORLD.minX; this.maskZ0 = WORLD.minZ;
    this.maskW = Math.ceil((WORLD.maxX - WORLD.minX) / C) + 1;
    this.maskH = Math.ceil((WORLD.maxZ - WORLD.minZ) / C) + 1;
    const m = new Uint8Array(this.maskW * this.maskH);
    this.edgeGrid = new Map();
    for (const e of this.edges) {
      const A = this.nodes[e.a], B = this.nodes[e.b];
      const val = e.kind === 'tierra' ? 2 : e.kind === 'muelle' ? 3 : 1;
      const hw = e.width / 2 + 0.5;
      const x0 = Math.min(A.x, B.x) - hw, x1 = Math.max(A.x, B.x) + hw;
      const z0 = Math.min(A.z, B.z) - hw, z1 = Math.max(A.z, B.z) + hw;
      for (let j = Math.floor((z0 - this.maskZ0) / C); j <= Math.ceil((z1 - this.maskZ0) / C); j++) {
        for (let i = Math.floor((x0 - this.maskX0) / C); i <= Math.ceil((x1 - this.maskX0) / C); i++) {
          if (i < 0 || j < 0 || i >= this.maskW || j >= this.maskH) continue;
          const x = this.maskX0 + i * C, z = this.maskZ0 + j * C;
          if (pointSegDist(x, z, A.x, A.z, B.x, B.z).d <= hw) {
            const k = j * this.maskW + i;
            if (!m[k] || val === 1) m[k] = val;
          }
        }
      }
      // grilla gruesa de aristas para búsquedas rápidas
      const G = 64;
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
    const i = Math.round((x - this.maskX0) / this.maskC), j = Math.round((z - this.maskZ0) / this.maskC);
    if (i < 0 || j < 0 || i >= this.maskW || j >= this.maskH) return 0;
    return this.mask[j * this.maskW + i];
  }

  edgesNear(x, z) {
    const G = 64;
    return this.edgeGrid.get(Math.floor(x / G) * 100000 + Math.floor(z / G)) || [];
  }

  // ---- Consultas ----
  nearestEdge(x, z, maxD = 60, filter = null) {
    let best = null, bd = maxD;
    let list = this.edges;
    if (this.edgeGrid && maxD <= 64) {
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

  isOnRoad(x, z, pad = 0) {
    const r = this.nearestEdge(x, z, 30);
    return r && r.d < r.edge.width / 2 + pad;
  }

  nearestNode(x, z) {
    let best = 0, bd = Infinity;
    for (const n of this.nodes) {
      const d = (n.x - x) ** 2 + (n.z - z) ** 2;
      if (d < bd) { bd = d; best = n.id; }
    }
    return best;
  }

  otherNode(e, n) { return e.a === n ? e.b : e.a; }

  // A* entre nodos: devuelve lista de ids de nodos
  path(from, to, maxIter = 4000) {
    if (from === to) return [from];
    const N = this.nodes;
    const open = new Map([[from, 0]]);
    const g = new Map([[from, 0]]);
    const came = new Map();
    const h = (i) => Math.hypot(N[i].x - N[to].x, N[i].z - N[to].z);
    const f = new Map([[from, h(from)]]);
    let it = 0;
    while (open.size && it++ < maxIter) {
      let cur = -1, cf = Infinity;
      for (const [k] of open) { const v = f.get(k); if (v < cf) { cf = v; cur = k; } }
      if (cur === to) {
        const out = [cur];
        while (came.has(cur)) { cur = came.get(cur); out.push(cur); }
        return out.reverse();
      }
      open.delete(cur);
      for (const ei of N[cur].edges) {
        const e = this.edges[ei];
        if (e.kind === 'muelle') continue;
        const nb = this.otherNode(e, cur);
        const ng = g.get(cur) + e.len * (e.kind === 'tierra' ? 1.3 : 1);
        if (ng < (g.has(nb) ? g.get(nb) : Infinity)) {
          came.set(nb, cur); g.set(nb, ng); f.set(nb, ng + h(nb)); open.set(nb, 1);
        }
      }
    }
    return null;
  }

  // ---- Mallas ----
  buildMeshes(terrain, textures) {
    const group = new THREE.Group();
    const buckets = { asphalt: [], dirt: [], white: [], solidW: [], yellow: [], patchA: [], patchD: [] };
    const push = (arr, v) => arr.push(v);
    const Y = 0.12;

    const ribbon = (bucket, ax, az, bx, bz, w, yOff, uScale, vFromLen = true, trimA = 0, trimB = 0, offset = 0) => {
      const L = dist(ax, az, bx, bz);
      if (L - trimA - trimB < 0.5) return;
      const dx = (bx - ax) / L, dz = (bz - az) / L;
      const rx = -dz, rz = dx;
      const sx = ax + dx * trimA + rx * offset, sz = az + dz * trimA + rz * offset;
      const len = L - trimA - trimB;
      const n = Math.max(1, Math.ceil(len / 5));
      for (let k = 0; k < n; k++) {
        const t0 = k / n * len, t1 = (k + 1) / n * len;
        const p0x = sx + dx * t0, p0z = sz + dz * t0, p1x = sx + dx * t1, p1z = sz + dz * t1;
        const corners = [
          [p0x - rx * w / 2, p0z - rz * w / 2, 0, (trimA + t0) / uScale],
          [p0x + rx * w / 2, p0z + rz * w / 2, 1, (trimA + t0) / uScale],
          [p1x - rx * w / 2, p1z - rz * w / 2, 0, (trimA + t1) / uScale],
          [p1x + rx * w / 2, p1z + rz * w / 2, 1, (trimA + t1) / uScale],
        ];
        const v = corners.map(([x, z, u, vv]) => [x, terrain.groundAt(x, z) + yOff, z, u, vv]);
        push(buckets[bucket], [v[0], v[1], v[2], v[1], v[3], v[2]]);
      }
    };

    for (const e of this.edges) {
      const A = this.nodes[e.a], B = this.nodes[e.b];
      const dirt = e.kind === 'tierra';
      ribbon(dirt ? 'dirt' : 'asphalt', A.x, A.z, B.x, B.z, e.width, dirt ? Y - 0.03 : Y, 8);
      if (dirt || e.kind === 'muelle') continue;
      const trimA = A.edges.length > 2 || A.edges.length === 1 ? A.maxW / 2 + 1.5 : 0;
      const trimB = B.edges.length > 2 || B.edges.length === 1 ? B.maxW / 2 + 1.5 : 0;
      if (e.kind === 'ruta') {
        ribbon('yellow', A.x, A.z, B.x, B.z, 0.22, Y + 0.03, 1, true, trimA, trimB, -0.18);
        ribbon('yellow', A.x, A.z, B.x, B.z, 0.22, Y + 0.03, 1, true, trimA, trimB, 0.18);
        ribbon('solidW', A.x, A.z, B.x, B.z, 0.2, Y + 0.03, 1, true, trimA, trimB, e.width / 2 - 0.6);
        ribbon('solidW', A.x, A.z, B.x, B.z, 0.2, Y + 0.03, 1, true, trimA, trimB, -e.width / 2 + 0.6);
      } else if (e.kind === 'avenida') {
        ribbon('white', A.x, A.z, B.x, B.z, 0.2, Y + 0.03, 6, true, trimA, trimB, 0);
      }
    }
    // Parches de intersección (tapan líneas superpuestas)
    for (const n of this.nodes) {
      if (n.edges.length < 3) continue;
      const allDirt = n.edges.every((ei) => this.edges[ei].kind === 'tierra');
      const r = n.maxW / 2 + 0.8;
      const seg = 10;
      const verts = [];
      for (let k = 0; k < seg; k++) {
        const a0 = (k / seg) * Math.PI * 2, a1 = ((k + 1) / seg) * Math.PI * 2;
        const pts = [[n.x, n.z], [n.x + Math.cos(a0) * r * 1.15, n.z + Math.sin(a0) * r * 1.15], [n.x + Math.cos(a1) * r * 1.15, n.z + Math.sin(a1) * r * 1.15]];
        verts.push(pts.map(([x, z]) => [x, terrain.groundAt(x, z) + Y + 0.015, z, x / 8, z / 8]));
      }
      for (const tri of verts) push(buckets[allDirt ? 'patchD' : 'patchA'], [tri[0], tri[2], tri[1]]);
    }

    const makeMesh = (tris, material, order) => {
      if (!tris.length) return;
      const count = tris.reduce((s, t) => s + t.length, 0);
      const pos = new Float32Array(count * 3), uv = new Float32Array(count * 2);
      let p = 0, q = 0;
      for (const t of tris) for (const v of t) { pos[p++] = v[0]; pos[p++] = v[1]; pos[p++] = v[2]; uv[q++] = v[3]; uv[q++] = v[4]; }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
      geo.computeVertexNormals();
      geo.computeBoundingSphere();
      const m = new THREE.Mesh(geo, material);
      m.renderOrder = order;
      m.matrixAutoUpdate = false;
      group.add(m);
    };
    const po = (mat, f) => { mat.polygonOffset = true; mat.polygonOffsetFactor = f; mat.polygonOffsetUnits = f * 2; return mat; };
    const asphaltMat = po(new THREE.MeshLambertMaterial({ map: textures.asphalt }), -1);
    const dirtMat = po(new THREE.MeshLambertMaterial({ map: textures.dirt }), -1);
    const whiteMat = po(new THREE.MeshLambertMaterial({ map: textures.dash, transparent: true, alphaTest: 0.4 }), -3);
    const solidWhite = po(new THREE.MeshLambertMaterial({ color: 0xdedcd0 }), -3);
    const yellowMat = po(new THREE.MeshLambertMaterial({ color: 0xd9a826 }), -3);
    const patchA = po(new THREE.MeshLambertMaterial({ map: textures.asphalt }), -2);
    const patchD = po(new THREE.MeshLambertMaterial({ map: textures.dirt }), -2);
    makeMesh(buckets.asphalt, asphaltMat, 1);
    makeMesh(buckets.dirt, dirtMat, 1);
    makeMesh(buckets.patchA, patchA, 2);
    makeMesh(buckets.patchD, patchD, 2);
    makeMesh(buckets.white, whiteMat, 3);
    makeMesh(buckets.solidW, solidWhite, 3);
    makeMesh(buckets.yellow, yellowMat, 3);
    return group;
  }
}
