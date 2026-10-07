'use strict';
// Criaturas marinas en 3D (procedurales). Miran hacia +x. Cada modelo = { grupo, mallas, cola, animar(dt, v, t) }.
// Se pueden ver "en color" o como "sombra" oscura bajo el agua (cambiando el material).

const ESC_PEZ = 0.019; // metros por unidad de "len" de la tabla de especies
const SOMBRA_COL = { orilla: '#020d14', arrecife: '#03121e', mar: '#051a2e', abismo: '#08233f' };
const MAT_SOMBRA = {}, MAT_SOMBRA_RT = {};
const SOMBRA_K = { orilla: 1, arrecife: 0.92, mar: 0.74, abismo: 0.55 };
function matSombra(zona) {
  if (!MAT_SOMBRA[zona]) MAT_SOMBRA[zona] = new THREE.MeshBasicMaterial({ color: SOMBRA_COL[zona] || '#04243c', side: THREE.DoubleSide, fog: true });
  return MAT_SOMBRA[zona];
}
// Sombra que va a la textura de sombras (se une con MAX para que no se sume al superponerse)
function matSombraRT(zona) {
  if (!MAT_SOMBRA_RT[zona]) {
    const k = SOMBRA_K[zona] === undefined ? 1 : SOMBRA_K[zona];
    MAT_SOMBRA_RT[zona] = new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k, k), side: THREE.DoubleSide, fog: false, toneMapped: false, depthTest: false, depthWrite: false, transparent: true, blending: THREE.CustomBlending, blendEquation: THREE.MaxEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor });
  }
  return MAT_SOMBRA_RT[zona];
}
const MAT_CRIA = {};
function matCria() {
  if (!MAT_CRIA.vc) {
    MAT_CRIA.vc = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.55, metalness: 0.05, side: THREE.DoubleSide });
    MAT_CRIA.brillo = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.3, metalness: 0.1, emissive: new THREE.Color('#38e8d0'), emissiveIntensity: 0.9, side: THREE.DoubleSide });
    MAT_CRIA.medusa = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.2, transparent: true, opacity: 0.72, emissive: new THREE.Color('#9a5ad0'), emissiveIntensity: 0.35, side: THREE.DoubleSide, depthWrite: false });
    MAT_CRIA.ojo = new THREE.MeshStandardMaterial({ color: '#10151c', roughness: 0.2 });
    MAT_CRIA.luz = new THREE.MeshBasicMaterial({ color: '#c8fff6', fog: false });
  }
  return MAT_CRIA;
}

// Forma 2D (puntos en XY) -> geometría coloreada
function forma2D(pts, col) {
  const s = new THREE.Shape();
  pts.forEach((p, i) => (i ? s.lineTo(p[0], p[1]) : s.moveTo(p[0], p[1])));
  s.closePath();
  return colorear(new THREE.ShapeGeometry(s), col);
}
const mezcla = (a, b, t) => new THREE.Color(a).lerp(new THREE.Color(b), clamp(t, 0, 1));

// Cuerpo por estaciones: perfil radial prof(u), media altura a(u), media anchura b(u). Devuelve geometría con colores
function cuerpoEstaciones(L, a, nSt, fnPerfil, fnColor, M = 10, x0 = 0.5, x1 = -0.36) {
  const pos = [], col = [];
  const filas = [];
  for (let i = 0; i <= nSt; i++) {
    const u = i / nSt, x = L * (x0 + (x1 - x0) * u);
    const pf = fnPerfil(u);
    const fila = [];
    for (let j = 0; j < M; j++) {
      const f = (j / M) * TAU;
      const up = Math.cos(f), lado = Math.sin(f);
      fila.push({ x, y: pf.a * up, z: pf.b * lado, up, lado, u, j });
    }
    filas.push(fila);
  }
  const c = new THREE.Color();
  const push = (v) => { pos.push(v.x, v.y, v.z); fnColor(c, v); col.push(c.r, c.g, c.b); };
  for (let i = 0; i < nSt; i++) {
    for (let j = 0; j < M; j++) {
      const j2 = (j + 1) % M;
      const A = filas[i][j], B = filas[i][j2], C = filas[i + 1][j], D = filas[i + 1][j2];
      push(A); push(C); push(B); push(B); push(C); push(D);
    }
  }
  // tapas
  const centro = (fila, hacia) => ({ x: fila[0].x + hacia, y: 0, z: 0, up: 0, lado: 0, u: fila[0].u, j: 0 });
  const nariz = centro(filas[0], L * 0.04), cola = centro(filas[nSt], -L * 0.01);
  for (let j = 0; j < M; j++) { const j2 = (j + 1) % M; push(nariz); push(filas[0][j2]); push(filas[0][j]); push(cola); push(filas[nSt][j]); push(filas[nSt][j2]); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
  g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(col), 3));
  g.computeVertexNormals();
  void a;
  return g;
}

// Perfil de un pez: cabeza redondeada, cuerpo que se afina hacia el pedúnculo
const perfilPez = (u) => (u < 0.3 ? Math.sqrt(Math.max(0, 1 - Math.pow(1 - u / 0.3, 2))) * 0.98 + 0.02 : lerp(1, 0.16, Math.pow(smooth(0.3, 1, u), 1.15)));

