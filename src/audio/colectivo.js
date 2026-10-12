// Sonidos grabados del colectivo (Metalpar Tronador II OF-1519 con motor Mercedes, de los mods
// de Nicolás): motor en ralentí y en tres giros, cambios, turbo, frenos de aire, bocina y puertas.
// Los arma tools/colectivos/sonidos.py en un solo .bin de mp3 (colectivo.json es el índice).
import { clamp } from '../util.js';
import BIN from './colectivo.bin';
import IDX from './colectivo.json';

const LOOPS = ['ralenti', 'bajo', 'medio', 'alto'];
const isBus = (v) => v && v.type && v.type.style === 'bus';

export class BusSound {
  constructor(audio) {
    this.a = audio;
    this.buf = {};
    this.loops = null;
    this.gear = 0;
    this.braking = false;
    this.wasThrottle = 0;
    this.near = new Map();
    this.load();
  }

  async load() {
    const ctx = this.a.ctx;
    await Promise.all(Object.entries(IDX).map(async ([k, [o, n]]) => {
      try { this.buf[k] = await ctx.decodeAudioData(BIN.slice(o, o + n).buffer); } catch (e) { /* sin ese sonido */ }
    }));
    this.ready = LOOPS.every((k) => this.buf[k]);
  }

  // un sonido suelto, con volumen según la distancia
  play(k, { gain = 0.6, pos = null, range = 90, rate = 1 } = {}) {
    const b = this.buf[k], a = this.a;
    if (!b || !a.enabled) return null;
    const pg = a.posGain(pos, range);
    if (pg <= 0.001) return null;
    const s = a.ctx.createBufferSource(); s.buffer = b; s.playbackRate.value = rate;
    const g = a.ctx.createGain(); g.gain.value = gain * pg;
    s.connect(g).connect(a.sfx);
    s.start();
    return { s, g };
  }

  loopSource(k) {
    const ctx = this.a.ctx, b = this.buf[k];
    const s = ctx.createBufferSource(); s.buffer = b; s.loop = true;
    // el mp3 agrega un silencio chiquito al principio y al final: se saltea
    s.loopStart = 0.06; s.loopEnd = b.duration - 0.06;
    const g = ctx.createGain(); g.gain.value = 0;
    s.connect(g).connect(this.a.sfx);
    s.start(0, Math.random() * (b.duration - 0.2));
    return { s, g };
  }

  startLoops() {
    if (this.loops || !this.ready) return;
    this.loops = Object.fromEntries(LOOPS.map((k) => [k, this.loopSource(k)]));
  }

  stopLoops() {
    if (!this.loops) return;
    const t = this.a.ctx.currentTime;
    for (const l of Object.values(this.loops)) { l.g.gain.setTargetAtTime(0, t, 0.1); l.s.stop(t + 0.6); }
    this.loops = null;
  }

  // ¿el jugador va en un colectivo con los sonidos ya cargados?
  active(game) {
    const v = game.player && game.player.vehicle;
    return this.ready && isBus(v) && !v.dead ? v : null;
  }

  enter(v) { if (isBus(v)) { this.play('abre', { gain: 0.5, pos: v.pos }); setTimeout(() => this.play('arranque', { gain: 0.7 }), 900); } }
  exit(v) { if (isBus(v)) { this.play('apagado', { gain: 0.55, pos: v.pos }); this.play('cierra', { gain: 0.5, pos: v.pos }); } }

  hornOn() { if (this.hornSrc || !this.buf.bocina) return; const h = this.play('bocina', { gain: 0.55 }); if (!h) return; h.s.loop = true; h.s.loopStart = 0.06; h.s.loopEnd = h.s.buffer.duration - 0.06; this.hornSrc = h; }
  hornOff() { const h = this.hornSrc; if (!h) return; h.g.gain.setTargetAtTime(0, this.a.ctx.currentTime, 0.03); h.s.stop(this.a.ctx.currentTime + 0.2); this.hornSrc = null; }

  // por frame: devuelve true si el motor del jugador sonó con las grabaciones
  update(dt, game) {
    const v = this.active(game);
    this.ambient(game, v);
    if (!v || game.paused) { this.stopLoops(); return false; }
    this.startLoops();
    const t = this.a.ctx.currentTime, T = v.type;
    const sp = Math.abs(v.forwardSpeed), thr = Math.abs(v.ctrl.throttle);
    const step = T.maxSpeed / 4.5;
    const gear = Math.min(4, Math.floor(sp / step));
    const rpm = clamp((sp - gear * step) / step * 0.8 + thr * 0.2, 0, 1);
    // mezcla de las cuatro grabaciones según el giro
    const w = {
      ralenti: clamp(1 - sp / 3, 0, 1) * (1 - thr * 0.6),
      bajo: clamp(1 - Math.abs(rpm - 0.15) / 0.35, 0, 1),
      medio: clamp(1 - Math.abs(rpm - 0.5) / 0.35, 0, 1),
      alto: clamp((rpm - 0.55) / 0.35, 0, 1),
    };
    const moving = 1 - w.ralenti;
    const vol = 0.32 + thr * 0.22;
    for (const k of LOOPS) {
      const l = this.loops[k];
      l.g.gain.setTargetAtTime((k === 'ralenti' ? w[k] * 0.45 : w[k] * moving * vol), t, 0.08);
      l.s.playbackRate.setTargetAtTime(k === 'ralenti' ? 1 : 0.85 + rpm * 0.3, t, 0.08);
    }
    // cambio de marcha y soplido del turbo al soltar el acelerador
    if (gear !== this.gear) { if (gear > this.gear) this.play('cambio', { gain: 0.35 }); this.gear = gear; }
    if (this.wasThrottle > 0.7 && thr < 0.2 && sp > 6) this.play('turbo', { gain: 0.3 });
    this.wasThrottle = thr;
    // frenos de aire: el "fsss" al frenar y el "pssst" al quedar parado
    const br = v.ctrl.brake > 0.3 || v.ctrl.handbrake;
    if (br && !this.braking && sp > 3) { this.play('freno', { gain: 0.35 }); if (sp > 12) this.play('chirrido', { gain: 0.25 }); }
    if (this.braking && sp < 0.5) this.play('suelta', { gain: 0.45 });
    this.braking = br && sp > 0.5 ? true : (sp < 0.5 ? false : this.braking);
    return true;
  }

  // colectivos de la calle: el "pssst" del aire cuando frenan cerca
  ambient(game, mine) {
    for (const k of this.near.keys()) if (k.removed) this.near.delete(k);
    for (const v of game.vehicles) {
      if (!isBus(v) || v === mine || v.dead) continue;
      const d = Math.hypot(v.pos.x - this.a.listener.x, v.pos.z - this.a.listener.z);
      if (d > 60) { this.near.delete(v); continue; }
      const sp = Math.abs(v.forwardSpeed || 0), was = this.near.get(v);
      if (was !== undefined && was > 2 && sp < 0.3) this.play(Math.random() < 0.5 ? 'aire' : 'suelta', { gain: 0.4, pos: v.pos, range: 60 });
      this.near.set(v, sp);
    }
  }
}
