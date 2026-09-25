// Eventos del mundo, bien de Comodoro: vientazos, cortes de ruta de los petroleros, temporales
// de tierra, fuegos artificiales por el aniversario, la caravana del Lobo, cortes de luz y,
// muy de vez en cuando, una nevada. Cada tanto, si no hay una misión en curso, pasa uno y la
// radio lo avisa.
import * as THREE from 'three';
import { Brain } from './ai.js';
import { randomLook } from '../entities/humanoid.js';
import { sayLine, PED_LINES } from '../entities/ped.js';
import { signTexture } from '../render/textures.js';
import { LANDMARKS } from '../world/mapdata.js';
import { rand, pick, clamp } from '../util.js';

const CHANTS = ['¡Trabajo digno!', '¡Petroleros unidos!', '¡No nos vamos a ir!', '¡Que se vaya la operadora!', '¡Aguante la cuenca!'];
const LOBO = ['¡Dale Lobo!', '¡Vamos Newbery!', '¡Y dale, dale, dale Newbery!', '¡Esta tarde tenemos que ganar!', '¡Aguante la Madriguera!'];

export class WorldEvents {
  constructor(game) {
    this.game = game;
    this.t = rand(120, 200);
    this.cur = null;
    this.last = null;
  }

  announce(title, text) {
    const g = this.game;
    g.hud.radioCaption && g.hud.radioCaption('Radio Comodoro · ' + title, text, 8);
    g.audio && g.audio.say && g.audio.say(text, 'locutor');
  }

  update(dt) {
    const g = this.game;
    if (this.cur) {
      const e = this.cur;
      e.t += dt;
      e.update && e.update(dt, e);
      if (e.t >= e.dur || e.stop) { e.end && e.end(e); this.cur = null; this.t = rand(170, 330); }
      return;
    }
    if (!g.started || g.respawning || (g.missions && g.missions.active)) return;
    this.t -= dt;
    if (this.t <= 0) {
      const night = g.env.night > 0.6;
      const opts = [['vientazo', 3], ['piquete', 2.5], ['tierra', 1.5], ['caravana', 2], ['aniversario', night ? 3 : 0], ['apagon', night ? 2 : 0], ['nevada', 0.6]]
        .filter(([k, w]) => w > 0 && k !== this.last);
      let r = Math.random() * opts.reduce((a, [, w]) => a + w, 0);
      let kind = opts[0][0];
      for (const [k, w] of opts) { r -= w; if (r <= 0) { kind = k; break; } }
      if (!this.start(kind)) this.t = 30;
    }
  }

  start(kind) {
    if (this.cur) { this.cur.end && this.cur.end(this.cur); this.cur = null; }
    const fn = this['ev_' + kind];
    if (!fn) return false;
    const e = fn.call(this);
    if (!e) return false;
    e.t = 0;
    e.kind = kind;
    this.cur = e;
    this.last = kind;
    return true;
  }

  // ---------------------------------------------------------------
  ev_vientazo() {
    const g = this.game, env = g.env;
    this.announce('Alerta', 'Alerta por viento en todo Comodoro: ráfagas de más de cien kilómetros por hora. Agárrense de algo.');
    return {
      dur: 32,
      update: (dt, e) => {
        const k = e.t < 4 ? e.t / 4 : e.t > e.dur - 6 ? (e.dur - e.t) / 6 : 1;
        env.extraWind = 26 * k;
        env.extraDust = 0.35 * k;
        if (Math.random() < dt * 0.6) {
          const q = g.peds.find((p) => !p.isPlayer && !p.dead && !p.vehicle && p.pos.distanceTo(g.player.pos) < 25);
          if (q) sayLine(q, pick(PED_LINES.wind), 2.5);
        }
      },
      end: () => { env.extraWind = 0; env.extraDust = 0; },
    };
  }

  ev_tierra() {
    const g = this.game, env = g.env;
    this.announce('Clima', 'Temporal de tierra: se levantó la meseta entera. Manejen con las luces prendidas.');
    return {
      dur: 75,
      update: (dt, e) => {
        const k = clamp(Math.min(e.t / 8, (e.dur - e.t) / 10), 0, 1);
        env.extraDust = 0.95 * k;
        env.extraWind = 14 * k;
      },
      end: () => { env.extraWind = 0; env.extraDust = 0; },
    };
  }