function crearPezGenerico(sp, L) {
  const a = sp.arte, H = L * a.alto, M = matCria();
  const lomo = new THREE.Color(a.lomo), panza = new THREE.Color(a.panza), pc = new THREE.Color(a.pcolor || '#ffffff'), c0 = new THREE.Color();
  const semiAlto = H / 2, semiAncho = Math.max(H * 0.2, L * 0.06) * (a.alto > 0.5 ? 0.7 : 1);
  const fnPerf = (u) => { const p = perfilPez(u); return { a: semiAlto * p, b: semiAncho * p }; };
  const fnCol = (c, v) => {
    const t = smooth(0.35, -0.2, v.up);
    c.copy(lomo).lerp(panza, 1 - smooth(-0.15, 0.45, v.up));
    void t;
    const u = v.u;
    switch (a.patron) {
      case 'linea': if (Math.abs(v.up) < 0.3 && u > 0.12) c.lerp(pc, 0.8); break;
      case 'barras': if ((u * 5.2) % 1 < 0.38 && v.up > -0.3) c.lerp(pc, 0.55); break;
      case 'puntos': if (hash2(Math.round(u * 26), v.j * 7 + 3) < 0.16 && v.up > -0.1) c.lerp(pc, 0.8); break;
      case 'franjas': if ((u > 0.2 && u < 0.3) || (u > 0.44 && u < 0.54) || (u > 0.74 && u < 0.84)) c.copy(pc); else if ((u > 0.17 && u < 0.2) || (u > 0.3 && u < 0.33) || (u > 0.41 && u < 0.44) || (u > 0.54 && u < 0.57)) c.set('#1a1a1a'); break;
      case 'manchas': if (hash2(Math.round(u * 14), v.j * 3 + 9) < 0.22 && v.up > -0.2) c.lerp(pc, 0.5); break;
      default:
    }
    // sombreado suave del lomo
    const k = 0.9 + 0.12 * v.up;
    c.multiplyScalar(k);
    void c0;
  };
  const nSt = 16;
  const partes = [cuerpoEstaciones(L, a, nSt, fnPerf, fnCol, 10)];
  // ojos
  const er = Math.max(H * 0.1, L * 0.022);
  const xOjo = L * 0.36;
  for (const sd of [-1, 1]) partes.push(esf(er * 1.25, '#ffffff', xOjo, H * 0.1, sd * (semiAncho * 0.78), 1, 1, 0.8, 0), esf(er * 0.85, '#10151c', xOjo + er * 0.35, H * 0.1, sd * (semiAncho * 0.78 + er * 0.35), 1, 1, 1, 0));
  // aletas
  const topY = (x) => { const u = clamp((L * 0.5 - x) / (L * 0.86), 0, 1); return semiAlto * perfilPez(u); };
  const fin = a.aleta;
  const dorsal = (pts) => partes.push(mover(forma2D(pts, fin), 0, 0, 0));
  const D = a.dorsal;
  if (D === 'norm') dorsal([[0.16 * L, topY(0.16 * L) * 0.9], [0.0, topY(0) + H * 0.5], [-0.17 * L, topY(-0.17 * L) * 0.9]]);
  else if (D === 'larga') { const p = [[0.3 * L, topY(0.3 * L) * 0.9]]; for (let i = 0; i < 6; i++) { const x = (0.3 - i * 0.1) * L; p.push([x - 0.05 * L, topY(x - 0.05 * L) + H * (0.32 - i * 0.025)]); p.push([x - 0.1 * L, topY(x - 0.1 * L) * 0.9]); } dorsal(p); }
  else if (D === 'vela') dorsal([[0.3 * L, topY(0.3 * L) * 0.9], [0.14 * L, topY(0.14 * L) + H * 1.0], [-0.04 * L, topY(-0.04 * L) + H * 0.85], [-0.22 * L, topY(-0.22 * L) + H * 0.45], [-0.28 * L, topY(-0.28 * L) * 0.8]]);
  else if (D === 'espinas') { const p = [[0.28 * L, topY(0.28 * L) * 0.9]]; for (let i = 0; i < 7; i++) { const x = (0.28 - i * 0.075) * L; p.push([x - 0.02 * L, topY(x) + H * (0.42 - i * 0.025)]); p.push([x - 0.06 * L, topY(x - 0.06 * L) * 0.9]); } dorsal(p); }
  else if (D === 'aletillas') { dorsal([[0.16 * L, topY(0.16 * L) * 0.9], [0.03 * L, topY(0.03 * L) + H * 0.6], [-0.12 * L, topY(-0.12 * L) * 0.9]]); for (let i = 0; i < 5; i++) { const x = (-0.15 - i * 0.04) * L; dorsal([[x, topY(x) * 0.85], [x - 0.018 * L, topY(x) + H * 0.16], [x - 0.04 * L, topY(x - 0.04 * L) * 0.85]]); } }
  else if (D === 'aletaalta') { dorsal([[0.1 * L, topY(0.1 * L) * 0.9], [-0.2 * L, topY(-0.2 * L) + H * 0.5], [-0.3 * L, topY(-0.3 * L) * 0.85]]); partes.push(forma2D([[0.1 * L, -topY(0.1 * L) * 0.9], [-0.2 * L, -topY(-0.2 * L) - H * 0.5], [-0.3 * L, -topY(-0.3 * L) * 0.85]], fin)); }
  if (D !== 'aletaalta') {
    partes.push(forma2D([[-0.02 * L, -topY(-0.02 * L) * 0.85], [-0.16 * L, -topY(-0.16 * L) - H * 0.4], [-0.28 * L, -topY(-0.28 * L) * 0.7]], fin));
    partes.push(forma2D([[0.14 * L, -topY(0.14 * L) * 0.85], [0.06 * L, -topY(0.06 * L) - H * 0.34], [-0.04 * L, -topY(-0.04 * L) * 0.85]], fin));
  }
  // pectorales
  for (const sd of [-1, 1]) {
    const g = forma2D([[0, 0], [-0.12 * L, -H * 0.08], [-0.04 * L, -H * 0.2]], fin);
    g.rotateX(sd * 1.1);
    partes.push(mover(g, 0.2 * L, -H * 0.12, sd * semiAncho * 0.9));
  }
  if (a.pico) partes.push(mover(colorear(new THREE.ConeGeometry(Math.max(H * 0.05, 0.02), L * a.pico, 6), '#27324a'), L * (0.5 + a.pico / 2) - L * 0.02, -H * 0.02, 0, 0, 0, -Math.PI / 2));
  if (a.dientes) for (let i = 0; i < 5; i++) for (const sd of [-1, 1]) partes.push(mover(colorear(new THREE.ConeGeometry(L * 0.008, L * 0.03, 4), '#ffffff'), L * (0.47 - i * 0.016), -H * 0.08, sd * semiAncho * 0.3, 0, 0, Math.PI));
  if (a.brilla) for (let i = 0; i < 8; i++) partes.push(esf(Math.max(0.012, L * 0.012), '#9ff7ff', L * (0.3 - i * 0.06), -semiAlto * 0.65, semiAncho * 0.5, 1, 1, 1, 0));
  // cola (malla aparte, rota sobre el pedúnculo)
  const ht = Math.max(H * 0.95, L * 0.16), e = L * 0.27;
  let ptsCola;
  if (a.cola === 'lun') ptsCola = [[0, ht * 0.06], [-e * 0.6, ht * 0.3], [-e * 1.2, ht * 0.88], [-e * 0.7, ht * 0.12], [-e * 0.55, 0], [-e * 0.7, -ht * 0.12], [-e * 1.2, -ht * 0.88], [-e * 0.6, -ht * 0.3], [0, -ht * 0.06]];
  else if (a.cola === 'red') ptsCola = [[0, ht * 0.1], [-e * 0.5, ht * 0.5], [-e * 1.05, ht * 0.42], [-e * 1.15, 0], [-e * 1.05, -ht * 0.42], [-e * 0.5, -ht * 0.5], [0, -ht * 0.1]];
  else if (a.cola === 'trunc') ptsCola = [[0, ht * 0.4], [-e * 0.55, ht * 0.4], [-e * 0.6, 0], [-e * 0.55, -ht * 0.4], [0, -ht * 0.4]];
  else ptsCola = [[0, ht * 0.08], [-e * 0.7, ht * 0.5], [-e * 1.05, ht * 0.66], [-e * 0.62, 0], [-e * 1.05, -ht * 0.66], [-e * 0.7, -ht * 0.5], [0, -ht * 0.08]];
  const cola = new THREE.Mesh(forma2D(ptsCola, fin), M.vc);
  cola.position.set(L * -0.36, 0, 0);
  const cuerpo = new THREE.Mesh(unir(partes), a.brilla ? M.brillo : M.vc);
  return armarModelo([cuerpo], cola, L, 'pez');
}

