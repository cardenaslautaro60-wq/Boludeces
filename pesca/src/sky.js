'use strict';
// Cielo y luces: sol, luna, estrellas, niebla y lluvia. Todo sigue la hora del juego (J.hora).

const CIELO = { sky: null, sol: null, luna: null, hemi: null, estrellas: null, lunaMalla: null, solMalla: null, lluvia: null, niebla: null };
const COL = {
  dia: { h: new THREE.Color('#bfe0f0'), c: new THREE.Color('#3f8fd0') },
  ocaso: { h: new THREE.Color('#ffa86a'), c: new THREE.Color('#5d6aa8') },
  noche: { h: new THREE.Color('#0d1b3c'), c: new THREE.Color('#040a1c') },
};
const _c1 = new THREE.Color(), _c2 = new THREE.Color();

function crearCielo(escena, renderer) {
  const sky = new THREE.Sky();
  sky.scale.setScalar(5000);
  const u = sky.material.uniforms;
  u.turbidity.value = 4; u.rayleigh.value = 2.6; u.mieCoefficient.value = 0.004; u.mieDirectionalG.value = 0.8;
  escena.add(sky);
  CIELO.sky = sky;
  // luces
  const sol = new THREE.DirectionalLight(0xfff0d0, 2.6);
  sol.castShadow = true;
  sol.shadow.mapSize.set(2048, 2048);
  const sc = sol.shadow.camera;
  sc.left = -48; sc.right = 48; sc.top = 48; sc.bottom = -48; sc.near = 1; sc.far = 320;
  sol.shadow.bias = -0.0005; sol.shadow.normalBias = 0.06;
  escena.add(sol); escena.add(sol.target);
  CIELO.sol = sol;
  const luna = new THREE.DirectionalLight(0x7f9bff, 0.0);
  escena.add(luna);
  CIELO.luna = luna;
  CIELO.hemi = new THREE.HemisphereLight(0xcfe8ff, 0x8a7a55, 0.9);
  escena.add(CIELO.hemi);
  // estrellas
  const n = 1800, pos = new Float32Array(n * 3), tam = new Float32Array(n);
  const rnd = mulberry32(9);
  for (let i = 0; i < n; i++) {
    const a = rnd() * TAU, e = Math.acos(rnd() * 0.96 + 0.04) ;
    const r = 3800;
    pos[i * 3] = Math.sin(e) * Math.cos(a) * r; pos[i * 3 + 1] = Math.cos(e) * r; pos[i * 3 + 2] = Math.sin(e) * Math.sin(a) * r;
    tam[i] = 0.6 + rnd() * rnd() * 2.2;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('tam', new THREE.BufferAttribute(tam, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: { uOp: { value: 0 }, uPx: { value: 1 } }, transparent: true, depthWrite: false, fog: false,
    vertexShader: 'attribute float tam; uniform float uPx; varying float vT; void main(){ vT = tam; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = tam * uPx; gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'uniform float uOp; varying float vT; void main(){ vec2 d = gl_PointCoord - 0.5; float a = smoothstep(0.5, 0.0, length(d)); gl_FragColor = vec4(vec3(0.85,0.9,1.0) * (0.7 + 0.3 * vT / 3.0), a * uOp); }',
  });
  CIELO.estrellas = new THREE.Points(g, mat);
  CIELO.estrellas.frustumCulled = false;
  CIELO.estrellas.renderOrder = -1;
  escena.add(CIELO.estrellas);
  // luna
  const lm = new THREE.Mesh(new THREE.SphereGeometry(110, 24, 16), new THREE.MeshBasicMaterial({ color: '#f3f1e2', fog: false }));
  CIELO.lunaMalla = lm;
  escena.add(lm);
  const halo = new THREE.Mesh(new THREE.SphereGeometry(190, 24, 16), new THREE.MeshBasicMaterial({ color: '#9fb4ff', transparent: true, opacity: 0.13, fog: false, depthWrite: false }));
  lm.add(halo);
  escena.fog = new THREE.FogExp2(0xbfe0f0, 0.0016);
  CIELO.niebla = escena.fog;
  crearLluvia(escena);
}

function crearLluvia(escena) {
  const n = 900;
  const pos = new Float32Array(n * 6);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0xcfe2f4, transparent: true, opacity: 0.0, depthWrite: false, fog: false }));
  m.frustumCulled = false;
  m.renderOrder = 6;
  const base = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { base[i * 3] = Math.random() * 60 - 30; base[i * 3 + 1] = Math.random() * 30; base[i * 3 + 2] = Math.random() * 60 - 30; }
  CIELO.lluvia = { malla: m, base, n };
  escena.add(m);
}

