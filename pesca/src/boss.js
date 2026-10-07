'use strict';
// Jefes en 3D: patrullan el mar como sombras enormes. Con carnada de jefe y un lanzamiento cerca, pican y empieza el combate.
// Cada ataque avisa con una zona roja que se llena sobre el agua: esquivá (V o correr) y castigá cuando queda aturdido (daño x2).

const REAPARECE_JEFE = 240; // segundos hasta que un jefe vuelve
const RANGO_CEBO = 38; // metros: a esa distancia de la boya un jefe nota la carnada
// Multijugador: el jefe apunta a un jugador (en solitario, siempre a vos). Con otros jugadores, el anfitrión elige a quién y los demás solo ven.
const blanco = (b) => b.blanco || P.pos;
const esProxy = () => RED.activa && !RED.anfitrion;

const ARTE_JEFE = {
  cangrejo: { sp: { arte: { forma: 'cangrejo', c1: '#e0583a', c2: '#f7a07f' } }, L: 8.2, y: -1.0, ysub: -2.6 },
  tiburon: { sp: { arte: { forma: 'tiburon', c1: '#7f93a8', c2: '#f4f7fa', variante: 'blanco' } }, L: 9.5, y: -0.25, ysub: -2.2 },
  anguila: { sp: { arte: { forma: 'morena', c1: '#3b5a2c', c2: '#e8d94a' } }, L: 26, y: -0.35, ysub: -2.0 },
  pulpo: { sp: { arte: { forma: 'pulpo', c1: '#a05fb8', c2: '#e2b4ef' } }, L: 15, y: -1.2, ysub: -3.0 },
  leviatan: { sp: { arte: { forma: 'morena', c1: '#14307a', c2: '#46d6ff' } }, L: 48, y: -0.7, ysub: -3.5 },
};

function crearModeloJefe(def) {
  const cfg = ARTE_JEFE[def.forma];
  let mod;
  if (def.forma === 'cangrejo') mod = crearCangrejo(cfg.sp, cfg.L, true);
  else if (def.forma === 'tiburon') mod = crearTiburon(cfg.sp, cfg.L, true);
  else if (def.forma === 'pulpo') mod = crearPulpo(cfg.sp, cfg.L, true);
  else if (def.forma === 'anguila') mod = crearSerpiente(cfg.sp, cfg.L, { n: 26, grosor: 0.05, amp: 0.07, k: 1.6, altoAleta: 0.6, cAleta: '#ffd92b' });
  else {
    mod = crearSerpiente(cfg.sp, cfg.L, { n: 34, grosor: 0.04, amp: 0.05, k: 1.4, altoAleta: 0.9, cAleta: '#2aa8ff' });
    adornosLeviatan(mod, cfg.L);
  }
  return mod;
}
function adornosLeviatan(mod, L) {
  const cab = mod.mallas[0], M = matCria();
  const r = L * 0.04;
  const adornos = mod.luces || (mod.luces = []); // se ocultan cuando va sumergido (solo sombra)
  const luz = new THREE.MeshBasicMaterial({ color: '#7cf3ff', fog: false });
  const poner = (o, pad) => { (pad || cab).add(o); adornos.push(o); return o; };
  for (const sd of [-1, 1]) {
    const cuerno = new THREE.Mesh(colorear(new THREE.ConeGeometry(r * 0.55, r * 4.5, 6), '#e8f6ff'), M.vc);
    cuerno.position.set(-r * 0.3, r * 0.9, sd * r * 1.2);
    cuerno.rotation.set(sd * 0.9, 0, 0.6);
    poner(cuerno);
    const ojo = new THREE.Mesh(new THREE.SphereGeometry(r * 0.42, 10, 8), luz);
    ojo.position.set(r * 0.35, r * 0.3, sd * r * 0.85);
    poner(ojo);
    for (let k = 0; k < 3; k++) {
      const barba = new THREE.Mesh(colorear(new THREE.CylinderGeometry(r * 0.08, r * 0.03, r * 4, 5), '#46d6ff'), M.vc);
      barba.position.set(r * 1.5, -r * 0.4, sd * r * (0.4 + k * 0.35));
      barba.rotation.set(sd * (0.5 + k * 0.2), 0, Math.PI / 2 - 0.3);
      poner(barba);
    }
  }
  mod.segs.forEach((s, i) => { if (i > 3 && i % 3 === 0) { const run = new THREE.Mesh(new THREE.SphereGeometry(L * 0.012, 6, 5), luz); run.position.set(0, L * 0.03, 0); poner(run, s.m); } });
}

function crearJefes() {
  for (const b of BOSSES) { if (b.mod) ESC.escena.remove(b.mod.grupo); if (b.estrellas) ESC.escena.remove(b.estrellas); }
  BOSSES.length = 0;
  for (const def of JEFES) {
    if (def.tierra) { if (typeof crearJefeTierra === 'function') crearJefeTierra(def); continue; } // los de tierra los arma boss-tierra.js
    const mod = crearModeloJefe(def);
    mod.sombraRT = false;
    // material propio: el destello de los golpes no se contagia a los demás peces
    const mc = MAT_CRIA.vc.clone();
    mod.grupo.traverse((o) => { if (o.isMesh && o.material === MAT_CRIA.vc) { o.material = mc; if (o.userData.matColor) o.userData.matColor = mc; } });
    mod.matColor = mc;
    modoModelo(mod, 'sombra', 'abismo');
    mod.grupo.visible = false;
    ESC.escena.add(mod.grupo);
    const b = {
      def, mod, estado: 'patrulla', x: 0, z: 0, ang: 0, vel: 0, hp: def.hp, hpMax: def.hp, t: rand(100), fase0: rand(TAU), orb: rand(TAU),
      respawn: 0, fase: 0, aturdido: 0, cd: 0, atk: null, flash: 0, alza: 0, abierto: 0, muerteT: 0, hooked: false, emerge: 1, y: ARTE_JEFE[def.forma].ysub,
      vida: 1, kid: 0, contrib: {}, cebo: null, blanco: null, blancoId: null, cuerpoLocal: null, botinPendiente: false, botinEn: 0, dignos: [],
    };
    const p = posicionOrbita(b);
    b.x = p.x; b.z = p.z; b.ang = p.th + Math.PI / 2;
    BOSSES.push(b);
  }
}
function posicionOrbita(b) {
  const d = b.def;
  const th = d.ang + d.vaiven * Math.sin((b.t * TAU) / d.per + b.orb);
  const p = puntoCosta(th, d.d + Math.sin(b.t * 0.37 + b.orb) * 6);
  return { x: p.x, z: p.z, th };
}
const minDist = (b) => 3 + b.def.radio * 0.7;
const jefeVisible = (b) => b.estado !== 'oculto' && b.estado !== 'muerto';
function jefeEnPantalla() {
  for (const b of BOSSES) if ((b.estado === 'pelea' || b.estado === 'muriendo' || b.estado === 'mordiendo') && Math.hypot(b.x - P.pos.x, b.z - P.pos.z) < 240) return b;
  return null;
}
// Jugadores a los que un jefe puede apuntar: yo (si estoy en pie) y los demás de la sala (si se los ve vivos y recientes)
function blancosPosibles() {
  const L = [];
  if (J.modo === 'jugando' && P.hp > 0) L.push({ id: 'yo', pos: P.pos, local: true });
  if (RED.activa) {
    const ahora = performance.now();
    for (const r of RED.remotos.values()) { const q = r.pose; if (q && r.posBlanco && ahora - q.t < 4000 && q.hp > 0 && !(q.f & 16)) L.push({ id: r.id, pos: r.posBlanco, local: false }); }
  }
  return L;
}
// El jugador más cercano dentro de `rango` (y con diferencia de altura < dy)
function blancoCercano(b, rango, dy = 99) {
  let mejor = null, md = rango;
  for (const q of blancosPosibles()) { const d = Math.hypot(q.pos.x - b.x, q.pos.z - b.z); if (d < md && Math.abs(q.pos.y - b.y) < dy) { md = d; mejor = q; } }
  return mejor;
}
// Elige a quién pelea (se queda con el mismo salvo que otro esté bastante más cerca); null si no hay nadie dentro de `rango`
function elegirBlancoJefe(b, rango) {
  let mejor = null, md = rango, actual = null;
  for (const q of blancosPosibles()) {
    const d = Math.hypot(q.pos.x - b.x, q.pos.z - b.z);
    if (q.id === b.blancoId) actual = { q, d };
    if (d < md) { md = d; mejor = q; }
  }
  if (actual && actual.d < rango && (!mejor || actual.d <= md * 1.3 + 2)) mejor = actual.q;
  b.blancoId = mejor ? mejor.id : null;
  b.blanco = mejor ? mejor.pos : null;
  return mejor;
}
const jugadoresCerca = (b, r) => Math.max(1, blancosPosibles().filter((q) => Math.hypot(q.pos.x - b.x, q.pos.z - b.z) < r).length);
// Vida máxima de un jefe: crece 20 % cada vez que lo vencés (hasta 5) y 65 % por cada jugador extra que pelea
function hpMaxJefe(def, cerca = 1) { return Math.round(def.hp * (1 + 0.2 * Math.min(5, jefeKills(def.id))) * (1 + 0.65 * (clamp(cerca, 1, 6) - 1))); }
const miIdRed = () => (RED.activa && RED.yo ? String(RED.yo) : 'yo');

