import * as THREE from 'three';

// Acumulador de geometría: agrega cajas, prismas, etc. con color por vértice y UV en metros.
export class GeoBuilder {
  constructor() {
    this.cap = 1024;
    this.n = 0;
    this.pos = new Float32Array(this.cap * 3);
    this.nrm = new Float32Array(this.cap * 3);
    this.uv = new Float32Array(this.cap * 2);
    this.col = new Float32Array(this.cap * 3);
    this.xf = null;
  }

  get count() { return this.n; }

  grow(need) {
    if (this.n + need <= this.cap) return;
    let cap = this.cap;
    while (cap < this.n + need) cap *= 2;
    const g = (a, k) => { const b = new Float32Array(cap * k); b.set(a); return b; };
    this.pos = g(this.pos, 3); this.nrm = g(this.nrm, 3); this.uv = g(this.uv, 2); this.col = g(this.col, 3);
    this.cap = cap;
  }

  // Marco local rotado: x local = eje (ax, az), z local = (-az, ax), origen (cx, cz)
  setFrame(cx, cz, ax, az, cy = 0) { this.xf = { cx, cz, ax, az, cy }; return this; }
  clearFrame() { this.xf = null; return this; }

  vert(p, n, uv, color) {
    const i = this.n++;
    const f = this.xf;
    if (f) {
      this.pos[i * 3] = f.cx + p[0] * f.ax - p[2] * f.az;
      this.pos[i * 3 + 1] = p[1] + f.cy;
      this.pos[i * 3 + 2] = f.cz + p[0] * f.az + p[2] * f.ax;
      this.nrm[i * 3] = n[0] * f.ax - n[2] * f.az;
      this.nrm[i * 3 + 1] = n[1];
      this.nrm[i * 3 + 2] = n[0] * f.az + n[2] * f.ax;
    } else {
      this.pos[i * 3] = p[0]; this.pos[i * 3 + 1] = p[1]; this.pos[i * 3 + 2] = p[2];
      this.nrm[i * 3] = n[0]; this.nrm[i * 3 + 1] = n[1]; this.nrm[i * 3 + 2] = n[2];
    }
    this.uv[i * 2] = uv[0]; this.uv[i * 2 + 1] = uv[1];
    this.col[i * 3] = color[0]; this.col[i * 3 + 1] = color[1]; this.col[i * 3 + 2] = color[2];
  }

  tri(a, b, c, n, ua, ub, uc, color) {
    this.grow(3);
    this.vert(a, n, ua, color);
    this.vert(b, n, ub, color);
    this.vert(c, n, uc, color);
  }

