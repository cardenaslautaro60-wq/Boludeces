// ADNSUR en la calle: cuando pasa algo (un choque fuerte, una explosión, un tiroteo, una
// persecución) llega el móvil de prensa, se bajan la cronista y el camarógrafo y salen en vivo.
// Lo que cubren queda en el noticiero de ADNSUR Radio. Los personajes son genéricos: no son
// periodistas reales ni usan sus voces o caras.
import * as THREE from 'three';
import { Brain } from './ai.js';
import { DriverAI } from './traffic.js';
import { randomLook } from '../entities/humanoid.js';
import { sayLine } from '../entities/ped.js';
import { ADNSUR } from '../audio/guion.js';
import { rand, pick, dist } from '../util.js';

const fill = (s, d) => s.replace(/\{(\w+)\}/g, (_, k) => d[k] || '');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export class Prensa {
  constructor(game) {
    this.game = game;
    this.crew = null;     // cobertura en curso
    this.cool = 40;       // espera entre coberturas
    this.idleT = 200;     // si no pasa nada, salen a hacer una nota de baches
    this.news = [];       // titulares para el noticiero (los más nuevos primero)
    this.unread = [];     // lo que la radio todavía no contó
    this.chase = false;
  }

  lugar(x, z) {
    const n = this.game.world.zoneAt(x, z) || 'Comodoro';
    return n.replace(/ \(.*\)$/, '');
  }

  // titular para la radio
  headline(kind, d) {
    const t = ADNSUR.titular[kind];
    if (!t) return;
    const text = cap(fill(t, d));
    this.news.unshift(text);
    this.news.length = Math.min(this.news.length, 8);
    this.unread.push(text);
    if (this.unread.length > 3) this.unread.shift();
  }

  // Algo pasó: ¿lo cubrimos?
  report(kind, x, z, info = {}) {
    const g = this.game;
    if (!g.started || g.respawning) return;
    if (g.missions && g.missions.active) return; // en las misiones no se meten
    const d = { lugar: this.lugar(x, z), auto: info.auto || 'auto' };
    if (this.crew || this.cool > 0) {
      // igual sale en el noticiero
      if (kind !== 'persecucion' && Math.random() < 0.5) this.headline(kind, d);
      return;
    }
    this.headline(kind, d);
    this.dispatch(kind, x, z, d);
  }

  dispatch(kind, x, z, d) {
    const g = this.game;
    const chase = kind === 'persecucion';
    const pt = g.traffic.randomRoadPoint({ x, z }, chase ? 70 : 110, chase ? 120 : 190);
    if (!pt) return false;
    const e = pt.edge;
    const v = g.spawnVehicle('movil', pt.x, pt.z, Math.atan2(e.dx, e.dz));
    v.persistent = true;
    v.blip = '#e02020';
    const cam = g.spawnPed('civil', pt.x, pt.z, { look: this.look('camara'), name: 'Camarógrafo de ADNSUR' });
    const cro = g.spawnPed('civil', pt.x, pt.z, { look: this.look('cronista'), name: 'Cronista de ADNSUR' });
    for (const q of [cam, cro]) { q.persistent = true; q.brain = null; q.press = true; }
    cam.enterVehicle(v, 0);
    cro.enterVehicle(v, 1);
    const target = chase ? g.player : { x, z, pos: { x, z } };
    v.ai = new DriverAI(g, v, chase ? 'chase' : 'goto', { target, speedMul: chase ? 0.95 : 1.15 });
    if (chase) v.ai.ram = false;
    g.traffic.cars.push(v);
    this.crew = { kind, x, z, d, v, cam, cro, state: 'drive', t: 0, said: 0, sayT: 0 };
    this.addCamera(cam);
    if (dist(x, z, g.player.pos.x, g.player.pos.z) < 200) g.hud.showToast(chase ? '📺 El móvil de <b>ADNSUR</b> se sumó a la persecución' : '📺 El móvil de <b>ADNSUR</b> va para allá', 3.5);
    return true;
  }

  look(kind) {
    const L = randomLook('civil');
    if (kind === 'cronista') {
      Object.assign(L, { shirtKind: 'campera', shirt: 0xc01818, shirtHex: '#c01818', longSleeves: true, pants: 0x1e1e22, pantsKind: 'jean', hairStyle: 'long', fat: 0.05, height: 0.95, mustache: false, beard: false, stubble: false, glasses: false });
    } else {
      Object.assign(L, { shirtKind: 'campera', shirt: 0x2a2a2e, shirtHex: '#2a2a2e', longSleeves: true, pants: 0x3a4a6a, pantsKind: 'jean', hairStyle: 'cap', hat: 0xc01818 });
    }
    return L;
  }

  // la cámara al hombro del camarógrafo
  addCamera(p) {
    const grp = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.2, 0.42), new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.14, 8), new THREE.MeshLambertMaterial({ color: 0x333333 }));
    lens.rotation.x = Math.PI / 2; lens.position.z = 0.27;
    const tally = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.03), new THREE.MeshBasicMaterial({ color: 0xff2020 }));
    tally.position.set(0, 0.12, 0.15);
    grp.add(body, lens, tally);
    grp.position.set(-0.22, 1.62, 0.08);
    grp.visible = false;
    p.group.add(grp);
    p.camProp = grp;
  }

  update(dt) {
    const g = this.game;
    this.cool = Math.max(0, this.cool - dt);
    // persecución: con 3 estrellas o más (y manejando) sale el móvil detrás
    const lvl = g.police ? g.police.level : 0;
    if (lvl >= 3 && !this.chase) {
      this.chase = true;
      const pp = g.player.pos;
      if (g.player.vehicle) this.report('persecucion', pp.x, pp.z);
    } else if (lvl === 0 && this.chase) {
      this.chase = false;
      const pp = g.player.pos;
      if (!g.respawning) this.headline('fin', { lugar: this.lugar(pp.x, pp.z) });
    }
    const c = this.crew;
    if (!c) {
      this.idleNote(dt);
      return;
    }
    c.t += dt;
    const v = c.v, p = g.player, pp = p.vehicle ? p.vehicle.pos : p.pos;
    const far = dist(v.pos.x, v.pos.z, pp.x, pp.z);
    // si los atacan o les rompen el móvil, se termina la nota
    const hurt = [c.cam, c.cro].some((q) => q.dead || q.removed || q.health < q.maxHealth * 0.95);
    if ((hurt || v.dead) && c.state !== 'leave') {
      this.headline('atacado', c.d);
      for (const q of [c.cam, c.cro]) if (!q.dead && !q.removed) { if (q.vehicle) q.exitVehicle(); q.brain = new Brain(g, q, 'flee'); q.brain.fleeFrom = p; q.brain.t = 12; sayLine(q, pick(['¡Nos atacan! ¡Cortá, cortá!', '¡Pará, somos de la prensa!', '¡Salí de acá, loco!'])); }
      this.finish(false);
      return;
    }
    if (far > 330 || c.t > 150) { this.finish(true); return; }
    if (c.state === 'drive') {
      if (c.kind === 'persecucion') {
        // siguen al jugador; la cronista relata desde la ventanilla
        if (g.police.level === 0 || c.t > 80) { c.state = 'leave'; return; }
        this.narrate(dt, c, c.cro, 5);
        return;
      }
      const dd = dist(v.pos.x, v.pos.z, c.x, c.z);
      if (dd < 16 || c.t > 45 || (dd < 30 && v.speed < 1 && c.t > 8) || (v.ai && v.ai.totalStuck > 6)) this.arrive(c);
      return;
    }
    if (c.state === 'live') {
      // se acomodan y salen al aire
      const sp = c.spot;
      const okCro = this.walk(c.cro, sp.cro, sp.face);
      const okCam = this.walk(c.cam, sp.cam, sp.cro);
      if ((okCro && okCam) || c.t - c.liveAt > 8) {
        c.cam.camProp.visible = true;
        this.narrate(dt, c, c.cro, 4.5);
      }
      if (c.t - c.liveAt > 32) this.leave(c);
      return;
    }
    if (c.state === 'board') {
      const okA = c.cam.vehicle || this.walk(c.cam, v.doorPos(0), null, true);
      const okB = c.cro.vehicle || this.walk(c.cro, v.doorPos(1), null, true);
      if (okA && !c.cam.vehicle && !v.seats[0]) { c.cam.enterVehicle(v, 0); c.cam.brain = null; }
      if (okB && !c.cro.vehicle && !v.seats[1]) { c.cro.enterVehicle(v, 1); c.cro.brain = null; }
      if ((c.cam.vehicle && c.cro.vehicle) || c.t - c.leftAt > 15) c.state = 'leave';
      return;
    }
    if (c.state === 'leave') this.finish(true);
  }

  // camina hasta un punto; devuelve true al llegar (y mira para donde corresponde)
  walk(q, to, face, close = false) {
    if (q.dead || q.removed) return true;
    if (!q.brain || q.brain.mode !== 'script') { q.brain = new Brain(this.game, q, 'script'); }
    let done = false;
    q.brain.script = (dt, b) => {
      if (b.moveTo(to.x, to.z, 0, close ? 1.2 : 0.5)) {
        done = true;
        if (face) q.heading = Math.atan2(face.x - q.pos.x, face.z - q.pos.z);
      }
    };
    return Math.hypot(q.pos.x - to.x, q.pos.z - to.z) < (close ? 1.3 : 0.7) || done;
  }

  arrive(c) {
    const g = this.game, v = c.v;
    v.ai = null;
    v.ctrl.throttle = 0; v.ctrl.brake = 1; v.ctrl.steer = 0;
    v.vx *= 0.3; v.vz *= 0.3;
    c.cam.exitVehicle(); c.cro.exitVehicle();
    // la cronista se para con el hecho de fondo y el camarógrafo enfrente
    const dx = c.x - v.pos.x, dz = c.z - v.pos.z, L = Math.hypot(dx, dz) || 1;
    const ux = dx / L, uz = dz / L;
    // a un costado del móvil (así el camarógrafo no queda trabado contra la chata)
    const k = Math.min(L * 0.6, 8);
    const cro = { x: v.pos.x + ux * k + uz * 3.5, z: v.pos.z + uz * k - ux * 3.5 };
    const cam = { x: cro.x - ux * 3.2, z: cro.z - uz * 3.2 };
    c.spot = { cro, cam, face: cam };
    c.state = 'live';
    c.liveAt = c.t;
    c.said = 0; c.sayT = 2.5;
    if (v.pressLight) v.pressLight.material.color.set(0xff3020);
    void g;
  }

  // la cronista habla al aire; si el jugador está cerca, aparece la placa de la tele
  narrate(dt, c, who, every) {
    const g = this.game;
    c.sayT -= dt;
    if (c.sayT > 0) return;
    c.sayT = every;
    const lines = ADNSUR.vivo[c.kind] || ADNSUR.vivo.choque;
    const line = fill(lines[c.said % lines.length], c.d);
    c.said++;
    sayLine(who, line, every - 0.5);
    const pp = g.player.vehicle ? g.player.vehicle.pos : g.player.pos;
    if (dist(who.pos.x, who.pos.z, pp.x, pp.z) < 70) {
      g.hud.newsFlash(line, every);
      if (g.audio && g.audio.voiceMode === 'navegador') g.audio.say(line, 'cronista');
    }
  }

  leave(c) {
    c.cam.camProp.visible = false;
    c.state = 'board';
    c.leftAt = c.t;
  }

  finish(ok) {
    const g = this.game, c = this.crew;
    if (!c) return;
    this.crew = null;
    this.cool = rand(70, 120);
    this.idleT = rand(180, 300);
    const v = c.v;
    v.persistent = false;
    v.blip = null;
    if (v.pressLight) v.pressLight.material.color.set(0xffa020);
    for (const q of [c.cam, c.cro]) {
      if (q.removed) continue;
      q.persistent = false;
      q.spawned = true;
      if (q.camProp) q.camProp.visible = false;
      if (ok && !q.vehicle && !q.dead) q.brain = new Brain(g, q, 'wander');
    }
    if (ok && !v.dead && v.driver === c.cam) v.ai = new DriverAI(g, v, 'cruise', { speedMul: 1 });
  }

  // Sin nada que cubrir: de vez en cuando hacen una nota de algún bache de la ruta cerca del jugador
  idleNote(dt) {
    const g = this.game;
    if (g.missions && g.missions.active) return;
    this.idleT -= dt;
    if (this.idleT > 0 || this.cool > 0) return;
    this.idleT = rand(200, 320);
    const pp = g.player.pos;
    const holes = (g.roads.potholes || []).filter((h) => { const d = dist(h.x, h.z, pp.x, pp.z); return d > 50 && d < 140; });
    if (!holes.length) return;
    const h = pick(holes);
    this.dispatch('bache', h.x, h.z, { lugar: this.lugar(h.x, h.z) });
  }

  // El noticiero de ADNSUR Radio: primero lo que pasó en la calle, después las generales
  bulletin() {
    this.bi = (this.bi || 0) + 1;
    if (this.bi % 7 === 1) return pick(ADNSUR.apertura);
    if (this.bi % 7 === 0) return pick(ADNSUR.cierre);
    if (this.unread.length) return 'Último momento. ' + this.unread.shift() + '.';
    if (this.news.length && Math.random() < 0.3) return 'Repasamos: ' + pick(this.news).replace(/^./, (s) => s.toLowerCase()) + '.';
    return pick(ADNSUR.generales);
  }
}
