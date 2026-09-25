import { safeStorageGet, safeStorageSet } from '../util.js';
import { SPAWNS } from '../world/mapdata.js';

const KEY = 'gtasj-save-1';

export class SaveSystem {
  constructor(game) {
    this.game = game;
    this.bags = new Set();
  }

  bagCollected(i) { return this.bags.has(i); }
  collectBag(i) { this.bags.add(i); }
  bagCount() { return this.bags.size; }

  exists() { return !!safeStorageGet(KEY); }

  snapshot() {
    const g = this.game;
    const ch = (p) => ({ owned: p.owned, ammo: Object.fromEntries(Object.entries(p.ammo).map(([k, v]) => [k, v === Infinity ? -1 : v])), weapon: p.weapon, armor: p.armor });
    return {
      v: 1,
      money: g.money,
      stats: g.stats,
      missions: g.missions.done,
      time: g.env.time,
      gordopin: ch(g.gordopin),
      petroca: ch(g.petroca),
      companion: g.companionActive,
      bags: [...this.bags],
      jumps: [...g.activities.jumpsDone],
      date: new Date().toISOString(),
    };
  }

  save() {
    const data = this.snapshot();
    return safeStorageSet(KEY, JSON.stringify(data));
  }

  load() {
    const raw = safeStorageGet(KEY);
    if (!raw) return false;
    let d;
    try { d = JSON.parse(raw); } catch (e) { return false; }
    this.apply(d);
    return true;
  }

  apply(d) {
    const g = this.game;
    g.money = d.money || 0;
    Object.assign(g.stats, d.stats || {});
    g.missions.done = d.missions || [];
    g.env.time = d.time || 9 * 60;
    const rest = (p, c) => {
      if (!c) return;
      p.owned = c.owned || ['punos'];
      p.ammo = {};
      for (const [k, v] of Object.entries(c.ammo || {})) p.ammo[k] = v < 0 ? Infinity : v;
      p.ammo.punos = Infinity;
      p.armor = c.armor || 0;
      p.setWeapon(p.owned.includes(c.weapon) ? c.weapon : 'punos');
    };
    rest(g.gordopin, d.gordopin);
    rest(g.petroca, d.petroca);
    this.bags = new Set(d.bags || []);
    g.activities.jumpsDone = new Set(d.jumps || []);
    g.pickups.refreshBags();
    const c = SPAWNS.casa;
    const M = g.city.markers.casaAbuela || c;
    g.gordopin.pos.set(M.x + 3, g.world.footGround(M.x + 3, M.z), M.z);
    g.player = g.gordopin; g.companion = g.petroca;
    g.gordopin.isPlayer = true; g.petroca.isPlayer = false;
    if (d.companion) g.setCompanionActive(true, M.x + 4, M.z + 2);
    g.activities.updateBody();
    g.missions.refresh();
  }
}
