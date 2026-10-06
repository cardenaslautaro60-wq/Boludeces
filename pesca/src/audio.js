'use strict';
// Sonido sintetizado con WebAudio (sin archivos): efectos, olas, gaviotas y tres músicas (isla, jefe y casino).

const AUD = { ctx: null, master: null, sfx: null, mus: null, amb: null, ruido: null, modo: null, paso: 0, prox: 0, timer: 0, vol: 0.7, listo: false, gaviota: 8, grillo: 0 };

function iniciarAudio() {
  if (AUD.ctx) { if (AUD.ctx.state === 'suspended') AUD.ctx.resume(); return; }
  try {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    const c = (AUD.ctx = new C());
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4;
    AUD.master = c.createGain();
    AUD.master.gain.value = AUD.vol;
    AUD.master.connect(comp); comp.connect(c.destination);
    AUD.sfx = c.createGain(); AUD.sfx.gain.value = 1; AUD.sfx.connect(AUD.master);
    AUD.mus = c.createGain(); AUD.mus.gain.value = 0.0; AUD.mus.connect(AUD.master);
    AUD.amb = c.createGain(); AUD.amb.gain.value = 0.0; AUD.amb.connect(AUD.master);
    // ruido blanco de 2 s
    const len = c.sampleRate * 2;
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    AUD.ruido = buf;
    AUD.listo = true;
    iniciarAmbiente();
    aplicarVolumenes();
    AUD.timer = setInterval(secuenciador, 30);
    if (AUD.modo) AUD.paso = 0;
  } catch (e) { AUD.ctx = null; }
}

function aplicarVolumenes() {
  if (!AUD.ctx) return;
  const t = AUD.ctx.currentTime;
  AUD.sfx.gain.setTargetAtTime(G.ajustes.sonido ? 1 : 0, t, 0.05);
  AUD.amb.gain.setTargetAtTime(G.ajustes.sonido ? 0.5 : 0, t, 0.3);
  AUD.mus.gain.setTargetAtTime(G.ajustes.musica && G.ajustes.sonido && AUD.modo ? 0.55 : 0, t, 0.4);
}

function tono(f, dur, tipo = 'sine', vol = 0.15, o = {}) {
  if (!AUD.ctx || !AUD.listo) return;
  const c = AUD.ctx, t0 = (o.t0 || c.currentTime) + (o.delay || 0);
  const osc = c.createOscillator(), g = c.createGain();
  osc.type = tipo;
  osc.frequency.setValueAtTime(f, t0);
  if (o.slide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.slide), t0 + dur);
  if (o.vib) { const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = o.vib[0]; lg.gain.value = o.vib[1]; l.connect(lg); lg.connect(osc.frequency); l.start(t0); l.stop(t0 + dur + 0.05); }
  const a = o.attack === undefined ? 0.004 : o.attack;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t0 + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  g.connect(o.dest || AUD.sfx);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}
function ruido(dur, vol, o = {}) {
  if (!AUD.ctx || !AUD.listo) return;
  const c = AUD.ctx, t0 = (o.t0 || c.currentTime) + (o.delay || 0);
  const src = c.createBufferSource();
  src.buffer = AUD.ruido;
  const fl = c.createBiquadFilter();
  fl.type = o.tipo || 'lowpass';
  fl.frequency.setValueAtTime(o.f || 1000, t0);
  if (o.slide) fl.frequency.exponentialRampToValueAtTime(Math.max(30, o.slide), t0 + dur);
  fl.Q.value = o.q || 0.7;
  const g = c.createGain();
  const a = o.attack === undefined ? 0.003 : o.attack;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t0 + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(fl); fl.connect(g); g.connect(o.dest || AUD.sfx);
  src.start(t0, Math.random() * 1.5);
  src.stop(t0 + dur + 0.05);
}
const NOTA = (n) => 440 * Math.pow(2, (n - 69) / 12);

