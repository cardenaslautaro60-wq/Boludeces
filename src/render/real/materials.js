import * as THREE from 'three';
import { SHOP_NAMES } from '../textures.js';

// Materiales de la versión realista armados con las texturas fotográficas (STYLE.tex).
//  - worldUV: el piso (calles, veredas, plazas) se texturiza por posición en el mundo, así
//    los tramos y las esquinas empalman sin costuras, con una variación grande que evita
//    que se note la repetición.
//  - fachadas: se componen en un canvas (revoque real + ventanas con marco de aluminio y
//    vidrio) con sus mapas de relieve y de rugosidad/metal para que el vidrio refleje el cielo.

// ---------------------------------------------------------------------------
// Coordenadas de textura por posición en el mundo
// ---------------------------------------------------------------------------
export function worldUV(mat, scale, { vary = 0.22 } = {}) {
  const prev = mat.onBeforeCompile;
  mat.onBeforeCompile = (sh, r) => {
    if (prev) prev(sh, r);
    sh.uniforms.uWScale = { value: scale };
    sh.uniforms.uVary = { value: vary };
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vWorldXZ;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        { vec4 wp4 = vec4(transformed, 1.0);
          #ifdef USE_INSTANCING
          wp4 = instanceMatrix * wp4;
          #endif
          vWorldXZ = (modelMatrix * wp4).xz; }`);
    sh.fragmentShader = sh.fragmentShader
      .replace('void main() {', `varying vec2 vWorldXZ;
        uniform float uWScale, uVary;
        #define vMapUv wuv
        #define vNormalMapUv wuv
        #define vRoughnessMapUv wuv
        #define vMetalnessMapUv wuv
        #define vAoMapUv wuv
        void main() {
          vec2 wuv = vWorldXZ * uWScale;`)
      // variación de tono a gran escala (rompe la repetición de la foto)
      .replace('#include <map_fragment>', `#include <map_fragment>
        #ifdef USE_MAP
          float big = texture2D(map, vWorldXZ * uWScale * 0.067 + 0.37).g;
          diffuseColor.rgb *= mix(1.0 - uVary, 1.0 + uVary * 0.6, big);
        #endif`);
  };
  mat.customProgramCacheKey = () => 'wuv' + (mat.userData.key || '');
  return mat;
}

// El color de vértice (o de instancia) solo tiñe donde el alfa del mapa es 1 (la pared),
// no los vidrios, los marcos ni las puertas
// La máscara va en una textura aparte (canal rojo): en el alfa del canvas el navegador pierde
// el color de lo que tiene alfa 0 y los vidrios salían negros.
export function tintMask(mat, mask = null) {
  const prev = mat.onBeforeCompile;
  mat.onBeforeCompile = (sh, r) => {
    if (prev) prev(sh, r);
    if (mask) sh.uniforms.tintMap = { value: mask };
    sh.fragmentShader = (mask ? 'uniform sampler2D tintMap;\n' : '') + sh.fragmentShader.replace('#include <color_fragment>', `
      #if ( defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) ) && defined( USE_MAP )
        diffuseColor.rgb *= mix(vec3(1.0), vColor.rgb, ${mask ? 'texture2D(tintMap, vMapUv).r' : 'texture2D(map, vMapUv).a'});
      #elif defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
        diffuseColor *= vColor;
      #endif`);
  };
  const key = mat.customProgramCacheKey ? mat.customProgramCacheKey() : '';
  mat.customProgramCacheKey = () => key + '-tint';
  return mat;
}

// ---------------------------------------------------------------------------
// Utilidades de canvas
// ---------------------------------------------------------------------------
function cv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function tile(g, img, x, y, w, h, size) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  for (let yy = y; yy < y + h; yy += size) for (let xx = x; xx < x + w; xx += size) g.drawImage(img, xx, yy, size, size);
  g.restore();
}
function texFrom(c, color, aniso = 8) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = aniso;
  if (color) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
// normal "tangente" codificada (x, y hacia arriba, z)
const N = (x, y) => { const z = Math.sqrt(Math.max(0, 1 - x * x - y * y)); return `rgb(${Math.round(128 + x * 127)},${Math.round(128 + y * 127)},${Math.round(128 + z * 127)})`; };
const ORM = (ao, rough, metal) => `rgb(${Math.round(ao * 255)},${Math.round(rough * 255)},${Math.round(metal * 255)})`;

