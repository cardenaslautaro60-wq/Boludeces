// Minijuego de pool en el Draw: bola 8 contra un parroquiano, en una de las mesas libres.
// Apuntás con el mouse (o A/D), mantenés clic o Espacio para cargar la fuerza y soltás para tirar.
// Reglas simplificadas: la primera bola que metés define si sos lisas o rayadas, seguís tirando
// mientras metas de las tuyas sin falta, y gana el que mete la 8 después de limpiar su grupo.
// Meter la 8 antes de tiempo (o con la blanca) es perder.
import * as THREE from 'three';
import { DRAW_TABLE } from '../world/interior-draw.js';
import { clamp, pick, approachAngle } from '../util.js';

const R = 0.0285;
const SURF = DRAW_TABLE.h - 0.04;
const RIVALES = ['el Tano', 'Rulo', 'Don Cacho', 'la Colo', 'el Turco', 'Pocho'];
const GROUP_NAME = { lisas: 'lisas (1-7)', rayadas: 'rayadas (9-15)' };
const groupOf = (i) => (i >= 1 && i <= 7 ? 'lisas' : i >= 9 ? 'rayadas' : null);

export class PoolMatch {
  constructor(ints, T, opts) {
    this.ints = ints;
    this.game = ints.game;
    this.T = T;
    this.def = T.def;
    this.bet = opts.bet || 0;
    this.me = opts.me; // { e, cue, path }
    this.opp = opts.opp;
    this.oppName = opts.oppName || pick(RIVALES);
    this.group = [null, null]; // [vos, rival]
    this.turn = 0; // 0 vos, 1 rival
    this.state = 'aim';
    this.aim = 0; // ángulo de tiro (0 = +z)
    this.power = 0; this.charging = false; this.chargeT = 0;
    this.view = 0; // 0 detrás del taco, 1 de arriba
    this.t = 0;
    this.skill = clamp(opts.skill || 0.6, 0, 1);
    this.camPos = new THREE.Vector3(); this.camLook = new THREE.Vector3();
    this.camInit = false;
    T.rack();
    T.balls[0].x = -T.hx / 2;
    this.aimAtRack();
    this.buildGuide();
    this.buildHud();
    this.say(`${this.oppName}: "${pick(['Dale, rompé vos.', 'Rompé, que yo no tengo apuro.', 'A ver qué sabés hacer, gordo.'])}"`);
  }

