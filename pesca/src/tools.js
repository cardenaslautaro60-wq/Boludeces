'use strict';
// Herramientas de caza en 3D: arpón (con cuerda), red (cardúmenes) y dinamita (explosión en área, también te lastima).

const GEO_ARPON = { eje: null, punta: null, dina: null, red: null };
function geosHerramientas() {
  if (GEO_ARPON.eje) return;
  GEO_ARPON.eje = new THREE.CylinderGeometry(0.03, 0.03, 1.6, 6).rotateX(Math.PI / 2).translate(0, 0, -0.7);
  GEO_ARPON.punta = new THREE.ConeGeometry(0.09, 0.4, 4).rotateX(-Math.PI / 2).translate(0, 0, -1.6);
  GEO_ARPON.dina = new THREE.CylinderGeometry(0.06, 0.06, 0.42, 8);
  const cv = makeCanvas(128, 128), g = cv.getContext('2d');
  g.strokeStyle = 'rgba(245,240,215,.95)'; g.lineWidth = 3;
  for (let i = 0; i <= 128; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i - 64, 128); g.stroke(); g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 64, 128); g.stroke(); }
  g.beginPath(); g.arc(64, 64, 62, 0, TAU); g.stroke();
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  GEO_ARPON.red = t;
}

// Apunta hacia lo que está cerca del centro de la mira (sombras de peces y jefes), con tolerancia
const _ro = new THREE.Vector3(), _rd = new THREE.Vector3(), _pp = new THREE.Vector3();
function asistirPunteria(alcance) {
  ESC.camara.getWorldDirection(_rd);
  _ro.copy(ESC.camara.position);
  let mejor = null, md = 1e9;
  const probar = (x, y, z, radio, ref) => {
    if (Math.hypot(x - P.pos.x, z - P.pos.z) > alcance + radio) return;
    _pp.set(x - _ro.x, y - _ro.y, z - _ro.z);
    const t = _pp.dot(_rd);
    if (t < 2) return;
    const d = Math.sqrt(Math.max(0, _pp.lengthSq() - t * t));
    const tol = 0.9 + radio * 0.85;
    if (d < tol && d < md) { md = d; mejor = { x, y, z, ref }; }
  };
  for (const f of PECES) {
    if (f.estado !== 'nada' && f.estado !== 'asustado' && f.estado !== 'curioso' && f.estado !== 'mordisqueo') continue;
    if (f.sp.tipo || f.alfa < 0.35) continue;
    probar(f.x, f.y, f.z, f.largo * 0.45, f);
  }
  for (const b of BOSSES) if (b.estado === 'pelea') probar(b.x, 0.4, b.z, b.def.radio, b);
  return mejor;
}

