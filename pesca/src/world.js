'use strict';
// Mundo 3D (lógica pura, sin dibujo): relieve de las islas, distancia a la costa, muelle, lugares y colisiones.
// 1 unidad = 1 metro. El nivel del mar es y = 0. El norte es -z y el sur es +z (el muelle está al sur).

const MUNDO = { R: 640, N: 512 }; // R: radio jugable; N: celdas del campo de distancias

// Armónicos de la costa de la isla principal: [frecuencia, amplitud relativa, fase]
const COSTA_ARM = [[2, 0.1, 0.7], [3, 0.075, 2.1], [5, 0.045, 4.0], [7, 0.025, 0.3], [11, 0.012, 1.7]];
const ISLAS = [
  { id: 'principal', nombre: 'Isla Anzuelo', x: 0, z: 0, base: 85, arm: COSTA_ARM, tipo: 'isla' },
  { id: 'cangrejo', nombre: 'Islote del Cangrejo', x: 142, z: -98, base: 21, arm: [[2, 0.13, 1.1], [3, 0.09, 0.2], [5, 0.05, 2.3]], tipo: 'isla', hMax: 6.5 },
  { id: 'coral', nombre: 'Arrecife de Coral', x: -208, z: 98, base: 34, arm: [[2, 0.08, 0.4], [4, 0.06, 1.7]], tipo: 'atolon' },
  { id: 'naufragio', nombre: 'Banco del Naufragio', x: 66, z: 338, base: 19, arm: [[2, 0.1, 2.0], [3, 0.07, 0.6]], tipo: 'banco' },
  { id: 'calavera', nombre: 'Isla Calavera', x: -330, z: -300, base: 46, arm: [[2, 0.12, 0.9], [3, 0.09, 2.8], [5, 0.05, 0.1]], tipo: 'roca', hMax: 24 },
  // Nivel 2: una isla grande con selva y volcán, lejos de la costa: solo se llega en lancha o pesquero
  { id: 'arsenal', nombre: 'Isla Arsenal', x: 465, z: 119, base: 100, arm: [[2, 0.09, 0.5], [3, 0.07, 1.9], [5, 0.04, 3.1], [7, 0.02, 0.8]], tipo: 'arsenal', nivel: 2 },
];
const ISLA = Object.fromEntries(ISLAS.map((i) => [i.id, i]));
const PRINCIPAL = ISLA.principal;
const POLAR_N = 720;
for (const is of ISLAS) {
  is.tab = new Float32Array(POLAR_N + 1);
  for (let i = 0; i <= POLAR_N; i++) {
    const th = (i / POLAR_N) * TAU;
    let r = 1;
    for (const [k, a, p] of is.arm) r += a * Math.sin(k * th + p);
    is.tab[i] = is.base * r;
  }
}
function radioPolar(is, th) {
  th %= TAU;
  if (th < 0) th += TAU;
  const f = (th / TAU) * POLAR_N, i = Math.floor(f);
  return is.tab[i] + (is.tab[i + 1] - is.tab[i]) * (f - i);
}
// Isla en la que está (o junto a la que está, con margen) un punto del mundo; null si es mar abierto
function islaDe(x, z, margen = 0) {
  for (const is of ISLAS) {
    const dx = x - is.x, dz = z - is.z, r = radioPolar(is, Math.atan2(dz, dx)) + margen;
    if (dx * dx + dz * dz < r * r) return is;
  }
  return null;
}
// Punto de la costa de la isla principal en el ángulo th (más un desplazamiento hacia adentro/afuera)
function puntoCosta(th, d = 0, is = PRINCIPAL) {
  const r = radioPolar(is, th) + d;
  return { x: is.x + Math.cos(th) * r, z: is.z + Math.sin(th) * r };
}

// Ruido de valor suave
function ruido2(x, z) {
  const xi = Math.floor(x), zi = Math.floor(z), xf = x - xi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = zf * zf * (3 - 2 * zf);
  const a = hash2(xi, zi), b = hash2(xi + 1, zi), c = hash2(xi, zi + 1), d = hash2(xi + 1, zi + 1);
  return lerp(lerp(a, b, u), lerp(c, d, u), v);
}
const fbm2 = (x, z) => ruido2(x, z) * 0.55 + ruido2(x * 2.1 + 7, z * 2.1 + 3) * 0.3 + ruido2(x * 4.3 + 1, z * 4.3 + 9) * 0.15;

const fondoMar = (s) => -Math.min(80, 0.14 * s + 0.0018 * s * s);
const COLINAS = [
  { x: -8, z: -14, A: 7.2, r: 34 }, { x: 34, z: 24, A: 4.2, r: 22 }, { x: 47, z: -42, A: 7, r: 19 }, { x: -40, z: -34, A: 3.2, r: 18 }, { x: 26, z: -52, A: 3, r: 14 },
];
function colinas(x, z) {
  let h = 0;
  for (const c of COLINAS) { const d2 = ((x - c.x) * (x - c.x) + (z - c.z) * (z - c.z)) / (c.r * c.r); if (d2 < 6) h += c.A * Math.exp(-d2 * 1.3); }
  return h;
}
// Zonas planas para los edificios (se llenan en armarMundo)
const PLANOS = [];

