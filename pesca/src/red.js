'use strict';
// Multijugador cooperativo: capa de red. Una "sala" comparte la PRESENCIA de cada jugador (dónde está, qué lleva, qué dice)
// y unos pocos eventos sueltos. No hay servidor que decida: el jugador de id más bajo es el ANFITRIÓN y simula a los jefes;
// los demás aplican lo que él publica. Jugando solo, uno es su propio anfitrión y todo funciona como siempre.
//
// Tres transportes con la misma interfaz (Sala):
//   room → el canal en tiempo real del Artifact (claude.use('room')): cualquiera que tenga la página abierta
//   ws   → servidor propio (pesca/servidor.mjs): amigos que entran por una dirección web
//   bc   → BroadcastChannel: pestañas del mismo navegador (pruebas y partidas locales)
//
// Interfaz Sala: { tipo, id(), pares(), presencia(patch), emitir(tema, datos), escuchar(tema, fn), conectada(), cerrar() }
// pares() devuelve [{ id, esYo, p (presencia), t (ms de la última novedad) }] incluyéndome; la presencia sin cambios conserva su identidad.

const RED = {
  version: 1,
  tipo: null, sala: null, activa: false, // activa: hay una sala conectada
  yo: null, hostId: null, anfitrion: true,
  pares: [], remotos: new Map(), // id -> { id, p, t, nombre, color, muestras: [], ... } (solo jugadores en partida)
  cfg: { nombre: '', online: false, sala: '', color: 0 },
  transportes: { room: null, ws: false, bc: typeof BroadcastChannel === 'function' },
  estado: 'apagada', // apagada | conectando | conectada | error
  tPub: 0, tHost: 0, ultPose: '', seq: { chat: 0, emo: 0 }, avisos: [], cola: [],
  chat: [], // { id, nombre, texto, t }
  mia: {}, // copia de mi presencia (el canal admite 4 KiB como mucho)
};
const COLORES_CAMISA = ['#ff8a65', '#4fc3f7', '#aed581', '#ffd54f', '#ba68c8', '#f06292', '#4db6ac', '#e8e8e8'];
const SOMBREROS_MP = ['paja', 'gorra', 'panuelo', 'capitan'];
const TEMAS_RED = ['chat', 'emo']; // los que hay que declarar al publicar el Artifact (room: { topics: { chat: 'interact', emo: 'interact' } })
const CLAVE_RED = 'isla-anzuelo-red';
const r1 = (v) => Math.round(v * 10) / 10;
const r2 = (v) => Math.round(v * 100) / 100;

function nombreSeguro(s) { return String(s || '').replace(/[^\p{L}\p{N} _.\-]/gu, '').trim().slice(0, 16); }
function cargarCfgRed() {
  try {
    const crudo = localStorage.getItem(CLAVE_RED);
    RED.cfg.nuevo = !crudo; // primera vez que se abre el juego en este navegador
    const o = JSON.parse(crudo || '{}');
    if (o.nombre) RED.cfg.nombre = nombreSeguro(o.nombre);
    RED.cfg.online = !!o.online; RED.cfg.sala = nombreSeguro(o.sala).toLowerCase().replace(/\s+/g, '-');
    if (Number.isFinite(o.color)) RED.cfg.color = clamp(Math.floor(o.color), 0, COLORES_CAMISA.length - 1);
  } catch (e) { /* sin almacenamiento */ }
  if (!RED.cfg.nombre) RED.cfg.nombre = 'Pescador' + randi(100, 999);
  if (!Number.isFinite(RED.cfg.color)) RED.cfg.color = randi(0, COLORES_CAMISA.length - 1);
}
function guardarCfgRed() { try { localStorage.setItem(CLAVE_RED, JSON.stringify(RED.cfg)); } catch (e) { /* nada */ } }