  // ---------- Línea de ayuda para apuntar ----------
  buildGuide() {
    const D = this.ints.D;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(12), 3));
    this.guide = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75, toneMapped: false }));
    this.guide.frustumCulled = false;
    this.ghost = new THREE.Mesh(new THREE.RingGeometry(R * 0.85, R, 20), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, side: THREE.DoubleSide, toneMapped: false }));
    this.ghost.rotation.x = -Math.PI / 2;
    D.group.add(this.guide, this.ghost);
  }

  updateGuide(show) {
    this.guide.visible = this.ghost.visible = show;
    if (!show) return;
    const T = this.T, c = T.balls[0], dx = Math.sin(this.aim), dz = Math.cos(this.aim);
    const hit = this.cast(c.x, c.z, dx, dz);
    const a = this.guide.geometry.attributes.position.array;
    const ox = this.def.x, oz = this.def.z, y = SURF + R;
    const ex = c.x + dx * hit.t, ez = c.z + dz * hit.t;
    a.set([ox + c.x, y, oz + c.z, ox + ex, y, oz + ez]);
    if (hit.ball) {
      const b = hit.ball;
      let nx = b.x - ex, nz = b.z - ez; const n = Math.hypot(nx, nz) || 1; nx /= n; nz /= n;
      a.set([ox + b.x, y, oz + b.z, ox + b.x + nx * 0.4, y, oz + b.z + nz * 0.4], 6);
      this.ghost.visible = true;
      this.ghost.position.set(ox + ex, y - R * 0.9, oz + ez);
    } else {
      // rebote en la banda
      const rx = hit.axis === 'x' ? -dx : dx, rz = hit.axis === 'z' ? -dz : dz;
      a.set([ox + ex, y, oz + ez, ox + ex + rx * 0.3, y, oz + ez + rz * 0.3], 6);
      this.ghost.visible = false;
    }
    this.guide.geometry.attributes.position.needsUpdate = true;
  }

  // Desde (x,z) en dirección (dx,dz): primera bola o banda que toca la blanca
  cast(x, z, dx, dz) {
    const T = this.T;
    let best = { t: Infinity, ball: null, axis: null };
    for (const b of T.balls) {
      if (!b.on || b.i === 0) continue;
      const fx = x - b.x, fz = z - b.z;
      const bq = fx * dx + fz * dz, cq = fx * fx + fz * fz - 4 * R * R;
      const disc = bq * bq - cq;
      if (disc < 0) continue;
      const t = -bq - Math.sqrt(disc);
      if (t > 0 && t < best.t) best = { t, ball: b, axis: null };
    }
    const lx = T.hx - R, lz = T.hz - R;
    const tx = dx > 1e-6 ? (lx - x) / dx : dx < -1e-6 ? (-lx - x) / dx : Infinity;
    const tz = dz > 1e-6 ? (lz - z) / dz : dz < -1e-6 ? (-lz - z) / dz : Infinity;
    const tr = Math.min(tx, tz);
    if (tr < best.t) best = { t: Math.max(0, tr), ball: null, axis: tx < tz ? 'x' : 'z' };
    return best;
  }

  // ---------- HUD ----------
  buildHud() {
    const el = document.createElement('div');
    el.className = 'pool-hud';
    el.innerHTML = '<div class="pool-score"></div><div class="pool-power"><i></i></div><div class="pool-keys"></div>';
    document.body.appendChild(el);
    this.hud = el;
    const touch = this.game.touch && this.game.touch.enabled;
    el.querySelector('.pool-keys').innerHTML = touch
      ? 'Joystick: apuntar · <b>CORRER</b>: cargar y soltar para tirar'
      : '<kbd>Mouse</kbd>/<kbd>A D</kbd> apuntar (<kbd>Shift</kbd> fino) · mantené <kbd>Clic</kbd>/<kbd>Espacio</kbd> y soltá para tirar · <kbd>V</kbd> vista · <kbd>F</kbd> abandonar';
    this.refreshHud();
  }

  refreshHud() {
    const T = this.T;
    const left = (gr) => (gr ? T.balls.filter((b) => b.on && groupOf(b.i) === gr).length : null);
    const side = (k, who) => {
      const gr = this.group[k];
      const txt = gr ? `${GROUP_NAME[gr]} · quedan ${left(gr)}` : 'mesa abierta';
      return `<span class="${this.turn === k ? 'on' : ''}">${who}: ${txt}</span>`;
    };
    this.hud.querySelector('.pool-score').innerHTML = `${side(0, 'Vos')}${side(1, this.oppName)}${this.bet ? `<span class="bet">$${this.bet}</span>` : ''}`;
  }

  say(text, d = 3.5) { this.game.hud.subtitle(text, d); }

  // ---------- Bucle ----------
  update(dt) {
    const g = this.game, T = this.T, input = g.input;
    const look = input.consumeLook();
    this.t -= dt;
    // los dos jugadores: el que no tira espera con el taco parado
    const shooter = this.turn === 0 ? this.me : this.opp, waiter = this.turn === 0 ? this.opp : this.me;
    this.wait(waiter, dt);
    if (input.was('enter') && !g.menus.choiceEl && this.state !== 'over') { this.quit(); return; }
    if (input.was('camera')) this.view = 1 - this.view;
    if (this.state === 'aim') {
      if (this.turn === 0) this.playerAim(dt, input, look);
      else this.aiAim(dt);
      this.pose(shooter, dt, this.state === 'aim' ? 0.06 + (this.charging ? this.power * 0.22 : Math.sin(g.time * 3) * 0.02) : 0);
    } else if (this.state === 'stroke') {
      const k = 1 - this.t / 0.16;
      this.pose(shooter, dt, (this.strokeFrom || 0.1) * (1 - k) - 0.01);
      if (this.t <= 0) this.shoot();
    } else if (this.state === 'roll') {
      this.relax(shooter, dt);
      if (!T.moving() && T.balls[0].on) this.judge();
    } else if (this.state === 'walk') {
      this.relax(shooter, dt);
      // el rival va hasta atrás de la blanca
      this.ints.walkTo(this.opp, this.opp.target, dt, this.def);
      this.ints.cueUpright(this.opp);
      if (!this.opp.path) { this.state = 'aim'; this.t = 1.2 + Math.random() * 1.2; }
    } else if (this.state === 'over') {
      this.relax(shooter, dt);
      if (this.t <= 0) this.ints.endPool();
    }
    this.updateGuide(this.state === 'aim' && this.turn === 0);
    const pw = this.hud.querySelector('.pool-power');
    pw.style.opacity = this.turn === 0 && this.state === 'aim' ? 1 : 0.25;
    pw.querySelector('i').style.width = Math.round(this.power * 100) + '%';
  }

  playerAim(dt, input, look) {
    const ax = input.axis().x;
    const fine = input.is('jump') ? 0.25 : 1;
    this.aim -= look.x * 0.55 * fine;
    this.aim -= ax * dt * 0.9 * fine;
    const want = input.is('fire') || input.is('sprint');
    if (want) {
      this.charging = true;
      this.chargeT += dt;
      // la fuerza sube y baja mientras mantenés (como en los juegos de pool de siempre)
      this.power = 0.5 - 0.5 * Math.cos(this.chargeT * 2.4);
    } else if (this.charging) {
      this.charging = false; this.chargeT = 0;
      if (this.power > 0.03) { this.speed = 0.35 + this.power * 4.9; this.startStroke(); }
      else this.power = 0;
    }
    // el que tira se para atrás de la blanca, girando alrededor de la mesa con la puntería
    const st = this.stance(this.aim);
    const e = this.me.e;
    e.x += (this.def.x + st.x - e.x) * Math.min(1, dt * 10);
    e.z += (this.def.z + st.z - e.z) * Math.min(1, dt * 10);
  }

  startStroke() {
    this.state = 'stroke'; this.t = 0.16;
    this.strokeFrom = 0.06 + this.power * 0.22;
  }

  shoot() {
    const T = this.T, c = T.balls[0];
    const dx = Math.sin(this.aim), dz = Math.cos(this.aim);
    c.vx = dx * this.speed; c.vz = dz * this.speed;
    T.before = T.balls.map((b) => b.on);
    T.firstHit = null; T.scratched = false; T.track = true;
    this.state = 'roll';
    this.power = 0;
    this.game.audio.thud && this.game.audio.thud(null, 0.15);
  }

  // ---------- Árbitro ----------
  judge() {
    const T = this.T, k = this.turn, mine = this.group[k];
    T.track = false;
    const potted = T.balls.filter((b) => b.i !== 0 && T.before[b.i] && !b.on).map((b) => b.i);
    const scratch = T.scratched;
    const left = (gr) => T.balls.filter((b) => b.on && groupOf(b.i) === gr).length;
    const who = k === 0 ? 'Vos' : this.oppName;
    const leftBefore = mine ? T.balls.filter((b) => groupOf(b.i) === mine && T.before[b.i]).length : -1;
    // la 8: gana si ya había limpiado su grupo y la blanca no entró
    if (potted.includes(8)) {
      const ok = leftBefore === 0 && !scratch && T.firstHit === 8;
      this.finish(ok ? k : 1 - k, ok ? `${who === 'Vos' ? 'Metiste' : 'Metió'} la 8.` : scratch ? 'La 8 entró con la blanca adentro.' : 'La 8 entró antes de tiempo.');
      return;
    }
    let foul = scratch || T.firstHit === null;
    if (!foul && mine) foul = leftBefore === 0 ? T.firstHit !== 8 : groupOf(T.firstHit) !== mine;
    if (!foul && !mine && T.firstHit === 8) foul = true;
    // mesa abierta: la primera que entra define los grupos
    if (!mine && !foul && potted.length) {
      const gr = groupOf(potted[0]);
      this.group[k] = gr; this.group[1 - k] = gr === 'lisas' ? 'rayadas' : 'lisas';
      this.say(`${who === 'Vos' ? 'Sos' : this.oppName + ' es'} ${GROUP_NAME[gr]}.`, 3);
    }
    const g2 = this.group[k];
    const goodPot = !foul && potted.some((i) => !g2 || groupOf(i) === g2);
    if (foul) {
      const why = scratch ? 'la blanca a la tronera' : T.firstHit === null ? 'no tocó ninguna' : 'tocó primero una que no era';
      this.say(k === 0 ? `Falta (${why.replace('tocó', 'tocaste')}). Le toca a ${this.oppName}.` : `${this.oppName} hizo falta (${why}). Te toca.`, 3);
    }
    if (!goodPot) this.turn = 1 - this.turn;
    this.refreshHud();
    this.nextTurn();
  }

  nextTurn() {
    this.me.home = this.opp.home = null;
    if (this.turn === 0) {
      this.state = 'aim';
      this.aimAtBest();
      return;
    }
    // el rival elige tiro y camina hasta la blanca
    const plan = this.aiPlan();
    this.plan = plan;
    this.aim = plan.ang;
    const st = this.stance(plan.ang);
    this.opp.target = { x: this.def.x + st.x, z: this.def.z + st.z };
    this.state = 'walk';
  }

  finish(winner, why) {
    const g = this.game;
    this.state = 'over'; this.t = 4.5;
    this.updateGuide(false);
    if (winner === 0) {
      g.hud.bigText('¡GANASTE!', this.bet ? `${why} Te llevás $${this.bet * 2}.` : why, 4, '');
      if (this.bet) { g.money += this.bet * 2; g.audio.cash(); }
      this.say(`${this.oppName}: "${pick(['Tuviste suerte, nada más.', 'La próxima no te la llevás.', 'Bien jugado, gordo. Bien jugado.'])}"`, 4);
    } else {
      g.hud.bigText('PERDISTE', this.bet ? `${why} Perdiste $${this.bet}.` : why, 4, 'red');
      this.say(`${this.oppName}: "${pick(['Andá a practicar a la Rada.', 'Gracias por la cerveza, eh.', 'Otra vez será.'])}"`, 4);
    }
    this.result = winner;
  }

  quit() {
    const g = this.game;
    if (this.bet) g.hud.showToast(`Abandonaste: perdiste los $${this.bet}.`, 3);
    this.result = 1;
    this.ints.endPool();
  }

  // ---------- Rival ----------
  aiAim(dt) {
    const P = this.plan;
    this.aim = approachAngle(this.aim, P.ang, dt * 3);
    if (this.t <= 0) { this.aim = P.ang; this.speed = P.speed; this.power = clamp(P.speed / 5, 0.1, 1); this.startStroke(); }
  }

  legal(k) {
    const T = this.T, gr = this.group[k];
    const on = T.balls.filter((b) => b.on && b.i !== 0);
    if (!gr) return on.filter((b) => b.i !== 8);
    const mine = on.filter((b) => groupOf(b.i) === gr);
    return mine.length ? mine : on.filter((b) => b.i === 8);
  }

  blocked(ax, az, bx, bz, skip) {
    for (const o of this.T.balls) {
      if (!o.on || skip.includes(o.i)) continue;
      const vx = bx - ax, vz = bz - az, l2 = vx * vx + vz * vz || 1;
      const s = clamp(((o.x - ax) * vx + (o.z - az) * vz) / l2, 0, 1);
      if (Math.hypot(ax + vx * s - o.x, az + vz * s - o.z) < 2 * R * 0.98) return true;
    }
    return false;
  }

  // El mejor tiro: bola propia hacia la tronera con el corte más derecho y libre
  aiPlan(k = 1) {
    const T = this.T, c = T.balls[0];
    let best = null;
    for (const b of this.legal(k)) {
      for (const [px, pz] of T.pockets) {
        let ux = px - b.x, uz = pz - b.z; const dp = Math.hypot(ux, uz) || 1; ux /= dp; uz /= dp;
        const gx = b.x - ux * 2 * R, gz = b.z - uz * 2 * R;
        let ax = gx - c.x, az = gz - c.z; const da = Math.hypot(ax, az) || 1; ax /= da; az /= da;
        const cut = ax * ux + az * uz;
        if (cut < 0.3) continue;
        const bl = (this.blocked(c.x, c.z, gx, gz, [0, b.i]) ? 1 : 0) + (this.blocked(b.x, b.z, px, pz, [0, b.i]) ? 1 : 0);
        const score = cut * 2 - (da + dp) * 0.35 - bl * 2;
        if (!best || score > best.score) {
          const need = Math.sqrt(2 * 0.45 * dp) + 0.35;
          const speed = clamp(need / Math.max(cut * 0.96, 0.35) + Math.sqrt(2 * 0.45 * da) * 0.8, 0.9, 4.6);
          best = { score, ang: Math.atan2(ax, az), speed };
        }
      }
    }
    if (!best) {
      // nada limpio: pegarle de lleno a la más cercana de las suyas
      const opts = this.legal(k);
      const b = opts.sort((p, q) => Math.hypot(p.x - c.x, p.z - c.z) - Math.hypot(q.x - c.x, q.z - c.z))[0];
      best = { ang: b ? Math.atan2(b.x - c.x, b.z - c.z) : 0, speed: 2.2, score: -9 };
    }
    // apertura: romper fuerte
    if (T.balls.every((b) => b.on) && Math.abs(c.x + T.hx / 2) < 0.01) best.speed = 4.8;
    const err = (1 - this.skill) * 0.05 + 0.006;
    best.ang += (Math.random() + Math.random() - 1) * err;
    return best;
  }

  // Al empezar tu turno el taco apunta a un tiro razonable (como en los juegos de pool)
  aimAtBest() {
    const p = this.aiPlan(0);
    this.aim = p.ang;
  }

  aimAtRack() { this.aim = Math.PI / 2; }

  // ---------- Posturas ----------
  // Dónde pararse para tirar en la dirección ang: atrás de la blanca, afuera de la mesa
  stance(ang) {
    const T = this.T, c = T.balls[0];
    const dx = Math.sin(ang), dz = Math.cos(ang);
    const ex0 = DRAW_TABLE.L / 2 + 0.5, ez0 = DRAW_TABLE.W / 2 + 0.5;
    const ex = dx < -1e-4 ? (T.hx + 0.16 - c.x) / -dx : dx > 1e-4 ? (c.x + T.hx + 0.16) / dx : Infinity;
    const ez = dz < -1e-4 ? (T.hz + 0.16 - c.z) / -dz : dz > 1e-4 ? (c.z + T.hz + 0.16) / dz : Infinity;
    const back = Math.min(ex, ez) + 0.42;
    let sx = c.x - dx * back, sz = c.z - dz * back;
    sx = clamp(sx, -ex0, ex0); sz = clamp(sz, -ez0, ez0);
    if (Math.abs(sx) < ex0 - 0.05 && Math.abs(sz) < ez0 - 0.05) { if (ex0 - Math.abs(sx) < ez0 - Math.abs(sz)) sx = Math.sign(sx || 1) * ex0; else sz = Math.sign(sz || 1) * ez0; }
    return { x: sx, z: sz };
  }

  pose(pl, dt, pull) {
    const e = pl.e, c = this.T.balls[0];
    const dx = Math.sin(this.aim), dz = Math.cos(this.aim);
    e.rot = approachAngle(e.rot, this.aim, dt * 10);
    e.st.cue = Math.min(1, (e.st.cue || 0) + dt * 3); e.st.holdCue = 0; e.st.speed = 0;
    e.st.stroke = clamp(pull / 0.26, 0, 1);
    const cue = pl.cue;
    cue.position.set(this.def.x + c.x - dx * (R + pull), SURF + R * 2 + 0.002, this.def.z + c.z - dz * (R + pull));
    cue.rotation.set(0, this.aim, 0);
    cue.rotateX(0.09);
  }

  relax(pl, dt) {
    const e = pl.e;
    e.st.cue = Math.max(0, (e.st.cue || 0) - dt * 1.5);
    if (e.st.cue < 0.5) { e.st.holdCue = 1; this.ints.cueUpright(pl); }
  }

  wait(pl, dt) {
    const e = pl.e, def = this.def;
    if (!pl.home) {
      // al costado de la mesa, del lado contrario al que tira
      const s = this.stance(this.aim);
      pl.home = { x: def.x + (s.x > 0 ? -1 : 1) * (DRAW_TABLE.L / 2 + 0.75), z: def.z + 0.95 };
    }
    this.ints.walkTo(pl, pl.home, dt, def);
    if (!pl.path) e.rot = approachAngle(e.rot, Math.atan2(def.x - e.x, def.z - e.z), dt * 3);
    e.st.cue = 0; e.st.holdCue = 1; e.st.stroke = 0;
    this.ints.cueUpright(pl);
  }

  // ---------- Cámara ----------
  camera(dt) {
    const g = this.game, cam = g.camera, O = this.ints.origin, T = this.T, c = T.balls[0];
    const bx = O.x + this.def.x + c.x, bz = O.z + this.def.z + c.z, y = O.y + SURF;
    const dx = Math.sin(this.aim), dz = Math.cos(this.aim);
    const behind = this.turn === 0 && (this.state === 'aim' || this.state === 'stroke') && this.view === 0;
    if (behind) {
      this.camPos.set(bx - dx * 1.05, y + 0.42, bz - dz * 1.05);
      this.camLook.set(bx + dx * 0.9, y, bz + dz * 0.9);
    } else {
      // de arriba, un poco inclinada, a lo largo de la mesa
      const cx = O.x + this.def.x, cz = O.z + this.def.z;
      this.camPos.set(cx, y + 1.55, cz - 2.25);
      this.camLook.set(cx, y - 0.1, cz + 0.1);
    }
    const k = this.camInit ? 1 - Math.exp(-(behind ? 14 : 4) * dt) : 1;
    this.camInit = true;
    cam.position.lerp(this.camPos, k);
    if (!this.lookCur) this.lookCur = this.camLook.clone();
    this.lookCur.lerp(this.camLook, k);
    cam.lookAt(this.lookCur);
    cam.fov += (55 - cam.fov) * Math.min(1, dt * 6);
    cam.updateProjectionMatrix();
  }

  dispose() {
    this.guide.removeFromParent(); this.ghost.removeFromParent();
    this.guide.geometry.dispose();
    this.hud.remove();
  }
}
