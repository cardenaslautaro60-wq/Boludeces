import * as THREE from 'three';
import { RNG } from '../util.js';

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

function tex(c, repeat = true, nearest = false) {
  const t = new THREE.CanvasTexture(c);
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
  t.colorSpace = THREE.SRGBColorSpace;
  if (nearest) { t.magFilter = THREE.NearestFilter; }
  t.anisotropy = 4;
  return t;
}

function noiseFill(ctx, w, h, base, amp, rng, size = 1) {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < (w * h) / (size * size) * 0.6; i++) {
    const x = rng.next() * w, y = rng.next() * h;
    const v = Math.floor((rng.next() - 0.5) * amp);
    ctx.fillStyle = v > 0 ? `rgba(255,255,255,${v / 255})` : `rgba(0,0,0,${-v / 255})`;
    ctx.fillRect(x, y, size, size);
  }
}

export function makeTextures() {
  const rng = new RNG(1234);
  const T = {};

  // Asfalto gastado
  {
    const c = canvas(128, 128), g = c.getContext('2d');
    noiseFill(g, 128, 128, '#46474a', 60, rng, 1);
    for (let i = 0; i < 6; i++) { // parches y grietas
      g.fillStyle = `rgba(20,20,22,${0.15 + rng.next() * 0.2})`;
      g.fillRect(rng.next() * 128, rng.next() * 128, 10 + rng.next() * 30, 4 + rng.next() * 20);
    }
    g.strokeStyle = 'rgba(15,15,15,0.5)';
    for (let i = 0; i < 5; i++) {
      g.beginPath();
      let x = rng.next() * 128, y = rng.next() * 128;
      g.moveTo(x, y);
      for (let k = 0; k < 5; k++) { x += (rng.next() - 0.5) * 30; y += (rng.next() - 0.5) * 30; g.lineTo(x, y); }
      g.stroke();
    }
    T.asphalt = tex(c);
  }
  // Ripio / tierra
  {
    const c = canvas(128, 128), g = c.getContext('2d');
    noiseFill(g, 128, 128, '#9b8866', 70, rng, 2);
    for (let i = 0; i < 300; i++) {
      g.fillStyle = rng.chance(0.5) ? 'rgba(80,70,55,0.5)' : 'rgba(200,190,170,0.5)';
      g.fillRect(rng.next() * 128, rng.next() * 128, 2, 2);
    }
    T.dirt = tex(c);
  }
  // Línea discontinua
  {
    const c = canvas(8, 64), g = c.getContext('2d');
    g.clearRect(0, 0, 8, 64);
    g.fillStyle = '#e8e6da';
    g.fillRect(0, 0, 8, 32);
    const t = tex(c);
    T.dash = t;
  }
  // Vereda (baldosas)
  {
    const c = canvas(64, 64), g = c.getContext('2d');
    noiseFill(g, 64, 64, '#a7a296', 30, rng, 1);
    g.strokeStyle = 'rgba(60,55,50,0.45)';
    g.lineWidth = 1;
    for (let i = 0; i <= 64; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 64); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(64, i); g.stroke(); }
    T.sidewalk = tex(c);
  }
  // Edificios de oficinas: 8x8 ventanas, más mapa emisivo con ventanas prendidas
  {
    const S = 256, n = 8, cs = S / n;
    const c = canvas(S, S), g = c.getContext('2d');
    const e = canvas(S, S), ge = e.getContext('2d');
    ge.fillStyle = '#000'; ge.fillRect(0, 0, S, S);
    noiseFill(g, S, S, '#e2ddd2', 25, rng, 2);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const x = i * cs, y = j * cs;
      g.fillStyle = '#6d6a64';
      g.fillRect(x + 3, y + 5, cs - 6, cs - 11);
      const glass = 40 + Math.floor(rng.next() * 40);
      g.fillStyle = `rgb(${glass},${glass + 18},${glass + 30})`;
      g.fillRect(x + 5, y + 7, cs - 10, cs - 15);
      g.fillStyle = 'rgba(255,255,255,0.12)';
      g.fillRect(x + 5, y + 7, (cs - 10) / 2, cs - 15);
      g.fillStyle = '#5a5751';
      g.fillRect(x + cs / 2 - 1, y + 7, 2, cs - 15);
      if (rng.chance(0.38)) {
        const warm = rng.chance(0.75);
        ge.fillStyle = warm ? `rgb(255,${200 + Math.floor(rng.next() * 40)},${120 + Math.floor(rng.next() * 50)})` : 'rgb(170,200,255)';
        ge.fillRect(x + 5, y + 7, cs - 10, cs - 15);
      }
    }
    T.office = tex(c); T.officeE = tex(e);
  }
  // Casas: textura de 2 pisos. Mitad inferior (v 0..0.5) = planta baja con puerta, mitad superior = primer piso
  {
    const W = 256, H = 128;
    const c = canvas(W, H), g = c.getContext('2d');
    const e = canvas(W, H), ge = e.getContext('2d');
    ge.fillStyle = '#000'; ge.fillRect(0, 0, W, H);
    noiseFill(g, W, H, '#ebe6da', 30, rng, 1);
    g.fillStyle = 'rgba(80,70,60,0.35)'; g.fillRect(0, H - 6, W, 6);
    g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(0, 62, W, 3);
    const win = (x, y) => {
      g.fillStyle = '#f4f4f0'; g.fillRect(x + 14, y + 16, 36, 28);
      g.fillStyle = '#3d4a55'; g.fillRect(x + 17, y + 19, 30, 22);
      g.fillStyle = 'rgba(255,255,255,0.15)'; g.fillRect(x + 17, y + 19, 14, 22);
      g.fillStyle = '#f4f4f0'; g.fillRect(x + 31, y + 19, 2, 22);
      if (rng.chance(0.5)) { g.fillStyle = 'rgba(120,90,60,0.9)'; g.fillRect(x + 17, y + 19, 30, 10); }
      if (rng.chance(0.5)) { ge.fillStyle = '#ffd08a'; ge.fillRect(x + 17, y + 19, 30, 22); }
    };
    for (let k = 0; k < 4; k++) {
      const x = k * 64;
      win(x, 0);
      if (k === 2) {
        g.fillStyle = '#5b3b22'; g.fillRect(x + 22, 64 + 18, 20, 46);
        g.fillStyle = '#3b2515'; g.fillRect(x + 24, 64 + 20, 16, 42);
        g.fillStyle = '#c9b060'; g.fillRect(x + 36, 64 + 42, 2, 3);
      } else win(x, 64);
    }
    T.house = tex(c); T.houseE = tex(e);
  }
  {
    const sh = shopFacade(1);
    T.shop = sh.map; T.shopE = sh.emissive;
  }
  // Chapa acanalada (galpones)
  {
    const c = canvas(64, 64), g = c.getContext('2d');
    for (let x = 0; x < 64; x++) {
      const v = 200 + Math.round(Math.sin((x / 64) * Math.PI * 16) * 30);
      g.fillStyle = `rgb(${v},${v},${v})`;
      g.fillRect(x, 0, 1, 64);
    }
    g.fillStyle = 'rgba(120,60,20,0.25)';
    for (let i = 0; i < 20; i++) g.fillRect(rng.next() * 64, rng.next() * 64, 2, 6 + rng.next() * 14);
    T.metal = tex(c);
  }
  // Techo de chapa (vista desde arriba)
  {
    const c = canvas(64, 64), g = c.getContext('2d');
    for (let x = 0; x < 64; x++) {
      const v = 215 + Math.round(Math.sin((x / 64) * Math.PI * 12) * 35);
      g.fillStyle = `rgb(${v},${v},${v})`;
      g.fillRect(x, 0, 1, 64);
    }
    T.roof = tex(c);
  }
  // Techo plano (membrana/grava)
  {
    const c = canvas(64, 64), g = c.getContext('2d');
    noiseFill(g, 64, 64, '#77736b', 50, rng, 1);
    T.roofFlat = tex(c);
  }
  // Ladrillo
  {
    const c = canvas(64, 64), g = c.getContext('2d');
    g.fillStyle = '#c8bfb2'; g.fillRect(0, 0, 64, 64);
    for (let y = 0; y < 64; y += 8) {
      const off = (y / 8) % 2 ? 8 : 0;
      for (let x = -16; x < 64; x += 16) {
        const v = 150 + Math.floor(rng.next() * 40);
        g.fillStyle = `rgb(${v + 30},${v - 40},${v - 70})`;
        g.fillRect(x + off + 1, y + 1, 14, 6);
      }
    }
    T.brick = tex(c);
  }
  // Pasto seco de la cancha / tierra de la cancha
  {
    const c = canvas(128, 128), g = c.getContext('2d');
    noiseFill(g, 128, 128, '#8e7c58', 50, rng, 2);
    T.pitch = tex(c);
  }
  // Sprite circular suave (luces, humo, partículas)
  {
    const c = canvas(64, 64), g = c.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(0.35, 'rgba(255,255,255,0.6)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    T.glow = tex(c, false);
  }
  {
    const c = canvas(64, 64), g = c.getContext('2d');
    for (let i = 0; i < 12; i++) {
      const x = 16 + rng.next() * 32, y = 16 + rng.next() * 32, r = 8 + rng.next() * 14;
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, 'rgba(255,255,255,0.35)');
      gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    }
    T.smoke = tex(c, false);
  }
  // Sombra circular (blob shadow estilo PS2)
  {
    const c = canvas(64, 64), g = c.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 4, 32, 32, 32);
    gr.addColorStop(0, 'rgba(0,0,0,0.55)');
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    T.shadow = tex(c, false);
  }
  // Bolsita de supermercado
  {
    const c = canvas(64, 64), g = c.getContext('2d');
    g.fillStyle = '#f1f1ec';
    g.beginPath(); g.moveTo(12, 20); g.lineTo(52, 20); g.lineTo(56, 60); g.lineTo(8, 60); g.closePath(); g.fill();
    g.strokeStyle = '#f1f1ec'; g.lineWidth = 4;
    g.beginPath(); g.arc(22, 20, 7, Math.PI, 0); g.stroke();
    g.beginPath(); g.arc(42, 20, 7, Math.PI, 0); g.stroke();
    g.fillStyle = '#1c5aa8'; g.font = 'bold 11px Arial'; g.textAlign = 'center';
    g.fillText('LA', 32, 38); g.fillText('ANÓMALA', 32, 50);
    T.bag = tex(c, false);
  }
  return T;
}

