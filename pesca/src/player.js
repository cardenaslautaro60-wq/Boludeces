'use strict';
// El pescador en 3D: movimiento, salto, rodar, cámara en tercera persona, mira sobre el agua,
// hambre, vida, comer, curarse, interacciones y los NPCs de la isla.

const VEL_CAMINAR = 4.3, VEL_CORRER = 7.6;
const PJ = { rig: null, npcs: [], mira: null, marca: null };

function pecho() { return { x: P.pos.x, y: P.pos.y + 1.45, z: P.pos.z }; }

function iniciarJugador(pos) {
  const p = pos || { x: MUELLE.x + 0.4, z: MUELLE.z0 - 7 };
  P.pos.x = p.x; P.pos.z = p.z; P.pos.y = alturaPiso(p.x, p.z);
  P.vel.x = P.vel.y = P.vel.z = 0;
  P.yaw = Math.PI; P.modo = 'tierra';
  P.hp = P.hpMax = hpMaxActual();
  P.hambre = 100;
  P.flash = P.inv = P.stun = P.lento = P.comiendo = 0;
  P.buffs.length = 0;
  P.sinDano = 10; P.cerca = null; P.tool = 'cana';
  CAM.yaw = 0; CAM.pitch = -0.28;
  if (!PJ.rig) {
    PJ.rig = crearPersona({ propio: true, herramientas: true, bigote: '#3a2412', canaCol: CANIAS[G.cana].color });
    ESC.escena.add(PJ.rig.grupo);
    crearMira();
  }
  PJ.rig.grupo.visible = true;
}

// Marca en el agua donde va a caer la boya
function crearMira() {
  const g = new THREE.RingGeometry(0.7, 1, 32).rotateX(-Math.PI / 2);
  PJ.marca = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.8, depthWrite: false, fog: false }));
  PJ.marca.renderOrder = 5;
  PJ.marca.visible = false;
  ESC.escena.add(PJ.marca);
  const p2 = new THREE.Mesh(new THREE.CircleGeometry(0.12, 12).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.9, depthWrite: false, fog: false }));
  PJ.marca.add(p2);
}

const enCombate = () => BOSSES.some((b) => b.estado === 'pelea' || b.estado === 'atraido' || b.estado === 'mordiendo');

function velocidadBase() {
  let v = apretada('ShiftLeft', 'ShiftRight') ? VEL_CORRER : VEL_CAMINAR;
  if (P.hambre < 20) v *= 0.9;
  v *= 1 - Math.min(0.3, G.cuerpos.length * 0.1);
  if (P.lento > 0) v *= 0.55;
  if (LINEA.estado === 'pelea') v = Math.min(v, VEL_CAMINAR) * 0.85;
  return v;
}

function actualizarJugador(dt) {
  // temporizadores
  P.flash = Math.max(0, P.flash - dt * 2.6);
  P.inv = Math.max(0, P.inv - dt);
  P.comiendo = Math.max(0, P.comiendo - dt);
  for (const k of ['cdItem', 'cdArpon', 'cdRed', 'cdDina', 'stun', 'lento', 'accion']) P[k] = Math.max(0, P[k] - dt * (k === 'accion' ? 2.2 : 1));
  P.sinDano += dt;
  P.rodar.cd = Math.max(0, P.rodar.cd - dt);
  for (let i = P.buffs.length - 1; i >= 0; i--) if (P.buffs[i].hasta <= J.t) P.buffs.splice(i, 1);

  // cámara: giro con el mouse / táctil / flechas
  const g = 1.9 * dt;
  if (apretada('ArrowLeft')) IN.dx += g;
  if (apretada('ArrowRight')) IN.dx -= g;
  if (apretada('ArrowUp')) IN.dy += g * 0.7;
  if (apretada('ArrowDown')) IN.dy -= g * 0.7;
  CAM.yaw += IN.dx;
  CAM.pitch = clamp(CAM.pitch + IN.dy, -1.15, 0.7);
  if (IN.rueda) CAM.distObj = clamp(CAM.distObj + IN.rueda * 0.7, 3.2, 12);

  // hambre y vida
  const gasto = PESCA.hambreSeg * (LINEA.estado === 'pelea' || enCombate() ? 1.8 : 1);
  P.hambre = Math.max(0, P.hambre - gasto * dt);
  if (P.hambre <= 0) { if (P.hp > 10) P.hp = Math.max(10, P.hp - 0.7 * dt); } else if (P.hambre > 40 && P.sinDano > 4 && P.hp < P.hpMax && !enCombate()) P.hp = Math.min(P.hpMax, P.hp + 1.1 * dt);
  P.hpMax = hpMaxActual();
  if (P.hp > P.hpMax) P.hp = P.hpMax;

  if (P.modo === 'bote' && typeof actualizarBote === 'function') actualizarBote(dt);
  else moverEnTierra(dt);

  calcularMira();
  // lugar cercano
  P.cerca = null;
  let mejor = 1e9;
  if (P.modo === 'tierra') {
    for (const poi of MUN.pois) {
      const d = dist(P.pos.x, P.pos.z, poi.x, poi.z);
      if (d < poi.r && d < mejor) { if (poi.id.startsWith('cofre:') && !cofreDisponible(poi.id.slice(6))) continue; mejor = d; P.cerca = poi; }
    }
  }
  if (typeof botePoi === 'function') { const bp = botePoi(); if (bp && (!P.cerca || bp.prioridad)) P.cerca = bp; }
  if (P.cerca && (pulsada('KeyE', 'Enter') || IN.interTactil) && !J.panel) interactuar(P.cerca);
  IN.interTactil = false;

  procesarAcciones();
  animarJugador(dt);
  if (P.hp <= 0) desmayarse();
}

