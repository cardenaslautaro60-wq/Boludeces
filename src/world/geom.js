import * as THREE from 'three';

// Acumulador de geometría: agrega cajas, prismas, etc. con color por vértice y UV en metros.
export class GeoBuilder {
  constructor() {
    this.pos = [];
    this.nrm = [];
    this.uv = [];
    this.col = [];
  }

  get count() { return this.pos.length / 3; }

  tri(a, b, c, n, ua, ub, uc, color) {
    this.pos.push(...a, ...b, ...c);
    this.nrm.push(...n, ...n, ...n);
    this.uv.push(...ua, ...ub, ...uc);
    this.col.push(...color, ...color, ...color);
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
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nrm, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
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

// Convierte un color sRGB (0xRRGGBB) a lineal para usar como color de vértice
const lin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
export function hexColor(hex) {
  return [lin(((hex >> 16) & 255) / 255), lin(((hex >> 8) & 255) / 255), lin((hex & 255) / 255)];
}
export function srgbToLinear(r, g, b) { return [lin(r), lin(g), lin(b)]; }
