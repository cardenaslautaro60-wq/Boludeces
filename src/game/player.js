import * as THREE from 'three';
import { WEAPONS } from './weapons.js';
import { clamp, lerp, pick } from '../util.js';
import { sayLine, PED_LINES } from '../entities/ped.js';

const tmp = new THREE.Vector3();

// Control del jugador: a pie y manejando
export class PlayerController {
  constructor(game) {
    this.game = game;
    this.enterTarget = null;
    this.enterT = 0;
    this.hornWas = false;
    this.fireHeld = 0;
    this.jumpBuf = 0;
    this.lock = null;       // blanco fijado al apuntar
    this.lockT = 0;
  }

  get ped() { return this.game.player; }

  update(dt, input) {
    const g = this.game;
    const p = this.ped;
    if (!p || p.dead) return;
    if (g.controlsLocked) {
      p.moveMag = 0; p.aiming = false;
      if (p.vehicle && p.vehicle.driver === p) { p.vehicle.ctrl.throttle = 0; p.vehicle.ctrl.steer = 0; p.vehicle.ctrl.brake = 1; }
      return;
    }
    const cam = g.cameraRig;
    input.inVehicle = !!p.vehicle;

    if (p.vehicle) this.drive(dt, input);
    else this.onFoot(dt, input);

    // cambiar de personaje (Gordopin <-> Petroca)
    if (input.was('switchChar') && g.canSwitch && g.canSwitch()) g.switchCharacter();
    if (input.was('camera')) cam.mode = (cam.mode + 1) % 3;
    cam.lookBack = input.is('lookBack');
  }

  onFoot(dt, input) {
    const g = this.game;
    const p = this.ped;
    const cam = g.cameraRig;
    // ¿entrando a un auto?
    if (this.enterTarget) {
      const v = this.enterTarget;
      this.enterT += dt;
      const d = v.doorPos(0);
      const dx = d.x - p.pos.x, dz = d.z - p.pos.z;
      const dist = Math.hypot(dx, dz);
      if (dist > 0.4 && this.enterT < 1.2) {
        p.moveX = dx / dist; p.moveZ = dz / dist; p.moveMag = 1; p.gait = 1;
      } else {
        p.moveMag = 0;
        this.finishEnter(v);
      }
      if (input.was('enter') || input.axis().y < -0.5 || v.dead) this.enterTarget = null;
      return;
    }

    const a = input.axis();
    const f = cam.forward();
    // derecha de la cámara = (-cos yaw, sin yaw)
    const mx = f.x * a.y - Math.cos(cam.yaw) * a.x;
    const mz = f.z * a.y + Math.sin(cam.yaw) * a.x;
    const m = Math.hypot(mx, mz);
    if (m > 0.05) { p.moveX = mx / m; p.moveZ = mz / m; p.moveMag = Math.min(1, m); } else p.moveMag = 0;
    p.gait = input.is('walk') ? 0 : input.is('sprint') ? 2 : 1;
    // salto con "buffer": si se aprieta un instante antes de tocar el piso, salta igual
    if (input.was('jump')) this.jumpBuf = 0.16;
    p.holdJump = input.is('jump');
    if (this.jumpBuf > 0) { if (p.jump()) this.jumpBuf = 0; else this.jumpBuf -= dt; }
    if (input.was('reload')) p.reload();

    // armas
    // con joystick, apuntando, los gatillos cambian de blanco en vez de arma
    const padAim = input.is('aim') && !!input.padAxis;
    if (!padAim && (input.was('nextWeapon') || input.wheel > 0)) p.cycleWeapon(1);
    if (!padAim && (input.was('prevWeapon') || input.wheel < 0)) p.cycleWeapon(-1);
    const W = WEAPONS[p.weapon];
    p.aiming = input.is('aim') && !W.melee;
    if (p.aiming || !W.melee) {
      cam.aimDirection(tmp);
      if (p.aiming) {
        this.aimAssist(dt, input);
        // apuntar desde el hombro: corregir hacia el punto donde mira la cámara
        const far = this.lock ? Math.max(3, cam.camera.position.distanceTo(this.lock.pos)) : 60;
        const tx = cam.camera.position.x + tmp.x * far, ty = cam.camera.position.y + tmp.y * far, tz = cam.camera.position.z + tmp.z * far;
        const h = p.handWorld();
        p.aimDir.set(tx - h.x, ty - h.y, tz - h.z).normalize();
        p.aimPitch = Math.asin(clamp(p.aimDir.y, -0.9, 0.9));
      } else {
        // sin apuntar: autoapuntado al enemigo más cercano en frente
        const t = this.autoTarget();
        if (t) {
          p.aimDir.set(t.pos.x - p.pos.x, t.pos.y + 1.1 - (p.pos.y + 1.4), t.pos.z - p.pos.z).normalize();
          p.heading = Math.atan2(p.aimDir.x, p.aimDir.z);
        } else p.aimDir.set(Math.sin(p.heading), 0, Math.cos(p.heading));
        p.aimPitch = 0;
      }
    }
    if (!p.aiming) this.lock = null;
    const fire = input.is('fire');
    if (fire && (input.was('fire') || W.auto || (!W.melee && this.fireHeld > W.rate))) {
      if (!W.melee && !p.aiming) { const t = this.autoTarget(); if (t) p.heading = Math.atan2(t.pos.x - p.pos.x, t.pos.z - p.pos.z); }
      p.attack();
      this.fireHeld = 0;
    }
    this.fireHeld = fire ? this.fireHeld + dt : 0;

    // subir a un vehículo
    if (input.was('enter')) {
      const v = this.nearestVehicle(5);
      if (v) { this.enterTarget = v; this.enterT = 0; }
    }
  }