function moverEnTierra(dt) {
  const mv = vectorMov();
  const cy = Math.cos(CAM.yaw), sy = Math.sin(CAM.yaw);
  // adelante = (-sy, -cy); derecha = (cy, -sy)
  let dx = -sy * -mv.y + cy * mv.x, dz = -cy * -mv.y + -sy * mv.x;
  const m = Math.hypot(dx, dz);
  let vx = 0, vz = 0;
  const agua = H(P.pos.x, P.pos.z) < -0.25 && !enMuelle(P.pos.x, P.pos.z);
  if (P.rodar.t > 0) {
    P.rodar.t -= dt;
    vx = P.rodar.dx * 9.5; vz = P.rodar.dz * 9.5;
    if (agua) { if (Math.random() < 0.5) chapoteo(P.pos.x, P.pos.z, 2, 0.5); }
  } else if (P.stun <= 0) {
    const v = velocidadBase() * (agua ? 0.62 : 1);
    if (m > 0.01) { vx = (dx / m) * v * Math.min(1, m); vz = (dz / m) * v * Math.min(1, m); }
    if ((pulsada('KeyV') || IN.rodarTactil) && P.rodar.cd <= 0 && P.enSuelo) {
      let rx = m > 0.01 ? dx / m : -sy, rz = m > 0.01 ? dz / m : -cy;
      if (m <= 0.01) { rx = Math.sin(P.yaw); rz = Math.cos(P.yaw); }
      P.rodar.dx = rx; P.rodar.dz = rz; P.rodar.t = 0.42; P.rodar.cd = 1.0;
      P.inv = Math.max(P.inv, 0.5);
      sfx('tirar');
    }
  }
  IN.rodarTactil = false;
  // aceleración suave
  const ac = Math.min(1, dt * (P.rodar.t > 0 ? 40 : 14));
  P.vel.x += (vx - P.vel.x) * ac; P.vel.z += (vz - P.vel.z) * ac;
  // salto
  const lineaOut = LINEA.estado !== 'libre';
  if ((pulsada('Space') || IN.saltarTactil) && P.enSuelo && !lineaOut && !J.panel && P.stun <= 0) { P.vel.y = 6.6; P.enSuelo = false; }
  IN.saltarTactil = false;
  // colisión por ejes
  const R = 0.38;
  let nx = P.pos.x + P.vel.x * dt, nz = P.pos.z;
  if (libre(nx, nz, R) && alturaPiso(nx, nz) - P.pos.y < 0.85) P.pos.x = nx; else P.vel.x = 0;
  nz = P.pos.z + P.vel.z * dt;
  if (libre(P.pos.x, nz, R) && alturaPiso(P.pos.x, nz) - P.pos.y < 0.85) P.pos.z = nz; else P.vel.z = 0;
  // altura
  P.vel.y -= 22 * dt;
  P.pos.y += P.vel.y * dt;
  const piso = alturaPiso(P.pos.x, P.pos.z);
  if (P.pos.y <= piso) { P.pos.y += (piso - P.pos.y) * Math.min(1, dt * 30); if (P.pos.y > piso - 0.02) { P.pos.y = piso; } P.vel.y = Math.max(0, P.vel.y); P.enSuelo = true; } else P.enSuelo = P.pos.y - piso < 0.06;
  const vel = Math.hypot(P.vel.x, P.vel.z);
  P.mov = lerp(P.mov, vel > 0.4 ? 1 : 0, Math.min(1, dt * 12));
  // pasos
  if (vel > 1.5 && P.enSuelo) {
    P.pasoT = (P.pasoT || 0) - dt * (vel / 4.3);
    if (P.pasoT <= 0) {
      P.pasoT = 0.3;
      if (agua) chapoteo(P.pos.x, P.pos.z, 2, 0.4);
      else if (!enMuelle(P.pos.x, P.pos.z)) polvo(P.pos.x, P.pos.y, P.pos.z);
    }
  }
  // hacia dónde mira el personaje: hacia la mira si hay una acción en curso; si no, hacia donde camina
  const activo = LINEA.estado !== 'libre' || P.accion > 0 || enCombate() || P.tool !== 'cana' || IN.botones[0];
  let objetivo = P.yaw;
  if (activo) objetivo = Math.atan2(-sy, -cy);
  else if (vel > 0.5) objetivo = Math.atan2(P.vel.x, P.vel.z);
  P.yaw = turnToward(P.yaw, objetivo, dt * 11);
}

