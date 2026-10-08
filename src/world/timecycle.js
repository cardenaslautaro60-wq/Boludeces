import * as THREE from 'three';
import { clamp, lerp } from '../util.js';

// Ciclo de colores por hora y clima (como el timecyc.dat de Vice City): para cada clima, una
// fila por hora con el color del cielo arriba y en el horizonte, la luz del día y el filtro de
// color de la cámara. Entre horas y entre climas se mezcla suave.
//
// Cada fila: [hora, cielo arriba, horizonte, luz (0..1), filtro r, g, b, fuerza del filtro]
const H = [0, 5, 6.3, 7.2, 9, 13, 17.5, 19.3, 20.3, 21.3];
const TABLA = {
  // cielo limpio de la Patagonia: amanecer rosado, siesta celeste, atardecer naranja fuerte
  despejado: [
    [0x070b1c, 0x151c30, 0.16, 0.72, 0.84, 1.0, 0.28],
    [0x0d1330, 0x2a2a44, 0.2, 0.78, 0.84, 1.0, 0.24],
    [0x2a3566, 0x9a6a6a, 0.45, 1.0, 0.82, 0.82, 0.22],
    [0x4a6ea8, 0xe8a878, 0.8, 1.0, 0.9, 0.8, 0.16],
    [0x4d7fc4, 0xbccbd8, 1.0, 1.0, 0.98, 0.94, 0.06],
    [0x3f75c2, 0xc4d2de, 1.0, 0.98, 1.0, 1.02, 0.04],
    [0x4e79b8, 0xd2c8b0, 0.95, 1.0, 0.92, 0.8, 0.14],
    [0x3a4c88, 0xe89060, 0.75, 1.0, 0.74, 0.52, 0.38],
    [0x1c2352, 0x7a4a5a, 0.4, 0.86, 0.74, 1.0, 0.26],
    [0x0a1026, 0x1e2238, 0.2, 0.74, 0.82, 1.0, 0.28],
  ],
  // nublado: gris parejo, poca sombra, colores lavados
  nublado: [
    [0x0a0d18, 0x161a24, 0.13, 0.8, 0.86, 0.98, 0.22],
    [0x10141f, 0x26283a, 0.16, 0.82, 0.86, 0.98, 0.2],
    [0x3a4258, 0x7a7480, 0.38, 0.94, 0.9, 0.94, 0.16],
    [0x6a7588, 0xa9a9b0, 0.62, 0.94, 0.96, 1.0, 0.14],
    [0x7f8a9a, 0xc3c7cc, 0.8, 0.94, 0.98, 1.0, 0.14],
    [0x8792a0, 0xcdd1d4, 0.85, 0.94, 0.98, 1.0, 0.12],
    [0x7c8696, 0xbfbfbb, 0.78, 0.96, 0.96, 0.96, 0.12],
    [0x5a6070, 0xa08a80, 0.55, 1.0, 0.88, 0.82, 0.16],
    [0x2a2e3e, 0x4a4450, 0.3, 0.86, 0.84, 0.96, 0.2],
    [0x0e1220, 0x1e2230, 0.16, 0.8, 0.86, 0.98, 0.22],
  ],
  // viento fuerte: tierra en suspensión, horizonte ocre y luz amarillenta
  ventoso: [
    [0x0a0c18, 0x221e24, 0.15, 0.8, 0.82, 0.92, 0.22],
    [0x10121e, 0x2e2a30, 0.18, 0.84, 0.82, 0.9, 0.2],
    [0x3a3c5a, 0xa07c62, 0.42, 1.0, 0.84, 0.72, 0.24],
    [0x6a78a0, 0xd6a878, 0.74, 1.0, 0.9, 0.74, 0.2],
    [0x6f88b4, 0xd2c4a8, 0.92, 1.0, 0.94, 0.8, 0.2],
    [0x6a86b6, 0xd8ccb0, 0.95, 1.0, 0.95, 0.82, 0.18],
    [0x7086b0, 0xdcc29a, 0.9, 1.0, 0.9, 0.74, 0.18],
    [0x4a5280, 0xe0905a, 0.7, 1.0, 0.72, 0.48, 0.38],
    [0x22264a, 0x7a5048, 0.36, 0.92, 0.76, 0.8, 0.26],
    [0x0c1024, 0x262430, 0.18, 0.82, 0.82, 0.92, 0.22],
  ],
  // temporal de tierra: todo marrón, de día parece que atardece
  temporal: [
    [0x0c0a0a, 0x2a2018, 0.12, 0.9, 0.8, 0.7, 0.3],
    [0x14100e, 0x3a2e22, 0.14, 0.92, 0.8, 0.68, 0.3],
    [0x4a3a2e, 0x8a6a48, 0.3, 1.0, 0.84, 0.64, 0.34],
    [0x6e5a44, 0xa88a62, 0.5, 1.0, 0.86, 0.64, 0.36],
    [0x857058, 0xb89a70, 0.62, 1.0, 0.86, 0.62, 0.42],
    [0x8a7660, 0xbea078, 0.66, 1.0, 0.86, 0.64, 0.4],
    [0x82705a, 0xb8966a, 0.6, 1.0, 0.84, 0.6, 0.42],
    [0x6a5040, 0xa8704a, 0.45, 1.0, 0.78, 0.54, 0.38],
    [0x30241c, 0x503a2a, 0.25, 0.96, 0.8, 0.66, 0.32],
    [0x120e0c, 0x2a201a, 0.14, 0.9, 0.8, 0.7, 0.3],
  ],
  // nevada: blanco azulado, de noche la nieve refleja y no es tan oscuro
  nevada: [
    [0x101420, 0x2a3040, 0.2, 0.84, 0.9, 1.04, 0.2],
    [0x161a28, 0x3a4050, 0.24, 0.84, 0.9, 1.04, 0.2],
    [0x4a5068, 0x9a9aa8, 0.45, 0.94, 0.92, 1.0, 0.16],
    [0x8a94a8, 0xd0d4dc, 0.7, 0.94, 0.97, 1.04, 0.14],
    [0xa0aab8, 0xe2e6ea, 0.85, 0.94, 0.98, 1.04, 0.12],
    [0xa8b2c0, 0xe8ecf0, 0.9, 0.94, 0.98, 1.04, 0.12],
    [0x9aa4b4, 0xdcdce0, 0.82, 0.96, 0.97, 1.02, 0.12],
    [0x707890, 0xc0b0b8, 0.6, 1.0, 0.92, 0.94, 0.14],
    [0x30384c, 0x5a5868, 0.35, 0.88, 0.9, 1.04, 0.18],
    [0x141a28, 0x2a3040, 0.22, 0.84, 0.9, 1.04, 0.2],
  ],
};

