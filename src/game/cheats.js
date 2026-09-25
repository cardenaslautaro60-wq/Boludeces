// Trucos: se escriben durante el juego, como en San Andreas para PC
import { Brain } from './ai.js';
import { LANDMARKS } from '../world/mapdata.js';

export class Cheats {
  constructor(game) {
    this.game = game;
    this.keepWeapons = false;
    this.windImmune = false;
    this.list = {
      HESOYAM: ['Salud, chaleco y $250.000', (g) => { const p = g.player; p.health = p.maxHealth; p.armor = 100; g.addMoney(250000); if (p.vehicle) { p.vehicle.health = 1000; p.vehicle.fireT = 0; } }],
      BUENAPETROCA: ['La chata del Petroca y $10.000', (g) => { this.spawnNear('jilux', 0xb01818); g.addMoney(10000); }],
      AEZAKMI: ['Nunca buscado', (g) => { g.police.neverWanted = !g.police.neverWanted; g.police.clear(); }],
      ASNAEB: ['Sin nivel de búsqueda', (g) => g.police.clear()],
      OSRBLHH: ['+2 estrellas', (g) => g.police.setLevel(Math.min(6, g.police.level + 2))],
      LXGIWYL: ['Armas del barrio', (g) => { const p = g.player; p.give('bate'); p.give('pistola', 100); p.give('escopeta', 40); p.give('uzi', 300); p.setWeapon('uzi'); }],
      BTCDBCB: ['Gordopin XXL', (g) => { g.stats.fat = 100; g.activities.updateBody(); }],
      KVGYZQK: ['Gordopin flaco', (g) => { g.stats.fat = 0; g.activities.updateBody(); }],
      JYSDSOD: ['Músculo máximo', (g) => { g.stats.muscle = 100; g.activities.updateBody(); }],
      VIENTOBLANCO: ['Temporal de viento', (g) => { g.env.forcedWeather = g.env.forcedWeather ? null : 'temporal'; if (!g.env.forcedWeather) g.env.setWeather('despejado'); }],
      XJVSNAJ: ['Siempre medianoche', (g) => { g.env.time = 0; }],
      CPKTNWT: ['Explotan todos los autos', (g) => { for (const v of g.vehicles) if (!v.dead && !(v.driver && v.driver.isPlayer)) v.explode(); }],
      CHORIPAN: ['Salud completa', (g) => { g.player.health = g.player.maxHealth; }],
      AGUANTENEWBERY: ['La barra del Lobo te acompaña', (g) => this.lobos()],
      REMISERO: ['Remís', () => this.spawnNear('remis')],
      PATRULLERO: ['Patrullero', () => this.spawnNear('patrullero')],
      CISTERNA: ['Camión cisterna', () => this.spawnNear('cisterna')],
      ENDURO: ['Moto enduro', () => this.spawnNear('enduro')],
      FITITO: ['Fitito 600', () => this.spawnNear('fitito')],
      // de Comodoro
      CHENQUE: ['Arriba del Cerro Chenque', () => this.tp(['miradorChenque', 'chenque'])],
      MADRIGUERA: ['A La Madriguera', () => this.tp(['madriguera', 'estadio'])],
      LOBERIA: ['A la lobería de Punta del Marqués', () => this.tp(['puntaMarques', 'puntaMarquesPeak'])],
      RADATILLY: ['A la playa de Rada Tilly', () => this.tp(['rada'])],
      SUPERSALTO: ['Salto de guanaco', (g) => { const p = g.player; p.jumpMul = p.jumpMul > 1 ? 1 : 3; for (const q of [g.gordopin, g.petroca]) if (q) q.jumpMul = p.jumpMul; }],
      BALASINFINITAS: ['Balas infinitas, sin recargar', (g) => { for (const q of [g.gordopin, g.petroca]) if (q) q.infiniteAmmo = !q.infiniteAmmo; }],
      PETRODOLARES: ['Regalías petroleras: $500.000', (g) => g.addMoney(500000)],
      TORTAFRITA: ['Tortas fritas: salud, chaleco y unos kilos', (g) => { const p = g.player; p.health = p.maxHealth; p.armor = 100; g.stats.fat = Math.min(100, g.stats.fat + 10); g.activities.updateBody(); }],
      VIENTAZO: ['Vientazo de 120 km/h', (g) => g.events.start('vientazo')],
      TIERRA: ['Temporal de tierra', (g) => g.events.start('tierra')],
      NEVADA: ['Nieva en Comodoro', (g) => g.events.start('nevada')],
      CORTEDERUTA: ['Corte de ruta', (g) => g.events.start('piquete')],
      ANIVERSARIO: ['Fuegos artificiales del aniversario', (g) => g.events.start('aniversario')],
      APAGON: ['Corte de luz', (g) => g.events.start('apagon')],
      CARAVANA: ['Caravana del Lobo', (g) => g.events.start('caravana')],
    };
  }

  check(typed) {
    for (const code of Object.keys(this.list)) {
      if (typed.endsWith(code)) {
        const [name, fn] = this.list[code];
        fn(this.game);
        this.game.hud && this.game.hud.showToast(`Truco activado<br><small>${name}</small>`, 2.5);
        this.game.audio && this.game.audio.pickup();
        this.game.input.typed = '';
        return true;
      }
    }
    return false;
  }

  // Teletransporte a un lugar de Comodoro (con el auto, si está manejando)
  tp(keys) {
    const g = this.game, p = g.player;
    const L = keys.map((k) => LANDMARKS[k]).find(Boolean);
    if (!L) return;
    const { x, z } = g.safeSpot(L.x, L.z, p.vehicle ? 2.2 : 0.6, !!p.vehicle);
    if (p.vehicle) { const v = p.vehicle; v.pos.set(x, g.terrain.groundAt(x, z) + 0.3, z); v.vx = v.vz = 0; v.vy = 0; }
    else { p.pos.set(x, g.world.footGround(x, z), z); p.vx = p.vz = p.vy = 0; }
    g.cameraRig.snapBehind(p.vehicle ? p.vehicle.heading : p.heading);
  }

  spawnNear(key, color) {
    const g = this.game;
    const p = g.player;
    const f = { x: Math.sin(p.heading), z: Math.cos(p.heading) };
    const x = p.pos.x + f.x * 6, z = p.pos.z + f.z * 6;
    const v = g.spawnVehicle(key, x, z, p.heading + Math.PI / 2, color !== undefined ? { color } : {});
    g.lastPlayerVehicle = v;
    return v;
  }

  lobos() {
    const g = this.game;
    const p = g.player;
    for (let i = 0; i < 3; i++) {
      const x = p.pos.x + Math.cos(i * 2) * 4, z = p.pos.z + Math.sin(i * 2) * 4;
      const q = g.spawnPed('lobo', x, z);
      q.give('bate'); q.give('pistola', 60); q.setWeapon('pistola');
      q.isFriend = true;
      q.spawned = true;
      q.brain = new Brain(g, q, 'follow');
    }
  }
}
