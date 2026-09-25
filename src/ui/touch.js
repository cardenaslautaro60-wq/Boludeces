// Controles táctiles para jugar en el celular
export class Touch {
  constructor(game) {
    this.game = game;
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    this.isTouch = isTouch;
    const root = document.createElement('div');
    root.className = 'touch';
    root.hidden = true;
    root.innerHTML = `
      <div class="lookpad"></div>
      <div class="stick"><div class="knob"></div></div>
      <div class="btns"></div>
      <div class="top"><div class="btn" data-a="pause">❚❚</div><div class="btn" data-a="map">MAPA</div><div class="btn" data-a="switchChar">⇄</div><div class="btn" data-a="camera">CÁM</div></div>`;
    document.body.appendChild(root);
    this.root = root;
    this.btns = root.querySelector('.btns');
    this.mode = null;
    const inp = game.input;
    // joystick
    const stick = root.querySelector('.stick'), knob = root.querySelector('.knob');
    let sid = null, sc = null;
    const setStick = (e) => {
      const r = stick.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      let dx = (e.clientX - cx) / (r.width / 2), dy = (e.clientY - cy) / (r.height / 2);
      const m = Math.hypot(dx, dy);
      if (m > 1) { dx /= m; dy /= m; }
      knob.style.transform = `translate(${dx * 45}px, ${dy * 45}px)`;
      inp.touch.x = dx; inp.touch.y = -dy; inp.touch.active = true;
      // empujar a fondo = correr
      if (!game.player || !game.player.vehicle) { if (m > 0.95) inp.touch.buttons.add('sprint'); else inp.touch.buttons.delete('sprint'); }
    };
    stick.addEventListener('pointerdown', (e) => { sid = e.pointerId; stick.setPointerCapture(sid); setStick(e); game.audio.init(); });
    stick.addEventListener('pointermove', (e) => { if (e.pointerId === sid) setStick(e); });
    const endStick = (e) => { if (e.pointerId !== sid) return; sid = null; knob.style.transform = ''; inp.touch.x = 0; inp.touch.y = 0; inp.touch.active = false; inp.touch.buttons.delete('sprint'); };
    stick.addEventListener('pointerup', endStick);
    stick.addEventListener('pointercancel', endStick);
    // cámara
    const look = root.querySelector('.lookpad');
    let lid = null, lx = 0, ly = 0;
    look.addEventListener('pointerdown', (e) => { lid = e.pointerId; lx = e.clientX; ly = e.clientY; look.setPointerCapture(lid); });
    look.addEventListener('pointermove', (e) => { if (e.pointerId !== lid) return; inp.touch.lookX += e.clientX - lx; inp.touch.lookY += e.clientY - ly; lx = e.clientX; ly = e.clientY; inp.lastMouseMove = performance.now(); game.cameraRig.lastManual = performance.now(); });
    const endLook = (e) => { if (e.pointerId === lid) lid = null; };
    look.addEventListener('pointerup', endLook);
    look.addEventListener('pointercancel', endLook);
    // botones superiores
    root.querySelectorAll('.top .btn').forEach((b) => this.bindBtn(b));
    this.setMode(game.settings.touch);
  }

  bindBtn(b) {
    const inp = this.game.input;
    const a = b.dataset.a;
    b.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.game.audio.init();
      b.classList.add('on');
      if (a === 'gas') inp.touch.gas = true;
      else if (a === 'brake') inp.touch.brake = true;
      else { inp.touch.buttons.add(a); inp.touch.pressed.add(a); }
    });
    const up = () => {
      b.classList.remove('on');
      if (a === 'gas') inp.touch.gas = false;
      else if (a === 'brake') inp.touch.brake = false;
      else inp.touch.buttons.delete(a);
    };
    b.addEventListener('pointerup', up);
    b.addEventListener('pointercancel', up);
    b.addEventListener('pointerleave', up);
  }

  layout(inCar) {
    const key = inCar ? 'car' : 'foot';
    if (this.layoutKey === key) return;
    this.layoutKey = key;
    const inp = this.game.input;
    inp.touch.buttons.clear(); inp.touch.gas = false; inp.touch.brake = false;
    const defs = inCar
      ? [['horn', 'BOCINA'], ['radio', 'RADIO'], ['enter', 'BAJAR'], ['handbrake', 'FRENO<br>MANO'], ['brake', 'FRENO'], ['gas', 'GAS'], ['fire', 'TIRO'], ['job', 'REMÍS'], ['lookBack', 'ATRÁS']]
      : [['nextWeapon', 'ARMA'], ['aim', 'APUNTAR'], ['enter', 'SUBIR'], ['jump', 'SALTAR'], ['sprint', 'CORRER'], ['fire', 'GOLPE<br>TIRO']];
    this.btns.innerHTML = '';
    for (const [a, label] of defs) {
      const b = document.createElement('div');
      b.className = 'btn';
      b.dataset.a = a;
      b.innerHTML = label;
      this.btns.appendChild(b);
      this.bindBtn(b);
    }
  }

  setMode(mode) {
    this.mode = mode;
    const on = mode === 'on' || (mode === 'auto' && this.isTouch);
    this.enabled = on;
    this.root.hidden = !on || !this.game.started;
    document.body.classList.toggle('is-touch', on);
    this.game.input.isTouch = on;
  }

  update() {
    if (!this.enabled) return;
    const g = this.game;
    this.root.hidden = !g.started || g.paused || !!g.activities.mini || !!g.menus.choiceEl;
    if (g.player) this.layout(!!g.player.vehicle);
  }
}
