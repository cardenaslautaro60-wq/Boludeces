import * as THREE from 'three';
import { lam, STYLE } from '../render/style.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { hexColor } from '../world/geom.js';
import { clamp, lerp, RNG } from '../util.js';

// ---------------------------------------------------------------------------
// Modelos de autos: carrocería "loft" (secciones redondeadas a lo largo del auto),
// vidrios, cromados, ópticas y patentes negras de los 2000.
// ---------------------------------------------------------------------------

// Atlas de detalles (parrilla, ópticas, patentes, plástico negro)
let DETAIL = null;
const DR = {
  black: [0, 0, 64, 64], grille: [64, 0, 64, 32], head: [128, 0, 64, 32], tail: [192, 0, 64, 32],
  plate: [64, 32, 64, 16], turn: [128, 32, 32, 16], rubber: [0, 64, 64, 64], bus: [64, 64, 192, 64],
  tank: [0, 128, 128, 64], light: [160, 32, 32, 16],
  police: [0, 192, 192, 24], remis: [192, 192, 64, 32], orange: [128, 128, 32, 32], yellow: [160, 128, 32, 32],
  empresa: [0, 224, 128, 24],
};
function detailAtlas() {
  if (DETAIL) return DETAIL;
  const S = 256;
  const c = document.createElement('canvas'); c.width = c.height = S;
  const e = document.createElement('canvas'); e.width = e.height = S;
  const g = c.getContext('2d'), ge = e.getContext('2d');
  ge.fillStyle = '#000'; ge.fillRect(0, 0, S, S);
  const R = (k, fill) => { const [x, y, w, h] = DR[k]; g.fillStyle = fill; g.fillRect(x, y, w, h); return [x, y, w, h]; };
  R('black', '#1b1b1d');
  { const [x, y, w, h] = R('grille', '#141416'); g.fillStyle = '#6a6e72'; for (let i = 2; i < h; i += 5) g.fillRect(x + 2, y + i, w - 4, 2); g.fillRect(x + w / 2 - 6, y + 4, 12, h - 8); }
  { const [x, y, w, h] = R('head', '#dfe6ea'); const gr = g.createRadialGradient(x + w / 2, y + h / 2, 2, x + w / 2, y + h / 2, w / 2); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#9aa6ae'); g.fillStyle = gr; g.fillRect(x, y, w, h); ge.fillStyle = '#fff6d8'; ge.fillRect(x, y, w, h); }
  { const [x, y, w, h] = R('tail', '#8a0c0c'); g.fillStyle = '#c81818'; g.fillRect(x + 3, y + 3, w - 6, h - 6); g.fillStyle = '#e8a020'; g.fillRect(x + w - 14, y + 3, 11, h - 6); g.fillStyle = '#f2f2f2'; g.fillRect(x + 3, y + 3, 9, h - 6); ge.fillStyle = '#801010'; ge.fillRect(x, y, w, h); }
  { const [x, y, w, h] = R('plate', '#0e0e10'); g.strokeStyle = '#c8c8c8'; g.lineWidth = 1; g.strokeRect(x + 1, y + 1, w - 2, h - 2); g.fillStyle = '#f2f2f2'; g.font = 'bold 11px Arial'; g.textAlign = 'center'; g.fillText('RVX 104', x + w / 2, y + 12); g.textAlign = 'left'; }
  R('turn', '#e89020'); { const [x, y, w, h] = DR.turn; ge.fillStyle = '#402000'; ge.fillRect(x, y, w, h); }
  R('light', '#fff4c0'); { const [x, y, w, h] = DR.light; ge.fillStyle = '#fff4c0'; ge.fillRect(x, y, w, h); }
  { const [x, y, w, h] = R('rubber', '#1e1e1e'); for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.05})`; g.fillRect(x + Math.random() * w, y + Math.random() * h, 3, 3); } }
  { const [x, y, w, h] = R('bus', '#20303a'); for (let i = 0; i < 8; i++) { g.fillStyle = '#34505e'; g.fillRect(x + 4 + i * 23, y + 4, 19, h - 8); } }
  R('tank', '#d8d8d4');
  R('orange', '#f26a1b'); R('yellow', '#e8c020');
  { const [x, y, w, h] = R('police', '#1d3f8f'); g.fillStyle = '#f2f2f2'; g.fillRect(x, y, w, 3); g.fillRect(x, y + h - 3, w, 3); g.font = 'bold 15px Arial'; g.textAlign = 'center'; g.fillText('POLICÍA  ·  CHUBUT', x + w / 2, y + 17); g.textAlign = 'left'; }
  { const [x, y, w, h] = R('remis', '#1a6b2a'); g.fillStyle = '#ffe890'; g.font = 'bold 16px Arial'; g.textAlign = 'center'; g.fillText('REMIS', x + w / 2, y + 22); g.textAlign = 'left'; ge.fillStyle = '#306030'; ge.fillRect(x, y, w, h); }
  { const [x, y, w, h] = R('empresa', '#f26a1b'); g.fillStyle = '#ffffff'; g.font = 'bold 14px Arial'; g.textAlign = 'center'; g.fillText('PETROSUR S.A.', x + w / 2, y + 17); g.textAlign = 'left'; }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const te = new THREE.CanvasTexture(e); te.colorSpace = THREE.SRGBColorSpace;
  DETAIL = { map: t, emissive: te };
  return DETAIL;
}
function dUV(geo, k) {
  const [x, y, w, h] = DR[k];
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    const u = clamp(uv.getX(i), 0, 1), v = clamp(uv.getY(i), 0, 1);
    uv.setXY(i, (x + 1 + u * (w - 2)) / 256, 1 - (y + 1 + (1 - v) * (h - 2)) / 256);
  }
  return geo;
}

// Sección transversal redondeada (rectángulo con esquinas curvas y techo más angosto)
function section(hw, y0, y1, rTop, rBot, topNarrow = 1, n = STYLE.realista ? 7 : 3) {
  const pts = [];
  const hwTop = hw * topNarrow;
  pts.push([0, y0]);
  pts.push([hw - rBot, y0]);
  for (let k = 1; k <= n; k++) { const a = -Math.PI / 2 + (k / n) * (Math.PI / 2); pts.push([hw - rBot + Math.cos(a) * rBot, y0 + rBot + Math.sin(a) * rBot]); }
  // lado (con leve panza)
  const yMid = lerp(y0 + rBot, y1 - rTop, 0.5);
  pts.push([hw * 1.012, yMid]);
  pts.push([lerp(hw, hwTop, 0.6), y1 - rTop]);
  for (let k = 1; k <= n; k++) { const a = (k / n) * (Math.PI / 2); pts.push([hwTop - rTop + Math.cos(a) * rTop, y1 - rTop + Math.sin(a) * rTop]); }
  pts.push([0, y1]);
  // espejo
  const full = [...pts];
  for (let i = pts.length - 2; i >= 1; i--) full.push([-pts[i][0], pts[i][1]]);
  return full;
}

// Loft entre estaciones: [z, hw, y0, y1, rTop, rBot, topNarrow]
function loft(stations, closeEnds = true) {
  const rings = stations.map(([z, hw, y0, y1, rt, rb, tn]) => section(hw, y0, y1, Math.min(rt, (y1 - y0) / 2 - 0.001), Math.min(rb, (y1 - y0) / 2 - 0.001), tn === undefined ? 1 : tn).map(([x, y]) => [x, y, z]));
  const M = rings[0].length;
  const pos = [], uv = [], idx = [];
  const zMin = stations[0][0], zMax = stations[stations.length - 1][0];
  for (let i = 0; i < rings.length; i++) for (let j = 0; j < M; j++) {
    const [x, y, z] = rings[i][j];
    pos.push(x, y, z);
    uv.push((z - zMin) / (zMax - zMin || 1), j / (M - 1));
  }
  for (let i = 0; i < rings.length - 1; i++) for (let j = 0; j < M; j++) {
    const a = i * M + j, b = i * M + ((j + 1) % M), c = (i + 1) * M + j, d = (i + 1) * M + ((j + 1) % M);
    idx.push(a, b, c, b, d, c);
  }
  if (closeEnds) {
    for (const [ri, flip] of [[0, true], [rings.length - 1, false]]) {
      const ring = rings[ri];
      let cx = 0, cy = 0;
      for (const p of ring) { cx += p[0]; cy += p[1]; }
      cx /= M; cy /= M;
      const ci = pos.length / 3;
      pos.push(cx, cy, ring[0][2]); uv.push(ri ? 1 : 0, 0.5);
      for (let j = 0; j < M; j++) {
        const a = ri * M + j, b = ri * M + ((j + 1) % M);
        if (flip) idx.push(ci, b, a); else idx.push(ci, a, b);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}


// Carrocería con pasaruedas: interpola las estaciones clave y levanta el piso sobre cada rueda
function bodyLoft(keys, arches) {
  const zMin = keys[0][0], zMax = keys[keys.length - 1][0];
  const zs = new Set(keys.map((k) => k[0]));
  for (const [wz, R] of arches) {
    for (let k = 0; k <= 10; k++) { const z = wz - Math.cos((k / 10) * Math.PI) * R; if (z > zMin + 0.02 && z < zMax - 0.02) zs.add(z); }
    for (const z of [wz - R - 0.03, wz + R + 0.03]) if (z > zMin + 0.02 && z < zMax - 0.02) zs.add(z);
  }
  const sorted = [...zs].sort((a, b) => a - b);
  const st = sorted.map((z) => {
    let i = 0;
    while (i < keys.length - 2 && keys[i + 1][0] < z) i++;
    const a = keys[i], b = keys[i + 1];
    const t = clamp((z - a[0]) / (b[0] - a[0] || 1), 0, 1);
    const row = [z];
    for (let j = 1; j < 7; j++) row.push(lerp(a[j] === undefined ? 1 : a[j], b[j] === undefined ? 1 : b[j], t));
    for (const [wz, R, wy] of arches) {
      const d = z - wz;
      if (Math.abs(d) < R) row[2] = Math.max(row[2], wy + Math.sqrt(R * R - d * d));
    }
    row[2] = Math.min(row[2], row[3] - 0.08);
    return row;
  });
  return loft(st);
}

function rbox(w, h, d, r = 0.03) {
  const g = new THREE.BoxGeometry(w, h, d, 2, 2, 2);
  // redondear un poco las aristas
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const k = r / Math.max(0.001, Math.min(w, h, d));
    p.setXYZ(i, x * (1 - k * (Math.abs(y) > h * 0.49 && Math.abs(z) > d * 0.49 ? 1 : 0)), y, z);
  }
  g.computeVertexNormals();
  return g;
}
const clean = (g) => { const o = g.index ? g.toNonIndexed() : g; for (const k of Object.keys(o.attributes)) if (!['position', 'normal', 'uv'].includes(k)) o.deleteAttribute(k); if (!o.attributes.uv) o.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(o.attributes.position.count * 2), 2)); return o; };
const at = (g, x, y, z, rx = 0, ry = 0, rz = 0) => { g.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(1, 1, 1))); return g; };

// ---------- Rueda (cubierta + llanta con taza) ----------
const wheelCache = new Map();
export function wheelGeometry(r, width, bike = false) {
  const key = r.toFixed(2) + width.toFixed(2) + bike;
  if (wheelCache.has(key)) return wheelCache.get(key);
  // perfil en torno alrededor del eje X
  const hw = width / 2;
  const prof = bike
    ? [[r * 0.15, -hw * 0.4], [r * 0.9, -hw], [r, -hw * 0.5], [r, hw * 0.5], [r * 0.9, hw], [r * 0.15, hw * 0.4]]
    : [[0.02, -hw * 0.5], [r * 0.2, -hw * 0.6], [r * 0.5, -hw * 0.66], [r * 0.6, -hw * 0.92], [r * 0.64, -hw * 0.94], [r * 0.9, -hw], [r, -hw * 0.6], [r, hw * 0.6], [r * 0.9, hw], [r * 0.64, hw * 0.94], [r * 0.6, hw * 0.92], [r * 0.5, hw * 0.66], [r * 0.2, hw * 0.6], [0.02, hw * 0.5]];
  const g = new THREE.LatheGeometry(prof.map(([a, b]) => new THREE.Vector2(a, b)), 18);
  g.rotateZ(Math.PI / 2);
  // colores: cubierta negra, llanta de chapa gris, centro más oscuro
  const n = g.attributes.position.count;
  const col = new Float32Array(n * 3);
  const tire = hexColor(0x191919), rim = hexColor(bike ? 0x888888 : 0xa4a8ac), hub = hexColor(0x5a5e62);
  for (let i = 0; i < n; i++) {
    const y = g.attributes.position.getY(i), z = g.attributes.position.getZ(i);
    const rr = Math.hypot(y, z);
    const c = rr > r * 0.62 ? tire : rr > r * 0.3 ? rim : hub;
    col.set(c, i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.computeVertexNormals();
  wheelCache.set(key, g);
  return g;
}

// ---------- Construcción por estilo ----------
export function buildCarModel(key, T) {
  const L = T.L, W = T.W, H = T.H, hl = L / 2, hw = W / 2;
  const paint = [], glass = [], chrome = [], detail = [];
  let wheelR = 0.32, wheels = [], seats = [], lightsF = [], lightsR = [], camH = H, roofZ = 0;
  const addD = (g, region) => detail.push(clean(dUV(g, region)));
  const plane = (w, h) => new THREE.PlaneGeometry(w, h);
  const lights = (yF, yR, zF, zR, wx, round = false, hwL = 0.16, hhL = 0.1) => {
    for (const s of [-1, 1]) {
      const hg = round ? new THREE.CircleGeometry(hhL * 1.1, 12) : plane(hwL * 2, hhL * 2);
      addD(at(hg, s * wx, yF, zF + 0.005), 'head');
      addD(at(plane(0.1, 0.06), s * (wx + hwL + 0.06), yF - 0.02, zF - 0.01), 'turn');
      const tg = plane(hwL * 2, hhL * 1.8);
      addD(at(tg, s * wx, yR, zR - 0.005, 0, Math.PI, 0), 'tail');
      lightsF.push([s * wx, yF, zF + 0.1]);
      lightsR.push([s * wx, yR, zR - 0.1]);
    }
    addD(at(plane(0.42, 0.11), 0, yR - 0.14, zR - 0.006, 0, Math.PI, 0), 'plate');
    addD(at(plane(0.42, 0.11), 0, 0.42, zF + 0.012), 'plate');
  };
  const bumpers = (zF, zR, y, w, col = 'chrome') => {
    const f = rbox(w, 0.13, 0.14, 0.05), r = rbox(w, 0.13, 0.14, 0.05);
    at(f, 0, y, zF); at(r, 0, y, zR);
    if (col === 'chrome') chrome.push(clean(f), clean(r)); else { addD(f, 'black'); addD(r, 'black'); }
  };
  const archShadows = (ws, r) => {
    for (const [x, y, z] of ws) {
      const s = Math.sign(x) || 1;
      const g = new THREE.CircleGeometry(r * 1.14, 14, 0, Math.PI);
      at(g, x - s * 0.16, y, z, 0, s * Math.PI / 2, 0);
      addD(g, 'black');
    }
  };
  const mirrors = (y, z) => { for (const s of [-1, 1]) { const m = rbox(0.12, 0.07, 0.05); at(m, s * (hw * 0.92 + 0.05), y - 0.02, z); addD(m, 'black'); } };

  if (T.style === 'sedan' || T.style === 'hatch' || T.style === 'tiny') {
    const tiny = T.style === 'tiny', hatch = T.style === 'hatch';
    const falcon = key === 'falcon', r12 = key === 'reno12';
    const belt = tiny ? 0.8 : 0.86;
    const noseDrop = falcon ? 0.06 : tiny ? 0.2 : 0.12;
    const rearDrop = hatch ? 0 : tiny ? 0.16 : r12 ? 0.1 : 0.06;
    wheelR = tiny ? 0.27 : 0.32;
    wheels = [[hw - 0.12, wheelR, hl * 0.64], [-hw + 0.12, wheelR, hl * 0.64], [hw - 0.12, wheelR, -hl * 0.62], [-hw + 0.12, wheelR, -hl * 0.62]];
    const arches = [[hl * 0.64, wheelR * 1.14, wheelR], [-hl * 0.62, wheelR * 1.14, wheelR]];
    // carrocería baja
    paint.push(bodyLoft([
      [-hl, hw * 0.9, 0.34, belt - rearDrop - 0.08, 0.12, 0.06, 0.95],
      [-hl + 0.12, hw * 0.98, 0.3, belt - rearDrop, 0.1, 0.06, 0.97],
      [-hl * 0.55, hw, 0.26, belt, 0.1, 0.06, 0.97],
      [hl * 0.45, hw, 0.26, belt, 0.1, 0.06, 0.97],
      [hl - 0.25, hw * 0.98, 0.3, belt - noseDrop * 0.6, 0.1, 0.06, 0.96],
      [hl, hw * 0.92, 0.34, belt - noseDrop - 0.06, 0.1, 0.06, 0.95],
    ], arches));
    // cabina (vidrio)
    const cz0 = hatch ? -hl + 0.2 : tiny ? -hl * 0.55 : -hl * 0.52;
    const cz1 = tiny ? hl * 0.32 : hl * 0.24;
    const rz0 = hatch ? -hl + 0.28 : tiny ? -hl * 0.4 : -hl * 0.36;
    const rz1 = tiny ? hl * 0.1 : hl * 0.0;
    roofZ = (rz0 + rz1) / 2;
    glass.push(loft([
      [cz0, hw * 0.9, belt - 0.02, belt + 0.02, 0.02, 0.01, 0.95],
      [rz0, hw * 0.86, belt - 0.02, H - 0.04, 0.1, 0.02, 0.86],
      [rz1, hw * 0.86, belt - 0.02, H - 0.04, 0.1, 0.02, 0.86],
      [cz1, hw * 0.9, belt - 0.02, belt + 0.02, 0.02, 0.01, 0.95],
    ]));
    // techo (pintura)
    paint.push(loft([
      [rz0 - 0.02, hw * 0.83, H - 0.06, H, 0.05, 0.01, 0.96],
      [rz1 + 0.02, hw * 0.83, H - 0.06, H, 0.05, 0.01, 0.96],
    ]));
    // parantes
    for (const s of [-1, 1]) {
      for (const [za, zb] of [[cz1, rz1], [cz0, rz0]]) {
        const len = Math.hypot(zb - za, H - belt);
        const pg = rbox(0.06, len, 0.07);
        const ang = Math.atan2(zb - za, H - belt);
        at(pg, s * hw * 0.84, (belt + H) / 2, (za + zb) / 2, ang, 0, 0);
        paint.push(clean(pg));
      }
      const b = rbox(0.06, H - belt, 0.08); at(b, s * hw * 0.86, (belt + H) / 2, (rz0 + rz1) / 2 + 0.05); paint.push(clean(b));
    }
    // frente
    addD(at(plane(W * 0.5, tiny ? 0.1 : 0.16), 0, 0.56, hl + 0.004), falcon ? 'grille' : tiny ? 'black' : 'grille');
    lights(0.6, 0.66, hl + 0.002, -hl - 0.002, hw * 0.66, tiny || key === 'fitito', tiny ? 0.1 : 0.17, tiny ? 0.07 : 0.07);
    bumpers(hl + 0.04, -hl - 0.04, 0.4, W * 0.98, tiny || falcon || key === 'reno12' || key === 'pijo504' ? 'chrome' : 'black');
    if (falcon) for (const s of [-1, 1]) { const tr = rbox(0.02, 0.03, L * 0.9); at(tr, s * (hw + 0.01), 0.62, 0); chrome.push(clean(tr)); }
    mirrors(belt + 0.06, cz1 - 0.1);
    archShadows(wheels, wheelR);
    seats = [[0.38, 0.35, -0.05], [-0.38, 0.35, -0.05], [0.38, 0.35, -1.0], [-0.38, 0.35, -1.0]];
    if (T.police) {
      const bar = rbox(1.1, 0.12, 0.26); at(bar, 0, H + 0.06, (rz0 + rz1) / 2); addD(bar, 'black');
      for (const s of [-1, 1]) { const st = plane(L * 0.72, 0.17); at(st, s * (hw + 0.014), 0.6, -0.1, 0, s * Math.PI / 2, 0); addD(st, 'police'); }
    }
    if (T.sign) { for (const s of [-1, 1]) { const sg = plane(0.62, 0.24); at(sg, 0, H + 0.12, (rz0 + rz1) / 2 + s * 0.06, 0, s > 0 ? 0 : Math.PI, 0); addD(sg, 'remis'); } const top = rbox(0.62, 0.02, 0.12); at(top, 0, H + 0.24, (rz0 + rz1) / 2); addD(top, 'black'); }
  } else if (T.style === 'pickup') {
    const f100 = key === 'f100';
    const belt = 1.12;
    const cabZ0 = -hl * 0.08, cabZ1 = hl * 0.46;
    wheelR = 0.42;
    wheels = [[hw - 0.12, wheelR, hl * 0.62], [-hw + 0.12, wheelR, hl * 0.62], [hw - 0.12, wheelR, -hl * 0.6], [-hw + 0.12, wheelR, -hl * 0.6]];
    const arches = [[hl * 0.62, wheelR * 1.14, wheelR], [-hl * 0.6, wheelR * 1.14, wheelR]];
    paint.push(bodyLoft([
      [cabZ0 - 0.05, hw, 0.42, belt, 0.08, 0.06, 0.98],
      [hl * 0.5, hw, 0.42, belt - 0.02, 0.1, 0.06, 0.98],
      [hl - 0.2, hw * 0.98, 0.45, belt - 0.1, 0.12, 0.06, 0.97],
      [hl, hw * 0.93, 0.5, belt - 0.18, 0.1, 0.06, 0.96],
    ], arches));
    // caja
    paint.push(bodyLoft([[-hl, hw, 0.45, belt - 0.02, 0.04, 0.05, 1], [cabZ0 - 0.04, hw, 0.42, belt - 0.02, 0.04, 0.05, 1]], arches));
    const bedIn = rbox(W - 0.16, 0.05, hl + cabZ0 - 0.1);
    at(bedIn, 0, belt - 0.03, (-hl + cabZ0) / 2); addD(bedIn, 'black');
    // cabina
    glass.push(loft([
      [cabZ0, hw * 0.94, belt - 0.02, H - 0.05, 0.08, 0.02, 0.9],
      [cabZ1 - 0.35, hw * 0.94, belt - 0.02, H - 0.05, 0.08, 0.02, 0.9],
      [cabZ1, hw * 0.94, belt - 0.02, belt + 0.02, 0.02, 0.01, 0.94],
    ]));
    paint.push(loft([[cabZ0 - 0.02, hw * 0.9, H - 0.08, H, 0.05, 0.01, 0.96], [cabZ1 - 0.33, hw * 0.9, H - 0.08, H, 0.05, 0.01, 0.96]]));
    for (const s of [-1, 1]) {
      const b = rbox(0.07, H - belt, 0.09); at(b, s * hw * 0.92, (belt + H) / 2, cabZ0 + 0.03); paint.push(clean(b));
      const len = Math.hypot(0.35, H - belt);
      const a = rbox(0.07, len, 0.08); at(a, s * hw * 0.92, (belt + H) / 2, cabZ1 - 0.18, Math.atan2(-0.35, H - belt), 0, 0); paint.push(clean(a));
    }
    addD(at(plane(W * 0.62, 0.26), 0, 0.82, hl + 0.004), 'grille');
    lights(0.88, 0.92, hl + 0.002, -hl - 0.002, hw * 0.72, f100, 0.14, 0.08);
    bumpers(hl + 0.06, -hl - 0.06, 0.5, W * 1.02, f100 ? 'chrome' : 'chrome');
    if (!f100) { const bar = rbox(W * 0.8, 0.06, 0.06); at(bar, 0, belt + 0.35, cabZ0 - 0.25); chrome.push(clean(bar)); for (const s of [-1, 1]) { const p = rbox(0.06, 0.37, 0.06); at(p, s * W * 0.4, belt + 0.17, cabZ0 - 0.25); chrome.push(clean(p)); } }
    mirrors(belt + 0.1, cabZ1 - 0.2);
    archShadows(wheels, wheelR);
    seats = [[0.4, 0.55, 0.45], [-0.4, 0.55, 0.45], [0.45, 1.15, -1.2], [-0.45, 1.15, -1.8]];
    if (T.flag) {
      const ant = new THREE.CylinderGeometry(0.012, 0.018, 3.2, 5); at(ant, -hw + 0.08, belt + 1.6, -hl + 0.3); addD(ant, 'black');
      const fl = plane(0.5, 0.36); at(fl, -hw + 0.08, belt + 3.0, -hl + 0.56, 0, Math.PI / 2, 0); addD(fl, 'orange');
      const fl2 = plane(0.5, 0.36); at(fl2, -hw + 0.08, belt + 3.0, -hl + 0.56, 0, -Math.PI / 2, 0); addD(fl2, 'orange');
      for (const s of [-1, 1]) { const st = plane(1.9, 0.18); at(st, s * (hw + 0.014), 0.86, 0.9, 0, s * Math.PI / 2, 0); addD(st, 'empresa'); }
    }
  } else if (T.style === 'bus') {
    wheelR = 0.5;
    wheels = [[hw - 0.2, wheelR, hl * 0.62], [-hw + 0.2, wheelR, hl * 0.62], [hw - 0.2, wheelR, -hl * 0.55], [-hw + 0.2, wheelR, -hl * 0.55]];
    paint.push(bodyLoft([[-hl, hw, 0.4, H, 0.2, 0.08, 0.98], [hl - 0.3, hw, 0.4, H, 0.2, 0.08, 0.98], [hl, hw * 0.97, 0.45, H - 0.1, 0.2, 0.08, 0.97]], [[hl * 0.62, wheelR * 1.12, wheelR], [-hl * 0.55, wheelR * 1.12, wheelR]]));
    for (const s of [-1, 1]) { const wg = plane(L - 1.8, 1.0); at(wg, s * (hw + 0.008), 2.0, -0.4, 0, s * Math.PI / 2, 0); addD(wg, 'bus'); }
    glass.push(clean(at(plane(W * 0.9, 1.3), 0, 2.0, hl + 0.01)));
    addD(at(plane(W * 0.8, 0.25), 0, 2.85, hl + 0.012), 'light');
    lights(0.85, 0.9, hl + 0.012, -hl - 0.002, hw * 0.75, true, 0.12, 0.09);
    bumpers(hl + 0.05, -hl - 0.05, 0.45, W * 1.0, 'black');
    archShadows(wheels, wheelR);
    seats = [[0.7, 0.9, hl - 1.3], [-0.6, 0.9, 1.0], [0.6, 0.9, -1], [-0.6, 0.9, -2.5]];
    camH = 3.5;
  } else if (T.style === 'tanker') {
    const cabL = 2.4;
    paint.push(bodyLoft([[hl - cabL, hw, 0.6, 3.0, 0.15, 0.06, 0.96], [hl - 0.35, hw, 0.6, 3.0, 0.2, 0.06, 0.96], [hl, hw * 0.96, 0.7, 2.2, 0.2, 0.06, 0.95]], [[hl - 1.2, 0.52 * 1.12, 0.52]]));
    glass.push(clean(at(plane(W * 0.84, 0.8), 0, 2.4, hl - 0.33, -0.25, 0, 0)));
    for (const s of [-1, 1]) glass.push(clean(at(plane(0.9, 0.7), s * (hw + 0.005), 2.4, hl - 1.0, 0, s * Math.PI / 2, 0)));
    const chassis = rbox(W * 0.9, 0.3, L - cabL); at(chassis, 0, 0.75, -cabL / 2); addD(chassis, 'black');
    const tank = new THREE.CapsuleGeometry(1.12, L - cabL - 2.6, 6, 14);
    at(tank, 0, 2.05, (-hl + hl - cabL) / 2, Math.PI / 2, 0, 0);
    addD(tank, 'tank');
    for (const s of [-1, 1]) { const st = plane(L - cabL - 1.2, 0.28); at(st, s * 1.125, 2.05, -cabL / 2, 0, s * Math.PI / 2, 0); addD(st, 'yellow'); }
    lights(1.0, 1.0, hl + 0.004, -hl - 0.004, hw * 0.75, true, 0.12, 0.09);
    bumpers(hl + 0.05, -hl - 0.05, 0.62, W, 'chrome');
    wheelR = 0.52;
    wheels = [[hw - 0.2, wheelR, hl - 1.2], [-hw + 0.2, wheelR, hl - 1.2], [hw - 0.2, wheelR, -hl + 1.4], [-hw + 0.2, wheelR, -hl + 1.4], [hw - 0.2, wheelR, -hl + 2.6], [-hw + 0.2, wheelR, -hl + 2.6]];
    seats = [[0.55, 1.3, hl - 1.2], [-0.55, 1.3, hl - 1.2]];
    camH = 3.6;
  } else if (T.style === 'bike') {
    const tube = (x0, y0, z0, x1, y1, z1, r = 0.028) => {
      const len = Math.hypot(x1 - x0, y1 - y0, z1 - z0);
      const g = new THREE.CylinderGeometry(r, r, len, 6);
      const dir = new THREE.Vector3(x1 - x0, y1 - y0, z1 - z0).normalize();
      g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir));
      g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
      return clean(g);
    };
    paint.push(tube(0, 0.33, -0.1, 0, 0.72, 0.5), tube(0, 0.72, -0.25, 0, 0.74, 0.5), tube(0, 0.33, -0.1, 0, 0.72, -0.25), tube(0, 0.33, -0.1, 0, 0.3, -0.6, 0.02));
    chrome.push(tube(0, 0.3, 0.6, 0, 0.95, 0.54, 0.022), tube(-0.3, 0.95, 0.53, 0.3, 0.95, 0.53, 0.018));
    const seat = rbox(0.14, 0.05, 0.26); at(seat, 0, 0.79, -0.25); addD(seat, 'black');
    wheelR = 0.3;
    wheels = [[0, wheelR, 0.6], [0, wheelR, -0.6]];
    seats = [[0, 0.17, -0.25]];
    camH = 1.6;
  } else if (T.style === 'moto') {
    const tank = new THREE.SphereGeometry(0.2, 10, 8); tank.scale(0.9, 0.7, 1.5); at(tank, 0, 0.9, 0.15); paint.push(clean(tank));
    const tail = rbox(0.2, 0.12, 0.6); at(tail, 0, 0.95, -0.5, 0.15, 0, 0); paint.push(clean(tail));
    const fender = rbox(0.14, 0.04, 0.45); at(fender, 0, 0.72, 0.8, -0.3, 0, 0); paint.push(clean(fender));
    const eng = rbox(0.28, 0.28, 0.4); at(eng, 0, 0.5, 0.05); addD(eng, 'black');
    const seat = rbox(0.22, 0.08, 0.55); at(seat, 0, 1.0, -0.3); addD(seat, 'black');
    const fork = new THREE.CylinderGeometry(0.025, 0.025, 0.8, 6); at(fork, 0, 0.7, 0.72, 0.35, 0, 0); chrome.push(clean(fork));
    const bar = new THREE.CylinderGeometry(0.018, 0.018, 0.7, 6); at(bar, 0, 1.12, 0.55, 0, 0, Math.PI / 2); chrome.push(clean(bar));
    addD(at(new THREE.CircleGeometry(0.08, 10), 0, 1.0, 0.8), 'head');
    const ex = new THREE.CylinderGeometry(0.04, 0.05, 0.7, 6); at(ex, 0.16, 0.55, -0.35, Math.PI / 2 - 0.2, 0, 0); chrome.push(clean(ex));
    lightsF.push([0, 0.95, 0.8]); lightsR.push([0, 0.9, -0.8]);
    wheelR = 0.36;
    wheels = [[0, wheelR, 0.75], [0, wheelR, -0.72]];
    seats = [[0, 0.25, -0.25], [0, 0.35, -0.7]];
    camH = 1.7;
  }
  const merge = (arr) => (arr.length ? mergeGeometries(arr.map(clean), false) : null);
  return {
    paint: merge(paint), glass: merge(glass), chrome: merge(chrome), detail: merge(detail),
    wheel: wheelGeometry(wheelR, T.bike ? 0.1 : 0.24, T.bike), wheels, wheelR, seats, lightsF, lightsR, camH, roofZ,
  };
}

// ---------- Materiales ----------
export class CarMaterials {
  constructor() {
    this.paints = new Map();
    this.env = null;
    const d = detailAtlas();
    this.detail = lam({ map: d.map, emissive: 0xffffff, emissiveMap: d.emissive, emissiveIntensity: 0.25, side: THREE.DoubleSide });
    // versión realista: vidrio polarizado espejado (no deja ver el interior vacío) y cromo de verdad
    this.glass = STYLE.realista
      ? new THREE.MeshPhysicalMaterial({ color: 0x0a0e12, metalness: 0, roughness: 0.03, transparent: true, opacity: 0.9, depthWrite: false, side: THREE.DoubleSide, clearcoat: 1, clearcoatRoughness: 0.02 })
      : new THREE.MeshStandardMaterial({ color: 0x18222c, metalness: 0.2, roughness: 0.06, transparent: true, opacity: 0.62, depthWrite: false, side: THREE.DoubleSide });
    this.chrome = new THREE.MeshStandardMaterial({ color: 0xd8dadc, metalness: 1, roughness: STYLE.realista ? 0.1 : 0.2 });
    this.wheel = lam({ vertexColors: true });
    this.burnt = lam({ color: 0x2a2624 });
  }
  setEnv(env, intensity) {
    this.env = env;
    for (const m of [this.glass, this.chrome, ...this.paints.values()]) { m.envMap = env; m.envMapIntensity = intensity; m.needsUpdate = true; }
  }
  setEnvIntensity(k) { for (const m of [this.glass, this.chrome, ...this.paints.values()]) m.envMapIntensity = k; }
  paint(color) {
    let m = this.paints.get(color);
    if (!m) {
      // realista: pintura con barniz (clearcoat) que refleja el cielo nítido encima del color
      m = STYLE.realista
        ? new THREE.MeshPhysicalMaterial({ color, metalness: 0.15, roughness: 0.42, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1 })
        : new THREE.MeshStandardMaterial({ color, metalness: 0.35, roughness: 0.34, envMap: this.env, envMapIntensity: 0.9 });
      this.paints.set(color, m);
    }
    return m;
  }
  setLights(night) { this.detail.emissiveIntensity = 0.25 + night * 0.9; }
}

// Mapa de entorno simple (cielo, horizonte y suelo) para reflejos en autos
export function makeEnvMap(renderer, top = 0x4d7fc4, horizon = 0xc4d2de, ground = 0x8a7a5a) {
  const scene = new THREE.Scene();
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: { top: { value: new THREE.Color(top) }, hor: { value: new THREE.Color(horizon) }, gr: { value: new THREE.Color(ground) } },
    vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `uniform vec3 top, hor, gr; varying vec3 vP;
      void main(){ vec3 d = normalize(vP); vec3 c = d.y > 0.0 ? mix(hor, top, pow(d.y, 0.5)) : mix(hor, gr, pow(-d.y, 0.35));
        float sun = pow(max(dot(d, normalize(vec3(-0.5, 0.6, 0.3))), 0.0), 60.0) * 4.0;
        c += vec3(1.0, 0.95, 0.85) * sun;
        c *= 1.0 + 0.25 * smoothstep(0.02, 0.0, abs(d.y));
        gl_FragColor = vec4(c, 1.0); }`,
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), mat));
  // edificios a lo lejos para que el reflejo no sea solo cielo
  const bm = new THREE.MeshBasicMaterial({ color: 0x6a6660 });
  const rng = new RNG(5);
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2, h = rng.range(0.3, 1.8);
    const b = new THREE.Mesh(new THREE.BoxGeometry(1, h, 1), bm);
    b.position.set(Math.cos(a) * 8, h / 2 - 0.2, Math.sin(a) * 8);
    scene.add(b);
  }
  const pm = new THREE.PMREMGenerator(renderer);
  const rt = pm.fromScene(scene, 0.04);
  pm.dispose();
  return rt.texture;
}