// Colinas de la isla Arsenal: [dx, dz, altura, radio] respecto del centro. La primera es el volcán.
const ARS_COLINAS = [[18, -34, 46, 42], [-45, -10, 12, 26], [40, 22, 9, 24], [-12, 38, 6, 18], [60, -50, 10, 22], [-60, 30, 7, 20]];
function alturaArsenal(is, x, z, u) {
  let h = 0.9 * smooth(0, 9, u) + 1.5 * smooth(8, 28, u);
  let rel = 0;
  for (const [hx, hz, A, r] of ARS_COLINAS) {
    const d2 = ((x - is.x - hx) * (x - is.x - hx) + (z - is.z - hz) * (z - is.z - hz)) / (r * r);
    if (d2 < 7) rel += A * Math.exp(-d2 * 1.25);
  }
  // borde del cráter alrededor de la cumbre del volcán
  const dv = Math.hypot(x - is.x - ARS_COLINAS[0][0], z - is.z - ARS_COLINAS[0][1]);
  rel += 9 * Math.exp(-((dv - 22) / 6.5) * ((dv - 22) / 6.5));
  return h + rel * smooth(10, 36, u) + (fbm2(x * 0.07 + 3, z * 0.07 - 5) - 0.5) * 3.2 * smooth(8, 26, u);
}
function alturaIsla(is, x, z) {
  const dx = x - is.x, dz = z - is.z;
  const r = Math.hypot(dx, dz);
  if (r > is.base * 1.9 + 140) return fondoMar(r - is.base);
  const th = Math.atan2(dz, dx);
  const R = radioPolar(is, th);
  const s = r - R;
  if (is.tipo === 'atolon') {
    const Rr = R * 0.78;
    const base = r < Rr ? -2.4 + 1.5 * smooth(Rr - 14, Rr, r) : fondoMar((r - Rr) * 1.1) - 0.4;
    return base + 1.05 * Math.exp(-Math.pow((r - Rr) / 4.2, 2)) + 0.35 * (fbm2(x * 0.25, z * 0.25) - 0.5) * (r < Rr + 12 ? 1 : 0);
  }
  if (s >= 0) return fondoMar(s) + (is.tipo === 'banco' && s < 14 ? 0.5 * smooth(14, 0, s) : 0);
  const u = -s;
  if (is.tipo === 'banco') return 0.9 * smooth(0, 9, u) + 0.8 * smooth(8, 14, u) + 0.25 * (fbm2(x * 0.3, z * 0.3) - 0.5);
  if (is.tipo === 'roca') {
    const k = smooth(0, 30, u);
    return 0.8 * smooth(0, 6, u) + (is.hMax * k * (0.55 + 0.9 * fbm2(x * 0.06, z * 0.06))) * (0.5 + 0.5 * smooth(8, 34, u));
  }
  if (is.tipo === 'arsenal') return alturaArsenal(is, x, z, u);
  let h = 0.9 * smooth(0, 9, u) + 1.1 * smooth(8, 26, u);
  if (is === PRINCIPAL) {
    h += colinas(x, z) * smooth(6, 30, u) + (fbm2(x * 0.09, z * 0.09) - 0.5) * 1.4 * smooth(4, 18, u);
  } else h += (is.hMax || 4) * smooth(10, is.base * 0.9, u) * (0.6 + 0.8 * fbm2(x * 0.1, z * 0.1));
  return h;
}
// Altura global del terreno
function H(x, z) {
  let h = -80;
  for (const is of ISLAS) h = Math.max(h, alturaIsla(is, x, z));
  for (const p of PLANOS) {
    const d = Math.hypot(x - p.x, z - p.z);
    if (d < p.r * 1.35) { const w = 1 - smooth(p.r * 0.7, p.r * 1.35, d); h = lerp(h, p.h, w); }
  }
  return h;
}
const pendienteDe = (x, z) => {
  const e = 0.8;
  return Math.hypot(H(x + e, z) - H(x - e, z), H(x, z + e) - H(x, z - e)) / (2 * e);
};

// ---------------------------------------------------------------------------
// Muelle (al sur de la isla principal)
// ---------------------------------------------------------------------------
const MUELLE = (() => {
  const R = radioPolar(PRINCIPAL, Math.PI / 2);
  return { x: 0, z0: R - 3, z1: R + PESCA.pierLen, ancho: 3.4, alto: 1.2, R };
})();
// Muelle de la isla Arsenal (sale de su costa sur, igual que el principal)
const MUELLE2 = (() => {
  const is = ISLA.arsenal, R = radioPolar(is, Math.PI / 2);
  return { x: is.x, z0: is.z + R - 3, z1: is.z + R + PESCA.pierLen, ancho: 3.4, alto: 1.2, R };
})();
const MUELLES = [MUELLE, MUELLE2];
const enMuelle = (x, z, m = 0) => MUELLES.some((M) => Math.abs(x - M.x) <= M.ancho / 2 + m && z >= M.z0 - m && z <= M.z1 + m);
function alturaPiso(x, z) {
  if (enMuelle(x, z, -0.1)) return MUELLE.alto;
  return H(x, z);
}

