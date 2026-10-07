'use strict';
// Jugadores remotos: avatares con nombre, chat y emotes, la caña y el bote de los demás, lista de jugadores y el bloque del título.

const MPV = { cont: null, log: null, entrada: null, abierto: false, emoBar: null, lista: null, chip: null, mio: null, listaT: 0 };
const EMOTES = ['👋', '🎣', '🔥', '❤️', '😂', '🆘', '🐟', '👍'];
const _vp = new THREE.Vector3(), _vm = new THREE.Vector3();
const PIELES_MP = [piel.claro, piel.medio, piel.moreno];

// ---------------------------------------------------------------------------
// Avatares
// ---------------------------------------------------------------------------
function crearAvatar(r) {
  const h0 = hashStr(String(r.id) + r.nombre);
  const rig = crearPersona({ camisa: COLORES_CAMISA[r.color] || '#ff8a65', piel: PIELES_MP[h0 % 3], sombrero: SOMBREROS_MP[(h0 >> 3) % SOMBREROS_MP.length], flores: h0 % 2 === 0, bigote: h0 % 3 === 0 ? '#3a2412' : undefined, herramientas: true, canaCol: '#c9a45c', fase: (h0 % 100) / 10 });
  rig.grupo.visible = false;
  ESC.escena.add(rig.grupo);
  r.rig = rig; r.accT = 0; r.rodT = 0; r.tiros = -1; r.lineaCod = 0;
  r.etq = h('div', 'etq-mp', '<span class="emo-mp" hidden></span><span class="bub" hidden></span><b></b><i class="hp"><u></u></i>', MPV.cont);
  $('b', r.etq).textContent = r.nombre;
  r.etq.style.setProperty('--c', COLORES_CAMISA[r.color] || '#fff');
}
function destruirAvatar(r) {
  if (r.rig) {
    ESC.escena.remove(r.rig.grupo);
    r.rig.grupo.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material && o.material !== MAT.vc) o.material.dispose && o.material.dispose(); });
    r.rig = null;
  }
  if (r.etq) { r.etq.remove(); r.etq = null; }
  if (r.tubo) { r.tubo.quitar(); r.tubo = null; }
  if (r.boya) { ESC.escena.remove(r.boya); r.boya.geometry.dispose(); r.boya.material.dispose(); r.boya = null; }
  if (r.boteVis) { ESC.escena.remove(r.boteVis.grupo); r.boteVis = null; }
}
const angLerp = (a, b, k) => a + angDiff(a, b) * k;
// Pose a mostrar: va unos milisegundos atrasada para poder interpolar entre dos muestras reales
function poseInterpolada(r, ahora) {
  const m = r.muestras;
  if (!m.length) return null;
  const tr = ahora - 130;
  const ult = m[m.length - 1];
  if (m.length === 1 || tr <= m[0].t) return m[0];
  if (tr >= ult.t) {
    // sin novedades recientes: sigue un ratito con su velocidad
    const ex = Math.min(0.25, (tr - ult.t) / 1000);
    return Object.assign({}, ult, { x: ult.x + Math.sin(ult.yaw) * ult.vel * ex * (ult.f & 2 ? 1 : 0), z: ult.z + Math.cos(ult.yaw) * ult.vel * ex * (ult.f & 2 ? 1 : 0) });
  }
  for (let i = m.length - 1; i > 0; i--) {
    if (m[i - 1].t <= tr) {
      const a = m[i - 1], b = m[i], k = clamp((tr - a.t) / Math.max(1, b.t - a.t), 0, 1);
      if (Math.hypot(b.x - a.x, b.z - a.z) > 25) return b; // se teletransportó
      return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), z: lerp(a.z, b.z, k), yaw: angLerp(a.yaw, b.yaw, k), vel: lerp(a.vel, b.vel, k), f: b.f, tool: b.tool, bote: b.bote, hp: b.hp };
    }
  }
  return ult;
}