// Hueco de ventana con marco, vidrio y a veces persiana. (x, y, w, h) en px del canvas.
function drawWindow(G, rng, x, y, w, h, opts = {}) {
  const { g, n, m, e, a } = G;
  const f = opts.frame || Math.max(3, Math.round(w * 0.045));
  const reveal = Math.max(3, Math.round(w * 0.05));
  // jamba (el grosor de la pared): relieve hacia adentro
  g.fillStyle = '#8f8a82'; g.fillRect(x - reveal, y - reveal, w + reveal * 2, h + reveal * 2);
  n.fillStyle = N(0, -0.75); n.fillRect(x - reveal, y - reveal, w + reveal * 2, reveal);
  n.fillStyle = N(0, 0.75); n.fillRect(x - reveal, y + h, w + reveal * 2, reveal);
  n.fillStyle = N(0.75, 0); n.fillRect(x - reveal, y, reveal, h);
  n.fillStyle = N(-0.75, 0); n.fillRect(x + w, y, reveal, h);
  m.fillStyle = ORM(0.55, 0.9, 0); m.fillRect(x - reveal, y - reveal, w + reveal * 2, h + reveal * 2);
  a.fillStyle = '#000'; a.fillRect(x - reveal, y - reveal, w + reveal * 2, h + reveal * 2);
  // alféizar
  g.fillStyle = '#b9b4aa'; g.fillRect(x - reveal - 3, y + h + reveal - 2, w + reveal * 2 + 6, Math.max(4, reveal));
  n.fillStyle = N(0, 0.6); n.fillRect(x - reveal - 3, y + h + reveal - 2, w + reveal * 2 + 6, Math.max(4, reveal));
  // marco
  const frameCol = opts.wood ? '#6b4a2e' : rng() < 0.5 ? '#a7aaad' : '#e8e6e0';
  const frameMetal = opts.wood ? 0 : frameCol === '#a7aaad' ? 1 : 0;
  g.fillStyle = frameCol; g.fillRect(x, y, w, h);
  n.fillStyle = N(0, 0); n.fillRect(x, y, w, h);
  m.fillStyle = ORM(1, frameMetal ? 0.35 : 0.5, frameMetal); m.fillRect(x, y, w, h);
  // vidrios (dos hojas)
  const gx = x + f, gy = y + f, gw = w - f * 2, gh = h - f * 2;
  const glass = (xx, yy, ww, hh) => {
    // vidrio con algo del interior (no negro): el reflejo del cielo lo pone el mapa de entorno
    const shade = 64 + Math.floor(rng() * 34);
    const gr = g.createLinearGradient(xx, yy, xx, yy + hh);
    gr.addColorStop(0, `rgb(${shade + 8},${shade + 16},${shade + 24})`);
    gr.addColorStop(1, `rgb(${shade - 12},${shade - 6},${shade})`);
    g.fillStyle = gr; g.fillRect(xx, yy, ww, hh);
    // vidrio espejado: poca rugosidad y algo de "metal" para que refleje el cielo y la ciudad
    m.fillStyle = ORM(1, 0.07, 0.38); m.fillRect(xx, yy, ww, hh);
    n.fillStyle = N((rng() - 0.5) * 0.04, (rng() - 0.5) * 0.04); n.fillRect(xx, yy, ww, hh);
  };
  const half = Math.floor(gw / 2);
  glass(gx, gy, half - Math.floor(f / 3), gh);
  glass(gx + half + Math.floor(f / 3), gy, gw - half - Math.floor(f / 3), gh);
  // luz de noche detrás del vidrio
  if (rng() < (opts.lit ?? 0.38)) {
    const warm = rng() < 0.78;
    const k = 0.55 + rng() * 0.45;
    const col = warm ? [255, 190 + Math.floor(rng() * 40), 110 + Math.floor(rng() * 50)] : [175, 205, 255];
    const eg = e.createLinearGradient(0, gy, 0, gy + gh);
    eg.addColorStop(0, `rgb(${col[0] * k | 0},${col[1] * k | 0},${col[2] * k | 0})`);
    eg.addColorStop(0.6, `rgb(${col[0] * k * 0.75 | 0},${col[1] * k * 0.75 | 0},${col[2] * k * 0.75 | 0})`);
    eg.addColorStop(1, `rgb(${col[0] * k * 0.35 | 0},${col[1] * k * 0.35 | 0},${col[2] * k * 0.35 | 0})`);
    e.fillStyle = eg; e.fillRect(gx, gy, gw, gh);
    // muebles y siluetas del interior
    e.fillStyle = 'rgba(0,0,0,0.55)';
    e.fillRect(gx + gw * rng() * 0.5, gy + gh * 0.62, gw * (0.2 + rng() * 0.3), gh * 0.38);
    if (rng() < 0.5) e.fillRect(gx + gw * (0.55 + rng() * 0.3), gy + gh * 0.4, gw * 0.12, gh * 0.6);
  }
  // persiana de enrollar (muy de acá) o cortina
  const p = rng();
  if (p < (opts.shutter ?? 0.45)) {
    const ph = Math.floor(gh * (0.2 + rng() * 0.75));
    const col = rng() < 0.6 ? [236, 232, 222] : [120, 88, 60];
    for (let yy = gy; yy < gy + ph; yy += 4) {
      const k = 0.88 + ((yy - gy) % 8 < 4 ? 0.08 : 0);
      g.fillStyle = `rgb(${col[0] * k | 0},${col[1] * k | 0},${col[2] * k | 0})`; g.fillRect(gx, yy, gw, 4);
    }
    n.fillStyle = N(0, 0.25); for (let yy = gy; yy < gy + ph; yy += 4) n.fillRect(gx, yy, gw, 2);
    m.fillStyle = ORM(0.9, 0.55, 0); m.fillRect(gx, gy, gw, ph);
    e.fillStyle = '#000'; e.fillRect(gx, gy, gw, ph);
  } else if (p < 0.8) {
    // cortinas a los costados
    g.fillStyle = rng() < 0.5 ? 'rgba(235,228,210,0.7)' : rng() < 0.5 ? 'rgba(190,170,140,0.65)' : 'rgba(150,160,175,0.6)';
    const cwid = gw * (0.18 + rng() * 0.25);
    g.fillRect(gx + 2, gy + 2, cwid, gh - 4);
    if (rng() < 0.6) g.fillRect(gx + gw - 2 - cwid * 0.9, gy + 2, cwid * 0.9, gh - 4);
    m.fillStyle = ORM(1, 0.3, 0); m.fillRect(gx + 2, gy + 2, cwid, gh - 4);
  }
  // parante del medio
  g.fillStyle = frameCol; g.fillRect(gx + half - Math.floor(f / 3), gy, Math.max(2, Math.floor(f * 2 / 3)), gh);
}

