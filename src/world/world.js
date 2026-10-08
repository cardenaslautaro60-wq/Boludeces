import * as THREE from 'three';
import { Terrain, buildWater } from './terrain.js';
import { RoadNetwork } from './roads.js';
import { City, findPortPier } from './city.js';
import { Props } from './props.js';
import { Zones } from './zones.js';
import { StaticColliders } from './collision.js';
import { DistanceCuller, releaseAfterUpload } from './culling.js';
import { makeTextures } from '../render/textures.js';
import { STYLE } from '../render/style.js';
import { META, MAP, FRAME, LANDMARKS, POI, SPAWNS, RAMPS, BAGS, DECKS, loadMapData } from './mapdata.js';
import { RNG, pointSegDist } from '../util.js';

const nextFrame = () => new Promise((r) => setTimeout(r, 0));

// Apodos de los barrios del norte (en Comodoro se los conoce por el kilómetro)
const KM = [
  [/Mosconi|Marquesado|Ameghino|Belgrano|Sismogr|Médanos|Caballeriza|Castelli|Juan José Paso|Cuarteles/i, 'Km 3'],
  [/Ortiz|Rodriguez Peña|Rodríguez Peña|Azcuénaga|Pietrobelli Norte|SIPGER|Costa Atl|Los Olivos|Ruca|Eco Vida/i, 'Km 5'],
  [/Don Bosco|Standard|Fontana|Restinga|Ferrocarril|COMIPA|Petroleros Privados|Los Locos|Central|Prospero|Próspero/i, 'Km 8'],
];

export class World {
  constructor(game) {
    this.game = game;
  }