// Rayo desde el centro de la cámara hasta el agua o la tierra
const _dir = new THREE.Vector3(), _org = new THREE.Vector3();
function calcularMira() {
  const cam = ESC.camara;
  cam.getWorldDirection(_dir);
  _org.copy(cam.position);
  const m = P.mira;
  m.agua = false; m.tierra = false; m.dist = 0;
  let hit = null;
  let ult = 0;
  for (let t = 1.2; t < 260; t += t < 30 ? 0.8 : 2.5) {
    const x = _org.x + _dir.x * t, y = _org.y + _dir.y * t, z = _org.z + _dir.z * t;
    const h = Math.max(H(x, z), enMuelle(x, z) ? MUELLE.alto : -99);
    const nivel = Math.max(h, -0.02 + alturaOla(x, z, J.t) * 0.5);
    if (y <= nivel) {
      hit = { x, y: nivel, z, t };
      // refinar entre el paso anterior y este
      let a = ult, b = t;
      for (let k = 0; k < 6; k++) {
        const mid = (a + b) / 2;
        const xx = _org.x + _dir.x * mid, yy = _org.y + _dir.y * mid, zz = _org.z + _dir.z * mid;
        const hh = Math.max(H(xx, zz), enMuelle(xx, zz) ? MUELLE.alto : -99);
        if (yy <= Math.max(hh, -0.02)) b = mid; else a = mid;
      }
      const xx = _org.x + _dir.x * b, zz = _org.z + _dir.z * b;
      hit = { x: xx, y: Math.max(H(xx, zz), -0.02), z: zz, t: b };
      m.agua = H(xx, zz) < -0.05 && !enMuelle(xx, zz, 0.3);
      m.tierra = !m.agua;
      break;
    }
    ult = t;
  }
  if (hit) { m.x = hit.x; m.y = hit.y; m.z = hit.z; m.dist = Math.hypot(hit.x - P.pos.x, hit.z - P.pos.z); } else {
    // sin impacto: apuntar al horizonte
    const hx = _dir.x, hz = _dir.z, hl = Math.hypot(hx, hz) || 1;
    m.x = P.pos.x + (hx / hl) * 120; m.z = P.pos.z + (hz / hl) * 120; m.y = 0; m.dist = 120;
  }
  m.dirx = _dir.x; m.diry = _dir.y; m.dirz = _dir.z;
}

// Posición de la mano / punta de la caña en el mundo
const _tmp = new THREE.Vector3();
function puntaCana() {
  if (PJ.rig && PJ.rig.puntaCana) { PJ.rig.puntaCana.getWorldPosition(_tmp); return { x: _tmp.x, y: _tmp.y, z: _tmp.z }; }
  return { x: P.pos.x, y: P.pos.y + 2, z: P.pos.z };
}
function posMano() {
  if (PJ.rig) { PJ.rig.mano.getWorldPosition(_tmp); return { x: _tmp.x, y: _tmp.y, z: _tmp.z }; }
  return pecho();
}