const SFX = {
  splash() { ruido(0.28, 0.2, { tipo: 'bandpass', f: 1500, slide: 380, q: 0.8 }); tono(320, 0.18, 'sine', 0.14, { slide: 110 }); },
  lanzar() { ruido(0.34, 0.14, { tipo: 'bandpass', f: 500, slide: 2400, q: 0.9 }); ruido(0.3, 0.08, { tipo: 'highpass', f: 1600, delay: 0.1 }); },
  recoger() { for (let i = 0; i < 5; i++) tono(1600 + i * 80, 0.02, 'square', 0.04, { delay: i * 0.045 }); ruido(0.2, 0.05, { tipo: 'highpass', f: 2200 }); },
  tiron() { tono(540, 0.1, 'sine', 0.16, { slide: 340 }); ruido(0.08, 0.06, { tipo: 'bandpass', f: 900 }); },
  pique() { tono(880, 0.16, 'triangle', 0.26); tono(1175, 0.2, 'triangle', 0.26, { delay: 0.1 }); tono(120, 0.2, 'sine', 0.3, { slide: 60 }); ruido(0.15, 0.12, { f: 600 }); },
  clavar() { ruido(0.12, 0.2, { tipo: 'highpass', f: 2000 }); tono(240, 0.1, 'square', 0.14, { slide: 120 }); },
  carretel(T = 0.5) { tono(1100 + T * 1400, 0.018, 'square', 0.035); },
  aviso() { tono(700, 0.24, 'sawtooth', 0.16, { slide: 380 }); tono(700, 0.24, 'sawtooth', 0.1, { slide: 380, delay: 0.14 }); },
  corte() { ruido(0.18, 0.28, { tipo: 'highpass', f: 3000 }); tono(900, 0.3, 'sawtooth', 0.14, { slide: 90 }); },
  sacar() { ruido(0.3, 0.18, { tipo: 'bandpass', f: 800, slide: 2600 }); tono(260, 0.25, 'sine', 0.14, { slide: 520 }); },
  captura(r = 0) {
    const base = [60, 62, 64, 67, 69];
    const seq = [[0], [0, 4], [0, 4, 7], [0, 4, 7, 12], [0, 4, 7, 12, 16]][clamp(r, 0, 4)];
    seq.forEach((s, i) => tono(NOTA(base[Math.min(4, r)] + 12 + s), 0.28, 'triangle', 0.2, { delay: i * 0.075 }));
    if (r >= 3) tono(NOTA(96), 0.6, 'sine', 0.08, { delay: 0.3 });
  },
  moneda() { tono(1318, 0.09, 'square', 0.1); tono(1760, 0.2, 'square', 0.1, { delay: 0.07 }); },
  comprar() { tono(660, 0.06, 'square', 0.1); tono(990, 0.1, 'square', 0.1, { delay: 0.06 }); ruido(0.05, 0.05, { tipo: 'highpass', f: 3000 }); },
  vender() { for (let i = 0; i < 4; i++) { tono(1318 + i * 220, 0.08, 'square', 0.08, { delay: i * 0.06 }); } },
  error() { tono(190, 0.1, 'square', 0.12); tono(160, 0.14, 'square', 0.12, { delay: 0.1 }); },
  click() { tono(820, 0.03, 'triangle', 0.1); },
  comer() { for (let i = 0; i < 3; i++) ruido(0.07, 0.2, { tipo: 'bandpass', f: 1200 + i * 150, delay: i * 0.1, q: 1.4 }); },
  curar() { [72, 76, 79].forEach((n, i) => tono(NOTA(n), 0.32, 'sine', 0.16, { delay: i * 0.09 })); },
  hurt() { ruido(0.12, 0.28, { f: 500 }); tono(200, 0.22, 'sawtooth', 0.18, { slide: 70 }); },
  tirar() { ruido(0.16, 0.14, { tipo: 'bandpass', f: 900, slide: 3000 }); },
  impacto() { ruido(0.1, 0.3, { f: 700 }); tono(150, 0.15, 'square', 0.2, { slide: 60 }); },
  explosion() { ruido(0.9, 0.5, { f: 1400, slide: 60, q: 0.5 }); tono(95, 0.7, 'sine', 0.5, { slide: 28 }); tono(60, 0.5, 'sawtooth', 0.2, { slide: 30 }); },
  mecha() { ruido(0.14, 0.07, { tipo: 'highpass', f: 3500 }); },
  jefeCerca() { tono(55, 1.4, 'sine', 0.4, { vib: [6, 4] }); tono(82, 1.2, 'sawtooth', 0.12, { vib: [5, 6] }); },
  rugido() { tono(130, 0.9, 'sawtooth', 0.3, { slide: 55, vib: [14, 10] }); ruido(0.9, 0.25, { tipo: 'bandpass', f: 400, slide: 120, q: 1.2 }); tono(70, 0.9, 'square', 0.14, { slide: 40 }); },
  telegrafo() { tono(300, 0.1, 'triangle', 0.08, { slide: 600 }); },
  jefeMuere() { SFX.rugido(); for (let i = 0; i < 6; i++) tono(NOTA(76 - i * 3), 0.4, 'triangle', 0.16, { delay: 0.5 + i * 0.13 }); ruido(1.1, 0.35, { f: 900, slide: 50, delay: 0.1 }); },
  tesoro() { [72, 76, 79, 84].forEach((n, i) => tono(NOTA(n), 0.35, 'triangle', 0.2, { delay: i * 0.09 })); for (let i = 0; i < 6; i++) tono(1800 + i * 160, 0.07, 'square', 0.06, { delay: 0.3 + i * 0.07 }); },
  basura() { tono(210, 0.18, 'sine', 0.2, { slide: 90 }); },
  dormir() { [67, 64, 60].forEach((n, i) => tono(NOTA(n), 0.6, 'sine', 0.14, { delay: i * 0.22 })); },
  mision() { [72, 76, 79, 84].forEach((n, i) => tono(NOTA(n), 0.3, 'triangle', 0.18, { delay: i * 0.1 })); tono(NOTA(91), 0.8, 'sine', 0.08, { delay: 0.4 }); },
  ficha() { ruido(0.04, 0.18, { tipo: 'highpass', f: 4000 }); tono(2400, 0.03, 'square', 0.06, { delay: 0.03 }); },
  carta() { ruido(0.09, 0.1, { tipo: 'bandpass', f: 3000, slide: 1200 }); },
  tick() { tono(1500, 0.02, 'square', 0.05); },
  gira() { ruido(0.12, 0.05, { tipo: 'bandpass', f: 1800, q: 2 }); },
  jackpot() { for (let i = 0; i < 14; i++) tono(NOTA(60 + [0, 4, 7, 12][i % 4] + Math.floor(i / 4) * 5), 0.22, 'triangle', 0.18, { delay: i * 0.07 }); },
  gana() { [67, 72, 76, 79].forEach((n, i) => tono(NOTA(n), 0.22, 'triangle', 0.17, { delay: i * 0.08 })); },
  pierde() { [64, 60, 55].forEach((n, i) => tono(NOTA(n), 0.28, 'sawtooth', 0.1, { delay: i * 0.13 })); },
  gaviota() {
    const f = rand(1500, 2100);
    tono(f, 0.22, 'sine', 0.05, { slide: f * 0.62, vib: [30, 40] });
    tono(f * 1.05, 0.3, 'sine', 0.045, { slide: f * 0.55, delay: 0.26, vib: [28, 40] });
  },
  pasos() { ruido(0.05, 0.03, { f: 900 }); },
};
function sfx(nombre, a) {
  if (!AUD.ctx || !G.ajustes.sonido) return;
  const f = SFX[nombre];
  if (f) { try { f(a); } catch (e) { /* sonido no disponible */ } }
}

