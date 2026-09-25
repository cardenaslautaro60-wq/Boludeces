// Entrada: teclado + mouse (con pointer lock) + joystick táctil + gamepad.
// Controles al estilo San Andreas para PC.

export const BINDINGS = {
  forward: ['KeyW', 'ArrowUp'],
  back: ['KeyS', 'ArrowDown'],
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  sprint: ['Space'],
  handbrake: ['Space'],
  jump: ['ShiftLeft', 'ShiftRight'],
  walk: ['KeyC'],
  enter: ['KeyF', 'Enter'],
  fire: ['mouse0', 'ControlLeft', 'ControlRight'],
  aim: ['mouse2'],
  nextWeapon: ['KeyE'],
  prevWeapon: ['KeyQ'],
  horn: ['KeyH'],
  radio: ['KeyR'],
  pause: ['Escape', 'KeyP'],
  map: ['KeyM'],
  switchChar: ['Tab'],
  job: ['Digit2'],
  yes: ['KeyY'],
  no: ['KeyN'],
  camera: ['KeyV'],
  lookBack: ['KeyX'],
  action: ['KeyG'],
};

export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.down = new Set();
    this.pressed = new Set();
    this.mdx = 0; this.mdy = 0;
    this.wheel = 0;
    this.typed = '';
    this.locked = false;
    this.touch = { x: 0, y: 0, active: false, buttons: new Set(), pressed: new Set(), lookX: 0, lookY: 0 };
    this.lastMouseMove = 0;
    this.enabled = true;
    this.pad = null;
    this.padPrev = {};
    this.sensitivity = 1;
    this.invertY = false;

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Tab' || e.code === 'Space' || e.code.startsWith('Arrow')) e.preventDefault();
      if (!this.down.has(e.code)) this.pressed.add(e.code);
      this.down.add(e.code);
      if (e.key && e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) {
        this.typed = (this.typed + e.key.toUpperCase()).slice(-24);
        this.onType && this.onType(this.typed);
      }
    });
    window.addEventListener('keyup', (e) => { this.down.delete(e.code); });
    window.addEventListener('blur', () => { this.down.clear(); });
    canvas.addEventListener('mousedown', (e) => {
      const code = 'mouse' + e.button;
      if (!this.down.has(code)) this.pressed.add(code);
      this.down.add(code);
      if (!this.locked && this.wantLock && !this.isTouch) {
        try { const r = canvas.requestPointerLock(); if (r && r.catch) r.catch(() => {}); } catch (err) { /* sin pointer lock */ }
      }
    });
    window.addEventListener('mouseup', (e) => { this.down.delete('mouse' + e.button); });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('pointerlockchange', () => { this.locked = document.pointerLockElement === canvas; });
    window.addEventListener('mousemove', (e) => {
      if (this.locked) { this.mdx += e.movementX; this.mdy += e.movementY; this.lastMouseMove = performance.now(); }
      else if (this.down.has('mouse0') || this.down.has('mouse2') || this.dragLook) {
        if (e.target === canvas) { this.mdx += e.movementX; this.mdy += e.movementY; this.lastMouseMove = performance.now(); }
      }
    });
    canvas.addEventListener('wheel', (e) => { this.wheel += Math.sign(e.deltaY); e.preventDefault(); }, { passive: false });
    window.addEventListener('gamepadconnected', () => { this.hasPad = true; });
  }

  is(action) {
    const codes = BINDINGS[action];
    if (codes) for (const c of codes) if (this.down.has(c)) return true;
    if (this.touch.buttons.has(action)) return true;
    if (this.padDown && this.padDown[action]) return true;
    return false;
  }

  was(action) {
    const codes = BINDINGS[action];
    if (codes) for (const c of codes) if (this.pressed.has(c)) return true;
    if (this.touch.pressed.has(action)) return true;
    if (this.padPressed && this.padPressed[action]) return true;
    return false;
  }

  // Eje de movimiento: x (derecha +), y (adelante +)
  axis() {
    let x = 0, y = 0;
    if (this.is('forward')) y += 1;
    if (this.is('back')) y -= 1;
    if (this.is('right')) x += 1;
    if (this.is('left')) x -= 1;
    if (this.touch.active) { x += this.touch.x; y += this.touch.y; }
    if (this.padAxis) { x += this.padAxis.x; y += this.padAxis.y; }
    const m = Math.hypot(x, y);
    if (m > 1) { x /= m; y /= m; }
    return { x, y };
  }

  pollPad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    const p = pads && [...pads].find((q) => q);
    this.padDown = null; this.padPressed = null; this.padAxis = null; this.padLook = null; this.padTriggers = null;
    if (!p) return;
    const dz = (v) => (Math.abs(v) < 0.18 ? 0 : v);
    this.padAxis = { x: dz(p.axes[0] || 0), y: -dz(p.axes[1] || 0) };
    this.padLook = { x: dz(p.axes[2] || 0), y: dz(p.axes[3] || 0) };
    const b = (i) => p.buttons[i] && p.buttons[i].pressed;
    const val = (i) => (p.buttons[i] ? p.buttons[i].value : 0);
    this.padTriggers = { gas: val(7), brake: val(6) };
    const map = {
      sprint: b(0), handbrake: b(5), jump: b(2), enter: b(3), fire: b(7) && !this.inVehicle || b(1), aim: b(6) && !this.inVehicle,
      nextWeapon: b(5) && !this.inVehicle, prevWeapon: b(4) && !this.inVehicle, horn: b(10), radio: b(12) || b(13), pause: b(9), map: b(8), switchChar: b(11), job: b(14),
      yes: b(15), no: b(14), camera: b(12),
    };
    this.padPressed = {};
    for (const k in map) if (map[k] && !this.padPrev[k]) this.padPressed[k] = true;
    this.padDown = map;
    this.padPrev = map;
  }

  consumeLook() {
    let x = this.mdx * 0.0022 * this.sensitivity, y = this.mdy * 0.0022 * this.sensitivity;
    this.mdx = 0; this.mdy = 0;
    x += this.touch.lookX * 0.006; y += this.touch.lookY * 0.006;
    this.touch.lookX = 0; this.touch.lookY = 0;
    if (this.padLook) { x += this.padLook.x * 0.05; y += this.padLook.y * 0.04; }
    if (this.invertY) y = -y;
    return { x, y };
  }

  endFrame() {
    this.pressed.clear();
    this.touch.pressed.clear();
    this.wheel = 0;
  }
}
