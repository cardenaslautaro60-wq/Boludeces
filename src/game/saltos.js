import * as THREE from 'three';
import { dist } from '../util.js';

// Saltos únicos, como los de Vice City: hay que agarrar la rampa rápido y caer lejos. Durante
// el vuelo la cámara se corta a un costado, el tiempo va más lento y al aterrizar se paga.
const G = 22;          // gravedad de los autos (vehicle.js)
const V_REF = 27;      // velocidad de referencia (~97 km/h)
const V_MIN = 19.5;    // menos de ~70 km/h no cuenta como salto único

const NOMBRES = { madera: 'rampa de madera', tierra: 'rampa de tierra', chapa: 'rampa de chapa' };

export class Saltos {
  constructor(game) {
    this.game = game;
    this.jump = null;
    this.hinted = false;
    this.ramps = game.terrain.ramps.map((r, i) => this.prepare(r, i));
    // marcador en el mapa: una "S" en cada rampa, que se apaga cuando ya se hizo el salto
    for (const R of this.ramps) {
      R.blip = { x: R.r.x, z: R.r.z, letter: 'S', bg: '#e8b423', fg: '#000', name: 'Salto único', legend: true, salto: true };
      game.blips.push(R.blip);
    }
  }

  get done() { return this.game.activities.jumpsDone; }

  // Punta de la rampa, alcance a velocidad de referencia y alcance mínimo para que cuente
  prepare(r, i) {
    const ex = r.x + r.fx * r.len / 2, ez = r.z + r.fz * r.len / 2;
    const top = r.base + r.h;
    const ref = this.simulate(r, ex, ez, top, V_REF);
    const min = this.simulate(r, ex, ez, top, V_MIN);
    return { i, r, ex, ez, top, land: ref, minD: min.d * 0.9 };
  }

  // Tiro oblicuo desde la punta de la rampa hasta tocar el piso (misma física que vehicle.js)
  simulate(r, ex, ez, top, S) {
    const T = this.game.terrain;
    let x = ex, z = ez, y = top, vy = Math.min(14, S * r.h / r.len), t = 0, apex = top;
    const dt = 1 / 60;
    while (t < 8) {
      x += r.fx * S * dt; z += r.fz * S * dt;
      vy -= G * dt; y += vy * dt; t += dt;
      apex = Math.max(apex, y);
      if (y <= T.groundAt(x, z)) break;
    }
    return { x, z, t, d: Math.hypot(x - ex, z - ez), apex };
  }

  update(dt) {
    const g = this.game;
    const p = g.player;
    // el marcador se apaga cuando ya se hizo ese salto (también al cargar una partida)
    for (const R of this.ramps) R.blip.hidden = this.done.has(R.i);
    const v = p.vehicle;
    if (!v || v.driver !== p) { if (this.jump) this.finish(null); return; }
    if (!this.jump) {
      if (!v.grounded && !v.sinking) this.takeoff(v);
      else this.hint(v);
      return;
    }
    const j = this.jump;
    if (j.v !== v) { this.finish(null); return; }
    j.t += dt;
    j.maxY = Math.max(j.maxY, v.pos.y);
    j.maxH = Math.max(j.maxH, v.pos.y - g.terrain.groundAt(v.pos.x, v.pos.z));
    if (j.ramp && j.unique && j.t > 0.18) g.timeScale = 0.4;
    if (v.grounded || v.sinking || v.dead || j.t > 7) this.finish(v);
  }

  // Aviso único la primera vez que se pasa cerca de una rampa
  hint(v) {
    if (this.hinted) return;
    this.hintT = (this.hintT || 0) - 1;
    if (this.hintT > 0) return;
    this.hintT = 30;
    for (const R of this.ramps) {
      if (this.done.has(R.i)) continue;
      if (dist(v.pos.x, v.pos.z, R.r.x, R.r.z) < 45) {
        this.hinted = true;
        this.game.hud.showHelp('<b>Salto único</b>: agarrá la rampa a más de 70 km/h y caé lejos.', 5);
        return;
      }
    }
  }

