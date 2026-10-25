// Salas del modo online: el lobby (la sala común del Artifact) muestra las salas abiertas, y cada
// partida es una sala con nombre (room.join). Hay tres tipos:
//   publica → aparece en la lista y entra cualquiera
//   amigos  → privada: no aparece en la lista, se entra con el código
//   pedido  → privada: aparece en la lista, pero el anfitrión acepta a cada uno
// No hay servidor que decida. El ANFITRIÓN es el jugador que está hace más tiempo en la sala (el que la
// creó, mientras siga); él anuncia la sala en el lobby, acepta pedidos y puede echar a alguien. Quien
// juega con el juego tal cual respeta todo eso; un jugador con un juego modificado podría saltearlo
// (está en los riesgos del plan). Todo lo que llega se valida: nombres como texto, tamaños acotados.
import { conseguirCanal, hayArtifact, motivoCanal, diagCanal, accesoDePrueba } from './canal.js';

export const MAX_SALA = 8;
export const TIPOS = ['publica', 'amigos', 'pedido'];
const CLAVE = 'gtasj-online';
const LETRAS = 'abcdefghjkmnpqrstuvwxyz23456789'; // sin 0/o ni 1/l/i para dictar el código sin confusión
const ID_SALA = /^[prc]-[a-z0-9]{6,10}$/;
const PEER = /^[A-Za-z0-9_-]{1,64}$/;

export function textoSeguro(s, max = 24) {
  return String(s == null ? '' : s).replace(/[^\p{L}\p{N} _.,:;!¡?¿()'"+\-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, max);
}
const azar = (n) => { let s = ''; for (let i = 0; i < n; i++) s += LETRAS[Math.floor(Math.random() * LETRAS.length)]; return s; };
const leer = (k) => { try { return JSON.parse(localStorage.getItem(k) || '{}'); } catch (e) { return {}; } };
const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } };
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