function lanzarArpon() {
  const ar = arponActual();
  if (!ar) { toast('Todavía no tenés arpón. Se compra en el almacén de Don Anselmo.', '#ffe39a'); sfx('error'); return; }
  if (P.cdArpon > 0 || P.stun > 0 || J.panel || J.modo !== 'jugando') return;
  geosHerramientas();
  const mano = posMano();
  const asist = asistirPunteria(ar.alcance);
  let tx, ty, tz;
  if (asist) { tx = asist.x; ty = asist.y; tz = asist.z; } else if (P.mira.agua || P.mira.tierra) { tx = P.mira.x; ty = P.mira.y - 0.5; tz = P.mira.z; } else { tx = mano.x + P.mira.dirx * 40; ty = mano.y + P.mira.diry * 40; tz = mano.z + P.mira.dirz * 40; }
  const dx = tx - mano.x, dy = ty - mano.y, dz = tz - mano.z, d = Math.hypot(dx, dy, dz) || 1;
  const g = new THREE.Group();
  g.add(new THREE.Mesh(GEO_ARPON.eje, new THREE.MeshStandardMaterial({ color: '#7a5230', roughness: 0.8 })), new THREE.Mesh(GEO_ARPON.punta, new THREE.MeshStandardMaterial({ color: ar.color, roughness: 0.3, metalness: 0.7 })));
  g.position.set(mano.x, mano.y, mano.z);
  g.lookAt(mano.x + dx, mano.y + dy, mano.z + dz);
  ESC.escena.add(g);
  PROY.push({ tipo: 'arpon', x: mano.x, y: mano.y, z: mano.z, dx: dx / d, dy: dy / d, dz: dz / d, rec: 0, rango: ar.alcance, estado: 'vuela', t: 0, dmg: ar.dano, dureza: ar.dureza, malla: g, cuerda: crearTubo(ESC.escena, '#f1ead0'), golpeo: false, asist });
  P.cdArpon = ar.enfr;
  P.accion = 1;
  sfx('tirar');
}
function lanzarRed() {
  const rd = redActual();
  if (!rd) { toast('Todavía no tenés red. Se compra en el almacén de Don Anselmo.', '#ffe39a'); sfx('error'); return; }
  if (P.cdRed > 0 || P.stun > 0 || J.panel || J.modo !== 'jugando') return;
  if (!P.mira.agua) { toast('Tirá la red al agua.', '#ffe39a'); sfx('error'); return; }
  geosHerramientas();
  const mano = posMano();
  let tx = P.mira.x, tz = P.mira.z;
  const dd = Math.hypot(tx - P.pos.x, tz - P.pos.z);
  if (dd > rd.alcance) { const k = rd.alcance / dd; tx = P.pos.x + (tx - P.pos.x) * k; tz = P.pos.z + (tz - P.pos.z) * k; }
  const disco = new THREE.Mesh(new THREE.CircleGeometry(1, 28).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: GEO_ARPON.red, transparent: true, alphaTest: 0.2, side: THREE.DoubleSide, depthWrite: false, fog: false }));
  disco.scale.setScalar(0.3);
  disco.position.set(mano.x, mano.y, mano.z);
  ESC.escena.add(disco);
  PROY.push({ tipo: 'red', ox: mano.x, oy: mano.y, oz: mano.z, x: mano.x, y: mano.y, z: mano.z, tx, tz, t: 0, dur: 0.4 + dd / 26, estado: 'vuela', radio: rd.radio, dureza: rd.dureza, tope: rd.tope, malla: disco });
  P.cdRed = rd.enfr;
  P.accion = 1;
  sfx('tirar');
}
function lanzarDinamita() {
  if (J.panel || J.modo !== 'jugando') return;
  if (!tiene('dinamita')) { toast('No te queda dinamita. Se compra en el almacén.', '#ffe39a'); sfx('error'); return; }
  if (P.cdDina > 0 || P.stun > 0) return;
  geosHerramientas();
  const mano = posMano();
  let tx = P.mira.x, tz = P.mira.z;
  if (!P.mira.agua && !P.mira.tierra) { tx = mano.x + P.mira.dirx * 20; tz = mano.z + P.mira.dirz * 20; }
  const dd = Math.hypot(tx - P.pos.x, tz - P.pos.z);
  if (dd > DINAMITA.alcance) { const k = DINAMITA.alcance / dd; tx = P.pos.x + (tx - P.pos.x) * k; tz = P.pos.z + (tz - P.pos.z) * k; }
  sacarItem('dinamita');
  const g = new THREE.Group();
  const stick = new THREE.Mesh(GEO_ARPON.dina, new THREE.MeshStandardMaterial({ color: '#d9382c', roughness: 0.6 }));
  const mecha = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), new THREE.MeshBasicMaterial({ color: '#ffb02e', fog: false }));
  mecha.position.y = 0.26;
  g.add(stick, mecha);
  g.position.set(mano.x, mano.y, mano.z);
  ESC.escena.add(g);
  PROY.push({ tipo: 'dina', ox: mano.x, oy: mano.y, oz: mano.z, x: mano.x, y: mano.y, z: mano.z, tx, tz, ty: Math.max(H(tx, tz), 0) + 0.2, t: 0, dur: 0.4 + dd / 24, estado: 'vuela', mecha: DINAMITA.mecha, malla: g });
  P.cdDina = 0.5;
  P.accion = 1;
  sfx('tirar');
}

