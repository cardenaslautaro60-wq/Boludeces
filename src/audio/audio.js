// Sonido 100% sintetizado con WebAudio: efectos, motor, viento, sirenas y radios procedurales.
import { clamp, rand, RNG } from '../util.js';
import { SANTIAGO, TALK, BUMPERS } from './guion.js';
import VOZ_BIN from './voces.bin';
import VOZ_IDX from './voces.json';
import { voiceKey, SPEAKERS } from './vozkey.js';

const STATIONS = [
  { name: 'Radio Cumbia Villera 104.5', style: 'cumbia', color: '#ff5fd0' },
  { name: 'FM Rock del Golfo 98.3', style: 'rock', color: '#ff8a2a' },
  { name: 'Boliche FM 101.1', style: 'electro', color: '#3ae8ff' },
  { name: 'Radio Chacarera Patagónica', style: 'folk', color: '#e8d23a' },
  { name: 'Tango del Viento AM 1210', style: 'tango', color: '#e84a4a' },
  { name: 'Novishok FM — thrash comodorense', style: 'novishok', color: '#ff3b2a' },
  { name: 'La Ciudad Perdida — con Santiago Sánchez', style: 'talk', color: '#8aff6a' },
  { name: 'Radio apagada', style: 'off', color: '#aaaaaa' },
];

export { SANTIAGO };

