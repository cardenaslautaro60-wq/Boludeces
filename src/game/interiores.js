// Interiores al estilo GTA: se entra caminando a un aro rojo en la vereda, la pantalla funde a
// negro y aparecés adentro. El primero es el Draw Bar & Pool (San Martín 371): salón con barra,
// mesa de cartas y el escenario donde canta Charly Amado, y la sala de pool con ocho mesas donde
// la gente juega de verdad (las bolas ruedan, rebotan y caen en las troneras).
//
// El interior se arma una sola vez, la primera vez que entrás, 300 m arriba de la vereda del
// local (así el minimapa sigue marcando dónde estás y no se cruza con nada de la ciudad).
import * as THREE from 'three';
import { Marker } from './activities.js';
import { buildDraw, DRAW_TABLES, DRAW_TABLE } from '../world/interior-draw.js';
import { META } from '../world/mapdata.js';
import { Humanoid, randomLook } from '../entities/humanoid.js';
import { STYLE } from '../render/style.js';
import { clamp, RNG, pick, approachAngle, angleWrap } from '../util.js';
import { PoolMatch } from './pool-juego.js';

// Ubicación real del Draw (Google Maps: -45.8609401, -67.4794584) en metros desde el origen del
// mapa (tools/mapa/build_map.py: LAT0 -45.8632, LON0 -67.4753); el centro está a escala del mapa
const DRAW_REAL = { x: -322.4, z: -249.8 };
const ALTO = 300;

const BAR = [
  { name: 'Cerveza tirada', price: 4, hp: 10, fat: 1 },
  { name: 'Fernet con coca', price: 6, hp: 15, fat: 1 },
  { name: 'Pizza de la casa (de las pocas que cocinan después de las 12)', price: 10, hp: 50, fat: 4 },
  { name: 'Agua, que manejo', price: 2, hp: 5, fat: 0 },
];

// Charly: canta de todo (rock, baladas, lo que pida la gente). Los temas son inventados.
const SHOW_TITLES = {
  balada: ['Viento del Golfo', 'Noche en San Martín', 'Te esperé en la Costanera', 'Chenque de mi vida'],
  rockshow: ['Bola ocho', 'Taco torcido', 'Ruta 3 a fondo', 'Petróleo y rock'],
  house: ['Draw Club Mix', 'Madrugada en el Centro', 'Luces de la Rada'],
  reggaeton: ['Perreo en el Km 3', 'Dale que va', 'Mesa cinco'],
};
const CHARLY_LINES = [
  '¡Buenas noches, Comodoro! ¿Cómo andan esos tacos?',
  'Este va para los de la mesa del fondo, que no la meten ni con la mano.',
  'Pidan, pidan, que yo canto de todo: rock, baladas, lo que venga.',
  'Un aplauso para la moza, que hoy no se olvidó ningún pedido.',
  'Cuidado con las bolas que vuelan, eh. Yo canto, no atajo.',
  'Ahora uno tranquilo, para los enamorados del rincón.',
  'Afuera sopla el viento, pero acá adentro hace calor, ¿o no?',
  '¡Vamos, Comodoro! La noche recién empieza.',
];

// Pose de un taco: barra de madera con la punta clara
function cueMesh() {
  const g = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.016, 1.45, 6), new THREE.MeshLambertMaterial({ color: 0xd8b878 }));
  shaft.rotation.x = Math.PI / 2; shaft.position.z = -0.725;
  const butt = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.017, 0.45, 6), new THREE.MeshLambertMaterial({ color: 0x2a1408 }));
  butt.rotation.x = Math.PI / 2; butt.position.z = -1.22;
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.0075, 0.0075, 0.02, 6), new THREE.MeshLambertMaterial({ color: 0x2a5ab8 }));
  tip.rotation.x = Math.PI / 2; tip.position.z = -0.01;
  g.add(shaft, butt, tip);
  return g; // la punta en el origen, el taco hacia -z
}

function micMesh() {
  const g = new THREE.Group();
  const h = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.014, 0.17, 8), new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 6), new THREE.MeshLambertMaterial({ color: 0xb8b8c0 }));
  b.position.y = 0.1;
  g.add(h, b);
  g.rotation.x = -Math.PI / 2;
  return g;
}

// Una persona del interior: modelo animado sin física (no sale del local)
class Extra {
  constructor(parent, look, shadowTex, x, z, rot, y = 0) {
    this.model = new Humanoid(look, shadowTex);
    this.root = this.model.root;
    this.x = x; this.z = z; this.y = y; this.rot = rot;
    this.st = {};
    this.root.position.set(x, y, z);
    this.root.rotation.y = rot;
    parent.add(this.root);
  }
  update(dt) {
    this.root.position.set(this.x, this.y, this.z);
    this.root.rotation.y = this.rot;
    this.model.update(dt, this.st);
  }
}

// ---------- Mesa de pool con física simple ----------
const R = 0.0285;
const BALL_COLS = [0xf4f2ea, 0xf2c018, 0x1a3ab8, 0xd0201a, 0x5a1a8a, 0xf07018, 0x1a7a2a, 0x7a1010, 0x111111, 0xf2c018, 0x1a3ab8, 0xd0201a, 0x5a1a8a, 0xf07018, 0x1a7a2a, 0x7a1010];

