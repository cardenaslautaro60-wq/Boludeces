import * as THREE from 'three';
import { World } from '../world/world.js';
import { Environment } from '../world/sky.js';
import { WORLD, POI, SPAWNS } from '../world/mapdata.js';
import { Effects } from '../render/effects.js';
import { Post } from '../render/post.js';
import { STYLE } from '../render/style.js';
import { Ped, sayLine, PED_LINES } from '../entities/ped.js';
import { Vehicle, VTYPES, carMaterials } from '../entities/vehicle.js';
import { makeEnvMap } from '../entities/carmodels.js';
import { LOOKS, randomLook } from '../entities/humanoid.js';
import { CameraRig } from './camera.js';
import { PlayerController } from './player.js';
import { Traffic } from './traffic.js';
import { Population } from './population.js';
import { Police } from './police.js';
import { Missions } from './missions.js';
import { Activities } from './activities.js';
import { Pickups } from './pickups.js';
import { Cheats } from './cheats.js';
import { NPCs } from './npcs.js';
import { WorldEvents } from './events.js';
import { SaveSystem } from './save.js';
import { Brain } from './ai.js';
import { HUD } from '../ui/hud.js';
import { Input } from '../ui/input.js';
import { Menus } from '../ui/menus.js';
import { Touch } from '../ui/touch.js';
import { Audio } from '../audio/audio.js';
import { MediaLibrary } from '../media/media.js';
import { clamp, pick, rand, dist, safeStorageGet, safeStorageSet } from '../util.js';

export class Game {
  constructor() {
    this.vehicles = [];
    this.peds = [];
    this.blips = [];
    this.money = 250;
    this.paused = true;
    this.started = false;
    this.controlsLocked = false;
    this.worldBounds = WORLD;
    this.time = 0;
    this.stats = {
      fat: 62, muscle: 12, stamina: 20, respect: 0, carsStolen: 0, pedsKilled: 0, missions: 0,
      bags: 0, jumps: 0, timePlayed: 0, cashEarned: 0, juggleBest: 0, fares: 0, deaths: 0, arrests: 0, distance: 0,
    };
    this.settings = {
      ps2: true, quality: 1, music: 0.55, sfx: 0.8, sens: 1, invertY: false, tts: false, touch: 'auto',
      shadows: !(window.matchMedia && window.matchMedia('(pointer: coarse)').matches),
    };
    // la versión realista guarda sus opciones aparte (calidad, postproceso)
    this.settingsKey = STYLE.realista ? 'gtasj-settings-real' : 'gtasj-settings';
    try { Object.assign(this.settings, JSON.parse(safeStorageGet(this.settingsKey) || '{}')); } catch (e) { /* default */ }
  }

  saveSettings() { safeStorageSet(this.settingsKey, JSON.stringify(this.settings)); }