function actualizarRemotos(dt) {
  if (!MPV.cont) return;
  const ahora = performance.now();
  for (const r of RED.remotos.values()) {
    if (!r.rig) crearAvatar(r);
    else if (r.etq && r.etq.firstChild && $('b', r.etq).textContent !== r.nombre) $('b', r.etq).textContent = r.nombre;
    const q = poseInterpolada(r, ahora);
    const rig = r.rig, g = rig.grupo;
    if (!q) { g.visible = false; ocultarEtq(r); continue; }
    const d = Math.hypot(q.x - P.pos.x, q.z - P.pos.z);
    const ver = d < 460 && J.modo === 'jugando';
    g.visible = ver;
    if (!ver) { ocultarEtq(r); quitarLineaBote(r); continue; }
    // bote
    const bt = r.p && Array.isArray(r.p.bt) ? r.p.bt : null;
    let yBote = null;
    if (bt && Number.isFinite(bt[1]) && Number.isFinite(bt[2]) && BOTES_ID[bt[0]]) {
      if (!r.boteVis || r.boteVis.def.id !== BOTES_ID[bt[0]]) {
        if (r.boteVis) ESC.escena.remove(r.boteVis.grupo);
        r.boteVis = armarBote(BOTES.find((x) => x.id === BOTES_ID[bt[0]]));
        r.boteVis.x = bt[1]; r.boteVis.z = bt[2]; r.boteVis.ang = bt[3]; ESC.escena.add(r.boteVis.grupo);
      }
      const B = r.boteVis, k = Math.min(1, dt * 7);
      B.x += (bt[1] - B.x) * k; B.z += (bt[2] - B.z) * k; B.ang = angLerp(B.ang, finito(bt[3]), k); B.vel = finito(bt[4]);
      B.grupo.visible = Math.hypot(B.x - P.pos.x, B.z - P.pos.z) < 460;
      orientarBote(B, dt);
      animarBote(B, dt);
      if (bt[5] && q.bote) yBote = B.y + B.dm.piso;
    } else if (r.boteVis) { ESC.escena.remove(r.boteVis.grupo); r.boteVis = null; }
    // cuerpo
    const caido = (q.f & 16) !== 0, rodando = (q.f & 1) !== 0;
    r.rodT = rodando ? r.rodT + dt : 0;
    let y = yBote !== null ? yBote : Math.max(q.y, alturaPiso(q.x, q.z));
    if (yBote !== null && r.boteVis) { q.x = r.boteVis.x + Math.sin(r.boteVis.ang) * r.boteVis.dm.pie; q.z = r.boteVis.z + Math.cos(r.boteVis.ang) * r.boteVis.dm.pie; }
    g.position.set(q.x, y + (rodando ? -0.2 : 0) + (caido ? 0.25 : 0), q.z);
    g.rotation.y = q.yaw;
    g.rotation.x = caido ? -Math.PI / 2 : rodando ? -Math.min(1, r.rodT / 0.42) * TAU : 0;
    const herr = HERR_DE_CODIGO[q.tool] || 'cana';
    mostrarHerramienta(rig, herr);
    const pa = r.p && Array.isArray(r.p.a) ? r.p.a : null;
    if (herr === 'arma' && pa && ARMAS[pa[0]]) {
      mostrarArma(rig, ARMAS[pa[0]].id);
      if (r.tiros >= 0 && pa[1] > r.tiros) fogonazoRemoto(r, ARMAS[pa[0]], d);
      r.tiros = pa[1];
    } else r.tiros = pa ? pa[1] : -1;
    // lanzar la caña: el brazo hace el gesto cuando la línea sale
    const l = r.p && Array.isArray(r.p.l) ? r.p.l : null;
    const cod = l ? l[0] : 0;
    if (cod === 1 && r.lineaCod !== 1) r.accT = 1;
    r.lineaCod = cod;
    if (r.accT > 0) r.accT = Math.max(0, r.accT - dt * 2.2);
    const peleando = cod === 5;
    animarPersona(rig, dt, yBote !== null ? 0 : q.vel, { herr: true, acc: r.accT > 0 ? Math.sin((1 - r.accT) * Math.PI) : 0, alza: herr === 'arma' ? 0.92 : peleando ? 0.62 : herr === 'cana' ? 0.5 : 0.38, brazoIzq: herr === 'arma' ? -1.15 : undefined, comiendo: (q.f & 4) !== 0 });
    if (rig.tramos) rig.tramos.forEach((t, i) => { t.rotation.x = (peleando ? 0.5 : 0) * (0.4 + i * 0.3) * (peleando ? 1 : 0.4); });
    // la línea y la boya
    if (l && herr === 'cana' && Number.isFinite(l[1]) && Number.isFinite(l[2])) lineaRemota(r, l, dt); else quitarLineaBote(r);
    etiquetar(r, q, d);
  }
  // lo mío: burbuja y emote sobre mi cabeza
  actualizarMiBurbuja();
  actualizarChipRed();
}
function quitarLineaBote(r) {
  if (r.tubo) r.tubo.m.visible = false;
  if (r.boya) r.boya.visible = false;
}
function lineaRemota(r, l, dt) {
  if (!r.tubo) r.tubo = crearTubo(ESC.escena, '#f2f2f2', 14, 4);
  if (!r.boya) { r.boya = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), new THREE.MeshStandardMaterial({ color: '#ff4a3a', roughness: 0.5 })); ESC.escena.add(r.boya); }
  const x = clamp(l[1], -MUNDO.R * 1.5, MUNDO.R * 1.5), z = clamp(l[2], -MUNDO.R * 1.5, MUNDO.R * 1.5);
  const y = Math.max(alturaOla(x, z, J.t), H(x, z)) + 0.12 + Math.sin(J.t * 3 + r.id.length) * (l[0] === 3 ? 0.1 : 0.03);
  r.boya.position.set(x, y, z);
  r.boya.visible = true;
  r.rig.grupo.updateMatrixWorld(true);
  r.rig.puntaCana.getWorldPosition(_vp);
  r.tubo.m.visible = true;
  r.tubo.poner({ x: _vp.x, y: _vp.y, z: _vp.z }, { x, y, z }, l[0] === 5 ? 0.15 : 0.9, 0.012, null);
}