// ---------------------------------------------------------------------------
// Transporte 1: room del Artifact (o una sala con nombre dentro de él)
// ---------------------------------------------------------------------------
function salaRoom(room) {
  const S = { tipo: 'room', room, cache: null, cacheIn: null };
  const conv = (p) => ({ id: p.peer, esYo: !!(p.isMe && p.sameTab), p: p.presence || {}, t: p.updatedAt || Date.now() });
  S.id = () => { const m = room.peers().find((p) => p.isMe && p.sameTab); return m ? m.peer : null; };
  S.pares = () => {
    const ps = room.peers();
    if (S.cacheIn === ps) return S.cache;
    S.cacheIn = ps; S.cache = ps.map(conv);
    return S.cache;
  };
  S.presencia = (patch) => { try { const r = room.presence(patch); if (r && r.catch) r.catch(() => {}); } catch (e) { /* sin sala */ } };
  S.emitir = (tema, datos) => { try { const r = room.emit(tema, datos); if (r && r.catch) r.catch(() => {}); } catch (e) { /* sin permiso */ } };
  S.escuchar = (tema, fn) => room.on(tema, (m) => fn({ tema, datos: m.data, id: m.peer, esYo: !!(m.isMe && m.sameTab) }), () => {});
  S.conectada = () => !!room.connected();
  S.cerrar = () => { try { if (room.leave) room.leave(); } catch (e) { /* nada */ } };
  return S;
}