function animarJugador(dt) {
  const rig = PJ.rig;
  if (!rig) return;
  const g = rig.grupo;
  if (P.modo === 'tierra') {
    g.position.set(P.pos.x, P.pos.y + (P.rodar.t > 0 ? -0.2 : 0), P.pos.z);
    g.rotation.y = P.yaw;
    g.rotation.x = P.rodar.t > 0 ? -((0.42 - P.rodar.t) / 0.42) * TAU : 0;
    g.visible = true;
  }
  const vel = Math.hypot(P.vel.x, P.vel.z);
  const tool = P.tool === 'dinamita' && !tiene('dinamita') ? null : P.tool;
  if (tool) mostrarHerramienta(rig, tool); else mostrarHerramienta(rig, '');
  if (tool === 'arma') mostrarArma(rig, G.armaSel);
  rig.matCana && rig.matCana.color.set(CANIAS[G.cana].color);
  if (rig.matPunta && G.arpon >= 0) rig.matPunta.color.set(ARPONES[G.arpon].color);
  const peleando = LINEA.estado === 'pelea';
  const acc = P.accion > 0 ? Math.sin((1 - P.accion) * Math.PI) : 0;
  animarPersona(rig, dt, P.modo === 'bote' ? 0 : vel, { herr: !!tool, acc, alza: tool === 'arma' ? 0.92 : peleando ? 0.62 : tool === 'cana' ? 0.5 : 0.38, brazoIzq: tool === 'arma' ? -1.15 : undefined, comiendo: P.comiendo > 0 });
  // la caña se dobla con la tensión
  const T = LINEA.estado === 'pelea' && LINEA.pelea ? LINEA.pelea.T : 0;
  const bend = T * 0.5 + (peleando ? 0.1 : 0);
  if (rig.tramos) rig.tramos.forEach((t, i) => { t.rotation.x = bend * (0.4 + i * 0.3) * (peleando ? 1 : 0.4); });
  if (rig.carretel && IN.botones[0] && peleando) rig.carretel.rotation.x += dt * 25;
  if (rig.mats[0]) rig.mats[0].emissive.setRGB(P.flash * 0.85, P.flash * 0.1, P.flash * 0.1);
  // parpadeo de invulnerabilidad
  g.visible = !(P.inv > 0 && P.flash < 0.1 && Math.floor(J.t * 16) % 2 === 0 && P.rodar.t <= 0);
}

// ---------------------------------------------------------------------------
// Cámara en tercera persona
// ---------------------------------------------------------------------------
const _foco = new THREE.Vector3(), _deseada = new THREE.Vector3();
function actualizarCamara(dt) {
  const cam = ESC.camara;
  const apunta = P.tool && (LINEA.estado !== 'libre' || P.tool !== 'cana' || P.accion > 0) && P.modo === 'tierra';
  const jef = jefeEnPantalla && jefeEnPantalla();
  let distObj = CAM.distObj * (jef ? 1.5 : 1);
  if (apunta && !jef) distObj = Math.min(distObj, 4.8);
  CAM.dist += (distObj - CAM.dist) * Math.min(1, dt * 4);
  const lado = apunta ? 0.55 : 0;
  CAM.lado = (CAM.lado || 0) + (lado - (CAM.lado || 0)) * Math.min(1, dt * 5);
  const altoFoco = P.modo === 'bote' ? 2.2 : 2.3;
  _foco.set(P.pos.x, P.pos.y + altoFoco, P.pos.z);
  const cy = Math.cos(CAM.yaw), sy = Math.sin(CAM.yaw), cp = Math.cos(CAM.pitch), sp = Math.sin(CAM.pitch);
  const dirx = sy * cp, diry = -sp, dirz = cy * cp;
  const rx = cy, rz = -sy;
  _foco.x += rx * CAM.lado; _foco.z += rz * CAM.lado;
  // distancia libre hasta la cámara (no atravesar terreno ni edificios)
  let libreT = CAM.dist;
  for (let t = 0.6; t <= CAM.dist; t += 0.5) {
    const x = _foco.x + dirx * t, y = _foco.y + diry * t, z = _foco.z + dirz * t;
    const suelo = Math.max(H(x, z), enMuelle(x, z) ? MUELLE.alto : -99);
    if (y < suelo + 0.35 || y < 0.35 || (y < 8 && MUN.solidos.some((s) => x > s.x0 - 0.3 && x < s.x1 + 0.3 && z > s.z0 - 0.3 && z < s.z1 + 0.3))) { libreT = Math.max(1.0, t - 0.6); break; }
  }
  CAM.dEfect = libreT < (CAM.dEfect || libreT) ? libreT : (CAM.dEfect || libreT) + (libreT - (CAM.dEfect || libreT)) * Math.min(1, dt * 3);
  _deseada.set(_foco.x + dirx * CAM.dEfect, _foco.y + diry * CAM.dEfect, _foco.z + dirz * CAM.dEfect);
  _deseada.y = Math.max(_deseada.y, 0.45 + alturaOla(_deseada.x, _deseada.z, J.t) * 0.5, H(_deseada.x, _deseada.z) + 0.4);
  cam.position.copy(_deseada);
  if (CAM.shake > 0.01) { const s = CAM.shake * 0.018; cam.position.x += rand(-s, s); cam.position.y += rand(-s, s); cam.position.z += rand(-s, s); }
  cam.lookAt(_foco.x + (CAM.shake > 0.01 ? rand(-0.01, 0.01) : 0), _foco.y, _foco.z);
  // campo de visión: se abre al correr o navegar rápido
  const vel = Math.hypot(P.vel.x, P.vel.z);
  const fovObj = 62 + clamp((vel - 4.3) * 1.4, 0, 6) + (jef ? 6 : 0);
  CAM.fov += (fovObj - CAM.fov) * Math.min(1, dt * 4);
  if (Math.abs(cam.fov - CAM.fov) > 0.05) { cam.fov = CAM.fov; cam.updateProjectionMatrix(); escalaFX(); }
}

