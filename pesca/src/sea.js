'use strict';
// El mar: plano con olas en el vertex shader, color por profundidad (textura generada del relieve), espuma en la costa,
// reflejo del cielo y brillo del sol. alturaOla() repite las mismas olas en JS para que los botes floten bien.

const MAR = { malla: null, mat: null, uni: null, tex: null };
const OLAS = [
  // dirección x, z, longitud de onda, amplitud, velocidad
  { dx: 0.8, dz: 0.6, L: 38, A: 0.26, v: 1.0 },
  { dx: -0.5, dz: 0.85, L: 21, A: 0.13, v: 1.2 },
  { dx: 0.25, dz: -0.97, L: 11, A: 0.06, v: 1.5 },
];
for (const o of OLAS) { const m = Math.hypot(o.dx, o.dz); o.dx /= m; o.dz /= m; o.k = TAU / o.L; o.w = Math.sqrt(9.81 * o.k) * o.v; }

// Altura de la ola en (x,z) a tiempo t. e = estado del mar (1 = calmo)
function alturaOla(x, z, t, e = J.clima.ola) {
  let h = 0;
  for (const o of OLAS) h += o.A * e * Math.sin((o.dx * x + o.dz * z) * o.k - o.w * t);
  return h;
}
function pendienteOla(x, z, t, e = J.clima.ola) {
  let gx = 0, gz = 0;
  for (const o of OLAS) { const c = o.A * e * o.k * Math.cos((o.dx * x + o.dz * z) * o.k - o.w * t); gx += c * o.dx; gz += c * o.dz; }
  return { gx, gz };
}

function crearTexturaProfundidad() {
  const N = 1024, ext = 1400;
  const data = new Uint8Array(N * N * 4);
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const x = (i / (N - 1) - 0.5) * ext, z = (j / (N - 1) - 0.5) * ext;
      const h = H(x, z);
      const k = (j * N + i) * 4;
      data[k] = clamp(Math.round((-h / 40) * 255), 0, 255); // profundidad (0..40 m); en tierra, 0
      data[k + 1] = clamp(Math.round((h / 20 + 0.5) * 255), 0, 255); // altura de la tierra
      data[k + 2] = 0; data[k + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, N, N, THREE.RGBAFormat);
  tex.minFilter = tex.magFilter = THREE.LinearFilter;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return { tex, ext };
}

