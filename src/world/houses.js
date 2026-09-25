import * as THREE from 'three';
import { lam, STYLE } from '../render/style.js';
import { InstChunks } from './culling.js';

// Casas de barrio instanciadas: 4 plantillas (1 o 2 plantas, techo a dos aguas o plano),
// cada instancia con su escala, color de pared y color de techo. Agrupadas por sector.
const WN = 10, DN = 9, FH = 2.8;
const CHUNK = 260;

let ATLAS = null;

// Versión realista: el mismo esquema de atlas, 4 veces más grande, con fotos y mapas de
// relieve (normal) y de rugosidad/metal. El alfa del color marca qué se tiñe.
function realAtlas(T) {
  const R = T.real, W = 1024, H = 2048;
  const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return [c, c.getContext('2d')]; };
  const [c, g] = mk(), [cn, gn] = mk(), [cm, gm] = mk(), [ce, ge] = mk(), [ck, gk] = mk();
  // máscara de teñido: la pared se tiñe con el color de la casa; techo y zócalo, con el suyo
  gk.fillStyle = '#fff'; gk.fillRect(0, 0, W, H);
  if (T.houseMask) gk.drawImage(T.houseMask.image, 0, 0, W, 1024);
  const tile = (ctx, img, x, y, w, h, size) => {
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    for (let yy = y; yy < y + h; yy += size) for (let xx = x; xx < x + w; xx += size) ctx.drawImage(img, xx, yy, size, size);
    ctx.restore();
  };
  ge.fillStyle = '#000'; ge.fillRect(0, 0, W, H);
  // paredes (textura de casa de 2 plantas, con su alfa)
  g.drawImage(T.house.image, 0, 0, W, 1024);
  gn.drawImage(T.houseN.image, 0, 0, W, 1024);
  gm.drawImage(T.houseM.image, 0, 0, W, 1024);
  ge.drawImage(T.houseE.image, 0, 0, W, 1024);
  // techo de chapa acanalada (se tiñe con el color del techo)
  tile(g, R.chapa.img, 0, 1024, W, 512, 256); tile(gn, R.chapa.nimg, 0, 1024, W, 512, 256); tile(gm, R.chapa.mimg, 0, 1024, W, 512, 256);
  g.fillStyle = 'rgba(0,0,0,0.3)'; g.fillRect(0, 1024, W, 10);
  // techo plano y zócalo: hormigón
  tile(g, R.hormigon.img, 0, 1536, W, 512, 256); tile(gn, R.hormigon.nimg, 0, 1536, W, 512, 256); tile(gm, R.hormigon.mimg, 0, 1536, W, 512, 256);
  // la chapa es metal: canal azul del mapa de rugosidad/metal al máximo en la zona del techo
  const md = gm.getImageData(0, 1024, W, 512);
  for (let i = 0; i < md.data.length; i += 4) { md.data[i + 2] = 200; md.data[i + 1] = Math.min(255, md.data[i + 1] * 0.8 + 30); }
  gm.putImageData(md, 0, 1024);
  const tx = (cc, color) => {
    const t = new THREE.CanvasTexture(cc);
    if (color) t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.ClampToEdgeWrapping; t.anisotropy = 8;
    return t;
  };
  ATLAS = { map: tx(c, true), emissive: tx(ce, true), normalMap: tx(cn, false), orm: tx(cm, false), mask: tx(ck, false) };
  return ATLAS;
}

