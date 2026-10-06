'use strict';
// Interfaz en pantalla: barras, plata, reloj, minimapa, tensión, jefe, hotbar, avisos y tarjetas de captura.

const HUD = { el: {}, cache: {}, plataMostrada: 0, miniT: 0, miniCv: null };

function crearHUD() {
  const r = $('#hud');
  r.innerHTML = `
  <div class="hud-izq">
    <div class="barra vida"><span class="ic">❤️</span><div class="rell"><div class="fill" id="b-vida"></div><span class="txt" id="t-vida">100</span></div></div>
    <div class="barra ham"><span class="ic">🍗</span><div class="rell"><div class="fill" id="b-ham"></div><span class="txt" id="t-ham">100</span></div></div>
    <div class="chip" id="chip-mochila"><span>🎒</span><b id="t-mochila">0/12</b></div>
    <div class="chip zona" id="chip-zona"><span>📍</span><b id="t-zona"></b></div>
    <div class="chip bote" id="chip-bote" hidden><span>⛵</span><b id="t-bote"></b></div>
    <div class="buffs" id="buffs"></div>
    <div class="mision" id="mision"></div>
  </div>
  <div class="hud-der">
    <div class="plata"><i class="moneda"></i><b id="t-plata">$0</b></div>
    <div class="reloj" id="reloj"></div>
    <canvas id="mini" width="156" height="156"></canvas>
    <div class="atajos">
      <button class="btn-ic" data-ir="mochila" title="Mochila (I)">🎒</button>
      <button class="btn-ic" data-ir="bitacora" title="Bitácora (C)">📖</button>
      <button class="btn-ic" data-ir="pausa" title="Menú (Esc)">⚙️</button>
    </div>
  </div>
  <div class="jefe-barra" id="jefe" hidden><div class="nombre" id="j-nombre"></div><div class="rell"><div class="fill" id="j-fill"></div><div class="fase" id="j-fase"></div></div></div>
  <div id="toasts"></div>
  <div class="tension" id="tension" hidden>
    <div class="t-nombre" id="t-nombre"></div>
    <div class="t-dist"><div class="t-dist-fill" id="t-dist-fill"></div><i class="t-pez" id="t-pez"></i></div>
    <div class="t-barra"><div class="z z-flojo"></div><div class="z z-verde"></div><div class="z z-rojo"></div><i class="t-aguja" id="t-aguja"></i></div>
    <div class="t-pie"><div class="t-cansancio"><div id="t-cans"></div></div><span id="t-aviso">Mantené para recoger</span></div>
  </div>
  <div class="aviso-int" id="aviso-int" hidden></div>
  <div class="hotbar" id="hotbar"></div>
  <div class="touch" id="touch" hidden>
    <button class="t-btn t-grande" id="t-accion">🎣</button>
    <button class="t-btn" id="t-saltar">⤒</button>
    <button class="t-btn" id="t-rodar">↻</button>
    <button class="t-btn" id="t-inter">E</button>
    <button class="t-btn" id="t-arpon">🔱</button>
    <button class="t-btn" id="t-dina">🧨</button>
  </div>
  `;
  HUD.el = {
    vida: $('#b-vida'), tVida: $('#t-vida'), ham: $('#b-ham'), tHam: $('#t-ham'), mochila: $('#t-mochila'), buffs: $('#buffs'), mision: $('#mision'),
    plata: $('#t-plata'), reloj: $('#reloj'), jefe: $('#jefe'), jNombre: $('#j-nombre'), jFill: $('#j-fill'), jFase: $('#j-fase'),
    tension: $('#tension'), tNombre: $('#t-nombre'), tDist: $('#t-dist-fill'), tPez: $('#t-pez'), tAguja: $('#t-aguja'), tCans: $('#t-cans'), tAviso: $('#t-aviso'),
    aviso: $('#aviso-int'), hotbar: $('#hotbar'), toasts: $('#toasts'), zona: $('#t-zona'), chipBote: $('#chip-bote'), tBote: $('#t-bote'), touch: $('#touch'), tAccion: $('#t-accion'),
  };
  HUD.miniCv = $('#mini');
  r.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ir]');
    if (!b) return;
    sfx('click');
    const k = b.dataset.ir;
    if (k === 'mochila') abrirPanel('mochila');
    else if (k === 'bitacora') abrirPanel('bitacora');
    else if (k === 'pausa') abrirPanel('pausa');
  });
  $('#mision').addEventListener('click', () => { HUD.misionPlegada = !HUD.misionPlegada; HUD.cache.mision = null; });
  construirHotbar();
  construirTactil();
}

