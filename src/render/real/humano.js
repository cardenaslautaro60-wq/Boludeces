import * as THREE from 'three';
import HUMANO from './humano.bin';
import META from './humano.json';
import pielC from './piel_c.webp';
import pielN from './piel_n.webp';
import pielR from './piel_r.webp';
import ojoC from './ojo_c.webp';
import peloC from './pelo_c.webp';
import peloN from './pelo_n.webp';

// Cuerpo humano realista (Quaternius, CC0) enganchado a los 17 huesos del juego: el mismo
// esqueleto y las mismas animaciones procedurales de la versión PS2, con otra malla.
// La ropa se "pinta" por vértice (color + máscara) y la tela reemplaza al relieve de la piel.

let DATA = null;

function view(key, Type, comps) {
  const [off, len] = META.index[key];
  return new Type(HUMANO.buffer, HUMANO.byteOffset + off, len / Type.BYTES_PER_ELEMENT / 1);
}

function image(src) {
  return new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = src; });
}

export async function loadHuman() {
  if (DATA) return DATA;
  const [c, n, r, e, hc, hn] = await Promise.all([pielC, pielN, pielR, ojoC, peloC, peloN].map(image));
  const tex = (im, color) => { const t = new THREE.Texture(im); if (color) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.flipY = false; t.needsUpdate = true; return t; };
  // tono medio de la piel de la textura (para teñirla con el color de cada personaje)
  const cv = document.createElement('canvas'); cv.width = cv.height = 16;
  const g = cv.getContext('2d'); g.drawImage(c, 0, 0, 16, 16);
  const d = g.getImageData(0, 0, 16, 16).data;
  let sr = 0, sg = 0, sb = 0, k = 0;
  for (let i = 0; i < d.length; i += 4) { if (d[i] + d[i + 1] + d[i + 2] < 60) continue; sr += d[i]; sg += d[i + 1]; sb += d[i + 2]; k++; }
  const avg = new THREE.Color(`rgb(${sr / k | 0},${sg / k | 0},${sb / k | 0})`);
  // trama de tela (relieve fino) para la ropa
  const wc = document.createElement('canvas'); wc.width = wc.height = 128;
  const wg = wc.getContext('2d');
  wg.fillStyle = 'rgb(128,128,255)'; wg.fillRect(0, 0, 128, 128);
  for (let y = 0; y < 128; y += 2) { wg.fillStyle = 'rgb(128,150,242)'; wg.fillRect(0, y, 128, 1); }
  for (let x = 0; x < 128; x += 2) { wg.fillStyle = 'rgba(150,128,242,0.5)'; wg.fillRect(x, 0, 1, 128); }
  for (let i = 0; i < 500; i++) { wg.fillStyle = `rgb(${110 + Math.random() * 36 | 0},${110 + Math.random() * 36 | 0},245)`; wg.fillRect(Math.random() * 128, Math.random() * 128, 2, 1); }
  const weave = new THREE.CanvasTexture(wc); weave.wrapS = weave.wrapT = THREE.RepeatWrapping;
  DATA = {
    skinMap: tex(c, true), skinN: tex(n, false), skinR: tex(r, false), eye: tex(e, true), hairC: tex(hc, true), hairN: tex(hn, false),
    avg, weave,
    body: {
      pos: view('body.pos', Float32Array), nrm: view('body.nrm', Int8Array), uv: view('body.uv', Float32Array),
      bi: view('body.bi', Uint8Array), bw: view('body.bw', Uint8Array), idx: view('body.idx', Uint16Array),
      zone: view('body.zone', Uint8Array), along: view('body.along', Uint8Array),
    },
  };
  for (const k2 of ['eyes', 'brows']) DATA[k2] = { pos: view(k2 + '.pos', Float32Array), nrm: view(k2 + '.nrm', Int8Array), uv: view(k2 + '.uv', Float32Array), bi: view(k2 + '.bi', Uint8Array), bw: view(k2 + '.bw', Uint8Array), idx: view(k2 + '.idx', Uint16Array) };
  for (const k2 of ['buzzed', 'parted', 'long', 'beard']) DATA[k2] = { pos: view(k2 + '.pos', Float32Array), nrm: view(k2 + '.nrm', Int8Array), uv: view(k2 + '.uv', Float32Array), idx: view(k2 + '.idx', Uint16Array) };
  return DATA;
}