function atlas(T) {
  if (ATLAS) return ATLAS;
  if (T.real) return realAtlas(T);
  const W = 256, H = 512;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const e = document.createElement('canvas'); e.width = W; e.height = H;
  const g = c.getContext('2d'), ge = e.getContext('2d');
  ge.fillStyle = '#000'; ge.fillRect(0, 0, W, H);
  // paredes (textura de casa de 2 plantas)
  if (T.house.image) g.drawImage(T.house.image, 0, 0, W, 256);
  if (T.houseE.image) ge.drawImage(T.houseE.image, 0, 0, W, 256);
  // techo de chapa
  for (let x = 0; x < W; x += 64) for (let y = 256; y < 384; y += 64) if (T.roof.image) g.drawImage(T.roof.image, x, y, 64, 64);
  g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(0, 256, W, 3);
  // techo plano
  for (let x = 0; x < W; x += 64) if (T.roofFlat.image) g.drawImage(T.roofFlat.image, x, 384, 64, 64);
  // zócalo / cimiento
  g.fillStyle = '#9a958c'; g.fillRect(0, 448, W, 64);
  for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(0,0,0,${Math.random() * 0.12})`; g.fillRect(Math.random() * W, 448 + Math.random() * 64, 2, 2); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.ClampToEdgeWrapping; t.anisotropy = 4;
  const te = new THREE.CanvasTexture(e); te.colorSpace = THREE.SRGBColorSpace; te.wrapS = THREE.RepeatWrapping; te.wrapT = THREE.ClampToEdgeWrapping;
  ATLAS = { map: t, emissive: te };
  return ATLAS;
}

// v de cada región del atlas
const V = { wall0: 0.5, wallPerFloor: 0.25, roof0: 0.26, roof1: 0.49, flat0: 0.13, flat1: 0.24, base0: 0.01, base1: 0.12, plain: [0.02, 0.985] };

function template(floors, flat) {
  const pos = [], nrm = [], uv = [], tint = [];
  const Hh = floors * FH;
  const x0 = -WN / 2, x1 = WN / 2, z0 = -DN / 2, z1 = DN / 2;
  const push = (p, n, u, t) => { pos.push(...p); nrm.push(...n); uv.push(...u); tint.push(t); };
  const quad = (a, b, c, d, ua, ub, uc, ud, t) => {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = d[0] - a[0], vy = d[1] - a[1], vz = d[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const L = Math.hypot(nx, ny, nz) || 1; const n = [nx / L, ny / L, nz / L];
    push(a, n, ua, t); push(b, n, ub, t); push(c, n, uc, t);
    push(a, n, ua, t); push(c, n, uc, t); push(d, n, ud, t);
  };
  const wall = (ax, az, bx, bz, y0, y1, v0, v1, t, uS) => {
    const L = Math.hypot(bx - ax, bz - az);
    const uo = Math.floor(Math.random() * 4) / 4;
    quad([ax, y0, az], [bx, y0, bz], [bx, y1, bz], [ax, y1, az], [uo, v0], [uo + L / uS, v0], [uo + L / uS, v1], [uo, v1], t);
  };
  const ring = (y0, y1, v0, v1, t, uS) => {
    wall(x0, z1, x1, z1, y0, y1, v0, v1, t, uS);   // fondo (+z)
    wall(x1, z0, x0, z0, y0, y1, v0, v1, t, uS);   // frente (-z, da a la calle)
    wall(x1, z1, x1, z0, y0, y1, v0, v1, t, uS);
    wall(x0, z0, x0, z1, y0, y1, v0, v1, t, uS);
  };
  ring(-3, 0.02, V.base0, V.base1, 2, 4);
  ring(0, Hh, V.wall0, V.wall0 + V.wallPerFloor * floors, 0, 14);
  if (flat) {
    const y = Hh + 0.02;
    quad([x0, y, z1], [x1, y, z1], [x1, y, z0], [x0, y, z0], [0, V.flat1], [1.2, V.flat1], [1.2, V.flat0], [0, V.flat0], 1);
    // parapeto
    const p = V.plain;
    for (const [ax, az, bx, bz] of [[x0, z1, x1, z1], [x1, z0, x0, z0], [x1, z1, x1, z0], [x0, z0, x0, z1]]) {
      quad([ax, Hh, az], [bx, Hh, bz], [bx, Hh + 0.5, bz], [ax, Hh + 0.5, az], p, p, p, p, 0);
    }
  } else {
    const o = 0.45, rise = floors === 1 ? 1.7 : 1.9;
    const y = Hh, yr = Hh + rise, zm = 0;
    const X0 = x0 - o, X1 = x1 + o, Z0 = z0 - o, Z1 = z1 + o;
    const us = 12;
    quad([X0, y - 0.12, Z1], [X1, y - 0.12, Z1], [X1, yr, zm], [X0, yr, zm], [X0 / us, V.roof0], [X1 / us, V.roof0], [X1 / us, V.roof1], [X0 / us, V.roof1], 1);
    quad([X1, y - 0.12, Z0], [X0, y - 0.12, Z0], [X0, yr, zm], [X1, yr, zm], [X1 / us, V.roof0], [X0 / us, V.roof0], [X0 / us, V.roof1], [X1 / us, V.roof1], 1);
    // hastiales
    const p = V.plain;
    const tri = (a, b, c, n) => { push(a, n, p, 0); push(b, n, p, 0); push(c, n, p, 0); };
    tri([x0, y, z0], [x0, y, z1], [x0, yr - 0.1, zm], [-1, 0, 0]);
    tri([x1, y, z1], [x1, y, z0], [x1, yr - 0.1, zm], [1, 0, 0]);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute('tint', new THREE.Float32BufferAttribute(tint, 1));
  g.userData.height = Hh + (flat ? 0.5 : floors === 1 ? 1.7 : 1.9);
  return g;
}

export class HouseInstances {
  constructor(T) {
    this.T = T;
    this.items = [];
    const A = atlas(T);
    const mat = lam({ map: A.map, emissive: 0xffffff, emissiveMap: A.emissive, emissiveIntensity: 0 },
      A.normalMap ? { normalMap: A.normalMap, roughnessMap: A.orm, metalnessMap: A.orm, roughness: 1, metalness: 1 } : {});
    mat.onBeforeCompile = (sh) => {
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nattribute float tint;\nattribute vec3 roofColor;')
        // ventanas a tamaño real: la u de cada pared se estira con la escala de la instancia
        .replace('#include <uv_vertex>', `vec2 uvI = uv;
#ifdef USE_INSTANCING
  uvI.x *= abs(normal.x) > 0.5 ? length(instanceMatrix[2].xyz) : length(instanceMatrix[0].xyz);
#endif
#define uv uvI
#include <uv_vertex>
#undef uv`)
        .replace('#include <color_vertex>', '#include <color_vertex>\n#ifdef USE_INSTANCING_COLOR\n  vColor.rgb = tint < 0.5 ? instanceColor : (tint < 1.5 ? roofColor : vec3(0.78));\n#endif');
    };
    mat.customProgramCacheKey = () => 'houses-v2';
    if (STYLE.realista) STYLE.tintMask(mat, A.mask || null);
    this.material = mat;
    this.templates = { '1g': template(1, false), '2g': template(2, false), '1f': template(1, true), '2f': template(2, true) };
  }

  // o: caja orientada {cx,cz,ax,az,hw,hd}; el frente (-z local) da a la calle
  add(o, floors, flat, wallHex, roofHex, terrain) {
    const bx = -o.az, bz = o.ax;
    let mx = -Infinity, mn = Infinity;
    for (const [s, t] of [[-1, -1], [1, -1], [1, 1], [-1, 1], [0, 0]]) {
      const h = terrain.heightAt(o.cx + o.ax * o.hw * s + bx * o.hd * t, o.cz + o.az * o.hw * s + bz * o.hd * t);
      mx = Math.max(mx, h); mn = Math.min(mn, h);
    }
    this.items.push({ ...o, floors, flat, wall: wallHex, roof: roofHex, y: mx + 0.08, key: `${floors}${flat ? 'f' : 'g'}` });
  }

  build(colliders) {
    const group = new THREE.Group();
    const buckets = new Map();
    for (const it of this.items) {
      const k = `${Math.floor(it.cx / CHUNK)},${Math.floor(it.cz / CHUNK)},${it.key}`;
      let b = buckets.get(k);
      if (!b) { b = []; buckets.set(k, b); }
      b.push(it);
    }
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
    const col = new THREE.Color();
    for (const [k, list] of buckets) {
      const key = k.split(',')[2];
      const base = this.templates[key];
      const geo = new THREE.BufferGeometry();
      for (const name of ['position', 'normal', 'uv', 'tint']) geo.setAttribute(name, base.attributes[name]);
      const roof = new Float32Array(list.length * 3);
      const mesh = new THREE.InstancedMesh(geo, this.material, list.length);
      list.forEach((it, i) => {
        p.set(it.cx, it.y, it.cz);
        q.setFromAxisAngle(up, Math.atan2(-it.az, it.ax));
        s.set((it.hw * 2) / WN, 1, (it.hd * 2) / DN);
        m4.compose(p, q, s);
        mesh.setMatrixAt(i, m4);
        mesh.setColorAt(i, col.setHex(it.wall));
        col.setHex(it.roof);
        roof[i * 3] = col.r; roof[i * 3 + 1] = col.g; roof[i * 3 + 2] = col.b;
        colliders.addOBB(it.cx, it.cz, it.ax, it.az, it.hw, it.hd, it.y - 3, it.y + base.userData.height, 'building');
      });
      geo.setAttribute('roofColor', new THREE.InstancedBufferAttribute(roof, 3));
      mesh.computeBoundingSphere();
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    }
    this.count = this.items.length;
    this.buildRoofProps(group);
    return group;
  }

  // Lo que hay arriba de los techos de Comodoro: tanques de agua (negros, celestes o blancos,
  // sobre una base o una torrecita de ladrillo), antenas de TV y alguna antena satelital
  buildRoofProps(group) {
    const box = (w, h, d, y = 0) => { const g = new THREE.BoxGeometry(w, h, d); g.translate(0, y + h / 2, 0); return g; };
    const tankG = new THREE.CylinderGeometry(0.55, 0.52, 1.15, 14); tankG.translate(0, 0.575, 0);
    const lid = new THREE.CylinderGeometry(0.2, 0.3, 0.12, 10); lid.translate(0, 1.2, 0);
    const tankGeo = mergeGeos([tankG, lid]);
    const baseGeo = box(1.3, 0.35, 1.3);
    const towerGeo = box(1.5, 1, 1.5);
    const mast = [box(0.04, 3.2, 0.04)];
    for (const [y, w] of [[2.4, 1.6], [2.75, 1.25], [3.05, 0.9]]) mast.push(box(w, 0.03, 0.03, y));
    mast.push(box(0.03, 0.03, 0.9, 2.6));
    const antGeo = mergeGeos(mast);
    const dishG = new THREE.SphereGeometry(0.42, 12, 6, 0, Math.PI * 2, 0, 0.9);
    dishG.scale(1, 0.35, 1); dishG.rotateX(-Math.PI / 2 + 0.6); dishG.translate(0, 0.6, 0);
    const dishGeo = mergeGeos([dishG, box(0.05, 0.6, 0.05)]);
    const tanks = new InstChunks(tankGeo, lam({ color: 0xffffff, roughness: 0.55 }), 300);
    const bases = new InstChunks(baseGeo, lam({ color: 0x8e8a82 }), 300);
    const towers = new InstChunks(towerGeo, lam({ color: 0xa25a3e }), 300);
    const ants = new InstChunks(antGeo, lam({ color: 0x9a9ea2, metalness: STYLE.realista ? 0.8 : 0, roughness: 0.45 }), 300);
    const dishes = new InstChunks(dishGeo, lam({ color: 0xd8d8d4, roughness: 0.5 }), 300);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), sc = new THREE.Vector3(1, 1, 1), up = new THREE.Vector3(0, 1, 0);
    const col = new THREE.Color();
    const TANK = [0x1c1c1e, 0x1c1c1e, 0x2a2a2c, 0x8fc3dd, 0xe8e4d8];
    const put = (ic, it, lx, lz, y, rot = 0, s = 1, c = null) => {
      const x = it.cx + it.ax * lx - it.az * lz, z = it.cz + it.az * lx + it.ax * lz;
      p.set(x, y, z);
      q.setFromAxisAngle(up, Math.atan2(-it.az, it.ax) + rot);
      sc.setScalar(s);
      m4.compose(p, q, sc);
      ic.add(x, z, m4, c);
    };
    this.items.forEach((it, i) => {
      const h = ((i * 2654435761) >>> 0) / 4294967296, h2 = ((i * 40503 + 17) % 1000) / 1000;
      const Hh = it.floors * FH;
      const top = it.y + Hh + (it.flat ? 0.02 : 0);
      const side = h2 < 0.5 ? -1 : 1;
      // tanque de agua
      if (h < (it.flat ? 0.72 : 0.42)) {
        const tc = col.setHex(TANK[Math.floor(h2 * TANK.length) % TANK.length]).clone();
        const lx = side * it.hw * 0.45, lz = it.hd * 0.4;
        if (it.flat) {
          put(bases, it, lx, lz, top);
          put(tanks, it, lx, lz, top + 0.35, 0, 1, tc);
        } else {
          // torrecita de ladrillo que asoma por encima del techo a dos aguas
          const rise = it.floors === 1 ? 1.7 : 1.9;
          const th = rise + 0.2;
          p.set(0, 0, 0);
          const x = it.cx + it.ax * lx - it.az * lz, z = it.cz + it.az * lx + it.ax * lz;
          m4.compose(p.set(x, top - 0.1, z), q.setFromAxisAngle(up, Math.atan2(-it.az, it.ax)), sc.set(1, th, 1));
          towers.add(x, z, m4);
          sc.set(1, 1, 1);
          put(tanks, it, lx, lz, top - 0.1 + th, 0, 1, tc);
        }
      }
      // antena de TV (en 2004 casi todas las casas tenían una)
      if (h2 > 0.45) {
        const rise = it.flat ? 0.5 : (it.floors === 1 ? 1.7 : 1.9);
        put(ants, it, -side * it.hw * 0.3, it.flat ? -it.hd * 0.2 : 0, top + rise - (it.flat ? 0 : 0.15), h * 3);
      }
      // antena satelital mirando al norte (-z)
      if (h > 0.86) {
        const x = it.cx - it.az * (-it.hd + 0.4), z = it.cz + it.ax * (-it.hd + 0.4);
        p.set(x, top + (it.flat ? 0.5 : 0.2), z);
        q.setFromAxisAngle(up, 0);
        m4.compose(p, q, sc.setScalar(1));
        dishes.add(x, z, m4);
      }
    });
    const opts = { castShadow: false, receiveShadow: true, cullDist: 320 };
    for (const ic of [tanks, bases, towers, ants, dishes]) ic.build(group, opts);
    this.roofProps = tanks.count + ants.count + dishes.count;
  }
}

// Junta varias geometrías (misma lista de atributos) en una
function mergeGeos(list) {
  const pos = [], nrm = [], idx = [];
  let off = 0;
  for (const g0 of list) {
    const g = g0.index ? g0 : g0;
    const P = g.attributes.position.array, Nn = g.attributes.normal.array;
    for (let i = 0; i < P.length; i++) { pos.push(P[i]); nrm.push(Nn[i]); }
    if (g.index) for (const k of g.index.array) idx.push(k + off);
    else for (let k = 0; k < P.length / 3; k++) idx.push(k + off);
    off += P.length / 3;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  out.setIndex(idx);
  return out;
}
