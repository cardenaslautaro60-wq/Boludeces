'use strict';
// Modelos 3D procedurales (low-poly, colores por vértice): palmeras, rocas, arbustos y props de la isla.

const MAT = {};
const _m4 = new THREE.Matrix4(), _qq = new THREE.Quaternion(), _ee = new THREE.Euler(), _vv = new THREE.Vector3(), _ss = new THREE.Vector3(), _aa = new THREE.Vector3(), _bb = new THREE.Vector3();
const UNI = { uT: { value: 0 }, uNoche: { value: 0 }, uViento: { value: 0.3 } };

function crearMateriales() {
  MAT.vc = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.9, metalness: 0 });
  MAT.vcDoble = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.85, metalness: 0, side: THREE.DoubleSide });
  MAT.metal = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.35, metalness: 0.5 });
  MAT.ventana = new THREE.MeshStandardMaterial({ color: '#a8dcf2', emissive: new THREE.Color('#ffd27a'), emissiveIntensity: 0, roughness: 0.15, metalness: 0.2 });
  MAT.lampara = new THREE.MeshStandardMaterial({ color: '#e8e0c0', emissive: new THREE.Color('#ffe2a0'), emissiveIntensity: 0.0, roughness: 0.4 });
  MAT.roca = new THREE.MeshStandardMaterial({ color: '#ffffff', flatShading: true, roughness: 0.95, metalness: 0 });
  MAT.palma = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.85, side: THREE.DoubleSide });
  MAT.palma.onBeforeCompile = (sh) => {
    sh.uniforms.uTP = UNI.uT; sh.uniforms.uVP = UNI.uViento;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uTP; uniform float uVP;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
      {
        float hh = max(position.y, 0.0);
        float fase = uTP * 1.15 + instanceMatrix[3][0] * 0.31 + instanceMatrix[3][2] * 0.17;
        float amp = (0.25 + uVP * 0.9) * 0.0042 * hh * hh;
        transformed.x += sin(fase) * amp;
        transformed.z += cos(fase * 0.8) * amp * 0.5;
        transformed.y += sin(fase * 3.0 + position.x * 2.0) * 0.06 * smoothstep(6.5, 9.0, hh) * (0.5 + uVP);
      }`);
  };
  MAT.fuego = new THREE.MeshBasicMaterial({ color: '#ff9a2a', transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
}

// ---- Ayudas de geometría ------------------------------------------------------
function colorear(geo, color) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  if (g.attributes.uv) g.deleteAttribute('uv');
  const c = new THREE.Color(color), n = g.attributes.position.count, a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
  g.setAttribute('color', new THREE.BufferAttribute(a, 3));
  if (!g.attributes.normal) g.computeVertexNormals();
  return g;
}
function mover(geo, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx) {
  _ee.set(rx, ry, rz); _qq.setFromEuler(_ee);
  _m4.compose(_vv.set(x, y, z), _qq, _ss.set(sx, sy, sz));
  geo.applyMatrix4(_m4);
  return geo;
}
const caja = (w, h, d, col, x = 0, y = 0, z = 0, ry = 0, rz = 0, rx = 0) => mover(colorear(new THREE.BoxGeometry(w, h, d), col), x, y, z, rx, ry, rz);
const cil = (rt, rb, h, col, x = 0, y = 0, z = 0, seg = 8, rx = 0, ry = 0, rz = 0) => mover(colorear(new THREE.CylinderGeometry(rt, rb, h, seg, 1), col), x, y, z, rx, ry, rz);
const esf = (r, col, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1, det = 1) => mover(colorear(new THREE.IcosahedronGeometry(r, det), col), x, y, z, 0, 0, 0, sx, sy, sz);
const cono = (r, h, col, x = 0, y = 0, z = 0, seg = 8, rx = 0, ry = 0, rz = 0) => mover(colorear(new THREE.ConeGeometry(r, h, seg, 1), col), x, y, z, rx, ry, rz);
const unir = (lista) => THREE.mergeGeometries(lista.filter(Boolean), false);
// Cilindro entre dos puntos
function cilEntre(a, b, ra, rb, col, seg = 7) {
  _aa.set(a.x, a.y, a.z); _bb.set(b.x, b.y, b.z);
  const dir = _bb.clone().sub(_aa), len = dir.length();
  const g = colorear(new THREE.CylinderGeometry(rb, ra, len, seg, 1), col);
  _qq.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  _m4.compose(_aa.clone().add(_bb).multiplyScalar(0.5), _qq, _ss.set(1, 1, 1));
  g.applyMatrix4(_m4);
  return g;
}
// Prisma triangular (techo a dos aguas): ancho w (x), alto h (y), profundidad d (z)
function prisma(w, h, d, col, x = 0, y = 0, z = 0) {
  const s = new THREE.Shape();
  s.moveTo(-d / 2, 0); s.lineTo(d / 2, 0); s.lineTo(0, h); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: w, bevelEnabled: false });
  g.translate(0, 0, -w / 2);
  g.rotateY(Math.PI / 2);
  return mover(colorear(g, col), x, y, z);
}
// Geometría a partir de triángulos sueltos [x,y,z, ...] con colores por vértice
function triangulos(pos, cols) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
  g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(cols), 3));
  g.computeVertexNormals();
  return g;
}

// Textura con texto para carteles
function texCartel(texto, w = 256, h = 96, bg = '#3a2412', fg = '#ffe9a8', borde = '#e8c860', fuente) {
  const cv = makeCanvas(w, h), g = cv.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.strokeStyle = borde; g.lineWidth = 6; g.strokeRect(5, 5, w - 10, h - 10);
  g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
  let tam = h * 0.5;
  g.font = `${tam}px ${fuente || FUENTE_TIT}`;
  while (g.measureText(texto).width > w - 30 && tam > 10) { tam -= 2; g.font = `${tam}px ${fuente || FUENTE_TIT}`; }
  g.fillText(texto, w / 2, h / 2 + 2);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
const FUENTE_TIT = '"Lilita One", "Arial Black", Impact, sans-serif';
const FUENTE_UI = '"Fredoka", "Trebuchet MS", "Segoe UI", system-ui, sans-serif';

// ---------------------------------------------------------------------------
// Palmeras
// ---------------------------------------------------------------------------
function hojaPalma(o, ang, largo, caida, c1, c2) {
  const dx = Math.cos(ang), dz = Math.sin(ang), sx = -dz, sz = dx;
  const S = 7, pos = [], col = [];
  const A = new THREE.Color(c1), B = new THREE.Color(c2), t = new THREE.Color();
  const pt = [];
  for (let j = 0; j <= S; j++) {
    const u = j / S;
    const w = 0.62 * Math.sin(Math.PI * (u * 0.86 + 0.14)) * (1 - 0.25 * u) * (j % 2 ? 1 : 0.8);
    const cx = o.x + dx * largo * u, cz = o.z + dz * largo * u;
    const cy = o.y + Math.sin(Math.PI * u * 0.55) * 0.9 - caida * u * u;
    pt.push([cx, cy, cz, w]);
  }
  for (let j = 0; j < S; j++) {
    const a = pt[j], b = pt[j + 1];
    const u0 = j / S, u1 = (j + 1) / S;
    const ca = t.copy(A).lerp(B, u0).clone(), cb = new THREE.Color().copy(A).lerp(B, u1);
    const L0 = [a[0] + sx * a[3], a[1] - a[3] * 0.25, a[2] + sz * a[3]], R0 = [a[0] - sx * a[3], a[1] - a[3] * 0.25, a[2] - sz * a[3]], M0 = [a[0], a[1], a[2]];
    const L1 = [b[0] + sx * b[3], b[1] - b[3] * 0.25, b[2] + sz * b[3]], R1 = [b[0] - sx * b[3], b[1] - b[3] * 0.25, b[2] - sz * b[3]], M1 = [b[0], b[1], b[2]];
    const quad = (p0, p1, p2, p3, c0, c1) => { pos.push(...p0, ...p1, ...p2, ...p0, ...p2, ...p3); col.push(c0.r, c0.g, c0.b, c1.r, c1.g, c1.b, c1.r, c1.g, c1.b, c0.r, c0.g, c0.b, c1.r, c1.g, c1.b, c0.r, c0.g, c0.b); };
    quad(L0, L1, M1, M0, ca, cb);
    quad(M0, M1, R1, R0, ca, cb);
  }
  return triangulos(pos, col);
}
function geoPalma() {
  const partes = [];
  const alto = 8.4, seg = 12;
  const curva = (u) => ({ x: 1.2 * u * u, y: u * alto, z: 0.45 * u * u });
  for (let i = 0; i < seg; i++) {
    const a = curva(i / seg), b = curva((i + 1) / seg);
    partes.push(cilEntre(a, b, 0.36 - 0.17 * (i / seg), 0.36 - 0.17 * ((i + 1) / seg), i % 2 ? '#a06f3f' : '#8a5a2e', 7));
  }
  const top = curva(1);
  const nF = 9;
  for (let i = 0; i < nF; i++) partes.push(hojaPalma(top, (i / nF) * TAU + (i % 2) * 0.22, 3.6 + (i % 3) * 0.55, 1.5 + (i % 2) * 0.9, '#2f8a3f', '#7acc5a'));
  for (let k = 0; k < 3; k++) partes.push(esf(0.26, '#6b4222', top.x + (k - 1) * 0.3, top.y - 0.35, top.z + (k === 1 ? 0.28 : -0.1), 1, 1, 1, 0));
  partes.push(esf(0.34, '#5a3a1c', top.x, top.y - 0.1, top.z, 1, 0.7, 1, 0));
  return unir(partes);
}
function crearPalmas(escena) {
  const lista = MUN.palmas;
  const im = new THREE.InstancedMesh(geoPalma(), MAT.palma, lista.length);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  lista.forEach((p, i) => {
    e.set(0, p.rot, p.incl * 0.35);
    q.setFromEuler(e);
    m.compose(new THREE.Vector3(p.x, p.y - 0.25, p.z), q, new THREE.Vector3(p.s, p.s, p.s));
    im.setMatrixAt(i, m);
  });
  im.castShadow = true; im.receiveShadow = false;
  im.frustumCulled = false;
  escena.add(im);
  return im;
}

// ---------------------------------------------------------------------------
// Rocas y arbustos
// ---------------------------------------------------------------------------
function crearRocas(escena) {
  const g = new THREE.IcosahedronGeometry(1, 1);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const k = 0.78 + 0.45 * hash2(Math.round(x * 50), Math.round(z * 50 + y * 30));
    p.setXYZ(i, x * k * 1.15, y * k * 0.72, z * k * 1.05);
  }
  g.computeVertexNormals();
  const gn = g.toNonIndexed();
  gn.deleteAttribute('uv');
  const lista = MUN.rocas;
  const im = new THREE.InstancedMesh(gn, MAT.roca, lista.length);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), col = new THREE.Color();
  lista.forEach((r, i) => {
    e.set(0, r.rot, 0); q.setFromEuler(e);
    m.compose(new THREE.Vector3(r.x, r.y - 0.15 * r.s, r.z), q, new THREE.Vector3(1.4 * r.s, 1.2 * r.s, 1.4 * r.s));
    im.setMatrixAt(i, m);
    col.set(r.v ? '#4b4549' : '#8f959c').lerp(new THREE.Color(r.v ? (r.c > 0.5 ? '#6a5a55' : '#3a3a40') : (r.c > 0.5 ? '#a8a49a' : '#7d868f')), r.c);
    im.setColorAt(i, col);
  });
  im.castShadow = true; im.receiveShadow = true;
  escena.add(im);
}
function crearArbustos(escena) {
  const partes = [esf(0.9, '#3f9a45', -0.6, 0.7, 0.1, 1, 0.85, 1), esf(1.0, '#52ad4c', 0.6, 0.8, -0.1, 1, 0.9, 1), esf(0.85, '#68c15a', 0, 1.3, 0.2, 1, 0.9, 1), esf(0.7, '#3a8a42', 0.1, 0.6, 0.8, 1, 0.8, 1)];
  const flores = [esf(0.12, '#ff7aa8', -0.5, 1.4, 0.6, 1, 1, 1, 0), esf(0.12, '#ffe06b', 0.5, 1.7, 0.4, 1, 1, 1, 0), esf(0.12, '#ffffff', 0.1, 1.9, -0.2, 1, 1, 1, 0), esf(0.12, '#ff7aa8', 1.1, 1.2, 0.5, 1, 1, 1, 0)];
  const geoB = unir(partes), geoF = unir(flores);
  const lista = MUN.arbustos;
  const im = new THREE.InstancedMesh(geoB, MAT.vc, lista.length);
  const f = new THREE.InstancedMesh(geoF, MAT.vc, lista.length);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  let nf = 0;
  lista.forEach((r, i) => {
    e.set(0, r.c * 6, 0); q.setFromEuler(e);
    m.compose(new THREE.Vector3(r.x, r.y - 0.1, r.z), q, new THREE.Vector3(r.s, r.s, r.s));
    im.setMatrixAt(i, m);
    if (r.c > 0.45) f.setMatrixAt(nf++, m);
  });
  f.count = nf;
  im.castShadow = true;
  escena.add(im); escena.add(f);
}

// Árboles de selva (Isla Arsenal): tronco alto, copa en capas y alguna enredadera
function crearArboles(escena) {
  if (!MUN.arboles.length) return;
  const partes = [];
  const alto = 8.2, seg = 8;
  for (let i = 0; i < seg; i++) {
    const a = { x: 0.15 * Math.sin(i * 0.7), y: (i / seg) * alto, z: 0 }, b = { x: 0.15 * Math.sin((i + 1) * 0.7), y: ((i + 1) / seg) * alto, z: 0 };
    partes.push(cilEntre(a, b, 0.5 - 0.25 * (i / seg), 0.5 - 0.25 * ((i + 1) / seg), i % 2 ? '#6b4a2b' : '#5a3d22', 7));
  }
  for (const [x, z] of [[0.6, 0.3], [-0.5, 0.5], [0.1, -0.7]]) partes.push(cilEntre({ x: x * 1.6, y: 0, z: z * 1.6 }, { x: x * 0.3, y: 1.4, z: z * 0.3 }, 0.22, 0.3, '#5a3d22', 5));
  const verdes = ['#2f7f3c', '#3d9447', '#277238', '#4aa44f'];
  [[0, 8.6, 0, 3.0], [1.8, 7.7, 0.6, 2.2], [-1.7, 7.9, -0.5, 2.3], [0.4, 7.4, -1.9, 2.1], [-0.3, 7.5, 1.9, 2.0], [0.3, 10.0, 0.2, 2.0]].forEach(([x, y, z, r], i) => partes.push(esf(r, verdes[i % 4], x, y, z, 1.15, 0.72, 1.15, 1)));
  partes.push(esf(0.28, '#ff5a8a', 1.4, 7.2, 1.6, 1, 1, 1, 0), esf(0.28, '#ffd23c', -1.9, 7.5, 0.9, 1, 1, 1, 0));
  for (const [x, z] of [[1.9, 1.2], [-1.6, -1.5]]) partes.push(cilEntre({ x, y: 7.4, z }, { x: x * 1.05, y: 3.6, z: z * 1.05 }, 0.05, 0.04, '#2f6b2f', 4));
  const lista = MUN.arboles;
  const im = new THREE.InstancedMesh(unir(partes), MAT.palma, lista.length);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  lista.forEach((a, i) => {
    e.set(0, a.rot, 0); q.setFromEuler(e);
    m.compose(new THREE.Vector3(a.x, a.y - 0.3, a.z), q, new THREE.Vector3(a.s, a.s * (0.9 + a.c * 0.35), a.s));
    im.setMatrixAt(i, m);
  });
  im.castShadow = true; im.receiveShadow = false; im.frustumCulled = false;
  escena.add(im);
}

// ---------------------------------------------------------------------------
// Props (se unen en pocas mallas)
// ---------------------------------------------------------------------------
const PROPS3D = { fuegos: [], luces: [], redes: [] };

function crearProps(escena) {
  const solido = [], metal = [], lamparas = [];
  const ry = (p) => p.rot || 0;
  for (const p of MUN.props) {
    const y = Math.max(H(p.x, p.z), 0.05);
    const at = (g) => mover(g, p.x, y, p.z);
    const giro = (g) => { g.rotateY(ry(p)); return g; };
    if (p.kind === 'barril') {
      solido.push(at(cil(0.46, 0.5, 1.05, '#a06c3a', 0, 0.53, 0, 10)));
      for (const hy of [0.22, 0.85]) solido.push(at(cil(0.5, 0.5, 0.09, '#3d3f45', 0, hy, 0, 10)));
    } else if (p.kind === 'cajon') {
      solido.push(at(giro(caja(0.95, 0.9, 0.95, '#c99a5b', 0, 0.45, 0))));
      solido.push(at(giro(caja(1.0, 0.1, 1.0, '#8a5a30', 0, 0.9, 0))));
      solido.push(at(giro(caja(1.0, 0.1, 1.0, '#8a5a30', 0, 0.05, 0))));
    } else if (p.kind === 'cartel') {
      solido.push(at(cil(0.07, 0.07, 2.0, '#6b4424', 0, 1.0, 0, 6)));
      const tex = texCartel(p.txt || '', 256, 96);
      const m = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.64, 0.1), [new THREE.MeshStandardMaterial({ color: '#6b4424' }), new THREE.MeshStandardMaterial({ color: '#6b4424' }), new THREE.MeshStandardMaterial({ color: '#6b4424' }), new THREE.MeshStandardMaterial({ color: '#6b4424' }), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 }), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 })]);
      m.position.set(p.x, y + 1.75, p.z); m.rotation.y = ry(p); m.castShadow = true;
      escena.add(m);
    } else if (p.kind === 'sombrilla') {
      solido.push(at(cil(0.05, 0.05, 2.6, '#e8e2d2', 0, 1.3, 0, 6)));
      const sector = [];
      const n = 8, R = 1.9, Hh = 0.65;
      for (let i = 0; i < n; i++) {
        const a0 = (i / n) * TAU, a1 = ((i + 1) / n) * TAU;
        const c = new THREE.Color(i % 2 ? '#ffffff' : p.c);
        sector.push([0, 2.9, 0, Math.cos(a0) * R, 2.9 - Hh, Math.sin(a0) * R, Math.cos(a1) * R, 2.9 - Hh, Math.sin(a1) * R, c]);
      }
      const pos = [], col = [];
      for (const s of sector) { pos.push(...s.slice(0, 9)); for (let k = 0; k < 3; k++) col.push(s[9].r, s[9].g, s[9].b); }
      const gS = triangulos(pos, col);
      gS.translate(p.x, y, p.z);
      metal.push(gS);
    } else if (p.kind === 'farol') {
      solido.push(at(cil(0.07, 0.1, 3.6, '#3e4650', 0, 1.8, 0, 6)));
      solido.push(at(caja(0.5, 0.12, 0.5, '#3e4650', 0, 3.65, 0)));
      solido.push(at(cono(0.38, 0.35, '#3e4650', 0, 4.35, 0, 4)));
      lamparas.push(at(esf(0.26, '#ffffff', 0, 3.95, 0, 1, 1.2, 1, 1)));
    } else if (p.kind === 'banco') {
      solido.push(at(giro(caja(1.8, 0.1, 0.5, '#9a6a3a', 0, 0.55, 0))));
      solido.push(at(giro(caja(1.8, 0.45, 0.08, '#9a6a3a', 0, 0.95, -0.22))));
      for (const sx of [-0.75, 0.75]) solido.push(at(giro(caja(0.1, 0.55, 0.45, '#6b4424', sx, 0.27, 0))));
    } else if (p.kind === 'redseca') {
      for (const sx of [-2.4, 2.4]) solido.push(at(giro(cil(0.07, 0.09, 2.5, '#7a5230', sx, 1.25, 0, 6))));
      solido.push(at(giro(caja(5, 0.07, 0.07, '#6b4424', 0, 2.4, 0))));
      const cvn = makeCanvas(128, 64), gg = cvn.getContext('2d');
      gg.strokeStyle = 'rgba(245,240,215,.95)'; gg.lineWidth = 2;
      for (let i = 0; i <= 128; i += 12) { gg.beginPath(); gg.moveTo(i, 0); gg.lineTo(i - 8, 64); gg.stroke(); gg.beginPath(); gg.moveTo(i, 0); gg.lineTo(i + 8, 64); gg.stroke(); }
      const tn = new THREE.CanvasTexture(cvn);
      tn.wrapS = tn.wrapT = THREE.RepeatWrapping;
      const red = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 1.8), new THREE.MeshStandardMaterial({ map: tn, transparent: true, alphaTest: 0.35, side: THREE.DoubleSide, roughness: 1 }));
      red.position.set(p.x, y + 1.55, p.z); red.rotation.y = ry(p); red.castShadow = true;
      escena.add(red);
      for (let i = -2; i <= 2; i++) solido.push(at(giro(esf(0.14, '#ff7b3a', i * 1.05, 2.3, 0, 1, 1, 1, 0))));
    } else if (p.kind === 'bote') {
      const g = crearCascoBote(3.6, 1.35, 0.6, '#2f6fa8', '#e8d5a8');
      g.rotateY(ry(p)); g.rotateZ(0.12);
      solido.push(at(mover(g, 0, 0.35, 0)));
    } else if (p.kind === 'carpa') {
      const col = p.c || '#6f7d46';
      solido.push(at(giro(caja(2.5, 0.07, 3.6, col, -0.85, 1.0, 0, 0, 0.95))), at(giro(caja(2.5, 0.07, 3.6, shadeHex(col, -0.06), 0.85, 1.0, 0, 0, -0.95))));
      solido.push(at(giro(caja(2.4, 0.06, 3.5, '#5a4a30', 0, 0.04, 0))), at(giro(caja(0.08, 2.1, 0.08, '#6b4424', 0, 1.0, 1.75))), at(giro(caja(0.08, 2.1, 0.08, '#6b4424', 0, 1.0, -1.75))), at(giro(caja(0.06, 0.06, 3.7, '#6b4424', 0, 2.05, 0))));
      solido.push(at(giro(caja(1.0, 1.4, 0.05, '#1b1a14', 0, 0.75, 1.76))));
    } else if (p.kind === 'sacos') {
      for (let i = 0; i < 4; i++) solido.push(at(giro(esf(0.36, i % 2 ? '#b3a47a' : '#c2b588', -1.2 + i * 0.8, 0.28, 0, 1.45, 0.75, 1, 1))));
      for (let i = 0; i < 3; i++) solido.push(at(giro(esf(0.36, i % 2 ? '#c2b588' : '#b3a47a', -0.8 + i * 0.8, 0.78, 0.04, 1.45, 0.75, 1, 1))));
      solido.push(at(giro(esf(0.36, '#b3a47a', 0, 1.25, 0, 1.45, 0.75, 1, 1))));
    } else if (p.kind === 'canon') {
      solido.push(at(giro(caja(1.9, 0.35, 0.9, '#6b4a2b', 0, 0.62, 0))));
      for (const sz of [-0.55, 0.55]) solido.push(at(giro(cil(0.48, 0.48, 0.16, '#4a3420', 0.2, 0.5, sz, 12, Math.PI / 2))));
      metal.push(at(giro(cil(0.3, 0.2, 2.6, '#2f353c', 0.4, 1.05, 0, 10, 0, 0, Math.PI / 2 + 0.12))));
      metal.push(at(giro(esf(0.26, '#2f353c', -0.85, 1.0, 0, 1, 1, 1, 1))));
    } else if (p.kind === 'bandera') {
      solido.push(at(cil(0.07, 0.09, 6.2, '#cfd5d9', 0, 3.1, 0, 6)), at(esf(0.13, '#e8c860', 0, 6.25, 0, 1, 1, 1, 1)));
      solido.push(at(caja(1.7, 1.0, 0.05, '#4f5a3c', 0.9, 5.5, 0)), at(caja(1.7, 0.2, 0.06, '#e8c860', 0.9, 5.5, 0)), at(esf(0.17, '#c0392b', 0.9, 5.5, 0.04, 1, 1, 0.3, 1)));
    } else if (p.kind === 'torre') {
      for (const [sx, sz] of [[-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5], [1.5, 1.5]]) solido.push(at(cilEntre({ x: sx * 1.25, y: 0, z: sz * 1.25 }, { x: sx, y: 7.2, z: sz }, 0.2, 0.16, '#6b4424', 6)));
      for (const yy of [2.4, 4.8]) { const k = 1.25 - yy / 7.2 * 0.25; solido.push(at(caja(k * 3, 0.1, 0.1, '#8a5a30', 0, yy, k * 1.5)), at(caja(k * 3, 0.1, 0.1, '#8a5a30', 0, yy, -k * 1.5)), at(caja(0.1, 0.1, k * 3, '#8a5a30', k * 1.5, yy, 0)), at(caja(0.1, 0.1, k * 3, '#8a5a30', -k * 1.5, yy, 0))); }
      solido.push(at(caja(3.8, 0.2, 3.8, '#9a6a3a', 0, 7.3, 0)));
      for (const [wx, wz, ww, wd] of [[0, 1.8, 3.8, 0.1], [0, -1.8, 3.8, 0.1], [1.8, 0, 0.1, 3.8], [-1.8, 0, 0.1, 3.8]]) solido.push(at(caja(ww, 0.9, wd, '#8a5a30', wx, 7.85, wz)));
      for (const [sx, sz] of [[-1.7, -1.7], [1.7, -1.7], [-1.7, 1.7], [1.7, 1.7]]) solido.push(at(cil(0.07, 0.07, 2.2, '#6b4424', sx, 8.3, sz, 6)));
      solido.push(at(cono(3.0, 1.5, '#4f5a3c', 0, 10.35, 0, 4, 0, Math.PI / 4)));
      solido.push(at(caja(0.5, 4.2, 0.1, '#7a5230', 0, 2.1, 1.4)));
      lamparas.push(at(esf(0.22, '#ffffff', 0, 9.2, 0, 1, 1.2, 1, 1)));
    } else if (p.kind === 'ruina') {
      const v = (p.v || 0) % 3;
      const piedra = ['#9d9a8a', '#8f8d80', '#a8a594'][v];
      if (v === 0) { solido.push(at(giro(cil(0.62, 0.7, 3.4, piedra, 0, 1.7, 0, 9))), at(giro(cil(0.78, 0.78, 0.3, '#868375', 0, 3.5, 0, 9))), at(giro(cil(0.4, 0.62, 0.5, '#5f8a4a', 0, 3.7, 0, 7)))); }
      else if (v === 1) { solido.push(at(giro(caja(3.6, 2.2, 0.7, piedra, 0, 1.1, 0))), at(giro(caja(1.6, 1.3, 0.7, piedra, 1.2, 2.8, 0))), at(giro(caja(3.7, 0.25, 0.8, '#5f8a4a', 0, 2.25, 0)))); }
      else { solido.push(at(giro(caja(1.3, 1.0, 1.3, piedra, -0.8, 0.5, 0.2, 0.3))), at(giro(caja(1.0, 0.8, 1.2, '#868375', 0.6, 0.4, -0.4, -0.4))), at(giro(caja(1.8, 0.9, 0.9, piedra, 0.1, 1.2, 0.1, 0.8))), at(giro(esf(0.5, '#5f8a4a', 0.2, 1.8, 0.1, 1.3, 0.5, 1, 1)))); }
    } else if (p.kind === 'hueso') {
      const marfil = '#e9e2cf';
      for (let k = 0; k < 2; k++) {
        const zz = (k - 0.5) * 1.8; let prev = { x: -1.6, y: 0, z: zz };
        for (let i = 1; i <= 7; i++) { const a = (i / 7) * Math.PI; const q = { x: -1.6 + (i / 7) * 3.2, y: Math.sin(a) * 2.1 * (1 - 0.15 * k), z: zz }; solido.push(at(giro(cilEntre(prev, q, 0.16, 0.13, marfil, 5)))); prev = q; }
      }
      solido.push(at(giro(cil(0.12, 0.12, 4.2, marfil, 0, 0.12, -0.1, 5, Math.PI / 2, 0, Math.PI / 2))));
    } else if (p.kind === 'fogata') {
      for (let i = 0; i < 9; i++) { const a = (i / 9) * TAU; solido.push(at(esf(0.28, i % 2 ? '#8b939b' : '#6d757d', Math.cos(a) * 0.95, 0.12, Math.sin(a) * 0.95, 1, 0.7, 1, 0))); }
      solido.push(at(cil(0.1, 0.1, 1.6, '#5a3a1e', 0, 0.28, 0, 6, 0, 0.3, 1.45)));
      solido.push(at(cil(0.1, 0.1, 1.6, '#4a2e16', 0, 0.28, 0, 6, 0, -0.6, 1.45)));
      solido.push(at(cil(0.1, 0.1, 1.6, '#5a3a1e', 0, 0.36, 0, 6, 0, 1.4, 1.45)));
      // llamas
      const llamas = [];
      for (let i = 0; i < 4; i++) {
        const c = new THREE.Mesh(new THREE.ConeGeometry(0.4 - i * 0.07, 1.2 - i * 0.18, 7), new THREE.MeshBasicMaterial({ color: ['#ff6a1f', '#ff9a2a', '#ffc94a', '#fff2a0'][i], transparent: true, opacity: 0.88, depthWrite: false, fog: false }));
        c.position.set(p.x, y + 0.55 + i * 0.02, p.z);
        escena.add(c); llamas.push(c);
      }
      PROPS3D.fuegos.push({ llamas, x: p.x, y, z: p.z });
    }
  }
  const mc = new THREE.Mesh(unir(solido), MAT.vc);
  mc.castShadow = true; mc.receiveShadow = true;
  escena.add(mc);
  if (metal.length) { const mm = new THREE.Mesh(unir(metal), MAT.vcDoble); mm.castShadow = true; escena.add(mm); }
  if (lamparas.length) { const ml = new THREE.Mesh(unir(lamparas), MAT.lampara); escena.add(ml); }
}
function actualizarProps(dt) {
  for (const f of PROPS3D.fuegos) {
    f.llamas.forEach((c, i) => {
      const k = 0.85 + 0.3 * Math.sin(J.t * (9 + i * 2.3) + i);
      c.scale.set(1 + 0.18 * Math.sin(J.t * 12 + i), k, 1 + 0.18 * Math.cos(J.t * 11 + i));
      c.position.y = f.y + 0.55 * k + i * 0.02;
      c.rotation.y += dt * 2;
    });
  }
  UNI.uT.value = J.t;
  UNI.uNoche.value = J.noche;
  UNI.uViento.value = J.clima.lluvia * 0.6 + 0.25;
  // luces encendidas de noche
  MAT.ventana.emissiveIntensity = clamp(J.noche * 1.6 - 0.2, 0, 1.4);
  MAT.lampara.emissiveIntensity = clamp(J.noche * 3 - 0.3, 0, 2.5);
}

// Estaciones del casco (loft): L largo (eje x, proa en +x), W ancho, Hh alto
function estacionesCasco(L, W, Hh) {
  const N = 14, est = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N; // 0 popa .. 1 proa
    const ancho = (W / 2) * Math.pow(Math.sin(Math.PI * (0.12 + 0.88 * u) * 0.99), 0.55) * (u > 0.85 ? 1 - (u - 0.85) * 4.2 * 0.6 : 1);
    const alto = Hh * (0.9 + 0.5 * u * u);
    const quilla = -Hh * 0.55 + 0.35 * Hh * (u > 0.8 ? (u - 0.8) * 5 : 0);
    est.push({ x: (u - 0.5) * L, w: Math.max(0.03, ancho), top: alto * 0.5, k: quilla });
  }
  return est;
}
// Casco de un bote: col = color exterior, int = interior, pisoH = altura del piso sobre la quilla
function crearCascoBote(L, W, Hh, col, int, pisoH = 0.22) {
  const N = 14, pos = [], cl = [];
  const C1 = new THREE.Color(col), C2 = new THREE.Color(int || '#e8d5a8');
  const est = estacionesCasco(L, W, Hh);
  const P3 = (s, lado, tipo) => {
    if (tipo === 0) return [s.x, s.top, lado * s.w];
    if (tipo === 1) return [s.x, s.k + (s.top - s.k) * 0.28, lado * s.w * 0.78];
    return [s.x, s.k, 0];
  };
  const tri = (a, b, c, col2) => { pos.push(...a, ...b, ...c); for (let k = 0; k < 3; k++) cl.push(col2.r, col2.g, col2.b); };
  for (let i = 0; i < N; i++) {
    const a = est[i], b = est[i + 1];
    for (const lado of [-1, 1]) {
      const a0 = P3(a, lado, 0), a1 = P3(a, lado, 1), a2 = P3(a, lado, 2), b0 = P3(b, lado, 0), b1 = P3(b, lado, 1), b2 = P3(b, lado, 2);
      if (lado > 0) { tri(a0, b0, b1, C1); tri(a0, b1, a1, C1); tri(a1, b1, b2, C1); tri(a1, b2, a2, C1); } else { tri(a0, b1, b0, C1); tri(a0, a1, b1, C1); tri(a1, b2, b1, C1); tri(a1, a2, b2, C1); }
      // interior (cubierta vista desde arriba)
      const ia = [a.x, a.top - 0.12, lado * (a.w - 0.07)], ib = [b.x, b.top - 0.12, lado * (b.w - 0.07)], fa = [a.x, a.k + pisoH, 0], fb = [b.x, b.k + pisoH, 0];
      if (lado > 0) { tri(ia, fa, fb, C2); tri(ia, fb, ib, C2); } else { tri(ia, fb, fa, C2); tri(ia, ib, fb, C2); }
    }
  }
  return triangulos(pos, cl);
}
// Borde (regala) del casco: una cinta plana que sigue la línea de borda
function bordeCasco(L, W, Hh, col, ancho = 0.09, dy = 0.015) {
  const est = estacionesCasco(L, W, Hh), pos = [], cl = [], C = new THREE.Color(col);
  for (let i = 0; i < est.length - 1; i++) {
    const a = est[i], b = est[i + 1];
    for (const lado of [-1, 1]) {
      const a0 = [a.x, a.top + dy, lado * (a.w - ancho * 0.8)], a1 = [a.x, a.top + dy, lado * (a.w + ancho * 0.4)];
      const b0 = [b.x, b.top + dy, lado * (b.w - ancho * 0.8)], b1 = [b.x, b.top + dy, lado * (b.w + ancho * 0.4)];
      const q = lado > 0 ? [a0, b0, b1, a0, b1, a1] : [a0, b1, b0, a0, a1, b1];
      for (const v of q) { pos.push(...v); cl.push(C.r, C.g, C.b); }
    }
  }
  return triangulos(pos, cl);
}
// Cubierta plana a la altura y (en el sistema del casco), entre las dos paredes interiores, desde x0 hasta x1
function cubiertaCasco(L, W, Hh, y, col, x0, x1, pisoH = 0.22) {
  const est = estacionesCasco(L, W, Hh), pos = [], cl = [], C = new THREE.Color(col);
  const ancho = (s) => {
    const base = s.k + pisoH, techo = s.top - 0.12;
    return clamp((y - base) / Math.max(0.01, techo - base), 0, 1) * (s.w - 0.07);
  };
  for (let i = 0; i < est.length - 1; i++) {
    const a = est[i], b = est[i + 1];
    if (b.x < x0 || a.x > x1) continue;
    const wa = ancho(a), wb = ancho(b);
    const q = [[a.x, y, wa], [b.x, y, wb], [b.x, y, -wb], [a.x, y, wa], [b.x, y, -wb], [a.x, y, -wa]];
    for (const v of q) { pos.push(...v); cl.push(C.r, C.g, C.b); }
  }
  return triangulos(pos, cl);
}