// ---------------------------------------------------------------------------
// Campo de distancias a la costa (se calcula una vez)
// ---------------------------------------------------------------------------
const CAMPO = { n: MUNDO.N, x0: -MUNDO.R, z0: -MUNDO.R, cell: (2 * MUNDO.R) / MUNDO.N, d: null };
function construirCampo() {
  const n = CAMPO.n, d = new Float32Array(n * n), INF = 1e9;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const x = CAMPO.x0 + (i + 0.5) * CAMPO.cell, z = CAMPO.z0 + (j + 0.5) * CAMPO.cell;
    d[j * n + i] = H(x, z) > 0.02 ? 0 : INF;
  }
  const a = 3, b = 4;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    let v = d[j * n + i];
    if (i > 0) v = Math.min(v, d[j * n + i - 1] + a);
    if (j > 0) { v = Math.min(v, d[(j - 1) * n + i] + a); if (i > 0) v = Math.min(v, d[(j - 1) * n + i - 1] + b); if (i < n - 1) v = Math.min(v, d[(j - 1) * n + i + 1] + b); }
    d[j * n + i] = v;
  }
  for (let j = n - 1; j >= 0; j--) for (let i = n - 1; i >= 0; i--) {
    let v = d[j * n + i];
    if (i < n - 1) v = Math.min(v, d[j * n + i + 1] + a);
    if (j < n - 1) { v = Math.min(v, d[(j + 1) * n + i] + a); if (i < n - 1) v = Math.min(v, d[(j + 1) * n + i + 1] + b); if (i > 0) v = Math.min(v, d[(j + 1) * n + i - 1] + b); }
    d[j * n + i] = v;
  }
  for (let k = 0; k < d.length; k++) d[k] = Math.min(900, (d[k] / 3) * CAMPO.cell);
  CAMPO.d = d;
}
// Distancia (m) a la tierra más cercana: 0 en tierra
function distCosta(x, z) {
  if (!CAMPO.d) return 0;
  const n = CAMPO.n;
  const fx = (x - CAMPO.x0) / CAMPO.cell - 0.5, fz = (z - CAMPO.z0) / CAMPO.cell - 0.5;
  const i = clamp(Math.floor(fx), 0, n - 2), j = clamp(Math.floor(fz), 0, n - 2);
  const u = clamp(fx - i, 0, 1), v = clamp(fz - j, 0, 1);
  const d = CAMPO.d;
  const a = d[j * n + i], b = d[j * n + i + 1], c = d[(j + 1) * n + i], e = d[(j + 1) * n + i + 1];
  return lerp(lerp(a, b, u), lerp(c, e, u), v);
}
const esAgua = (x, z) => H(x, z) < -0.05 && !enMuelle(x, z, 0.3);

// ---------------------------------------------------------------------------
// Lugares, edificios y colisiones
// ---------------------------------------------------------------------------
const MUN = { edificios: [], solidos: [], circulos: [], pois: [], luces: [], caminos: [], props: [], palmas: [], rocas: [], cofres: [], arbustos: [], arboles: [], listo: false };