// ---- Nombre, vida, burbuja de chat y emote sobre la cabeza ----
function ocultarEtq(r) { if (r.etq) r.etq.style.display = 'none'; }
function proyectar(x, y, z) {
  _vm.set(x, y, z).project(ESC.camara);
  if (_vm.z > 1 || _vm.z < -1) return null;
  return { x: (_vm.x * 0.5 + 0.5) * J.w, y: (-_vm.y * 0.5 + 0.5) * J.h };
}
function etiquetar(r, q, d) {
  const e = r.etq;
  if (!e) return;
  const s = proyectar(q.x, q.y + 2.55 + (q.bote ? 0.2 : 0), q.z);
  if (!s || d > 140) { e.style.display = 'none'; return; }
  e.style.display = '';
  e.style.transform = `translate(-50%, -100%) translate(${s.x.toFixed(0)}px, ${s.y.toFixed(0)}px)`;
  e.style.opacity = d > 70 ? clamp(1 - (d - 70) / 70, 0.15, 1) : 1;
  const hp = $('u', e);
  const w = `${clamp(q.hp, 0, 100)}%`;
  if (hp.style.width !== w) hp.style.width = w;
  const bub = $('.bub', e), emo = $('.emo-mp', e);
  const hb = r.burbuja && J.t < r.burbuja.hasta;
  if (hb) { if (bub.textContent !== r.burbuja.texto) bub.textContent = r.burbuja.texto; }
  if (bub.hidden === hb) bub.hidden = !hb;
  const he = r.emote && J.t < r.emote.hasta;
  if (he) { const t = EMOTES[r.emote.cod] || '👋'; if (emo.textContent !== t) emo.textContent = t; }
  if (emo.hidden === he) emo.hidden = !he;
}
function fogonazoRemoto(r, arma, d) {
  const rig = r.rig, a = rig.armas && rig.armas[arma.id];
  if (!a) return;
  rig.grupo.updateMatrixWorld(true);
  a.boca.getWorldPosition(_vp);
  chispas(_vp.x, _vp.y, _vp.z, '#ffd27a', arma.perdigones > 1 ? 6 : 3, 4);
  r.accT = 0.7;
  if (d < 70) sfx(arma.id === 'subfusil' ? 'rafaga' : arma.id);
}

// ---- Mi propia burbuja y emote ----
function mostrarEmoteLocal(cod) { MPV.mio = MPV.mio || {}; MPV.mio.emote = { cod, hasta: J.t + 3.2 }; }
function actualizarMiBurbuja() {
  const M = MPV.mio;
  if (!M) return;
  if (!M.etq) M.etq = h('div', 'etq-mp mio', '<span class="emo-mp" hidden></span><span class="bub" hidden></span>', MPV.cont);
  const e = M.etq, s = proyectar(P.pos.x, P.pos.y + 2.55, P.pos.z);
  const hb = M.burbuja && J.t < M.burbuja.hasta, he = M.emote && J.t < M.emote.hasta;
  if (!s || (!hb && !he)) { e.style.display = 'none'; return; }
  e.style.display = '';
  e.style.transform = `translate(-50%, -100%) translate(${s.x.toFixed(0)}px, ${s.y.toFixed(0)}px)`;
  const bub = $('.bub', e), emo = $('.emo-mp', e);
  if (hb && bub.textContent !== M.burbuja.texto) bub.textContent = M.burbuja.texto;
  if (bub.hidden === hb) bub.hidden = !hb;
  if (he) { const t = EMOTES[M.emote.cod] || '👋'; if (emo.textContent !== t) emo.textContent = t; }
  if (emo.hidden === he) emo.hidden = !he;
}

