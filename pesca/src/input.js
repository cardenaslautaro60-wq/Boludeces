'use strict';
// Entrada: teclado, mouse (con pointer lock para mirar) y toques. El juego lee IN cada cuadro.

const IN = {
  teclas: new Set(), pulso: new Set(),
  dx: 0, dy: 0, // giro de la cámara acumulado en este cuadro (radianes)
  botones: [false, false, false], pulsoBoton: [false, false, false],
  bloqueado: false, sinLock: false, arrastre: null,
  joy: { x: 0, y: 0 }, tactil: false,
  accionTactil: false, accionPulso: false, rodarTactil: false, saltarTactil: false, interTactil: false, arponTactil: false, dinaTactil: false,
  rueda: 0, sens: 0.0023,
};

const TECLAS_JUEGO = new Set(['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'ShiftLeft', 'ShiftRight']);
let joyId = null, lookId = null, joyOrigen = null, lookPrev = null;

// Si el navegador no deja capturar el mouse (marco sin permiso), se mira arrastrando con el botón derecho. Un solo error no alcanza para
// decidirlo: Chrome también rechaza un pedido que llega justo después de salir con Esc.
let fallosLock = 0;
function falloLock() {
  if (++fallosLock < 3 || IN.sinLock) return;
  IN.sinLock = true;
  try { toast('El navegador no deja capturar el mouse: mantené el clic derecho y arrastrá para mirar.', '#ffe39a'); } catch (e) { /* sin HUD todavía */ }
}
function pedirLock() {
  if (IN.tactil || J.panel || J.modo !== 'jugando') return;
  const cv = $('#cv');
  if (document.pointerLockElement === cv) return;
  try {
    const r = cv.requestPointerLock && cv.requestPointerLock();
    if (r && r.catch) r.catch(falloLock);
  } catch (e) { falloLock(); }
}
function soltarLock() { try { if (document.pointerLockElement) document.exitPointerLock(); } catch (e) { /* nada */ } }

function iniciarInput(canvas) {
  window.addEventListener('keydown', (e) => {
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (TECLAS_JUEGO.has(e.code) || /^Digit[1-9]$/.test(e.code)) e.preventDefault();
    if (e.repeat) return;
    IN.teclas.add(e.code);
    IN.pulso.add(e.code);
  });
  window.addEventListener('keyup', (e) => { IN.teclas.delete(e.code); });
  window.addEventListener('blur', () => { IN.teclas.clear(); IN.botones[0] = IN.botones[1] = IN.botones[2] = false; IN.joy.x = IN.joy.y = 0; IN.accionTactil = false; });
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  canvas.addEventListener('wheel', (e) => { e.preventDefault(); IN.rueda += Math.sign(e.deltaY); }, { passive: false });
  document.addEventListener('pointerlockchange', () => {
    IN.bloqueado = document.pointerLockElement === canvas;
    if (IN.bloqueado) fallosLock = 0;
    // si se perdió el lock jugando (Esc), se abre la pausa
    if (!IN.bloqueado && J.modo === 'jugando' && !J.panel && !IN.soltando && !IN.sinLock) abrirPanel('pausa');
  });
  document.addEventListener('pointerlockerror', falloLock);
  document.addEventListener('mousemove', (e) => {
    if (IN.bloqueado) { IN.dx -= e.movementX * IN.sens; IN.dy -= e.movementY * IN.sens; }
  });

  canvas.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') {
      IN.tactil = true;
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < J.w * 0.42 && joyId === null) {
        joyId = e.pointerId; joyOrigen = { x, y }; mostrarJoystick(x, y);
      } else if (lookId === null) { lookId = e.pointerId; lookPrev = { x, y }; }
      try { canvas.setPointerCapture(e.pointerId); } catch (x) { /* puntero inactivo */ }
      return;
    }
    IN.tactil = false;
    if (J.modo === 'jugando' && !J.panel && !IN.bloqueado && !IN.sinLock) pedirLock();
    const b = Math.min(2, e.button);
    IN.botones[b] = true;
    // sin pointer lock: el botón derecho arrastra para mirar
    if (!IN.bloqueado && b === 2) IN.arrastre = { x: e.clientX, y: e.clientY, mov: 0 };
    else IN.pulsoBoton[b] = true;
    try { canvas.setPointerCapture(e.pointerId); } catch (x) { /* puntero inactivo */ }
  });
  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (e.pointerId === joyId) {
        const dx = x - joyOrigen.x, dy = y - joyOrigen.y, m = Math.hypot(dx, dy), R = 56, k = m > R ? R / m : 1;
        IN.joy.x = (dx * k) / R; IN.joy.y = (dy * k) / R;
        moverJoystick(joyOrigen.x + dx * k, joyOrigen.y + dy * k);
      } else if (e.pointerId === lookId) {
        IN.dx -= (x - lookPrev.x) * 0.0052; IN.dy -= (y - lookPrev.y) * 0.0052;
        lookPrev = { x, y };
      }
      return;
    }
    if (IN.arrastre) {
      const dx = e.clientX - IN.arrastre.x, dy = e.clientY - IN.arrastre.y;
      IN.arrastre.x = e.clientX; IN.arrastre.y = e.clientY;
      IN.arrastre.mov += Math.abs(dx) + Math.abs(dy);
      IN.dx -= dx * IN.sens * 1.3; IN.dy -= dy * IN.sens * 1.3;
    }
  });
  const fin = (e) => {
    if (e.pointerType === 'touch') {
      if (e.pointerId === joyId) { joyId = null; IN.joy.x = IN.joy.y = 0; ocultarJoystick(); }
      if (e.pointerId === lookId) lookId = null;
      return;
    }
    const b = Math.min(2, e.button);
    IN.botones[b] = false;
    if (b === 2 && IN.arrastre) { if (IN.arrastre.mov < 6) IN.pulsoBoton[2] = true; IN.arrastre = null; }
  };
  canvas.addEventListener('pointerup', fin);
  canvas.addEventListener('pointercancel', fin);
}

