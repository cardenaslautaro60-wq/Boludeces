// GTA: San Jorge — un GTA San Andreas en Comodoro Rivadavia (2004)
// Protagonizado por el Gordopin y el Petroca.
import { Game } from './game/game.js';

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
];

function loadingScreen() {
  const s = document.createElement('div');
  s.className = 'screen loading';
  s.innerHTML = `<div class="art"></div>
    <div class="load-tip"></div>
    <div class="logo"><span class="gta">GTA</span><span class="sj">San Jorge</span><span class="tag">Comodoro Rivadavia · 2004</span></div>
    <div class="load-msg">Cargando...</div>
    <div class="load-bar"><i></i></div>`;
  document.body.appendChild(s);
  const tip = s.querySelector('.load-tip');
  let k = Math.floor(Math.random() * TIPS.length);
  tip.textContent = TIPS[k];
  const iv = setInterval(() => { k = (k + 1) % TIPS.length; tip.textContent = TIPS[k]; }, 3500);
  return {
    progress(p, msg) {
      s.querySelector('.load-bar i').style.width = Math.round(p * 100) + '%';
      if (msg) s.querySelector('.load-msg').textContent = msg;
    },
    done() { clearInterval(iv); s.remove(); },
    error(msg) { s.querySelector('.load-msg').textContent = msg; s.querySelector('.load-msg').style.whiteSpace = 'normal'; },
  };
}

async function start(data = {}) {
  const ls = loadingScreen();
  const game = new Game();
  window.__game = game;
  const hot = window.claude && window.claude.hot;
  // si la página se actualiza mientras se juega, se conserva la partida
  if (hot && hot.snapshot) {
    try { hot.snapshot(() => ({ snap: game.started ? game.saves.snapshot() : null })); } catch (e) { /* sin recarga en caliente */ }
  }
  try {
    await game.init((p, m) => ls.progress(p, m));
  } catch (e) {
    console.error(e);
    ls.error('No se pudo iniciar el juego: ' + (e && e.message ? e.message : e) + '. Probá con otro navegador que soporte WebGL.');
    game.error = e;
    return;
  }
  ls.done();
  if (data && data.snap) {
    game.saves.apply(data.snap);
    game.menus.main.hidden = true;
    game.hud.show(true);
    game.input.wantLock = true;
    game.started = true;
    game.paused = false;
    const wake = () => { game.audio.init(); window.removeEventListener('pointerdown', wake); window.removeEventListener('keydown', wake); };
    window.addEventListener('pointerdown', wake);
    window.addEventListener('keydown', wake);
  } else {
    await Promise.race([game.mediaReady, new Promise((r) => setTimeout(r, 5000))]);
    game.menus.showStart();
  }
  game.ready = true;
}

function boot() {
  const hot = window.claude && window.claude.hot;
  if (hot && hot.ready) hot.ready(start);
  else start((hot && hot.data) || {});
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