  async build(report = () => {}) {
    // tiempos de cada etapa de la carga (para medir: __game.world.timings)
    const t0 = performance.now();
    this.timings = [];
    const mem = () => { if (window.gc) window.gc(); return performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1e6) : 0; };
    const progress = (f, msg) => { this.timings.push([msg, Math.round(performance.now() - t0), mem()]); report(f, msg); };
    const g = this.game;
    progress(0.04, 'Bajando el mapa de Comodoro...');
    await nextFrame();
    await loadMapData();
    progress(0.08, 'Levantando la meseta y el Chenque...');
    await nextFrame();
    const terrain = new Terrain();
    progress(0.16, 'Trazando la Ruta 3...');
    await nextFrame();
    const roads = new RoadNetwork();
    roads.buildMask();
    const zones = new Zones();
    g.zones = zones;
    for (const e of roads.edges) {
      const A = roads.nodes[e.a], B = roads.nodes[e.b];
      const zn = zones.zoneAt((A.x + B.x) / 2, (A.z + B.z) / 2);
      e.urban = !!zn;
      e.sw = e.urban && e.kind !== 'peatonal' && terrain.heightAt((A.x + B.x) / 2, (A.z + B.z) / 2) > 0.6;
    }
    this.buildDecks();
    g.decks = DECKS;
    this.placeRamps(roads, terrain);
    const flat = roads.computeHeights(terrain);
    terrain.flattenRoads(flat);
    terrain.buildRamps();
    for (const n of roads.nodes) n.h = terrain.heightAt(n.x, n.z);
    terrain.markUrban(roads);
    g.terrain = terrain;
    g.roads = roads;
    progress(0.26, 'Pintando la estepa...');
    await nextFrame();
    const textures = makeTextures();
    // versión realista: fotos y fachadas con relieve en lugar de las texturas PS2
    if (STYLE.realista) STYLE.realTextures(textures, STYLE.tex);
    g.textures = textures;
    this.terrainMesh = terrain.buildMesh(roads);
    g.scene.add(this.terrainMesh);
    this.water = buildWater(terrain);
    g.scene.add(this.water);
    progress(0.38, 'Asfaltando calles...');
    await nextFrame();
    this.roadMesh = roads.buildMeshes(terrain, textures);
    g.scene.add(this.roadMesh);
    progress(0.48, 'Levantando el Centro y los barrios...');
    await nextFrame();
    const colliders = new StaticColliders();
    g.colliders = colliders;
    const city = new City();
    g.city = city;
    city.wells = [];
    for (let i = 0; i < MAP.points.length; i += 3) if (MAP.points[i] === 0) city.wells.push([MAP.points[i + 1] / 2, MAP.points[i + 2] / 2]);
    city.build(g);
    this.placePOIs(roads, terrain, city);
    this.placeBags(roads, terrain, city);
    progress(0.72, 'Instalando cigüeñas...');
    await nextFrame();
    const props = new Props();
    g.props = props;
    props.build(g);
    progress(0.82, 'Soplando el viento...');
    await nextFrame();
    // lo que queda detrás de la niebla no se dibuja
    this.culler = new DistanceCuller();
    this.culler.addTree(city.group);
    this.culler.addTree(this.roadMesh);
    this.culler.addTree(props.group);
    // memoria: los acumuladores de la ciudad ya no hacen falta, y la geometría fija se
    // queda solo en la placa de video
    city.chunks = null; city.lean = null;
    for (const r of [this.terrainMesh, this.roadMesh, city.group, props.group, this.water]) releaseAfterUpload(r);
    this.zoneCache = { x: 1e9, z: 1e9, name: '' };
    this.timings.push(['fin', Math.round(performance.now() - t0), mem()]);
  }

  // Muelles reales (OSM) como plataformas elevadas
  buildDecks() {
    DECKS.length = 0;
    for (const p of META.piers || []) {
      for (let k = 0; k < p.length - 1; k++) {
        const [x0, z0] = p[k], [x1, z1] = p[k + 1];
        const L = Math.hypot(x1 - x0, z1 - z0);
        if (L < 8) continue;
        DECKS.push({ cx: (x0 + x1) / 2, cz: (z0 + z1) / 2, ax: (x1 - x0) / L, az: (z1 - z0) / L, hw: L / 2 + 3, hd: 6, h: 2.6 });
      }
    }
  }

  // Rampas de saltos únicos al final de calles sin salida: primero las de los lugares lindos
  // (en el mismo orden de siempre, para no mezclar las partidas guardadas) y después otras
  // repartidas por todo el mapa, cada una lo más lejos posible de las demás
  placeRamps(roads, terrain) {
    RAMPS.length = 0;
    const esc = Math.max(0.5, META.escala || 1);
    const SIZE = { madera: [14, 4.2], tierra: [16, 4.6], chapa: [12, 4] };
    const WB = this.game.worldBounds;
    const kindOf = (e, x, z) => {
      if (e.kind === 'tierra') return 'tierra';
      const pu = LANDMARKS.puerto;
      if (pu && Math.hypot(pu.x - x, pu.z - z) < 300 * esc) return 'chapa';
      return 'madera';
    };
    // ¿se puede saltar desde esta punta? piso parejo bajo la rampa y una pista de aterrizaje
    // libre (sin mar, sin calles y sin una loma enfrente) de 20 a 60 m más allá
    const spot = (n) => {
      const e = roads.edges[n.edges[0]];
      if (e.kind === 'ruta' || e.kind === 'peatonal' || e.kind === 'muelle' || e.len < 20) return null;
      const o = roads.nodes[roads.otherNode(e, n.id)];
      const dx = (n.x - o.x) / e.len, dz = (n.z - o.z) / e.len;
      const kind = kindOf(e, n.x, n.z);
      const [len] = SIZE[kind];
      let lo = Infinity, hi = -Infinity;
      for (let s = 1; s <= len + 1; s += 2) { const h = terrain.heightAt(n.x + dx * s, n.z + dz * s); lo = Math.min(lo, h); hi = Math.max(hi, h); }
      if (lo < 1.5 || hi - lo > 1.6) return null;
      for (let s = len + 20; s <= len + 60; s += 8) {
        const x = n.x + dx * s, z = n.z + dz * s, hh = terrain.heightAt(x, z);
        if (!WB.inside(x, z, 60) || hh < 1 || hh > hi + 2.5 || hh < lo - 12 || roads.clearance(x, z, 12) < 7) return null;
      }
      return { n, e, dx, dz, kind };
    };
    const used = [];
    const add = (c, place) => {
      const [len, h] = SIZE[c.kind];
      used.push([c.n.x, c.n.z]);
      RAMPS.push({ x: c.n.x + c.dx * (len / 2 + 1), z: c.n.z + c.dz * (len / 2 + 1), rot: Math.atan2(c.dx, c.dz), len, h, w: 7, kind: c.kind, place });
    };
    const ends = roads.nodes.filter((n) => n.edges.length === 1).map(spot).filter(Boolean);
    for (const k of ['miradorChenque', 'rada', 'puerto', 'museoPetroleo', 'aeropuerto', 'caleta', 'madriguera', 'puntaMarques']) {
      const L = LANDMARKS[k];
      if (!L) continue;
      let best = null, bd = 900;
      for (const c of ends) {
        const d = Math.hypot(c.n.x - L.x, c.n.z - L.z);
        if (d > bd || used.some((u) => Math.hypot(u[0] - c.n.x, u[1] - c.n.z) < 150)) continue;
        bd = d; best = c;
      }
      if (best) add(best, k);
    }
    // saltos nuevos: puntas con carrera larga, cada una la más alejada de las que ya hay
    const cands = ends.filter((c) => c.e.len >= 35);
    for (let k = 0; k < 10 && cands.length; k++) {
      let best = -1, bd = 0;
      for (let i = 0; i < cands.length; i++) {
        const c = cands[i];
        let d = Infinity;
        for (const u of used) d = Math.min(d, Math.hypot(u[0] - c.n.x, u[1] - c.n.z));
        if (d > bd) { bd = d; best = i; }
      }
      if (best < 0 || bd < 450 * esc) break;
      const c = cands.splice(best, 1)[0];
      const zn = this.game.zones && this.game.zones.zoneAt(c.n.x, c.n.z);
      add(c, zn ? zn.name : c.e.name || '');
    }
  }

  // Semáforo real del Centro, chori de la costanera, lobería, antenas, reapariciones
  placePOIs(roads, terrain, city) {
    const cat = LANDMARKS.catedral || { x: -420, z: -57 };
    const cross = ['25 de Mayo', 'España', 'Pellegrini', 'Mitre', 'Güemes', 'Belgrano', '9 de Julio', 'Sarmiento', 'Rawson', 'Urquiza'];
    let sem = null, sd = Infinity;
    for (const n of roads.nodes) {
      if (n.edges.length < 3) continue;
      const es = n.edges.map((i) => roads.edges[i]);
      const sm = es.find((e) => /^San Martín$|Libertador General San Martín/.test(e.name));
      const other = es.find((e) => cross.includes(e.name));
      if (!sm || !other) continue;
      const d = Math.hypot(n.x - cat.x, n.z - cat.z);
      if (d < sd) { sd = d; sem = { n, sm, other }; }
    }
    if (!sem) {
      // cualquier cruce grande cerca de la Catedral
      let best = null, bd = Infinity;
      for (const n of roads.nodes) {
        if (n.edges.length < 4) continue;
        const d = Math.hypot(n.x - cat.x, n.z - cat.z);
        if (d < bd) { bd = d; best = n; }
      }
      if (best) sem = { n: best, sm: roads.edges[best.edges[0]], other: roads.edges[best.edges[1]] };
    }
    if (sem) {
      const off = sem.n.maxW / 2 + 1.3;
      const d = [sem.sm.dx, sem.sm.dz], nrm = [-sem.sm.dz, sem.sm.dx];
      POI.semaforo = {
        x: sem.n.x, z: sem.n.z, name: `Semáforo de ${sem.sm.name || 'San Martín'} y ${sem.other.name || 'Rivadavia'}`, w: sem.n.maxW, dir: d,
        corner: { x: sem.n.x + (d[0] + nrm[0]) * off, z: sem.n.z + (d[1] + nrm[1]) * off },
      };
    }
    // El Chori del Viento (si la ciudad no encontró lugar): vereda cerca de la costanera
    if (!POI.chori) {
      const sob = LANDMARKS.plazaSoberania || LANDMARKS.puerto || cat;
      const r3 = new RNG(3);
      const sw = city.randomSidewalk(sob.x, sob.z, 5, 60, () => r3.next());
      POI.chori = sw ? { x: sw.x, z: sw.z, name: 'El Chori del Viento' } : { x: sob.x, z: sob.z, name: 'El Chori del Viento' };
    }
    // Muelle más largo del puerto (Muelle de Ultramar) y el puerto
    const pier = findPortPier(terrain);
    if (pier) {
      POI.muelle = { ...pier, name: 'Muelle de Ultramar' };
      POI.puerto = { x: pier.x - pier.dx * 40, z: pier.z - pier.dz * 40, name: 'Puerto' };
    } else if (LANDMARKS.puerto) {
      // el espigón del puerto es parte de la costa: la punta de tierra que más entra al mar
      const b0 = LANDMARKS.puerto;
      let tip = null, bmin = Infinity;
      for (let dx = -500; dx <= 500; dx += 8) for (let dz = -500; dz <= 500; dz += 8) {
        const x = b0.x + dx, z = b0.z + dz;
        if (terrain.heightAt(x, z) < 1.2) continue;
        const b = x * FRAME.vx + z * FRAME.vz;
        if (b < bmin) { bmin = b; tip = [x, z]; }
      }
      POI.puerto = { x: b0.x, z: b0.z, name: 'Puerto' };
      if (tip) {
        const L = Math.hypot(tip[0] - b0.x, tip[1] - b0.z) || 1;
        POI.muelle = { x: b0.x, z: b0.z, tx: tip[0], tz: tip[1], dx: (tip[0] - b0.x) / L, dz: (tip[1] - b0.z) / L, name: 'Espigón del Puerto' };
      }
    }
    // Lobería de Punta del Marqués: playa al pie de la punta
    const pm = LANDMARKS.puntaMarques || LANDMARKS.puntaMarquesPeak;
    if (pm) {
      let best = null, bd = Infinity;
      for (let k = 0; k < 400; k++) {
        const a = (k / 400) * Math.PI * 2 * 7, r = 20 + (k / 400) * 500;
        const x = pm.x + Math.cos(a) * r, z = pm.z + Math.sin(a) * r;
        const h = terrain.heightAt(x, z), s = terrain.seaDist(x, z);
        if (h < 0.3 || h > 4 || s > 35) continue;
        const d = Math.hypot(x - pm.x, z - pm.z);
        if (d < bd) { bd = d; best = [x, z]; }
      }
      if (best) POI.loberia = { x: best[0], z: best[1], name: 'Lobería de Punta del Marqués' };
    }
    // Antenas del Chenque: en la cima del cerro
    const ch = LANDMARKS.chenque || LANDMARKS.miradorChenque;
    if (ch) {
      let best = [ch.x, ch.z], bh = -Infinity;
      for (let dx = -120; dx <= 120; dx += 10) for (let dz = -120; dz <= 120; dz += 10) {
        const h = terrain.heightAt(ch.x + dx, ch.z + dz);
        if (h > bh && roads.clearance(ch.x + dx, ch.z + dz, 12) > 6) { bh = h; best = [ch.x + dx, ch.z + dz]; }
      }
      POI.antenas = { x: best[0], z: best[1], name: 'Antenas del Chenque' };
    }
    // Reapariciones
    const M = city.markers;
    const face = (m, fallback) => (m ? { x: m.x, z: m.z, rot: Math.PI } : fallback);
    SPAWNS.hospital = face(M.hospital, { x: cat.x, z: cat.z, rot: 0 });
    SPAWNS.comisaria = face(M.comisaria, SPAWNS.hospital);
    SPAWNS.casa = face(M.casaAbuela, SPAWNS.hospital);
  }

  // 24 bolsitas de La Anómala enganchadas en alambrados, repartidas por todo el mapa
  placeBags(roads, terrain, city) {
    BAGS.length = 0;
    const rng = new RNG(1907);
    const anchors = [];
    for (const k of Object.keys(LANDMARKS).sort()) anchors.push([LANDMARKS[k].x, LANDMARKS[k].z]);
    for (const p of META.places) anchors.push([p.x, p.z]);
    const pick = [];
    // elegir anclas separadas entre sí
    const pool = anchors.slice();
    while (pick.length < 24 && pool.length) {
      const i = Math.floor(rng.next() * pool.length);
      const [x, z] = pool.splice(i, 1)[0];
      if (pick.some(([a, b]) => Math.hypot(a - x, b - z) < 260)) continue;
      pick.push([x, z]);
    }
    for (const [ax, az] of pick) {
      for (let k = 0; k < 30; k++) {
        const a = rng.range(0, Math.PI * 2), r = rng.range(40, 160);
        const x = ax + Math.cos(a) * r, z = az + Math.sin(a) * r;
        if (terrain.heightAt(x, z) < 1.5 || terrain.seaDist(x, z) < 20) continue;
        if (roads.clearance(x, z, 20) < 6) continue;
        if (!city.isFree({ cx: x, cz: z, ax: 1, az: 0, hw: 6, hd: 6 })) continue;
        BAGS.push([Math.round(x), Math.round(z)]);
        city.reserve({ cx: x, cz: z, ax: 1, az: 0, hw: 6, hd: 6 });
        break;
      }
    }
  }

  // Distancia de dibujo (la niebla tapa el resto); en celulares, más corta
  updateVisibility(cam, dt) {
    const g = this.game;
    const fogFar = g.env && g.env.fog ? g.env.fog.far : 760;
    const touch = g.touch && g.touch.enabled;
    const maxDist = Math.min(fogFar + 60, touch ? 480 : 1300) * (g.settings && g.settings.quality < 0.7 ? 0.8 : 1);
    this.culler.update(cam, maxDist, dt);
    g.terrain.updateLOD(cam, maxDist, dt);
  }

  zoneAt(x, z) {
    const g = this.game;
    const t = g.terrain;
    if (t && t.heightAt(x, z) < -1.5) return 'Golfo San Jorge';
    const zn = g.zones && g.zones.zoneAt(x, z);
    if (zn) {
      const name = zn.name;
      if (!/Km/i.test(name)) for (const [re, km] of KM) if (re.test(name)) return `${km} (${name})`;
      return name;
    }
    const pl = g.zones && g.zones.nearestPlace(x, z, 500);
    if (pl) return pl.name;
    if (t && t.heightAt(x, z) > 110) return 'Pampa del Castillo';
    const e = g.roads && g.roads.nearestEdge(x, z, 60);
    if (e && e.edge.name) return e.edge.name;
    return 'Comodoro Rivadavia';
  }

  zoneTypeAt(x, z) {
    const g = this.game;
    const t = g.city && g.city.zoneTypeAt(x, z);
    if (t) return t;
    const e = g.roads && g.roads.nearestEdge(x, z, 40);
    if (e && e.edge.kind === 'tierra') return 'meseta';
    return 'ruta';
  }

  // Altura para los pies de un personaje (incluye veredas)
  footGround(x, z) {
    const g = this.game;
    return g.terrain.groundAt(x, z) + g.city.curbAt(x, z);
  }
}

export { THREE, pointSegDist };
