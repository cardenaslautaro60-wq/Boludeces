import * as THREE from 'three';
import { META, MAP, FRAME as F, toAB, fromAB, DECKS, RAMPS } from './mapdata.js';
import { clamp, lerp, smoothstep, fbm, noise2 } from '../util.js';
import { srgbToLinear } from './geom.js';

// El relieve real de Comodoro (cañadones, el Chenque, las bardas) vive en una grilla rotada:
// i avanza a lo largo de la costa (eje A) y j tierra adentro (eje B).
export const CELL = 14;
const MARGIN = 700; // la malla sigue más allá del borde jugable (la niebla la tapa)

function catmull(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

export class Terrain {
  constructor() {
    const hm = META.heights;
    const src = MAP.heights;
    const sna = hm.na, snb = hm.nb, sc = hm.scale;
    const S = (i, j) => src[clamp(j, 0, snb - 1) * sna + clamp(i, 0, sna - 1)] * sc;
    this.a0 = F.a0 - MARGIN; this.b0 = F.b0 - MARGIN;
    this.na = Math.ceil((F.a1 - F.a0 + 2 * MARGIN) / CELL) + 1;
    this.nb = Math.ceil((F.b1 - F.b0 + 2 * MARGIN) / CELL) + 1;
    this.h = new Float32Array(this.na * this.nb);
    for (let j = 0; j < this.nb; j++) {
      const b = this.b0 + j * CELL;
      const fj = (b - F.b0) / hm.cell;
      const jj = Math.floor(fj), tj = fj - jj;
      for (let i = 0; i < this.na; i++) {
        const a = this.a0 + i * CELL;
        const fi = (a - F.a0) / hm.cell;
        const ii = Math.floor(fi), ti = fi - ii;
        const col = [];
        for (let m = -1; m <= 2; m++) col.push(catmull(S(ii - 1, jj + m), S(ii, jj + m), S(ii + 1, jj + m), S(ii + 2, jj + m), ti));
        let h = catmull(col[0], col[1], col[2], col[3], tj);
        // detalle chico de la estepa (el DEM es suave a esta escala)
        if (h > 1.5) {
          const [x, z] = fromAB(a, b);
          h += ((fbm(x * 0.018 + 5, z * 0.018 - 3, 3) - 0.5) * 1.6 + (noise2(x * 0.09, z * 0.09) - 0.5) * 0.35) * smoothstep(1.5, 6, h);
        }
        this.h[j * this.na + i] = h;
      }
    }
    this.computeSeaDistance();
    this.ramps = [];
  }

  // Distancia (m) al mar para cada celda de tierra; negativa en el mar (distancia a tierra)
  computeSeaDistance() {
    const { na, nb, h } = this;
    const INF = 1e9;
    const dLand = new Float32Array(na * nb), dSea = new Float32Array(na * nb);
    for (let k = 0; k < h.length; k++) { const land = h[k] > 0; dSea[k] = land ? INF : 0; dLand[k] = land ? 0 : INF; }
    const pass = (d) => {
      const s2 = Math.SQRT2;
      for (let j = 0; j < nb; j++) for (let i = 0; i < na; i++) {
        const k = j * na + i;
        let v = d[k];
        if (i > 0) v = Math.min(v, d[k - 1] + 1);
        if (j > 0) { v = Math.min(v, d[k - na] + 1); if (i > 0) v = Math.min(v, d[k - na - 1] + s2); if (i < na - 1) v = Math.min(v, d[k - na + 1] + s2); }
        d[k] = v;
      }
      for (let j = nb - 1; j >= 0; j--) for (let i = na - 1; i >= 0; i--) {
        const k = j * na + i;
        let v = d[k];
        if (i < na - 1) v = Math.min(v, d[k + 1] + 1);
        if (j < nb - 1) { v = Math.min(v, d[k + na] + 1); if (i > 0) v = Math.min(v, d[k + na - 1] + s2); if (i < na - 1) v = Math.min(v, d[k + na + 1] + s2); }
        d[k] = v;
      }
    };
    pass(dLand); pass(dSea);
    this.coast = new Float32Array(na * nb);
    for (let k = 0; k < h.length; k++) this.coast[k] = h[k] > 0 ? dSea[k] * CELL : -dLand[k] * CELL;
  }

  cellOf(x, z) {
    const a = x * F.ux + z * F.uz, b = x * F.vx + z * F.vz;
    return [(a - this.a0) / CELL, (b - this.b0) / CELL];
  }

  // Distancia al mar en metros (positiva en tierra)
  seaDist(x, z) {
    const [fi, fj] = this.cellOf(x, z);
    const i = clamp(Math.round(fi), 0, this.na - 1), j = clamp(Math.round(fj), 0, this.nb - 1);
    return this.coast[j * this.na + i];
  }

  gridH(i, j) {
    i = clamp(i, 0, this.na - 1);
    j = clamp(j, 0, this.nb - 1);
    return this.h[j * this.na + i];
  }

  // Altura interpolada igual que la malla (dos triángulos por celda)
  heightAt(x, z) {
    const a = x * F.ux + z * F.uz, b = x * F.vx + z * F.vz;
    let fi = (a - this.a0) / CELL, fj = (b - this.b0) / CELL;
    fi = clamp(fi, 0, this.na - 1.001); fj = clamp(fj, 0, this.nb - 1.001);
    const i = Math.floor(fi), j = Math.floor(fj);
    const u = fi - i, v = fj - j;
    const na = this.na, H = this.h;
    const h00 = H[j * na + i], h10 = H[j * na + i + 1];
    const h01 = H[(j + 1) * na + i], h11 = H[(j + 1) * na + i + 1];
    if (u + v <= 1) return h00 + (h10 - h00) * u + (h01 - h00) * v;
    return h11 + (h01 - h11) * (1 - u) + (h10 - h11) * (1 - v);
  }

  // Altura del piso incluyendo muelles y rampas
  groundAt(x, z) {
    let g = this.heightAt(x, z);
    for (let k = 0; k < DECKS.length; k++) {
      const d = DECKS[k];
      const dx = x - d.cx, dz = z - d.cz;
      const u = dx * d.ax + dz * d.az, v = -dx * d.az + dz * d.ax;
      if (Math.abs(u) <= d.hw && Math.abs(v) <= d.hd && d.h > g) g = d.h;
    }
    for (let k = 0; k < this.ramps.length; k++) {
      const r = this.ramps[k];
      const dx = x - r.x, dz = z - r.z;
      if (dx * dx + dz * dz > r.rad2) continue;
      const lz = dx * r.fx + dz * r.fz;
      const lx = dx * r.fz - dz * r.fx;
      if (Math.abs(lx) <= r.w / 2 && lz >= -r.len / 2 && lz <= r.len / 2) {
        const t = (lz + r.len / 2) / r.len;
        const hh = r.base + r.h * t;
        if (hh > g) g = hh;
      }
    }
    return g;
  }

  normalAt(x, z, out = new THREE.Vector3()) {
    const e = 1.5;
    const hl = this.heightAt(x - e, z), hr = this.heightAt(x + e, z);
    const hd = this.heightAt(x, z - e), hu = this.heightAt(x, z + e);
    out.set(hl - hr, 2 * e, hd - hu).normalize();
    return out;
  }

  isWater(x, z) { return this.groundAt(x, z) < -0.6; }

  buildRamps() {
    this.ramps = [];
    for (const r of RAMPS) {
      const base = this.heightAt(r.x, r.z);
      this.ramps.push({ ...r, base, fx: Math.sin(r.rot), fz: Math.cos(r.rot), rad2: (r.len * 0.5 + r.w) ** 2 });
    }
  }

  // Aplana el terreno a lo largo de las calles para que queden prolijas
  flattenRoads(segments) {
    const na = this.na;
    const target = new Float32Array(this.h.length);
    const weight = new Float32Array(this.h.length);
    for (const s of segments) {
      const [aa, ab] = toAB(s.ax, s.az), [ba, bb] = toAB(s.bx, s.bz);
      const pad = s.width / 2 + 6;
      const i0 = Math.max(0, Math.floor((Math.min(aa, ba) - pad - this.a0) / CELL));
      const i1 = Math.min(na - 1, Math.ceil((Math.max(aa, ba) + pad - this.a0) / CELL));
      const j0 = Math.max(0, Math.floor((Math.min(ab, bb) - pad - this.b0) / CELL));
      const j1 = Math.min(this.nb - 1, Math.ceil((Math.max(ab, bb) + pad - this.b0) / CELL));
      const dx = ba - aa, dy = bb - ab, L2 = dx * dx + dy * dy || 1e-9;
      for (let j = j0; j <= j1; j++) {
        const b = this.b0 + j * CELL;
        for (let i = i0; i <= i1; i++) {
          const a = this.a0 + i * CELL;
          const t = clamp(((a - aa) * dx + (b - ab) * dy) / L2, 0, 1);
          const d = Math.hypot(aa + dx * t - a, ab + dy * t - b);
          if (d > pad) continue;
          const w = 1 - smoothstep(s.width / 2 + 1, pad, d);
          if (w <= 0) continue;
          const k = j * na + i;
          if (this.h[k] < 0.2) continue; // no rellenar el mar
          target[k] += lerp(s.ha, s.hb, t) * w;
          weight[k] += w;
        }
      }
    }
    for (let k = 0; k < this.h.length; k++) {
      if (weight[k] > 0) {
        const w = Math.min(1, weight[k]);
        this.h[k] = lerp(this.h[k], target[k] / weight[k], w);
      }
    }
  }

  // Marca celdas urbanas (cerca de calles de barrio) para pintar el suelo de tierra apisonada
  markUrban(roads) {
    const na = this.na;
    this.urban = new Uint8Array(this.h.length);
    for (const e of roads.edges) {
      if (e.kind === 'ruta' || (e.kind === 'tierra' && !e.urban)) continue;
      const A = roads.nodes[e.a], B = roads.nodes[e.b];
      const [aa, ab] = toAB(A.x, A.z), [ba, bb] = toAB(B.x, B.z);
      const pad = 30;
      const i0 = Math.max(0, Math.floor((Math.min(aa, ba) - pad - this.a0) / CELL));
      const i1 = Math.min(na - 1, Math.ceil((Math.max(aa, ba) + pad - this.a0) / CELL));
      const j0 = Math.max(0, Math.floor((Math.min(ab, bb) - pad - this.b0) / CELL));
      const j1 = Math.min(this.nb - 1, Math.ceil((Math.max(ab, bb) + pad - this.b0) / CELL));
      const dx = ba - aa, dy = bb - ab, L2 = dx * dx + dy * dy || 1e-9;
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
        const a = this.a0 + i * CELL, b = this.b0 + j * CELL;
        const t = clamp(((a - aa) * dx + (b - ab) * dy) / L2, 0, 1);
        if (Math.hypot(aa + dx * t - a, ab + dy * t - b) < pad) this.urban[j * na + i] = 1;
      }
    }
  }

  // Colores por vértice según altura, pendiente y zona
  colorFor(x, z, h, ny, urban, sd) {
    const n = fbm(x * 0.012, z * 0.012, 3);
    const n2 = noise2(x * 0.08, z * 0.08);
    let r, g, b;
    if (h < 0.3) { // fondo marino / orilla mojada
      r = 0.52; g = 0.47; b = 0.36;
    } else if (sd < 55 && h < 6) { // playa de canto rodado y arena gris
      const t = n2 * 0.15;
      r = 0.72 + t; g = 0.66 + t; b = 0.52 + t;
    } else if (ny < 0.8) { // barranco arcilloso con estratos (las bardas)
      const t = n * 0.14;
      const band = Math.sin(h * 0.9 + n * 3) * 0.5 + 0.5;
      r = lerp(0.62, 0.8, band) + t; g = lerp(0.54, 0.7, band) + t; b = lerp(0.44, 0.56, band) + t;
    } else if (urban) {
      const t = n2 * 0.08;
      r = 0.54 + t; g = 0.5 + t; b = 0.43 + t;
    } else { // estepa patagónica
      const m = smoothstep(0.35, 0.65, n);
      r = lerp(0.68, 0.58, m); g = lerp(0.59, 0.55, m); b = lerp(0.41, 0.39, m);
      const t = (n2 - 0.5) * 0.08;
      r += t; g += t; b += t * 0.5;
      if (ny < 0.9) { r += 0.06; g += 0.03; }
      // meseta alta un poco más gris
      const hi = smoothstep(90, 200, h);
      r = lerp(r, 0.66, hi * 0.4); g = lerp(g, 0.62, hi * 0.4); b = lerp(b, 0.52, hi * 0.4);
    }
    return srgbToLinear(clamp(r, 0, 1), clamp(g, 0, 1), clamp(b, 0, 1));
  }

  buildMesh() {
    const group = new THREE.Group();
    const T = 56;
    const mat = new THREE.MeshLambertMaterial({ vertexColors: true });
    const nrm = new THREE.Vector3();
    const { na, nb } = this;
    for (let tj = 0; tj * T < nb - 1; tj++) {
      for (let ti = 0; ti * T < na - 1; ti++) {
        const i0 = ti * T, i1 = Math.min(na - 1, i0 + T);
        const j0 = tj * T, j1 = Math.min(nb - 1, j0 + T);
        const w = i1 - i0 + 1, hgt = j1 - j0 + 1;
        const pos = new Float32Array(w * hgt * 3);
        const col = new Float32Array(w * hgt * 3);
        let p = 0;
        let allUnder = true;
        for (let j = j0; j <= j1; j++) {
          for (let i = i0; i <= i1; i++) {
            const a = this.a0 + i * CELL, b = this.b0 + j * CELL;
            const [x, z] = fromAB(a, b);
            const k = j * na + i;
            const h = this.h[k];
            if (h > -7) allUnder = false;
            pos[p] = x; pos[p + 1] = h; pos[p + 2] = z;
            this.normalAt(x, z, nrm);
            const c = this.colorFor(x, z, h, nrm.y, this.urban ? this.urban[k] : 0, this.coast[k]);
            col[p] = c[0]; col[p + 1] = c[1]; col[p + 2] = c[2];
            p += 3;
          }
        }
        if (allUnder) continue;
        const idx = new Uint32Array((w - 1) * (hgt - 1) * 6);
        let q = 0;
        for (let j = 0; j < hgt - 1; j++) {
          for (let i = 0; i < w - 1; i++) {
            const a = j * w + i, b = a + 1, c = a + w, d = c + 1;
            // el marco (A,B) invierte la orientación respecto de (X,Z)
            idx[q++] = a; idx[q++] = b; idx[q++] = c;
            idx[q++] = b; idx[q++] = d; idx[q++] = c;
          }
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
        geo.setIndex(new THREE.BufferAttribute(idx, 1));
        geo.computeVertexNormals();
        geo.computeBoundingSphere();
        const mesh = new THREE.Mesh(geo, mat);
        mesh.matrixAutoUpdate = false;
        mesh.receiveShadow = true;
        group.add(mesh);
      }
    }
    return group;
  }
}

// Agua del Golfo San Jorge con olas y espuma en la orilla
export function buildWater(terrain) {
  const group = new THREE.Group();
  const uniforms = THREE.UniformsUtils.merge([
    THREE.UniformsLib.fog,
    {
      uTime: { value: 0 },
      uDeep: { value: new THREE.Color(0x1d3a4a) },
      uShallow: { value: new THREE.Color(0x3f6f78) },
      uSky: { value: new THREE.Color(0x9fb4c4) },
      uLight: { value: 1 },
    },
  ]);
  const mat = new THREE.ShaderMaterial({
    uniforms,
    fog: true,
    vertexShader: `
      attribute float depth;
      varying float vDepth;
      varying vec3 vWorld;
      uniform float uTime;
      #include <fog_pars_vertex>
      void main(){
        vDepth = depth;
        vec3 p = position;
        float w = sin(p.x*0.05 + uTime*1.3)*0.18 + sin(p.z*0.07 - uTime*1.1)*0.14;
        p.y += w * clamp(depth*0.4, 0.0, 1.0);
        vWorld = p;
        vec4 mvPosition = modelViewMatrix * vec4(p,1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: `
      uniform float uTime; uniform vec3 uDeep; uniform vec3 uShallow; uniform vec3 uSky; uniform float uLight;
      varying float vDepth; varying vec3 vWorld;
      #include <fog_pars_fragment>
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
      float noise(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
      void main(){
        float d = clamp(vDepth/10.0, 0.0, 1.0);
        vec3 c = mix(uShallow, uDeep, d);
        float n = noise(vWorld.xz*0.08 + vec2(uTime*0.25, uTime*0.18)) * 0.6 + noise(vWorld.xz*0.25 - vec2(uTime*0.4, 0.0))*0.4;
        c = mix(c, uSky, n*0.22);
        float crest = smoothstep(0.72, 0.9, n);
        c += crest*0.12;
        float foam = (1.0 - smoothstep(0.0, 1.6, vDepth)) * (0.55 + 0.45*sin(uTime*2.0 + vWorld.x*0.3 + vWorld.z*0.2));
        c = mix(c, vec3(0.92,0.94,0.95), clamp(foam,0.0,1.0)*0.8);
        gl_FragColor = vec4(c*uLight, 1.0);
        #include <fog_fragment>
      }`,
  });
  // Grilla (en el marco rotado) sobre las celdas de mar y la orilla
  const step = 16;
  const a0 = terrain.a0, a1 = terrain.a0 + (terrain.na - 1) * CELL;
  const b0 = terrain.b0, b1 = terrain.b0 + (terrain.nb - 1) * CELL;
  // hasta dónde llega el mar tierra adentro
  let bMax = b0;
  for (let j = 0; j < terrain.nb; j++) for (let i = 0; i < terrain.na; i += 4) if (terrain.h[j * terrain.na + i] < 0.5) bMax = Math.max(bMax, terrain.b0 + j * CELL);
  const na = Math.ceil((a1 - a0) / step) + 1, nb = Math.ceil((Math.min(b1, bMax + 60) - b0) / step) + 1;
  const pos = new Float32Array(na * nb * 3), depth = new Float32Array(na * nb);
  const wet = new Uint8Array(na * nb);
  for (let j = 0; j < nb; j++) for (let i = 0; i < na; i++) {
    const a = a0 + i * step, b = b0 + j * step;
    const [x, z] = fromAB(a, b);
    const k = j * na + i;
    pos[k * 3] = x; pos[k * 3 + 1] = 0; pos[k * 3 + 2] = z;
    const g = terrain.heightAt(x, z);
    depth[k] = -g;
    wet[k] = g < 0.6 ? 1 : 0;
  }
  const idx = [];
  for (let j = 0; j < nb - 1; j++) for (let i = 0; i < na - 1; i++) {
    const a = j * na + i, b = a + 1, c = a + na, d = c + 1;
    if (!(wet[a] || wet[b] || wet[c] || wet[d])) continue;
    idx.push(a, b, c, b, d, c);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('depth', new THREE.BufferAttribute(depth, 1));
  geo.setIndex(idx);
  geo.computeBoundingSphere();
  group.add(new THREE.Mesh(geo, mat));

  // Mar abierto hasta el horizonte (del lado del Golfo)
  const farGeo = new THREE.PlaneGeometry(16000, 9000, 1, 1);
  farGeo.rotateX(-Math.PI / 2);
  const farDepth = new Float32Array(farGeo.attributes.position.count).fill(20);
  farGeo.setAttribute('depth', new THREE.BufferAttribute(farDepth, 1));
  const far = new THREE.Mesh(farGeo, mat);
  // alinear el plano con el marco y ponerlo mar adentro
  const [cx, cz] = fromAB((a0 + a1) / 2, b0 - 4500 + 30);
  far.position.set(cx, -0.25, cz);
  far.rotation.y = -Math.atan2(F.uz, F.ux);
  group.add(far);
  group.userData.material = mat;
  return group;
}
