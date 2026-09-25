import * as THREE from 'three';
import { lam } from '../render/style.js';
import { rand, clamp } from '../util.js';

export const WEAPONS = {
  punos: { id: 'punos', name: 'Puños', icon: '👊', melee: true, dmg: 7, range: 1.4, rate: 0.38, slot: 0 },
  clavas: { id: 'clavas', name: 'Clavas de malabar', icon: '🎳', melee: true, dmg: 13, range: 1.6, rate: 0.5, slot: 1, mesh: 'clava' },
  bate: { id: 'bate', name: 'Bate', icon: '🏏', melee: true, dmg: 24, range: 1.9, rate: 0.75, slot: 1, mesh: 'bate', swing: 'bate' },
  pistola: { id: 'pistola', name: 'Pistola 9mm', icon: '🔫', dmg: 20, range: 70, rate: 0.26, clip: 17, spread: 0.018, slot: 2, mesh: 'pistola', price: 250, ammoPrice: 60, ammoPack: 34, sound: 'pistol' },
  escopeta: { id: 'escopeta', name: 'Escopeta', icon: '💥', dmg: 11, pellets: 8, range: 32, rate: 0.95, clip: 6, spread: 0.08, slot: 3, mesh: 'escopeta', twoHanded: true, price: 700, ammoPrice: 120, ammoPack: 16, sound: 'shotgun' },
  uzi: { id: 'uzi', name: 'Uzi', icon: '🔫', dmg: 11, range: 55, rate: 0.085, clip: 50, spread: 0.05, auto: true, slot: 4, mesh: 'uzi', price: 1200, ammoPrice: 150, ammoPack: 100, sound: 'smg' },
};
export const WEAPON_ORDER = ['punos', 'clavas', 'bate', 'pistola', 'escopeta', 'uzi'];

const meshCache = {};
export function weaponMesh(kind) {
  if (!kind) return null;
  if (!meshCache[kind]) {
    const g = new THREE.Group();
    const m = (c) => lam({ color: c });
    if (kind === 'clava') {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.02, 0.5, 6), m(0xf2f2f2));
      b.position.y = -0.2; b.rotation.x = 0;
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.08, 6), m(0x1c2f6b));
      band.position.y = -0.3;
      const g2 = new THREE.Group(); g2.add(b, band); g2.rotation.x = Math.PI / 2; g2.position.z = 0.1;
      g.add(g2);
    } else if (kind === 'bate') {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.025, 0.85, 6), m(0x9a6a3a));
      b.rotation.x = Math.PI / 2; b.position.z = 0.35;
      g.add(b);
    } else if (kind === 'pistola') {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.2), m(0x1a1a1a)); b.position.set(0, 0.02, 0.08);
      const h = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.12, 0.06), m(0x2a2a2a)); h.position.set(0, -0.04, 0);
      g.add(b, h);
    } else if (kind === 'escopeta') {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.95), m(0x2a2a2a)); b.position.z = 0.3;
      const s = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.12, 0.35), m(0x6a4a2a)); s.position.z = -0.15;
      g.add(b, s);
    } else if (kind === 'uzi') {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.3), m(0x1a1a1a)); b.position.z = 0.1;
      const c = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.18, 0.05), m(0x2a2a2a)); c.position.set(0, -0.1, 0.05);
      g.add(b, c);
    }
    meshCache[kind] = g;
  }
  return meshCache[kind].clone();
}

const tmpDir = new THREE.Vector3();

// Disparo instantáneo (hitscan). Devuelve el impacto más cercano.
export function fireRay(game, shooter, ox, oy, oz, dx, dy, dz, range) {
  let best = { t: range, kind: 'none' };
  // estructuras
  const s = game.colliders.raycast(ox, oy, oz, dx, dy, dz, range);
  if (s && s.t < best.t) best = { t: s.t, kind: 'static', n: s };
  // terreno (marcha)
  for (let t = 1; t < best.t; t += 1.5) {
    const x = ox + dx * t, y = oy + dy * t, z = oz + dz * t;
    if (y < game.terrain.heightAt(x, z)) { best = { t, kind: 'ground' }; break; }
  }
  // vehículos
  for (const v of game.vehicles) {
    if (v.removed || v === shooter.vehicle) continue;
    const rx = v.pos.x - ox, rz = v.pos.z - oz;
    const along = rx * dx + rz * dz;
    if (along < 0 || along > best.t + 6) continue;
    // intersección con OBB 3D (en el sistema del auto)
    const f = v.fwd;
    const lx = f.z, lz = -f.x;
    const oxl = (ox - v.pos.x) * lx + (oz - v.pos.z) * lz, ozl = (ox - v.pos.x) * f.x + (oz - v.pos.z) * f.z, oyl = oy - v.pos.y;
    const dxl = dx * lx + dz * lz, dzl = dx * f.x + dz * f.z;
    let tmin = 0, tmax = best.t;
    const slab = (o, d, lo, hi) => {
      if (Math.abs(d) < 1e-8) return o >= lo && o <= hi;
      let a = (lo - o) / d, b = (hi - o) / d;
      if (a > b) { const tt = a; a = b; b = tt; }
      tmin = Math.max(tmin, a); tmax = Math.min(tmax, b);
      return tmin <= tmax;
    };
    if (slab(oxl, dxl, -v.type.W / 2, v.type.W / 2) && slab(oyl, dy, 0.2, v.type.H) && slab(ozl, dzl, -v.type.L / 2, v.type.L / 2)) {
      if (tmin < best.t) best = { t: tmin, kind: 'vehicle', v };
    }
  }
  // personajes
  for (const p of game.peds) {
    if (p === shooter || p.removed || (p.dead && p.deadT > 0.5) || p.vehicle) continue;
    const rx = p.pos.x - ox, ry = p.pos.y - oy, rz = p.pos.z - oz;
    const along = rx * dx + ry * dy + rz * dz;
    if (along < 0 || along > best.t) continue;
    // distancia del rayo al eje vertical del personaje
    const cx = ox + dx * along, cz = oz + dz * along;
    const d = Math.hypot(cx - p.pos.x, cz - p.pos.z);
    const hy = oy + dy * along;
    if (d < 0.38 && hy > p.pos.y - 0.1 && hy < p.pos.y + 1.85) {
      best = { t: along, kind: 'ped', p, head: hy > p.pos.y + 1.5 };
    }
  }
  best.x = ox + dx * best.t; best.y = oy + dy * best.t; best.z = oz + dz * best.t;
  return best;
}

