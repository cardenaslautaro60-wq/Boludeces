import * as THREE from 'three';
import { clamp, lerp, angleWrap, approachAngle } from '../util.js';

// Cámara en tercera persona, estilo San Andreas
export class CameraRig {
  constructor(game, camera) {
    this.game = game;
    this.camera = camera;
    this.yaw = Math.PI; // la cámara mira hacia +Z cuando yaw = 0 desde atrás
    this.pitch = 0.18;
    this.dist = 5;
    this.target = new THREE.Vector3();
    this.pos = new THREE.Vector3();
    this.lastManual = 0;
    this.mode = 0; // 0 normal, 1 lejos, 2 cerca
    this.shake = 0;
    this.fov = 62;
    this.cinematic = null;
    this.aimLerp = 0;
    this.lookBack = false;
  }

  // Dirección hacia donde mira la cámara (plano XZ)
  forward() { return { x: Math.sin(this.yaw), z: Math.cos(this.yaw) }; }

  update(dt, input) {
    const g = this.game;
    const cam = this.camera;
    if (this.cinematic) {
      const c = this.cinematic;
      c.t = Math.min(1, (c.t || 0) + dt / (c.dur || 4));
      const k = c.ease ? c.t * c.t * (3 - 2 * c.t) : c.t;
      cam.position.lerpVectors(c.from, c.to, k);
      this.target.lerpVectors(c.lookFrom || c.look, c.look, k);
      cam.lookAt(this.target);
      cam.fov = lerp(cam.fov, c.fov || 55, 0.1);
      cam.updateProjectionMatrix();
      return;
    }
    const p = g.player;
    const look = input ? input.consumeLook() : { x: 0, y: 0 };
    const inCar = !!p.vehicle;
    const aiming = p.aiming && !inCar;
    this.aimLerp = lerp(this.aimLerp, aiming ? 1 : 0, 1 - Math.exp(-10 * dt));

    if (Math.abs(look.x) + Math.abs(look.y) > 0.0001) this.lastManual = performance.now();
    this.yaw -= look.x;
    this.pitch = clamp(this.pitch + look.y, -0.6, 1.2);

    // objetivo
    let tx = p.pos.x, ty = p.pos.y + 1.55, tz = p.pos.z;
    let baseDist = [4.6, 7, 3.2][this.mode];
    if (inCar) {
      const v = p.vehicle;
      tx = v.pos.x; tz = v.pos.z; ty = v.pos.y + v.model.camH * 0.9 + 0.6;
      baseDist = (v.type.L * 1.1 + 3.2) * [1, 1.5, 0.75][this.mode] + clamp(v.speed * 0.06, 0, 2.5);
      // seguir detrás del auto si no se mueve el mouse
      const idle = performance.now() - this.lastManual > 1400;
      if (idle && v.speed > 2) {
        const moving = Math.atan2(v.vx, v.vz);
        const rev = v.forwardSpeed < -1;
        const want = rev ? v.heading : moving;
        this.yaw = approachAngle(this.yaw, want, dt * clamp(v.speed * 0.12, 0.5, 2.2));
        this.pitch = lerp(this.pitch, 0.22, dt * 1.5);
      }
    } else if (p.swimming) {
      ty = p.pos.y + 0.6;
    }
    if (this.lookBack && inCar) { /* mirar atrás */ }
    const yaw = this.yaw + (this.lookBack && inCar ? Math.PI : 0);
    // hombro al apuntar
    const dist = lerp(baseDist, 2.3, this.aimLerp);
    const side = lerp(0, 0.75, this.aimLerp);
    const rx = -Math.cos(yaw), rz = Math.sin(yaw);
    tx += rx * side; tz += rz * side;
    ty += this.aimLerp * 0.15;
    this.target.set(tx, ty, tz);

    const cp = Math.cos(this.pitch), sp = Math.sin(this.pitch);
    let dx = -Math.sin(yaw) * cp, dy = sp, dz = -Math.cos(yaw) * cp;
    // colisión de cámara
    let d = dist;
    const hit = g.colliders.raycast(tx, ty, tz, dx, dy, dz, dist + 0.3);
    if (hit) d = Math.max(0.8, hit.t - 0.35);
    for (let s = 0.5; s < d; s += 0.5) {
      const x = tx + dx * s, y = ty + dy * s, z = tz + dz * s;
      if (y < g.terrain.heightAt(x, z) + 0.4) { d = Math.max(0.8, s - 0.3); break; }
    }
    this.dist = d < this.dist ? d : lerp(this.dist, d, 1 - Math.exp(-4 * dt));
    this.pos.set(tx + dx * this.dist, ty + dy * this.dist, tz + dz * this.dist);
    const gh = g.terrain.heightAt(this.pos.x, this.pos.z) + 0.3;
    if (this.pos.y < gh) this.pos.y = gh;
    if (this.pos.y < 0.3 && g.terrain.heightAt(this.pos.x, this.pos.z) < 0) this.pos.y = 0.3;

    cam.position.copy(this.pos);
    if (this.shake > 0) {
      this.shake = Math.max(0, this.shake - dt * 2);
      cam.position.x += (Math.random() - 0.5) * this.shake * 0.4;
      cam.position.y += (Math.random() - 0.5) * this.shake * 0.4;
    }
    cam.lookAt(this.target);
    const targetFov = aiming ? 48 : inCar ? 64 + clamp(p.vehicle.speed * 0.25, 0, 10) : 62;
    cam.fov = lerp(cam.fov, targetFov, 1 - Math.exp(-6 * dt));
    cam.updateProjectionMatrix();
  }

  // Dirección de apuntado (desde la cámara hacia el centro de la pantalla)
  aimDirection(out) {
    const cam = this.camera;
    cam.getWorldDirection(out);
    return out;
  }

  snapBehind(heading) {
    this.yaw = heading;
    this.pitch = 0.2;
  }

  startCinematic(from, to, look, dur = 4, opts = {}) {
    this.cinematic = { from: from.clone(), to: to.clone(), look: look.clone(), lookFrom: opts.lookFrom ? opts.lookFrom.clone() : null, dur, t: 0, ease: true, fov: opts.fov };
  }

  endCinematic() {
    this.cinematic = null;
  }
}

export function angleOf(x, z) { return angleWrap(Math.atan2(x, z)); }