const SLOTS = [
  { id: 'cana', tecla: '1', icono: '🎣', tipo: 'tool' },
  { id: 'arpon', tecla: '2', icono: '🔱', tipo: 'tool' },
  { id: 'red', tecla: '3', icono: '🕸️', tipo: 'tool' },
  { id: 'dinamita', tecla: '4', icono: '🧨', tipo: 'tool' },
  { id: 'arma', tecla: '5', icono: '🔫', tipo: 'tool' },
  { id: 'comer', tecla: 'F', icono: '🍗', tipo: 'uso' },
  { id: 'curar', tecla: 'H', icono: '🩹', tipo: 'uso' },
  { id: 'carnada', tecla: 'B', icono: '🦐', tipo: 'uso' },
];
function construirHotbar() {
  HUD.el.hotbar.innerHTML = SLOTS.map((s) => `<button class="slot" data-slot="${s.id}" id="slot-${s.id}"><span class="s-ic">${s.icono}</span><span class="s-tecla">${s.tecla}</span><span class="s-n"></span><span class="s-cd"></span></button>`).join('');
  HUD.el.hotbar.addEventListener('pointerdown', (e) => {
    const b = e.target.closest('.slot');
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    const id = b.dataset.slot;
    if (J.panel) return;
    if (id === 'comer') comerMejor();
    else if (id === 'curar') curarMejor();
    else if (id === 'carnada') alternarCarnada();
    else elegirHerramienta(id);
  });
}

// Botones en pantalla (celulares y tablets)
function construirTactil() {
  const pres = (id, on, off) => {
    const el = $(id);
    el.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); IN.tactil = true; el.classList.add('on'); on && on(); try { el.setPointerCapture(e.pointerId); } catch (x) { /* nada */ } });
    const fin = (e) => { e.preventDefault(); el.classList.remove('on'); off && off(); };
    el.addEventListener('pointerup', fin); el.addEventListener('pointercancel', fin);
  };
  pres('#t-accion', () => { IN.accionTactil = true; IN.accionTactilPulso = true; }, () => { IN.accionTactil = false; });
  pres('#t-saltar', () => { IN.saltarTactil = true; });
  pres('#t-rodar', () => { IN.rodarTactil = true; });
  pres('#t-inter', () => { IN.interTactil = true; });
  pres('#t-arpon', () => { elegirHerramienta('arpon'); IN.arponTactil = true; });
  pres('#t-dina', () => { elegirHerramienta('dinamita'); IN.dinaTactil = true; });
  const tac = (typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches) || 'ontouchstart' in window;
  if (tac) IN.tactil = true;
}
function totalItems(lista) { return lista.reduce((n, c) => n + (G.items[c.id] || 0), 0); }

