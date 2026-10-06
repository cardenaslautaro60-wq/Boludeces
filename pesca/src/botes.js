'use strict';
// Botes: tres embarcaciones que abren el mar. Se compran en el almacén y se amarran en el muelle.
// A bordo la proa gira hacia donde mira la cámara (WASD); se pesca, arponea y tira dinamita igual que en tierra.
// Cada bote aguanta el mar hasta cierta distancia de la costa (maxD): más allá el mar se pone demasiado bravo.

const BOTE = { lista: [], act: null, desembarco: null, tDes: -9, avisoT: -99, limiteT: -99, estelaT: 0, cerca: false, remoFase: 0 };

// pisoH: altura del piso del casco sobre la quilla; piso: altura donde pisa el jugador sobre la línea de flotación
const DIM_BOTE = {
  remo: { L: 4.3, W: 1.75, Hh: 0.75, pisoH: 0.49, piso: 0.1, pie: -0.3, calado: 0.4, estab: 1, cam: 6.2, ext: '#2f7fb8', int: '#e8d5a8', borde: '#f6f1e0' },
  lancha: { L: 6.8, W: 2.45, Hh: 1.0, pisoH: 0.55, piso: 0.14, pie: -1.0, calado: 0.42, estab: 0.75, cam: 7.2, ext: '#f4f6f8', int: '#b9c6cf', borde: '#2f9bd0' },
  pesquero: { L: 12.5, W: 4.2, Hh: 2.1, pisoH: 0.22, piso: 0.5, pie: -2.6, calado: 1.05, estab: 0.35, cam: 9.5, ext: '#e0553d', int: '#c9a56b', borde: '#f4f4ee' },
};
for (const k in DIM_BOTE) { const d = DIM_BOTE[k]; d.hullY = d.piso + 0.55 * d.Hh - d.pisoH; }
DIM_BOTE.pesquero.hullY = 0.155; // el pesquero tiene cubierta propia: casco más hundido
DIM_BOTE.pesquero.pisoCub = 0.5 - 0.155;
const AMARRE = { remo: { lado: -1, t: 0.5 }, lancha: { lado: 1, t: 0.5 }, pesquero: { lado: -1, t: 0.86 } };
// Nombres con su artículo (para frases correctas en español)
const NOM_BOTE = {
  remo: { el: 'el bote a remo', al: 'al bote a remo', del: 'del bote a remo', Subir: 'Subir al bote a remo' },
  lancha: { el: 'la lancha', al: 'a la lancha', del: 'de la lancha', Subir: 'Subir a la lancha' },
  pesquero: { el: 'el pesquero', al: 'al pesquero', del: 'del pesquero', Subir: 'Subir al pesquero' },
};
const MSG_LIMITE = {
  remo: 'El mar se pone bravo: el bote a remo no aguanta más lejos. Una lancha llega al mar abierto.',
  lancha: 'Más allá el mar es una pared de olas. Solo un pesquero cruza el abismo.',
  pesquero: 'Ni el pesquero se anima: se acabó el mapa.',
};

function amarre(def) {
  const dm = DIM_BOTE[def.id], a = AMARRE[def.id];
  return {
    x: MUELLE.x + a.lado * (MUELLE.ancho / 2 + dm.W / 2 + 0.55),
    z: MUELLE.z0 + (MUELLE.z1 - MUELLE.z0) * a.t,
    ang: 0,
  };
}