// Tinte de la luz del sol según el clima (el color por la altura del sol lo pone sky.js)
const SOL = {
  despejado: [1, 1, 1],
  nublado: [0.86, 0.9, 0.98],
  ventoso: [1, 0.93, 0.8],
  temporal: [1, 0.8, 0.6],
  nevada: [0.92, 0.96, 1.05],
};

// Colores ya convertidos (los THREE.Color trabajan en lineal)
const ROWS = {};
for (const [w, rows] of Object.entries(TABLA)) {
  ROWS[w] = rows.map((r) => ({
    top: new THREE.Color(r[0]), hor: new THREE.Color(r[1]), light: r[2],
    filter: new THREE.Vector4(r[3], r[4], r[5], r[6]),
  }));
}

const tA = { top: new THREE.Color(), hor: new THREE.Color(), filter: new THREE.Vector4(), light: 0 };
const tB = { top: new THREE.Color(), hor: new THREE.Color(), filter: new THREE.Vector4(), light: 0 };

function sampleWeather(w, h, out) {
  const rows = ROWS[w] || ROWS.despejado;
  let i = H.length - 1;
  while (i > 0 && H[i] > h) i--;
  const j = (i + 1) % H.length;
  const h1 = j === 0 ? 24 : H[j];
  const t = clamp((h - H[i]) / (h1 - H[i]), 0, 1);
  const a = rows[i], b = rows[j];
  out.top.copy(a.top).lerp(b.top, t);
  out.hor.copy(a.hor).lerp(b.hor, t);
  out.filter.copy(a.filter).lerp(b.filter, t);
  out.light = lerp(a.light, b.light, t);
  return out;
}

export function newSample() {
  return { top: new THREE.Color(), hor: new THREE.Color(), filter: new THREE.Vector4(1, 1, 1, 0), sun: new THREE.Color(1, 1, 1), light: 1 };
}

// Mezcla la hora h (0..24) del clima a hacia el clima b (k = 0..1)
export function sampleTimecycle(a, b, k, h, out = newSample()) {
  sampleWeather(a, h, tA);
  if (b !== a && k > 0) {
    sampleWeather(b, h, tB);
    tA.top.lerp(tB.top, k); tA.hor.lerp(tB.hor, k); tA.filter.lerp(tB.filter, k);
    tA.light = lerp(tA.light, tB.light, k);
  }
  out.top.copy(tA.top); out.hor.copy(tA.hor); out.filter.copy(tA.filter); out.light = tA.light;
  const sa = SOL[a] || SOL.despejado, sb = SOL[b] || sa;
  out.sun.setRGB(lerp(sa[0], sb[0], k), lerp(sa[1], sb[1], k), lerp(sa[2], sb[2], k));
  return out;
}