// Canvas de pared con foto de revoque (alfa 1 = se tiñe con el color del edificio)
function wallBase(W, H, R, key, size) {
  const G = { c: cv(W, H), cn: cv(W, H), cm: cv(W, H), ce: cv(W, H), ca: cv(W, H) };
  G.g = G.c.getContext('2d'); G.n = G.cn.getContext('2d'); G.m = G.cm.getContext('2d'); G.e = G.ce.getContext('2d'); G.a = G.ca.getContext('2d');
  tile(G.g, R[key].img, 0, 0, W, H, size);
  tile(G.n, R[key].nimg, 0, 0, W, H, size);
  tile(G.m, R[key].mimg, 0, 0, W, H, size);
  G.e.fillStyle = '#000'; G.e.fillRect(0, 0, W, H);
  G.a.fillStyle = '#fff'; G.a.fillRect(0, 0, W, H);
  return G;
}
// Junta el alfa (máscara de teñido) con el color y arma las texturas
function finish(G) {
  return { map: texFrom(G.c, true), normalMap: texFrom(G.cn, false), orm: texFrom(G.cm, false), emissive: texFrom(G.ce, true), mask: texFrom(G.ca, false), maskCanvas: G.ca };
}

function rngOf(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

// Oficinas del Centro: grilla de 8x8 ventanas por unidad de textura (28 m x 25,6 m)
function officeFacade(R) {
  const S = 1024, n = 8, cs = S / n;
  const G = wallBase(S, S, R, 'revoque', 256);
  const rng = rngOf(77);
  for (let j = 0; j < n; j++) {
    // cornisa / losa entre pisos
    const y0 = j * cs;
    G.g.fillStyle = 'rgba(0,0,0,0.10)'; G.g.fillRect(0, y0 + cs - 7, S, 7);
    G.n.fillStyle = N(0, -0.5); G.n.fillRect(0, y0 + cs - 7, S, 3);
    G.n.fillStyle = N(0, 0.5); G.n.fillRect(0, y0 + cs - 4, S, 3);
    for (let i = 0; i < n; i++) {
      const x0 = i * cs;
      const w = Math.round(cs * 0.62), h = Math.round(cs * 0.52);
      drawWindow(G, rng, x0 + (cs - w) / 2, y0 + cs * 0.18, w, h, { shutter: 0.4, lit: 0.38 });
    }
  }
  return finish(G);
}

// Departamentos con balcones corridos: losa de hormigón en cada piso, baranda (de caño o de
// vidrio) y puertas-ventana; en algunos, ropa tendida o una planta
function balconFacade(R) {
  const S = 1024, n = 8, cs = S / n;
  const G = wallBase(S, S, R, 'revoque2', 256);
  const rng = rngOf(311);
  for (let j = 0; j < n; j++) {
    const y0 = j * cs;
    const glassRail = rng() < 0.35;
    for (let i = 0; i < n; i++) {
      const x0 = i * cs;
      // puerta-ventana alta
      drawWindow(G, rng, x0 + cs * 0.14, y0 + cs * 0.12, Math.round(cs * 0.72), Math.round(cs * 0.72), { shutter: 0.35, lit: 0.4 });
    }
    // losa del balcón (no se tiñe): canto de hormigón con sombra debajo
    const sy = y0 + cs - 16;
    tile(G.g, R.hormigon.img, 0, sy, S, 12, 128);
    G.a.fillStyle = '#000'; G.a.fillRect(0, sy, S, 12);
    G.n.fillStyle = N(0, -0.8); G.n.fillRect(0, sy, S, 3);
    G.n.fillStyle = N(0, 0.8); G.n.fillRect(0, sy + 9, S, 3);
    G.m.fillStyle = ORM(0.8, 0.85, 0); G.m.fillRect(0, sy, S, 12);
    G.g.fillStyle = 'rgba(0,0,0,0.35)'; G.g.fillRect(0, sy + 12, S, 5);
    // baranda
    const ry = y0 + cs * 0.52;
    if (glassRail) {
      G.g.fillStyle = 'rgba(150,175,185,0.45)'; G.g.fillRect(0, ry, S, sy - ry);
      G.m.fillStyle = ORM(1, 0.06, 0.5); G.m.fillRect(0, ry, S, sy - ry);
      G.a.fillStyle = '#000'; G.a.fillRect(0, ry, S, sy - ry);
      G.g.fillStyle = '#b5b9bc'; G.g.fillRect(0, ry - 4, S, 4);
    } else {
      G.g.fillStyle = '#2c2e30'; G.g.fillRect(0, ry - 4, S, 5);
      for (let x = 0; x < S; x += 9) G.g.fillRect(x, ry, 2, sy - ry);
      G.a.fillStyle = '#000'; G.a.fillRect(0, ry - 4, S, 5);
      G.m.fillStyle = ORM(1, 0.45, 0.8); G.m.fillRect(0, ry - 4, S, 5);
    }
    // ropa tendida o macetas en algunos balcones
    for (let i = 0; i < n; i++) {
      const x0 = i * cs, r = rng();
      if (r < 0.18) {
        for (let k = 0; k < 4; k++) {
          G.g.fillStyle = ['#d8d4cc', '#3a5a8a', '#b03a3a', '#e8c040', '#f0f0f0'][Math.floor(rng() * 5)];
          G.g.fillRect(x0 + 20 + k * 22, ry + 6, 16, 18 + rng() * 10);
        }
        G.a.fillStyle = '#000'; G.a.fillRect(x0 + 18, ry + 4, 96, 32);
      } else if (r < 0.34) {
        G.g.fillStyle = '#8a4a2a'; G.g.fillRect(x0 + 30, sy - 16, 18, 16);
        G.g.fillStyle = '#3e6a2e'; G.g.beginPath(); G.g.arc(x0 + 39, sy - 20, 14, 0, Math.PI * 2); G.g.fill();
        G.a.fillStyle = '#000'; G.a.fillRect(x0 + 24, sy - 36, 32, 36);
      }
    }
  }
  return finish(G);
}

// Edificio con franjas de vidrio (años 80-90): bandas vidriadas azul verdoso y antepechos
function ribbonFacade(R) {
  const S = 1024, n = 8, cs = S / n;
  const G = wallBase(S, S, R, 'revoque', 256);
  const rng = rngOf(512);
  for (let j = 0; j < n; j++) {
    const y0 = j * cs;
    const gy = y0 + cs * 0.12, gh = Math.round(cs * 0.6);
    const tone = 70 + Math.floor(rng() * 20);
    const gr = G.g.createLinearGradient(0, gy, 0, gy + gh);
    gr.addColorStop(0, `rgb(${tone - 20},${tone + 10},${tone + 18})`); gr.addColorStop(1, `rgb(${tone - 35},${tone - 8},${tone})`);
    G.g.fillStyle = gr; G.g.fillRect(0, gy, S, gh);
    G.m.fillStyle = ORM(1, 0.05, 0.5); G.m.fillRect(0, gy, S, gh);
    G.n.fillStyle = N(0, 0); G.n.fillRect(0, gy, S, gh);
    G.a.fillStyle = '#000'; G.a.fillRect(0, gy, S, gh);
    // montantes de aluminio
    for (let x = 0; x < S; x += cs / 2) {
      G.g.fillStyle = '#9ea2a5'; G.g.fillRect(x, gy, 5, gh);
      G.m.fillStyle = ORM(1, 0.3, 1); G.m.fillRect(x, gy, 5, gh);
    }
    G.g.fillStyle = '#9ea2a5'; G.g.fillRect(0, gy - 4, S, 5); G.g.fillRect(0, gy + gh - 1, S, 5);
    // luces de noche por módulos
    for (let x = 0; x < S; x += cs / 2) {
      if (rng() < 0.4) { G.e.fillStyle = rng() < 0.8 ? 'rgb(255,226,170)' : 'rgb(190,215,255)'; G.e.fillRect(x + 5, gy, cs / 2 - 5, gh); }
      if (rng() < 0.3) { G.g.fillStyle = 'rgba(220,215,200,0.55)'; G.g.fillRect(x + 5, gy, cs / 2 - 5, gh * (0.3 + rng() * 0.6)); }
    }
  }
  return finish(G);
}

// Ladrillo visto con ventanas de marco blanco (muy patagónico)
function brickFacade(R) {
  const S = 1024, n = 8, cs = S / n;
  const G = wallBase(S, S, R, 'ladrillo', 128);
  const rng = rngOf(733);
  for (let j = 0; j < n; j++) {
    const y0 = j * cs;
    // dintel de hormigón por piso
    tile(G.g, R.hormigon.img, 0, y0 + cs - 10, S, 10, 128);
    G.n.fillStyle = N(0, -0.6); G.n.fillRect(0, y0 + cs - 10, S, 3);
    for (let i = 0; i < n; i++) {
      const x0 = i * cs;
      drawWindow(G, rng, x0 + cs * 0.2, y0 + cs * 0.16, Math.round(cs * 0.6), Math.round(cs * 0.56), { shutter: 0.5, lit: 0.36 });
    }
  }
  // el ladrillo no se tiñe (ya tiene su color)
  G.a.fillStyle = '#000'; G.a.fillRect(0, 0, S, S);
  return finish(G);
}

// Casas: 4 columnas x 2 plantas (abajo, en la tercera columna, la puerta)
function houseFacade(R) {
  const W = 1024, H = 512, cw = 256, ch = 256;
  const G = wallBase(W, H, R, 'revoque2', 256);
  const rng = rngOf(91);
  // zócalo de cemento (no se tiñe)
  G.g.fillStyle = '#8c8880'; G.g.fillRect(0, H - 22, W, 22);
  G.a.fillStyle = '#000'; G.a.fillRect(0, H - 22, W, 22);
  G.n.fillStyle = N(0, 0.4); G.n.fillRect(0, H - 24, W, 3);
  // losa entre plantas
  G.g.fillStyle = 'rgba(0,0,0,0.12)'; G.g.fillRect(0, ch - 8, W, 8);
  for (let k = 0; k < 4; k++) {
    const x0 = k * cw;
    drawWindow(G, rng, x0 + 70, 58, 116, 100, { wood: rng() < 0.4, shutter: 0.55, lit: 0.45 });
    if (k === 2) {
      // puerta de madera con marco
      const dx = x0 + 88, dy = ch + 40, dw = 80, dh = ch - 62;
      G.g.fillStyle = '#7c7872'; G.g.fillRect(dx - 8, dy - 8, dw + 16, dh + 8);
      G.a.fillStyle = '#000'; G.a.fillRect(dx - 8, dy - 8, dw + 16, dh + 8);
      tile(G.g, R.madera.img, dx, dy, dw, dh, 128);
      G.g.fillStyle = 'rgba(90,50,20,0.55)'; G.g.fillRect(dx, dy, dw, dh);
      tile(G.n, R.madera.nimg, dx, dy, dw, dh, 128);
      G.m.fillStyle = ORM(0.8, 0.6, 0); G.m.fillRect(dx, dy, dw, dh);
      G.n.fillStyle = N(0.7, 0); G.n.fillRect(dx - 8, dy, 6, dh);
      G.n.fillStyle = N(-0.7, 0); G.n.fillRect(dx + dw + 2, dy, 6, dh);
      G.g.fillStyle = '#c9b060'; G.g.fillRect(dx + dw - 16, dy + dh * 0.5, 5, 9);
      G.m.fillStyle = ORM(1, 0.3, 1); G.m.fillRect(dx + dw - 16, dy + dh * 0.5, 5, 9);
    } else {
      drawWindow(G, rng, x0 + 70, ch + 58, 116, 100, { wood: rng() < 0.4, shutter: 0.55, lit: 0.45 });
    }
  }
  return finish(G);
}

// Locales de planta baja (2 filas x 8 frentes de 8 m x 4 m, como en la PS2): revoque de foto,
// cartel con relieve que se prende de noche, vidrieras espejadas con la mercadería adentro,
// marcos de aluminio, persiana metálica o toldo a rayas
function realShopFacade(R) {
  const cw = 512, ch = 256, W = cw * 8, H = ch * 2, m = 64; // 64 px por metro
  const G = wallBase(W, H, R, 'revoque', 256);
  G.a.fillStyle = '#000'; G.a.fillRect(0, 0, W, H); // no se tiñe
  const rng = rngOf(4321);
  const walls = ['#d9d2c2', '#c8bca6', '#e4dccb', '#b9b2a6', '#d4c3a4', '#cfc8bb', '#e8e0cc', '#bfae98'];
  SHOP_NAMES.forEach(([name, sub, bg, fg], i) => {
    const x0 = (i % 8) * cw, y0 = Math.floor(i / 8) * ch;
    const { g, n, e } = G, mm = G.m;
    // color de la pared encima de la foto
    g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = walls[i % walls.length]; g.fillRect(x0, y0, cw, ch); g.restore();
    // pilares entre locales y zócalo de granito
    g.fillStyle = 'rgba(0,0,0,0.16)'; g.fillRect(x0, y0, 8, ch); g.fillRect(x0 + cw - 8, y0, 8, ch);
    tile(g, R.hormigon.img, x0, y0 + ch - 0.28 * m, cw, 0.28 * m, 128);
    g.fillStyle = 'rgba(40,38,36,0.55)'; g.fillRect(x0, y0 + ch - 0.28 * m, cw, 0.28 * m);
    mm.fillStyle = ORM(0.9, 0.35, 0); mm.fillRect(x0, y0 + ch - 0.28 * m, cw, 0.28 * m);
    n.fillStyle = N(0, -0.5); n.fillRect(x0, y0 + ch - 0.28 * m, cw, 3);
    // cartel: caja de acrílico con relieve, se prende de noche
    const sy = y0 + 0.3 * m, sh = 0.78 * m, sx = x0 + 0.3 * m, sw = cw - 0.6 * m;
    const gr = g.createLinearGradient(0, sy, 0, sy + sh);
    gr.addColorStop(0, bg); gr.addColorStop(1, shade(bg, -0.18));
    g.fillStyle = gr; g.fillRect(sx, sy, sw, sh);
    g.fillStyle = 'rgba(255,255,255,0.16)'; g.fillRect(sx, sy, sw, sh * 0.3);
    n.fillStyle = N(0, -0.7); n.fillRect(sx, sy, sw, 4);
    n.fillStyle = N(0, 0.7); n.fillRect(sx, sy + sh - 4, sw, 4);
    n.fillStyle = N(-0.7, 0); n.fillRect(sx, sy, 4, sh);
    n.fillStyle = N(0.7, 0); n.fillRect(sx + sw - 4, sy, 4, sh);
    mm.fillStyle = ORM(1, 0.25, 0); mm.fillRect(sx, sy, sw, sh);
    const text = (c, col) => {
      c.fillStyle = col; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.font = `bold ${Math.round(sh * 0.5)}px Arial, Helvetica, sans-serif`; c.fillText(name, sx + sw / 2, sy + sh * 0.39, sw - 20);
      c.font = `bold ${Math.round(sh * 0.24)}px Arial, Helvetica, sans-serif`; c.fillText(sub, sx + sw / 2, sy + sh * 0.8, sw - 20);
    };
    text(g, fg);
    e.fillStyle = shade(bg, -0.35); e.fillRect(sx, sy, sw, sh);
    text(e, fg);
    // vidrieras y puerta
    const top = y0 + 1.3 * m, bot = y0 + ch - 0.3 * m;
    const doorLeft = rng() < 0.5;
    const dw = 1.1 * m, dx = doorLeft ? x0 + 0.55 * m : x0 + cw - 0.55 * m - dw;
    // marco de aluminio
    g.fillStyle = '#a4a8ab'; g.fillRect(x0 + 0.32 * m, top - 6, cw - 0.64 * m, bot - top + 6);
    mm.fillStyle = ORM(1, 0.3, 1); mm.fillRect(x0 + 0.32 * m, top - 6, cw - 0.64 * m, bot - top + 6);
    const glass = (gx, gy, gw, gh) => {
      // interior en penumbra con góndolas y mercadería
      const ig = g.createLinearGradient(0, gy, 0, gy + gh);
      ig.addColorStop(0, '#3a3f44'); ig.addColorStop(1, '#23272b');
      g.fillStyle = ig; g.fillRect(gx, gy, gw, gh);
      for (let k = 0; k < 3; k++) {
        const yy = gy + gh * (0.35 + k * 0.22);
        g.fillStyle = 'rgba(170,165,150,0.35)'; g.fillRect(gx + 4, yy, gw - 8, 3);
        for (let q = 0; q < 7; q++) {
          g.fillStyle = `hsla(${Math.floor(rng() * 360)},35%,${35 + rng() * 25}%,0.55)`;
          const bw = 6 + rng() * 16, bh = 8 + rng() * 14;
          g.fillRect(gx + 6 + rng() * (gw - 30), yy - bh, bw, bh);
        }
      }
      mm.fillStyle = ORM(1, 0.05, 0.4); mm.fillRect(gx, gy, gw, gh);
      n.fillStyle = N(0, 0); n.fillRect(gx, gy, gw, gh);
      e.fillStyle = 'rgb(255,222,165)'; e.globalAlpha = 0.5; e.fillRect(gx, gy, gw, gh); e.globalAlpha = 1;
      // estanterías oscuras recortadas contra la luz del local
      e.fillStyle = 'rgba(0,0,0,0.6)';
      for (let k = 0; k < 3; k++) e.fillRect(gx + 4, gy + gh * (0.35 + k * 0.22) - 3, gw - 8, 5);
      e.fillRect(gx + gw * 0.3, gy + gh * 0.5, gw * 0.08, gh * 0.5);
      // perfil del marco (relieve)
      n.fillStyle = N(0.6, 0); n.fillRect(gx, gy, 3, gh);
      n.fillStyle = N(-0.6, 0); n.fillRect(gx + gw - 3, gy, 3, gh);
    };
    const wx0 = doorLeft ? dx + dw + 0.12 * m : x0 + 0.45 * m, wx1 = doorLeft ? x0 + cw - 0.45 * m : dx - 0.12 * m;
    const mid = (wx0 + wx1) / 2;
    glass(wx0, top, mid - wx0 - 4, bot - top - 0.18 * m);
    glass(mid + 4, top, wx1 - mid - 4, bot - top - 0.18 * m);
    glass(dx, top + 0.08 * m, dw, bot - top - 0.08 * m);
    g.fillStyle = '#8e9295'; g.fillRect(dx + dw * 0.5 - 2, top + 0.08 * m, 4, bot - top - 0.08 * m);
    g.fillStyle = '#d8d8d0'; g.fillRect(dx + dw * 0.5 + 8, top + (bot - top) * 0.55, 5, 16);
    mm.fillStyle = ORM(1, 0.25, 1); mm.fillRect(dx + dw * 0.5 + 8, top + (bot - top) * 0.55, 5, 16);
    // persiana metálica a medio bajar o toldo a rayas
    const r = rng();
    if (r < 0.3) {
      const ph = (bot - top) * (0.25 + rng() * 0.35);
      for (let yy = top; yy < top + ph; yy += 6) {
        tile(g, R.chapa.img, wx0, yy, wx1 - wx0, 6, 64);
        g.fillStyle = (yy / 6) % 2 < 1 ? 'rgba(150,155,160,0.55)' : 'rgba(185,190,195,0.55)'; g.fillRect(wx0, yy, wx1 - wx0, 6);
        n.fillStyle = N(0, 0.55); n.fillRect(wx0, yy, wx1 - wx0, 2);
        n.fillStyle = N(0, -0.55); n.fillRect(wx0, yy + 4, wx1 - wx0, 2);
      }
      mm.fillStyle = ORM(0.9, 0.4, 0.9); mm.fillRect(wx0, top, wx1 - wx0, ph);
      e.fillStyle = '#000'; e.fillRect(wx0, top, wx1 - wx0, ph);
    } else if (r < 0.78) {
      const stripes = 12, ay = top - 0.1 * m, ah = 0.55 * m;
      for (let q = 0; q < stripes; q++) {
        const sx2 = x0 + 0.28 * m + (q * (cw - 0.56 * m)) / stripes;
        g.fillStyle = q % 2 ? '#efece4' : bg;
        g.fillRect(sx2, ay, (cw - 0.56 * m) / stripes + 1, ah);
      }
      // ondas de la lona y sombra debajo
      for (let q = 0; q < stripes; q++) { n.fillStyle = N(q % 2 ? 0.25 : -0.25, 0); n.fillRect(x0 + 0.28 * m + (q * (cw - 0.56 * m)) / stripes, ay, (cw - 0.56 * m) / stripes, ah); }
      n.fillStyle = N(0, 0.8); n.fillRect(x0 + 0.28 * m, ay + ah - 5, cw - 0.56 * m, 5);
      mm.fillStyle = ORM(0.9, 0.85, 0); mm.fillRect(x0 + 0.28 * m, ay, cw - 0.56 * m, ah);
      g.fillStyle = 'rgba(0,0,0,0.28)'; g.fillRect(x0 + 0.28 * m, ay + ah, cw - 0.56 * m, 8);
      e.fillStyle = '#000'; e.fillRect(x0 + 0.28 * m, ay, cw - 0.56 * m, ah);
    }
  });
  return finish(G);
}

// aclara (+) u oscurece (-) un color #rrggbb
function shade(hex, k) {
  const v = parseInt(hex.slice(1), 16);
  const f = (c) => Math.max(0, Math.min(255, Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k)));
  return `rgb(${f(v >> 16)},${f((v >> 8) & 255)},${f(v & 255)})`;
}

