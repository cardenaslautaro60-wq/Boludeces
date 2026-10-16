// Pantalla "Online": nombre, salas abiertas, crear sala (pública, privada con código o privada con
// pedido de entrada), entrar con código y, adentro de una sala, la lista de jugadores. Más el contador
// de la sala y el chat en el HUD. Todo lo que escribió otro jugador se muestra como texto (textContent).
import { MAX_SALA, codigoDe, idDeCodigo } from '../red/sala.js';
import { escapar, colorDe } from '../red/jugadores.js';

const el = (tag, cls, parent, txt) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (txt !== undefined) e.textContent = txt;
  if (parent) parent.appendChild(e);
  return e;
};
const TIPO_TXT = { publica: 'Pública', amigos: 'Privada · solo amigos con código', pedido: 'Privada · piden entrar y el anfitrión acepta' };
// para que escribir en un campo no mueva al personaje ni dispare trucos
const aislar = (inp) => { for (const ev of ['keydown', 'keyup', 'keypress']) inp.addEventListener(ev, (e) => e.stopPropagation()); };

export class OnlineUI {
  constructor(game, online, red) {
    this.g = game; this.o = online; this.red = red;
    this.panel = null;
    this.buildHud();
    online.on('cambio', () => this.refrescar());
    online.on('aviso', (t) => this.mensaje(t));
    online.on('fuera', (t) => { this.mensaje(t); if (this.g.started) this.g.hud.showToast(escapar(t), 3); this.refrescar(); });
    online.on('admitido', (s) => { if (this.g.started) this.g.hud.showToast(`Entraste a <b>${escapar(s.nombre)}</b>`, 3); });
    red.alChat = (quien, txt, color) => this.lineaChat(quien, txt, color);
    red.alAviso = (html) => this.g.hud.showToast(html, 3.5);
  }

  // Los botones "Jugar online" de los menús aparecen solo si esta vista puede conectarse
  mostrarBotones() {
    for (const b of document.querySelectorAll('[data-a=online]')) b.hidden = !this.o.disponible;
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
    el('h4', '', fuera, 'Salas abiertas');
    this.lista = el('div', 'online-lista', fuera);
    el('h4', '', fuera, 'Crear una sala');
    const crear = el('div', 'online-crear', fuera);
    const nomSala = el('input', '', crear); nomSala.maxLength = 24; nomSala.placeholder = `Sala de ${this.o.nombre}`; aislar(nomSala);
    const tipos = el('div', 'online-tipos', crear);
    let tipo = 'publica';
    for (const t of ['publica', 'amigos', 'pedido']) {
      const lab = el('label', 'online-tipo', tipos);
      const r = el('input', '', lab); r.type = 'radio'; r.name = 'online-tipo'; r.value = t; r.checked = t === tipo;
      r.addEventListener('change', () => { if (r.checked) tipo = t; });
      el('span', '', lab, TIPO_TXT[t]);
    }
    const bCrear = el('button', 'online-btn', crear, 'Crear sala');
    bCrear.addEventListener('click', async () => {
      bCrear.disabled = true;
      nom.value = this.o.setNombre(nom.value);
      const r = await this.o.crearSala(nomSala.value, tipo);
      bCrear.disabled = false;
      if (!r.ok) this.mensaje(r.error); else this.alEntrar();
    });
    el('h4', '', fuera, 'Entrar con código');
    const cod = el('div', 'online-codigo', fuera);
    const inCod = el('input', '', cod); inCod.maxLength = 12; inCod.placeholder = 'Ej.: K7M2QX'; aislar(inCod);
    const bCod = el('button', 'online-btn', cod, 'Entrar');
    bCod.addEventListener('click', async () => {
      const id = idDeCodigo(inCod.value);
      if (!id) { this.mensaje('Ese código no es válido.'); return; }
      bCod.disabled = true;
      nom.value = this.o.setNombre(nom.value);
      this.mensaje('Buscando la sala...');
      const r = await this.o.entrar(id);
      bCod.disabled = false;
      if (!r.ok) this.mensaje(r.error); else this.alEntrar();
    });
    el('p', 'online-nota', fuera, 'Solo entran las personas invitadas a esta página con su cuenta. Quien la abre por el link público juega solo. Se pueden disparar entre ustedes: cada uno se aplica el daño que recibe.');
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
    this.fuera = fuera; this.dentro = dentro;
    this.panel = s;
    this.firma = null;
    try { document.exitPointerLock && document.exitPointerLock(); } catch (e) { /* nada */ }
    this.refrescar();
    if (!this.o.disponible) this.mensaje('El modo online no está disponible en esta vista.');
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
    const firma = JSON.stringify([enSala, this.g.started, enSala ? [o.sala, o.jugadores().map((j) => [j.peer, j.nombre, j.guest]), o.anfitrion() && o.anfitrion().peer, o.pendientes(), [...o.silenciados], o.esAnfitrion()] : o.salasAbiertas(), o.disponible]);
    if (firma === this.firma) return;
    this.firma = firma;
    this.fuera.hidden = enSala;
    this.dentro.hidden = !enSala;
    this.bJugar.textContent = this.g.started ? 'Volver al juego' : enSala ? 'Empezar a jugar' : 'Jugar solo';
    if (!enSala) {
      this.lista.replaceChildren();
      const salas = o.salasAbiertas();
      if (!salas.length) el('p', 'online-vacio', this.lista, o.disponible ? 'No hay salas abiertas. Creá una.' : 'Sin conexión.');
      for (const s of salas) {
        const f = el('div', 'online-fila', this.lista);
        el('b', '', f, s.nombre);
        el('span', 'online-tag', f, s.tipo === 'pedido' ? 'Privada (con pedido)' : 'Pública');
        el('span', 'online-num', f, `${s.j}/${s.max}`);
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