export const humanReady = () => !!DATA;

const Z = META.zones;
const J = META.joints;
const V = (a) => new THREE.Vector3(a[0], a[1], a[2]);

// Pone el esqueleto del juego en la pose de enlace del modelo (en T), a la escala s
export function poseSkeleton(B, s) {
  const P = (k) => V(J[k]).multiplyScalar(s);
  const down = new THREE.Vector3(0, -1, 0);
  const hips = P('hips'), spine = P('spine'), neck = P('neck'), head = P('head');
  B.hips.position.copy(hips);
  B.spine.position.copy(spine).sub(hips);
  B.neck.position.copy(neck).sub(spine);
  B.head.position.copy(head).sub(neck);
  for (const S of ['L', 'R']) {
    const sh = P('sh' + S), el = P('el' + S), ha = P('ha' + S);
    B['sh' + S].position.copy(sh).sub(spine);
    B['sh' + S].quaternion.setFromUnitVectors(down, el.clone().sub(sh).normalize());
    B['el' + S].position.set(0, -el.distanceTo(sh), 0);
    const inv = B['sh' + S].quaternion.clone().invert();
    B['el' + S].quaternion.setFromUnitVectors(down, ha.clone().sub(el).normalize().applyQuaternion(inv));
    B['ha' + S].position.set(0, -ha.distanceTo(el), 0);
    B['ha' + S].quaternion.identity();
    const th = P('th' + S), kn = P('kn' + S), ft = P('ft' + S);
    B['th' + S].position.copy(th).sub(hips);
    B['th' + S].quaternion.setFromUnitVectors(down, kn.clone().sub(th).normalize());
    B['kn' + S].position.set(0, -kn.distanceTo(th), 0);
    const inv2 = B['th' + S].quaternion.clone().invert();
    B['kn' + S].quaternion.setFromUnitVectors(down, ft.clone().sub(kn).normalize().applyQuaternion(inv2));
    B['ft' + S].position.set(0, -ft.distanceTo(kn), 0);
    B['ft' + S].quaternion.identity();
  }
  for (const k of ['root', 'spine', 'neck', 'head']) B[k].quaternion.identity();
}

// Color lineal a partir de un hex / número
const col = (c) => new THREE.Color(typeof c === 'string' ? c : c);

