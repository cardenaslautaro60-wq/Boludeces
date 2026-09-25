// Personajes con los que se puede hablar (pocos, con historia de Comodoro): se acercan con G.
// Algunos venden algo, otros cuentan cosas del pueblo y dos dan changas (llevar algo a algún
// lado a tiempo).
import * as THREE from 'three';
import { LANDMARKS, POI } from '../world/mapdata.js';
import { Brain } from './ai.js';
import { Marker } from './activities.js';
import { randomLook } from '../entities/humanoid.js';
import { sayLine } from '../entities/ped.js';
import { pick, clamp } from '../util.js';

const HEADLINES = [
  'VIENTO: RÁFAGAS DE 120 KM/H. SE VOLÓ EL TECHO DE UN KIOSCO EN EL KM 5',
  'EL LOBO GANÓ EN LA MADRIGUERA Y LA CARAVANA LLEGÓ HASTA LA COSTANERA',
  'SIGUEN LOS CORTES DE LOS PETROLEROS EN LA RUTA 3',
  'VECINOS DICEN HABER VISTO A UN GORDO HACIENDO MALABARES A LAS 3 DE LA MAÑANA',
  'EL BARRIL SUPERÓ LOS 40 DÓLARES: EN EL KM 3 NO ALCANZAN LAS CHATAS',
  'OTRA VEZ SIN LUZ MEDIO COMODORO: "FUE EL VIENTO", DICE LA COOPERATIVA',
  'RADA TILLY: PIDEN NO DEJAR LAS SOMBRILLAS CLAVADAS CON ESTE VIENTO',
  'CALETA CÓRDOVA: LOS PESCADORES VOLVIERON CON EL CAJÓN LLENO',
  'LOBOS MARINOS EN PUNTA DEL MARQUÉS: "HAY MÁS QUE EN LA TRIBUNA DE NEWBERY"',
  'EL CHENQUE SIGUE AHÍ, DICEN LOS EXPERTOS',
];
const TIPS = [
  'Dicen que si escribís SUPERSALTO saltás como un guanaco.',
  'Un petrolero me juró que escribiendo PETRODOLARES te llegan las regalías.',
  'Si escribís CHENQUE aparecés arriba del cerro. No me preguntes cómo.',
  'En el Centro dicen que escribiendo VIENTAZO se arma un temporal.',
  'Con BALASINFINITAS dicen que no hace falta recargar nunca.',
  'Si escribís NEVADA... bueno, en Comodoro nieva poco, pero nieva.',
];
const STORIES = [
  ['¿Sabías que el petróleo lo encontraron en 1907 buscando agua?', 'Querían agua para el pueblo y salió crudo.', 'Así es Comodoro, pibe: pedís una cosa y te sale otra.'],
  ['Comodoro se fundó en 1901. Era un puerto para sacar la lana.', 'Después vino el petróleo y llegó gente de todos lados.', 'Chilenos, bolivianos, bóers, italianos... acá somos todos de afuera.'],
  ['Acá el viento te despeina hasta el documento.', 'Yo una vez perdí el sombrero en el Km 3...', '...y lo encontré en Rada Tilly. Tres días después.'],
  ['Desde acá arriba se ve todo el Golfo San Jorge.', 'A la izquierda, Rada Tilly y Punta del Marqués, con los lobos marinos.', 'A la derecha, el Km 5, el Km 8 y allá lejos Caleta Córdova.'],
];

