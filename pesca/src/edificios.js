'use strict';
// Edificios 3D: casas, casino, faro, muelle y el barco roto. Cada uno es un grupo con pocas mallas fusionadas.

const EDI = { grupos: {}, haz: null, neon: null, bulbos: null, barcoRoto: null, barcoListo: null, ventanas: [] };

function crearCasa(e) {
  const { w, d, h } = e;
  const y0 = 0.35;
  const L = [], V = [];
  L.push(caja(w + 0.4, 0.9, d + 0.4, '#a89a86', 0, 0, 0));
  L.push(caja(w, h, d, e.pared, 0, y0 + h / 2, 0));
  // listones de la pared
  for (let x = -w / 2 + 0.8; x < w / 2; x += 0.9) L.push(caja(0.06, h - 0.1, d + 0.04, shadeHex(e.pared, -0.1), x, y0 + h / 2, 0));
  // puerta con marco y escalón
  L.push(caja(1.7, 2.7, 0.18, '#f2ead2', 0, y0 + 1.35, d / 2 + 0.03));
  L.push(caja(1.35, 2.45, 0.2, '#6b4424', 0, y0 + 1.25, d / 2 + 0.06));
  L.push(caja(0.2, 2.45, 0.22, '#80502c', 0.35, y0 + 1.25, d / 2 + 0.07));
  L.push(esf(0.09, '#e8c860', -0.45, y0 + 1.2, d / 2 + 0.2, 1, 1, 1, 0));
  L.push(caja(2.4, 0.22, 1.0, '#9c8f7a', 0, y0 - 0.05, d / 2 + 0.55));
  // ventanas
  for (const sx of [-1, 1]) {
    const vx = sx * w * 0.31, vy = y0 + h * 0.58;
    V.push(caja(1.25, 1.2, 0.12, '#ffffff', vx, vy, d / 2 + 0.05));
    L.push(caja(1.55, 0.14, 0.2, '#f2ead2', vx, vy + 0.67, d / 2 + 0.06), caja(1.55, 0.14, 0.26, '#f2ead2', vx, vy - 0.67, d / 2 + 0.1), caja(0.14, 1.4, 0.2, '#f2ead2', vx - 0.7, vy, d / 2 + 0.06), caja(0.14, 1.4, 0.2, '#f2ead2', vx + 0.7, vy, d / 2 + 0.06));
    L.push(caja(0.08, 1.2, 0.16, '#f2ead2', vx, vy, d / 2 + 0.07), caja(1.25, 0.08, 0.16, '#f2ead2', vx, vy, d / 2 + 0.07));
    L.push(caja(0.5, 1.3, 0.1, e.techo2, vx - 1.0, vy, d / 2 + 0.05), caja(0.5, 1.3, 0.1, e.techo2, vx + 1.0, vy, d / 2 + 0.05));
  }
  // costados con ventana
  for (const sx of [-1, 1]) V.push(caja(0.12, 1.1, 1.2, '#ffffff', sx * (w / 2 + 0.03), y0 + h * 0.58, -d * 0.1));
  // techo
  const rh = d * 0.5 + 0.5;
  L.push(prisma(w + 1.5, rh, d + 1.7, e.techo, 0, y0 + h, 0));
  L.push(caja(w + 1.6, 0.16, d + 1.9, e.techo2, 0, y0 + h - 0.02, 0));
  L.push(caja(w + 1.7, 0.14, 0.34, shadeHex(e.techo, 0.25), 0, y0 + h + rh, 0));
  if (e.paja) { for (let i = 0; i < 4; i++) L.push(prisma(w + 1.2, rh * 0.18, d + 1.8, shadeHex(e.techo, -0.12 + i * 0.05), 0, y0 + h + rh * (0.2 + i * 0.18) - 0.1, 0)); }
  if (e.id === 'mercado') { L.push(caja(1.0, 2.6, 1.0, '#8c5a46', w / 2 - 1.8, y0 + h + rh * 0.5, -0.8), caja(1.3, 0.25, 1.3, '#6a4030', w / 2 - 1.8, y0 + h + rh * 0.5 + 1.4, -0.8)); }
  // toldo a rayas
  if (e.toldo) {
    const n = 10, ancho = (w - 1.2) / n;
    for (let i = 0; i < n; i++) {
      const g = caja(ancho + 0.01, 0.1, 1.5, e.toldo[i % 2], -w / 2 + 0.6 + (i + 0.5) * ancho, y0 + h * 0.84, d / 2 + 0.85, 0, 0, 0.42);
      L.push(g);
    }
  }
  const grupo = new THREE.Group();
  const cuerpo = new THREE.Mesh(unir(L), MAT.vc);
  cuerpo.castShadow = true; cuerpo.receiveShadow = true;
  const vidrios = new THREE.Mesh(unir(V), MAT.ventana);
  grupo.add(cuerpo, vidrios);
  if (e.cartel) {
    const tex = texCartel(e.cartel, 320, 90, '#3a2412', '#ffe9a8', '#e8c860');
    const m = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 });
    const cw = Math.min(w - 1, e.cartel.length * 0.55 + 1.6);
    const cartel = new THREE.Mesh(new THREE.BoxGeometry(cw, 0.8, 0.14), [m, m, m, m, m, m]);
    cartel.position.set(0, y0 + h * 0.95, d / 2 + 1.0);
    cartel.castShadow = true;
    grupo.add(cartel);
  }
  grupo.position.set(e.x, e.base - 0.35, e.z);
  return grupo;
}