// ---------------------------------------------------------------------------
// Transportes 2 y 3: un motor común sobre un "cable" (WebSocket o BroadcastChannel)
// ---------------------------------------------------------------------------
function salaCable(cable) {
  const S = { tipo: cable.tipo, _id: cable.id || null, mia: {}, peers: new Map(), oyentes: {}, snap: [], sucio: true, enviarT: 0, pendiente: false, vivo: true };
  const yo = { id: null, esYo: true, p: S.mia, t: Date.now() };
  S.id = () => S._id;
  S.pares = () => {
    if (S.sucio) { yo.id = S._id; yo.p = S.mia; S.snap = S._id ? [yo, ...S.peers.values()] : []; S.sucio = false; }
    return S.snap;
  };
  const volcar = () => {
    S.pendiente = false;
    if (!S.vivo || !S._id || !cable.listo()) return;
    S.enviarT = performance.now();
    cable.enviar({ t: 'p', id: S._id, p: S.mia });
  };
  S.presencia = (patch) => {
    for (const k in patch) { if (patch[k] === null) delete S.mia[k]; else S.mia[k] = patch[k]; }
    S.mia = Object.assign({}, S.mia); // identidad nueva: así los demás notan el cambio
    S.sucio = true;
    if (!S.pendiente) { S.pendiente = true; setTimeout(volcar, Math.max(0, 50 - (performance.now() - S.enviarT))); }
  };
  S.emitir = (tema, datos) => { if (S._id && cable.listo()) cable.enviar({ t: 'e', id: S._id, k: tema, d: datos }); };
  S.escuchar = (tema, fn) => { (S.oyentes[tema] = S.oyentes[tema] || []).push(fn); return () => { S.oyentes[tema] = S.oyentes[tema].filter((f) => f !== fn); }; };
  S.conectada = () => !!(S._id && cable.listo());
  S.cerrar = () => { S.vivo = false; try { cable.enviar({ t: 'sale', id: S._id }); } catch (e) { /* nada */ } cable.cerrar(); };
  // mensajes entrantes
  const poner = (id, p) => {
    if (!id || id === S._id) return;
    const viejo = S.peers.get(id);
    S.peers.set(id, { id, esYo: false, p: p && typeof p === 'object' ? p : {}, t: Date.now(), visto: performance.now() });
    if (!viejo) cable.avisoEntra && cable.avisoEntra(id);
    S.sucio = true;
  };
  cable.alMsg = (m) => {
    if (!m || typeof m !== 'object') return;
    if (m.t === 'yo') { S._id = String(m.id); S.sucio = true; S.pendiente = false; volcar(); }
    else if (m.t === 'estado') { for (const [id, p] of m.pares || []) poner(id, p); }
    else if (m.t === 'p') poner(m.id, m.p);
    else if (m.t === 'hola') { if (S._id && m.id !== S._id) { cable.enviar({ t: 'p', id: S._id, p: S.mia }); } }
    else if (m.t === 'sale') { if (S.peers.delete(m.id)) S.sucio = true; }
    else if (m.t === 'e') { for (const f of S.oyentes[m.k] || []) f({ tema: m.k, datos: m.d, id: m.id, esYo: false }); }
  };
  cable.alAbrir = () => { if (cable.tipo === 'bc') { S._id = cable.id; S.sucio = true; cable.enviar({ t: 'hola', id: S._id }); volcar(); } else { S.peers.clear(); S.sucio = true; cable.enviar({ t: 'hola', v: RED.version }); } };
  cable.alCerrar = () => { S.peers.clear(); S.sucio = true; };
  // latido y limpieza de pares que dejaron de dar señales (pestañas cerradas sin avisar)
  S.latido = setInterval(() => {
    if (!S.vivo) return;
    if (cable.tipo === 'bc') {
      volcar();
      const ahora = performance.now();
      for (const [id, q] of S.peers) if (ahora - q.visto > 5000) { S.peers.delete(id); S.sucio = true; }
    } else if (S._id && cable.listo() && performance.now() - S.enviarT > 4000) volcar();
  }, 1000);
  const cerrarOrig = S.cerrar;
  S.cerrar = () => { clearInterval(S.latido); cerrarOrig(); };
  return S;
}
function cableBC(nombre) {
  const C = { tipo: 'bc', id: 'b' + Math.random().toString(36).slice(2, 9), alMsg: null, alAbrir: null, alCerrar: null };
  const bc = new BroadcastChannel('isla-anzuelo-' + nombre);
  C.listo = () => true;
  C.enviar = (m) => { try { bc.postMessage(m); } catch (e) { /* cerrado */ } };
  C.cerrar = () => { try { bc.close(); } catch (e) { /* nada */ } };
  bc.onmessage = (e) => C.alMsg && C.alMsg(e.data);
  window.addEventListener('pagehide', () => C.enviar({ t: 'sale', id: C.id }));
  setTimeout(() => C.alAbrir && C.alAbrir(), 0);
  return C;
}
function cableWS(url) {
  const C = { tipo: 'ws', alMsg: null, alAbrir: null, alCerrar: null, ws: null, abierto: false, cerrado: false, intento: 0 };
  C.listo = () => C.abierto;
  C.enviar = (m) => { if (C.abierto) { try { C.ws.send(JSON.stringify(m)); } catch (e) { /* se cayó */ } } };
  C.cerrar = () => { C.cerrado = true; try { C.ws && C.ws.close(); } catch (e) { /* nada */ } };
  const conectar = () => {
    if (C.cerrado) return;
    let ws;
    try { ws = new WebSocket(url); } catch (e) { setTimeout(conectar, 4000); return; }
    C.ws = ws;
    ws.onopen = () => { C.abierto = true; C.intento = 0; C.alAbrir && C.alAbrir(); };
    ws.onmessage = (e) => { try { C.alMsg && C.alMsg(JSON.parse(e.data)); } catch (x) { /* mensaje roto */ } };
    ws.onclose = () => { const era = C.abierto; C.abierto = false; if (era) C.alCerrar && C.alCerrar(); if (!C.cerrado) setTimeout(conectar, Math.min(8000, 1000 * Math.pow(1.6, C.intento++))); };
    ws.onerror = () => { try { ws.close(); } catch (x) { /* nada */ } };
  };
  conectar();
  return C;
}