// ---------------------------------------------------------------------------
// Modelos
// ---------------------------------------------------------------------------
function armarBote(def) {
  const dm = DIM_BOTE[def.id];
  const pivote = new THREE.Group(); // sigue las olas: la proa mira a +Z
  const casco = new THREE.Group(); // el casco se modela con la proa en +X
  casco.rotation.y = -Math.PI / 2;
  casco.position.y = dm.hullY;
  pivote.add(casco);
  const B = { def, dm, grupo: pivote, casco, remos: [], helice: null, x: 0, z: 0, ang: 0, vel: 0, y: 0, dock: null, q: new THREE.Quaternion(), qObj: new THREE.Quaternion(), visible: false, remoT: 0, spin: 0 };
  const solido = [], vidrio = [], lampara = [], hull = [];
  const marcar = (m, sombra = true) => { m.castShadow = sombra; m.receiveShadow = true; return m; };

  if (def.id === 'remo') {
    hull.push(crearCascoBote(dm.L, dm.W, dm.Hh, dm.ext, dm.int, dm.pisoH), bordeCasco(dm.L, dm.W, dm.Hh, dm.borde));
    solido.push(caja(0.34, 0.05, 1.3, '#b98a52', -0.95, 0.4, 0), caja(0.34, 0.05, 1.25, '#b98a52', 0.35, 0.42, 0), caja(0.16, 0.26, 1.0, '#b98a52', -1.98, 0.3, 0));
    solido.push(cil(0.025, 0.025, 0.6, '#8a6a3a', 1.85, 0.42, 0, 6, Math.PI / 2, 0, 0)); // cabo de proa
    for (const s of [-1, 1]) {
      const g = new THREE.Group();
      const geo = unir([cil(0.026, 0.026, 2.6, '#c9a56b', 0, 0, s * 0.8, 6, Math.PI / 2, 0, 0), caja(0.3, 0.03, 0.6, '#f6f1e0', 0, 0, s * 1.95), cil(0.04, 0.04, 0.2, '#6b4a2a', 0, 0, s * -0.35, 6, Math.PI / 2, 0, 0)]);
      g.add(marcar(new THREE.Mesh(geo, MAT.vc)));
      g.position.set(-0.15, 0.5, s * (dm.W * 0.5 + 0.02));
      casco.add(g);
      B.remos.push({ g, s });
    }
  } else if (def.id === 'lancha') {
    hull.push(crearCascoBote(dm.L, dm.W, dm.Hh, dm.ext, dm.int, dm.pisoH), bordeCasco(dm.L, dm.W, dm.Hh, dm.borde, 0.12), cubiertaCasco(dm.L, dm.W, dm.Hh, 0.34, '#e9eef2', 1.1, 3.3, dm.pisoH));
    solido.push(caja(1.0, 0.64, 1.0, '#e9eef2', 0.55, 0.32, 0), caja(1.08, 0.07, 1.1, dm.borde, 0.55, 0.66, 0));
    solido.push(caja(0.05, 0.1, 1.5, '#2a2f36', 1.1, 0.85, 0), caja(0.05, 0.5, 0.05, '#2a2f36', 1.07, 1.1, 0.72), caja(0.05, 0.5, 0.05, '#2a2f36', 1.07, 1.1, -0.72));
    solido.push(caja(0.5, 0.34, 1.9, dm.borde, -2.45, 0.2, 0), caja(0.5, 0.12, 1.9, '#e9eef2', -2.45, 0.43, 0));
    // motor fueraborda
    solido.push(caja(0.55, 0.72, 0.46, '#2a2f36', -3.62, 0.5, 0), caja(0.62, 0.26, 0.5, '#e0553d', -3.62, 0.98, 0), cil(0.07, 0.07, 1.0, '#2a2f36', -3.68, -0.2, 0, 6), caja(0.5, 0.08, 0.12, '#2a2f36', -3.7, -0.62, 0));
    solido.push(cil(0.02, 0.02, 0.8, '#cfd8df', 0.55, 1.1, 0, 5));
    vidrio.push(caja(0.03, 0.46, 1.4, '#ffffff', 1.07, 1.1, 0, 0, 0, 0));
    lampara.push(esf(0.07, '#ffffff', 0.55, 1.52, 0, 1, 1, 1, 1), esf(0.06, '#ff3030', 0.2, 0.7, 0.98, 1, 1, 1, 1), esf(0.06, '#30ff60', 0.2, 0.7, -0.98, 1, 1, 1, 1));
    const rueda = new THREE.Mesh(colorear(new THREE.TorusGeometry(0.15, 0.022, 6, 14), '#2a2f36'), MAT.vc);
    rueda.position.set(0.9, 0.82, 0); rueda.rotation.set(0, Math.PI / 2, 0.5);
    casco.add(rueda);
    const hel = new THREE.Mesh(colorear(new THREE.BoxGeometry(0.03, 0.36, 0.08), '#c9ced3'), MAT.vc);
    hel.position.set(-3.78, -0.62, 0);
    casco.add(hel);
    B.helice = hel;
  } else {
    const yc = dm.pisoCub;
    hull.push(crearCascoBote(dm.L, dm.W, dm.Hh, dm.ext, dm.int, dm.pisoH), bordeCasco(dm.L, dm.W, dm.Hh, dm.borde, 0.14), cubiertaCasco(dm.L, dm.W, dm.Hh, yc, '#b58a52', -5.9, 5.0, dm.pisoH));
    solido.push(caja(2.5, 2.3, 1.9, '#f1ede2', 3.0, yc + 1.15, 0), caja(2.9, 0.14, 2.3, '#2b3a4a', 3.0, yc + 2.37, 0), caja(1.2, 0.6, 1.0, '#e0553d', 3.05, yc + 0.3, 0.0, 0, 0, 0));
    solido.push(cil(0.12, 0.17, 5.6, '#cfd5d9', 1.0, yc + 2.8, 0, 6), caja(0.1, 0.1, 3.8, '#cfd5d9', 1.0, yc + 4.0, 0), caja(2.6, 0.08, 0.1, '#cfd5d9', 1.0, yc + 4.9, 0));
    solido.push(cil(0.21, 0.26, 1.1, '#e0553d', 2.35, yc + 3.0, 0.5, 8), cil(0.23, 0.23, 0.14, '#1b1f24', 2.35, yc + 3.6, 0.5, 8));
    // grúa de popa
    for (const s of [-1, 1]) solido.push(cilEntre({ x: -4.5, y: yc, z: s * 0.95 }, { x: -3.9, y: yc + 3.0, z: s * 0.1 }, 0.1, 0.07, '#cfd5d9', 6));
    solido.push(caja(0.12, 0.12, 0.9, '#cfd5d9', -3.9, yc + 3.05, 0), cilEntre({ x: -3.9, y: yc + 3.0, z: 0 }, { x: -5.0, y: yc + 2.3, z: 0 }, 0.05, 0.04, '#8a8f95', 5));
    // red y boyas
    solido.push(esf(0.75, '#5f8a52', -2.9, yc + 0.4, 0.55, 1.2, 0.65, 1.3, 1), esf(0.55, '#4a7340', -3.3, yc + 0.35, -0.5, 1.1, 0.6, 1, 1));
    for (let i = 0; i < 4; i++) solido.push(esf(0.2, i % 2 ? '#ff7a1a' : '#ffd23c', 0.5 + i * 0.7, yc + 0.22, i % 2 ? 0.9 : -0.9, 1, 1, 1, 1));
    // barandas a babor y estribor
    for (const s of [-1, 1]) {
      for (let i = 0; i < 6; i++) solido.push(cil(0.03, 0.03, 0.8, '#cfd5d9', -4.6 + i * 1.3, yc + 0.4, s * (1.05 + Math.max(0, 0.18 * (i - 3))), 5));
      solido.push(caja(7.6, 0.05, 0.05, '#cfd5d9', -1.2, yc + 0.8, s * 1.2));
    }
    vidrio.push(caja(0.04, 0.85, 1.55, '#ffffff', 4.27, yc + 1.55, 0), caja(1.4, 0.75, 0.04, '#ffffff', 3.1, yc + 1.55, 0.96), caja(1.4, 0.75, 0.04, '#ffffff', 3.1, yc + 1.55, -0.96));
    lampara.push(esf(0.12, '#ffffff', 1.0, yc + 5.65, 0, 1, 1, 1, 1), esf(0.1, '#ff3030', 3.0, yc + 2.55, 1.05, 1, 1, 1, 1), esf(0.1, '#30ff60', 3.0, yc + 2.55, -1.05, 1, 1, 1, 1));
  }
  casco.add(marcar(new THREE.Mesh(unir(hull), MAT.vcDoble)));
  if (solido.length) casco.add(marcar(new THREE.Mesh(unir(solido), MAT.vc)));
  if (vidrio.length) { const v = new THREE.Mesh(unir(vidrio), MAT.ventana); casco.add(v); }
  if (lampara.length) { const l = new THREE.Mesh(unir(lampara), MAT.lampara); casco.add(l); }
  pivote.visible = false;
  return B;
}