function crearCasino(e) {
  const { w, d, h } = e;
  const y0 = 0.35;
  const L = [], V = [], N = [];
  L.push(caja(w + 0.6, 0.9, d + 0.6, '#c9bfa8', 0, 0, 0));
  L.push(caja(w, h, d, e.pared, 0, y0 + h / 2, 0));
  for (const hy of [0.9, h * 0.62]) L.push(caja(w + 0.12, 0.22, d + 0.12, '#e8c860', 0, y0 + hy, 0));
  // techo plano con parapeto
  L.push(caja(w + 0.8, 0.5, d + 0.8, '#2f1948', 0, y0 + h + 0.25, 0));
  L.push(caja(w + 0.9, 0.2, d + 0.9, '#e8c860', 0, y0 + h + 0.55, 0));
  L.push(caja(w * 0.5, 2.4, d * 0.6, '#3a2160', 0, y0 + h + 1.7, -d * 0.1));
  // pórtico con columnas
  L.push(caja(w * 0.62, 0.45, 2.8, '#2f1948', 0, y0 + h * 0.74, d / 2 + 1.4));
  L.push(caja(w * 0.62 + 0.1, 0.16, 2.9, '#e8c860', 0, y0 + h * 0.74 + 0.28, d / 2 + 1.4));
  for (const sx of [-1, -0.34, 0.34, 1]) L.push(cil(0.34, 0.4, h * 0.74, '#f6ecd2', sx * w * 0.29, y0 + h * 0.37, d / 2 + 2.3, 10), cil(0.5, 0.5, 0.2, '#e8c860', sx * w * 0.29, y0 + h * 0.74 - 0.1, d / 2 + 2.3, 10));
  // puerta doble y alfombra
  L.push(caja(3.2, 3.2, 0.2, '#e8c860', 0, y0 + 1.6, d / 2 + 0.06));
  L.push(caja(1.4, 3.0, 0.24, '#7a3ea8', -0.75, y0 + 1.5, d / 2 + 0.1), caja(1.4, 3.0, 0.24, '#7a3ea8', 0.75, y0 + 1.5, d / 2 + 0.1));
  L.push(esf(0.12, '#e8c860', -0.2, y0 + 1.5, d / 2 + 0.28, 1, 1, 1, 0), esf(0.12, '#e8c860', 0.2, y0 + 1.5, d / 2 + 0.28, 1, 1, 1, 0));
  L.push(caja(2.6, 0.08, 4.4, '#c0392b', 0, y0 - 0.02, d / 2 + 2.4));
  // ventanales con luz de neón
  for (const sx of [-1, 1]) {
    const vx = sx * w * 0.3;
    L.push(caja(3.3, 2.5, 0.2, '#e8c860', vx, y0 + h * 0.5, d / 2 + 0.06));
    N.push(caja(3.0, 2.2, 0.12, '#ffffff', vx, y0 + h * 0.5, d / 2 + 0.16));
  }
  // marquesina con bombitas
  const bulbos = [];
  const nb = 18;
  for (let i = 0; i < nb; i++) bulbos.push(esf(0.16, '#fff3b0', -w / 2 + 0.5 + (i * (w - 1)) / (nb - 1), y0 + h + 0.95, d / 2 + 0.4, 1, 1, 1, 0));
  const grupo = new THREE.Group();
  const cuerpo = new THREE.Mesh(unir(L), MAT.vc);
  cuerpo.castShadow = true; cuerpo.receiveShadow = true;
  const neonV = new THREE.Mesh(unir(N), new THREE.MeshStandardMaterial({ color: '#ff4fc8', emissive: new THREE.Color('#ff3fb8'), emissiveIntensity: 0.9, roughness: 0.3 }));
  const bul = new THREE.Mesh(unir(bulbos), new THREE.MeshStandardMaterial({ color: '#fff3b0', emissive: new THREE.Color('#ffe58a'), emissiveIntensity: 1.2 }));
  grupo.add(cuerpo, neonV, bul);
  EDI.bulbos = bul;
  // letrero de neón
  const tex = texNeon('CASINO', 'EL ANZUELO DE ORO');
  const sm = new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: new THREE.Color('#ffffff'), emissiveIntensity: 1.1, roughness: 0.5 });
  const cartel = new THREE.Mesh(new THREE.BoxGeometry(9.6, 3.0, 0.3), [new THREE.MeshStandardMaterial({ color: '#1b0f2e' }), new THREE.MeshStandardMaterial({ color: '#1b0f2e' }), new THREE.MeshStandardMaterial({ color: '#1b0f2e' }), new THREE.MeshStandardMaterial({ color: '#1b0f2e' }), sm, sm]);
  cartel.position.set(0, y0 + h + 3.9, d / 2 - 0.4);
  cartel.castShadow = true;
  grupo.add(cartel);
  EDI.neon = sm;
  for (const sx of [-1, 1]) { const pt = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.4, 0.3), MAT.vc.clone()); pt.material.vertexColors = false; pt.material.color.set('#3a2412'); pt.position.set(sx * 3.4, y0 + h + 1.9, d / 2 - 0.4); grupo.add(pt); }
  grupo.position.set(e.x, e.base - 0.35, e.z);
  return grupo;
}
function texNeon(t1, t2) {
  const cv = makeCanvas(512, 160), g = cv.getContext('2d');
  g.fillStyle = '#1b0f2e'; g.fillRect(0, 0, 512, 160);
  g.strokeStyle = '#e8c860'; g.lineWidth = 8; g.strokeRect(6, 6, 500, 148);
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.shadowColor = '#ff2bb0'; g.shadowBlur = 24;
  g.fillStyle = '#ff8ad8'; g.font = `110px ${FUENTE_TIT}`; g.fillText(t1, 256, 70);
  g.shadowBlur = 0; g.fillStyle = '#ffffff'; g.fillText(t1, 256, 70);
  g.fillStyle = '#7cf3ff'; g.font = `32px ${FUENTE_TIT}`; g.fillText(t2, 256, 134);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

function crearFaro(e) {
  const L = [], vid = [];
  const hT = e.h;
  L.push(cil(4.0, 4.4, 1.0, '#8f9aa4', 0, 0.2, 0, 14));
  const bandas = 7;
  for (let i = 0; i < bandas; i++) {
    const r0 = lerp(2.5, 1.55, i / bandas), r1 = lerp(2.5, 1.55, (i + 1) / bandas);
    L.push(cil(r1, r0, hT / bandas, i % 2 ? '#eef2f4' : '#d8443a', 0, 0.7 + (i + 0.5) * (hT / bandas), 0, 14));
  }
  const gy = 0.7 + hT;
  L.push(cil(2.5, 2.1, 0.4, '#39424c', 0, gy + 0.2, 0, 14));
  L.push(cil(2.3, 2.3, 0.1, '#39424c', 0, gy + 1.15, 0, 14));
  for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; L.push(cil(0.05, 0.05, 1.0, '#39424c', Math.cos(a) * 2.25, gy + 0.7, Math.sin(a) * 2.25, 5)); }
  L.push(cil(1.1, 1.1, 0.12, '#39424c', 0, gy + 0.45, 0, 10));
  vid.push(cil(1.05, 1.05, 1.9, '#ffffff', 0, gy + 1.45, 0, 10));
  L.push(cil(0.12, 1.4, 1.5, '#d8443a', 0, gy + 3.0, 0, 10));
  L.push(cono(1.5, 1.4, '#d8443a', 0, gy + 3.4, 0, 10));
  L.push(caja(1.2, 2.2, 0.3, '#6b4424', 0, 1.6, 2.2));
  const g = new THREE.Group();
  const m = new THREE.Mesh(unir(L), MAT.vc);
  m.castShadow = true; m.receiveShadow = true;
  const lamp = new THREE.Mesh(unir(vid), MAT.lampara);
  g.add(m, lamp);
  // haz de luz (cono aditivo que gira de noche)
  const haz = new THREE.Mesh(new THREE.ConeGeometry(14, 120, 16, 1, true), new THREE.MeshBasicMaterial({ color: '#fff0b0', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }));
  haz.geometry.translate(0, -60, 0);
  haz.rotation.z = Math.PI / 2;
  const pivote = new THREE.Group();
  pivote.add(haz);
  pivote.position.set(0, gy + 1.45, 0);
  g.add(pivote);
  EDI.haz = { pivote, mat: haz.material };
  g.position.set(e.x, e.base - 0.35, e.z);
  return g;
}

