// Pantalla "Online": nombre, salas abiertas, crear sala (pública, privada con código o privada con
// pedido de entrada), entrar con código y, adentro de una sala, la lista de jugadores. Más el contador
// de la sala y el chat en el HUD. Todo lo que escribió otro jugador se muestra como texto (textContent).
import { MAX_SALA, codigoDe, idDeCodigo } from '../red/sala.js';
import { escapar, colorDe } from '../red/jugadores.js';
import { hayPermisos, pedirPermiso, abrirPermisos } from '../red/canal.js';

const el = (tag, cls, parent, txt) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (txt !== undefined) e.textContent = txt;
  if (parent) parent.appendChild(e);
  return e;
};
const TIPO_TXT = { publica: 'Pública', amigos: 'Privada · con código', pedido: 'Privada · piden entrar y el anfitrión acepta' };
const TIPO_BOTON = { publica: 'Crear sala pública', amigos: 'Crear sala privada (con código)', pedido: 'Crear sala privada (piden entrar)' };
// para que escribir en un campo no mueva al personaje ni dispare trucos
const aislar = (inp) => { for (const ev of ['keydown', 'keyup', 'keypress']) inp.addEventListener(ev, (e) => e.stopPropagation()); };

// Qué le pasó a esta vista y qué puede hacer quien juega, según lo que averiguó red/canal.js
function explicacion(o) {
  const d = o.diag || {}, m = o.motivo;
  if (m === 'not_granted' || m === 'revoked') return 'Claude no deja entrar a esta cuenta a las salas de esta página. Quien compartió la página tiene que invitarte con tu correo (no alcanza con el link público).';
  if (d.marco === false) return 'Abriste el juego suelto, no dentro de Claude. Abrilo desde la app o la web de Claude, con tu cuenta.';
  if (d.permiso === 'denied') return 'Rechazaste el permiso de salas para esta página. Tocá "Abrir permisos" y activalo.';
  if (d.permiso === 'prompt') return 'Falta que aceptes el permiso de salas. Tocá "Permitir".';
  if (m === 'sin-respuesta') return 'Claude no respondió a tiempo. Probá de nuevo.';
  return 'El modo online no está disponible para esta cuenta. Quien compartió la página tiene que invitarte con tu correo (el link público no alcanza) y la tenés que abrir con esa cuenta.';
}
const datoDiag = (o) => { const d = o.diag || {}; return [o.motivo, d.marco === false ? 'suelto' : d.marco ? 'dentro-de-claude' : '', d.permiso && 'permiso=' + d.permiso, d.movil ? 'celular' : 'compu', d.ms ? d.ms + 'ms' : ''].filter(Boolean).join(' · '); };

export class OnlineUI {
  constructor(game, online, red) {
    this.g = game; this.o = online; this.red = red;
    this.panel = null;
    this.buildHud();
    online.on('cambio', () => { this.mostrarBotones(); this.refrescar(); });
    online.on('aviso', (t) => this.mensaje(t));
    online.on('fuera', (t) => { this.mensaje(t); if (this.g.started) this.g.hud.showToast(escapar(t), 3); this.refrescar(); });
    online.on('admitido', (s) => { if (this.g.started) this.g.hud.showToast(`Entraste a <b>${escapar(s.nombre)}</b>`, 3); });
    red.alChat = (quien, txt, color) => this.lineaChat(quien, txt, color);
    red.alAviso = (html) => this.g.hud.showToast(html, 3.5);
  }

  // Los botones "Jugar online" aparecen dentro de un Artifact (en el .exe o el .apk no hay salas).
  // Si todavía no conectó dice "conectando"; si no pudo, el panel explica qué hacer.
  mostrarBotones() {
    const o = this.o, en = o.enArtifact();
    for (const b of document.querySelectorAll('[data-a=online]')) {
      if (!b.dataset.txt) b.dataset.txt = b.textContent;
      const txt = b.dataset.txt + (o.disponible ? '' : o.estado === 'buscando' || o.estado === 'apagado' ? ' (conectando...)' : ' (sin conexión: tocá acá)');
      if (b.hidden === en) b.hidden = !en;
      if (b.textContent !== txt) b.textContent = txt;
    }
  }

  // Busca la sala al abrir el juego y vuelve a probar si no apareció (el celular a veces tarda o falla la
  // primera vez), y cada vez que se vuelve a la pestaña
  async iniciar() {
    const intentar = () => {
      if (this.o.disponible) return Promise.resolve();
      if (this.intento) return this.intento; // ya hay una búsqueda en curso: se espera esa
      this.intento = (async () => {
        const busqueda = this.o.reconectar(); // arranca la búsqueda (pasa a "conectando")
        this.mostrarBotones(); this.refrescar();
        try { await busqueda; } catch (e) { /* queda sin conexión */ }
        this.intento = null;
        this.mostrarBotones(); this.refrescar();
      })();
      return this.intento;
    };
    this.reintentar = intentar;
    document.addEventListener('visibilitychange', () => { if (!document.hidden) intentar(); });
    for (let i = 0; i < 8 && !this.o.disponible; i++) {
      await intentar();
      if (!this.o.disponible) await new Promise((r) => setTimeout(r, 5000));
    }
  }

