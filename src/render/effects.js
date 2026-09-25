import * as THREE from 'three';
import { rand, clamp } from '../util.js';

// Pool de partículas con un shader de puntos (tamaño y alfa por partícula)
class ParticlePool {
  constructor(max, texture, additive) {
    this.max = max;
    this.pos = new Float32Array(max * 3);
    this.col = new Float32Array(max * 4);
    this.size = new Float32Array(max);
    this.data = [];
    for (let i = 0; i < max; i++) this.data.push({ alive: false });
    this.next = 0;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('pcolor', new THREE.BufferAttribute(this.col, 4).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('psize', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    this.geo = geo;
    const mat = new THREE.ShaderMaterial({
      uniforms: { map: { value: texture }, uScale: { value: 400 } },
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      vertexShader: `
        attribute vec4 pcolor; attribute float psize; varying vec4 vC; uniform float uScale;
        void main(){ vC = pcolor; vec4 mv = modelViewMatrix*vec4(position,1.0); gl_PointSize = psize * uScale / max(1.0, -mv.z); gl_Position = projectionMatrix*mv; }`,
      fragmentShader: `
        uniform sampler2D map; varying vec4 vC;
        void main(){ vec4 t = texture2D(map, gl_PointCoord); gl_FragColor = vec4(vC.rgb, vC.a * t.a); if (gl_FragColor.a < 0.01) discard; }`,
    });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 8;
  }

  spawn(x, y, z, o) {
    const i = this.next;
    this.next = (this.next + 1) % this.max;
    const p = this.data[i];
    p.alive = true;
    p.x = x; p.y = y; p.z = z;
    p.vx = o.vx || 0; p.vy = o.vy || 0; p.vz = o.vz || 0;
    p.life = 0; p.max = o.life || 1;
    p.s0 = o.s0 || 1; p.s1 = o.s1 !== undefined ? o.s1 : p.s0;
    p.r = o.r; p.g = o.g; p.b = o.b;
    p.r1 = o.r1 !== undefined ? o.r1 : o.r; p.g1 = o.g1 !== undefined ? o.g1 : o.g; p.b1 = o.b1 !== undefined ? o.b1 : o.b;
    p.a0 = o.a0 !== undefined ? o.a0 : 1; p.a1 = o.a1 !== undefined ? o.a1 : 0;
    p.grav = o.grav || 0; p.drag = o.drag || 0; p.wind = o.wind || 0;
  }

  update(dt, wind) {
    let any = false;
    for (let i = 0; i < this.max; i++) {
      const p = this.data[i];
      if (!p.alive) { this.col[i * 4 + 3] = 0; this.size[i] = 0; continue; }
      any = true;
      p.life += dt;
      if (p.life >= p.max) { p.alive = false; this.col[i * 4 + 3] = 0; this.size[i] = 0; continue; }
      const t = p.life / p.max;
      p.vy -= p.grav * dt;
      const d = Math.exp(-p.drag * dt);
      p.vx *= d; p.vy *= d; p.vz *= d;
      if (p.wind && wind) { p.vx += wind.x * p.wind * dt; p.vz += wind.y * p.wind * dt; }
      p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
      this.pos[i * 3] = p.x; this.pos[i * 3 + 1] = p.y; this.pos[i * 3 + 2] = p.z;
      this.col[i * 4] = p.r + (p.r1 - p.r) * t;
      this.col[i * 4 + 1] = p.g + (p.g1 - p.g) * t;
      this.col[i * 4 + 2] = p.b + (p.b1 - p.b) * t;
      this.col[i * 4 + 3] = p.a0 + (p.a1 - p.a0) * t;
      this.size[i] = p.s0 + (p.s1 - p.s0) * t;
    }
    if (any || this.dirty) {
      this.geo.attributes.position.needsUpdate = true;
      this.geo.attributes.pcolor.needsUpdate = true;
      this.geo.attributes.psize.needsUpdate = true;
      this.dirty = any;
    }
  }
}

export class Effects {
  constructor(game) {
    this.game = game;
    const T = game.textures;
    this.soft = new ParticlePool(700, T.smoke, false);
    this.glow = new ParticlePool(500, T.glow, true);
    game.scene.add(this.soft.points, this.glow.points);
    // Trazadoras de bala
    this.tracerMax = 40;
    this.tracerPos = new Float32Array(this.tracerMax * 6);
    this.tracerLife = new Float32Array(this.tracerMax);
    const tg = new THREE.BufferGeometry();
    tg.setAttribute('position', new THREE.BufferAttribute(this.tracerPos, 3).setUsage(THREE.DynamicDrawUsage));
    this.tracers = new THREE.LineSegments(tg, new THREE.LineBasicMaterial({ color: 0xfff0a0, transparent: true, opacity: 0.8 }));
    this.tracers.frustumCulled = false;
    this.tracerNext = 0;
    game.scene.add(this.tracers);
    // Polvo del viento alrededor de la cámara
    this.dustN = 500;
    const dp = new Float32Array(this.dustN * 3);
    for (let i = 0; i < this.dustN; i++) { dp[i * 3] = rand(-60, 60); dp[i * 3 + 1] = rand(0, 25); dp[i * 3 + 2] = rand(-60, 60); }
    const dg = new THREE.BufferGeometry();
    dg.setAttribute('position', new THREE.BufferAttribute(dp, 3).setUsage(THREE.DynamicDrawUsage));
    this.dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: 0xc8b088, size: 0.25, transparent: true, opacity: 0.5, depthWrite: false, map: T.glow }));
    this.dust.frustumCulled = false;
    this.dustPos = dp;
    game.scene.add(this.dust);
    // Bolsas volando con el viento
    this.flyingBags = [];
    const bagMat = new THREE.SpriteMaterial({ map: T.bag, transparent: true, fog: true });
    for (let i = 0; i < 6; i++) {
      const s = new THREE.Sprite(bagMat);
      s.scale.set(0.6, 0.6, 0.6);
      s.userData = { x: rand(-50, 50), y: rand(1, 8), z: rand(-50, 50), ph: rand(0, 6) };
      this.flyingBags.push(s);
      game.scene.add(s);
    }
  }

  smoke(x, y, z, dark = 0.5) {
    const c = dark;
    this.soft.spawn(x, y, z, { vx: rand(-0.3, 0.3), vy: rand(1.2, 2), vz: rand(-0.3, 0.3), life: rand(1.5, 2.5), s0: 0.8, s1: 3.5, r: c, g: c, b: c, a0: 0.55, a1: 0, drag: 0.4, wind: 0.25 });
  }

  fire(x, y, z) {
    this.glow.spawn(x + rand(-0.4, 0.4), y, z + rand(-0.4, 0.4), { vy: rand(1.5, 3), life: rand(0.35, 0.7), s0: 1.4, s1: 0.3, r: 1, g: 0.75, b: 0.25, r1: 0.9, g1: 0.2, b1: 0.05, a0: 0.9, a1: 0, wind: 0.15 });
    if (Math.random() < 0.3) this.smoke(x, y + 0.8, z, 0.12);
  }

  sparks(x, y, z, n = 8) {
    for (let i = 0; i < n; i++) this.glow.spawn(x, y, z, { vx: rand(-4, 4), vy: rand(1, 5), vz: rand(-4, 4), life: rand(0.2, 0.5), s0: 0.18, s1: 0.05, r: 1, g: 0.85, b: 0.4, a0: 1, a1: 0, grav: 12 });
  }

  blood(x, y, z) {
    for (let i = 0; i < 6; i++) this.soft.spawn(x, y, z, { vx: rand(-1.5, 1.5), vy: rand(0, 2.5), vz: rand(-1.5, 1.5), life: rand(0.3, 0.6), s0: 0.25, s1: 0.1, r: 0.55, g: 0.02, b: 0.02, a0: 0.9, a1: 0, grav: 9 });
  }

  dustPuff(x, y, z, n = 4, col = 0.62) {
    for (let i = 0; i < n; i++) this.soft.spawn(x + rand(-0.5, 0.5), y, z + rand(-0.5, 0.5), { vx: rand(-0.6, 0.6), vy: rand(0.3, 1), vz: rand(-0.6, 0.6), life: rand(0.6, 1.2), s0: 0.6, s1: 2, r: col, g: col * 0.88, b: col * 0.7, a0: 0.4, a1: 0, drag: 1, wind: 0.3 });
  }

  splash(x, z) {
    for (let i = 0; i < 12; i++) this.soft.spawn(x, 0.2, z, { vx: rand(-2, 2), vy: rand(2, 5), vz: rand(-2, 2), life: rand(0.5, 0.9), s0: 0.4, s1: 1.2, r: 0.9, g: 0.95, b: 1, a0: 0.8, a1: 0, grav: 10 });
  }

  muzzle(x, y, z) {
    this.glow.spawn(x, y, z, { life: 0.06, s0: 0.9, s1: 0.4, r: 1, g: 0.9, b: 0.5, a0: 1, a1: 0 });
  }

  tracer(x0, y0, z0, x1, y1, z1) {
    const i = this.tracerNext;
    this.tracerNext = (this.tracerNext + 1) % this.tracerMax;
    this.tracerPos.set([x0, y0, z0, x1, y1, z1], i * 6);
    this.tracerLife[i] = 0.06;
  }

  explosion(x, y, z, cause) {
    for (let i = 0; i < 40; i++) {
      this.glow.spawn(x, y, z, { vx: rand(-7, 7), vy: rand(1, 9), vz: rand(-7, 7), life: rand(0.4, 1), s0: 3.5, s1: 0.5, r: 1, g: 0.8, b: 0.35, r1: 0.8, g1: 0.2, b1: 0.05, a0: 1, a1: 0, drag: 2.5 });
    }
    for (let i = 0; i < 24; i++) {
      this.soft.spawn(x, y + 1, z, { vx: rand(-3, 3), vy: rand(2, 6), vz: rand(-3, 3), life: rand(2, 3.5), s0: 2, s1: 7, r: 0.12, g: 0.11, b: 0.1, a0: 0.8, a1: 0, drag: 0.8, wind: 0.3 });
    }
    this.sparks(x, y, z, 20);
    this.game.onExplosion && this.game.onExplosion(x, y, z, cause);
  }

  update(dt, camPos) {
    const env = this.game.env;
    this.soft.update(dt, env.windDir);
    this.glow.update(dt, env.windDir);
    // trazadoras
    let tAny = false;
    for (let i = 0; i < this.tracerMax; i++) {
      if (this.tracerLife[i] > 0) {
        this.tracerLife[i] -= dt;
        tAny = true;
        if (this.tracerLife[i] <= 0) this.tracerPos.fill(0, i * 6, i * 6 + 6);
      }
    }
    if (tAny || this.tracerDirty) { this.tracers.geometry.attributes.position.needsUpdate = true; this.tracerDirty = tAny; }
    // polvo
    const w = env.windSpeed;
    const dens = clamp((w - 10) / 18, 0, 1) * 0.55 + env.dust * 0.4;
    this.dust.material.opacity = dens;
    this.dust.visible = dens > 0.02;
    if (this.dust.visible) {
      const dp = this.dustPos;
      const vx = env.windDir.x * w * 1.1, vz = env.windDir.y * w * 1.1;
      for (let i = 0; i < this.dustN; i++) {
        let x = dp[i * 3] + vx * dt, y = dp[i * 3 + 1] + Math.sin(i + performance.now() * 0.003) * 0.02, z = dp[i * 3 + 2] + vz * dt;
        // envolver alrededor de la cámara
        if (x - camPos.x > 60) x -= 120; else if (x - camPos.x < -60) x += 120;
        if (z - camPos.z > 60) z -= 120; else if (z - camPos.z < -60) z += 120;
        if (y - camPos.y > 25) y -= 30; else if (y - camPos.y < -5) y += 30;
        dp[i * 3] = x; dp[i * 3 + 1] = y; dp[i * 3 + 2] = z;
      }
      this.dust.geometry.attributes.position.needsUpdate = true;
    }
    // bolsas voladoras
    const t = performance.now() * 0.001;
    const showBags = w > 14;
    for (const s of this.flyingBags) {
      s.visible = showBags;
      if (!showBags) continue;
      const u = s.userData;
      u.x += env.windDir.x * w * 0.7 * dt;
      u.z += env.windDir.y * w * 0.7 * dt;
      u.y += Math.sin(t * 2 + u.ph) * dt * 2;
      if (u.x - camPos.x > 70) { u.x -= 140; u.y = rand(1, 8); }
      if (u.z - camPos.z > 70) u.z -= 140; else if (u.z - camPos.z < -70) u.z += 140;
      if (u.x - camPos.x < -70) u.x += 140;
      const gy = this.game.terrain.heightAt(u.x, u.z);
      if (u.y < gy + 0.5) u.y = gy + 0.5;
      s.position.set(u.x, u.y, u.z);
      s.material.rotation = Math.sin(t * 5 + u.ph);
    }
  }
}