// ---------------------------------------------------------------------------
// Ambiente: olas y viento continuos
// ---------------------------------------------------------------------------
function iniciarAmbiente() {
  const c = AUD.ctx;
  const mk = (tipo, f, q, vol, lfoF, lfoG) => {
    const src = c.createBufferSource();
    src.buffer = AUD.ruido; src.loop = true;
    const fl = c.createBiquadFilter();
    fl.type = tipo; fl.frequency.value = f; fl.Q.value = q;
    const g = c.createGain(); g.gain.value = vol;
    const l = c.createOscillator(), lg = c.createGain();
    l.frequency.value = lfoF; lg.gain.value = lfoG;
    l.connect(lg); lg.connect(g.gain);
    src.connect(fl); fl.connect(g); g.connect(AUD.amb);
    src.start(); l.start();
    return { g, fl };
  };
  AUD.olas = mk('lowpass', 520, 0.4, 0.2, 0.11, 0.14);
  AUD.olas2 = mk('bandpass', 1500, 0.6, 0.05, 0.17, 0.045);
  AUD.viento = mk('bandpass', 380, 0.7, 0.05, 0.07, 0.04);
  // motor de los botes (apagado hasta que se navega)
  const o1 = c.createOscillator(), o2 = c.createOscillator(), mf = c.createBiquadFilter(), mg = c.createGain();
  o1.type = 'sawtooth'; o2.type = 'square'; o1.frequency.value = 52; o2.frequency.value = 26;
  mf.type = 'lowpass'; mf.frequency.value = 260; mg.gain.value = 0;
  o1.connect(mf); o2.connect(mf); mf.connect(mg); mg.connect(AUD.amb);
  o1.start(); o2.start();
  AUD.motor = { o1, o2, mf, mg };
}
// nivel 0..1 (velocidad relativa); tipo: 'lancha' | 'pesquero' | otro = apagado
function motorFrame(nivel, tipo) {
  if (!AUD.ctx || !AUD.motor) return;
  const t = AUD.ctx.currentTime, m = AUD.motor;
  const on = tipo === 'lancha' || tipo === 'pesquero';
  const base = tipo === 'pesquero' ? 34 : 52, tope = tipo === 'pesquero' ? 40 : 70;
  m.mg.gain.setTargetAtTime(on ? 0.1 + clamp(nivel, 0, 1) * 0.22 : 0, t, 0.15);
  m.o1.frequency.setTargetAtTime(base + clamp(nivel, 0, 1) * tope, t, 0.2);
  m.o2.frequency.setTargetAtTime((base + clamp(nivel, 0, 1) * tope) * 0.5, t, 0.2);
  m.mf.frequency.setTargetAtTime(200 + clamp(nivel, 0, 1) * 380, t, 0.2);
}

