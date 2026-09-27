// Datos del mapa de Comodoro Rivadavia (año 2004), generados desde OpenStreetMap y el relieve real
// con tools/mapa/build_map.py. Coordenadas en metros: +X = Este, +Z = Sur (el Norte está hacia -Z).
// Toda la ciudad construida está a tamaño real (1 m del juego = 1 m de Comodoro); solo se
// comprimen el tramo casi vacío antes de Caleta, el mar abierto y el fondo de la meseta.
import { MAP_META, MAP_BLOB } from './comodoro-data.js';
import { SAT_META, SAT_JPG } from './comodoro-sat.js';

export const META = MAP_META;
export const SEA_LEVEL = 0;

// Marco rotado del mundo: A a lo largo de la costa (de Rada Tilly a Caleta), B tierra adentro
const F = MAP_META.frame;
export const FRAME = F;
export function toAB(x, z) { return [x * F.ux + z * F.uz, x * F.vx + z * F.vz]; }
export function fromAB(a, b) { return [a * F.ux + b * F.vx, a * F.uz + b * F.vz]; }

const corners = [[F.a0, F.b0], [F.a1, F.b0], [F.a1, F.b1], [F.a0, F.b1]].map(([a, b]) => fromAB(a, b));
export const WORLD = {
  minX: Math.min(...corners.map((c) => c[0])),
  maxX: Math.max(...corners.map((c) => c[0])),
  minZ: Math.min(...corners.map((c) => c[1])),
  maxZ: Math.max(...corners.map((c) => c[1])),
  corners,
  frame: F,
  inside(x, z, m = 0) {
    const a = x * F.ux + z * F.uz, b = x * F.vx + z * F.vz;
    return a >= F.a0 + m && a <= F.a1 - m && b >= F.b0 + m && b <= F.b1 - m;
  },
  // Devuelve el punto metido adentro del mundo (con margen m) y si hubo que corregirlo
  clamp(p, m = 5) {
    const a = p.x * F.ux + p.z * F.uz, b = p.x * F.vx + p.z * F.vz;
    const ca = Math.max(F.a0 + m, Math.min(F.a1 - m, a)), cb = Math.max(F.b0 + m, Math.min(F.b1 - m, b));
    if (ca === a && cb === b) return false;
    p.x = ca * F.ux + cb * F.vx;
    p.z = ca * F.uz + cb * F.vz;
    return { na: Math.sign(ca - a), nb: Math.sign(cb - b) };
  },
};

// Hitos reales (Catedral, Terminal, Museo del Petróleo, La Madriguera...)
export const LANDMARKS = {};
for (const l of MAP_META.landmarks) LANDMARKS[l.k] = l;

// Datos binarios (calles, alturas, polígonos): se decodifican al cargar el mundo
export const MAP = { ready: false };

function b64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function loadMapData() {
  if (MAP.ready) return MAP;
  const bytes = b64ToBytes(MAP_BLOB);
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate'));
  const buf = await new Response(stream).arrayBuffer();
  const T = { i2: Int16Array, u2: Uint16Array, u4: Uint32Array, i4: Int32Array, u1: Uint8Array, i1: Int8Array };
  for (const [name, s] of Object.entries(MAP_META.sections)) MAP[name] = new T[s.t](buf, s.off, s.n);
  MAP.sat = await decodeSat();
  MAP.ready = true;
  return MAP;
}

// Colores reales del suelo (Sentinel-2 cloudless 2016 de EOX, CC BY 4.0) en el marco del juego,
// un píxel cada 20 m: manchas de mata, salitrales, picadas y locaciones petroleras
async function decodeSat() {
  try {
    const bmp = await createImageBitmap(new Blob([b64ToBytes(SAT_JPG)], { type: 'image/jpeg' }), { colorSpaceConversion: 'none', premultiplyAlpha: 'none' });
    const c = document.createElement('canvas');
    c.width = bmp.width; c.height = bmp.height;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(bmp, 0, 0);
    if (bmp.close) bmp.close();
    return g.getImageData(0, 0, c.width, c.height).data;
  } catch (e) {
    console.warn('sin colores satelitales', e);
    return null;
  }
}

// Color satelital (sRGB 0..1) en un punto del mundo; null si no hay imagen
export function satColor(x, z, out = [0, 0, 0]) {
  const d = MAP.sat;
  if (!d) return null;
  const S = SAT_META;
  const fi = Math.min(S.w - 1.001, Math.max(0, (x * F.ux + z * F.uz - S.a0) / S.cell));
  const fj = Math.min(S.h - 1.001, Math.max(0, (x * F.vx + z * F.vz - S.b0) / S.cell));
  const i = Math.floor(fi), j = Math.floor(fj), u = fi - i, v = fj - j;
  const k00 = (j * S.w + i) * 4, k10 = k00 + 4, k01 = k00 + S.w * 4, k11 = k01 + 4;
  for (let c = 0; c < 3; c++) {
    out[c] = ((d[k00 + c] * (1 - u) + d[k10 + c] * u) * (1 - v) + (d[k01 + c] * (1 - u) + d[k11 + c] * u) * v) / 255;
  }
  return out;
}

// Puntos de interés. Los reales salen de OSM; los ficticios (La Tuerca, Don Tito, la Torre Crudo...)
// los ubica City al construir la ciudad, en lotes reales cerca de donde tienen sentido.
export const POI = {};
// Lugares de reaparición (los completa City)
export const SPAWNS = {};
// Rampas de saltos únicos (las ubica World según las calles reales)
export const RAMPS = [];
// Bolsitas de La Anómala enganchadas en alambrados (las ubica World)
export const BAGS = [];
// Muelles con piso elevado
export const DECKS = [];