  ev_nevada() {
    const g = this.game, env = g.env;
    this.announce('Clima', '¡Está nevando en Comodoro! Sí, leyó bien. Cuidado en la Ruta 3 y en la subida del Chenque.');
    const prev = env.forcedWeather;
    env.forcedWeather = 'nevada';
    return {
      dur: 150,
      end: () => { env.forcedWeather = prev; if (!prev) env.setWeather('nublado'); },
    };
  }

  ev_apagon() {
    const g = this.game, env = g.env;
    this.announce('Último momento', 'Se cortó la luz en varios barrios. La cooperativa dice que fue el viento... como siempre.');
    env.blackout = true;
    return { dur: 50, end: () => { env.blackout = false; } };
  }

  ev_aniversario() {
    const g = this.game, p = g.player;
    // en la Costanera si está cerca; si no, arriba del barrio donde anda
    const L = LANDMARKS.plazaSoberania || LANDMARKS.catedral;
    let cx = p.pos.x, cz = p.pos.z;
    if (L && Math.hypot(L.x - p.pos.x, L.z - p.pos.z) < 500) { cx = L.x; cz = L.z; } else {
      const f = g.cameraRig.forward(); cx += f.x * 160; cz += f.z * 160;
    }
    this.announce('Aniversario', '¡Feliz aniversario, Comodoro! Fuegos artificiales en la Costanera. ¡Salgan a mirar!');
    let next = 0;
    this.fwCenter = [cx, cz];
    return {
      dur: 55,
      update: (dt) => {
        next -= dt;
        if (next <= 0) {
          next = rand(0.5, 1.3);
          const n = Math.random() < 0.25 ? 3 : 1;
          for (let i = 0; i < n; i++) {
            const x = cx + rand(-60, 60), z = cz + rand(-60, 60);
            g.effects.firework(x, g.terrain.heightAt(x, z) + 2, z, rand(45, 80));
          }
        }
      },
    };
  }

  // Caravana del Lobo: hinchas de Newbery festejando y bocinazos
  ev_caravana() {
    const g = this.game, p = g.player;
    const fans = [];
    for (let i = 0; i < 6; i++) {
      const sw = g.city.randomSidewalk(p.pos.x, p.pos.z, 12, 30);
      if (!sw) continue;
      const q = g.spawnPed('lobo', sw.x, sw.z, { look: randomLook('lobo') });
      q.persistent = true;
      q.brain = new Brain(g, q, 'wander');
      q.dance = Math.random() < 0.5;
      fans.push(q);
    }
    if (!fans.length) return null;
    this.announce('Deportes', 'Ganó el Lobo y la caravana de Newbery sale a festejar por las calles. ¡Bocinazo general!');
    const honk = [];
    return {
      dur: 60,
      update: (dt) => {
        if (Math.random() < dt * 0.8) { const q = pick(fans); if (q && !q.dead) sayLine(q, pick(LOBO), 2.5); }
        if (Math.random() < dt * 0.5) {
          const v = g.vehicles.find((c) => c.driver && !c.driver.isPlayer && c.pos.distanceTo(p.pos) < 60 && !honk.includes(c));
          if (v) { honk.push(v); g.audio.horn(v, true); setTimeout(() => g.audio.horn(v, false), 900 + Math.random() * 900); }
        }
      },
      end: () => { for (const q of fans) { q.dance = false; q.persistent = false; q.spawned = true; } },
    };
  }