function jefeRetirarse(b) {
  if (b.tierra) { reiniciarJefeTierra(b); return; }
  if (b.estado === 'pelea' || b.estado === 'atraido' || b.estado === 'mordiendo') {
    b.estado = 'huyendo'; b.atk = null; b.hooked = false; b.alza = 0; b.abierto = 0; b.aturdido = 0;
    b.hp = Math.min(b.hpMax, b.hp + b.hpMax * 0.1);
  }
}
function jefeSoltarCebo(b) {
  if (esProxy()) { if (b.estado === 'atraido' || b.estado === 'mordiendo' || b.estado === 'patrulla') pedirSoltarCebo(b); if (LINEA.jefe === b) LINEA.jefe = null; return; }
  if (b.estado === 'atraido' || b.estado === 'mordiendo') { b.estado = 'huyendo'; b.cebo = null; }
  if (LINEA.jefe === b) LINEA.jefe = null;
}
function jefeBuscarCebo(x, z) {
  let mejor = null, md = RANGO_CEBO;
  for (const b of BOSSES) {
    if (b.estado !== 'patrulla') continue;
    const d = Math.hypot(b.x - x, b.z - z);
    if (d < md) { md = d; mejor = b; }
  }
  return mejor;
}
// Un jefe nota la carnada: el anfitrión lo atrae a la boya; otro jugador se lo pide al anfitrión
function jefeCebado(b) {
  if (esProxy()) { pedirCebo(b, LINEA.x, LINEA.z); return; }
  b.estado = 'atraido'; b.cebo = { local: true, id: 'yo' };
}

function actualizarJefes(dt) {
  const proxy = esProxy();
  for (const b of BOSSES) {
    if (b.cuerpoLocal) cuerpoJefe(b, dt);
    if (b.botinPendiente && J.t >= b.botinEn) recompensasJefe(b);
    if (proxy) { actualizarJefeProxy(b, dt); continue; }
    if (b.tierra) { actualizarJefeTierra(b, dt); sincronizarJefeTierra(b, dt); continue; }
    b.t += dt;
    b.flash = Math.max(0, b.flash - dt * 4);
    b.emerge = Math.min(1, b.emerge + dt * 1.2);
    const px = b.x, pz = b.z;
    switch (b.estado) {
      case 'oculto':
        if (J.luz < 0.3) { b.estado = 'patrulla'; const p = posicionOrbita(b); b.x = p.x; b.z = p.z; toast('Algo enorme se mueve en el abismo...', '#9fb8ff'); sfx('jefeCerca'); }
        break;
      case 'patrulla': {
        if (b.def.cuando === 'noche' && J.luz > 0.5) { b.estado = 'oculto'; break; }
        const p = posicionOrbita(b);
        b.x = lerp(b.x, p.x, Math.min(1, dt * 1.5)); b.z = lerp(b.z, p.z, Math.min(1, dt * 1.5));
        const dx = b.x - px, dz = b.z - pz;
        if (Math.hypot(dx, dz) > 0.002) b.ang = turnToward(b.ang, Math.atan2(dz, dx), dt * 1.5);
        b.vel = Math.hypot(dx, dz) / dt;
        avisoSombra(b);
        break;
      }
      case 'atraido': {
        const cb = ceboDe(b);
        if (!cb) { b.estado = 'huyendo'; b.cebo = null; break; }
        const des = Math.atan2(cb.z - b.z, cb.x - b.x);
        b.ang = turnToward(b.ang, des, dt * 2.2);
        const v = b.def.vel * 1.5;
        b.x += Math.cos(b.ang) * v * dt; b.z += Math.sin(b.ang) * v * dt;
        b.vel = v;
        if (Math.random() < dt * 4) ondaAgua(b.x + rand(-3, 3), b.z + rand(-3, 3), 4, 1, 0.4, 1);
        if (Math.hypot(b.x - cb.x, b.z - cb.z) < b.def.radio + 3) {
          b.estado = 'mordiendo'; b.tMuerde = 0;
          if (cb.local) { LINEA.estado = 'picada'; LINEA.t = 0; LINEA.ventana = 1.8; LINEA.hundida = 1; LINEA.pez = null; toast('¡EL JEFE PICÓ! ¡Clavá!', '#ff8a7a'); }
          chapoteo(cb.x, cb.z, 20, 1.8);
          if (cb.local) { sfx('rugido'); sacudir(22); }
        }
        break;
      }
      case 'mordiendo': {
        b.vel = 0; b.tMuerde = (b.tMuerde || 0) + dt;
        if (b.cebo && b.cebo.id && b.cebo.id !== 'yo') {
          // el que lo cebó es otro jugador: se queda mordiendo mientras su línea siga en "picada"; si clava, pasa a pelear
          const r = RED.remotos.get(b.cebo.id), l = r && r.p && Array.isArray(r.p.l) ? r.p.l : null;
          if (!l || (l[0] !== 4 && l[0] !== 5 && b.tMuerde > 1.2)) { b.estado = 'huyendo'; b.cebo = null; }
        } else if (LINEA.jefe !== b || LINEA.estado !== 'picada') { b.estado = LINEA.estado === 'pelea' ? 'pelea' : 'huyendo'; if (b.estado === 'huyendo') b.cebo = null; }
        break;
      }
      case 'pelea': elegirBlancoMar(b); iaJefe(b, dt); break;
      case 'muriendo': muriendoJefe(b, dt); break;
      case 'huyendo': {
        const p = posicionOrbita(b);
        const d = Math.hypot(b.x - p.x, b.z - p.z);
        b.ang = turnToward(b.ang, Math.atan2(p.z - b.z, p.x - b.x), dt * 2);
        const v = Math.min(b.def.vel * 1.4, d * 0.6 + 2);
        b.x += Math.cos(b.ang) * v * dt; b.z += Math.sin(b.ang) * v * dt;
        b.vel = v;
        if (d < 4) b.estado = 'patrulla';
        break;
      }
      case 'muerto':
        b.respawn -= dt;
        if (b.respawn <= 0) reaparecerJefe(b);
        break;
      default:
    }
    sincronizarJefe(b, dt);
  }
}
// Aviso la primera vez que pasás cerca de la sombra de un jefe
function avisoSombra(b) {
  if (Math.hypot(b.x - P.pos.x, b.z - P.pos.z) < 90 && !(G.jefes[b.def.id] && G.jefes[b.def.id].visto) && J.t - BOSS3D.avisoT > 20) {
    BOSS3D.avisoT = J.t;
    (G.jefes[b.def.id] = G.jefes[b.def.id] || { kills: 0 }).visto = true;
    toast(`Una sombra gigante se mueve bajo el agua... (${b.def.nombre})`, '#ffb3a8');
    sfx('jefeCerca');
  }
}
// Dónde está la carnada que atrae al jefe: mi boya o la de otro jugador. null si ya no hay carnada.
function ceboDe(b) {
  const c = b.cebo;
  if (!c) return null;
  if (c.local || !c.id || c.id === 'yo') {
    if (LINEA.jefe !== b || (LINEA.estado !== 'espera' && LINEA.estado !== 'mordisqueo')) return null;
    return { x: LINEA.x, z: LINEA.z, local: true };
  }
  const r = RED.remotos.get(c.id), l = r && r.p && Array.isArray(r.p.l) ? r.p.l : null;
  if (!l || (l[0] !== 2 && l[0] !== 3) || !Number.isFinite(l[1]) || !Number.isFinite(l[2])) return null;
  return { x: l[1], z: l[2], local: false };
}
// Elige a quién pelea el jefe del mar (en solitario, a vos)
function elegirBlancoMar(b) {
  if (!RED.activa) { b.blanco = null; b.blancoId = 'yo'; return; }
  const q = elegirBlancoJefe(b, 230);
  if (!q) { b.estado = 'huyendo'; b.atk = null; b.aturdido = 0; b.alza = 0; b.abierto = 0; b.hp = Math.min(b.hpMax, b.hp + b.hpMax * 0.1); limpiarPeligros(); }
}
function sincronizarJefe(b, dt) {
  const m = b.mod, cfg = ARTE_JEFE[b.def.forma];
  const cuerpo = !!b.cuerpoLocal;
  const vis = (jefeVisible(b) || cuerpo) && Math.hypot(b.x - P.pos.x, b.z - P.pos.z) < 520;
  m.grupo.visible = vis;
  if (!vis) return;
  const sumergido = !cuerpo && (b.estado === 'patrulla' || b.estado === 'atraido' || b.estado === 'mordiendo' || b.estado === 'huyendo' || b.estado === 'oculto');
  const yObj = sumergido ? cfg.ysub : cuerpo ? 0.05 : b.estado === 'muriendo' ? cfg.y - Math.min(0.8, b.muerteT * 0.3) : cfg.y;
  b.y += (yObj - b.y) * Math.min(1, dt * (sumergido ? 1.2 : 2.5));
  const suelo = H(b.x, b.z);
  const y = Math.max(b.y, suelo + 0.2);
  m.grupo.position.set(b.x, y + (cuerpo ? Math.sin(b.t * 1.3) * 0.05 : 0), b.z);
  m.grupo.rotation.set(0, -b.ang, 0);
  if (cuerpo || (b.estado === 'muriendo' && b.muerteT > 0.8)) m.grupo.rotation.x = Math.PI;
  modoModelo(m, sumergido ? 'sombra' : 'color', 'abismo');
  m.animar(dt, Math.max(b.vel, 1.2), J.t, b.fase0);
  if (b.def.forma === 'cangrejo') {
    // pinzas levantadas durante el ataque
    m.grupo.rotation.z = Math.sin(J.t * 1.5) * 0.02 - b.alza * 0.07;
  }
  // destello de golpe y estrellas
  const em = b.flash > 0 ? b.flash * 0.7 : 0;
  if (m.matColor) m.matColor.emissive.setRGB(em, em, em);
  if (b.estado === 'pelea') {
    // aleteo / ola al desplazarse
    if (b.vel > 3 && Math.random() < dt * 8) ondaAgua(b.x + rand(-b.def.radio, b.def.radio), b.z + rand(-b.def.radio, b.def.radio), 3.4, 1.1, 0.5, 1);
  }
  // estrellas de aturdido
  if (!b.estrellas) { b.estrellas = new THREE.Group(); for (let i = 0; i < 3; i++) { const s = new THREE.Mesh(new THREE.OctahedronGeometry(0.35, 0), new THREE.MeshBasicMaterial({ color: '#ffe36b', fog: false })); b.estrellas.add(s); } ESC.escena.add(b.estrellas); }
  b.estrellas.visible = b.aturdido > 0 && b.estado === 'pelea';
  if (b.estrellas.visible) b.estrellas.children.forEach((s, i) => { const a = J.t * 4 + (i / 3) * TAU; s.position.set(b.x + Math.cos(a) * b.def.radio * 0.8, 2.6 + b.def.radio * 0.4 + Math.sin(a * 2) * 0.3, b.z + Math.sin(a) * b.def.radio * 0.8); s.rotation.y = a * 2; });
}
function reaparecerJefe(b) {
  b.hpMax = hpMaxJefe(b.def);
  b.hp = b.hpMax;
  b.estado = b.def.cuando === 'noche' && J.luz > 0.5 ? 'oculto' : 'patrulla';
  b.fase = 0; b.aturdido = 0; b.atk = null; b.hooked = false; b.alza = 0; b.abierto = 0; b.emerge = 1; b.cebo = null; b.cuerpoLocal = null; b.contrib = {}; b.vida = (b.vida || 1) + 1;
  const p = posicionOrbita(b);
  b.x = p.x; b.z = p.z; b.y = ARTE_JEFE[b.def.forma].ysub;
  if (G.jefes[b.def.id] && G.jefes[b.def.id].kills > 0) toast(`${b.def.nombre} volvió a su guarida, más fuerte.`, '#ffb3a8');
}