  // Apuntado con ayuda: con mouse la mira se "pega" al blanco que tiene encima (fricción y
  // un tirón suave); con joystick o pantalla táctil fija el blanco más cercano al centro.
  aimAssist(dt, input) {
    const g = this.game, p = this.ped, cam = g.cameraRig;
    const hard = !!(input.padAxis || input.isTouch || (input.touch && input.touch.active));
    const cp = cam.camera.position;
    cam.aimDirection(tmp);
    const ax = tmp.x, ay = tmp.y, az = tmp.z;
    const pointOf = (o) => ({ x: o.pos.x, y: o.pos.y + (o.knockT > 0 ? 0.4 : 1.25), z: o.pos.z });
    const angTo = (o) => {
      const q = pointOf(o);
      const dx = q.x - cp.x, dy = q.y - cp.y, dz = q.z - cp.z, d = Math.hypot(dx, dy, dz) || 1;
      return { ang: Math.acos(clamp((dx * ax + dy * ay + dz * az) / d, -1, 1)), d, dx: dx / d, dy: dy / d, dz: dz / d };
    };
    const valid = (o) => o && !o.dead && !o.removed && !o.vehicle && !o.isFriend && o !== p && Math.hypot(o.pos.x - p.pos.x, o.pos.z - p.pos.z) < 48;
    // mantener el blanco si sigue cerca de la mira
    const thr = hard ? 0.42 : 0.11;
    if (this.lock && (!valid(this.lock) || angTo(this.lock).ang > thr * 2.2)) this.lock = null;
    if (!this.lock || (hard && input.was('nextWeapon'))) {
      let best = null, bs = Infinity;
      for (const o of g.peds) {
        if (!valid(o) || (hard && o === this.lock)) continue;
        const a = angTo(o);
        if (a.ang > thr) continue;
        // visible (sin paredes en el medio)
        const hit = g.colliders.raycast(cp.x, cp.y, cp.z, a.dx, a.dy, a.dz, a.d - 0.5);
        if (hit) continue;
        const sc = a.ang * (1 + a.d * 0.02) * (o.brain && o.brain.hostile ? 0.5 : 1) * (o.kind === 'cana' ? 0.7 : 1);
        if (sc < bs) { bs = sc; best = o; }
      }
      if (best && best !== this.lock) this.lockT = 0;
      this.lock = best || this.lock;
    }
    this.lockT += dt;
    if (!this.lock) return;
    const a = angTo(this.lock);
    // error en yaw y pitch entre la mira y el blanco
    const yawErr = Math.atan2(Math.sin(Math.atan2(a.dx, a.dz) - Math.atan2(ax, az)), Math.cos(Math.atan2(a.dx, a.dz) - Math.atan2(ax, az)));
    const pitchErr = Math.asin(clamp(a.dy, -1, 1)) - Math.asin(clamp(ay, -1, 1));
    const moved = performance.now() - (input.lastMouseMove || 0) < 80;
    const k = hard ? 1 - Math.exp(-9 * dt) : (moved ? 1 - Math.exp(-2.2 * dt) : 1 - Math.exp(-5 * dt));
    cam.yaw += yawErr * k;
    cam.pitch = clamp(cam.pitch - pitchErr * k, -0.6, 1.2);
  }

