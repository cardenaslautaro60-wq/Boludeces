// Datos del mapa de Comodoro Rivadavia (año 2004), generados desde OpenStreetMap y el relieve real
// con tools/mapa/build_map.py. Coordenadas en metros: +X = Este, +Z = Sur (el Norte está hacia -Z).
// Las zonas urbanas conservan su forma real a escala 0,55; los tramos vacíos de ruta entre ellas
// están comprimidos, como hizo Rockstar con Los Santos.
import { MAP_META, MAP_BLOB } from './comodoro-data.js';

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
  const T = { i2: Int16Array, u2: Uint16Array, u4: Uint32Array, i4: Int32Array };
  for (const [name, s] of Object.entries(MAP_META.sections)) MAP[name] = new T[s.t](buf, s.off, s.n);
  MAP.ready = true;
  return MAP;
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