class PoolTable {
  constructor(def, rng) {
    this.def = def;
    this.rng = rng;
    this.hx = DRAW_TABLE.playL / 2; this.hz = DRAW_TABLE.playW / 2;
    this.balls = BALL_COLS.map((c, i) => ({ i, x: 0, z: 0, vx: 0, vz: 0, on: true }));
    this.pockets = [];
    for (const px of [-1, 0, 1]) for (const pz of [-1, 1]) this.pockets.push([px * this.hx, pz * this.hz]);
    this.rack();
    this.players = [];
    this.state = 'think';
    this.t = rng.range(0.5, 4);
    this.shooter = 0;
  }

  rack() {
    const b = this.balls;
    b[0].x = -this.hx / 2; b[0].z = 0;
    const order = [1, 9, 2, 10, 8, 3, 11, 4, 12, 5, 13, 6, 14, 7, 15];
    let k = 0;
    for (let row = 0; row < 5; row++) for (let i = 0; i <= row; i++) {
      const ball = b[order[k++]];
      ball.x = this.hx / 2 + row * R * 1.75;
      ball.z = (i - row / 2) * R * 2.02;
    }
    for (const ball of b) { ball.vx = ball.vz = 0; ball.on = true; }
    this.drawn = false;
  }

  moving() { return this.balls.some((b) => b.on && (Math.abs(b.vx) + Math.abs(b.vz)) > 0.004); }
  left() { return this.balls.filter((b) => b.on && b.i !== 0).length; }

  step(dt) {
    const B = this.balls, n = 4, h = dt / n;
    for (let s = 0; s < n; s++) {
      for (const b of B) {
        if (!b.on) continue;
        const sp = Math.hypot(b.vx, b.vz);
        if (sp < 0.004) { b.vx = b.vz = 0; continue; }
        const f = Math.max(0, sp - 0.45 * h) / sp;
        b.vx *= f; b.vz *= f;
        b.x += b.vx * h; b.z += b.vz * h;
        for (const [px, pz] of this.pockets) {
          if ((b.x - px) ** 2 + (b.z - pz) ** 2 < 0.075 * 0.075) { b.on = false; b.vx = b.vz = 0; if (b.i === 0 && this.track) this.scratched = true; break; }
        }
        if (!b.on) continue;
        if (b.x > this.hx - R) { b.x = this.hx - R; b.vx = -Math.abs(b.vx) * 0.78; }
        if (b.x < -this.hx + R) { b.x = -this.hx + R; b.vx = Math.abs(b.vx) * 0.78; }
        if (b.z > this.hz - R) { b.z = this.hz - R; b.vz = -Math.abs(b.vz) * 0.78; }
        if (b.z < -this.hz + R) { b.z = -this.hz + R; b.vz = Math.abs(b.vz) * 0.78; }
      }
      for (let i = 0; i < B.length; i++) {
        const a = B[i];
        if (!a.on) continue;
        for (let j = i + 1; j < B.length; j++) {
          const b = B[j];
          if (!b.on) continue;
          const dx = b.x - a.x, dz = b.z - a.z, d2 = dx * dx + dz * dz;
          if (d2 >= 4 * R * R || d2 < 1e-10) continue;
          if (this.track && this.firstHit === null && a.i === 0) this.firstHit = b.i;
          const d = Math.sqrt(d2), nx = dx / d, nz = dz / d;
          const pen = 2 * R - d;
          a.x -= nx * pen / 2; a.z -= nz * pen / 2; b.x += nx * pen / 2; b.z += nz * pen / 2;
          const rv = (b.vx - a.vx) * nx + (b.vz - a.vz) * nz;
          if (rv >= 0) continue;
          const j2 = -rv * 0.96;
          a.vx -= nx * j2; a.vz -= nz * j2; b.vx += nx * j2; b.vz += nz * j2;
        }
      }
    }
    // la blanca adentro: se vuelve a poner en la cabecera
    const cue = B[0];
    if (!cue.on && !this.moving()) {
      cue.on = true; cue.x = -this.hx / 2; cue.z = 0; this.drawn = false;
      // si la cabecera está ocupada, correrla un poco
      for (let k = 1; k < 20 && B.some((b) => b.on && b.i && Math.hypot(b.x - cue.x, b.z - cue.z) < 2.2 * R); k++) cue.z = (k % 2 ? 1 : -1) * Math.ceil(k / 2) * 2.4 * R;
    }
  }

  // Elegir tiro: la bola cuya línea deja al tirador más cerca de la banda
  planShot() {
    const cue = this.balls[0];
    let best = null, bs = Infinity;
    for (const b of this.balls) {
      if (!b.on || b.i === 0) continue;
      let dx = b.x - cue.x, dz = b.z - cue.z;
      const d = Math.hypot(dx, dz) || 1;
      dx /= d; dz /= d;
      // distancia de la blanca al borde de la mesa hacia atrás (-dir)
      const ex = dx < -1e-4 ? (this.hx + 0.16 - cue.x) / -dx : dx > 1e-4 ? (cue.x + this.hx + 0.16) / dx : Infinity;
      const ez = dz < -1e-4 ? (this.hz + 0.16 - cue.z) / -dz : dz > 1e-4 ? (cue.z + this.hz + 0.16) / dz : Infinity;
      const e = Math.min(ex, ez);
      const sc = e + this.rng.next() * 0.4;
      if (sc < bs) { bs = sc; best = { dx, dz, e, target: b }; }
    }
    return best;
  }
}