function matarPez(f, como) {
  f.estado = 'muerto'; f.tMuerto = 0; f.t = 0; f.cazadoPor = como; f.meta = null;
}

function quitarProy(q) {
  if (q.malla) { ESC.escena.remove(q.malla); q.malla.traverse((o) => { if (o.isMesh && o.material && o.material.dispose && !o.userData.compartida) o.material.dispose(); }); }
  if (q.cuerda) q.cuerda.quitar();
}
function actualizarProyectiles(dt) {
  for (let i = PROY.length - 1; i >= 0; i--) {
    const q = PROY[i];
    q.t += dt;
    let vive = true;
    if (q.tipo === 'arpon') vive = actualizarArpon(q, dt); else if (q.tipo === 'red') vive = actualizarRed(q, dt); else if (q.tipo === 'dina') vive = actualizarDina(q, dt);
    if (!vive) { quitarProy(q); PROY.splice(i, 1); }
  }
}

function distSegPunto3(x0, y0, z0, x1, y1, z1, px, py, pz) {
  const vx = x1 - x0, vy = y1 - y0, vz = z1 - z0;
  const l2 = vx * vx + vy * vy + vz * vz || 1;
  const t = clamp(((px - x0) * vx + (py - y0) * vy + (pz - z0) * vz) / l2, 0, 1);
  return Math.hypot(px - (x0 + vx * t), py - (y0 + vy * t), pz - (z0 + vz * t));
}

function actualizarArpon(q, dt) {
  const mano = posMano();
  if (q.estado === 'vuela') {
    const v = (q.entro ? 36 : 64) * dt; // en el agua frena
    const x0 = q.x, y0 = q.y, z0 = q.z;
    q.x += q.dx * v; q.y += q.dy * v; q.z += q.dz * v; q.rec += v;
    if (!q.golpeo) {
      for (const f of PECES) {
        if (f.estado === 'colgado' || f.estado === 'muerto' || f.estado === 'capturado' || f.sp.tipo) continue;
        const r = Math.max(0.45, f.largo * 0.42);
        if (distSegPunto3(x0, y0, z0, q.x, q.y, q.z, f.x, f.y, f.z) < r) { q.golpeo = true; golpePezArpon(q, f); break; }
      }
    }
    if (!q.golpeo) {
      for (const b of BOSSES) {
        if (b.estado !== 'pelea') continue;
        if (distSegPunto3(x0, y0, z0, q.x, q.y, q.z, b.x, 0.5, b.z) < b.def.radio * 0.95) { q.golpeo = true; golpearJefe(b, q.dmg, 'arpon', q.x, q.z); break; }
      }
    }
    // entra al agua (sigue hacia abajo) o se clava en la tierra / el fondo
    const suelo = H(q.x, q.z);
    if (!q.entro && suelo < 0 && q.y < alturaOla(q.x, q.z, J.t)) { q.entro = true; chapoteo(q.x, q.z, 6, 0.6); sfx('splash'); }
    if (!q.golpeo && q.y < suelo + 0.05) {
      q.golpeo = true;
      if (suelo > 0) { sfx('impacto'); chispas(q.x, q.y + 0.1, q.z, '#e8d9a8', 6, 3); } else sfx('impacto');
    }
    if (q.golpeo || q.rec >= q.rango) {
      q.estado = 'clavado'; q.tc = 0;
      if (!q.golpeo && !q.entro) { if (esAgua(q.x, q.z)) { chapoteo(q.x, q.z, 6, 0.6); sfx('splash'); } }
    }
  } else if (q.estado === 'clavado') {
    q.tc += dt;
    if (q.tc > 0.15) q.estado = 'vuelve';
  } else {
    const dx = mano.x - q.x, dy = mano.y - q.y, dz = mano.z - q.z, d = Math.hypot(dx, dy, dz);
    if (d < 0.8) return false;
    const v = 80 * dt;
    q.x += (dx / d) * v; q.y += (dy / d) * v; q.z += (dz / d) * v;
    q.malla.lookAt(q.x - dx, q.y - dy, q.z - dz);
  }
  q.malla.position.set(q.x, q.y, q.z);
  q.cuerda.poner(mano, { x: q.x, y: q.y, z: q.z }, 0.25, 0.012, null, false);
  return true;
}
function golpePezArpon(q, f) {
  if (f.sp.dureza <= q.dureza) {
    matarPez(f, 'arpon');
    chispas(f.x, 0.2, f.z, '#ffffff', 8, 3);
    chapoteo(f.x, f.z, 8, 0.8);
    textoFlotante(f.x, 1.2, f.z, '¡Cazado!', '#ffe36b', 22);
    sfx('impacto');
  } else {
    f.estado = 'huye'; f.meta = null; f.ang = rand(TAU);
    textoFlotante(f.x, 1.2, f.z, '¡Muy duro!', '#ffb3a8', 22);
    chispas(f.x, 0.2, f.z, '#ffd0a0', 6, 2.5);
    sfx('error');
  }
}