// Definición de cada personaje: dónde está, cómo se ve y qué hace al hablarle
const NPCS = [
  {
    id: 'canillita', name: 'El Canillita', at: ['plazaSanMartin', 'catedral'], off: [6, 4], kind: 'civil',
    look: (L) => { L.hairStyle = 'cap'; L.hat = 0x2a4a8a; L.shirt = 0xd8d0c0; L.shirtHex = '#d8d0c0'; L.fat = 0.2; },
    greet: ['¡El Patagónnico! ¡Diario, diario!', '¡Salió la edición de hoy!'],
    talk(N, g) {
      if (g.money < 2) return N.lines(['No te alcanza ni para el diario, maestro.']);
      g.addMoney(-2, true);
      const h = pick(HEADLINES);
      g.hud.bigText('EL PATAGÓNNICO', h, 6);
      N.lines(['Dos pesitos. Tomá, fresquito.', pick(TIPS)]);
    },
  },
  {
    id: 'choripanero', name: 'Don Chiche, el choripanero', at: ['plazaSoberania', 'puerto'], off: [8, -6], kind: 'civil', cart: true,
    look: (L) => { L.fat = 0.8; L.shirt = 0xf2f2f2; L.shirtHex = '#f2f2f2'; L.hairStyle = 'bald'; L.mustache = true; },
    greet: ['¡Chori, bondiola, vacío! ¡Con viento incluido!', '¡El mejor chori de la Costanera!'],
    talk(N, g) {
      N.ask('¿Un choripán completo por $15?', () => {
        if (g.money < 15) return N.lines(['Sin plata no hay chori, hermano.']);
        const p = g.player;
        g.addMoney(-15, true);
        p.health = Math.min(p.maxHealth, p.health + 45);
        if (g.stats) { g.stats.fat = clamp(g.stats.fat + 2, 0, 100); g.activities && g.activities.updateBody && g.activities.updateBody(); }
        g.audio && g.audio.pickup && g.audio.pickup();
        N.lines(['¡Ahí tenés! Con chimichurri de la casa.', 'Cuidá que no se te vuele el pan.']);
      }, () => N.lines(['Vos te lo perdés. Mirá que se termina.']));
    },
  },
  {
    id: 'rosa', name: 'Doña Rosa', at: ['terminal'], off: [5, 5], kind: 'abuela',
    greet: ['Ay, nene, ¿me das una mano?', 'Estos colectivos nunca llegan a horario...'],
    talk(N, g) {
      if (N.done) return N.lines(['Gracias otra vez, nene. Mi hija te manda saludos.']);
      const dest = LANDMARKS.museoPetroleo || LANDMARKS.ypf;
      if (!dest) return N.lines(['Ay, me olvidé a dónde iba...']);
      N.ask('¿Le llevás el bolso a su hija en el Km 3, al lado del Museo del Petróleo?', () => {
        N.lines(['¡Qué amoroso! Está al lado del Museo del Petróleo, en el Km 3.', 'Apurate que tiene las tortas fritas en el horno.']);
        N.errand(dest.x, dest.z, 240, 'Llevale el bolso a la hija de Doña Rosa (Km 3)', () => {
          g.addMoney(200);
          if (g.stats) g.stats.respect = Math.min(100, g.stats.respect + 3);
          g.hud.bigText('¡GRACIAS, NENE!', 'La hija de Doña Rosa te dio $200 y dos tortas fritas', 5);
          g.player.health = Math.min(g.player.maxHealth, g.player.health + 20);
          N.done = true;
        });
      }, () => N.lines(['Bueno, bueno. Ya pasará algún otro buen muchacho.']));
    },
  },
  {
    id: 'petrolero', name: 'Ramírez, el petrolero', at: ['ypf', 'museoPetroleo'], off: [-7, 5], kind: 'petrolero',
    greet: ['¡Eh, vos! ¿Querés hacerte unos pesos?', 'Se rompió la bomba del pozo y no hay chofer...'],
    talk(N, g) {
      const dest = LANDMARKS.restinga || LANDMARKS.caleta || LANDMARKS.aeropuerto;
      if (!dest) return N.lines(['Hoy no hay changa, volvé mañana.']);
      N.ask('Changa: llevar un repuesto de bomba al yacimiento de Restinga Alí en 3 minutos ($400)', () => {
        N.lines(['¡Buenísimo! Va en la caja de la chata que tengas.', 'Si llegás tarde, el capataz me mata. ¡Rajá!']);
        N.errand(dest.x, dest.z, 180, 'Llevá el repuesto de bomba a Restinga Alí', () => {
          g.addMoney(400);
          if (g.stats) g.stats.respect = Math.min(100, g.stats.respect + 2);
          g.hud.bigText('¡CHANGA CUMPLIDA!', '+$400 — "Volvé cuando quieras, hay laburo"', 5);
        }, true);
      }, () => N.lines(['Bueno, le digo al Turco que lo lleve él.']));
    },
  },
  {
    id: 'viejo', name: 'Don Aníbal, el del mirador', at: ['miradorChenque', 'chenque'], off: [4, 3], kind: 'civil',
    look: (L) => { L.hair = 0xd8d8d8; L.hairStyle = 'beanie'; L.hat = 0x5a3a2a; L.beard = true; L.fat = 0.3; L.height = 0.95; },
    greet: ['Qué vista, ¿eh?', 'Sentate, pibe, que te cuento una.'],
    talk(N) { N.lines(pick(STORIES).concat([pick(TIPS)])); },
  },
  {
    id: 'barra', name: 'El Negro, de la barra del Lobo', at: ['madriguera', 'estadio'], off: [14, 10], kind: 'lobo',
    greet: ['¡Aguante el Lobo, loco!', '¡Dale, dale, dale Newbery!'],
    talk(N, g) {
      N.lines(['¿Sos del Lobo? ¡Cantá con nosotros!', '¡Y dale, dale, dale Newbery, dale dale Lobo, que esta tarde tenemos que ganar!']);
      const p = g.player;
      p.dance = true;
      setTimeout(() => { p.dance = false; }, 4500);
      if (g.stats) g.stats.respect = Math.min(100, g.stats.respect + 1);
      if (!p.owned.includes('bate') && !N.gaveBat) { N.gaveBat = true; p.give('bate'); g.hud.showToast('El Negro te regaló un <b>bate</b>', 3); }
    },
  },
];