function armarMundo() {
  const O = MUN;
  for (const k of ['edificios', 'solidos', 'circulos', 'pois', 'luces', 'caminos', 'props', 'palmas', 'rocas', 'cofres', 'arbustos', 'arboles']) O[k].length = 0;
  PLANOS.length = 0;
  const rnd = mulberry32(20241006);
  const plano = (x, z, r, h) => PLANOS.push({ x, z, r, h });

  // Edificios (la fachada mira al sur, +z). x,z = centro; w x d = huella; h = altura de pared
  const ed = (id, kind, x, z, w, d, h, extra) => {
    const e = Object.assign({ id, kind, x, z, w, d, h }, extra);
    O.edificios.push(e);
    plano(x, z + 2, Math.max(w, d) * 0.75 + 3, e.base);
    O.solidos.push({ x0: x - w / 2, z0: z - d / 2, x1: x + w / 2, z1: z + d / 2, id });
    return e;
  };
  const mercado = ed('mercado', 'casa', -17, 34, 10.5, 7.5, 4.2, { base: 1.9, nombre: 'Pescadería de Doña Rosa', pared: '#f4e3b8', techo: '#e0553d', techo2: '#b83b2a', cartel: 'PESCADERÍA', toldo: ['#ffffff', '#e0553d'] });
  const tienda = ed('tienda', 'casa', 17, 34, 10.5, 7.5, 4.2, { base: 1.9, nombre: 'Almacén de Don Anselmo', pared: '#b9e3e6', techo: '#2b9bb0', techo2: '#1d7488', cartel: 'ALMACÉN', toldo: ['#ffffff', '#2b9bb0'] });
  const casino = ed('casino', 'casino', 14, -20, 17, 10, 6, { base: 4.5, nombre: 'Casino El Anzuelo de Oro', pared: '#4a2b6e', techo: '#7a3ea8', techo2: '#4c2273', cartel: 'CASINO' });
  const cabana = ed('cabana', 'casa', -40, -3, 7, 6, 3.2, { base: 3.6, nombre: 'Tu cabaña', pared: '#d9b27a', techo: '#caa55c', techo2: '#8d5a34', cartel: '', paja: true });
  // Faro sobre la costa noreste
  const thF = -0.82;
  const pf = puntoCosta(thF, -15);
  const faro = { id: 'faro', kind: 'faro', x: pf.x, z: pf.z, w: 5, d: 5, h: 17, base: Math.max(1.5, H(pf.x, pf.z)), nombre: 'El Faro' };
  O.edificios.push(faro);
  plano(faro.x, faro.z, 7, Math.max(1.8, H(faro.x, faro.z)));
  faro.base = Math.max(1.8, H(faro.x, faro.z));
  O.solidos.push({ x0: faro.x - 2.6, z0: faro.z - 2.6, x1: faro.x + 2.6, z1: faro.z + 2.6, id: 'faro' });

  // Fogata y barco roto
  const fogata = { id: 'fogata', kind: 'fogata', x: -12, z: 51 };
  O.props.push(fogata);
  plano(fogata.x, fogata.z, 6, 1.7);
  O.circulos.push({ x: fogata.x, z: fogata.z, r: 1.1 });
  const bz = puntoCosta(2.0, -7);
  const barco = { id: 'barco', kind: 'barco', x: bz.x, z: bz.z, rot: 0.5 };
  O.props.push(barco);
  O.circulos.push({ x: barco.x, z: barco.z, r: 3.8 });

  // Lugares con los que se puede interactuar (puerta)
  const puerta = (e, dz) => ({ x: e.x, z: e.z + e.d / 2 + dz });
  O.pois.push({ id: 'mercado', ...puerta(mercado, 1.6), r: 4.6, nombre: mercado.nombre, accion: 'Entrar a la pescadería' });
  O.pois.push({ id: 'tienda', ...puerta(tienda, 1.6), r: 4.6, nombre: tienda.nombre, accion: 'Entrar al almacén' });
  O.pois.push({ id: 'casino', ...puerta(casino, 1.8), r: 5.5, nombre: casino.nombre, accion: 'Entrar al casino' });
  O.pois.push({ id: 'cabana', ...puerta(cabana, 1.6), r: 4.2, nombre: cabana.nombre, accion: 'Entrar a la cabaña' });
  O.pois.push({ id: 'faro', x: faro.x, z: faro.z + 4.2, r: 4.4, nombre: faro.nombre, accion: 'Hablar con el Capitán' });
  O.pois.push({ id: 'fogata', x: fogata.x, z: fogata.z + 2, r: 3.6, nombre: 'Fogata', accion: 'Cocinar en la fogata' });
  O.pois.push({ id: 'barco', x: barco.x + 1, z: barco.z + 3.5, r: 5, nombre: 'El barco roto', accion: 'Mirar el barco' });

  // Caminos de tierra (colorean el terreno)
  const camino = (pts, w) => O.caminos.push({ pts, w });
  camino([{ x: 0, z: MUELLE.z0 + 2 }, { x: 0.8, z: 62 }, { x: 0, z: 46 }, { x: 0, z: 40 }], 3.4);
  camino([{ x: 0, z: 40 }, { x: mercado.x + 1, z: 40.5 }], 2.6);
  camino([{ x: 0, z: 40 }, { x: tienda.x - 1, z: 40.5 }], 2.6);
  camino([{ x: 0, z: 40 }, { x: 2, z: 20 }, { x: 8, z: 4 }, { x: casino.x, z: casino.z + 7 }], 3);
  camino([{ x: 8, z: 4 }, { x: -14, z: 0 }, { x: -32, z: 2 }, { x: cabana.x + 1, z: cabana.z + 5 }], 2.4);
  camino([{ x: casino.x + 8, z: casino.z + 8 }, { x: 28, z: -12 }, { x: faro.x - 1, z: faro.z + 6 }], 2.4);
  camino([{ x: mercado.x + 2, z: 40.5 }, { x: fogata.x - 1, z: fogata.z + 1.5 }], 2.2);

  // Vegetación y rocas de la isla principal
  const cercaDeEdificio = (x, z, m) => O.edificios.some((e) => Math.abs(x - e.x) < e.w / 2 + m && z > e.z - e.d / 2 - m && z < e.z + e.d / 2 + m + 6);
  const cercaDeCamino = (x, z, m) => O.caminos.some((c) => { for (let i = 0; i < c.pts.length - 1; i++) { const a = c.pts[i], b = c.pts[i + 1]; if (distSeg(x, z, a.x, a.z, b.x, b.z) < c.w / 2 + m) return true; } return false; });
  const bloqueado = (x, z, m) => cercaDeEdificio(x, z, m) || cercaDeCamino(x, z, m) || enMuelle(x, z, 5) || dist(x, z, fogata.x, fogata.z) < 5 || dist(x, z, barco.x, barco.z) < 7;
  let intentos = 0;
  while (O.palmas.length < 34 && intentos++ < 1500) {
    const th = rnd() * TAU, d = -(5 + rnd() * 30);
    const p = puntoCosta(th, d);
    const h = H(p.x, p.z);
    if (h < 0.5 || h > 5.5 || bloqueado(p.x, p.z, 3.2)) continue;
    if (O.palmas.some((q) => dist(p.x, p.z, q.x, q.z) < 6)) continue;
    O.palmas.push({ x: p.x, z: p.z, y: h, s: 0.85 + rnd() * 0.5, rot: rnd() * TAU, incl: (rnd() - 0.5) * 0.5 });
    O.circulos.push({ x: p.x, z: p.z, r: 0.45 });
  }
  intentos = 0;
  while (O.arbustos.length < 26 && intentos++ < 800) {
    const th = rnd() * TAU, d = -(12 + rnd() * 52);
    const p = puntoCosta(th, d);
    const h = H(p.x, p.z);
    if (h < 1.6 || bloqueado(p.x, p.z, 2)) continue;
    O.arbustos.push({ x: p.x, z: p.z, y: h, s: 0.7 + rnd() * 0.9, c: rnd() });
  }
  intentos = 0;
  while (O.rocas.length < 22 && intentos++ < 900) {
    const th = rnd() * TAU, d = rnd() < 0.55 ? -(1 + rnd() * 10) : 2 + rnd() * 26;
    const p = puntoCosta(th, d);
    if (enMuelle(p.x, p.z, 8)) continue;
    const h = H(p.x, p.z);
    if (h > 6) continue;
    const s = 0.7 + rnd() * 1.4;
    O.rocas.push({ x: p.x, z: p.z, y: h, s, rot: rnd() * TAU, c: rnd() });
    if (h > -0.3) O.circulos.push({ x: p.x, z: p.z, r: 0.9 * s });
  }
  // Props junto a los comercios
  const prop = (kind, x, z, extra, r = 0.6) => { O.props.push(Object.assign({ kind, x, z }, extra)); if (r) O.circulos.push({ x, z, r }); };
  prop('barril', mercado.x + 6.4, 36.5); prop('cajon', mercado.x + 7.6, 38); prop('cajon', mercado.x - 6.6, 37);
  prop('barril', tienda.x - 6.4, 37); prop('cajon', tienda.x + 6.6, 36.4); prop('barril', tienda.x + 7.8, 38.2);
  prop('barril', casino.x - 10, -14.5);
  prop('cartel', 3.4, 70, { txt: 'MUELLE', rot: -0.3 }, 0.4);
  const s1 = puntoCosta(0.55, -10), s2 = puntoCosta(2.55, -11);
  prop('sombrilla', s1.x, s1.z, { c: '#ff7b5c' }, 0.3); prop('sombrilla', s2.x, s2.z, { c: '#ffd23c' }, 0.3);
  const rs = puntoCosta(0.18, -8);
  prop('redseca', rs.x, rs.z, { rot: 0.3 }, 0); O.solidos.push({ x0: rs.x - 2.5, z0: rs.z - 0.5, x1: rs.x + 2.5, z1: rs.z + 0.5, id: 'red' });
  const bt = puntoCosta(3.4, -5);
  prop('bote', bt.x, bt.z, { rot: 3.4 + 1.6 }, 1.5);
  // Faroles de la plaza
  for (const [x, z] of [[-4.4, 42], [4.4, 42], [-3, 62], [3, 62], [8, 12], [-14, 2]]) { prop('farol', x, z, {}, 0.25); O.luces.push({ x, y: 4, z, r: 14, c: '#ffd68c' }); }
  // Hamaca y banco en la cima de la colina
  const cima = { x: -8, z: -14 };
  prop('banco', cima.x + 2, cima.z + 3, { rot: 0.3 }, 0.8);
  // luces de ventanas y carteles
  for (const e of [mercado, tienda, cabana]) O.luces.push({ x: e.x, y: e.base + 2.4, z: e.z + e.d / 2 + 1, r: 12, c: '#ffc878' });
  O.luces.push({ x: casino.x, y: casino.base + 4, z: casino.z + 7, r: 24, c: '#ff4fc8' });
  O.luces.push({ x: fogata.x, y: 2.3, z: fogata.z, r: 16, c: '#ff9a3c', flick: true });
  O.luces.push({ x: MUELLE.x, y: 3.3, z: MUELLE.z1 - 1, r: 14, c: '#ffd68c' });

  // Cofres del tesoro en los islotes (se pueden volver a abrir cada día)
  const cofre = (id, isla, th, d, premio) => {
    const p = puntoCosta(th, d, ISLA[isla]);
    O.cofres.push({ id, isla, x: p.x, z: p.z, y: Math.max(H(p.x, p.z), 0.2), premio, dia: -1 });
    O.pois.push({ id: 'cofre:' + id, x: p.x, z: p.z, r: 3.6, nombre: 'Cofre enterrado', accion: 'Abrir el cofre' });
  };
  cofre('cangrejo1', 'cangrejo', 0.8, -4, [200, 900]);
  cofre('naufragio1', 'naufragio', 2.2, -4, [1200, 5000]);
  cofre('calavera1', 'calavera', 4.0, -10, [5000, 20000]);
  cofre('principal1', 'principal', 2.9, -14, [60, 300]);

  // Rocas y palmeras de los islotes
  const rnd2 = mulberry32(777);
  for (const is of ISLAS.slice(1)) {
    if (is.tipo === 'atolon' || is.tipo === 'arsenal') continue;
    const n = is.tipo === 'roca' ? 14 : is.tipo === 'banco' ? 3 : 7;
    for (let i = 0; i < n; i++) {
      const p = puntoCosta(rnd2() * TAU, -(3 + rnd2() * is.base * 0.5), is);
      const h = H(p.x, p.z);
      if (h < 0.7) continue;
      if (is.tipo === 'roca' && rnd2() < 0.7) O.rocas.push({ x: p.x, z: p.z, y: h, s: 1.4 + rnd2() * 2.8, rot: rnd2() * TAU, c: rnd2() });
      else { O.palmas.push({ x: p.x, z: p.z, y: h, s: 0.7 + rnd2() * 0.5, rot: rnd2() * TAU, incl: (rnd2() - 0.5) * 0.5 }); O.circulos.push({ x: p.x, z: p.z, r: 0.45 }); }
    }
  }
  armarArsenal({ O, ed, plano, prop, camino, cofre, rnd: mulberry32(4242) });
  O.listo = true;
}

