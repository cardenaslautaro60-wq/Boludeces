import * as THREE from 'three';
import { lam } from '../render/style.js';
import { hexColor } from './geom.js';
import { releaseAfterUpload } from './culling.js';

// Carga por sectores (como el streaming de Vice City): el mapa se divide en cuadras de 300 m.
// Las que están cerca de la cámara se dibujan con todo el detalle (fachadas con textura, casas,
// tanques, antenas); las de lejos, con una sola malla liviana por sector: cajas con el color
// promedio de la fachada y del techo, y ventanas que se prenden de noche.
// Nada se arma ni se sube a la placa de video antes de hacer falta: el detalle de un sector se
// sube la primera vez que la cámara se acerca, y su versión lejana se arma la primera vez que
// entra en la distancia de dibujo (antes es solo una lista de cajas).
export const SECTOR = 300;

// materiales de la ciudad que tienen versión lejana (el resto se dibuja siempre)
export const CON_LOD = new Set(['office', 'office2', 'office3', 'office4', 'house', 'shop', 'metal', 'brick', 'roof', 'roofFlat']);

// cada caja: marco (cx, cz, ax, az), x0, x1, z0, z1, y0, y1, color de pared (rgb), techo
// (0 plano, 1 a dos aguas a lo largo de x, 2 a lo largo de z), altura del techo, color del techo
const REC = 18;
// posiciones en enteros de 16 bits: octavos de metro desde la esquina del sector
const Q = 8;

const key = (i, j) => `${i},${j}`;

export class Sectores {
  constructor(textures) {
    this.T = textures;
    this.cells = new Map();
    this.avg = new Map();
    this.boxes = 0;
    this.built = 0;
    this.material = null;
    this.group = null;
    this.first = true;
  }

  cellAt(x, z) {
    const i = Math.floor(x / SECTOR), j = Math.floor(z / SECTOR);
    const k = key(i, j);
    let c = this.cells.get(k);
    if (!c) {
      c = { i, j, x0: i * SECTOR, z0: j * SECTOR, items: [], rec: [], lod: null, detail: false };
      this.cells.set(k, c);
    }
    return c;
  }

  // Color promedio de una textura (lineal), para que la caja lejana tenga el tono de la fachada
  texAvg(mat) {
    if (this.avg.has(mat)) return this.avg.get(mat);
    const T = this.T || {};
    const tex = { office2: T.office2 || T.office, office3: T.office3 || T.office, office4: T.office4 || T.office }[mat] || T[mat];
    let out = [0.7, 0.7, 0.7];
    try {
      const img = tex && tex.image;
      if (img && (img.width || img.naturalWidth)) {
        const c = document.createElement('canvas'); c.width = c.height = 4;
        const g = c.getContext('2d');
        g.drawImage(img, 0, 0, 4, 4);
        const d = g.getImageData(0, 0, 4, 4).data;
        let r = 0, gg = 0, b = 0;
        for (let i = 0; i < d.length; i += 4) { r += d[i]; gg += d[i + 1]; b += d[i + 2]; }
        const n = d.length / 4;
        out = hexColor(((Math.round(r / n) << 16) | (Math.round(gg / n) << 8) | Math.round(b / n)) >>> 0);
      }
    } catch (e) { /* textura sin imagen todavía: gris */ }
    this.avg.set(mat, out);
    return out;
  }

  tint(hex, mat) {
    const c = hexColor(hex), a = this.texAvg(mat);
    return [c[0] * a[0], c[1] * a[1], c[2] * a[2]];
  }

  // Caja de un edificio en el marco local (cx, cz, ax, az). Un poco más chica que el edificio de
  // verdad, para que nunca tape lo que queda dibujado al lado (la base, los carteles).
  // roof: { gable, rise, along, hex, mat }
  box(frame, x0, x1, z0, z1, y0, y1, wallHex, wallMat, roof) {
    const f = frame || { cx: 0, cz: 0, ax: 1, az: 0 };
    const k = 0.25;
    x0 += k; x1 -= k; z0 += k; z1 -= k; y1 -= 0.2;
    if (x1 <= x0 || z1 <= z0 || y1 <= y0) return;
    const mx = (x0 + x1) / 2, mz = (z0 + z1) / 2;
    const c = this.cellAt(f.cx + mx * f.ax - mz * f.az, f.cz + mx * f.az + mz * f.ax);
    const w = this.tint(wallHex, wallMat);
    const gable = roof && roof.gable;
    const r = this.tint(roof ? roof.hex : 0xaaaaaa, gable ? 'roof' : (roof && roof.mat) || 'roofFlat');
    c.rec.push(f.cx, f.cz, f.ax, f.az, x0, x1, z0, z1, y0, y1, w[0], w[1], w[2], gable ? (roof.along ? 1 : 2) : 0, gable ? roof.rise : 0, r[0], r[1], r[2]);
    this.boxes++;
  }