  // Corte de ruta: cubiertas prendidas fuego, bandera y petroleros cruzados en una avenida o la ruta
  ev_piquete() {
    const g = this.game, p = g.player, R = g.roads;
    const f = g.cameraRig.forward();
    let best = null, bs = Infinity;
    for (const e of R.edges) {
      if (e.kind !== 'avenida' && e.kind !== 'ruta') continue;
      if (e.len < 18) continue;
      const A = R.nodes[e.a];
      const mx = A.x + e.dx * e.len / 2, mz = A.z + e.dz * e.len / 2;
      const d = Math.hypot(mx - p.pos.x, mz - p.pos.z);
      if (d < 90 || d > 450) continue;
      const ahead = ((mx - p.pos.x) * f.x + (mz - p.pos.z) * f.z) / d;
      const sc = d * (1.6 - ahead);
      if (sc < bs) { bs = sc; best = { e, mx, mz }; }
    }
    if (!best) return null;
    const { e, mx, mz } = best;
    const gy = g.terrain.heightAt(mx, mz);
    const nx = -e.dz, nz = e.dx; // a lo ancho de la calle
    const half = e.width / 2;
    const grp = new THREE.Group();
    const rubber = new THREE.MeshLambertMaterial({ color: 0x1c1c1c });
    const fires = [];
    for (let k = -1; k <= 1; k++) {
      const x = mx + nx * k * half * 0.65, z = mz + nz * k * half * 0.65;
      const h = g.terrain.heightAt(x, z);
      for (let j = 0; j < 3; j++) {
        const t = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.14, 6, 12), rubber);
        t.rotation.x = Math.PI / 2; t.position.set(x + rand(-0.1, 0.1), h + 0.14 + j * 0.26, z + rand(-0.1, 0.1));
        grp.add(t);
      }
      fires.push([x, h + 0.9, z]);
    }
    // bandera entre dos palos
    const tex = signTexture(['PETROLEROS', 'AUTOCONVOCADOS'], { bg: '#f2f0e6', fg: '#1c3f8f', w: 512, h: 160, sizes: [60, 44] });
    const bw = Math.min(e.width * 0.8, 9);
    // dos caras (la bandera se lee de los dos lados)
    const bmat = new THREE.MeshBasicMaterial({ map: tex, fog: true });
    const bx = mx - e.dx * 3, bz = mz - e.dz * 3;
    for (const flip of [0, Math.PI]) {
      const banner = new THREE.Mesh(new THREE.PlaneGeometry(bw, 1.4), bmat);
      banner.position.set(bx, gy + 2.1, bz);
      banner.rotation.y = Math.atan2(nx, nz) + Math.PI / 2 + flip;
      grp.add(banner);
    }
    const poleM = new THREE.MeshLambertMaterial({ color: 0x8a6a3a });
    for (const s of [-1, 1]) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.9, 5), poleM);
      pole.position.set(bx + nx * s * bw / 2, gy + 1.45, bz + nz * s * bw / 2);
      grp.add(pole);
    }
    g.scene.add(grp);
    // barrera invisible: los autos no pasan (se desactiva al terminar)
    const col = g.colliders.addOBB(mx, mz, nx, nz, half + 0.5, 0.8, gy - 1, gy + 1.2, 'piquete');
    const people = [];
    for (let i = 0; i < 8; i++) {
      const s = rand(-0.8, 0.8), bk = rand(-5, -1.5);
      const x = mx + nx * s * half + e.dx * bk, z = mz + nz * s * half + e.dz * bk;
      const q = g.spawnPed('petrolero', x, z, { look: randomLook('petrolero') });
      q.persistent = true;
      q.brain = new Brain(g, q, 'idle');
      q.heading = Math.atan2(e.dx, e.dz) + (Math.random() < 0.5 ? 0 : Math.PI);
      people.push(q);
    }
    const name = e.name ? (e.kind === 'ruta' ? 'la ' + e.name : e.name) : 'la avenida';
    this.announce('Tránsito', `Corte total de petroleros autoconvocados en ${name}. Busquen un camino alternativo.`);
    const blip = { x: mx, z: mz, color: '#ff8020', size: 7, edge: true };
    g.blips.push(blip);
    return {
      dur: 170,
      update: (dt, ev) => {
        for (const [x, y, z] of fires) if (Math.random() < dt * 14) g.effects.fire(x, y, z);
        if (Math.random() < dt * 0.7) { const q = pick(people); if (q && !q.dead) sayLine(q, pick(CHANTS), 2.5); }
        if (ev.t > 60 && Math.hypot(mx - p.pos.x, mz - p.pos.z) > 700) ev.stop = true;
      },
      end: () => {
        col.y0 = -1e9; col.y1 = -1e9;
        g.scene.remove(grp);
        const i = g.blips.indexOf(blip); if (i >= 0) g.blips.splice(i, 1);
        for (const q of people) { if (!q.removed) { q.persistent = false; q.spawned = true; if (q.brain) q.brain.setMode('wander'); } }
      },
    };
  }
}

