'use strict';
// Utilidades generales: matemática, azar, formato de plata y ayudas de DOM.

const TAU = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const sat = (v) => clamp(v, 0, 1);
const smooth = (a, b, v) => { const t = sat((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const rand = (a = 1, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));
const randi = (a, b) => Math.floor(rand(a, b + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const chance = (p) => Math.random() < p;
const dist = (ax, ay, bx, by) => Math.hypot(bx - ax, by - ay);
const sign = (v) => (v < 0 ? -1 : 1);

// Diferencia angular mínima (-PI..PI)
function angDiff(a, b) {
  let d = (b - a) % TAU;
  if (d > Math.PI) d -= TAU;
  if (d < -Math.PI) d += TAU;
  return d;
}
// Gira "a" hacia "b" como mucho "step" radianes
function turnToward(a, b, step) {
  const d = angDiff(a, b);
  return Math.abs(d) <= step ? b : a + Math.sign(d) * step;
}

// Elige un elemento con pesos: wpick(lista, (x) => peso)
function wpick(list, wf) {
  let tot = 0;
  for (const it of list) tot += Math.max(0, wf(it));
  if (tot <= 0) return list[Math.floor(Math.random() * list.length)];
  let r = Math.random() * tot;
  for (const it of list) {
    r -= Math.max(0, wf(it));
    if (r <= 0) return it;
  }
  return list[list.length - 1];
}

// Generador con semilla (para que la isla y los precios sean siempre iguales)
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Ruido de valor determinista (para destellos, olas, etc.)
function hash2(x, y) {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

// 1234567 -> "1.234.567" (como se escribe acá)
function fmtNum(n) {
  n = Math.round(n);
  const neg = n < 0;
  const s = String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (neg ? '-' : '') + s;
}
const fmtMoney = (n) => '$' + fmtNum(n);
const fmtKg = (w) => (w >= 100 ? Math.round(w) : w >= 10 ? w.toFixed(1) : w.toFixed(2)).toString().replace('.', ',') + ' kg';
function fmtClock(h) {
  const hh = Math.floor(h) % 24;
  const mm = Math.floor((h % 1) * 60);
  return String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
}

// Colores: mezcla de dos "#rrggbb" (t = 0..1)
function hexToRgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mixHex(a, b, t) {
  const A = hexToRgb(a), B = hexToRgb(b);
  return `rgb(${Math.round(lerp(A[0], B[0], t))},${Math.round(lerp(A[1], B[1], t))},${Math.round(lerp(A[2], B[2], t))})`;
}
function shade(hex, k) {
  // k < 0 oscurece, k > 0 aclara
  const [r, g, b] = hexToRgb(hex);
  const f = (c) => Math.round(clamp(k < 0 ? c * (1 + k) : c + (255 - c) * k, 0, 255));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

// Rectángulo redondeado (roundRect no existe en Safari viejos)
function rrect(c, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

// DOM
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
function h(tag, cls, html, parent) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined && html !== null) e.innerHTML = html;
  if (parent) parent.appendChild(e);
  return e;
}
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Lienzos auxiliares
function makeCanvas(w, hgt) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(hgt));
  return c;
}

// Degradados de canvas (íconos 2D)
function gradV(c, y0, y1, paradas) {
  const g = c.createLinearGradient(0, y0, 0, y1);
  for (const [o, col] of paradas) g.addColorStop(o, col);
  return g;
}
function gradH(c, x0, x1, paradas) {
  const g = c.createLinearGradient(x0, 0, x1, 0);
  for (const [o, col] of paradas) g.addColorStop(o, col);
  return g;
}