// Locales comerciales de planta baja: 2 filas x 8 frentes de 8 m x 4 m (vidrieras, puerta,
// cartel con el nombre, toldos y persianas). k: resolución (1 = PS2, 2 = realista).
// Alfa 0 en todo: en la versión realista el color del edificio no los tiñe.
export const SHOP_NAMES = [
  ['KIOSCO', 'EL VIENTO', '#1f4fa0', '#ffffff'], ['FARMACIA', 'DEL CHENQUE', '#1b8a4a', '#ffffff'],
  ['PANADERÍA', 'LA PATAGONIA', '#a0521c', '#fff4d8'], ['LOCUTORIO', 'CIBER · FOTOCOPIAS', '#d8261c', '#ffffff'],
  ['ROTISERÍA', 'EL PETROLERO', '#f0c020', '#2a1a10'], ['FERRETERÍA', 'CALETA', '#2d2d2d', '#ffd400'],
  ['VIDEO CLUB', 'EL GOLFO', '#5a1a8a', '#ffe040'], ['ALMACÉN', 'DON TITO', '#e9e2cc', '#8a2a1a'],
  ['PIZZERÍA', 'LA RADA', '#1a6a3a', '#ffffff'], ['CARNICERÍA', 'EL CORDERO', '#b01818', '#ffffff'],
  ['LIBRERÍA', 'SAN JORGE', '#244a7a', '#f4efe0'], ['ZAPATERÍA', 'KM 3', '#3a3a3a', '#ffffff'],
  ['HELADERÍA', 'PINGÜINO', '#f4a6c0', '#3a1a4a'], ['REGALERÍA', 'LA MESETA', '#0f7f8f', '#ffffff'],
  ['PELUQUERÍA', 'UNISEX', '#202020', '#ff5cae'], ['CASA DE DEPORTES', 'EL LOBO', '#15306b', '#ffffff'],
];
export function shopFacade(k = 1) {
  const cw = 256 * k, ch = 128 * k, W = cw * 8, H = ch * 2;
  const c = canvas(W, H), g = c.getContext('2d');
  const e = canvas(W, H), ge = e.getContext('2d');
  const rng = new RNG(4321);
  ge.fillStyle = '#000'; ge.fillRect(0, 0, W, H);
  const m = 32 * k; // píxeles por metro
  const walls = ['#d9d2c2', '#c8bca6', '#e4dccb', '#b9b2a6', '#d4c3a4', '#cfc8bb', '#e8e0cc', '#bfae98'];
  SHOP_NAMES.forEach(([name, sub, bg, fg], i) => {
    const x0 = (i % 8) * cw, y0 = Math.floor(i / 8) * ch;
    g.fillStyle = walls[i % walls.length]; g.fillRect(x0, y0, cw, ch);
    for (let q = 0; q < 300 * k; q++) { g.fillStyle = `rgba(0,0,0,${rng.next() * 0.08})`; g.fillRect(x0 + rng.next() * cw, y0 + rng.next() * ch, 2 * k, 2 * k); }
    // columnas entre locales y zócalo
    g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(x0, y0, 4 * k, ch); g.fillRect(x0 + cw - 4 * k, y0, 4 * k, ch);
    g.fillStyle = '#7d7870'; g.fillRect(x0, y0 + ch - 0.25 * m, cw, 0.25 * m);
    // cartel
    const sy = y0 + 0.35 * m, sh = 0.75 * m, sx = x0 + 0.35 * m, sw = cw - 0.7 * m;
    g.fillStyle = bg; g.fillRect(sx, sy, sw, sh);
    g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(sx, sy, sw, sh * 0.35);
    g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 2 * k; g.strokeRect(sx, sy, sw, sh);
    g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `bold ${Math.round(sh * 0.52)}px Arial, Helvetica, sans-serif`;
    g.fillText(name, sx + sw / 2, sy + sh * 0.38, sw - 8 * k);
    g.font = `bold ${Math.round(sh * 0.26)}px Arial, Helvetica, sans-serif`;
    g.fillText(sub, sx + sw / 2, sy + sh * 0.8, sw - 8 * k);
    ge.fillStyle = bg; ge.globalAlpha = 0.9; ge.fillRect(sx, sy, sw, sh); ge.globalAlpha = 1;
    ge.fillStyle = fg; ge.textAlign = 'center'; ge.textBaseline = 'middle';
    ge.font = `bold ${Math.round(sh * 0.52)}px Arial, Helvetica, sans-serif`; ge.fillText(name, sx + sw / 2, sy + sh * 0.38, sw - 8 * k);
    // vidrieras y puerta
    const top = y0 + 1.35 * m, bot = y0 + ch - 0.25 * m;
    const doorLeft = rng.chance(0.5);
    const dw = 1.1 * m, dx = doorLeft ? x0 + 0.6 * m : x0 + cw - 0.6 * m - dw;
    const glass = (gx, gy, gw, gh) => {
      const gr = g.createLinearGradient(gx, gy, gx + gw, gy + gh);
      gr.addColorStop(0, '#46586a'); gr.addColorStop(0.5, '#6f8496'); gr.addColorStop(1, '#3a4652');
      g.fillStyle = gr; g.fillRect(gx, gy, gw, gh);
      // mercadería y góndolas
      for (let q = 0; q < 6; q++) {
        g.fillStyle = `hsla(${Math.floor(rng.next() * 360)},45%,${45 + rng.next() * 25}%,0.55)`;
        g.fillRect(gx + rng.next() * (gw - 10 * k), gy + gh * (0.45 + rng.next() * 0.4), (6 + rng.next() * 14) * k, (5 + rng.next() * 10) * k);
      }
      g.fillStyle = 'rgba(255,255,255,0.14)';
      g.beginPath(); g.moveTo(gx, gy); g.lineTo(gx + gw * 0.35, gy); g.lineTo(gx + gw * 0.1, gy + gh); g.lineTo(gx, gy + gh); g.fill();
      ge.fillStyle = 'rgb(255,226,170)'; ge.globalAlpha = 0.75; ge.fillRect(gx, gy, gw, gh); ge.globalAlpha = 1;
    };
    // marco de aluminio
    g.fillStyle = '#9ea3a6'; g.fillRect(x0 + 0.35 * m, top - 3 * k, cw - 0.7 * m, bot - top + 3 * k);
    const wx0 = doorLeft ? dx + dw + 0.15 * m : x0 + 0.5 * m, wx1 = doorLeft ? x0 + cw - 0.5 * m : dx - 0.15 * m;
    const mid = (wx0 + wx1) / 2;
    glass(wx0, top, mid - wx0 - 2 * k, bot - top - 0.2 * m);
    glass(mid + 2 * k, top, wx1 - mid - 2 * k, bot - top - 0.2 * m);
    // puerta vidriada
    glass(dx, top + 0.1 * m, dw, bot - top - 0.1 * m);
    g.fillStyle = '#6f7478'; g.fillRect(dx + dw * 0.5 - k, top + 0.1 * m, 2 * k, bot - top - 0.1 * m);
    g.fillStyle = '#d8d8d0'; g.fillRect(dx + dw * 0.5 + 4 * k, top + (bot - top) * 0.55, 3 * k, 8 * k);
    // persiana metálica a medio bajar o toldo a rayas
    const r = rng.next();
    if (r < 0.3) {
      const ph = (bot - top) * (0.25 + rng.next() * 0.35);
      for (let yy = top; yy < top + ph; yy += 3 * k) { g.fillStyle = (yy / (3 * k)) % 2 < 1 ? '#8e9397' : '#a9aeb2'; g.fillRect(wx0, yy, wx1 - wx0, 3 * k); }
    } else if (r < 0.75) {
      const aw = bg, stripes = 10;
      const ay = top - 0.05 * m, ah = 0.5 * m;
      for (let q = 0; q < stripes; q++) {
        g.fillStyle = q % 2 ? '#f2f0ea' : aw;
        g.fillRect(x0 + 0.3 * m + (q * (cw - 0.6 * m)) / stripes, ay, (cw - 0.6 * m) / stripes + 1, ah);
      }
      g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(x0 + 0.3 * m, ay + ah, cw - 0.6 * m, 3 * k);
    }
  });
  const t = tex(c), te = tex(e);
  t.anisotropy = 8;
  return { map: t, emissive: te };
}

