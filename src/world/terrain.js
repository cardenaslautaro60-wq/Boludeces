import * as THREE from 'three';
import { WORLD, COAST, FLATS, DECKS, RAMPS } from './mapdata.js';
import { clamp, lerp, smoothstep, fbm, noise2, catmullTable, pointSegDist } from '../util.js';
import { srgbToLinear } from './geom.js';

export const CELL = 10;

export function coastX(z) {
  return catmullTable(COAST, z) + 5 * Math.sin(z * 0.021) + 3 * Math.sin(z * 0.057);
}

function rectMask(x, z, r) {
  const e = r.edge;
  const mx = smoothstep(r.x0 - e, r.x0, x) * (1 - smoothstep(r.x1, r.x1 + e, x));
  const mz = smoothstep(r.z0 - e, r.z0, z) * (1 - smoothstep(r.z1, r.z1 + e, z));
  return mx * mz;
}

// Meseta: plateau alto al Oeste con un escalón (barda)
function escarpX(z) {
  return -860 + 55 * Math.sin(z * 0.0042) + 28 * Math.sin(z * 0.0113 + 1.3);
}

// Altura "cruda" (analítica) del terreno
export function rawHeight(x, z) {
  const cx = coastX(z);
  const d = cx - x; // distancia tierra adentro

  let h = 3 + Math.max(0, d - 60) * 0.031;

  // Barda de la meseta
  const ex = escarpX(z);
  h += 52 * smoothstep(ex + 55, ex - 55, x);

  // Ondulaciones de la estepa
  const rough = 1;
  h += (fbm(x * 0.0035 + 11, z * 0.0035 - 7, 4) - 0.5) * 16 * rough;
  h += (noise2(x * 0.02, z * 0.02) - 0.5) * 2.2;

  // Cerro Chenque (meseta chica con laderas empinadas y cárcavas)
  {
    const rx = (x - 150) / 175, rz = (z + 360) / 235;
    const r = Math.sqrt(rx * rx + rz * rz);
    const plateau = 1 - smoothstep(0.52, 1.06, r);
    const gully = (fbm(x * 0.03, z * 0.03, 3) - 0.5) * 18 * smoothstep(0.45, 0.75, r) * (1 - smoothstep(0.95, 1.2, r));
    h += plateau * 84 + gully * plateau;
  }
  // Lomas al oeste de Km 3 / Km 5
  h += 26 * Math.exp(-(((x + 330) ** 2) / (2 * 190 ** 2) + ((z + 1000) ** 2) / (2 * 230 ** 2)));
  h += 20 * Math.exp(-(((x + 150) ** 2) / (2 * 120 ** 2) + ((z + 700) ** 2) / (2 * 110 ** 2)));
  // Loma entre Comodoro y Rada Tilly
  h += 30 * Math.exp(-(((x - 120) ** 2) / (2 * 330 ** 2) + ((z - 1000) ** 2) / (2 * 70 ** 2)));
  // Punta del Marqués (meseta costera con acantilados)
  {
    const rx = (x - 500) / 170, rz = (z - 1605) / 105;
    const r = Math.sqrt(rx * rx + rz * rz);
    h += 38 * (1 - smoothstep(0.55, 1.0, r));
  }

  // Zonas urbanas aplanadas
  for (const f of FLATS) {
    const m = rectMask(x, z, f);
    if (m > 0) h = lerp(h, f.h(x, z), m);
  }

  // Costa: playa y fondo marino
  if (d < 90) {
    const beach = d >= 0 ? d * 0.055 : Math.max(-16, d * 0.09);
    const t = smoothstep(-5, 90, d);
    h = lerp(beach, h, t);
  }
  return h;
}

export class Terrain {
  constructor() {
    this.nx = Math.round((WORLD.maxX - WORLD.minX) / CELL) + 1;
    this.nz = Math.round((WORLD.maxZ - WORLD.minZ) / CELL) + 1;
    this.h = new Float32Array(this.nx * this.nz);
    for (let j = 0; j < this.nz; j++) {
      const z = WORLD.minZ + j * CELL;
      for (let i = 0; i < this.nx; i++) {
        const x = WORLD.minX + i * CELL;
        this.h[j * this.nx + i] = rawHeight(x, z);
      }
    }
    this.ramps = [];
  }

  gridH(i, j) {
    i = clamp(i, 0, this.nx - 1);
    j = clamp(j, 0, this.nz - 1);
    return this.h[j * this.nx + i];
  }