function actualizarHUD(dt) {
  const e = HUD.el, C = HUD.cache;
  if (!e.vida) return;
  const hp = Math.round(P.hp), hpm = Math.round(P.hpMax), ham = Math.round(P.hambre);
  if (C.hp !== hp || C.hpm !== hpm) { C.hp = hp; C.hpm = hpm; e.vida.style.width = (100 * P.hp / P.hpMax) + '%'; e.tVida.textContent = `${hp}/${hpm}`; e.vida.parentElement.parentElement.classList.toggle('bajo', hp < hpm * 0.3); }
  if (C.ham !== ham) { C.ham = ham; e.ham.style.width = P.hambre + '%'; e.tHam.textContent = ham; e.ham.parentElement.parentElement.classList.toggle('bajo', ham < 20); }
  const moch = `${cupoUsado()}/${cupoMax()}`;
  if (C.moch !== moch) { C.moch = moch; e.mochila.textContent = moch; e.mochila.parentElement.classList.toggle('lleno', mochilaLlena()); }
  // plata animada
  const dif = G.plata - HUD.plataMostrada;
  if (Math.abs(dif) > 0.5) { HUD.plataMostrada += dif * Math.min(1, dt * 7) + Math.sign(dif) * 0.5; if (Math.abs(G.plata - HUD.plataMostrada) < 1) HUD.plataMostrada = G.plata; }
  const pm = Math.round(HUD.plataMostrada);
  if (C.plata !== pm) { C.plata = pm; e.plata.textContent = fmtMoney(pm); }
  const hh = fmtClock(J.hora) + ' · Día ' + G.dia;
  const ico = J.luz > 0.5 ? '☀️' : '🌙';
  if (C.reloj !== hh + ico) { C.reloj = hh + ico; e.reloj.textContent = ico + ' ' + hh; }
  // buffs
  const bf = P.buffs.map((b) => `${b.icono || '✨'} ${b.txt} ${Math.ceil(b.hasta - J.t)}s`).join('|');
  if (C.buffs !== bf) {
    C.buffs = bf;
    e.buffs.innerHTML = P.buffs.map((b) => `<span class="buff">${b.icono || '✨'} ${esc(b.txt)}</span>`).join('');
  }
  // misión
  if (typeof textoMision === 'function') {
    const tm = textoMision() + (HUD.misionPlegada ? '#' : '');
    if (C.mision !== tm) {
      C.mision = tm;
      const m = misionActual();
      e.mision.innerHTML = m ? (HUD.misionPlegada ? '<b class="m-tit">📜 Objetivo</b>' : `<b class="m-tit">📜 ${esc(m.titulo)}</b><span class="m-txt">${esc(m.desc)}</span><span class="m-prog">${esc(progresoMision())}</span>`) : '<b class="m-tit">¡Todos los objetivos cumplidos!</b>';
    }
  }
  // jefe
  const bj = jefeEnPantalla();
  if (bj) {
    e.jefe.hidden = false;
    const k = Math.max(0, bj.hp / bj.hpMax);
    if (C.jhp !== k) { C.jhp = k; e.jFill.style.width = (k * 100) + '%'; }
    if (C.jn !== bj.def.id) { C.jn = bj.def.id; e.jNombre.textContent = `${bj.def.nombre} — ${bj.def.apodo}`; }
    const fase = bj.fase > 0 ? `Fase ${bj.fase + 1}` : '';
    if (C.jf !== fase + (bj.aturdido > 0)) { C.jf = fase + (bj.aturdido > 0); e.jFase.textContent = bj.aturdido > 0 ? '¡ATURDIDO! ×2' : fase; e.jFase.classList.toggle('stun', bj.aturdido > 0); }
  } else if (!e.jefe.hidden) { e.jefe.hidden = true; C.jn = null; }
  // tensión
  if (LINEA.estado === 'pelea' && LINEA.pelea) {
    const s = LINEA.pelea;
    e.tension.hidden = false;
    e.tAguja.style.left = (clamp(s.T, 0, 1.2) / 1.2 * 100) + '%';
    e.tAguja.classList.toggle('rojo', s.T > PELEA.peligro);
    const esJefe = s.boss;
    e.tension.classList.toggle('jefe', esJefe);
    if (!esJefe) {
      e.tDist.style.width = (s.prog * 100) + '%';
      e.tPez.style.left = (s.prog * 100) + '%';
      const f = LINEA.pez;
      const nombre = f && s.prog > 0.55 ? `${f.sp.nombre} · ${fmtKg(f.kg)}` : '¿Qué será?';
      if (C.tn !== nombre) { C.tn = nombre; e.tNombre.textContent = nombre; }
    } else { e.tDist.style.width = '0%'; if (C.tn !== 'Jefe') { C.tn = 'Jefe'; e.tNombre.textContent = 'Mantené la tensión en verde para dañarlo'; } e.tPez.style.left = '100%'; }
    e.tCans.style.width = (s.stam * 100) + '%';
    const av = s.modo === 'aviso' ? '¡SOLTÁ! Va a correr' : s.modo === 'corrida' ? 'Corre... aguantá' : s.T > PELEA.peligro ? '¡Aflojá, se corta!' : s.T < 0.3 ? 'Recogé para tensar' : 'Muy bien, seguí así';
    if (C.tav !== av) { C.tav = av; e.tAviso.textContent = av; }
    e.tAviso.classList.toggle('alerta', s.modo === 'aviso' || s.modo === 'corrida' || s.T > PELEA.peligro);
    e.tension.classList.toggle('alerta', s.modo === 'aviso' || s.modo === 'corrida');
  } else e.tension.hidden = true;
  // aviso de interacción
  let av = '';
  if (P.cerca && !J.panel && J.modo === 'jugando') av = `<kbd>E</kbd> ${esc(P.cerca.accion)}`;
  else if (LINEA.estado === 'picada') av = '<b class="pique">¡CLAVÁ!</b>';
  else if (P.tool === 'arma' && P.recarga) av = '<b>↻ Recargando…</b>';
  else if (LINEA.estado === 'libre' && P.tool === 'cana' && G.ajustes.ayuda && G.stats.capturas === 0 && P.mira.agua) av = IN.tactil ? 'Apuntá al agua y tocá el botón para lanzar' : 'Apuntá al agua con la mira y hacé clic para lanzar';
  if (C.av !== av) { C.av = av; e.aviso.innerHTML = av; e.aviso.hidden = !av; }
  // zona y bote
  const zid = zonaDe(distCosta(P.pos.x, P.pos.z));
  const ztxt = P.pos.y > 0.4 && H(P.pos.x, P.pos.z) > 0 ? 'Isla Anzuelo' : ZONA[zid].nombre;
  if (C.zona !== ztxt) { C.zona = ztxt; e.zona.textContent = ztxt; }
  const enBote = P.modo === 'bote' && BOTE.act;
  if (e.chipBote.hidden === enBote) e.chipBote.hidden = !enBote;
  if (enBote) {
    const b = BOTE.act, dc = Math.round(distCosta(b.x, b.z));
    const t2 = `${b.def.nombre} · ${Math.abs(b.vel).toFixed(1)} m/s · costa ${dc}${b.def.maxD < 9999 ? '/' + b.def.maxD : ''} m`;
    if (C.bote !== t2) { C.bote = t2; e.tBote.textContent = t2; }
  }
  const tacil = IN.tactil && J.modo === 'jugando' && !J.panel;
  if (e.touch.hidden === tacil) e.touch.hidden = !tacil;
  if (tacil) {
    const ic = LINEA.estado === 'picada' ? '❗' : LINEA.estado === 'pelea' || LINEA.estado === 'espera' || LINEA.estado === 'mordisqueo' ? '🌀' : P.tool === 'cana' ? '🎣' : P.tool === 'arpon' ? '🔱' : P.tool === 'red' ? '🕸️' : '🧨';
    if (C.ta !== ic) { C.ta = ic; e.tAccion.textContent = ic; }
  }
  // hotbar
  actualizarHotbar();
  HUD.miniT -= dt;
  if (HUD.miniT <= 0) { HUD.miniT = 0.1; dibujarMinimapa(); }
}