  async init(progress) {
    this.media = new MediaLibrary();
    this.mediaReady = this.media.init().catch(() => {});
    const canvas = document.createElement('canvas');
    canvas.className = 'game';
    document.body.prepend(canvas);
    this.canvas = canvas;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(1);
    renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(62, 1, 0.3, 1400);
    if (STYLE.realista) {
      progress(0.02, 'Revelando las fotos de Comodoro...');
      await STYLE.load(renderer);
      STYLE.setupRenderer(renderer);
    }
    this.env = new Environment(this.scene, renderer);
    if (STYLE.realista) this.realSky = new STYLE.RealSky(this);
    // en la versión realista los autos reflejan el cielo de verdad (scene.environment)
    carMaterials().setEnv(STYLE.realista ? null : makeEnvMap(renderer), 1.0);
    this.post = STYLE.realista ? new STYLE.RealPost(this) : new Post(renderer);
    this.onResize();
    window.addEventListener('resize', () => this.onResize());
    this.audio = new Audio();
    this.input = new Input(canvas);
    this.world = new World(this);
    await this.world.build(progress);
    progress(0.85, 'Llamando al Gordopin...');
    await new Promise((r) => setTimeout(r, 0));
    this.effects = new Effects(this);
    this.cameraRig = new CameraRig(this, this.camera);
    this.controller = new PlayerController(this);
    this.hud = new HUD(this);
    this.hud.show(false);
    this.traffic = new Traffic(this);
    this.population = new Population(this);
    this.police = new Police(this);
    this.pickups = new Pickups(this);
    this.activities = new Activities(this);
    this.missions = new Missions(this);
    this.cheats = new Cheats(this);
    this.npcs = new NPCs(this);
    this.events = new WorldEvents(this);
    this.saves = new SaveSystem(this);
    this.menus = new Menus(this);
    this.touch = new Touch(this);
    this.input.onType = (s) => this.cheats.check(s);
    if (this.touch.enabled) { this.traffic.max = 10; this.traffic.maxParked = 8; this.population.max = 12; }
    this.audio.onTalk = (who, line) => { if (this.player && this.player.vehicle && !this.paused) this.hud.radioCaption(who, line, 8); };
    this.audio.onChase = (title) => {
      this.hud.radio.style.color = '#ff4a2a';
      this.hud.radio.textContent = title ? `🤘 Novishok — ${title}` : '🤘 Persecución';
      this.hud.radio.classList.remove('show'); void this.hud.radio.offsetWidth; this.hud.radio.classList.add('show');
    };
    this.media.onChange(() => this.audio.setChaseSongs(this.media.songs()));
    this.audio.setChaseSongs(this.media.songs());
    this.applySettings();
    progress(0.95, 'Casi listo...');
    this.createCharacters();
    this.npcs.spawnAll();
    this.activities.setupBlips();
    this.activities.updateBody();
    // pre-render para compilar shaders
    this.cameraRig.update(0.016, null);
    this.renderer.compile(this.scene, this.camera);
    progress(1, '¡Listo!');
    this.last = performance.now();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  applySettings() {
    const s = this.settings;
    this.post.enabled = !!s.ps2;
    if (this.post.setAO) this.post.setAO(s.quality >= 1 && !this.touch?.enabled);
    this.setShadows(!!s.shadows);
    this.renderScale = s.quality;
    this.onResize();
    this.audio.setVolumes(s.music, s.sfx);
    this.audio.useTTS = !!s.tts;
    this.input.sensitivity = s.sens;
    this.input.invertY = !!s.invertY;
    if (this.touch) this.touch.setMode(s.touch);
  }

  setShadows(on) {
    const r = this.renderer;
    if (r.shadowMap.enabled === on && this.env.sun.castShadow === on) return;
    r.shadowMap.enabled = on;
    this.env.sun.castShadow = on;
    this.env.sun.shadow.radius = 2;
    // los materiales tienen que recompilarse para recibir (o dejar de recibir) sombras
    this.scene.traverse((o) => {
      if (!o.material) return;
      for (const m of Array.isArray(o.material) ? o.material : [o.material]) m.needsUpdate = true;
    });
    for (const v of this.vehicles || []) v.shadow.material.opacity = on ? (STYLE.realista ? 0.32 : 0.55) : 0.9;
  }

  // Resolución dinámica: si la máquina no llega a ~30 cuadros, baja la resolución de a poco
  // (hasta 55 %) y la vuelve a subir cuando sobra
  adaptResolution(dt) {
    if (this.dynScale === undefined) { this.dynScale = 1; this.dynT = 0; }
    this.dynT += dt;
    const slow = this.fps < 27, fast = this.fps > 50;
    if (!slow && !fast) { this.dynT = 0; return; }
    if (slow && this.dynT > 3 && this.dynScale > 0.55) {
      this.dynScale = Math.max(0.55, this.dynScale - 0.1); this.dynT = 0; this.onResize();
    } else if (fast && this.dynT > 8 && this.dynScale < 1) {
      this.dynScale = Math.min(1, this.dynScale + 0.1); this.dynT = 0; this.onResize();
    } else if ((slow && this.dynScale <= 0.55) || (fast && this.dynScale >= 1)) this.dynT = 0;
  }

  onResize() {
    const w = window.innerWidth, h = window.innerHeight;
    // el filtro PS2 dibuja a 3/4 de resolución a propósito; el realista no
    const ps2 = this.post && this.post.enabled && !STYLE.realista;
    const scale = (this.renderScale || 1) * (this.dynScale || 1) * Math.min(window.devicePixelRatio || 1, 1.5) * (ps2 ? 0.75 : 1);
    this.renderer.setSize(w, h, false);
    this.renderer.setPixelRatio(this.post && this.post.enabled ? 1 : scale);
    this.post && this.post.setSize(w, h, scale);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  createCharacters() {
    const c = SPAWNS.casa;
    this.gordopin = new Ped(this, LOOKS.gordopin, { x: c.x, z: c.z, rot: c.rot, isPlayer: true, kind: 'story', name: 'Gordopin', persistent: true, health: 100 });
    this.gordopin.give('clavas');
    this.petroca = new Ped(this, LOOKS.petroca, { x: c.x + 2, z: c.z + 2, rot: c.rot, kind: 'story', name: 'Petroca', persistent: true, health: 130 });
    this.petroca.give('pistola', 60);
    this.petroca.setWeapon('pistola');
    this.petroca.isFriend = true;
    this.petroca.infiniteAmmo = true;
    this.peds.push(this.gordopin, this.petroca);
    this.player = this.gordopin;
    this.companion = this.petroca;
    this.companionActive = false; // el Petroca aparece con la historia
    this.petroca.group.visible = false;
    this.petroca.hidden = true;
    this.cameraRig.snapBehind(c.rot);
  }

  // Lugar libre cerca de (x,z): si cae adentro de algo o en el agua, a la calle más cercana
  safeSpot(x, z, r = 0.6, vehicle = false) {
    const p = { x, z };
    const y = this.terrain.heightAt(x, z);
    const hit = this.colliders.resolveCircle(p, r, y);
    const wet = this.terrain.groundAt(p.x, p.z) < 0.3;
    if (!hit && !wet) return { x, z };
    const n = this.roads.nearestEdge(x, z, 150, (e) => e.kind !== 'peatonal' && e.kind !== 'muelle');
    if (!n) return p;
    const e = n.edge;
    const A = this.roads.nodes[e.a];
    const cross = e.dx * (z - A.z) - e.dz * (x - A.x);
    const side = cross >= 0 ? 1 : -1;
    const off = vehicle ? e.width * 0.25 : e.width / 2 + 1.3;
    return { x: n.x - e.dz * off * side, z: n.z + e.dx * off * side };
  }

  playerName() { return this.player ? this.player.name : ''; }

  // Nombre del control según se juegue con teclado o con pantalla táctil
  key(action) {
    const touch = this.touch && this.touch.enabled;
    const K = {
      enter: ['F', 'SUBIR'], jump: ['Shift', 'SALTAR'], forward: ['W', 'el joystick'], switchChar: ['TAB', '⇄'],
      job: ['2', 'REMÍS'], horn: ['H', 'BOCINA'], fire: ['clic', 'GOLPE'], aim: ['clic derecho', 'APUNTAR'], map: ['M', 'MAPA'],
    }[action] || [action, action];
    return `${touch ? 'tocá' : 'apretá'} <b>${touch ? K[1] : K[0]}</b>`;
  }

  // Herramientas de prueba (se usan desde la consola: __game.debug.tp(x, z))
  get debug() {
    const g = this;
    return {
      tp(x, z) { const p = g.player; if (p.vehicle) { const v = p.vehicle; v.pos.set(x, g.terrain.groundAt(x, z), z); v.vx = v.vz = 0; } else p.pos.set(x, g.world.footGround(x, z), z); },
      done(n) { g.missions.done = g.missions.list.slice(0, n).map((m) => m.id); if (n >= 1 && !g.companionActive) g.setCompanionActive(true, g.player.pos.x + 2, g.player.pos.z + 2); g.missions.refresh(); },
      mission(id) { const d = g.missions.list.find((m) => m.id === id); if (d) g.missions.start(d); },
      car(key) { return g.cheats.spawnNear(key); },
      poi: POI,
      // Auditoría de colisiones: rayos hacia abajo en una grilla alrededor de (cx, cz); donde
      // hay algo sólido de más de 1 m sobre el piso y ningún colisionador, lo informa
      collisionAudit(cx, cz, R = 250, step = 3) {
        const rc = new THREE.Raycaster();
        const down = new THREE.Vector3(0, -1, 0), o = new THREE.Vector3();
        const skip = (obj) => obj.isPoints || obj.isSkinnedMesh || (obj.material && [].concat(obj.material).some((m) => m.transparent || m.alphaTest > 0));
        const targets = [g.city.group, g.props.group].filter(Boolean);
        const found = new Map();
        let tested = 0;
        for (let x = cx - R; x <= cx + R; x += step) for (let z = cz - R; z <= cz + R; z += step) {
          const gy = g.terrain.groundAt(x, z);
          o.set(x, gy + 120, z);
          rc.set(o, down); rc.far = 125;
          const hit = rc.intersectObjects(targets, true).find((h) => !skip(h.object) && h.object.visible);
          if (!hit) continue;
          const top = hit.point.y;
          if (top < gy + 1.0) continue;
          tested++;
          const p = { x, z };
          const hitCol = g.colliders.resolveCircle(p, 0.05, gy + 0.2, Math.min(top - gy, 3));
          if (hitCol) continue;
          const ob = hit.object;
          const key = (ob.name || ob.type) + ':' + [].concat(ob.material).map((m) => m.type + (m.map ? '+map' : '') + (m.vertexColors ? '+vc' : '')).join(',') + ':' + (ob.geometry.attributes.position.count);
          const f = found.get(key) || { n: 0, pts: [] };
          f.n++; if (f.pts.length < 6) f.pts.push([Math.round(x), Math.round(z), +(top - gy).toFixed(1)]);
          found.set(key, f);
        }
        return { tested, sin: [...found.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 25) };
      },
      // qué objeto se ve en un punto de la pantalla (coordenadas -1..1), para depurar
      pick(x, y) {
        const rc = new THREE.Raycaster();
        rc.setFromCamera(new THREE.Vector2(x, y), g.camera);
        const hits = rc.intersectObjects(g.scene.children, true).filter((h) => h.object.visible);
        return hits.slice(0, 4).map((h) => { const o = h.object; const path = []; for (let q = o; q; q = q.parent) path.push(q.type + (q.name ? ':' + q.name : '')); return { d: +h.distance.toFixed(1), type: o.type, mat: [].concat(o.material).map((m) => m && (m.type + (m.map ? '+map' : '') + (m.vertexColors ? '+vc' : '') + ' #' + (m.color ? m.color.getHexString() : ''))), verts: o.geometry && o.geometry.attributes.position.count, path: path.slice(0, 4).join('<'), ud: Object.keys(o.userData || {}) }; });
      },
      state() { const p = g.player; return { pos: [p.pos.x, p.pos.y, p.pos.z].map((v) => +v.toFixed(1)), veh: p.vehicle && p.vehicle.key, hp: p.health, money: g.money, wanted: g.police.level, mission: g.missions.active && g.missions.active.def.id, fps: +g.fps.toFixed(1) }; },
    };
  }

  canSwitch() {
    if (!this.companionActive || this.companion.dead || this.companion.hidden) return false;
    if (this.missions && this.missions.active && !this.missions.active.allowSwitch) return false;
    return true;
  }

  switchCharacter() {
    const a = this.player, b = this.companion;
    a.isPlayer = false; b.isPlayer = true;
    a.brain = new Brain(this, a, 'follow');
    b.brain = null;
    a.isFriend = true; b.isFriend = false;
    a.infiniteAmmo = true; b.infiniteAmmo = false;
    this.player = b; this.companion = a;
    this.controller.enterTarget = null;
    this.hud.showToast(`Ahora jugás con el <b>${b.name}</b>`, 2.5);
    this.cameraRig.snapBehind(b.vehicle ? b.vehicle.heading : b.heading);
    if (b.vehicle && b.vehicle.driver !== b && a.vehicle === b.vehicle && a.seat === 0) {
      // intercambiar asientos si están en el mismo auto
      const v = b.vehicle, sa = a.seat, sb = b.seat;
      a.exitVehicle(); b.exitVehicle();
      b.enterVehicle(v, sa); a.enterVehicle(v, sb);
    }
    this.audio.beep();
  }

  setCompanionActive(on, x, z) {
    const p = this.petroca === this.player ? this.gordopin : this.petroca;
    this.companionActive = on;
    p.hidden = !on;
    p.group.visible = on;
    if (on) {
      if (x !== undefined) { p.pos.set(x, this.world.footGround(x, z), z); }
      if (p.dead) this.revive(p);
      p.brain = new Brain(this, p, 'follow');
    }
  }

  revive(p) {
    p.dead = false; p.health = p.maxHealth; p.deadT = 0; p.knockT = 0; p.model.anim.dead = 0;
  }

  // ---------- Entidades ----------
  spawnVehicle(key, x, z, rot, opts = {}) {
    const v = new Vehicle(this, key, { x, z, rot, ...opts });
    this.vehicles.push(v);
    return v;
  }

  removeVehicle(v) {
    for (const s of v.seats) if (s) { s.exitVehicle(); if (!s.persistent && !s.isPlayer) this.removePed(s); }
    v.dispose();
    const i = this.vehicles.indexOf(v);
    if (i >= 0) this.vehicles.splice(i, 1);
  }

  spawnPed(kind, x, z, opts = {}) {
    const look = opts.look || randomLook(kind);
    const p = new Ped(this, look, { x, z, kind, ...opts });
    this.peds.push(p);
    return p;
  }

  removePed(p) {
    p.remove();
    const i = this.peds.indexOf(p);
    if (i >= 0) this.peds.splice(i, 1);
  }

  addMoney(n, silent = false) {
    this.money += n;
    if (n > 0) { this.stats.cashEarned += n; if (!silent) this.audio.cash(); }
  }

  // ---------- Eventos ----------
  onPedDeath(ped, killer) {
    if (ped === this.player) return;
    if (killer === this.player || (killer && killer.isPlayer)) {
      this.stats.pedsKilled++;
      this.police.crime(ped.kind === 'cana' ? 'copKill' : 'kill', ped.pos);
    }
    if (ped.money > 0 && !ped.persistent) this.pickups.spawnMoney(ped.pos.x, ped.pos.z, ped.money);
    if (!ped.persistent && ped.kind !== 'civil' && Math.random() < 0.5 && ped.weapon !== 'punos') this.pickups.spawnWeapon(ped.pos.x + 0.6, ped.pos.z, ped.weapon, 20);
    this.missions.onPedDeath && this.missions.onPedDeath(ped, killer);
  }

  onPedHurt(ped, attacker, dmg) {
    if (attacker && attacker.isPlayer && ped !== this.player) {
      if (ped.kind === 'cana') this.police.crime('copAttack', ped.pos);
      else if (!ped.isFriend) this.police.crime('assault', ped.pos);
      if (ped.brain) ped.brain.onAttacked(attacker);
    } else if (ped.brain && attacker) ped.brain.onAttacked(attacker);
    if (ped.isPlayer) this.cameraRig.shake = Math.max(this.cameraRig.shake, 0.3);
  }

  onGunshot(shooter) {
    if (shooter.isPlayer) this.police.crime('gunshot', shooter.pos);
    this.population.panic(shooter.pos, 45, shooter);
  }

  onCarjack(v, driver) {
    if (driver.kind === 'cana' || v.type.police) this.police.crime('copCar', v.pos);
    else this.police.crime('carjack', v.pos);
  }

  onExplosion(x, y, z, cause) {
    this.audio.explosion({ x, y, z });
    const dCam = Math.hypot(this.camera.position.x - x, this.camera.position.z - z);
    this.cameraRig.shake = Math.max(this.cameraRig.shake, clamp(1.5 - dCam / 60, 0, 1.5));
    for (const p of this.peds) {
      if (p.dead || p.removed) continue;
      const d = Math.hypot(p.pos.x - x, p.pos.z - z);
      if (d < 9 && Math.abs(p.pos.y - y) < 6) {
        const f = 1 - d / 9;
        if (p.vehicle) { if (d < 4) p.hurt(80 * f, cause); continue; }
        p.hurt(110 * f, cause, null);
        const nx = (p.pos.x - x) / (d || 1), nz = (p.pos.z - z) / (d || 1);
        p.knockdown(nx * 9 * f, nz * 9 * f, 5 * f + 2);
      }
    }
    for (const v of this.vehicles) {
      if (v.dead || v.removed) continue;
      const d = Math.hypot(v.pos.x - x, v.pos.z - z);
      if (d < 10 && d > 0.5) {
        const f = 1 - d / 10;
        v.damage(700 * f, cause);
        v.vx += ((v.pos.x - x) / d) * 8 * f; v.vz += ((v.pos.z - z) / d) * 8 * f; v.vy += 5 * f;
      }
    }
    if (cause && cause.isPlayer) this.police.crime('explosion', { x, z });
  }

  // ---------- Muerte / arresto ----------
  async wasted(busted = false) {
    if (this.respawning) return;
    this.respawning = true;
    const p = this.player;
    this.controlsLocked = true;
    this.missions.fail(busted ? 'Te agarró la cana.' : 'Te hicieron bolsa.', true);
    if (busted) { this.hud.bigText('EN CANA', '', 4, 'blue'); this.stats.arrests++; }
    else { this.hud.bigText('HECHO BOLSA', '', 4, 'red'); this.stats.deaths++; }
    this.audio.wasted();
    this.post.mat.uniforms.uGrey.value = 0.8;
    this.audio.stopRadio();
    await new Promise((r) => setTimeout(r, 3200));
    await this.hud.fadeTo(true, 0.8);
    // reaparecer
    if (p.vehicle) p.exitVehicle();
    const sp = busted ? SPAWNS.comisaria : SPAWNS.hospital;
    const loc = busted ? (this.city.markers.comisaria || sp) : (this.city.markers.hospital || sp);
    this.revive(p);
    p.pos.set(loc.x, this.world.footGround(loc.x, loc.z), loc.z + 1.5);
    p.heading = 0;
    p.armor = 0;
    this.police.clear();
    const fee = busted ? 100 : 100;
    this.money = Math.max(0, this.money - fee);
    if (busted || !this.cheats.keepWeapons) { p.owned = ['punos']; p.ammo = { punos: Infinity }; if (p === this.gordopin) p.give('clavas'); p.setWeapon('punos'); }
    if (this.companion && this.companionActive) {
      const c = this.companion;
      if (c.vehicle) c.exitVehicle();
      this.revive(c);
      c.pos.set(p.pos.x + 1.5, p.pos.y, p.pos.z + 1);
    }
    this.population.clearAround(p.pos, 40);
    this.env.time = (this.env.time + 6 * 60) % 1440;
    this.post.mat.uniforms.uGrey.value = 0;
    this.hud.big.classList.remove('show'); this.hud.bigSub.classList.remove('show'); this.hud.bigT = 0;
    this.cameraRig.snapBehind(0);
    await this.hud.fadeTo(false, 0.8);
    this.hud.showToast(busted ? 'Pagaste $100 de fianza. Te sacaron las armas.' : 'Pagaste $100 de guardia en el Hospital Regional.', 4);
    this.controlsLocked = false;
    this.respawning = false;
  }

  // ---------- Bucle principal ----------
  loop(now) {
    requestAnimationFrame(this.loop);
    let dt = (now - this.last) / 1000;
    this.last = now;
    if (dt > 0.1) dt = 0.1;
    if (dt <= 0) dt = 0.001;
    this.fps = this.fps ? this.fps * 0.95 + (1 / dt) * 0.05 : 60;
    if (this.started && !this.paused && !document.hidden) this.adaptResolution(dt);
    this.input.pollPad();
    if (this.menus) this.menus.update(dt);
    if (this.touch) this.touch.update();
    this.audio.setPaused(this.paused || !this.started);
    if (!this.paused && this.started) this.update(dt);
    else if (this.menus && this.menus.attract) this.attract(dt);
    this.render();
    this.input.endFrame();
  }

  attract(dt) {
    // cámara del menú principal: vuelo lento sobre la ciudad
    this.time += dt;
    const t = this.time * 0.04;
    const c0 = POI.catedral || { x: 0, z: 0 };
    const cx = c0.x + Math.cos(t) * 300, cz = c0.z + Math.sin(t) * 300;
    this.camera.position.set(cx, 110, cz);
    this.camera.lookAt(c0.x, 20, c0.z);
    this.env.update(dt * 0.5, this.camera.position, this.time);
    if (this.realSky) this.realSky.update(dt);
    this.world.updateVisibility(this.camera.position, dt);
    this.props.update(this.time, dt, this.env, this.camera.position);
    this.effects.update(dt, this.camera.position);
    this.world.water.userData.material.uniforms.uTime.value = this.time;
  }

  update(dt) {
    this.time += dt;
    this.stats.timePlayed += dt;
    const p = this.player;
    this.env.update(dt, this.camera.position, this.time);
    if (this.realSky) this.realSky.update(dt);
    this.controller.update(dt, this.input);
    // entidades
    for (let i = 0; i < this.peds.length; i++) {
      const q = this.peds[i];
      if (q.removed || q.hidden) continue;
      if (q.brain && !q.dead) q.brain.update(dt);
      q.update(dt);
      if (q.say) { q.say.t -= dt; if (q.say.t <= 0) q.say = null; }
    }
    for (let i = 0; i < this.vehicles.length; i++) {
      const v = this.vehicles[i];
      if (v.removed) continue;
      const dCam = Math.abs(v.pos.x - this.camera.position.x) + Math.abs(v.pos.z - this.camera.position.z);
      if (dCam > 500 && !v.driver && !v.persistent) continue; // congelar autos lejanos estacionados
      v.update(dt);
    }
    this.collidePedsVehicles(dt);
    this.collideVehicles();
    this.traffic.update(dt);
    this.population.update(dt);
    this.police.update(dt);
    this.pickups.update(dt);
    this.activities.update(dt);
    this.missions.update(dt);
    this.npcs.update(dt, this.input);
    this.events.update(dt);
    this.effects.update(dt, this.camera.position);
    this.props.update(this.time, dt, this.env, this.camera.position);
    this.world.water.userData.material.uniforms.uTime.value = this.time;
    this.updateLighting();
    this.world.updateVisibility(this.camera.position, dt);
    // jugador muerto / ahogado
    if (p.dead && !this.respawning) this.wasted(false);
    if (p.vehicle && p.vehicle.sinking > 1.5) { p.exitVehicle(); this.effects.splash(p.pos.x, p.pos.z); }
    // zona
    this.zoneT = (this.zoneT || 0) - dt;
    if (this.zoneT <= 0) {
      this.zoneT = 0.5;
      const pp = p.vehicle ? p.vehicle.pos : p.pos;
      this.hud.showZone(this.world.zoneAt(pp.x, pp.z));
    }
    // música de persecución: con 4 estrellas o más suena Novishok
    if (this.police.level >= 4) { this.chaseOffT = 0; if (!this.audio.chase) this.audio.startChase(); }
    else if (this.audio.chase) { this.chaseOffT = (this.chaseOffT || 0) + dt; if (this.chaseOffT > 3) this.audio.stopChase(); }
    this.cameraRig.update(dt, this.input);
    this.hud.update(dt);
    this.audio.update(dt, this);
    this.menus.checkInGameKeys();
  }

  updateLighting() {
    const n = this.env.night;
    const mats = this.city.materialsList;
    const eCars = clamp((n - 0.25) * 1.6, 0, 1);
    const e = eCars * (this.env.blackout ? 0.04 : 1);
    mats.office.emissiveIntensity = e * 0.9;
    mats.house.emissiveIntensity = e * 0.8;
    if (mats.shop) mats.shop.emissiveIntensity = e * 1.1;
    if (this.city.houses && this.city.houses.material) this.city.houses.material.emissiveIntensity = e * 0.8;
    const cm = carMaterials();
    cm.setLights(eCars);
    cm.setEnvIntensity(0.25 + this.env.dayLight * 0.8);
    // carteles un poco apagados de noche
  }

  collidePedsVehicles(dt) {
    for (const v of this.vehicles) {
      if (v.removed) continue;
      const sp = v.speed;
      const f = v.fwd;
      const lx = f.z, lz = -f.x;
      for (const p of this.peds) {
        if (p.vehicle || p.removed || p.hidden) continue;
        const dx = p.pos.x - v.pos.x, dz = p.pos.z - v.pos.z;
        if (Math.abs(dx) > 8 || Math.abs(dz) > 8) continue;
        if (Math.abs(p.pos.y - v.pos.y) > 2.2) continue;
        const lf = dx * f.x + dz * f.z, ll = dx * lx + dz * lz;
        const hl = v.type.L / 2 + 0.3, hw = v.type.W / 2 + 0.3;
        if (Math.abs(lf) > hl || Math.abs(ll) > hw) continue;
        // arriba del techo (o trepando): no choca; si el auto anda, lo lleva ("surfear" el techo)
        if (p.climb) continue;
        if (p.pos.y > v.pos.y + v.type.H - 0.4) {
          if (p.onGround && Math.abs(lf) < v.type.L / 2 && Math.abs(ll) < v.type.W / 2) { p.pos.x += v.vx * dt; p.pos.z += v.vz * dt; p.pos.y = Math.max(p.pos.y, v.pos.y + v.type.H); }
          continue;
        }
        // dentro de la caja: ¿atropello o empujón?
        const relV = (v.vx * dx + v.vz * dz) / (Math.hypot(dx, dz) || 1);
        if (sp > 4.5 && relV > 1 && !p.dead) {
          const dmg = sp * (v.type.mass > 3000 ? 6 : 3.4);
          p.hurt(dmg, v.driver || null, null);
          p.knockdown(v.vx * 0.9, v.vz * 0.9, clamp(sp * 0.35, 2, 8));
          v.vx *= 0.93; v.vz *= 0.93;
          this.audio.thud(p.pos, 0.6);
          this.effects.blood(p.pos.x, p.pos.y + 1, p.pos.z);
          if (v.driver && v.driver.isPlayer) {
            this.police.crime(p.kind === 'cana' ? 'copAttack' : 'runOver', p.pos);
            if (!p.dead && p.brain) p.brain.onAttacked(v.driver);
            if (Math.random() < 0.3) sayLine(p, pick(PED_LINES.car));
          }
        } else {
          // empujar hacia afuera por el lado más cercano
          const penF = hl - Math.abs(lf), penL = hw - Math.abs(ll);
          if (penF < penL) { const s = Math.sign(lf) || 1; p.pos.x += f.x * penF * s; p.pos.z += f.z * penF * s; }
          else { const s = Math.sign(ll) || 1; p.pos.x += lx * penL * s; p.pos.z += lz * penL * s; }
        }
      }
    }
  }

  collideVehicles() {
    const vs = this.vehicles;
    for (let i = 0; i < vs.length; i++) {
      const a = vs[i];
      if (a.removed) continue;
      for (let j = i + 1; j < vs.length; j++) {
        const b = vs[j];
        if (b.removed) continue;
        const dx = b.pos.x - a.pos.x, dz = b.pos.z - a.pos.z;
        const R = (a.type.L + b.type.L) / 2;
        if (dx * dx + dz * dz > R * R) continue;
        if (Math.abs(a.pos.y - b.pos.y) > 2.5) continue;
        // SAT entre dos OBB
        const A = a.obb(), B = b.obb();
        const axes = [[A.fx, A.fz], [A.fz, -A.fx], [B.fx, B.fz], [B.fz, -B.fx]];
        let minPen = Infinity, nx = 0, nz = 0, sep = false;
        for (const [ax, az] of axes) {
          const pa = Math.abs(A.fx * ax + A.fz * az) * A.hl + Math.abs(A.fz * ax - A.fx * az) * A.hw;
          const pb = Math.abs(B.fx * ax + B.fz * az) * B.hl + Math.abs(B.fz * ax - B.fx * az) * B.hw;
          const d = dx * ax + dz * az;
          const pen = pa + pb - Math.abs(d);
          if (pen <= 0) { sep = true; break; }
          if (pen < minPen) { minPen = pen; const s = d < 0 ? -1 : 1; nx = ax * s; nz = az * s; }
        }
        if (sep) continue;
        const ma = a.type.mass * (a.parked && !a.driver ? 1.5 : 1), mb = b.type.mass * (b.parked && !b.driver ? 1.5 : 1);
        const ta = mb / (ma + mb), tb = ma / (ma + mb);
        a.pos.x -= nx * minPen * ta; a.pos.z -= nz * minPen * ta;
        b.pos.x += nx * minPen * tb; b.pos.z += nz * minPen * tb;
        const rv = (b.vx - a.vx) * nx + (b.vz - a.vz) * nz;
        if (rv < 0) {
          const jimp = (-(1 + 0.3) * rv) / (1 / ma + 1 / mb);
          a.vx -= (jimp / ma) * nx; a.vz -= (jimp / ma) * nz;
          b.vx += (jimp / mb) * nx; b.vz += (jimp / mb) * nz;
          const impact = -rv;
          if (impact > 3) {
            a.damage((impact - 3) ** 1.3 * 6 * ta * 2, b.driver);
            b.damage((impact - 3) ** 1.3 * 6 * tb * 2, a.driver);
            a.angVel += (Math.random() - 0.5) * impact * 0.1;
            b.angVel += (Math.random() - 0.5) * impact * 0.1;
            this.audio.crash(a.pos, clamp(impact / 20, 0.2, 1));
            if (impact > 6) this.effects.sparks((a.pos.x + b.pos.x) / 2, a.pos.y + 0.6, (a.pos.z + b.pos.z) / 2, 8);
            const pl = this.player;
            if ((a.driver === pl && b.type.police) || (b.driver === pl && a.type.police)) this.police.crime('copCarHit', a.pos);
            a.onHitVehicle && a.onHitVehicle(b, impact);
            b.onHitVehicle && b.onHitVehicle(a, impact);
          }
        }
      }
    }
  }

  render() {
    this.post.mat.uniforms.uTrail.value = this.settings.ps2 ? 0.33 : 0;
    this.post.render(this.scene, this.camera);
  }
}