  // ---------- panel ----------
  abrir(back) {
    const g = this.g;
    this.cerrar();
    this.back = back || null;
    if (back) back.hidden = true;
    const s = el('div', 'screen menu online-screen', document.body);
    el('h2', '', s, 'Online');
    const pane = el('div', 'pane online-pane', s);
    this.msg = el('div', 'online-msg', pane); this.msg.hidden = true;
    // fuera de una sala
    const fuera = el('div', 'online-fuera', pane);
    const filaNombre = el('label', '', fuera);
    el('span', '', filaNombre, 'Tu nombre en la sala');
    const nom = el('input', '', filaNombre); nom.maxLength = 24; nom.value = this.o.nombre; aislar(nom);
    nom.addEventListener('change', () => { nom.value = this.o.setNombre(nom.value); });
    const o = this.o;
    // salas públicas: la lista con cuánta gente hay, para entrar con un toque
    this.h4Salas = el('h4', '', fuera, o.permitidos.has('pedido') ? 'Salas abiertas' : 'Salas públicas');
    this.lista = el('div', 'online-lista', fuera);
    const resto = el('div', 'online-resto', fuera);
    // crear una sala: un nombre y un botón por cada tipo
    el('h4', '', resto, 'Crear una sala');
    const crear = el('div', 'online-crear', resto);
    const nomSala = el('input', '', crear); nomSala.maxLength = 24; nomSala.placeholder = `Nombre (por ejemplo, Sala de ${o.nombre})`; aislar(nomSala);
    const botonesCrear = [];
    for (const t of ['publica', 'amigos', 'pedido']) {
      if (!o.permitidos.has(t)) continue;
      const b = el('button', 'online-btn online-crear-btn', crear, TIPO_BOTON[t]);
      botonesCrear.push(b);
      b.addEventListener('click', async () => {
        for (const x of botonesCrear) x.disabled = true;
        nom.value = o.setNombre(nom.value);
        const r = await o.crearSala(nomSala.value, t);
        for (const x of botonesCrear) x.disabled = false;
        if (!r.ok) this.mensaje(r.error); else this.alEntrar();
      });
    }
    el('h4', '', resto, 'Entrar a una sala privada con código');
    const cod = el('div', 'online-codigo', resto);
    const inCod = el('input', '', cod); inCod.maxLength = 12; inCod.placeholder = 'Ej.: K7M2QX'; aislar(inCod);
    const bCod = el('button', 'online-btn', cod, 'Entrar');
    bCod.addEventListener('click', async () => {
      const id = idDeCodigo(inCod.value);
      if (!id) { this.mensaje('Ese código no es válido.'); return; }
      bCod.disabled = true;
      nom.value = o.setNombre(nom.value);
      this.mensaje('Buscando la sala...');
      const r = await o.entrar(id);
      bCod.disabled = false;
      if (!r.ok) this.mensaje(r.error); else this.alEntrar();
    });
    el('p', 'online-nota', resto, 'La sala privada te da un código de 6 letras: pasáselo a quien quieras que entre, no aparece en ninguna lista. Se pueden disparar entre ustedes: cada uno se aplica el daño que recibe.');
    // adentro de una sala
    const dentro = el('div', 'online-dentro', pane);
    this.cab = el('div', 'online-cab', dentro);
    this.codigo = el('div', 'online-cod', dentro);
    el('h4', '', dentro, 'Jugadores');
    this.jug = el('div', 'online-jug', dentro);
    this.pendH = el('h4', '', dentro, 'Quieren entrar');
    this.pend = el('div', 'online-pend', dentro);
    const bSalir = el('button', 'online-btn', dentro, 'Salir de la sala');
    bSalir.addEventListener('click', () => this.o.salir());
    // abajo
    const pie = el('div', 'panel', s);
    this.bJugar = el('button', '', pie, 'Jugar');
    this.bJugar.addEventListener('click', () => this.jugar());
    const bVolver = el('button', '', pie, 'Volver');
    bVolver.addEventListener('click', () => this.cerrar());
    this.fuera = fuera; this.dentro = dentro; this.resto = resto;
    this.panel = s;
    this.firma = null;
    try { document.exitPointerLock && document.exitPointerLock(); } catch (e) { /* nada */ }
    this.refrescar();
  }

  cerrar() {
    if (this.panel) { this.panel.remove(); this.panel = null; }
    if (this.back) { this.back.hidden = false; this.back = null; }
  }