function actualizarHotbar() {
  const C = HUD.cache;
  for (const s of SLOTS) {
    const el = $('#slot-' + s.id);
    if (!el) continue;
    let n = '', activo = false, off = false, cd = 0;
    if (s.id === 'cana') { activo = P.tool === 'cana'; }
    else if (s.id === 'arpon') { activo = P.tool === 'arpon'; off = G.arpon < 0; cd = P.cdArpon / (arponActual() ? arponActual().enfr : 1); }
    else if (s.id === 'red') { activo = P.tool === 'red'; off = G.red < 0; cd = P.cdRed / (redActual() ? redActual().enfr : 1); }
    else if (s.id === 'dinamita') { activo = P.tool === 'dinamita'; n = G.items.dinamita || 0; off = n === 0; cd = P.cdDina / 0.5; }
    else if (s.id === 'arma') {
      const a = armaActual();
      const tengo = ARMAS.some((q) => G.armas[q.id]);
      if (el.hidden === tengo) el.hidden = !tengo;
      activo = P.tool === 'arma'; off = !a;
      n = a ? `${cargadorDe(a)}/${reservaDe(a)}` : '';
      cd = P.recarga ? P.recarga.t / P.recarga.dur : 0;
      const ic = $('.s-ic', el), t2 = a ? a.icono : '🔫';
      if (ic.textContent !== t2) ic.textContent = t2;
    }
    else if (s.id === 'comer') { n = totalItems(COMIDAS); off = n === 0; cd = P.cdItem / 0.7; }
    else if (s.id === 'curar') { n = totalItems(CURAS); off = n === 0; cd = P.cdItem / 0.7; }
    else if (s.id === 'carnada') { n = G.items.carnada || 0; off = n === 0; activo = G.carnadaArmada; }
    const key = `${s.id}${activo}${off}${n}${s.id === 'arma' ? (armaActual() ? armaActual().id : '') : ''}`;
    if (C['s' + s.id] !== key) {
      C['s' + s.id] = key;
      el.classList.toggle('activo', activo);
      el.classList.toggle('off', off);
      $('.s-n', el).textContent = n === '' || (s.id !== 'dinamita' && s.id !== 'comer' && s.id !== 'curar' && s.id !== 'carnada' && s.id !== 'arma') ? '' : n;
    }
    const cdEl = $('.s-cd', el);
    const h2 = Math.round(clamp(cd, 0, 1) * 100);
    if (C['c' + s.id] !== h2) { C['c' + s.id] = h2; cdEl.style.height = h2 + '%'; }
  }
}

