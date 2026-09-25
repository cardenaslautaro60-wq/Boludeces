// Colisiones estáticas: cajas alineadas a los ejes y cilindros, con grilla espacial.

const CS = 24;

export class StaticColliders {
  constructor() {
    this.items = [];
    this.cells = new Map();
    this.stamp = 0;
  }

  key(i, j) { return i * 73856093 ^ j * 19349663; }

  addBox(x0, x1, z0, z1, y0, y1, tag = null) {
    const c = { type: 'box', x0: Math.min(x0, x1), x1: Math.max(x0, x1), z0: Math.min(z0, z1), z1: Math.max(z0, z1), y0, y1, tag, s: 0 };
    this.insert(c, c.x0, c.x1, c.z0, c.z1);
    return c;
  }

  addCircle(x, z, r, y0, y1, tag = null) {
    const c = { type: 'circle', x, z, r, y0, y1, tag, s: 0 };
    this.insert(c, x - r, x + r, z - r, z + r);
    return c;
  }

  insert(c, x0, x1, z0, z1) {
    this.items.push(c);
    const i0 = Math.floor(x0 / CS), i1 = Math.floor(x1 / CS);
    const j0 = Math.floor(z0 / CS), j1 = Math.floor(z1 / CS);
    for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) {
      const k = this.key(i, j);
      let arr = this.cells.get(k);
      if (!arr) { arr = []; this.cells.set(k, arr); }
      arr.push(c);
    }
  }

  near(x0, x1, z0, z1, out) {
    this.stamp++;
    out.length = 0;
    const i0 = Math.floor(x0 / CS), i1 = Math.floor(x1 / CS);
    const j0 = Math.floor(z0 / CS), j1 = Math.floor(z1 / CS);
    for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) {
      const arr = this.cells.get(this.key(i, j));
      if (!arr) continue;
      for (const c of arr) {
        if (c.s === this.stamp) continue;
        c.s = this.stamp;
        out.push(c);
      }
    }
    return out;
  }

  // Empuja un círculo (personaje) fuera de los obstáculos. Devuelve true si chocó.
  resolveCircle(p, r, yFeet, height = 1.8) {
    const list = this.near(p.x - r, p.x + r, p.z - r, p.z + r, this._tmp || (this._tmp = []));
    let hit = false;
    for (const c of list) {
      if (yFeet + height < c.y0 || yFeet > c.y1 - 0.35) continue;
      if (c.type === 'box') {
        const cx = Math.max(c.x0, Math.min(p.x, c.x1));
        const cz = Math.max(c.z0, Math.min(p.z, c.z1));
        let dx = p.x - cx, dz = p.z - cz;
        const d2 = dx * dx + dz * dz;
        if (d2 < r * r) {
          if (d2 > 1e-8) {
            const d = Math.sqrt(d2);
            p.x += (dx / d) * (r - d);
            p.z += (dz / d) * (r - d);
          } else {
            // adentro de la caja: salir por el lado más cercano
            const l = p.x - c.x0, rr = c.x1 - p.x, t = p.z - c.z0, b = c.z1 - p.z;
            const m = Math.min(l, rr, t, b);
            if (m === l) p.x = c.x0 - r; else if (m === rr) p.x = c.x1 + r; else if (m === t) p.z = c.z0 - r; else p.z = c.z1 + r;
          }
          hit = true;
        }
      } else {
        const dx = p.x - c.x, dz = p.z - c.z;
        const d2 = dx * dx + dz * dz, rr = r + c.r;
        if (d2 < rr * rr) {
          const d = Math.sqrt(d2) || 0.001;
          p.x = c.x + (dx / d) * rr;
          p.z = c.z + (dz / d) * rr;
          hit = true;
        }
      }
    }
    return hit;
  }

  // Caja orientada (auto) contra obstáculos. Devuelve la mayor penetración {nx,nz,depth} o null.
  // obb: {x,z,fx,fz (adelante), hl (medio largo), hw (medio ancho), y, h}
  resolveOBB(o) {
    const R = Math.hypot(o.hl, o.hw);
    const list = this.near(o.x - R, o.x + R, o.z - R, o.z + R, this._tmp2 || (this._tmp2 = []));
    let result = null;
    const rx = o.fz, rz = -o.fx; // eje lateral
    for (const c of list) {
      if (o.y + o.h < c.y0 || o.y > c.y1 - 0.4) continue;
      let best = null;
      if (c.type === 'box') {
        // SAT con 4 ejes: X, Z, adelante, lateral
        const bcx = (c.x0 + c.x1) / 2, bcz = (c.z0 + c.z1) / 2;
        const bhx = (c.x1 - c.x0) / 2, bhz = (c.z1 - c.z0) / 2;
        const dx = o.x - bcx, dz = o.z - bcz;
        const axes = [[1, 0], [0, 1], [o.fx, o.fz], [rx, rz]];
        let minPen = Infinity, nx = 0, nz = 0;
        let sep = false;
        for (const [ax, az] of axes) {
          const pa = Math.abs(o.fx * ax + o.fz * az) * o.hl + Math.abs(rx * ax + rz * az) * o.hw;
          const pb = Math.abs(ax) * bhx + Math.abs(az) * bhz;
          const d = dx * ax + dz * az;
          const pen = pa + pb - Math.abs(d);
          if (pen <= 0) { sep = true; break; }
          if (pen < minPen) { minPen = pen; const s = d < 0 ? -1 : 1; nx = ax * s; nz = az * s; }
        }
        if (!sep) best = { nx, nz, depth: minPen, c };
      } else {
        // círculo vs OBB
        const dx = c.x - o.x, dz = c.z - o.z;
        const lf = dx * o.fx + dz * o.fz, lr = dx * rx + dz * rz;
        const cf = Math.max(-o.hl, Math.min(o.hl, lf)), cr = Math.max(-o.hw, Math.min(o.hw, lr));
        const px = o.x + o.fx * cf + rx * cr, pz = o.z + o.fz * cf + rz * cr;
        let ex = px - c.x, ez = pz - c.z;
        const d = Math.hypot(ex, ez);
        if (d < c.r) {
          if (d < 1e-4) { ex = o.x - c.x; ez = o.z - c.z; }
          const L = Math.hypot(ex, ez) || 1;
          best = { nx: ex / L, nz: ez / L, depth: c.r - d, c };
        }
      }
      if (best && (!result || best.depth > result.depth)) result = best;
      if (best) { o.x += best.nx * best.depth; o.z += best.nz * best.depth; }
    }
    return result;
  }

  // Rayo 3D contra obstáculos. Devuelve {t, c, nx, ny, nz} o null
  raycast(ox, oy, oz, dx, dy, dz, maxT) {
    const ex = ox + dx * maxT, ez = oz + dz * maxT;
    // recorrer celdas a lo largo del rayo (aprox: bounding box del rayo si es corto)
    const list = [];
    const steps = Math.max(1, Math.ceil(maxT / CS));
    this.stamp++;
    for (let s = 0; s <= steps; s++) {
      const t = (s / steps) * maxT;
      const px = ox + dx * t, pz = oz + dz * t;
      const i0 = Math.floor(px / CS) - 1, j0 = Math.floor(pz / CS) - 1;
      for (let i = i0; i <= i0 + 2; i++) for (let j = j0; j <= j0 + 2; j++) {
        const arr = this.cells.get(this.key(i, j));
        if (!arr) continue;
        for (const c of arr) { if (c.s !== this.stamp) { c.s = this.stamp; list.push(c); } }
      }
    }
    let best = null;
    for (const c of list) {
      let t;
      if (c.type === 'box') {
        let tmin = 0, tmax = maxT, nAxis = -1, nSign = 0;
        const slab = (o, d, lo, hi, axis) => {
          if (Math.abs(d) < 1e-9) return o >= lo && o <= hi;
          let t1 = (lo - o) / d, t2 = (hi - o) / d;
          let s = -1;
          if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; s = 1; }
          if (t1 > tmin) { tmin = t1; nAxis = axis; nSign = s; }
          if (t2 < tmax) tmax = t2;
          return tmin <= tmax;
        };
        if (!slab(ox, dx, c.x0, c.x1, 0)) continue;
        if (!slab(oy, dy, c.y0, c.y1, 1)) continue;
        if (!slab(oz, dz, c.z0, c.z1, 2)) continue;
        t = tmin;
        if (t <= 0) continue;
        if (!best || t < best.t) best = { t, c, nx: nAxis === 0 ? nSign : 0, ny: nAxis === 1 ? nSign : 0, nz: nAxis === 2 ? nSign : 0 };
      } else {
        const fx = ox - c.x, fz = oz - c.z;
        const a = dx * dx + dz * dz;
        if (a < 1e-9) continue;
        const b = 2 * (fx * dx + fz * dz), cc = fx * fx + fz * fz - c.r * c.r;
        const disc = b * b - 4 * a * cc;
        if (disc < 0) continue;
        t = (-b - Math.sqrt(disc)) / (2 * a);
        if (t <= 0 || t > maxT) continue;
        const y = oy + dy * t;
        if (y < c.y0 || y > c.y1) continue;
        const hx = ox + dx * t - c.x, hz = oz + dz * t - c.z;
        const L = Math.hypot(hx, hz) || 1;
        if (!best || t < best.t) best = { t, c, nx: hx / L, ny: 0, nz: hz / L };
      }
    }
    void ex; void ez;
    return best;
  }
}