// ---------------------------------------------------------------------------
// Conectar y desconectar
// ---------------------------------------------------------------------------
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
// ¿Qué transportes hay? (se consulta al abrir el título y al empezar a jugar)
async function detectarTransportes() {
  const T = RED.transportes;
  try {
    if (typeof window.claude === 'object' && window.claude && typeof window.claude.use === 'function' && T.room === null) {
      const r = await Promise.race([window.claude.use('room'), espera(2500).then(() => null)]);
      T.room = r || false;
    }
  } catch (e) { T.room = false; }
  if (T.room === null) T.room = false;
  // el servidor propio (pesca/servidor.mjs) avisa de sí mismo dentro de la página que sirve
  T.ws = !!(window.__RED_SERVIDOR && /^https?:$/.test(location.protocol));
  return T;
}
function parametrosRed() {
  const q = new URLSearchParams(location.search);
  return { red: q.get('red'), sala: q.get('sala') };
}
async function conectarRed() {
  if (RED.sala) return true;
  RED.estado = 'conectando';
  const T = await detectarTransportes();
  const prm = parametrosRed();
  const nombreSala = nombreSeguro(prm.sala || RED.cfg.sala).toLowerCase().replace(/\s+/g, '-') || 'isla';
  let S = null;
  try {
    if (T.room && prm.red !== 'bc' && prm.red !== 'ws') {
      let room = T.room;
      if (RED.cfg.sala || prm.sala) { room = await T.room.join(nombreSala); }
      S = salaRoom(room);
    } else if (T.ws && prm.red !== 'bc') {
      const base = location.origin.replace(/^http/, 'ws');
      S = salaCable(cableWS(`${base}/ws?sala=${encodeURIComponent(nombreSala)}`));
    } else if (T.bc) S = salaCable(cableBC(nombreSala));
  } catch (e) { S = null; }
  if (!S) { RED.estado = 'error'; return false; }
  RED.sala = S; RED.tipo = S.tipo; RED.estado = 'conectada';
  for (const tema of TEMAS_RED) S.escuchar(tema, (m) => alEventoRed(tema, m));
  RED.ultPose = ''; RED.tPub = 0;
  reiniciarRedJefes();
  presenciaInicial();
  return true;
}
function desconectarRed() {
  if (RED.sala) { try { RED.sala.cerrar(); } catch (e) { /* nada */ } }
  RED.sala = null; RED.tipo = null; RED.activa = false; RED.yo = null; RED.hostId = null; RED.anfitrion = true; RED.estado = 'apagada';
  RED.pares = []; RED.chat.length = 0; RED.avisos.length = 0;
  for (const id of [...RED.remotos.keys()]) quitarRemoto(id);
  reiniciarRedJefes();
  tomarJefesComoAnfitrion(true);
}
// Toda mi presencia pasa por acá: se lleva la cuenta de su tamaño y, si se acerca al tope del canal (4 KiB), se suelta lo menos importante
function ponerPresencia(patch) {
  const S = RED.sala;
  if (!S) return;
  for (const k in patch) { if (patch[k] === null) delete RED.mia[k]; else RED.mia[k] = patch[k]; }
  let n = JSON.stringify(RED.mia).length;
  if (n > 3600) {
    for (const k of ['ch', 'hz', 'em', 'l', 'a']) {
      if (n <= 3600) break;
      if (RED.mia[k] !== undefined) { delete RED.mia[k]; patch[k] = null; n = JSON.stringify(RED.mia).length; }
    }
  }
  S.presencia(patch);
}
// Lo primero que se publica: quién soy y cómo me veo
function presenciaInicial() {
  RED.mia = {};
  ponerPresencia({ v: RED.version, n: nombreSeguro(RED.cfg.nombre), c: RED.cfg.color, j: 1, k: G.stats.jefesMatados || 0 });
}