export class NPCs {
  constructor(game) {
    this.game = game;
    this.list = [];
    this.dialog = null;   // { N, lines, i, t }
    this.askQ = null;     // { N, text, yes, no }
    this.errandJob = null;
    this.near = null;
  }

  // Se llama al empezar la partida: ubica a cada uno en su lugar
  spawnAll() {
    const g = this.game;
    for (const def of NPCS) {
      const L = def.at.map((k) => LANDMARKS[k] || POI[k]).find(Boolean);
      if (!L) continue;
      const N = { def, name: def.name, x0: L.x + def.off[0], z0: L.z + def.off[1], ped: null, respawnT: 0, done: false };
      N.lines = (ls) => this.say(N, ls);
      N.ask = (text, yes, no) => { this.askQ = { N, text, yes, no }; };
      N.errand = (x, z, time, text, onDone, vehicle) => this.startErrand(N, x, z, time, text, onDone, vehicle);
      this.spawn(N);
      g.blips.push({ x: N.x0, z: N.z0, letter: 'i', bg: '#2f7d4a', name: def.name, legend: true, npc: true });
      this.list.push(N);
    }
  }

  spawn(N) {
    const g = this.game, def = N.def;
    const { x, z } = g.safeSpot(N.x0, N.z0, 0.5);
    const look = randomLook(def.kind);
    if (def.look) { def.look(look); look.shirtHex = look.shirtHex || '#' + look.shirt.toString(16).padStart(6, '0'); }
    const p = g.spawnPed(def.kind, x, z, { look, name: def.name });
    p.persistent = true;
    p.npc = N;
    p.money = 0;
    p.brain = new Brain(g, p, 'idle');
    N.ped = p;
    if (def.cart && !N.cart) N.cart = this.buildCart(x + 1.4, z);
  }

