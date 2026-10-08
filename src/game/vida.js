// Vida en la calle (versión compacta): gente charlando en la vereda, la cola del colectivo,
// pibes jugando a la pelota, perros callejeros que te siguen y gaviotas en la costa.
// Todo aparece alrededor del jugador y se va cuando queda lejos.
import * as THREE from 'three';
import { Brain } from './ai.js';
import { randomLook } from '../entities/humanoid.js';
import { STYLE, lam } from '../render/style.js';
import { signTexture } from '../render/textures.js';
import { rand, pick, chance, dist, clamp } from '../util.js';

const FAR = 135;

export class Vida {
  constructor(game) {
    this.game = game;
    this.on = STYLE.variante === 'compacto';
    this.scenes = [];
    this.perros = [];
    this.spawnT = 2;
    if (!this.on) return;
    // más gente y más autos (la ciudad es más chica: se siente llena)
    game.population.max = Math.round(game.population.max * 1.25);
    game.traffic.max = Math.round(game.traffic.max * 1.25);
    game.traffic.maxParked = Math.round(game.traffic.maxParked * 1.25);
    this.buildGaviotas();
  }

  update(dt) {
    if (!this.on) return;
    const g = this.game;
    const pl = g.player;
    const pp = pl.vehicle ? pl.vehicle.pos : pl.pos;
    // escenas: se actualizan y se van las lejanas
    for (const s of [...this.scenes]) {
      for (let i = s.peds.length - 1; i >= 0; i--) if (s.peds[i].removed || s.peds[i].dead) s.peds.splice(i, 1);
      const gone = dist(s.x, s.z, pp.x, pp.z) > FAR || !s.peds.length;
      if (gone) { this.dropScene(s); continue; }
      // si alguien se asusta (tiros, choques) la escena deja de manejarlo
      for (const p of s.peds) if (p.brain && p.brain.mode !== s.mode) p.vidaLibre = true;
      s.update(dt);
    }
    for (const d of [...this.perros]) {
      if (dist(d.pos.x, d.pos.z, pp.x, pp.z) > FAR + 20) { this.dropPerro(d); continue; }
      this.updatePerro(d, dt);
    }
    this.updateGaviotas(dt, pp);
    this.spawnT -= dt;
    if (this.spawnT > 0) return;
    this.spawnT = 1.2;
    if (g.missions && g.missions.active && g.missions.active.def.id === 'intro') return;
    const night = g.env.night > 0.6, late = g.env.time > 60 && g.env.time < 6 * 60;
    const maxScenes = late ? 2 : night ? 4 : 6;
    if (this.scenes.length < maxScenes) this.spawnScene(pp);
    if (this.perros.length < (late ? 2 : 4) && chance(0.35)) this.spawnPerro(pp);
  }

  // lugar fuera de la vista inmediata del jugador
  hidden(x, z) {
    const g = this.game;
    const cam = g.camera.position;
    const cx = x - cam.x, cz = z - cam.z, cd = Math.hypot(cx, cz);
    const f = g.cameraRig.forward();
    return !(cd < 40 && (cx * f.x + cz * f.z) / cd > 0.4);
  }

  spawnScene(pp) {
    const g = this.game;
    const sw = g.city.randomSidewalk(pp.x, pp.z, 30, 95);
    if (!sw || !this.hidden(sw.x, sw.z)) return;
    if (this.scenes.some((s) => dist(s.x, s.z, sw.x, sw.z) < 25)) return;
    const zt = g.world.zoneTypeAt(sw.x, sw.z);
    const e = sw.edge;
    const opts = [];
    opts.push('charla', 'charla');
    if (e.kind === 'avenida' || zt === 'centro') opts.push('parada', 'parada');
    if (zt !== 'centro' && g.env.night < 0.5) opts.push('pibes', 'pibes');
    const type = pick(opts);
    const s = this[type](sw, zt);
    if (s) { s.type = type; this.scenes.push(s); }
  }

  ped(kind, x, z, heading, mode = 'idle', look = null) {
    const g = this.game;
    const p = g.spawnPed(kind, x, z, { look: look || randomLook(kind), rot: heading });
    p.spawned = true;
    p.brain = new Brain(g, p, mode);
    p.heading = heading;
    return p;
  }

  // normal de la vereda hacia los edificios (lejos de la calle)
  frame(sw) {
    const e = sw.edge;
    return { fx: e.dx, fz: e.dz, nx: -e.dz * sw.side, nz: e.dx * sw.side };
  }