function crearMuelle(escena) {
  const { z0, z1, ancho, alto } = MUELLE;
  const L = [];
  const largo = z1 - z0;
  const n = Math.floor(largo / 0.34);
  for (let i = 0; i < n; i++) {
    const c = ['#b6855a', '#a97a50', '#bf8f62', '#a07048'][i % 4];
    L.push(caja(ancho, 0.1, 0.3, c, 0, alto, z0 + 0.17 + i * 0.34));
  }
  for (const sx of [-1.2, 0, 1.2]) L.push(caja(0.22, 0.28, largo, '#5a3a20', sx, alto - 0.2, (z0 + z1) / 2));
  for (let z = z0 + 1; z <= z1; z += 3) {
    for (const sx of [-1, 1]) L.push(cil(0.2, 0.22, 7, '#4a2e18', sx * (ancho / 2 - 0.05), alto - 2.8, z, 7));
  }
  for (let z = z0 + 3; z <= z1; z += 3) {
    for (const sx of [-1, 1]) L.push(cil(0.09, 0.1, 1.0, '#6b4424', sx * (ancho / 2 - 0.05), alto + 0.55, z, 6));
    for (const sx of [-1, 1]) if (z + 3 <= z1) L.push(caja(0.06, 0.06, 3, '#e1cfa0', sx * (ancho / 2 - 0.05), alto + 0.9, z + 1.5));
  }
  // bolardos
  for (const z of [z0 + 22, z0 + 30]) for (const sx of [-1, 1]) L.push(cil(0.14, 0.16, 0.45, '#3a3f46', sx * (ancho / 2 - 0.2), alto + 0.3, z, 8));
  const m = new THREE.Mesh(unir(L), MAT.vc);
  m.castShadow = true; m.receiveShadow = true;
  escena.add(m);
  // farol del final del muelle
  const f = [cil(0.08, 0.1, 3.4, '#3e4650', 0, 1.7, 0, 6), caja(0.5, 0.12, 0.5, '#3e4650', 0, 3.45, 0), cono(0.38, 0.35, '#c0392b', 0, 4.15, 0, 4)];
  const fm = new THREE.Mesh(unir(f), MAT.vc);
  fm.position.set(ancho / 2 - 0.2, alto, z1 - 0.3);
  fm.castShadow = true;
  escena.add(fm);
  const lm = new THREE.Mesh(unir([esf(0.26, '#ffffff', 0, 3.75, 0, 1, 1.2, 1, 1)]), MAT.lampara);
  lm.position.copy(fm.position);
  escena.add(lm);
}

