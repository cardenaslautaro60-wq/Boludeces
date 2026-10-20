// Canal en tiempo real para el modo online. Usa la sala del Artifact (claude.use('room')) cuando la
// página se abre publicada y con sesión; para probar sin Artifact, ?red=bc arma una sala de mentira
// con BroadcastChannel entre pestañas del mismo navegador (misma interfaz).
//
// Todo viaja como PRESENCIA (el estado de cada jugador): la sala del Artifact deja que cualquiera la
// mande, mientras que los eventos solo los mandan los editores. Así los invitados que solo pueden ver
// también juegan. Nada de lo que llega es confiable: lo valida quien lo usa (ver sala.js).

const ESPERA_USE = 12000; // claude.use() responde null a los ~10 s si no hay visor

// Por qué la última búsqueda no encontró la sala (para mostrárselo a quien lo necesite)
let motivo = '';
export const motivoCanal = () => motivo;

// Lo que se pudo averiguar de esta vista cuando la sala no aparece: si el juego está dentro de Claude o
// abierto suelto, cuánto tardó la respuesta, qué dice el permiso "room" y si es un celular
let diag = { marco: null, ms: 0, permiso: '', movil: false };
let permisos = null;
export const diagCanal = () => diag;
export const hayPermisos = () => !!permisos;
// Desde un botón: pide el permiso de salas (abre el diálogo de Claude) o abre el panel de permisos
export async function pedirPermiso() { try { return permisos ? await permisos.request(['room']) : null; } catch (e) { return null; } }
export async function abrirPermisos() { try { if (permisos) await permisos.manage(); } catch (e) { /* no se pudo abrir */ } }
const conTope = (p, ms, valor = null) => Promise.race([p, new Promise((res) => setTimeout(() => res(valor), ms))]);

// ¿Se está jugando dentro de un Artifact? (en el .exe, el .apk o el archivo suelto no hay salas)
export function hayArtifact() {
  try { if (new URLSearchParams(location.search).get('red') === 'bc' && typeof BroadcastChannel === 'function') return true; } catch (e) { /* sin URL */ }
  return typeof window !== 'undefined' && !!window.claude && typeof window.claude.use === 'function';
}

// La sala del Artifact, o null si esta vista no puede conectarse (link público, sin sesión, descargado)
export async function salaDelArtifact() {
  const c = typeof window !== 'undefined' ? window.claude : null;
  if (!c || typeof c.use !== 'function') { motivo = 'sin-artifact'; return null; }
  const t0 = Date.now();
  let marco = null;
  try { marco = window.top !== window.self; } catch (e) { marco = true; }
  const movil = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
  try {
    let tiempo = false;
    const r = await Promise.race([c.use('room'), new Promise((res) => setTimeout(() => { tiempo = true; res(null); }, ESPERA_USE))]);
    motivo = r ? '' : tiempo ? 'sin-respuesta' : 'sin-permiso';
    diag = { marco, ms: Date.now() - t0, permiso: '', movil };
    if (!r && !tiempo) {
      // la vista respondió que no: ¿es un permiso que falta o rechazado? (sin preguntar nada)
      try {
        permisos = await conTope(c.use('permissions'), 3000);
        diag.permiso = permisos ? await conTope(permisos.state('room'), 2000, '?') : 'sin-panel';
      } catch (e) { diag.permiso = 'error'; }
    }
    return r || null;
  } catch (e) {
    motivo = 'error';
    diag = { marco, ms: Date.now() - t0, permiso: '', movil };
    return null;
  }
}

export async function conseguirCanal() {
  let modo = '';
  try { modo = new URLSearchParams(location.search).get('red') || ''; } catch (e) { /* sin URL */ }
  if (modo === 'bc' && typeof BroadcastChannel === 'function') return { tipo: 'bc', room: salaPestanas() };
  const room = await salaDelArtifact();
  return room ? { tipo: 'room', room } : null;
}

// ---------------------------------------------------------------------------
// Sala de prueba entre pestañas (y en las pruebas automáticas, entre objetos del mismo proceso).
// Imita lo que usa el juego de la sala del Artifact: presence, peers, onPeers, connected, join, leave.
// ---------------------------------------------------------------------------
const VIDA_PAR = 4000; // un par que no da señales en 4 s se considera ido

