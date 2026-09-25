import * as THREE from 'three';
import { lam, STYLE } from '../render/style.js';
import { META, MAP, LANDMARKS, POI, SPAWNS, DECKS, RAMPS } from './mapdata.js';
import { ChunkedGeo, LeanChunks, hexColor } from './geom.js';
import { signTexture } from '../render/textures.js';
import { RNG, clamp, pointSegDist } from '../util.js';
import { pointInRing } from './zones.js';
import { HouseInstances } from './houses.js';
import { InstChunks } from './culling.js';

const CURB = 0.22;
const SW = 2.6; // ancho de vereda

const PAL = {
  centro: [0xd8d2c4, 0xc9b9a0, 0xb8b4ad, 0xe0d6c0, 0xa89a88, 0xcfc8bb, 0x9fa8ad, 0xd9c7a8, 0xbfae98, 0xe4dccb],
  house: [0xf1e3c6, 0xcfe0e8, 0xf0d0cc, 0xd8e8c8, 0xf3e9a8, 0xf7f5f0, 0xe8c8a8, 0xc8d8f0, 0xe9d7f0, 0xd9cbb0, 0xf2efe6, 0xe6ddc9],
  roof: [0xa33a2a, 0x2f6b3a, 0x2d4f7a, 0x8a8f94, 0x7a3326, 0x3a6e6e, 0x9a9da0, 0xb04a2a],
  metal: [0xc9ccce, 0x9fb0b8, 0xb9a88a, 0x8f9aa0, 0xa7b8a0],
  rada: [0xf7f5f0, 0xe8e0d0, 0xd0c0a8, 0xf0e8d8, 0xc8d0d8],
  block: [0xd8cfc0, 0xc8c0b0, 0xe0d8c8, 0xb8b0a0, 0xd0c8b8],
  brickHouse: [0xc0785a, 0xb06848, 0xcc8a66, 0xa86a50],
  publico: [0xe8e2d4, 0xd6cbb4, 0xefe9dc, 0xc9c2b4, 0xe2d2b0],
  fence: [0xe8e4da, 0xd8d0c0, 0xc9c0b0, 0xb8b0a4, 0xf0ece2, 0xc47a5a],
};

// Estilos de lote por tipo de zona
const STYLES = {
  centro: { w0: 9, w1: 18, d0: 15, d1: 26, setback: 0, gap: 0.2, maxSlope: 5 },
  barrio: { w0: 9, w1: 13, d0: 8, d1: 10.5, setback: 2.4, gap: 2.2, maxSlope: 5, empty: 0.1 },
  viviendas: { w0: 22, w1: 30, d0: 10, d1: 12, setback: 5, gap: 8, maxSlope: 4, empty: 0.15 },
  km: { w0: 12, w1: 15, d0: 8.5, d1: 10, setback: 4.5, gap: 3.5, maxSlope: 5, empty: 0.2 },
  rada: { w0: 13, w1: 17, d0: 10, d1: 12, setback: 5, gap: 3.5, maxSlope: 5, empty: 0.12 },
  industrial: { w0: 22, w1: 38, d0: 18, d1: 30, setback: 6, gap: 6, maxSlope: 4, empty: 0.25 },
};

// Muelle más largo cerca del puerto que termine en el agua (el Muelle de Ultramar).
// Devuelve la base (en tierra), la punta y la dirección base→punta.
export function findPortPier(terrain) {
  const port = LANDMARKS.puerto || LANDMARKS.museoFerro || LANDMARKS.catedral;
  if (!port) return null;
  let best = null, bl = 0;
  for (const p of META.piers || []) {
    if (Math.min(...p.map((q) => Math.hypot(q[0] - port.x, q[1] - port.z))) > 1500) continue;
    const e0 = p[0], e1 = p[p.length - 1];
    if (Math.min(terrain.heightAt(e0[0], e0[1]), terrain.heightAt(e1[0], e1[1])) > -1) continue;
    let L = 0;
    for (let k = 0; k < p.length - 1; k++) L += Math.hypot(p[k + 1][0] - p[k][0], p[k + 1][1] - p[k][1]);
    if (L > bl) { bl = L; best = p; }
  }
  if (!best) return null;
  let [b, t] = [best[0], best[best.length - 1]];
  if (terrain.heightAt(b[0], b[1]) < terrain.heightAt(t[0], t[1])) [b, t] = [t, b];
  const L = Math.hypot(t[0] - b[0], t[1] - b[1]) || 1;
  return { x: b[0], z: b[1], tx: t[0], tz: t[1], dx: (t[0] - b[0]) / L, dz: (t[1] - b[1]) / L };
}

export class City {
  constructor() {
    this.blocks = []; // compatibilidad: ya no hay manzanas rectangulares
    this.signs = [];
    this.markers = {};
    this.parkingSpots = [];
    this.lampSpots = [];
    this.treeSpots = [];
    this.plazas = [];
    this.benches = [];
    this.containers = [];
    this.gasPumps = [];
    this.occ = new Map();
    this.fr = null;
  }

  // ------------------------------------------------------------------
  // Consultas
  // ------------------------------------------------------------------
  curbAt(x, z) {
    const R = this.roads;
    if (!R) return 0;
    const arr = R.edgesNear(x, z);
    let best = null, bd = 1e9;
    for (const e of arr) {
      const A = R.nodes[e.a], B = R.nodes[e.b];
      const p = pointSegDist(x, z, A.x, A.z, B.x, B.z);
      const rel = p.d - e.width / 2;
      if (rel < bd) { bd = rel; best = e; }
    }
    if (!best || !best.sw) return 0;
    return bd >= -0.05 && bd <= SW + 0.05 ? CURB : 0;
  }

  blockAt() { return null; }

  zoneTypeAt(x, z) {
    const zn = this.zones && this.zones.zoneAt(x, z);
    if (this.zones && this.zones.areaAt(x, z, 'industrial')) return 'industrial';
    if (!zn) return null;
    if (/viviendas/i.test(zn.name)) return 'viviendas';
    return zn.type;
  }

  // Punto sobre la vereda: arista, lado (+1/-1) y t (0..1)
  sidewalkPoint(e, side, t) {
    const R = this.roads;
    const A = R.nodes[e.a];
    const off = (e.width / 2 + SW / 2) * side;
    const tt = clamp(t, 0, 1) * e.len;
    return [A.x + e.dx * tt - e.dz * off, A.z + e.dz * tt + e.dx * off];
  }

  // Recorte de la vereda en un extremo (0 = nodo a, 1 = nodo b) y lado
  trimOf(e, end, side) { return this.trim[e.id * 4 + end * 2 + (side > 0 ? 0 : 1)]; }

  // Vereda al azar cerca de un punto
  randomSidewalk(x, z, rMin, rMax, rng = Math.random) {
    const R = this.roads;
    for (let k = 0; k < 12; k++) {
      const a = rng() * Math.PI * 2, r = rMin + rng() * (rMax - rMin);
      const px = x + Math.cos(a) * r, pz = z + Math.sin(a) * r;
      const n = R.nearestEdge(px, pz, 40, (e) => e.sw);
      if (!n) continue;
      const e = n.edge;
      const side = rng() < 0.5 ? 1 : -1;
      const tA = this.trimOf(e, 0, side), tB = this.trimOf(e, 1, side);
      if (e.len - tA - tB < 2) continue;
      const t = (tA + (e.len - tA - tB) * (0.1 + rng() * 0.8)) / e.len;
      const [sx, sz] = this.sidewalkPoint(e, side, t);
      const d = Math.hypot(sx - x, sz - z);
      if (d < rMin * 0.8 || d > rMax * 1.2) continue;
      return { x: sx, z: sz, edge: e, side, t };
    }
    return null;
  }

  // ------------------------------------------------------------------
  // Construcción
  // ------------------------------------------------------------------
  build(g) {
    const { terrain, roads, textures: T, colliders, scene, zones } = g;
    const rng = new RNG(2004);
    this.terrain = terrain;
    this.roads = roads;
    this.colliders = colliders;
    this.zones = zones;
    this.T = T;
    const chunks = new ChunkedGeo(300);
    this.chunks = chunks;
    this.lean = new LeanChunks(420);
    this.houses = new HouseInstances(T);
    const group = new THREE.Group();
    this.group = group;

    this.computeTrims();
    this.buildSidewalks();
    for (const r of RAMPS) this.reserve({ cx: r.x, cz: r.z, ax: Math.cos(r.rot), az: -Math.sin(r.rot), hw: r.w / 2 + 3, hd: r.len / 2 + 6 });
    for (const d of DECKS) this.reserve({ cx: d.cx, cz: d.cz, ax: d.ax, az: d.az, hw: d.hw, hd: d.hd });
    this.buildAreas(chunks, rng);
    this.buildSpecials(chunks, rng, T);
    this.buildPuerto(chunks, rng);
    this.buildOutside(chunks, rng, T);
    // edificios reales donde hay datos; si no, lotes inventados a lo largo de las calles
    if (MAP.bldPos && MAP.bldPos.length) { this.placeRealBuildings(chunks, rng); this.placePOIs(chunks); }
    else this.placeLots(chunks, rng);
    this.streetFurniture(rng);

    const mats = this.materials(T);
    chunks.build(mats, group);
    this.lean.build(mats, group, { order: { sidewalk: 1, curbFace: 1, grass: 1 } });
    group.add(this.houses.build(colliders));
    this.buildFrontFences(group);
    for (const s of this.signs) group.add(s);
    scene.add(group);
    this.materialsList = mats;
    return group;
  }

  materials(T) {
    // P: mapas extra de la versión realista (normales, rugosidad, metal); vacío en la PS2
    const P = T.pbr || {};
    const vc = (o, k) => lam({ vertexColors: true, ...o }, P[k] || {});
    const M = {
      office: vc({ map: T.office, emissive: 0xffffff, emissiveMap: T.officeE, emissiveIntensity: 0 }, 'office'),
      // tipos de edificio del Centro (en la PS2 son la misma fachada)
      office2: vc({ map: T.office2 || T.office, emissive: 0xffffff, emissiveMap: T.office2E || T.officeE, emissiveIntensity: 0 }, T.office2 ? 'office2' : 'office'),
      office3: vc({ map: T.office3 || T.office, emissive: 0xffffff, emissiveMap: T.office3E || T.officeE, emissiveIntensity: 0 }, T.office3 ? 'office3' : 'office'),
      office4: vc({ map: T.office4 || T.office, emissive: 0xffffff, emissiveMap: T.office4E || T.officeE, emissiveIntensity: 0 }, T.office4 ? 'office4' : 'office'),
      house: vc({ map: T.house, emissive: 0xffffff, emissiveMap: T.houseE, emissiveIntensity: 0 }, 'house'),
      shop: vc({ map: T.shop, emissive: 0xffffff, emissiveMap: T.shopE, emissiveIntensity: 0 }, 'shop'),
      metal: vc({ map: T.metal }, 'metal'),
      brick: vc({ map: T.brick }, 'brick'),
      plain: vc({ map: T.plain || null }, 'plain'),
      roof: vc({ map: T.roof }, 'roof'),
      roofFlat: vc({ map: T.roofFlat }, 'roofFlat'),
      pitch: vc({ map: T.pitch, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 }, 'pitch'),
      sidewalk: lam({ map: T.sidewalk, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2 }, P.sidewalk || {}),
      curbFace: lam({ color: 0xb8b4aa, map: T.curb || null }, P.curb || {}),
      grass: lam({ color: T.grass ? 0xffffff : 0x6e7d3e, map: T.grass || null, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2 }, P.grass || {}),
    };
    if (STYLE.realista) {
      // pisos por posición en el mundo; paredes: el color del edificio no tiñe los vidrios
      const GS = STYLE.GROUND_SCALE;
      for (const k of ['sidewalk', 'grass', 'pitch']) { M[k].userData.key = 'c' + k; STYLE.worldUV(M[k], GS[k]); }
      for (const k of ['office', 'office2', 'office3', 'office4', 'house']) STYLE.tintMask(M[k], T[k + 'Mask'] || T.officeMask);
    }
    return M;
  }