  makeMaterial() {
    const m = lam({ vertexColors: true, emissive: new THREE.Color(1, 0.78, 0.48), emissiveIntensity: 0 });
    m.onBeforeCompile = (sh) => {
      // ventanas dibujadas con la posición: u a lo largo de la pared, v en altura
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec2 vM;\nvarying float vWall;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvec3 wpL = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvM = vec2(wpL.z * normal.x - wpL.x * normal.z, wpL.y);\nvWall = abs(normal.y) < 0.5 ? 1.0 : 0.0;');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying vec2 vM;\nvarying float vWall;\nfloat winMask() {\n  vec2 f = vec2(fract(vM.x / 3.2), fract(vM.y / 3.0));\n  return vWall * step(0.28, f.x) * step(f.x, 0.72) * step(0.38, f.y) * step(f.y, 0.78);\n}')
        .replace('#include <color_fragment>', '#include <color_fragment>\nfloat win = winMask();\ndiffuseColor.rgb *= 1.0 - 0.22 * win;')
        // de noche se prenden algunas ventanas (distintas en cada edificio: depende del color)
        .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\nvec2 wc = floor(vec2(vM.x / 3.2, vM.y / 3.0));\nfloat lit = step(0.58, fract(sin(dot(wc, vec2(12.9898, 78.233)) + dot(vColor.rgb, vec3(91.7, 37.3, 53.1))) * 43758.5453));\ntotalEmissiveRadiance *= win * lit;');
    };
    m.customProgramCacheKey = () => 'sector-lod-v2';
    return m;
  }

  build(scene) {
    this.material = this.makeMaterial();
    this.group = new THREE.Group();
    this.group.name = 'sectores';
    scene.add(this.group);
    // la lista de cajas en 32 bits ocupa la mitad
    for (const c of this.cells.values()) if (c.rec) c.rec = c.rec.length ? Float32Array.from(c.rec) : null;
    this.list = [...this.cells.values()];
    return this.group;
  }

  // Arma la malla lejana de un sector a partir de su lista de cajas
  buildCell(c) {
    const R = c.rec;
    const nb = R.length / REC;
    let n = 0;
    for (let b = 0; b < nb; b++) n += 24 + (R[b * REC + 13] ? 18 : 6);
    const P = new Int16Array(n * 3), N = new Int8Array(n * 3), C = new Uint8Array(n * 3);
    let v = 0;
    const X0 = c.x0, Z0 = c.z0;
    const col = [0, 0, 0];
    let ccx = 0, ccy = 0, ccz = 0;
    const put = (p, nx, ny, nz) => {
      P[v * 3] = Math.round((p[0] - X0) * Q); P[v * 3 + 1] = Math.round(p[1] * Q); P[v * 3 + 2] = Math.round((p[2] - Z0) * Q);
      N[v * 3] = Math.round(nx * 127); N[v * 3 + 1] = Math.round(ny * 127); N[v * 3 + 2] = Math.round(nz * 127);
      C[v * 3] = Math.round(Math.min(1, col[0]) * 255); C[v * 3 + 1] = Math.round(Math.min(1, col[1]) * 255); C[v * 3 + 2] = Math.round(Math.min(1, col[2]) * 255);
      v++;
    };
    // cara (3 o 4 puntos) con la normal hacia afuera de la caja
    const face = (a, b, d, e) => {
      const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
      const q = e || d;
      const wx = q[0] - a[0], wy = q[1] - a[1], wz = q[2] - a[2];
      let nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx;
      const L = Math.hypot(nx, ny, nz) || 1;
      nx /= L; ny /= L; nz /= L;
      const mx = (a[0] + b[0] + d[0]) / 3 - ccx, my = (a[1] + b[1] + d[1]) / 3 - ccy, mz = (a[2] + b[2] + d[2]) / 3 - ccz;
      const flip = nx * mx + ny * my + nz * mz < 0;
      if (flip) { nx = -nx; ny = -ny; nz = -nz; }
      const tri = (p0, p1, p2) => { if (flip) { put(p0, nx, ny, nz); put(p2, nx, ny, nz); put(p1, nx, ny, nz); } else { put(p0, nx, ny, nz); put(p1, nx, ny, nz); put(p2, nx, ny, nz); } };
      tri(a, b, d);
      if (e) tri(a, d, e);
    };
    for (let b = 0; b < nb; b++) {
      const o = b * REC;
      const cx = R[o], cz = R[o + 1], ax = R[o + 2], az = R[o + 3];
      const x0 = R[o + 4], x1 = R[o + 5], z0 = R[o + 6], z1 = R[o + 7], y0 = R[o + 8], y1 = R[o + 9];
      const kind = R[o + 13], rise = R[o + 14];
      const W = (lx, lz, y) => [cx + lx * ax - lz * az, y, cz + lx * az + lz * ax];
      const c0 = W(x0, z0, 0), c1 = W(x1, z0, 0), c2 = W(x1, z1, 0), c3 = W(x0, z1, 0);
      ccx = (c0[0] + c2[0]) / 2; ccz = (c0[2] + c2[2]) / 2; ccy = (y0 + y1) / 2;
      const lo = (p) => [p[0], y0, p[2]], hi = (p) => [p[0], y1, p[2]];
      col[0] = R[o + 10]; col[1] = R[o + 11]; col[2] = R[o + 12];
      for (const [p, q] of [[c3, c2], [c2, c1], [c1, c0], [c0, c3]]) face(lo(p), lo(q), hi(q), hi(p));
      if (kind === 0) {
        col[0] = R[o + 15]; col[1] = R[o + 16]; col[2] = R[o + 17];
        face(hi(c3), hi(c2), hi(c1), hi(c0));
        continue;
      }
      // techo a dos aguas: la cumbrera va por el medio, a lo largo de x (1) o de z (2)
      const mid = (p, q) => [(p[0] + q[0]) / 2, y1 + rise, (p[2] + q[2]) / 2];
      const [r0, r1] = kind === 1 ? [mid(c0, c3), mid(c1, c2)] : [mid(c0, c1), mid(c3, c2)];
      ccy = y1;
      if (kind === 1) {
        face(hi(c0), hi(c3), r0); face(hi(c2), hi(c1), r1);
        col[0] = R[o + 15]; col[1] = R[o + 16]; col[2] = R[o + 17];
        face(hi(c3), hi(c2), r1, r0); face(hi(c1), hi(c0), r0, r1);
      } else {
        face(hi(c3), hi(c2), r1); face(hi(c1), hi(c0), r0);
        col[0] = R[o + 15]; col[1] = R[o + 16]; col[2] = R[o + 17];
        face(hi(c2), hi(c1), r0, r1); face(hi(c0), hi(c3), r1, r0);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(P, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(N, 3, true));
    geo.setAttribute('color', new THREE.BufferAttribute(C, 3, true));
    geo.computeBoundingSphere();
    const mesh = new THREE.Mesh(geo, this.material);
    mesh.position.set(X0, 0, Z0);
    mesh.scale.setScalar(1 / Q);
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;
    mesh.userData.noShadow = true;
    this.group.add(mesh);
    mesh.updateMatrixWorld(true);
    // una vez en la placa de video, la copia en memoria se suelta
    releaseAfterUpload(mesh);
    c.lod = mesh;
    c.rec = null;
    this.built++;
  }

  // Los objetos del detalle que se prenden y apagan con el sector (los demás siguen solos)
  claim(culler, test) {
    let n = 0;
    for (const it of culler.items) {
      if (!test(it.obj)) continue;
      // el sector donde se armó (no el centro de la malla, que puede caer en el de al lado)
      const cell = it.obj.userData.cell;
      if (!cell || cell.size !== SECTOR) continue;
      const c = this.cellAt((cell.i + 0.5) * SECTOR, (cell.j + 0.5) * SECTOR);
      it.sec = c;
      c.items.push(it);
      n++;
    }
    this.list = [...this.cells.values()];
    this.claimed = n;
    return n;
  }

  // near: hasta dónde va el detalle; far: hasta dónde se ven las cajas
  update(cam, near, far, culler, maxDist) {
    let budget = 2;
    // la primera vez se arma todo lo que se ve; después, de a poco
    let builds = this.first ? 1e9 : 1;
    this.first = false;
    const cx = cam.x, cz = cam.z;
    for (const c of this.list) {
      // distancia de la cámara al cuadrado del sector (con margen por lo que sobresale)
      const dx = Math.max(c.x0 - 20 - cx, 0, cx - (c.x0 + SECTOR + 20));
      const dz = Math.max(c.z0 - 20 - cz, 0, cz - (c.z0 + SECTOR + 20));
      const d = Math.hypot(dx, dz);
      let want = c.detail ? d < near + 40 : d < near;
      // lo que está a la vuelta se carga ya; lo de más allá, de a dos sectores por cuadro
      if (want && !c.detail && d > 150 && budget-- <= 0) want = false;
      if (want !== c.detail) {
        c.detail = want;
        for (const it of c.items) culler.apply(it, cam, maxDist);
      }
      const lod = !c.detail && d < far;
      if (lod && !c.lod && c.rec && c.rec.length && builds-- > 0) this.buildCell(c);
      if (c.lod) c.lod.visible = lod;
    }
  }

  setNight(e) {
    if (this.material) this.material.emissiveIntensity = e;
  }

  // Para depurar: __game.world.sectores.info()
  info() {
    let det = 0, lod = 0;
    for (const c of this.list) { if (c.detail) det++; else if (c.lod && c.lod.visible) lod++; }
    return { sectores: this.list.length, conDetalle: det, lejanos: lod, armados: this.built, cajas: this.boxes, objetos: this.claimed };
  }
}
