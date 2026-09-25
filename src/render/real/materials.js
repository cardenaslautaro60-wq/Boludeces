import * as THREE from 'three';

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
export function tintMask(mat) {
  const prev = mat.onBeforeCompile;
  mat.onBeforeCompile = (sh, r) => {
    if (prev) prev(sh, r);
    sh.fragmentShader = sh.fragmentShader.replace('#include <color_fragment>', `
      #if ( defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) ) && defined( USE_MAP )
        diffuseColor.rgb *= mix(vec3(1.0), vColor.rgb, texture2D(map, vMapUv).a);
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
    m.fillStyle = ORM(1, 0.08, 0); m.fillRect(xx, yy, ww, hh);
    n.fillStyle = N((rng() - 0.5) * 0.04, (rng() - 0.5) * 0.04); n.fillRect(xx, yy, ww, hh);
  };
  const half = Math.floor(gw / 2);
  glass(gx, gy, half - Math.floor(f / 3), gh);
  glass(gx + half + Math.floor(f / 3), gy, gw - half - Math.floor(f / 3), gh);
  // luz de noche detrás del vidrio
  if (rng() < (opts.lit ?? 0.38)) {
    const warm = rng() < 0.78;
    e.fillStyle = warm ? `rgb(255,${190 + Math.floor(rng() * 40)},${110 + Math.floor(rng() * 50)})` : 'rgb(175,205,255)';
    e.fillRect(gx, gy, gw, gh);
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
  const W = G.c.width, H = G.c.height;
  const d = G.g.getImageData(0, 0, W, H), am = G.a.getImageData(0, 0, W, H);
  for (let i = 3; i < d.data.length; i += 4) d.data[i] = am.data[i - 3];
  G.g.putImageData(d, 0, 0);
  return { map: texFrom(G.c, true), normalMap: texFrom(G.cn, false), orm: texFrom(G.cm, false), emissive: texFrom(G.ce, true) };
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
  T.office = off.map; T.officeE = off.emissive;
  P.office = { normalMap: off.normalMap, roughnessMap: off.orm, metalnessMap: off.orm, roughness: 1, metalness: 1 };
  const hou = houseFacade(R);
  T.house = hou.map; T.houseE = hou.emissive;
  P.house = { normalMap: hou.normalMap, roughnessMap: hou.orm, metalnessMap: hou.orm, roughness: 1, metalness: 1 };
  T.houseN = hou.normalMap; T.houseM = hou.orm;
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