// Texturas y mapas extra por material. T: texturas de la versión PS2 (se reemplazan)
export function realTextures(T, R) {
  const set = (key, rep, extra = {}) => {
    const src = R[key];
    const c = (t) => { const k = t.clone(); k.repeat.set(rep, rep); k.needsUpdate = true; return k; };
    return { map: c(src.map), pbr: { normalMap: c(src.normalMap), roughnessMap: c(src.arm), roughness: 1, ...extra } };
  };
  const metal = (key, rep) => { const s = set(key, rep); s.pbr.metalnessMap = s.pbr.roughnessMap; s.pbr.metalness = 1; return s; };
  const P = {};
  // fachadas compuestas
  const off = officeFacade(R);
  T.office = off.map; T.officeE = off.emissive; T.officeMask = off.mask;
  // locales de planta baja con vidrieras espejadas
  const shop = realShopFacade(R);
  T.shop = shop.map; T.shopE = shop.emissive;
  P.shop = { normalMap: shop.normalMap, roughnessMap: shop.orm, metalnessMap: shop.orm, roughness: 1, metalness: 1 };
  P.office = { normalMap: off.normalMap, roughnessMap: off.orm, metalnessMap: off.orm, roughness: 1, metalness: 1 };
  // más tipos de edificio del Centro
  for (const [k, fn] of [['office2', balconFacade], ['office3', ribbonFacade], ['office4', brickFacade]]) {
    const f = fn(R);
    T[k] = f.map; T[k + 'E'] = f.emissive; T[k + 'Mask'] = f.mask;
    P[k] = { normalMap: f.normalMap, roughnessMap: f.orm, metalnessMap: f.orm, roughness: 1, metalness: 1 };
  }
  const hou = houseFacade(R);
  T.house = hou.map; T.houseE = hou.emissive;
  P.house = { normalMap: hou.normalMap, roughnessMap: hou.orm, metalnessMap: hou.orm, roughness: 1, metalness: 1 };
  T.houseN = hou.normalMap; T.houseM = hou.orm; T.houseMask = hou.mask;
  // paredes y techos (UV del GeoBuilder: una unidad ~ 2,5 a 4 m)
  let s = metal('chapa', 1.5); T.metal = s.map; P.metal = s.pbr;
  s = set('ladrillo', 1); T.brick = s.map; P.brick = s.pbr;
  s = set('revoque', 1.5); T.plain = s.map; P.plain = s.pbr;
  s = metal('chapa', 1.5); T.roof = s.map; P.roof = s.pbr;
  s = set('hormigon', 2); T.roofFlat = s.map; P.roofFlat = s.pbr;
  s = set('hormigon', 1); T.curb = s.map; P.curb = s.pbr;
  // pisos: se texturizan por posición (worldUV), repetición 1
  s = set('vereda', 1); T.sidewalk = s.map; P.sidewalk = s.pbr;
  s = set('pasto', 1); T.grass = s.map; P.grass = s.pbr;
  s = set('cancha', 1); T.pitch = s.map; P.pitch = s.pbr;
  s = set('asfalto', 1); T.asphalt = s.map; P.asphalt = s.pbr;
  s = set('ripio', 1); T.dirt = s.map; P.dirt = s.pbr;
  T.pbr = P;
  T.real = R;
  return T;
}