// Geometría de un personaje: cuerpo con ropa, ojos, cejas, pelo y barba (grupos por material)
export function humanGeometry(L, s) {
  const D = DATA, b = D.body, n = b.pos.length / 3;
  const fat = Math.max(0, Math.min(1.2, L.fat || 0)), mus = Math.max(0, Math.min(1, L.muscle || 0));
  const pos = new Float32Array(n * 3), nrm = new Float32Array(n * 3), cloth = new Float32Array(n * 4);
  const waist = J.hips[1] + 0.035, chestTop = J.shL[1], neckY = J.neck[1];
  const shirt = col(L.shirtHex || L.shirt || 0x888888), sleeve = col(L.sleeveHex || L.shirtHex || L.shirt || 0x888888);
  const pants = col(L.pants || 0x2a3a55), shoes = col(L.shoes || 0x222222), stripe = col(L.stripe || '#f2f2f2');
  const accent = col(L.shirtAccent || '#1c2f6b');
  const sole = col(L.shoeKind === 'bota' ? '#3a2616' : '#e8e8e4');
  const tmp = new THREE.Color();
  const W = weld(b, n);
  // inflar la ropa: la mayor holgura entre los duplicados de cada posición (sin rajas)
  const offC = new Float32Array(W.m);
  for (let pass = 0; pass < 2; pass++) for (let i = 0; i < n; i++) {
    let x = b.pos[i * 3], y = b.pos[i * 3 + 1], z = b.pos[i * 3 + 2];
    const ci = W.canon[i];
    const nx = W.cn[ci * 3], ny = W.cn[ci * 3 + 1], nz = W.cn[ci * 3 + 2];
    const vnx = b.nrm[i * 3] / 127, vny = b.nrm[i * 3 + 1] / 127, vnz = b.nrm[i * 3 + 2] / 127;
    const zone = b.zone[i], t = b.along[i] / 255;
    // --- ropa: qué cubre este vértice. "mask" es una distancia con signo al borde de la
    // prenda (> 0 tela, < 0 piel): se interpola por el triángulo y el borde queda recto.
    // Los vértices de piel junto a una prenda llevan igual el color de la prenda.
    let mask = -1, c = null, puff = 0;
    if (zone === Z.torso) {
      if (y >= waist) { mask = 1; c = shirt; puff = 0.016; } else { mask = 1; c = pants; puff = 0.014; }
    } else if (zone === Z.neck) {
      // cuello de la remera: tapa los trapecios (lejos del eje del cuello)
      mask = Math.max((neckY - 0.012 - y) * 40, (Math.abs(x) - 0.062) * 60); c = shirt; puff = mask > 0 ? 0.008 : 0;
    } else if (zone === Z.upperarm) {
      mask = L.longSleeves ? 1 : (0.5 - t) * 8; c = sleeve; puff = mask > 0 ? 0.012 : 0;
    } else if (zone === Z.lowerarm) {
      mask = L.longSleeves ? (0.9 - t) * 8 : -1; c = sleeve; puff = mask > 0 ? 0.01 : 0;
    } else if (zone === Z.thigh) {
      mask = 1; c = pants; puff = 0.02;
    } else if (zone === Z.calf) {
      if (L.shoeKind === 'bota' && t > 0.62) { mask = 1; c = shoes; puff = 0.014; } else if (t < 0.96) { mask = 1; c = pants; puff = 0.018; } else { mask = 1; c = shoes; puff = 0.01; }
    } else if (zone === Z.foot) {
      mask = 1; c = y < 0.022 ? sole : shoes; puff = 0.012;
    }
    // --- dibujos: camiseta de Newbery (banda), rayas del jogging
    if (c === shirt && L.shirtKind === 'banda' && y > 1.19 && y < 1.3) c = accent;
    if (c === shirt && L.shirtKind === 'banda' && zone === Z.neck) c = accent;
    if (c === pants && L.pantsKind === 'jogging' && (zone === Z.thigh || zone === Z.calf)) {
      const side = Math.sign(x);
      const jx = zone === Z.thigh ? J.thL[0] : J.knL[0];
      if (side * x - jx > 0.045 && Math.abs(nz) < 0.35 && Math.abs(side * nx) > 0.8) c = stripe;
    }
    // --- forma del cuerpo: panza, brazos y piernas según grasa y músculo
    if (fat > 0 && (zone === Z.torso || zone === Z.neck)) {
      const belly = Math.exp(-((y - 1.06) ** 2) / 0.02);
      if (z > -0.02) z += fat * 0.16 * belly * Math.max(0, nz + 0.2);
      x *= 1 + fat * 0.22 * Math.exp(-((y - 1.05) ** 2) / 0.04);
      if (y > 1.3 && y < 1.5) x *= 1 + fat * 0.05;
    }
    // el modelo es de superhéroe: gente común = brazos más finos y menos espalda en V
    if (zone === Z.upperarm || zone === Z.lowerarm) {
      const ay = J.shL[1], az = J.shL[2];
      const k = 1 - (0.2 - mus * 0.16) * (zone === Z.upperarm ? 1 : 0.6);
      y = ay + (y - ay) * k; z = az + (z - az) * k;
    }
    if (zone === Z.torso && y > 1.28) x *= 1 - (0.07 - mus * 0.05) * Math.min(1, (y - 1.28) / 0.12);
    const limb = zone === Z.upperarm || zone === Z.lowerarm || zone === Z.thigh || zone === Z.calf;
    let grow = 0;
    if (limb) grow += fat * 0.018 + mus * (zone === Z.upperarm ? 0.012 : 0.004);
    if (zone === Z.head && y < 1.7) grow += fat * 0.01;
    if (zone === Z.neck) grow += fat * 0.02;
    if (pass === 0) { offC[ci] = Math.max(offC[ci], puff + grow); continue; }
    const off = offC[ci];
    x += nx * off; y += ny * off; z += nz * off;
    pos[i * 3] = x * s; pos[i * 3 + 1] = y * s; pos[i * 3 + 2] = z * s;
    nrm[i * 3] = vnx; nrm[i * 3 + 1] = vny; nrm[i * 3 + 2] = vnz;
    // (la tela real no es blanco puro: albedo máximo ~0,8)
    if (c) { tmp.copy(c).multiplyScalar(0.84); cloth[i * 4] = tmp.r; cloth[i * 4 + 1] = tmp.g; cloth[i * 4 + 2] = tmp.b; }
    cloth[i * 4 + 3] = Math.max(-1, Math.min(1, mask));
  }
  // --- la tela no marca los músculos: suavizado laplaciano de la ropa del torso y brazos
  smoothCloth(pos, cloth, b, n, b.zone, 9 + Math.round(fat * 3), s);
  // --- partes extra: ojos, cejas, pelo, barba (todas con los huesos de la cabeza)
  const extras = [['eyes', D.eyes, true]];
  if (L.hairStyle !== 'bald') extras.push(['brows', D.brows, true]);
  const hs = L.hairStyle || 'short';
  const hair = hs === 'long' ? 'long' : hs === 'bald' ? null : (hs === 'short' ? ((L.hair || 0) % 2 ? 'parted' : 'buzzed') : 'buzzed');
  if (hair) extras.push([hair, D[hair], false]);
  if (L.beard || L.mustache) extras.push(['beard', D.beard, false]);
  let total = n;
  for (const [, e] of extras) total += e.pos.length / 3;
  const P = new Float32Array(total * 3), N = new Float32Array(total * 3), UV = new Float32Array(total * 2), C = new Float32Array(total * 4);
  const SI = new Uint16Array(total * 4), SW = new Float32Array(total * 4);
  P.set(pos); N.set(nrm); UV.set(b.uv); C.set(cloth);
  for (let i = 0; i < n * 4; i++) { SI[i] = b.bi[i]; SW[i] = b.bw[i] / 255; }
  const idx = [];
  const groups = [];
  for (let i = 0; i < b.idx.length; i++) idx.push(b.idx[i]);
  groups.push([0, b.idx.length, 0]);
  let base = n;
  for (const [name, e, skinned] of extras) {
    const m = e.pos.length / 3;
    const fatHead = fat * 0.01;
    // cejas: más finas (el modelo las trae muy gruesas)
    let bcy = 0;
    if (name === 'brows') { for (let i = 0; i < m; i++) bcy += e.pos[i * 3 + 1]; bcy /= m; }
    for (let i = 0; i < m; i++) {
      const k = base + i;
      const nx = e.nrm[i * 3] / 127, ny = e.nrm[i * 3 + 1] / 127, nz = e.nrm[i * 3 + 2] / 127;
      const o = name === 'eyes' ? 0 : fatHead + (name === 'brows' ? 0.001 : 0.002);
      const ey = name === 'brows' ? bcy + (e.pos[i * 3 + 1] - bcy) * 0.55 : e.pos[i * 3 + 1];
      P[k * 3] = (e.pos[i * 3] + nx * o) * s; P[k * 3 + 1] = (ey + ny * o) * s; P[k * 3 + 2] = (e.pos[i * 3 + 2] + nz * o) * s;
      N[k * 3] = nx; N[k * 3 + 1] = ny; N[k * 3 + 2] = nz;
      UV[k * 2] = e.uv[i * 2]; UV[k * 2 + 1] = e.uv[i * 2 + 1];
      if (skinned) { for (let q = 0; q < 4; q++) { SI[k * 4 + q] = e.bi[i * 4 + q]; SW[k * 4 + q] = e.bw[i * 4 + q] / 255; } } else { SI[k * 4] = 4; SW[k * 4] = 1; }
    }
    const start = idx.length;
    for (let i = 0; i < e.idx.length; i++) idx.push(e.idx[i] + base);
    groups.push([start, e.idx.length, name === 'eyes' ? 1 : 2]);
    base += m;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(P, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(N, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(UV, 2));
  g.setAttribute('cloth', new THREE.BufferAttribute(C, 4));
  g.setAttribute('skinIndex', new THREE.BufferAttribute(SI, 4));
  g.setAttribute('skinWeight', new THREE.BufferAttribute(SW, 4));
  g.setIndex(total > 65535 ? new THREE.BufferAttribute(new Uint32Array(idx), 1) : new THREE.BufferAttribute(new Uint16Array(idx), 1));
  for (const [st, cnt, mi] of groups) g.addGroup(st, cnt, mi);
  // normales de la ropa suavizada (la piel conserva las del modelo)
  const keep = new Float32Array(N);
  g.computeVertexNormals();
  const NN = g.attributes.normal.array;
  for (let i = 0; i < total; i++) {
    const clothy = i < n && cloth[i * 4 + 3] > 0;
    if (!clothy) { NN[i * 3] = keep[i * 3]; NN[i * 3 + 1] = keep[i * 3 + 1]; NN[i * 3 + 2] = keep[i * 3 + 2]; }
  }
  g.computeBoundingSphere();
  return g;
}

// Vértices "soldados": el modelo duplica vértices en las costuras de UV; para suavizar y
// para inflar la ropa hay que moverlos juntos (si no, se abren rajas)
let WELD = null;
function weld(b, n) {
  if (WELD) return WELD;
  const canon = new Uint32Array(n), map = new Map();
  let m = 0;
  const reps = [];
  for (let i = 0; i < n; i++) {
    const k = `${Math.round(b.pos[i * 3] * 1e4)},${Math.round(b.pos[i * 3 + 1] * 1e4)},${Math.round(b.pos[i * 3 + 2] * 1e4)}`;
    let c = map.get(k);
    if (c === undefined) { c = m++; map.set(k, c); reps.push(i); }
    canon[i] = c;
  }
  // normal promedio por posición
  const cn = new Float32Array(m * 3);
  for (let i = 0; i < n; i++) { const c = canon[i]; cn[c * 3] += b.nrm[i * 3]; cn[c * 3 + 1] += b.nrm[i * 3 + 1]; cn[c * 3 + 2] += b.nrm[i * 3 + 2]; }
  for (let c = 0; c < m; c++) { const L = Math.hypot(cn[c * 3], cn[c * 3 + 1], cn[c * 3 + 2]) || 1; cn[c * 3] /= L; cn[c * 3 + 1] /= L; cn[c * 3 + 2] /= L; }
  // vecinos entre posiciones
  const sets = Array.from({ length: m }, () => new Set());
  for (let i = 0; i < b.idx.length; i += 3) {
    const a = canon[b.idx[i]], bb = canon[b.idx[i + 1]], c = canon[b.idx[i + 2]];
    if (a !== bb) { sets[a].add(bb); sets[bb].add(a); }
    if (a !== c) { sets[a].add(c); sets[c].add(a); }
    if (bb !== c) { sets[bb].add(c); sets[c].add(bb); }
  }
  const start = new Uint32Array(m + 1), list = [];
  for (let i = 0; i < m; i++) { start[i] = list.length; for (const j of sets[i]) list.push(j); }
  start[m] = list.length;
  WELD = { canon, m, cn, start, list: Uint32Array.from(list) };
  return WELD;
}
function smoothCloth(pos, cloth, b, n, zone, iters, scale) {
  const { canon, m, start, list } = weld(b, n);
  const P = new Float32Array(m * 3), cnt = new Float32Array(m), on = new Uint8Array(m);
  const hipsY = J.hips[1] * scale;
  for (let i = 0; i < n; i++) {
    const c = canon[i];
    P[c * 3] += pos[i * 3]; P[c * 3 + 1] += pos[i * 3 + 1]; P[c * 3 + 2] += pos[i * 3 + 2]; cnt[c]++;
    // remera (arriba de la cintura) y pantalón (muslos y pantorrillas): la tela no marca músculos
    const top = (zone[i] === Z.torso || zone[i] === Z.upperarm || zone[i] === Z.neck) && pos[i * 3 + 1] > hipsY + 0.1;
    const legs = zone[i] === Z.thigh || (zone[i] === Z.calf && pos[i * 3 + 1] > 0.18 * scale) || (zone[i] === Z.torso && pos[i * 3 + 1] <= hipsY + 0.1);
    if (cloth[i * 4 + 3] > 0 && (top || legs)) on[c] = 1;
  }
  for (let c = 0; c < m; c++) { P[c * 3] /= cnt[c]; P[c * 3 + 1] /= cnt[c]; P[c * 3 + 2] /= cnt[c]; }
  const tmp = new Float32Array(P.length);
  // Taubin (lambda / mu): suaviza sin encoger la malla
  for (let it = 0; it < iters * 2; it++) {
    const w = it % 2 ? -0.53 : 0.5;
    tmp.set(P);
    for (let c = 0; c < m; c++) {
      if (!on[c]) continue;
      let sx = 0, sy = 0, sz = 0, k = 0;
      for (let q = start[c]; q < start[c + 1]; q++) { const j = list[q]; sx += tmp[j * 3]; sy += tmp[j * 3 + 1]; sz += tmp[j * 3 + 2]; k++; }
      if (!k) continue;
      P[c * 3] = tmp[c * 3] + (sx / k - tmp[c * 3]) * w;
      P[c * 3 + 1] = tmp[c * 3 + 1] + (sy / k - tmp[c * 3 + 1]) * w;
      P[c * 3 + 2] = tmp[c * 3 + 2] + (sz / k - tmp[c * 3 + 2]) * w;
    }
  }
  for (let i = 0; i < n; i++) { const c = canon[i]; pos[i * 3] = P[c * 3]; pos[i * 3 + 1] = P[c * 3 + 1]; pos[i * 3 + 2] = P[c * 3 + 2]; }
}

// Materiales: piel/ropa (teñida por personaje), ojos y pelo (teñido)
const matCache = new Map();
export function humanMaterials(L) {
  const key = `${L.skin}|${L.hair}`;
  if (matCache.has(key)) return matCache.get(key);
  const D = DATA;
  const skinTint = col(L.skin || 0xd9a47c);
  const tint = new THREE.Vector3(skinTint.r / Math.max(0.01, D.avg.r), skinTint.g / Math.max(0.01, D.avg.g), skinTint.b / Math.max(0.01, D.avg.b));
  const body = new THREE.MeshStandardMaterial({ map: D.skinMap, normalMap: D.skinN, roughnessMap: D.skinR, roughness: 1, metalness: 0 });
  body.onBeforeCompile = (sh) => {
    sh.uniforms.uSkinTint = { value: tint };
    sh.uniforms.tWeave = { value: D.weave };
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec4 cloth;\nvarying vec4 vCloth;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvCloth = cloth;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec4 vCloth;\nuniform vec3 uSkinTint;\nuniform sampler2D tWeave;')
      .replace('#include <map_fragment>', `#include <map_fragment>
        float clothK = smoothstep(-0.04, 0.04, vCloth.a);
        float weaveL = texture2D(tWeave, vMapUv * 48.0).g;
        diffuseColor.rgb = mix(diffuseColor.rgb * uSkinTint, vCloth.rgb * (0.9 + 0.12 * weaveL), clothK);`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        roughnessFactor = mix(roughnessFactor, 0.92, clothK);`)
      .replace('#include <normal_fragment_maps>', `
        {
          vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
          vec3 wN = texture2D( tWeave, vNormalMapUv * 48.0 ).xyz * 2.0 - 1.0;
          mapN = normalize(mix(mapN, wN * vec3(0.6, 0.6, 1.0), clothK));
          mapN.xy *= normalScale;
          normal = normalize( tbn * mapN );
        }`);
  };
  body.customProgramCacheKey = () => 'humano-cuerpo';
  const eyes = new THREE.MeshStandardMaterial({ map: D.eye, roughness: 0.12, metalness: 0 });
  const hc = col(L.hair || 0x2a1d14);
  // la textura del pelo es castaña: se lleva al color del personaje
  const hair = new THREE.MeshStandardMaterial({ map: D.hairC, normalMap: D.hairN, color: new THREE.Color(Math.min(1.6, hc.r * 6 + 0.05), Math.min(1.6, hc.g * 6 + 0.05), Math.min(1.6, hc.b * 6 + 0.05)), roughness: 0.55, metalness: 0, side: THREE.DoubleSide });
  const mats = [body, eyes, hair];
  matCache.set(key, mats);
  return mats;
}