function crearBotes(escena) {
  for (const b of BOTE.lista) escena.remove(b.grupo);
  BOTE.lista.length = 0;
  for (const def of BOTES) {
    const b = armarBote(def);
    escena.add(b.grupo);
    BOTE.lista.push(b);
  }
  cargarBotes();
}
// Pone cada bote en su lugar guardado (o en su amarre)
function cargarBotes() {
  BOTE.act = null;
  for (const b of BOTE.lista) {
    const g = G.botes && G.botes[b.def.id];
    const p = g && Number.isFinite(g.x) ? g : amarre(b.def);
    b.x = p.x; b.z = p.z; b.ang = p.ang || 0; b.vel = 0; b.dock = null;
    b.y = alturaOla(b.x, b.z, J.t); b.q.identity();
    orientarBote(b, 1);
  }
}
function sincronizarBotesG() {
  if (!G.botes) G.botes = {};
  for (const b of BOTE.lista) if (G.botes[b.def.id]) G.botes[b.def.id] = { x: +b.x.toFixed(2), z: +b.z.toFixed(2), ang: +b.ang.toFixed(3) };
  G.boteAct = BOTE.act ? BOTE.act.def.id : null;
}
function comprarBote(id) {
  const b = BOTE.lista.find((x) => x.def.id === id);
  if (!b) return;
  const a = amarre(b.def);
  G.botes[id] = a;
  b.x = a.x; b.z = a.z; b.ang = 0; b.vel = 0; b.dock = null;
  b.y = alturaOla(b.x, b.z, J.t);
  orientarBote(b, 1);
  toast(`¡Compraste ${NOM_BOTE[id].el}! Está amarrado en el muelle: acercate y apretá E.`, '#9bffb0');
  sfx('mision');
  chapoteo(b.x, b.z, 16, 1.2);
}
// Trae un bote al muelle (solo desde tierra firme y si nadie lo usa)
function llamarBote(id) {
  const b = BOTE.lista.find((x) => x.def.id === id);
  if (!b || !G.botes[id]) return false;
  if (BOTE.act === b) return false;
  const a = amarre(b.def);
  b.x = a.x; b.z = a.z; b.ang = 0; b.vel = 0; b.dock = null;
  b.y = alturaOla(b.x, b.z, J.t);
  orientarBote(b, 1);
  G.botes[id] = a;
  sfx('splash');
  return true;
}

