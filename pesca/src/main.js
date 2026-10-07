'use strict';
// Arranque, escena, título y bucle principal.

const ESC = { escena: null, camara: null, renderer: null, listo: false };
const MAIN = { tAuto: 0, tTitulo: 0, tFps: 0, nFps: 0, sumFps: 0, ultimo: 0 };

function iniciar3D() {
  const canvas = $('#cv');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.55;
  ESC.renderer = renderer;
  ESC.escena = new THREE.Scene();
  ESC.camara = new THREE.PerspectiveCamera(62, 1, 0.15, 5200);
  const t0 = performance.now();
  armarMundo();
  construirCampo();
  crearCielo(ESC.escena, renderer);
  crearTerreno(ESC.escena);
  crearMar(ESC.escena);
  crearMateriales();
  crearPalmas(ESC.escena); crearArboles(ESC.escena); crearRocas(ESC.escena); crearArbustos(ESC.escena); crearProps(ESC.escena); crearEdificios(ESC.escena);
  crearArsenal(ESC.escena);
  crearFX(ESC.escena);
  crearLinea3D(ESC.escena);
  crearTiros(ESC.escena);
  crearBotes(ESC.escena);
  crearJefes();
  iniciarInput(canvas);
  crearHUD();
  crearUIRed();
  redimensionar();
  window.addEventListener('resize', redimensionar);
  // el pescador y la gente de la isla
  iniciarJugador();
  crearNPCs();
  crearNPCsArsenal();
  J.hora = 17.3;
  poblarInicial();
  ESC.listo = true;
  console.log(`mundo listo en ${(performance.now() - t0) | 0} ms`);
}
function redimensionar() {
  if (!ESC.renderer) return;
  const w = window.innerWidth, h = window.innerHeight;
  J.w = w; J.h = h;
  J.dpr = Math.min(window.devicePixelRatio || 1, J.calidad >= 1 ? 2 : 1.25);
  ESC.renderer.setPixelRatio(J.dpr);
  ESC.renderer.setSize(w, h, false);
  ESC.camara.aspect = w / h;
  ESC.camara.updateProjectionMatrix();
  escalaFX();
}