// ---------------------------------------------------------------------------
// Chat
// ---------------------------------------------------------------------------
function chatNuevo(m) {
  if (!MPV.log) return;
  const col = m.propio ? COLORES_CAMISA[RED.cfg.color] : (RED.remotos.get(m.id) ? COLORES_CAMISA[RED.remotos.get(m.id).color] : '#ffe39a');
  const li = h('div', 'chat-li', '<b></b><span></span>', MPV.log);
  $('b', li).textContent = m.nombre + ': ';
  $('b', li).style.color = col;
  $('span', li).textContent = m.texto;
  while (MPV.log.children.length > 12) MPV.log.firstChild.remove();
  setTimeout(() => li.classList.add('viejo'), 11000);
  if (m.propio) { MPV.mio = MPV.mio || {}; MPV.mio.burbuja = { texto: m.texto, hasta: J.t + 6 }; }
}
function abrirChat() {
  if (!RED.activa || J.panel || J.modo !== 'jugando' || MPV.abierto) return;
  MPV.abierto = true;
  IN.soltando = true; soltarLock(); setTimeout(() => { IN.soltando = false; }, 300);
  MPV.entrada.hidden = false;
  MPV.log.classList.add('abierto');
  const inp = $('input', MPV.entrada);
  inp.value = '';
  setTimeout(() => inp.focus(), 30);
}
function cerrarChat(enviar) {
  if (!MPV.abierto) return;
  const inp = $('input', MPV.entrada);
  if (enviar && inp.value.trim()) enviarChat(inp.value);
  inp.blur();
  MPV.abierto = false;
  MPV.entrada.hidden = true;
  MPV.log.classList.remove('abierto');
  IN.teclas.clear();
  setTimeout(() => { if (J.modo === 'jugando' && !J.panel) pedirLock(); }, 80);
}
function alternarEmotes() {
  if (!RED.activa) return;
  MPV.emoBar.hidden = !MPV.emoBar.hidden;
  sfx('click');
}
// ---------------------------------------------------------------------------
// Lista de jugadores y ficha en el HUD
// ---------------------------------------------------------------------------
function renderLista() {
  const L = MPV.lista;
  if (!L) return;
  const filas = [];
  const yo = `<div class="jl-f yo"><i style="background:${COLORES_CAMISA[RED.cfg.color]}"></i><b></b><span>vos${RED.anfitrion && RED.activa ? ' · anfitrión' : ''}</span><em>${Math.round(100 * P.hp / P.hpMax)}%</em></div>`;
  filas.push(yo);
  for (const r of RED.remotos.values()) {
    const d = r.pose ? Math.round(Math.hypot(r.pose.x - P.pos.x, r.pose.z - P.pos.z)) : 0;
    filas.push(`<div class="jl-f"><i style="background:${COLORES_CAMISA[r.color]}"></i><b></b><span>${d} m${String(r.id) === String(RED.hostId) ? ' · anfitrión' : ''}</span><em>${r.pose ? Math.round(r.pose.hp) : 100}%</em></div>`);
  }
  L.innerHTML = `<h4>🌐 En la isla · ${jugadoresEnSala()}</h4>${filas.join('')}<small>${esc(RED.tipo === 'room' ? 'Canal del Artifact' : RED.tipo === 'ws' ? 'Servidor propio' : 'Pestañas de este navegador')}${RED.cfg.sala ? ' · sala ' + esc(RED.cfg.sala) : ''}</small>`;
  const bs = $$('b', L);
  bs[0].textContent = RED.cfg.nombre;
  let i = 1;
  for (const r of RED.remotos.values()) { if (bs[i]) bs[i].textContent = r.nombre; i++; }
}
function actualizarChipRed() {
  const chip = MPV.chip;
  if (!chip) return;
  const on = RED.activa && J.modo === 'jugando';
  if (chip.hidden === on) chip.hidden = !on;
  if (!on) { if (MPV.lista) MPV.lista.hidden = true; return; }
  const n = jugadoresEnSala();
  const t = `${n} ${n === 1 ? 'jugador' : 'jugadores'}`;
  if (chip.dataset.t !== t) { chip.dataset.t = t; $('b', chip).textContent = t; }
  const ver = MPV.listaFija || apretada('Tab');
  if (MPV.lista.hidden === ver) MPV.lista.hidden = !ver;
  if (ver && J.t - MPV.listaT > 0.4) { MPV.listaT = J.t; renderLista(); }
}
function crearUIRed() {
  const hud = $('#hud');
  MPV.cont = h('div', 'mp-cont', '', hud);
  MPV.chip = h('button', 'chip red', '<span>🌐</span><b></b>', $('.hud-izq', hud));
  MPV.chip.hidden = true;
  MPV.chip.addEventListener('click', () => { MPV.listaFija = !MPV.listaFija; MPV.listaT = -9; });
  MPV.lista = h('div', 'jug-lista', '', hud); MPV.lista.hidden = true;
  const chat = h('div', 'chat', '<div class="chat-log"></div><div class="chat-ent" hidden><input type="text" maxlength="120" placeholder="Escribí y apretá Enter…" autocomplete="off"></div>', hud);
  MPV.log = $('.chat-log', chat); MPV.entrada = $('.chat-ent', chat);
  const inp = $('input', chat);
  inp.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); cerrarChat(true); } else if (e.key === 'Escape') { e.preventDefault(); cerrarChat(false); } });
  MPV.emoBar = h('div', 'emo-bar', EMOTES.map((e, i) => `<button data-e="${i}">${e}</button>`).join(''), hud); MPV.emoBar.hidden = true;
  MPV.emoBar.addEventListener('click', (e) => { const b = e.target.closest('[data-e]'); if (b) { enviarEmote(+b.dataset.e); MPV.emoBar.hidden = true; } });
  // botones en la botonera de arriba a la derecha
  const at = $('.atajos', hud);
  const bc = h('button', 'btn-ic btn-red', '💬', at); bc.title = 'Chat (T)'; bc.hidden = true;
  bc.addEventListener('click', () => { sfx('click'); if (MPV.abierto) cerrarChat(false); else abrirChat(); });
  const be = h('button', 'btn-ic btn-red', '😀', at); be.title = 'Emotes (G)'; be.hidden = true;
  be.addEventListener('click', alternarEmotes);
  MPV.botones = [bc, be];
}
function actualizarBotonesRed() { if (MPV.botones) for (const b of MPV.botones) if (b.hidden === RED.activa) b.hidden = !RED.activa; }