// ---------------------------------------------------------------------------
// Lo que publico cada cuadro
// ---------------------------------------------------------------------------
const CODIGO_HERR = { cana: 0, arpon: 1, red: 2, dinamita: 3, arma: 4 };
const HERR_DE_CODIGO = ['cana', 'arpon', 'red', 'dinamita', 'arma'];
const BOTES_ID = ['remo', 'lancha', 'pesquero'];
function poseLocal() {
  const rod = P.rodar.t > 0 ? 1 : 0, bote = P.modo === 'bote' ? 1 : 0;
  const flags = rod | (bote << 1) | ((P.comiendo > 0 ? 1 : 0) << 2) | ((LINEA.estado === 'pelea' ? 1 : 0) << 3) | ((J.modo === 'desmayo' ? 1 : 0) << 4) | ((P.enSuelo ? 0 : 1) << 5) | ((P.stun > 0 ? 1 : 0) << 6);
  const vel = bote && BOTE.act ? Math.abs(BOTE.act.vel) : Math.hypot(P.vel.x, P.vel.z);
  const tool = CODIGO_HERR[P.tool] || 0;
  const b = bote && BOTE.act ? 1 + BOTES_ID.indexOf(BOTE.act.def.id) : 0;
  return [r1(P.pos.x), r1(P.pos.y), r1(P.pos.z), r2(P.yaw), r1(vel), flags, tool, b, Math.round(100 * P.hp / P.hpMax)];
}
function publicarEstado(dt) {
  const S = RED.sala;
  if (!S || !S.conectada()) return;
  RED.tPub -= dt;
  const patch = {};
  const pose = poseLocal();
  const clave = pose.join(',');
  let hay = false;
  if (RED.tPub <= 0 && (clave !== RED.ultPose || RED.tPub < -1)) { patch.p = pose; RED.ultPose = clave; RED.tPub = 0.1; hay = true; }
  // arma elegida y contador de tiros (para el fogonazo de los demás)
  const a = P.tool === 'arma' && G.armaSel ? [ARMAS.findIndex((q) => q.id === G.armaSel), G.stats.disparos || 0] : null;
  const ka = a ? a.join(',') : '';
  if (ka !== RED.ultArma) { RED.ultArma = ka; patch.a = a; hay = true; }
  // caña: estado de la línea y boya
  const l = lineaParaRed();
  const kl = l ? l.join(',') : '';
  if (kl !== RED.ultLinea) { RED.ultLinea = kl; patch.l = l; hay = true; }
  // botes lejos de su amarre (se ven aunque su dueño ya se haya bajado)
  const bt = boteParaRed();
  const kb = bt ? bt.join(',') : '';
  if (kb !== RED.ultBote) { RED.ultBote = kb; patch.bt = bt; hay = true; }
  if (RED.cola.length) { Object.assign(patch, RED.cola.shift()); hay = true; }
  if (hay) ponerPresencia(patch);
}
function lineaParaRed() {
  const e = LINEA.estado;
  if (e === 'libre') return null;
  const cod = { lanzando: 1, espera: 2, mordisqueo: 3, picada: 4, pelea: 5, recogiendo: 6, captura: 7 }[e] || 2;
  return [cod, r1(LINEA.x), r1(LINEA.z)];
}
function boteParaRed() {
  let b = P.modo === 'bote' ? BOTE.act : null;
  if (!b) for (const q of BOTE.lista) { if (!G.botes || !G.botes[q.def.id] || q.dock) continue; const am = amarre(q.def); if (Math.hypot(q.x - am.x, q.z - am.z) > 8) { b = q; break; } }
  if (!b) return null;
  return [BOTES_ID.indexOf(b.def.id), r1(b.x), r1(b.z), r2(b.ang), r1(b.vel), P.modo === 'bote' ? 1 : 0];
}
// Mensajes sueltos: se mandan como presencia (llegan aunque se pierda uno) y además como evento (llegan al instante)
function enviarChat(texto) {
  texto = String(texto || '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 120);
  if (!texto) return;
  RED.seq.chat++;
  añadirChat(RED.yo, nombreSeguro(RED.cfg.nombre), texto, true);
  if (!RED.sala) return;
  RED.cola.push({ ch: [RED.seq.chat, texto] });
  RED.sala.emitir('chat', { s: RED.seq.chat, t: texto });
}
function enviarEmote(cod) {
  RED.seq.emo++;
  mostrarEmoteLocal(cod);
  if (RED.sala) { RED.cola.push({ em: [RED.seq.emo, cod] }); RED.sala.emitir('emo', { s: RED.seq.emo, e: cod }); }
}
function añadirChat(id, nombre, texto, propio) {
  RED.chat.push({ id, nombre, texto, t: J.t, propio });
  if (RED.chat.length > 40) RED.chat.shift();
  if (typeof chatNuevo === 'function') chatNuevo(RED.chat[RED.chat.length - 1]);
}
function alEventoRed(tema, m) {
  if (!m || m.esYo) return;
  const q = RED.remotos.get(m.id), d = m.datos || {};
  if (!q) return;
  if (tema === 'chat' && typeof d.t === 'string' && d.s !== q.chatSeq) { q.chatSeq = d.s; añadirChat(m.id, q.nombre, d.t.slice(0, 120), false); q.burbuja = { texto: d.t.slice(0, 120), hasta: J.t + 6 }; }
  else if (tema === 'emo' && Number.isFinite(d.e) && d.s !== q.emoSeq) { q.emoSeq = d.s; q.emote = { cod: d.e | 0, hasta: J.t + 3.2 }; }
}

// ---------------------------------------------------------------------------
// Lo que leo cada cuadro: jugadores remotos, anfitrión, hora y clima
// ---------------------------------------------------------------------------
const finito = (v, d = 0) => (Number.isFinite(v) ? v : d);
function parsePose(a) {
  if (!Array.isArray(a) || a.length < 9) return null;
  const x = finito(a[0], NaN), z = finito(a[2], NaN);
  if (!Number.isFinite(x) || !Number.isFinite(z) || Math.abs(x) > MUNDO.R * 1.5 || Math.abs(z) > MUNDO.R * 1.5) return null;
  return { x, y: clamp(finito(a[1]), -40, 120), z, yaw: finito(a[3]), vel: clamp(finito(a[4]), 0, 80), f: finito(a[5]) | 0, tool: clamp(finito(a[6]) | 0, 0, 4), bote: clamp(finito(a[7]) | 0, 0, 3), hp: clamp(finito(a[8], 100), 0, 100) };
}
function actualizarMulti(dt) {
  const S = RED.sala;
  if (!S) { RED.activa = false; RED.anfitrion = true; return; }
  const ahora = performance.now();
  RED.activa = S.conectada();
  RED.yo = S.id();
  const pares = S.pares();
  RED.pares = pares;
  const vivos = new Set();
  let host = null;
  for (const q of pares) {
    const p = q.p || {};
    if (p.v !== RED.version || p.j !== 1) continue;
    if (p.lh === 1 && (host === null || String(q.id) < host)) host = String(q.id);
    if (q.esYo) continue;
    vivos.add(q.id);
    let r = RED.remotos.get(q.id);
    if (!r) { r = { id: q.id, p: null, muestras: [], nombre: '', color: 0, chatSeq: -1, emoSeq: -1, nivel: 0 }; RED.remotos.set(q.id, r); toast(`${nombreSeguro(p.n) || 'Alguien'} llegó a la isla.`, '#9be7ff'); }
    if (r.p !== p) { r.p = p; alCambiarPresencia(r, p, ahora); }
  }
  for (const id of [...RED.remotos.keys()]) if (!vivos.has(id)) { const r = RED.remotos.get(id); toast(`${r.nombre || 'Alguien'} se fue de la isla.`, '#c8d3dc'); quitarRemoto(id); }
  const nuevoHost = host;
  RED.hostId = nuevoHost;
  const eraAnfitrion = RED.anfitrion;
  RED.anfitrion = !RED.activa || nuevoHost === null || String(RED.yo) === nuevoHost;
  if (RED.anfitrion !== eraAnfitrion) alCambiarAnfitrion(RED.anfitrion);
  publicarEstado(dt);
  actualizarMundoRedBase(dt);
}
function alCambiarPresencia(r, p, ahora) {
  r.nombre = nombreSeguro(p.n) || 'Pescador';
  r.color = clamp(finito(p.c) | 0, 0, COLORES_CAMISA.length - 1);
  r.nivel = finito(p.k) | 0;
  const pose = parsePose(p.p);
  if (pose) {
    pose.t = ahora; r.muestras.push(pose); if (r.muestras.length > 6) r.muestras.shift(); r.pose = pose;
    if (!r.posBlanco) r.posBlanco = { x: pose.x, y: pose.y, z: pose.z };
    r.posBlanco.x = pose.x; r.posBlanco.y = pose.y; r.posBlanco.z = pose.z;
  }
  // chat y emotes también llegan por presencia (si se perdió el evento). La primera presencia que veo no repite lo viejo.
  const primera = !r.inicial;
  r.inicial = true;
  if (Array.isArray(p.ch) && typeof p.ch[1] === 'string' && p.ch[0] !== r.chatSeq) {
    if (!primera) { añadirChat(r.id, r.nombre, p.ch[1].slice(0, 120), false); r.burbuja = { texto: p.ch[1].slice(0, 120), hasta: J.t + 6 }; }
    r.chatSeq = p.ch[0];
  }
  if (Array.isArray(p.em) && Number.isFinite(p.em[1]) && p.em[0] !== r.emoSeq) {
    if (!primera) r.emote = { cod: p.em[1] | 0, hasta: J.t + 3.2 };
    r.emoSeq = p.em[0];
  }
}
function quitarRemoto(id) {
  const r = RED.remotos.get(id);
  if (r && typeof destruirAvatar === 'function') destruirAvatar(r);
  RED.remotos.delete(id);
}
// ¿Cuántos jugadores hay (contándome)?
const jugadoresEnSala = () => (RED.activa ? 1 + RED.remotos.size : 1);
// El anfitrión cambió (el que llevaba los jefes se fue, o entré yo primero)
function alCambiarAnfitrion(soyYo) {
  if (!RED.activa) return;
  if (soyYo && RED.remotos.size > 0) toast('Ahora sos el anfitrión: los jefes se simulan en tu juego.', '#9be7ff');
  if (typeof tomarJefesComoAnfitrion === 'function') tomarJefesComoAnfitrion(soyYo);
}
// Presencia del anfitrión (de ahí salen los jefes, la hora y el clima)
function presenciaAnfitrion() {
  if (!RED.activa || RED.anfitrion) return null;
  const r = RED.remotos.get(RED.hostId);
  return r ? r.p : null;
}
// Hora y clima compartidos: el anfitrión publica, los demás se acercan
function actualizarMundoRedBase(dt) {
  const S = RED.sala;
  if (!S || !RED.activa) { actualizarMundoRedJefes(dt); return; }
  if (RED.anfitrion) {
    RED.tHost -= dt;
    if (RED.tHost <= 0) { RED.tHost = 1.0; ponerPresencia({ tm: [r2(J.hora), r2(J.clima.objetivo), r2(J.clima.lluvia)] }); }
  } else {
    const hp = presenciaAnfitrion();
    const tm = hp && hp.tm;
    if (Array.isArray(tm) && tm.length >= 3) {
      const dh = ((finito(tm[0]) - J.hora + 36) % 24) - 12;
      J.hora = (J.hora + dh * Math.min(1, dt * 0.8) + 24) % 24;
      J.clima.objetivo = clamp(finito(tm[1]), 0, 1);
      J.clima.tClima = 999;
    }
  }
  actualizarMundoRedJefes(dt);
}
