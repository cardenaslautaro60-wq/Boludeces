import * as THREE from 'three';
import { POI } from '../world/mapdata.js';
import { Marker } from './activities.js';
import { Brain } from './ai.js';
import { DriverAI } from './traffic.js';
import { randomLook, LOOKS } from '../entities/humanoid.js';
import { signTexture } from '../render/textures.js';
import { dist, rand, pick, clamp } from '../util.js';

class MissionFail extends Error {}
class MissionAbort extends Error {}

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

// Contexto de una misión en curso: esperas, marcadores, cinemáticas y limpieza
class Ctx {
  constructor(game, def) {
    this.game = game;
    this.def = def;
    this.t = 0;
    this.waiters = [];
    this.fails = [];
    this.cleanup = [];
    this.allowSwitch = false;
    this.allowShops = false;
    this.noWanted = false;
    this.inCutscene = false;
    this.skip = false;
  }

  frame(dt) {
    this.t += dt;
    for (const f of this.fails) {
      let bad = false;
      try { bad = f.fn(); } catch (e) { bad = false; }
      if (bad) { this.abort(new MissionFail(f.reason)); return; }
    }
    const ws = this.waiters;
    this.waiters = [];
    for (const w of ws) {
      let ok = false;
      try { ok = w.fn(); } catch (e) { ok = false; }
      if (ok) w.resolve(); else this.waiters.push(w);
    }
  }

  abort(err) {
    const ws = this.waiters;
    this.waiters = [];
    this.aborted = err;
    for (const w of ws) w.reject(err);
  }

  until(fn) {
    if (this.aborted) return Promise.reject(this.aborted);
    return new Promise((resolve, reject) => this.waiters.push({ fn, resolve, reject }));
  }
  wait(s) { const end = this.t + s; return this.until(() => this.t >= end); }
  failIf(fn, reason) { const f = { fn, reason }; this.fails.push(f); return f; }
  removeFail(f) { this.fails = this.fails.filter((x) => x !== f); }

  // ---- utilidades de escena ----
  spawnVehicle(key, x, z, rot, opts = {}) {
    if (!opts.exact) ({ x, z } = this.game.safeSpot(x, z, 2.2, true));
    const v = this.game.spawnVehicle(key, x, z, rot, opts);
    v.missionOwned = true;
    this.cleanup.push(() => { if (!v.removed && !(v.driver && v.driver.isPlayer) && !opts.keep) { v.missionOwned = false; } });
    return v;
  }
  spawnPed(kind, x, z, opts = {}) {
    if (!opts.exact) ({ x, z } = this.game.safeSpot(x, z, 0.5));
    const p = this.game.spawnPed(kind, x, z, { look: opts.look || randomLook(kind), ...opts });
    p.persistent = true;
    this.cleanup.push(() => { if (!p.removed) { p.blip = null; if (opts.keep) return; if (p.vehicle && p.vehicle.driver === this.game.player) { p.exitVehicle(); } p.persistent = false; p.spawned = true; if (p.brain && p.brain.mode === 'script') p.brain.setMode('wander'); } });
    return p;
  }
  marker(x, z, color = 0xffd21a, opts = {}) {
    const m = new Marker(this.game, x, z, color, opts);
    this.cleanup.push(() => m.dispose());
    this.markers = this.markers || [];
    this.markers.push(m);
    return m;
  }
  blip(x, z, color = '#ffd21a') {
    const b = { x, z, color, size: 8, edge: true };
    this.game.blips.push(b);
    this.cleanup.push(() => this.removeBlip(b));
    return b;
  }
  removeBlip(b) { const i = this.game.blips.indexOf(b); if (i >= 0) this.game.blips.splice(i, 1); }
  objective(text, dur = 6) { this.game.hud.subtitle(text, dur); this.game.missions.lastObjective = text; }
  help(text, dur = 6) { this.game.hud.showHelp(text, dur); }

  async goTo(x, z, opts = {}) {
    const g = this.game;
    const m = this.marker(x, z, opts.color || 0xffd21a, { r: opts.radius || (opts.vehicle ? 3 : 1.4), h: opts.vehicle ? 1.2 : 1.6 });
    const b = this.blip(x, z);
    if (opts.text) this.objective(opts.text);
    await this.until(() => {
      m.update(1 / 60);
      const p = g.player;
      const pos = p.vehicle ? p.vehicle.pos : p.pos;
      if (!m.contains(pos, 0.5)) return false;
      if (opts.vehicle === true && !p.vehicle) return false;
      if (opts.vehicle && opts.vehicle !== true && p.vehicle !== opts.vehicle) return false;
      if (opts.onFoot && p.vehicle) return false;
      if (opts.slow && p.vehicle && p.vehicle.speed > 6) return false;
      if (opts.check && !opts.check()) return false;
      return true;
    });
    m.dispose(); this.removeBlip(b);
  }

  timer(seconds, label = 'TIEMPO') {
    const end = this.t + seconds;
    const id = 'mtimer';
    const f = this.failIf(() => {
      const left = Math.max(0, end - this.t);
      this.game.hud.setCounter(id, label, `${Math.floor(left / 60)}:${String(Math.floor(left % 60)).padStart(2, '0')}`);
      return left <= 0;
    }, 'Se te acabó el tiempo.');
    this.cleanup.push(() => this.game.hud.removeCounter(id));
    return { stop: () => { this.removeFail(f); this.game.hud.removeCounter(id); } };
  }

  // ---- cinemáticas ----
  async cutscene(fn) {
    const g = this.game;
    this.inCutscene = true;
    g.missions.skipPressed = false;
    g.controlsLocked = true;
    g.hud.letterbox(true);
    g.hud.hideHelp();
    const p = g.player;
    p.moveMag = 0; p.aiming = false;
    this.skip = false;
    g.population.clearAround(p.pos, 30);
    g.population.enabled = false;
    try { await fn(); } finally {
      g.cameraRig.endCinematic();
      g.hud.letterbox(false);
      g.hud.clearSubtitle();
      g.controlsLocked = false;
      g.population.enabled = true;
      this.inCutscene = false;
      const pp = g.player;
      g.cameraRig.snapBehind(pp.vehicle ? pp.vehicle.heading : pp.heading);
    }
  }

