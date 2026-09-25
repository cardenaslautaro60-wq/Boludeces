// Sonido 100% sintetizado con WebAudio: efectos, motor, viento, sirenas y radios procedurales.
import { clamp, rand, RNG } from '../util.js';

const STATIONS = [
  { name: 'Radio Cumbia Villera 104.5', style: 'cumbia', color: '#ff5fd0' },
  { name: 'FM Rock del Golfo 98.3', style: 'rock', color: '#ff8a2a' },
  { name: 'Boliche FM 101.1', style: 'electro', color: '#3ae8ff' },
  { name: 'Radio Chacarera Patagónica', style: 'folk', color: '#e8d23a' },
  { name: 'Tango del Viento AM 1210', style: 'tango', color: '#e84a4a' },
  { name: 'La Ciudad Perdida — con Santiago Sánchez', style: 'talk', color: '#8aff6a' },
  { name: 'Radio apagada', style: 'off', color: '#aaaaaa' },
];

// "La Ciudad Perdida" (1992-2016): el programa de Santiago Sánchez, humor para mirar la realidad
// desde otro lado y criticar al poder. Estos textos son ficción escrita en homenaje.
export const SANTIAGO = 'Santiago Sánchez';
const TALK = [
  'Buenas noches, Comodoro. Esto es La Ciudad Perdida. Una ciudad que se pierde todos los días un poco, sobre todo cuando sopla del Oeste.',
  'Dicen que Comodoro es la Capital Nacional del Petróleo. Del petróleo, sí. De la capital, ni noticias.',
  'Sección filosofía cotidiana: si una bolsa de La Anómala vuela del Km 3 a Rada Tilly, ¿cambia de barrio o cambia de clase social?',
  'Don Crudo anunció que va a perforar donde haya petróleo. O sea, en cualquier lado donde viva alguien que no pueda pagar un abogado.',
  'El comisario Tenpesos dice que va a limpiar el Centro. Empezó por los bolsillos de los malabaristas. Yo sé de qué me río.',
  'Informe del tránsito: la Ruta 3 por el Chenque, cortada. Si llegás tarde al laburo, decí que fue el cerro. Es la única excusa que nadie discute.',
  'El viento de hoy viene con ráfagas de ciento veinte. Técnicamente no es viento: es la Patagonia pidiéndote amablemente que te vayas.',
  'Llamó un oyente del barrio 9 de Julio: pregunta si es cierto que quieren perforar La Madriguera. Tranquilo: primero tienen que encontrar el arco.',
  'En Comodoro hay dos estaciones del año: la del viento y la de esperar que pare el viento.',
  'El boom petrolero trajo chatas nuevas, alquileres imposibles y una pregunta filosófica: ¿se puede ser feliz con sueldo de boca de pozo? Consulten al Petroca.',
  'Sección "el poder explicado para chicos": el poder es cuando uno decide dónde se perfora y otro tiene que decidir dónde vive. Casi nunca es la misma persona.',
  'Nos escribe una señora de Rada Tilly: "mi hijo anda con una patota". Señora, eso no es una patota: es un club náutico con remeras violetas.',
  'Un minuto de silencio por los paraguas de Comodoro, que murieron dignamente en cumplimiento del deber.',
  'Estás escuchando La Ciudad Perdida: radio para leer, para pensar y para reírse de lo que haya que reírse. Y de lo otro también.',
  'El humor no es contar chistes. El humor es mirar la realidad desde otro lado. Por ejemplo, desde arriba del Chenque, que es donde te deja la cana.',
  'Dato científico: el comodorense camina inclinado treinta grados hacia el Oeste. No es mala postura. Es experiencia.',
  'La Municipalidad informa que las bolsas enganchadas en los alambrados ya son patrimonio cultural. Se ruega no tocarlas.',
  '¿Por qué los malabaristas trabajan en el semáforo? Porque es el único lugar de la ciudad donde todos, por un minuto, se quedan quietos y miran.',
  'Pregunta del día: si el Petroca cobra el bono y lo gasta en un fin de semana en Buenos Aires, ¿el bono vuelve alguna vez al Chubut?',
  'Hoy en el Centro, el comisario Tenpesos declaró que la seguridad está garantizada. La suya, se entiende.',
  'A los que dicen que en Comodoro no pasa nada: acá pasa todo. Lo que pasa es que pasa volando.',
  'Parte meteorológico: nublado en el Centro, despejado en Rada Tilly, y en el Km 8 no sabemos porque se voló el anemómetro.',
  'Se viene el clásico Newbery–Huracán. Recomendación: no discutan en la Costanera, que el viento se lleva los argumentos.',
  'Llegamos al final del bloque. Gracias por perderse con nosotros. Ya volvemos a perdernos. Yo sé de qué me río.',
];
const BUMPERS = {
  cumbia: ['Acá Santiago Sánchez. Les dejo cumbia, que es lo único que tapa el ruido del viento.', 'Cumbia en Comodoro: ni el temporal la para.'],
  rock: ['Rock del Golfo. Si el rock nacional es la banda sonora de la bronca, en Comodoro tenemos para rato.', 'Subile el volumen, que afuera sopla fuerte.'],
  electro: ['Boliche FM: para los que salen a las tres de la mañana y vuelven cuando para el viento. O sea, el martes.'],
  folk: ['Chacarera. El único ritmo que las cigüeñas de la meseta bailan sin parar.'],
  tango: ['Tango, porque en Comodoro también hay nostalgia. Y casi toda viene de otra provincia.'],
  any: ['Te habla Santiago Sánchez. Seguí escuchando la radio, que afuera está peor.', 'La Ciudad Perdida, todas las noches. Perderse también es una forma de llegar.'],
};

export class Audio {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.radioIdx = -1;
    this.volMusic = 0.55;
    this.volSfx = 0.8;
    this.listener = { x: 0, y: 0, z: 0 };
    this.useTTS = false;
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
      if (st && st.style !== 'talk' && st.style !== 'off') {
        this.bumperT -= dt;
        if (this.bumperT <= 0) {
          this.bumperT = 90 + Math.random() * 90;
          const pool = [...(BUMPERS[st.style] || []), ...BUMPERS.any];
          this.onTalk && this.onTalk(SANTIAGO, pool[Math.floor(Math.random() * pool.length)]);
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
    if (this.chaseAudio) { if (p) this.chaseAudio.pause(); else { const q = this.chaseAudio.play(); if (q && q.catch) q.catch(() => {}); } }
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
    this.newSong(st);
    this.nextNote = this.ctx.currentTime + 0.3;
    this.step = 0;
    if (st.style === 'talk') this.talk();
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
    if (this.talkTimer) { clearTimeout(this.talkTimer); this.talkTimer = null; }
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
    if (this.useTTS && window.speechSynthesis) {
      try {
        const u = new SpeechSynthesisUtterance(line);
        u.lang = 'es-AR'; u.rate = 1.05; u.volume = this.volMusic;
        window.speechSynthesis.speak(u);
      } catch (e) { /* sin voz */ }
    }
    this.talkTimer = setTimeout(() => this.talk(), 12000 + Math.random() * 6000);
  }

  speak(text, pitch = 1, rate = 1.05) {
    if (!this.useTTS || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'es-AR'; u.pitch = pitch; u.rate = rate; u.volume = this.volSfx;
      window.speechSynthesis.speak(u);
    } catch (e) { /* nada */ }
  }

  setVolumes(music, sfx) {
    this.volMusic = music; this.volSfx = sfx;
    if (this.music) this.music.gain.value = music;
    if (this.sfx) this.sfx.gain.value = sfx;
  }
}

export { STATIONS };
