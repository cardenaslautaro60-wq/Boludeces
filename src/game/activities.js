import * as THREE from 'three';
import { POI, RAMPS } from '../world/mapdata.js';
import { WEAPONS } from './weapons.js';
import { dist, rand, pick, chance, clamp } from '../util.js';
import { randomLook } from '../entities/humanoid.js';
import { Brain } from './ai.js';

// Marcador estilo San Andreas (cilindro de luz)
export class Marker {
  constructor(game, x, z, color = 0xffd21a, opts = {}) {
    this.game = game;
    this.x = x; this.z = z;
    this.r = opts.r || 1.4;
    const y = opts.y !== undefined ? opts.y : game.world.footGround(x, z);
    this.y = y;
    const h = opts.h || 1.6;
    const geo = new THREE.CylinderGeometry(this.r, this.r, h, 24, 1, true);
    geo.translate(0, h / 2, 0);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.45, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(x, y, z);
    this.mesh.renderOrder = 6;
    game.scene.add(this.mesh);
    if (opts.arrow !== false) {
      const ag = new THREE.ConeGeometry(0.45, 0.9, 4);
      ag.rotateX(Math.PI);
      this.arrow = new THREE.Mesh(ag, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 }));
      this.arrow.position.set(x, y + h + 1.2, z);
      game.scene.add(this.arrow);
    }
    this.t = rand(0, 5);
    this.inside = false;
  }
  update(dt) {
    this.t += dt;
    this.mesh.material.opacity = 0.32 + Math.sin(this.t * 4) * 0.12;
    if (this.arrow) { this.arrow.rotation.y += dt * 2; this.arrow.position.y = this.y + 2.8 + Math.sin(this.t * 3) * 0.25; }
  }
  set visible(v) { this.mesh.visible = v; if (this.arrow) this.arrow.visible = v; }
  contains(pos, pad = 0) { return dist(pos.x, pos.z, this.x, this.z) < this.r + pad && Math.abs(pos.y - this.y) < 3; }
  dispose() { this.game.scene.remove(this.mesh); if (this.arrow) this.game.scene.remove(this.arrow); }
}

const FOOD = [
  { name: 'Choripán', price: 3, hp: 20, fat: 2 },
  { name: 'Bondiola completa', price: 6, hp: 35, fat: 4 },
  { name: 'Pizza de muzza', price: 10, hp: 60, fat: 6 },
  { name: 'Ensalada (?)', price: 8, hp: 15, fat: -1 },
];

export class Activities {
  constructor(game) {
    this.game = game;
    this.markers = [];
    this.trafficLight = { state: 'NS', t: 0 };
    this.eatLog = [];
    this.remis = null;
    this.jumpsDone = new Set();
    this.mini = null;
    this.setupMarkers();
  }