  // ---- Ocupación del suelo (cajas orientadas) ----
  obbCorners(o) {
    const bx = -o.az, bz = o.ax;
    return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([s, t]) => [o.cx + o.ax * o.hw * s + bx * o.hd * t, o.cz + o.az * o.hw * s + bz * o.hd * t]);
  }

  overlaps(a, b) {
    const axes = [[a.ax, a.az], [-a.az, a.ax], [b.ax, b.az], [-b.az, b.ax]];
    const dx = b.cx - a.cx, dz = b.cz - a.cz;
    for (const [x, z] of axes) {
      const ra = Math.abs(a.ax * x + a.az * z) * a.hw + Math.abs(-a.az * x + a.ax * z) * a.hd;
      const rb = Math.abs(b.ax * x + b.az * z) * b.hw + Math.abs(-b.az * x + b.ax * z) * b.hd;
      if (Math.abs(dx * x + dz * z) > ra + rb) return false;
    }
    return true;
  }

  occKeys(o) {
    const C = 24;
    const r = Math.hypot(o.hw, o.hd);
    const keys = [];
    for (let i = Math.floor((o.cx - r) / C); i <= Math.floor((o.cx + r) / C); i++) for (let j = Math.floor((o.cz - r) / C); j <= Math.floor((o.cz + r) / C); j++) keys.push(i * 100000 + j);
    return keys;
  }

  isFree(o) {
    for (const k of this.occKeys(o)) {
      const arr = this.occ.get(k);
      if (!arr) continue;
      for (const b of arr) if (this.overlaps(o, b)) return false;
    }
    return true;
  }

  reserve(o) {
    for (const k of this.occKeys(o)) {
      let arr = this.occ.get(k);
      if (!arr) { arr = []; this.occ.set(k, arr); }
      arr.push(o);
    }
  }

  // ---- Marco local (para edificios orientados según la calle) ----
  setFrame(cx, cz, ax, az) { this.fr = { cx, cz, ax, az }; }
  clearFrame() { this.fr = null; }
  W(lx, lz) {
    const f = this.fr;
    if (!f) return [lx, lz];
    return [f.cx + lx * f.ax - lz * f.az, f.cz + lx * f.az + lz * f.ax];
  }
  frameAngle() { return this.fr ? Math.atan2(-this.fr.az, this.fr.ax) : 0; }

  chunkFor(chunks, lx, lz, mat) {
    const [x, z] = this.W(lx, lz);
    const gb = chunks.get(x, z, mat);
    if (this.fr) gb.setFrame(this.fr.cx, this.fr.cz, this.fr.ax, this.fr.az); else gb.clearFrame();
    return gb;
  }

  // Altura de apoyo de un rectángulo local
  footprintHeights(x0, x1, z0, z1) {
    const t = this.terrain;
    const pts = [[x0, z0], [x1, z0], [x0, z1], [x1, z1], [(x0 + x1) / 2, (z0 + z1) / 2]].map(([a, b]) => this.W(a, b));
    const hs = pts.map(([x, z]) => t.heightAt(x, z));
    return { min: Math.min(...hs), max: Math.max(...hs) };
  }

  addCollider(x0, x1, z0, z1, y0, y1, tag) {
    const [cx, cz] = this.W((x0 + x1) / 2, (z0 + z1) / 2);
    const f = this.fr || { ax: 1, az: 0 };
    return this.colliders.addOBB(cx, cz, f.ax, f.az, Math.abs(x1 - x0) / 2, Math.abs(z1 - z0) / 2, y0, y1, tag);
  }

  // ---- Edificio genérico (en coordenadas del marco actual) ----
  addBuilding(chunks, x0, x1, z0, z1, floors, opts = {}) {
    const fh = opts.floorH || 3.2;
    const { min, max } = this.footprintHeights(x0, x1, z0, z1);
    const base = min - 0.6;
    const floor = max + (opts.curb ? CURB : 0.05);
    // opts.shop: planta baja con locales (4 m), los pisos de arriba con la fachada normal
    const shopH = opts.shop ? 4 : 0;
    const top = floor + shopH + (floors - (opts.shop ? 1 : 0)) * fh;
    const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
    const mat = opts.mat || 'office';
    const color = hexColor(opts.color || 0xd8d2c4);
    const gb = this.chunkFor(chunks, cx, cz, mat);
    if (floor - base > 0.3) {
      const pg = this.chunkFor(chunks, cx, cz, 'plain');
      pg.walls(x0, x1, z0, z1, base, floor, hexColor(0x8d877c), 4, 3);
    }
    let uS = 28, vS = 25.6, uOff = 0;
    if (mat === 'house') { uS = 14; vS = fh * 2; uOff = Math.floor(Math.random() * 4) / 4; }
    if (mat.startsWith('office')) { uOff = Math.floor(Math.random() * 8) / 8; }
    if (mat === 'metal') { uS = 3; vS = 3; }
    if (mat === 'brick') { uS = 2.5; vS = 2; }
    if (mat === 'plain') { uS = 4; vS = 3; }
    if (shopH) {
      const sg = this.chunkFor(chunks, cx, cz, 'shop');
      sg.walls(x0, x1, z0, z1, floor, floor + shopH, hexColor(0xffffff), 64, 8, Math.random() < 0.5 ? 0.5 : 0, Math.floor(Math.random() * 8) / 8);
    }
    if (mat === 'house' && floors > 1 && !shopH) {
      // textura de casa: planta baja con puerta (v 0..0.5) y los pisos de arriba solo con ventanas
      gb.walls(x0, x1, z0, z1, floor, floor + fh, color, uS, vS, 0, uOff);
      for (let k = 1; k < floors; k++) gb.walls(x0, x1, z0, z1, floor + k * fh, floor + (k + 1) * fh, color, uS, vS, 0.5, uOff);
    } else if (top > floor + shopH + 0.01) gb.walls(x0, x1, z0, z1, floor + shopH, top, color, uS, vS, (opts.vOff || 0), uOff);
    if (opts.roof === 'gable') {
      const rg = this.chunkFor(chunks, cx, cz, 'roof');
      const along = opts.ridgeX !== undefined ? opts.ridgeX : (x1 - x0) >= (z1 - z0);
      const rise = opts.rise || Math.min(x1 - x0, z1 - z0) * 0.22;
      rg.gable(x0, x1, z0, z1, top, rise, hexColor(opts.roofColor || 0xa33a2a), along, 0.45);
      this.addCollider(x0, x1, z0, z1, base, top + rise, opts.tag || 'building');
      return { top: top + rise, floor, base };
    }
    const rg = this.chunkFor(chunks, cx, cz, 'roofFlat');
    rg.top(x0, x1, z0, z1, top, hexColor(opts.roofColor || 0xaaaaaa), 4);
    if (floors > 1 && (mat.startsWith('office') || mat === 'brick')) {
      const pg = this.chunkFor(chunks, cx, cz, 'plain');
      pg.walls(x0 - 0.15, x1 + 0.15, z0 - 0.15, z1 + 0.15, top - 0.2, top + 0.7, color);
      pg.top(x0 - 0.15, x1 + 0.15, z0 - 0.15, z0 + 0.15, top + 0.7, color);
    }
    if (floors > 3 && Math.random() < 0.6) {
      const pg = this.chunkFor(chunks, cx, cz, 'plain');
      const w = Math.min(4, (x1 - x0) * 0.3), d = Math.min(4, (z1 - z0) * 0.3);
      pg.box(cx - w / 2, cx + w / 2, top, top + 2.2, cz - d / 2, cz + d / 2, hexColor(0x9a9a98));
      if (Math.random() < 0.5) pg.cylinder(cx + w, cz, 1.2, top, top + 3.2, hexColor(0x5c6a74), 8);
    }
    this.addCollider(x0, x1, z0, z1, base, top + 0.7, opts.tag || 'building');
    return { top, floor, base };
  }

  // Cartel (coordenadas locales del marco actual; rotY local)
  addSign(lines, lx, y, lz, w, h, rotY, opts = {}) {
    const tex = signTexture(lines, { ...opts, w: opts.tw || 512, h: opts.th || Math.round(512 * (h / w)) });
    const mat = new THREE.MeshBasicMaterial({ map: tex, side: opts.double ? THREE.DoubleSide : THREE.FrontSide, fog: true });
    mat.userData.sign = true;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    const [x, z] = this.W(lx, lz);
    m.position.set(x, y, z);
    m.rotation.y = rotY + this.frameAngle();
    m.updateMatrix();
    m.matrixAutoUpdate = false;
    this.signs.push(m);
    return m;
  }

  marker(key, lx, lz, extra = {}) {
    const [x, z] = this.W(lx, lz);
    this.markers[key] = { x, z, ...extra };
    return this.markers[key];
  }

  // ------------------------------------------------------------------
  // Veredas con esquinas
  // ------------------------------------------------------------------
  computeTrims() {
    const R = this.roads;
    const trim = new Float32Array(R.edges.length * 4);
    this.trim = trim;
    this.corners = [];
    this.fans = [];
    const setTrim = (e, atA, side, v) => {
      const k = e.id * 4 + (atA ? 0 : 2) + (side > 0 ? 0 : 1);
      if (v > trim[k]) trim[k] = v;
    };
    for (const n of R.nodes) {
      const list = n.edges.map((ei) => {
        const e = R.edges[ei];
        const atA = e.a === n.id;
        const ox = atA ? e.dx : -e.dx, oz = atA ? e.dz : -e.dz;
        return { e, atA, ox, oz, ang: Math.atan2(oz, ox) };
      });
      list.sort((p, q) => p.ang - q.ang);
      const m = list.length;
      for (let k = 0; k < m; k++) {
        const P = list[k], Q = list[(k + 1) % m];
        let delta = m === 1 ? Math.PI * 2 : Q.ang - P.ang;
        if (delta <= 0) delta += Math.PI * 2;
        const sP = P.atA ? 1 : -1, sQ = Q.atA ? -1 : 1;
        const hP = P.e.width / 2, hQ = Q.e.width / 2;
        const pP = hP + (P.e.sw ? SW : 0), pQ = hQ + (Q.e.sw ? SW : 0);
        if (Math.abs(delta - Math.PI) < 0.1) continue;
        if (delta > Math.PI) {
          if (P.e.sw && Q.e.sw) this.fans.push({ n, P, Q, delta, h: (hP + hQ) / 2 });
          continue;
        }
        const nPx = -P.oz, nPz = P.ox, nQx = Q.oz, nQz = -Q.ox;
        const cr = P.ox * Q.oz - P.oz * Q.ox;
        if (Math.abs(cr) < 1e-4) continue;
        const isect = (cP, cQ) => {
          const Rx = nQx * cQ - nPx * cP, Rz = nQz * cQ - nPz * cP;
          const t = (Rx * Q.oz - Rz * Q.ox) / cr;
          const u = (Rx * P.oz - Rz * P.ox) / cr;
          return { t, u, x: n.x + P.ox * t + nPx * cP, z: n.z + P.oz * t + nPz * cP };
        };
        const c = isect(hP, hQ), p = isect(pP, pQ);
        const limP = Math.min(P.e.len * 0.48, 28), limQ = Math.min(Q.e.len * 0.48, 28);
        const tP = clamp(Math.max(c.t, p.t, 0), 0, limP), tQ = clamp(Math.max(c.u, p.u, 0), 0, limQ);
        setTrim(P.e, P.atA, sP, tP);
        setTrim(Q.e, Q.atA, sQ, tQ);
        if (P.e.sw && Q.e.sw) this.corners.push({ n, P, Q, tP, tQ, c, p, hP, hQ, pP, pQ, nPx, nPz, nQx, nQz });
      }
    }
  }

  buildSidewalks() {
    const R = this.roads, t = this.terrain;
    const Y = 0.12;
    const up = (lb, a, b, c) => {
      // triángulo con normal hacia arriba
      const cross = (b[0] - a[0]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[0] - a[0]);
      if (cross < 0) lb.tri(a[0], a[1], a[2], a[0] / 2, a[2] / 2, b[0], b[1], b[2], b[0] / 2, b[2] / 2, c[0], c[1], c[2], c[0] / 2, c[2] / 2);
      else lb.tri(a[0], a[1], a[2], a[0] / 2, a[2] / 2, c[0], c[1], c[2], c[0] / 2, c[2] / 2, b[0], b[1], b[2], b[0] / 2, b[2] / 2);
    };
    const P3 = (x, z) => [x, t.heightAt(x, z) + CURB, z];
    // cara del cordón entre dos puntos de la línea de cordón; (nx,nz) apunta hacia la calle
    const curbFace = (x0, z0, x1, z1, nx, nz) => {
      const lb = this.lean.get((x0 + x1) / 2, (z0 + z1) / 2, 'curbFace');
      const h0 = t.heightAt(x0, z0), h1 = t.heightAt(x1, z1);
      const a = [x0, h0 + Y - 0.08, z0], b = [x1, h1 + Y - 0.08, z1], c = [x1, h1 + CURB, z1], d = [x0, h0 + CURB, z0];
      // orientar hacia la calle
      const ux = x1 - x0, uz = z1 - z0;
      const face = (-uz * nx + ux * nz) > 0; // (0,1,0) x (u) apunta a n?
      if (face) { lb.tri(...a, 0, 0, ...b, 1, 0, ...c, 1, 1); lb.tri(...a, 0, 0, ...c, 1, 1, ...d, 0, 1); }
      else { lb.tri(...a, 0, 0, ...c, 1, 1, ...b, 1, 0); lb.tri(...a, 0, 0, ...d, 0, 1, ...c, 1, 1); }
    };
    // una vereda no puede quedar encima de otra calzada (pasaba en cruces raros y calles muy
    // juntas: "calles cruzadas"). onRoad: el punto está sobre alguna calle (con un margen)
    const onRoad = (x, z) => R.clearance(x, z, 6) < -0.15;
    const triOnRoad = (a, b, c) => onRoad((a[0] + b[0] + c[0]) / 3, (a[2] + b[2] + c[2]) / 3);
    const upOK = (lb, a, b, c) => { if (!triOnRoad(a, b, c)) up(lb, a, b, c); };
    this.sidewalkSkipped = 0;
    for (const e of R.edges) {
      if (!e.sw) continue;
      const A = R.nodes[e.a];
      const h = e.width / 2;
      for (const s of [1, -1]) {
        const t0 = this.trimOf(e, 0, s), t1 = e.len - this.trimOf(e, 1, s);
        if (t1 - t0 < 0.3) continue;
        const nx = -e.dz * s, nz = e.dx * s;
        const n = Math.max(1, Math.ceil((t1 - t0) / 7));
        const lb = this.lean.get(A.x + e.dx * (t0 + t1) / 2, A.z + e.dz * (t0 + t1) / 2, 'sidewalk');
        // tramos de vereda consecutivos que no pisan otra calle (el cordón va por tramo)
        let runStart = -1;
        const flushCurb = (ka, kb) => {
          const ta = t0 + ((t1 - t0) * ka) / n, tb = t0 + ((t1 - t0) * kb) / n;
          curbFace(A.x + e.dx * ta + nx * h, A.z + e.dz * ta + nz * h, A.x + e.dx * tb + nx * h, A.z + e.dz * tb + nz * h, -nx, -nz);
        };
        for (let k = 0; k < n; k++) {
          const ta = t0 + ((t1 - t0) * k) / n, tb = t0 + ((t1 - t0) * (k + 1)) / n;
          const tm = (ta + tb) / 2;
          const mx = A.x + e.dx * tm + nx * (h + SW / 2), mz = A.z + e.dz * tm + nz * (h + SW / 2);
          const ox = A.x + e.dx * tm + nx * (h + SW - 0.3), oz = A.z + e.dz * tm + nz * (h + SW - 0.3);
          if (onRoad(mx, mz) || onRoad(ox, oz)) {
            this.sidewalkSkipped++;
            if (runStart >= 0) { flushCurb(runStart, k); runStart = -1; }
            continue;
          }
          if (runStart < 0) runStart = k;
          const ax = A.x + e.dx * ta, az = A.z + e.dz * ta, bx = A.x + e.dx * tb, bz = A.z + e.dz * tb;
          const i0 = P3(ax + nx * h, az + nz * h), o0 = P3(ax + nx * (h + SW), az + nz * (h + SW));
          const i1 = P3(bx + nx * h, bz + nz * h), o1 = P3(bx + nx * (h + SW), bz + nz * (h + SW));
          up(lb, i0, i1, o1);
          up(lb, i0, o1, o0);
        }
        if (runStart >= 0) flushCurb(runStart, n);
      }
    }
    // esquinas (las de ángulo muy agudo se van lejos del cruce: se descartan)
    for (const c of this.corners) {
      const { n, P, Q, tP, tQ, hP, hQ, pP, pQ, nPx, nPz, nQx, nQz } = c;
      const reach = Math.max(hP, hQ, pP, pQ) * 2.5 + 4;
      if (Math.hypot(c.c.x - n.x, c.c.z - n.z) > reach || Math.hypot(c.p.x - n.x, c.p.z - n.z) > reach) { this.sidewalkSkipped++; continue; }
      const lb = this.lean.get(n.x, n.z, 'sidewalk');
      const Cc = P3(c.c.x, c.c.z), Cp = P3(c.p.x, c.p.z);
      const Pc = P3(n.x + P.ox * tP + nPx * hP, n.z + P.oz * tP + nPz * hP), Pp = P3(n.x + P.ox * tP + nPx * pP, n.z + P.oz * tP + nPz * pP);
      const Qc = P3(n.x + Q.ox * tQ + nQx * hQ, n.z + Q.oz * tQ + nQz * hQ), Qp = P3(n.x + Q.ox * tQ + nQx * pQ, n.z + Q.oz * tQ + nQz * pQ);
      upOK(lb, Cc, Pc, Pp); upOK(lb, Cc, Pp, Cp); upOK(lb, Cc, Cp, Qp); upOK(lb, Cc, Qp, Qc);
      // el cordón solo donde quedó vereda (si no, queda una línea suelta sobre la calle)
      if (!triOnRoad(Cc, Pc, Pp)) curbFace(Cc[0], Cc[2], Pc[0], Pc[2], -nPx, -nPz);
      if (!triOnRoad(Cc, Qp, Qc)) curbFace(Cc[0], Cc[2], Qc[0], Qc[2], -nQx, -nQz);
    }
    // abanicos (lado de afuera de las curvas y puntas de calles sin salida)
    for (const f of this.fans) {
      const { n, P, delta, h } = f;
      const a0 = P.ang + Math.PI / 2, span = delta - Math.PI;
      const seg = Math.max(2, Math.ceil(span / 0.35));
      const lb = this.lean.get(n.x, n.z, 'sidewalk');
      for (let k = 0; k < seg; k++) {
        const b0 = a0 + (span * k) / seg, b1 = a0 + (span * (k + 1)) / seg;
        const i0 = P3(n.x + Math.cos(b0) * h, n.z + Math.sin(b0) * h), o0 = P3(n.x + Math.cos(b0) * (h + SW), n.z + Math.sin(b0) * (h + SW));
        const i1 = P3(n.x + Math.cos(b1) * h, n.z + Math.sin(b1) * h), o1 = P3(n.x + Math.cos(b1) * (h + SW), n.z + Math.sin(b1) * (h + SW));
        if (triOnRoad(i0, i1, o1) && triOnRoad(i0, o1, o0)) { this.sidewalkSkipped++; continue; }
        upOK(lb, i0, i1, o1); upOK(lb, i0, o1, o0);
        const mx = Math.cos((b0 + b1) / 2), mz = Math.sin((b0 + b1) / 2);
        curbFace(i0[0], i0[2], i1[0], i1[2], -mx, -mz);
      }
    }
  }

  // ------------------------------------------------------------------
  // Plazas, canchas, escuelas y cementerios (polígonos reales)
  // ------------------------------------------------------------------
  buildAreas(chunks, rng) {
    const t = this.terrain;
    const Z = this.zones;
    for (const ar of Z.areas) {
      if (!['plaza', 'cancha', 'cementerio'].includes(ar.kind)) continue;
      const pts = ar.pts;
      const contour = [];
      for (let i = 0; i < pts.length; i += 2) contour.push(new THREE.Vector2(pts[i], pts[i + 1]));
      let tris;
      try { tris = THREE.ShapeUtils.triangulateShape(contour, []); } catch (e) { continue; }
      const mat = ar.kind === 'cancha' ? 'pitch' : 'grass';
      const lb = this.lean.get(ar.centroid[0], ar.centroid[1], mat === 'pitch' ? 'grass' : 'grass');
      const y = (x, z) => t.heightAt(x, z) + 0.2;
      const cols = ar.kind === 'cancha';
      for (const [a, b, c] of tris) {
        const A = contour[a], B = contour[b], C = contour[c];
        const pa = [A.x, y(A.x, A.y), A.y], pb = [B.x, y(B.x, B.y), B.y], pc = [C.x, y(C.x, C.y), C.y];
        const cross = (pb[0] - pa[0]) * (pc[2] - pa[2]) - (pb[2] - pa[2]) * (pc[0] - pa[0]);
        if (cross < 0) lb.tri(...pa, 0, 0, ...pb, 1, 0, ...pc, 0, 1); else lb.tri(...pa, 0, 0, ...pc, 0, 1, ...pb, 1, 0);
      }
      void cols;
      if (ar.kind === 'plaza') {
        this.plazas.push(ar);
        // árboles en el perímetro y bancos
        const perim = [];
        for (let i = 0; i < pts.length; i += 2) {
          const j = (i + 2) % pts.length;
          const L = Math.hypot(pts[j] - pts[i], pts[j + 1] - pts[i + 1]);
          for (let d = 4; d < L - 4; d += 11) {
            const f = d / L;
            const x = pts[i] + (pts[j] - pts[i]) * f, z = pts[i + 1] + (pts[j + 1] - pts[i + 1]) * f;
            // hacia adentro
            const [cx, cz] = ar.centroid;
            const k = 4 / (Math.hypot(cx - x, cz - z) || 1);
            perim.push([x + (cx - x) * k, z + (cz - z) * k]);
          }
        }
        for (const [x, z] of perim) if (pointInRing(x, z, pts) && rng.chance(0.8)) this.treeSpots.push([x, z, rng.chance(0.7) ? 'alamo' : 'pino']);
        const [cx, cz] = ar.centroid;
        if (pointInRing(cx, cz, pts) && ar.area > 1500) {
          this.benches.push([cx + 8, cz], [cx - 8, cz], [cx, cz + 8], [cx, cz - 8]);
          if (ar.area > 4000) this.monument(chunks, cx, cz, ar.name);
        }
      }
    }
  }

  monument(chunks, cx, cz, name) {
    const y = this.terrain.heightAt(cx, cz) + 0.2;
    const gb = chunks.get(cx, cz, 'plain').clearFrame();
    gb.box(cx - 3, cx + 3, y, y + 1.2, cz - 3, cz + 3, hexColor(0xb8b0a0));
    gb.box(cx - 1.8, cx + 1.8, y + 1.2, y + 5, cz - 1.8, cz + 1.8, hexColor(0xcfc6b4));
    gb.box(cx - 0.6, cx + 0.6, y + 5, y + 7.4, cz - 0.5, cz + 0.5, hexColor(0x4d5a4a));
    gb.box(cx - 0.35, cx + 0.35, y + 7.4, y + 8.1, cz - 0.35, cz + 0.35, hexColor(0x4d5a4a));
    this.colliders.addBox(cx - 3, cx + 3, cz - 3, cz + 3, y - 1, y + 8, 'monumento');
    this.reserve({ cx, cz, ax: 1, az: 0, hw: 4, hd: 4 });
    void name;
  }

  // ------------------------------------------------------------------
  // Sitios para edificios especiales: lote frente a la calle más cercana
  // ------------------------------------------------------------------
  findSite(x, z, w, d, opts = {}) {
    const R = this.roads;
    const cands = [];
    for (const rad of [40, 90, 160, 260]) {
      for (const e of R.edges) {
        if (!e.sw && !opts.anyRoad) continue;
        if (opts.kinds && !opts.kinds.includes(e.kind)) continue;
        const A = R.nodes[e.a], B = R.nodes[e.b];
        if (Math.min(A.x, B.x) - rad > x || Math.max(A.x, B.x) + rad < x || Math.min(A.z, B.z) - rad > z || Math.max(A.z, B.z) + rad < z) continue;
        const p = pointSegDist(x, z, A.x, A.z, B.x, B.z);
        if (p.d > rad) continue;
        cands.push({ e, p });
      }
      if (cands.length) break;
    }
    cands.sort((a, b) => a.p.d - b.p.d);
    this.lastFail = cands.length ? 'ocupado' : 'sin calles';
    for (const { e, p } of cands.slice(0, 24)) {
      const A = R.nodes[e.a];
      // lado hacia el punto
      const cross = e.dx * (z - A.z) - e.dz * (x - A.x);
      const sides = cross >= 0 ? [1, -1] : [-1, 1];
      for (const s of sides) {
        const tA = this.trimOf(e, 0, s), tB = this.trimOf(e, 1, s);
        const avail = e.len - tA - tB;
        const tt = avail > w ? clamp(p.t * e.len, tA + w / 2, e.len - tB - w / 2) : e.len / 2;
        const nx = -e.dz * s, nz = e.dx * s;
        const front = e.width / 2 + (e.sw ? SW : 1) + (opts.setback || 0.5);
        const ox = A.x + e.dx * tt + nx * front, oz = A.z + e.dz * tt + nz * front;
        const site = { cx: ox, cz: oz, ax: e.dx * s, az: e.dz * s, w, d, e };
        const obb = { cx: ox + nx * d / 2, cz: oz + nz * d / 2, ax: site.ax, az: site.az, hw: w / 2, hd: d / 2 };
        if (!opts.force && !this.isFree(obb)) { this.lastFail = 'ocupado'; continue; }
        if (!opts.force && this.roads.clearance(obb.cx, obb.cz, 30) < Math.min(d, w) / 2 - 1) { this.lastFail = 'calle atrás'; continue; }
        this.reserve(obb);
        site.obb = obb;
        return site;
      }
    }
    return null;
  }

  withSite(site, fn) {
    if (!site) return null;
    this.setFrame(site.cx, site.cz, site.ax, site.az);
    try { return fn(site); } finally { this.clearFrame(); }
  }

  // ------------------------------------------------------------------
  // Edificios especiales (reales y del juego)
  // ------------------------------------------------------------------
  buildSpecials(chunks, rng) {
    const L = LANDMARKS;
    const poi = (key, name, lx, lz) => { const [x, z] = this.W(lx, lz); POI[key] = { x, z, name }; };
    const near = (k, dx = 0, dz = 0) => (L[k] ? [L[k].x + dx, L[k].z + dz] : null);
    const centro = near('catedral') || [-420, -57];
    this.failedSites = [];
    const at = (p, w, d, fn, opts) => {
      const site = this.findSite(p[0], p[1], w, d, opts) || this.findSite(p[0], p[1], w, d, { ...(opts || {}), anyRoad: true });
      if (!site) { this.failedSites.push([Math.round(p[0]), Math.round(p[1]), w, d, this.lastFail]); return null; }
      return this.withSite(site, fn);
    };

    // Comisaría Primera (real)
    at(near('comisariaPrimera') || centro, 26, 22, () => {
      const res = this.addBuilding(chunks, -13, 13, 2, 20, 3, { mat: 'office', color: 0x9fb6d0, curb: true });
      this.addSign(['COMISARÍA PRIMERA'], 0, res.floor + 4.2, 1.95, 16, 1.6, Math.PI, { bg: '#1d3f8f' });
      this.marker('comisaria', 0, -1.5);
      poi('comisaria', 'Comisaría Primera', 0, 0);
    });
    // Hospital Regional (real)
    at(near('hospital') || centro, 40, 30, () => {
      const res = this.addBuilding(chunks, -20, 20, 3, 30, 4, { mat: 'office', color: 0xf2f2ee, curb: true });
      this.addSign(['HOSPITAL REGIONAL'], 0, res.floor + 3.6, 2.95, 18, 1.8, Math.PI, { bg: '#ffffff', fg: '#c01818', borderColor: '#c01818' });
      this.addSign(['+'], 0, res.top - 2, 2.95, 4, 4, Math.PI, { bg: '#ffffff', fg: '#d01010', border: false, tw: 128, th: 128 });
      this.marker('hospital', 0, -1.8);
      poi('hospital', 'Hospital Regional', 0, 0);
    });
    // Catedral San Juan Bosco (real)
    at(near('catedral') || centro, 30, 44, () => {
      const res = this.addBuilding(chunks, -11, 11, 8, 42, 4, { mat: 'plain', color: 0xe8e2d0, curb: true, floorH: 3.5, roof: 'gable', ridgeX: false, roofColor: 0x7a3326, rise: 7 });
      const gb = this.chunkFor(chunks, 0, 4, 'plain');
      gb.box(-4, 4, res.base, res.floor + 30, 0.5, 8.5, hexColor(0xece6d4));
      gb.box(-4.6, 4.6, res.floor + 30, res.floor + 31, -0.1, 9.1, hexColor(0xd8d0bc));
      const rg = this.chunkFor(chunks, 0, 4, 'roof');
      rg.gable(-4, 4, 0.5, 8.5, res.floor + 31, 6, hexColor(0x5d6a70), false, 0.2);
      gb.box(-0.25, 0.25, res.floor + 37, res.floor + 41, 4.25, 4.75, hexColor(0xe8e8e8));
      gb.box(-1.3, 1.3, res.floor + 39.2, res.floor + 39.7, 4.25, 4.75, hexColor(0xe8e8e8));
      // vitrales altos y pilastras a los costados de la nave
      const glass = hexColor(0x34465e), pil = hexColor(0xf4efe2);
      for (let z = 12; z <= 39; z += 4.5) {
        for (const sx of [-1, 1]) {
          const xo = sx * 11;
          gb.box(Math.min(xo, xo + sx * 0.12), Math.max(xo, xo + sx * 0.12), res.floor + 2.4, res.floor + 10.5, z - 0.75, z + 0.75, glass);
          gb.box(Math.min(xo, xo + sx * 0.4), Math.max(xo, xo + sx * 0.4), res.base, res.floor + 13.2, z + 1.9, z + 2.6, pil);
        }
      }
      // campanario: aberturas arriba, puerta y rosetón
      for (const [z0, z1] of [[0.38, 0.5], [8.5, 8.62]]) gb.box(-1.4, 1.4, res.floor + 25, res.floor + 28.5, z0, z1, glass);
      for (const x of [-4.12, 4]) gb.box(x, x + 0.12, res.floor + 25, res.floor + 28.5, 3.1, 5.9, glass);
      gb.box(-1.7, 1.7, res.floor, res.floor + 4.6, 0.36, 0.5, hexColor(0x4a3020));
      gb.box(-1.6, 1.6, res.floor + 8, res.floor + 11.2, 0.36, 0.5, glass);
      this.addCollider(-4, 4, 0.5, 8.5, res.base, res.floor + 40, 'catedral');
      poi('catedral', 'Catedral San Juan Bosco', 0, 20);
    });
    // Terminal de Ómnibus (real)
    at(near('terminal') || centro, 44, 28, () => {
      const res = this.addBuilding(chunks, -20, 20, 10, 27, 2, { mat: 'office', color: 0xc8c0b0, curb: true, floorH: 3.4 });
      const gb = this.chunkFor(chunks, 0, 5, 'plain');
      gb.box(-20, 20, res.top - 1.5, res.top - 1.1, 0.5, 10, hexColor(0x8a8f94));
      for (let x = -18; x <= 18; x += 9) {
        gb.box(x - 0.2, x + 0.2, res.floor, res.top - 1.3, 1.0, 1.4, hexColor(0x6a6f74));
        const [px, pz] = this.W(x, 1.2);
        this.colliders.addCircle(px, pz, 0.3, res.floor - 1, res.top, 'poste');
      }
      this.addSign(['TERMINAL DE ÓMNIBUS'], 0, res.top + 1.2, 12, 22, 2.2, Math.PI, { bg: '#f2f2ee', fg: '#1d3f8f' });
      this.marker('terminal', 0, -1);
      poi('terminal', 'Terminal de Ómnibus', 0, 0);
    });
    // Casino (real)
    at(near('casino') || centro, 30, 24, () => {
      const res = this.addBuilding(chunks, -15, 15, 2, 24, 3, { mat: 'office', color: 0x6a2a3a, curb: true });
      this.addSign(['CASINO CLUB'], 0, res.floor + 5, 1.95, 14, 2.2, Math.PI, { bg: '#1a1a1a', fg: '#f2c230' });
      poi('casino', 'Casino Club', 0, 0);
    });
    // Museo Nacional del Petróleo (Km 3, real) con la torre del Pozo N°2
    at(near('museoPetroleo') || [-240, -1583], 40, 50, () => {
      const res = this.addBuilding(chunks, -14, 14, 2, 22, 1, { mat: 'brick', floorH: 4, color: 0xd8c8b8, roof: 'gable', roofColor: 0x7a3326, rise: 2.5 });
      this.addSign(['MUSEO NACIONAL DEL PETRÓLEO'], 0, res.floor + 3.2, 1.95, 14, 1.4, Math.PI, { bg: '#2a2a2a', fg: '#f2c230' });
      this.derrick(chunks, 0, 38);
      this.marker('museo', 0, -1);
      poi('museo', 'Museo del Petróleo', 0, 0);
    });
    // El Chori del Viento: carrito en la costanera, frente a la Plaza de la Soberanía
    at(near('plazaSoberania') || near('puerto') || centro, 8, 7, () => {
      const y = this.terrain.heightAt(...this.W(0, 3.5)) + 0.05;
      const gb = this.chunkFor(chunks, 0, 3.5, 'plain');
      gb.box(-1.6, 1.6, y, y + 2.4, 1.5, 5.5, hexColor(0xd8c8a0));
      gb.box(-1.9, 1.9, y + 2.4, y + 2.6, 1.2, 5.8, hexColor(0xc02020));
      this.addCollider(-1.6, 1.6, 1.5, 5.5, y - 1, y + 2.6, 'kiosco');
      this.addSign(['EL CHORI DEL VIENTO'], 0, y + 2.1, 1.45, 3.4, 0.55, Math.PI, { bg: '#c02020', fg: '#fff3c0' });
      poi('chori', 'El Chori del Viento', 0, -0.8);
    }, { setback: 0.2 });
    // La Anómala (supermercado): Centro
    at([centro[0] - 120, centro[1] + 90], 34, 26, () => {
      const res = this.addBuilding(chunks, -17, 17, 2, 26, 2, { mat: 'metal', color: 0xe8e4dc, curb: true, floorH: 3.8 });
      this.addSign(['LA ANÓMALA', 'SUPERMERCADOS'], 0, res.top - 2, 1.95, 20, 4, Math.PI, { bg: '#1c5aa8', fg: '#ffffff', sizes: [70, 36] });
      this.marker('anomala', 0, -2.5);
      poi('anomala', 'La Anómala', 0, 0);
    });
    // Armería La Patagónica
    at([centro[0] + 60, centro[1] + 140], 18, 16, () => {
      const res = this.addBuilding(chunks, -9, 9, 1, 16, 2, { mat: 'brick', color: 0xd8c8b8, curb: true });
      this.addSign(['ARMERÍA', 'LA PATAGÓNICA'], 0, res.floor + 3.4, 0.95, 10, 2.2, Math.PI, { bg: '#2d2d2d', fg: '#f0c040' });
      this.marker('armeria', 0, -1.5);
      poi('armeria', 'Armería La Patagónica', 0, 0);
    });
    // Pizzería La Tuerca
    at([centro[0] + 190, centro[1] + 60], 18, 16, () => {
      const res = this.addBuilding(chunks, -9, 9, 1, 16, 2, { mat: 'brick', color: 0xe0c8a8, curb: true });
      this.addSign(['PIZZERÍA LA TUERCA'], 0, res.floor + 3.3, 0.95, 14, 1.6, Math.PI, { bg: '#b8281c', fg: '#fff3c0' });
      this.marker('pizzeria', 0, -1.5);
      poi('pizzeria', 'Pizzería La Tuerca', 0, 0);
    });
    // Remisería El Viento
    at(near('terminal', -60, 40) || centro, 20, 18, () => {
      const res = this.addBuilding(chunks, -10, 10, 1, 18, 1, { mat: 'brick', color: 0xd0c8b8, curb: true, floorH: 3.6 });
      this.addSign(['REMISERÍA', 'EL VIENTO'], 0, res.floor + 2.8, 0.95, 8, 2, Math.PI, { bg: '#1a6b2a', fg: '#ffffff' });
      this.marker('remiseria', 0, -2.5);
      poi('remiseria', 'Remisería El Viento', 0, 0);
    });
    // Torre Crudo (la petrolera del villano)
    at(near('torreGreyFox', 90, 70) || centro, 30, 30, () => {
      const res = this.addBuilding(chunks, -14, 14, 1, 29, 24, { mat: 'office', color: 0x5f7f9a, curb: true });
      this.addSign(['TORRE CRUDO'], 0, res.top - 3, 0.95, 22, 3, Math.PI, { bg: '#111418', fg: '#e8c060' });
      this.addSign(['PETROLERA CRUDO S.A.'], 0, res.floor + 5, 0.95, 16, 1.8, Math.PI, { bg: '#111418', fg: '#e8c060' });
      this.marker('torreCrudo', 0, -2.5);
      poi('torreCrudo', 'Torre Crudo', 0, 0);
    });
    // Edificios altos reales del Centro
    for (const [k, fl, col] of [['torreGreyFox', 18, 0x4a6a80], ['siglo21', 16, 0xb8b0a0], ['concejo', 3, 0xe8dcc8]]) {
      const lm = L[k];
      if (!lm) continue;
      at([lm.x, lm.z], 24, 22, () => {
        this.addBuilding(chunks, -11, 11, 1, 21, fl, { mat: 'office', color: col, curb: true });
        if (k === 'concejo') this.addSign(['CONCEJO DELIBERANTE'], 0, 4.5 + this.terrain.heightAt(lm.x, lm.z), 0.95, 12, 1.2, Math.PI, { bg: '#f2eee4', fg: '#2a2a2a' });
      });
    }

    // Casa de la Abuela y garage del Petroca (Barrio Pietrobelli)
    const pietro = this.zones.zones.find((zz) => /Pietrobelli/.test(zz.name));
    const pc = pietro ? pietro.centroid : [centro[0] - 300, centro[1] - 250];
    at(pc, 30, 30, () => {
      this.addBuilding(chunks, -14, -3, 4, 17, 1, { mat: 'house', floorH: 2.8, color: 0xf0c8d0, roof: 'gable', roofColor: 0x2f6b3a, ridgeX: true, rise: 2 });
      const gar = this.addBuilding(chunks, 1, 13, 2, 14, 1, { mat: 'metal', floorH: 3.4, color: 0xb9c4c8, roof: 'flat' });
      const gb = this.chunkFor(chunks, 7, 2, 'plain');
      gb.box(3, 11, gar.floor, gar.floor + 3, 1.9, 2.0, hexColor(0x6a3a2a));
      this.addSign(['GARAGE PETROCA'], 7, gar.floor + 3.25, 1.85, 6, 0.6, Math.PI, { bg: '#f2c230', fg: '#222' });
      this.addSign(['ACÁ VIVE LA ABUELA'], -8.5, 2.6 + this.terrain.heightAt(...this.W(-8.5, 3.95)), 3.9, 3, 0.5, Math.PI, { bg: '#fff5e0', fg: '#5a2a2a', italic: true });
      this.marker('casaAbuela', -8.5, -1.3);
      this.marker('garagePetroca', 7, -3);
      poi('casaAbuela', 'Casa de la Abuela', -8.5, 2);
      poi('garagePetroca', 'Garage del Petroca', 7, 0);
    });

    // La Madriguera: cancha del Club Jorge Newbery (real)
    this.buildMadriguera(chunks);

    // Gimnasio y Chapa y Pintura Don Tito: zona industrial más cercana al Centro
    const inds = this.zones.areas.filter((a) => a.kind === 'industrial').sort((a, b) => Math.hypot(a.centroid[0] - centro[0], a.centroid[1] - centro[1]) - Math.hypot(b.centroid[0] - centro[0], b.centroid[1] - centro[1]));
    const ind = inds[0] ? inds[0].centroid : [centro[0] - 500, centro[1] + 300];
    at(ind, 34, 26, () => {
      const res = this.addBuilding(chunks, -16, 16, 2, 24, 2, { mat: 'metal', color: 0xd06a3a, floorH: 3.4, roof: 'gable', roofColor: 0x9aa0a4, rise: 1.5 });
      this.addSign(['GIMNASIO', 'MÚSCULO PATAGÓNICO'], 0, res.floor + 4.5, 1.95, 14, 2.6, Math.PI, { bg: '#222222', fg: '#ff9030' });
      this.marker('gimnasio', 0, -1.5);
      poi('gimnasio', 'Gimnasio Músculo Patagónico', 0, 0);
    });
    at([ind[0] + 60, ind[1] + 40], 34, 30, () => {
      const { min, max } = this.footprintHeights(-16, 16, 0.5, 28);
      const y0 = min - 0.5, y1 = max + 5.5;
      const gb = this.chunkFor(chunks, 0, 14, 'metal');
      const col = hexColor(0x3f6fa8);
      const th = 0.5;
      gb.box(-16, -16 + th, y0, y1, 0.5, 28, col, 3, 3);
      gb.box(16 - th, 16, y0, y1, 0.5, 28, col, 3, 3);
      gb.box(-16, 16, y0, y1, 28 - th, 28, col, 3, 3);
      const rf = this.chunkFor(chunks, 0, 14, 'roofFlat');
      rf.box(-16.3, 16.3, y1, y1 + 0.4, 0.2, 28.3, hexColor(0xa0a0a0));
      this.addCollider(-16, -16 + th, 0.5, 28, y0, y1 + 0.4, 'chapa');
      this.addCollider(16 - th, 16, 0.5, 28, y0, y1 + 0.4, 'chapa');
      this.addCollider(-16, 16, 28 - th, 28, y0, y1 + 0.4, 'chapa');
      this.addSign(['CHAPA Y PINTURA', 'DON TITO'], 0, y1 - 1, 0.45, 14, 2.4, Math.PI, { bg: '#f0f0f0', fg: '#1d4f9f' });
      // rectángulo del taller en coordenadas del mundo (caja orientada)
      const [cx, cz] = this.W(0, 13);
      this.marker('chapa', 0, 12, { obb: { cx, cz, ax: this.fr.ax, az: this.fr.az, hw: 15, hd: 12 } });
      poi('chapa', 'Chapa y Pintura Don Tito', 0, 0);
    });

    // Depósito de Don Crudo: zona industrial de Km 3
    const km3 = L.museoPetroleo ? [L.museoPetroleo.x, L.museoPetroleo.z] : [-240, -1583];
    const indK = this.zones.areas.filter((a) => a.kind === 'industrial').sort((a, b) => Math.hypot(a.centroid[0] - km3[0], a.centroid[1] - km3[1]) - Math.hypot(b.centroid[0] - km3[0], b.centroid[1] - km3[1]))[0];
    at(indK ? indK.centroid : [km3[0] + 150, km3[1] + 80], 30, 20, () => {
      this.addBuilding(chunks, -14, 14, 2, 18, 2, { mat: 'metal', floorH: 3.5, color: 0x6a6f74, roof: 'gable', roofColor: 0x4a4f54, rise: 1.5 });
      this.addSign(['DEPÓSITO CRUDO S.A.'], 0, this.terrain.heightAt(...this.W(0, 2)) + 8.5, 1.9, 12, 1.4, Math.PI, { bg: '#111418', fg: '#e8c060' });
      poi('depositoCrudo', 'Depósito de Don Crudo', 0, 0);
    });

    // La Mansión de los Chetos (Rada Tilly, cerca de la costa)
    const rada = L.rada ? [L.rada.x, L.rada.z] : [-2870, 2920];
    const coastward = this.towardSea(rada[0], rada[1], 260);
    at(coastward, 34, 30, () => {
      const res = this.addBuilding(chunks, -16, 16, 6, 22, 2, { mat: 'house', floorH: 3.2, color: 0xf7f5f0, roof: 'flat', roofColor: 0x9d9890 });
      const [px, pz] = this.W(0, 26);
      const y = this.terrain.heightAt(px, pz) + 0.25;
      const gb = this.chunkFor(chunks, 0, 26, 'plain');
      gb.box(-7, 7, y - 0.2 - this.terrain.heightAt(px, pz), y - this.terrain.heightAt(px, pz), 23, 29, hexColor(0x3aa8d8));
      this.addSign(['PROPIEDAD PRIVADA — CHETOS'], 0, res.floor + 3, 5.95, 9, 0.9, Math.PI, { bg: '#7b2d8b', fg: '#ffffff' });
      this.marker('mansion', 0, -2);
      poi('mansionChetos', 'La Mansión de los Chetos', 0, 10);
    });
  }

  // Busca un punto de tierra a ~d metros del punto yendo hacia el mar
  towardSea(x, z, d) {
    const t = this.terrain;
    let best = [x, z], bs = t.seaDist(x, z);
    for (let k = 0; k < 16; k++) {
      const a = (k / 16) * Math.PI * 2;
      const px = x + Math.cos(a) * d, pz = z + Math.sin(a) * d;
      const s = t.seaDist(px, pz);
      if (s > 40 && s < bs) { bs = s; best = [px, pz]; }
    }
    return best;
  }

  // Torre de perforación de madera (Pozo N°2, 13 de diciembre de 1907)
  derrick(chunks, lx, lz) {
    const [wx, wz] = this.W(lx, lz);
    const y = this.terrain.heightAt(wx, wz);
    const gb = this.chunkFor(chunks, lx, lz, 'plain');
    const wood = hexColor(0x5a4030);
    const H = 22, B = 3.2, Tp = 0.8;
    const yb = y - (this.fr ? 0 : 0);
    for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const steps = 11;
      for (let k = 0; k < steps; k++) {
        const t0 = k / steps, t1 = (k + 1) / steps;
        const w0 = B + (Tp - B) * t0, w1 = B + (Tp - B) * t1;
        const x0 = lx + sx * w0, z0 = lz + sz * w0, x1 = lx + sx * w1, z1 = lz + sz * w1;
        gb.box(Math.min(x0, x1) - 0.15, Math.max(x0, x1) + 0.15, yb + H * t0, yb + H * t1, Math.min(z0, z1) - 0.15, Math.max(z0, z1) + 0.15, wood);
      }
    }
    for (let k = 1; k < 6; k++) {
      const t0 = k / 6, w = B + (Tp - B) * t0, yy = yb + H * t0;
      gb.box(lx - w, lx + w, yy, yy + 0.2, lz - w, lz - w + 0.2, wood);
      gb.box(lx - w, lx + w, yy, yy + 0.2, lz + w - 0.2, lz + w, wood);
      gb.box(lx - w, lx - w + 0.2, yy, yy + 0.2, lz - w, lz + w, wood);
      gb.box(lx + w - 0.2, lx + w, yy, yy + 0.2, lz - w, lz + w, wood);
    }
    this.addCollider(lx - B, lx + B, lz - B, lz + B, y - 1, y + H, 'torre');
    this.addSign(['POZO N°2 — 13 DIC 1907'], lx, y + 1.4, lz - B - 0.8, 5, 0.7, Math.PI, { bg: '#f2e8c8', fg: '#3a2a1a', double: true });
  }

  // La Madriguera (Club Atlético Jorge Newbery), sobre el polígono real de la cancha
  buildMadriguera(chunks) {
    const lm = LANDMARKS.madriguera;
    let cx, cz, ax = 1, az = 0, hl = 45, hw = 30;
    if (lm && lm.poly && lm.poly.length > 3) {
      const P = lm.poly;
      cx = P.reduce((s, p) => s + p[0], 0) / P.length; cz = P.reduce((s, p) => s + p[1], 0) / P.length;
      // eje principal (PCA)
      let sxx = 0, szz = 0, sxz = 0;
      for (const [x, z] of P) { sxx += (x - cx) ** 2; szz += (z - cz) ** 2; sxz += (x - cx) * (z - cz); }
      const ang = 0.5 * Math.atan2(2 * sxz, sxx - szz);
      ax = Math.cos(ang); az = Math.sin(ang);
      let mu = 0, mv = 0;
      for (const [x, z] of P) { mu = Math.max(mu, Math.abs((x - cx) * ax + (z - cz) * az)); mv = Math.max(mv, Math.abs(-(x - cx) * az + (z - cz) * ax)); }
      hl = Math.max(28, mu); hw = Math.max(18, mv);
    } else if (lm) { cx = lm.x; cz = lm.z; } else { cx = -1258; cz = 79; }
    this.setFrame(cx, cz, ax, az);
    const t = this.terrain;
    const pw = Math.min(hl - 6, 34), pd = Math.min(hw - 6, 22);
    const y = t.heightAt(cx, cz) + 0.28;
    const gb = this.chunkFor(chunks, 0, 0, 'pitch');
    const n = 6;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const x0 = -pw + (2 * pw * i) / n, x1 = -pw + (2 * pw * (i + 1)) / n;
      const z0 = -pd + (2 * pd * j) / n, z1 = -pd + (2 * pd * (j + 1)) / n;
      gb.quad([x0, y, z1], [x1, y, z1], [x1, y, z0], [x0, y, z0], [x0 / 6, z1 / 6], [x1 / 6, z1 / 6], [x1 / 6, z0 / 6], [x0 / 6, z0 / 6], [1, 1, 1]);
    }
    const pl = this.chunkFor(chunks, 0, 0, 'plain');
    const white = hexColor(0xf2f2f2);
    const line = (x0, x1, z0, z1) => pl.box(x0, x1, y, y + 0.03, z0, z1, white);
    line(-pw, pw, -pd, -pd + 0.2); line(-pw, pw, pd - 0.2, pd);
    line(-pw, -pw + 0.2, -pd, pd); line(pw - 0.2, pw, -pd, pd);
    line(-0.1, 0.1, -pd, pd);
    for (const s of [-1, 1]) {
      const gx = s * (pw - 0.3);
      pl.box(gx - 0.1, gx + 0.1, y, y + 2.4, -3.6, -3.4, white);
      pl.box(gx - 0.1, gx + 0.1, y, y + 2.4, 3.4, 3.6, white);
      pl.box(gx - 0.1, gx + 0.1, y + 2.3, y + 2.5, -3.6, 3.6, white);
      for (const zz of [-3.5, 3.5]) { const [px, pz] = this.W(gx, zz); this.colliders.addCircle(px, pz, 0.15, y - 1, y + 2.5, 'arco'); }
    }
    const navy = hexColor(0x1c2f6b), wh = hexColor(0xe8e8e8);
    for (const s of [-1, 1]) {
      const z0 = s < 0 ? -pd - 7 : pd + 2.5, z1 = s < 0 ? -pd - 2.5 : pd + 7;
      for (let k = 0; k < 4; k++) {
        const yy = y + k * 0.7;
        // cada escalón más alto queda más lejos de la cancha
        const za = s < 0 ? z0 : z0 + k * 1.1, zb = s < 0 ? z1 - k * 1.1 : z1;
        pl.box(-pw + 2, pw - 2, yy, yy + 0.7, za, zb, k % 2 ? navy : wh);
      }
      this.addCollider(-pw + 2, pw - 2, z0, z1, y - 1, y + 2.8, 'tribuna');
    }
    const wallH = 3.2, m = 1.5;
    const X0 = -pw - 6 - m, X1 = pw + 6 + m, Z0 = -pd - 8 - m, Z1 = pd + 8 + m;
    const wall = (x0, x1, z0, z1) => {
      pl.box(x0, x1, y - 1, y + wallH, z0, z1, wh);
      pl.box(x0 - 0.02, x1 + 0.02, y + 1.1, y + 2.0, z0 - 0.02, z1 + 0.02, navy);
      this.addCollider(x0, x1, z0, z1, y - 1, y + wallH, 'paredon');
    };
    wall(X0, X1, Z0, Z0 + 0.3);
    wall(X0, X1, Z1 - 0.3, Z1);
    wall(X0, X0 + 0.3, Z0, -4);
    wall(X0, X0 + 0.3, 4, Z1);
    wall(X1 - 0.3, X1, Z0, Z1);
    this.addSign(['LA MADRIGUERA'], X0 - 0.05, y + 4.3, 0, 12, 1.6, -Math.PI / 2, { bg: '#1c2f6b', fg: '#ffffff' });
    this.addSign(['CLUB ATLÉTICO JORGE NEWBERY'], X1 + 0.05, y + 2.3, 0, 16, 1.2, Math.PI / 2, { bg: '#ffffff', fg: '#1c2f6b' });
    // la entrada, con el marco de la cancha (las misiones ubican cosas relativas a ella)
    this.marker('madriguera', X0 - 1.5, 0, { cx, cz, ax, az, pw, pd, gy: y });
    const [mx, mz] = this.W(0, 0);
    POI.madriguera = { x: mx, z: mz, name: 'La Madriguera' };
    this.reserve({ cx, cz, ax, az, hw: X1 + 1, hd: Z1 + 1 });
    this.clearFrame();
  }

  // ------------------------------------------------------------------
  // Puerto: muelles reales, galpones y contenedores
  // ------------------------------------------------------------------
  buildPuerto(chunks, rng) {
    const t = this.terrain;
    for (const d of DECKS) {
      this.setFrame(d.cx, d.cz, d.ax, d.az);
      const gb = this.chunkFor(chunks, 0, 0, 'plain');
      gb.box(-d.hw, d.hw, d.h - 0.5, d.h, -d.hd, d.hd, hexColor(0x8a8680));
      for (let x = -d.hw + 3; x < d.hw; x += 8) for (const zz of [-d.hd + 0.6, d.hd - 0.6]) gb.box(x - 0.35, x + 0.35, -8, d.h - 0.5, zz - 0.35, zz + 0.35, hexColor(0x5a5650));
      this.clearFrame();
    }
    // el puerto va en la base del muelle largo real (si está en los datos)
    const pier = findPortPier(t);
    const pt = pier ? { x: pier.x - pier.dx * 70, z: pier.z - pier.dz * 70 } : LANDMARKS.puerto || LANDMARKS.museoFerro;
    if (!pt) return;
    // galpones del puerto
    for (let k = 0; k < 4; k++) {
      this.withSite(this.findSite(pt.x + rng.range(-120, 120), pt.z + rng.range(-80, 80), 40, 26, { setback: 4 }), () => {
        this.addBuilding(chunks, -18, 18, 2, 24, 3, { mat: 'metal', color: rng.pick(PAL.metal), floorH: 3.2, roof: 'gable', roofColor: 0x8d9296, rise: 1.8 });
        if (k === 0) this.addSign(['PUERTO COMODORO'], 0, t.heightAt(...this.W(0, 2)) + 12, 1.95, 18, 2, Math.PI, { bg: '#1d3f8f', fg: '#ffffff' });
        if (k === 1) this.addSign(['PESQUERA SAN JORGE'], 0, t.heightAt(...this.W(0, 2)) + 10, 1.95, 14, 1.6, Math.PI, { bg: '#f2f2ee', fg: '#1a4f7a' });
      });
    }
    // playa de contenedores sobre tierra firme cerca del puerto
    const cols = [0xb03020, 0x2050a0, 0x208050, 0xd09020, 0x707070, 0xe06020, 0x9a2a6a];
    // probar varios lotes alrededor hasta dar con uno en tierra firme
    const dry = (x, z) => t.heightAt(x, z) >= 1.5 && t.seaDist(x, z) >= 12;
    let site = null;
    for (const [ox, oz] of [[60, 60], [-60, 60], [60, -60], [-60, -60], [120, 0], [0, 120], [-120, 0], [0, -120], [150, 90], [-150, 90]]) {
      const s = this.findSite(pt.x + ox, pt.z + oz, 80, 20, { setback: 3 });
      if (!s) continue;
      this.setFrame(s.cx, s.cz, s.ax, s.az);
      let ok = 0;
      for (let i = 0; i < 12; i++) if (dry(...this.W(-33 + (i % 6) * 13, 4 + Math.floor(i / 6) * 6))) ok++;
      this.clearFrame();
      if (ok >= 10) { site = s; break; }
    }
    if (site) {
      this.setFrame(site.cx, site.cz, site.ax, site.az);
      const rot = this.frameAngle();
      for (let i = 0; i < 12; i++) {
        const lx = -33 + (i % 6) * 13, lz = 4 + Math.floor(i / 6) * 6;
        const [x, z] = this.W(lx, lz);
        // solo sobre tierra firme y seca (no en la bajada a la playa)
        if (!dry(x, z)) continue;
        const stack = rng.int(1, 3);
        for (let s = 0; s < stack; s++) this.containers.push({ x, z, y: t.heightAt(x, z) + s * 2.6, color: rng.pick(cols), rot });
        this.addCollider(lx - 6.1, lx + 6.1, lz - 1.25, lz + 1.25, -2, t.heightAt(x, z) + stack * 2.6, 'container');
      }
      this.clearFrame();
    }
  }

  // ------------------------------------------------------------------
  // Afuera: estaciones de servicio reales, campamento, aeropuerto, carteles
  // ------------------------------------------------------------------
  buildOutside(chunks, rng, T) {
    const t = this.terrain;
    void T;
    // Estaciones de servicio (posiciones reales de OSM)
    const fuel = (META.fuel || []).slice(0, 14);
    for (const [fx, fz, brand] of fuel) {
      this.withSite(this.findSite(fx, fz, 30, 24, { anyRoad: true, setback: 2 }), () => {
        const y = t.heightAt(...this.W(0, 10));
        const gb = this.chunkFor(chunks, 0, 10, 'plain');
        const blue = hexColor(0x1b4fa0);
        gb.box(-9, 9, y + 5, y + 5.8, 4, 16, hexColor(0xf2f2f2));
        gb.box(-9.05, 9.05, y + 5.2, y + 5.6, 3.95, 16.05, blue);
        for (const [ox, oz] of [[-6, 7], [6, 7], [-6, 13], [6, 13]]) {
          gb.box(ox - 0.3, ox + 0.3, y, y + 5, oz - 0.3, oz + 0.3, hexColor(0xe0e0e0));
          const [px, pz] = this.W(ox, oz);
          this.colliders.addCircle(px, pz, 0.4, y - 1, y + 5, 'surtidor');
        }
        for (const ox of [-3, 3]) {
          gb.box(ox - 0.5, ox + 0.5, y, y + 1.6, 9.4, 10.6, blue);
          this.addCollider(ox - 0.5, ox + 0.5, 9.4, 10.6, y - 1, y + 1.6, 'surtidor');
        }
        const [gx, gz] = this.W(0, 10);
        this.gasPumps.push({ x: gx, z: gz });
        const label = /shell/i.test(brand) ? 'SHEL' : /axion|esso/i.test(brand) ? 'AXIÓN' : 'YPZ';
        this.addSign([label], 0, y + 5.4, 3.93, 5, 0.8, Math.PI, { bg: '#1b4fa0', fg: '#ffffff', border: false });
        this.addBuilding(chunks, -6, 6, 18, 23.5, 1, { mat: 'office', color: 0xf2f2f2, floorH: 3.4 });
      });
    }
    // Campamento petrolero en la meseta (junto al pozo más alejado de la costa con camino)
    const wells = this.wells || [];
    let camp = null, cs = -1;
    for (const [wx, wz] of wells) {
      const s = t.seaDist(wx, wz);
      if (s > cs && this.roads.nearestEdge(wx, wz, 60)) { cs = s; camp = [wx, wz]; }
    }
    if (camp) {
      this.withSite(this.findSite(camp[0], camp[1], 36, 24, { anyRoad: true, setback: 4 }), () => {
        for (let i = 0; i < 4; i++) {
          const x = (i % 2) * 14 - 7, z = 5 + Math.floor(i / 2) * 9;
          this.addBuilding(chunks, x - 5.5, x + 5.5, z - 1.4, z + 1.4, 1, { mat: 'metal', floorH: 2.7, color: 0xf2f2f2, roof: 'flat' });
        }
        this.addSign(['PETROLERA SAN JORGE — CAMPAMENTO'], 0, t.heightAt(...this.W(0, 1)) + 4.2, 0.5, 12, 1.1, Math.PI, { bg: '#f26a1b', fg: '#ffffff', double: true });
        const [x, z] = this.W(0, 10);
        POI.yacimiento = { x, z, name: 'Campamento Petrolero' };
      });
    }
    // Aeropuerto: pistas reales y terminal
    for (const rw of META.runways || []) {
      const P = rw.pts;
      for (let k = 0; k < P.length - 1; k++) {
        const [x0, z0] = P[k], [x1, z1] = P[k + 1];
        const L = Math.hypot(x1 - x0, z1 - z0);
        if (L < 5) continue;
        const ax = (x1 - x0) / L, az = (z1 - z0) / L;
        this.setFrame((x0 + x1) / 2, (z0 + z1) / 2, ax, az);
        const pg = this.chunkFor(chunks, 0, 0, 'plain');
        const w = rw.w / 2;
        for (let s = -L / 2; s < L / 2; s += 20) {
          const e = Math.min(L / 2, s + 20);
          const hh = (lx, lz) => t.heightAt(...this.W(lx, lz)) + 0.1;
          pg.quad([s, hh(s, w), w], [e, hh(e, w), w], [e, hh(e, -w), -w], [s, hh(s, -w), -w], [0, 0], [1, 0], [1, 1], [0, 1], hexColor(0x4a4b4e));
          if (Math.round(s / 20) % 2 === 0) pg.quad([s + 4, hh(s, 0) + 0.02, 0.5], [s + 14, hh(s, 0) + 0.02, 0.5], [s + 14, hh(s, 0) + 0.02, -0.5], [s + 4, hh(s, 0) + 0.02, -0.5], [0, 0], [1, 0], [1, 1], [0, 1], hexColor(0xe8e8e0));
        }
        this.reserve({ cx: (x0 + x1) / 2, cz: (z0 + z1) / 2, ax, az, hw: L / 2, hd: w + 5 });
        this.clearFrame();
      }
    }
    const ap = LANDMARKS.aeropuerto;
    if (ap) {
      this.withSite(this.findSite(ap.x, ap.z, 60, 30, { anyRoad: true, setback: 6 }), () => {
        const res = this.addBuilding(chunks, -30, 20, 2, 20, 2, { mat: 'office', color: 0xd8d8d0, floorH: 4 });
        const gb = this.chunkFor(chunks, 26, 10, 'plain');
        gb.box(24, 28, res.base, res.floor + 18, 8, 12, hexColor(0xd8d8d0));
        gb.box(22.5, 29.5, res.floor + 18, res.floor + 21, 6.5, 13.5, hexColor(0x3a5a6a));
        this.addCollider(24, 28, 8, 12, res.base, res.floor + 21, 'torre');
        this.addSign(['AEROPUERTO GRAL. MOSCONI'], -5, res.floor + 6.5, 1.9, 20, 1.6, Math.PI, { bg: '#f2f2ee', fg: '#1d3f8f' });
      });
    }
    // Carteles de bienvenida sobre la Ruta 3
    const ruta = this.roads.edges.filter((e) => e.kind === 'ruta' && /3/.test(e.name));
    const signAt = (x, z, lines, sizes) => {
      const n = this.roads.nearestEdge(x, z, 400, (e) => e.kind === 'ruta');
      if (!n) return;
      const e = n.edge;
      const off = e.width / 2 + 5;
      const px = n.x - e.dz * off, pz = n.z + e.dx * off;
      this.setFrame(px, pz, -e.dz, e.dx);
      const y = t.heightAt(px, pz);
      const gb = this.chunkFor(chunks, 0, 0, 'plain');
      gb.box(-6.2, -5.8, y, y + 3.4, -0.2, 0.2, hexColor(0x777777));
      gb.box(5.8, 6.2, y, y + 3.4, -0.2, 0.2, hexColor(0x777777));
      for (const lx of [-6, 6]) { const [px2, pz2] = this.W(lx, 0); this.colliders.addCircle(px2, pz2, 0.3, y - 1, y + 3.4, 'cartel'); }
      this.addSign(lines, 0, y + 5, 0, 14, 3, Math.PI / 2, { bg: '#1d6b3a', fg: '#ffffff', sizes, double: true });
      this.clearFrame();
    };
    if (LANDMARKS.caleta) signAt(LANDMARKS.caleta.x - 250, LANDMARKS.caleta.z + 700, ['BIENVENIDOS A COMODORO RIVADAVIA', 'CAPITAL NACIONAL DEL PETRÓLEO'], [40, 40]);
    if (LANDMARKS.rada) signAt(LANDMARKS.rada.x + 250, LANDMARKS.rada.z - 450, ['RADA TILLY', 'LA VILLA BALNEARIA MÁS AUSTRAL'], [52, 30]);
    // Carteles publicitarios (parodias) a lo largo de la Ruta 3
    const ads = [
      [['FERNET BRANCALEONE', 'EL QUE VA CON COCA'], '#101010', '#f0f0f0'],
      [['QUILMEZ', 'EL SABOR DEL ENCUENTRO... CON EL VIENTO'], '#1a3a8a', '#ffffff'],
      [['CTE MÓVIL', 'AHORA CON SEÑAL EN EL CHENQUE (A VECES)'], '#d01818', '#ffffff'],
      [['TOYODA JILUX', 'PARA EL PETROLERO QUE SE LO MERECE'], '#f2f2f2', '#d01818'],
      [['RADIO CUMBIA VILLERA 104.5', '¡EL AGUANTE DEL SUR!'], '#6a1a8a', '#ffe040'],
      [['VAMOS EL LOBO', 'AGUANTE NEWBERY'], '#1c2f6b', '#ffffff'],
    ];
    const longRuta = ruta.filter((e) => e.len > 40);
    for (let i = 0; i < ads.length && longRuta.length; i++) {
      const e = longRuta[Math.floor(((i + 0.5) / ads.length) * longRuta.length)];
      const A = this.roads.nodes[e.a];
      const s = i % 2 ? 1 : -1;
      const off = e.width / 2 + 9;
      const x = A.x + e.dx * e.len / 2 - e.dz * off * s, z = A.z + e.dz * e.len / 2 + e.dx * off * s;
      if (this.roads.clearance(x, z, 15) < 4) continue;
      const [lines, bg, fg] = ads[i];
      this.setFrame(x, z, e.dx, e.dz);
      const y = t.heightAt(x, z);
      const gb = this.chunkFor(chunks, 0, 0, 'plain');
      gb.box(-4.7, -4.3, y, y + 7, -0.2, 0.2, hexColor(0x555555));
      gb.box(4.3, 4.7, y, y + 7, -0.2, 0.2, hexColor(0x555555));
      for (const lx of [-4.5, 4.5]) { const [px, pz] = this.W(lx, 0); this.colliders.addCircle(px, pz, 0.3, y - 1, y + 7, 'cartel'); }
      this.addSign(lines, 0, y + 7.5, 0, 12, 4, s > 0 ? 0 : Math.PI, { bg, fg, double: true, sizes: [64, 30] });
      this.clearFrame();
    }
  }

  // ------------------------------------------------------------------
  // Lotes genéricos a lo largo de las calles
  // ------------------------------------------------------------------
  placeLots(chunks, rng) {
    const R = this.roads, t = this.terrain, Z = this.zones;
    const edges = R.edges.filter((e) => e.sw);
    // orden estable pero mezclado
    for (let i = edges.length - 1; i > 0; i--) { const j = Math.floor(rng.next() * (i + 1)); [edges[i], edges[j]] = [edges[j], edges[i]]; }
    let count = 0;
    for (const e of edges) {
      const A = R.nodes[e.a];
      for (const s of [1, -1]) {
        const nx = -e.dz * s, nz = e.dx * s;
        const tA = this.trimOf(e, 0, s) + 0.6, tB = e.len - this.trimOf(e, 1, s) - 0.6;
        if (tB - tA < 7) continue;
        const probe = (e.width / 2 + SW + 8);
        const mx = A.x + e.dx * e.len / 2 + nx * probe, mz = A.z + e.dz * e.len / 2 + nz * probe;
        const style = this.zoneTypeAt(mx, mz);
        if (!style || !STYLES[style]) continue;
        const S = STYLES[style];
        let tt = tA;
        while (tt < tB - S.w0 * 0.8) {
          const lw = Math.min(rng.range(S.w0, S.w1), tB - tt);
          if (lw < S.w0 * 0.75) break;
          const depth = rng.range(S.d0, S.d1);
          const front = e.width / 2 + SW + S.setback;
          const hw = (lw - S.gap) / 2;
          const cx = A.x + e.dx * (tt + lw / 2) + nx * (front + depth / 2), cz = A.z + e.dz * (tt + lw / 2) + nz * (front + depth / 2);
          tt += lw;
          if (S.empty && rng.chance(S.empty)) continue;
          const o = { cx, cz, ax: e.dx * s, az: e.dz * s, hw, hd: depth / 2 };
          if (!this.lotOK(o, S)) continue;
          this.reserve(o);
          this.emitBuilding(chunks, o, style, rng, e, s);
          count++;
        }
      }
    }
    this.lotCount = count;
  }

  // ------------------------------------------------------------------
  // Edificios reales: cada huella (Microsoft Global ML Building Footprints y OSM, ver
  // tools/mapa/build_map.py) va en su lugar, con el frente a la calle. El tipo y la altura
  // salen de OSM cuando está cargado y si no de la zona y del tamaño real.
  // ------------------------------------------------------------------
  placeRealBuildings(chunks, rng) {
    const P = MAP.bldPos, D = MAP.bldDim, t = this.terrain, R = this.roads, Z = this.zones, H = this.houses;
    const n = P.length >> 1;
    const skip = { area: 0, calle: 0, ocupado: 0, agua: 0, pendiente: 0 };
    const stat = { casa: 0, casona: 0, garaje: 0, galpon: 0, publico: 0, edificio: 0, monoblock: 0, comercio: 0 };
    const cand = [];
    // 1) filtro: plazas y canchas, calles del juego, lugares ya ocupados (hitos, rampas, puerto...)
    for (let i = 0; i < n; i++) {
      const cx = P[2 * i] / 2, cz = P[2 * i + 1] / 2;
      const ang = (D[6 * i] / 255) * Math.PI * 2;
      const o = { cx, cz, ax: Math.cos(ang), az: Math.sin(ang), hw: D[6 * i + 1] / 4, hd: D[6 * i + 2] / 4 };
      const ar = Z.areaAt(cx, cz);
      if (ar && (ar.kind === 'plaza' || ar.kind === 'cancha' || ar.kind === 'cementerio')) { skip.area++; continue; }
      let ok = false;
      for (let k = 0; k < 3 && !ok; k++) {
        ok = true;
        for (const [x, z] of this.obbCorners(o)) if (R.clearance(x, z, 8) < 1.9) { ok = false; break; }
        if (!ok) { o.hw *= 0.85; o.hd *= 0.85; }
      }
      if (!ok || o.hw < 1.2 || o.hd < 1.2) { skip.calle++; continue; }
      if (!this.isFree(o)) { skip.ocupado++; continue; }
      cand.push({ o, lv: D[6 * i + 3], kind: D[6 * i + 4], ra: D[6 * i + 5] * 4, ar });
    }
    // 2) tipo y altura
    const acc = [];
    for (const { o, lv, kind, ar } of cand) {
      const hs = this.obbCorners(o).map(([x, z]) => t.heightAt(x, z));
      hs.push(t.heightAt(o.cx, o.cz));
      const mn = Math.min(...hs), mx = Math.max(...hs);
      if (mn < 0.6) { skip.agua++; continue; }
      const zt = this.zoneTypeAt(o.cx, o.cz);
      const A = o.hw * o.hd * 4, big = Math.max(o.hw, o.hd) * 2;
      let type;
      if (kind === 4 || (zt === 'industrial' && A > 90) || (!zt && A > 350) || (A > 1500 && zt !== 'centro')) type = 'galpon';
      else if (kind === 5 || (ar && (ar.kind === 'escuela' || ar.kind === 'militar') && A > 60)) type = 'publico';
      else if (kind === 6 || A < 15) type = 'garaje';
      else if (zt === 'centro' && (A > 45 || lv > 2)) type = 'edificio';
      else if (kind === 2 || lv >= 3 || (zt === 'viviendas' && A > 110)) type = 'monoblock';
      else if (kind === 3 && A > 110) type = 'comercio';
      else if (A > 280) type = (zt === 'barrio' || zt === 'km') && rng.chance(0.5) ? 'monoblock' : 'comercio';
      else type = big > 17 ? 'casona' : 'casa';
      if (mx - mn > (type === 'casa' || type === 'garaje' ? 3.2 : 7)) { skip.pendiente++; continue; }
      o.type = type; o.floor = mx; o.zt = zt; o.lv = lv; o.A = A;
      acc.push(o);
    }
    this.footprints = acc;
    // 3) comercios e instituciones reales: cada uno elige su edificio (y las instituciones no
    // quedan arriba de un local)
    this.matchPOIs(acc);
    // 4) construcción
    for (const o of acc) {
      this.emitReal(chunks, o, o.type, o.zt, o.lv, o.A, rng);
      this.reserve(o);
      stat[o.type]++;
    }
    this.lotCount = this.footprints.length;
    this.realStats = { total: n, ...stat, descartados: skip };
  }

  // ------------------------------------------------------------------
  // Carteles de comercios e instituciones reales de OSM, en la fachada del edificio real más
  // cercano. Todos en una sola malla con un atlas de textos (un solo draw call).
  // ------------------------------------------------------------------
  matchPOIs(acc) {
    const list = META.pois || [];
    const G = 40, grid = new Map();
    for (const o of acc) {
      const k = Math.floor(o.cx / G) * 100000 + Math.floor(o.cz / G);
      let a = grid.get(k); if (!a) grid.set(k, (a = [])); a.push(o);
    }
    const nearest = (x, z, R, big) => {
      let best = null, bd = Infinity;
      for (let i = Math.floor((x - R) / G); i <= Math.floor((x + R) / G); i++) for (let j = Math.floor((z - R) / G); j <= Math.floor((z + R) / G); j++) {
        for (const o of grid.get(i * 100000 + j) || []) {
          if (o.sign || o.type === 'garaje') continue;
          // distancia al rectángulo (0 si el punto cae adentro); los lugares grandes prefieren edificios grandes
          const dx = x - o.cx, dz = z - o.cz;
          const lx = Math.abs(dx * o.ax + dz * o.az) - o.hw, lz = Math.abs(-dx * o.az + dz * o.ax) - o.hd;
          let d = Math.hypot(Math.max(0, lx), Math.max(0, lz));
          if (big) d -= Math.min(10, Math.sqrt(o.hw * o.hd));
          if (d < bd) { bd = d; best = o; }
        }
      }
      return bd <= R ? best : null;
    };
    const INST = { escuela: 1, policia: 1, salud: 1, iglesia: 1, vecinal: 1, otro: 1, banco: 1 };
    for (const p of list) {
      const big = p.t === 'escuela' || p.t === 'super' || p.t === 'salud' || p.t === 'iglesia';
      const o = nearest(p.x, p.z, 30, big);
      if (!o) continue;
      o.sign = p;
      if (INST[p.t]) {
        if (o.type === 'edificio') o.noShop = true;
        else if (o.type !== 'galpon' && o.type !== 'monoblock') o.type = 'publico';
      } else if (p.t === 'super' && o.A > 300) o.type = 'comercio';
    }
  }

  placePOIs(chunks) {
    if (!this.footprints) return;
    const STY = {
      escuela: ['#f4f4f0', '#1a3f8f'], policia: ['#0f2a5a', '#ffffff'], salud: ['#f4f4f0', '#c01818'], iglesia: ['#3b2a1e', '#f2e6c8'],
      vecinal: ['#2f6b3a', '#ffffff'], otro: ['#34495e', '#ffffff'], banco: ['#0b3d6b', '#ffd24a'], farmacia: ['#138a3e', '#ffffff'],
      comida: ['#b3261e', '#ffe28a'], super: ['#1c5aa8', '#ffffff'], kiosco: ['#f0c020', '#1a1a1a'], taller: ['#ffd400', '#111111'], hotel: ['#1b2a4a', '#e8c66a'],
    };
    const CW = 256, CH = 64, COLS = 8, ROWS = 32;
    const cv = document.createElement('canvas'); cv.width = CW * COLS; cv.height = CH * ROWS;
    const g = cv.getContext('2d');
    const cells = new Map();
    let next = 0;
    const cell = (key, draw) => {
      if (cells.has(key)) return cells.get(key);
      if (next >= COLS * ROWS) return null;
      const i = next++, x = (i % COLS) * CW, y = Math.floor(i / COLS) * CH;
      g.save(); g.translate(x, y); draw(g); g.restore();
      // uv (el canvas se da vuelta en y al subirlo)
      const uv = [x / cv.width, 1 - (y + CH) / cv.height, (x + CW) / cv.width, 1 - y / cv.height];
      cells.set(key, uv);
      return uv;
    };
    // nombres largos en dos renglones, cortados en el espacio más cercano a la mitad
    const wrap = (lines) => {
      if (lines.length !== 1 || lines[0].length <= 24) return lines;
      const t = lines[0], mid = t.length / 2;
      let best = -1;
      for (let i = 0; i < t.length; i++) if (t[i] === ' ' && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
      return best < 0 ? lines : [t.slice(0, best), t.slice(best + 1)];
    };
    const textCell = (lines0, bg, fg) => { const lines = wrap(lines0); return cell(lines.join('|') + bg, (c) => {
      c.fillStyle = bg; c.fillRect(0, 0, CW, CH);
      c.strokeStyle = fg; c.globalAlpha = 0.6; c.lineWidth = 3; c.strokeRect(3, 3, CW - 6, CH - 6); c.globalAlpha = 1;
      c.fillStyle = fg; c.textAlign = 'center'; c.textBaseline = 'middle';
      if (lines.length === 1) {
        const size = lines[0].length > 22 ? 17 : lines[0].length > 14 ? 22 : 30;
        c.font = `bold ${size}px Arial, Helvetica, sans-serif`; c.fillText(lines[0], CW / 2, CH / 2 + 1, CW - 14);
      } else {
        const same = lines0.length === 1;
        c.font = `bold ${same ? 19 : 22}px Arial, Helvetica, sans-serif`; c.fillText(lines[0], CW / 2, CH * (same ? 0.33 : 0.36), CW - 14);
        c.font = `bold ${same ? 19 : 15}px Arial, Helvetica, sans-serif`; c.fillText(lines[1], CW / 2, CH * (same ? 0.7 : 0.74), CW - 14);
      }
    }); };
    const flag = cell('bandera', (c) => {
      c.fillStyle = '#74acdf'; c.fillRect(0, 0, 96, 64); c.fillStyle = '#ffffff'; c.fillRect(0, 21, 96, 22);
      c.fillStyle = '#f6b40e'; c.beginPath(); c.arc(48, 32, 7, 0, Math.PI * 2); c.fill();
    });
    const crossCell = (col) => cell('cruz' + col, (c) => {
      c.fillStyle = '#ffffff'; c.fillRect(0, 0, 64, 64); c.fillStyle = col; c.fillRect(22, 6, 20, 52); c.fillRect(6, 22, 52, 20);
    });
    const sub = (uv, fx0, fx1) => [uv[0] + (uv[2] - uv[0]) * fx0, uv[1], uv[0] + (uv[2] - uv[0]) * fx1, uv[3]];
    const pos = [], uvs = [];
    // cartel plano: centro (x,y,z), eje horizontal (ux,uz), medio ancho y medio alto
    const quad = (x, y, z, ux, uz, hw, hh, uv) => {
      const P = [[x - ux * hw, y - hh, z - uz * hw], [x + ux * hw, y - hh, z + uz * hw], [x + ux * hw, y + hh, z + uz * hw], [x - ux * hw, y + hh, z - uz * hw]];
      const U = [[uv[0], uv[1]], [uv[2], uv[1]], [uv[2], uv[3]], [uv[0], uv[3]]];
      for (const k of [0, 1, 2, 0, 2, 3]) { pos.push(...P[k]); uvs.push(...U[k]); }
    };
    let placed = 0;
    for (const o of this.footprints) {
      const p = o.sign;
      if (!p) continue;
      const big = p.t === 'escuela' || p.t === 'super' || p.t === 'salud' || p.t === 'iglesia';
      const [bg, fg] = STY[p.t] || STY.otro;
      const uv = textCell(p.l, bg, fg);
      if (!uv) break;
      // frente (-z local) y eje del frente
      const fx = o.az, fz = -o.ax;
      const w = clamp(o.hw * 2 - 0.8, 2.4, big ? 9 : 6), h = w / 4;
      const y = o.floor + (o.type === 'edificio' ? 4.5 : o.type === 'casa' ? 2.45 : 3.1) + h / 2 - 0.3;
      const cx = o.cx + fx * (o.hd + 0.07), cz = o.cz + fz * (o.hd + 0.07);
      // el eje horizontal va hacia la derecha de quien mira la fachada desde la calle
      quad(cx, y, cz, -o.ax, -o.az, w / 2, h / 2, uv);
      if (p.t === 'farmacia' || p.t === 'salud') {
        // cruz de bandera, perpendicular a la fachada
        const cu = sub(crossCell(p.t === 'farmacia' ? '#1faa4a' : '#d42020'), 0, 0.25);
        const ex = cx + o.ax * (w / 2 + 0.5) + fx * 0.45, ez = cz + o.az * (w / 2 + 0.5) + fz * 0.45;
        quad(ex, y + 0.2, ez, fx, fz, 0.4, 0.4, cu);
      }
      if (p.t === 'escuela' && flag) {
        // mástil con la bandera argentina
        const mx = cx + o.ax * (w / 2 + 1.6) + fx * 1.6, mz = cz + o.az * (w / 2 + 1.6) + fz * 1.6;
        const gy = this.terrain.heightAt(mx, mz);
        const pg = chunks.get(mx, mz, 'plain'); pg.clearFrame();
        pg.cylinder(mx, mz, 0.06, gy, gy + 7.5, hexColor(0xdcdcdc), 6);
        this.colliders.addCircle(mx, mz, 0.12, gy - 1, gy + 7.5, 'mastil');
        quad(mx - o.ax * 0.85, gy + 6.8, mz - o.az * 0.85, -o.ax, -o.az, 0.8, 0.55, sub(flag, 0, 0.375));
      }
      placed++;
    }
    if (!pos.length) return;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.computeBoundingSphere();
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, fog: true });
    mat.userData.sign = true;
    const mesh = new THREE.Mesh(geo, mat);
    mesh.matrixAutoUpdate = false;
    this.signs.push(mesh);
    this.poiCount = placed;
  }

  // Frente de la casa: si está retirada de la vereda, pared baja con reja, murito o tapia
  // sobre la línea municipal (y los costados hasta la casa)
  frontFence(o, zt, rng) {
    const R = this.roads;
    const fx = o.az, fz = -o.ax; // frente (-z local)
    const px = o.cx + fx * o.hd, pz = o.cz + fz * o.hd;
    const gap = R.clearance(px, pz, 16) - SW;
    if (gap < 1.4 || gap > 9 || !rng.chance(zt === 'km' ? 0.45 : 0.8)) return;
    const L = o.hw * 2 + 1.6;
    const fzL = -o.hd - gap + 0.25; // línea municipal, en coordenadas locales
    // las puntas no pueden pisar la vereda
    for (const sx of [-1, 1]) {
      const lx = sx * L / 2;
      const wx = o.cx + o.ax * lx - o.az * fzL, wz = o.cz + o.az * lx + o.ax * fzL;
      if (R.clearance(wx, wz, 8) < SW - 0.1) return;
    }
    const kind = zt === 'rada' ? (rng.chance(0.6) ? 1 : 0) : rng.chance(0.62) ? 0 : rng.chance(0.55) ? 1 : 2;
    this.fences = this.fences || [];
    this.fences.push({ o, z: fzL, L, gap: gap - 0.25, kind, color: rng.pick(kind === 2 ? PAL.house : PAL.fence) });
    // jardín del frente con pasto (en muchos es tierra o ripio: eso ya lo pone el terreno)
    if (rng.chance(zt === 'rada' ? 0.8 : zt === 'km' ? 0.35 : 0.55)) {
      const t = this.terrain, lb = this.lean.get(o.cx, o.cz, 'grass');
      const P = (lx, lz) => { const x = o.cx + o.ax * lx - o.az * lz, z = o.cz + o.az * lx + o.ax * lz; return [x, t.heightAt(x, z) + 0.04, z]; };
      const x0 = -L / 2 + 0.25, x1 = L / 2 - 0.25, z0 = fzL + 0.2, z1 = -o.hd - 0.1;
      const n = Math.max(1, Math.round((x1 - x0) / 3));
      for (let k = 0; k < n; k++) {
        const xa = x0 + (x1 - x0) * k / n, xb = x0 + (x1 - x0) * (k + 1) / n;
        const a = P(xa, z0), b = P(xb, z0), c = P(xb, z1), d = P(xa, z1);
        // normal hacia arriba (el frente mira a -z local)
        lb.tri(a[0], a[1], a[2], a[0] / 2, a[2] / 2, d[0], d[1], d[2], d[0] / 2, d[2] / 2, c[0], c[1], c[2], c[0] / 2, c[2] / 2);
        lb.tri(a[0], a[1], a[2], a[0] / 2, a[2] / 2, c[0], c[1], c[2], c[0] / 2, c[2] / 2, b[0], b[1], b[2], b[0] / 2, b[2] / 2);
      }
    }
  }

  buildFrontFences(group) {
    const list = this.fences || [];
    if (!list.length) return;
    const t = this.terrain;
    const wallG = new THREE.BoxGeometry(1, 1, 0.2); wallG.translate(0, 0.5, 0);
    const wallMat = lam({ color: 0xffffff }, (this.T.pbr && this.T.pbr.plain) || {});
    if (this.T.plain) wallMat.map = this.T.plain;
    const walls = new InstChunks(wallG, wallMat, 300);
    // reja: un plano con barrotes dibujados (se repiten cada 12 cm sin deformarse)
    const c = document.createElement('canvas'); c.width = 32; c.height = 128;
    const g = c.getContext('2d');
    g.clearRect(0, 0, 32, 128);
    g.fillStyle = '#26282b'; g.fillRect(12, 0, 8, 128); g.fillRect(0, 0, 32, 8); g.fillRect(0, 120, 32, 8);
    g.fillStyle = '#26282b'; g.beginPath(); g.moveTo(16, 0); g.lineTo(9, 10); g.lineTo(23, 10); g.fill();
    const tex = new THREE.CanvasTexture(c); tex.wrapS = THREE.RepeatWrapping; tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    const barMat = lam({ map: tex, alphaTest: 0.5, side: THREE.DoubleSide, color: 0xffffff }, STYLE.realista ? { metalness: 0.6, roughness: 0.5 } : {});
    barMat.onBeforeCompile = (sh) => {
      sh.vertexShader = sh.vertexShader.replace('#include <uv_vertex>', `vec2 uvI = uv;
#ifdef USE_INSTANCING
  uvI.x *= length(instanceMatrix[0].xyz) / 0.12;
#endif
#define uv uvI
#include <uv_vertex>
#undef uv`);
    };
    barMat.customProgramCacheKey = () => 'reja';
    const barG = new THREE.PlaneGeometry(1, 1); barG.translate(0, 0.5, 0);
    const bars = new InstChunks(barG, barMat, 300);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), sc = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), col = new THREE.Color();
    for (const f of list) {
      const o = f.o;
      const H = f.kind === 2 ? 1.8 : f.kind === 1 ? 0.6 : 0.75;
      const segs = [[0, f.z, f.L, 0], [-f.L / 2 + 0.1, f.z + f.gap / 2, f.gap, Math.PI / 2], [f.L / 2 - 0.1, f.z + f.gap / 2, f.gap, Math.PI / 2]];
      for (const [lx, lz, len, rot] of segs) {
        if (len < 0.5) continue;
        const x = o.cx + o.ax * lx - o.az * lz, z = o.cz + o.az * lx + o.ax * lz;
        const y = t.heightAt(x, z) - 0.2;
        const ang = Math.atan2(-o.az, o.ax) + rot;
        q.setFromAxisAngle(up, ang);
        m4.compose(p.set(x, y, z), q, sc.set(len, H + 0.2, 1));
        walls.add(x, z, m4, col.setHex(f.color));
        if (f.kind === 0) {
          m4.compose(p.set(x, y + H + 0.2, z), q, sc.set(len, 0.85, 1));
          bars.add(x, z, m4);
        }
        const ax = Math.cos(ang), az = -Math.sin(ang);
        this.colliders.addOBB(x, z, ax, az, len / 2, 0.12, y, y + H + 0.2 + (f.kind === 0 ? 0.85 : 0), 'reja');
      }
    }
    walls.build(group, { castShadow: true, receiveShadow: true, cullDist: 360 });
    bars.build(group, { castShadow: false, receiveShadow: false, cullDist: 220 });
    this.fenceCount = list.length;
  }

  emitReal(chunks, o, type, zt, lv, A, rng) {
    const H = this.houses;
    if (type === 'casa') {
      const floors = lv ? Math.min(2, lv) : zt === 'rada' ? (rng.chance(0.5) ? 2 : 1) : zt === 'km' ? 1 : rng.chance(0.2) ? 2 : 1;
      const flat = zt === 'rada' ? rng.chance(0.35) : zt === 'km' ? rng.chance(0.05) : zt === 'centro' ? rng.chance(0.6) : rng.chance(0.3);
      const brick = zt !== 'km' && rng.chance(zt === 'rada' ? 0.15 : 0.22);
      const wall = brick ? rng.pick(PAL.brickHouse) : zt === 'km' ? (rng.chance(0.7) ? 0xf2efe6 : rng.pick(PAL.house)) : zt === 'rada' ? rng.pick(PAL.rada) : rng.pick(PAL.house);
      const roof = flat ? 0x9d9890 : zt === 'km' ? (rng.chance(0.7) ? 0xa33a2a : 0x2f6b3a) : rng.pick(PAL.roof);
      H.add(o, floors, flat, wall, roof, this.terrain);
      this.frontFence(o, zt, rng);
      return;
    }
    this.setFrame(o.cx, o.cz, o.ax, o.az);
    const x0 = -o.hw, x1 = o.hw, z0 = -o.hd, z1 = o.hd;
    if (type === 'garaje') {
      this.addBuilding(chunks, x0, x1, z0, z1, 1, { mat: 'metal', floorH: 2.5, color: rng.pick(PAL.metal), roofColor: 0x8f9396 });
    } else if (type === 'galpon') {
      this.addBuilding(chunks, x0, x1, z0, z1, A > 1400 ? 3 : 2, { mat: 'metal', floorH: 3.1, color: rng.pick(PAL.metal), roof: 'gable', roofColor: rng.pick([0x9aa0a4, 0x8a9096, 0xa33a2a, 0x7c8a8f]), rise: Math.min(3, Math.min(o.hw, o.hd) * 0.3), ridgeX: o.hw >= o.hd });
    } else if (type === 'publico') {
      const floors = lv || (A > 500 ? 3 : 2);
      this.addBuilding(chunks, x0, x1, z0, z1, floors, { mat: rng.chance(0.6) ? 'house' : 'office', floorH: 3.4, color: rng.pick(PAL.publico), roofColor: 0xa29d94 });
    } else if (type === 'edificio') {
      // edificación entre medianeras: las huellas grandes se parten en lotes de 7 a 14 m de
      // frente (y en dos si la manzana es profunda), cada uno con su altura, color y locales
      const rows = o.hd * 2 > 26 ? 2 : 1;
      for (let r = 0; r < rows; r++) {
        const za = rows === 1 ? z0 : r === 0 ? z0 : 0, zb = rows === 1 ? z1 : r === 0 ? 0 : z1;
        for (let xa = x0; xa < x1 - 0.5;) {
          let w = x1 - x0 > 16 ? rng.range(7, 14) : x1 - x0;
          if (x1 - xa - w < 5) w = x1 - xa;
          const sub = w * (zb - za);
          let floors = lv;
          if (!floors) {
            const q = rng.next();
            if (sub < 60) floors = q < 0.6 ? rng.int(1, 3) : rng.int(4, 6);
            else floors = q < 0.4 ? rng.int(2, 4) : q < 0.75 ? rng.int(5, 8) : q < 0.95 ? rng.int(9, 13) : rng.int(14, 19);
          }
          const q2 = rng.next();
          // tipos: revoque con ventanas, balcones corridos (departamentos), franjas vidriadas, ladrillo visto
          const mat = floors >= 5 ? (q2 < 0.35 ? 'office' : q2 < 0.72 ? 'office2' : q2 < 0.88 ? 'office3' : 'office4')
            : (q2 < 0.45 ? 'office' : q2 < 0.65 ? 'office2' : q2 < 0.9 ? 'office4' : 'office3');
          const shop = !o.noShop && floors <= 12 && rng.chance(0.8);
          this.addBuilding(chunks, xa, xa + w, za, zb, floors, { mat, color: rng.pick(PAL.centro), shop });
          xa += w;
        }
      }
    } else if (type === 'monoblock') {
      this.addBuilding(chunks, x0, x1, z0, z1, lv || rng.int(3, 4), { mat: 'house', floorH: 2.8, color: rng.pick(PAL.block), roofColor: 0x9d9890 });
    } else if (type === 'comercio') {
      this.addBuilding(chunks, x0, x1, z0, z1, lv || rng.int(1, 2), { mat: 'office', color: rng.pick(PAL.centro), shop: true });
    } else {
      // casona: casa grande (ventanas a escala con la textura de casa)
      const floors = lv ? Math.min(3, lv) : rng.chance(0.35) ? 2 : 1;
      const flat = rng.chance(zt === 'km' ? 0.1 : 0.4);
      this.addBuilding(chunks, x0, x1, z0, z1, floors, { mat: 'house', floorH: 2.8, color: rng.pick(zt === 'rada' ? PAL.rada : PAL.house), roof: flat ? undefined : 'gable', roofColor: flat ? 0x9d9890 : rng.pick(PAL.roof), rise: 1.6 });
    }
    this.clearFrame();
  }

  lotOK(o, S) {
    const t = this.terrain, R = this.roads, Z = this.zones;
    const cs = this.obbCorners(o);
    const hs = cs.map(([x, z]) => t.heightAt(x, z));
    const mn = Math.min(...hs), mx = Math.max(...hs);
    if (mn < 0.9 || mx - mn > S.maxSlope) return false;
    if (!this.isFree(o)) return false;
    const pts = [...cs, [o.cx, o.cz]];
    for (const [x, z] of pts) {
      if (R.clearance(x, z, 12) < SW - 0.3) return false;
      const ar = Z.areaAt(x, z);
      if (ar && ar.kind !== 'industrial' && ar.kind !== 'comercial') return false;
    }
    return true;
  }

  emitBuilding(chunks, o, style, rng, e, s) {
    const H = this.houses;
    const zone = style;
    if (zone === 'centro') {
      this.setFrame(o.cx, o.cz, o.ax, o.az);
      const roll = rng.next();
      let floors;
      if (roll < 0.58) floors = rng.int(2, 4);
      else if (roll < 0.86) floors = rng.int(5, 8);
      else if (roll < 0.97) floors = rng.int(9, 13);
      else floors = rng.int(14, 19);
      const brick = rng.chance(0.18);
      this.addBuilding(chunks, -o.hw, o.hw, -o.hd, o.hd, floors, { mat: brick && floors < 6 ? 'brick' : 'office', color: rng.pick(PAL.centro), curb: false });
      this.clearFrame();
      return;
    }
    if (zone === 'industrial') {
      this.setFrame(o.cx, o.cz, o.ax, o.az);
      this.addBuilding(chunks, -o.hw, o.hw, -o.hd, o.hd, rng.int(2, 3), { mat: 'metal', floorH: 3, color: rng.pick(PAL.metal), roof: 'gable', roofColor: 0x9aa0a4, rise: 1.6, ridgeX: true });
      this.clearFrame();
      return;
    }
    if (zone === 'viviendas') {
      this.setFrame(o.cx, o.cz, o.ax, o.az);
      this.addBuilding(chunks, -o.hw, o.hw, -o.hd, o.hd, rng.int(3, 4), { mat: 'house', floorH: 2.8, color: rng.pick(PAL.block), roof: 'flat', roofColor: 0x9d9890 });
      this.clearFrame();
      return;
    }
    const floors = zone === 'rada' ? (rng.chance(0.55) ? 2 : 1) : rng.chance(0.18) ? 2 : 1;
    const flat = zone === 'rada' ? rng.chance(0.35) : zone === 'km' ? rng.chance(0.05) : rng.chance(0.2);
    const wall = zone === 'km' ? (rng.chance(0.7) ? 0xf2efe6 : rng.pick(PAL.house)) : zone === 'rada' ? rng.pick(PAL.rada) : rng.pick(PAL.house);
    const roof = flat ? 0x9d9890 : zone === 'km' ? (rng.chance(0.7) ? 0xa33a2a : 0x2f6b3a) : rng.pick(PAL.roof);
    H.add(o, floors, flat, wall, roof, this.terrain);
    void e; void s;
  }

  // ------------------------------------------------------------------
  // Faroles, árboles y lugares para estacionar
  // ------------------------------------------------------------------
  streetFurniture(rng) {
    const R = this.roads;
    for (const e of R.edges) {
      if (!e.sw) continue;
      const A = R.nodes[e.a];
      const mx = A.x + e.dx * e.len / 2, mz = A.z + e.dz * e.len / 2;
      const zt = this.zoneTypeAt(mx, mz) || 'barrio';
      for (const s of [1, -1]) {
        const tA = this.trimOf(e, 0, s) + 2, tB = e.len - this.trimOf(e, 1, s) - 2;
        if (tB <= tA) continue;
        const nx = -e.dz * s, nz = e.dx * s;
        // faroles
        const every = zt === 'centro' || e.kind === 'avenida' || e.kind === 'ruta' ? 26 : 40;
        if (zt === 'centro' || e.kind !== 'calle' || s > 0) {
          for (let tt = tA + (rng.next() * every) / 2; tt < tB; tt += every) {
            const off = e.width / 2 + 0.45;
            this.lampSpots.push([A.x + e.dx * tt + nx * off, A.z + e.dz * tt + nz * off, Math.atan2(-nx, -nz)]);
          }
        }
        // árboles de vereda (álamos) en barrios y Rada Tilly
        if (zt !== 'centro' && zt !== 'industrial' && rng.chance(0.55)) {
          for (let tt = tA + rng.range(3, 9); tt < tB; tt += rng.range(9, 16)) {
            if (!rng.chance(0.6)) continue;
            const off = e.width / 2 + SW - 0.6;
            this.treeSpots.push([A.x + e.dx * tt + nx * off, A.z + e.dz * tt + nz * off, zt === 'rada' ? 'pino' : 'alamo']);
          }
        }
        // estacionamiento junto al cordón
        if (e.kind !== 'ruta' && e.len > 16 && rng.chance(zt === 'centro' ? 0.5 : 0.25)) {
          const tt = rng.range(tA + 3, Math.max(tA + 3.1, tB - 3));
          const off = e.width / 2 - 1.2;
          this.parkingSpots.push({ x: A.x + e.dx * tt + nx * off, z: A.z + e.dz * tt + nz * off, rot: Math.atan2(e.dx * s, e.dz * s), zone: zt });
        }
      }
    }
  }
}

export { CURB, SW };
