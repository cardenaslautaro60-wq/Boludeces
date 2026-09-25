import { WORLD, POI } from '../world/mapdata.js';
import { clamp, formatMoney } from '../util.js';
import { mediaErrorText } from '../media/media.js';

const h = (tag, cls, parent, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  if (parent) parent.appendChild(e);
  return e;
};

const TIPS = [
  'En Comodoro el viento sopla del Oeste. Las motos y los colectivos lo sienten más.',
  'Escribí HESOYAM durante el juego si andás corto de salud y de guita.',
  'Comer en El Chori del Viento te cura, pero engorda al Gordopin.',
  'En la Chapa y Pintura de Don Tito te pintan el auto y la cana se olvida de vos.',
  'Apretá TAB para cambiar entre el Gordopin y el Petroca.',
  'Hay 24 bolsitas de La Anómala enganchadas en los alambrados. Juntalas todas.',
  'Subite a un remís y apretá 2 para laburar de remisero.',
  'En el semáforo de San Martín y Rivadavia el Gordopin hace malabares por monedas.',
  'La Madriguera es la cancha de Newbery. En 2004 todavía era de tierra.',
  'Cuidado con los derrumbes del Chenque. Bah, en el juego no hay. Todavía.',
];

export class Menus {
  constructor(game) {
    this.game = game;
    this.attract = false;
    this.buildMain();
    this.buildPause();
    this.buildMap();
    this.choiceEl = null;
  }