function crearBarcoRoto(e, escena) {
  const roto = new THREE.Group();
  const L = [];
  const casco = crearCascoBote(11.5, 3.9, 2.2, '#8a5a30', '#c9a56b');
  L.push(mover(casco, 0, 1.0, 0));
  L.push(caja(10, 0.12, 3.3, '#c9a56b', 0, 0.9, 0));
  L.push(cil(0.2, 0.26, 4, '#6b4424', -1, 3.2, 0, 6, 0.1, 0, 0.18));
  L.push(caja(2.4, 0.1, 0.7, '#e8e2d2', -1.5, 4.3, 0.4, 0.4, 0.8, 0.2));
  L.push(caja(0.35, 0.9, 1.2, '#2b1a0e', 1.2, 1.4, 0.8));
  const mm = new THREE.Mesh(unir(L), MAT.vc);
  mm.castShadow = true; mm.receiveShadow = true;
  roto.add(mm);
  const bien = new THREE.Group();
  const L2 = [];
  L2.push(mover(crearCascoBote(11.5, 3.9, 2.2, '#8a5a30', '#c9a56b'), 0, 1.0, 0));
  L2.push(caja(10, 0.12, 3.3, '#c9a56b', 0, 0.9, 0));
  L2.push(caja(11.6, 0.18, 0.5, '#2f6fa8', 0, 2.0, 1.78));
  L2.push(cil(0.2, 0.26, 9, '#6b4424', 0, 5.4, 0, 6));
  L2.push(caja(0.08, 5.2, 4.4, '#fbfbf5', 0.4, 6.0, 0, 0, 0, 0));
  L2.push(cono(0.5, 1.2, '#ff5a4d', 0, 10.3, 0, 4, 0, 0, Math.PI / 2));
  L2.push(caja(2.4, 1.6, 2.0, '#d9a25a', 3.2, 1.9, 0));
  const bm = new THREE.Mesh(unir(L2), MAT.vc);
  bm.castShadow = true; bm.receiveShadow = true;
  bien.add(bm);
  bien.visible = false;
  const g = new THREE.Group();
  g.add(roto, bien);
  const y = Math.max(0.4, H(e.x, e.z));
  g.position.set(e.x, y - 0.2, e.z);
  g.rotation.y = e.rot || 0;
  g.rotation.z = -0.07;
  escena.add(g);
  EDI.barcoRoto = roto; EDI.barcoListo = bien;
}
function actualizarBarcoFinal() {
  if (!EDI.barcoRoto) return;
  EDI.barcoRoto.visible = !G.barcoListo;
  EDI.barcoListo.visible = !!G.barcoListo;
}