// ---------------------------------------------------------------------------
// Flotación: el bote copia las olas (altura, cabeceo y balanceo)
// ---------------------------------------------------------------------------
const BT = { f: new THREE.Vector3(), l: new THREE.Vector3(), X: new THREE.Vector3(), Y: new THREE.Vector3(), Z: new THREE.Vector3(), m: new THREE.Matrix4() };
function orientarBote(b, k) {
  const dm = b.dm, e = dm.estab;
  const fx = Math.sin(b.ang), fz = Math.cos(b.ang), lx = fz, lz = -fx;
  const sL = dm.L * 0.38, sW = dm.W * 0.5, t = J.t;
  const hB = alturaOla(b.x + fx * sL, b.z + fz * sL, t), hS = alturaOla(b.x - fx * sL, b.z - fz * sL, t);
  const hL = alturaOla(b.x + lx * sW, b.z + lz * sW, t), hR = alturaOla(b.x - lx * sW, b.z - lz * sW, t);
  const hC = ((hB + hS + hL + hR) / 4) * (0.45 + 0.55 * e);
  b.y += (hC - b.y) * Math.min(1, k * 8);
  BT.Z.set(fx * 2 * sL, (hB - hS) * e, fz * 2 * sL).normalize();
  BT.l.set(lx * 2 * sW, (hL - hR) * e, lz * 2 * sW);
  BT.X.copy(BT.l).addScaledVector(BT.Z, -BT.l.dot(BT.Z)).normalize();
  BT.Y.crossVectors(BT.Z, BT.X);
  BT.m.makeBasis(BT.X, BT.Y, BT.Z);
  b.qObj.setFromRotationMatrix(BT.m);
  if (k >= 1) b.q.copy(b.qObj); else b.q.slerp(b.qObj, Math.min(1, k * 6));
  b.grupo.quaternion.copy(b.q);
  b.grupo.position.set(b.x, b.y, b.z);
}

// ¿Dónde está tocando fondo o llegando al límite del mar? 0 libre · 1 poco fondo · 2 mar bravo · 3 fin del mapa
function chocaBote(b, x, z, ang) {
  const dm = b.dm;
  const fx = Math.sin(ang), fz = Math.cos(ang), lx = fz, lz = -fx;
  const hL = dm.L * 0.46, hW = dm.W * 0.5 + 0.12;
  const prof = -(dm.calado + 0.4);
  const pts = [[hL, 0], [-hL * 0.92, 0], [0, hW], [0, -hW], [hL * 0.6, hW * 0.7], [hL * 0.6, -hW * 0.7], [-hL * 0.75, hW * 0.85], [-hL * 0.75, -hW * 0.85]];
  for (const [a, c] of pts) {
    const px = x + fx * a + lx * c, pz = z + fz * a + lz * c;
    if (H(px, pz) > prof || enMuelle(px, pz, 0.15)) return 1;
  }
  if (Math.hypot(x, z) > MUNDO.R - 8) return 3;
  if (distCosta(x, z) > b.def.maxD) return 2;
  return 0;
}