// Qué materiales del piso van por posición en el mundo, y a qué escala (1/m)
export const GROUND_SCALE = { sidewalk: 1 / 2.2, grass: 1 / 3, pitch: 1 / 3, asphalt: 1 / 3.2, dirt: 1 / 3, paving: 1 / 2.2, patchA: 1 / 3.2, patchD: 1 / 3 };

// ---------------------------------------------------------------------------
// Terreno: mezcla de arena (seca y mojada), roca, tierra y estepa según pesos por vértice
// ---------------------------------------------------------------------------
export function terrainMaterial(R) {
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0, map: R.estepa.map, normalMap: R.estepa.normalMap });
  mat.onBeforeCompile = (sh) => {
    const U = sh.uniforms;
    U.tSand = { value: R.arena.map }; U.nSand = { value: R.arena.normalMap };
    U.tWet = { value: R.arenah.map }; U.nWet = { value: R.arenah.normalMap };
    U.tRock = { value: R.roca.map }; U.nRock = { value: R.roca.normalMap };
    U.tDirt = { value: R.tierra.map }; U.nDirt = { value: R.tierra.normalMap };
    U.tUrb = { value: R.hormigon.map }; U.nUrb = { value: R.hormigon.normalMap };
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec4 splat;\nattribute float urb;\nvarying vec4 vSplat;\nvarying float vUrb;\nvarying vec3 vWPos;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvSplat = splat;\nvUrb = urb;\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('void main() {', `varying vec4 vSplat; varying float vUrb; varying vec3 vWPos;
        uniform sampler2D tSand, nSand, tWet, nWet, tRock, nRock, tDirt, nDirt, tUrb, nUrb;
        #define vMapUv wuv
        #define vNormalMapUv wuv
        vec3 splatW;
        float wetK;
        void main() {
          vec2 wuv = vWPos.xz * 0.28;
          vec2 ruv = vWPos.xz * 0.11;`)
      .replace('#include <map_fragment>', `
        vec4 w = vSplat / max(0.001, vSplat.x + vSplat.y + vSplat.z + vSplat.w);
        wetK = (1.0 - smoothstep(0.25, 1.4, vWPos.y)) * w.x;
        vec3 cG = texture2D(map, wuv).rgb;
        vec3 cD = texture2D(tDirt, wuv * 0.8).rgb;
        vec3 cR = texture2D(tRock, ruv).rgb;
        vec3 cS = mix(texture2D(tSand, wuv).rgb, texture2D(tWet, wuv).rgb, wetK / max(w.x, 0.001));
        vec3 alb = cS * w.x + cR * w.y + cD * w.z + cG * w.w;
        // terrenos de la ciudad: ripio gris y tierra apisonada
        // (hormigón gastado mezclado con la tierra, en manchas)
        float urbN = smoothstep(0.35, 0.7, texture2D(tDirt, vWPos.xz * 0.031).r);
        alb = mix(alb, mix(texture2D(tUrb, wuv * 0.7).rgb * 0.92, cD * vec3(0.8, 0.8, 0.78), urbN * 0.6), vUrb);
        // variación grande (manchas de la estepa) para que no se note la repetición
        float big = texture2D(tDirt, vWPos.xz * 0.013).g;
        alb *= mix(0.82, 1.12, big);
        diffuseColor.rgb *= alb;`)
      .replace('#include <color_fragment>', `
        #ifdef USE_COLOR
          // el color por vértice (bandas de las bardas, meseta más gris) tiñe un poco:
          // tono normalizado y brillo relativo al típico de la estepa
          float lum = dot(vColor.rgb, vec3(0.3333));
          vec3 vc = vColor.rgb / max(0.02, lum) * clamp(lum / 0.26, 0.7, 1.35);
          diffuseColor.rgb *= mix(vec3(1.0), vc, 0.3);
        #endif`)
      .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = roughness * mix(1.0, 0.35, wetK);')
      .replace('#include <normal_fragment_maps>', `
        {
          vec4 w2 = vSplat / max(0.001, vSplat.x + vSplat.y + vSplat.z + vSplat.w);
          vec3 nG = texture2D(normalMap, wuv).xyz;
          vec3 nD = texture2D(nDirt, wuv * 0.8).xyz;
          vec3 nR = texture2D(nRock, ruv).xyz;
          vec3 nS = mix(texture2D(nSand, wuv).xyz, texture2D(nWet, wuv).xyz, 0.5);
          vec3 mapN0 = nS * w2.x + nR * w2.y + nD * w2.z + nG * w2.w;
          vec3 mapN = mix(mapN0, texture2D(nUrb, wuv * 0.9).xyz, vUrb) * 2.0 - 1.0;
          mapN.xy *= normalScale;
          normal = normalize( tbn * mapN );
        }`);
  };
  mat.customProgramCacheKey = () => 'terreno-real';
  return mat;
}