// ---------------------------------------------------------------------------
// Estados del juego: título, partida nueva, continuar
// ---------------------------------------------------------------------------
function mostrarTitulo() {
  const t = $('#titulo');
  const hay = hayPartida();
  t.hidden = false;
  t.innerHTML = `<div class="tit-caja">
    <div class="tit-logo">🎣</div>
    <h1>Isla Anzuelo</h1>
    <p class="tit-sub">Pescá, vendé, cazá jefes del mar y probá suerte en el casino.<br>Un mundo abierto en 3D para recorrer a pie y en bote.</p>
    <div class="tit-botones">
      ${hay ? '<button class="btn gold grande" id="tt-cont">Continuar</button>' : ''}
      <button class="btn ${hay ? 'gris' : 'gold grande'}" id="tt-nueva">${hay ? 'Nueva partida' : 'Empezar a jugar'}</button>
      <button class="btn verde" id="tt-ayuda">Cómo se juega</button>
    </div>
    <p class="tit-pie">${IN.tactil ? 'Joystick a la izquierda · arrastrá a la derecha para mirar' : 'WASD moverse · Mouse mirar · Clic pescar · E interactuar'}</p>
  </div>`;
  const c = $('#tt-cont', t);
  if (c) c.addEventListener('click', () => { sfx('click'); empezarJuego(true); });
  // el visor del Artifact no muestra confirm(): la confirmación va en el propio botón
  let armado = 0;
  const nueva = $('#tt-nueva', t);
  nueva.addEventListener('click', () => {
    if (hay && !armado) {
      armado = setTimeout(() => { armado = 0; nueva.textContent = 'Nueva partida'; nueva.classList.remove('rojo'); nueva.classList.add('gris'); }, 4000);
      nueva.textContent = '¿Seguro? Se borra tu partida'; nueva.classList.remove('gris'); nueva.classList.add('rojo'); sfx('error');
      return;
    }
    clearTimeout(armado);
    sfx('click'); empezarJuego(false);
  });
  $('#tt-ayuda', t).addEventListener('click', () => { iniciarAudio(); sfx('click'); abrirPanel('ayuda'); });
  armarBloqueRed(t);
}
function irAlTitulo() {
  if (J.partida) guardar();
  desconectarRed();
  J.partida = false;
  J.modo = 'titulo';
  J.panel = null;
  $('#panel').hidden = true;
  $('#hud').hidden = true;
  $('#mira').hidden = true;
  soltarLock();
  soltarTodo();
  limpiarPeligros();
  for (const q of PROY.slice()) quitarProy(q);
  if (BOTE.act) bajarDelBote(true);
  P.pos.x = MUELLE.x; P.pos.z = MUELLE.z0 + 6; P.pos.y = MUELLE.alto;
  if (PJ.rig) PJ.rig.grupo.visible = false;
  MAIN.tTitulo = 0;
  J.hora = 17.3;
  musica('isla');
  mostrarTitulo();
}
function reiniciarMundo() {
  for (const c of MUN.cofres) c.dia = -1;
  soltarTodo();
  limpiarPeligros();
  for (const q of PROY.slice()) quitarProy(q);
  crearJefes();
  for (const b of BOSSES) {
    const k = Math.min(5, jefeKills(b.def.id));
    b.hpMax = Math.round(b.def.hp * (1 + 0.2 * k));
    b.hp = b.hpMax;
    if (b.def.cuando === 'noche' && J.luz > 0.5) b.estado = 'oculto';
  }
}
function empezarJuego(continuar) {
  iniciarAudio();
  const bq = $('.tit-red');
  if (bq && bq.guardar) bq.guardar();
  let ok = false;
  if (continuar) ok = cargarPartida();
  if (!ok) { G = nuevoG(); continuar = false; }
  J.partida = true;
  J.modo = 'jugando';
  J.panel = null;
  J.hora = continuar ? G.hora : 8;
  J.clima.lluvia = 0; J.clima.objetivo = 0; J.clima.tClima = rand(90, 200);
  $('#titulo').hidden = true;
  $('#hud').hidden = false;
  HUD.cache = {};
  HUD.plataMostrada = G.plata;
  limpiarFlotantes();
  // posición inicial
  let pos = null;
  if (continuar && G.pos && Number.isFinite(G.pos.x) && libre(G.pos.x, G.pos.z, 0.4)) pos = { x: G.pos.x, z: G.pos.z };
  iniciarJugador(pos);
  cargarBotes();
  if (continuar) { P.hp = clamp(G.hp || P.hpMax, 1, P.hpMax); P.hambre = clamp(G.hambre === undefined ? 100 : G.hambre, 0, 100); }
  if (continuar && G.boteAct) { const b = BOTE.lista.find((x) => x.def.id === G.boteAct); if (b && G.botes[b.def.id]) { P.pos.x = b.x; P.pos.z = b.z; abordar(b, true); } }
  reiniciarMundo();
  poblarInicial();
  actualizarCamara(10);
  musica('isla');
  CAM.shake = 0;
  if (!continuar) {
    toast('Naufragaste en la Isla Anzuelo. Recorré la isla y pescá desde el muelle.', '#ffe39a');
    setTimeout(() => toast(IN.tactil ? 'Joystick para moverte · arrastrá para mirar · botón grande para pescar' : 'WASD para moverte · mouse para mirar · clic para lanzar la caña', '#9be7ff'), 2400);
    guardar();
  } else toast('¡Bienvenido de vuelta!', '#9bffb0');
  revisarMisiones();
  pedirLock();
  if (RED.cfg.online) iniciarRed();
}
async function iniciarRed() {
  const ok = await conectarRed();
  if (J.modo === 'titulo') { desconectarRed(); return; }
  if (!ok) { toast('No se pudo conectar: seguís jugando solo.', '#ffb3a8'); return; }
  // da unos segundos a que el canal se conecte de verdad
  for (let i = 0; i < 20 && RED.sala && !RED.sala.conectada(); i++) await new Promise((r) => setTimeout(r, 200));
  if (J.modo === 'titulo' || !RED.sala) return;
  if (RED.sala.conectada()) toast(`🌐 En línea${RED.cfg.sala ? ' · sala ' + RED.cfg.sala : ''}. Chat con T, emotes con G, lista con Tab.`, '#9be7ff');
  else if (RED.sala.error === 'not_granted' || RED.sala.error === 'revoked') toast('Esta página no te deja entrar a la sala (hace falta abrirla con tu cuenta de Claude): seguís jugando solo.', '#ffe39a');
  else toast('Sin conexión con la sala por ahora: seguís jugando solo y se reintenta solo.', '#ffe39a');
}
function nuevaPartida() { empezarJuego(false); }
function limpiarFlotantes() {
  for (const o of FX.textos) o.el.remove();
  FX.textos.length = 0;
  for (const n of PJ.npcs) if (n.burbuja) { n.burbuja.remove(); n.burbuja = null; }
  const av = $('#avisos'); if (av) av.innerHTML = '';
}

