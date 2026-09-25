import { META, MAP } from './mapdata.js';

// Barrios reales (límites de OSM) y áreas (plazas, industria, escuelas...) con búsqueda por grilla.
function pointInRing(x, z, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 2; i < pts.length; j = i, i += 2) {
    const xi = pts[i], zi = pts[i + 1], xj = pts[j], zj = pts[j + 1];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

function bboxOf(pts) {
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
  for (let i = 0; i < pts.length; i += 2) {
    x0 = Math.min(x0, pts[i]); x1 = Math.max(x1, pts[i]);
    z0 = Math.min(z0, pts[i + 1]); z1 = Math.max(z1, pts[i + 1]);
  }
  return { x0, x1, z0, z1 };
}

function areaOf(pts) {
  let a = 0;
  for (let i = 0, j = pts.length - 2; i < pts.length; j = i, i += 2) a += pts[j] * pts[i + 1] - pts[i] * pts[j + 1];
  return Math.abs(a) / 2;
}

function centroidOf(pts) {
  let a = 0, cx = 0, cz = 0;
  for (let i = 0, j = pts.length - 2; i < pts.length; j = i, i += 2) {
    const f = pts[j] * pts[i + 1] - pts[i] * pts[j + 1];
    a += f; cx += (pts[j] + pts[i]) * f; cz += (pts[j + 1] + pts[i + 1]) * f;
  }
  if (Math.abs(a) < 1e-6) return [pts[0], pts[1]];
  return [cx / (3 * a), cz / (3 * a)];
}

const G = 200;

export class Zones {
  constructor() {
    this.zones = [];
    this.areas = [];
    const pm = MAP.polyMeta, pp = MAP.polyPts;
    let k = 0;
    for (let m = 0; m < pm.length; m += 4) {
      const kind = pm[m], typ = pm[m + 1], ni = pm[m + 2], n = pm[m + 3];
      const pts = new Float32Array(n * 2);
      for (let q = 0; q < n * 2; q++) pts[q] = pp[k + q] / 2;
      k += n * 2;
      const item = { pts, bbox: bboxOf(pts), area: areaOf(pts), centroid: centroidOf(pts) };
      if (kind === 0) {
        item.name = META.zoneNames[ni];
        item.type = META.zoneTypes[typ >> 4];
        item.level = typ & 15;
        this.zones.push(item);
      } else {
        item.kind = META.areaKinds[typ];
        item.name = META.areaNames[ni];
        this.areas.push(item);
      }
    }
    // los barrios más chicos (nivel 10) ganan sobre los grandes
    this.zones.sort((a, b) => b.level - a.level || a.area - b.area);
    this.zGrid = this.index(this.zones);
    this.aGrid = this.index(this.areas);
    this.places = META.places;
  }

  index(list) {
    const grid = new Map();
    for (const it of list) {
      const b = it.bbox;
      for (let gi = Math.floor(b.x0 / G); gi <= Math.floor(b.x1 / G); gi++) for (let gj = Math.floor(b.z0 / G); gj <= Math.floor(b.z1 / G); gj++) {
        const key = gi * 100000 + gj;
        let arr = grid.get(key);
        if (!arr) { arr = []; grid.set(key, arr); }
        arr.push(it);
      }
    }
    return grid;
  }

  query(grid, x, z, filter) {
    const arr = grid.get(Math.floor(x / G) * 100000 + Math.floor(z / G));
    if (!arr) return null;
    for (const it of arr) {
      const b = it.bbox;
      if (x < b.x0 || x > b.x1 || z < b.z0 || z > b.z1) continue;
      if (filter && !filter(it)) continue;
      if (pointInRing(x, z, it.pts)) return it;
    }
    return null;
  }

  // Barrio en el que cae el punto (o null)
  zoneAt(x, z, level = 0) { return this.query(this.zGrid, x, z, level ? (it) => it.level <= level : null); }

  // Área de uso del suelo (plaza, industria, escuela...) en el punto
  areaAt(x, z, kind = null) { return this.query(this.aGrid, x, z, kind ? (it) => it.kind === kind : null); }

  nearestPlace(x, z, maxD = 900) {
    let best = null, bd = maxD;
    for (const p of this.places) {
      const d = Math.hypot(p.x - x, p.z - z);
      if (d < bd) { bd = d; best = p; }
    }
    return best;
  }
}

export { pointInRing, areaOf, centroidOf };