export class Interiors {
  constructor(game) {
    this.game = game;
    this.inside = null;
    this.rng = new RNG(2026);
    this.locate();
  }

  // Puerta del Draw: la vereda de San Martín frente al local
  locate() {
    const g = this.game;
    const esc = META.escala || 1;
    const tx = DRAW_REAL.x * esc, tz = DRAW_REAL.z * esc;
    const R = g.roads;
    let n = R.nearestEdge(tx, tz, 90, (e) => /San Martín/.test(e.name || ''));
    if (!n) n = R.nearestEdge(tx, tz, 90, (e) => e.kind !== 'peatonal');
    let x = tx, z = tz, face = 0;
    if (n) {
      const e = n.edge;
      const A = R.nodes[e.a];
      const side = (e.dx * (tz - A.z) - e.dz * (tx - A.x)) >= 0 ? 1 : -1;
      const nx = -e.dz * side, nz = e.dx * side; // de la calle hacia el local
      const off = e.width / 2 + 1.9;
      x = n.x + nx * off; z = n.z + nz * off;
      face = Math.atan2(-nx, -nz); // mirando a la calle
      this.inward = { x: nx, z: nz };
    } else this.inward = { x: 0, z: -1 };
    const y = g.world.footGround(x, z);
    this.door = { x, z, y, face };
    this.origin = { x, y: y + ALTO, z };
    this.marker = new Marker(g, x, z, 0xff2a2a, { r: 0.95, h: 1.2 });
    this.ring = this.makeRing(x, y + 0.05, z, g.scene);
    g.blips.push({ x, z, letter: '8', bg: '#111', fg: '#fff', name: 'Draw Bar & Pool', legend: true });
    this.addSign();
  }