// ---------------------------------------------------------------------------
// Manejo del bote
// ---------------------------------------------------------------------------
function actualizarBote(dt) {
  const b = BOTE.act;
  if (!b) { P.modo = 'tierra'; return; }
  const d = b.def, dm = b.dm;
  const mv = vectorMov();
  const cy = Math.cos(CAM.yaw), sy = Math.sin(CAM.yaw);
  const dx = sy * mv.y + cy * mv.x, dz = cy * mv.y - sy * mv.x;
  const m = Math.min(1, Math.hypot(dx, dz));
  let objVel = 0, giro = 0;
  if (m > 0.05 && P.stun <= 0) {
    const err = angDiff(b.ang, Math.atan2(dx, dz));
    const maxG = d.giro * (0.3 + 0.7 * Math.min(1, Math.abs(b.vel) / (d.vel * 0.4))) * dt;
    giro = clamp(err, -maxG, maxG);
    const c = Math.cos(err);
    objVel = c > -0.25 ? d.vel * m * (0.12 + 0.88 * Math.max(0, c) * Math.max(0, c)) : 0;
  }
  const ac = d.vel * (objVel > b.vel ? 0.42 : 0.8);
  b.vel += clamp(objVel - b.vel, -ac * dt, ac * dt);
  if (m <= 0.05) b.vel *= Math.max(0, 1 - dt * (0.35 + 0.1 * (dm.estab < 0.5 ? 0.5 : 1)));
  // giro y avance con colisiones
  let choque = 0;
  if (giro) { const a1 = b.ang + giro; if (!chocaBote(b, b.x, b.z, a1)) b.ang = a1; }
  const total = b.vel * dt, pasos = Math.max(1, Math.ceil(Math.abs(total) / 0.5)), paso = total / pasos;
  for (let i = 0; i < pasos; i++) {
    const nx = b.x + Math.sin(b.ang) * paso, nz = b.z + Math.cos(b.ang) * paso;
    const c = chocaBote(b, nx, nz, b.ang);
    if (!c) { b.x = nx; b.z = nz; continue; }
    // deslizar sobre el obstáculo
    const cx = chocaBote(b, nx, b.z, b.ang), cz = chocaBote(b, b.x, nz, b.ang);
    if (!cx) b.x = nx; else if (!cz) b.z = nz; else { choque = c; break; }
    b.vel *= 0.93;
  }
  if (choque) {
    if (Math.abs(b.vel) > 3) { sfx('impacto'); sacudir(8); chapoteo(b.x + Math.sin(b.ang) * dm.L * 0.5, b.z + Math.cos(b.ang) * dm.L * 0.5, 8, 0.8); }
    b.vel = -b.vel * 0.15;
    if (choque >= 2 && J.t - BOTE.limiteT > 7) { BOTE.limiteT = J.t; toast(choque === 3 ? MSG_LIMITE.pesquero : MSG_LIMITE[d.id], '#ffb3a8'); sfx('error'); }
  }
  // aviso al acercarse al límite
  if (d.maxD < 9999) {
    const dc = distCosta(b.x, b.z);
    if (dc > d.maxD - 16 && J.t - BOTE.avisoT > 25) { BOTE.avisoT = J.t; toast('El mar se está poniendo bravo más adelante...', '#ffd9a0'); }
    if (dc < d.maxD - 40) BOTE.avisoT = Math.min(BOTE.avisoT, J.t - 25);
  }
  // si navegás con la línea afuera, se recoge
  if (Math.abs(b.vel) > 1.8 && (LINEA.estado === 'espera' || LINEA.estado === 'mordisqueo' || LINEA.estado === 'picada' || LINEA.estado === 'lanzando')) { recogerLinea(true); toast('Recogiste la línea para navegar.', '#ffe39a'); }
  orientarBote(b, dt);
  // el pescador de pie en cubierta
  const fx = Math.sin(b.ang), fz = Math.cos(b.ang);
  P.pos.x = b.x + fx * dm.pie; P.pos.z = b.z + fz * dm.pie;
  P.pos.y = b.y + dm.piso + (d.id === 'pesquero' ? 0 : 0);
  P.vel.x = fx * b.vel; P.vel.z = fz * b.vel; P.vel.y = 0;
  P.enSuelo = true;
  P.mov = lerp(P.mov, 0, Math.min(1, dt * 10));
  const activo = LINEA.estado !== 'libre' || P.accion > 0 || enCombate() || P.tool !== 'cana' || IN.botones[0];
  P.yaw = turnToward(P.yaw, activo ? Math.atan2(-sy, -cy) : b.ang, dt * 9);
  if (PJ.rig) { PJ.rig.grupo.position.set(P.pos.x, P.pos.y, P.pos.z); PJ.rig.grupo.rotation.y = P.yaw; PJ.rig.grupo.rotation.x = 0; }
  motorFrame(Math.abs(b.vel) / d.vel, d.id);
}