function crearEdificios(escena) {
  for (const e of MUN.edificios) {
    let g;
    if (e.kind === 'casino') g = crearCasino(e);
    else if (e.kind === 'faro') g = crearFaro(e);
    else g = crearCasa(e);
    EDI.grupos[e.id] = g;
    escena.add(g);
  }
  crearMuelle(escena);
  const barco = MUN.props.find((p) => p.kind === 'barco');
  if (barco) crearBarcoRoto(barco, escena);
}
function actualizarEdificios(dt) {
  if (EDI.haz) {
    EDI.haz.pivote.rotation.y = J.t * 0.8;
    EDI.haz.mat.opacity = clamp(J.noche * 1.4 - 0.3, 0, 1) * 0.24 * (1 - J.clima.lluvia * 0.3);
  }
  if (EDI.bulbos) EDI.bulbos.material.emissiveIntensity = 0.8 + 0.5 * Math.sin(J.t * 5);
  if (EDI.neon) EDI.neon.emissiveIntensity = (0.8 + 0.3 * Math.sin(J.t * 7.3) * Math.sin(J.t * 1.7)) * (0.7 + J.noche * 0.8);
}
function shadeHex(hex, k) { return '#' + new THREE.Color(hex).offsetHSL(0, 0, k).getHexString(); }