function ambienteFrame(dt) {
  if (!AUD.ctx || !AUD.listo) return;
  AUD.gaviota -= dt;
  if (AUD.gaviota <= 0) {
    AUD.gaviota = rand(9, 20);
    if (J.luz > 0.5 && G.ajustes.sonido && J.modo === 'jugando') { sfx('gaviota'); if (chance(0.5)) setTimeout(() => sfx('gaviota'), 420); }
  }
  // grillos de noche
  AUD.grillo -= dt;
  if (AUD.grillo <= 0 && J.noche > 0.6 && G.ajustes.sonido && J.modo === 'jugando') {
    AUD.grillo = 0.24;
    tono(4300, 0.05, 'sine', 0.012);
    tono(4300, 0.05, 'sine', 0.012, { delay: 0.08 });
  }
  const t = AUD.ctx.currentTime;
  const lluvia = J.clima.lluvia;
  if (AUD.viento) AUD.viento.g.gain.setTargetAtTime(0.05 + lluvia * 0.12 + J.clima.viento * 0.05, t, 1);
}

// ---------------------------------------------------------------------------
// Música: secuenciador chiquito con tres modos
// ---------------------------------------------------------------------------
const MUSICA = {
  isla: { bpm: 104, pasos: 8, comp: [[48, 55, 60, 64], [45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59]] },
  jefe: { bpm: 148, pasos: 8, comp: [[45, 57, 60, 64], [41, 53, 57, 60], [43, 55, 59, 62], [40, 52, 56, 59]] },
  casino: { bpm: 112, pasos: 8, comp: [[48, 60, 64, 71], [45, 57, 61, 67], [50, 60, 62, 69], [43, 59, 62, 65]] },
};
function musica(modo) {
  if (AUD.modo === modo) return;
  AUD.modo = modo;
  AUD.paso = 0;
  if (AUD.ctx) { AUD.prox = AUD.ctx.currentTime + 0.1; aplicarVolumenes(); }
}
function secuenciador() {
  if (!AUD.ctx || !AUD.listo || !AUD.modo || !G.ajustes.musica || !G.ajustes.sonido) return;
  const c = AUD.ctx;
  if (AUD.prox < c.currentTime - 0.5) AUD.prox = c.currentTime + 0.05;
  const m = MUSICA[AUD.modo];
  if (!m) return;
  const dur = 60 / m.bpm / 2; // corchea
  while (AUD.prox < c.currentTime + 0.14) {
    tocarPaso(AUD.modo, m, AUD.paso, AUD.prox, dur);
    AUD.prox += dur * (AUD.modo === 'casino' && AUD.paso % 2 === 0 ? 1.28 : AUD.modo === 'casino' ? 0.72 : 1); // swing en el casino
    AUD.paso++;
  }
}
const PENTA = [0, 2, 4, 7, 9];
function tocarPaso(modo, m, paso, t0, dur) {
  const compas = Math.floor(paso / m.pasos) % 4, p = paso % m.pasos;
  const acorde = m.comp[compas];
  const dest = AUD.mus;
  const rootBass = acorde[0];
  if (modo === 'isla') {
    // bajo
    if (p === 0) tono(NOTA(rootBass), dur * 3.2, 'triangle', 0.17, { t0, dest });
    if (p === 4) tono(NOTA(rootBass + 7), dur * 2.2, 'triangle', 0.13, { t0, dest });
    // rasgueo de ukelele (contratiempos)
    if (p === 2 || p === 3 || p === 5 || p === 7) acorde.slice(1).forEach((n, i) => tono(NOTA(n + 12), dur * 1.8, 'triangle', 0.045, { t0: t0 + i * 0.012, dest, attack: 0.002 }));
    // marimba: notas de la pentatónica al azar
    if (p % 2 === 0 && Math.random() < 0.55) tono(NOTA(72 + PENTA[randi(0, 4)] + (compas === 1 ? -3 : 0)), dur * 2.6, 'sine', 0.07, { t0, dest });
    if (p % 2 === 1) ruido(0.05, 0.025, { t0, tipo: 'highpass', f: 6000, dest });
  } else if (modo === 'jefe') {
    const bajo = [0, 0, 3, 0, -2, 0, 3, 5][p];
    tono(NOTA(rootBass - 12 + bajo), dur * 0.9, 'sawtooth', 0.12, { t0, dest });
    if (p === 0 || p === 4) { tono(110, 0.2, 'sine', 0.35, { t0, slide: 40, dest }); }
    if (p === 6) tono(110, 0.15, 'sine', 0.25, { t0, slide: 40, dest });
    if (p === 2 || p === 6) ruido(0.12, 0.14, { t0, tipo: 'highpass', f: 1800, dest });
    ruido(0.03, 0.04, { t0, tipo: 'highpass', f: 7000, dest });
    // arpegio nervioso
    const arp = acorde[1 + (p % 3)] + 12;
    tono(NOTA(arp), dur * 0.8, 'square', 0.05, { t0, dest });
    if (compas === 3 && p === 7) tono(NOTA(arp + 12), dur * 1.4, 'square', 0.06, { t0, dest });
  } else if (modo === 'casino') {
    if (p === 0 || p === 4) tono(NOTA(rootBass), dur * 1.6, 'triangle', 0.16, { t0, dest });
    if (p === 2 || p === 6) tono(NOTA(rootBass + 7), dur * 1.4, 'triangle', 0.12, { t0, dest });
    if (p === 0 || p === 3 || p === 6) acorde.slice(1).forEach((n, i) => tono(NOTA(n + 12), dur * 2.2, 'triangle', 0.055, { t0: t0 + i * 0.01, dest }));
    if (Math.random() < 0.5) tono(NOTA(76 + PENTA[randi(0, 4)]), dur * 1.5, 'sine', 0.05, { t0, dest });
    if (p % 2 === 1) ruido(0.04, 0.04, { t0, tipo: 'highpass', f: 7000, dest });
  }
}