export class Audio {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.radioIdx = -1;
    this.volMusic = 0.55;
    this.volSfx = 0.8;
    this.listener = { x: 0, y: 0, z: 0 };
    this.useTTS = false;
    // voces: 'grabadas' (Piper, rioplatense), 'navegador' (síntesis del navegador) o 'no'
    this.voiceMode = 'grabadas';
    this.vch = { dialog: {}, radio: {}, street: {} };
    this.voiceCache = new Map();
  }

  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0.9;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4;
    this.master.connect(comp).connect(ctx.destination);
    this.sfx = ctx.createGain();
    this.sfx.gain.value = this.volSfx;
    this.sfx.connect(this.master);
    this.music = ctx.createGain();
    this.music.gain.value = this.volMusic;
    const radioFilter = ctx.createBiquadFilter();
    radioFilter.type = 'lowpass'; radioFilter.frequency.value = 6500;
    this.music.connect(radioFilter).connect(this.master);
    this.musicBus = ctx.createGain();
    this.musicBus.connect(this.music);
    // ruido blanco compartido
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.noiseBuf = buf;
    // distorsión para guitarras
    const curve = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) { const x = (i / 1023) * 2 - 1; curve[i] = Math.tanh(x * 6); }
    this.distCurve = curve;
    this.setupWind();
    this.setupEngine();
    this.setupSiren();
    this.enabled = true;
  }

  noise(dur) {
    const s = this.ctx.createBufferSource();
    s.buffer = this.noiseBuf;
    s.loop = dur > 2;
    s.loopStart = Math.random();
    return s;
  }

  posGain(pos, range = 120) {
    if (!pos) return 1;
    const d = Math.hypot(pos.x - this.listener.x, (pos.y || 0) - this.listener.y, pos.z - this.listener.z);
    return clamp(1 - d / range, 0, 1) ** 1.5;
  }

  env(g, t, a, peak, dec) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec);
  }

  // ---------- Efectos ----------
  burst({ t = null, dur = 0.2, freq = 1000, q = 1, type = 'bandpass', gain = 0.5, pos = null, range = 120, out = null, attack = 0.002 }) {
    if (!this.enabled) return;
    const ctx = this.ctx;
    const pg = this.posGain(pos, range);
    if (pg <= 0.001) return;
    t = t || ctx.currentTime;
    const n = this.noise(dur);
    const f = ctx.createBiquadFilter();
    f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain();
    this.env(g, t, attack, gain * pg, dur);
    n.connect(f).connect(g).connect(out || this.sfx);
    n.start(t, Math.random() * 1.5, dur + 0.1);
  }

  tone({ t = null, freq = 440, freq2 = null, dur = 0.2, type = 'sine', gain = 0.3, pos = null, range = 120, out = null, attack = 0.005, detune = 0 }) {
    if (!this.enabled) return;
    const ctx = this.ctx;
    const pg = this.posGain(pos, range);
    if (pg <= 0.001) return;
    t = t || ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (freq2) o.frequency.exponentialRampToValueAtTime(Math.max(1, freq2), t + dur);
    o.detune.value = detune;
    const g = ctx.createGain();
    this.env(g, t, attack, gain * pg, dur);
    o.connect(g).connect(out || this.sfx);
    o.start(t);
    o.stop(t + attack + dur + 0.05);
  }

  gun(kind, pos) {
    const heavy = kind === 'shotgun';
    this.burst({ dur: heavy ? 0.35 : 0.16, freq: heavy ? 700 : 1500, q: 0.6, type: 'lowpass', gain: heavy ? 1.1 : 0.8, pos, range: 220 });
    this.tone({ freq: heavy ? 110 : 160, freq2: 40, dur: heavy ? 0.25 : 0.12, type: 'triangle', gain: 0.6, pos, range: 220 });
  }
  click(pos) { this.tone({ freq: 1800, dur: 0.03, type: 'square', gain: 0.12, pos }); }
  punch(pos) { this.burst({ dur: 0.08, freq: 300, type: 'lowpass', gain: 0.8, pos }); this.tone({ freq: 90, freq2: 50, dur: 0.1, gain: 0.5, pos }); }
  swoosh(pos) { this.burst({ dur: 0.15, freq: 2500, q: 2, gain: 0.15, pos, attack: 0.05 }); }
  thud(pos, v = 0.5) { this.burst({ dur: 0.2, freq: 200, type: 'lowpass', gain: v, pos }); }
  crash(pos, v = 0.6) {
    this.burst({ dur: 0.35, freq: 900, q: 0.5, type: 'lowpass', gain: v, pos, range: 150 });
    this.burst({ dur: 0.25, freq: 4000, q: 3, gain: v * 0.4, pos, range: 150 });
  }
  door(pos) { this.burst({ dur: 0.1, freq: 250, type: 'lowpass', gain: 0.6, pos }); this.tone({ freq: 120, dur: 0.08, gain: 0.3, pos }); }
  // estruendo de fuegos artificiales (lejano, grave y con cola)
  boom(x, y, z) {
    const pos = { x, y, z };
    this.burst({ dur: 0.9, freq: 140, type: 'lowpass', gain: 0.55, pos, range: 900 });
    this.burst({ dur: 0.35, freq: 2600, q: 0.7, gain: 0.12, pos, range: 900, t: this.ctx && this.ctx.currentTime + 0.05 });
  }

  explosion(pos) {
    this.burst({ dur: 1.8, freq: 400, type: 'lowpass', q: 0.5, gain: 1.4, pos, range: 400 });
    this.tone({ freq: 70, freq2: 25, dur: 1.2, type: 'sine', gain: 1, pos, range: 400 });
  }
  splash(pos) { this.burst({ dur: 0.5, freq: 1200, q: 0.4, gain: 0.5, pos }); }
  pickup() { [880, 1320, 1760].forEach((f, i) => this.tone({ t: this.ctx && this.ctx.currentTime + i * 0.06, freq: f, dur: 0.12, type: 'square', gain: 0.12 })); }
  cash() { [1200, 1600].forEach((f, i) => this.tone({ t: this.ctx && this.ctx.currentTime + i * 0.05, freq: f, dur: 0.1, type: 'triangle', gain: 0.2 })); }
  beep() { this.tone({ freq: 1000, dur: 0.07, type: 'square', gain: 0.1 }); }
  step(pos) { this.burst({ dur: 0.05, freq: 600, type: 'lowpass', gain: 0.08, pos, range: 20 }); }

  // Fanfarria original de "misión superada"
  missionPassed() {
    if (!this.enabled) return;
    const t = this.ctx.currentTime + 0.05;
    const notes = [[0, 523, 0.18], [0.18, 659, 0.18], [0.36, 784, 0.18], [0.54, 1047, 0.5], [0.54, 659, 0.5], [0.54, 784, 0.5], [1.15, 988, 0.15], [1.3, 1047, 0.9], [1.3, 784, 0.9], [1.3, 523, 0.9]];
    for (const [dt, f, d] of notes) {
      this.tone({ t: t + dt, freq: f, dur: d, type: 'sawtooth', gain: 0.09, attack: 0.01 });
      this.tone({ t: t + dt, freq: f / 2, dur: d, type: 'square', gain: 0.05, attack: 0.01 });
    }
    [0, 0.54, 1.3].forEach((dt) => this.drum('kick', t + dt, 0.9, this.sfx));
  }
  missionFailed() {
    if (!this.enabled) return;
    const t = this.ctx.currentTime + 0.05;
    [[0, 392], [0.3, 370], [0.6, 349], [0.9, 262]].forEach(([dt, f]) => this.tone({ t: t + dt, freq: f, dur: dt > 0.8 ? 0.8 : 0.28, type: 'sawtooth', gain: 0.1 }));
  }
  wasted() {
    if (!this.enabled) return;
    const t = this.ctx.currentTime;
    this.tone({ t, freq: 220, freq2: 55, dur: 2.5, type: 'sawtooth', gain: 0.15 });
    this.drum('kick', t, 1, this.sfx);
  }

  // ---------- Viento (clave en Comodoro) ----------
  setupWind() {
    const ctx = this.ctx;
    const n = this.noise(10);
    n.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 500; f.Q.value = 0.7;
    const g = ctx.createGain();
    g.gain.value = 0;
    n.connect(f).connect(g).connect(this.sfx);
    n.start();
    this.wind = { f, g };
  }

  // ---------- Motor ----------
  setupEngine() {
    const ctx = this.ctx;
    const o1 = ctx.createOscillator(), o2 = ctx.createOscillator();
    o1.type = 'sawtooth'; o2.type = 'square';
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 400; f.Q.value = 3;
    const g = ctx.createGain();
    g.gain.value = 0;
    o1.connect(f); o2.connect(f);
    f.connect(g).connect(this.sfx);
    o1.start(); o2.start();
    this.engine = { o1, o2, f, g };
  }

  setupSiren() {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = 'square';
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1800;
    const g = ctx.createGain(); g.gain.value = 0;
    o.connect(f).connect(g).connect(this.sfx);
    o.start();
    this.siren = { o, g };
  }

  horn(v, on) {
    if (!this.enabled) return;
    if (on && !this.hornNode) {
      const ctx = this.ctx;
      const g = ctx.createGain(); g.gain.value = 0.12;
      const o1 = ctx.createOscillator(), o2 = ctx.createOscillator();
      o1.type = o2.type = 'square';
      const big = v && (v.type.style === 'bus' || v.type.style === 'tanker');
      o1.frequency.value = big ? 180 : v && v.type.bike ? 1400 : 400;
      o2.frequency.value = big ? 226 : v && v.type.bike ? 1400 : 500;
      const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2500;
      o1.connect(f); o2.connect(f); f.connect(g).connect(this.sfx);
      o1.start(); o2.start();
      this.hornNode = { o1, o2, g };
    } else if (!on && this.hornNode) {
      const h = this.hornNode;
      h.g.gain.setTargetAtTime(0, this.ctx.currentTime, 0.02);
      h.o1.stop(this.ctx.currentTime + 0.1); h.o2.stop(this.ctx.currentTime + 0.1);
      this.hornNode = null;
    }
  }

  // Actualización por frame
  update(dt, game) {
    if (!this.enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const cam = game.camera.position;
    this.listener = { x: cam.x, y: cam.y, z: cam.z };
    const env = game.env;
    // viento
    const p = game.player;
    const indoorsCar = p && p.vehicle && !p.vehicle.type.bike;
    const w = env.windSpeed;
    const wv = clamp((w - 4) / 30, 0, 1) * (indoorsCar ? 0.25 : 0.7) * (game.paused ? 0 : 1);
    this.wind.g.gain.setTargetAtTime(wv * 0.55, t, 0.3);
    this.wind.f.frequency.setTargetAtTime(300 + w * 18 + env.gust * 300, t, 0.3);
    // motor
    const v = p && p.vehicle;
    if (v && !v.dead && !v.type.bike || (v && v.key === 'enduro')) {
      const sp = Math.abs(v.forwardSpeed);
      const gear = Math.min(4, Math.floor(sp / (v.type.maxSpeed / 4.5)));
      const rpm = (sp - gear * (v.type.maxSpeed / 4.5)) / (v.type.maxSpeed / 4.5);
      const base = v.key === 'enduro' ? 70 : v.type.style === 'bus' || v.type.style === 'tanker' ? 32 : 42;
      const fr = base + rpm * base * 1.4 + gear * 6 + Math.abs(v.ctrl.throttle) * 10;
      this.engine.o1.frequency.setTargetAtTime(fr, t, 0.05);
      this.engine.o2.frequency.setTargetAtTime(fr * 0.5, t, 0.05);
      this.engine.f.frequency.setTargetAtTime(300 + Math.abs(v.ctrl.throttle) * 700 + rpm * 400, t, 0.05);
      this.engine.g.gain.setTargetAtTime(game.paused ? 0 : 0.09 + Math.abs(v.ctrl.throttle) * 0.08, t, 0.08);
    } else this.engine.g.gain.setTargetAtTime(0, t, 0.1);
    // sirena del patrullero más cercano con sirena
    let nearest = null, nd = 1e9;
    for (const c of game.vehicles) {
      if (!c.siren || c.dead) continue;
      const d = Math.hypot(c.pos.x - cam.x, c.pos.z - cam.z);
      if (d < nd) { nd = d; nearest = c; }
    }
    if (nearest && !game.paused) {
      const ph = (performance.now() * 0.001) % 2;
      this.siren.o.frequency.setTargetAtTime(ph < 1 ? 650 + ph * 500 : 1150 - (ph - 1) * 500, t, 0.02);
      this.siren.g.gain.setTargetAtTime(clamp(1 - nd / 200, 0, 1) * 0.07, t, 0.1);
    } else this.siren.g.gain.setTargetAtTime(0, t, 0.1);
    // radio
    this.scheduleRadio();
    // cortinas de Santiago Sánchez en las radios de música
    if (this.bus && this.radioIdx >= 0 && !game.paused) {
      const st = STATIONS[this.radioIdx];
      if (st && st.style !== 'talk' && st.style !== 'off' && st.style !== 'novishok') {
        this.bumperT -= dt;
        if (this.bumperT <= 0) {
          this.bumperT = 90 + Math.random() * 90;
          const pool = [...(BUMPERS[st.style] || []), ...BUMPERS.any];
          const line = pool[Math.floor(Math.random() * pool.length)];
          this.onTalk && this.onTalk(SANTIAGO, line);
          this.say(line, 'santiago', null, 'radio');
        }
      }
    }
    if (this.chaseAudio) this.chaseGain.gain.setTargetAtTime(game.paused ? 0 : 1, t, 0.1);
  }

  // ---------- Música de persecución (4 estrellas o más): Novishok ----------
  setChaseSongs(list) { this.chaseSongs = list || []; }

  startChase() {
    if (!this.enabled || this.chase) return;
    this.chase = true;
    const wanted = this.radioWanted;
    this.stopRadio(true);
    this.radioWanted = wanted;
    const songs = this.chaseSongs || [];
    if (songs.length) this.playChaseSong();
    else {
      // sin temas cargados: thrash generado en el momento
      this.bus = this.ctx.createGain();
      this.bus.gain.value = 1;
      this.bus.connect(this.musicBus);
      this.radioIdx = -2;
      this.newSong({ style: 'thrash' });
      this.nextNote = this.ctx.currentTime + 0.1;
      this.step = 0;
      this.onChase && this.onChase(null);
    }
  }

  playChaseSong() {
    const songs = this.chaseSongs || [];
    if (!songs.length || !this.chase) return;
    this.chaseIdx = this.chaseIdx === undefined ? Math.floor(Math.random() * songs.length) : (this.chaseIdx + 1) % songs.length;
    const s = songs[this.chaseIdx];
    const el = new window.Audio();
    el.src = s.url;
    el.preload = 'auto';
    const src = this.ctx.createMediaElementSource(el);
    const g = this.ctx.createGain();
    g.gain.value = 0.0001;
    g.gain.setTargetAtTime(1, this.ctx.currentTime, 0.4);
    src.connect(g).connect(this.musicBus);
    this.chaseAudio = el; this.chaseGain = g;
    el.onended = () => { this.releaseChaseAudio(); if (this.chase) this.playChaseSong(); };
    el.onerror = () => { this.releaseChaseAudio(); if (this.chase && songs.length > 1 && !this.chaseFailed) { this.chaseFailed = true; this.playChaseSong(); } };
    const p = el.play();
    if (p && p.catch) p.catch(() => {});
    this.onChase && this.onChase(s.title);
  }

  releaseChaseAudio() {
    if (!this.chaseAudio) return;
    const el = this.chaseAudio, g = this.chaseGain;
    this.chaseAudio = null; this.chaseGain = null;
    try { g.gain.setTargetAtTime(0, this.ctx.currentTime, 0.5); } catch (e) { /* nada */ }
    setTimeout(() => { try { el.pause(); el.removeAttribute('src'); el.load(); g.disconnect(); } catch (e) { /* nada */ } }, 1800);
  }

  // Pausa del juego: la música de persecución también se detiene
  setPaused(p) {
    if (this.pausedFlag === p) return;
    this.pausedFlag = p;
    if (p && this.ctx) { this.stopVoice('dialog'); this.stopVoice('street'); }
    if (this.chaseAudio) { if (p) this.chaseAudio.pause(); else { const q = this.chaseAudio.play(); if (q && q.catch) q.catch(() => {}); } }
    if (this.radioAudio) { if (p) this.radioAudio.pause(); else { const q = this.radioAudio.play(); if (q && q.catch) q.catch(() => {}); } }
    if (this.chase && this.bus && this.radioIdx === -2) this.bus.gain.setTargetAtTime(p ? 0 : 1, this.ctx.currentTime, 0.05);
  }

  stopChase() {
    if (!this.chase) return;
    this.chase = false;
    this.chaseFailed = false;
    this.releaseChaseAudio();
    if (this.radioIdx === -2) this.stopRadio(true);
    if (this.radioWanted >= 0) this.startRadio(this.radioWanted);
  }

  // ---------- Radios procedurales ----------
  stationName(i) { return STATIONS[i] ? STATIONS[i].name : ''; }
  stationColor(i) { return STATIONS[i] ? STATIONS[i].color : '#fff'; }

  startRadio(i) {
    if (!this.enabled) return;
    this.radioWanted = i;
    if (this.chase) return; // durante la persecución suena Novishok
    this.stopRadio(true);
    this.radioIdx = i;
    this.bumperT = 60 + Math.random() * 60;
    const st = STATIONS[i];
    if (!st || st.style === 'off') return;
    // estática al sintonizar
    this.burst({ dur: 0.35, freq: 3000, q: 0.3, gain: 0.25, out: this.musicBus });
    this.bus = this.ctx.createGain();
    this.bus.gain.value = 1;
    this.bus.connect(this.musicBus);
    // Novishok FM: los temas subidos en "Intro y música" (si no hay, thrash generado)
    if (st.style === 'novishok' && (this.chaseSongs || []).length) { this.song = null; this.playRadioSong(); return; }
    this.newSong(st.style === 'novishok' ? { style: 'thrash' } : st);
    if (st.style === 'novishok') this.onRadioSong && this.onRadioSong(null);
    this.nextNote = this.ctx.currentTime + 0.3;
    this.step = 0;
    if (st.style === 'talk') this.talk();
  }

  stationCount() { return STATIONS.length; }

  playRadioSong() {
    const songs = this.chaseSongs || [];
    if (!songs.length || !this.bus) return;
    this.radioSongIdx = this.radioSongIdx === undefined ? Math.floor(Math.random() * songs.length) : (this.radioSongIdx + 1) % songs.length;
    const song = songs[this.radioSongIdx];
    const el = new window.Audio();
    el.src = song.url;
    el.preload = 'auto';
    const bus = this.bus;
    try { this.ctx.createMediaElementSource(el).connect(bus); } catch (e) { /* sin ruteo: suena directo */ }
    this.radioAudio = el;
    el.onended = () => { if (this.radioAudio === el && this.bus === bus) this.playRadioSong(); };
    el.onerror = () => { if (this.radioAudio === el) this.radioAudio = null; };
    if (!this.pausedFlag) { const q = el.play(); if (q && q.catch) q.catch(() => {}); }
    this.onRadioSong && this.onRadioSong(song.title);
  }

  releaseRadioAudio() {
    const el = this.radioAudio;
    if (!el) return;
    this.radioAudio = null;
    setTimeout(() => { try { el.pause(); el.removeAttribute('src'); el.load(); } catch (e) { /* nada */ } }, 150);
  }

  stopRadio(keepWanted = false) {
    if (!keepWanted) this.radioWanted = -1;
    if (this.bus) {
      const b = this.bus;
      b.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      setTimeout(() => b.disconnect(), 400);
    }
    this.bus = null;
    this.radioIdx = -1;
    this.releaseRadioAudio();
    if (this.talkTimer) { clearTimeout(this.talkTimer); this.talkTimer = null; }
    if (this.ctx) this.stopVoice('radio');
    if (window.speechSynthesis) try { window.speechSynthesis.cancel(); } catch (e) { /* nada */ }
  }

  newSong(st) {
    const seed = Math.floor(Math.random() * 1e9);
    const r = new RNG(seed);
    const s = { style: st.style, r, bar: 0, bars: 48 + r.int(0, 3) * 8 };
    const minor = [0, 2, 3, 5, 7, 8, 11];
    const major = [0, 2, 4, 5, 7, 9, 11];
    if (st.style === 'cumbia') { s.bpm = r.range(92, 102); s.root = 45 + r.int(0, 5); s.scale = minor; s.prog = r.pick([[0, 3, 4, 0], [0, 6, 5, 4], [0, 3, 6, 4]]); s.sub = 4; }
    if (st.style === 'rock') { s.bpm = r.range(118, 138); s.root = 40 + r.int(0, 7); s.scale = r.chance(0.5) ? major : minor; s.prog = r.pick([[0, 4, 5, 3], [0, 3, 4, 4], [5, 3, 0, 4], [0, 6, 3, 4]]); s.sub = 4; }
    if (st.style === 'electro') { s.bpm = r.range(126, 132); s.root = 41 + r.int(0, 6); s.scale = minor; s.prog = r.pick([[0, 5, 2, 6], [0, 0, 5, 6], [0, 3, 5, 4]]); s.sub = 4; }
    if (st.style === 'folk') { s.bpm = r.range(58, 68); s.root = 45 + r.int(0, 4); s.scale = minor; s.prog = [0, 3, 4, 0]; s.sub = 6; }
    if (st.style === 'tango') { s.bpm = r.range(112, 122); s.root = 43 + r.int(0, 5); s.scale = minor; s.prog = r.pick([[0, 4, 4, 0], [0, 3, 4, 0], [0, 5, 3, 4]]); s.sub = 4; }
    if (st.style === 'talk') { s.bpm = 90; s.root = 48; s.scale = major; s.prog = [0, 3, 4, 0]; s.sub = 4; }
    if (st.style === 'thrash') { s.bpm = r.range(168, 186); s.root = 40; s.scale = [0, 1, 3, 5, 7, 8, 10]; s.prog = r.pick([[0, 0, 1, 0], [0, 5, 0, 6], [0, 0, 6, 5]]); s.sub = 4; s.bars = 64; }
    // motivo melódico de 2 compases
    s.motif = [];
    for (let i = 0; i < 16; i++) s.motif.push(r.chance(st.style === 'tango' ? 0.75 : 0.6) ? r.int(0, 9) : null);
    this.song = s;
  }

  midi(n) { return 440 * Math.pow(2, (n - 69) / 12); }
  deg(s, d, oct = 0) {
    const sc = s.scale;
    const o = Math.floor(d / 7);
    const i = ((d % 7) + 7) % 7;
    return s.root + sc[i] + 12 * (o + oct);
  }

  drum(kind, t, v, out) {
    const ctx = this.ctx;
    out = out || this.bus;
    if (!out) return;
    if (kind === 'kick') {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.18);
      this.env(g, t, 0.002, 0.9 * v, 0.28);
      o.connect(g).connect(out); o.start(t); o.stop(t + 0.35);
    } else if (kind === 'snare' || kind === 'clap') {
      this.burst({ t, dur: kind === 'clap' ? 0.12 : 0.16, freq: kind === 'clap' ? 1500 : 1900, q: 0.7, gain: 0.5 * v, out });
      if (kind === 'snare') this.tone({ t, freq: 190, freq2: 150, dur: 0.08, type: 'triangle', gain: 0.25 * v, out });
    } else if (kind === 'hat') {
      this.burst({ t, dur: 0.035, freq: 8000, type: 'highpass', gain: 0.22 * v, out });
    } else if (kind === 'ohat') {
      this.burst({ t, dur: 0.18, freq: 7500, type: 'highpass', gain: 0.18 * v, out });
    } else if (kind === 'guiro') {
      for (let k = 0; k < 3; k++) this.burst({ t: t + k * 0.018, dur: 0.02, freq: 3200, q: 3, gain: 0.25 * v, out });
    } else if (kind === 'conga') {
      this.tone({ t, freq: 240 * v, freq2: 190 * v, dur: 0.15, type: 'sine', gain: 0.35, out });
    } else if (kind === 'bombo') {
      this.tone({ t, freq: 95, freq2: 60, dur: 0.35, type: 'sine', gain: 0.7 * v, out });
      this.burst({ t, dur: 0.05, freq: 800, type: 'lowpass', gain: 0.3 * v, out });
    } else if (kind === 'aro') {
      this.burst({ t, dur: 0.03, freq: 2500, q: 2, gain: 0.35 * v, out });
    }
  }

  inst(kind, t, note, dur, v = 1) {
    const ctx = this.ctx;
    const out = this.bus;
    if (!out) return;
    const f = this.midi(note);
    if (kind === 'bass') {
      const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = f;
      const o2 = ctx.createOscillator(); o2.type = 'sawtooth'; o2.frequency.value = f;
      const flt = ctx.createBiquadFilter(); flt.type = 'lowpass'; flt.frequency.value = 500;
      const g = ctx.createGain(); this.env(g, t, 0.005, 0.35 * v, dur);
      o.connect(flt); o2.connect(flt); flt.connect(g).connect(out);
      o.start(t); o2.start(t); o.stop(t + dur + 0.1); o2.stop(t + dur + 0.1);
    } else if (kind === 'organ' || kind === 'lead') {
      const o = ctx.createOscillator(); o.type = kind === 'organ' ? 'square' : 'sawtooth'; o.frequency.value = f;
      const o2 = ctx.createOscillator(); o2.type = 'square'; o2.frequency.value = f * 1.005;
      const lfo = ctx.createOscillator(); lfo.frequency.value = 5.5; const lg = ctx.createGain(); lg.gain.value = f * 0.012;
      lfo.connect(lg); lg.connect(o.frequency); lg.connect(o2.frequency);
      const flt = ctx.createBiquadFilter(); flt.type = 'lowpass'; flt.frequency.value = kind === 'organ' ? 2200 : 3000;
      const g = ctx.createGain(); this.env(g, t, 0.01, 0.075 * v, dur);
      o.connect(flt); o2.connect(flt); flt.connect(g).connect(out);
      [o, o2, lfo].forEach((x) => { x.start(t); x.stop(t + dur + 0.1); });
    } else if (kind === 'pluck') {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f;
      const flt = ctx.createBiquadFilter(); flt.type = 'lowpass'; flt.Q.value = 2;
      flt.frequency.setValueAtTime(f * 6, t); flt.frequency.exponentialRampToValueAtTime(f * 1.2, t + 0.25);
      const g = ctx.createGain(); this.env(g, t, 0.002, 0.14 * v, dur);
      o.connect(flt).connect(g).connect(out); o.start(t); o.stop(t + dur + 0.1);
    } else if (kind === 'power') {
      const flt = ctx.createBiquadFilter(); flt.type = 'lowpass'; flt.frequency.value = 2600;
      const ws = ctx.createWaveShaper(); ws.curve = this.distCurve;
      const g = ctx.createGain(); this.env(g, t, 0.003, 0.07 * v, dur);
      for (const iv of [0, 7, 12]) {
        const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = this.midi(note + iv);
        o.connect(ws); o.start(t); o.stop(t + dur + 0.1);
      }
      ws.connect(flt).connect(g).connect(out);
    } else if (kind === 'stab') {
      const flt = ctx.createBiquadFilter(); flt.type = 'lowpass'; flt.Q.value = 6;
      flt.frequency.setValueAtTime(3500, t); flt.frequency.exponentialRampToValueAtTime(400, t + dur);
      const g = ctx.createGain(); this.env(g, t, 0.003, 0.06 * v, dur);
      for (const iv of [0, 3, 7, 10]) {
        const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = this.midi(note + iv);
        o.connect(flt); o.start(t); o.stop(t + dur + 0.1);
      }
      flt.connect(g).connect(out);
    } else if (kind === 'bandoneon') {
      const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = f;
      const o2 = ctx.createOscillator(); o2.type = 'sawtooth'; o2.frequency.value = f * 2.002;
      const flt = ctx.createBiquadFilter(); flt.type = 'bandpass'; flt.frequency.value = 1400; flt.Q.value = 0.8;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.12 * v, t + 0.06); g.gain.setValueAtTime(0.12 * v, t + dur * 0.8); g.gain.linearRampToValueAtTime(0.0001, t + dur);
      o.connect(flt); o2.connect(flt); flt.connect(g).connect(out);
      o.start(t); o2.start(t); o.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
    } else if (kind === 'piano') {
      const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = f;
      const g = ctx.createGain(); this.env(g, t, 0.002, 0.12 * v, dur);
      o.connect(g).connect(out); o.start(t); o.stop(t + dur + 0.1);
    }
  }

  scheduleRadio() {
    if (!this.bus || !this.song) return;
    const s = this.song;
    const ctx = this.ctx;
    const spb = 60 / s.bpm; // segundos por negra
    const stepDur = s.style === 'folk' ? spb / 2 : spb / 4;
    const stepsPerBar = s.style === 'folk' ? 6 : 16;
    while (this.nextNote < ctx.currentTime + 0.25) {
      const t = this.nextNote;
      const st = this.step % stepsPerBar;
      const bar = Math.floor(this.step / stepsPerBar);
      const chordDeg = s.prog[bar % s.prog.length];
      const r = s.r;
      const intro = bar < 2;
      if (bar >= s.bars) {
        this.newSong(this.radioIdx === -2 ? { style: 'thrash' } : STATIONS[this.radioIdx]);
        this.step = 0;
        this.nextNote += spb * 2;
        this.jingle(this.nextNote - spb * 1.8);
        continue;
      }
      const root = this.deg(s, chordDeg, 0);
      const mel = s.motif[(st + (bar % 2) * 8) % 16];
      if (s.style === 'cumbia') {
        if (st % 2 === 0) this.drum('guiro', t, st % 4 === 0 ? 1 : 0.6);
        if (st === 0 || st === 8) this.drum('kick', t, 0.6);
        if (st === 6 || st === 14) this.drum('conga', t, 1.1);
        if (st === 7) this.drum('conga', t, 0.9);
        if (!intro) {
          if (st === 0) this.inst('bass', t, root - 12, spb * 0.9);
          if (st === 6) this.inst('bass', t, root - 5, spb * 0.4);
          if (st === 8) this.inst('bass', t, root - 12 + 7, spb * 0.9);
          if (st === 14) this.inst('bass', t, root - 12, spb * 0.4);
          if (st % 4 === 2) { this.inst('organ', t, root + 12, spb * 0.3, 0.5); this.inst('organ', t, this.deg(s, chordDeg + 2, 1), spb * 0.3, 0.5); }
          if (mel !== null && st % 2 === 0 && bar % 8 >= 2) this.inst('lead', t, this.deg(s, mel + (bar % 4 === 3 ? 2 : 0), 2), stepDur * 1.8, 1);
        }
      } else if (s.style === 'rock') {
        if (st === 0 || st === 8 || (st === 10 && r.chance(0.5))) this.drum('kick', t, 0.9);
        if (st === 4 || st === 12) this.drum('snare', t, 1);
        if (st % 2 === 0) this.drum('hat', t, 0.8);
        if (!intro || st % 4 === 0) {
          if (st % 2 === 0) this.inst('power', t, root - 12, stepDur * 1.9, st % 4 === 0 ? 1 : 0.7);
          if (st % 2 === 0) this.inst('bass', t, root - 24, stepDur * 1.8);
          if (mel !== null && bar % 16 >= 8 && st % 2 === 0) this.inst('lead', t, this.deg(s, mel, 1), stepDur * 2, 0.9);
        }
      } else if (s.style === 'electro') {
        if (st % 4 === 0) this.drum('kick', t, 1);
        if (st % 4 === 2) this.drum('ohat', t, 0.9);
        if (st === 4 || st === 12) this.drum('clap', t, 0.8);
        if (st % 2 === 1) this.drum('hat', t, 0.4);
        if (!intro) {
          if (st % 4 === 2) this.inst('bass', t, root - 12, stepDur * 1.6);
          if (st === 0 || st === 6 || st === 12) this.inst('stab', t, root, stepDur * 2.5);
          if (mel !== null && bar % 8 >= 4) this.inst('lead', t, this.deg(s, mel, 1), stepDur, 0.7);
        }
      } else if (s.style === 'folk') {
        // chacarera en 6/8: bombo legüero y guitarra
        if (st === 0) this.drum('bombo', t, 1);
        if (st === 2 || st === 3) this.drum('aro', t, 0.8);
        if (st === 5) this.drum('bombo', t, 0.8);
        const chord = [0, 2, 4].map((k) => this.deg(s, chordDeg + k, 0));
        if (st === 0) this.inst('bass', t, root - 12, spb * 1.2);
        if (st !== 1) this.inst('pluck', t, chord[st % 3] + (st > 3 ? 12 : 0), stepDur * 1.5, 0.9);
        if (mel !== null && !intro && bar % 8 >= 2) this.inst('organ', t, this.deg(s, mel, 1), stepDur * 1.8, 0.5);
      } else if (s.style === 'tango') {
        if (st % 4 === 0) {
          this.inst('bass', t, root - 12, spb * 0.35, st === 0 ? 1.2 : 0.9);
          const chord = [0, 2, 4].map((k) => this.deg(s, chordDeg + k, 0));
          chord.forEach((n) => this.inst('piano', t, n + 12, spb * 0.3, 0.8));
        }
        if (st === 14 && bar % 2 === 1) this.inst('bass', t, root - 13, spb * 0.2, 0.7);
        if (!intro && mel !== null && st % 2 === 0) this.inst('bandoneon', t, this.deg(s, mel, 1), stepDur * (st % 4 === 0 ? 2.8 : 1.6), 1);
      } else if (s.style === 'thrash') {
        // thrash groove: doble bombo, chugs apagados con palma y galope
        const section = Math.floor(bar / 4) % 4;
        const riff = [0, 0, 1, 0, 0, 3, 0, 1, 0, 0, 6, 0, 0, 5, 3, 1];
        if (section === 2) { // medio tiempo, groove
          if (st === 0 || st === 6 || st === 10) this.drum('kick', t, 1);
          if (st === 8) this.drum('snare', t, 1.1);
          if (st % 4 === 0) this.drum('ohat', t, 0.6);
          if (st === 0 || st === 3 || st === 6 || st === 10 || st === 12) this.inst('power', t, root - 12 + (st === 12 ? 1 : 0), stepDur * 2.5, 1);
          if (st === 0 || st === 6 || st === 10) this.inst('bass', t, root - 24, stepDur * 2);
        } else {
          this.drum('kick', t, st % 2 ? 0.75 : 1);
          if (st === 4 || st === 12) this.drum('snare', t, 1.1);
          if (st % 2 === 0) this.drum('hat', t, 0.6);
          if (st === 0 && bar % 4 === 0) this.drum('ohat', t, 1);
          const gallop = section === 1 ? (st % 4 !== 1) : true;
          if (gallop) {
            const n = root - 12 + (section === 3 ? riff[st] : (st % 4 === 0 ? riff[(st + bar) % 16] : 0));
            this.inst('power', t, n, stepDur * 0.7, st % 4 === 0 ? 1 : 0.65);
          }
          if (st % 2 === 0) this.inst('bass', t, root - 24 + (section === 3 ? riff[st] : 0), stepDur * 0.9);
        }
      } else if (s.style === 'talk') {
        // música de fondo muy suave
        if (st === 0) this.inst('piano', t, root, spb * 3, 0.25);
      }
      this.nextNote += stepDur;
      this.step++;
    }
  }

  jingle(t) {
    if (!this.bus) return;
    const base = 72;
    [0, 4, 7, 12].forEach((iv, i) => this.inst('lead', t + i * 0.12, base + iv, 0.2, 0.8));
  }

  talk() {
    if (this.radioIdx < 0 || STATIONS[this.radioIdx].style !== 'talk') return;
    this.talkIdx = ((this.talkIdx === undefined ? Math.floor(Math.random() * TALK.length) : this.talkIdx) + 1) % TALK.length;
    const line = TALK[this.talkIdx];
    this.onTalk && this.onTalk(SANTIAGO, line);
    const dur = this.say(line, 'santiago', null, 'radio');
    this.talkTimer = setTimeout(() => this.talk(), dur ? (dur + 2.5 + Math.random() * 3) * 1000 : 12000 + Math.random() * 6000);
  }

  // ---------- Voces ----------
  // Frases grabadas (tools/voz): radio, anuncios, gente para hablar, misiones y gritos de la
  // calle. Lo que no está grabado (textos armados en el momento) usa la voz del navegador si se
  // eligió esa opción.
  hasVoice(who, text) { return !!VOZ_IDX[voiceKey(who, text)]; }

  loadVoice(key, e) {
    let p = this.voiceCache.get(key);
    if (!p) {
      const bytes = VOZ_BIN.slice(e[0], e[0] + e[1]);
      p = this.ctx.decodeAudioData(bytes.buffer).catch(() => null);
      this.voiceCache.set(key, p);
      if (this.voiceCache.size > 24) this.voiceCache.delete(this.voiceCache.keys().next().value);
    }
    return p;
  }

  // Devuelve cuántos segundos dura (0 si no se dice nada)
  say(text, who, pos = null, channel = 'dialog') {
    if (!this.enabled || this.voiceMode === 'no' || !text) return 0;
    const key = voiceKey(who, text), e = VOZ_IDX[key];
    if (e && this.voiceMode === 'grabadas') { this.playVoice(key, e, pos, channel); return e[2]; }
    if (this.voiceMode === 'navegador' && channel !== 'street') { this.ttsSay(text, who, channel); return 0.4 + text.length / 14; }
    return 0;
  }

  // lo que dice alguien en una misión (por el nombre del subtítulo)
  sayAs(name, text) { return this.say(text, SPEAKERS[name] || 'vecino'); }

  playVoice(key, e, pos, channel) {
    const ch = this.vch[channel];
    this.stopVoice(channel);
    const token = ch.token = (ch.token || 0) + 1;
    this.loadVoice(key, e).then((buf) => {
      if (!buf || ch.token !== token || !this.enabled) return;
      const ctx = this.ctx;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const g = ctx.createGain();
      g.gain.value = channel === 'radio' ? 1.25 : channel === 'street' ? 0.9 * this.posGain(pos, 35) : (pos ? 0.35 + 0.65 * this.posGain(pos, 30) : 1);
      src.connect(g).connect(channel === 'radio' ? this.music : this.sfx);
      src.start();
      ch.src = src;
      // la música baja mientras alguien habla
      if (channel !== 'street') this.duck(true);
      src.onended = () => { if (ch.src === src) { ch.src = null; if (channel !== 'street' && !this.vch.dialog.src && !this.vch.radio.src) this.duck(false); } };
    });
  }

  stopVoice(channel) {
    const ch = this.vch[channel];
    if (ch && ch.src) { try { ch.src.onended = null; ch.src.stop(); } catch (e) { /* ya terminó */ } ch.src = null; }
    if (ch) ch.token = (ch.token || 0) + 1;
    if (!this.vch.dialog.src && !this.vch.radio.src && this.musicBus) this.duck(false);
  }

  duck(on) {
    if (!this.musicBus) return;
    this.musicBus.gain.setTargetAtTime(on ? 0.3 : 1, this.ctx.currentTime, on ? 0.08 : 0.4);
  }

  // Grito de un peatón (solo frases grabadas y si está cerca)
  pedSay(ped, text) {
    if (!this.enabled || this.voiceMode !== 'grabadas' || this.vch.dialog.src) return;
    const now = performance.now();
    if (now - (this.lastStreet || 0) < 1500) return;
    const d = Math.hypot(ped.pos.x - this.listener.x, ped.pos.z - this.listener.z);
    if (d > 28) return;
    const who = ped.kind === 'cana' ? 'cana' : ped.kind === 'cheto' ? 'cheto' : 'vecino';
    const e = VOZ_IDX[voiceKey(who, text)];
    if (!e) return;
    this.lastStreet = now;
    this.playVoice(voiceKey(who, text), e, ped.pos, 'street');
  }

  // Voz del navegador: la mejor en castellano que haya (primero rioplatense y las "naturales")
  bestVoice() {
    if (this._voice !== undefined && this._voiceN === speechSynthesis.getVoices().length) return this._voice;
    const vs = speechSynthesis.getVoices();
    this._voiceN = vs.length;
    let best = null, bs = -1;
    for (const v of vs) {
      if (!/^es/i.test(v.lang)) continue;
      let s = 1;
      if (/AR/i.test(v.lang)) s += 6; else if (/419|US|MX|CL|UY|CO/i.test(v.lang)) s += 3;
      if (/natural|neural|online|premium|enhanced/i.test(v.name)) s += 5;
      if (/google/i.test(v.name)) s += 2;
      if (s > bs) { bs = s; best = v; }
    }
    this._voice = best;
    return best;
  }

  ttsSay(text, who, channel) {
    if (!window.speechSynthesis) return;
    try {
      if (channel !== 'radio') window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = this.bestVoice();
      if (v) u.voice = v;
      u.lang = v ? v.lang : 'es-AR';
      const P = { santiago: 0.85, tenpesos: 0.6, petroca: 0.8, viejo: 0.7, gordopin: 1.1, rosa: 1.2, locutora: 1.15, narrador: 1 };
      u.pitch = P[who] !== undefined ? P[who] : 0.95;
      u.rate = who === 'viejo' || who === 'rosa' ? 0.95 : 1.05;
      u.volume = channel === 'radio' ? this.volMusic : this.volSfx;
      window.speechSynthesis.speak(u);
    } catch (e) { /* sin voz */ }
  }

  setVolumes(music, sfx) {
    this.volMusic = music; this.volSfx = sfx;
    if (this.music) this.music.gain.value = music;
    if (this.sfx) this.sfx.gain.value = sfx;
  }
}

export { STATIONS };
