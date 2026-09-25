import { rand, pick, chance, dist } from '../util.js';
import { Brain } from './ai.js';
import { randomLook } from '../entities/humanoid.js';
import { POI, META } from '../world/mapdata.js';

// Peatones y pandillas alrededor del jugador
export class Population {
  constructor(game) {
    this.game = game;
    this.max = 22;
    this.spawnT = 0;
    this.enabled = true;
    this.density = 1;
    // territorios de pandillas
    const place = (name) => META.places.find((q) => q.name === name);
    const caleta = place('Caleta Córdova') || POI.depositoCrudo || { x: 0, z: 0 };
    const at = (o, fb) => (o ? { x: o.x, z: o.z } : fb);
    const mans = at(POI.mansionChetos, { x: 0, z: 0 });
    this.turfs = [
      { kind: 'cheto', x: mans.x, z: mans.z, r: 140, n: 6, weapon: ['bate', 'pistola'], hostile: true },
      { kind: 'caleta', ...at(caleta, mans), r: 170, n: 6, weapon: ['bate', 'pistola'], hostile: true },
      { kind: 'lobo', ...at(POI.madriguera, mans), r: 170, n: 5, weapon: ['bate'], hostile: false },
      { kind: 'petrolero', ...at(POI.museo, mans), r: 200, n: 4, weapon: [], hostile: false },
      { kind: 'petrolero', ...at(POI.yacimiento, mans), r: 160, n: 5, weapon: [], hostile: false },
    ];
  }

  count() { return this.game.peds.filter((p) => p.spawned && !p.removed).length; }

  update(dt) {
    const g = this.game;
    const pl = g.player;
    const pp = pl.vehicle ? pl.vehicle.pos : pl.pos;
    const cam = g.camera.position;
    // limpiar lejanos
    for (const p of [...g.peds]) {
      if (!p.spawned || p.removed || p.persistent || p.vehicle) continue;
      const d = dist(p.pos.x, p.pos.z, pp.x, pp.z);
      if (d > 140 || (p.dead && p.deadT > 30)) g.removePed(p);
      else p.group.visible = d < 110;
    }
    // ocultar conductores lejanos
    for (const p of g.peds) if (p.vehicle && !p.isPlayer) p.group.visible = dist(p.pos.x, p.pos.z, cam.x, cam.z) < 70;
    if (!this.enabled) return;
    this.spawnT -= dt;
    if (this.spawnT > 0) return;
    this.spawnT = 0.25;
    const n = this.count();
    if (n < this.max * this.density) this.spawnCivilian(pp);
    this.spawnGangs(pp);
  }

  spawnCivilian(pp) {
    const g = this.game;
    const sw = g.city.randomSidewalk(pp.x, pp.z, 30, 110);
    if (!sw) return;
    const { x, z } = sw;
    // evitar aparecer a la vista y muy cerca
    const cam = g.camera.position;
    const cx = x - cam.x, cz = z - cam.z, cd = Math.hypot(cx, cz);
    const f = g.cameraRig.forward();
    if (cd < 45 && (cx * f.x + cz * f.z) / cd > 0.5) return;
    const zt = g.world.zoneTypeAt(x, z);
    let kind = 'civil';
    if ((zt === 'km' || zt === 'industrial' || zt === 'meseta') && chance(0.4)) kind = 'petrolero';
    if (zt === 'rada' && chance(0.3)) kind = 'cheto';
    const p = g.spawnPed(kind, x, z, { look: randomLook(kind), rot: rand(0, 6.28) });
    p.spawned = true;
    p.brain = new Brain(g, p, 'wander');
    p.brain.sw = { e: sw.edge, side: sw.side, toB: chance(0.5) };
    if (kind === 'cheto') p.brain.hostile = false;
    if (chance(0.06)) { p.give('pistola', 20); }
    if (chance(0.05)) { p.give('bate'); p.setWeapon('bate'); }
  }

  spawnGangs(pp) {
    const g = this.game;
    for (const t of this.turfs) {
      const d = dist(t.x, t.z, pp.x, pp.z);
      if (d > t.r + 120) continue;
      const members = g.peds.filter((p) => p.turf === t && !p.removed && !p.dead).length;
      if (members >= t.n) continue;
      if (t.cooldown && t.cooldown > g.time) continue;
      // posición en el territorio, fuera de edificios
      for (let k = 0; k < 6; k++) {
        const a = rand(0, Math.PI * 2), r = rand(5, t.r * 0.6);
        const x = t.x + Math.cos(a) * r, z = t.z + Math.sin(a) * r;
        const pt = { x, z };
        if (g.colliders.resolveCircle(pt, 0.6, g.terrain.heightAt(x, z))) continue;
        if (g.terrain.heightAt(x, z) < 0.5) continue;
        const cam = g.camera.position;
        if (dist(x, z, cam.x, cam.z) < 35) continue;
        const p = g.spawnPed(t.kind, x, z, { look: randomLook(t.kind), rot: rand(0, 6.28) });
        p.spawned = true;
        p.turf = t;
        const w = t.weapon.length ? pick(t.weapon) : null;
        if (w) { p.give(w, 30); p.setWeapon(w); }
        if (t.kind === 'petrolero') p.brain = new Brain(g, p, 'wander');
        else {
          p.brain = new Brain(g, p, 'guard', { hostile: t.hostile, home: { x, z }, leash: 40 });
          p.brain.base = 'guard';
          p.brain.aggroRange = 13;
          p.brain.aggroDelay = t.kind === 'cheto' ? 4 : 3;
          if (t.kind === 'lobo') { p.isFriend = true; p.brain.hostile = false; }
        }
        break;
      }
    }
  }

  // Pánico general (disparos, explosiones)
  panic(pos, r, by) {
    for (const p of this.game.peds) {
      if (p.isPlayer || p.dead || !p.brain || p.vehicle) continue;
      if (dist(p.pos.x, p.pos.z, pos.x, pos.z) < r) p.brain.panic(pos, by);
    }
    for (const v of this.game.traffic.cars) {
      if (v.ai && v.ai.mode === 'cruise' && dist(v.pos.x, v.pos.z, pos.x, pos.z) < r) { v.ai.speedMul = 1.6; }
    }
  }

  clearAround(pos, r) {
    for (const p of [...this.game.peds]) {
      if (!p.spawned || p.persistent) continue;
      if (dist(p.pos.x, p.pos.z, pos.x, pos.z) < r && !p.vehicle) this.game.removePed(p);
    }
  }
}