// Texto sobre cartel
const signCache = new Map();
export function signTexture(lines, opts = {}) {
  const key = JSON.stringify([lines, opts]);
  if (signCache.has(key)) return signCache.get(key);
  const w = opts.w || 512, h = opts.h || 128;
  const c = canvas(w, h), g = c.getContext('2d');
  g.fillStyle = opts.bg || '#1c3f7a';
  g.fillRect(0, 0, w, h);
  if (opts.border !== false) {
    g.strokeStyle = opts.borderColor || '#ffffff';
    g.lineWidth = 6;
    g.strokeRect(6, 6, w - 12, h - 12);
  }
  g.fillStyle = opts.fg || '#ffffff';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const n = lines.length;
  lines.forEach((ln, i) => {
    const size = (opts.sizes && opts.sizes[i]) || Math.floor((h * 0.7) / n);
    g.font = `${opts.italic ? 'italic ' : ''}bold ${size}px ${opts.font || 'Arial, Helvetica, sans-serif'}`;
    g.fillText(ln, w / 2, (h / (n + 0)) * (i + 0.5), w - 24);
  });
  const t = tex(c, false);
  signCache.set(key, t);
  return t;
}

// Caras de los personajes
const faceCache = new Map();
export function faceTexture(opt) {
  const key = JSON.stringify(opt);
  if (faceCache.has(key)) return faceCache.get(key);
  const c = canvas(64, 64), g = c.getContext('2d');
  g.fillStyle = opt.skin;
  g.fillRect(0, 0, 64, 64);
  // parches de color para pelo y gorra (se muestrean con UV fijas)
  g.fillStyle = opt.hair || '#2a1d14'; g.fillRect(0, 0, 7, 7);
  g.fillStyle = opt.hat || '#1c2f6b'; g.fillRect(57, 0, 7, 7);
  // cejas
  g.fillStyle = opt.hair || '#2a1d14';
  g.fillRect(12, 20, 14, 3); g.fillRect(38, 20, 14, 3);
  if (opt.glasses) {
    g.fillStyle = '#0c0c0e';
    g.fillRect(9, 24, 20, 11); g.fillRect(35, 24, 20, 11); g.fillRect(27, 26, 10, 3);
    g.fillStyle = 'rgba(120,160,200,0.5)'; g.fillRect(11, 26, 6, 3); g.fillRect(37, 26, 6, 3);
  } else {
    g.fillStyle = '#fff'; g.fillRect(14, 26, 10, 6); g.fillRect(40, 26, 10, 6);
    g.fillStyle = opt.eyes || '#3b2a1c'; g.fillRect(18, 26, 5, 6); g.fillRect(42, 26, 5, 6);
  }
  // nariz
  g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(29, 32, 6, 10);
  // boca
  g.fillStyle = '#7a3b30'; g.fillRect(22, 48, 20, 3);
  if (opt.smile) { g.fillRect(20, 46, 3, 3); g.fillRect(41, 46, 3, 3); }
  if (opt.mustache) { g.fillStyle = opt.hair || '#2a1d14'; g.fillRect(18, 42, 28, 5); }
  if (opt.beard) {
    g.fillStyle = opt.beardColor || opt.hair || '#2a1d14';
    g.globalAlpha = 0.75;
    g.fillRect(6, 44, 52, 20); g.fillRect(6, 34, 6, 12); g.fillRect(52, 34, 6, 12);
    g.globalAlpha = 1;
    g.fillStyle = '#7a3b30'; g.fillRect(24, 50, 16, 3);
  }
  const t = tex(c, false);
  faceCache.set(key, t);
  return t;
}