// ---------------------------------------------------------------------------
// Agua: material PBR (refleja el cielo según el ángulo, brillo del sol), color por
// profundidad, olas con relieve animado en dos capas y espuma en la orilla
// ---------------------------------------------------------------------------
function waveNormals(S = 256) {
  const c = cv(S, S), g = c.getContext('2d');
  const img = g.createImageData(S, S);
  const H = new Float32Array(S * S);
  // alturas tileables: ondas con frecuencias enteras + ruido suave
  const waves = [];
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let k = 0; k < 14; k++) waves.push([1 + Math.floor(rnd() * 7), Math.floor(rnd() * 7) - 3, rnd() * 6.28, 1 / (1 + k * 0.35)]);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    let h = 0;
    for (const [fx, fy, ph, a] of waves) h += Math.sin(((x * fx + y * fy) / S) * Math.PI * 2 + ph) * a;
    H[y * S + x] = h;
  }
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const hx = H[y * S + ((x + 1) % S)] - H[y * S + ((x - 1 + S) % S)];
    const hy = H[((y + 1) % S) * S + x] - H[((y - 1 + S) % S) * S + x];
    const nx = -hx * 0.9, ny = hy * 0.9, nz = 1;
    const L = Math.hypot(nx, ny, nz);
    const i = (y * S + x) * 4;
    img.data[i] = 128 + (nx / L) * 127; img.data[i + 1] = 128 + (ny / L) * 127; img.data[i + 2] = 128 + (nz / L) * 127; img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return texFrom(c, false, 4);
}