  // Cuadrilátero con normal calculada. p0..p3 en orden antihorario visto de frente.
  quad(p0, p1, p2, p3, uv0, uv1, uv2, uv3, color) {
    const ux = p1[0] - p0[0], uy = p1[1] - p0[1], uz = p1[2] - p0[2];
    const vx = p3[0] - p0[0], vy = p3[1] - p0[1], vz = p3[2] - p0[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const L = Math.hypot(nx, ny, nz) || 1;
    const n = [nx / L, ny / L, nz / L];
    this.tri(p0, p1, p2, n, uv0, uv1, uv2, color);
    this.tri(p0, p2, p3, n, uv0, uv2, uv3, color);
  }

  // Paredes de una caja (sin tapa). UV: u = metros / uScale, v = metros / vScale
  walls(x0, x1, z0, z1, y0, y1, color, uScale = 4, vScale = 3, vOff = 0, uOff = 0) {
    const h = (y1 - y0) / vScale;
    const vb = vOff, vt = vOff + h;
    const W = (x1 - x0) / uScale, D = (z1 - z0) / uScale;
    // sur (+z)
    this.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [uOff, vb], [uOff + W, vb], [uOff + W, vt], [uOff, vt], color);
    // norte (-z)
    this.quad([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [uOff, vb], [uOff + W, vb], [uOff + W, vt], [uOff, vt], color);
    // este (+x)
    this.quad([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [uOff, vb], [uOff + D, vb], [uOff + D, vt], [uOff, vt], color);
    // oeste (-x)
    this.quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [uOff, vb], [uOff + D, vb], [uOff + D, vt], [uOff, vt], color);
  }

  top(x0, x1, z0, z1, y, color, uvScale = 4) {
    this.quad([x0, y, z1], [x1, y, z1], [x1, y, z0], [x0, y, z0], [x0 / uvScale, z1 / uvScale], [x1 / uvScale, z1 / uvScale], [x1 / uvScale, z0 / uvScale], [x0 / uvScale, z0 / uvScale], color);
  }

  box(x0, x1, y0, y1, z0, z1, color, uScale = 4, vScale = 3) {
    this.walls(x0, x1, z0, z1, y0, y1, color, uScale, vScale);
    this.top(x0, x1, z0, z1, y1, color, uScale);
    // base (por si se ve desde abajo)
    this.quad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, 0], [1, 0], [1, 1], [0, 1], color);
  }

  // Techo a dos aguas. ridgeAlongX: la cumbrera corre paralela a X
  gable(x0, x1, z0, z1, y, rise, color, ridgeAlongX = true, over = 0.4) {
    x0 -= over; x1 += over; z0 -= over; z1 += over;
    const s = 3;
    if (ridgeAlongX) {
      const zm = (z0 + z1) / 2, yr = y + rise;
      this.quad([x0, y, z1], [x1, y, z1], [x1, yr, zm], [x0, yr, zm], [x0 / s, 0], [x1 / s, 0], [x1 / s, 1.5], [x0 / s, 1.5], color);
      this.quad([x1, y, z0], [x0, y, z0], [x0, yr, zm], [x1, yr, zm], [x1 / s, 0], [x0 / s, 0], [x0 / s, 1.5], [x1 / s, 1.5], color);
      // hastiales
      this.tri([x0 + over, y, z0 + over], [x0 + over, y, z1 - over], [x0 + over, yr, zm], [-1, 0, 0], [0, 0], [1, 0], [0.5, 0.5], color);
      this.tri([x1 - over, y, z1 - over], [x1 - over, y, z0 + over], [x1 - over, yr, zm], [1, 0, 0], [0, 0], [1, 0], [0.5, 0.5], color);
    } else {
      const xm = (x0 + x1) / 2, yr = y + rise;
      this.quad([x1, y, z1], [x1, y, z0], [xm, yr, z0], [xm, yr, z1], [z1 / s, 0], [z0 / s, 0], [z0 / s, 1.5], [z1 / s, 1.5], color);
      this.quad([x0, y, z0], [x0, y, z1], [xm, yr, z1], [xm, yr, z0], [z0 / s, 0], [z1 / s, 0], [z1 / s, 1.5], [z0 / s, 1.5], color);
      this.tri([x0 + over, y, z1 - over], [x1 - over, y, z1 - over], [xm, yr, z1 - over], [0, 0, 1], [0, 0], [1, 0], [0.5, 0.5], color);
      this.tri([x1 - over, y, z0 + over], [x0 + over, y, z0 + over], [xm, yr, z0 + over], [0, 0, -1], [0, 0], [1, 0], [0.5, 0.5], color);
    }
  }

  // Cilindro vertical (tanques)
  cylinder(x, z, r, y0, y1, color, seg = 12, cap = true) {
    for (let k = 0; k < seg; k++) {
      const a0 = (k / seg) * Math.PI * 2, a1 = ((k + 1) / seg) * Math.PI * 2;
      const p0 = [x + Math.cos(a0) * r, y0, z + Math.sin(a0) * r];
      const p1 = [x + Math.cos(a1) * r, y0, z + Math.sin(a1) * r];
      const p2 = [x + Math.cos(a1) * r, y1, z + Math.sin(a1) * r];
      const p3 = [x + Math.cos(a0) * r, y1, z + Math.sin(a0) * r];
      const am = (a0 + a1) / 2;
      const n = [Math.cos(am), 0, Math.sin(am)];
      this.tri(p0, p2, p1, n, [k / seg, 0], [(k + 1) / seg, 1], [(k + 1) / seg, 0], color);
      this.tri(p0, p3, p2, n, [k / seg, 0], [k / seg, 1], [(k + 1) / seg, 1], color);
      if (cap) this.tri([x, y1, z], p2, p3, [0, 1, 0], [0.5, 0.5], [0, 0], [1, 0], color);
    }
  }

  toGeometry() {
    const g = new THREE.BufferGeometry();
    const n = this.n;
    g.setAttribute('position', new THREE.BufferAttribute(this.pos.slice(0, n * 3), 3));
    g.setAttribute('normal', new THREE.BufferAttribute(this.nrm.slice(0, n * 3), 3));
    g.setAttribute('uv', new THREE.BufferAttribute(this.uv.slice(0, n * 2), 2));
    g.setAttribute('color', new THREE.BufferAttribute(this.col.slice(0, n * 3), 3));
    g.computeBoundingSphere();
    return g;
  }
}

// Agrupa GeoBuilders por "chunk" espacial y material
export class ChunkedGeo {
  constructor(size = 256) {
    this.size = size;
    this.map = new Map();
  }
  get(x, z, mat) {
    const k = `${Math.floor(x / this.size)},${Math.floor(z / this.size)},${mat}`;
    let b = this.map.get(k);
    if (!b) { b = { mat, gb: new GeoBuilder() }; this.map.set(k, b); }
    return b.gb;
  }
  build(materials, parent) {
    for (const { mat, gb } of this.map.values()) {
      if (!gb.count) continue;
      const m = new THREE.Mesh(gb.toGeometry(), materials[mat]);
      m.matrixAutoUpdate = false;
      m.castShadow = true;
      m.receiveShadow = true;
      parent.add(m);
    }
  }
}