// ---------------------------------------------------------------------------
// Enganche y combate
// ---------------------------------------------------------------------------
function jefeEnganchado(b) {
  const L = LINEA, d = b.def;
  const re = b.estado === 'pelea';
  L.estado = 'pelea'; L.t = 0; L.jefe = b; L.pez = null;
  b.hooked = true; L.tEnganche = J.t;
  const pseudo = { id: d.id, kg: [1, 1], fuerza: d.fl, aguante: 99, pat: 'normal' };
  L.pelea = nuevaPelea(pseudo, 1, L.equipo, { boss: true });
  L.pelea.pullFijo = 0.4; L.pelea.T = 0.3;
  if (esProxy()) { pedirEnganche(b); chapoteo(b.x, b.z, re ? 12 : 30, re ? 1.5 : 3); sfx(re ? 'clavar' : 'rugido'); if (re) toast('¡Enganchado de nuevo!', '#9bffb0'); return; }
  if (re) { chapoteo(b.x, b.z, 12, 1.5); sfx('clavar'); toast('¡Enganchado de nuevo!', '#9bffb0'); b.blancoId = 'yo'; return; }
  empezarPeleaMar(b, 'yo');
}
// El jefe del mar empieza a pelear: lo llama quien lo engancha (si es el anfitrión) o el anfitrión cuando lo engancha otro jugador
function empezarPeleaMar(b, quien) {
  const d = b.def;
  const frac = b.hpMax > 0 ? clamp(b.hp / b.hpMax, 0, 1) : 1;
  b.estado = 'pelea'; b.emerge = 0; b.cebo = null;
  b.hpMax = hpMaxJefe(d, jugadoresCerca(b, 230)); b.hp = (frac > 0 ? frac : 1) * b.hpMax;
  b.fase = 0; b.aturdido = 0; b.atk = null; b.cd = 2.4; b.contrib = b.contrib || {}; b.blancoId = quien;
  (G.jefes[d.id] = G.jefes[d.id] || { kills: 0 }).visto = true;
  if (Math.hypot(b.x - P.pos.x, b.z - P.pos.z) < 280) { chapoteo(b.x, b.z, 30, 3); sfx('rugido'); sacudir(26); musica('jefe'); bannerJefe(d); }
}
// Posición de combate: en el agua, a "ac" metros del jugador, del lado donde ya está el jefe
function posCombate(b) {
  const d = b.def, T = blanco(b);
  let a0 = Math.atan2(b.z - T.z, b.x - T.x);
  if (d.forma === 'tiburon') a0 += Math.sin(b.t * 0.55) * 0.7;
  else if (d.forma === 'anguila') a0 += Math.sin(b.t * 0.8) * 0.9;
  const mdist = minDist(b);
  for (const k of [1, 1.35, 1.8, 2.4, 3.2]) {
    for (const off of [0, 0.35, -0.35, 0.7, -0.7, 1.1, -1.1, 1.6, -1.6, 2.2, -2.2, 3]) {
      const a = a0 + off, r = d.ac * k;
      const x = T.x + Math.cos(a) * r, z = T.z + Math.sin(a) * r;
      if (H(x, z) < -1.5 && distCosta(x, z) > mdist && Math.hypot(x, z) < MUNDO.R - 8) return { x, z };
    }
  }
  return { x: b.x, z: b.z };
}
function iaJefe(b, dt) {
  const d = b.def;
  b.aturdido = Math.max(0, b.aturdido - dt);
  const k = b.hp / b.hpMax;
  const fase = d.id === 'leviatan' ? (k < 0.33 ? 2 : k < 0.66 ? 1 : 0) : (k < 0.5 ? 1 : 0);
  if (fase > b.fase) {
    b.fase = fase; b.atk = null; b.aturdido = 0; b.cd = 1.4; b.alza = 0; b.abierto = 0;
    toast(`¡${d.nombre} se enfurece! (fase ${fase + 1})`, '#ff8a7a');
    sfx('rugido'); sacudir(26);
    chapoteo(b.x, b.z, 26, 3);
  }
  const haciaP = Math.atan2(blanco(b).z - b.z, blanco(b).x - b.x);
  const vel = d.vel * (1 + 0.18 * b.fase);
  if (b.atk) {
    b.atk.t += dt;
    if (ATAQUES[b.atk.id].act(b, b.atk, dt)) {
      b.atk = null;
      b.aturdido = d.stun;
      b.alza = 0; b.abierto = 0;
      b.cd = rand(1.4, 2.3) * (1 - 0.14 * b.fase);
      b.vel = 0;
    }
  } else if (b.aturdido > 0) { b.vel = 0; b.ang = turnToward(b.ang, haciaP, dt * 0.8); } else {
    const tg = posCombate(b);
    const dd = Math.hypot(b.x - tg.x, b.z - tg.z);
    const des = Math.atan2(tg.z - b.z, tg.x - b.x);
    const v = Math.min(vel, dd * 1.4);
    if (dd > 1.2) {
      b.ang = turnToward(b.ang, d.forma === 'cangrejo' || d.forma === 'pulpo' ? haciaP : des, dt * 2.6);
      const nx = b.x + Math.cos(des) * v * dt, nz = b.z + Math.sin(des) * v * dt;
      if (H(nx, nz) < -1.2 && distCosta(nx, nz) > minDist(b) * 0.9) { b.x = nx; b.z = nz; }
      b.vel = v;
    } else { b.vel = 0; b.ang = turnToward(b.ang, haciaP, dt * 2.2); }
    b.cd -= dt;
    if (b.cd <= 0 && dd < 10 + d.radio) comenzarAtaque(b);
  }
}
function comenzarAtaque(b) {
  const lista = ATAQUES_JEFE[b.def.id].filter((a) => a.f <= b.fase);
  const a = wpick(lista, (x) => x.w);
  b.atk = { id: a.id, t: 0, fase: 0 };
  ATAQUES[a.id].ini(b, b.atk);
}