// ---------------------------------------------------------------------------
// Nivel 2: Isla Arsenal. Armería, campamento, torre, ruinas, tres arenas de jefes y selva.
// ---------------------------------------------------------------------------
const ARSENAL = { is: null, plaza: null, armeria: null, arenas: {}, volcan: null };
function armarArsenal(c) {
  const { O, ed, plano, prop, camino, cofre, rnd } = c;
  const is = ISLA.arsenal;
  ARSENAL.is = is;
  const ha = (x, z) => alturaIsla(is, x, z);
  const pc = (th, d) => puntoCosta(th, d, is);
  // plaza junto al muelle
  const pie = { x: MUELLE2.x, z: MUELLE2.z0 + 3 };
  const plazaZ = pie.z - 17;
  ARSENAL.plaza = { x: pie.x, z: plazaZ };
  const baseP = Math.max(2.0, ha(pie.x, plazaZ) + 0.25);
  // Armería del Sargento Roca
  const ax = pie.x - 15, az = plazaZ - 2;
  const arm = ed('armeria', 'casa', ax, az, 11, 8, 4.2, { base: Math.max(2.1, ha(ax, az) + 0.25), nombre: 'Armería del Sargento Roca', pared: '#9a9f82', techo: '#4f5a3c', techo2: '#38422a', cartel: 'ARMERÍA', toldo: ['#e8e1c0', '#5f6d3c'] });
  ARSENAL.armeria = arm;
  O.pois.push({ id: 'armeria', x: arm.x, z: arm.z + arm.d / 2 + 1.6, r: 4.8, nombre: arm.nombre, accion: 'Entrar a la armería', nivel: 2 });
  // campamento: carpas, fogata, cajas y barriles
  const cx = pie.x + 17, cz = plazaZ - 4;
  plano(cx, cz, 12, Math.max(2.0, ha(cx, cz) + 0.25));
  prop('carpa', cx - 6, cz - 3, { rot: 0.5, c: '#6f7d46' }, 2.2);
  prop('carpa', cx + 5, cz - 5, { rot: -0.3, c: '#8a7a4a' }, 2.2);
  prop('carpa', cx + 6, cz + 4, { rot: -1.2, c: '#6f7d46' }, 2.2);
  const fog = { id: 'fogata2', kind: 'fogata', x: cx, z: cz + 1 };
  O.props.push(fog); O.circulos.push({ x: fog.x, z: fog.z, r: 1.1 });
  O.pois.push({ id: 'fogata', x: cx, z: cz + 3.2, r: 3.6, nombre: 'Fogata del campamento', accion: 'Cocinar en la fogata', nivel: 2 });
  O.luces.push({ x: cx, y: 2.3, z: cz + 1, r: 16, c: '#ff9a3c', flick: true });
  prop('sacos', cx - 2, cz + 7, { rot: 0.1 }, 1.6); prop('sacos', cx + 3, cz + 8, { rot: -0.2 }, 1.6);
  prop('barril', cx - 8, cz + 3); prop('barril', cx - 8.8, cz + 4.2); prop('cajon', cx + 9, cz - 1); prop('cajon', cx + 9.2, cz + 0.2);
  prop('canon', pie.x - 3, plazaZ - 10, { rot: Math.PI / 2 + 0.2 }, 1.6);
  prop('bandera', ax + 7.2, az + 6, {}, 0.3);
  prop('barril', ax - 7, az + 5); prop('cajon', ax - 7.2, az + 6.4); prop('sacos', ax + 2, az + 7, { rot: 0 }, 1.6); prop('sacos', ax - 3, az + 7.4, { rot: 0.1 }, 1.6);
  // torre de vigía
  const tx = pie.x + 38, tz = plazaZ - 20;
  plano(tx, tz, 5, Math.max(2.0, ha(tx, tz) + 0.2));
  prop('torre', tx, tz, { rot: 0.3 }, 2.6);
  // cartel de bienvenida
  prop('cartel', pie.x + 3.6, pie.z - 4, { txt: 'ISLA ARSENAL', rot: -0.3 }, 0.4);
  O.luces.push({ x: MUELLE2.x, y: 3.3, z: MUELLE2.z1 - 1, r: 14, c: '#ffd68c' });
  for (const [x, z] of [[pie.x - 3.4, pie.z - 6], [pie.x + 3.4, pie.z - 6], [ax + 5.8, az + 6]]) { prop('farol', x, z, {}, 0.25); O.luces.push({ x, y: 4, z, r: 14, c: '#ffd68c' }); }
  O.luces.push({ x: arm.x, y: arm.base + 2.4, z: arm.z + arm.d / 2 + 1, r: 12, c: '#ffc878' });

  // arenas de los tres jefes de tierra
  const lair = (id, x, z, r, h) => { const l = { x, z, r, h }; ARSENAL.arenas[id] = l; if (JEFE[id]) JEFE[id].lair = l; plano(x, z, r, h); return l; };
  const pg = pc(-2.2, -50), pe = pc(0.35, -44);
  const vx = is.x + 18, vz = is.z - 34;
  const lg = lair('gorila', pg.x, pg.z, 24, Math.max(3, ha(pg.x, pg.z) + 0.4));
  const le = lair('escorpion', pe.x, pe.z, 24, Math.max(3, ha(pe.x, pe.z) + 0.4));
  const ld = lair('draco', vx, vz, 17, 35);
  ARSENAL.volcan = { x: vx, z: vz, h: 35 };
  // ruinas de la selva alrededor del claro del gorila
  for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU + 0.3, r = lg.r + 3.5; prop('ruina', lg.x + Math.cos(a) * r, lg.z + Math.sin(a) * r, { rot: a + Math.PI / 2, v: i }, 2.2); }
  // el claro del escorpión: costillas de huesos y rocas
  for (let i = 0; i < 5; i++) { const a = (i / 5) * TAU + 1.1, r = le.r + 2.5; prop('hueso', le.x + Math.cos(a) * r, le.z + Math.sin(a) * r, { rot: a, v: i }, 1.4); }

  // caminos de tierra: muelle -> plaza -> campamento / arenas / volcán
  camino([{ x: pie.x, z: MUELLE2.z0 + 2 }, { x: pie.x, z: plazaZ }], 3.4);
  camino([{ x: pie.x, z: plazaZ }, { x: arm.x + 1, z: az + arm.d / 2 + 1.5 }], 2.6);
  camino([{ x: pie.x, z: plazaZ }, { x: cx, z: cz + 4 }], 2.8);
  camino([{ x: pie.x, z: plazaZ - 2 }, { x: pie.x - 8, z: plazaZ - 24 }, { x: lg.x + 4, z: lg.z + 20 }, { x: lg.x, z: lg.z }], 2.6);
  camino([{ x: cx + 4, z: cz - 4 }, { x: pe.x - 8, z: pe.z + 16 }, { x: pe.x, z: pe.z }], 2.6);
  camino([{ x: cx + 6, z: cz - 8 }, { x: tx, z: tz }, { x: is.x + 42, z: is.z - 12 }, { x: is.x + 34, z: is.z - 26 }, { x: vx + 14, z: vz + 10 }, { x: vx - 6, z: vz + 12 }, { x: vx, z: vz }], 2.4);
  // cofres y cajas de armas
  cofre('arsenal1', 'arsenal', Math.PI, -6, [4000, 14000]);
  cofre('arsenal2', 'arsenal', -Math.PI / 2, -7, [6000, 20000]);
  cofre('arsenal3', 'arsenal', 2.3, -34, [9000, 30000]);

  // vegetación: palmeras en la playa, selva tupida adentro y rocas volcánicas
  const libreDeArena = (x, z, m) => [lg, le, ld].some((l) => Math.hypot(x - l.x, z - l.z) < l.r + m);
  const cercaCamino = (x, z, m) => O.caminos.some((cm) => { for (let i = 0; i < cm.pts.length - 1; i++) { const a = cm.pts[i], b = cm.pts[i + 1]; if (distSeg(x, z, a.x, a.z, b.x, b.z) < cm.w / 2 + m) return true; } return false; });
  const cercaEdif = (x, z, m) => O.edificios.some((e) => e.id !== 'faro' && Math.abs(x - e.x) < e.w / 2 + m && z > e.z - e.d / 2 - m && z < e.z + e.d / 2 + m + 6) || Math.hypot(x - cx, z - cz) < 14 || Math.hypot(x - tx, z - tz) < 7;
  const ocupado = (x, z, m) => libreDeArena(x, z, m) || cercaCamino(x, z, m) || cercaEdif(x, z, m) || enMuelle(x, z, 6);
  let intentos = 0;
  while (O.palmas.filter((q) => dist(q.x, q.z, is.x, is.z) < 140).length < 30 && intentos++ < 1800) {
    const th = rnd() * TAU, d = -(4 + rnd() * 12);
    const p = pc(th, d), h = ha(p.x, p.z);
    if (h < 0.6 || h > 5 || ocupado(p.x, p.z, 3)) continue;
    if (O.palmas.some((q) => dist(p.x, p.z, q.x, q.z) < 6)) continue;
    O.palmas.push({ x: p.x, z: p.z, y: h, s: 0.85 + rnd() * 0.5, rot: rnd() * TAU, incl: (rnd() - 0.5) * 0.5 });
    O.circulos.push({ x: p.x, z: p.z, r: 0.45 });
  }
  intentos = 0; let nArb = 0;
  while (nArb < 120 && intentos++ < 4000) {
    const th = rnd() * TAU, d = -(16 + rnd() * 74);
    const p = pc(th, d), h = ha(p.x, p.z);
    if (h < 2.4 || h > 26 || ocupado(p.x, p.z, 4.5)) continue;
    if (O.arboles.some((q) => dist(p.x, p.z, q.x, q.z) < 6.2)) continue;
    O.arboles.push({ x: p.x, z: p.z, y: h, s: 0.9 + rnd() * 0.8, rot: rnd() * TAU, c: rnd() });
    O.circulos.push({ x: p.x, z: p.z, r: 0.6 });
    nArb++;
  }
  intentos = 0; let nArbu = 0;
  while (nArbu < 46 && intentos++ < 1500) {
    const th = rnd() * TAU, d = -(12 + rnd() * 70);
    const p = pc(th, d), h = ha(p.x, p.z);
    if (h < 1.8 || h > 22 || ocupado(p.x, p.z, 2.5)) continue;
    O.arbustos.push({ x: p.x, z: p.z, y: h, s: 0.8 + rnd() * 1.0, c: rnd() });
    nArbu++;
  }
  intentos = 0; let nRoc = 0;
  while (nRoc < 50 && intentos++ < 2200) {
    const th = rnd() * TAU, d = -(8 + rnd() * 82);
    const p = pc(th, d), h = ha(p.x, p.z);
    if (h < 0.4 || ocupado(p.x, p.z, 2)) continue;
    const alta = h > 14;
    if (!alta && rnd() < 0.55) continue;
    const s = alta ? 1.6 + rnd() * 2.8 : 0.8 + rnd() * 1.4;
    O.rocas.push({ x: p.x, z: p.z, y: h, s, rot: rnd() * TAU, c: rnd(), v: h > 9 });
    if (h > -0.3) O.circulos.push({ x: p.x, z: p.z, r: 0.9 * s });
    nRoc++;
  }
}
function distSeg(px, pz, x0, z0, x1, z1) {
  const vx = x1 - x0, vz = z1 - z0;
  const l2 = vx * vx + vz * vz || 1;
  const t = clamp(((px - x0) * vx + (pz - z0) * vz) / l2, 0, 1);
  return Math.hypot(px - (x0 + vx * t), pz - (z0 + vz * t));
}
function distCamino(x, z) {
  let m = 1e9;
  for (const c of MUN.caminos) for (let i = 0; i < c.pts.length - 1; i++) { const a = c.pts[i], b = c.pts[i + 1]; m = Math.min(m, distSeg(x, z, a.x, a.z, b.x, b.z) - c.w / 2); }
  return m;
}

// ¿Choca un círculo de radio r en (x,z) contra algo sólido?
function chocaSolidos(x, z, r) {
  for (const s of MUN.solidos) {
    const cx = clamp(x, s.x0, s.x1), cz = clamp(z, s.z0, s.z1);
    if ((x - cx) * (x - cx) + (z - cz) * (z - cz) < r * r) return true;
  }
  for (const c of MUN.circulos) {
    const dx = x - c.x, dz = z - c.z, rr = r + c.r;
    if (dx * dx + dz * dz < rr * rr) return true;
  }
  return false;
}
// Se puede caminar: tierra, muelle o agua baja (hasta la cintura)
const caminable = (x, z) => enMuelle(x, z, -0.15) || H(x, z) > -1.15;
function libre(x, z, r) {
  if (!caminable(x, z) || !caminable(x + r, z) || !caminable(x - r, z) || !caminable(x, z + r) || !caminable(x, z - r)) return false;
  return !chocaSolidos(x, z, r);
}
// Primer punto de agua al avanzar desde (x0,z0) en la dirección (dx,dz) hasta max metros (para lanzar)
function navegable(x, z) { return H(x, z) < -1.3 && !enMuelle(x, z, 1.2) && Math.hypot(x, z) < MUNDO.R; }