// ---------------------------------------------------------------------------
// Acciones
// ---------------------------------------------------------------------------
function procesarAcciones() {
  if (J.panel || J.modo !== 'jugando') return;
  if (pulsada('Digit1')) elegirHerramienta('cana');
  if (pulsada('Digit2')) elegirHerramienta('arpon');
  if (pulsada('Digit3')) elegirHerramienta('red');
  if (pulsada('Digit4')) elegirHerramienta('dinamita');
  if (pulsada('Digit5')) elegirHerramienta('arma');
  if (pulsada('KeyR')) recargarArma();
  if (IN.rueda && apretada('ControlLeft') === false && !IN.bloqueado && false) { /* la rueda mueve la cámara */ }
  if (pulsada('KeyF')) comerMejor();
  if (pulsada('KeyH')) curarMejor();
  if (pulsada('KeyB')) alternarCarnada();
  if (pulsada('KeyI')) abrirPanel('mochila');
  if (pulsada('KeyC')) abrirPanel('bitacora');
  if (pulsada('KeyM')) abrirPanel('mapa');
  if (pulsada('KeyT') && !MPV.abierto) abrirChat();
  if (pulsada('KeyG')) alternarEmotes();
  if (pulsada('Escape') || pulsada('KeyP')) abrirPanel('pausa');
  if (pulsada('KeyQ') || IN.dinaTactil) lanzarDinamita();
  IN.dinaTactil = false;
  if (IN.pulsoBoton[2] || IN.arponTactil) lanzarArpon();
  IN.arponTactil = false;
  const clic = IN.pulsoBoton[0];
  const espacio = pulsada('Space') || IN.accionPulso;
  IN.accionPulso = false;
  const L = LINEA;
  if (L.estado === 'picada' && (espacio || clic)) clavar();
  else if (P.tool === 'cana' && (clic || (espacio && L.estado !== 'libre') || (IN.accionTactilPulso && L.estado === 'libre'))) {
    if (L.estado === 'libre') { if (clic || IN.accionTactilPulso) lanzarCana(); } else if ((L.estado === 'espera' || L.estado === 'mordisqueo') && L.t > 0.35) recogerLinea();
  } else if (P.tool === 'arpon' && (clic || IN.accionTactilPulso)) lanzarArpon();
  else if (P.tool === 'red' && (clic || IN.accionTactilPulso)) lanzarRed();
  else if (P.tool === 'dinamita' && (clic || IN.accionTactilPulso)) lanzarDinamita();
  else if (P.tool === 'arma') usarArma(clic || IN.accionTactilPulso, IN.botones[0] || IN.accionTactil);
  IN.accionTactilPulso = false;
}
function herramientaDisponible(t) {
  if (t === 'cana') return true;
  if (t === 'arpon') return G.arpon >= 0;
  if (t === 'red') return G.red >= 0;
  if (t === 'arma') return ARMAS.some((a) => G.armas[a.id]);
  return t === 'dinamita';
}
function elegirHerramienta(t) {
  if (!herramientaDisponible(t)) {
    toast(t === 'arpon' ? 'Todavía no tenés arpón. Se compra en el almacén.' : t === 'arma' ? 'Todavía no tenés ningún arma. Se consiguen en la Isla Arsenal (Nivel 2): se llega en lancha o pesquero.' : 'Todavía no tenés red. Se compra en el almacén.', '#ffe39a'); sfx('error'); return;
  }
  if (t === 'arma') ciclarArma();
  if (t === 'dinamita' && !tiene('dinamita')) { toast('No te queda dinamita. Se compra en el almacén.', '#ffe39a'); sfx('error'); }
  if (t !== 'cana' && (LINEA.estado === 'espera' || LINEA.estado === 'mordisqueo')) recogerLinea(true);
  P.tool = t;
  sfx('click');
}
function alternarCarnada() {
  if (!tiene('carnada')) { toast('No tenés carnada de jefe. Se compra en el almacén de Don Anselmo.', '#ffe39a'); sfx('error'); return; }
  G.carnadaArmada = !G.carnadaArmada;
  toast(G.carnadaArmada ? 'Carnada de jefe lista: lanzá cerca de la sombra de un jefe.' : 'Carnada guardada.', '#ffd86a');
  sfx('click');
}