  // Altura del terreno interpolada igual que la malla (dos triángulos por celda)
  heightAt(x, z) {
    const fx = (x - WORLD.minX) / CELL, fz = (z - WORLD.minZ) / CELL;
    let i = Math.floor(fx), j = Math.floor(fz);
    if (i < 0 || j < 0 || i >= this.nx - 1 || j >= this.nz - 1) {
      return rawHeight(clamp(x, WORLD.minX, WORLD.maxX), clamp(z, WORLD.minZ, WORLD.maxZ));
    }
    const u = fx - i, v = fz - j;
    const h00 = this.h[j * this.nx + i], h10 = this.h[j * this.nx + i + 1];
    const h01 = this.h[(j + 1) * this.nx + i], h11 = this.h[(j + 1) * this.nx + i + 1];
    // Diagonal de (i+1,j) a (i,j+1)
    if (u + v <= 1) return h00 + (h10 - h00) * u + (h01 - h00) * v;
    return h11 + (h01 - h11) * (1 - u) + (h10 - h11) * (1 - v);
  }

  // Altura del piso incluyendo muelles y rampas
  groundAt(x, z) {
    let g = this.heightAt(x, z);
    for (let k = 0; k < DECKS.length; k++) {
      const d = DECKS[k];
      if (x >= d.x0 && x <= d.x1 && z >= d.z0 && z <= d.z1 && d.h > g) g = d.h;
    }
    for (let k = 0; k < this.ramps.length; k++) {
      const r = this.ramps[k];
      const dx = x - r.x, dz = z - r.z;
      if (dx * dx + dz * dz > r.rad2) continue;
      // coordenadas locales de la rampa
      const lz = dx * r.fx + dz * r.fz; // a lo largo
      const lx = dx * r.fz - dz * r.fx; // a lo ancho
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
      this.ramps.push({
        ...r, base, fx: Math.sin(r.rot), fz: Math.cos(r.rot),
        rad2: (r.len * 0.5 + r.w) ** 2,
      });
    }
  }

  // Aplana el terreno a lo largo de las calles para que queden prolijas
  flattenRoads(segments) {
    const nx = this.nx;
    const target = new Float32Array(this.h.length);
    const weight = new Float32Array(this.h.length);
    for (const s of segments) {
      const pad = s.width / 2 + 7;
      const minX = Math.min(s.ax, s.bx) - pad, maxX = Math.max(s.ax, s.bx) + pad;
      const minZ = Math.min(s.az, s.bz) - pad, maxZ = Math.max(s.az, s.bz) + pad;
      const i0 = Math.max(0, Math.floor((minX - WORLD.minX) / CELL));
      const i1 = Math.min(nx - 1, Math.ceil((maxX - WORLD.minX) / CELL));
      const j0 = Math.max(0, Math.floor((minZ - WORLD.minZ) / CELL));
      const j1 = Math.min(this.nz - 1, Math.ceil((maxZ - WORLD.minZ) / CELL));
      for (let j = j0; j <= j1; j++) {
        const z = WORLD.minZ + j * CELL;
        for (let i = i0; i <= i1; i++) {
          const x = WORLD.minX + i * CELL;
          const p = pointSegDist(x, z, s.ax, s.az, s.bx, s.bz);
          if (p.d > pad) continue;
          const w = 1 - smoothstep(s.width / 2 + 1, pad, p.d);
          if (w <= 0) continue;
          const hh = lerp(s.ha, s.hb, p.t);
          const k = j * nx + i;
          target[k] += hh * w;
          weight[k] += w;
        }
      }
    }
    for (let k = 0; k < this.h.length; k++) {
      if (weight[k] > 0) {
        const w = Math.min(1, weight[k]);
        const t = target[k] / weight[k];
        this.h[k] = lerp(this.h[k], t, w);
      }
    }
  }

  // Colores por vértice según altura, pendiente y zona
  colorFor(x, z, h, ny, urban) {
    const n = fbm(x * 0.012, z * 0.012, 3);
    const n2 = noise2(x * 0.08, z * 0.08);
    let r, g, b;
    const cx = coastX(z);
    const d = cx - x;
    if (h < 0.3) { // fondo marino / orilla mojada
      r = 0.52; g = 0.47; b = 0.36;
    } else if (d < 70 && h < 5) { // playa (canto rodado y arena gris)
      const t = n2 * 0.15;
      r = 0.72 + t; g = 0.66 + t; b = 0.52 + t;
    } else if (ny < 0.8) { // barranco / acantilado arcilloso con estratos
      const t = n * 0.14;
      const band = Math.sin(h * 0.9 + n * 3) * 0.5 + 0.5;
      r = lerp(0.62, 0.78, band) + t; g = lerp(0.54, 0.70, band) + t; b = lerp(0.44, 0.58, band) + t;
    } else if (urban) {
      const t = n2 * 0.08;
      r = 0.52 + t; g = 0.49 + t; b = 0.43 + t;
    } else { // estepa patagónica
      const m = smoothstep(0.35, 0.65, n);
      r = lerp(0.68, 0.58, m); g = lerp(0.59, 0.55, m); b = lerp(0.41, 0.39, m);
      const t = (n2 - 0.5) * 0.08;
      r += t; g += t; b += t * 0.5;
      if (ny < 0.9) { r += 0.06; g += 0.03; }
    }
    return srgbToLinear(clamp(r, 0, 1), clamp(g, 0, 1), clamp(b, 0, 1));
  }

