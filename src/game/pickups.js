import * as THREE from 'three';
import { BAGS, POI } from '../world/mapdata.js';
import { WEAPONS, weaponMesh } from './weapons.js';
import { dist, rand } from '../util.js';

function iconTexture(draw) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  draw(c.getContext('2d'));
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class Pickups {
  constructor(game) {
    this.game = game;
    this.items = [];
    const T = game.textures;
    this.tex = {
      money: iconTexture((g) => { g.fillStyle = '#2f8c2a'; g.fillRect(8, 18, 48, 28); g.strokeStyle = '#0a3a08'; g.lineWidth = 3; g.strokeRect(8, 18, 48, 28); g.fillStyle = '#d8f0c8'; g.font = 'bold 22px Arial'; g.textAlign = 'center'; g.fillText('$', 32, 41); }),
      heart: iconTexture((g) => { g.fillStyle = '#e02020'; g.beginPath(); g.moveTo(32, 54); g.bezierCurveTo(2, 34, 8, 8, 32, 22); g.bezierCurveTo(56, 8, 62, 34, 32, 54); g.fill(); g.strokeStyle = '#600'; g.lineWidth = 3; g.stroke(); }),
      armor: iconTexture((g) => { g.fillStyle = '#3a5a8a'; g.beginPath(); g.moveTo(16, 10); g.lineTo(48, 10); g.lineTo(54, 20); g.lineTo(50, 56); g.lineTo(14, 56); g.lineTo(10, 20); g.closePath(); g.fill(); g.strokeStyle = '#112'; g.lineWidth = 3; g.stroke(); g.fillStyle = '#fff'; g.font = 'bold 12px Arial'; g.textAlign = 'center'; g.fillText('POLICÍA', 32, 38); }),
      bag: T.bag,
    };
    this.spawnStatic();
  }

  add(kind, x, z, opts = {}) {
    const g = this.game;
    let obj;
    if (kind === 'weapon') {
      obj = new THREE.Group();
      const m = weaponMesh(WEAPONS[opts.weapon].mesh || 'pistola');
      if (m) { m.scale.setScalar(2); obj.add(m); }
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: g.textures.glow, color: 0x60c0ff, transparent: true, opacity: 0.6, depthWrite: false }));
      glow.scale.set(1.6, 1.6, 1);
      obj.add(glow);
    } else {
      obj = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.tex[kind], transparent: true, depthWrite: false }));
      const s = kind === 'bag' ? 0.9 : 0.8;
      obj.scale.set(s, s, s);
    }
    const y = opts.y !== undefined ? opts.y : g.world.footGround(x, z) + (kind === 'bag' ? 1.0 : 0.7);
    obj.position.set(x, y, z);
    g.scene.add(obj);
    const it = { kind, x, y, z, obj, ...opts, alive: true, t: rand(0, 6) };
    this.items.push(it);
    return it;
  }

  spawnMoney(x, z, amount) {
    const it = this.add('money', x + rand(-0.5, 0.5), z + rand(-0.5, 0.5), { value: amount, ttl: 30 });
    return it;
  }

  spawnWeapon(x, z, w, ammo) {
    if (!WEAPONS[w] || w === 'punos') return;
    this.add('weapon', x, z, { weapon: w, value: ammo, ttl: 30 });
  }

  spawnStatic() {
    const g = this.game;
    const M = g.city.markers;
    const add = (kind, x, z, opts = {}) => this.add(kind, x, z, { ...opts, respawn: 300, home: { x, z } });
    if (M.hospital) add('heart', M.hospital.x + 5, M.hospital.z);
    if (M.casaAbuela) add('heart', M.casaAbuela.x - 1, M.casaAbuela.z + 10);
    if (M.madriguera) add('heart', M.madriguera.x + 12, M.madriguera.z + 30);
    if (M.comisaria) add('armor', M.comisaria.x + 22, M.comisaria.z - 4);
    // cerca de lugares conocidos, en un lugar libre
    const near = (o, dx, dz, kind, opts) => {
      if (!o) return;
      const sp = g.safeSpot(o.x + dx, o.z + dz, 0.6);
      add(kind, sp.x, sp.z, opts);
    };
    near(POI.depositoCrudo, 6, -8, 'armor');
    near(POI.antenas, 5, 5, 'weapon', { weapon: 'pistola', value: 34 });
    near(POI.puerto, -8, 6, 'weapon', { weapon: 'escopeta', value: 16 });
    near(POI.yacimiento, 12, -6, 'weapon', { weapon: 'uzi', value: 90 });
    near(POI.garagePetroca, -3, -6, 'weapon', { weapon: 'bate', value: 1 });
    near(POI.loberia, 6, -6, 'weapon', { weapon: 'pistola', value: 34 });
    near(POI.yacimiento, -8, 8, 'heart');
    // bolsitas coleccionables
    BAGS.forEach(([x, z], i) => {
      if (g.saves && g.saves.bagCollected(i)) return;
      this.add('bag', x, z, { bag: i, y: g.terrain.groundAt(x, z) + 1.0 });
    });
  }

  refreshBags() {
    for (const it of this.items) if (it.kind === 'bag' && this.game.saves.bagCollected(it.bag)) this.hide(it);
  }

  hide(it) {
    it.alive = false;
    it.obj.visible = false;
    if (it.respawn) it.back = this.game.time + it.respawn;
    else if (it.kind !== 'bag') { this.game.scene.remove(it.obj); it.removed = true; }
  }

  update(dt) {
    const g = this.game;
    const p = g.player;
    const pp = p.vehicle ? p.vehicle.pos : p.pos;
    for (const it of this.items) {
      if (it.removed) continue;
      if (!it.alive) {
        if (it.back && g.time > it.back) { it.alive = true; it.obj.visible = true; }
        continue;
      }
      it.t += dt;
      if (it.kind === 'weapon') it.obj.rotation.y += dt * 2;
      it.obj.position.y = it.y + Math.sin(it.t * 3) * 0.12;
      if (it.kind === 'bag') it.obj.material.rotation = Math.sin(it.t * 4) * 0.25;
      if (it.ttl !== undefined) { it.ttl -= dt; if (it.ttl <= 0) { this.hide(it); continue; } }
      const d = dist(it.x, it.z, pp.x, pp.z);
      const reach = p.vehicle ? 2.5 : 1.3;
      if (d < reach && Math.abs(it.y - pp.y) < 2.5) this.collect(it);
    }
    this.items = this.items.filter((it) => !it.removed);
  }

  collect(it) {
    const g = this.game;
    const p = g.player;
    if (it.kind === 'money') { g.addMoney(it.value); }
    else if (it.kind === 'heart') {
      if (p.health >= p.maxHealth) return;
      p.health = p.maxHealth; g.audio.pickup();
      g.hud.showToast('Salud al máximo', 2);
    } else if (it.kind === 'armor') {
      if (p.armor >= 100) return;
      p.armor = 100; g.audio.pickup();
      g.hud.showToast('Chaleco antibalas', 2);
    } else if (it.kind === 'weapon') {
      if (p.vehicle) return;
      p.give(it.weapon, it.value);
      if (p.weapon === 'punos' || p.weapon === 'clavas') p.setWeapon(it.weapon);
      g.audio.pickup();
      g.hud.showToast(WEAPONS[it.weapon].name, 2);
    } else if (it.kind === 'bag') {
      g.saves.collectBag(it.bag);
      g.stats.bags = g.saves.bagCount();
      g.addMoney(100);
      g.audio.pickup();
      const total = 24;
      g.hud.showToast(`Bolsita de La Anómala ${g.stats.bags} de ${total}`, 3);
      if (g.stats.bags >= total) {
        g.addMoney(10000);
        g.hud.bigText('¡LIMPIASTE COMODORO!', '+$10.000 — Ahora el viento no te frena', 5);
        g.cheats.windImmune = true;
      }
    }
    this.hide(it);
  }
}