function interactuar(poi) {
  if (poi.id.startsWith('cofre:')) { abrirCofre(poi.id.slice(6)); return; }
  if (poi.accionBote) { poi.accionBote(); return; }
  abrirLugar(poi.id);
}
function cofreDisponible(id) { const c = MUN.cofres.find((x) => x.id === id); return c && c.dia !== G.dia; }
function abrirCofre(id) {
  const c = MUN.cofres.find((x) => x.id === id);
  if (!c || c.dia === G.dia) return;
  c.dia = G.dia;
  const plata = randi(c.premio[0], c.premio[1]);
  G.plata += plata;
  let extra = '';
  const arsenal = c.isla === 'arsenal';
  if (chance(arsenal ? 0.7 : 0.35)) {
    const it = pick(arsenal ? [['balas', 30], ['cartuchos', 12], ['cohetes', 2], ['botiquin', 2], ['dinamita', 4], ['elixir', 1]] : [['dinamita', 3], ['botiquin', 1], ['carnada', 1], ['vendas', 3], ['empanada', 3]]);
    darItem(it[0], it[1]); extra = ` y ${it[1]} ${ITEMS[it[0]].nombre}`;
  }
  mostrarHallazgo({ titulo: '¡Cofre enterrado!', icono: 'cofre', texto: 'Estaba bajo la arena. Vuelve a llenarse mañana.' + (extra ? ' Había' + extra + '.' : ''), plata, oro: true });
  sfx('tesoro');
  const p = pecho();
  lluviaMonedas(p.x, p.y, p.z, 20);
  stat('cofres');
  revisarMisiones();
  guardar();
}
const stat = (k) => { G.stats[k] = (G.stats[k] || 0) + 1; };

// ---- Comer y curarse ---------------------------------------------------------
function comerMejor() {
  if (P.cdItem > 0) return;
  const falta = 100 - P.hambre;
  const lista = COMIDAS.filter((c) => tiene(c.id)).sort((a, b) => a.hambre - b.hambre);
  if (!lista.length) { toast('No tenés comida. Comprá en lo de Doña Rosa o cociná un pescado (mochila).', '#ffe39a'); sfx('error'); return; }
  if (falta < 6) { toast('No tenés hambre.', '#ffe39a'); return; }
  usarComida(lista.find((c) => c.hambre >= falta - 4) || lista[lista.length - 1]);
}
function usarComida(c) {
  sacarItem(c.id);
  P.hambre = Math.min(100, P.hambre + c.hambre);
  if (c.hp) P.hp = Math.min(P.hpMax, P.hp + c.hp);
  if (c.buff) P.buffs.push({ id: c.buff.id, mult: c.buff.mult, hasta: J.t + c.buff.dur, txt: c.buff.txt, icono: c.icono });
  P.cdItem = 0.7; P.comiendo = 0.7;
  G.stats.comidas++;
  const p = pecho();
  textoFlotante(p.x, p.y + 0.7, p.z, `+${c.hambre} hambre`, '#ffb55a', 18);
  sfx('comer');
  revisarMisiones();
}
function curarMejor() {
  if (P.cdItem > 0) return;
  const falta = P.hpMax - P.hp;
  const lista = CURAS.filter((c) => tiene(c.id)).sort((a, b) => a.hp - b.hp);
  if (!lista.length) { toast('No tenés botiquines. Comprá en lo de Doña Rosa.', '#ffe39a'); sfx('error'); return; }
  if (falta < 5) { toast('Estás sano.', '#ffe39a'); return; }
  usarCura(lista.find((c) => c.hp >= falta - 4) || lista[lista.length - 1]);
}
function usarCura(c) {
  sacarItem(c.id);
  const antes = P.hp;
  P.hp = Math.min(P.hpMax, P.hp + c.hp);
  P.cdItem = 0.7; P.comiendo = 0.5;
  G.stats.curas++;
  const p = pecho();
  textoFlotante(p.x, p.y + 0.7, p.z, `+${Math.round(P.hp - antes)} vida`, '#7dffa0', 20);
  chispas(p.x, p.y, p.z, '#7dffa0', 14, 3);
  sfx('curar');
  revisarMisiones();
}
function comerPez(idx, cocinado) {
  const p = G.peces[idx];
  if (!p) return;
  const sp = SP[p.id];
  let hh = 12 + Math.min(58, Math.sqrt(valorBase(p)) * 2.2);
  if (!cocinado) hh *= 0.55;
  const c = pecho();
  if (sp.veneno && !cocinado) {
    P.hp = Math.max(1, P.hp - 22); P.flash = 1;
    toast('¡El pez globo crudo es veneno! -22 vida. Cocinalo en la fogata.', '#ff9d8a');
    sfx('hurt');
  } else {
    P.hambre = Math.min(100, P.hambre + hh);
    if (cocinado && sp.rareza >= 2) P.buffs.push({ id: 'todo', mult: 1.06, hasta: J.t + 150, txt: 'Todo +6%', icono: '🍣' });
    textoFlotante(c.x, c.y + 0.7, c.z, `+${Math.round(hh)} hambre`, '#ffb55a', 18);
    sfx('comer');
  }
  G.peces.splice(idx, 1);
  G.stats.comidas++;
  revisarMisiones();
}