export function shoot(game, ped, aimDir) {
  const W = WEAPONS[ped.weapon];
  if (!W || W.melee) return false;
  const ammo = ped.ammo[ped.weapon] || 0;
  if (ammo <= 0) { game.audio && game.audio.click(ped.pos); return false; }
  if (!ped.infiniteAmmo) ped.ammo[ped.weapon] = ammo - 1;
  const hand = ped.handWorld();
  const pellets = W.pellets || 1;
  const spread = W.spread * (ped.isPlayer ? (ped.aiming ? 0.5 : 1.2) : ped.aimSkill || 2);
  let hitSomething = false;
  for (let k = 0; k < pellets; k++) {
    tmpDir.copy(aimDir);
    tmpDir.x += rand(-spread, spread); tmpDir.y += rand(-spread, spread) * 0.7; tmpDir.z += rand(-spread, spread);
    tmpDir.normalize();
    const h = fireRay(game, ped, hand.x, hand.y, hand.z, tmpDir.x, tmpDir.y, tmpDir.z, W.range);
    if (k < 3) game.effects.tracer(hand.x, hand.y, hand.z, h.x, h.y, h.z);
    if (h.kind === 'ped') {
      const dmg = W.dmg * (h.head ? 2.2 : 1) * (ped.isPlayer ? 1 : 0.55);
      h.p.hurt(dmg, ped, { x: tmpDir.x, z: tmpDir.z, force: pellets > 1 ? 2 : 1 });
      game.effects.blood(h.x, h.y, h.z);
      hitSomething = true;
    } else if (h.kind === 'vehicle') {
      h.v.damage(W.dmg * 0.9 * (ped.isPlayer ? 1 : 0.5), ped);
      game.effects.sparks(h.x, h.y, h.z, 3);
      if (h.v.driver && h.v.driver !== ped && Math.random() < 0.25) h.v.driver.hurt(W.dmg * 0.3, ped, null);
      hitSomething = true;
    } else if (h.kind === 'static' || h.kind === 'ground') {
      if (k < 2) game.effects.dustPuff(h.x, h.y, h.z, 2, 0.7);
      if (k < 1) game.effects.sparks(h.x, h.y, h.z, 2);
    }
  }
  game.effects.muzzle(hand.x + aimDir.x * 0.3, hand.y + aimDir.y * 0.3, hand.z + aimDir.z * 0.3);
  game.audio && game.audio.gun(W.sound, ped.pos);
  game.onGunshot && game.onGunshot(ped, hitSomething);
  return true;
}

// Golpe cuerpo a cuerpo
export function melee(game, ped) {
  const W = WEAPONS[ped.weapon] && WEAPONS[ped.weapon].melee ? WEAPONS[ped.weapon] : WEAPONS.punos;
  const f = { x: Math.sin(ped.heading), z: Math.cos(ped.heading) };
  let hit = null, bd = W.range + 0.4;
  for (const p of game.peds) {
    if (p === ped || p.dead || p.vehicle || p.removed) continue;
    const dx = p.pos.x - ped.pos.x, dz = p.pos.z - ped.pos.z;
    const d = Math.hypot(dx, dz);
    if (d > bd || Math.abs(p.pos.y - ped.pos.y) > 1.2) continue;
    const dot = (dx * f.x + dz * f.z) / (d || 1);
    if (dot < 0.35) continue;
    hit = p; bd = d;
  }
  if (hit) {
    const muscle = ped.isPlayer ? 1 + (game.stats ? game.stats.muscle / 100 : 0) : 1;
    hit.hurt(W.dmg * muscle * (ped.isPlayer ? 1 : 0.6), ped, { x: f.x, z: f.z, force: W.id === 'bate' ? 2.2 : W.id === 'punos' ? 0.8 : 1.4, melee: true });
    game.audio && game.audio.punch(hit.pos);
    if (W.id !== 'punos') game.effects.blood(hit.pos.x, hit.pos.y + 1.3, hit.pos.z);
    return hit;
  }
  // golpear autos
  for (const v of game.vehicles) {
    const dx = v.pos.x - ped.pos.x, dz = v.pos.z - ped.pos.z;
    if (Math.hypot(dx, dz) < v.type.L / 2 + 0.8) {
      const dot = dx * f.x + dz * f.z;
      if (dot > 0) { v.damage(W.dmg * 0.4, ped); game.audio && game.audio.thud(v.pos, 0.3); break; }
    }
  }
  game.audio && game.audio.swoosh(ped.pos);
  return null;
}

export function reloadIfNeeded() { return clamp(0, 0, 0); }