const MAR_VS = /* glsl */ `
uniform float uTime; uniform float uOla;
varying vec3 vW;
const int NW = 3;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  float h = 0.0;
  vec3 d0 = vec3(0.8, 0.6, 0.0);
  // tres olas (iguales a las de JS)
  vec2 D0 = normalize(vec2(0.8, 0.6)); vec2 D1 = normalize(vec2(-0.5, 0.85)); vec2 D2 = normalize(vec2(0.25, -0.97));
  float k0 = 6.2831853 / 38.0, k1 = 6.2831853 / 21.0, k2 = 6.2831853 / 11.0;
  h += 0.26 * uOla * sin(dot(D0, w.xz) * k0 - sqrt(9.81 * k0) * 1.0 * uTime);
  h += 0.13 * uOla * sin(dot(D1, w.xz) * k1 - sqrt(9.81 * k1) * 1.2 * uTime);
  h += 0.06 * uOla * sin(dot(D2, w.xz) * k2 - sqrt(9.81 * k2) * 1.5 * uTime);
  w.y += h;
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;
const MAR_FS = /* glsl */ `
uniform float uTime; uniform float uOla;
uniform sampler2D uProf; uniform float uExt;
uniform vec3 uSolDir; uniform vec3 uSolCol; uniform vec3 uHorizonte; uniform vec3 uCenit; uniform vec3 uNiebla; uniform float uDensidad;
uniform float uNoche; uniform float uLluvia;
uniform sampler2D uFish; uniform vec2 uFishC; uniform float uFishW;
varying vec3 vW;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
vec3 normalOla(vec2 p, float t) {
  vec2 D0 = normalize(vec2(0.8, 0.6)); vec2 D1 = normalize(vec2(-0.5, 0.85)); vec2 D2 = normalize(vec2(0.25, -0.97));
  float k0 = 6.2831853 / 38.0, k1 = 6.2831853 / 21.0, k2 = 6.2831853 / 11.0;
  vec2 g = vec2(0.0);
  g += 0.26 * uOla * k0 * cos(dot(D0, p) * k0 - sqrt(9.81 * k0) * 1.0 * t) * D0;
  g += 0.13 * uOla * k1 * cos(dot(D1, p) * k1 - sqrt(9.81 * k1) * 1.2 * t) * D1;
  g += 0.06 * uOla * k2 * cos(dot(D2, p) * k2 - sqrt(9.81 * k2) * 1.5 * t) * D2;
  // ondas chicas
  vec2 q = p * 0.9;
  float a = vnoise(q + vec2(t * 0.6, t * 0.35)), b = vnoise(q * 1.9 - vec2(t * 0.5, -t * 0.4));
  g += (vec2(a, b) - 0.5) * 0.22 * (0.6 + uOla * 0.5);
  return normalize(vec3(-g.x, 1.0, -g.y));
}
void main() {
  vec2 uv = vW.xz / uExt + 0.5;
  vec4 tx = texture2D(uProf, uv);
  float dpt = tx.r * 40.0;
  float tierra = (tx.g - 0.5) * 20.0;
  vec3 N = normalOla(vW.xz, uTime);
  vec3 V = normalize(cameraPosition - vW);
  float fres = pow(1.0 - max(dot(N, V), 0.0), 4.0);
  vec3 prof = vec3(0.015, 0.16, 0.33), somero = vec3(0.10, 0.72, 0.76);
  vec3 col = mix(somero, prof, smoothstep(0.4, 13.0, dpt));
  col *= mix(1.0, 0.22, uNoche);
  vec3 R = reflect(-V, N);
  vec3 cielo = mix(uHorizonte, uCenit, pow(clamp(R.y, 0.0, 1.0), 0.55));
  col = mix(col, cielo, clamp(fres * 0.85 + 0.06, 0.0, 1.0));
  // sombras de los peces: textura vista desde arriba que oscurece el agua
  vec2 fuv = vec2((vW.x - uFishC.x) / uFishW + 0.5, 0.5 - (vW.z - uFishC.y) / uFishW);
  float sh = 0.0;
  if (fuv.x > 0.0 && fuv.x < 1.0 && fuv.y > 0.0 && fuv.y < 1.0) {
    float e = 0.5 / uFishW;
    sh = texture2D(uFish, fuv).r * 0.4 + (texture2D(uFish, fuv + vec2(e, 0.0)).r + texture2D(uFish, fuv - vec2(e, 0.0)).r + texture2D(uFish, fuv + vec2(0.0, e)).r + texture2D(uFish, fuv - vec2(0.0, e)).r) * 0.15;
    sh *= smoothstep(0.0, 0.06, min(min(fuv.x, 1.0 - fuv.x), min(fuv.y, 1.0 - fuv.y)));
  }
  col = mix(col, vec3(0.008, 0.04, 0.085) * mix(1.0, 0.4, uNoche), sh * 0.82 * (1.0 - fres * 0.4));
  float dist0 = length(vW - cameraPosition);
  col = mix(col, uHorizonte, smoothstep(250.0, 1600.0, dist0) * 0.55);
  float spec = pow(max(dot(R, uSolDir), 0.0), 260.0);
  col += uSolCol * spec * 2.2 * (1.0 - uNoche * 0.2);
  // espuma: franja en la costa que va y viene con las olas + cresta en mar picado
  float ruido = vnoise(vW.xz * 0.8 + uTime * 0.25) * 0.6 + vnoise(vW.xz * 2.4 - uTime * 0.4) * 0.4;
  float oleaje = 0.5 + 0.5 * sin(uTime * 1.1 - dpt * 2.2);
  float costa = smoothstep(0.30 + 0.22 * oleaje, 0.0, dpt + (ruido - 0.5) * 0.45) * step(-0.05, dpt);
  float estela = smoothstep(1.05, 0.3, dpt) * smoothstep(0.6, 0.85, ruido) * 0.4;
  float cresta = smoothstep(0.34, 0.5, uOla * 0.3 * (0.5 + 0.5 * sin(dot(vW.xz, vec2(0.8, 0.6)) * 0.165 - uTime * 1.0)) + (ruido - 0.5) * 0.2) * smoothstep(1.0, 1.8, uOla) * 0.8;
  float espuma = clamp(costa + estela + cresta, 0.0, 1.0);
  col = mix(col, vec3(0.97, 0.99, 1.0) * mix(1.0, 0.35, uNoche), espuma);
  float alfa = mix(0.3, 0.6, smoothstep(0.0, 12.0, dpt));
  alfa = mix(alfa, 0.9, fres * 0.55);
  alfa = max(alfa, espuma);
  alfa = max(alfa, sh * 0.85);
  // niebla
  float d = length(vW - cameraPosition);
  float f = 1.0 - exp(-uDensidad * uDensidad * d * d);
  col = mix(col, uNiebla, f);
  gl_FragColor = vec4(col, alfa);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

// ---- Sombras de los peces: se dibujan desde arriba en una textura y el agua las oscurece ----
const SOMBRAS = { rt: null, cam: null, W: 160, N: 512 };
const _clr = new THREE.Color();
function crearSombrasRT() {
  const S = SOMBRAS;
  S.rt = new THREE.WebGLRenderTarget(S.N, S.N, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false });
  S.cam = new THREE.OrthographicCamera(-S.W / 2, S.W / 2, S.W / 2, -S.W / 2, 0.1, 90);
  S.cam.up.set(0, 0, -1);
  S.cam.layers.set(1);
  MAR.uni.uFish.value = S.rt.texture;
}
function renderSombras() {
  const S = SOMBRAS, r = ESC.renderer;
  if (!S.rt) return;
  const t = S.W / S.N;
  const cx = Math.round(P.pos.x / t) * t, cz = Math.round(P.pos.z / t) * t;
  S.cam.position.set(cx, 40, cz);
  S.cam.lookAt(cx, 0, cz);
  MAR.uni.uFishC.value.set(cx, cz);
  const rt0 = r.getRenderTarget(), auto0 = r.shadowMap.autoUpdate, a0 = r.getClearAlpha();
  r.getClearColor(_clr);
  const hex0 = _clr.getHex();
  r.shadowMap.autoUpdate = false;
  r.setRenderTarget(S.rt);
  r.setClearColor(0x000000, 0);
  r.clear();
  r.render(ESC.escena, S.cam);
  r.setRenderTarget(rt0);
  r.shadowMap.autoUpdate = auto0;
  r.setClearColor(hex0, a0);
}