// ---------------------------------------------------------------------------
// Peligros (zonas rojas que se llenan antes del golpe)
// ---------------------------------------------------------------------------
function matTelegrafo(color) {
  const u = { uK: { value: 0 }, uCol: { value: new THREE.Color(color) }, uT: { value: 0 }, uLin: { value: 0 } };
  return new THREE.ShaderMaterial({
    uniforms: u, transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: false,
    vertexShader: 'attribute vec2 aP; varying vec2 vP; void main(){ vP = aP; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `uniform float uK; uniform vec3 uCol; uniform float uT; uniform float uLin; varying vec2 vP;
      void main(){
        float a; float borde;
        if (uLin < 0.5) {
          float r = length(vP); if (r > 1.0) discard;
          float fill = step(r, uK);
          float dash = step(0.5, fract(atan(vP.y, vP.x) * 3.0 + uT * 0.8));
          borde = smoothstep(0.9, 0.96, r) * (0.55 + 0.45 * dash);
          a = 0.16 + 0.1 * sin(uT * 16.0) * 0.5 + fill * 0.3 + borde * 0.7;
        } else {
          float along = vP.x + 0.5; float across = abs(vP.y) * 2.0;
          float fill = step(along, uK) * step(across, 1.0);
          float dash = step(0.5, fract(along * 14.0 - uT * 1.5));
          borde = smoothstep(0.88, 0.97, across) * (0.55 + 0.45 * dash);
          a = 0.14 + 0.1 * sin(uT * 16.0) * 0.5 + fill * 0.3 + borde * 0.7;
        }
        gl_FragColor = vec4(uCol, clamp(a, 0.0, 0.95));
      }`,
  });
}
// La zona roja copia el relieve: se arma con una malla que sigue el suelo (o el agua) punto por punto
const yTele = (x, z) => Math.max(H(x, z), alturaOla(x, z, J.t) + 0.12) + 0.14;
function geoTeleCirculo(x, z, r) {
  const RN = 7, AN = 30, pos = [x, yTele(x, z), z], aP = [0, 0], idx = [];
  for (let i = 1; i <= RN; i++) for (let j = 0; j < AN; j++) {
    const an = (j / AN) * TAU, rr = i / RN, px = x + Math.cos(an) * r * rr, pz = z + Math.sin(an) * r * rr;
    pos.push(px, yTele(px, pz), pz); aP.push(Math.cos(an) * rr, Math.sin(an) * rr);
  }
  for (let j = 0; j < AN; j++) idx.push(0, 1 + j, 1 + ((j + 1) % AN));
  for (let i = 1; i < RN; i++) for (let j = 0; j < AN; j++) {
    const a0 = 1 + (i - 1) * AN + j, a1 = 1 + (i - 1) * AN + ((j + 1) % AN), b0 = 1 + i * AN + j, b1 = 1 + i * AN + ((j + 1) % AN);
    idx.push(a0, b0, a1, a1, b0, b1);
  }
  return armarGeoTele(pos, aP, idx);
}
function geoTeleLinea(x1, z1, x2, z2, w) {
  const len = Math.hypot(x2 - x1, z2 - z1) || 1, n = Math.max(2, Math.ceil(len / 2)), nx = -(z2 - z1) / len, nz = (x2 - x1) / len;
  const pos = [], aP = [], idx = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, cx = lerp(x1, x2, u), cz = lerp(z1, z2, u);
    for (const sd of [1, -1]) { const px = cx + nx * (w / 2) * sd, pz = cz + nz * (w / 2) * sd; pos.push(px, yTele(px, pz), pz); aP.push(u - 0.5, 0.5 * sd); }
    if (i > 0) { const a = (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  return armarGeoTele(pos, aP, idx);
}
function armarGeoTele(pos, aP, idx) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('aP', new THREE.Float32BufferAttribute(aP, 2));
  g.setIndex(idx);
  g.computeBoundingSphere();
  return g;
}
function alturaSobre(x, z, r) {
  let m = Math.max(H(x, z), 0), n = 0;
  for (const [dx, dz] of [[r * 0.7, 0], [-r * 0.7, 0], [0, r * 0.7], [0, -r * 0.7]]) { m = Math.max(m, H(x + dx, z + dz)); n++; }
  void n;
  return m;
}
function peligroCirculo(x, z, r, delay, dmg, o = {}) {
  const col = o.efecto === 'lento' ? '#8a52e0' : o.efecto === 'veneno' ? '#58d94a' : o.efecto === 'fuego' ? '#ff8a1e' : o.rayo ? '#4fb8ff' : '#ff3c32';
  const mat = matTelegrafo(col);
  const mesh = new THREE.Mesh(geoTeleCirculo(x, z, r), mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = 3;
  ESC.escena.add(mesh);
  const p = Object.assign({ tipo: 'circ', x, z, r, t: 0, delay, dmg, res: false, tr: 0, persist: 0, mesh, mat }, o);
  PELIGROS.push(p);
  registrarZonaRed(p);
  sfx('telegrafo');
  return p;
}
function peligroLinea(x1, z1, x2, z2, w, delay, dmg, o = {}) {
  const col = o.rayo ? '#4fb8ff' : '#ff3c32';
  const mat = matTelegrafo(col);
  mat.uniforms.uLin.value = 1;
  const mesh = new THREE.Mesh(geoTeleLinea(x1, z1, x2, z2, w), mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = 3;
  ESC.escena.add(mesh);
  const p = Object.assign({ tipo: 'linea', x: x1, z: z1, x2, z2, w, t: 0, delay, dmg, res: false, tr: 0, persist: 0, mesh, mat }, o);
  PELIGROS.push(p);
  registrarZonaRed(p);
  sfx('telegrafo');
  return p;
}
function quitarPeligro(i) {
  const p = PELIGROS[i];
  ESC.escena.remove(p.mesh);
  p.mesh.geometry.dispose();
  p.mat.dispose();
  PELIGROS.splice(i, 1);
}
function limpiarPeligros() { for (let i = PELIGROS.length - 1; i >= 0; i--) quitarPeligro(i); }
function actualizarPeligros(dt) {
  for (let i = PELIGROS.length - 1; i >= 0; i--) {
    const p = PELIGROS[i];
    p.t += dt;
    p.mat.uniforms.uT.value = J.t;
    if (!p.res) {
      p.mat.uniforms.uK.value = Math.min(1, p.t / p.delay);
      if (p.t >= p.delay) resolverPeligro(p);
    } else {
      p.tr += dt;
      if (p.persist > 0) {
        p.persist -= dt;
        p.mat.uniforms.uK.value = 1;
        p.mesh.material.opacity = Math.min(1, p.persist);
        if (p.efecto === 'lento' && Math.hypot(P.pos.x - p.x, P.pos.z - p.z) < p.r) P.lento = 0.25;
        else if ((p.efecto === 'veneno' || p.efecto === 'fuego') && Math.hypot(P.pos.x - p.x, P.pos.z - p.z) < p.r) {
          p.tick = (p.tick || 0) - dt;
          if (p.tick <= 0) { p.tick = 0.7; if (p.dmg > 0) herirJugador(p.dmg, 'zona'); if (p.efecto === 'veneno') P.lento = 0.3; }
        }
        if (p.efecto === 'fuego' && Math.random() < dt * 10) particula({ x: p.x + rand(-p.r, p.r) * 0.7, y: alturaSobre(p.x, p.z, p.r) + 0.2, z: p.z + rand(-p.r, p.r) * 0.7, vx: 0, vy: rand(1.2, 2.6), vz: 0, vida: 0.7, size: 0.35, col: pick(['#ff8a1e', '#ffc23a', '#ff5a1e']), alfa: 0.8, tipo: T_HUMO, crece: 0.6, g: 0 });
        if (p.persist <= 0) quitarPeligro(i);
      } else {
        p.mesh.visible = p.tr < 0.3 && Math.floor(p.tr * 30) % 2 === 0;
        if (p.tr > 0.3) quitarPeligro(i);
      }
    }
  }
}
function resolverPeligro(p) {
  p.res = true; p.tr = 0;
  p.mat.uniforms.uK.value = 1;
  if (p.efecto === 'lento' || p.efecto === 'veneno') { p.persist = p.dur || 6; p.tick = 0.5; return; }
  if (p.efecto === 'fuego') p.persist = p.dur || 3.5;
  let golpe;
  const dj = distSeg(P.pos.x, P.pos.z, p.x, p.z, p.tipo === 'circ' ? p.x : p.x2, p.tipo === 'circ' ? p.z : p.z2);
  if (p.tipo === 'circ') golpe = dj < p.r + 0.6; else golpe = dj < p.w / 2 + 0.6;
  if (golpe && p.dmg > 0 && P.pos.y - alturaPiso(P.pos.x, P.pos.z) < 3.5) herirJugador(p.dmg, 'jefe');
  if (p.efecto === 'fuego') p.dmg = Math.max(2, Math.round(p.dmg * 0.3));
  if (p.tent) tentaculoFx(p.tent.x, p.tent.z, p.x, p.z, 0.8, p.tent.ancho || 0.9, p.tent.col);
  if (p.tipo === 'circ') {
    if (H(p.x, p.z) < 0) chapoteo(p.x, p.z, 12, p.r / 4); else for (let k = 0; k < 10; k++) polvo(p.x + rand(-p.r, p.r) * 0.6, Math.max(0, H(p.x, p.z)), p.z + rand(-p.r, p.r) * 0.6);
    if (p.rayo) { rayoFx(p.x, p.z); chispas(p.x, 1, p.z, '#bff4ff', 16, 6); }
  } else if (p.rayo) { rayoFx(p.x, p.z); rayoFx((p.x + p.x2) / 2, (p.z + p.z2) / 2); rayoFx(p.x2, p.z2); }
  if (p.impacto) { const yy = alturaSobre(p.x, p.z, p.r); chispas(p.x, yy + 0.4, p.z, '#ff9a3c', 14, 7); for (let k = 0; k < 5; k++) polvo(p.x + rand(-p.r, p.r) * 0.6, yy, p.z + rand(-p.r, p.r) * 0.6); }
  sacudir(p.tipo === 'circ' ? 10 : 8);
  sfx(p.rayo ? 'explosion' : 'impacto');
}

// Tentáculo que emerge para golpear un punto
const TENT = [];
function tentaculoFx(x0, z0, x1, z1, dur = 0.8, ancho = 0.9, col = '#a05fb8') {
  const tubo = crearTubo(ESC.escena, col, 22, 7);
  const punta = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), new THREE.MeshStandardMaterial({ color: col, roughness: 0.5 }));
  ESC.escena.add(punta);
  TENT.push({ x0, z0, x1, z1, t: 0, dur, ancho, tubo, punta });
}
function actualizarTentaculos(dt) {
  for (let i = TENT.length - 1; i >= 0; i--) {
    const o = TENT[i];
    o.t += dt;
    const k = o.t / o.dur;
    if (k >= 1) { o.tubo.quitar(); ESC.escena.remove(o.punta); o.punta.geometry.dispose(); o.punta.material.dispose(); TENT.splice(i, 1); continue; }
    const sube = k < 0.35 ? k / 0.35 : 1 - (k - 0.35) / 0.65;
    const alt = Math.sin(clamp(k * 1.7, 0, 1) * Math.PI);
    const yTop = 1.2 + 6 * alt * (k < 0.35 ? 1 : 0.4);
    const fin = { x: o.x1, y: Math.max(H(o.x1, o.z1), 0) + 0.3 * (1 - sube), z: o.z1 };
    const ini = { x: o.x0, y: -0.2, z: o.z0 };
    o.tubo.poner(ini, { x: fin.x, y: fin.y + yTop * 0.25, z: fin.z }, -yTop * 0.9, o.ancho * (0.4 + 0.6 * sube), null, false);
    o.punta.position.set(fin.x, fin.y + yTop * 0.25, fin.z);
    o.punta.scale.setScalar(o.ancho * 1.2 * (0.5 + 0.5 * sube));
    o.punta.visible = sube > 0.05;
  }
}
// Rayos
const RAYOS = [];
function rayoFx(x, z) {
  const N = 9, pos = new Float32Array(N * 3 * 2);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: '#d8f6ff', fog: false, transparent: true }));
  m.frustumCulled = false;
  let px = x + rand(-1, 1), pz = z + rand(-1, 1), py = 26;
  for (let i = 0; i < N; i++) {
    const nx = x + rand(-1.2, 1.2) * (1 - i / N) * 2, nz = z + rand(-1.2, 1.2) * (1 - i / N) * 2, ny = py - 26 / N;
    pos.set([px, py, pz, nx, ny, nz], i * 6);
    px = nx; pz = nz; py = ny;
  }
  ESC.escena.add(m);
  RAYOS.push({ m, t: 0 });
  const d = FX.destello; d.t = 0.2; d.x = x; d.y = 4; d.z = z; d.r = 5; d.m.visible = true;
}
function actualizarRayos(dt) {
  for (let i = RAYOS.length - 1; i >= 0; i--) {
    const r = RAYOS[i];
    r.t += dt;
    r.m.material.opacity = Math.max(0, 1 - r.t / 0.3);
    if (r.t > 0.3) { ESC.escena.remove(r.m); r.m.geometry.dispose(); r.m.material.dispose(); RAYOS.splice(i, 1); }
  }
}

// ---------------------------------------------------------------------------
// Ataques. ini() arma los avisos; act() devuelve true cuando termina.
// ---------------------------------------------------------------------------
const ATAQUES_JEFE = {
  pinza: [{ id: 'pinzazo', w: 4, f: 0 }, { id: 'doblePinza', w: 3, f: 0 }, { id: 'barrida', w: 3, f: 0 }, { id: 'furiaPinza', w: 3, f: 1 }],
  matungo: [{ id: 'embestida', w: 4, f: 0 }, { id: 'coletazo', w: 2, f: 0 }, { id: 'dobleEmbestida', w: 3, f: 1 }],
  relampago: [{ id: 'rayos', w: 4, f: 0 }, { id: 'latigazo', w: 3, f: 0 }, { id: 'campo', w: 2, f: 0 }, { id: 'tormenta', w: 3, f: 1 }],
  tentacula: [{ id: 'tentaculos', w: 4, f: 0 }, { id: 'tinta', w: 2, f: 0 }, { id: 'abrazo', w: 3, f: 0 }, { id: 'tentaculosMax', w: 3, f: 1 }],
  leviatan: [{ id: 'chorro', w: 3, f: 0 }, { id: 'torbellino', w: 2, f: 0 }, { id: 'tentaculosLev', w: 3, f: 0 }, { id: 'rugido', w: 2, f: 1 }, { id: 'chorroDoble', w: 3, f: 1 }, { id: 'diluvio', w: 3, f: 2 }],
};
const mirar = (b, dt, v = 4) => { b.ang = turnToward(b.ang, Math.atan2(blanco(b).z - b.z, blanco(b).x - b.x), dt * v); };
const avanzarJefe = (b, ang, v, dt) => {
  const nx = b.x + Math.cos(ang) * v * dt, nz = b.z + Math.sin(ang) * v * dt;
  if (H(nx, nz) < -1.1 && distCosta(nx, nz) > minDist(b) * 0.6) { b.x = nx; b.z = nz; return true; }
  return false;
};
const dmgJ = (b, m = 1) => Math.round(b.def.dmg * m * (1 + 0.1 * b.fase));
const alrededor = (x, z, r) => { const a = rand(TAU), d = rand(r * 0.3, r); return { x: x + Math.cos(a) * d, z: z + Math.sin(a) * d }; };
const haciaJ = (b) => Math.atan2(blanco(b).z - b.z, blanco(b).x - b.x);
const lineaDesde = (b, ang, len, w, delay, dmg, o = {}) => peligroLinea(b.x, b.z, b.x + Math.cos(ang) * len, b.z + Math.sin(ang) * len, w, delay, dmg, o);

const ATAQUES = {
  // ---- Don Pinza
  pinzazo: { ini(b) { peligroCirculo(blanco(b).x, blanco(b).z, 4.2, 0.95, dmgJ(b)); b.alza = 1; }, act(b, a, dt) { mirar(b, dt); b.alza = a.t < 0.95 ? 1 : Math.max(0, 1 - (a.t - 0.95) * 6); if (a.t >= 0.95 && !a.golpe) { a.golpe = true; sacudir(14); sfx('impacto'); } return a.t >= 1.2; } },
  doblePinza: { ini(b) { peligroCirculo(blanco(b).x, blanco(b).z, 3.8, 0.8, dmgJ(b, 0.85)); b.alza = 1; }, act(b, a, dt) { mirar(b, dt); if (a.t > 0.45 && !a.seg) { a.seg = true; peligroCirculo(blanco(b).x, blanco(b).z, 3.8, 0.85, dmgJ(b, 0.85)); } b.alza = a.t < 1.3 ? 1 : 0; return a.t >= 1.45; } },
  barrida: { ini(b, a) { a.ang = haciaJ(b); lineaDesde(b, a.ang, 18, 5.4, 1.0, dmgJ(b, 1.15)); b.alza = 1; }, act(b, a, dt) { b.ang = turnToward(b.ang, a.ang, dt * 6); b.alza = a.t < 1.0 ? 1 : 0; return a.t >= 1.25; } },
  furiaPinza: {
    ini(b) { const ang = haciaJ(b); for (let i = 0; i < 4; i++) peligroCirculo(b.x + Math.cos(ang) * (6 + i * 4.2), b.z + Math.sin(ang) * (6 + i * 4.2), 3.5, 0.7 + i * 0.28, dmgJ(b, 0.9)); b.alza = 1; },
    act(b, a, dt) { mirar(b, dt, 5); b.alza = a.t < 1.6 ? 1 : 0; return a.t >= 1.95; },
  },
  // ---- El Matungo
  embestida: { ini(b, a) { prepararEmbestida(b, a, 0.9); }, act(b, a, dt) { return actuarEmbestida(b, a, dt); } },
  dobleEmbestida: {
    ini(b, a) { prepararEmbestida(b, a, 0.8); a.veces = 2; },
    act(b, a, dt) { const fin = actuarEmbestida(b, a, dt); if (fin && a.veces > 1) { a.veces--; a.t = 0; a.dash = false; prepararEmbestida(b, a, 0.7); return false; } return fin; },
  },
  coletazo: { ini(b) { peligroCirculo(b.x, b.z, 9.5, 0.85, dmgJ(b, 0.75)); }, act(b, a, dt) { b.ang += dt * (a.t < 0.85 ? 3 : 0); b.abierto = 0.4; return a.t >= 1.05; } },
  // ---- La Relámpago
  rayos: {
    ini(b, a) { a.n = b.fase ? 5 : 3; a.i = 0; },
    act(b, a, dt) { mirar(b, dt); if (a.i < a.n && a.t >= a.i * 0.5) { peligroCirculo(blanco(b).x + rand(-1.5, 1.5), blanco(b).z + rand(-1.5, 1.5), 3.6, 0.9, dmgJ(b, 0.8), { rayo: true }); a.i++; } return a.t >= a.n * 0.5 + 1.0; },
  },
  latigazo: {
    ini(b, a) { a.ang = haciaJ(b); lineaDesde(b, a.ang, 22, 4.4, 0.9, dmgJ(b, 1.1), { rayo: true }); },
    act(b, a, dt) { b.ang = turnToward(b.ang, a.ang, dt * 6); if (a.t > 0.9 && a.t < 1.1) avanzarJefe(b, a.ang, 20, dt); return a.t >= 1.25; },
  },
  campo: { ini(b) { peligroCirculo(b.x, b.z, 13.5, 1.35, dmgJ(b, 1.1), { rayo: true, campo: true }); }, act(b, a) { return a.t >= 1.55; } },
  tormenta: {
    ini(b, a) { peligroCirculo(b.x, b.z, 13.5, 1.2, dmgJ(b, 1.1), { rayo: true, campo: true }); a.fase2 = false; },
    act(b, a, dt) { mirar(b, dt); if (a.t > 0.6 && !a.fase2) { a.fase2 = true; for (let i = 0; i < 4; i++) { const q = alrededor(blanco(b).x, blanco(b).z, 9); peligroCirculo(q.x, q.z, 3.3, 0.9 + i * 0.2, dmgJ(b, 0.75), { rayo: true }); } } return a.t >= 2.0; },
  },
  // ---- Doña Tentácula
  tentaculos: {
    ini(b, a) { a.n = 4; a.i = 0; },
    act(b, a, dt) { mirar(b, dt, 2); if (a.i < a.n && a.t >= a.i * 0.22) { const q = a.i === 0 ? { x: blanco(b).x, z: blanco(b).z } : alrededor(blanco(b).x, blanco(b).z, 10); peligroCirculo(q.x, q.z, 3.4, 0.95, dmgJ(b, 0.75), { tent: { x: b.x, z: b.z, ancho: 1.3, col: '#a05fb8' } }); a.i++; } return a.t >= a.n * 0.22 + 1.05; },
  },
  tentaculosMax: {
    ini(b, a) { a.n = 7; a.i = 0; },
    act(b, a, dt) { mirar(b, dt, 2); if (a.i < a.n && a.t >= a.i * 0.2) { const q = a.i % 3 === 0 ? { x: blanco(b).x, z: blanco(b).z } : alrededor(blanco(b).x, blanco(b).z, 12); peligroCirculo(q.x, q.z, 3.4, 0.9, dmgJ(b, 0.75), { tent: { x: b.x, z: b.z, ancho: 1.3, col: '#a05fb8' } }); a.i++; } return a.t >= a.n * 0.2 + 1.0; },
  },
  tinta: {
    ini(b, a) { peligroCirculo(blanco(b).x, blanco(b).z, 11, 0.7, 0, { efecto: 'lento', dur: 7 }); a.t2 = false; },
    act(b, a, dt) { mirar(b, dt, 2); if (a.t > 0.8 && !a.t2) { a.t2 = true; for (let i = 0; i < 3; i++) { const q = alrededor(blanco(b).x, blanco(b).z, 8); peligroCirculo(q.x, q.z, 3.3, 0.9 + i * 0.25, dmgJ(b, 0.7), { tent: { x: b.x, z: b.z, ancho: 1.2, col: '#8a4aa0' } }); } } return a.t >= 2.3; },
  },
  abrazo: {
    ini(b, a) { a.ang = haciaJ(b); lineaDesde(b, a.ang, 32, 8, 1.2, dmgJ(b, 1.0), { tent: { x: b.x, z: b.z, ancho: 2.0, col: '#a05fb8' } }); },
    act(b, a, dt) { b.ang = turnToward(b.ang, a.ang, dt * 3); return a.t >= 1.45; },
  },
  // ---- El Leviatán
  chorro: { ini(b, a) { a.ang = haciaJ(b); lineaDesde(b, a.ang, 60, 7, 1.0, dmgJ(b, 0.85)); }, act(b, a, dt) { b.ang = turnToward(b.ang, a.ang, dt * 3); return a.t >= 1.25; } },
  chorroDoble: {
    ini(b, a) { a.ang = haciaJ(b); lineaDesde(b, a.ang, 60, 7, 1.0, dmgJ(b, 0.8)); a.s = false; },
    act(b, a, dt) { if (a.t > 0.5 && !a.s) { a.s = true; lineaDesde(b, haciaJ(b), 60, 7, 0.95, dmgJ(b, 0.8)); } mirar(b, dt, 1.5); return a.t >= 1.8; },
  },
  torbellino: { ini(b) { peligroCirculo(blanco(b).x, blanco(b).z, 15, 1.5, dmgJ(b, 1.0)); }, act(b, a, dt) { mirar(b, dt, 1); return a.t >= 1.7; } },
  tentaculosLev: {
    ini(b, a) { a.n = 6; a.i = 0; },
    act(b, a, dt) { mirar(b, dt, 1.5); if (a.i < a.n && a.t >= a.i * 0.2) { const q = a.i === 0 ? { x: blanco(b).x, z: blanco(b).z } : alrededor(blanco(b).x, blanco(b).z, 13); peligroCirculo(q.x, q.z, 3.8, 0.95, dmgJ(b, 0.65), { tent: { x: b.x, z: b.z, ancho: 2.0, col: '#2a5acc' } }); a.i++; } return a.t >= a.n * 0.2 + 1.05; },
  },
  rugido: { ini(b) { peligroCirculo(b.x, b.z, 26, 1.7, dmgJ(b, 0.9), { campo: true, rayo: true }); sfx('rugido'); }, act(b, a, dt) { mirar(b, dt, 1); return a.t >= 1.9; } },
  diluvio: {
    ini(b, a) { a.n = 9; a.i = 0; },
    act(b, a, dt) {
      mirar(b, dt, 1.5);
      if (a.i < a.n && a.t >= a.i * 0.17) { const q = a.i % 3 === 0 ? { x: blanco(b).x, z: blanco(b).z } : alrededor(blanco(b).x, blanco(b).z, 14); peligroCirculo(q.x, q.z, 3.7, 0.9, dmgJ(b, 0.6), { tent: { x: b.x, z: b.z, ancho: 2.0, col: '#2a5acc' } }); a.i++; }
      if (a.t > 0.9 && !a.l) { a.l = true; lineaDesde(b, haciaJ(b), 60, 6.5, 0.9, dmgJ(b, 0.8)); }
      return a.t >= a.n * 0.17 + 1.1;
    },
  },
};
function prepararEmbestida(b, a, delay) {
  const dx = blanco(b).x - b.x, dz = blanco(b).z - b.z, d = Math.hypot(dx, dz) || 1;
  a.dir = Math.atan2(dz, dx);
  a.len = d + 10;
  a.delay = delay; a.dash = false; a.rec = 0;
  lineaDesde(b, a.dir, a.len, 5.6, delay, dmgJ(b));
  b.abierto = 0;
}
function actuarEmbestida(b, a, dt) {
  if (a.t < a.delay) {
    b.ang = turnToward(b.ang, a.dir, dt * 8);
    b.abierto = Math.min(1, a.t / a.delay);
    avanzarJefe(b, a.dir + Math.PI, 3, dt);
    return false;
  }
  if (!a.dash) { a.dash = true; sfx('rugido'); sacudir(14); }
  const V = 56;
  if (a.rec < a.len) {
    const ok = avanzarJefe(b, a.dir, V, dt);
    a.rec += V * dt;
    if (!ok) a.rec = a.len;
    ondaAgua(b.x, b.z, 4, 0.9, 0.5, 1);
    if (Math.random() < 0.5) chapoteo(b.x, b.z, 3, 0.8);
    b.vel = V;
    return false;
  }
  b.vel = 0;
  return a.t >= a.delay + a.len / V + 0.25;
}

// ---------------------------------------------------------------------------
// Daño al jefe
// ---------------------------------------------------------------------------
// Cuánto daño hace de verdad un golpe (aturdido: x2; Don Pinza con el caparazón cerrado casi no lo siente)
function danoReal(b, dmg, fuente) {
  const stun = b.aturdido > 0;
  let mult = 1;
  if (stun) mult = 2; else if (b.def.id === 'pinza') mult = fuente === 'dina' ? 1 : fuente === 'linea' ? 0.6 : 0.5;
  return { real: Math.max(1, Math.round(dmg * mult)), stun, mult };
}
// Aplica el daño: el anfitrión (o quien juega solo) le resta vida; otro jugador se lo informa al anfitrión.
function aplicarDanoJefe(b, real, quien) {
  if (esProxy()) { acumularDanoRed(b, real); return; }
  b.hp -= real;
  b.contrib = b.contrib || {};
  b.contrib[quien] = (b.contrib[quien] || 0) + real;
  if (b.hp <= 0) matarJefe(b);
}
function golpearJefe(b, dmg, fuente, x, z) {
  if (b.estado !== 'pelea' || b.oculto) return;
  const { real, stun, mult } = danoReal(b, dmg, fuente);
  b.flash = 1;
  const px = x === undefined ? b.x : x, pz = z === undefined ? b.z : z;
  textoFlotante(px, 3 + b.def.radio * 0.4, pz, (stun ? '¡' : '') + real + (stun ? '!' : ''), stun ? '#ffe36b' : mult < 1 ? '#c8d3dc' : '#ffffff', stun ? 34 : 24, 1.0);
  chispas(px, 1.2, pz, stun ? '#ffe36b' : '#ffffff', stun ? 12 : 6, 5);
  sfx(stun ? 'impacto' : 'tirar');
  sacudir(stun ? 12 : 6);
  aplicarDanoJefe(b, real, 'yo');
}
function jefesExplosion(x, z, R, dano) {
  for (const b of BOSSES) {
    if (b.estado !== 'pelea') continue;
    const d = Math.hypot(b.x - x, b.z - z) - b.def.radio * 0.6;
    if (d < R) golpearJefe(b, dano * (1 - clamp(d, 0, R) / (R * 1.4)), 'dina', b.x, b.z);
  }
}
function golpearJefeLinea(b, dmg) {
  if (b.estado !== 'pelea') return;
  const { real, mult } = danoReal(b, dmg, 'linea');
  b.flash = Math.max(b.flash, 0.35);
  if (Math.random() < 0.25) textoFlotante(b.x + rand(-2, 2), 2.5 + b.def.radio * 0.3, b.z + rand(-2, 2), Math.round(dmg * mult), '#bfe9ff', 20, 0.8);
  aplicarDanoJefe(b, real, 'yo');
}

// Pelea con la caña: mantener la tensión en verde le saca vida
function actualizarPeleaJefe(dt) {
  const L = LINEA, s = L.pelea, b = L.jefe;
  // con otro jugador de anfitrión el jefe tarda unos instantes en pasar a "pelea": se espera su aviso
  const esperaAnfitrion = esProxy() && b && b.estado === 'mordiendo' && J.t - (L.tEnganche || -9) < 2.5;
  if (!b || (b.estado !== 'pelea' && !esperaAnfitrion)) { soltarTodo(); return; }
  const tip = puntaCana();
  let pull = 0.4, modo = 'tiron';
  if (b.atk) { if (b.atk.t < 0.6) { pull = 0.55; modo = 'aviso'; } else { pull = 1.15; modo = 'corrida'; } } else if (b.aturdido > 0) { pull = 0.12; modo = 'descanso'; } else if (b.vel > 3) { pull = 0.55; modo = 'tiron'; }
  s.pullFijo = pull; s.modo = modo;
  const reel = leerReel() && P.stun <= 0;
  const ev = pasoPelea(s, dt, reel);
  s.modo = modo;
  L.x = b.x; L.z = b.z; L.y = 0.5;
  if (reel && s.T >= PELEA.verdeMin && s.T <= PELEA.verdeMax) {
    L.dmgAcum = (L.dmgAcum || 0) + L.equipo.dps * dt;
    if (L.dmgAcum >= 8) { const d = Math.floor(L.dmgAcum); L.dmgAcum -= d; golpearJefeLinea(b, d); }
  }
  if (reel && Math.random() < dt * 14) sfx('carretel', s.T);
  if (modo === 'aviso') { if (!L.avisoSonado) { sfx('aviso'); L.avisoSonado = true; } } else L.avisoSonado = false;
  CAM.shake = Math.max(CAM.shake, pull * 4);
  if (Math.hypot(tip.x - b.x, tip.z - b.z) > L.equipo.alcance * 1.8 + 30) { toast('El jefe se alejó y la línea se soltó.', '#ffe39a'); b.hooked = false; soltarTodo(); return; }
  if (ev === 'corte') {
    textoFlotante(P.pos.x, P.pos.y + 2.4, P.pos.z, '¡Se cortó la línea!', '#ff8a7a', 26, 1.6);
    toast('Se cortó la línea. Seguí con arpón y dinamita, o volvé a lanzar sobre el jefe.', '#ff9d8a');
    sfx('corte'); sacudir(14); b.hooked = false; G.stats.cortes++; soltarTodo();
  } else if (ev === 'suelta') {
    toast('El jefe se soltó del anzuelo. Lanzá de nuevo sobre él para volver a engancharlo.', '#ffe39a');
    sfx('error'); b.hooked = false; soltarTodo();
  }
}

// ---------------------------------------------------------------------------
// Muerte, cuerpo y botín
// ---------------------------------------------------------------------------
// Solo lo llama el anfitrión (o quien juega solo): decide quiénes se llevan el botín (los que pelearon de verdad)
function matarJefe(b) {
  if (b.estado !== 'pelea') return;
  b.estado = 'muriendo'; b.muerteT = 0; b.hp = 0; b.atk = null; b.vel = 0; b.aturdido = 0; b.hooked = false; b.alza = 0; b.abierto = 0;
  b.kid = (b.kid || 0) + 1;
  const umbral = Math.max(1, b.hpMax * 0.03);
  b.dignos = RED.activa ? Object.entries(b.contrib || {}).filter(([, v]) => v >= umbral).map(([k]) => (k === 'yo' ? miIdRed() : k)) : ['yo'];
  alMorirJefe(b);
}
// En cada juego cuando el jefe muere: aviso, sonido y (si peleaste) estadísticas y botín dentro de unos segundos
function alMorirJefe(b) {
  limpiarPeligros();
  if (LINEA.jefe === b) soltarTodo();
  sfx('jefeMuere');
  sacudir(34);
  const d = b.def;
  const digno = !RED.activa || (b.dignos || []).includes(miIdRed());
  b.botinPendiente = digno; b.botinEn = J.t + (d.tierra ? 3.0 : 2.6);
  if (digno) {
    const rec = (G.jefes[d.id] = G.jefes[d.id] || { kills: 0 });
    rec.kills++; rec.visto = true;
    G.stats.jefesMatados++;
  } else toast(`${d.nombre} cayó, pero no peleaste: sin botín esta vez.`, '#ffe39a');
  musica(enCombate() ? 'jefe' : 'isla');
  const v = h('div', 'banner-jefe vencido', `<b>¡VENCIDO!</b><span>${esc(d.nombre)}</span>`, $('#app'));
  setTimeout(() => v.classList.add('sale'), 2300);
  setTimeout(() => v.remove(), 2800);
}
// El botín propio: objetos, (en tierra) monedas y arma, y el cuerpo para vender
function recompensasJefe(b) {
  const d = b.def;
  b.botinPendiente = false;
  const partes = [];
  if (d.tierra) { G.plata += d.plata; partes.push(fmtMoney(d.plata)); }
  for (const [id, n] of d.botin) { darItem(id, n); partes.push(`${n} ${ITEMS[id].nombre}`); }
  toast(`Botín de ${d.nombre}: ${partes.join(', ')}`, '#ffe36b');
  if (d.tierra) {
    G.cuerpos.push({ id: d.id });
    toast(`Te llevás el cuerpo de ${d.nombre}: vendelo en la pescadería (${fmtMoney(d.precio)}).`, '#9be7ff');
    const c = pecho();
    lluviaMonedas(c.x, c.y, c.z, 24);
    if (d.arma && !G.armas[d.arma]) {
      G.armas[d.arma] = true; if (!G.armaSel) G.armaSel = d.arma;
      G.cargador[d.arma] = ARMA[d.arma].cargador;
      mostrarHallazgo({ titulo: `¡${ARMA[d.arma].nombre}!`, icono: 'cofre', texto: ARMA[d.arma].desc + ' Ya la tenés en la tecla 5.', plata: d.plata, oro: true });
      sfx('tesoro');
    } else sfx('mision');
  } else {
    b.cuerpoLocal = { t: 0 };
    toast('Acercate a la costa y mantené Espacio (o la caña) para remolcar el cuerpo.', '#9be7ff');
    sfx('mision');
  }
  revisarMisiones();
  guardar();
}
function muriendoJefe(b, dt) {
  b.muerteT += dt;
  if (Math.random() < dt * 14) { const r = b.def.radio; const x = b.x + rand(-r, r), z = b.z + rand(-r, r); ondaAgua(x, z, 5, 1, 0.7, 1); chapoteo(x, z, 8, 1.6); if (Math.random() < 0.3) sfx('impacto'); }
  b.ang += Math.sin(b.muerteT * 9) * dt * 2;
  if (b.muerteT >= 2.6) { b.estado = 'muerto'; b.respawn = REAPARECE_JEFE; }
}
// Cada jugador con botín remolca su propio cuerpo (es solo suyo): flota 150 s
function cuerpoJefe(b, dt) {
  const c = b.cuerpoLocal;
  c.t += dt;
  b.vel = 0;
  const reel = leerReel() && J.modo === 'jugando' && !J.panel;
  const dj = Math.hypot(P.pos.x - b.x, P.pos.z - b.z);
  b.haulando = false;
  if (reel && dj < 200) {
    if (dj < b.def.radio + 5) { recogerCuerpo(b); return; }
    const v = 9 + 4 * equipoCana().reel;
    const a = Math.atan2(P.pos.z - b.z, P.pos.x - b.x);
    const nx = b.x + Math.cos(a) * v * dt, nz = b.z + Math.sin(a) * v * dt;
    if (H(nx, nz) < -0.6) { b.x = nx; b.z = nz; } else if (H(b.x + Math.cos(a + 0.8) * v * dt, b.z + Math.sin(a + 0.8) * v * dt) < -0.6) { b.x += Math.cos(a + 0.8) * v * dt; b.z += Math.sin(a + 0.8) * v * dt; } else if (dj < b.def.radio + 14) { recogerCuerpo(b); return; }
    b.ang = turnToward(b.ang, a + Math.PI, dt * 2);
    b.haulando = true;
    if (Math.random() < dt * 10) sfx('carretel', 0.5);
  }
  if (c.t > 150) { toast(`El cuerpo de ${b.def.nombre} se hundió...`, '#ffb3a8'); b.cuerpoLocal = null; }
}
function recogerCuerpo(b) {
  G.cuerpos.push({ id: b.def.id });
  b.cuerpoLocal = null; b.haulando = false;
  toast(`¡Recogiste el cuerpo de ${b.def.nombre}! Llevalo a la pescadería (${fmtMoney(b.def.precio)}).`, '#ffe36b');
  sfx('captura', 4);
  const c = pecho();
  lluviaMonedas(c.x, c.y, c.z, 16);
  chapoteo(b.x, b.z, 22, 2.4);
  guardar();
}

// Cuerda del remolque
function actualizarCuerdaRemolque() {
  if (!BOSS3D.cuerda) BOSS3D.cuerda = crearTubo(ESC.escena);
  let ver = false;
  for (const b of BOSSES) if (b.cuerpoLocal && b.haulando) { BOSS3D.cuerda.poner(puntaCana(), { x: b.x, y: 0.6, z: b.z }, 1.2, 0.015, null); ver = true; }
  BOSS3D.cuerda.m.visible = ver;
}
const BOSS3D = { cuerda: null, avisoT: -99 };
