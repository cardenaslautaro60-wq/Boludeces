'use strict';
// Armas del Nivel 2: rifle, escopeta, subfusil y lanzacohetes. Disparan al centro de la mira (cámara sobre el hombro).
// Los tiros son instantáneos (con dispersión): pegan en peces, jefes (daño x2 si están aturdidos), tierra y agua.
// El lanzacohetes dispara un proyectil que explota en área.

const ARM = { pool: [], flash: null, listo: false };

const armaActual = () => (G.armaSel && G.armas[G.armaSel] ? ARMA[G.armaSel] : null);
const reservaDe = (a) => G.municion[a.mun] || 0;
const cargadorDe = (a) => G.cargador[a.id] || 0;

function crearTiros(escena) {
  for (let i = 0; i < 16; i++) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    const l = new THREE.Line(g, new THREE.LineBasicMaterial({ color: '#ffe9a0', transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
    l.frustumCulled = false; l.visible = false;
    escena.add(l);
    ARM.pool.push({ l, t: 0 });
  }
  const f = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffd27a', transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  f.visible = false;
  escena.add(f);
  ARM.flash = { m: f, t: 0 };
  ARM.listo = true;
}

// ---- Rayos contra el mundo ----------------------------------------------------
const _ao = new THREE.Vector3(), _ad = new THREE.Vector3(), _ar = new THREE.Vector3(), _au = new THREE.Vector3();
const alturaSuelo = (x, z) => Math.max(H(x, z), enMuelle(x, z) ? MUELLE.alto : -99);
// Primer punto donde el rayo toca tierra o fondo, y primer cruce de la superficie del agua
function rayoMundo(ox, oy, oz, dx, dy, dz, max) {
  let tAgua = -1, ult = 0;
  for (let t = 0.8; t <= max; t += t < 30 ? 0.7 : 2.2) {
    const x = ox + dx * t, y = oy + dy * t, z = oz + dz * t;
    const s = alturaSuelo(x, z);
    if (tAgua < 0 && H(x, z) < -0.05 && y < alturaOla(x, z, J.t)) tAgua = t;
    if (y <= s) {
      let a = ult, b = t;
      for (let k = 0; k < 6; k++) { const m = (a + b) / 2; if (oy + dy * m <= alturaSuelo(ox + dx * m, oz + dz * m)) b = m; else a = m; }
      return { t: b, tAgua: tAgua >= 0 && tAgua < b ? tAgua : -1, tierra: H(ox + dx * b, oz + dz * b) > -0.05 || enMuelle(ox + dx * b, oz + dz * b) };
    }
    ult = t;
  }
  return { t: max, tAgua, tierra: false, nada: true };
}
function rayoEsfera(ox, oy, oz, dx, dy, dz, cx, cy, cz, r) {
  const px = cx - ox, py = cy - oy, pz = cz - oz;
  const tca = px * dx + py * dy + pz * dz;
  if (tca < 0) return null;
  const d2 = px * px + py * py + pz * pz - tca * tca;
  if (d2 > r * r) return null;
  const thc = Math.sqrt(r * r - d2);
  return tca - thc >= 0 ? tca - thc : tca + thc;
}
function centroJefe(b) {
  if (b.def.tierra) return { x: b.x, y: alturaSuelo(b.x, b.z) + (b.def.alto || 2) * 0.55 + (b.aire || 0), z: b.z };
  return { x: b.x, y: 0.4, z: b.z };
}

// Qué toca un disparo (desde la cámara): jefe, pez, tierra, agua o nada
function trazarTiro(ox, oy, oz, dx, dy, dz, alcance) {
  const w = rayoMundo(ox, oy, oz, dx, dy, dz, alcance);
  let mejor = { t: w.t, tipo: w.nada ? 'nada' : w.tierra ? 'tierra' : 'fondo' };
  if (w.tAgua > 0 && (mejor.tipo === 'nada' || mejor.tipo === 'fondo')) { mejor.agua = w.tAgua; mejor.ax = ox + dx * w.tAgua; mejor.az = oz + dz * w.tAgua; }
  for (const b of BOSSES) {
    if (b.estado !== 'pelea' || b.oculto) continue;
    const c = centroJefe(b);
    const t = rayoEsfera(ox, oy, oz, dx, dy, dz, c.x, c.y, c.z, b.def.radio * 0.95);
    if (t !== null && t < mejor.t) mejor = { t, tipo: 'jefe', obj: b };
  }
  for (const f of PECES) {
    if (f.estado !== 'nada' && f.estado !== 'asustado' && f.estado !== 'curioso' && f.estado !== 'mordisqueo') continue;
    if (f.sp.tipo || f.alfa < 0.3) continue;
    const t = rayoEsfera(ox, oy, oz, dx, dy, dz, f.x, f.y, f.z, Math.max(0.6, f.largo * 0.6));
    if (t !== null && t < mejor.t && (f.y > -4)) mejor = { t, tipo: 'pez', obj: f };
  }
  mejor.x = ox + dx * mejor.t; mejor.y = oy + dy * mejor.t; mejor.z = oz + dz * mejor.t;
  return mejor;
}

function posBoca() {
  const b = PJ.rig && PJ.rig.boca;
  if (b) { b.getWorldPosition(_ao); return { x: _ao.x, y: _ao.y, z: _ao.z }; }
  return posMano();
}
function tiroVisual(x0, y0, z0, x1, y1, z1) {
  const o = ARM.pool.find((q) => q.t <= 0) || ARM.pool[0];
  const p = o.l.geometry.attributes.position.array;
  p[0] = x0; p[1] = y0; p[2] = z0; p[3] = x1; p[4] = y1; p[5] = z1;
  o.l.geometry.attributes.position.needsUpdate = true;
  o.t = 0.07; o.l.visible = true;
}

// ---- Disparar y recargar --------------------------------------------------------
function usarArma(pulso, mantenido) {
  const a = armaActual();
  if (!a || J.panel || J.modo !== 'jugando' || P.stun > 0 || P.recarga) return;
  if (!(a.auto ? mantenido : pulso)) return;
  if (P.cdArma > 0) return;
  if (cargadorDe(a) <= 0) {
    if (reservaDe(a) > 0) recargarArma();
    else { P.cdArma = 0.45; sfx('sinbalas'); if (J.t - (ARM.avisoT || -9) > 4) { ARM.avisoT = J.t; toast(`Sin ${MUN_ID[a.mun].nombre.toLowerCase()}. Se compran en la armería de la Isla Arsenal.`, '#ffb3a8'); } }
    return;
  }
  disparar(a);
}
function disparar(a) {
  G.cargador[a.id] = cargadorDe(a) - 1;
  P.cdArma = a.cadencia;
  P.accion = Math.min(1, 0.35 + a.retroceso * 6);
  G.stats.disparos = (G.stats.disparos || 0) + 1;
  const cam = ESC.camara;
  cam.getWorldDirection(_ad);
  _ao.copy(cam.position);
  const ox = _ao.x, oy = _ao.y, oz = _ao.z;
  const dx = _ad.x, dy = _ad.y, dz = _ad.z;
  // base para la dispersión
  _ar.set(dz, 0, -dx).normalize();
  _au.crossVectors(_ar, _ad).normalize();
  const boca = posBoca();
  sfx(a.id === 'subfusil' ? 'rafaga' : a.id);
  CAM.pitch = clamp(CAM.pitch + a.retroceso * 0.35, -1.15, 0.7);
  sacudir(a.cohete ? 14 : a.perdigones > 1 ? 9 : 4);
  // fogonazo
  ARM.flash.t = 0.05; ARM.flash.m.visible = true; ARM.flash.m.position.set(boca.x, boca.y, boca.z); ARM.flash.m.scale.setScalar(a.cohete ? 2 : a.perdigones > 1 ? 1.5 : 1);
  chispas(boca.x, boca.y, boca.z, '#ffd27a', a.perdigones > 1 ? 7 : 4, 4);
  if (a.cohete) { lanzarCohete(a, ox, oy, oz, dx, dy, dz, boca); return; }
  for (let i = 0; i < a.perdigones; i++) {
    let rx = 0, ry = 0;
    if (a.dispersion > 0) { const r = Math.sqrt(Math.random()) * a.dispersion, an = rand(TAU); rx = Math.cos(an) * r; ry = Math.sin(an) * r; }
    let ex = dx + _ar.x * rx + _au.x * ry, ey = dy + _ar.y * rx + _au.y * ry, ez = dz + _ar.z * rx + _au.z * ry;
    const m = Math.hypot(ex, ey, ez) || 1; ex /= m; ey /= m; ez /= m;
    const h = trazarTiro(ox, oy, oz, ex, ey, ez, a.alcance);
    impactoTiro(a, h);
    // el tiro visible sale de la boca y va al punto de impacto (o hasta 60 m si no pegó en nada)
    const tv = h.tipo === 'nada' ? Math.min(60, a.alcance) : h.t;
    tiroVisual(boca.x, boca.y, boca.z, ox + ex * tv, oy + ey * tv, oz + ez * tv);
  }
  if (cargadorDe(a) <= 0 && reservaDe(a) > 0) setTimeout(() => { if (J.modo === 'jugando' && !P.recarga && cargadorDe(a) <= 0) recargarArma(); }, 260);
}
function impactoTiro(a, h) {
  if (h.tipo === 'jefe') {
    golpearJefe(h.obj, a.dano, 'arma', h.x, h.z);
    chispas(h.x, h.y, h.z, '#ffd27a', 3, 3);
  } else if (h.tipo === 'pez') {
    const f = h.obj;
    matarPez(f, 'arma');
    chispas(f.x, 0.2, f.z, '#ffffff', 6, 3); chapoteo(f.x, f.z, 6, 0.7);
    textoFlotante(f.x, 1.2, f.z, '¡Cazado!', '#ffe36b', 22);
    sfx('impacto');
  } else if (h.tipo === 'tierra') {
    chispas(h.x, h.y + 0.05, h.z, '#e8d9a8', 3, 3); if (Math.random() < 0.5) polvo(h.x, h.y, h.z);
  } else if (h.agua !== undefined) {
    if (Math.random() < 0.8) chapoteo(h.ax, h.az, 3, 0.45);
  }
}
function recargarArma() {
  const a = armaActual();
  if (!a || P.recarga) return;
  if (cargadorDe(a) >= a.cargador) return;
  if (reservaDe(a) <= 0) { sfx('sinbalas'); toast(`No te queda ${MUN_ID[a.mun].nombre.toLowerCase()}.`, '#ffb3a8'); return; }
  P.recarga = { t: 0, dur: a.recarga, id: a.id };
  sfx('recarga');
}
function actualizarArmas(dt) {
  P.cdArma = Math.max(0, P.cdArma - dt);
  if (P.recarga) {
    P.recarga.t += dt;
    const a = ARMA[P.recarga.id];
    if (P.tool !== 'arma' || armaActual() !== a) { P.recarga = null; } else if (P.recarga.t >= P.recarga.dur) {
      const falta = a.cargador - cargadorDe(a), n = Math.min(falta, reservaDe(a));
      G.cargador[a.id] = cargadorDe(a) + n; G.municion[a.mun] -= n;
      P.recarga = null;
    }
  }
  for (const o of ARM.pool) { if (o.t > 0) { o.t -= dt; o.l.material.opacity = Math.max(0, o.t / 0.07) * 0.9; if (o.t <= 0) o.l.visible = false; } }
  if (ARM.flash && ARM.flash.m.visible) { ARM.flash.t -= dt; if (ARM.flash.t <= 0) ARM.flash.m.visible = false; }
}

// ---- Cohetes -------------------------------------------------------------------
function lanzarCohete(a, ox, oy, oz, dx, dy, dz, boca) {
  // apunta al punto donde cae la mira (para que el cohete converja en el centro de la pantalla)
  const h = trazarTiro(ox, oy, oz, dx, dy, dz, a.alcance);
  let tx = h.x, ty = h.y, tz = h.z;
  if (h.tipo === 'nada') { tx = ox + dx * 80; ty = oy + dy * 80; tz = oz + dz * 80; }
  const vx = tx - boca.x, vy = ty - boca.y, vz = tz - boca.z, d = Math.hypot(vx, vy, vz) || 1;
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.7, 8).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#5a6b3a', roughness: 0.6 })), new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.22, 8).rotateX(-Math.PI / 2).translate(0, 0, -0.46), new THREE.MeshStandardMaterial({ color: '#c0392b', roughness: 0.5 })));
  g.position.set(boca.x, boca.y, boca.z);
  g.lookAt(boca.x + vx, boca.y + vy, boca.z + vz);
  ESC.escena.add(g);
  PROY.push({ tipo: 'cohete', x: boca.x, y: boca.y, z: boca.z, dx: vx / d, dy: vy / d, dz: vz / d, rec: 0, rango: a.alcance + 20, malla: g, dmg: a.dano, radio: a.radio, t: 0 });
}
function actualizarCohete(q, dt) {
  const v = 62 * dt;
  const x0 = q.x, y0 = q.y, z0 = q.z;
  q.x += q.dx * v; q.y += q.dy * v; q.z += q.dz * v; q.rec += v;
  q.malla.position.set(q.x, q.y, q.z);
  humo(q.x - q.dx * 0.5, q.y - q.dy * 0.5, q.z - q.dz * 0.5, '#d8d8d8');
  if (Math.random() < 0.6) particula({ x: q.x - q.dx * 0.4, y: q.y - q.dy * 0.4, z: q.z - q.dz * 0.4, vx: rand(-0.4, 0.4), vy: rand(-0.4, 0.4), vz: rand(-0.4, 0.4), vida: 0.25, size: 0.12, col: '#ffb23a', tipo: T_CHISPA, g: 0 });
  let boom = q.rec >= q.rango;
  if (!boom && q.y <= alturaSuelo(q.x, q.z)) boom = true;
  if (!boom && H(q.x, q.z) < -0.05 && q.y < alturaOla(q.x, q.z, J.t)) boom = true;
  if (!boom) for (const b of BOSSES) { if (b.estado !== 'pelea' || b.oculto) continue; const c = centroJefe(b); if (distSegPunto3(x0, y0, z0, q.x, q.y, q.z, c.x, c.y, c.z) < b.def.radio * 0.9) { boom = true; break; } }
  if (!boom) for (const f of PECES) { if (f.estado === 'colgado' || f.estado === 'muerto' || f.estado === 'capturado' || f.sp.tipo) continue; if (distSegPunto3(x0, y0, z0, q.x, q.y, q.z, f.x, f.y, f.z) < Math.max(0.7, f.largo * 0.5)) { boom = true; break; } }
  if (boom) { explotarArma(q.x, Math.max(q.y, alturaSuelo(q.x, q.z)), q.z, q.radio, q.dmg); return false; }
  return true;
}
function explotarArma(x, y, z, R, dano) {
  explosionFx(x, y, z, R);
  sfx('explosion');
  let n = 0;
  for (const f of PECES) {
    if (f.estado === 'colgado' || f.estado === 'muerto' || f.estado === 'capturado' || f.sp.tipo) continue;
    if (Math.hypot(f.x - x, f.z - z) > R + f.largo * 0.4) continue;
    matarPez(f, 'arma'); n++;
  }
  if (n) textoFlotante(x, 2.0, z, `¡${n} ${n === 1 ? 'pez' : 'peces'}!`, '#ffe36b', 28);
  jefesExplosion(x, z, R, dano);
  const dp = Math.hypot(P.pos.x - x, P.pos.z - z);
  if (dp < R * 0.7) {
    herirJugador(Math.round(30 * (1 - dp / (R * 0.7)) + 8), 'cohete');
    const an = Math.atan2(P.pos.z - z, P.pos.x - x);
    P.vel.x += Math.cos(an) * 8; P.vel.z += Math.sin(an) * 8; P.vel.y = 4; P.enSuelo = false; P.stun = 0.4;
  }
}

// Cambiar de arma con la tecla 5 (si ya la tenés en la mano, pasa a la siguiente)
function ciclarArma() {
  const tengo = ARMAS.filter((a) => G.armas[a.id]);
  if (!tengo.length) return false;
  if (P.tool === 'arma' && tengo.length > 1) {
    const i = tengo.findIndex((a) => a.id === G.armaSel);
    G.armaSel = tengo[(i + 1) % tengo.length].id;
    P.recarga = null;
    toast(`${ARMA[G.armaSel].nombre} · ${cargadorDe(ARMA[G.armaSel])}/${reservaDe(ARMA[G.armaSel])}`, '#ffd86a');
  } else if (!G.armaSel || !G.armas[G.armaSel]) G.armaSel = tengo[0].id;
  return true;
}