function crearMar(escena) {
  const { tex, ext } = crearTexturaProfundidad();
  MAR.tex = tex;
  MAR.uni = {
    uTime: { value: 0 }, uOla: { value: 1 }, uProf: { value: tex }, uExt: { value: ext },
    uSolDir: { value: new THREE.Vector3(0, 1, 0) }, uSolCol: { value: new THREE.Color('#fff4d8') },
    uHorizonte: { value: new THREE.Color('#bfe0f0') }, uCenit: { value: new THREE.Color('#4f9fd8') }, uNiebla: { value: new THREE.Color('#bfe0f0') },
    uDensidad: { value: 0.0016 }, uNoche: { value: 0 }, uLluvia: { value: 0 },
    uFish: { value: null }, uFishC: { value: new THREE.Vector2() }, uFishW: { value: SOMBRAS.W },
  };
  crearSombrasRT();
  const geo = new THREE.PlaneGeometry(1500, 1500, 300, 300).rotateX(-Math.PI / 2);
  MAR.mat = new THREE.ShaderMaterial({ uniforms: MAR.uni, vertexShader: MAR_VS, fragmentShader: MAR_FS, transparent: true, depthWrite: false, side: THREE.FrontSide });
  MAR.malla = new THREE.Mesh(geo, MAR.mat);
  MAR.malla.renderOrder = 2;
  MAR.malla.frustumCulled = false;
  escena.add(MAR.malla);
}
function actualizarMar(dt) {
  if (!MAR.uni) return;
  MAR.uni.uTime.value = J.t;
  MAR.uni.uOla.value = J.clima.ola;
  TERR.uTime.value = J.t;
}
