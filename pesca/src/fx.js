'use strict';
// Efectos 3D: partículas (un solo draw call), ondas sobre el agua, explosiones y textos flotantes.

const FX = { max: 1400, n: 0, pts: null, geo: null, pos: null, col: null, tam: null, alf: null, vel: null, vida: null, t: null, tipo: null, extra: null, anillos: [], textos: [], escala: { value: 800 } };

function crearFX(escena) {
  const N = FX.max;
  FX.pos = new Float32Array(N * 3); FX.col = new Float32Array(N * 3); FX.tam = new Float32Array(N); FX.alf = new Float32Array(N);
  FX.vel = new Float32Array(N * 3); FX.vida = new Float32Array(N); FX.t = new Float32Array(N); FX.tipo = new Uint8Array(N); FX.extra = new Float32Array(N * 2);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(FX.pos, 3).setUsage(THREE.DynamicDrawUsage));
  g.setAttribute('pcolor', new THREE.BufferAttribute(FX.col, 3).setUsage(THREE.DynamicDrawUsage));
  g.setAttribute('size', new THREE.BufferAttribute(FX.tam, 1).setUsage(THREE.DynamicDrawUsage));
  g.setAttribute('alpha', new THREE.BufferAttribute(FX.alf, 1).setUsage(THREE.DynamicDrawUsage));
  g.setDrawRange(0, 0);
  FX.geo = g;
  const m = new THREE.ShaderMaterial({
    uniforms: { uEsc: FX.escala },
    transparent: true, depthWrite: false,
    vertexShader: 'attribute vec3 pcolor; attribute float size; attribute float alpha; uniform float uEsc; varying vec3 vC; varying float vA; void main(){ vC = pcolor; vA = alpha; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = clamp(size * uEsc / max(0.3, -mv.z), 1.0, 160.0); gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'varying vec3 vC; varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.18, d) * vA; if (a < 0.01) discard; gl_FragColor = vec4(vC, a);\n #include <tonemapping_fragment>\n #include <colorspace_fragment>\n }',
  });
  FX.pts = new THREE.Points(g, m);
  FX.pts.frustumCulled = false;
  FX.pts.renderOrder = 8;
  escena.add(FX.pts);
  // anillos de agua
  const rg = new THREE.RingGeometry(0.86, 1, 40).rotateX(-Math.PI / 2);
  for (let i = 0; i < 48; i++) {
    const mm = new THREE.Mesh(rg, new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, fog: false }));
    mm.visible = false; mm.renderOrder = 4;
    escena.add(mm);
    FX.anillos.push({ m: mm, uso: false, x: 0, z: 0, y: 0, max: 1, t: 0, vida: 1, alfa: 1, gros: 1 });
  }
  // destello de explosión
  const fl = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), new THREE.MeshBasicMaterial({ color: '#ffd9a0', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  fl.visible = false;
  escena.add(fl);
  FX.destello = { m: fl, t: 9, x: 0, y: 0, z: 0, r: 1 };
}

function particula(o) {
  if (FX.n >= FX.max) return;
  const i = FX.n++;
  const c = new THREE.Color(o.col || '#ffffff');
  FX.pos[i * 3] = o.x; FX.pos[i * 3 + 1] = o.y; FX.pos[i * 3 + 2] = o.z;
  FX.col[i * 3] = c.r; FX.col[i * 3 + 1] = c.g; FX.col[i * 3 + 2] = c.b;
  FX.vel[i * 3] = o.vx || 0; FX.vel[i * 3 + 1] = o.vy || 0; FX.vel[i * 3 + 2] = o.vz || 0;
  FX.tam[i] = o.size || 0.12; FX.alf[i] = o.alfa === undefined ? 1 : o.alfa;
  FX.vida[i] = o.vida || 1; FX.t[i] = 0;
  FX.tipo[i] = o.tipo || 0; // 0 gota, 1 burbuja, 2 chispa, 3 moneda, 4 humo
  FX.extra[i * 2] = o.crece || 0; FX.extra[i * 2 + 1] = o.g === undefined ? 12 : o.g;
}
const T_GOTA = 0, T_BURB = 1, T_CHISPA = 2, T_MONEDA = 3, T_HUMO = 4;

function ondaAgua(x, z, max = 3, vida = 1.2, alfa = 0.7, gros = 1) {
  let a = FX.anillos.find((r) => !r.uso);
  if (!a) a = FX.anillos[0];
  Object.assign(a, { uso: true, x, z, max, t: 0, vida, alfa, gros });
  a.m.visible = true;
}
function chapoteo(x, z, n = 12, fuerza = 1) {
  ondaAgua(x, z, 2.2 * fuerza + 0.4, 1.0, 0.85, 1);
  ondaAgua(x, z, 3.8 * fuerza + 0.6, 1.5, 0.5, 1);
  for (let i = 0; i < n; i++) {
    const a = rand(TAU), v = rand(1.2, 3.6) * fuerza;
    particula({ x, y: 0.1, z, vx: Math.cos(a) * v * 0.6, vy: rand(2.5, 6.5) * fuerza, vz: Math.sin(a) * v * 0.6, vida: rand(0.5, 0.95), size: rand(0.07, 0.17) * (0.7 + fuerza * 0.4), col: pick(['#ffffff', '#d9f6ff', '#aee9ff']), tipo: T_GOTA, g: 14 });
  }
}
function burbujas(x, y, z, n = 6, r = 0.8) {
  for (let i = 0; i < n; i++) particula({ x: x + rand(-r, r), y, z: z + rand(-r, r), vx: rand(-0.1, 0.1), vy: rand(0.5, 1.4), vz: rand(-0.1, 0.1), vida: rand(0.8, 1.6), size: rand(0.06, 0.16), col: '#ffffff', alfa: 0.7, tipo: T_BURB });
}
function chispas(x, y, z, col = '#ffe58a', n = 10, v = 4) {
  for (let i = 0; i < n; i++) {
    const a = rand(TAU), s = rand(v * 0.3, v);
    particula({ x, y, z, vx: Math.cos(a) * s, vy: rand(1.5, v), vz: Math.sin(a) * s, vida: rand(0.35, 0.85), size: rand(0.05, 0.13), col, tipo: T_CHISPA, g: 9 });
  }
}
function lluviaMonedas(x, y, z, n = 10) {
  for (let i = 0; i < n; i++) particula({ x: x + rand(-0.4, 0.4), y, z: z + rand(-0.4, 0.4), vx: rand(-2, 2), vy: rand(3.5, 8), vz: rand(-2, 2), vida: rand(0.9, 1.5), size: rand(0.13, 0.2), col: '#ffd23c', tipo: T_MONEDA, g: 16 });
}
function humo(x, y, z, col = '#cccccc') {
  particula({ x, y, z, vx: rand(-0.15, 0.3), vy: rand(0.6, 1.1), vz: rand(-0.15, 0.15), vida: rand(1.6, 2.6), size: rand(0.25, 0.5), col, alfa: 0.45, tipo: T_HUMO, crece: 0.55, g: 0 });
}
function polvo(x, y, z) {
  particula({ x: x + rand(-0.15, 0.15), y: y + 0.08, z: z + rand(-0.15, 0.15), vx: rand(-0.4, 0.4), vy: rand(0.2, 0.6), vz: rand(-0.4, 0.4), vida: rand(0.3, 0.55), size: rand(0.16, 0.3), col: '#e8d9a8', alfa: 0.5, tipo: T_HUMO, crece: 0.5, g: 0 });
}
function explosionFx(x, y, z, r = 7) {
  const sobreAgua = H(x, z) < 0;
  ondaAgua(x, z, r * 1.4, 0.9, 0.9, 1);
  ondaAgua(x, z, r * 2.2, 1.5, 0.55, 1);
  for (let i = 0; i < 40; i++) {
    const a = rand(TAU), s = rand(2, 9) * r / 7;
    particula({ x, y: y + 0.2, z, vx: Math.cos(a) * s * 0.6, vy: rand(8, 22) * r / 7, vz: Math.sin(a) * s * 0.6, vida: rand(0.7, 1.4), size: rand(0.18, 0.4), col: sobreAgua ? pick(['#ffffff', '#cfefff', '#ffd9a0']) : pick(['#e8d9a8', '#cdb98a']), tipo: T_GOTA, g: 16 });
  }
  for (let i = 0; i < 18; i++) {
    const a = rand(TAU), s = rand(1, 5);
    particula({ x, y: y + 0.5, z, vx: Math.cos(a) * s, vy: rand(1, 4), vz: Math.sin(a) * s, vida: rand(0.8, 1.6), size: rand(0.8, 1.6), col: pick(['#ff9a3c', '#ff6a2a', '#555555']), alfa: 0.8, tipo: T_HUMO, crece: 2.2, g: 0 });
  }
  const d = FX.destello;
  d.t = 0; d.x = x; d.y = y + 0.5; d.z = z; d.r = r; d.m.visible = true;
  sacudir(14);
}
function textoFlotante(x, y, z, txt, col = '#ffffff', size = 18, vida = 1.2) {
  if (FX.textos.length > 26) { const o = FX.textos.shift(); o.el.remove(); }
  const el = h('div', 'flot', esc(txt), $('#flotantes'));
  el.style.color = col; el.style.fontSize = size + 'px';
  FX.textos.push({ el, x, y, z, t: 0, vida });
}
function sacudir(n) { CAM.shake = Math.max(CAM.shake, n); }

const _p = new THREE.Vector3();
function actualizarFX(dt) {
  // partículas
  const N = FX.n;
  let w = 0;
  for (let i = 0; i < N; i++) {
    FX.t[i] += dt;
    const k = FX.t[i] / FX.vida[i];
    if (k >= 1) continue;
    const tipo = FX.tipo[i];
    FX.vel[i * 3 + 1] -= FX.extra[i * 2 + 1] * dt;
    if (tipo === T_HUMO || tipo === T_BURB) { FX.vel[i * 3] *= 1 - dt; FX.vel[i * 3 + 2] *= 1 - dt; }
    let y = FX.pos[i * 3 + 1] + FX.vel[i * 3 + 1] * dt;
    const x = FX.pos[i * 3] + FX.vel[i * 3] * dt, z = FX.pos[i * 3 + 2] + FX.vel[i * 3 + 2] * dt;
    if ((tipo === T_GOTA || tipo === T_CHISPA || tipo === T_MONEDA) && y < 0.02 && FX.vel[i * 3 + 1] < 0) { FX.vida[i] = Math.min(FX.vida[i], FX.t[i] + 0.06); y = 0.02; FX.vel[i * 3 + 1] = 0; }
    // compactar
    const j = w++;
    if (j !== i) {
      FX.pos.copyWithin(j * 3, i * 3, i * 3 + 3); FX.col.copyWithin(j * 3, i * 3, i * 3 + 3); FX.vel.copyWithin(j * 3, i * 3, i * 3 + 3);
      FX.tam[j] = FX.tam[i]; FX.alf[j] = FX.alf[i]; FX.vida[j] = FX.vida[i]; FX.t[j] = FX.t[i]; FX.tipo[j] = FX.tipo[i]; FX.extra[j * 2] = FX.extra[i * 2]; FX.extra[j * 2 + 1] = FX.extra[i * 2 + 1];
    }
    FX.pos[j * 3] = x; FX.pos[j * 3 + 1] = y; FX.pos[j * 3 + 2] = z;
    FX.tam[j] += FX.extra[j * 2] * dt;
    const base = tipo === T_HUMO ? 0.5 : tipo === T_BURB ? 0.7 : 1;
    FX.alf[j] = Math.min(1, (1 - k) * 1.8) * base;
  }
  FX.n = w;
  FX.geo.setDrawRange(0, w);
  for (const a of ['position', 'pcolor', 'size', 'alpha']) FX.geo.attributes[a].needsUpdate = true;
  // anillos
  for (const a of FX.anillos) {
    if (!a.uso) continue;
    a.t += dt;
    const k = a.t / a.vida;
    if (k >= 1) { a.uso = false; a.m.visible = false; continue; }
    const s = a.max * Math.sqrt(k) + 0.15;
    a.m.scale.set(s, 1, s);
    a.m.position.set(a.x, alturaOla(a.x, a.z, J.t) + 0.07, a.z);
    a.m.material.opacity = a.alfa * (1 - k);
  }
  // destello
  const d = FX.destello;
  if (d.m.visible) {
    d.t += dt;
    const k = d.t / 0.35;
    if (k >= 1) d.m.visible = false;
    else { d.m.position.set(d.x, d.y, d.z); d.m.scale.setScalar(d.r * (0.4 + k * 1.1)); d.m.material.opacity = 0.9 * (1 - k); }
  }
  // textos flotantes (se proyectan a pantalla)
  for (let i = FX.textos.length - 1; i >= 0; i--) {
    const o = FX.textos[i];
    o.t += dt;
    const k = o.t / o.vida;
    if (k >= 1) { o.el.remove(); FX.textos.splice(i, 1); continue; }
    _p.set(o.x, o.y + o.t * 1.4 * (1 - k * 0.4), o.z).project(ESC.camara);
    if (_p.z > 1 || _p.z < -1) { o.el.style.display = 'none'; continue; }
    o.el.style.display = '';
    const sc = k < 0.12 ? 0.6 + (k / 0.12) * 0.6 : 1.2 - Math.min(0.2, (k - 0.12) * 0.4);
    o.el.style.transform = `translate(-50%,-50%) translate(${((_p.x + 1) / 2) * J.w}px, ${((1 - _p.y) / 2) * J.h}px) scale(${sc.toFixed(3)})`;
    o.el.style.opacity = k > 0.7 ? 1 - (k - 0.7) / 0.3 : 1;
  }
  CAM.shake *= Math.pow(0.002, dt);
}
function escalaFX() { FX.escala.value = (J.h * J.dpr * 0.5) / Math.tan((CAM.fov * Math.PI) / 360); }

// Tubo fino (línea de pescar, cuerda del arpón) entre dos puntos con una curva que cuelga
function crearTubo(escena, color = '#ffffff', N = 28, seg = 3) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(N * seg * 3);
  const idx = [];
  for (let i = 0; i < N - 1; i++) for (let j = 0; j < seg; j++) {
    const a = i * seg + j, b = i * seg + (j + 1) % seg, c = (i + 1) * seg + j, d = (i + 1) * seg + (j + 1) % seg;
    idx.push(a, c, b, b, c, d);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
  geo.setIndex(idx);
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, fog: false }));
  m.frustumCulled = false; m.visible = false;
  escena.add(m);
  const A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3();
  return {
    m,
    quitar() { escena.remove(m); geo.dispose(); m.material.dispose(); },
    poner(a, b, sag, grosor, col, pegarAlAgua = true) {
      m.visible = true;
      if (col) m.material.color.set(col);
      A.set(a.x, a.y, a.z); B.set(b.x, b.y, b.z);
      C.copy(A).add(B).multiplyScalar(0.5); C.y -= sag * 2;
      const p = geo.attributes.position.array;
      for (let i = 0; i < N; i++) {
        const t = i / (N - 1), u = 1 - t;
        const x = u * u * A.x + 2 * u * t * C.x + t * t * B.x, z = u * u * A.z + 2 * u * t * C.z + t * t * B.z;
        let y = u * u * A.y + 2 * u * t * C.y + t * t * B.y;
        if (pegarAlAgua) y = Math.max(y, alturaOla(x, z, J.t) + 0.01);
        for (let j = 0; j < seg; j++) {
          const an = (j / seg) * TAU;
          p[(i * seg + j) * 3] = x + Math.cos(an) * grosor; p[(i * seg + j) * 3 + 1] = y + Math.sin(an) * grosor; p[(i * seg + j) * 3 + 2] = z + Math.cos(an + 1) * grosor * 0.5;
        }
      }
      geo.attributes.position.needsUpdate = true;
      geo.computeBoundingSphere();
    },
  };
}
