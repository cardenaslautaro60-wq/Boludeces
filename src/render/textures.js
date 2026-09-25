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
