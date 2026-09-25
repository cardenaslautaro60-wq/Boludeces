import * as THREE from 'three';
import { GRIDS, DECKS, RAMPS } from './mapdata.js';
import { ChunkedGeo, GeoBuilder, hexColor } from './geom.js';
import { signTexture } from '../render/textures.js';
import { RNG, pointSegDist, segIntersect } from '../util.js';

const CURB = 0.22;
const SW = 2.6; // ancho de vereda

const PAL = {
  centro: [0xd8d2c4, 0xc9b9a0, 0xb8b4ad, 0xe0d6c0, 0xa89a88, 0xcfc8bb, 0x9fa8ad, 0xd9c7a8, 0xbfae98, 0xe4dccb],
  house: [0xf1e3c6, 0xcfe0e8, 0xf0d0cc, 0xd8e8c8, 0xf3e9a8, 0xf7f5f0, 0xe8c8a8, 0xc8d8f0, 0xe9d7f0, 0xd9cbb0],
  roof: [0xa33a2a, 0x2f6b3a, 0x2d4f7a, 0x8a8f94, 0x7a3326, 0x3a6e6e, 0x9a9da0, 0xb04a2a],
  metal: [0xc9ccce, 0x9fb0b8, 0xb9a88a, 0x8f9aa0, 0xa7b8a0],
  rada: [0xf7f5f0, 0xe8e0d0, 0xd0c0a8, 0xf0e8d8, 0xc8d0d8],
};

function segRectDist(ax, az, bx, bz, x0, x1, z0, z1) {
  // 0 si se cruzan
  const inside = (x, z) => x >= x0 && x <= x1 && z >= z0 && z <= z1;
  if (inside(ax, az) || inside(bx, bz)) return 0;
  const edges = [[x0, z0, x1, z0], [x1, z0, x1, z1], [x1, z1, x0, z1], [x0, z1, x0, z0]];
  for (const e of edges) if (segIntersect(ax, az, bx, bz, e[0], e[1], e[2], e[3])) return 0;
  let d = Infinity;
  for (const [cx, cz] of [[x0, z0], [x1, z0], [x1, z1], [x0, z1]]) d = Math.min(d, pointSegDist(cx, cz, ax, az, bx, bz).d);
  const cl = (x, z) => Math.hypot(x - Math.max(x0, Math.min(x, x1)), z - Math.max(z0, Math.min(z, z1)));
  d = Math.min(d, cl(ax, az), cl(bx, bz));
  return d;
}

export class City {
  constructor() {
    this.blocks = []; // {grid, c, r, x0,x1,z0,z1, type, special}
    this.gridIndex = new Map();
    this.signs = [];
    this.markers = {}; // posiciones de puertas especiales
    this.parkingSpots = [];
    this.lampSpots = [];
    this.treeSpots = [];
    this.plazas = [];
    this.benches = [];
  }

  blockAt(x, z) {
    for (const g of GRIDS) {
      const c = Math.floor((x - g.x0) / g.px), r = Math.floor((z - g.z0) / g.pz);
      if (c < 0 || r < 0 || c >= g.cols || r >= g.rows) continue;
      const b = this.gridIndex.get(`${g.id},${c},${r}`);
      if (b && x >= b.x0 && x <= b.x1 && z >= b.z0 && z <= b.z1) return b;
    }
    return null;
  }

  curbAt(x, z) {
    const b = this.blockAt(x, z);
    if (!b) return 0;
    if (b.paved) return CURB;
    if (x - b.x0 < SW || b.x1 - x < SW || z - b.z0 < SW || b.z1 - z < SW) return CURB;
    return 0;
  }

  build(terrain, roads, T, colliders, scene) {
    const rng = new RNG(2004);
    this.terrain = terrain;
    this.colliders = colliders;
    const chunks = new ChunkedGeo(220);
    this.chunks = chunks;
    const group = new THREE.Group();
    this.group = group;

    const extraEdges = roads.edges.filter((e) => e.kind !== 'avenida' && e.kind !== 'calle' ? true : !GRIDS.some((g) => e.name === g.name));

    // Especiales (reservan áreas)
    const specials = this.specialDefs();
    this.specialRects = [];

    for (const g of GRIDS) {
      for (let c = 0; c < g.cols; c++) for (let r = 0; r < g.rows; r++) {
        const x0 = g.x0 + c * g.px + g.sw / 2, x1 = g.x0 + (c + 1) * g.px - g.sw / 2;
        const z0 = g.z0 + r * g.pz + g.sw / 2, z1 = g.z0 + (r + 1) * g.pz - g.sw / 2;
        // ¿alguna ruta cruza la manzana?
        let blocked = false;
        for (const e of extraEdges) {
          const A = roads.nodes[e.a], B = roads.nodes[e.b];
          if (segRectDist(A.x, A.z, B.x, B.z, x0, x1, z0, z1) < e.width / 2 - 1.8) { blocked = true; break; }
        }
        if (blocked) continue;
        for (const d of DECKS) if (d.x0 < x1 && d.x1 > x0 && d.z0 < z1 && d.z1 > z0) blocked = true;
        for (const rp of RAMPS) if (rp.x > x0 - 8 && rp.x < x1 + 8 && rp.z > z0 - 8 && rp.z < z1 + 8) blocked = true;
        if (blocked) continue;
        const b = { grid: g.id, gridName: g.name, c, r, x0, x1, z0, z1, type: g.type, special: null, paved: g.type === 'centro' };
        const sp = specials.find((s) => s.grid === g.id && s.c === c && s.r === r);
        if (sp) b.special = sp;
        this.blocks.push(b);
        this.gridIndex.set(`${g.id},${c},${r}`, b);
      }
    }

    for (const b of this.blocks) {
      this.buildSidewalk(b, chunks);
      const occupied = [];
      if (b.special) {
        const res = b.special.build.call(this, b, chunks, rng, T);
        if (res) occupied.push(...res);
      }
      if (b.special && b.special.exclusive) continue;
      switch (b.type) {
        case 'centro': this.fillCentro(b, chunks, rng, occupied); break;
        case 'industrial': this.fillIndustrial(b, chunks, rng, occupied); break;
        case 'rada': this.fillHouses(b, chunks, rng, occupied, 'rada'); break;
        case 'km': this.fillHouses(b, chunks, rng, occupied, 'km'); break;
        default: this.fillHouses(b, chunks, rng, occupied, 'barrio');
      }
      // luminarias en las esquinas
      this.lampSpots.push([b.x0 + 1, b.z0 + 1], [b.x1 - 1, b.z1 - 1]);
      if (b.type === 'centro') this.lampSpots.push([b.x1 - 1, b.z0 + 1], [b.x0 + 1, b.z1 - 1]);
    }

    this.buildPuerto(chunks, rng);
    this.buildOutside(chunks, rng, T);

    const mats = this.materials(T);
    chunks.build(mats, group);
    for (const s of this.signs) group.add(s);
    scene.add(group);
    this.materialsList = mats;
    return group;
  }

  materials(T) {
    const lam = (o) => new THREE.MeshLambertMaterial({ vertexColors: true, ...o });
    const m = {
      office: lam({ map: T.office, emissive: 0xffffff, emissiveMap: T.officeE, emissiveIntensity: 0 }),
      house: lam({ map: T.house, emissive: 0xffffff, emissiveMap: T.houseE, emissiveIntensity: 0 }),
      metal: lam({ map: T.metal }),
      brick: lam({ map: T.brick }),
      plain: lam({}),
      roof: lam({ map: T.roof }),
      roofFlat: lam({ map: T.roofFlat }),
      sidewalk: lam({ map: T.sidewalk, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2 }),
      pitch: lam({ map: T.pitch, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 }),
    };
    return m;
  }