// ---- Daño y desmayo ----------------------------------------------------------------
function herirJugador(dmg, fuente) {
  if (P.inv > 0 || J.modo !== 'jugando') return false;
  dmg = Math.round(dmg / bonoBuff('resistencia'));
  P.hp = Math.max(0, P.hp - dmg);
  P.flash = 1; P.inv = 0.8; P.sinDano = 0;
  const p = pecho();
  textoFlotante(p.x, p.y + 0.8, p.z, '-' + dmg, '#ff6b5a', 28);
  chispas(p.x, p.y, p.z, '#ff6b5a', 10, 3);
  sacudir(16);
  sfx('hurt');
  const d = $('#danio'); if (d) { d.classList.remove('on'); void d.offsetWidth; d.classList.add('on'); }
  void fuente;
  return true;
}
function desmayarse() {
  if (J.modo !== 'jugando') return;
  J.modo = 'desmayo';
  G.stats.muertes++;
  soltarTodo();
  for (const b of BOSSES) jefeRetirarse(b);
  PELIGROS.length = 0;
  if (P.modo === 'bote' && typeof bajarDelBote === 'function') bajarDelBote(true);
  soltarLock();
  mostrarDesmayo();
}
function despertar() {
  const cobro = Math.min(Math.round(G.plata * 0.12), 20000);
  G.plata -= cobro;
  G.dia++;
  J.hora = 7.2;
  const c = MUN.pois.find((p) => p.id === 'cabana');
  iniciarJugador({ x: c.x, z: c.z + 2.2 });
  P.hp = Math.round(P.hpMax * 0.6);
  P.hambre = 55;
  J.modo = 'jugando';
  guardar();
  return cobro;
}

