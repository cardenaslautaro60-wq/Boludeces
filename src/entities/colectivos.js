import * as THREE from 'three';
import { lam } from '../render/style.js';
import diadema18 from '../render/real/colectivo_diadema18.webp';
import diadema19 from '../render/real/colectivo_diadema19.webp';
import diadema12 from '../render/real/colectivo_diadema12.webp';
import diadema04 from '../render/real/colectivo_diadema04.webp';
import patagonia55 from '../render/real/colectivo_patagonia55.webp';
import patagonia92 from '../render/real/colectivo_patagonia92.webp';
import patagonia68 from '../render/real/colectivo_patagonia68.webp';

// ---------------------------------------------------------------------------
// Pinturas reales de los colectivos (skins de los mods de Proton Bus de Nicolás:
// Metalpar Tronador II OF-1519, La Favorita GR-1 OF-1418 y GR-2 OF-1621).
// Cada atlas (lo arma tools/colectivos/skins.py) trae, en lugares fijos:
// costado izquierdo, costado derecho, cola y frente (entero o solo la parte de abajo).
// ---------------------------------------------------------------------------

export const SKINS = {
  'DIADEMA': [
    { src: diadema18, frente: 'entero' },
    { src: diadema19, frente: 'entero' },
    { src: diadema12, frente: 'bajo' },
    { src: diadema04, frente: 'bajo' },
  ],
  'PATAGONIA ARGENTINA': [
    { src: patagonia55, frente: 'bajo' },
    { src: patagonia92, frente: 'bajo' },
    { src: patagonia68, frente: 'bajo' },
  ],
};

// lugares de cada pieza en el atlas de 2048 x 1024 (x, y, ancho, alto en píxeles)
const AW = 2048, AH = 1024;
const SLOT = { L: [0, 0, 2048, 352], R: [0, 352, 2048, 352], B: [0, 704, 384, 320], F: [384, 704, 384, 320] };

const mats = new Map();
function skinMat(skin) {
  if (!mats.has(skin.src)) {
    const t = new THREE.TextureLoader().load(skin.src);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    mats.set(skin.src, lam({ map: t, alphaTest: 0.5, polygonOffset: true, polygonOffsetFactor: -2 }, { roughness: 0.45 }));
  }
  return mats.get(skin.src);
}

function slotPlane(w, h, slot) {
  const g = new THREE.PlaneGeometry(w, h);
  const [x, y, sw, sh] = SLOT[slot];
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (x + uv.getX(i) * sw) / AW, 1 - (y + (1 - uv.getY(i)) * sh) / AH);
  return g;
}

const geos = new Map();
// Arma (una sola vez por medida) las cuatro piezas pegadas a la carrocería
function skinGeometry(T, frente) {
  const key = `${T.L}|${T.W}|${T.H}|${frente}`;
  if (geos.has(key)) return geos.get(key);
  const hw = T.W / 2, hl = T.L / 2, y0 = 0.32, y1 = T.H, hy = y1 - y0, cy = (y0 + y1) / 2, e = 0.03;
  const parts = [];
  // costado izquierdo (lado del chofer, +x): el frente queda a la izquierda de la imagen
  parts.push(slotPlane(T.L, hy, 'L').rotateY(Math.PI / 2).translate(hw + e, cy, 0));
  // costado derecho (puertas, -x): el frente queda a la derecha
  parts.push(slotPlane(T.L, hy, 'R').rotateY(-Math.PI / 2).translate(-hw - e, cy, 0));
  parts.push(slotPlane(T.W, hy, 'B').rotateY(Math.PI).translate(0, cy, -hl - e));
  if (frente === 'entero') parts.push(slotPlane(T.W, hy, 'F').translate(0, cy, hl + e));
  else parts.push(slotPlane(T.W, 1.05, 'F').translate(0, y0 + 0.525, hl + e));
  const g = mergeAll(parts);
  geos.set(key, g);
  return g;
}

function mergeAll(list) {
  const pos = [], uv = [], nor = [], idx = [];
  let base = 0;
  for (const g of list) {
    const p = g.attributes.position, u = g.attributes.uv, n = g.attributes.normal;
    for (let i = 0; i < p.count; i++) { pos.push(p.getX(i), p.getY(i), p.getZ(i)); uv.push(u.getX(i), u.getY(i)); nor.push(n.getX(i), n.getY(i), n.getZ(i)); }
    for (let i = 0; i < g.index.count; i++) idx.push(g.index.getX(i) + base);
    base += p.count;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

// Malla con la pintura de la empresa (o null si no hay pintura para esa empresa)
export function busSkinMesh(T, empresa, rnd = Math.random) {
  const list = SKINS[empresa];
  if (!list) return null;
  const skin = list[Math.floor(rnd() * list.length) % list.length];
  const m = new THREE.Mesh(skinGeometry(T, skin.frente), skinMat(skin));
  m.castShadow = true;
  m.receiveShadow = true;
  m.userData.frente = skin.frente;
  return m;
}