// Textura de camiseta (para el Gordopin con la de Newbery: blanca con banda azul)
const shirtCache = new Map();
export function shirtTexture(kind, base, accent) {
  const key = kind + base + accent;
  if (shirtCache.has(key)) return shirtCache.get(key);
  const c = canvas(64, 64), g = c.getContext('2d');
  g.fillStyle = base; g.fillRect(0, 0, 64, 64);
  if (kind === 'banda') { g.fillStyle = accent; g.fillRect(0, 24, 64, 16); }
  if (kind === 'rayas') { g.fillStyle = accent; for (let x = 0; x < 64; x += 16) g.fillRect(x, 0, 8, 64); }
  if (kind === 'jean') {
    for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.12})`; g.fillRect(Math.random() * 64, Math.random() * 64, 1, 3); }
    g.fillStyle = 'rgba(230,230,230,0.8)'; g.fillRect(31, 0, 2, 64);
    g.fillStyle = 'rgba(40,50,80,0.6)'; g.fillRect(12, 16, 12, 10); g.fillRect(40, 16, 12, 10);
  }
  if (kind === 'mameluco') { g.fillStyle = accent; g.fillRect(0, 40, 64, 5); g.fillRect(0, 50, 64, 5); }
  if (kind === 'polo') { g.fillStyle = accent; g.fillRect(24, 0, 16, 12); }
  const t = tex(c, false);
  shirtCache.set(key, t);
  return t;
}