// ---------------------------------------------------------------------------
// Clima y bucle
// ---------------------------------------------------------------------------
function actualizarClima(dt) {
  const C = J.clima;
  if (!RED.anfitrion && RED.activa) { C.lluvia += (C.objetivo - C.lluvia) * Math.min(1, dt * 0.1); if (C.lluvia < 0.003) C.lluvia = 0; C.ola = 1 + C.lluvia * 0.85 + 0.15 * Math.sin(J.t * 0.021); C.viento = 0.25 + C.lluvia * 0.6; return; }
  C.tClima -= dt;
  if (C.tClima <= 0) { C.tClima = rand(110, 250); C.objetivo = Math.random() < 0.27 ? rand(0.5, 1) : 0; }
  C.lluvia += (C.objetivo - C.lluvia) * Math.min(1, dt * 0.1);
  if (C.lluvia < 0.003) C.lluvia = 0;
  C.ola = 1 + C.lluvia * 0.85 + 0.15 * Math.sin(J.t * 0.021);
  C.viento = 0.25 + C.lluvia * 0.6;
}

function camaraTitulo(dt) {
  MAIN.tTitulo += dt;
  const a = 0.35 + MAIN.tTitulo * 0.045, R = 190;
  ESC.camara.position.set(Math.cos(a) * R, 46 + 9 * Math.sin(MAIN.tTitulo * 0.11), Math.sin(a) * R + 25);
  ESC.camara.lookAt(0, 5, 22);
}

const TECLAS_PANEL = { KeyI: 'mochila', KeyC: 'bitacora', KeyM: 'mapa', KeyP: 'pausa' };
function teclasDePanel() {
  const pasado = performance.now() - PANEL.abierto > 200;
  if (pulsada('Escape') && pasado) { cerrarPanel(); return true; }
  for (const k in TECLAS_PANEL) if (pulsada(k) && J.panel === TECLAS_PANEL[k] && pasado) { cerrarPanel(); return true; }
  return false;
}