function actualizarRed(q, dt) {
  if (q.estado === 'vuela') {
    const k = Math.min(1, q.t / q.dur);
    q.x = lerp(q.ox, q.tx, k); q.z = lerp(q.oz, q.tz, k);
    q.y = lerp(q.oy, 0.1, k) + Math.sin(k * Math.PI) * 2.2;
    q.malla.scale.setScalar(0.3 + k * 0.9);
    q.malla.position.set(q.x, q.y, q.z);
    q.malla.rotation.y += dt * 6;
    if (k >= 1) {
      q.estado = 'abre'; q.t = 0;
      if (esAgua(q.x, q.z)) { chapoteo(q.x, q.z, 10, 1); sfx('splash'); } else q.estado = 'seca';
    }
  } else if (q.estado === 'abre') {
    const k = Math.min(1, q.t / 0.4);
    q.malla.scale.setScalar(lerp(1.2, q.radio, 1 - Math.pow(1 - k, 2)));
    q.malla.position.set(q.x, alturaOla(q.x, q.z, J.t) + 0.08, q.z);
    if (k >= 1) {
      q.estado = 'cierra'; q.t = 0;
      let n = 0;
      for (const f of PECES) {
        if (n >= q.tope) break;
        if (f.estado !== 'nada' && f.estado !== 'asustado' && f.estado !== 'curioso') continue;
        if (Math.hypot(f.x - q.x, f.z - q.z) > q.radio) continue;
        if (f.sp.dureza > q.dureza || LINEA.pez === f) continue;
        matarPez(f, 'red');
        f.neta = { x: q.x, z: q.z };
        n++;
      }
      if (n > 0) { sfx('sacar'); textoFlotante(q.x, 1.4, q.z, `¡${n} ${n === 1 ? 'pez' : 'peces'}!`, '#ffe36b', 24); } else { textoFlotante(q.x, 1.0, q.z, 'Nada...', '#d6e6f2', 20); sfx('error'); }
    }
  } else if (q.estado === 'cierra') {
    q.malla.scale.setScalar(lerp(q.radio, 0.4, Math.min(1, q.t / 0.6)));
    if (q.t > 0.6) return false;
  } else if (q.estado === 'seca') {
    q.malla.position.set(q.x, Math.max(H(q.x, q.z), 0) + 0.05, q.z);
    if (q.t > 0.6) return false;
  }
  return true;
}