  // Carrito de choripanes con humo
  buildCart(x, z) {
    const g = this.game;
    const y = g.world.footGround(x, z);
    const grp = new THREE.Group();
    const mat = (c) => new THREE.MeshLambertMaterial({ color: c });
    const box = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, 0.8), mat(0xc8c8c0)); box.position.y = 0.75;
    const grill = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 0.7), mat(0x222222)); grill.position.y = 1.24;
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.06, 1.1), mat(0xc0282c)); roof.position.y = 2.2;
    grp.add(box, grill, roof);
    for (const [dx, dz] of [[-0.85, -0.45], [0.85, -0.45], [-0.85, 0.45], [0.85, 0.45]]) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.0, 5), mat(0x888888)); pole.position.set(dx, 1.7, dz); grp.add(pole);
    }
    grp.position.set(x, y, z);
    g.scene.add(grp);
    g.colliders.addBox(x - 0.8, x + 0.8, z - 0.4, z + 0.4, y - 0.5, y + 1.3, 'carrito');
    return { grp, x, y, z };
  }

  say(N, lines) {
    this.dialog = { N, lines: lines.slice(), i: 0, t: 0 };
    this.showLine();
  }

  showLine() {
    const d = this.dialog, g = this.game;
    const text = d.lines[d.i];
    const dur = clamp(1.6 + text.length * 0.055, 2.4, 6);
    d.t = dur;
    g.hud.subtitle(`<b>${d.N.name}:</b> ${text}`, dur + 0.2);
    if (d.N.ped) sayLine(d.N.ped, text, dur);
    g.audio && g.audio.say && g.audio.say(text, d.N.def.id);
  }

  startErrand(N, x, z, time, text, onDone, vehicle) {
    const g = this.game;
    this.cancelErrand();
    const m = new Marker(g, x, z, 0x40c0ff, { r: vehicle ? 3.2 : 1.6, h: 1.4 });
    const blip = { x, z, color: '#40c0ff', size: 8, edge: true };
    g.blips.push(blip);
    this.errandJob = { N, m, blip, t: time, onDone, text };
    g.hud.subtitle(text, 6);
  }

  cancelErrand(msg) {
    const e = this.errandJob;
    if (!e) return;
    const g = this.game;
    e.m.dispose();
    const i = g.blips.indexOf(e.blip); if (i >= 0) g.blips.splice(i, 1);
    g.hud.removeCounter('changa');
    this.errandJob = null;
    if (msg) g.hud.bigText('CHANGA PERDIDA', msg, 4);
  }

  update(dt, input) {
    const g = this.game, p = g.player;
    if (!p || !this.list.length) return;
    // reaparecer a los que se fueron (o los bajaron) cuando el jugador está lejos
    for (const N of this.list) {
      const q = N.ped;
      if (q && !q.dead && !q.removed) {
        // mira al jugador cuando está cerca
        const d = Math.hypot(q.pos.x - p.pos.x, q.pos.z - p.pos.z);
        if (d < 8 && q.brain && q.brain.mode === 'idle') {
          q.heading = Math.atan2(p.pos.x - q.pos.x, p.pos.z - q.pos.z);
          if (!N.greeted && d < 6 && !p.vehicle) { N.greeted = true; sayLine(q, pick(N.def.greet), 3); q.wave = true; setTimeout(() => { q.wave = false; }, 1500); }
        } else if (d > 30) N.greeted = false;
        // volver a su lugar si se asustó
        if (q.brain && q.brain.mode === 'wander') q.brain.setMode('idle');
        continue;
      }
      N.respawnT += dt;
      if (N.respawnT > 90 && Math.hypot(N.x0 - p.pos.x, N.z0 - p.pos.z) > 150) {
        if (q && !q.removed) g.removePed(q);
        N.respawnT = 0;
        this.spawn(N);
      }
    }
    // changa en curso
    const e = this.errandJob;
    if (e) {
      e.t -= dt;
      e.m.update(dt);
      const mm = Math.max(0, Math.floor(e.t / 60)), ss = Math.max(0, Math.floor(e.t % 60));
      g.hud.setCounter('changa', 'CHANGA', `${mm}:${String(ss).padStart(2, '0')}`);
      const pos = p.vehicle ? p.vehicle.pos : p.pos;
      if (e.m.contains(pos, 0.5)) { const fn = e.onDone; this.cancelErrand(); fn(); }
      else if (e.t <= 0) this.cancelErrand('Se te pasó la hora.');
      else if (g.missions.active) this.cancelErrand('Te fuiste a hacer otra cosa.');
      else if (p.dead) this.cancelErrand('');
    }
    // diálogo
    if (this.dialog) {
      const d = this.dialog;
      d.t -= dt;
      if (d.t <= 0 || input.was('action')) {
        d.i++;
        if (d.i >= d.lines.length) { this.dialog = null; g.hud.clearSubtitle(); } else this.showLine();
      }
      return;
    }
    if (this.askQ) {
      const a = this.askQ;
      const touch = g.touch && g.touch.enabled;
      g.hud.setPrompt(touch ? `${a.text}<br><kbd>HABLAR</kbd> Sí &nbsp; (alejate para decir que no)` : `${a.text}<br><kbd>Y</kbd> Sí &nbsp; <kbd>N</kbd> No`);
      const far = !a.N.ped || Math.hypot(a.N.ped.pos.x - p.pos.x, a.N.ped.pos.z - p.pos.z) > 5;
      if (input.was('yes') || input.was('action')) { this.askQ = null; g.hud.setPrompt(null); a.yes(); }
      else if (input.was('no') || far) { this.askQ = null; g.hud.setPrompt(null); if (!far) a.no(); }
      return;
    }
    // ¿hay alguien para hablar?
    let near = null;
    if (!p.vehicle && !g.controlsLocked && !(g.missions.active && g.missions.active.inCutscene)) {
      for (const N of this.list) {
        const q = N.ped;
        if (!q || q.dead || q.removed) continue;
        if (Math.hypot(q.pos.x - p.pos.x, q.pos.z - p.pos.z) < 2.6) { near = N; break; }
      }
    }
    if (near !== this.near) {
      this.near = near;
      g.hud.setPrompt(near ? `<kbd>${g.touch && g.touch.enabled ? 'HABLAR' : 'G'}</kbd> Hablar con <b>${near.name}</b>` : null);
    }
    if (near && input.was('action')) {
      g.hud.setPrompt(null);
      this.near = null;
      near.def.talk(near, g);
    }
  }
}