  buildMesh(urbanTest) {
    const group = new THREE.Group();
    const tiles = 6;
    const tilesZ = 8;
    const stepI = Math.ceil((this.nx - 1) / tiles);
    const stepJ = Math.ceil((this.nz - 1) / tilesZ);
    const mat = new THREE.MeshLambertMaterial({ vertexColors: true });
    const nrm = new THREE.Vector3();
    for (let tj = 0; tj < tilesZ; tj++) {
      for (let ti = 0; ti < tiles; ti++) {
        const i0 = ti * stepI, i1 = Math.min(this.nx - 1, i0 + stepI);
        const j0 = tj * stepJ, j1 = Math.min(this.nz - 1, j0 + stepJ);
        if (i1 <= i0 || j1 <= j0) continue;
        const w = i1 - i0 + 1, hgt = j1 - j0 + 1;
        const pos = new Float32Array(w * hgt * 3);
        const col = new Float32Array(w * hgt * 3);
        let p = 0;
        let allUnder = true;
        for (let j = j0; j <= j1; j++) {
          for (let i = i0; i <= i1; i++) {
            const x = WORLD.minX + i * CELL, z = WORLD.minZ + j * CELL;
            const h = this.h[j * this.nx + i];
            if (h > -6) allUnder = false;
            pos[p] = x; pos[p + 1] = h; pos[p + 2] = z;
            this.normalAt(x, z, nrm);
            const c = this.colorFor(x, z, h, nrm.y, urbanTest(x, z));
            col[p] = c[0]; col[p + 1] = c[1]; col[p + 2] = c[2];
            p += 3;
          }
        }
        if (allUnder) continue;
        const idx = [];
        for (let j = 0; j < hgt - 1; j++) {
          for (let i = 0; i < w - 1; i++) {
            const a = j * w + i, b = a + 1, c = a + w, d = c + 1;
            // misma diagonal que heightAt: (i+1,j)-(i,j+1)
            idx.push(a, c, b, b, c, d);
          }
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
        geo.setIndex(idx);
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
  // Grilla cercana a la costa con profundidad por vértice
  const step = 12;
  const zs = [];
  for (let z = WORLD.minZ - 200; z <= WORLD.maxZ + 200; z += step) zs.push(z);
  const xMinFor = (z) => coastX(clamp(z, WORLD.minZ, WORLD.maxZ)) - 60;
  const xMax = WORLD.maxX + 250;
  const cols = Math.ceil((xMax - 200) / step) + 1;
  const pos = [], depth = [], idx = [];
  for (let j = 0; j < zs.length; j++) {
    const z = zs[j];
    const x0 = Math.min(xMinFor(z), 380);
    for (let i = 0; i < cols; i++) {
      const x = lerp(x0, xMax, i / (cols - 1));
      pos.push(x, 0, z);
      const g = terrain.heightAt(clamp(x, WORLD.minX, WORLD.maxX), clamp(z, WORLD.minZ, WORLD.maxZ));
      depth.push(x > WORLD.maxX ? 16 : -g);
    }
  }
  for (let j = 0; j < zs.length - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const a = j * cols + i, b = a + 1, c = a + cols, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('depth', new THREE.Float32BufferAttribute(depth, 1));
  geo.setIndex(idx);
  geo.computeBoundingSphere();
  const near = new THREE.Mesh(geo, mat);
  group.add(near);

  // Mar abierto hasta el horizonte
  const farGeo = new THREE.PlaneGeometry(8000, 12000, 1, 1);
  farGeo.rotateX(-Math.PI / 2);
  const farDepth = new Float32Array(farGeo.attributes.position.count).fill(20);
  farGeo.setAttribute('depth', new THREE.BufferAttribute(farDepth, 1));
  const far = new THREE.Mesh(farGeo, mat);
  far.position.set(xMax + 4000 - 2, -0.05, 0);
  group.add(far);
  group.userData.material = mat;
  return group;
}
