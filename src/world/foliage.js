import * as THREE from 'three';
import { RNG } from '../util.js';

// ---------------------------------------------------------------------------
// Follaje: árboles y matas hechos con planos cruzados y textura con recorte
// (como los árboles de los juegos de PS2), más un núcleo sólido para que no se
// vean vacíos desde arriba.
// ---------------------------------------------------------------------------

// Atlas 512x512: [0..224] álamo, [224..448] pino, [448..480] hojas densas verdes, [480..512] hojas densas oscuras
const A = { alamo: [0, 224], pino: [224, 448], denseA: [448, 480], denseP: [480, 512] };
let ATLAS = null;
let TUFTS = null;

function leaf(g, x, y, r, col, rng) {
  g.fillStyle = col;
  g.beginPath();
  g.ellipse(x, y, r, r * rng.range(0.5, 0.8), rng.range(0, Math.PI), 0, Math.PI * 2);
  g.fill();
}
const hsl = (h, s, l) => `hsl(${h},${s}%,${l}%)`;

export function foliageAtlas() {
  if (ATLAS) return ATLAS;
  const S = 512;
  const c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d');
  const rng = new RNG(99);
  g.clearRect(0, 0, S, S);
  // --- álamo (columnar, punta arriba) ---
  {
    const [x0, x1] = A.alamo, w = x1 - x0, cx = x0 + w / 2;
    const top = 8, bot = 500;
    const halfW = (y) => { const t = (y - top) / (bot - top); return w * 0.46 * Math.pow(Math.sin(Math.min(1, t * 1.05) * Math.PI * 0.92 + 0.05), 0.9) * (0.55 + 0.45 * t); };
    for (let i = 0; i < 5200; i++) {
      const y = rng.range(top, bot);
      const hw = halfW(y);
      const x = cx + rng.range(-1, 1) * hw * Math.sqrt(rng.next());
      const t = (y - top) / (bot - top);
      const side = (x - cx) / (hw || 1);
      const l = 20 + rng.range(0, 14) + (1 - t) * 8 + side * 5 - (i < 1800 ? 6 : 0);
      leaf(g, x, y, rng.range(2.5, 6), hsl(rng.range(70, 95), rng.range(35, 55), l), rng);
    }
    // ramitas que asoman del contorno
    for (let i = 0; i < 260; i++) {
      const y = rng.range(top + 20, bot - 10);
      const s = rng.chance(0.5) ? 1 : -1;
      const x = cx + s * halfW(y) * rng.range(0.95, 1.15);
      leaf(g, x, y, rng.range(2, 4), hsl(rng.range(70, 95), 45, rng.range(24, 36)), rng);
    }
  }
  // --- pino (pisos de ramas caídas) ---
  {
    const [x0, x1] = A.pino, w = x1 - x0, cx = x0 + w / 2;
    const tiers = 7, top = 6, bot = 505;
    for (let k = 0; k < tiers; k++) {
      const t0 = k / tiers, t1 = (k + 1.35) / tiers;
      const yA = top + t0 * (bot - top), yB = Math.min(bot, top + t1 * (bot - top));
      const wB = w * (0.16 + 0.34 * ((k + 1) / tiers));
      for (let i = 0; i < 700; i++) {
        const u = Math.sqrt(rng.next());
        const y = yA + u * (yB - yA);
        const hw = wB * u;
        const x = cx + rng.range(-1, 1) * hw;
        const droop = Math.abs(x - cx) / (wB || 1) * 10;
        const l = 13 + rng.range(0, 10) + (1 - u) * 6;
        g.strokeStyle = hsl(rng.range(120, 150), rng.range(25, 40), l);
        g.lineWidth = rng.range(1.2, 2.6);
        g.beginPath(); g.moveTo(x, y + droop); g.lineTo(x + rng.range(-5, 5), y + droop + rng.range(3, 8)); g.stroke();
      }
    }
    g.fillStyle = '#3a2a1c'; g.fillRect(cx - 3, bot - 30, 6, 30);
  }
  // --- parches densos para los núcleos ---
  for (const [key, h0, h1, l0] of [['denseA', 70, 95, 16], ['denseP', 120, 150, 10]]) {
    const [x0, x1] = A[key];
    g.fillStyle = hsl((h0 + h1) / 2, 40, l0 + 4);
    g.fillRect(x0, 0, x1 - x0, S);
    for (let i = 0; i < 2600; i++) leaf(g, rng.range(x0, x1), rng.range(0, S), rng.range(2, 4.5), hsl(rng.range(h0, h1), rng.range(30, 50), l0 + rng.range(0, 16)), rng);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  const mat = new THREE.MeshLambertMaterial({ map: t, alphaTest: 0.45, side: THREE.FrontSide });
  ATLAS = { texture: t, material: mat };
  return ATLAS;
}

// Geometría de un árbol: planos cruzados (ambas caras, con normales "esféricas") + núcleo
function cards(kind, width, y0, y1, nPlanes, pos, nor, uv, idx) {
  const [ux0, ux1] = A[kind];
  const u0 = ux0 / 512, u1 = ux1 / 512;
  const yc = (y0 + y1) / 2, hh = (y1 - y0) / 2;
  for (let p = 0; p < nPlanes; p++) {
    const a = (p / nPlanes) * Math.PI + 0.3;
    const dx = Math.cos(a) * width / 2, dz = Math.sin(a) * width / 2;
    const rows = 2;
    for (const face of [1, -1]) {
      const base = pos.length / 3;
      for (let r = 0; r <= rows; r++) {
        const t = r / rows, y = y0 + t * (y1 - y0);
        for (let cI = 0; cI <= 2; cI++) {
          const s = cI - 1;
          const x = dx * s, z = dz * s;
          pos.push(x, y, z);
          // normal que apunta hacia afuera del eje, con algo de "arriba"
          const ny = 0.35 + ((y - yc) / hh) * 0.45;
          const nx = x / (width / 2) + Math.cos(a + Math.PI / 2) * face * 0.35;
          const nz = z / (width / 2) + Math.sin(a + Math.PI / 2) * face * 0.35;
          const L = Math.hypot(nx, ny, nz) || 1;
          nor.push(nx / L, ny / L, nz / L);
          uv.push(u0 + (u1 - u0) * (cI / 2), t);
        }
      }
      for (let r = 0; r < rows; r++) {
        for (let cI = 0; cI < 2; cI++) {
          const a0 = base + r * 3 + cI, b0 = a0 + 1, c0 = a0 + 3, d0 = c0 + 1;
          if (face > 0) idx.push(a0, b0, c0, b0, d0, c0); else idx.push(a0, c0, b0, b0, c0, d0);
        }
      }
    }
  }
}

function core(kind, rx, y0, y1, pos, nor, uv, idx, seed) {
  const geo = new THREE.IcosahedronGeometry(1, 0);
  const rng = new RNG(seed);
  const p = geo.attributes.position;
  const [ux0, ux1] = A[kind];
  const base = pos.length / 3;
  const yc = (y0 + y1) / 2, ry = (y1 - y0) / 2;
  const jit = new Map();
  for (let i = 0; i < p.count; i++) {
    const k = `${p.getX(i).toFixed(3)},${p.getY(i).toFixed(3)},${p.getZ(i).toFixed(3)}`;
    if (!jit.has(k)) jit.set(k, rng.range(0.82, 1.12));
    const j = jit.get(k);
    const x = p.getX(i) * rx * j, y = yc + p.getY(i) * ry * j, z = p.getZ(i) * rx * j;
    pos.push(x, y, z);
    const n = new THREE.Vector3(p.getX(i), p.getY(i) * 0.7 + 0.25, p.getZ(i)).normalize();
    nor.push(n.x, n.y, n.z);
    uv.push((ux0 + (ux1 - ux0) * (0.5 + Math.atan2(p.getZ(i), p.getX(i)) / (2 * Math.PI))) / 512, 0.5 + p.getY(i) * 0.45);
  }
  for (let i = 0; i < p.count; i++) idx.push(base + i);
}

const treeCache = new Map();
export function treeGeometry(kind) {
  if (treeCache.has(kind)) return treeCache.get(kind);
  const pos = [], nor = [], uv = [], idx = [];
  if (kind === 'alamo') {
    core('denseA', 1.05, 2.6, 13.2, pos, nor, uv, idx, 3);
    cards('alamo', 3.6, 1.2, 15.5, 3, pos, nor, uv, idx);
  } else {
    core('denseP', 1.5, 1.8, 8.2, pos, nor, uv, idx, 4);
    cards('pino', 5.4, 0.6, 11, 3, pos, nor, uv, idx);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeBoundingSphere();
  treeCache.set(kind, g);
  return g;
}

// ---- Matas de la estepa: coirón (pasto en mata) y neneo (arbusto redondo) ----
export function tuftAssets() {
  if (TUFTS) return TUFTS;
  const W = 256, H = 128;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  const rng = new RNG(31);
  // coirón: hojas finas que salen de la base, secas y doradas
  for (let i = 0; i < 420; i++) {
    const bx = 64 + rng.range(-16, 16), by = H - 2;
    const ang = rng.range(-1.15, 1.15), len = rng.range(40, 118) * (1 - Math.abs(ang) * 0.3);
    const tx = bx + Math.sin(ang) * len, ty = by - Math.cos(ang) * len;
    g.strokeStyle = hsl(rng.range(38, 58), rng.range(28, 50), rng.range(38, 66));
    g.lineWidth = rng.range(1, 2);
    g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo(bx + Math.sin(ang) * len * 0.3, by - len * 0.7, tx, ty); g.stroke();
  }
  // neneo: arbusto redondo verde oliva con puntitos amarillos
  for (let i = 0; i < 1600; i++) {
    const a = rng.range(0, Math.PI), r = Math.sqrt(rng.next()) * 58;
    const x = 192 + Math.cos(a) * r * rng.chance(0.5 ? 1 : 1) * (rng.chance(0.5) ? 1 : -1), y = H - 4 - Math.sin(a) * r * 0.95;
    leaf(g, x, y, rng.range(1.5, 3.5), hsl(rng.range(62, 85), rng.range(25, 40), rng.range(20, 38)), rng);
  }
  for (let i = 0; i < 90; i++) {
    const a = rng.range(0.2, Math.PI - 0.2), r = rng.range(30, 56);
    leaf(g, 192 + Math.cos(a) * r, H - 4 - Math.sin(a) * r * 0.95, 1.8, hsl(50, 80, 55), rng);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshLambertMaterial({ map: t, alphaTest: 0.4, side: THREE.DoubleSide });
  const make = (u0, u1) => {
    const pos = [], nor = [], uv = [], idx = [];
    for (let p = 0; p < 3; p++) {
      const a = (p / 3) * Math.PI;
      const dx = Math.cos(a), dz = Math.sin(a);
      const b = pos.length / 3;
      for (const [s, v] of [[-1, 0], [1, 0], [1, 1], [-1, 1]]) {
        pos.push(dx * s, v * 1.1, dz * s);
        nor.push(dx * s * 0.4, 1, dz * s * 0.4);
        uv.push(u0 + (u1 - u0) * (s + 1) / 2, v);
      }
      idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.normalizeNormals && geo.normalizeNormals();
    return geo;
  };
  TUFTS = { material: mat, coiron: make(0, 0.5), neneo: make(0.5, 1) };
  return TUFTS;
}