  setupMarkers() {
    const g = this.game;
    const M = g.city.markers;
    const add = (key, pos, color, action, opts = {}) => {
      if (!pos) return;
      const m = new Marker(g, pos.x, pos.z, color, opts);
      m.key = key; m.action = action; m.onFoot = opts.onFoot !== false;
      this.markers.push(m);
      return m;
    };
    add('save', M.casaAbuela, 0x40ff70, () => this.saveMenu());
    add('chori', { x: POI.chori.x - 1, z: POI.chori.z }, 0xffa020, () => this.foodMenu('El Chori del Viento'));
    add('pizza', M.pizzeria, 0xffa020, () => this.foodMenu('Pizzería La Tuerca'));
    add('armeria', M.armeria, 0xff4040, () => this.gunShop());
    add('gym', M.gimnasio, 0xc060ff, () => this.gym());
    add('malabares', { x: POI.semaforo.x - 8.2, z: POI.semaforo.z - 8.2 }, 0xffe040, () => this.juggling(), { r: 1.1 });
    // chapa y pintura: marcador sin flecha adentro del galpón
    if (M.chapa) {
      this.chapaRect = M.chapa.rect;
      const m = add('chapa', { x: M.chapa.x, z: M.chapa.z - 2 }, 0x3080ff, () => {}, { r: 3.2, h: 0.4, arrow: false, onFoot: false });
      m.passive = true;
    }
    // kiosco del chori (decorado)
    const gb = new THREE.Group();
    const y = g.world.footGround(POI.chori.x + 4, POI.chori.z);
    const box = new THREE.Mesh(new THREE.BoxGeometry(3, 2.4, 4), new THREE.MeshLambertMaterial({ color: 0xd8c8a0 }));
    box.position.set(POI.chori.x + 4.5, y + 1.2, POI.chori.z);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.2, 4.6), new THREE.MeshLambertMaterial({ color: 0xc02020 }));
    roof.position.set(POI.chori.x + 4.5, y + 2.5, POI.chori.z);
    gb.add(box, roof);
    g.scene.add(gb);
    g.colliders.addBox(POI.chori.x + 3, POI.chori.x + 6, POI.chori.z - 2, POI.chori.z + 2, y - 1, y + 2.6, 'kiosco');
    g.city.addSign(['EL CHORI DEL VIENTO'], POI.chori.x + 2.95, y + 2.1, POI.chori.z, 3.8, 0.55, -Math.PI / 2, { bg: '#c02020', fg: '#fff3c0' });
    g.scene.add(g.city.signs[g.city.signs.length - 1]);
  }

  setupBlips() {
    const g = this.game;
    const M = g.city.markers;
    const B = (x, z, letter, bg, name) => g.blips.push({ x, z, letter, bg, name, legend: true });
    if (M.casaAbuela) B(M.casaAbuela.x, M.casaAbuela.z, 'C', '#2a9a3a', 'Casa de la Abuela (guardar)');
    B(POI.chori.x, POI.chori.z, 'Ch', '#d06a10', 'Comida');
    if (M.pizzeria) B(M.pizzeria.x, M.pizzeria.z, 'Pz', '#d06a10', 'Comida');
    if (M.armeria) B(M.armeria.x, M.armeria.z, 'A', '#b02020', 'Armería');
    if (M.gimnasio) B(M.gimnasio.x, M.gimnasio.z, 'G', '#7a3ab0', 'Gimnasio');
    if (M.chapa) B(M.chapa.x, M.chapa.z, 'CP', '#2a5ab0', 'Chapa y Pintura');
    B(POI.semaforo.x, POI.semaforo.z, 'M', '#c8a010', 'Malabares en el semáforo');
    if (M.hospital) B(M.hospital.x, M.hospital.z, 'H', '#e8e8e8', 'Hospital');
    if (M.comisaria) B(M.comisaria.x, M.comisaria.z, '★', '#1d3f8f', 'Comisaría');
    if (M.remiseria) B(M.remiseria.x, M.remiseria.z, 'R', '#1a6b2a', 'Remisería (subite a un remís y activá el trabajo)');
    g.blips.find((b) => b.letter === 'H') && (g.blips.find((b) => b.letter === 'H').fg = '#c01818');
  }

  update(dt) {
    const g = this.game;
    const p = g.player;
    // semáforo
    const tl = this.trafficLight;
    tl.t += dt;
    const dur = { NS: 16, NSy: 3, EW: 16, EWy: 3 };
    if (tl.t > dur[tl.state]) { tl.t = 0; tl.state = { NS: 'NSy', NSy: 'EW', EW: 'EWy', EWy: 'NS' }[tl.state]; }
    g.props.updateTrafficLight(tl.state === 'NS' ? 0 : tl.state.endsWith('y') ? 1 : 2);

    for (const m of this.markers) {
      m.update(dt);
      const onMission = g.missions.active && !g.missions.active.allowShops;
      m.visible = !onMission || m.key === 'chapa';
      const inside = m.contains(p.vehicle ? p.vehicle.pos : p.pos);
      if (this.mini || g.controlsLocked || g.menus.choiceEl) { m.inside = inside; continue; }
      if (inside && !m.inside && !m.passive) {
        if (m.onFoot && p.vehicle) { /* hay que bajarse */ }
        else if (!onMission || m.key === 'save') m.action();
      }
      m.inside = inside;
    }
    this.checkChapa(dt);
    this.checkJumps(dt);
    this.updateRemis(dt);
    if (this.mini) this.mini.update(dt);
    // remís: tecla 2
    if (g.input.was('job') && p.vehicle && p.vehicle.driver === p && !g.missions.active) {
      if (p.vehicle.key === 'remis' && !this.remis) this.startRemis();
      else if (this.remis) this.stopRemis('Terminaste el turno de remisero.');
    }
  }

  // ---------- Guardar ----------
  async saveMenu() {
    const g = this.game;
    const r = await g.menus.choice('Casa de la Abuela', ['Guardar partida (y dormir la siesta)', 'Salir'], 'La abuela te dejó milanesas en la heladera.');
    if (r === 0) {
      g.env.time = (g.env.time + 360) % 1440;
      const p = g.player;
      p.health = p.maxHealth;
      const ok = g.saves.save();
      g.hud.showToast(ok ? 'Partida guardada. Dormiste 6 horas.' : 'No se pudo guardar en este navegador.', 3);
    }
  }

  // ---------- Comida ----------
  async foodMenu(place) {
    const g = this.game;
    const p = g.player;
    const opts = FOOD.map((f) => `${f.name} — $${f.price}`);
    opts.push('Nada, gracias');
    const r = await g.menus.choice(place, opts, p === g.gordopin ? '"Dame lo de siempre, maestro."' : '"¿Tienen algo sin tanta grasa? Mentira, dame todo."');
    if (r < 0 || r >= FOOD.length) return;
    const f = FOOD[r];
    if (g.money < f.price) { g.hud.showToast('No te alcanza la guita.', 2); return; }
    g.money -= f.price;
    p.health = Math.min(p.maxHealth, p.health + f.hp);
    if (p === g.gordopin) g.stats.fat = clamp(g.stats.fat + f.fat, 0, 100);
    g.audio.cash();
    this.eatLog.push(g.time);
    this.eatLog = this.eatLog.filter((t) => g.time - t < 60);
    if (this.eatLog.length > 6) {
      this.eatLog = [];
      p.health = Math.max(5, p.health - 30);
      g.hud.showToast('Comiste demasiado... ¡buaaaj!', 3);
      g.effects.smoke(p.pos.x + Math.sin(p.heading), p.pos.y + 1.2, p.pos.z + Math.cos(p.heading), 0.3);
      g.stats.fat = clamp(g.stats.fat - 3, 0, 100);
    } else g.hud.showToast(`${f.name}: +${f.hp} de salud${f.fat > 0 ? `, +${f.fat} de grasa` : ''}`, 2.5);
    this.updateBody();
  }

  updateBody() {
    const g = this.game;
    // el cuerpo del Gordopin cambia con la grasa y el músculo (como CJ)
    g.gordopin.model.setBody(0.2 + (g.stats.fat / 100) * 1.0, g.stats.muscle / 100);
  }

  // ---------- Armería ----------
  async gunShop() {
    const g = this.game;
    const p = g.player;
    const items = [
      { id: 'pistola', label: 'Pistola 9mm', price: WEAPONS.pistola.price, ammo: 34 },
      { id: 'escopeta', label: 'Escopeta', price: WEAPONS.escopeta.price, ammo: 16 },
      { id: 'uzi', label: 'Uzi', price: WEAPONS.uzi.price, ammo: 100 },
      { id: 'bate', label: 'Bate de béisbol', price: 60, ammo: 1 },
      { id: 'chaleco', label: 'Chaleco antibalas', price: 200 },
    ];
    for (;;) {
      const opts = items.map((it) => {
        if (it.id === 'chaleco') return `${it.label} — $${it.price}`;
        const own = p.owned.includes(it.id);
        const W = WEAPONS[it.id];
        return own && !W.melee ? `Balas para ${it.label} — $${W.ammoPrice}` : `${it.label} — $${it.price}`;
      });
      opts.push('Salir');
      const r = await g.menus.choice('Armería La Patagónica', opts, '"Todo en regla, pibe. Bueno... casi todo."');
      if (r < 0 || r >= items.length) return;
      const it = items[r];
      if (it.id === 'chaleco') {
        if (g.money < it.price) { g.hud.showToast('No te alcanza.', 2); continue; }
        g.money -= it.price; p.armor = 100; g.audio.cash(); continue;
      }
      const W = WEAPONS[it.id];
      const own = p.owned.includes(it.id);
      const price = own && !W.melee ? W.ammoPrice : it.price;
      if (g.money < price) { g.hud.showToast('No te alcanza.', 2); continue; }
      if (own && W.melee) { g.hud.showToast('Ya tenés uno.', 2); continue; }
      g.money -= price;
      p.give(it.id, own ? W.ammoPack : it.ammo);
      p.setWeapon(it.id);
      g.audio.cash();
    }
  }

  // ---------- Chapa y Pintura ----------
  checkChapa(dt) {
    const g = this.game;
    const p = g.player;
    const r = this.chapaRect;
    if (!r || !p.vehicle || p.vehicle.driver !== p || this.spraying) return;
    const v = p.vehicle;
    const inside = v.pos.x > r[0] && v.pos.x < r[1] && v.pos.z > r[2] && v.pos.z < r[3];
    if (!inside) { this.chapaDone = false; return; }
    if (this.chapaDone || v.speed > 2) return;
    this.chapaDone = true;
    if (g.police.level === 0 && v.health > 950) { g.hud.showHelp('Don Tito: "Está impecable, pibe. Volvé cuando la choques."', 3); return; }
    if (g.money < 100) { g.hud.showHelp('Don Tito: "Son cien mangos. Sin guita no hay pintura."', 3); return; }
    this.respray(v);
  }

  async respray(v) {
    const g = this.game;
    this.spraying = true;
    g.controlsLocked = true;
    await g.hud.fadeTo(true, 0.5);
    g.money -= 100;
    v.health = 1000; v.fireT = 0;
    const cols = v.type.colors.length > 1 ? v.type.colors : [0xb03020, 0x2050a0, 0x208050, 0xe8e0d0, 0x202020, 0xd0a020];
    let c = pick(cols);
    if (c === v.color) c = pick(cols);
    v.setColor(c);
    g.police.clear();
    g.audio.cash();
    await new Promise((r) => setTimeout(r, 700));
    await g.hud.fadeTo(false, 0.5);
    g.hud.showHelp('Don Tito: "Listo, quedó como nuevo. Y la cana no la reconoce ni en pedo."', 4);
    g.controlsLocked = false;
    this.spraying = false;
  }

  // ---------- Saltos únicos ----------
  checkJumps(dt) {
    const g = this.game;
    const p = g.player;
    const v = p.vehicle;
    if (!v || v.driver !== p) return;
    if (!v.grounded && !this.jumpStart) {
      // ¿despegó cerca de una rampa?
      const ri = g.terrain.ramps.findIndex((r) => dist(v.pos.x, v.pos.z, r.x + r.fx * r.len / 2, r.z + r.fz * r.len / 2) < 9);
      this.jumpStart = { x: v.pos.x, z: v.pos.z, ramp: ri, t: 0, maxY: v.pos.y };
    }
    if (this.jumpStart) {
      const j = this.jumpStart;
      j.t += dt;
      j.maxY = Math.max(j.maxY, v.pos.y);
      if (j.ramp >= 0 && j.t > 0.6) g.timeScale = 0.45;
      if (v.grounded) {
        g.timeScale = 1;
        const d = dist(j.x, j.z, v.pos.x, v.pos.z);
        if (j.ramp >= 0 && j.t > 0.8) {
          const first = !this.jumpsDone.has(j.ramp);
          const bonus = Math.round((j.t * 150 + d * 5) * (first ? 2 : 1) / 10) * 10;
          if (first) { this.jumpsDone.add(j.ramp); g.stats.jumps = this.jumpsDone.size; }
          g.addMoney(bonus);
          g.hud.bigText('¡SALTO INSÓLITO!', `${Math.round(d)} m — $${bonus}${first ? `<br><small>Saltos únicos: ${this.jumpsDone.size} de ${RAMPS.length}</small>` : ''}`, 3.5);
        } else if (j.t > 2.2) {
          const bonus = Math.round(j.t * 40);
          g.addMoney(bonus);
          g.hud.showToast(`Volaste ${Math.round(d)} m — +$${bonus}`, 2);
        }
        this.jumpStart = null;
      }
    }
  }

  // ---------- Remís ----------
  startRemis() {
    const g = this.game;
    this.remis = { fares: 0, state: 'find', timer: 0, pax: null, blip: null, total: 0 };
    g.hud.showHelp(`<b>Remisero</b>: buscá al pasajero marcado en el radar y frená al lado. Para terminar el turno, ${g.key('job')}.`, 6);
    this.nextFare();
  }

  stopRemis(msg) {
    const g = this.game;
    const r = this.remis;
    if (!r) return;
    if (r.pax && !r.pax.removed) { if (r.pax.vehicle) r.pax.exitVehicle(); r.pax.persistent = false; r.pax.blip = null; r.pax.brain = new Brain(g, r.pax, 'wander'); }
    if (r.destBlip) g.blips.splice(g.blips.indexOf(r.destBlip), 1);
    if (r.marker) r.marker.dispose();
    g.hud.removeCounter('remis'); g.hud.removeCounter('remisT');
    g.hud.showToast(`${msg}<br>Viajes: ${r.fares} — Recaudaste $${r.total}`, 4);
    this.remis = null;
  }

  nextFare() {
    const g = this.game;
    const r = this.remis;
    const pp = g.player.vehicle.pos;
    const near = g.city.blocks.filter((b) => { const d = dist((b.x0 + b.x1) / 2, (b.z0 + b.z1) / 2, pp.x, pp.z); return d > 60 && d < 260 && !b.special; });
    if (!near.length) { this.stopRemis('No hay pasajeros por acá.'); return; }
    const b = pick(near);
    const [x, z] = g.city.sidewalkPoint(b, rand(0.2, 0.8), Math.floor(rand(0, 4)));
    const pax = g.spawnPed('civil', x, z, { look: randomLook('civil') });
    pax.persistent = true;
    pax.brain = new Brain(g, pax, 'idle');
    pax.blip = '#20c0ff'; pax.blipEdge = true;
    pax.wave = true;
    r.pax = pax; r.state = 'find'; r.timer = 60;
  }

  updateRemis(dt) {
    const g = this.game;
    const r = this.remis;
    if (!r) return;
    const p = g.player;
    if (!p.vehicle || p.vehicle.key !== 'remis') { this.stopRemis('Te bajaste del remís.'); return; }
    if (r.pax && r.pax.dead) { this.stopRemis('Tu pasajero... ya no necesita remís.'); return; }
    r.timer -= dt;
    g.hud.setCounter('remis', 'VIAJES', String(r.fares));
    g.hud.setCounter('remisT', 'TIEMPO', `${Math.max(0, Math.floor(r.timer / 60))}:${String(Math.max(0, Math.floor(r.timer % 60))).padStart(2, '0')}`);
    if (r.timer <= 0) { this.stopRemis('Se te acabó el tiempo.'); return; }
    const v = p.vehicle;
    if (r.state === 'find') {
      const d = dist(v.pos.x, v.pos.z, r.pax.pos.x, r.pax.pos.z);
      if (d < 7 && v.speed < 2) {
        const seat = v.seats.findIndex((s, i) => i > 0 && !s);
        if (seat < 0) { g.hud.showHelp('No hay lugar para el pasajero.', 2); return; }
        r.pax.wave = false;
        r.pax.enterVehicle(v, seat);
        r.pax.blip = null;
        // destino
        const blocks = g.city.blocks.filter((b) => { const dd = dist((b.x0 + b.x1) / 2, (b.z0 + b.z1) / 2, v.pos.x, v.pos.z); return dd > 200 && dd < 700; });
        const b = pick(blocks.length ? blocks : g.city.blocks);
        const [x, z] = g.city.sidewalkPoint(b, 0.5, Math.floor(rand(0, 4)));
        r.dest = { x, z, zone: g.world.zoneAt(x, z) };
        r.marker = new (Marker)(g, x, z, 0xffd21a, { r: 3, h: 1.2 });
        r.destBlip = { x, z, color: '#ffd21a', size: 8, edge: true };
        g.blips.push(r.destBlip);
        r.dist = dist(v.pos.x, v.pos.z, x, z);
        r.timer = 20 + r.dist / 9;
        r.state = 'drive';
        g.hud.subtitle(`<span class="who">Pasajero:</span> ${pick(['Llevame a', 'Voy para', 'Hasta'])} ${r.dest.zone}, por favor. ${pick(['Rapidito que llego tarde al laburo.', 'Y no me cobres la vuelta.', 'Cuidado con el viento.', ''])}`, 4);
      }
    } else if (r.state === 'drive') {
      r.marker.update(dt);
      const d = dist(v.pos.x, v.pos.z, r.dest.x, r.dest.z);
      if (d < 5 && v.speed < 2) {
        const pay = Math.round(10 + r.dist * 0.06 + r.timer * 0.5);
        g.addMoney(pay);
        r.total += pay;
        r.fares++;
        g.stats.fares++;
        r.pax.exitVehicle();
        r.pax.persistent = false;
        r.pax.brain = new Brain(g, r.pax, 'wander');
        r.marker.dispose(); r.marker = null;
        g.blips.splice(g.blips.indexOf(r.destBlip), 1); r.destBlip = null;
        g.hud.showToast(`¡Viaje completado! +$${pay}`, 2);
        if (r.fares === 10) { g.addMoney(3000); g.hud.bigText('¡REMISERO DEL AÑO!', '+$3.000', 4); }
        this.nextFare();
      }
    }
  }

  // ---------- Gimnasio ----------
  gym() {
    const g = this.game;
    const p = g.player;
    if (p !== g.gordopin) { g.hud.showHelp('Petroca: "¿Gimnasio? Yo hago fierros en el pozo todo el día."', 3); return; }
    const box = document.createElement('div');
    box.className = 'mini gymbox';
    box.innerHTML = `<h3>Cinta — Gimnasio Músculo Patagónico</h3><p>Apretá <kbd>A</kbd> y <kbd>D</kbd> (o ◀ ▶) alternados para correr. <kbd>F</kbd> para salir.</p><div class="meter"><i></i></div><div class="gs"></div><div class="mini-btns"><button data-k="L">◀</button><button data-k="R">▶</button><button data-k="X">Salir</button></div>`;
    document.body.appendChild(box);
    g.controlsLocked = true;
    let speed = 0, last = null, burned = 0, t = 0;
    const press = (k) => {
      if (k === 'X') { end(); return; }
      if (k !== last) { speed = Math.min(1, speed + 0.09); last = k; }
    };
    box.querySelectorAll('button').forEach((b) => b.addEventListener('pointerdown', (e) => { e.preventDefault(); press(b.dataset.k); }));
    const end = () => {
      box.remove();
      g.controlsLocked = false;
      this.mini = null;
      p.moveMag = 0;
      g.hud.showToast(`Quemaste ${burned.toFixed(1)} de grasa. Músculo: ${g.stats.muscle.toFixed(0)}`, 3);
      this.updateBody();
    };
    this.mini = {
      update: (dt) => {
        const inp = g.input;
        if (inp.was('left')) press('L');
        if (inp.was('right')) press('R');
        if (inp.was('enter') || inp.was('pause')) { end(); return; }
        t += dt;
        speed = Math.max(0, speed - dt * 0.35);
        p.moveMag = 0;
        p.model.update(0, { speed: speed * 6 });
        if (speed > 0.35) {
          const b = dt * speed * 0.6;
          g.stats.fat = Math.max(0, g.stats.fat - b);
          g.stats.muscle = Math.min(100, g.stats.muscle + b * 0.35);
          g.stats.stamina = Math.min(100, g.stats.stamina + b * 0.5);
          burned += b;
        }
        box.querySelector('.meter i').style.width = speed * 100 + '%';
        box.querySelector('.gs').textContent = `Grasa: ${g.stats.fat.toFixed(1)}   Músculo: ${g.stats.muscle.toFixed(1)}   Resistencia: ${g.stats.stamina.toFixed(1)}`;
        this.updateBody();
      },
    };
  }

  // ---------- Malabares en el semáforo ----------
  juggling() {
    const g = this.game;
    const p = g.player;
    if (p !== g.gordopin) { g.hud.showHelp('Petroca: "Yo no hago malabares, loco. Yo tengo un sueldo petrolero."', 3); return; }
    if (this.trafficLight.state === 'NS' || this.trafficLight.state === 'NSy') {
      g.hud.showHelp('Esperá que el semáforo de <b>Av. San Martín</b> se ponga en rojo (los autos tienen que estar frenados).', 4);
      this.jugWait = true;
    }
    const box = document.createElement('div');
    box.className = 'mini jugbox';
    box.innerHTML = `<div class="jug-head"><span class="jt">MALABARES</span><span class="jm">$0</span></div><div class="lanes"><div class="lane" data-l="0"><b>◀</b></div><div class="lane" data-l="1"><b>▲</b></div><div class="lane" data-l="2"><b>▼</b></div><div class="lane" data-l="3"><b>▶</b></div><div class="hitline"></div></div><div class="jug-msg">"No soy trapito, soy malabarista."</div><div class="mini-btns"><button data-k="0">◀</button><button data-k="1">▲</button><button data-k="2">▼</button><button data-k="3">▶</button></div>`;
    document.body.appendChild(box);
    g.controlsLocked = true;
    p.moveMag = 0;
    p.jugg = true;
    // clavas volando
    const clubs = [];
    for (let i = 0; i < 3; i++) {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.02, 0.45, 6), new THREE.MeshLambertMaterial({ color: i === 1 ? 0x1c2f6b : 0xf2f2f2 }));
      g.scene.add(m);
      clubs.push(m);
    }
    const lanes = [...box.querySelectorAll('.lane')];
    const notes = [];
    let t = -2, earned = 0, combo = 0, hits = 0, misses = 0, spawnT = 0;
    const bpm = 100;
    const beat = 60 / bpm;
    const total = 18;
    const msg = box.querySelector('.jug-msg');
    const cam = g.cameraRig;
    const f = { x: Math.sin(p.heading), z: Math.cos(p.heading) };
    p.heading = Math.atan2(POI.semaforo.x - p.pos.x, POI.semaforo.z - p.pos.z) + 0.8;
    const camFrom = new THREE.Vector3(p.pos.x + 5, p.pos.y + 2.2, p.pos.z + 5);
    const camTo = new THREE.Vector3(p.pos.x + 3.5, p.pos.y + 1.8, p.pos.z + 3.8);
    cam.startCinematic(camFrom, camTo, new THREE.Vector3(p.pos.x, p.pos.y + 1.6, p.pos.z), 20);
    void f;
    const hit = (lane) => {
      // nota más cercana a la línea en ese carril
      let best = null, bd = 0.22;
      for (const n of notes) { if (n.lane !== lane || n.done) continue; const d = Math.abs(n.t - t); if (d < bd) { bd = d; best = n; } }
      if (best) {
        best.done = true; best.el.classList.add('ok');
        combo++; hits++;
        const tip = Math.round(rand(1, 4) * (1 + Math.min(combo, 20) * 0.1));
        earned += tip;
        msg.textContent = combo > 5 ? `¡COMBO x${combo}! Los autos tiran monedas` : pick(['¡Bien!', '¡Joya!', '¡Aguante!', '¡Eso!']);
        g.audio.tone({ freq: 700 + lane * 120, dur: 0.08, type: 'triangle', gain: 0.15 });
      } else { combo = 0; misses++; msg.textContent = pick(['¡Se te cayó!', 'Uh, casi...', 'Concentrate, Gordo']); g.audio.tone({ freq: 160, dur: 0.15, type: 'square', gain: 0.1 }); }
    };
    box.querySelectorAll('button').forEach((b) => b.addEventListener('pointerdown', (e) => { e.preventDefault(); hit(+b.dataset.k); }));
    const end = () => {
      for (const c of clubs) g.scene.remove(c);
      box.remove();
      p.jugg = false;
      g.controlsLocked = false;
      cam.endCinematic();
      this.mini = null;
      g.addMoney(earned);
      g.stats.juggleBest = Math.max(g.stats.juggleBest, earned);
      g.stats.respect = Math.min(100, g.stats.respect + hits * 0.1);
      g.hud.bigText('¡MALABARES!', `Juntaste $${earned} — Aciertos ${hits}, errores ${misses}`, 4);
    };
    this.mini = {
      update: (dt) => {
        const inp = g.input;
        if (inp.was('left')) hit(0);
        if (inp.was('forward')) hit(1);
        if (inp.was('back')) hit(2);
        if (inp.was('right')) hit(3);
        if (inp.was('pause') || inp.was('enter')) { end(); return; }
        if (this.jugWait && (this.trafficLight.state === 'NS' || this.trafficLight.state === 'NSy')) { t = -2; return; }
        this.jugWait = false;
        t += dt;
        spawnT -= dt;
        if (spawnT <= 0 && t < total - 2) {
          spawnT = beat * pick([1, 1, 0.5, 2]);
          const lane = Math.floor(rand(0, 4));
          const el = document.createElement('i');
          el.className = 'jnote';
          el.textContent = ['◀', '▲', '▼', '▶'][lane];
          lanes[lane].appendChild(el);
          notes.push({ lane, t: t + 1.6, el, done: false });
        }
        for (const n of notes) {
          const y = 1 - (n.t - t) / 1.6; // 0 arriba, 1 en la línea
          n.el.style.top = `${clamp(y, -0.1, 1.2) * 82}%`;
          if (!n.done && t - n.t > 0.25) { n.done = true; n.el.classList.add('miss'); combo = 0; misses++; }
          if (t - n.t > 0.5) n.el.remove();
        }
        box.querySelector('.jm').textContent = `$${earned}`;
        // animación de las clavas
        const now = performance.now() * 0.001;
        clubs.forEach((c, i) => {
          const a = now * 5 + i * (Math.PI * 2 / 3);
          c.position.set(p.pos.x + Math.cos(a) * 0.35 * Math.cos(p.heading), p.pos.y + 1.9 + Math.abs(Math.sin(a)) * 0.9, p.pos.z - Math.cos(a) * 0.35 * Math.sin(p.heading));
          c.rotation.x = now * 12 + i;
        });
        if (t > total || (t > 0 && (this.trafficLight.state === 'NS'))) end();
      },
    };
  }
}