function actualizarDina(q, dt) {
  if (q.estado === 'vuela') {
    const k = Math.min(1, q.t / q.dur);
    q.x = lerp(q.ox, q.tx, k); q.z = lerp(q.oz, q.tz, k);
    q.y = lerp(q.oy, q.ty, k) + Math.sin(k * Math.PI) * 3.2;
    q.malla.rotation.x += dt * 14; q.malla.rotation.z += dt * 9;
    if (k >= 1) { q.estado = 'mecha'; q.t = 0; if (esAgua(q.x, q.z)) chapoteo(q.x, q.z, 6, 0.6); sfx('splash'); }
  } else {
    // flota sobre el agua o se apoya en la tierra
    q.y = (H(q.x, q.z) < 0 ? alturaOla(q.x, q.z, J.t) : H(q.x, q.z)) + 0.12;
    q.malla.rotation.set(0, 0, Math.PI / 2 + Math.sin(q.t * 3) * 0.15);
    if (Math.random() < dt * 40) chispas(q.x, q.y + 0.3, q.z, '#ffcf5a', 1, 2);
    if (Math.random() < dt * 6) sfx('mecha');
    if (q.t >= q.mecha) { explotar(q.x, q.z); return false; }
  }
  q.malla.position.set(q.x, q.y, q.z);
  return true;
}
function explotar(x, z) {
  const R = DINAMITA.radio;
  const y = Math.max(H(x, z), 0);
  explosionFx(x, y, z, R);
  sfx('explosion');
  let n = 0;
  for (const f of PECES) {
    if (f.estado === 'colgado' || f.estado === 'muerto' || f.estado === 'capturado') continue;
    const d = Math.hypot(f.x - x, f.z - z);
    if (d > R + f.largo * 0.4) continue;
    if (f.sp.dureza <= DINAMITA.dureza) { matarPez(f, 'dina'); n++; } else { f.estado = 'huye'; f.meta = null; f.ang = Math.atan2(f.z - z, f.x - x); }
  }
  if (n) textoFlotante(x, 2.0, z, `¡${n} ${n === 1 ? 'pez' : 'peces'}!`, '#ffe36b', 28);
  jefesExplosion(x, z, R, DINAMITA.dano);
  const dp = Math.hypot(P.pos.x - x, P.pos.z - z);
  if (dp < R + 1) {
    herirJugador(Math.round(34 * (1 - dp / (R + 1)) + 8), 'dinamita');
    const a = Math.atan2(P.pos.z - z, P.pos.x - x);
    P.vel.x += Math.cos(a) * 9; P.vel.z += Math.sin(a) * 9; P.vel.y = 4; P.enSuelo = false;
    P.stun = 0.45;
  }
  if (LINEA.estado === 'espera' && Math.hypot(LINEA.x - x, LINEA.z - z) < R * 1.4) recogerLinea(true);
}

// El pez cazado llegó al jugador
function alRecogerCazado(f) {
  const sp = f.sp;
  if (sp.tipo) { alCapturar(f, f.zona); return; }
  const c = pecho();
  if (mochilaLlena()) { textoFlotante(c.x, c.y + 0.6, c.z, 'Mochila llena', '#ffb3a8', 20); sfx('error'); return; }
  const kg = Math.round(f.kg * 100) / 100;
  const item = { id: sp.id, kg, brillo: !!f.brillo };
  G.peces.push(item);
  if (f.cazadoPor === 'arpon') G.stats.arponeados++;
  G.stats.capturas++;
  G.stats.mayorKg = Math.max(G.stats.mayorKg, kg);
  G.stats.zonas[f.zona] = (G.stats.zonas[f.zona] || 0) + 1;
  const reg = registrarCaptura(sp.id, kg, item.brillo);
  textoFlotante(c.x + rand(-0.3, 0.3), c.y + 0.5 + rand(0, 0.4), c.z, `${sp.nombre} ${fmtKg(kg)}`, RAREZAS[sp.rareza].color, 18, 1.5);
  if (reg.nuevo) toast(`¡Nueva especie en la bitácora: ${sp.nombre}!`, '#9be7ff');
  sfx('moneda');
  revisarMisiones();
}