  // Al entrar a una sala desde el menú principal, arranca la partida; desde la pausa, sigue el juego
  alEntrar() { this.refrescar(); }
  jugar() {
    const g = this.g, back = this.back;
    this.back = null;
    this.cerrar();
    if (!g.started) { g.menus.mainAction(g.saves.exists() ? 'continue' : 'new'); return; }
    if (back === g.menus.pause) g.menus.resume();
  }

  mensaje(t) { if (this.msg) { this.msg.textContent = t || ''; this.msg.hidden = !t; } }

  refrescar() {
    this.hudRefrescar();
    if (!this.panel) return;
    const o = this.o;
    const enSala = !!o.sala && !o.esperando;
    // solo se rearma si cambió algo que se ve (la sala manda novedades muchas veces por segundo)
    const firma = JSON.stringify([enSala, this.g.started, enSala ? [o.sala, o.jugadores().map((j) => [j.peer, j.nombre, j.guest]), o.anfitrion() && o.anfitrion().peer, o.pendientes(), [...o.silenciados], o.esAnfitrion()] : o.salasAbiertas(), o.disponible, o.estado, o.motivo, o.diag && o.diag.permiso]);
    if (firma === this.firma) return;
    this.firma = firma;
    this.fuera.hidden = enSala;
    this.resto.hidden = !o.disponible;
    this.dentro.hidden = !enSala;
    this.bJugar.textContent = this.g.started ? 'Volver al juego' : enSala ? 'Empezar a jugar' : 'Jugar solo';
    if (!enSala) {
      this.lista.replaceChildren();
      this.h4Salas.hidden = this.lista.hidden = o.disponible && !o.listadas;
      if (!o.disponible) {
        const buscando = o.estado === 'buscando' || o.estado === 'apagado';
        el('p', 'online-vacio', this.lista, buscando ? 'Conectando con el modo online...' : explicacion(o));
        if (!buscando) {
          const permiso = (o.diag || {}).permiso;
          const probar = (accion) => async (ev) => {
            const b = ev.currentTarget;
            b.disabled = true; this.mensaje('Buscando...');
            if (accion) await accion();
            await (this.reintentar ? this.reintentar() : this.o.reconectar());
            this.mensaje(this.o.disponible ? '' : 'Sigue sin conexión.');
            this.refrescar();
          };
          if (hayPermisos() && permiso === 'prompt') el('button', 'online-btn', this.lista, 'Permitir').addEventListener('click', probar(pedirPermiso));
          if (hayPermisos() && permiso === 'denied') el('button', 'online-btn', this.lista, 'Abrir permisos').addEventListener('click', probar(abrirPermisos));
          el('button', 'online-btn', this.lista, 'Reintentar').addEventListener('click', probar(null));
          el('p', 'online-diag', this.lista, 'Dato para ayudar: ' + datoDiag(o));
        }
        return;
      }
      if (!o.listadas) return;
      const salas = o.salasAbiertas();
      if (!salas.length) el('p', 'online-vacio', this.lista, o.permitidos.has('pedido') ? 'No hay salas abiertas. Creá una.' : 'No hay salas públicas abiertas. Creá una abajo.');
      for (const s of salas) {
        const f = el('div', 'online-fila', this.lista);
        el('b', '', f, s.nombre);
        el('span', 'online-tag', f, s.tipo === 'pedido' ? 'Privada (con pedido)' : 'Pública');
        el('span', 'online-num', f, `${s.j}/${s.max}`);
        const libres = s.max - s.j;
        el('span', 'online-cupos', f, libres <= 0 ? 'llena' : libres === 1 ? 'queda 1 lugar' : `quedan ${libres} lugares`);
        const b = el('button', 'online-btn', f, s.tipo === 'pedido' ? 'Pedir entrar' : 'Entrar');
        b.disabled = s.j >= s.max || s.mia;
        b.addEventListener('click', async () => {
          b.disabled = true;
          this.mensaje(s.tipo === 'pedido' ? 'Pediste entrar. Esperá a que el anfitrión te acepte.' : 'Entrando...');
          const r = await o.entrar(s.id);
          b.disabled = false;
          this.mensaje(r.ok ? '' : r.error);
        });
      }
      return;
    }
    const s = o.sala, js = o.jugadores(), host = o.anfitrion();
    this.cab.replaceChildren();
    el('b', '', this.cab, s.nombre);
    el('span', 'online-tag', this.cab, TIPO_TXT[s.tipo]);
    el('span', 'online-num', this.cab, `${js.length}/${s.max}`);
    this.codigo.replaceChildren();
    if (s.tipo === 'amigos') {
      el('span', '', this.codigo, 'Código para tus amigos: ');
      el('b', 'online-code', this.codigo, codigoDe(s.id));
      const c = el('button', 'online-btn', this.codigo, 'Copiar');
      c.addEventListener('click', () => { try { navigator.clipboard.writeText(codigoDe(s.id)); c.textContent = 'Copiado'; } catch (e) { /* sin portapapeles */ } });
    }
    this.jug.replaceChildren();
    const soyHost = o.esAnfitrion();
    for (const j of js) {
      const f = el('div', 'online-fila', this.jug);
      const n = el('b', '', f, j.nombre);
      if (!j.esYo) n.style.color = colorDe(j.peer);
      const tags = [j.esYo ? 'vos' : '', host && host.peer === j.peer ? 'anfitrión' : '', j.guest ? 'invitado' : ''].filter(Boolean).join(' · ');
      if (tags) el('span', 'online-tag', f, tags);
      if (!j.esYo) {
        const m = el('button', 'online-btn', f, o.silenciados.has(j.peer) ? 'Activar chat' : 'Silenciar');
        m.addEventListener('click', () => o.silenciar(j.peer));
        if (soyHost) { const e = el('button', 'online-btn rojo', f, 'Echar'); e.addEventListener('click', () => o.echar(j.peer)); }
      }
    }
    const pend = o.pendientes();
    this.pendH.hidden = !pend.length;
    this.pend.replaceChildren();
    for (const p of pend) {
      const f = el('div', 'online-fila', this.pend);
      el('b', '', f, p.nombre);
      const a = el('button', 'online-btn', f, 'Aceptar'); a.addEventListener('click', () => o.aceptar(p.peer));
      const x = el('button', 'online-btn rojo', f, 'Rechazar'); x.addEventListener('click', () => o.rechazar(p.peer));
    }
  }