  autoTarget() {
    const g = this.game, p = this.ped;
    let best = null, bs = Infinity;
    const f = { x: Math.sin(p.heading), z: Math.cos(p.heading) };
    const cf = g.cameraRig.forward();
    for (const o of g.peds) {
      if (o === p || o.dead || o.vehicle || o.removed || o.isFriend) continue;
      const dx = o.pos.x - p.pos.x, dz = o.pos.z - p.pos.z;
      const d = Math.hypot(dx, dz);
      if (d > 30) continue;
      const dot = (dx * cf.x + dz * cf.z) / d;
      const dot2 = (dx * f.x + dz * f.z) / d;
      if (Math.max(dot, dot2) < 0.8) continue;
      const hostile = o.brain && o.brain.hostile ? 0.4 : 1;
      const s = d * hostile * (2 - Math.max(dot, dot2));
      if (s < bs) { bs = s; best = o; }
    }
    return best;
  }

  nearestVehicle(maxD) {
    const g = this.game, p = this.ped;
    let best = null, bd = maxD;
    for (const v of g.vehicles) {
      if (v.removed || v.dead || v.locked) continue;
      const d = Math.hypot(v.pos.x - p.pos.x, v.pos.z - p.pos.z) - v.type.L * 0.4;
      if (d < bd && Math.abs(v.pos.y - p.pos.y) < 2.5) { bd = d; best = v; }
    }
    return best;
  }

  finishEnter(v) {
    const g = this.game, p = this.ped;
    this.enterTarget = null;
    if (v.dead || v.removed) return;
    // afanar el auto: sacar al conductor
    const drv = v.driver;
    if (drv && drv !== p) {
      if (drv.isFriend) {
        // si es un amigo, subir de acompañante
        const seat = v.seats.findIndex((s, i) => i > 0 && !s);
        if (seat > 0) p.enterVehicle(v, seat);
        return;
      }
      drv.exitVehicle();
      drv.knockdown(Math.sin(v.heading + Math.PI / 2) * 2, Math.cos(v.heading + Math.PI / 2) * 2, 1.5);
      drv.hurt(5, p, null);
      if (drv.brain) drv.brain.onCarjacked && drv.brain.onCarjacked(p);
      sayLine(drv, pick(['¡Mi auto! ¡Ladrón!', '¡Eh, eh, EH!', '¡Llamen a la policía!', '¡Es de mi vieja ese auto!']));
      g.onCarjack && g.onCarjack(v, drv);
    }
    if (v.seats[0] && v.seats[0] !== p) return;
    p.enterVehicle(v, 0);
    if (!v.playerOwned && !v.missionOwned) {
      if (v.stolenBy !== p) { g.stats && (g.stats.carsStolen += 1); v.stolenBy = p; }
    }
    g.audio && g.audio.door(v.pos);
    g.hud && g.hud.showVehicleName(v.type.name);
    if (v.type.bike) g.audio && g.audio.stopRadio(); else g.audio && g.audio.startRadio(v.radio);
    g.hud && !v.type.bike && g.hud.showRadio(g.audio ? g.audio.stationName(v.radio) : '');
    g.cameraRig.snapBehind(v.heading);
    g.onEnterVehicle && g.onEnterVehicle(v);
  }