// ---------------------------------------------------------------------------
// Mapa del mundo (imagen vista desde arriba) y minimapa
// ---------------------------------------------------------------------------
const MAPA = { cv: null, ext: 1400, px: 512 };
const LUGARES_MAPA = [
  { id: 'mercado', ico: '🐟', n: 'Pescadería' }, { id: 'tienda', ico: '🛒', n: 'Almacén' }, { id: 'casino', ico: '🎰', n: 'Casino' },
  { id: 'cabana', ico: '🏠', n: 'Tu cabaña' }, { id: 'faro', ico: '🗼', n: 'Faro' }, { id: 'fogata', ico: '🔥', n: 'Fogata' },
];
function construirMapaBase() {
  if (MAPA.cv || !MAR.tex) return;
  const N = MAR.tex.image.width, data = MAR.tex.image.data, S = MAPA.px;
  const cv = makeCanvas(S, S), g = cv.getContext('2d'), img = g.createImageData(S, S);
  const zid = new Uint8Array(S * S);
  const ZI = { orilla: 0, arrecife: 1, mar: 2, abismo: 3 };
  for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) {
    const x = (i / (S - 1) - 0.5) * MAPA.ext, z = (j / (S - 1) - 0.5) * MAPA.ext;
    zid[j * S + i] = ZI[zonaDe(distCosta(x, z))] || 0;
  }
  const mezcla = (stops, v) => {
    for (let q = 0; q < stops.length - 1; q++) if (v <= stops[q + 1][0]) { const t = (v - stops[q][0]) / (stops[q + 1][0] - stops[q][0]); return [lerp(stops[q][1], stops[q + 1][1], t), lerp(stops[q][2], stops[q + 1][2], t), lerp(stops[q][3], stops[q + 1][3], t)]; }
    const u = stops[stops.length - 1]; return [u[1], u[2], u[3]];
  };
  const AGUA = [[0, 143, 233, 226], [3, 55, 185, 217], [9, 27, 124, 194], [20, 18, 82, 160], [40, 11, 58, 130]];
  const TIERRA = [[0, 242, 220, 171], [1.2, 214, 207, 150], [2.2, 128, 190, 90], [6, 90, 160, 70], [9, 150, 150, 140], [20, 205, 205, 200]];
  for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) {
    const ti = Math.min(N - 1, Math.floor(((i + 0.5) / S) * N)), tj = Math.min(N - 1, Math.floor(((j + 0.5) / S) * N));
    const k = (tj * N + ti) * 4, o = (j * S + i) * 4;
    const d = (data[k] / 255) * 40, hh = (data[k + 1] / 255 - 0.5) * 20;
    let c;
    if (hh > 0.05) c = mezcla(TIERRA, hh);
    else {
      c = mezcla(AGUA, d);
      const z0 = zid[j * S + i];
      if ((i < S - 1 && zid[j * S + i + 1] !== z0) || (j < S - 1 && zid[(j + 1) * S + i] !== z0)) c = [c[0] * 0.7 + 255 * 0.3, c[1] * 0.7 + 255 * 0.3, c[2] * 0.7 + 255 * 0.3];
    }
    img.data[o] = c[0]; img.data[o + 1] = c[1]; img.data[o + 2] = c[2]; img.data[o + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  // muelle
  const mp = (x, z) => [(x / MAPA.ext + 0.5) * S, (z / MAPA.ext + 0.5) * S];
  g.strokeStyle = '#b07a44'; g.lineWidth = 2.2; g.beginPath();
  const a = mp(MUELLE.x, MUELLE.z0), b = mp(MUELLE.x, MUELLE.z1);
  g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
  MAPA.cv = cv;
}
// posición en la imagen del mapa (px) de un punto del mundo
const mapaPx = (x, z) => [(x / MAPA.ext + 0.5) * MAPA.px, (z / MAPA.ext + 0.5) * MAPA.px];

// Marcadores comunes: devuelve [{x,z,ico,txt,col,tam}]
function marcadoresMapa() {
  const m = [];
  for (const l of LUGARES_MAPA) { const p = MUN.pois.find((q) => q.id === l.id) || MUN.edificios.find((q) => q.id === l.id); if (p) m.push({ x: p.x, z: p.z, ico: l.ico, txt: l.n, tam: 15, etiqueta: false }); }
  m.push({ x: MUELLE.x, z: MUELLE.z1 + 2, ico: '⚓', txt: 'Muelle', tam: 15, etiqueta: false });
  for (const c of MUN.cofres) if (G.dia !== c.dia) m.push({ x: c.x, z: c.z, ico: '💰', txt: 'Cofre', tam: 12, soloMapa: true });
  for (const b of BOSSES) {
    const vis = G.jefes[b.def.id] && G.jefes[b.def.id].visto;
    if (b.estado === 'muerto' || b.estado === 'oculto' || (!vis && b.estado !== 'pelea')) continue;
    m.push({ x: b.x, z: b.z, ico: '☠️', txt: b.def.nombre, tam: 17, col: b.def.color, jefe: true, activo: b.estado === 'pelea' });
  }
  for (const b of BOTE.lista) if (G.botes[b.def.id] && BOTE.act !== b) m.push({ x: b.x, z: b.z, ico: '⛵', txt: b.def.nombre, tam: 14 });
  return m;
}

function dibujarMinimapa() {
  const cv = HUD.miniCv;
  if (!cv) return;
  if (!MAPA.cv) construirMapaBase();
  if (!MAPA.cv) return;
  const g = cv.getContext('2d'), W = cv.width, R = W / 2;
  const rango = P.modo === 'bote' ? 260 : 150, s = (R - 4) / rango;
  g.clearRect(0, 0, W, W);
  g.save();
  g.beginPath(); g.arc(R, R, R - 2, 0, TAU); g.clip();
  g.fillStyle = '#0b3a82'; g.fillRect(0, 0, W, W);
  const k = (s * MAPA.ext) / MAPA.px;
  const c = mapaPx(P.pos.x, P.pos.z);
  g.translate(R, R); g.rotate(CAM.yaw); g.scale(k, k); g.translate(-c[0], -c[1]);
  g.imageSmoothingEnabled = true;
  g.drawImage(MAPA.cv, 0, 0);
  g.restore();
  // marcadores (siempre derechos)
  const cs = Math.cos(CAM.yaw), sn = Math.sin(CAM.yaw);
  const aPant = (x, z) => { const dx = x - P.pos.x, dz = z - P.pos.z; return [R + (dx * cs - dz * sn) * s, R + (dx * sn + dz * cs) * s]; };
  g.save();
  g.beginPath(); g.arc(R, R, R - 2, 0, TAU); g.clip();
  g.textAlign = 'center'; g.textBaseline = 'middle';
  for (const m of marcadoresMapa()) {
    const [sx, sy] = aPant(m.x, m.z);
    if (Math.hypot(sx - R, sy - R) > R - 6) continue;
    if (m.jefe) { g.fillStyle = m.col; g.beginPath(); g.arc(sx, sy, m.activo ? 8 + Math.sin(J.t * 8) * 1.5 : 7, 0, TAU); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 1.5; g.stroke(); }
    g.font = `${m.tam - 4}px sans-serif`;
    g.fillText(m.ico, sx, sy + 1);
  }
  if (LINEA.estado !== 'libre' && LINEA.estado !== 'lanzando' && LINEA.estado !== 'recogiendo') {
    const [sx, sy] = aPant(LINEA.x, LINEA.z);
    g.fillStyle = '#ff5a4d'; g.beginPath(); g.arc(sx, sy, 3, 0, TAU); g.fill();
  }
  g.restore();
  // jugador
  const f = { x: -Math.sin(CAM.yaw), z: -Math.cos(CAM.yaw) }, rr = { x: Math.cos(CAM.yaw), z: -Math.sin(CAM.yaw) };
  const px = Math.sin(P.yaw), pz = Math.cos(P.yaw);
  const ang = Math.atan2(px * rr.x + pz * rr.z, px * f.x + pz * f.z);
  g.save();
  g.translate(R, R); g.rotate(ang);
  g.fillStyle = '#ffffff'; g.strokeStyle = '#1b3a5c'; g.lineWidth = 1.6;
  g.beginPath(); g.moveTo(0, -8); g.lineTo(5.5, 5); g.lineTo(0, 2); g.lineTo(-5.5, 5); g.closePath(); g.fill(); g.stroke();
  g.restore();
  g.strokeStyle = 'rgba(255,246,220,.9)'; g.lineWidth = 3;
  g.beginPath(); g.arc(R, R, R - 2, 0, TAU); g.stroke();
  g.fillStyle = '#fff6dc'; g.font = 'bold 11px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('N', R + Math.sin(CAM.yaw) * (R - 11) * -1 * -1, R - Math.cos(CAM.yaw) * (R - 11));
}

// ---------------------------------------------------------------------------
// Avisos y tarjetas
// ---------------------------------------------------------------------------
function toast(txt, col = '#fff6dc') {
  if (!HUD.el.toasts || !txt) return;
  const t = h('div', 'toast', esc(txt), HUD.el.toasts);
  t.style.setProperty('--c', col);
  while (HUD.el.toasts.children.length > 4) HUD.el.toasts.firstChild.remove();
  setTimeout(() => t.classList.add('sale'), 3300);
  setTimeout(() => t.remove(), 3800);
}

function mostrarCaptura(o) {
  const sp = o.sp, rz = RAREZAS[sp.rareza];
  const card = h('div', 'captura r' + sp.rareza + (o.brillo ? ' brillo' : ''), `
    <div class="c-franja" style="--rz:${rz.color}">${o.brillo ? '✨ ¡BRILLANTE! ✨' : rz.nombre.toUpperCase()}</div>
    <img class="c-img" src="${iconoEspecie(sp.id, 120)}" alt="">
    <div class="c-nombre">${esc(sp.nombre)}</div>
    <div class="c-datos"><span>${fmtKg(o.kg)}</span><span class="c-valor">${fmtMoney(o.valor)}</span></div>
    ${o.nuevo ? '<div class="c-tag nuevo">¡Nueva en la bitácora!</div>' : o.record ? '<div class="c-tag rec">¡Récord de peso!</div>' : ''}
    <div class="c-texto">${esc(sp.texto)}</div>`, $('#avisos'));
  const cerrar = () => { card.classList.add('sale'); setTimeout(() => card.remove(), 350); };
  card.addEventListener('pointerdown', cerrar);
  setTimeout(cerrar, sp.rareza >= 3 ? 3600 : 2400);
  while ($('#avisos').children.length > 2) $('#avisos').firstChild.remove();
}
function mostrarHallazgo(o) {
  const card = h('div', 'captura hallazgo' + (o.oro ? ' r4' : ''), `
    <div class="c-franja" style="--rz:${o.oro ? '#ffc63d' : '#9bb0c4'}">${o.oro ? '¡TESORO!' : 'HALLAZGO'}</div>
    <img class="c-img" src="${iconoEspecie(o.icono, 110)}" alt="">
    <div class="c-nombre">${esc(o.titulo)}</div>
    <div class="c-datos"><span class="c-valor">+${fmtMoney(o.plata)}</span></div>
    <div class="c-texto">${esc(o.texto)}</div>`, $('#avisos'));
  const cerrar = () => { card.classList.add('sale'); setTimeout(() => card.remove(), 350); };
  card.addEventListener('pointerdown', cerrar);
  setTimeout(cerrar, o.texto.length > 70 ? 5200 : 3000);
  while ($('#avisos').children.length > 2) $('#avisos').firstChild.remove();
}

function mostrarDesmayo() {
  const v = h('div', 'desmayo', `<div class="d-caja"><h2>Te desmayaste...</h2><p>Doña Rosa te encontró tirado en la playa y te llevó a la cabaña. Te va a cobrar el favor.</p><button class="btn gold" id="d-ok">Despertar</button></div>`, $('#app'));
  $('#d-ok', v).addEventListener('click', () => {
    const cobro = despertar();
    v.remove();
    toast(cobro > 0 ? `Doña Rosa te cobró ${fmtMoney(cobro)} por el rescate.` : 'Despertaste en la cabaña.', '#ffe39a');
  });
}

function bannerJefe(d) {
  const v = h('div', 'banner-jefe', `<b>${esc(d.nombre)}</b><span>${esc(d.apodo)}</span><em>${esc(d.consejo)}</em>`, $('#app'));
  setTimeout(() => v.classList.add('sale'), 3000);
  setTimeout(() => v.remove(), 3500);
}