function actualizar(dt) {
  if (J.modo === 'titulo') {
    J.t += dt;
    camaraTitulo(dt);
    actualizarMar(dt); actualizarCielo(dt, ESC.camara); actualizarProps(dt); actualizarEdificios(dt);
    actualizarPeces(dt); actualizarFX(dt); actualizarBotes(dt);
    limpiarPulsos();
    return;
  }
  const enMenu = !!J.panel;
  // con otros jugadores el mundo no se frena cuando abrís un menú (seguís protegido, pero los jefes siguen peleando)
  const compartido = RED.activa && jugadoresEnSala() > 1;
  if (enMenu) {
    teclasDePanel();
    if (!compartido) {
      actualizarCielo(0, ESC.camara);
      limpiarPulsos();
      return;
    }
    P.inv = Math.max(P.inv, 1.2);
  }
  const jugando = J.modo === 'jugando';
  J.t += dt;
  if (jugando) { J.hora = (J.hora + (dt * 24) / PESCA.diaSeg) % 24; G.stats.segundos += dt; if (J.hora < 0.01 || (J.hora < 6.02 && J.hora > 5.98)) { /* amanecer */ } }
  actualizarClima(dt);
  actualizarMulti(dt);
  if (jugando && !enMenu) actualizarJugador(dt); else { P.vel.x = P.vel.z = 0; calcularMira(); }
  if (J.dia !== G.dia) J.dia = G.dia;
  actualizarCamara(dt);
  actualizarLinea(dt);
  actualizarPeces(dt);
  actualizarProyectiles(dt);
  actualizarArmas(dt);
  actualizarJefes(dt);
  actualizarPeligros(dt);
  actualizarTentaculos(dt);
  actualizarRayos(dt);
  actualizarCuerdaRemolque();
  actualizarBotes(dt);
  actualizarNPCs(dt);
  actualizarMarca();
  actualizarLinea3D();
  actualizarMar(dt);
  actualizarCielo(dt, ESC.camara);
  actualizarProps(dt);
  actualizarEdificios(dt);
  actualizarArsenal(dt);
  actualizarVisitas(dt);
  actualizarRemotos(dt);
  actualizarBotonesRed();
  actualizarFX(dt);
  actualizarHUD(dt);
  ambienteFrame(dt);
  if (jugando) {
    MAIN.tAuto += dt;
    if (MAIN.tAuto > 25) { MAIN.tAuto = 0; guardar(); }
    if (pulsada('Escape') || pulsada('KeyP')) { /* lo maneja procesarAcciones */ }
  }
  limpiarPulsos();
}
function dibujar() { renderSombras(); ESC.renderer.render(ESC.escena, ESC.camara); }

function bucle(ts) {
  const dt = Math.min(0.05, (ts - MAIN.ultimo) / 1000 || 0.016);
  MAIN.ultimo = ts;
  if (window.__manual) { requestAnimationFrame(bucle); return; } // pruebas: el tiempo lo maneja __paso
  try { actualizar(dt); } catch (e) { if (!MAIN.errores) MAIN.errores = 0; if (MAIN.errores++ < 5) console.error(e); }
  dibujar();
  // calidad adaptable: si va lento, baja la resolución y después las sombras
  MAIN.sumFps += dt; MAIN.nFps++;
  if (MAIN.nFps >= 90) {
    const prom = MAIN.sumFps / MAIN.nFps;
    MAIN.sumFps = 0; MAIN.nFps = 0;
    if (prom > 0.036 && J.modo === 'jugando') {
      if (J.calidad >= 1) { J.calidad = 0; G.ajustes.calidad = 0; redimensionar(); } else if (J.sombras) { J.sombras = false; }
    }
  }
  requestAnimationFrame(bucle);
}

// Ganchos para pruebas
window.__paso = (dt = 0.016, n = 1) => { for (let i = 0; i < n; i++) actualizar(dt); dibujar(); };
window.__vista = (x, y, z, tx, ty, tz) => { ESC.camara.position.set(x, y, z); ESC.camara.lookAt(tx, ty, tz); dibujar(); };
window.__J = J; window.__P = P; window.__CAM = CAM; window.__LINEA = LINEA; window.__BOSSES = BOSSES; window.__PECES = PECES;
window.__G = () => G; window.__BOTE = BOTE;
window.__empezar = (cont) => empezarJuego(!!cont);

window.addEventListener('DOMContentLoaded', () => {
  const carga = $('#carga');
  setTimeout(() => {
    try {
      iniciar3D();
      irAlTitulo();
      if (carga) carga.remove();
      requestAnimationFrame(bucle);
    } catch (e) {
      console.error(e);
      if (carga) carga.textContent = 'No se pudo iniciar el juego (WebGL). ' + e.message;
    }
  }, 30);
});
