import { lerp, chance } from '../util.js';

// Cuánta gente y cuántos autos hay según la zona y la hora (como las zonas de Vice City):
// el Centro se llena a la mañana y a la tarde y queda vacío en la siesta y de madrugada, los
// barrios se mueven a la salida del colegio y a la nochecita, en los kilómetros y la ruta hay
// picos en los cambios de turno del petróleo y en Rada Tilly hay gente a la tarde.
//
// Curvas: pares [hora, factor] (1 = lo normal del juego). Mezcla: qué tipo de gente camina.
const PERFIL = {
  centro: {
    peds: [[0, 0.25], [6, 0.25], [8, 0.9], [10, 1.15], [13, 1.05], [13.7, 0.45], [16.3, 0.5], [17.5, 1.15], [20.5, 1.05], [22, 0.6], [24, 0.25]],
    cars: [[0, 0.3], [6, 0.35], [7.5, 1.1], [12.5, 1.15], [13.7, 0.6], [16.3, 0.7], [18, 1.2], [21, 0.8], [24, 0.3]],
    parked: [[0, 0.5], [8, 1.1], [20, 1.05], [24, 0.5]],
    dia: { civil: 0.86, petrolero: 0.08, cheto: 0.03, abuela: 0.03 },
    noche: { civil: 0.75, cheto: 0.2, petrolero: 0.05 },
  },
  barrio: {
    peds: [[0, 0.15], [6, 0.2], [7.5, 0.75], [9, 0.6], [11, 0.75], [13.5, 0.4], [16.5, 0.6], [19, 0.9], [21.5, 0.45], [24, 0.15]],
    cars: [[0, 0.25], [6, 0.35], [7.5, 0.9], [9, 0.6], [13, 0.75], [14, 0.5], [18.5, 0.95], [22, 0.45], [24, 0.25]],
    parked: [[0, 1.2], [8, 0.8], [18, 0.9], [21, 1.2], [24, 1.2]],
    dia: { civil: 0.78, abuela: 0.14, petrolero: 0.08 },
    noche: { civil: 0.9, petrolero: 0.1 },
  },
  km: {
    peds: [[0, 0.1], [5.5, 0.15], [6.5, 0.6], [8, 0.35], [12, 0.45], [17.5, 0.4], [18.5, 0.7], [20, 0.35], [22, 0.15], [24, 0.1]],
    cars: [[0, 0.3], [5, 0.4], [6.5, 1.3], [8, 0.7], [12, 0.8], [17.5, 0.8], [18.5, 1.3], [20, 0.6], [24, 0.3]],
    parked: [[0, 1], [24, 1]],
    dia: { civil: 0.5, petrolero: 0.45, abuela: 0.05 },
    noche: { civil: 0.4, petrolero: 0.6 },
  },
  industrial: {
    peds: [[0, 0.05], [6, 0.1], [7, 0.55], [12, 0.6], [13, 0.35], [14, 0.55], [18, 0.5], [19.5, 0.1], [24, 0.05]],
    cars: [[0, 0.2], [6, 0.5], [7, 1.1], [12, 0.9], [18, 1.0], [19.5, 0.35], [24, 0.2]],
    parked: [[0, 0.5], [7, 1.2], [18, 1.2], [20, 0.5], [24, 0.5]],
    dia: { petrolero: 0.65, civil: 0.35 },
    noche: { petrolero: 0.7, civil: 0.3 },
  },
  rada: {
    peds: [[0, 0.15], [8, 0.2], [10.5, 0.5], [15, 0.95], [19, 0.85], [21, 0.5], [23, 0.3], [24, 0.15]],
    cars: [[0, 0.3], [8, 0.6], [13, 0.7], [16, 1.0], [20, 0.9], [23, 0.5], [24, 0.3]],
    parked: [[0, 1], [24, 1]],
    dia: { civil: 0.6, cheto: 0.35, abuela: 0.05 },
    noche: { civil: 0.5, cheto: 0.5 },
  },
  meseta: {
    peds: [[0, 0.08], [24, 0.08]],
    cars: [[0, 0.25], [5, 0.3], [6.5, 1.2], [8, 0.6], [17.5, 0.6], [18.5, 1.2], [20, 0.4], [24, 0.25]],
    parked: [[0, 0.6], [24, 0.6]],
    dia: { petrolero: 0.8, civil: 0.2 },
    noche: { petrolero: 0.9, civil: 0.1 },
  },
  ruta: {
    peds: [[0, 0.06], [24, 0.06]],
    cars: [[0, 0.3], [5, 0.35], [6.5, 1.2], [8.5, 0.8], [13, 0.9], [18.5, 1.25], [21, 0.6], [24, 0.3]],
    parked: [[0, 0.4], [24, 0.4]],
    dia: { civil: 0.5, petrolero: 0.5 },
    noche: { civil: 0.4, petrolero: 0.6 },
  },
};
PERFIL.viviendas = PERFIL.barrio;