export function waterMaterial() {
  const nt = waveNormals();
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.07, metalness: 0, normalMap: nt, normalScale: new THREE.Vector2(0.55, 0.55) });
  mat.uniforms = { uTime: { value: 0 } };
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = mat.uniforms.uTime;
    sh.uniforms.uDeep = { value: new THREE.Color(0x0c2733) };
    sh.uniforms.uShallow = { value: new THREE.Color(0x2e6461) };
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float depth;\nvarying float vDepth;\nvarying vec3 vWPos;\nuniform float uTime;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vDepth = depth;
        float wv = sin(transformed.x * 0.05 + uTime * 1.3) * 0.16 + sin(transformed.z * 0.07 - uTime * 1.1) * 0.12;
        transformed.y += wv * clamp(depth * 0.4, 0.0, 1.0);
        vWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`);
    sh.fragmentShader = sh.fragmentShader
      .replace('void main() {', `varying float vDepth; varying vec3 vWPos;
        uniform float uTime; uniform vec3 uDeep, uShallow;
        #define vNormalMapUv wuv
        float foamK;
        void main() {
          vec2 wuv = vWPos.xz * 0.045;`)
      .replace('#include <map_fragment>', `
        float d = clamp(vDepth / 8.0, 0.0, 1.0);
        vec3 wc = mix(uShallow, uDeep, sqrt(d));
        float br = texture2D(normalMap, vWPos.xz * 0.09 + vec2(uTime * 0.03, -uTime * 0.02)).r;
        foamK = (1.0 - smoothstep(0.0, 1.5, vDepth)) * (0.55 + 0.45 * sin(uTime * 1.8 + vWPos.x * 0.25 + vWPos.z * 0.18));
        foamK = clamp(foamK * smoothstep(0.35, 0.65, br + foamK * 0.4), 0.0, 1.0);
        diffuseColor.rgb = mix(wc, vec3(0.86, 0.88, 0.88), foamK * 0.9);`)
      .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = mix(roughness, 0.85, foamK);')
      .replace('#include <normal_fragment_maps>', `
        {
          vec3 n1 = texture2D(normalMap, wuv + vec2(uTime * 0.018, uTime * 0.007)).xyz * 2.0 - 1.0;
          vec3 n2 = texture2D(normalMap, wuv * 0.31 - vec2(uTime * 0.006, uTime * 0.011)).xyz * 2.0 - 1.0;
          vec3 mapN = normalize(vec3(n1.xy + n2.xy, n1.z * n2.z));
          mapN.xy *= normalScale * (1.0 - foamK * 0.7);
          normal = normalize( tbn * mapN );
        }`);
  };
  mat.customProgramCacheKey = () => 'agua-real';
  return mat;
}