// ---------------------------------------------------------------------------
// NPCs
// ---------------------------------------------------------------------------
function crearNPCs() {
  const mk = (id, x, z, o, frases, mirar) => {
    const rig = crearPersona(Object.assign({ fase: Math.random() * 10 }, o));
    const y = alturaPiso(x, z);
    rig.grupo.position.set(x, y, z);
    ESC.escena.add(rig.grupo);
    const n = { id, rig, x, z, y, yaw: mirar || 0, frases, fraseT: rand(3), burbuja: null };
    PJ.npcs.push(n);
    NPCS.push(n);
    O_solido(x, z);
  };
  const O_solido = (x, z) => MUN.circulos.push({ x, z, r: 0.5 });
  const m = MUN.edificios.find((e) => e.id === 'mercado'), t = MUN.edificios.find((e) => e.id === 'tienda'), c = MUN.edificios.find((e) => e.id === 'casino'), f = MUN.edificios.find((e) => e.id === 'faro');
  mk('rosa', m.x + 4.6, m.z + 4.9, { camisa: '#e0553d', delantal: '#ffffff', sombrero: 'panuelo', piel: piel.medio, flores: false }, ['¡Pejerrey fresquito, recién bajado!', 'Si no comés, no pescás, nene.', 'Los jefes se pagan lindo. Los cuerpos, ni te cuento.', 'Hoy el atún está por las nubes.']);
  mk('anselmo', t.x - 4.6, t.z + 4.9, { camisa: '#2b9bb0', sombrero: 'gorra', piel: piel.moreno, anteojos: true, flores: false }, ['Cañas, arpones y carnada. De todo, menos fiado.', 'Con mejor caña llegás más lejos.', 'Un bote te abre el mar entero.', 'La dinamita no es un juguete. Pero es divertida.']);
  mk('turco', c.x + 5.5, c.z + c.d / 2 + 3, { camisa: '#7a3ea8', chaleco: '#2a1340', sombrero: 'galera', piel: piel.medio, bigote: '#1c1410', flores: false }, ['Pase, amigo: la casa invita... a perder.', 'La suerte es de los valientes.', '¡Doble o nada! ¿Se anima?', 'El pozo está bien cargado hoy.']);
  mk('capitan', f.x - 3.2, f.z + 5, { camisa: '#f4f6f8', sombrero: 'capitan', piel: piel.claro, barba: '#e8ecef', flores: false }, ['El mar da y el mar quita.', 'Reparar el barco... eso sí que cuesta.', 'Hay cosas enormes allá abajo, marinero.', 'De noche, mejor no pescar cerca del abismo.']);
}
function actualizarNPCs(dt) {
  for (const n of PJ.npcs) {
    const dx = P.pos.x - n.x, dz = P.pos.z - n.z, d = Math.hypot(dx, dz);
    if (d < 11) n.yaw = turnToward(n.yaw, Math.atan2(dx, dz), dt * 4);
    n.rig.grupo.rotation.y = n.yaw;
    animarPersona(n.rig, dt, 0, { mirar: 0 });
    // burbuja de diálogo
    if (d < 8 && !J.panel) {
      if (!n.burbuja) n.burbuja = h('div', 'burbuja', '', $('#flotantes'));
      const i = Math.floor((J.t + n.fraseT * 3) / 5.5) % n.frases.length;
      if (n.burbuja.dataset.i !== String(i)) { n.burbuja.dataset.i = String(i); n.burbuja.textContent = n.frases[i]; }
      _p.set(n.x, n.y + 2.35, n.z).project(ESC.camara);
      n.burbuja.style.display = _p.z < 1 ? '' : 'none';
      n.burbuja.style.transform = `translate(-50%,-100%) translate(${((_p.x + 1) / 2) * J.w}px, ${((1 - _p.y) / 2) * J.h}px)`;
    } else if (n.burbuja) { n.burbuja.remove(); n.burbuja = null; }
  }
}

// Marca de puntería en el agua
function actualizarMarca() {
  const m = PJ.marca;
  if (!m) return;
  const eq = typeof equipoCana === 'function' ? equipoCana() : { alcance: 24 };
  let ver = false;
  const usaMarca = (P.tool === 'cana' && LINEA.estado === 'libre') || P.tool === 'arpon' || P.tool === 'red' || P.tool === 'dinamita';
  if (usaMarca && J.modo === 'jugando' && !J.panel && P.mira.agua) {
    ver = true;
    let alcance = eq.alcance;
    if (P.tool === 'arpon') alcance = arponActual() ? arponActual().alcance : 0;
    if (P.tool === 'red') alcance = redActual() ? redActual().alcance : 0;
    if (P.tool === 'dinamita') alcance = DINAMITA.alcance;
    const dd = P.mira.dist;
    const fuera = dd > alcance;
    let x = P.mira.x, z = P.mira.z;
    if (fuera && alcance > 0) { const k = alcance / dd; x = P.pos.x + (P.mira.x - P.pos.x) * k; z = P.pos.z + (P.mira.z - P.pos.z) * k; }
    m.position.set(x, alturaOla(x, z, J.t) + 0.08, z);
    const esc = P.tool === 'red' ? (redActual() ? redActual().radio : 1) : P.tool === 'dinamita' ? DINAMITA.radio : 0.8 + 0.1 * Math.sin(J.t * 6);
    m.scale.set(esc, 1, esc);
    m.material.color.set(alcance <= 0 ? '#ff6a5a' : fuera ? '#ffb347' : '#ffffff');
    m.material.opacity = 0.7;
  }
  m.visible = ver;
  const mira = $('#mira');
  if (mira) {
    mira.hidden = !(J.modo === 'jugando' && !J.panel);
    mira.className = LINEA.estado === 'picada' ? 'pique' : P.mira.agua ? 'agua' : P.mira.tierra ? 'tierra' : '';
  }
}