  // 2 a 4 personas charlando en ronda, que gesticulan de a uno
  charla(sw) {
    const { nx, nz } = this.frame(sw);
    const cx = sw.x + nx * 0.4, cz = sw.z + nz * 0.4;
    const n = 2 + Math.floor(Math.random() * 3);
    const peds = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rand(-0.3, 0.3), r = 0.75 + rand(0, 0.2);
      const x = cx + Math.cos(a) * r, z = cz + Math.sin(a) * r;
      peds.push(this.ped(chance(0.15) ? 'abuela' : 'civil', x, z, Math.atan2(cx - x, cz - z)));
    }
    let t = rand(1, 3), who = null;
    return {
      x: cx, z: cz, peds, mode: 'idle',
      update: (dt) => {
        t -= dt;
        if (t > 0) return;
        if (who) { who.wave = false; who = null; t = rand(0.8, 2.5); return; }
        const free = peds.filter((p) => !p.vidaLibre);
        if (!free.length) return;
        who = pick(free);
        who.wave = true;
        t = rand(0.9, 1.8);
      },
    };
  }

  // la cola del colectivo: gente mirando la calle y el cartel de la parada
  parada(sw) {
    const g = this.game;
    const { fx, fz, nx, nz } = this.frame(sw);
    const n = 2 + Math.floor(Math.random() * 4);
    const peds = [];
    const face = Math.atan2(-nx, -nz);
    for (let i = 0; i < n; i++) {
      const k = i * 1.1 + rand(-0.15, 0.15);
      const x = sw.x + fx * k + nx * 0.5, z = sw.z + fz * k + nz * 0.5;
      peds.push(this.ped(chance(0.2) ? 'abuela' : chance(0.3) ? 'petrolero' : 'civil', x, z, face + rand(-0.5, 0.5)));
    }
    // cartel de la parada
    const px = sw.x - fx * 1.2 - nx * 0.6, pz = sw.z - fz * 1.2 - nz * 0.6;
    const y = g.terrain.groundAt(px, pz) + 0.15;
    const grp = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.6, 6), lam({ color: 0x8a8f94 }));
    pole.position.set(0, 1.3, 0);
    grp.add(pole);
    if (!Vida.paradaTex) Vida.paradaTex = signTexture(['PARADA', 'LÍNEA 7'], { w: 256, h: 192, bg: '#f2c230', fg: '#1a1a1a' });
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.42), new THREE.MeshBasicMaterial({ map: Vida.paradaTex, side: THREE.DoubleSide, fog: true }));
    sign.position.set(0, 2.35, 0);
    sign.rotation.y = Math.atan2(fx, fz) + Math.PI / 2;
    grp.add(sign);
    grp.position.set(px, y, pz);
    g.scene.add(grp);
    return {
      x: sw.x, z: sw.z, peds, mode: 'idle', props: [grp],
      update: (dt) => {
        // de vez en cuando alguien se cansa de esperar y se va caminando
        if (chance(dt * 0.01)) {
          const p = pick(peds);
          if (p && !p.vidaLibre) { p.brain.setMode('wander'); p.brain.base = 'wander'; p.vidaLibre = true; }
        }
      },
    };
  }

  // pibes jugando a la pelota (en la vereda ancha, la plaza o la calle de tierra del barrio)
  pibes(sw) {
    const g = this.game;
    const { nx, nz } = this.frame(sw);
    // si hay una plaza o una canchita cerca, van ahí
    let cx = sw.x + nx * 1.2, cz = sw.z + nz * 1.2, R = 3.5;
    const areas = (g.zones && g.zones.areas) || [];
    const plaza = areas.find((a) => (a.kind === 'plaza' || a.kind === 'cancha') && dist(a.centroid[0], a.centroid[1], sw.x, sw.z) < 70);
    if (plaza) { cx = plaza.centroid[0]; cz = plaza.centroid[1]; R = 7; }
    if (g.colliders.resolveCircle({ x: cx, z: cz }, 1.5, g.terrain.heightAt(cx, cz))) return null;
    const n = 3 + Math.floor(Math.random() * 3);
    const peds = [];
    for (let i = 0; i < n; i++) {
      const L = randomLook('civil');
      L.height = 0.6 + Math.random() * 0.12; L.fat = Math.random() * 0.3; L.mustache = false; L.beard = false;
      const a = rand(0, 6.28), r = rand(1, R);
      const p = this.ped('civil', cx + Math.cos(a) * r, cz + Math.sin(a) * r, rand(0, 6.28), 'script', L);
      p.brain.script = () => {};
      // en modo 'script' el cerebro no se asusta: se pasa a 'idle' antes para que huya como cualquiera
      const br = p.brain, panic = br.panic, attacked = br.onAttacked;
      br.panic = (from, by) => { br.mode = 'idle'; panic.call(br, from, by); };
      br.onAttacked = (a) => { br.mode = 'idle'; attacked.call(br, a); };
      peds.push(p);
    }
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), lam({ color: 0xf2f2f2 }));
    ball.castShadow = true;
    g.scene.add(ball);
    const b = { x: cx, z: cz, vx: 0, vz: 0, y: 0 };
    let owner = null, kickT = 0;
    return {
      x: cx, z: cz, peds, mode: 'script', props: [ball],
      update: (dt) => {
        // pelota: rueda y se frena
        b.x += b.vx * dt; b.z += b.vz * dt;
        const k = Math.exp(-1.6 * dt); b.vx *= k; b.vz *= k;
        // que no se vaya lejos
        const dd = dist(b.x, b.z, cx, cz);
        if (dd > R + 2) { b.vx += (cx - b.x) / dd * 6 * dt; b.vz += (cz - b.z) / dd * 6 * dt; }
        const hit = g.colliders.resolveCircle(b, 0.12, g.terrain.heightAt(b.x, b.z));
        if (hit) { b.vx *= -0.6; b.vz *= -0.6; }
        ball.position.set(b.x, g.terrain.groundAt(b.x, b.z) + 0.11, b.z);
        ball.rotation.x += b.vz * dt * 9; ball.rotation.z -= b.vx * dt * 9;
        kickT -= dt;
        const free = peds.filter((p) => !p.vidaLibre);
        if (!free.length) return;
        // el más cercano corre a la pelota; los demás se acomodan alrededor
        if (!owner || owner.vidaLibre || owner.removed) owner = free.reduce((a, p) => (dist(p.pos.x, p.pos.z, b.x, b.z) < dist(a.pos.x, a.pos.z, b.x, b.z) ? p : a), free[0]);
        for (const p of free) {
          if (p === owner) {
            if (p.brain.moveTo(b.x, b.z, 1, 0.45) && kickT <= 0) {
              const to = pick(free.filter((q) => q !== p)) || p;
              const dx = to.pos.x - b.x + rand(-1, 1), dz = to.pos.z - b.z + rand(-1, 1), l = Math.hypot(dx, dz) || 1;
              const sp = rand(5, 8);
              b.vx = dx / l * sp; b.vz = dz / l * sp;
              kickT = 0.8;
              owner = to;
              p.heading = Math.atan2(dx, dz);
            }
          } else {
            if (!p.spot || chance(dt * 0.3)) { const a = rand(0, 6.28), r = rand(1, R); p.spot = { x: cx + Math.cos(a) * r, z: cz + Math.sin(a) * r }; }
            if (p.brain.moveTo(p.spot.x, p.spot.z, 0, 0.5)) p.heading = Math.atan2(b.x - p.pos.x, b.z - p.pos.z);
          }
        }
      },
    };
  }

  dropScene(s) {
    const g = this.game;
    for (const p of s.peds) if (!p.removed && !p.vidaLibre) g.removePed(p);
    for (const o of s.props || []) { g.scene.remove(o); this.dispose(o); }
    const i = this.scenes.indexOf(s);
    if (i >= 0) this.scenes.splice(i, 1);
  }

  // geometrías y materiales de un objeto que se saca de la escena (la textura de la parada se comparte)
  dispose(o) {
    o.traverse((q) => {
      if (q.geometry) q.geometry.dispose();
      if (q.material) for (const m of [].concat(q.material)) m.dispose();
    });
  }

  // ---------- Perros callejeros ----------
  perroMesh(col) {
    const m = lam({ color: col }), dark = lam({ color: 0x2a2420 });
    const g = new THREE.Group();
    const box = (w, h, d, x, y, z, mat = m) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); b.position.set(x, y, z); b.castShadow = true; g.add(b); return b; };
    box(0.32, 0.3, 0.72, 0, 0.5, 0);
    const head = box(0.26, 0.26, 0.28, 0, 0.72, 0.42);
    box(0.14, 0.12, 0.16, 0, 0.67, 0.6, m);
    box(0.06, 0.05, 0.04, 0, 0.69, 0.69, dark);
    box(0.06, 0.12, 0.05, -0.09, 0.88, 0.4, dark);
    box(0.06, 0.12, 0.05, 0.09, 0.88, 0.4, dark);
    const tail = box(0.05, 0.05, 0.3, 0, 0.62, -0.46);
    tail.rotation.x = 0.7;
    const legs = [];
    for (const [x, z] of [[-0.1, 0.25], [0.1, 0.25], [-0.1, -0.25], [0.1, -0.25]]) {
      const pivot = new THREE.Group();
      pivot.position.set(x, 0.42, z);
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.42, 0.08), m);
      leg.position.y = -0.21;
      leg.castShadow = true;
      pivot.add(leg);
      g.add(pivot);
      legs.push(pivot);
    }
    return { g, legs, tail, head };
  }

  spawnPerro(pp) {
    const g = this.game;
    const sw = g.city.randomSidewalk(pp.x, pp.z, 35, 100);
    if (!sw || !this.hidden(sw.x, sw.z)) return;
    const col = pick([0x8a6a48, 0x2a2622, 0xd8c8a8, 0xb08850, 0x6a5a4a, 0xf0ece4]);
    const m = this.perroMesh(col);
    const s = rand(0.85, 1.15);
    m.g.scale.setScalar(s);
    g.scene.add(m.g);
    const d = { ...m, pos: new THREE.Vector3(sw.x, g.terrain.groundAt(sw.x, sw.z), sw.z), heading: rand(0, 6.28), home: { x: sw.x, z: sw.z }, wp: null, phase: 0, follow: 0, barkT: 0, idleT: 0 };
    this.perros.push(d);
  }

  updatePerro(d, dt) {
    const g = this.game, pl = g.player;
    const tp = pl.vehicle ? pl.vehicle.pos : pl.pos;
    const dp = dist(d.pos.x, d.pos.z, tp.x, tp.z);
    // a veces se le pega al jugador (a pie) y lo acompaña un rato; a los autos los corre ladrando
    if (d.follow <= 0 && dp < 10 && chance(dt * (pl.vehicle ? 0.5 : 0.25))) d.follow = pl.vehicle ? rand(3, 6) : rand(20, 45);
    let tx, tz, speed = 0;
    if (d.follow > 0) {
      d.follow -= dt;
      if (dp > 35) d.follow = 0;
      // a pie: atrás y al costado; al auto lo corre por al lado (no por adentro)
      const h = pl.vehicle ? pl.vehicle.heading : pl.heading;
      const back = pl.vehicle ? 0.5 : 2.2, side = pl.vehicle ? pl.vehicle.type.W / 2 + 1.6 : 0.8;
      tx = tp.x - Math.sin(h) * back + Math.cos(h) * side;
      tz = tp.z - Math.cos(h) * back - Math.sin(h) * side;
      const dd = dist(d.pos.x, d.pos.z, tx, tz);
      speed = dd > 1.2 ? clamp(dd * 1.4, 2, pl.vehicle ? 9 : 7) : 0;
      d.barkT -= dt;
      if ((pl.vehicle || chance(dt * 0.12)) && d.barkT <= 0 && g.audio && g.audio.ladrido) { g.audio.ladrido(d.pos); d.barkT = rand(0.6, 1.4); }
    } else {
      if (d.idleT > 0) d.idleT -= dt;
      else {
        if (!d.wp || dist(d.pos.x, d.pos.z, d.wp.x, d.wp.z) < 0.8) {
          const a = rand(0, 6.28), r = rand(4, 18);
          d.wp = { x: d.home.x + Math.cos(a) * r, z: d.home.z + Math.sin(a) * r };
          if (chance(0.4)) d.idleT = rand(2, 8);
        }
        tx = d.wp.x; tz = d.wp.z; speed = 1.4;
      }
    }
    if (speed > 0 && tx !== undefined) {
      const dx = tx - d.pos.x, dz = tz - d.pos.z, l = Math.hypot(dx, dz) || 1;
      const want = Math.atan2(dx, dz);
      let da = want - d.heading;
      while (da > Math.PI) da -= Math.PI * 2;
      while (da < -Math.PI) da += Math.PI * 2;
      d.heading += clamp(da, -6 * dt, 6 * dt);
      d.pos.x += Math.sin(d.heading) * speed * dt;
      d.pos.z += Math.cos(d.heading) * speed * dt;
      void l;
      const hit = g.colliders.resolveCircle(d.pos, 0.35, d.pos.y + 0.2, 0.6);
      if (hit) d.wp = null;
    }
    d.pos.y = g.terrain.groundAt(d.pos.x, d.pos.z);
    d.phase += dt * (speed > 0 ? 4 + speed * 1.6 : 0);
    const sw = Math.sin(d.phase) * clamp(speed / 3, 0, 0.7);
    d.legs[0].rotation.x = sw; d.legs[3].rotation.x = sw;
    d.legs[1].rotation.x = -sw; d.legs[2].rotation.x = -sw;
    d.tail.rotation.y = Math.sin(performance.now() * (d.follow > 0 ? 0.025 : 0.008)) * 0.6;
    d.g.position.copy(d.pos);
    d.g.rotation.y = d.heading;
    d.g.visible = dp < 110;
  }

  dropPerro(d) {
    this.game.scene.remove(d.g);
    this.dispose(d.g);
    this.perros.splice(this.perros.indexOf(d), 1);
  }

  // ---------- Gaviotas en la costa ----------
  buildGaviotas() {
    const geo = new THREE.BufferGeometry();
    // cuerpo + dos alas (se aletea moviendo las puntas en el vértice)
    geo.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.25, 0, 0, -0.25, -0.8, 0, 0, 0, 0, 0.25, 0, 0, -0.25, 0.8, 0, 0], 3));
    geo.computeVertexNormals();
    const mat = new THREE.MeshBasicMaterial({ color: 0xf4f4f0, side: THREE.DoubleSide, fog: true });
    this.gaviotas = [];
    this.gGroup = new THREE.Group();
    for (let i = 0; i < 12; i++) {
      const m = new THREE.Mesh(geo.clone(), mat);
      this.gGroup.add(m);
      this.gaviotas.push({ m, a: rand(0, 6.28), r: rand(12, 40), h: rand(12, 30), sp: rand(0.15, 0.35) * (chance(0.5) ? 1 : -1), ph: rand(0, 6.28) });
    }
    this.gGroup.visible = false;
    this.game.scene.add(this.gGroup);
    this.gAnchor = null;
    this.gT = 0;
  }

  updateGaviotas(dt, pp) {
    const g = this.game, T = g.terrain;
    this.gT -= dt;
    if (this.gT <= 0) {
      this.gT = 4;
      // el punto de costa más cercano (hacia el mar) a menos de 250 m
      let best = null;
      for (let k = 0; k < 12; k++) {
        const a = (k / 12) * Math.PI * 2;
        for (const r of [40, 100, 180, 250]) {
          const x = pp.x + Math.cos(a) * r, z = pp.z + Math.sin(a) * r;
          const sd = T.seaDist(x, z);
          if (Math.abs(sd) < 30 && (!best || r < best.r)) best = { x, z, r };
        }
      }
      this.gTarget = best;
      if (best && !this.gAnchor) this.gAnchor = { x: best.x, z: best.z };
    }
    const on = !!this.gTarget && g.env.night < 0.7;
    this.gGroup.visible = on;
    if (!on) { this.gAnchor = null; return; }
    // (de noche se borra el ancla: al volver el día arrancan desde la costa más cercana)
    if (!this.gAnchor) this.gAnchor = { x: this.gTarget.x, z: this.gTarget.z };
    const A = this.gAnchor;
    A.x += (this.gTarget.x - A.x) * Math.min(1, dt * 0.3);
    A.z += (this.gTarget.z - A.z) * Math.min(1, dt * 0.3);
    const now = performance.now() * 0.001;
    for (const b of this.gaviotas) {
      b.a += b.sp * dt;
      const x = A.x + Math.cos(b.a) * b.r, z = A.z + Math.sin(b.a) * b.r;
      b.m.position.set(x, Math.max(0, T.heightAt(x, z)) + b.h + Math.sin(now * 0.7 + b.ph) * 1.5, z);
      b.m.rotation.y = -b.a + (b.sp > 0 ? 0 : Math.PI);
      b.m.rotation.z = Math.sin(now * 1.3 + b.ph) * 0.25 * Math.sign(b.sp);
      const p = b.m.geometry.attributes.position, f = Math.sin(now * 7 + b.ph) * 0.3;
      p.setY(2, f); p.setY(5, f); p.needsUpdate = true;
    }
  }
}