  // Altura de apoyo de un rectángulo
  footprintHeights(x0, x1, z0, z1) {
    const t = this.terrain;
    const hs = [t.heightAt(x0, z0), t.heightAt(x1, z0), t.heightAt(x0, z1), t.heightAt(x1, z1), t.heightAt((x0 + x1) / 2, (z0 + z1) / 2)];
    return { min: Math.min(...hs), max: Math.max(...hs) };
  }

  buildSidewalk(b, chunks) {
    const t = this.terrain;
    const gb = chunks.get((b.x0 + b.x1) / 2, (b.z0 + b.z1) / 2, 'sidewalk');
    const col = [1, 1, 1];
    const strip = (x0, x1, z0, z1) => {
      const alongX = x1 - x0 > z1 - z0;
      const L = alongX ? x1 - x0 : z1 - z0;
      const n = Math.max(1, Math.ceil(L / 6));
      for (let k = 0; k < n; k++) {
        let ax0, ax1, az0, az1;
        if (alongX) { ax0 = x0 + (L * k) / n; ax1 = x0 + (L * (k + 1)) / n; az0 = z0; az1 = z1; }
        else { az0 = z0 + (L * k) / n; az1 = z0 + (L * (k + 1)) / n; ax0 = x0; ax1 = x1; }
        const h = (x, z) => t.heightAt(x, z) + CURB;
        const p00 = [ax0, h(ax0, az0), az0], p10 = [ax1, h(ax1, az0), az0], p11 = [ax1, h(ax1, az1), az1], p01 = [ax0, h(ax0, az1), az1];
        gb.quad(p01, p11, p10, p00, [ax0 / 2, az1 / 2], [ax1 / 2, az1 / 2], [ax1 / 2, az0 / 2], [ax0 / 2, az0 / 2], col);
      }
    };
    const curb = (ax, az, bx, bz) => {
      const L = Math.hypot(bx - ax, bz - az);
      const n = Math.max(1, Math.ceil(L / 6));
      for (let k = 0; k < n; k++) {
        const x0 = ax + ((bx - ax) * k) / n, z0 = az + ((bz - az) * k) / n;
        const x1 = ax + ((bx - ax) * (k + 1)) / n, z1 = az + ((bz - az) * (k + 1)) / n;
        const h0 = t.heightAt(x0, z0), h1 = t.heightAt(x1, z1);
        gb.quad([x0, h0 - 0.1, z0], [x1, h1 - 0.1, z1], [x1, h1 + CURB, z1], [x0, h0 + CURB, z0], [0, 0], [0.5, 0], [0.5, 0.05], [0, 0.05], [0.8, 0.8, 0.8]);
      }
    };
    if (b.paved) {
      strip(b.x0, b.x1, b.z0, b.z0 + (b.z1 - b.z0) / 2);
      strip(b.x0, b.x1, b.z0 + (b.z1 - b.z0) / 2, b.z1);
      // relleno interior en grilla
      const nx = Math.ceil((b.x1 - b.x0) / 8), nz = Math.ceil((b.z1 - b.z0) / 8);
      for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
        const x0 = b.x0 + ((b.x1 - b.x0) * i) / nx, x1 = b.x0 + ((b.x1 - b.x0) * (i + 1)) / nx;
        const z0 = b.z0 + ((b.z1 - b.z0) * j) / nz, z1 = b.z0 + ((b.z1 - b.z0) * (j + 1)) / nz;
        const h = (x, z) => t.heightAt(x, z) + CURB;
        gb.quad([x0, h(x0, z1), z1], [x1, h(x1, z1), z1], [x1, h(x1, z0), z0], [x0, h(x0, z0), z0], [x0 / 2, z1 / 2], [x1 / 2, z1 / 2], [x1 / 2, z0 / 2], [x0 / 2, z0 / 2], col);
      }
    } else {
      strip(b.x0, b.x1, b.z0, b.z0 + SW);
      strip(b.x0, b.x1, b.z1 - SW, b.z1);
      strip(b.x0, b.x0 + SW, b.z0 + SW, b.z1 - SW);
      strip(b.x1 - SW, b.x1, b.z0 + SW, b.z1 - SW);
    }
    // cordones (lado de afuera)
    curb(b.x0, b.z1, b.x1, b.z1);
    curb(b.x1, b.z0, b.x0, b.z0);
    curb(b.x1, b.z1, b.x1, b.z0);
    curb(b.x0, b.z0, b.x0, b.z1);
  }

  // ---- Edificio genérico ----
  addBuilding(chunks, x0, x1, z0, z1, floors, opts = {}) {
    const fh = opts.floorH || 3.2;
    const { min, max } = this.footprintHeights(x0, x1, z0, z1);
    const base = min - 0.6;
    const floor = max + (opts.curb ? CURB : 0.05);
    const top = floor + floors * fh;
    const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
    const mat = opts.mat || 'office';
    const color = hexColor(opts.color || 0xd8d2c4);
    const gb = chunks.get(cx, cz, mat);
    if (floor - base > 0.3) {
      const pg = chunks.get(cx, cz, 'plain');
      pg.walls(x0, x1, z0, z1, base, floor, hexColor(0x8d877c), 4, 3);
    }
    let uS = 28, vS = 25.6, uOff = 0;
    if (mat === 'house') { uS = 14; vS = fh * 2; uOff = Math.floor(Math.random() * 4) / 4; }
    if (mat === 'office') { uOff = Math.floor(Math.random() * 8) / 8; }
    if (mat === 'metal') { uS = 3; vS = 3; }
    if (mat === 'brick') { uS = 2.5; vS = 2; }
    if (mat === 'plain') { uS = 4; vS = 3; }
    gb.walls(x0, x1, z0, z1, floor, top, color, uS, vS, (opts.vOff || 0), uOff);
    // techo
    if (opts.roof === 'gable') {
      const rg = chunks.get(cx, cz, 'roof');
      const along = opts.ridgeX !== undefined ? opts.ridgeX : (x1 - x0) >= (z1 - z0);
      const rise = opts.rise || Math.min(x1 - x0, z1 - z0) * 0.22;
      rg.gable(x0, x1, z0, z1, top, rise, hexColor(opts.roofColor || 0xa33a2a), along, 0.45);
      this.colliders.addBox(x0, x1, z0, z1, base, top + rise, opts.tag || 'building');
      return { top: top + rise, floor, base };
    }
    const rg = chunks.get(cx, cz, 'roofFlat');
    rg.top(x0, x1, z0, z1, top, hexColor(opts.roofColor || 0xaaaaaa), 4);
    // parapeto
    if (floors > 1 && mat === 'office') {
      const pg = chunks.get(cx, cz, 'plain');
      pg.walls(x0 - 0.15, x1 + 0.15, z0 - 0.15, z1 + 0.15, top - 0.2, top + 0.7, color);
      pg.top(x0 - 0.15, x1 + 0.15, z0 - 0.15, z0 + 0.15, top + 0.7, color);
    }
    // equipos en la terraza
    if (floors > 3 && Math.random() < 0.6) {
      const pg = chunks.get(cx, cz, 'plain');
      const w = Math.min(4, (x1 - x0) * 0.3), d = Math.min(4, (z1 - z0) * 0.3);
      pg.box(cx - w / 2, cx + w / 2, top, top + 2.2, cz - d / 2, cz + d / 2, hexColor(0x9a9a98));
      if (Math.random() < 0.5) pg.cylinder(cx + w, cz, 1.2, top, top + 3.2, hexColor(0x5c6a74), 8);
    }
    this.colliders.addBox(x0, x1, z0, z1, base, top + 0.7, opts.tag || 'building');
    return { top, floor, base };
  }

  overlaps(rect, occupied, pad = 0.5) {
    for (const o of occupied) {
      if (rect[0] < o[1] + pad && rect[1] > o[0] - pad && rect[2] < o[3] + pad && rect[3] > o[2] - pad) return true;
    }
    return false;
  }

  fillCentro(b, chunks, rng, occupied) {
    // dividir la manzana en lotes (BSP)
    const lots = [];
    const split = (x0, x1, z0, z1, depth) => {
      const w = x1 - x0, d = z1 - z0;
      if ((w < 26 && d < 26) || depth > 5) { lots.push([x0, x1, z0, z1]); return; }
      if (w >= d) { const s = x0 + w * rng.range(0.38, 0.62); split(x0, s, z0, z1, depth + 1); split(s, x1, z0, z1, depth + 1); }
      else { const s = z0 + d * rng.range(0.38, 0.62); split(x0, x1, z0, s, depth + 1); split(x0, x1, s, z1, depth + 1); }
    };
    const m = 3.2; // vereda
    split(b.x0 + m, b.x1 - m, b.z0 + m, b.z1 - m, 0);
    for (const l of lots) {
      const r = [l[0] + 0.4, l[1] - 0.4, l[2] + 0.4, l[3] - 0.4];
      if (this.overlaps(r, occupied, 1)) continue;
      const roll = rng.next();
      let floors;
      if (roll < 0.45) floors = rng.int(2, 4);
      else if (roll < 0.8) floors = rng.int(5, 9);
      else if (roll < 0.95) floors = rng.int(10, 15);
      else floors = rng.int(16, 20);
      const brick = rng.chance(0.18);
      this.addBuilding(chunks, r[0], r[1], r[2], r[3], floors, {
        mat: brick && floors < 6 ? 'brick' : 'office', color: rng.pick(PAL.centro), curb: true,
      });
      occupied.push(r);
    }
  }

  fillIndustrial(b, chunks, rng, occupied) {
    const m = 4;
    const halves = rng.chance(0.6)
      ? [[b.x0 + m, (b.x0 + b.x1) / 2 - 2, b.z0 + m, b.z1 - m], [(b.x0 + b.x1) / 2 + 2, b.x1 - m, b.z0 + m, b.z1 - m]]
      : [[b.x0 + m, b.x1 - m, b.z0 + m, (b.z0 + b.z1) / 2 - 2], [b.x0 + m, b.x1 - m, (b.z0 + b.z1) / 2 + 2, b.z1 - m]];
    for (const h of halves) {
      if (this.overlaps(h, occupied, 1)) continue;
      const shrink = rng.range(0, 6);
      const r = [h[0] + shrink, h[1] - shrink * 0.5, h[2] + shrink * 0.5, h[3] - shrink];
      this.addBuilding(chunks, r[0], r[1], r[2], r[3], rng.int(2, 3), {
        mat: 'metal', floorH: 3, color: rng.pick(PAL.metal), roof: 'gable', roofColor: 0x9aa0a4, rise: 1.6,
      });
      occupied.push(r);
    }
  }

  fillHouses(b, chunks, rng, occupied, style) {
    const setback = style === 'rada' ? 4 : 3.2;
    const depth = style === 'rada' ? 11 : 9;
    const sides = [
      { dir: 'N', a: b.x0 + 1, bEnd: b.x1 - 1 },
      { dir: 'S', a: b.x0 + 1, bEnd: b.x1 - 1 },
      { dir: 'W', a: b.z0 + setback + depth + 1, bEnd: b.z1 - setback - depth - 1 },
      { dir: 'E', a: b.z0 + setback + depth + 1, bEnd: b.z1 - setback - depth - 1 },
    ];
    for (const s of sides) {
      let p = s.a;
      while (p < s.bEnd - 7) {
        const w = Math.min(s.bEnd - p, style === 'rada' ? rng.range(12, 17) : rng.range(8.5, 12.5));
        if (w < 7) break;
        const hw = w - rng.range(1.2, 2.6);
        let r;
        const dd = depth * rng.range(0.8, 1.05);
        if (s.dir === 'N') r = [p, p + hw, b.z0 + setback, b.z0 + setback + dd];
        if (s.dir === 'S') r = [p, p + hw, b.z1 - setback - dd, b.z1 - setback];
        if (s.dir === 'W') r = [b.x0 + setback, b.x0 + setback + dd, p, p + hw];
        if (s.dir === 'E') r = [b.x1 - setback - dd, b.x1 - setback, p, p + hw];
        p += w;
        if (this.overlaps(r, occupied, 0.8)) continue;
        if (rng.chance(style === 'km' ? 0.18 : 0.1)) continue; // baldío
        occupied.push(r);
        const floors = style === 'rada' ? (rng.chance(0.6) ? 2 : 1) : rng.chance(0.2) ? 2 : 1;
        const flat = style === 'rada' ? rng.chance(0.35) : rng.chance(0.12);
        const color = style === 'km' ? (rng.chance(0.7) ? 0xf2efe6 : rng.pick(PAL.house)) : style === 'rada' ? rng.pick(PAL.rada) : rng.pick(PAL.house);
        const roofColor = style === 'km' ? (rng.chance(0.7) ? 0xa33a2a : 0x2f6b3a) : rng.pick(PAL.roof);
        const along = s.dir === 'N' || s.dir === 'S';
        this.addBuilding(chunks, r[0], r[1], r[2], r[3], floors, {
          mat: 'house', floorH: 2.8, color, roof: flat ? 'flat' : 'gable', roofColor: flat ? 0x9d9890 : roofColor,
          ridgeX: along, rise: rng.range(1.2, 2.2),
        });
        // tapial al frente
        if (style !== 'km' && rng.chance(0.5)) this.addWall(chunks, r, s.dir, b, rng);
      }
    }
  }

  addWall(chunks, r, dir, b, rng) {
    const t = this.terrain;
    const gb = chunks.get(r[0], r[2], 'plain');
    const col = hexColor(rng.pick([0xd8d0c0, 0xbfb6a6, 0xe8e0d0, 0xa89c88]));
    const h = 1.1;
    const seg = (x0, z0, x1, z1) => {
      const y0 = Math.min(t.heightAt(x0, z0), t.heightAt(x1, z1)) - 0.2;
      const y1 = Math.max(t.heightAt(x0, z0), t.heightAt(x1, z1)) + h;
      const th = 0.12;
      const xa = Math.min(x0, x1) - th, xb = Math.max(x0, x1) + th, za = Math.min(z0, z1) - th, zb = Math.max(z0, z1) + th;
      gb.box(xa, xb, y0, y1, za, zb, col);
      this.colliders.addBox(xa, xb, za, zb, y0, y1, 'wall');
    };
    const off = SW + 0.4;
    const gate = 3;
    if (dir === 'N') { seg(r[0], b.z0 + off, (r[0] + r[1]) / 2 - gate / 2, b.z0 + off); seg((r[0] + r[1]) / 2 + gate / 2, b.z0 + off, r[1], b.z0 + off); }
    if (dir === 'S') { seg(r[0], b.z1 - off, (r[0] + r[1]) / 2 - gate / 2, b.z1 - off); seg((r[0] + r[1]) / 2 + gate / 2, b.z1 - off, r[1], b.z1 - off); }
    if (dir === 'W') { seg(b.x0 + off, r[2], b.x0 + off, (r[2] + r[3]) / 2 - gate / 2); seg(b.x0 + off, (r[2] + r[3]) / 2 + gate / 2, b.x0 + off, r[3]); }
    if (dir === 'E') { seg(b.x1 - off, r[2], b.x1 - off, (r[2] + r[3]) / 2 - gate / 2); seg(b.x1 - off, (r[2] + r[3]) / 2 + gate / 2, b.x1 - off, r[3]); }
  }

  addSign(lines, x, y, z, w, h, rotY, opts = {}) {
    const tex = signTexture(lines, { ...opts, w: opts.tw || 512, h: opts.th || Math.round(512 * (h / w)) });
    const mat = new THREE.MeshBasicMaterial({ map: tex, side: opts.double ? THREE.DoubleSide : THREE.FrontSide, fog: true });
    mat.userData.sign = true;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    m.position.set(x, y, z);
    m.rotation.y = rotY;
    m.updateMatrix();
    m.matrixAutoUpdate = false;
    this.signs.push(m);
    return m;
  }

  // ---- Edificios especiales ----
  specialDefs() {
    const S = [];
    const sp = (grid, c, r, name, build, exclusive = false) => S.push({ grid, c, r, name, build, exclusive });

    sp('centro', 2, 2, 'plaza', function (b, chunks, rng) {
      const t = this.terrain;
      // césped y caminos diagonales
      const gb = chunks.get(b.x0, b.z0, 'plain');
      const cx = (b.x0 + b.x1) / 2, cz = (b.z0 + b.z1) / 2;
      const n = 8;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const x0 = b.x0 + 4 + ((b.x1 - b.x0 - 8) * i) / n, x1 = b.x0 + 4 + ((b.x1 - b.x0 - 8) * (i + 1)) / n;
        const z0 = b.z0 + 4 + ((b.z1 - b.z0 - 8) * j) / n, z1 = b.z0 + 4 + ((b.z1 - b.z0 - 8) * (j + 1)) / n;
        const mx = (x0 + x1) / 2 - cx, mz = (z0 + z1) / 2 - cz;
        const onPath = Math.abs(Math.abs(mx) - Math.abs(mz)) < 6 || Math.hypot(mx, mz) < 10;
        const col = onPath ? hexColor(0xc4b494) : hexColor(0x6e7d3e);
        const h = (x, z) => t.heightAt(x, z) + 0.3;
        gb.quad([x0, h(x0, z1), z1], [x1, h(x1, z1), z1], [x1, h(x1, z0), z0], [x0, h(x0, z0), z0], [0, 0], [1, 0], [1, 1], [0, 1], col);
      }
      // monumento (pedestal + figura)
      const y = t.heightAt(cx, cz) + 0.3;
      gb.box(cx - 3, cx + 3, y, y + 1.2, cz - 3, cz + 3, hexColor(0xb8b0a0));
      gb.box(cx - 1.8, cx + 1.8, y + 1.2, y + 5, cz - 1.8, cz + 1.8, hexColor(0xcfc6b4));
      gb.box(cx - 0.6, cx + 0.6, y + 5, y + 7.4, cz - 0.5, cz + 0.5, hexColor(0x4d5a4a));
      gb.box(cx - 0.35, cx + 0.35, y + 7.4, y + 8.1, cz - 0.35, cz + 0.35, hexColor(0x4d5a4a));
      this.colliders.addBox(cx - 3, cx + 3, cz - 3, cz + 3, y - 1, y + 8, 'monumento');
      for (let k = 0; k < 16; k++) {
        const a = (k / 16) * Math.PI * 2;
        this.treeSpots.push([cx + Math.cos(a) * 25, cz + Math.sin(a) * 25, 'alamo']);
      }
      this.benches.push([cx + 12, cz], [cx - 12, cz], [cx, cz + 12], [cx, cz - 12]);
      this.plazas.push(b);
      b.paved = false;
      return [[b.x0, b.x1, b.z0, b.z1]];
    }, true);

    sp('centro', 1, 0, 'comisaria', function (b, chunks) {
      const r = [b.x0 + 8, b.x1 - 8, b.z0 + 22, b.z1 - 6];
      const res = this.addBuilding(chunks, r[0], r[1], r[2], r[3], 3, { mat: 'office', color: 0x9fb6d0, curb: true });
      this.addSign(['COMISARÍA PRIMERA'], (r[0] + r[1]) / 2, res.floor + 4.2, r[3] + 0.05, 16, 1.6, 0, { bg: '#1d3f8f' });
      this.markers.comisaria = { x: (r[0] + r[1]) / 2, z: r[3] + 2 };
      return [r];
    });

    sp('centro', 0, 1, 'hospital', function (b, chunks) {
      const r = [b.x0 + 6, b.x1 - 6, b.z0 + 8, b.z1 - 7];
      const res = this.addBuilding(chunks, r[0], r[1], r[2], r[3], 4, { mat: 'office', color: 0xf2f2ee, curb: true });
      this.addSign(['HOSPITAL REGIONAL'], (r[0] + r[1]) / 2, res.floor + 3.6, r[3] + 0.05, 18, 1.8, 0, { bg: '#ffffff', fg: '#c01818', borderColor: '#c01818' });
      this.addSign(['+'], (r[0] + r[1]) / 2, res.top - 2, r[3] + 0.05, 4, 4, 0, { bg: '#ffffff', fg: '#d01010', border: false, tw: 128, th: 128 });
      this.markers.hospital = { x: (r[0] + r[1]) / 2, z: r[3] + 2.5 };
      return [r];
    });

    sp('centro', 0, 2, 'armeria', function (b, chunks) {
      const r = [b.x0 + 16, b.x0 + 46, b.z1 - 22, b.z1 - 4.5];
      const res = this.addBuilding(chunks, r[0], r[1], r[2], r[3], 2, { mat: 'brick', color: 0xd8c8b8, curb: true });
      this.addSign(['ARMERÍA', 'LA PATAGÓNICA'], (r[0] + r[1]) / 2, res.floor + 3.4, r[3] + 0.05, 10, 2.2, 0, { bg: '#2d2d2d', fg: '#f0c040' });
      this.markers.armeria = { x: (r[0] + r[1]) / 2, z: r[3] + 2 };
      return [r];
    });

    sp('centro', 2, 3, 'pizzeria', function (b, chunks) {
      const r = [b.x0 + 18, b.x0 + 48, b.z0 + 4.5, b.z0 + 20];
      const res = this.addBuilding(chunks, r[0], r[1], r[2], r[3], 2, { mat: 'brick', color: 0xe0c8a8, curb: true });
      this.addSign(['PIZZERÍA LA TUERCA'], (r[0] + r[1]) / 2, res.floor + 3.3, r[2] - 0.05, 14, 1.6, Math.PI, { bg: '#b8281c', fg: '#fff3c0' });
      this.markers.pizzeria = { x: (r[0] + r[1]) / 2, z: r[2] - 2 };
      return [r];
    });

    sp('centro', 3, 1, 'catedral', function (b, chunks) {
      const r = [b.x0 + 14, b.x1 - 14, b.z0 + 10, b.z1 - 10];
      const res = this.addBuilding(chunks, r[0], r[1], r[2], r[3], 4, { mat: 'plain', color: 0xe8e2d0, curb: true, floorH: 3.5, roof: 'gable', ridgeX: false, roofColor: 0x7a3326, rise: 7 });
      // torre del campanario
      const tx = (r[0] + r[1]) / 2;
      const tz0 = r[3] - 2, tz1 = r[3] + 6;
      const gb = chunks.get(tx, tz0, 'plain');
      gb.box(tx - 4, tx + 4, res.base, res.floor + 30, tz0, tz1, hexColor(0xece6d4));
      gb.box(tx - 4.6, tx + 4.6, res.floor + 30, res.floor + 31, tz0 - 0.6, tz1 + 0.6, hexColor(0xd8d0bc));
      const rg = chunks.get(tx, tz0, 'roof');
      rg.gable(tx - 4, tx + 4, tz0, tz1, res.floor + 31, 6, hexColor(0x5d6a70), false, 0.2);
      gb.box(tx - 0.25, tx + 0.25, res.floor + 37, res.floor + 41, (tz0 + tz1) / 2 - 0.25, (tz0 + tz1) / 2 + 0.25, hexColor(0xe8e8e8));
      gb.box(tx - 1.3, tx + 1.3, res.floor + 39.2, res.floor + 39.7, (tz0 + tz1) / 2 - 0.25, (tz0 + tz1) / 2 + 0.25, hexColor(0xe8e8e8));
      this.colliders.addBox(tx - 4, tx + 4, tz0, tz1, res.base, res.floor + 40, 'catedral');
      return [r, [tx - 4, tx + 4, tz0, tz1]];
    });

    sp('centro', 4, 1, 'torreCrudo', function (b, chunks) {
      const r = [b.x0 + 14, b.x1 - 14, b.z0 + 14, b.z1 - 14];
      const res = this.addBuilding(chunks, r[0], r[1], r[2], r[3], 24, { mat: 'office', color: 0x5f7f9a, curb: true });
      this.addSign(['TORRE CRUDO'], (r[0] + r[1]) / 2, res.top - 3, r[2] - 0.05, 22, 3, Math.PI, { bg: '#111418', fg: '#e8c060' });
      this.addSign(['PETROLERA CRUDO S.A.'], r[0] - 0.05, res.floor + 5, (r[2] + r[3]) / 2, 16, 1.8, -Math.PI / 2, { bg: '#111418', fg: '#e8c060' });
      this.markers.torreCrudo = { x: (r[0] + r[1]) / 2, z: r[2] - 3 };
      return [r];
    });

    sp('centro', 4, 4, 'terminal', function (b, chunks) {
      const r = [b.x0 + 5, b.x1 - 5, b.z0 + 8, b.z1 - 16];
      const res = this.addBuilding(chunks, r[0], r[1], r[2], r[3], 2, { mat: 'office', color: 0xc8c0b0, curb: true, floorH: 3.4 });
      // alero para los colectivos
      const gb = chunks.get(r[0], r[3], 'plain');
      gb.box(r[0], r[1], res.top - 1.5, res.top - 1.1, r[3], b.z1 - 1, hexColor(0x8a8f94));
      for (let x = r[0] + 2; x < r[1]; x += 10) {
        gb.box(x - 0.2, x + 0.2, res.floor, res.top - 1.3, b.z1 - 2, b.z1 - 1.6, hexColor(0x6a6f74));
        this.colliders.addCircle(x, b.z1 - 1.8, 0.3, res.floor - 1, res.top, 'poste');
      }
      this.addSign(['TERMINAL DE ÓMNIBUS'], (r[0] + r[1]) / 2, res.top + 1.2, r[3] - 3, 22, 2.2, 0, { bg: '#f2f2ee', fg: '#1d3f8f' });
      this.markers.terminal = { x: (r[0] + r[1]) / 2, z: b.z1 - 3 };
      return [r, [r[0], r[1], r[3], b.z1]];
    });

    sp('centro', 0, 4, 'anomala', function (b, chunks) {
      const r = [b.x0 + 5, b.x1 - 5, b.z0 + 5, b.z1 - 14];
      const res = this.addBuilding(chunks, r[0], r[1], r[2], r[3], 2, { mat: 'metal', color: 0xe8e4dc, curb: true, floorH: 3.8, vOff: 0 });
      this.addSign(['LA ANÓMALA', 'SUPERMERCADOS'], (r[0] + r[1]) / 2, res.top - 2, r[3] + 0.05, 20, 4, 0, { bg: '#1c5aa8', fg: '#ffffff', sizes: [70, 36] });
      this.markers.anomala = { x: (r[0] + r[1]) / 2, z: r[3] + 3 };
      return [r];
    });

    sp('centro', 4, 3, 'remiseria', function (b, chunks) {
      const r = [b.x0 + 4.5, b.x0 + 26, b.z0 + 8, b.z0 + 28];
      const res = this.addBuilding(chunks, r[0], r[1], r[2], r[3], 1, { mat: 'brick', color: 0xd0c8b8, curb: true, floorH: 3.6 });
      this.addSign(['REMISERÍA', 'EL VIENTO'], r[0] - 0.05, res.floor + 2.8, (r[2] + r[3]) / 2, 8, 2, -Math.PI / 2, { bg: '#1a6b2a', fg: '#ffffff' });
      this.markers.remiseria = { x: r[0] - 2.5, z: (r[2] + r[3]) / 2 };
      return [r];
    });

    // Barrio Pietrobelli: Casa de la Abuela y garage del Petroca
    sp('pietrobelli', 3, 2, 'casaAbuela', function (b, chunks, rng) {
      const casa = [b.x1 - 3.2 - 11, b.x1 - 3.2, b.z0 + 16, b.z0 + 29];
      this.addBuilding(chunks, casa[0], casa[1], casa[2], casa[3], 1, { mat: 'house', floorH: 2.8, color: 0xf0c8d0, roof: 'gable', roofColor: 0x2f6b3a, ridgeX: false, rise: 2 });
      const gar = [b.x1 - 3.2 - 12, b.x1 - 3.2, b.z0 + 33, b.z0 + 45];
      const g = this.addBuilding(chunks, gar[0], gar[1], gar[2], gar[3], 1, { mat: 'metal', floorH: 3.4, color: 0xb9c4c8, roof: 'flat' });
      // portón
      const gb = chunks.get(gar[1], gar[2], 'plain');
      gb.box(gar[1], gar[1] + 0.1, g.floor, g.floor + 3, gar[2] + 2, gar[3] - 2, hexColor(0x6a3a2a));
      this.addSign(['GARAGE PETROCA'], gar[1] + 0.12, g.floor + 3.25, (gar[2] + gar[3]) / 2, 6, 0.6, Math.PI / 2, { bg: '#f2c230', fg: '#222' });
      this.addSign(['ACÁ VIVE LA ABUELA'], casa[1] + 0.05, 2.6 + this.terrain.heightAt(casa[1], casa[2]), (casa[2] + casa[3]) / 2 + 3.5, 3, 0.5, Math.PI / 2, { bg: '#fff5e0', fg: '#5a2a2a', italic: true });
      this.markers.casaAbuela = { x: b.x1 - 1.3, z: (casa[2] + casa[3]) / 2 };
      this.markers.garagePetroca = { x: b.x1 + 3, z: (gar[2] + gar[3]) / 2 };
      return [casa, gar];
    });

    // La Madriguera (Club Jorge Newbery) — en 2004 todavía era de tierra
    sp('nuevejulio', 2, 1, 'madriguera', function (b, chunks) {
      const t = this.terrain;
      const cx = (b.x0 + b.x1) / 2, cz = (b.z0 + b.z1) / 2;
      const pw = 25, pd = 15;
      const y = t.heightAt(cx, cz) + 0.28;
      const gb = chunks.get(cx, cz, 'pitch');
      const n = 6;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const x0 = cx - pw + (2 * pw * i) / n, x1 = cx - pw + (2 * pw * (i + 1)) / n;
        const z0 = cz - pd + (2 * pd * j) / n, z1 = cz - pd + (2 * pd * (j + 1)) / n;
        const h = (x, z) => t.heightAt(x, z) + 0.28;
        gb.quad([x0, h(x0, z1), z1], [x1, h(x1, z1), z1], [x1, h(x1, z0), z0], [x0, h(x0, z0), z0], [x0 / 6, z1 / 6], [x1 / 6, z1 / 6], [x1 / 6, z0 / 6], [x0 / 6, z0 / 6], [1, 1, 1]);
      }
      const pl = chunks.get(cx, cz, 'plain');
      const white = hexColor(0xf2f2f2);
      // líneas de cal
      const line = (x0, x1, z0, z1) => pl.box(x0, x1, y, y + 0.03, z0, z1, white);
      line(cx - pw, cx + pw, cz - pd, cz - pd + 0.2); line(cx - pw, cx + pw, cz + pd - 0.2, cz + pd);
      line(cx - pw, cx - pw + 0.2, cz - pd, cz + pd); line(cx + pw - 0.2, cx + pw, cz - pd, cz + pd);
      line(cx - 0.1, cx + 0.1, cz - pd, cz + pd);
      // arcos
      for (const s of [-1, 1]) {
        const gx = cx + s * (pw - 0.3);
        pl.box(gx - 0.1, gx + 0.1, y, y + 2.4, cz - 3.6, cz - 3.4, white);
        pl.box(gx - 0.1, gx + 0.1, y, y + 2.4, cz + 3.4, cz + 3.6, white);
        pl.box(gx - 0.1, gx + 0.1, y + 2.3, y + 2.5, cz - 3.6, cz + 3.6, white);
        this.colliders.addCircle(gx, cz - 3.5, 0.15, y - 1, y + 2.5, 'arco');
        this.colliders.addCircle(gx, cz + 3.5, 0.15, y - 1, y + 2.5, 'arco');
      }
      // tribunas azul y blanca
      const navy = hexColor(0x1c2f6b), wh = hexColor(0xe8e8e8);
      for (const s of [-1, 1]) {
        const z0 = s < 0 ? cz - pd - 7 : cz + pd + 2.5, z1 = s < 0 ? cz - pd - 2.5 : cz + pd + 7;
        for (let k = 0; k < 4; k++) {
          const yy = y + k * 0.7;
          const za = s < 0 ? z0 + k * 1.1 : z0, zb = s < 0 ? z1 : z1 - k * 1.1;
          pl.box(cx - pw + 2, cx + pw - 2, yy, yy + 0.7, za, zb, k % 2 ? navy : wh);
        }
        this.colliders.addBox(cx - pw + 2, cx + pw - 2, z0, z1, y - 1, y + 2.8, 'tribuna');
      }
      // paredón perimetral con la banda azul
      const wallH = 3.2;
      const wall = (x0, x1, z0, z1) => {
        pl.box(x0, x1, y - 1, y + wallH, z0, z1, wh);
        pl.box(x0 - 0.02, x1 + 0.02, y + 1.1, y + 2.0, z0 - 0.02, z1 + 0.02, navy);
        this.colliders.addBox(x0, x1, z0, z1, y - 1, y + wallH, 'paredon');
      };
      const m = 3.4;
      wall(b.x0 + m, b.x1 - m, b.z0 + m, b.z0 + m + 0.3);
      wall(b.x0 + m, b.x1 - m, b.z1 - m - 0.3, b.z1 - m);
      wall(b.x0 + m, b.x0 + m + 0.3, b.z0 + m, cz - 4);
      wall(b.x0 + m, b.x0 + m + 0.3, cz + 4, b.z1 - m);
      wall(b.x1 - m - 0.3, b.x1 - m, b.z0 + m, b.z1 - m);
      this.addSign(['LA MADRIGUERA'], b.x0 + m - 0.05, y + 4.3, cz, 12, 1.6, -Math.PI / 2, { bg: '#1c2f6b', fg: '#ffffff' });
      this.addSign(['CLUB ATLÉTICO JORGE NEWBERY'], b.x1 - m + 0.05 - 0.3 + 0.35, y + 2.3, cz, 16, 1.2, Math.PI / 2, { bg: '#ffffff', fg: '#1c2f6b' });
      this.markers.madriguera = { x: b.x0 + 1.3, z: cz };
      return [[b.x0, b.x1, b.z0, b.z1]];
    }, true);

    // Barrio Industrial: gimnasio y Chapa y Pintura
    sp('industrial', 0, 0, 'gimnasio', function (b, chunks) {
      const r = [b.x0 + 8, b.x1 - 8, b.z0 + 14, b.z1 - 4.5];
      const res = this.addBuilding(chunks, r[0], r[1], r[2], r[3], 2, { mat: 'metal', color: 0xd06a3a, floorH: 3.4, roof: 'gable', roofColor: 0x9aa0a4, rise: 1.5 });
      this.addSign(['GIMNASIO', 'MÚSCULO PATAGÓNICO'], (r[0] + r[1]) / 2, res.floor + 4.5, r[3] + 0.05, 14, 2.6, 0, { bg: '#222222', fg: '#ff9030' });
      this.markers.gimnasio = { x: (r[0] + r[1]) / 2, z: r[3] + 2 };
      return [r];
    });

    sp('industrial', 1, 0, 'chapa', function (b, chunks) {
      const t = this.terrain;
      const r = [b.x0 + 16, b.x1 - 16, b.z0 + 20, b.z1 - 0.5];
      const { min, max } = this.footprintHeights(r[0], r[1], r[2], r[3]);
      const y0 = min - 0.5, y1 = max + 5.5;
      const gb = chunks.get(r[0], r[2], 'metal');
      const col = hexColor(0x3f6fa8);
      const th = 0.5;
      gb.box(r[0], r[0] + th, y0, y1, r[2], r[3], col, 3, 3);
      gb.box(r[1] - th, r[1], y0, y1, r[2], r[3], col, 3, 3);
      gb.box(r[0], r[1], y0, y1, r[2], r[2] + th, col, 3, 3);
      const rf = chunks.get(r[0], r[2], 'roofFlat');
      rf.box(r[0] - 0.3, r[1] + 0.3, y1, y1 + 0.4, r[2] - 0.3, r[3] + 0.3, hexColor(0xa0a0a0));
      this.colliders.addBox(r[0], r[0] + th, r[2], r[3], y0, y1 + 0.4, 'chapa');
      this.colliders.addBox(r[1] - th, r[1], r[2], r[3], y0, y1 + 0.4, 'chapa');
      this.colliders.addBox(r[0], r[1], r[2], r[2] + th, y0, y1 + 0.4, 'chapa');
      this.addSign(['CHAPA Y PINTURA', 'DON TITO'], (r[0] + r[1]) / 2, y1 - 1, r[3] + 0.05, 14, 2.4, 0, { bg: '#f0f0f0', fg: '#1d4f9f' });
      this.markers.chapa = { x: (r[0] + r[1]) / 2, z: (r[2] + r[3]) / 2 + 2, rect: [r[0] + 1, r[1] - 1, r[2] + 1, r[3]] };
      void t;
      return [[r[0], r[1], r[2], b.z1]];
    });

    // Km 3: Museo del Petróleo con torre de perforación
    sp('km3', 1, 2, 'museo', function (b, chunks) {
      const r = [b.x0 + 8, b.x1 - 8, b.z0 + 8, b.z0 + 30];
      const res = this.addBuilding(chunks, r[0], r[1], r[2], r[3], 1, { mat: 'brick', floorH: 4, color: 0xd8c8b8, roof: 'gable', roofColor: 0x7a3326, rise: 2.5 });
      this.addSign(['MUSEO DEL PETRÓLEO'], (r[0] + r[1]) / 2, res.floor + 3.2, r[3] + 0.05, 12, 1.4, 0, { bg: '#2a2a2a', fg: '#f2c230' });
      // torre de perforación de madera (la del pozo N°2)
      const cx = (b.x0 + b.x1) / 2, cz = b.z1 - 16;
      const y = this.terrain.heightAt(cx, cz);
      const gb = chunks.get(cx, cz, 'plain');
      const wood = hexColor(0x5a4030);
      const H = 22, B = 3.2, Tp = 0.8;
      for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        const steps = 11;
        for (let k = 0; k < steps; k++) {
          const t0 = k / steps, t1 = (k + 1) / steps;
          const w0 = B + (Tp - B) * t0, w1 = B + (Tp - B) * t1;
          const x0 = cx + sx * w0, z0 = cz + sz * w0, x1 = cx + sx * w1, z1 = cz + sz * w1;
          gb.box(Math.min(x0, x1) - 0.15, Math.max(x0, x1) + 0.15, y + H * t0, y + H * t1, Math.min(z0, z1) - 0.15, Math.max(z0, z1) + 0.15, wood);
        }
      }
      for (let k = 1; k < 6; k++) {
        const t0 = k / 6, w = B + (Tp - B) * t0, yy = y + H * t0;
        gb.box(cx - w, cx + w, yy, yy + 0.2, cz - w, cz - w + 0.2, wood);
        gb.box(cx - w, cx + w, yy, yy + 0.2, cz + w - 0.2, cz + w, wood);
        gb.box(cx - w, cx - w + 0.2, yy, yy + 0.2, cz - w, cz + w, wood);
        gb.box(cx + w - 0.2, cx + w, yy, yy + 0.2, cz - w, cz + w, wood);
      }
      this.colliders.addBox(cx - B, cx + B, cz - B, cz + B, y - 1, y + H, 'torre');
      this.addSign(['POZO N°2 — 13 DIC 1907'], cx, y + 1.4, cz + B + 0.8, 5, 0.7, 0, { bg: '#f2e8c8', fg: '#3a2a1a', double: true });
      this.markers.museo = { x: (r[0] + r[1]) / 2, z: r[3] + 2 };
      return [r, [cx - B - 1, cx + B + 1, cz - B - 1, cz + B + 1]];
    });

    // Rada Tilly: la mansión de los Chetos
    sp('rada', 3, 4, 'mansion', function (b, chunks) {
      const r = [b.x0 + 6, b.x1 - 6, b.z0 + 6, b.z1 - 14];
      const res = this.addBuilding(chunks, r[0], r[1], r[2], r[3], 2, { mat: 'house', floorH: 3.2, color: 0xf7f5f0, roof: 'flat', roofColor: 0x9d9890 });
      // pileta
      const t = this.terrain;
      const px = (r[0] + r[1]) / 2, pz = r[3] + 6;
      const y = t.heightAt(px, pz) + 0.25;
      const gb = chunks.get(px, pz, 'plain');
      gb.box(px - 7, px + 7, y - 0.2, y, pz - 3, pz + 3, hexColor(0x3aa8d8));
      gb.box(px - 7.6, px + 7.6, y - 0.3, y - 0.05, pz - 3.6, pz + 3.6, hexColor(0xe8e0d0));
      this.addSign(['PROPIEDAD PRIVADA — CHETOS'], (r[0] + r[1]) / 2, res.floor + 3, r[3] + 0.05, 9, 0.9, 0, { bg: '#7b2d8b', fg: '#ffffff' });
      this.markers.mansion = { x: px, z: pz + 5 };
      return [r, [px - 8, px + 8, pz - 4, pz + 4]];
    });

    return S;
  }

  // ---- Puerto ----
  buildPuerto(chunks, rng) {
    const add = (x0, x1, z0, z1, floors, color) => this.addBuilding(chunks, x0, x1, z0, z1, floors, { mat: 'metal', color, floorH: 3.2, roof: 'gable', roofColor: 0x8d9296, rise: 1.8 });
    add(305, 345, 405, 440, 3, 0xb8c0c4);
    add(355, 415, 405, 435, 3, 0x9fb0b8);
    add(445, 500, 405, 440, 4, 0xa7b8a0);
    add(305, 350, 495, 540, 3, 0xc9b890);
    add(365, 420, 495, 530, 2, 0xb8c0c4);
    this.addSign(['PUERTO COMODORO'], 382, 13, 404.9, 18, 2, Math.PI, { bg: '#1d3f8f', fg: '#ffffff' });
    this.addSign(['PESQUERA SAN JORGE'], 327, 11, 494.9, 14, 1.6, Math.PI, { bg: '#f2f2ee', fg: '#1a4f7a' });
    this.containers = [];
    const cols = [0xb03020, 0x2050a0, 0x208050, 0xd09020, 0x707070, 0xe06020, 0x9a2a6a];
    for (let i = 0; i < 18; i++) {
      const x = 450 + (i % 6) * 13, z = 500 + Math.floor(i / 6) * 5.5;
      const stack = rng.int(1, 3);
      for (let s = 0; s < stack; s++) this.containers.push({ x, z, y: this.terrain.heightAt(x, z) + s * 2.6, color: rng.pick(cols), rot: 0 });
      this.colliders.addBox(x - 6.1, x + 6.1, z - 1.25, z + 1.25, -2, this.terrain.heightAt(x, z) + stack * 2.6, 'container');
    }
    for (let i = 0; i < 6; i++) {
      const x = 470 + i * 13, z = 425;
      this.containers.push({ x, z, y: this.terrain.heightAt(x, z), color: rng.pick(cols), rot: 0 });
      this.colliders.addBox(x - 6.1, x + 6.1, z - 1.25, z + 1.25, -2, this.terrain.heightAt(x, z) + 2.6, 'container');
    }
  }

  // Cosas fuera de los dameros: estaciones de servicio, galpones, casillas
  buildOutside(chunks, rng, T) {
    const t = this.terrain;
    // Estación de servicio YPZ en Km 5 (sobre Ruta 3)
    const gas = (cx, cz, rot) => {
      const gb = chunks.get(cx, cz, 'plain');
      const y = t.heightAt(cx, cz);
      gb.box(cx - 9, cx + 9, y + 5, y + 5.8, cz - 6, cz + 6, hexColor(0xf2f2f2));
      gb.box(cx - 9.05, cx + 9.05, y + 5.2, y + 5.6, cz - 6.05, cz + 6.05, hexColor(0x1b4fa0));
      for (const [ox, oz] of [[-6, -3], [6, -3], [-6, 3], [6, 3]]) {
        gb.box(cx + ox - 0.3, cx + ox + 0.3, y, y + 5, cz + oz - 0.3, cz + oz + 0.3, hexColor(0xe0e0e0));
        this.colliders.addCircle(cx + ox, cz + oz, 0.4, y - 1, y + 5, 'surtidor');
      }
      for (const ox of [-3, 3]) {
        gb.box(cx + ox - 0.5, cx + ox + 0.5, y, y + 1.6, cz - 0.6, cz + 0.6, hexColor(0x1b4fa0));
        this.colliders.addBox(cx + ox - 0.5, cx + ox + 0.5, cz - 0.6, cz + 0.6, y - 1, y + 1.6, 'surtidor');
      }
      this.gasPumps = this.gasPumps || [];
      this.gasPumps.push({ x: cx, z: cz });
      this.addSign(['YPZ'], cx, y + 5.4, cz + 6.07, 5, 0.8, 0, { bg: '#1b4fa0', fg: '#ffffff', border: false });
      this.addSign(['YPZ'], cx, y + 5.4, cz - 6.07, 5, 0.8, Math.PI, { bg: '#1b4fa0', fg: '#ffffff', border: false });
      const sh = [cx + 12, cx + 20, cz - 5, cz + 5];
      this.addBuilding(chunks, sh[0], sh[1], sh[2], sh[3], 1, { mat: 'office', color: 0xf2f2f2, floorH: 3.4 });
      void rot;
    };
    gas(432, -1020, 0);
    gas(-560, 240, 0);
    // Galpones y trailers del campamento petrolero
    const camp = (cx, cz) => {
      for (let i = 0; i < 4; i++) {
        const x = cx + (i % 2) * 14 - 7, z = cz + Math.floor(i / 2) * 9 - 4.5;
        this.addBuilding(chunks, x - 5.5, x + 5.5, z - 1.4, z + 1.4, 1, { mat: 'metal', floorH: 2.7, color: 0xf2f2f2, roof: 'flat' });
      }
      this.addSign(['PETROLERA SAN JORGE — CAMPAMENTO'], cx, t.heightAt(cx, cz) + 4.2, cz + 9, 12, 1.1, 0, { bg: '#f26a1b', fg: '#ffffff', double: true });
    };
    camp(-1160, -900);
    // Depósito de Don Crudo (Km 3)
    {
      const cx = 20, cz = -715;
      this.addBuilding(chunks, cx - 20, cx + 5, cz - 20, cz - 5, 2, { mat: 'metal', floorH: 3.5, color: 0x6a6f74, roof: 'gable', roofColor: 0x4a4f54, rise: 1.5 });
      this.addSign(['DEPÓSITO CRUDO S.A.'], cx - 7.5, t.heightAt(cx, cz) + 8.5, cz - 4.9, 12, 1.4, 0, { bg: '#111418', fg: '#e8c060' });
    }
    // Aeropuerto: terminal y torre
    {
      const cx = -390, cz = -1340;
      this.addBuilding(chunks, cx - 30, cx + 20, cz - 30, cz - 12, 2, { mat: 'office', color: 0xd8d8d0, floorH: 4 });
      const gb = chunks.get(cx, cz, 'plain');
      const y = t.heightAt(cx + 30, cz - 20);
      gb.box(cx + 26, cx + 30, y, y + 18, cz - 24, cz - 20, hexColor(0xd8d8d0));
      gb.box(cx + 24.5, cx + 31.5, y + 18, y + 21, cz - 25.5, cz - 18.5, hexColor(0x3a5a6a));
      this.colliders.addBox(cx + 26, cx + 30, cz - 24, cz - 20, y - 1, y + 21, 'torre');
      this.addSign(['AEROPUERTO GRAL. MOSCONI'], cx - 5, t.heightAt(cx, cz - 12) + 6.5, cz - 11.9, 20, 1.6, 0, { bg: '#f2f2ee', fg: '#1d3f8f' });
      // pista
      const pg = chunks.get(-700, -1380, 'plain');
      for (let x = -960; x < -420; x += 20) {
        const hh = (xx, zz) => t.heightAt(xx, zz) + 0.1;
        pg.quad([x, hh(x, -1360), -1360], [x + 20, hh(x + 20, -1360), -1360], [x + 20, hh(x + 20, -1400), -1400], [x, hh(x, -1400), -1400], [0, 0], [1, 0], [1, 1], [0, 1], hexColor(0x4a4b4e));
        if ((x / 20) % 2 === 0) pg.quad([x + 4, hh(x, -1380) + 0.02, -1379.5], [x + 14, hh(x, -1380) + 0.02, -1379.5], [x + 14, hh(x, -1380) + 0.02, -1380.5], [x + 4, hh(x, -1380) + 0.02, -1380.5], [0, 0], [1, 0], [1, 1], [0, 1], hexColor(0xe8e8e0));
      }
    }
    // Cartel de bienvenida
    this.addSign(['BIENVENIDOS A COMODORO RIVADAVIA', 'CAPITAL NACIONAL DEL PETRÓLEO'], 428, t.heightAt(428, -1560) + 5, -1560, 16, 3.2, Math.PI / 2, { bg: '#1d6b3a', fg: '#ffffff', sizes: [40, 40], double: true });
    this.addSign(['RADA TILLY', 'LA VILLA BALNEARIA MÁS AUSTRAL'], 160, t.heightAt(160, 1070) + 4, 1070, 12, 2.6, 0, { bg: '#1d6b3a', fg: '#ffffff', sizes: [52, 30], double: true });
    // postes de los carteles
    {
      const gb = chunks.get(428, -1560, 'plain');
      const y = t.heightAt(428, -1560);
      gb.box(427.8, 428.2, y, y + 3.4, -1567, -1566.6, hexColor(0x777777));
      gb.box(427.8, 428.2, y, y + 3.4, -1553.4, -1553, hexColor(0x777777));
      const y2 = t.heightAt(160, 1070);
      gb.box(154.8, 155.2, y2, y2 + 2.8, 1069.8, 1070.2, hexColor(0x777777));
      gb.box(164.8, 165.2, y2, y2 + 2.8, 1069.8, 1070.2, hexColor(0x777777));
    }
    // Carteles publicitarios (parodias)
    const ads = [
      [['FERNET BRANCALEONE', 'EL QUE VA CON COCA'], 470, -300, -Math.PI / 2, '#101010', '#f0f0f0'],
      [['QUILMEZ', 'EL SABOR DEL ENCUENTRO... CON EL VIENTO'], 300, 870, -0.6, '#1a3a8a', '#ffffff'],
      [['CTE MÓVIL', 'AHORA CON SEÑAL EN EL CHENQUE (A VECES)'], -250, 205, 0, '#d01818', '#ffffff'],
      [['TOYODA JILUX', 'PARA EL PETROLERO QUE SE LO MERECE'], 420, -1250, -Math.PI / 2, '#f2f2f2', '#d01818'],
      [['RADIO CUMBIA VILLERA 104.5', '¡EL AGUANTE DEL SUR!'], 250, 990, 0.3, '#6a1a8a', '#ffe040'],
      [['VAMOS EL LOBO', 'AGUANTE NEWBERY'], -100, 230, 0, '#1c2f6b', '#ffffff'],
    ];
    for (const [lines, x, z, rot, bg, fg] of ads) {
      const y = t.heightAt(x, z);
      const gb = chunks.get(x, z, 'plain');
      const dx = Math.cos(rot) * 4.5, dz = -Math.sin(rot) * 4.5;
      gb.box(x + dx - 0.2, x + dx + 0.2, y, y + 7, z + dz - 0.2, z + dz + 0.2, hexColor(0x555555));
      gb.box(x - dx - 0.2, x - dx + 0.2, y, y + 7, z - dz - 0.2, z - dz + 0.2, hexColor(0x555555));
      this.colliders.addCircle(x + dx, z + dz, 0.3, y - 1, y + 7, 'cartel');
      this.colliders.addCircle(x - dx, z - dz, 0.3, y - 1, y + 7, 'cartel');
      this.addSign(lines, x, y + 7.5, z, 12, 4, rot, { bg, fg, double: true, sizes: [64, 30] });
    }
  }

  // Posiciones de paradas de vereda (para peatones): devuelve un punto sobre la vereda de la manzana
  sidewalkPoint(b, t, side) {
    const i = SW / 2;
    const x0 = b.x0 + i, x1 = b.x1 - i, z0 = b.z0 + i, z1 = b.z1 - i;
    switch (side) {
      case 0: return [x0 + (x1 - x0) * t, z0];
      case 1: return [x1, z0 + (z1 - z0) * t];
      case 2: return [x1 - (x1 - x0) * t, z1];
      default: return [x0, z1 - (z1 - z0) * t];
    }
  }
}

export { CURB, SW };
void GeoBuilder;