  makeRing(x, y, z, parent) {
    const m = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.07, 6, 32), new THREE.MeshBasicMaterial({ color: 0xff2020, transparent: true, opacity: 0.85, toneMapped: false }));
    m.rotation.x = Math.PI / 2;
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  }

  // Cartel de neón en la fachada, arriba de la puerta
  addSign() {
    const d = this.door, g = this.game;
    const c = document.createElement('canvas'); c.width = 256; c.height = 96;
    const x = c.getContext('2d');
    x.fillStyle = '#0a0a12'; x.fillRect(0, 0, 256, 96);
    x.font = 'italic bold 56px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.shadowColor = '#40c8ff'; x.shadowBlur = 12; x.fillStyle = '#c8f2ff'; x.fillText('Draw', 128, 40);
    x.font = 'bold 18px sans-serif'; x.shadowColor = '#ff3aa0'; x.fillStyle = '#ffd0ea'; x.fillText('BAR & POOL', 128, 80);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshBasicMaterial({ map: t, toneMapped: false });
    const s = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.98), mat);
    s.position.set(d.x + this.inward.x * 1.15, d.y + 3.4, d.z + this.inward.z * 1.15);
    s.rotation.y = d.face;
    g.scene.add(s);
    this.sign = s;
  }

  // ---------- Armado (la primera vez que entrás) ----------
  build() {
    const g = this.game, O = this.origin;
    const D = buildDraw(g, O.x, O.y, O.z);
    this.D = D;
    g.scene.add(D.group);
    D.group.visible = false;
    for (const l of D.lights) l.visible = false;
    const shadow = g.textures.shadow;
    const rng = this.rng;
    this.extras = [];
    const extra = (look, x, z, rot, y = 0) => { const e = new Extra(D.group, look, shadow, x, z, rot, y); this.extras.push(e); return e; };
    // Charly Amado en el escenario: pelo de color, campera de cuero y anteojos (su estilo de show)
    const charly = extra({
      skin: 0xe8b890, hair: 0x8a3ab0, hairStyle: 'long', fat: 0.22, muscle: 0.2, height: 1.0,
      shirt: 0x151515, shirtKind: 'campera', shirtHex: '#151515', longSleeves: true,
      pants: 0x111111, pantsKind: 'jean', shoes: 0x222222, glasses: true,
    }, D.charly.x, D.charly.z, D.charly.rot, D.charly.y);
    charly.model.setHeld(micMesh());
    charly.st.sing = 1;
    this.charly = charly;
    // pie de micrófono enfrente
    // el que atiende la barra
    const barman = extra({ ...randomLook('civil', () => rng.next()), shirt: 0x111111, shirtHex: '#111111', shirtKind: 'polo', longSleeves: false }, D.bar.staff.x, D.bar.staff.z, D.bar.staff.rot);
    this.barman = barman;
    // los de la mesa de cartas (señores grandes)
    for (const [x, z, r] of D.cardSeats) {
      const L = randomLook('civil', () => rng.next());
      L.hair = pick([0xb0b0b0, 0xd8d8d8, 0x8a8a8a]); L.hairStyle = pick(['short', 'bald']); L.fat = 0.4 + rng.next() * 0.4;
      const e = extra(L, x, z, r);
      e.st.sit = true; e.st.cards = true;
    }
    // gente en las mesitas, en la barra y bailando cerca del escenario
    const sitAt = (x, z, r) => { const e = extra(randomLook('civil', () => rng.next()), x, z, r); e.st.sit = true; return e; };
    sitAt(-5.95, 3.0, Math.PI / 2); sitAt(-4.45, 3.0, -Math.PI / 2); sitAt(2.75, 3.0, -Math.PI / 2); sitAt(-2.55, 8.6, Math.PI / 2);
    const st0 = D.stools;
    sitAt(st0[1][0], st0[1][1], -Math.PI / 2).y = 0.3; sitAt(st0[3][0], st0[3][1], -Math.PI / 2).y = 0.3;
    sitAt(st0[6][0], st0[6][1], -Math.PI / 2).y = 0.3; sitAt(st0[9][0], st0[9][1], -Math.PI / 2).y = 0.3;
    for (const [x, z] of [[6.0, 6.2], [6.4, 8.4], [5.4, 7.3]]) {
      const e = extra(randomLook(rng.next() < 0.5 ? 'cheto' : 'civil', () => rng.next()), x, z, Math.PI / 2);
      e.st.dance = true; e.danceOff = rng.next() * 10;
    }
    // mesas de pool con gente jugando (algunas libres)
    this.tables = [];
    const balls = new THREE.InstancedMesh(new THREE.SphereGeometry(R, 10, 8), new THREE.MeshLambertMaterial(), DRAW_TABLES.length * 16);
    balls.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const col = new THREE.Color();
    const playing = [1, 2, 4, 5, 6, 7];
    DRAW_TABLES.forEach((def, ti) => {
      const T = new PoolTable(def, rng);
      T.base = ti * 16;
      for (let i = 0; i < 16; i++) balls.setColorAt(ti * 16 + i, col.setHex(BALL_COLS[i]));
      if (playing.includes(def.n)) {
        for (let k = 0; k < 2; k++) {
          const px = def.x + (k ? 1 : -1) * (DRAW_TABLE.L / 2 + 0.55), pz = def.z + (k ? 0.5 : -0.5);
          const e = extra(randomLook(rng.next() < 0.3 ? 'cheto' : 'civil', () => rng.next()), px, pz, k ? -Math.PI / 2 : Math.PI / 2);
          const cue = cueMesh();
          D.group.add(cue);
          T.players.push({ e, cue, path: null });
        }
      } else if (def.n === 8) {
        // mesa del fondo libre con un taco apoyado
        const cue = cueMesh(); cue.position.set(def.x + 1.3, 0.8, def.z + 0.84); cue.rotation.set(-1.2, 0, 0.1); D.group.add(cue);
        T.leaning = cue;
      }
      this.tables.push(T);
    });
    balls.instanceColor.needsUpdate = true;
    this.balls = balls;
    D.group.add(balls);
    this.updateBalls(true);
    // aro rojo de salida, arriba de la escalera
    const ex = D.exitRing;
    this.exitMarker = new Marker(g, O.x + ex.x, O.z + ex.z, 0xff2a2a, { r: 0.8, h: 1.0, y: O.y });
    this.exitRingMesh = this.makeRing(O.x + ex.x, O.y + 0.03, O.z + ex.z, g.scene);
    this.exitMarker.visible = false; this.exitRingMesh.visible = false;
  }

  // ---------- Entrar y salir ----------
  async enter() {
    const g = this.game, p = g.player;
    if (this.busy) return;
    this.busy = true;
    g.controlsLocked = true;
    p.vx = p.vz = 0;
    await g.hud.fadeTo(true, 0.45);
    if (!this.D) this.build();
    const D = this.D, O = this.origin;
    D.group.visible = true;
    for (const l of D.lights) l.visible = true;
    this.exitMarker.visible = true; this.exitRingMesh.visible = true;
    this.inside = { name: 'Draw Bar & Pool', def: D };
    this.prevFar = g.camera.far;
    g.camera.far = 160; g.camera.updateProjectionMatrix();
    p.pos.set(O.x + D.spawn.x, O.y + 0.02, O.z + D.spawn.z);
    p.vx = p.vz = p.vy = 0; p.onGround = true; p.swimming = false; p.diving = false;
    p.heading = D.spawn.rot;
    g.cameraRig.snapBehind(p.heading);
    g.cameraRig.dist = 3;
    // el compañero entra con vos
    const c = g.companion;
    if (g.companionActive && c && !c.hidden && !c.vehicle && !c.dead && Math.hypot(c.pos.x - this.door.x, c.pos.z - this.door.z) < 30) {
      c.pos.set(O.x + D.spawn.x + 0.9, O.y + 0.02, O.z + D.spawn.z - 0.4); c.vx = c.vz = c.vy = 0; c.onGround = true;
      this.companionIn = true;
    }
    this.exitArmed = false;
    this.startShow();
    g.hud.showZone('Draw Bar & Pool');
    await g.hud.fadeTo(false, 0.5);
    g.controlsLocked = false;
    this.busy = false;
    g.hud.showHelp(`Bienvenido al <b>Draw</b>. ${g.touch && g.touch.enabled ? 'Tocá <b>HABLAR</b>' : 'Apretá <b>G</b>'} en la barra para pedir algo o frente al escenario para pedirle un tema a Charly. Para salir, volvé al aro rojo de la escalera.`, 9);
  }

  async leave() {
    const g = this.game, p = g.player;
    if (this.busy) return;
    this.busy = true;
    g.controlsLocked = true;
    await g.hud.fadeTo(true, 0.45);
    this.restore();
    const d = this.door;
    p.pos.set(d.x - this.inward.x * 1.6, g.world.footGround(d.x - this.inward.x * 1.6, d.z - this.inward.z * 1.6), d.z - this.inward.z * 1.6);
    p.vx = p.vz = p.vy = 0; p.onGround = true;
    p.heading = d.face;
    g.cameraRig.snapBehind(p.heading);
    if (this.companionIn) {
      const c = g.companion;
      if (c && !c.dead) { c.pos.set(p.pos.x + 1, p.pos.y, p.pos.z + 1); c.vx = c.vz = c.vy = 0; }
      this.companionIn = false;
    }
    this.marker.inside = true; // no volver a entrar hasta salir del aro
    await g.hud.fadeTo(false, 0.5);
    g.controlsLocked = false;
    this.busy = false;
  }

  // Volver a la ciudad (al salir, morir o teletransportarse)
  restore() {
    const g = this.game;
    if (!this.inside) return;
    if (this.match) this.endPool();
    this.inside = null;
    const D = this.D;
    D.group.visible = false;
    for (const l of D.lights) l.visible = false;
    this.exitMarker.visible = false; this.exitRingMesh.visible = false;
    g.camera.far = this.prevFar || 1400; g.camera.updateProjectionMatrix();
    this.stopShow();
    g.hud.setPrompt(null);
    this.prompt = null;
    g.zoneT = 0;
  }

  // ---------- Luz de adentro (pisa la del cielo mientras estás en el local) ----------
  applyLight() {
    if (!this.inside) return;
    const g = this.game, env = g.env;
    env.sun.intensity = 0;
    env.hemi.color.setRGB(1, 0.93, 0.84);
    env.hemi.groundColor.setRGB(0.42, 0.36, 0.3);
    env.hemi.intensity = STYLE.luz ? 1.1 : 0.85;
    env.fog.near = 400; env.fog.far = 900;
    if (STYLE.luz) {
      g.scene.environmentIntensity = 0.12;
      g.renderer.toneMappingExposure = 1.05;
      if (g.post && g.post.bloom) g.post.bloom.threshold = 1.15;
    }
  }

  // ---------- Show de Charly ----------
  startShow(style) {
    const a = this.game.audio;
    if (!a || !a.startShow) return;
    a.onShowEnd = () => this.songEnded();
    this.showStyle = style || this.showStyle || pick(['balada', 'rockshow', 'house', 'reggaeton']);
    a.startShow(this.showStyle);
    this.talkT = 0;
    this.announce();
  }

  stopShow() {
    const a = this.game.audio;
    if (a && a.stopShow) a.stopShow();
    this.talkT = 0;
  }

  announce() {
    const g = this.game;
    const title = pick(SHOW_TITLES[this.showStyle] || SHOW_TITLES.balada);
    g.hud.showRadio(`🎤 Charly Amado en vivo — ${title}`);
    g.hud.radio.style.color = '#ff7ad8';
  }

  // Entre tema y tema, Charly le habla a la gente
  songEnded() {
    if (!this.inside) return;
    this.talkT = 5.5;
    this.charly.st.sing = 0; this.charly.st.wave = true;
    this.say(pick(CHARLY_LINES));
  }

  say(text) {
    const g = this.game, p = g.player;
    const c = this.charly, O = this.origin;
    const d = Math.hypot(p.pos.x - (O.x + c.x), p.pos.z - (O.z + c.z));
    if (d < 16) g.hud.subtitle(`<b>Charly:</b> ${text}`, 4.5);
  }

  // ---------- Barra y pedidos ----------
  async barMenu() {
    const g = this.game, p = g.player;
    const opts = BAR.map((b) => `${b.name} — $${b.price}`);
    opts.push('Nada, gracias');
    const r = await g.menus.choice('Barra del Draw', opts, '"¿Qué te sirvo? La pizza sale ya, eh."');
    if (r < 0 || r >= BAR.length) return;
    const b = BAR[r];
    if (g.money < b.price) { g.hud.showToast('No te alcanza la guita.', 2); return; }
    g.money -= b.price;
    p.health = Math.min(p.maxHealth, p.health + b.hp);
    if (p === g.gordopin) g.stats.fat = clamp(g.stats.fat + b.fat, 0, 100);
    g.audio.cash();
    g.activities.updateBody();
    g.hud.showToast(`${b.name.split(' (')[0]}: +${b.hp} de salud`, 2.5);
  }

  async stageMenu() {
    const g = this.game;
    const styles = [['rockshow', 'Un rock'], ['balada', 'Una balada, de las lentas'], ['house', 'Algo para bailar'], ['reggaeton', 'Un reggaetón']];
    const opts = styles.map(([, t]) => `${t} — $10`);
    opts.push('Nada, seguí nomás');
    const r = await g.menus.choice('Pedile un tema a Charly', opts, '"¡Pidan, que yo canto de todo!"');
    if (r < 0 || r >= styles.length) return;
    if (g.money < 10) { g.hud.showToast('No te alcanza para la propina.', 2); return; }
    g.money -= 10; g.audio.cash();
    this.showStyle = styles[r][0];
    this.charly.st.sing = 0; this.charly.st.wave = true;
    this.stopShow();
    this.talkT = 2.5;
    this.say(pick(['¡Me pidieron uno! Ahí va, para el gordito de la camiseta.', '¡Pedido de la casa! Ahí va.', 'Este va dedicado. Vos sabés quién sos.']));
  }

  // ---------- Bucle ----------
  update(dt) {
    const g = this.game, p = g.player;
    const m = this.marker;
    m.update(dt);
    this.ring.rotation.z += dt * 0.6;
    const onMission = g.missions.active && !g.missions.active.allowShops;
    m.visible = !onMission;
    this.ring.visible = !onMission && !this.inside;
    if (!this.inside) {
      const inRing = !p.vehicle && m.contains(p.pos, -0.15) && !p.dead;
      if (inRing && !m.inside && !this.busy && !g.controlsLocked && !g.respawning && !onMission) {
        if (g.police && g.police.level > 0) g.hud.showToast('Con la cana atrás no te dejan pasar. Perdelos primero.', 3);
        else this.enter();
      }
      m.inside = inRing;
      return;
    }
    // ¿se fue del local de otra forma (murió, lo arrestaron, truco)?
    const O = this.origin;
    if (!this.busy && (p.dead || Math.abs(p.pos.y - O.y) > 8 || Math.abs(p.pos.x - O.x) > 40 || Math.abs(p.pos.z - O.z - 16) > 40)) { this.restore(); return; }
    const D = this.D;
    D.update(dt, g.env);
    this.exitMarker.update(dt);
    this.exitRingMesh.rotation.z += dt * 0.6;
    // gente
    const lx = p.pos.x - O.x, lz = p.pos.z - O.z;
    for (const e of this.extras) {
      if (e.danceOff !== undefined) e.st.dance = Math.sin(g.time * 0.3 + e.danceOff) > -0.6;
      e.update(dt);
    }
    // Charly: canta mirando a la gente y se mueve un poco
    const c = this.charly;
    if (this.talkT > 0) {
      this.talkT -= dt;
      if (this.talkT <= 0) { c.st.wave = false; c.st.sing = 1; this.startShow(this.showStyle); this.announce(); }
    }
    const look = clamp(angleWrap(Math.atan2(lx - c.x, lz - c.z) + Math.PI / 2), -0.7, 0.7);
    c.rot = approachAngle(c.rot, -Math.PI / 2 + look, dt * 0.8);
    // volumen del show según la distancia al escenario
    const ds = Math.hypot(lx - c.x, lz - c.z);
    if (g.audio && g.audio.setShowLevel) g.audio.setShowLevel(clamp(1.15 - ds / 30, 0.3, 1));
    // pool
    this.updateTables(dt, lx, lz);
    if (this.match) return;
    // salida
    const ex = D.exitRing;
    const dExit = Math.hypot(lx - ex.x, lz - ex.z);
    if (dExit > 1.6) this.exitArmed = true;
    if (this.exitArmed && dExit < 0.8 && !this.busy && !g.controlsLocked) { this.leave(); return; }
    // pedidos: barra y escenario
    let near = null;
    const free = this.freeTable(lx, lz);
    if (Math.hypot(lx - D.bar.x, lz - D.bar.z) < 1.8) near = 'bar';
    else if (lx > 6.0 && lx < 7.6 && lz > 5 && lz < 9.5) near = 'stage';
    else if (free) near = 'pool';
    if (near !== this.prompt) {
      this.prompt = near;
      const key = g.touch && g.touch.enabled ? 'HABLAR' : 'G';
      g.hud.setPrompt(near === 'bar' ? `<kbd>${key}</kbd> Pedir algo en la barra` : near === 'stage' ? `<kbd>${key}</kbd> Pedirle un tema a Charly` : near === 'pool' ? `<kbd>${key}</kbd> Jugar al pool` : null);
    }
    if (near && g.input.was('action') && !g.menus.choiceEl) {
      g.hud.setPrompt(null); this.prompt = null;
      if (near === 'bar') this.barMenu(); else if (near === 'stage') this.stageMenu(); else this.poolMenu(free);
    }
  }

  // ---------- Pool: minijuego ----------
  // Mesa libre (sin nadie jugando) al lado del jugador
  freeTable(lx, lz) {
    for (const T of this.tables) {
      if (T.players.length || T.match) continue;
      const d = T.def;
      if (Math.abs(lx - d.x) < DRAW_TABLE.L / 2 + 0.9 && Math.abs(lz - d.z) < DRAW_TABLE.W / 2 + 0.9) return T;
    }
    return null;
  }

  async poolMenu(T) {
    const g = this.game;
    const rival = pick(['el Tano', 'Rulo', 'Don Cacho', 'la Colo', 'el Turco', 'Pocho']);
    const bets = [50, 20, 0];
    const opts = [`Por $50 (paga doble)`, `Por $20 (paga doble)`, 'Por diversión, sin plata', 'Ahora no'];
    const r = await g.menus.choice(`Bola 8 contra ${rival}`, opts, `"¿Un pool? Dale, armo las bolas. Rompés vos."`);
    if (r < 0 || r >= bets.length) return;
    const bet = bets[r];
    if (g.money < bet) { g.hud.showToast('No te alcanza para esa apuesta.', 2.5); return; }
    this.startPool(T, rival, bet);
  }

  async startPool(T, rival, bet) {
    const g = this.game, p = g.player, D = this.D, O = this.origin, def = T.def;
    g.controlsLocked = true;
    await g.hud.fadeTo(true, 0.3);
    if (!this.inside) { g.controlsLocked = false; return; }
    if (bet) { g.money -= bet; g.audio.cash(); }
    if (T.leaning) T.leaning.visible = false;
    // vos (un "doble" animado con tu misma pinta; el personaje queda quieto al lado de la mesa)
    const me = new Extra(D.group, p.look, g.textures.shadow, def.x - DRAW_TABLE.L / 2 - 0.6, def.z, Math.PI / 2);
    const myCue = cueMesh(); D.group.add(myCue);
    const opp = new Extra(D.group, randomLook(this.rng.next() < 0.4 ? 'cheto' : 'civil', () => this.rng.next()), g.textures.shadow, def.x + DRAW_TABLE.L / 2 + 0.75, def.z + 0.95, -Math.PI / 2);
    const oppCue = cueMesh(); D.group.add(oppCue);
    p.vx = p.vz = 0;
    p.pos.set(O.x + def.x - DRAW_TABLE.L / 2 - 0.6, O.y + 0.02, O.z + def.z);
    p.model.root.visible = false;
    this.poolHidden = p;
    this.match = new PoolMatch(this, T, { bet, oppName: rival, me: { e: me, cue: myCue, path: null }, opp: { e: opp, cue: oppCue, path: null }, skill: 0.45 + this.rng.next() * 0.4 });
    T.match = this.match;
    g.cameraRig.custom = (dt) => this.match && this.match.camera(dt);
    g.hud.setPrompt(null); this.prompt = null;
    g.hud.hideHelp();
    await g.hud.fadeTo(false, 0.3);
  }

  endPool() {
    const g = this.game, M = this.match;
    if (!M) return;
    const T = M.T;
    M.dispose();
    for (const pl of [M.me, M.opp]) { pl.e.root.removeFromParent(); pl.cue.removeFromParent(); }
    T.match = null; T.track = false;
    if (T.leaning) T.leaning.visible = true;
    T.rack();
    this.match = null;
    const p = this.poolHidden;
    if (p) { p.model.root.visible = true; p.heading = Math.PI / 2; this.poolHidden = null; }
    g.cameraRig.custom = null;
    g.cameraRig.snapBehind(Math.PI / 2);
    g.controlsLocked = false;
    if (M.result === 0) g.stats.poolWins = (g.stats.poolWins || 0) + 1;
  }

  updateTables(dt, plx, plz) {
    for (const T of this.tables) {
      T.step(dt);
      if (T.match) { T.match.update(dt); continue; }
      if (!T.players.length) continue;
      this.updatePlayers(T, dt);
    }
    this.updateBalls();
  }

  // Los dos de cada mesa: uno tira, el otro espera con el taco parado
  updatePlayers(T, dt) {
    const def = T.def;
    const sh = T.players[T.shooter], wt = T.players[1 - T.shooter];
    const ex = DRAW_TABLE.L / 2 + 0.5, ez = DRAW_TABLE.W / 2 + 0.5;
    // el que espera: parado al costado, mirando la mesa
    this.walkTo(wt, wt.home || (wt.home = { x: def.x + (T.shooter ? -1 : 1) * (ex + 0.3), z: def.z + 0.9 }), dt, def);
    if (!wt.path) { wt.e.rot = approachAngle(wt.e.rot, Math.atan2(def.x - wt.e.x, def.z - wt.e.z), dt * 3); }
    wt.e.st.cue = 0; wt.e.st.holdCue = 1;
    this.cueUpright(wt);
    T.t -= dt;
    const e = sh.e;
    if (T.state === 'think') {
      e.st.cue = Math.max(0, (e.st.cue || 0) - dt * 2); e.st.holdCue = 1;
      this.cueUpright(sh);
      if (T.t <= 0) {
        if (T.left() <= 3) { T.rack(); T.t = 2; return; }
        const plan = T.planShot();
        if (!plan) { T.rack(); T.t = 2; return; }
        T.plan = plan;
        const cb = T.balls[0];
        // pararse atrás de la blanca, afuera de la mesa
        const back = plan.e + 0.42;
        let sx = cb.x - plan.dx * back, sz = cb.z - plan.dz * back;
        sx = clamp(sx, -ex, ex); sz = clamp(sz, -ez, ez);
        if (Math.abs(sx) < ex - 0.05 && Math.abs(sz) < ez - 0.05) { if (ex - Math.abs(sx) < ez - Math.abs(sz)) sx = Math.sign(sx || 1) * ex; else sz = Math.sign(sz || 1) * ez; }
        sh.target = { x: def.x + sx, z: def.z + sz };
        T.state = 'walk';
      }
    } else if (T.state === 'walk') {
      this.walkTo(sh, sh.target, dt, def);
      this.cueUpright(sh);
      if (!sh.path) { T.state = 'aim'; T.t = 1.4 + T.rng.next() * 1.4; T.pull = 0; }
    } else if (T.state === 'aim' || T.state === 'stroke') {
      const P = T.plan, cb = T.balls[0];
      e.rot = approachAngle(e.rot, Math.atan2(P.dx, P.dz), dt * 6);
      e.st.cue = Math.min(1, (e.st.cue || 0) + dt * 3); e.st.holdCue = 0;
      let pull;
      if (T.state === 'aim') {
        pull = 0.06 + Math.sin(T.t * 7) * 0.05;
        if (T.t <= 0) { T.state = 'stroke'; T.t = 0.45; }
      } else {
        const k = 1 - T.t / 0.45;
        pull = k < 0.7 ? 0.06 + (k / 0.7) * 0.2 : 0.26 - ((k - 0.7) / 0.3) * 0.27;
        if (T.t <= 0) {
          const sp = 1.6 + T.rng.next() * 2.2;
          cb.vx = P.dx * sp; cb.vz = P.dz * sp;
          T.state = 'watch'; T.t = 7;
          pull = -0.01;
        }
      }
      e.st.stroke = clamp(pull / 0.26, 0, 1);
      // el taco sobre la línea de tiro
      const cue = sh.cue;
      cue.visible = true;
      cue.position.set(def.x + cb.x - P.dx * (R + pull), DRAW_TABLE.h - 0.02 + R, def.z + cb.z - P.dz * (R + pull));
      cue.rotation.set(0, Math.atan2(P.dx, P.dz), 0);
      cue.rotateX(0.09);
    } else if (T.state === 'watch') {
      e.st.cue = Math.max(0, (e.st.cue || 0) - dt * 1.2);
      if (e.st.cue < 0.5) this.cueUpright(sh);
      if (!T.moving() || T.t <= 0) {
        for (const b of T.balls) b.vx = b.vz = 0;
        T.state = 'think'; T.t = 1 + T.rng.next() * 2.5;
        if (T.rng.next() < 0.45) { T.shooter = 1 - T.shooter; sh.home = null; }
      }
    }
  }

  cueUpright(pl) {
    const e = pl.e, cue = pl.cue;
    const rx = -Math.cos(e.rot), rz = Math.sin(e.rot);
    cue.position.set(e.x + rx * 0.28 + Math.sin(e.rot) * 0.12, e.y + 1.5, e.z + rz * 0.28 + Math.cos(e.rot) * 0.12);
    cue.rotation.set(-Math.PI / 2 + 0.08, e.rot, 0, 'YXZ');
  }

  // Caminar alrededor de la mesa (por el borde, sin atravesarla)
  walkTo(pl, target, dt, def) {
    const e = pl.e;
    const ex = DRAW_TABLE.L / 2 + 0.5, ez = DRAW_TABLE.W / 2 + 0.5;
    const lx = e.x - def.x, lz = e.z - def.z, tx = target.x - def.x, tz = target.z - def.z;
    const d = Math.hypot(tx - lx, tz - lz);
    if (d < 0.05) { pl.path = null; e.st.speed = 0; return; }
    pl.path = true;
    // si la línea recta cruza la mesa, ir primero a la esquina más conveniente
    let gx = tx, gz = tz;
    const crosses = (ax, az, bx, bz) => {
      for (let s = 0.1; s < 1; s += 0.1) { const x = ax + (bx - ax) * s, z = az + (bz - az) * s; if (Math.abs(x) < ex - 0.1 && Math.abs(z) < ez - 0.1) return true; }
      return false;
    };
    if (crosses(lx, lz, tx, tz)) {
      let best = null, bs = Infinity;
      for (const [cx, cz] of [[-ex, -ez], [ex, -ez], [-ex, ez], [ex, ez]]) {
        // (la esquina donde ya está no sirve: si desde ahí el destino sigue tapado, se quedaba clavado)
        if (Math.hypot(cx - lx, cz - lz) < 0.05 || crosses(lx, lz, cx, cz)) continue;
        const s = Math.hypot(cx - lx, cz - lz) + Math.hypot(tx - cx, tz - cz) + (crosses(cx, cz, tx, tz) ? 10 : 0);
        if (s < bs) { bs = s; best = [cx, cz]; }
      }
      if (best) { gx = best[0]; gz = best[1]; }
    }
    const gd = Math.hypot(gx - lx, gz - lz) || 1;
    const sp = 1.15;
    const step = Math.min(gd, sp * dt);
    e.x += ((gx - lx) / gd) * step; e.z += ((gz - lz) / gd) * step;
    e.rot = approachAngle(e.rot, Math.atan2(gx - lx, gz - lz), dt * 8);
    e.st.speed = sp;
  }

  updateBalls(force) {
    const mesh = this.balls, mtx = this.mtx || (this.mtx = new THREE.Matrix4());
    const y = DRAW_TABLE.h - 0.04 + R;
    let dirty = !!force;
    for (const T of this.tables) {
      if (!force && !T.moving() && T.drawn) continue;
      T.drawn = true; dirty = true;
      for (const b of T.balls) {
        if (b.on) mtx.makeTranslation(T.def.x + b.x, y, T.def.z + b.z);
        else mtx.makeScale(0, 0, 0);
        mesh.setMatrixAt(T.base + b.i, mtx);
      }
    }
    if (dirty) mesh.instanceMatrix.needsUpdate = true;
  }
}
