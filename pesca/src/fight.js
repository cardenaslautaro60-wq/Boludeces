'use strict';
// Modelo de la pelea con el pez (lógica pura, sin dibujo): tensión de la línea, avance, cansancio.
//
//  - Mantené apretado para recoger. La tensión sube con la fuerza del pez y con lo que recogés.
//  - Zona verde (35%-80%): el pez se cansa. Zona roja (>82%): la línea se estresa y se corta.
//  - Si dejás la línea floja mucho tiempo, el pez se suelta.
//  - Los peces "avisan" antes de cada corrida: soltá el carretel y dejalo ir.

const PELEA = { kReel: 0.46, kPull: 0.5, tau: 0.2, peligro: 0.82, verdeMin: 0.35, verdeMax: 0.8, flojo: 0.1 };

function nuevaPelea(sp, kg, cana, o = {}) {
  const kgMed = (sp.kg[0] + sp.kg[1]) / 2;
  const fw = clamp(Math.pow(kg / kgMed, 0.22), 0.82, 1.3);
  const s = {
    sp: sp.id, str: sp.fuerza * fw, aguante: sp.aguante * (0.85 + 0.3 * fw),
    pat: PAT[sp.pat] || PAT.normal,
    reel: cana.reel, line: cana.line, vel: cana.vel || 1,
    T: 0.28, prog: o.perfecto ? 0.1 : 0, stam: o.perfecto ? 0.92 : 1, stress: 0, flojo: 0,
    modo: 'calma', tModo: rand(1.0, 1.8), pull: 0.2, aviso: 0, fase: rand(10),
    boss: !!o.boss, pullFijo: null, t: 0, reeling: false, ultimo: null,
  };
  return s;
}

function elegirModo(s) {
  const p = s.pat;
  const cansado = s.stam < 0.18;
  if (cansado && Math.random() < 0.7) { s.modo = 'descanso'; s.tModo = rand(0.8, 1.6); return; }
  const w = { calma: p.calma, tiron: p.tiron, corrida: p.corrida * (cansado ? 0.3 : 1), sacudida: p.sacudida };
  let tot = 0;
  for (const k in w) tot += w[k];
  let r = Math.random() * tot, m = 'calma';
  for (const k in w) { r -= w[k]; if (r <= 0) { m = k; break; } }
  if (m === 'corrida') { s.modo = 'aviso'; s.tModo = 0.55; s.aviso = 1; return; }
  s.modo = m;
  s.tModo = m === 'calma' ? rand(1.0, 2.2) : m === 'tiron' ? rand(0.9, 1.8) : rand(1.0, 1.8);
}

// Fuerza instantánea del pez (0..~1.3, antes de multiplicar por str)
function fuerzaPez(s) {
  if (s.pullFijo !== null) return s.pullFijo;
  let f;
  switch (s.modo) {
    case 'calma': f = 0.25 + 0.08 * Math.sin(s.t * 3 + s.fase); break;
    case 'tiron': f = 0.58 + 0.1 * Math.sin(s.t * 5 + s.fase); break;
    case 'aviso': f = 0.4; break;
    case 'corrida': f = 1.25; break;
    case 'sacudida': f = 0.35 + 0.6 * Math.abs(Math.sin(s.t * 7.5 + s.fase)); break;
    default: f = 0.12;
  }
  return f * (0.35 + 0.65 * s.stam);
}

// Avanza dt segundos. reel = true si el jugador está recogiendo.
// Devuelve null, 'gano', 'corte' o 'suelta'
function pasoPelea(s, dt, reel) {
  s.t += dt;
  s.reeling = reel;
  if (s.pullFijo === null) {
    s.tModo -= dt;
    if (s.tModo <= 0) {
      if (s.modo === 'aviso') { s.modo = 'corrida'; s.tModo = rand(0.9, 1.4); s.aviso = 0; } else elegirModo(s);
    }
  }
  const pull = fuerzaPez(s);
  s.pull = pull;
  const F = (reel ? PELEA.kReel : 0) + (pull * s.str * PELEA.kPull) / s.line;
  s.T += (F - s.T) * (1 - Math.exp(-dt / PELEA.tau));
  s.T = clamp(s.T, 0, 1.3);
  // estrés de la línea
  if (s.T > PELEA.peligro) s.stress += (s.T - PELEA.peligro) * 7 * dt;
  else s.stress = Math.max(0, s.stress - 0.3 * dt);
  // línea floja
  if (s.T < PELEA.flojo) s.flojo += dt; else s.flojo = Math.max(0, s.flojo - dt * 1.5);
  const enVerde = s.T >= PELEA.verdeMin && s.T <= PELEA.verdeMax;
  // cansancio del pez
  const drena = reel && enVerde ? 1 : 0.14;
  s.stam = Math.max(0, s.stam - (drena * dt * s.reel) / s.aguante);
  // avance
  if (!s.boss) {
    if (reel) {
      const freno = Math.min(0.85, pull * s.str * 0.5);
      s.prog += 0.15 * s.reel * s.vel * (1 - freno) * dt;
    } else {
      s.prog -= 0.045 * pull * s.str * dt;
    }
    s.prog = clamp(s.prog, 0, 1.0);
    if (s.prog >= 1) return 'gano';
  }
  if (s.stress >= 1) return 'corte';
  if (s.flojo > (s.boss ? 3.5 : 2.6)) return 'suelta';
  return null;
}

// Para las pruebas: pelea completa con un jugador "robot" con reflejos humanos.
// estilo: 'bueno' | 'terco' | 'quieto'. lag = segundos de reacción.
function simularPelea(sp, kg, cana, estilo = 'bueno', o = {}) {
  const s = nuevaPelea(sp, kg, cana, o);
  const dt = 1 / 60;
  const lag = o.lag === undefined ? 0.25 : o.lag;
  const cola = [];
  let r = null, reel = false;
  for (let i = 0; i < 60 * 120 && !r; i++) {
    cola.push({ modo: s.modo, T: s.T });
    const visto = cola.length > lag * 60 ? cola.shift() : cola[0];
    if (estilo === 'bueno') {
      // recoge salvo si hay aviso/corrida o si la tensión está alta; retoma cuando baja
      if (visto.modo === 'aviso' || visto.modo === 'corrida' || visto.T > 0.76) reel = false;
      else if (visto.T < 0.56) reel = true;
    } else if (estilo === 'terco') reel = true;
    else reel = false;
    r = pasoPelea(s, dt, reel);
  }
  return { r: r || 'tiempo', t: s.t };
}