// Con viento fuerte y temporal la gente se guarda; con nieve también manejan menos
const CLIMA = { despejado: [1, 1], nublado: [0.9, 1], ventoso: [0.7, 1], temporal: [0.3, 0.85], nevada: [0.45, 0.75] };

function curve(pts, h) {
  for (let i = 0; i < pts.length - 1; i++) {
    const [h0, v0] = pts[i], [h1, v1] = pts[i + 1];
    if (h >= h0 && h <= h1) return lerp(v0, v1, (h - h0) / (h1 - h0 || 1));
  }
  return pts[pts.length - 1][1];
}

const noche = (h) => h >= 21.5 || h < 6;
const turno = (h) => (h >= 5.5 && h < 7.5) || (h >= 17.5 && h < 19.5);

export class Densidad {
  constructor(game) {
    this.game = game;
    this.t = 0;
    // valores actuales alrededor del jugador (se acercan de a poco a los de la zona y la hora)
    this.cur = { peds: 1, cars: 1, parked: 1, zone: 'barrio' };
  }

  // Tipo de perfil para un punto del mapa
  zoneKey(x, z) {
    const zt = this.game.world.zoneTypeAt(x, z);
    return PERFIL[zt] ? zt : 'barrio';
  }

  target(zone, h) {
    const P = PERFIL[zone] || PERFIL.barrio;
    const env = this.game.env;
    const w = CLIMA[env.weatherT > 0.5 ? env.weatherTarget : env.weather] || CLIMA.despejado;
    return { peds: curve(P.peds, h) * w[0], cars: curve(P.cars, h) * w[1], parked: curve(P.parked, h) };
  }

  update(dt) {
    this.t -= dt;
    if (this.t > 0) return;
    this.t = 1;
    const g = this.game;
    const p = g.player;
    const pp = p.vehicle ? p.vehicle.pos : p.pos;
    const zone = this.zoneKey(pp.x, pp.z);
    const T = this.target(zone, g.env.hours);
    const c = this.cur;
    // al cambiar de zona o de hora la calle se llena o se vacía en unos segundos, no de golpe
    const k = c.zone === zone ? 0.25 : 0.12;
    c.peds = lerp(c.peds, T.peds, k);
    c.cars = lerp(c.cars, T.cars, k);
    c.parked = lerp(c.parked, T.parked, k);
    c.zone = zone;
  }

  // Qué tipo de peatón aparece en (x, z) a esta hora
  pedKind(x, z) {
    const P = PERFIL[this.zoneKey(x, z)] || PERFIL.barrio;
    const mix = noche(this.game.env.hours) ? P.noche : P.dia;
    let r = Math.random();
    for (const [k, w] of Object.entries(mix)) { r -= w; if (r <= 0) return k; }
    return 'civil';
  }

  // Ajusta el auto que va a aparecer según la hora: remises y patrulleros de noche, chatas de
  // empresa en los cambios de turno
  carKey(zk, key) {
    const h = this.game.env.hours;
    if (noche(h)) {
      if (zk === 'centro' && chance(0.35)) return 'remis';
      if (chance(0.04)) return 'patrullero';
    }
    if (turno(h) && (zk === 'km' || zk === 'ruta' || zk === 'tierra') && chance(0.5)) return 'empresa';
    return key;
  }

  // Para depurar: __game.densidad.info()
  info() {
    const c = this.cur;
    return { zona: c.zone, hora: this.game.env.clockString(), gente: +c.peds.toFixed(2), autos: +c.cars.toFixed(2), estacionados: +c.parked.toFixed(2) };
  }
}

export { PERFIL };