  // ---------- Pantalla principal ----------
  buildMain() {
    const g = this.game;
    const s = h('div', 'screen menu mainmenu', document.body);
    s.hidden = true;
    s.innerHTML = `
      <div class="logo"><span class="gta">GTA</span><span class="sj">San Jorge</span><span class="tag">Comodoro Rivadavia · 2004</span></div>
      <div class="panel">
        <button data-a="continue">Continuar</button>
        <button data-a="new">Nueva partida</button>
        <button data-a="options">Opciones</button>
        <button data-a="media">Intro y música</button>
        <button data-a="controls">Controles</button>
        <button data-a="credits">Créditos</button>
      </div>
      <div class="hint">Protagonizado por el Gordopin y el Petroca · Un juego de fans, hecho con cariño y viento</div>`;
    s.style.background = 'linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.7))';
    s.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => this.mainAction(b.dataset.a)));
    this.main = s;
  }

  // Pantalla "apretá cualquier tecla" (también desbloquea el sonido del navegador)
  showStart() {
    const g = this.game;
    this.attract = true;
    const s = h('div', 'screen menu startscreen', document.body);
    s.style.background = 'linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.75))';
    const touch = g.touch && g.touch.enabled;
    s.innerHTML = `<div class="logo"><span class="gta">GTA</span><span class="sj">San Jorge</span><span class="tag">Comodoro Rivadavia · 2004</span></div>
      <div class="press">${touch ? 'TOCÁ LA PANTALLA' : 'APRETÁ CUALQUIER TECLA'}</div>`;
    const go = (e) => {
      if (e) e.preventDefault();
      window.removeEventListener('keydown', go, true);
      s.removeEventListener('pointerdown', go);
      s.remove();
      g.audio.init();
      const intro = g.media.intro();
      if (intro) this.playIntro(intro.url, () => this.showMain());
      else this.showMain();
    };
    window.addEventListener('keydown', go, true);
    s.addEventListener('pointerdown', go);
  }

  // Video de intro con audio, se puede saltear
  playIntro(url, done) {
    const g = this.game;
    const w = h('div', 'intro-video', document.body);
    w.innerHTML = '<video playsinline preload="auto"></video><button class="skip">Saltar ▸</button>';
    const v = w.querySelector('video');
    let finished = false;
    const end = () => {
      if (finished) return;
      finished = true;
      window.removeEventListener('keydown', key, true);
      try { v.pause(); } catch (e) { /* nada */ }
      w.remove();
      done();
    };
    const key = (e) => { if (['Escape', 'Enter', 'Space'].includes(e.code)) { e.preventDefault(); end(); } };
    window.addEventListener('keydown', key, true);
    w.querySelector('.skip').addEventListener('click', end);
    v.addEventListener('ended', end);
    v.addEventListener('error', end);
    v.volume = clamp(g.settings.sfx + 0.2, 0.2, 1);
    v.src = url;
    const p = v.play();
    if (p && p.catch) p.catch(() => { v.muted = true; v.play().catch(end); });
  }

  showMain() {
    const g = this.game;
    this.main.hidden = false;
    this.attract = true;
    g.paused = true;
    const cont = this.main.querySelector('[data-a=continue]');
    cont.hidden = !g.saves.exists();
    g.hud.show(false);
    setTimeout(() => { const b = this.main.querySelector('button:not([hidden])'); b && b.focus(); }, 50);
  }

  async mainAction(a) {
    const g = this.game;
    g.audio.init();
    if (a === 'new' || a === 'continue') {
      if (a === 'new' && g.saves.exists()) {
        const r = await this.choice('¿Empezar de nuevo?', ['Sí, nueva partida', 'No'], 'Tu partida guardada se va a mantener hasta que guardes de nuevo.');
        if (r !== 0) return;
      }
      this.main.hidden = true;
      this.attract = false;
      g.hud.show(true);
      g.input.wantLock = true;
      g.started = true;
      g.paused = false;
      if (a === 'continue') {
        g.saves.load();
        g.hud.showToast('Partida cargada', 2);
        g.cameraRig.snapBehind(Math.PI / 2);
      } else {
        g.missions.startIntro();
      }
      return;
    }
    if (a === 'options') this.openPane('options', this.main);
    if (a === 'media') this.openPane('media', this.main);
    if (a === 'controls') this.openPane('controls', this.main);
    if (a === 'credits') this.openPane('credits', this.main);
  }

  // ---------- Pausa ----------
  buildPause() {
    const s = h('div', 'screen menu pause', document.body);
    s.hidden = true;
    s.innerHTML = `<h2>Pausa</h2><div class="panel">
      <button data-a="resume">Seguir jugando</button>
      <button data-a="map">Mapa</button>
      <button data-a="stats">Estadísticas</button>
      <button data-a="brief">Última misión</button>
      <button data-a="options">Opciones</button>
      <button data-a="media">Intro y música</button>
      <button data-a="controls">Controles</button>
      <button data-a="quit">Salir al menú</button></div>
      <div class="hint">Para guardar, andá a la Casa de la Abuela (marcador verde).</div>`;
    s.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => this.pauseAction(b.dataset.a)));
    this.pause = s;
  }

  openPauseMenu() {
    const g = this.game;
    if (!g.started || g.respawning) return;
    g.paused = true;
    this.pause.hidden = false;
    this.pauseOpenedAt = g.time;
    g.input.pressed.clear();
    g.audio.stopRadio();
    try { document.exitPointerLock && document.exitPointerLock(); } catch (e) { /* nada */ }
    setTimeout(() => this.pause.querySelector('button').focus(), 30);
  }

  resume() {
    const g = this.game;
    this.pause.hidden = true;
    this.mapEl.hidden = true;
    g.paused = false;
    const v = g.player.vehicle;
    if (v && !v.type.bike) g.audio.startRadio(v.radio);
    g.last = performance.now();
  }

  async pauseAction(a) {
    const g = this.game;
    if (a === 'resume') this.resume();
    if (a === 'map') this.openMap();
    if (a === 'stats') this.openPane('stats', this.pause);
    if (a === 'brief') this.openPane('brief', this.pause);
    if (a === 'options') this.openPane('options', this.pause);
    if (a === 'media') this.openPane('media', this.pause);
    if (a === 'controls') this.openPane('controls', this.pause);
    if (a === 'quit') {
      const r = await this.choice('¿Salir al menú principal?', ['Sí', 'No'], 'Lo que no guardaste en la Casa de la Abuela se pierde.');
      if (r === 0) location.reload();
    }
  }

  checkInGameKeys() {
    const g = this.game;
    const inp = g.input;
    if (this.choiceEl || g.activities.mini) return;
    if (inp.was('pause')) this.openPauseMenu();
    else if (inp.was('map')) { this.openPauseMenu(); this.openMap(); }
  }

  update(dt) {
    const g = this.game;
    const inp = g.input;
    // navegación del menú con teclado en pausa
    if (!this.mapEl.hidden) {
      if (inp.was('pause') || inp.was('map')) {
        this.mapEl.hidden = true;
        if (this.mapFromGame) this.resume(); else this.pause.hidden = false;
        inp.pressed.clear();
      }
      this.drawMap();
    }
    if (this.paneEl && inp.was('pause')) { this.closePane(); inp.pressed.clear(); }
    if (!this.pause.hidden && this.mapEl.hidden && !this.paneEl && !this.choiceEl && inp.was('pause')) this.resume();
  }

  // ---------- Paneles ----------
  openPane(kind, back) {
    const g = this.game;
    this.closePane();
    if (back) { back.hidden = true; }
    const s = h('div', 'screen menu', document.body);
    let html = '';
    if (kind === 'controls') {
      html = `<h2>Controles</h2><div class="pane"><table>
        <tr><td>Moverse / Manejar</td><td><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> o flechas</td></tr>
        <tr><td>Cámara</td><td>Mouse (hacé clic para capturarlo)</td></tr>
        <tr><td>Correr / Freno de mano</td><td><kbd>Espacio</kbd></td></tr>
        <tr><td>Saltar / Saltito en bici</td><td><kbd>Shift</kbd></td></tr>
        <tr><td>Caminar despacio</td><td><kbd>C</kbd></td></tr>
        <tr><td>Subir / bajar del auto</td><td><kbd>F</kbd> o <kbd>Enter</kbd></td></tr>
        <tr><td>Golpear / disparar</td><td>Clic izquierdo o <kbd>Ctrl</kbd></td></tr>
        <tr><td>Apuntar</td><td>Clic derecho</td></tr>
        <tr><td>Cambiar arma</td><td><kbd>Q</kbd> <kbd>E</kbd> o ruedita</td></tr>
        <tr><td>Bocina / sirena</td><td><kbd>H</kbd></td></tr>
        <tr><td>Cambiar radio</td><td><kbd>R</kbd> o ruedita (manejando)</td></tr>
        <tr><td>Cambiar de personaje</td><td><kbd>TAB</kbd> (Gordopin ⇄ Petroca)</td></tr>
        <tr><td>Trabajo de remisero</td><td><kbd>2</kbd> arriba de un remís</td></tr>
        <tr><td>Mirar atrás</td><td><kbd>X</kbd></td></tr>
        <tr><td>Cámara cerca/lejos</td><td><kbd>V</kbd></td></tr>
        <tr><td>Pausa y mapa</td><td><kbd>Esc</kbd></td></tr>
        <tr><td>Joystick</td><td>Stick izq. moverse · stick der. cámara · RT/LT acelerar/frenar · A correr · X saltar · Y subir</td></tr>
        <tr><td>Celular</td><td>Joystick en pantalla, botones a la derecha y deslizá para girar la cámara</td></tr>
        </table></div>`;
    } else if (kind === 'options') {
      const st = g.settings;
      html = `<h2>Opciones</h2><div class="pane">
        <label>Filtro PS2 (estela y colores de época) <input type="checkbox" id="o-ps2" ${st.ps2 ? 'checked' : ''}></label>
        <label>Sombras del sol <input type="checkbox" id="o-sh" ${st.shadows ? 'checked' : ''}></label>
        <label>Calidad de imagen <select id="o-q"><option value="0.6">Baja</option><option value="0.8">Media</option><option value="1">Alta</option></select></label>
        <label>Volumen de la radio <input type="range" id="o-music" min="0" max="1" step="0.05" value="${st.music}"></label>
        <label>Volumen de efectos <input type="range" id="o-sfx" min="0" max="1" step="0.05" value="${st.sfx}"></label>
        <label>Sensibilidad del mouse <input type="range" id="o-sens" min="0.3" max="2.5" step="0.1" value="${st.sens}"></label>
        <label>Invertir eje vertical <input type="checkbox" id="o-inv" ${st.invertY ? 'checked' : ''}></label>
        <label>Voces sintetizadas (radio y diálogos) <input type="checkbox" id="o-tts" ${st.tts ? 'checked' : ''}></label>
        <label>Controles táctiles <select id="o-touch"><option value="auto">Automático</option><option value="on">Siempre</option><option value="off">Nunca</option></select></label>
      </div>`;
    } else if (kind === 'stats') {
      const S = g.stats;
      const row = (k, v) => `<tr><td>${k}</td><td class="num">${v}</td></tr>`;
      const mins = Math.floor(S.timePlayed / 60);
      html = `<h2>Estadísticas</h2><div class="pane"><table>
        ${row('Misiones superadas', `${g.missions.done.length} de ${g.missions.list.length}`)}
        ${row('Plata', formatMoney(g.money))}
        ${row('Grasa (Gordopin)', S.fat.toFixed(0) + '%')}
        ${row('Músculo', S.muscle.toFixed(0) + '%')}
        ${row('Resistencia', S.stamina.toFixed(0) + '%')}
        ${row('Respeto en el barrio', S.respect.toFixed(0) + '%')}
        ${row('Autos afanados', S.carsStolen)}
        ${row('Gente eliminada', S.pedsKilled)}
        ${row('Veces que te hicieron bolsa', S.deaths)}
        ${row('Veces que caíste en cana', S.arrests)}
        ${row('Bolsitas de La Anómala', `${S.bags} de 24`)}
        ${row('Saltos únicos', `${S.jumps} de 6`)}
        ${row('Viajes de remís', S.fares)}
        ${row('Mejor sesión de malabares', '$' + S.juggleBest)}
        ${row('Plata ganada en total', formatMoney(S.cashEarned))}
        ${row('Tiempo jugado', `${Math.floor(mins / 60)} h ${mins % 60} min`)}
        </table></div>`;
    } else if (kind === 'brief') {
      const m = g.missions;
      html = `<h2>Última misión</h2><div class="pane">${m.lastBrief || 'Todavía no arrancaste ninguna misión.'}<br><br><b>Próxima:</b> ${m.nextHint()}</div>`;
    } else if (kind === 'media') {
      html = `<h2>Intro y música</h2><div class="pane mediapane">
        <h4>Video de intro</h4>
        <p class="note">Se reproduce con audio cada vez que se abre el juego. Subí el video (MP4 o WebM, hasta 20 MB): por ejemplo, el de "GTA Comodoro Rivadavia".</p>
        <div class="mrow"><span class="mname" id="m-intro">—</span>
          <button class="mbtn" id="m-intro-play">Ver</button><button class="mbtn" id="m-intro-del">Quitar</button>
          <label class="mbtn up" id="m-intro-up">Subir video<input type="file" id="m-intro-file" accept="video/mp4,video/webm,video/*" hidden></label></div>
        <h4>Novishok — música de persecución</h4>
        <p class="note">Suenan cuando la cana te persigue con 4 estrellas o más. Subí los temas (M4A, MP4 o WebM; los MP3 también suelen andar). Mientras no haya temas, suena un thrash generado por el juego.</p>
        <ol class="msongs" id="m-songs"></ol>
        <div class="mrow"><label class="mbtn up" id="m-song-up">Agregar temas<input type="file" id="m-song-file" accept="audio/*,video/mp4,video/webm" multiple hidden></label></div>
        <p class="mstatus" id="m-status" role="status"></p>
      </div>`;
    } else if (kind === 'credits') {
      html = `<h2>Créditos</h2><div class="pane">
        <p><b>GTA: San Jorge</b> es un juego de fans, gratuito, inspirado en <i>Grand Theft Auto: San Andreas</i> (Rockstar Games, 2004). No está afiliado ni respaldado por Rockstar.</p>
        <p>El mapa es una versión libre y comprimida de <b>Comodoro Rivadavia</b>: el Cerro Chenque, el Centro, la Costanera, el Puerto, el Km 3, los barrios, Rada Tilly, Punta del Marqués y la meseta con sus cigüeñas.</p>
        <p><b>El Gordopin</b>: malabarista de semáforo e hincha del Lobo (Club Atlético Jorge Newbery). "A mí no me van a sacar nunca de la calle".</p>
        <p><b>El Petroca</b>: petrolero con guita, anteojos negros, camisa de jean y botas. "¡Buena petroca!"</p>
        <p><b>La radio</b>: homenaje a <b>La Ciudad Perdida</b> (1992–2016), el programa creado y conducido por <b>Santiago Sánchez</b> en la radio de Comodoro. Los textos que dice en el juego son ficción escrita en homenaje, en el espíritu del programa: humor para mirar la realidad desde otro lado. "Yo sé de qué me río".</p>
        <p><b>Persecuciones</b>: con 4 estrellas suena <b>Novishok</b>, thrash groove comodorense (Jony Freyre, Blade Asencio, Julián Caiado y Mauro Vargas), con los temas que se suban en "Intro y música".</p>
        <p>Personajes, empresas y situaciones son ficticios o paródicos. El resto del sonido y la música se generan en tiempo real.</p>
        <p>Hecho con Three.js. Aguante Comodoro.</p></div>`;
    }
    s.innerHTML = html + '<div class="row-btns"><button data-a="back">Volver</button></div>';
    s.querySelector('[data-a=back]').addEventListener('click', () => this.closePane());
    if (kind === 'options') {
      const st = g.settings;
      const q = s.querySelector('#o-q'); q.value = String(st.quality >= 1 ? 1 : st.quality >= 0.8 ? 0.8 : 0.6);
      const t = s.querySelector('#o-touch'); t.value = st.touch;
      const upd = () => {
        st.ps2 = s.querySelector('#o-ps2').checked;
        st.shadows = s.querySelector('#o-sh').checked;
        st.quality = parseFloat(q.value);
        st.music = parseFloat(s.querySelector('#o-music').value);
        st.sfx = parseFloat(s.querySelector('#o-sfx').value);
        st.sens = parseFloat(s.querySelector('#o-sens').value);
        st.invertY = s.querySelector('#o-inv').checked;
        st.tts = s.querySelector('#o-tts').checked;
        st.touch = t.value;
        g.applySettings();
        g.saveSettings();
      };
      s.querySelectorAll('input,select').forEach((e) => e.addEventListener('change', upd));
    }
    if (kind === 'media') this.bindMedia(s);
    this.paneEl = s;
    this.paneBack = back;
    setTimeout(() => s.querySelector('[data-a=back]').focus(), 30);
  }

  bindMedia(s) {
    const g = this.game;
    const M = g.media;
    const $ = (id) => s.querySelector('#' + id);
    const status = (t, bad) => { const e = $('m-status'); e.textContent = t; e.classList.toggle('bad', !!bad); };
    const render = () => {
      if (!s.isConnected) return;
      const intro = M.intro();
      $('m-intro').textContent = intro ? intro.name : 'Sin video (se entra directo al menú)';
      $('m-intro-play').hidden = !intro;
      $('m-intro-del').hidden = !(M.config.intro && M.canUpload());
      const can = M.canUpload();
      $('m-intro-up').hidden = !can;
      $('m-song-up').hidden = !can;
      const ol = $('m-songs');
      ol.innerHTML = '';
      const own = M.config.songs;
      const list = own.length ? own.map((x, i) => ({ title: x.title, i })) : M.songs().map((x) => ({ title: x.title, i: -1 }));
      if (!list.length) ol.innerHTML = '<li class="empty">Todavía no hay temas.</li>';
      for (const it of list) {
        const li = h('li', '', ol);
        h('span', 'mname', li).textContent = it.title;
        if (it.i >= 0 && can) {
          const del = h('button', 'mbtn', li, 'Quitar');
          del.addEventListener('click', async () => {
            status('Quitando...');
            try { await M.removeSong(it.i); status('Listo.'); } catch (e) { status(mediaErrorText(e), true); }
            render();
          });
        }
      }
      if (!can) status(M.mode === 'artifact' ? 'Solo quien edita el juego puede cambiar la intro y la música.' : 'Este navegador no permite guardar archivos.');
    };
    render();
    M.onChange(render);
    $('m-intro-play').addEventListener('click', () => { const i = M.intro(); if (i) this.playIntro(i.url, () => {}); });
    $('m-intro-del').addEventListener('click', async () => {
      status('Quitando el video...');
      try { await M.removeIntro(); status('Listo: ya no hay video de intro.'); } catch (e) { status(mediaErrorText(e), true); }
      render();
    });
    $('m-intro-file').addEventListener('change', async (e) => {
      const f = e.target.files && e.target.files[0];
      e.target.value = '';
      if (!f) return;
      if (f.size > 20 * 1024 * 1024 && M.mode === 'artifact') { status(mediaErrorText({ code: 'too_large' }), true); return; }
      status(`Subiendo "${f.name}"...`);
      try { await M.setIntro(f); status('¡Listo! La próxima vez que abras el juego arranca con este video.'); } catch (err) { status(mediaErrorText(err), true); }
      render();
    });
    $('m-song-file').addEventListener('change', async (e) => {
      const files = [...(e.target.files || [])];
      e.target.value = '';
      let ok = 0;
      for (const f of files) {
        if (f.size > 20 * 1024 * 1024 && M.mode === 'artifact') { status(`"${f.name}": ${mediaErrorText({ code: 'too_large' })}`, true); continue; }
        status(`Subiendo "${f.name}"...`);
        try { await M.addSong(f); ok++; } catch (err) { status(`"${f.name}": ${mediaErrorText(err)}`, true); }
      }
      if (ok) status(`Se agregaron ${ok} tema${ok > 1 ? 's' : ''}. Van a sonar con 4 estrellas.`);
      render();
    });
  }

  closePane() {
    if (this.paneEl) { this.paneEl.remove(); this.paneEl = null; }
    if (this.paneBack) { this.paneBack.hidden = false; this.paneBack = null; }
  }

  // ---------- Diálogo de opciones ----------
  choice(title, options, subtitle = '') {
    const g = this.game;
    return new Promise((resolve) => {
      if (this.choiceEl) this.choiceEl.remove();
      const wasLocked = g.controlsLocked;
      g.controlsLocked = true;
      const s = h('div', 'choice', document.body);
      s.innerHTML = `<h3>${title}</h3>${subtitle ? `<p>${subtitle}</p>` : ''}<div class="opts"></div>`;
      const box = s.querySelector('.opts');
      const done = (i) => {
        window.removeEventListener('keydown', key, true);
        s.remove();
        this.choiceEl = null;
        g.controlsLocked = wasLocked;
        g.input.pressed.clear();
        resolve(i);
      };
      options.forEach((o, i) => {
        const b = h('button', '', box, `<kbd>${i + 1}</kbd> ${o}`);
        b.addEventListener('click', () => done(i));
      });
      const key = (e) => {
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= options.length) { e.preventDefault(); e.stopPropagation(); done(n - 1); }
        else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); done(-1); }
        else if (e.key === 'y' || e.key === 'Y') { if (/^S[íi]/.test(options[0])) done(0); }
        else if (e.key === 'n' || e.key === 'N') { if (options[1] === 'No') done(1); }
      };
      window.addEventListener('keydown', key, true);
      this.choiceEl = s;
      try { document.exitPointerLock && document.exitPointerLock(); } catch (e) { /* nada */ }
      setTimeout(() => { const b = s.querySelector('button'); b && b.focus(); }, 30);
    });
  }

  // ---------- Mapa ----------
  buildMap() {
    const m = h('div', 'mapview', document.body);
    m.hidden = true;
    m.innerHTML = '<canvas></canvas><div class="maptitle">San Jorge</div><div class="legend"></div><div class="maphint">Arrastrá para mover · ruedita o pellizco para zoom · tocá/clic para marcar destino · Esc para volver</div>';
    this.mapEl = m;
    this.mapCanvas = m.querySelector('canvas');
    this.mapView = { cx: 0, cz: 0, zoom: 0.35 };
    let drag = null, moved = false;
    const c = this.mapCanvas;
    c.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, cx: this.mapView.cx, cz: this.mapView.cz }; moved = false; c.setPointerCapture(e.pointerId); });
    c.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 5) moved = true;
      this.mapView.cx = drag.cx - dx / this.mapView.zoom;
      this.mapView.cz = drag.cz - dy / this.mapView.zoom;
    });
    c.addEventListener('pointerup', (e) => {
      if (drag && !moved) {
        const r = c.getBoundingClientRect();
        const x = this.mapView.cx + (e.clientX - r.left - r.width / 2) / this.mapView.zoom;
        const z = this.mapView.cz + (e.clientY - r.top - r.height / 2) / this.mapView.zoom;
        this.setWaypoint(x, z);
      }
      drag = null;
    });
    c.addEventListener('wheel', (e) => { e.preventDefault(); this.mapView.zoom = clamp(this.mapView.zoom * (e.deltaY < 0 ? 1.15 : 0.87), 0.12, 3); }, { passive: false });
  }

  setWaypoint(x, z) {
    const g = this.game;
    if (g.waypoint) g.blips.splice(g.blips.indexOf(g.waypoint), 1);
    if (g.waypoint && Math.hypot(g.waypoint.x - x, g.waypoint.z - z) < 30) { g.waypoint = null; return; }
    g.waypoint = { x, z, color: '#ff40ff', size: 8, edge: true, waypoint: true };
    g.blips.push(g.waypoint);
  }

  openMap() {
    const g = this.game;
    this.mapEl.hidden = false;
    this.mapFromGame = this.pause.hidden;
    this.pause.hidden = true;
    const p = g.player;
    const pp = p.vehicle ? p.vehicle.pos : p.pos;
    this.mapView.cx = pp.x; this.mapView.cz = pp.z;
    const legend = this.mapEl.querySelector('.legend');
    const seen = new Set();
    let html = '';
    for (const b of g.blips) {
      if (!b.legend || !b.name || seen.has(b.name)) continue;
      seen.add(b.name);
      html += `<div><span style="background:${b.bg};color:${b.fg || '#fff'}">${b.letter}</span>${b.name}</div>`;
    }
    html += '<div><span style="background:#ff40ff"></span>Destino marcado</div>';
    legend.innerHTML = html;
  }

  drawMap() {
    const g = this.game;
    const c = this.mapCanvas;
    const W = c.clientWidth, H = c.clientHeight;
    if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
    const ctx = c.getContext('2d');
    const v = this.mapView;
    ctx.fillStyle = '#3a5a80';
    ctx.fillRect(0, 0, W, H);
    const S = g.hud.mapScale;
    const toS = (x, z) => [W / 2 + (x - v.cx) * v.zoom, H / 2 + (z - v.cz) * v.zoom];
    const [ox, oy] = toS(WORLD.minX, WORLD.minZ);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(g.hud.mapImg, ox, oy, g.hud.mapImg.width * S * v.zoom, g.hud.mapImg.height * S * v.zoom);
    // nombres de zonas
    ctx.font = `${Math.round(clamp(v.zoom * 40, 10, 22))}px 'Pirata One', Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.strokeStyle = 'rgba(0,0,0,0.8)'; ctx.lineWidth = 3;
    const labels = [['Centro', 200, 90], ['Cerro Chenque', 150, -360], ['Km 3', 220, -760], ['Km 5', 230, -1045], ['Km 8', 230, -1310], ['Caleta Córdova', 320, -1690], ['Puerto', 420, 460], ['Pietrobelli', -240, 60], ['Juan XXIII', -600, 60], ['9 de Julio', -240, 360], ['30 de Octubre', -600, 360], ['Industrial', 110, 680], ['Pueyrredón', -240, 690], ['Rada Tilly', 140, 1270], ['Punta del Marqués', 520, 1620], ['Pampa del Castillo', -1180, -300], ['Aeropuerto', -650, -1400], ['Golfo San Jorge', 800, 0]];
    for (const [n, x, z] of labels) { const [sx, sy] = toS(x, z); ctx.strokeText(n, sx, sy); ctx.fillText(n, sx, sy); }
    // blips
    for (const b of g.blips) {
      if (b.hidden) continue;
      const [x, y] = toS(b.x, b.z);
      if (b.letter) {
        ctx.fillStyle = b.bg; ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = b.fg || '#fff'; ctx.font = 'bold 11px Arial'; ctx.textBaseline = 'middle';
        ctx.fillText(b.letter, x, y + 0.5);
      } else {
        ctx.fillStyle = b.color || '#ff0'; ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
        ctx.fillRect(x - 5, y - 5, 10, 10); ctx.strokeRect(x - 5, y - 5, 10, 10);
      }
    }
    // jugador
    const p = g.player;
    const pp = p.vehicle ? p.vehicle.pos : p.pos;
    const hd = p.vehicle ? p.vehicle.heading : p.heading;
    const [px, py] = toS(pp.x, pp.z);
    ctx.save(); ctx.translate(px, py); ctx.rotate(Math.PI - hd);
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(7, 8); ctx.lineTo(0, 4); ctx.lineTo(-7, 8); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
    void POI;
  }
}