  // ---------- HUD: contador, pedidos y chat ----------
  buildHud() {
    const root = this.g.hud.root;
    this.hud = el('div', 'online-hud', root);
    this.hud.hidden = true;
    this.hudTxt = el('span', '', this.hud);
    this.hudPend = el('span', 'online-hud-pend', this.hud);
    this.bChat = el('button', 'online-hud-chat', this.hud, '💬');
    this.bChat.title = 'Chat (T)';
    this.bChat.addEventListener('click', () => this.abrirChat());
    this.log = el('div', 'online-log', root);
    this.lineas = [];
  }

  hudRefrescar() {
    const o = this.o;
    const en = !!o.sala && !o.esperando;
    this.hud.hidden = !en;
    if (!en) { this.log.replaceChildren(); this.lineas = []; return; }
    this.hudTxt.textContent = `🌐 ${o.sala.nombre} · ${o.jugadores().length}/${o.sala.max || MAX_SALA}`;
    const n = o.pendientes().length;
    this.hudPend.textContent = n ? ` · ${n} quiere${n > 1 ? 'n' : ''} entrar (pausa → Online)` : '';
  }

  lineaChat(quien, txt, color) {
    const d = el('div', 'online-linea', this.log);
    const q = el('b', '', d, quien + ': ');
    q.style.color = color || '#9cc0e6';
    el('span', '', d, txt);
    this.lineas.push({ d, t: 12 });
    while (this.lineas.length > 6) this.lineas.shift().d.remove();
  }

  abrirChat() {
    const g = this.g;
    if (this.chatIn || !this.o.sala || this.o.esperando) return;
    const box = el('div', 'online-chatbox', document.body);
    const inp = el('input', '', box); inp.maxLength = 100; inp.placeholder = 'Escribí y apretá Enter'; aislar(inp);
    const lock = g.controlsLocked;
    g.controlsLocked = true;
    g.input.down.clear();
    try { document.exitPointerLock && document.exitPointerLock(); } catch (e) { /* nada */ }
    const cerrar = () => { box.remove(); this.chatIn = null; g.controlsLocked = lock; g.input.pressed.clear(); g.input.down.clear(); };
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); this.red.decir(inp.value); cerrar(); }
      else if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    });
    inp.addEventListener('blur', () => setTimeout(() => { if (this.chatIn === box) cerrar(); }, 100));
    this.chatIn = box;
    setTimeout(() => inp.focus(), 0);
  }

  update(dt) {
    const g = this.g;
    if (this.panel && g.input.was('pause')) { this.cerrar(); g.input.pressed.clear(); return; }
    if (g.started && !g.paused && this.o.sala && !this.o.esperando && !this.chatIn && g.input.pressed.has('KeyT')) this.abrirChat();
    for (const l of this.lineas) { l.t -= dt; l.d.style.opacity = Math.max(0, Math.min(1, l.t / 2)); }
    while (this.lineas.length && this.lineas[0].t <= 0) this.lineas.shift().d.remove();
    this.tRef = (this.tRef || 0) - dt;
    if (this.tRef <= 0) { this.tRef = 0.5; this.refrescar(); }
  }
}