const SOL_DIR = new THREE.Vector3(), LUNA_DIR = new THREE.Vector3();
// Actualiza el cielo según la hora. camera: para centrar el cielo y la lluvia
function actualizarCielo(dt, camera) {
  const hora = J.hora;
  const a = ((hora - 6) / 12) * Math.PI; // 0 a las 6, PI a las 18
  const elev = Math.sin(a);
  SOL_DIR.set(Math.cos(a) * 0.85, Math.sin(a) * 0.95 + 0.04, 0.38).normalize();
  LUNA_DIR.copy(SOL_DIR).multiplyScalar(-1);
  const k = smooth(-0.12, 0.12, elev); // 0 de noche, 1 de día
  J.luz = k; J.noche = 1 - k;
  // sol y cielo
  CIELO.sky.position.copy(camera.position);
  CIELO.sky.material.uniforms.sunPosition.value.copy(SOL_DIR);
  const lluv = J.clima.lluvia;
  CIELO.sky.material.uniforms.turbidity.value = 4 + lluv * 9;
  CIELO.sky.material.uniforms.rayleigh.value = lerp(0.35, 2.6, k) * (1 - lluv * 0.4);
  const cr = Math.max(0, smooth(0.28, 0.0, elev) * smooth(-0.14, 0.02, elev)); // 0..1 en el ocaso
  // colores de horizonte y cenit
  _c1.copy(COL.noche.h).lerp(COL.dia.h, k); _c1.lerp(COL.ocaso.h, cr * 0.85);
  _c2.copy(COL.noche.c).lerp(COL.dia.c, k); _c2.lerp(COL.ocaso.c, cr * 0.7);
  if (lluv > 0) { _c1.lerp(new THREE.Color('#8d9aa6'), lluv * 0.7 * k); _c2.lerp(new THREE.Color('#5d6a78'), lluv * 0.7 * k); }
  CIELO.niebla.color.copy(_c1);
  CIELO.niebla.density = (0.0016 + J.noche * 0.0007 + lluv * 0.0016);
  // luces
  const ps = P.pos ? P.pos : { x: 0, y: 0, z: 0 };
  const sx = Math.round(ps.x / 2) * 2, sz = Math.round(ps.z / 2) * 2;
  CIELO.sol.position.set(sx + SOL_DIR.x * 120, Math.max(8, SOL_DIR.y * 120), sz + SOL_DIR.z * 120);
  CIELO.sol.target.position.set(sx, 0, sz);
  CIELO.sol.color.setRGB(1, lerp(0.7, 0.96, smooth(0, 0.5, elev)), lerp(0.45, 0.85, smooth(0, 0.5, elev)));
  CIELO.sol.intensity = 2.7 * smooth(-0.02, 0.2, elev) * (1 - lluv * 0.65);
  CIELO.sol.castShadow = elev > 0.04 && J.sombras;
  CIELO.luna.position.copy(LUNA_DIR).multiplyScalar(100);
  CIELO.luna.intensity = 0.55 * smooth(0.05, -0.2, elev);
  CIELO.hemi.intensity = lerp(0.18, 0.95, k) * (1 - lluv * 0.3);
  CIELO.hemi.color.copy(_c2).lerp(new THREE.Color('#ffffff'), 0.35);
  CIELO.hemi.groundColor.set('#8f7f58').lerp(new THREE.Color('#10182a'), J.noche * 0.8);
  // luna y estrellas
  CIELO.lunaMalla.position.copy(camera.position).addScaledVector(LUNA_DIR, 3300);
  CIELO.lunaMalla.visible = J.noche > 0.05;
  CIELO.estrellas.position.copy(camera.position);
  CIELO.estrellas.material.uniforms.uOp.value = smooth(0.4, 1, J.noche) * (1 - lluv);
  CIELO.estrellas.material.uniforms.uPx.value = J.dpr * 1.6;
  // uniformes del mar
  const u = MAR.uni;
  if (u) {
    u.uSolDir.value.copy(SOL_DIR.y > 0 ? SOL_DIR : LUNA_DIR);
    u.uSolCol.value.copy(CIELO.sol.color).multiplyScalar(k > 0.05 ? 1 : 0.35);
    u.uHorizonte.value.copy(_c1);
    u.uCenit.value.copy(_c2);
    u.uNiebla.value.copy(_c1);
    u.uDensidad.value = CIELO.niebla.density;
    u.uNoche.value = J.noche;
    u.uLluvia.value = lluv;
  }
  TERR.uSol.value = k;
  // lluvia
  const L = CIELO.lluvia;
  L.malla.material.opacity = lluv * 0.42;
  L.malla.visible = lluv > 0.02;
  if (L.malla.visible) {
    const pos = L.malla.geometry.attributes.position.array;
    const cx = camera.position.x, cy = camera.position.y, cz = camera.position.z;
    for (let i = 0; i < L.n; i++) {
      let y = L.base[i * 3 + 1] - dt * 24;
      if (y < 0) { y += 30; L.base[i * 3] = Math.random() * 60 - 30; L.base[i * 3 + 2] = Math.random() * 60 - 30; }
      L.base[i * 3 + 1] = y;
      const x = cx + L.base[i * 3], z = cz + L.base[i * 3 + 2], yy = cy - 14 + y;
      pos[i * 6] = x; pos[i * 6 + 1] = yy; pos[i * 6 + 2] = z;
      pos[i * 6 + 3] = x + 0.12; pos[i * 6 + 4] = yy + 0.9; pos[i * 6 + 5] = z + 0.06;
    }
    L.malla.geometry.attributes.position.needsUpdate = true;
  }
}