// Visuales de todos los botes (y atraque automático de los que quedaron sueltos cerca del muelle)
function actualizarBotes(dt) {
  for (const b of BOTE.lista) {
    const posee = !!(G.botes && G.botes[b.def.id]);
    const cerca = posee && Math.hypot(b.x - P.pos.x, b.z - P.pos.z) < 420;
    b.grupo.visible = cerca;
    if (!cerca) continue;
    if (b.dock) {
      const k = Math.min(1, dt * 0.9);
      const dxx = b.dock.x - b.x, dzz = b.dock.z - b.z;
      b.x += dxx * k + Math.sign(dxx) * Math.min(Math.abs(dxx), dt * 0.4); b.z += dzz * k + Math.sign(dzz) * Math.min(Math.abs(dzz), dt * 0.4);
      b.ang = turnToward(b.ang, b.dock.ang, dt * 0.6);
      b.vel = Math.hypot(dxx, dzz) > 0.3 ? 1.2 : 0;
      if (Math.hypot(dxx, dzz) < 0.06 && Math.abs(angDiff(b.ang, b.dock.ang)) < 0.02) { b.x = b.dock.x; b.z = b.dock.z; b.ang = b.dock.ang; b.dock = null; b.vel = 0; G.botes[b.def.id] = { x: b.x, z: b.z, ang: b.ang }; }
    }
    if (b !== BOTE.act) orientarBote(b, dt);
    // remos y hélice
    const mov = Math.abs(b.vel);
    for (const r of b.remos) {
      b.remoT += dt * (mov > 0.4 ? 1.5 + mov * 0.9 : 0.2);
      const fase = b.remoT * (b.def.id === 'remo' ? 1 : 0);
      const barrido = mov > 0.4 ? Math.sin(fase) * 0.5 : Math.sin(J.t * 0.8 + r.s) * 0.04 + 0.12;
      r.g.rotation.y = r.s * barrido;
      r.g.rotation.x = mov > 0.4 ? Math.cos(fase) * 0.12 * r.s : 0;
    }
    if (b.helice) { b.spin += dt * (4 + mov * 5); b.helice.rotation.x = b.spin; }
    // estela
    if (mov > 1.4 && b.def.id !== 'remo') {
      b.estela = (b.estela || 0) - dt;
      if (b.estela <= 0) {
        b.estela = 0.12;
        const fx = Math.sin(b.ang), fz = Math.cos(b.ang);
        ondaAgua(b.x - fx * b.dm.L * 0.45, b.z - fz * b.dm.L * 0.45, 1.8 + mov * 0.35, 1.3, 0.5, 1);
        if (mov > 6) chapoteo(b.x + fx * b.dm.L * 0.42, b.z + fz * b.dm.L * 0.42, 2, 0.45);
      }
    } else if (mov > 0.7 && b.def.id === 'remo') {
      b.estela = (b.estela || 0) - dt;
      if (b.estela <= 0) { b.estela = 0.5; const fx = Math.sin(b.ang), fz = Math.cos(b.ang); ondaAgua(b.x - fx * 1.5, b.z - fz * 1.5, 1.4, 1.2, 0.4, 1); }
    }
  }
}