  async say(who, text, dur) {
    const g = this.game;
    dur = dur || clamp(text.length * 0.06 + 1.2, 2.2, 6);
    g.hud.subtitle(who ? `<span class="who">${who}:</span> ${text}` : `<i>${text}</i>`, dur + 1);
    if (g.settings.tts) g.audio.speak(text, who === 'Petroca' ? 0.8 : who === 'Tenpesos' ? 0.6 : 1.1);
    const end = this.t + dur;
    const t0 = this.t;
    await this.until(() => this.t >= end || (this.t - t0 > 0.35 && this.game.missions.skipPressed));
    this.game.missions.skipPressed = false;
  }

  cam(from, to, look, dur = 5, opts = {}) { this.game.cameraRig.startCinematic(from, to, look, dur, opts); }

  async fade(black, d = 0.6) { await this.game.hud.fadeTo(black, d); }

  place(ped, x, z, rot = 0) {
    if (ped.vehicle) ped.exitVehicle();
    ped.pos.set(x, this.game.world.footGround(x, z), z);
    ped.heading = rot;
    ped.vx = ped.vz = 0;
  }
  face(ped, other) { ped.heading = Math.atan2(other.pos.x - ped.pos.x, other.pos.z - ped.pos.z); }

  script(ped, fn) {
    ped.brain = new Brain(this.game, ped, 'script');
    ped.brain.script = fn;
    return ped.brain;
  }
}

export class Missions {
  constructor(game) {
    this.game = game;
    this.done = [];
    this.active = null;
    this.starters = [];
    this.lastBrief = '';
    this.list = this.defs();
    this.refresh();
  }

  nextHint() {
    const m = this.list.find((d) => !this.done.includes(d.id));
    if (!m) return '¡Terminaste la historia! Seguí recorriendo Comodoro, juntá bolsitas y hacé saltos.';
    return `${m.title} — ${m.hint}`;
  }

  // marcadores de inicio de misión
  refresh() {
    const g = this.game;
    for (const s of this.starters) { s.marker.dispose(); const i = g.blips.indexOf(s.blip); if (i >= 0) g.blips.splice(i, 1); }
    this.starters = [];
    const next = this.list.find((d) => !this.done.includes(d.id) && d.start);
    if (!next) return;
    const pos = next.start();
    const marker = new Marker(g, pos.x, pos.z, 0xffd21a, { r: 1.3 });
    const blip = { x: pos.x, z: pos.z, letter: next.giver, bg: next.giver === 'N' ? '#1c2f6b' : '#c89a10', name: next.giver === 'N' ? 'Misión de Newbery' : 'Misión del Petroca', legend: true };
    g.blips.push(blip);
    this.starters.push({ def: next, marker, blip });
  }

  startIntro() {
    const intro = this.list[0];
    this.start(intro);
  }

  update(dt) {
    const g = this.game;
    const inp = g.input;
    if (inp.was('enter') || inp.was('sprint') || inp.was('fire') || inp.was('jump') || inp.touch.pressed.size) this.skipPressed = true;
    if (this.active) { this.active.frame(dt); return; }
    for (const s of this.starters) {
      s.marker.update(dt);
      const p = g.player;
      if (!p.vehicle && s.marker.contains(p.pos) && !g.respawning) {
        if (g.police.level > 0) { g.hud.showHelp('Perdé a la cana antes de empezar la misión.', 3); continue; }
        if (s.def.needGordopin && p !== g.gordopin) { g.hud.showHelp('Esta misión la arranca el <b>Gordopin</b>. Apretá TAB para cambiar.', 3); continue; }
        this.start(s.def);
        break;
      }
    }
  }

  async start(def) {
    const g = this.game;
    for (const s of this.starters) s.marker.visible = false;
    const ctx = new Ctx(g, def);
    this.active = ctx;
    ctx.allowSwitch = !!def.allowSwitch;
    this.lastBrief = `<b>${def.title}</b><br>${def.hint}`;
    g.hud.missionTitle(def.title, 4);
    g.activities.remis && g.activities.stopRemis('Arrancó una misión.');
    // fallas comunes
    if (def.needPetroca) ctx.failIf(() => g.petroca.dead, '¡Mataron al Petroca!');
    try {
      await def.run(ctx, g);
      this.pass(ctx, def);
    } catch (e) {
      if (e instanceof MissionFail) this.showFail(e.message);
      else if (!(e instanceof MissionAbort)) { console.error(e); this.showFail('Algo salió mal.'); }
    } finally {
      for (const c of ctx.cleanup) { try { c(); } catch (err) { /* nada */ } }
      g.hud.clearCounters();
      if (ctx.inCutscene) { g.cameraRig.endCinematic(); g.hud.letterbox(false); g.controlsLocked = false; }
      g.env.forcedWeather = null;
      this.active = null;
      if (g.companionActive && g.companion && !g.companion.dead) {
        const c = g.companion;
        if (!c.brain || c.brain.mode !== 'follow') c.brain = new Brain(g, c, 'follow');
        c.brain.driveTarget = null;
      }
      this.refresh();
    }
  }

  pass(ctx, def) {
    const g = this.game;
    this.done.push(def.id);
    g.stats.missions = this.done.length;
    g.addMoney(def.reward || 0, true);
    g.stats.respect = Math.min(100, g.stats.respect + (def.respect || 5));
    g.hud.bigText('¡MISIÓN SUPERADA!', `${def.reward ? '$' + def.reward.toLocaleString('es-AR') + '<br>' : ''}RESPETO +`, 5);
    g.audio.missionPassed();
    g.police.clear();
  }

  showFail(reason) {
    const g = this.game;
    if (g.respawning) { setTimeout(() => this.showFail(reason), 5200); return; }
    g.hud.bigText('¡MISIÓN FALLIDA!', reason, 4.5, 'red');
    g.audio.missionFailed();
  }

  fail(reason, silent = false) {
    if (!this.active) return;
    this.active.abort(silent ? new MissionFail(reason) : new MissionFail(reason));
  }

  onPedDeath(ped) { if (this.active && this.active.onPedDeath) this.active.onPedDeath(ped); }