// Geometría liviana para el piso (calles, veredas): posición, UV y normal en 8 bits
export class LeanBuilder {
  constructor() {
    this.cap = 1024; this.n = 0;
    this.pos = new Float32Array(this.cap * 3);
    this.uv = new Float32Array(this.cap * 2);
    this.nrm = new Int8Array(this.cap * 3);
  }
  get count() { return this.n; }
  grow(need) {
    if (this.n + need <= this.cap) return;
    let cap = this.cap;
    while (cap < this.n + need) cap *= 2;
    const p = new Float32Array(cap * 3); p.set(this.pos); this.pos = p;
    const u = new Float32Array(cap * 2); u.set(this.uv); this.uv = u;
    const q = new Int8Array(cap * 3); q.set(this.nrm); this.nrm = q;
    this.cap = cap;
  }
  // triángulo con normal calculada (a, b, c en orden antihorario visto desde arriba/afuera)
  tri(ax, ay, az, au, av, bx, by, bz, bu, bv, cx, cy, cz, cu, cv) {
    this.grow(3);
    const ux = bx - ax, uy = by - ay, uz = bz - az, vx = cx - ax, vy = cy - ay, vz = cz - az;
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const L = Math.hypot(nx, ny, nz) || 1;
    nx = Math.round((nx / L) * 127); ny = Math.round((ny / L) * 127); nz = Math.round((nz / L) * 127);
    let i = this.n;
    const P = this.pos, U = this.uv, N = this.nrm;
    P[i * 3] = ax; P[i * 3 + 1] = ay; P[i * 3 + 2] = az; U[i * 2] = au; U[i * 2 + 1] = av; N[i * 3] = nx; N[i * 3 + 1] = ny; N[i * 3 + 2] = nz; i++;
    P[i * 3] = bx; P[i * 3 + 1] = by; P[i * 3 + 2] = bz; U[i * 2] = bu; U[i * 2 + 1] = bv; N[i * 3] = nx; N[i * 3 + 1] = ny; N[i * 3 + 2] = nz; i++;
    P[i * 3] = cx; P[i * 3 + 1] = cy; P[i * 3 + 2] = cz; U[i * 2] = cu; U[i * 2 + 1] = cv; N[i * 3] = nx; N[i * 3 + 1] = ny; N[i * 3 + 2] = nz; i++;
    this.n = i;
  }
  // quad p0..p3 (cada uno [x,y,z,u,v]) en orden antihorario visto desde arriba
  quad(p0, p1, p2, p3) {
    this.tri(...p0, ...p1, ...p2);
    this.tri(...p0, ...p2, ...p3);
  }
  toGeometry() {
    const g = new THREE.BufferGeometry();
    const n = this.n;
    g.setAttribute('position', new THREE.BufferAttribute(this.pos.slice(0, n * 3), 3));
    g.setAttribute('uv', new THREE.BufferAttribute(this.uv.slice(0, n * 2), 2));
    g.setAttribute('normal', new THREE.BufferAttribute(this.nrm.slice(0, n * 3), 3, true));
    g.computeBoundingSphere();
    return g;
  }
}

// Agrupa geometría liviana por sector y material
export class LeanChunks {
  constructor(size = 400) { this.size = size; this.map = new Map(); }
  get(x, z, mat) {
    const k = `${Math.floor(x / this.size)},${Math.floor(z / this.size)},${mat}`;
    let b = this.map.get(k);
    if (!b) { b = { mat, lb: new LeanBuilder() }; this.map.set(k, b); }
    return b.lb;
  }
  build(materials, parent, opts = {}) {
    for (const { mat, lb } of this.map.values()) {
      if (!lb.count) continue;
      const m = new THREE.Mesh(lb.toGeometry(), materials[mat]);
      m.matrixAutoUpdate = false;
      m.receiveShadow = true;
      if (opts.order && opts.order[mat] !== undefined) m.renderOrder = opts.order[mat];
      parent.add(m);
    }
  }
}

// Convierte un color sRGB (0xRRGGBB) a lineal para usar como color de vértice
const lin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
export function hexColor(hex) {
  return [lin(((hex >> 16) & 255) / 255), lin(((hex >> 8) & 255) / 255), lin((hex & 255) / 255)];
}
export function srgbToLinear(r, g, b) { return [lin(r), lin(g), lin(b)]; }