// ---------------------------------------------------------------------------
// Subir y bajar
// ---------------------------------------------------------------------------
function abordar(b, callado) {
  if (J.modo !== 'jugando' && !callado) return;
  if (LINEA.estado !== 'libre') { toast('Primero recogé la línea (clic).', '#ffe39a'); sfx('error'); return; }
  const dm = b.dm;
  b.dock = null;
  BOTE.act = b;
  P.modo = 'bote';
  P.rodar.t = 0;
  P.vel.x = P.vel.z = 0;
  b.vel = 0;
  CAM.yaw = b.ang + Math.PI; CAM.pitch = -0.3; CAM.distObj = Math.max(CAM.distObj, dm.cam);
  P.tool = 'cana';
  G.boteAct = b.def.id;
  orientarBote(b, 1);
  actualizarBote(0);
  if (!callado) {
    sfx('splash'); chapoteo(b.x, b.z, 6, 0.6);
    toast(`A bordo ${NOM_BOTE[b.def.id].del}. WASD navega (la proa sigue a la cámara) · E para bajar cerca de la costa.`, '#9be7ff');
  }
}
function buscarDesembarco(b) {
  let mejorMojado = null;
  for (let r = 2.4; r <= 15; r += 1.3) {
    const n = Math.max(12, Math.round(r * 2.6));
    let seco = null, ds = 1e9;
    for (let k = 0; k < n; k++) {
      const a = (k / n) * TAU, x = b.x + Math.cos(a) * r, z = b.z + Math.sin(a) * r;
      if (!libre(x, z, 0.45)) continue;
      const piso = alturaPiso(x, z);
      if (piso > -0.35) { const dd = Math.abs(angDiff(a, Math.atan2(-b.z, -b.x))); if (dd < ds) { ds = dd; seco = { x, z, muelle: enMuelle(x, z, 0) }; } } else if (!mejorMojado && r <= 6) mejorMojado = { x, z, muelle: false };
    }
    if (seco) return seco;
  }
  return mejorMojado;
}
function bajarDelBote(forzado) {
  const b = BOTE.act;
  if (!b) { P.modo = 'tierra'; return false; }
  let s = null;
  if (!forzado) {
    s = BOTE.desembarco || buscarDesembarco(b);
    if (!s) { toast('Acercate a la costa o al muelle para bajar.', '#ffe39a'); sfx('error'); return false; }
    if (LINEA.estado !== 'libre') recogerLinea(true);
  }
  BOTE.act = null; G.boteAct = null;
  P.modo = 'tierra';
  b.vel = 0;
  P.vel.x = P.vel.y = P.vel.z = 0;
  if (s) { P.pos.x = s.x; P.pos.z = s.z; P.pos.y = alturaPiso(s.x, s.z); P.enSuelo = true; sfx('splash'); }
  const am = amarre(b.def);
  if (forzado) { b.x = am.x; b.z = am.z; b.ang = 0; orientarBote(b, 1); } else if (Math.hypot(b.x - am.x, b.z - am.z) < 45) b.dock = am;
  G.botes[b.def.id] = { x: b.x, z: b.z, ang: b.ang };
  motorFrame(0, null);
  BOTE.desembarco = null;
  return true;
}

// Lugar cercano para el aviso de "E": subir a un bote propio o bajar cerca de tierra
function botePoi() {
  if (J.modo !== 'jugando' || J.panel) return null;
  if (P.modo === 'bote') {
    const b = BOTE.act;
    if (!b) return null;
    if (J.t - BOTE.tDes > 0.3) { BOTE.tDes = J.t; BOTE.desembarco = buscarDesembarco(b); }
    const s = BOTE.desembarco;
    if (!s) return null;
    return { id: 'bote-bajar', x: b.x, z: b.z, r: 99, nombre: 'Bote', accion: s.muelle ? 'Bajar al muelle' : 'Bajar a la costa', prioridad: true, accionBote: () => bajarDelBote(false) };
  }
  let mejor = null, md = 1e9;
  for (const b of BOTE.lista) {
    if (!G.botes[b.def.id]) continue;
    const d = Math.hypot(P.pos.x - b.x, P.pos.z - b.z);
    if (d < b.dm.L * 0.5 + 2.8 && d < md) { md = d; mejor = b; }
  }
  if (!mejor) return null;
  return { id: 'bote:' + mejor.def.id, x: mejor.x, z: mejor.z, r: 99, nombre: mejor.def.nombre, accion: NOM_BOTE[mejor.def.id].Subir, prioridad: false, accionBote: () => abordar(mejor) };
}