// Vector de movimiento (teclado + joystick), normalizado. x: derecha, y: atrás
function vectorMov() {
  let x = 0, y = 0;
  const T = IN.teclas;
  if (T.has('KeyA')) x -= 1;
  if (T.has('KeyD')) x += 1;
  if (T.has('KeyW')) y -= 1;
  if (T.has('KeyS')) y += 1;
  x += IN.joy.x; y += IN.joy.y;
  const m = Math.hypot(x, y);
  if (m > 1) { x /= m; y /= m; }
  if (m < 0.12) { x = 0; y = 0; }
  return { x, y };
}
const pulsada = (...codes) => codes.some((c) => IN.pulso.has(c));
const apretada = (...codes) => codes.some((c) => IN.teclas.has(c));
function limpiarPulsos() {
  IN.pulso.clear();
  IN.pulsoBoton[0] = IN.pulsoBoton[1] = IN.pulsoBoton[2] = false;
  IN.rueda = 0; IN.dx = 0; IN.dy = 0;
}

// Joystick visual (táctil)
let joyEl = null, joyKnob = null;
function mostrarJoystick(x, y) {
  if (!joyEl) { joyEl = h('div', 'joy', '<div class="joy-knob"></div>', $('#app')); joyKnob = $('.joy-knob', joyEl); }
  joyEl.style.left = x + 'px'; joyEl.style.top = y + 'px';
  joyEl.hidden = false;
  joyKnob.style.transform = 'translate(-50%,-50%)';
}
function moverJoystick(x, y) {
  if (!joyEl) return;
  joyKnob.style.transform = `translate(calc(-50% + ${x - parseFloat(joyEl.style.left)}px), calc(-50% + ${y - parseFloat(joyEl.style.top)}px))`;
}
function ocultarJoystick() { if (joyEl) joyEl.hidden = true; }