  drive(dt, input) {
    const g = this.game, p = this.ped;
    const v = p.vehicle;
    if (v.driver !== p) {
      // de acompañante: puede disparar
      if (input.was('enter')) this.exit();
      this.driveBy(dt, input);
      return;
    }
    const a = input.axis();
    let thr = a.y, br = 0;
    if (input.padTriggers && (input.padTriggers.gas > 0.05 || input.padTriggers.brake > 0.05)) thr = input.padTriggers.gas - input.padTriggers.brake;
    if (input.touch.gas !== undefined && (input.touch.gas || input.touch.brake)) thr = (input.touch.gas ? 1 : 0) - (input.touch.brake ? 1 : 0);
    v.ctrl.throttle = thr;
    v.ctrl.brake = br;
    v.ctrl.steer = lerp(v.ctrl.steer, -a.x, 1 - Math.exp(-(Math.abs(a.x) > 0.1 ? 8 : 12) * dt));
    v.ctrl.handbrake = input.is('handbrake');
    // bici: saltito con Shift
    if (v.type.bike && input.was('jump') && v.grounded) { v.vy = 5.2; }
    // bocina / sirena
    const horn = input.is('horn');
    if (horn) g.audio && g.audio.horn(v, true);
    else if (this.hornWas) g.audio && g.audio.horn(v, false);
    if (input.was('horn') && v.type.police) v.siren = !v.siren;
    this.hornWas = horn;
    // radio
    if (!v.type.bike && (input.was('radio') || input.wheel !== 0)) {
      v.radio = (v.radio + (input.wheel < 0 ? -1 : 1) + 7) % 7;
      g.audio && g.audio.startRadio(v.radio);
      g.hud && g.hud.showRadio(g.audio ? g.audio.stationName(v.radio) : '');
    }
    this.driveBy(dt, input);
    if (input.was('enter')) this.exit();
  }

  driveBy(dt, input) {
    const g = this.game, p = this.ped;
    const W = WEAPONS[p.weapon];
    p.driveBy = false;
    if (!W || W.melee || W.twoHanded) return;
    if (input.is('fire') && (input.was('fire') || W.auto || this.fireHeld > W.rate)) {
      g.cameraRig.aimDirection(tmp);
      tmp.y = clamp(tmp.y + 0.05, -0.3, 0.3);
      tmp.normalize();
      p.aimDir.copy(tmp);
      p.driveBy = true;
      const v = p.vehicle;
      const lx = Math.cos(v.heading), lz = -Math.sin(v.heading);
      p.driveBySide = tmp.x * lx + tmp.z * lz > 0 ? 1 : -1;
      p.attack();
      this.fireHeld = 0;
    }
    this.fireHeld = input.is('fire') ? this.fireHeld + dt : 0;
    if (input.is('fire')) p.driveBy = true;
  }

  exit() {
    const g = this.game, p = this.ped;
    const v = p.vehicle;
    if (!v) return;
    if (v.speed > 12 && !v.type.bike) return; // muy rápido para bajarse
    p.exitVehicle(v.speed > 5);
    g.audio && g.audio.stopRadio();
    g.audio && g.audio.horn(v, false);
    g.audio && g.audio.door(v.pos);
    g.onExitVehicle && g.onExitVehicle(v);
  }
}

export function randomGordopinLine() { return pick(PED_LINES.gordopin); }