export function salaPestanas(opts = {}) {
  const yo = opts.peer || 'bc' + Math.random().toString(36).slice(2, 10);
  const salas = new Map();
  const abrir = (nombre) => {
    if (salas.has(nombre)) return salas.get(nombre);
    const s = canalBC(yo, (opts.prefijo || 'gtasj-') + nombre, () => salas.delete(nombre));
    s.name = nombre;
    salas.set(nombre, s);
    return s;
  };
  const lobby = abrir('lobby');
  return {
    presence: lobby.presence, peers: lobby.peers, onPeers: lobby.onPeers,
    connected: lobby.connected, onConnection: lobby.onConnection,
    async join(nombre) {
      if (!/^[a-z0-9][a-z0-9_.-]{0,47}$/.test(nombre)) throw { code: 'invalid_argument', message: 'nombre de sala' };
      if (salas.size > 16) throw { code: 'limit_reached', message: 'demasiadas salas' };
      return abrir('s.' + nombre);
    },
    cerrarTodo() { for (const s of [...salas.values()]) s.leave(); },
    _yo: yo,
  };
}

function canalBC(yo, nombreCanal, alSalir) {
  const bc = new BroadcastChannel(nombreCanal);
  let mia = {};
  let yoPar = congelar({ peer: yo, by: null, isMe: true, sameTab: true, kind: 'viewer', guest: false, presence: {}, updatedAt: Date.now() });
  const otros = new Map(); // peer -> { par, visto }
  let lista = Object.freeze([yoPar]);
  const oyentes = new Set();
  let cerrado = false, pendiente = null, ultEnvio = 0, cambios = { joined: [yoPar], left: [], updated: [] };
  const rehacer = () => { lista = Object.freeze([yoPar, ...[...otros.values()].map((o) => o.par)]); };
  const avisar = () => {
    if (pendiente) return;
    pendiente = setTimeout(() => {
      pendiente = null;
      const c = { peers: lista, ...cambios };
      cambios = { joined: [], left: [], updated: [] };
      for (const fn of oyentes) { try { fn(c); } catch (e) { console.error(e); } }
    }, 16);
  };
  const enviar = (tipo) => {
    if (cerrado) return;
    ultEnvio = Date.now();
    try { bc.postMessage({ t: tipo, peer: yo, p: mia }); } catch (e) { /* sin canal */ }
  };
  bc.onmessage = (ev) => {
    const m = ev.data;
    if (!m || typeof m.peer !== 'string' || m.peer === yo) return;
    if (m.t === 'bye') {
      const o = otros.get(m.peer);
      if (o) { otros.delete(m.peer); rehacer(); cambios.left.push(o.par); avisar(); }
      return;
    }
    const prev = otros.get(m.peer);
    const igual = prev && JSON.stringify(prev.par.presence) === JSON.stringify(m.p || {});
    const par = igual ? prev.par : congelar({ peer: m.peer, by: null, isMe: false, sameTab: false, kind: 'viewer', guest: false, presence: m.p || {}, updatedAt: Date.now() });
    otros.set(m.peer, { par, visto: Date.now() });
    if (!prev) { rehacer(); cambios.joined.push(par); avisar(); enviar('p'); }
    else if (!igual) { rehacer(); cambios.updated.push(par); avisar(); }
  };
  const latido = setInterval(() => {
    const ahora = Date.now();
    let cambio = false;
    for (const [k, o] of otros) if (ahora - o.visto > VIDA_PAR) { otros.delete(k); cambios.left.push(o.par); cambio = true; }
    if (cambio) { rehacer(); avisar(); }
    if (ahora - ultEnvio > 900) enviar('p');
  }, 500);
  if (latido.unref) latido.unref();
  enviar('p');
  avisar();
  const api = {
    presence(patch) {
      if (cerrado) return Promise.reject({ code: 'invalid_argument', message: 'sala cerrada' });
      const nueva = { ...mia };
      for (const [k, v] of Object.entries(patch || {})) { if (v === null) delete nueva[k]; else nueva[k] = v; }
      if (JSON.stringify(nueva).length > 4096) return Promise.reject({ code: 'invalid_argument', message: 'presencia de más de 4 KiB' });
      mia = nueva;
      yoPar = congelar({ ...yoPar, presence: mia, updatedAt: Date.now() });
      rehacer(); cambios.updated.push(yoPar); avisar();
      if (Date.now() - ultEnvio > 33) enviar('p');
      else setTimeout(() => enviar('p'), 34);
      return Promise.resolve();
    },
    peers: () => lista,
    onPeers(fn) { oyentes.add(fn); setTimeout(() => { if (oyentes.has(fn)) fn({ peers: lista, joined: lista, left: [], updated: [] }); }, 0); return () => oyentes.delete(fn); },
    connected: () => !cerrado,
    onConnection(fn) { setTimeout(() => fn(!cerrado), 0); return () => {}; },
    async leave() {
      if (cerrado) return;
      enviar('bye');
      cerrado = true;
      clearInterval(latido);
      oyentes.clear();
      try { bc.close(); } catch (e) { /* nada */ }
      alSalir();
    },
  };
  return api;
}

function congelar(o) { Object.freeze(o.presence); return Object.freeze(o); }