// Une las piezas en un modelo animable
function armarModelo(mallas, cola, L, tipo, extra) {
  const grupo = new THREE.Group();
  for (const m of mallas) { m.userData.matColor = m.material; grupo.add(m); }
  if (cola) { cola.userData.matColor = cola.material; grupo.add(cola); mallas.push(cola); }
  const mod = { grupo, mallas, cola, L, tipo, modo: 'color', ...extra };
  mod.animar = (dt, v, t, fase) => {
    const k = clamp(v / (L * 1.1 + 0.3), 0.15, 1.6);
    if (cola) cola.rotation.y = Math.sin(t * (5 + k * 6) + fase) * 0.55 * Math.min(1, 0.35 + k);
    grupo.rotation.z = Math.sin(t * (2.2 + k * 2) + fase) * 0.025;
    if (mod.animExtra) mod.animExtra(dt, v, t, fase, k);
  };
  return mod;
}
// Cambia entre color y sombra
function modoModelo(mod, modo, zona) {
  if (mod.modo === modo && mod.zona === zona) return;
  mod.modo = modo; mod.zona = zona;
  const rt = modo === 'sombra' && mod.sombraRT !== false;
  for (const m of mod.mallas) {
    m.material = modo === 'sombra' ? (rt ? matSombraRT(zona) : matSombra(zona)) : m.userData.matColor;
    m.layers.set(rt ? 1 : 0); // capa 1: solo se dibuja en la textura de sombras
  }
  if (mod.luces) for (const l of mod.luces) l.visible = modo !== 'sombra';
}

// ---------------------------------------------------------------------------
// Otras criaturas
// ---------------------------------------------------------------------------
function chain(n, fn) { const a = []; for (let i = 0; i < n; i++) a.push(fn(i / (n - 1), i)); return a; }