// El código que se comparte con los amigos (lo que va después de "c-"), en mayúsculas para leerlo
export function codigoDe(id) { return id && id.startsWith('c-') ? id.slice(2).toUpperCase() : ''; }
// Lo que escribe alguien en "Entrar con código": acepta "ABC123", "c-abc123" o con espacios
export function idDeCodigo(txt) {
  const t = String(txt || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
  const id = t.startsWith('c-') ? t : 'c-' + t;
  return ID_SALA.test(id) ? id : null;
}

// Qué tipos de sala se pueden crear y encontrar. La privada con código (no sale en ninguna lista) siempre está.
// Por defecto es lo único que hay (decisión del 25/10: "Solo código"). Las otras dos están hechas y probadas, apagadas:
//   publica: salas públicas, que aparecen en una lista con cuánta gente hay y cualquiera puede entrar.
//   pedido:  privadas que aparecen en la lista pero el anfitrión tiene que aceptar a cada uno.
// Se encienden acá, o solo para las pruebas con ?red=bc&acceso=publica,pedido (ver canal.js).
export const ACCESO = { publica: false, pedido: false };

export class Online {
  constructor(opts = {}) {
    this.opts = opts;
    const acceso = { ...ACCESO, ...accesoDePrueba(), ...(opts.acceso || {}) };
    this.permitidos = new Set(['amigos', ...(acceso.publica ? ['publica'] : []), ...(acceso.pedido ? ['pedido'] : [])]);
    this.listadas = this.permitidos.has('publica') || this.permitidos.has('pedido'); // ¿hay lista de salas?
    this.canal = null; // { tipo: 'room' | 'bc', room }
    this.disponible = false;
    this.estado = 'apagado'; // apagado | buscando | listo | sin-canal
    this.sala = null; // { id, nombre, tipo, max }
    this.salaRoom = null;
    this.yo = null;
    this.t0 = 0;
    this.esperando = false; // pidió entrar y espera al anfitrión
    this.silenciados = new Set();
    this.echados = new Set(); // los que echó algún anfitrión (se heredan si cambia el anfitrión)
    this.oyentes = {};
    const c = leer(CLAVE);
    this.nombre = textoSeguro(c.nombre) || 'Jugador' + (100 + Math.floor(Math.random() * 900));
    this.ultLobby = '';
    this.ok = []; // anfitrión: a quién aceptó
  }

  on(ev, fn) { (this.oyentes[ev] = this.oyentes[ev] || []).push(fn); }
  emitir(ev, ...a) { for (const fn of this.oyentes[ev] || []) { try { fn(...a); } catch (e) { console.error(e); } } }

  setNombre(n) {
    this.nombre = textoSeguro(n) || this.nombre;
    guardar(CLAVE, { nombre: this.nombre });
    if (this.salaRoom) this.mandar({ n: this.nombre });
    return this.nombre;
  }

  // ¿Esta vista tiene alguna chance de tener salas? (dentro de un Artifact sí; en el .exe o el .apk no)
  enArtifact() { return !!this.opts.canal || hayArtifact(); }
  get motivo() { return this.errorCanal && this.estado === 'sin-canal' ? this.errorCanal : motivoCanal(); }
  get diag() { return diagCanal(); }

  // Volver a buscar la sala si la vez anterior no apareció (el celular puede tardar o fallar la primera vez)
  async reconectar() {
    if (this.estado === 'sin-canal') { this.estado = 'apagado'; this.errorCanal = null; }
    return this.conectar();
  }

  async conectar() {
    if (this.estado !== 'apagado') return this.disponible;
    this.estado = 'buscando';
    this.canal = this.opts.canal || await conseguirCanal();
    this.disponible = !!this.canal;
    this.estado = this.disponible ? 'listo' : 'sin-canal';
    if (this.canal) {
      const room = this.canal.room;
      // Si la vista conecta pero la plataforma no admite a esta cuenta (not_granted) o le saca el acceso
      // (revoked), no hay salas: se trata como sin conexión
      const fatales = ['not_granted', 'revoked', 'capability_disabled', 'capability_removed'];
      const alError = (e) => {
        this.errorCanal = e && e.code;
        if (fatales.includes(this.errorCanal)) {
          this.disponible = false;
          this.estado = 'sin-canal';
          if (this.sala) this.salir(true).then(() => this.emitir('fuera', 'Se perdió la conexión con la sala.'));
        }
        this.emitir('cambio');
      };
      try { room.onPeers(() => this.emitir('cambio'), alError); } catch (e) { /* nada */ }
      try { room.presence({ v: 1, an: null }).catch(() => {}); } catch (e) { /* nada */ }
    }
    this.emitir('cambio');
    return this.disponible;
  }

  // Mi id en el canal (el mismo para todos; nuevo en cada recarga)
  miPeer(room = this.salaRoom || (this.canal && this.canal.room)) {
    if (!room) return null;
    const m = room.peers().find((p) => p.isMe && p.sameTab);
    return m ? m.peer : this.yo;
  }

  // ---------- lobby ----------
  salasAbiertas() {
    if (!this.canal || !this.listadas) return [];
    const porId = new Map();
    for (const p of this.canal.room.peers()) {
      const a = p.presence && p.presence.an;
      if (!a || typeof a !== 'object' || !ID_SALA.test(a.id || '') || a.id.startsWith('c-')) continue;
      const tipo = a.id.startsWith('r-') ? 'pedido' : 'publica'; // el tipo lo marca el id, el mismo que se usa para entrar
      if (!this.permitidos.has(tipo)) continue;
      const s = { id: a.id, nombre: textoSeguro(a.n) || 'Sala', tipo, j: Math.max(1, Math.min(MAX_SALA, Math.floor(+a.j) || 1)), max: MAX_SALA, mia: !!(p.isMe && p.sameTab) };
      const prev = porId.get(s.id);
      if (!prev || s.j > prev.j) porId.set(s.id, s);
    }
    return [...porId.values()].sort((a, b) => b.j - a.j || a.nombre.localeCompare(b.nombre));
  }

  anunciar() {
    if (!this.canal) return;
    let an = null;
    if (this.listadas && this.sala && this.sala.tipo !== 'amigos' && this.permitidos.has(this.sala.tipo) && this.esAnfitrion()) {
      an = { id: this.sala.id, n: this.sala.nombre, ti: this.sala.tipo, j: this.jugadores().length, mx: MAX_SALA };
    }
    const s = JSON.stringify(an);
    if (s === this.ultLobby) return;
    this.ultLobby = s;
    try { this.canal.room.presence({ an }).catch(() => {}); } catch (e) { /* nada */ }
  }

  // ---------- crear, entrar, salir ----------
  async crearSala(nombre, tipo) {
    if (!this.canal) return { ok: false, error: 'El modo online no está disponible acá.' };
    if (!TIPOS.includes(tipo)) tipo = 'publica';
    if (!this.permitidos.has(tipo)) tipo = 'amigos'; // lo que no está permitido sale privada con código, nunca más abierta
    const id = (tipo === 'amigos' ? 'c-' + azar(6) : (tipo === 'pedido' ? 'r-' : 'p-') + azar(8));
    const sala = { id, nombre: textoSeguro(nombre) || `Sala de ${this.nombre}`, tipo, max: MAX_SALA };
    const r = await this.unirseCanal(id);
    if (!r.ok) return r;
    this.sala = sala;
    this.t0 = Date.now();
    this.esperando = false;
    this.ok = [];
    this.mandar({ v: 1, n: this.nombre, t0: this.t0, me: { n: sala.nombre, ti: sala.tipo, mx: sala.max }, es: 0 });
    this.anunciar();
    this.emitir('admitido', sala);
    this.emitir('cambio');
    return { ok: true, sala };
  }

  async entrar(id) {
    if (!this.canal) return { ok: false, error: 'El modo online no está disponible acá.' };
    const clase = { p: 'publica', r: 'pedido', c: 'amigos' }[(id || '')[0]];
    if (!ID_SALA.test(id || '') || !this.permitidos.has(clase)) return { ok: false, error: 'Ese código no es válido.' };
    if (this.sala && this.sala.id === id) return { ok: true, sala: this.sala };
    const r = await this.unirseCanal(id);
    if (!r.ok) return r;
    // los que ya están tardan un momento en aparecer
    let meta = null;
    for (let t = 0; t < 30 && !meta; t++) { await esperar(100); meta = this.metaDeSala(); }
    if (!meta) { await this.salir(true); return { ok: false, error: id.startsWith('c-') ? 'No hay nadie en una sala con ese código.' : 'Esa sala ya se cerró.' }; }
    await esperar(1200); // el resto de los que están sigue apareciendo un segundo más
    meta = this.metaDeSala() || meta;
    if (this.echadosDe(this.miPeer())) { await this.salir(true); return { ok: false, error: 'El anfitrión te sacó de esta sala.' }; }
    const yo = this.miPeer();
    const otros = this.pares().filter((q) => q.peer !== yo && q.presence && q.presence.v === 1 && q.presence.es !== 1 && !this.echadosDe(q.peer)).length;
    if (otros >= meta.max) { await this.salir(true); return { ok: false, error: 'La sala está llena.' }; }
    this.sala = { id, nombre: meta.nombre, tipo: meta.tipo, max: meta.max };
    this.t0 = Date.now();
    this.esperando = meta.tipo === 'pedido';
    this.mandar({ v: 1, n: this.nombre, t0: this.t0, me: { n: meta.nombre, ti: meta.tipo, mx: meta.max }, es: this.esperando ? 1 : 0 });
    if (this.esperando) {
      this.emitir('aviso', 'Pediste entrar. Espera a que el anfitrión te acepte.');
      const fin = Date.now() + 90000;
      while (this.esperando && this.salaRoom && Date.now() < fin) {
        await esperar(200);
        const h = this.anfitrion();
        const yo = this.miPeer();
        if (h && Array.isArray(h.p.no) && h.p.no.includes(yo)) { await this.salir(true); return { ok: false, error: 'El anfitrión no te aceptó.' }; }
        if (h && Array.isArray(h.p.ok) && h.p.ok.includes(yo)) { this.esperando = false; this.mandar({ es: 0 }); }
      }
      if (this.esperando) { await this.salir(true); return { ok: false, error: 'El anfitrión no respondió.' }; }
    }
    this.emitir('admitido', this.sala);
    this.emitir('cambio');
    return { ok: true, sala: this.sala };
  }

  async unirseCanal(id) {
    if (this.salaRoom) await this.salir(true);
    this.echados = new Set(); // los echados y aceptados son de cada sala
    this.ok = [];
    try {
      const r = await this.canal.room.join(id);
      this.salaRoom = r;
      this.yo = this.miPeer(r);
      r.onPeers(() => { this.revisar(); this.emitir('cambio'); }, (e) => { if (this.salaRoom === r) { this.salaRoom = null; this.sala = null; this.emitir('fuera', 'Se cortó la conexión con la sala.'); this.emitir('cambio'); } });
      return { ok: true };
    } catch (e) {
      const code = e && e.code;
      const msg = code === 'not_permitted' ? 'Tu cuenta no puede entrar a salas en esta página.' : code === 'limit_reached' ? 'Hay demasiadas salas abiertas ahora. Probá en un rato.' : 'No se pudo conectar con la sala. Probá de nuevo.';
      return { ok: false, error: msg };
    }
  }

  async salir(silencioso = false) {
    const r = this.salaRoom;
    this.salaRoom = null;
    const habia = this.sala;
    this.sala = null;
    this.esperando = false;
    this.ok = [];
    this.anunciar();
    if (r) { try { await r.leave(); } catch (e) { /* nada */ } }
    if (habia && !silencioso) this.emitir('fuera', 'Saliste de la sala.');
    this.emitir('cambio');
  }

  // ---------- quién está ----------
  pares() { return this.salaRoom ? this.salaRoom.peers() : []; }

  // Los datos de la sala según quienes ya están (el anfitrión manda)
  metaDeSala() {
    const h = this.anfitrion(true);
    const p = h ? h.p : null;
    if (!p || !p.me || typeof p.me !== 'object') return null;
    const tipo = TIPOS.includes(p.me.ti) ? p.me.ti : 'publica';
    return { nombre: textoSeguro(p.me.n) || 'Sala', tipo, max: Math.max(2, Math.min(MAX_SALA, Math.floor(+p.me.mx) || MAX_SALA)) };
  }

  // Todos los que juegan (aceptados, no echados), ordenados por llegada; los primeros MAX_SALA
  jugadores() {
    const yo = this.miPeer();
    const lista = [];
    for (const q of this.pares()) {
      const p = q.presence || {};
      if (!PEER.test(q.peer || '') || q.kind === 'agent') continue;
      const esYo = q.peer === yo;
      if (!esYo && (p.v !== 1 || p.es === 1 || this.echados.has(q.peer))) continue;
      if (esYo && this.esperando) continue;
      lista.push({ peer: q.peer, esYo, p, nombre: textoSeguro(p.n) || 'Jugador', t0: +p.t0 || 0, guest: !!q.guest, visto: q.updatedAt || 0 });
    }
    lista.sort((a, b) => a.t0 - b.t0 || (a.peer < b.peer ? -1 : 1));
    return lista.slice(0, this.sala ? this.sala.max : MAX_SALA);
  }

  // El que está hace más tiempo (con t0 válido). incluirme: también si soy yo y todavía no mandé nada
  anfitrion(soloOtros = false) {
    const yo = this.miPeer();
    let mejor = null;
    for (const q of this.pares()) {
      const p = q.presence || {};
      if (p.v !== 1 || p.es === 1 || this.echados.has(q.peer) || !(+p.t0 > 0)) continue;
      if (soloOtros && q.peer === yo) continue;
      const t0 = +p.t0;
      if (!mejor || t0 < mejor.t0 || (t0 === mejor.t0 && q.peer < mejor.peer)) mejor = { peer: q.peer, p, t0 };
    }
    return mejor;
  }

  // ¿lo echó el anfitrión de turno? (sirve antes de entrar, cuando todavía no heredé la lista)
  echadosDe(peer) {
    if (this.echados.has(peer)) return true;
    const h = this.anfitrion(true);
    return !!(h && Array.isArray(h.p.no) && h.p.no.includes(peer));
  }

  esAnfitrion() { const h = this.anfitrion(); return !!h && h.peer === this.miPeer() && !this.esperando; }

  pendientes() {
    if (!this.esAnfitrion()) return [];
    return this.pares().filter((q) => q.presence && q.presence.v === 1 && q.presence.es === 1 && !this.echados.has(q.peer) && !this.ok.includes(q.peer))
      .map((q) => ({ peer: q.peer, nombre: textoSeguro(q.presence.n) || 'Jugador' }));
  }

  aceptar(peer) {
    if (!this.esAnfitrion() || !PEER.test(peer)) return;
    if (this.jugadores().length >= this.sala.max) { this.emitir('aviso', 'La sala está llena.'); return; }
    this.ok = [...this.ok.filter((x) => x !== peer), peer].slice(-24);
    this.mandar({ ok: this.ok });
    this.emitir('cambio');
  }
  rechazar(peer) { this.echar(peer, true); }
  echar(peer, rechazo = false) {
    if (!this.esAnfitrion() || !PEER.test(peer) || peer === this.miPeer()) return;
    this.echados.add(peer);
    this.ok = this.ok.filter((x) => x !== peer);
    this.mandar({ no: [...this.echados].slice(-24), ok: this.ok });
    if (!rechazo) this.emitir('aviso', 'Lo echaste de la sala.');
    this.emitir('cambio');
  }
  silenciar(peer) { if (this.silenciados.has(peer)) this.silenciados.delete(peer); else this.silenciados.add(peer); this.emitir('cambio'); }

  // Se llama cada vez que cambia la sala: hereda los echados, se va si lo echaron, sigue anunciando
  revisar() {
    if (!this.salaRoom) return;
    const yo = this.miPeer();
    for (const q of this.pares()) {
      const no = q.presence && q.presence.no;
      if (!Array.isArray(no) || q.peer === yo) continue;
      // solo cuenta lo que dice el anfitrión de turno
      const h = this.anfitrion();
      if (!h || h.peer !== q.peer) continue;
      for (const x of no.slice(0, 24)) if (typeof x === 'string' && PEER.test(x)) {
        if (x === yo) { this.salir(true).then(() => this.emitir('fuera', 'El anfitrión te sacó de la sala.')); return; }
        this.echados.add(x);
      }
    }
    if (this.esAnfitrion() && this.sala && this.sala.tipo === 'pedido') {
      // si pasé a ser anfitrión, los que ya estaban jugando quedan aceptados
      const ya = this.jugadores().filter((j) => !j.esYo).map((j) => j.peer);
      const ok = [...new Set([...this.ok, ...ya])].slice(-24);
      if (ok.length !== this.ok.length) { this.ok = ok; this.mandar({ ok }); }
    }
    this.anunciar();
  }

  // ---------- presencia ----------
  mandar(patch) {
    if (!this.salaRoom) return;
    try { const r = this.salaRoom.presence(patch); if (r && r.catch) r.catch((e) => { if (e && e.code === 'invalid_argument') console.warn('[online]', e.message); }); } catch (e) { /* nada */ }
  }
}