  // ======================================================================
  defs() {
    const g = this.game;
    const M = () => g.city.markers;
    const garage = () => ({ x: M().garagePetroca.x + 2, z: M().garagePetroca.z });
    return [
      // ------------------------------------------------------------------
      {
        id: 'intro', title: 'No me van a sacar de la calle', giver: 'P', hint: 'Volvé en bici desde el Chenque a la Casa de la Abuela.', reward: 200, respect: 5,
        run: async (c, g) => {
          const G = g.gordopin;
          g.env.time = 18 * 60 + 20;
          g.env.setWeather('despejado', true);
          const sx = POI.semaforo.x - 8.2, sz = POI.semaforo.z - 8.2;
          c.place(G, sx, sz, Math.PI / 4);
          g.money = 250;
          const car = c.spawnVehicle('patrullero', POI.semaforo.x - 2.5, POI.semaforo.z - 30, 0, { persistent: true });
          car.siren = true;
          const ten = c.spawnPed('tenpesos', sx + 3, sz - 3, { look: randomLook('tenpesos'), name: 'Tenpesos' });
          const pul = c.spawnPed('cana', sx + 4, sz - 1.5, { look: randomLook('cana'), name: 'Pulenta' });
          c.script(ten, () => {}); c.script(pul, () => {});
          c.face(ten, G); c.face(pul, G);
          ten.group.visible = false; pul.group.visible = false;
          await c.cutscene(async () => {
            const P = G.pos;
            c.cam(V3(P.x + 60, P.y + 45, P.z + 40), V3(P.x + 18, P.y + 10, P.z + 16), V3(P.x, P.y + 2, P.z), 7, { lookFrom: V3(P.x, P.y + 5, P.z - 60) });
            G.jugg = true;
            await c.say('', 'Comodoro Rivadavia, 2004. El barril sube, el Km 3 se llena de chatas nuevas... y el viento, como siempre, sopla.', 6);
            c.cam(V3(P.x + 4, P.y + 1.8, P.z + 4.5), V3(P.x + 3, P.y + 1.7, P.z + 3.5), V3(P.x, P.y + 1.7, P.z), 5);
            await c.say('', 'En el semáforo de San Martín y Rivadavia, el Gordopin hace lo que mejor le sale.', 4);
            ten.group.visible = true; pul.group.visible = true;
            G.jugg = false;
            c.face(G, ten);
            c.cam(V3(P.x - 3, P.y + 1.9, P.z + 3), V3(P.x - 2.5, P.y + 1.8, P.z + 2.5), V3(ten.pos.x, P.y + 1.6, ten.pos.z), 6);
            await c.say('Tenpesos', 'Mirá quién está acá. El malabarista del semáforo.');
            await c.say('Gordopin', 'Buenas, comisario. Estoy laburando, no jodo a nadie.');
            await c.say('Tenpesos', 'Don Crudo quiere el Centro limpio. Nada de malabaristas, nada de trapitos. Esto ahora es una ciudad petrolera seria.');
            c.cam(V3(P.x + 2.5, P.y + 1.7, P.z - 1), V3(P.x + 2, P.y + 1.7, P.z - 0.5), V3(P.x, P.y + 1.6, P.z), 6);
            await c.say('Gordopin', 'Yo no soy trapito, soy malabarista. Y trabajo en el semáforo que a mí se me da la gana.');
            await c.say('Pulenta', 'Uh, se nos puso picante el gordo.');
            await c.say('Tenpesos', 'La recaudación del día es mía. Llamalo peaje. Y ahora te vas a dar una vuelta con nosotros.');
            await c.fade(true, 0.8);
            g.money = 0;
            // arriba del Chenque
            const ax = 175, az = -352;
            c.place(G, ax, az, Math.PI);
            const bike = c.spawnVehicle('bmx', ax + 2.5, az + 1.5, Math.PI * 0.9, { keep: true });
            bike.missionOwned = false;
            c.place(ten, ax + 30, az + 10, 0); ten.group.visible = false; pul.group.visible = false;
            car.pos.set(ax + 8, g.terrain.groundAt(ax + 8, az + 6), az + 6);
            car.heading = Math.PI * 0.8;
            car.siren = false;
            c.cam(V3(ax - 18, G.pos.y + 14, az - 10), V3(ax - 7, G.pos.y + 4, az - 5), V3(ax, G.pos.y + 1.2, az), 8, { lookFrom: V3(ax + 50, G.pos.y - 30, az + 200) });
            await c.fade(false, 0.8);
            await c.say('', 'Un rato después, arriba del Cerro Chenque...', 3);
            await c.say('Tenpesos', '¡A mí nadie me dice que no, gordo! ¡Bajate caminando, a ver si adelgazás!', 3.5);
            g.removeVehicle(car);
            await c.say('Gordopin', 'Aaah, la concha de la lora... otra vez lo mismo.', 3.5);
          });
          g.removePed(ten); g.removePed(pul);
          c.help(`Acercate a la <b>bici</b> y ${g.key('enter')} para subirte. Pedaleá con ${g.key('forward').replace(/^\S+ /, '')}; para el saltito, ${g.key('jump')}.`, 8);
          await c.until(() => G.vehicle && G.vehicle.type.bike);
          await c.goTo(M().casaAbuela.x, M().casaAbuela.z, { text: 'Andá a la <b>Casa de la Abuela</b> en el Barrio Pietrobelli.', radius: 2.5 });
          // llega el Petroca
          if (G.vehicle) G.exitVehicle();
          const chata = c.spawnVehicle('empresa', M().garagePetroca.x + 18, M().garagePetroca.z + 2, 0);
          const P = g.petroca;
          await c.cutscene(async () => {
            const hx = M().casaAbuela.x, hz = M().casaAbuela.z;
            c.place(G, hx + 1.5, hz, Math.PI / 2);
            g.setCompanionActive(true, hx + 6, hz + 4);
            c.script(P, () => {});
            P.enterVehicle(chata, 0);
            chata.pos.set(hx + 8, chata.pos.y, hz + 30);
            chata.heading = Math.PI;
            chata.ai = new DriverAI(g, chata, 'goto', { target: { x: hx + 6, z: hz + 6, pos: { x: hx + 6, z: hz + 6 } } });
            chata.ai.mode = 'goto';
            g.traffic.cars.push(chata);
            c.cam(V3(hx + 12, G.pos.y + 3, hz - 8), V3(hx + 10, G.pos.y + 2.5, hz - 6), V3(hx + 6, G.pos.y + 1, hz + 6), 8);
            await c.wait(3.5);
            chata.ai = null; chata.ctrl.throttle = 0; chata.ctrl.brake = 1; chata.vx = chata.vz = 0;
            P.exitVehicle();
            c.face(P, G); c.face(G, P);
            c.cam(V3(hx + 4.5, G.pos.y + 1.8, hz - 3), V3(hx + 4, G.pos.y + 1.8, hz - 2.5), V3((G.pos.x + P.pos.x) / 2, G.pos.y + 1.6, (G.pos.z + P.pos.z) / 2), 8);
            await c.say('Petroca', '¡Buena petroca! ¡El Gordopin! ¿Qué hacés con esa cara, loco?');
            await c.say('Gordopin', 'Tenpesos me afanó la recaudación y me tiró arriba del Chenque.');
            await c.say('Petroca', 'Ese rati es un garca. Anda de la mano con Don Crudo, el de la petrolera. Dicen que quieren perforar en el barrio... ¡hasta en La Madriguera!');
            await c.say('Gordopin', '¿En la cancha del Lobo? Ni en pedo.');
            await c.say('Petroca', 'Tranqui. Yo tengo un par de ideas... y guita. Mucha guita. Tomá, para que no andes seco.');
          });
          P.brain = new Brain(g, P, 'follow');
          c.help(`El <b>Petroca</b> ahora te acompaña: ${g.key('switchChar')} para jugar con él. Las misiones con la <b>P</b> amarilla te las da el Petroca.`, 8);
        },
        start: null,
      },
      // ------------------------------------------------------------------
      {
        id: 'chata', title: 'La chata del Petroca', giver: 'P', hint: 'Recuperá la Jilux roja del Petroca en el Puerto.', reward: 500, respect: 6, needPetroca: true, needGordopin: true,
        start: garage,
        run: async (c, g) => {
          const G = g.player, P = g.companion;
          const gx = M().garagePetroca.x, gz = M().garagePetroca.z;
          const empresa = c.spawnVehicle('empresa', gx + 7, gz + 8, 0);
          await c.cutscene(async () => {
            c.place(P, gx + 3, gz - 2, -Math.PI / 2); c.face(G, P); c.face(P, G);
            c.cam(V3(gx + 8, G.pos.y + 2, gz - 5), V3(gx + 7, G.pos.y + 2, gz - 4), V3(gx + 3, G.pos.y + 1.4, gz), 8);
            await c.say('Petroca', 'Gordo, me afanaron la chata roja. La Jilux que me compré con el bono. La vieron en el Puerto, con unos chetos de Rada.');
            await c.say('Gordopin', '¿Chetos en el Puerto? Esos no laburan ni en pedo.');
            await c.say('Petroca', 'Vamos a buscarla. Manejá vos la de la empresa, que yo llevo la nueve.');
          });
          c.objective('Subite a la <b>chata de la empresa</b>.');
          empresa.blip = '#40a0ff';
          await c.until(() => G.vehicle === empresa);
          empresa.blip = null;
          // en el puerto
          const PU = POI.puerto || POI.terminal;
          const jx = PU.x, jz = PU.z;
          const jilux = c.spawnVehicle('jilux', jx, jz, Math.PI / 2, { color: 0xb01818 });
          jilux.locked = false;
          const chetos = [];
          for (let i = 0; i < 3; i++) {
            const q = c.spawnPed('cheto', jx - 4 + i * 3, jz + 5, {});
            q.give(i === 0 ? 'pistola' : 'bate', 40); q.setWeapon(i === 0 ? 'pistola' : 'bate');
            q.brain = new Brain(g, q, 'guard', { hostile: true, home: { x: q.pos.x, z: q.pos.z } });
            q.brain.aggroRange = 22; q.brain.aggroDelay = 0.5;
            q.blip = '#ff3030';
            chetos.push(q);
          }
          c.failIf(() => jilux.dead, '¡Hiciste bolsa la chata del Petroca!');
          await c.goTo(jx, jz, { text: 'Andá al <b>Puerto</b>.', vehicle: true, radius: 14 });
          c.objective('Recuperá la <b>Jilux roja</b> del Petroca.');
          jilux.blip = '#40a0ff';
          await c.until(() => G.vehicle === jilux);
          jilux.blip = null;
          for (const q of chetos) q.blip = null;
          g.hud.showToast('¡La chata tiene alarma!', 2);
          g.police.setLevel(1);
          c.objective('Perdé a la <b>cana</b>.');
          await c.until(() => g.police.level === 0);
          await c.goTo(gx + 3, gz, { text: 'Llevá la chata al <b>garage del Petroca</b>.', vehicle: jilux, radius: 3.5, slow: true });
          await c.cutscene(async () => {
            jilux.ctrl.brake = 1;
            await c.wait(0.3);
            G.exitVehicle();
            if (P.vehicle) P.exitVehicle();
            c.cam(V3(gx + 10, G.pos.y + 2.5, gz + 6), V3(gx + 9, G.pos.y + 2.2, gz + 5), V3(jilux.pos.x, jilux.pos.y + 1, jilux.pos.z), 6);
            await c.say('Petroca', '¡Buena petroca! ¡Mi bebé! ¿Ves, gordo? Con vos no hay quien pueda.');
            await c.say('Gordopin', 'Ahora invitá un chori, que estoy seco.');
          });
          jilux.persistent = true; jilux.playerOwned = true;
          g.lastPlayerVehicle = jilux;
        },
      },
      // ------------------------------------------------------------------
      {
        id: 'drive', title: 'Choripán Drive-Thru', giver: 'P', hint: 'Llevá a los pibes al Chori del Viento... y bancate lo que venga.', reward: 800, respect: 8, needPetroca: true, needGordopin: true,
        start: garage,
        run: async (c, g) => {
          const G = g.player, P = g.companion;
          const gx = M().garagePetroca.x, gz = M().garagePetroca.z;
          const car = c.spawnVehicle('falcon', gx + 7, gz - 6, 0, { color: 0x2f4a3a });
          const pibes = [0, 1].map((i) => {
            const q = c.spawnPed('lobo', gx + 4 + i, gz - 8 + i * 1.5, { name: i ? 'Nahuel' : 'El Chino' });
            q.give('pistola', 80); q.setWeapon('pistola'); q.isFriend = true;
            q.brain = new Brain(g, q, 'follow');
            return q;
          });
          await c.cutscene(async () => {
            c.cam(V3(gx + 12, G.pos.y + 2.5, gz - 2), V3(gx + 11, G.pos.y + 2.2, gz - 3), V3(gx + 5, G.pos.y + 1.3, gz - 6), 8);
            await c.say('Petroca', 'Tengo un hambre que me como un guanaco. Vamos al Chori del Viento, en la Costanera.');
            await c.say('El Chino', 'Yo me pido tres. Y no me mires así, Gordo, que vos te pedís cuatro.');
            await c.say('Gordopin', 'Subanse al Falcón. Manejo yo.');
          });
          car.blip = '#40a0ff';
          c.objective('Subite al <b>Falcón</b>.');
          c.failIf(() => pibes.some((q) => q.dead), '¡Mataron a uno de los pibes!');
          c.failIf(() => car.dead, 'Se hizo bolsa el Falcón.');
          await c.until(() => G.vehicle === car);
          car.blip = null;
          await c.until(() => pibes.every((q) => q.vehicle === car) && P.vehicle === car);
          await c.goTo(POI.chori.x - 12, POI.chori.z, { text: 'Llevá a los pibes al <b>Chori del Viento</b>, en la Costanera.', vehicle: car, radius: 4.5, slow: true });
          const guy = c.spawnPed('civil', POI.chori.x + 2.2, POI.chori.z, { name: 'El chorizero' });
          c.script(guy, () => {});
          c.face(guy, car);
          await c.cutscene(async () => {
            car.ctrl.brake = 1; car.vx = car.vz = 0;
            const cx = car.pos.x, cz = car.pos.z;
            c.cam(V3(cx - 4, car.pos.y + 2, cz + 6), V3(cx - 3, car.pos.y + 1.8, cz + 5), V3(cx + 2, car.pos.y + 1.2, cz), 10);
            await c.say('El chorizero', '¿Qué va a ser, muchachos?');
            await c.say('Petroca', 'Dame dos choris, un bondiola completo, un chori con doble chimichurri, papas grandes, una bondiola sin tomate, dos cocas de litro y medio, una con hielo...', 6);
            await c.say('Petroca', '...y una ensalada.');
            await c.say('Gordopin', '¿Una ensalada?');
            await c.say('Petroca', 'Estoy a dieta, gordo.');
            await c.say('El chorizero', 'Son ciento cuarenta y tres pesos.');
            await c.say('Petroca', 'Cobrate de acá, maestro. ¡Buena petroca!');
          });
          // aparecen los chetos
          const road = g.roads.nearestEdge(car.pos.x, car.pos.z - 60, 60);
          const ex = road ? road.x : car.pos.x, ez = road ? road.z : car.pos.z - 60;
          const enemy = c.spawnVehicle('gool', ex, ez, 0, { color: 0x7b2d8b });
          enemy.health = 700;
          const shooters = [0, 1, 2].map((i) => {
            const q = c.spawnPed('cheto', ex, ez, {});
            q.give('uzi', 400); q.setWeapon('uzi');
            q.enterVehicle(enemy, i);
            q.brain = new Brain(g, q, 'follow');
            q.brain.mode = 'script';
            q.brain.script = (dt, b) => { if (q.vehicle) b.shootFromCar(dt, g.player.vehicle || g.player); };
            return q;
          });
          enemy.ai = new DriverAI(g, enemy, 'chase', { target: car, speedMul: 1.1 });
          enemy.ai.ram = false;
          g.traffic.cars.push(enemy);
          enemy.blip = '#ff3030';
          g.hud.showToast('¡Los chetos de Rada Tilly!', 2);
          await c.say('El Chino', '¡Nos tiran! ¡Son los chetos!', 2);
          await c.wait(3);
          enemy.ai.mode = 'flee'; enemy.ai.target = car;
          c.objective('¡Seguí al <b>Gool violeta</b> y hacelo bolsa! Los pibes tiran desde el auto.');
          for (const q of [...pibes, P]) { q.brain.driveTarget = enemy; }
          let farT = 0;
          c.failIf(() => {
            const d = dist(enemy.pos.x, enemy.pos.z, G.pos.x, G.pos.z);
            farT = d > 220 ? farT + 1 / 60 : 0;
            return farT > 8 && !enemy.dead;
          }, 'Se te escaparon los chetos.');
          await c.until(() => enemy.dead || enemy.health < 150 && enemy.fireT > 0);
          if (!enemy.dead) enemy.explode();
          for (const q of shooters) if (!q.dead) q.hurt(999, G);
          for (const q of [...pibes, P]) q.brain.driveTarget = null;
          enemy.blip = null;
          await c.say('Nahuel', '¡Tomá! ¡Eso les pasa por meterse con el barrio!', 2.5);
          await c.goTo(M().casaAbuela.x + 6, M().casaAbuela.z - 20, { text: 'Llevá a los pibes al <b>barrio</b>.', vehicle: true, radius: 5, slow: true });
          for (const q of pibes) { if (q.vehicle) q.exitVehicle(); q.brain = new Brain(g, q, 'wander'); q.persistent = false; q.spawned = true; }
          await c.say('El Chino', 'Gracias, Gordo. El chori estaba de diez. La ensalada del Petroca, no sé.', 3);
        },
      },
      // ------------------------------------------------------------------
      {
        id: 'bono', title: 'Cobrar el bono', giver: 'P', hint: 'Llevá al Petroca al yacimiento de Pampa del Castillo antes del cambio de turno. Hay temporal.', reward: 2500, respect: 6, needPetroca: true, needGordopin: true,
        start: garage,
        run: async (c, g) => {
          const G = g.player, P = g.companion;
          const gx = M().garagePetroca.x, gz = M().garagePetroca.z;
          const chata = c.spawnVehicle('jilux', gx + 7, gz + 6, 0, { color: 0xb01818 });
          await c.cutscene(async () => {
            c.cam(V3(gx + 10, G.pos.y + 2.5, gz - 4), V3(gx + 9, G.pos.y + 2.2, gz - 3), V3(gx + 3, G.pos.y + 1.3, gz), 8);
            await c.say('Petroca', 'Gordo, hoy pagan el bono en el yacimiento. Si no llego antes del cambio de turno, lo cobra el capataz.');
            await c.say('Gordopin', '¿Y por qué no vas vos?');
            await c.say('Petroca', 'Porque se viene un temporal de la gran siete y vos manejás mejor en la tierra. Dale, que es en Pampa del Castillo.');
          });
          g.env.forcedWeather = 'temporal';
          g.env.setWeather('temporal');
          chata.blip = '#40a0ff';
          c.objective('Subite a la <b>chata del Petroca</b>.');
          c.failIf(() => chata.dead, 'Se hizo bolsa la chata.');
          await c.until(() => G.vehicle === chata && P.vehicle === chata);
          chata.blip = null;
          c.help('Con el temporal, el viento empuja los autos hacia el <b>Este</b>. Contravolanteá.', 6);
          const tm = c.timer(240, 'CAMBIO DE TURNO');
          await c.goTo(POI.yacimiento.x + 20, POI.yacimiento.z + 20, { text: 'Llevá al Petroca al <b>campamento de Pampa del Castillo</b>.', vehicle: chata, radius: 8 });
          tm.stop();
          await c.cutscene(async () => {
            chata.ctrl.brake = 1; chata.vx = chata.vz = 0;
            G.exitVehicle(); P.exitVehicle();
            const x = POI.yacimiento.x, z = POI.yacimiento.z;
            c.cam(V3(x + 20, G.pos.y + 4, z + 26), V3(x + 18, G.pos.y + 3, z + 24), V3(x, G.pos.y + 2, z + 8), 10);
            c.script(P, (dt, b) => b.moveTo(x, z + 6, 1));
            await c.say('', 'El Petroca entra al trailer de la empresa...', 3);
            P.group.visible = false;
            await c.wait(1.5);
            P.group.visible = true;
            c.place(P, x + 4, z + 10, 0);
            c.face(P, G);
            await c.say('Petroca', '¡COBRÉ! ¡Buena petrocaaaa! Tengo guita para mantener a cincuenta generaciones.');
            await c.say('Petroca', 'Tomá, esto es para vos. Y me compré una moto enduro. Es tuya, gordo.');
            await c.say('Gordopin', 'Con este viento la moto me va a llevar a Caleta Olivia.');
          });
          P.brain = new Brain(g, P, 'follow');
          const moto = g.spawnVehicle('enduro', POI.yacimiento.x + 8, POI.yacimiento.z + 16, 0, { color: 0xe86a1a });
          moto.persistent = true;
          g.env.forcedWeather = null;
          g.env.setWeather('ventoso');
        },
      },
      // ------------------------------------------------------------------
      {
        id: 'trapo', title: 'El trapo del Lobo', giver: 'N', hint: 'Los chetos se afanaron el trapo de la hinchada de Newbery. Recuperalo antes del clásico.', reward: 1500, respect: 12, needPetroca: true, needGordopin: true,
        start: () => ({ x: M().madriguera.x - 1, z: M().madriguera.z + 4 }),
        run: async (c, g) => {
          const G = g.player, P = g.companion;
          const mx = M().madriguera.x, mz = M().madriguera.z;
          const cacho = c.spawnPed('lobo', mx - 1.5, mz - 2, { name: 'Cacho, el utilero', look: { ...randomLook('lobo'), fat: 0.6, hair: 0xb0b0b0, hairStyle: 'beanie', mustache: true } });
          c.script(cacho, () => {});
          await c.cutscene(async () => {
            c.face(cacho, G); c.face(G, cacho);
            c.cam(V3(mx - 6, G.pos.y + 2, mz + 5), V3(mx - 5, G.pos.y + 1.9, mz + 4), V3(mx - 1, G.pos.y + 1.5, mz), 8);
            await c.say('Cacho, el utilero', 'Gordopin, una desgracia. Los chetos de Rada Tilly se afanaron el trapo grande de la hinchada. El de "LA BANDA DEL LOBO".');
            await c.say('Cacho, el utilero', 'Y el domingo es el clásico con Huracán. ¡No podemos salir sin el trapo!');
            await c.say('Gordopin', '¿Sin el trapo? Eso es peor que perder.');
            await c.say('Cacho, el utilero', 'Dicen que Don Crudo les pagó. Quiere que el club se desanime y venda la cancha para perforar.');
            await c.say('Gordopin', 'Vamos, Petroca. Nadie toca el trapo del Lobo.');
            await c.say('Cacho, el utilero', 'Tomá, esto era de mi viejo. Cuidala.');
          });
          G.give('pistola', 34);
          G.setWeapon('pistola');
          const mans = M().mansion;
          const chetos = [];
          for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            const q = c.spawnPed('cheto', mans.x + Math.cos(a) * 9, mans.z - 6 + Math.sin(a) * 7, {});
            const w = i % 3 === 0 ? 'pistola' : i % 3 === 1 ? 'bate' : 'uzi';
            q.give(w, 60); q.setWeapon(w);
            q.brain = new Brain(g, q, 'guard', { hostile: true, home: { x: q.pos.x, z: q.pos.z } });
            q.brain.aggroRange = 26; q.brain.aggroDelay = 0.8;
            chetos.push(q);
          }
          // el trapo (pickup)
          const flag = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 2.2, 10), new THREE.MeshLambertMaterial({ color: 0x1c2f6b }));
          flag.rotation.z = Math.PI / 2;
          flag.position.set(mans.x, g.world.footGround(mans.x, mans.z) + 0.5, mans.z - 2);
          g.scene.add(flag);
          c.cleanup.push(() => g.scene.remove(flag));
          await c.goTo(mans.x, mans.z - 30, { text: 'Andá a la <b>mansión de los Chetos</b> en Rada Tilly.', radius: 10 });
          for (const q of chetos) q.blip = '#ff3030';
          c.objective('Recuperá el <b>trapo del Lobo</b>. Cuidado con los chetos.');
          const fb = c.blip(flag.position.x, flag.position.z, '#40a0ff');
          await c.until(() => { flag.rotation.y += 0.03; return dist(G.pos.x, G.pos.z, flag.position.x, flag.position.z) < 2.6 && !G.vehicle; });
          g.scene.remove(flag); c.removeBlip(fb);
          g.audio.pickup();
          g.hud.showToast('¡Tenés el trapo del Lobo!', 2);
          // persecución
          const chase = c.spawnVehicle('gool', mans.x - 20, mans.z - 60, 0, { color: 0xf0a0c8 });
          const cc = [0, 1].map((i) => { const q = c.spawnPed('cheto', chase.pos.x, chase.pos.z, {}); q.give('uzi', 300); q.setWeapon('uzi'); q.enterVehicle(chase, i); q.brain = new Brain(g, q, 'script'); q.brain.script = (dt, b) => { if (q.vehicle) b.shootFromCar(dt, g.player.vehicle || g.player); }; return q; });
          chase.ai = new DriverAI(g, chase, 'chase', { target: G, speedMul: 1.05 });
          chase.ai.ram = false;
          g.traffic.cars.push(chase);
          chase.blip = '#ff3030';
          c.timer(210, 'CLÁSICO');
          await c.goTo(mx - 1, mz, { text: 'Llevá el trapo a <b>La Madriguera</b> antes del clásico.', radius: 3 });
          // colgar el trapo
          const banner = new THREE.Mesh(new THREE.PlaneGeometry(22, 3.2), new THREE.MeshBasicMaterial({ map: signTexture(['LA BANDA DEL LOBO'], { w: 1024, h: 150, bg: '#f4f4f4', fg: '#1c2f6b', borderColor: '#1c2f6b' }), side: THREE.DoubleSide }));
          const by = g.world.footGround(mx + 35, mz) + 3.4;
          banner.position.set(mx + 35, by, mz - 18.4);
          g.scene.add(banner);
          const fans = [];
          for (let i = 0; i < 8; i++) {
            const q = g.spawnPed('lobo', mx + 20 + (i % 4) * 5, mz - 8 + Math.floor(i / 4) * 4, {});
            q.persistent = true; q.dance = true; q.brain = new Brain(g, q, 'idle'); q.isFriend = true;
            fans.push(q);
          }
          await c.cutscene(async () => {
            c.cam(V3(mx + 30, by + 6, mz + 10), V3(mx + 34, by + 1, mz + 4), V3(mx + 35, by, mz - 18), 7);
            await c.say('Cacho, el utilero', '¡Vamos Lobo, carajo! ¡Volvió el trapo!', 3);
            await c.say('Gordopin', 'Aguante Newbery. Y que Don Crudo se vaya a perforar a la luna.', 3.5);
          });
          setTimeout(() => { for (const q of fans) { q.dance = false; q.persistent = false; q.spawned = true; q.brain = new Brain(g, q, 'wander'); } }, 20000);
          g.removePed(cacho);
          void P; void cc;
        },
      },
      // ------------------------------------------------------------------
      {
        id: 'cisterna', title: 'La cisterna de Don Crudo', giver: 'P', hint: 'Robá el camión cisterna del depósito de Crudo en el Km 3 y tiralo al mar desde el Muelle de Ultramar.', reward: 3000, respect: 10, needPetroca: true, needGordopin: true,
        start: garage,
        run: async (c, g) => {
          const G = g.player, P = g.companion;
          const gx = M().garagePetroca.x, gz = M().garagePetroca.z;
          await c.cutscene(async () => {
            c.cam(V3(gx + 10, G.pos.y + 2.5, gz - 4), V3(gx + 9, G.pos.y + 2.2, gz - 3), V3(gx + 3, G.pos.y + 1.3, gz), 8);
            await c.say('Petroca', 'Averigüé algo. Don Crudo tiene un camión cisterna en el depósito del Km 3. Adentro están los permisos truchos para perforar en La Madriguera.');
            await c.say('Gordopin', '¿Y qué hacemos? ¿Los quemamos?');
            await c.say('Petroca', 'Mejor: tiramos el camión al mar desde el Muelle de Ultramar. Sin permisos no hay perforación.');
            await c.say('Gordopin', '¿Y la cana?');
            await c.say('Petroca', 'Tenpesos le cuida el depósito. Así que vamos a tener que correr. Buena petroca.');
          });
          const D = POI.depositoCrudo;
          const truck = c.spawnVehicle('cisterna', D.x + 16, D.z + 12, Math.PI / 2);
          truck.health = 1200;
          const guards = [];
          for (let i = 0; i < 4; i++) {
            const q = c.spawnPed('caleta', D.x - 5 + i * 5, D.z + 18 + (i % 2) * 3, {});
            q.give(i % 2 ? 'pistola' : 'escopeta', 60); q.setWeapon(i % 2 ? 'pistola' : 'escopeta');
            q.brain = new Brain(g, q, 'guard', { hostile: true, home: { x: q.pos.x, z: q.pos.z } });
            q.brain.aggroRange = 30; q.brain.aggroDelay = 0.6;
            guards.push(q);
          }
          c.failIf(() => truck.dead, '¡Volaste el camión en el medio del Km 3!');
          await c.goTo(D.x + 10, D.z + 45, { text: 'Andá al <b>Depósito de Don Crudo</b> en el Km 3.', radius: 18 });
          for (const q of guards) q.blip = '#ff3030';
          truck.blip = '#40a0ff';
          c.objective('Robá el <b>camión cisterna</b>. Los caletas de Crudo lo cuidan.');
          await c.until(() => G.vehicle === truck);
          truck.blip = null;
          g.police.setLevel(2);
          g.hud.showToast('¡Tenpesos mandó a toda la comisaría!', 2.5);
          const hp = () => g.hud.setCounter('truck', 'CISTERNA', clamp((truck.health - 0) / 1200, 0, 1), true);
          c.failIf(() => { hp(); return false; }, '');
          c.cleanup.push(() => g.hud.removeCounter('truck'));
          c.objective('Tirá la cisterna al mar desde la punta del <b>Muelle de Ultramar</b> (Puerto).');
          const MU = POI.muelle || { x: truck.pos.x, z: truck.pos.z, tx: truck.pos.x, tz: truck.pos.z };
          const mb = c.blip(MU.tx, MU.tz, '#ffd21a');
          const mk = c.marker(MU.tx - MU.dx * 4, MU.tz - MU.dz * 4, 0xffd21a, { r: 4, h: 1, y: 2.6 });
          await c.until(() => { mk.update(1 / 60); return truck.sinking > 0.3 || (truck.pos.y < -0.5 && g.terrain.heightAt(truck.pos.x, truck.pos.z) < -1); });
          c.removeBlip(mb); mk.dispose();
          if (G.vehicle === truck) G.exitVehicle();
          g.police.clear();
          await c.cutscene(async () => {
            c.cam(V3(MU.tx - MU.dx * 25 - MU.dz * 12, 10, MU.tz - MU.dz * 25 + MU.dx * 12), V3(MU.tx - MU.dx * 18 - MU.dz * 8, 6, MU.tz - MU.dz * 18 + MU.dx * 8), V3(truck.pos.x, 0, truck.pos.z), 6);
            await c.say('', 'Los permisos truchos de Don Crudo se hunden en el Golfo San Jorge...', 3.5);
            await c.say('Petroca', '¡Buena petroca! ¡Ahora que venga Crudo a perforar con un snorkel!', 3.5);
          });
          c.place(G, MU.tx - MU.dx * 20, MU.tz - MU.dz * 20, Math.atan2(-MU.dx, -MU.dz));
          G.pos.y = 2.6;
          void P;
        },
      },
      // ------------------------------------------------------------------
      {
        id: 'final', title: 'Tenpesos, final del recorrido', giver: 'N', hint: 'Frená a Tenpesos antes de que clausure La Madriguera.', reward: 10000, respect: 20, needPetroca: true, needGordopin: true,
        start: () => ({ x: M().madriguera.x - 1, z: M().madriguera.z + 4 }),
        run: async (c, g) => {
          const G = g.player, P = g.companion;
          const mx = M().madriguera.x, mz = M().madriguera.z;
          await c.cutscene(async () => {
            c.place(P, mx - 2.5, mz + 1.5, 0);
            c.face(P, G); c.face(G, P);
            c.cam(V3(mx - 7, G.pos.y + 2.2, mz + 5), V3(mx - 6, G.pos.y + 2, mz + 4), V3(mx - 1.5, G.pos.y + 1.5, mz + 1), 8);
            await c.say('Petroca', 'Gordo, se pudrió todo. Tenpesos sabe que fuimos nosotros.');
            await c.say('Petroca', 'Viene para acá con una orden trucha firmada por Crudo para clausurar La Madriguera.');
            await c.say('Gordopin', 'Entonces lo paramos en el camino. A mí no me van a sacar nunca de la calle. Y al Lobo, de su cancha, tampoco.');
          });
          c.noWanted = true;
          // el patrullero de Tenpesos sale de la comisaría
          const cm = M().comisaria;
          const car = c.spawnVehicle('patrullero', cm.x, cm.z + 6, Math.PI / 2);
          car.health = 1600;
          car.siren = true;
          const ten = c.spawnPed('tenpesos', car.pos.x, car.pos.z, { name: 'Tenpesos', look: randomLook('tenpesos'), health: 200 });
          const pul = c.spawnPed('cana', car.pos.x, car.pos.z, { name: 'Pulenta' });
          pul.give('uzi', 999); pul.setWeapon('uzi');
          ten.enterVehicle(car, 0); pul.enterVehicle(car, 1);
          c.script(ten, () => {});
          c.script(pul, (dt, b) => { if (pul.vehicle && dist(car.pos.x, car.pos.z, G.pos.x, G.pos.z) < 45) b.shootFromCar(dt, g.player.vehicle || g.player); });
          car.ai = new DriverAI(g, car, 'route', { speedMul: 1.2 });
          car.ai.planRoute(mx - 10, mz);
          g.traffic.cars.push(car);
          car.blip = '#ff3030';
          c.objective('Subite a un auto y frená el <b>patrullero de Tenpesos</b> antes de que llegue a La Madriguera.');
          c.failIf(() => dist(car.pos.x, car.pos.z, mx, mz) < 25 && !car.dead && car.health > 250, 'Tenpesos clausuró La Madriguera.');
          await c.until(() => dist(car.pos.x, car.pos.z, G.pos.x, G.pos.z) < 70);
          car.ai.mode = 'flee'; car.ai.target = G; car.ai.speedMul = 1.25;
          c.fails = c.fails.filter((f) => f.reason !== 'Tenpesos clausuró La Madriguera.');
          g.hud.showToast('¡Tenpesos se escapa!', 2);
          c.objective('¡Destrozá el <b>patrullero de Tenpesos</b>! El Petroca tira desde el auto.');
          P.brain.driveTarget = car;
          let farT = 0;
          c.failIf(() => { const d = dist(car.pos.x, car.pos.z, G.pos.x, G.pos.z); farT = d > 260 ? farT + 1 / 60 : 0; return farT > 10; }, 'Tenpesos se escapó.');
          car.onImpact = () => {};
          await c.until(() => car.health < 300 || car.dead);
          // se funde el motor
          car.ai = null;
          car.ctrl.throttle = 0; car.ctrl.brake = 1;
          car.health = Math.max(car.health, 100);
          car.fireT = 0;
          P.brain.driveTarget = null;
          ten.exitVehicle(); pul.exitVehicle();
          pul.brain = new Brain(g, pul, 'flee'); pul.brain.fleeFrom = G; pul.brain.t = 30; pul.brain.base = 'flee';
          c.script(ten, (dt, b) => { const dx = ten.pos.x - G.pos.x, dz = ten.pos.z - G.pos.z, d = Math.hypot(dx, dz) || 1; ten.moveX = dx / d; ten.moveZ = dz / d; ten.moveMag = 1; ten.gait = d < 15 ? 2 : 1; });
          ten.speedMul = 0.62;
          ten.blip = '#ff3030'; car.blip = null;
          c.objective('¡Se le fundió el motor! Agarrá a <b>Tenpesos</b> antes de que se escape.');
          c.failIf(() => ten.dead, 'Tenpesos tiene que terminar preso, no muerto.');
          await c.until(() => !G.vehicle && dist(ten.pos.x, ten.pos.z, G.pos.x, G.pos.z) < 2.2);
          await c.cutscene(async () => {
            c.script(ten, () => {});
            ten.knockdown(0, 0, 1);
            c.place(P, G.pos.x + 1.5, G.pos.z + 1, 0);
            c.face(G, ten); c.face(P, ten);
            const x = ten.pos.x, z = ten.pos.z;
            c.cam(V3(x + 4, G.pos.y + 2.2, z + 4), V3(x + 3, G.pos.y + 1.8, z + 3), V3(x, G.pos.y + 0.8, z), 12);
            await c.say('Tenpesos', 'Esto no termina acá, gordo... Crudo tiene amigos en Buenos Aires.');
            await c.say('Petroca', 'Y nosotros tenemos esto: te grabé todo con el celu nuevo. Tiene cámara y todo, comisario. Buena petroca.');
            await c.say('Gordopin', 'A mí no me van a sacar nunca de la calle, comisario. Y a Newbery de La Madriguera, tampoco.');
            await c.fade(true, 1);
            g.hud.clearSubtitle();
            await c.say('', 'Días después, la causa contra Don Crudo y el comisario Tenpesos llegó a todos los diarios de la Patagonia.', 5);
            await c.say('', 'La Madriguera siguió siendo del Lobo. El domingo, Newbery le ganó el clásico a Huracán 2 a 1.', 5);
            await c.say('', 'Y el Gordopin volvió a su semáforo. El que a él se le da la gana.', 4.5);
            await c.fade(false, 1);
          });
          g.removePed(ten);
          g.hud.bigText('¡FIN DE LA HISTORIA!', 'Gracias por jugar · Aguante Comodoro<br><small>Seguí jugando: bolsitas, saltos, remís y malabares</small>', 8);
          void pul;
        },
      },
    ];
  }
}

export { MissionFail };
void LOOKS; void rand; void pick;