function crearCamaron(sp, L) {
  const a = sp.arte, M = matCria();
  const partes = [];
  const N = 7;
  for (let i = 0; i < N; i++) {
    const u = i / (N - 1);
    partes.push(esf(L * (0.11 - u * 0.05), i % 2 ? a.c1 : mezcla(a.c1, a.c2, 0.45).getStyle(), L * (0.4 - u * 0.8), L * 0.04 * Math.sin(u * 3), 0, 1.4, 1, 0.9, 0));
  }
  partes.push(esf(L * 0.014, '#10151c', L * 0.45, L * 0.05, L * 0.05, 1, 1, 1, 0), esf(L * 0.014, '#10151c', L * 0.45, L * 0.05, -L * 0.05, 1, 1, 1, 0));
  for (const sd of [-1, 1]) partes.push(cilEntre({ x: L * 0.42, y: 0, z: sd * L * 0.03 }, { x: L * 0.78, y: L * 0.1, z: sd * L * 0.2 }, 0.004, 0.003, a.c2, 4));
  for (let i = 1; i < 5; i++) for (const sd of [-1, 1]) partes.push(cilEntre({ x: L * (0.3 - i * 0.1), y: -L * 0.04, z: sd * L * 0.05 }, { x: L * (0.32 - i * 0.1), y: -L * 0.14, z: sd * L * 0.1 }, 0.004, 0.003, a.c2, 4));
  const cuerpo = new THREE.Mesh(unir(partes), M.vc);
  const cola = new THREE.Mesh(forma2D([[0, 0], [-L * 0.2, L * 0.1], [-L * 0.26, 0], [-L * 0.2, -L * 0.1]], a.c1), M.vc);
  cola.rotation.x = Math.PI / 2; cola.position.set(-L * 0.4, 0, 0);
  return armarModelo([cuerpo], cola, L, 'camaron');
}
function crearCangrejo(sp, L, coronado) {
  const a = sp.arte, M = matCria();
  const R = L * 0.32;
  const partes = [esf(R, a.c1, 0, R * 0.22, 0, 1.15, 0.5, 1, 1), esf(R * 0.65, mezcla(a.c1, a.c2, 0.5).getStyle(), 0, R * 0.42, 0, 1.1, 0.35, 1, 1)];
  for (const sd of [-1, 1]) {
    partes.push(esf(R * 0.14, '#ffffff', R * 0.9, R * 0.55, sd * R * 0.35, 1, 1, 1, 0), esf(R * 0.08, '#10151c', R * 1.0, R * 0.55, sd * R * 0.35, 1, 1, 1, 0));
    // brazo y pinza
    partes.push(cilEntre({ x: R * 0.8, y: R * 0.2, z: sd * R * 0.7 }, { x: R * 1.45, y: R * 0.3, z: sd * R * 1.2 }, R * 0.16, R * 0.14, a.c1, 6));
    partes.push(esf(R * 0.5, a.c1, R * 1.9, R * 0.32, sd * R * 1.4, 1.3, 0.7, 0.85, 1));
    partes.push(mover(colorear(new THREE.ConeGeometry(R * 0.2, R * 0.7, 5), '#2b1008'), R * 2.5, R * 0.32, sd * R * 1.15, 0, 0, -Math.PI / 2 + sd * 0.3));
    for (let i = 0; i < 3; i++) {
      partes.push(cilEntre({ x: R * (0.35 - i * 0.45), y: R * 0.1, z: sd * R * 0.85 }, { x: R * (0.2 - i * 0.5), y: R * 0.25, z: sd * R * 1.55 }, R * 0.08, R * 0.07, mezcla(a.c1, '#000000', 0.2).getStyle(), 5));
      partes.push(cilEntre({ x: R * (0.2 - i * 0.5), y: R * 0.25, z: sd * R * 1.55 }, { x: R * (0.05 - i * 0.55), y: -R * 0.35, z: sd * R * 1.9 }, R * 0.07, R * 0.05, mezcla(a.c1, '#000000', 0.2).getStyle(), 5));
    }
  }
  if (coronado) partes.push(cono(R * 0.45, R * 0.5, '#ffd23c', 0, R * 0.95, 0, 6), esf(R * 0.08, '#ff4d5e', 0, R * 1.25, 0, 1, 1, 1, 0));
  return armarModelo([new THREE.Mesh(unir(partes), M.vc)], null, L, 'cangrejo');
}
function crearEstrella(sp, L) {
  const a = sp.arte, M = matCria();
  const R1 = L * 0.5, R2 = L * 0.2, pts = [];
  for (let i = 0; i < 10; i++) { const th = (i / 10) * TAU, r = i % 2 ? R2 : R1; pts.push([Math.cos(th) * r, Math.sin(th) * r]); }
  const s = new THREE.Shape();
  pts.forEach((p, i) => (i ? s.lineTo(p[0], p[1]) : s.moveTo(p[0], p[1])));
  const g = new THREE.ExtrudeGeometry(s, { depth: L * 0.1, bevelEnabled: true, bevelThickness: L * 0.05, bevelSize: L * 0.04, bevelSegments: 1 });
  g.rotateX(-Math.PI / 2);
  const partes = [colorear(g, a.c1)];
  for (let k = 0; k < 5; k++) { const th = (k / 5) * TAU; for (let j = 1; j < 4; j++) partes.push(esf(L * 0.02, '#a05a1a', Math.cos(th) * R1 * 0.22 * j, L * 0.16, Math.sin(th) * R1 * 0.22 * j, 1, 1, 1, 0)); }
  return armarModelo([new THREE.Mesh(unir(partes), M.vc)], null, L, 'estrella');
}
function crearGlobo(sp, L) {
  const a = sp.arte, M = matCria();
  const R = L * 0.4;
  const partes = [esf(R, a.c1, 0, 0, 0, 1.1, 0.95, 0.95, 2), esf(R * 0.78, a.c2, 0, -R * 0.2, 0, 1.05, 0.7, 0.9, 1)];
  const arriba = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < 26; i++) {
    const u = hash2(i, 1) * TAU, v = (hash2(i, 2) - 0.5) * 2;
    const r = Math.sqrt(1 - v * v);
    const d = new THREE.Vector3(Math.cos(u) * r, v, Math.sin(u) * r);
    if (d.y < -0.3) continue;
    const g = colorear(new THREE.ConeGeometry(R * 0.07, R * 0.28, 4), '#fff6d6');
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(arriba, d));
    g.translate(d.x * R * 1.08, d.y * R * 0.95, d.z * R * 0.98);
    partes.push(g);
  }
  for (const sd of [-1, 1]) partes.push(esf(R * 0.2, '#ffffff', R * 0.7, R * 0.25, sd * R * 0.62, 1, 1, 0.7, 1), esf(R * 0.12, '#10151c', R * 0.82, R * 0.25, sd * R * 0.7, 1, 1, 1, 0));
  partes.push(esf(R * 0.12, '#e8b4a0', R * 1.05, -R * 0.1, 0, 1, 1, 1, 0));
  const cola = new THREE.Mesh(forma2D([[0, R * 0.2], [-R * 0.6, R * 0.35], [-R * 0.7, 0], [-R * 0.6, -R * 0.35], [0, -R * 0.2]], a.c1), M.vc);
  cola.position.set(-R * 1.0, 0, 0);
  return armarModelo([new THREE.Mesh(unir(partes), M.vc)], cola, L, 'globo');
}
function crearPulpo(sp, L, jefe) {
  const a = sp.arte, M = matCria();
  const R = L * 0.2;
  const cab = [esf(R * 1.3, a.c1, -R * 0.2, R * 0.5, 0, 1.2, 1.2, 1, 2), esf(R * 0.9, a.c2, R * 0.5, R * 0.1, 0, 1, 0.8, 1, 1)];
  for (const sd of [-1, 1]) cab.push(esf(R * 0.34, '#fff6d0', R * 1.0, R * 0.5, sd * R * 0.7, 1, 1, 0.8, 1), esf(R * 0.2, '#10151c', R * 1.22, R * 0.5, sd * R * 0.82, 0.7, 1.4, 1, 0));
  const cuerpo = new THREE.Mesh(unir(cab), M.vc);
  const tent = [];
  const nT = 8;
  for (let i = 0; i < nT; i++) {
    const ang = (i / nT) * TAU;
    const g = new THREE.Group();
    g.position.set(R * 0.3 + Math.cos(ang) * R * 0.7, -R * 0.1, Math.sin(ang) * R * 0.9);
    g.rotation.y = -ang + 0.3;
    let padre = g;
    const segs = [];
    for (let k = 0; k < 5; k++) {
      const len = R * (1.1 - k * 0.12), rr = R * (0.26 - k * 0.04);
      const m = new THREE.Mesh(unir([cil(Math.max(0.01, rr * 0.8), rr, len, i % 2 ? a.c1 : mezcla(a.c1, a.c2, 0.3).getStyle(), len / 2, 0, 0, 6, 0, 0, Math.PI / 2), esf(rr * 0.5, a.c2, len * 0.5, -rr * 0.7, 0, 1, 0.5, 1, 0)]), M.vc);
      const piv = new THREE.Group();
      piv.add(m);
      padre.add(piv);
      const sig = new THREE.Group();
      sig.position.set(len, 0, 0);
      piv.add(sig);
      segs.push(piv);
      padre = sig;
    }
    tent.push({ g, segs, fase: i * 0.9 });
  }
  const mod = armarModelo([cuerpo], null, L, 'pulpo');
  for (const t of tent) { mod.grupo.add(t.g); t.g.traverse((o) => { if (o.isMesh) { o.userData.matColor = o.material; mod.mallas.push(o); } }); }
  mod.animExtra = (dt, v, t, fase) => { for (const te of tent) te.segs.forEach((s, k) => { s.rotation.z = Math.sin(t * 3 + te.fase + k * 0.8 + fase) * 0.35 + 0.18; s.rotation.y = Math.cos(t * 2 + te.fase + k) * 0.18; }); cuerpo.scale.y = 1 + Math.sin(t * 2.4 + fase) * 0.04; };
  void jefe;
  return mod;
}
function crearLangosta(sp, L) {
  const a = sp.arte, M = matCria();
  const R = L * 0.12;
  const partes = [esf(R * 1.3, a.c1, L * 0.18, R * 0.5, 0, 1.6, 0.9, 1, 1), esf(R * 0.7, a.c2, L * 0.3, R * 0.5, 0, 1, 0.9, 1, 1)];
  for (let i = 0; i < 5; i++) partes.push(esf(R * (1 - i * 0.1), i % 2 ? a.c1 : mezcla(a.c1, a.c2, 0.3).getStyle(), -L * (0.02 + i * 0.1), R * 0.45, 0, 0.9, 0.8, 1, 1));
  for (const sd of [-1, 1]) {
    partes.push(esf(R * 0.16, '#10151c', L * 0.43, R * 0.9, sd * R * 0.5, 1, 1, 1, 0));
    partes.push(cilEntre({ x: L * 0.3, y: R * 0.5, z: sd * R * 0.8 }, { x: L * 0.58, y: R * 0.5, z: sd * R * 1.5 }, R * 0.22, R * 0.18, a.c1, 6));
    partes.push(esf(R * 0.6, a.c1, L * 0.72, R * 0.5, sd * R * 1.7, 1.5, 0.7, 0.8, 1));
    partes.push(cilEntre({ x: L * 0.4, y: R * 0.9, z: sd * R * 0.2 }, { x: L * 0.95, y: R * 1.2, z: sd * R * 1.9 }, 0.012, 0.006, a.c2, 4));
    for (let i = 0; i < 4; i++) partes.push(cilEntre({ x: L * (0.3 - i * 0.07), y: R * 0.2, z: sd * R * 0.7 }, { x: L * (0.28 - i * 0.08), y: -R * 0.5, z: sd * R * 1.5 }, R * 0.07, R * 0.05, a.c1, 4));
  }
  const cola = new THREE.Mesh(unir([forma2D([[0, 0], [-R * 1.6, R * 1.0], [-R * 2.4, 0], [-R * 1.6, -R * 1.0]], a.c1)].map((g) => g.rotateX(Math.PI / 2))), M.vc);
  cola.position.set(-L * 0.46, R * 0.2, 0);
  return armarModelo([new THREE.Mesh(unir(partes), M.vc)], cola, L, 'langosta');
}
function crearMedusa(sp, L) {
  const a = sp.arte, M = matCria();
  const R = L * 0.34;
  const cup = new THREE.SphereGeometry(R, 12, 8, 0, TAU, 0, Math.PI / 2);
  const dom = colorear(cup, mezcla(a.c1, '#ffffff', 0.3).getStyle());
  const partes = [dom];
  for (let i = 0; i < 6; i++) { const th = (i / 6) * TAU; partes.push(cilEntre({ x: Math.cos(th) * R * 0.8, y: 0, z: Math.sin(th) * R * 0.8 }, { x: Math.cos(th) * R * 0.6, y: -R * 2.4, z: Math.sin(th) * R * 0.6 }, 0.012, 0.004, a.c2, 3)); }
  for (let i = 0; i < 4; i++) { const th = (i / 4) * TAU + 0.4; partes.push(cilEntre({ x: Math.cos(th) * R * 0.2, y: 0, z: Math.sin(th) * R * 0.2 }, { x: Math.cos(th) * R * 0.4, y: -R * 1.3, z: Math.sin(th) * R * 0.4 }, R * 0.1, R * 0.03, a.c2, 4)); }
  const mod = armarModelo([new THREE.Mesh(unir(partes), M.medusa)], null, L, 'medusa');
  mod.animExtra = (dt, v, t, fase) => { const s = 1 + Math.sin(t * 2.6 + fase) * 0.1; mod.mallas[0].scale.set(s, 1 / s * 0.5 + 0.5, s); };
  return mod;
}
function crearRaya(sp, L) {
  const a = sp.arte, M = matCria();
  const W = L * 0.5;
  const ala = (sd) => {
    const pts = [[L * 0.28, 0], [L * 0.1, sd * W * 0.8], [-L * 0.12, sd * W * 1.0], [-L * 0.2, sd * W * 0.4], [-L * 0.2, 0]];
    const s = new THREE.Shape();
    pts.forEach((p, i) => (i ? s.lineTo(p[0], p[1]) : s.moveTo(p[0], p[1])));
    const g = colorear(new THREE.ShapeGeometry(s), mezcla(a.c1, a.c2, 0.2).getStyle());
    g.rotateX(-Math.PI / 2);
    return g;
  };
  const alas = [new THREE.Mesh(ala(1), M.vc), new THREE.Mesh(ala(-1), M.vc)];
  const centro = new THREE.Mesh(unir([esf(L * 0.12, a.c1, L * 0.05, 0, 0, 1.6, 0.35, 0.9, 1), esf(L * 0.02, '#10151c', L * 0.22, L * 0.03, L * 0.04, 1, 1, 1, 0), esf(L * 0.02, '#10151c', L * 0.22, L * 0.03, -L * 0.04, 1, 1, 1, 0), cilEntre({ x: -L * 0.15, y: 0, z: 0 }, { x: -L * 0.65, y: 0, z: 0 }, L * 0.018, L * 0.006, '#495a6a', 4)]), M.vc);
  const mod = armarModelo([centro, ...alas], null, L, 'raya');
  mod.animExtra = (dt, v, t, fase) => { const f = Math.sin(t * 3.2 + fase) * 0.28; alas[0].rotation.x = f; alas[1].rotation.x = -f; };
  return mod;
}
// Cuerpos largos que ondulan: moreno, cinta, anguila, leviatán
function crearSerpiente(sp, L, o = {}) {
  const a = sp.arte, M = matCria();
  const n = o.n || 18, grosor = o.grosor || 0.06;
  const segs = [];
  const grupo = new THREE.Group();
  const mod = { grupo, mallas: [], cola: null, L, tipo: 'serpiente', modo: 'color', luces: [] };
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1);
    const r = L * grosor * (u < 0.08 ? 0.8 + u * 2.5 : 1) * Math.pow(1 - u, 0.5) + 0.01;
    const sl = L / n;
    const partes = [esf(r, mezcla(a.c1, a.c2, (i % 2) * 0.12).getStyle(), 0, 0, 0, sl / r * 0.68, 1, 1, 1), esf(r * 0.8, a.c2, 0, -r * 0.45, 0, sl / r * 0.6, 0.6, 0.8, 1)];
    if (o.aleta !== false) partes.push(forma2D([[sl * 0.5, r * 0.5], [0, r * (1.0 + (o.altoAleta || 0.7) * (0.6 + 0.4 * Math.sin(i * 1.7)))], [-sl * 0.5, r * 0.5]], o.cAleta || a.c2));
    if (i === 0) {
      for (const sd of [-1, 1]) partes.push(esf(r * 0.28, '#ffffff', sl * 0.1, r * 0.35, sd * r * 0.6, 1, 1, 1, 0), esf(r * 0.16, '#10151c', sl * 0.2, r * 0.35, sd * r * 0.7, 1, 1, 1, 0));
      for (let k = 0; k < 4; k++) for (const sd of [-1, 1]) partes.push(mover(colorear(new THREE.ConeGeometry(r * 0.08, r * 0.3, 4), '#ffffff'), sl * (0.3 - k * 0.12), -r * 0.35, sd * r * 0.5, 0, 0, Math.PI));
    }
    const m = new THREE.Mesh(unir(partes), M.vc);
    m.userData.matColor = M.vc;
    grupo.add(m);
    mod.mallas.push(m);
    segs.push({ m, u, sl });
  }
  const amp = L * (o.amp || 0.07), k = o.k || 1.5;
  mod.segs = segs;
  mod.animar = (dt, v, t, fase) => {
    const vel = clamp(v / (L * 0.4 + 1), 0.25, 1.4);
    let x = L * 0.5;
    let prevY = 0, prevZ = 0, px = x;
    for (let i = 0; i < segs.length; i++) {
      const s = segs[i];
      const zz = amp * Math.sin(s.u * k * TAU - t * (3 + vel * 3) + fase) * (0.35 + 0.65 * s.u);
      x -= s.sl;
      s.m.position.set(x, 0, zz);
      const dx = x - px, dz = zz - prevZ;
      s.m.rotation.y = -Math.atan2(dz, dx) + Math.PI;
      px = x; prevZ = zz; prevY = 0;
    }
    void prevY;
  };
  mod.animar(0, 5, 0, 0);
  return mod;
}
function crearTiburon(sp, L, jefe) {
  const a = sp.arte, M = matCria();
  const v = a.variante || 'gris';
  const Wd = L * (v === 'martillo' ? 0.09 : 0.11), Hh = L * 0.1;
  const fnPerf = (u) => { const p = u < 0.28 ? Math.pow(u / 0.28, 0.6) : lerp(1, 0.1, Math.pow(smooth(0.28, 1, u), 1.1)); return { a: Hh * p, b: Wd * p }; };
  const c1 = new THREE.Color(a.c1), c2 = new THREE.Color(a.c2);
  const fnCol = (c, vv) => { c.copy(c1).lerp(c2, smooth(0.0, -0.9, vv.up) * 0.95 + (vv.up < -0.3 ? 0.4 : 0)); c.multiplyScalar(0.88 + 0.14 * vv.up); };
  const partes = [cuerpoEstaciones(L, Hh, 16, fnPerf, fnCol, 10, 0.5, -0.34)];
  const dorsal = forma2D([[0.1 * L, Hh * 0.85], [-0.02 * L, Hh * 3.0], [-0.14 * L, Hh * 0.8]], mezcla(a.c1, '#000000', 0.1).getStyle());
  partes.push(dorsal, forma2D([[-0.2 * L, Hh * 0.35], [-0.24 * L, Hh * 0.9], [-0.28 * L, Hh * 0.3]], a.c1));
  for (const sd of [-1, 1]) {
    const g = forma2D([[0, 0], [-0.16 * L, 0], [-0.04 * L, Hh * 1.7]], mezcla(a.c1, '#000000', 0.08).getStyle());
    g.rotateX(sd * 1.35);
    partes.push(mover(g, 0.16 * L, -Hh * 0.45, sd * Wd * 0.8));
    partes.push(esf(Math.max(0.03, L * 0.012), '#10151c', 0.4 * L, Hh * 0.25, sd * Wd * 0.65, 1, 1, 1, 0));
    for (let i = 0; i < 5; i++) partes.push(caja(L * 0.004, Hh * 0.55, L * 0.003, '#3a4654', (0.2 - i * 0.012) * L, 0, sd * Wd * 0.9));
  }
  if (v === 'martillo') { partes.push(caja(L * 0.07, Hh * 0.55, Wd * 4.4, a.c1, L * 0.46, -Hh * 0.05, 0), esf(L * 0.012, '#10151c', L * 0.49, Hh * 0.05, Wd * 2.1, 1, 1, 1, 0), esf(L * 0.012, '#10151c', L * 0.49, Hh * 0.05, -Wd * 2.1, 1, 1, 1, 0)); }
  if (v === 'duende') partes.push(mover(colorear(new THREE.ConeGeometry(Hh * 0.45, L * 0.2, 4), a.c1), L * 0.58, Hh * 0.2, 0, 0, 0, -Math.PI / 2));
  if (jefe) {
    for (let i = 0; i < 8; i++) for (const sd of [-1, 1]) partes.push(mover(colorear(new THREE.ConeGeometry(L * 0.006, L * 0.028, 4), '#ffffff'), L * (0.49 - i * 0.012), -Hh * 0.3, sd * Wd * (0.2 + i * 0.07), 0, 0, Math.PI));
    partes.push(forma2D([[0.38 * L, Hh * 0.4], [0.43 * L, Hh * 0.25], [0.4 * L, Hh * 0.1]], '#7a1a24'));
  }
  const cola = new THREE.Mesh(forma2D([[0, Hh * 0.2], [-0.07 * L, Hh * 1.4], [-0.22 * L, Hh * 2.6], [-0.15 * L, Hh * 0.6], [-0.13 * L, -Hh * 0.05], [-0.18 * L, -Hh * 1.3], [-0.06 * L, -Hh * 0.55], [0, -Hh * 0.2]], mezcla(a.c1, '#000000', 0.12).getStyle()), M.vc);
  cola.position.set(-0.34 * L, 0, 0);
  return armarModelo([new THREE.Mesh(unir(partes), M.vc)], cola, L, 'tiburon');
}
function crearGota(sp, L) {
  const a = sp.arte, M = matCria();
  const R = L * 0.4;
  const partes = [esf(R, a.c1, 0, 0, 0, 1.0, 0.85, 0.9, 2), esf(R * 0.6, a.c2, R * 0.2, -R * 0.35, 0, 1.2, 0.5, 1, 1), esf(R * 0.28, mezcla(a.c1, '#c46070', 0.4).getStyle(), R * 0.95, -R * 0.1, 0, 1.3, 1, 1, 1)];
  for (const sd of [-1, 1]) partes.push(esf(R * 0.1, '#10151c', R * 0.7, R * 0.2, sd * R * 0.45, 1, 1, 1, 0));
  partes.push(mover(colorear(new THREE.TorusGeometry(R * 0.3, R * 0.025, 5, 12, Math.PI), '#7a2a38'), R * 0.8, -R * 0.4, 0, 0, Math.PI / 2, Math.PI));
  const cola = new THREE.Mesh(forma2D([[0, R * 0.15], [-R * 0.5, R * 0.3], [-R * 0.6, 0], [-R * 0.5, -R * 0.3], [0, -R * 0.15]], a.c1), M.vc);
  cola.position.set(-R * 0.95, 0, 0);
  return armarModelo([new THREE.Mesh(unir(partes), M.vc)], cola, L, 'gota');
}
function crearRape(sp, L) {
  const a = sp.arte, M = matCria();
  const R = L * 0.36;
  const partes = [esf(R, a.c1, 0, 0, 0, 1.1, 0.95, 1, 2), esf(R * 0.8, a.c2, R * 0.2, -R * 0.4, 0, 1.2, 0.55, 0.95, 1)];
  partes.push(mover(colorear(new THREE.BoxGeometry(R * 1.3, R * 0.25, R * 1.5), '#1a0d0a'), R * 0.55, -R * 0.15, 0));
  for (let i = 0; i < 7; i++) for (const sd of [-1, 1]) { partes.push(mover(colorear(new THREE.ConeGeometry(R * 0.05, R * 0.3, 4), '#f4f0e0'), R * (1.05 - i * 0.14), -R * 0.0, sd * R * 0.5 * (0.4 + i * 0.1), 0, 0, Math.PI)); partes.push(mover(colorear(new THREE.ConeGeometry(R * 0.05, R * 0.26, 4), '#f4f0e0'), R * (1.0 - i * 0.14), -R * 0.32, sd * R * 0.5 * (0.4 + i * 0.1))); }
  for (const sd of [-1, 1]) partes.push(esf(R * 0.18, '#ffe9a0', R * 0.7, R * 0.45, sd * R * 0.6, 1, 1, 1, 1), esf(R * 0.1, '#10151c', R * 0.82, R * 0.45, sd * R * 0.66, 1, 1, 1, 0));
  partes.push(cilEntre({ x: R * 0.3, y: R * 0.7, z: 0 }, { x: R * 0.9, y: R * 1.6, z: 0 }, R * 0.04, R * 0.03, '#2a1f1a', 5), cilEntre({ x: R * 0.9, y: R * 1.6, z: 0 }, { x: R * 1.5, y: R * 1.5, z: 0 }, R * 0.03, R * 0.025, '#2a1f1a', 5));
  const lampara = new THREE.Mesh(new THREE.SphereGeometry(R * 0.16, 10, 8), M.luz);
  lampara.position.set(R * 1.55, R * 1.45, 0);
  const cola = new THREE.Mesh(forma2D([[0, R * 0.2], [-R * 0.8, R * 0.5], [-R * 0.9, 0], [-R * 0.8, -R * 0.5], [0, -R * 0.2]], a.c1), M.vc);
  cola.position.set(-R * 1.0, 0, 0);
  const mod = armarModelo([new THREE.Mesh(unir(partes), M.vc)], cola, L, 'rape', { luces: [lampara] });
  mod.grupo.add(lampara);
  mod.animExtra = (dt, v, t) => { lampara.scale.setScalar(1 + 0.2 * Math.sin(t * 5)); };
  return mod;
}
function crearCalamar(sp, L) {
  const a = sp.arte, M = matCria();
  const R = L * 0.12;
  const partes = [mover(colorear(new THREE.ConeGeometry(R * 1.1, L * 0.55, 8), a.c1), -L * 0.12, 0, 0, 0, 0, Math.PI / 2), esf(R * 0.95, a.c2, L * 0.2, 0, 0, 1.1, 1, 1, 1)];
  for (const sd of [-1, 1]) {
    partes.push(forma2D([[-L * 0.25, 0], [-L * 0.4, sd * R * 1.9], [-L * 0.46, 0]], mezcla(a.c1, '#ffffff', 0.1).getStyle()).rotateX(Math.PI / 2));
    partes.push(esf(R * 0.34, '#ffe7b0', L * 0.24, R * 0.3, sd * R * 0.8, 1, 1, 1, 1), esf(R * 0.2, '#10151c', L * 0.27, R * 0.3, sd * R * 0.92, 1, 1, 1, 0));
    partes.push(cilEntre({ x: L * 0.3, y: 0, z: sd * R * 0.2 }, { x: L * 0.78, y: 0, z: sd * R * 0.5 }, R * 0.06, R * 0.04, a.c2, 5), esf(R * 0.18, a.c2, L * 0.78, 0, sd * R * 0.5, 1.5, 1, 1, 0));
  }
  for (let i = 0; i < 8; i++) { const th = (i / 8) * TAU; partes.push(cilEntre({ x: L * 0.3, y: Math.cos(th) * R * 0.3, z: Math.sin(th) * R * 0.3 }, { x: L * 0.55, y: Math.cos(th) * R * 0.5, z: Math.sin(th) * R * 0.5 }, R * 0.1, R * 0.03, a.c1, 5)); }
  return armarModelo([new THREE.Mesh(unir(partes), M.vc)], null, L, 'calamar');
}
function crearCofre(sp, L) {
  const M = matCria();
  const s = L * 0.5;
  const partes = [caja(s * 1.6, s, s, '#7a4a22', 0, s * 0.5, 0), caja(s * 1.7, s * 0.2, s * 1.1, '#f2c94c', 0, s * 0.62, 0), mover(colorear(new THREE.CylinderGeometry(s * 0.5, s * 0.5, s * 1.6, 10, 1, false, 0, Math.PI), '#a8672e'), 0, s * 1.0, 0, 0, 0, Math.PI / 2), caja(s * 0.2, s * 0.35, s * 0.1, '#ffe58a', 0, s * 0.75, s * 0.52), esf(s * 0.08, '#fff6c0', s * 0.5, s * 1.45, s * 0.2, 1, 1, 1, 0)];
  return armarModelo([new THREE.Mesh(unir(partes), M.vc)], null, L, 'cofre');
}
function crearBotaItem(sp, L) {
  const M = matCria();
  const partes = [caja(L * 0.3, L * 0.7, L * 0.3, '#6b4a2b', 0, L * 0.35, 0), caja(L * 0.3, L * 0.22, L * 0.7, '#6b4a2b', 0, L * 0.12, L * 0.2), caja(L * 0.34, L * 0.06, L * 0.74, '#3b2814', 0, 0, L * 0.2)];
  return armarModelo([new THREE.Mesh(unir(partes), M.vc)], null, L, 'bota');
}
function crearLataItem(sp, L) {
  const M = matCria();
  return armarModelo([new THREE.Mesh(unir([cil(L * 0.2, L * 0.2, L * 0.5, '#b0603a', 0, L * 0.25, 0, 10), cil(L * 0.21, L * 0.21, L * 0.2, '#d9d2c4', 0, L * 0.25, 0, 10)]), M.vc)], null, L, 'lata');
}
function crearNeumatico(sp, L) {
  const M = matCria();
  const g = colorear(new THREE.TorusGeometry(L * 0.35, L * 0.14, 8, 14), '#2a2f36');
  g.rotateX(Math.PI / 2);
  return armarModelo([new THREE.Mesh(g, M.vc)], null, L, 'neumatico');
}
function crearBotellaItem(sp, L) {
  const M = matCria();
  const partes = [cil(L * 0.12, L * 0.12, L * 0.5, '#78dca0', 0, L * 0.25, 0, 8), cil(L * 0.05, L * 0.07, L * 0.2, '#78dca0', 0, L * 0.6, 0, 8), cil(L * 0.055, L * 0.055, L * 0.06, '#8a5a2b', 0, L * 0.72, 0, 6), cil(L * 0.07, L * 0.07, L * 0.3, '#f4ecd0', 0, L * 0.25, 0, 6)];
  const g = unir(partes);
  g.rotateZ(Math.PI / 2);
  return armarModelo([new THREE.Mesh(g, M.vc)], null, L, 'botella');
}

const CONSTRUCTORES = {
  pez: crearPezGenerico, camaron: crearCamaron, cangrejo: crearCangrejo, estrella: crearEstrella, globo: crearGlobo, pulpo: crearPulpo,
  langosta: crearLangosta, medusa: crearMedusa, raya: crearRaya, tiburon: crearTiburon, gota: crearGota, rape: crearRape, calamar: crearCalamar,
  cofre: crearCofre, bota: crearBotaItem, lata: crearLataItem, neumatico: crearNeumatico, botella: crearBotellaItem,
  morena: (sp, L) => crearSerpiente(sp, L, { n: 16, grosor: 0.05, amp: 0.07, k: 1.4, altoAleta: 0.5 }),
  cinta: (sp, L) => crearSerpiente(sp, L, { n: 22, grosor: 0.022, amp: 0.05, k: 2.2, altoAleta: 1.6 }),
};

// Crea el modelo de una especie con su largo en metros
function crearModeloEspecie(sp, largo) {
  const f = CONSTRUCTORES[sp.arte.forma] || crearPezGenerico;
  return f(sp, largo);
}