// ---------------------------------------------------------------------------
// Bloque del título: nombre, color, sala y "jugar en línea"
// ---------------------------------------------------------------------------
async function armarBloqueRed(t) {
  cargarCfgRed();
  const blq = h('div', 'tit-red', '', $('.tit-caja', t));
  blq.innerHTML = `<h4>🌐 Jugar con amigos</h4>
    <label class="sw"><input type="checkbox" id="rd-on" ${RED.cfg.online ? 'checked' : ''}><i></i><span>Jugar en línea (mundo compartido)</span></label>
    <div class="rd-campos"><input id="rd-nombre" type="text" maxlength="16" placeholder="Tu nombre" value="${esc(RED.cfg.nombre)}" autocomplete="off">
    <input id="rd-sala" type="text" maxlength="16" placeholder="Código de sala (opcional)" value="${esc(RED.cfg.sala)}" autocomplete="off"></div>
    <div class="rd-colores">${COLORES_CAMISA.map((c, i) => `<button class="rd-col ${i === RED.cfg.color ? 'on' : ''}" data-c="${i}" style="background:${c}" title="Color de camisa"></button>`).join('')}</div>
    <p class="rd-est" id="rd-est">Buscando conexión…</p>`;
  const sinEstado = () => { const s = $('#rd-est', blq); return s; };
  const guardar2 = () => { RED.cfg.nombre = nombreSeguro($('#rd-nombre', blq).value) || RED.cfg.nombre; RED.cfg.sala = nombreSeguro($('#rd-sala', blq).value).toLowerCase().replace(/\s+/g, '-'); RED.cfg.online = $('#rd-on', blq).checked; guardarCfgRed(); };
  for (const id of ['#rd-on', '#rd-nombre', '#rd-sala']) $(id, blq).addEventListener('change', guardar2);
  for (const id of ['#rd-nombre', '#rd-sala']) $(id, blq).addEventListener('keydown', (e) => e.stopPropagation());
  blq.addEventListener('click', (e) => { const b = e.target.closest('.rd-col'); if (b) { RED.cfg.color = +b.dataset.c; $$('.rd-col', blq).forEach((x) => x.classList.toggle('on', x === b)); guardarCfgRed(); sfx('click'); } });
  blq.guardar = guardar2;
  const T = await detectarTransportes();
  const est = sinEstado();
  if (!est || !est.isConnected) return;
  est.textContent = T.room ? 'Conectado al canal del Artifact: jugás con quien tenga la página abierta.' : T.ws ? 'Servidor propio detectado: jugás con quien entre a esta dirección.' : T.bc ? 'Sin servidor: solo se ven las pestañas de este navegador.' : 'No hay conexión disponible.';
  est.classList.add(T.room || T.ws ? 'ok' : 'local');
}