  takeoff(v) {
    const g = this.game;
    const sp = Math.hypot(v.vx, v.vz);
    // ¿despegó de una rampa, en el sentido de la rampa?
    let ramp = null;
    for (const R of this.ramps) {
      if (dist(v.pos.x, v.pos.z, R.ex, R.ez) > 9) continue;
      if ((v.vx * R.r.fx + v.vz * R.r.fz) < sp * 0.7) continue;
      ramp = R; break;
    }
    this.jump = { v, x: v.pos.x, z: v.pos.z, y: v.pos.y, ramp, t: 0, maxY: v.pos.y, maxH: 0, speed: sp, unique: !!ramp && sp >= V_MIN };
    if (ramp && this.jump.unique) this.camera(v, ramp, sp);
  }

  // Cámara de costado: mira el vuelo desde afuera, a mitad de camino y un poco más alta
  camera(v, R, sp) {
    const g = this.game;
    const rig = g.cameraRig;
    if (rig.cinematic || g.controlsLocked) return;
    const sim = this.simulate(R.r, R.ex, R.ez, R.top, sp);
    const half = sim.d * 0.5;
    const mx = R.ex + R.r.fx * half, mz = R.ez + R.r.fz * half;
    const nx = R.r.fz, nz = -R.r.fx;
    // el costado más despejado (sin paredes entre la cámara y el auto)
    const off = 12 + sim.d * 0.35;
    let best = null;
    for (const s of [1, -1]) {
      const cx = mx + nx * off * s, cz = mz + nz * off * s;
      const cy = Math.max(sim.apex + 2.5, g.terrain.groundAt(cx, cz) + 2);
      const dx = mx - cx, dz = mz - cz, L = Math.hypot(dx, dz) || 1;
      const blocked = g.colliders.raycast(cx, cy, cz, dx / L, 0, dz / L, L);
      if (!best || (!blocked && best.blocked)) best = { cx, cy, cz, blocked };
    }
    const pos = new THREE.Vector3(best.cx, best.cy, best.cz);
    rig.startCinematic(pos, pos, v.pos, 99, { track: v, fov: 58 });
    this.jump.cam = true;
    g.hud.letterbox && g.hud.letterbox(true);
  }

  finish(v) {
    const g = this.game;
    const j = this.jump;
    this.jump = null;
    g.timeScale = 1;
    if (j.cam) {
      g.cameraRig.endCinematic();
      g.hud.letterbox && g.hud.letterbox(false);
      if (v) g.cameraRig.snapBehind(v.heading);
    }
    if (!v || v.dead || v.sinking) return;
    const d = dist(j.x, j.z, v.pos.x, v.pos.z);
    const R = j.ramp;
    if (R) {
      const far = dist(R.ex, R.ez, v.pos.x, v.pos.z);
      if (j.unique && far >= R.minD) {
        const first = !this.done.has(R.i);
        const alto = j.maxH;
        const bonus = Math.round((j.t * 150 + d * 6 + alto * 20) * (first ? 2 : 1) / 10) * 10;
        if (first) { this.done.add(R.i); g.stats.jumps = this.done.size; }
        g.addMoney(bonus);
        const sub = `${Math.round(d)} m · ${alto.toFixed(1)} m de alto · ${j.t.toFixed(1)} s — $${bonus}`;
        g.hud.bigText(first ? '¡SALTO ÚNICO INSÓLITO!' : '¡SALTO INSÓLITO!', `${sub}${first ? `<br><small>Saltos únicos: ${this.done.size} de ${this.ramps.length}</small>` : ''}`, 4);
        if (first && this.done.size === this.ramps.length) {
          g.addMoney(5000);
          setTimeout(() => g.hud.bigText('¡TODOS LOS SALTOS!', 'Sos el Evel Knievel de Comodoro — $5000', 5), 4200);
        }
      } else if (j.t > 0.3) {
        g.hud.showToast(j.speed < V_MIN
          ? `Salto único fallido: agarrá la ${NOMBRES[R.r.kind] || 'rampa'} más rápido (${Math.round(j.speed * 3.6)} km/h)`
          : 'Salto único fallido: caíste muy cerca', 3);
      }
    } else if (j.t > 2.2) {
      const bonus = Math.round(j.t * 40);
      g.addMoney(bonus);
      g.hud.showToast(`Volaste ${Math.round(d)} m — +$${bonus}`, 2);
    }
  }
}
