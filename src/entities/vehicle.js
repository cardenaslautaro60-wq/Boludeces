import * as THREE from 'three';
import { GeoBuilder, hexColor } from '../world/geom.js';
import { clamp, lerp, approach, angleWrap, rand, pick } from '../util.js';

// Tipos de vehículos (parodias de los autos de la Argentina de los 2000)
export const VTYPES = {
  fitito: { name: 'Fitito 600', style: 'tiny', L: 3.3, W: 1.42, H: 1.38, mass: 600, power: 6.5, maxSpeed: 27, grip: 5.5, steer: 2.3, brake: 13, colors: [0xe8e0a0, 0x9ac8d8, 0xd84a3a, 0xf2f2f2, 0x7a9a6a] },
  reno12: { name: 'Renó 12', style: 'sedan', L: 4.35, W: 1.64, H: 1.43, mass: 950, power: 7.5, maxSpeed: 36, grip: 5, steer: 2.1, brake: 14, colors: [0xd8d0b0, 0x6a8ab0, 0xb03a2a, 0x3a5a3a, 0xf2f2f2, 0x8a7a5a, 0x2a4a7a] },
  falcon: { name: 'Falcón', style: 'sedan', L: 4.9, W: 1.8, H: 1.42, mass: 1300, power: 8.5, maxSpeed: 40, grip: 4.6, steer: 1.9, brake: 13, colors: [0x2f4a3a, 0x5a5a5a, 0xd8d0c0, 0x7a2a2a, 0x2a3a5a, 0x151515] },
  pijo504: { name: 'Pijó 504', style: 'sedan', L: 4.5, W: 1.7, H: 1.45, mass: 1150, power: 8, maxSpeed: 38, grip: 5.2, steer: 2.1, brake: 14, colors: [0xf2f2f2, 0x8aa0b8, 0xc8b890, 0x3a3a3a, 0x9a3a2a] },
  gool: { name: 'Gool', style: 'hatch', L: 3.9, W: 1.65, H: 1.42, mass: 950, power: 8.5, maxSpeed: 39, grip: 5.8, steer: 2.3, brake: 15, colors: [0xd81818, 0xf2f2f2, 0x2a2a2a, 0x3a6ab0, 0xa8b0b8, 0xe8c020] },
  duna: { name: 'Fiaz Duna', style: 'sedan', L: 4.1, W: 1.6, H: 1.42, mass: 900, power: 7.5, maxSpeed: 36, grip: 5.2, steer: 2.2, brake: 14, colors: [0xf2f2f2, 0x8a1a1a, 0x4a6a8a, 0xb8b8a8] },
  jilux: { name: 'Toyoda Jilux', style: 'pickup', L: 5.25, W: 1.82, H: 1.8, mass: 1700, power: 10, maxSpeed: 42, grip: 5, steer: 1.95, brake: 14, offroad: true, colors: [0xf2f2f2, 0x9a9ea2, 0x1a1a1a, 0xb01818, 0x3a4a6a] },
  empresa: { name: 'Chata de Empresa', style: 'pickup', L: 5.25, W: 1.82, H: 1.8, mass: 1700, power: 9.5, maxSpeed: 40, grip: 5, steer: 1.95, brake: 14, offroad: true, flag: true, colors: [0xf2f2f2] },
  f100: { name: 'Forz F-100', style: 'pickup', L: 5.1, W: 1.95, H: 1.85, mass: 1800, power: 8, maxSpeed: 37, grip: 4.5, steer: 1.8, brake: 12, offroad: true, colors: [0x3a5a8a, 0xb89a50, 0x7a2a1a, 0x5a6a4a, 0xd8d0c0] },
  remis: { name: 'Remís', style: 'sedan', L: 4.5, W: 1.7, H: 1.45, mass: 1150, power: 8, maxSpeed: 38, grip: 5.2, steer: 2.1, brake: 14, sign: 'REMIS', colors: [0x1a1a1a] },
  patrullero: { name: 'Patrullero', style: 'sedan', L: 4.5, W: 1.72, H: 1.45, mass: 1200, power: 10, maxSpeed: 44, grip: 5.6, steer: 2.2, brake: 16, police: true, colors: [0xf2f2f2] },
  colectivo: { name: 'Colectivo', style: 'bus', L: 11, W: 2.5, H: 3.1, mass: 9000, power: 4.5, maxSpeed: 26, grip: 4, steer: 1.3, brake: 9, colors: [0xe8c020, 0x2a6ab0, 0xf2f2f2] },
  cisterna: { name: 'Camión Cisterna', style: 'tanker', L: 9, W: 2.5, H: 3.3, mass: 12000, power: 4.2, maxSpeed: 27, grip: 4, steer: 1.3, brake: 8, colors: [0x1a1a1a] },
  bmx: { name: 'BMX', style: 'bike', L: 1.7, W: 0.5, H: 1.1, mass: 90, power: 5.5, maxSpeed: 13, grip: 7, steer: 2.8, brake: 10, bike: true, colors: [0x2a8ae0, 0xe02a2a, 0x2ae05a, 0xf2f2f2] },
  enduro: { name: 'Moto Enduro', style: 'moto', L: 2.15, W: 0.75, H: 1.2, mass: 180, power: 13, maxSpeed: 44, grip: 6.5, steer: 2.6, brake: 15, bike: true, offroad: true, colors: [0xe86a1a, 0x1a8a3a, 0xe0e020, 0x2a4ab0] },
};

// ---------- Construcción de modelos ----------
const geoCache = new Map();

function buildModel(key) {
  if (geoCache.has(key)) return geoCache.get(key);
  const T = VTYPES[key];
  const paint = new GeoBuilder(), det = new GeoBuilder(), glassB = new GeoBuilder();
  const P = [1, 1, 1];
  const glass = hexColor(0x1e2a36), dark = hexColor(0x1c1c1e), chrome = hexColor(0xb8bcc0);
  const head = hexColor(0xfff4c8), tail = hexColor(0xc81c10), plate = hexColor(0xf2f2f2), rubber = hexColor(0x222222);
  const L = T.L, W = T.W, H = T.H;
  const hl = L / 2, hw = W / 2;
  let wheelR = 0.33, wheels = [], seats = [], lightsF = [], lightsR = [], camH = H;
  // prisma de cabina (base z0..z1, techo t0..t1)
  const cabin = (y0, y1, z0, z1, t0, t1, w0, w1, roofCol = P) => {
    const a = [[-w0, y0, z0], [w0, y0, z0], [w0, y0, z1], [-w0, y0, z1]];
    const b = [[-w1, y1, t0], [w1, y1, t0], [w1, y1, t1], [-w1, y1, t1]];
    // frente (parabrisas), atrás y laterales: vidrio semitransparente
    for (const G of [glassB]) {
      G.quad(a[3], a[2], b[2], b[3], [0, 0], [1, 0], [1, 1], [0, 1], glass);
      G.quad(a[1], a[0], b[0], b[1], [0, 0], [1, 0], [1, 1], [0, 1], glass);
      G.quad(a[2], a[1], b[1], b[2], [0, 0], [1, 0], [1, 1], [0, 1], glass);
      G.quad(a[0], a[3], b[3], b[0], [0, 0], [1, 0], [1, 1], [0, 1], glass);
    }
    // techo
    paint.quad(b[3], b[2], b[1], b[0], [0, 0], [1, 0], [1, 1], [0, 1], roofCol);
    // parantes
    for (const s of [-1, 1]) {
      paint.quad([s * w0 * 1.005, y0, z1], [s * w0 * 1.005, y0, z1 - 0.12], [s * w1 * 1.005, y1, t1 - 0.12], [s * w1 * 1.005, y1, t1], [0, 0], [1, 0], [1, 1], [0, 1], P);
    }
  };
  const lamps = (yF, yR, zF, zR, wx) => {
    for (const s of [-1, 1]) {
      det.box(s * wx - 0.17, s * wx + 0.17, yF - 0.08, yF + 0.08, zF - 0.02, zF + 0.04, head);
      det.box(s * wx - 0.15, s * wx + 0.15, yR - 0.07, yR + 0.07, zR - 0.04, zR + 0.02, tail);
      lightsF.push([s * wx, yF, zF + 0.1]);
      lightsR.push([s * wx, yR, zR - 0.1]);
    }
    det.box(-0.25, 0.25, yR - 0.25, yR - 0.1, zR - 0.05, zR, plate);
  };
  if (T.style === 'sedan' || T.style === 'hatch' || T.style === 'tiny') {
    const y0 = 0.28, y1 = T.style === 'tiny' ? 0.85 : 0.88;
    paint.box(-hw, hw, y0, y1, -hl, hl, P, 4, 3);
    // trompa inclinada
    det.box(-hw * 0.96, hw * 0.96, y0, y0 + 0.18, hl, hl + 0.08, T.style === 'tiny' ? chrome : dark);
    det.box(-hw * 0.96, hw * 0.96, y0, y0 + 0.18, -hl - 0.08, -hl, T.style === 'tiny' ? chrome : dark);
    det.box(-hw * 0.5, hw * 0.5, y0 + 0.25, y1 - 0.08, hl, hl + 0.02, dark);
    if (T.style === 'sedan') cabin(y1, H, -hl * 0.55, hl * 0.25, -hl * 0.42, hl * 0.02, hw * 0.93, hw * 0.82);
    if (T.style === 'hatch') cabin(y1, H, -hl * 0.92, hl * 0.28, -hl * 0.8, hl * 0.02, hw * 0.93, hw * 0.82);
    if (T.style === 'tiny') cabin(y1, H, -hl * 0.6, hl * 0.35, -hl * 0.45, hl * 0.12, hw * 0.93, hw * 0.8);
    lamps(0.68, 0.7, hl, -hl, hw * 0.68);
    wheelR = T.style === 'tiny' ? 0.27 : 0.32;
    wheels = [[hw - 0.1, wheelR, hl * 0.66], [-hw + 0.1, wheelR, hl * 0.66], [hw - 0.1, wheelR, -hl * 0.64], [-hw + 0.1, wheelR, -hl * 0.64]];
    seats = [[0.38, 0.35, -0.05], [-0.38, 0.35, -0.05], [0.38, 0.35, -1.0], [-0.38, 0.35, -1.0]];
    if (T.police) {
      det.box(-0.6, 0.6, H, H + 0.14, -0.15, 0.15, dark);
      // franja
      for (const s of [-1, 1]) det.box(s * hw - 0.01, s * hw + 0.01, 0.5, 0.66, -hl * 0.9, hl * 0.9, hexColor(0x1d3f8f));
    }
    if (T.sign) {
      det.box(-0.35, 0.35, H, H + 0.25, -0.2, 0.1, hexColor(0x1a6b2a));
    }
  } else if (T.style === 'pickup') {
    const y0 = 0.45, y1 = 1.1;
    paint.box(-hw, hw, y0, y1, -hl, hl, P, 4, 3);
    const cabZ0 = -hl * 0.12, cabZ1 = hl * 0.45;
    cabin(y1, H, cabZ0, cabZ1, cabZ0 + 0.05, cabZ1 - 0.45, hw * 0.94, hw * 0.86);
    // caja
    det.box(-hw * 0.95, hw * 0.95, y1 - 0.02, y1, -hl + 0.1, cabZ0 - 0.05, dark);
    det.box(-0.8, 0.8, y0 + 0.2, y1 - 0.1, hl, hl + 0.06, dark);
    det.box(-hw * 1.02, hw * 1.02, y0 - 0.05, y0 + 0.15, hl + 0.02, hl + 0.14, chrome);
    det.box(-hw * 1.02, hw * 1.02, y0 - 0.05, y0 + 0.15, -hl - 0.14, -hl - 0.02, chrome);
    // hueco de la caja (paredes)
    paint.box(-hw, -hw + 0.08, y1, y1 + 0.35, -hl, cabZ0, P);
    paint.box(hw - 0.08, hw, y1, y1 + 0.35, -hl, cabZ0, P);
    paint.box(-hw, hw, y1, y1 + 0.35, -hl, -hl + 0.08, P);
    if (T.key !== 'f100') det.box(-hw * 0.5, hw * 0.5, H, H + 0.06, cabZ0 + 0.2, cabZ1 - 0.6, dark); // barra antivuelco / baca
    lamps(0.9, 0.95, hl + 0.02, -hl, hw * 0.7);
    wheelR = 0.42;
    wheels = [[hw - 0.12, wheelR, hl * 0.62], [-hw + 0.12, wheelR, hl * 0.62], [hw - 0.12, wheelR, -hl * 0.6], [-hw + 0.12, wheelR, -hl * 0.6]];
    seats = [[0.4, 0.55, 0.45], [-0.4, 0.55, 0.45], [0.45, 1.15, -1.2], [-0.45, 1.15, -1.8]];
    if (T.flag) {
      // antena látigo con banderín naranja (típico de las chatas de las petroleras)
      det.box(-hw + 0.05, -hw + 0.1, y1, y1 + 3.2, -hl + 0.3, -hl + 0.35, hexColor(0x333333));
      det.box(-hw + 0.1, -hw + 0.1 + 0.02, y1 + 2.8, y1 + 3.2, -hl + 0.35, -hl + 0.85, hexColor(0xf26a1b));
      for (const s of [-1, 1]) det.box(s * hw - 0.01, s * hw + 0.01, 0.75, 0.95, -0.2, 0.9, hexColor(0xf26a1b));
    }
  } else if (T.style === 'bus') {
    paint.box(-hw, hw, 0.45, H, -hl, hl, P, 4, 3);
    det.box(-hw - 0.01, hw + 0.01, 1.5, 2.5, -hl + 0.5, hl - 1.2, glass);
    det.box(-hw * 0.95, hw * 0.95, 1.1, 2.7, hl, hl + 0.02, glass);
    det.box(-hw, hw, 0.35, 0.6, -hl - 0.05, hl + 0.05, dark);
    det.box(-hw * 0.9, hw * 0.9, 2.75, 3.0, hl, hl + 0.03, hexColor(0x111111));
    lamps(0.8, 0.9, hl + 0.01, -hl, hw * 0.75);
    wheelR = 0.5;
    wheels = [[hw - 0.2, wheelR, hl * 0.62], [-hw + 0.2, wheelR, hl * 0.62], [hw - 0.2, wheelR, -hl * 0.55], [-hw + 0.2, wheelR, -hl * 0.55]];
    seats = [[0.7, 0.9, hl - 1.3], [-0.6, 0.9, 1.0], [0.6, 0.9, -1], [-0.6, 0.9, -2.5]];
    camH = 3.5;
  } else if (T.style === 'tanker') {
    const cabL = 2.4;
    paint.box(-hw, hw, 0.6, 2.0, hl - cabL, hl, P);
    cabin(2.0, 3.1, hl - cabL + 0.1, hl - 0.3, hl - cabL + 0.1, hl - 0.6, hw * 0.96, hw * 0.92, P);
    det.box(-hw, hw, 0.5, 0.8, -hl, hl - cabL, dark);
    // tanque
    const tank = hexColor(0xd8d8d4);
    for (let k = 0; k < 12; k++) {
      const a0 = (k / 12) * Math.PI * 2, a1 = ((k + 1) / 12) * Math.PI * 2;
      const r = 1.15, cy = 2.0, z0 = -hl + 0.1, z1 = hl - cabL - 0.2;
      const p = (a, z) => [Math.cos(a) * r, cy + Math.sin(a) * r, z];
      det.quad(p(a0, z0), p(a1, z0), p(a1, z1), p(a0, z1), [0, 0], [1, 0], [1, 1], [0, 1], tank);
      det.tri([0, cy, z1], p(a0, z1), p(a1, z1), [0, 0, 1], [0, 0], [1, 0], [1, 1], tank);
      det.tri([0, cy, z0], p(a1, z0), p(a0, z0), [0, 0, -1], [0, 0], [1, 0], [1, 1], tank);
    }
    for (const s of [-1, 1]) det.box(s * 1.16 - 0.01, s * 1.16 + 0.01, 1.8, 2.2, -hl + 0.5, hl - cabL - 0.6, hexColor(0xe8c020));
    lamps(1.0, 1.0, hl + 0.01, -hl, hw * 0.75);
    wheelR = 0.52;
    wheels = [[hw - 0.2, wheelR, hl - 1.2], [-hw + 0.2, wheelR, hl - 1.2], [hw - 0.2, wheelR, -hl + 1.4], [-hw + 0.2, wheelR, -hl + 1.4], [hw - 0.2, wheelR, -hl + 2.6], [-hw + 0.2, wheelR, -hl + 2.6]];
    seats = [[0.55, 1.3, hl - 1.2], [-0.55, 1.3, hl - 1.2]];
    camH = 3.6;
  } else if (T.style === 'bike') {
    // cuadro de BMX
    const tube = (x0, y0, z0, x1, y1, z1, col) => {
      const steps = 4;
      for (let k = 0; k < steps; k++) {
        const t0 = k / steps, t1 = (k + 1) / steps;
        const ya = y0 + (y1 - y0) * t0, yb = y0 + (y1 - y0) * t1, za = z0 + (z1 - z0) * t0, zb = z0 + (z1 - z0) * t1;
        col.box(-0.035, 0.035, Math.min(ya, yb) - 0.035, Math.max(ya, yb) + 0.035, Math.min(za, zb) - 0.035, Math.max(za, zb) + 0.035, P);
      }
    };
    tube(0, 0.33, -0.1, 0, 0.72, 0.5, paint);   // caño inferior
    tube(0, 0.72, -0.25, 0, 0.74, 0.5, paint);  // caño superior
    tube(0, 0.33, -0.1, 0, 0.72, -0.25, paint); // caño del asiento
    tube(0, 0.33, -0.1, 0, 0.3, -0.6, paint);   // vainas
    det.box(-0.03, 0.03, 0.3, 0.95, 0.52, 0.58, hexColor(0x333333)); // horquilla
    det.box(-0.32, 0.32, 0.93, 0.98, 0.5, 0.56, hexColor(0x222222)); // manubrio
    det.box(-0.09, 0.09, 0.76, 0.82, -0.36, -0.14, hexColor(0x111111)); // asiento
    det.box(-0.12, 0.12, 0.3, 0.36, -0.14, -0.06, hexColor(0x777777)); // pedales
    wheelR = 0.3;
    wheels = [[0, wheelR, 0.6], [0, wheelR, -0.6]];
    seats = [[0, 0.17, -0.25]];
    camH = 1.6;
  } else if (T.style === 'moto') {
    paint.box(-0.18, 0.18, 0.55, 0.85, -0.3, 0.55, P);
    paint.box(-0.12, 0.12, 0.75, 0.95, -0.75, -0.2, P);
    det.box(-0.2, 0.2, 0.35, 0.6, -0.2, 0.35, dark);
    det.box(-0.35, 0.35, 1.05, 1.09, 0.6, 0.64, chrome);
    det.box(-0.03, 0.03, 0.45, 1.05, 0.62, 0.72, chrome);
    det.box(-0.1, 0.1, 0.9, 1.0, 0.7, 0.78, head);
    lightsF.push([0, 0.95, 0.8]); lightsR.push([0, 0.9, -0.8]);
    wheelR = 0.36;
    wheels = [[0, wheelR, 0.75], [0, wheelR, -0.72]];
    seats = [[0, 0.25, -0.25], [0, 0.35, -0.7]];
    camH = 1.7;
  }
  // rueda
  const wgeo = new THREE.CylinderGeometry(wheelR, wheelR, T.bike ? 0.12 : 0.24, 10);
  wgeo.rotateZ(Math.PI / 2);
  const wcol = new Float32Array(wgeo.attributes.position.count * 3);
  for (let i = 0; i < wgeo.attributes.position.count; i++) {
    const x = Math.abs(wgeo.attributes.position.getX(i));
    const r = Math.hypot(wgeo.attributes.position.getY(i), wgeo.attributes.position.getZ(i));
    const c = x > 0.05 && r < wheelR * 0.6 ? chrome : rubber;
    wcol.set(c, i * 3);
  }
  wgeo.setAttribute('color', new THREE.BufferAttribute(wcol, 3));
  const res = { paint: paint.toGeometry(), det: det.toGeometry(), glass: glassB.count ? glassB.toGeometry() : null, wheel: wgeo, wheels, wheelR, seats, lightsF, lightsR, camH };
  geoCache.set(key, res);
  return res;
}

const vcMat = new THREE.MeshLambertMaterial({ vertexColors: true });
const glassMat = new THREE.MeshLambertMaterial({ vertexColors: true, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false });
const paintCache = new Map();
function paintMat(color) {
  if (paintCache.has(color)) return paintCache.get(color);
  const m = new THREE.MeshLambertMaterial({ vertexColors: true, color });
  paintCache.set(color, m);
  return m;
}
const burntMat = new THREE.MeshLambertMaterial({ vertexColors: true, color: 0x2a2624 });

const tmpV = new THREE.Vector3();
const tmpN = new THREE.Vector3();
let VID = 1;

export class Vehicle {
  constructor(game, key, opts = {}) {
    this.game = game;
    this.id = VID++;
    this.key = key;
    this.type = VTYPES[key];
    this.type.key = key;
    this.color = opts.color !== undefined ? opts.color : pick(this.type.colors);
    this.model = buildModel(key);
    this.group = new THREE.Group();
    this.body = new THREE.Group();
    this.group.add(this.body);
    this.paintMesh = new THREE.Mesh(this.model.paint, paintMat(this.color));
    this.detMesh = new THREE.Mesh(this.model.det, vcMat);
    this.body.add(this.paintMesh, this.detMesh);
    if (this.model.glass) {
      this.glassMesh = new THREE.Mesh(this.model.glass, glassMat);
      this.glassMesh.renderOrder = 5;
      this.body.add(this.glassMesh);
    }
    this.wheels = this.model.wheels.map(([x, y, z]) => {
      const w = new THREE.Mesh(this.model.wheel, vcMat);
      w.position.set(x, y, z);
      w.rotation.order = 'YXZ';
      this.group.add(w);
      return w;
    });
    // sombra
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(this.type.W + 0.8, this.type.L + 0.8), new THREE.MeshBasicMaterial({ map: game.textures.shadow, transparent: true, depthWrite: false, opacity: 0.9 }));
    sh.rotation.x = -Math.PI / 2;
    sh.position.y = 0.06;
    sh.renderOrder = 4;
    this.shadow = sh;
    this.group.add(sh);
    if (this.type.police) {
      this.sirenR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.16, 0.25), new THREE.MeshBasicMaterial({ color: 0x400000 }));
      this.sirenB = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.16, 0.25), new THREE.MeshBasicMaterial({ color: 0x000040 }));
      this.sirenR.position.set(0.32, this.type.H + 0.15, 0);
      this.sirenB.position.set(-0.32, this.type.H + 0.15, 0);
      this.body.add(this.sirenR, this.sirenB);
    }
    this.pos = new THREE.Vector3(opts.x || 0, 0, opts.z || 0);
    this.heading = opts.rot || 0;
    this.vx = 0; this.vz = 0; this.vy = 0; this.angVel = 0;
    this.pitch = 0; this.roll = 0; this.susp = 0;
    this.pos.y = game.terrain.groundAt(this.pos.x, this.pos.z);
    this.grounded = true;
    this.health = opts.health || 1000;
    this.fireT = 0;
    this.dead = false;
    this.sinking = 0;
    this.ctrl = { throttle: 0, steer: 0, brake: 0, handbrake: false };
    this.driver = null;
    this.seats = new Array(this.model.seats.length).fill(null);
    this.siren = false;
    this.sirenT = 0;
    this.wheelSpin = 0;
    this.airTime = 0;
    this.maxAir = 0;
    this.lastImpact = 0;
    this.parked = !!opts.parked;
    this.locked = false;
    this.persistent = !!opts.persistent;
    this.stolenBy = null;
    this.radio = Math.floor(Math.random() * 5);
    this.smokeT = 0;
    this.lean = 0;
    this.hornT = 0;
    this.group.position.copy(this.pos);
    this.group.rotation.order = 'YXZ';
    game.scene.add(this.group);
    this.updateVisual(0);
  }

  get speed() { return Math.hypot(this.vx, this.vz); }
  get fwd() { return { x: Math.sin(this.heading), z: Math.cos(this.heading) }; }
  get forwardSpeed() { return this.vx * Math.sin(this.heading) + this.vz * Math.cos(this.heading); }

  obb() {
    return { x: this.pos.x, z: this.pos.z, fx: Math.sin(this.heading), fz: Math.cos(this.heading), hl: this.type.L / 2, hw: this.type.W / 2, y: this.pos.y, h: this.type.H };
  }

  // Posición de una puerta (lado izquierdo = conductor en la Argentina)
  doorPos(seat = 0) {
    const s = this.model.seats[seat] || [0.4, 0, 0];
    const side = s[0] >= 0 ? 1 : -1;
    const f = this.fwd;
    const lx = f.z, lz = -f.x; // izquierda
    const off = this.type.W / 2 + 0.55;
    return { x: this.pos.x + lx * off * side + f.x * s[2], z: this.pos.z + lz * off * side + f.z * s[2] };
  }

  seatWorld(seat, out = new THREE.Vector3()) {
    const s = this.model.seats[seat] || [0, 0.5, 0];
    out.set(s[0], s[1], s[2]);
    out.applyEuler(this.group.rotation);
    return out.add(this.group.position);
  }

  damage(amount, cause = null) {
    if (this.dead) return;
    this.health -= amount;
    if (cause) this.lastDamageBy = cause;
    if (this.health <= 0 && this.fireT === 0) this.fireT = 0.001;
  }

  explode() {
    if (this.dead) return;
    this.dead = true;
    this.health = 0;
    this.paintMesh.material = burntMat;
    this.detMesh.material = burntMat;
    if (this.glassMesh) this.glassMesh.visible = false;
    this.vy = 6;
    this.angVel += rand(-2, 2);
    this.game.effects && this.game.effects.explosion(this.pos.x, this.pos.y + 1, this.pos.z, this.lastDamageBy);
    this.siren = false;
    this.deadT = 0;
  }

  update(dt) {
    const g = this.game;
    const T = this.type;
    const terrain = g.terrain;
    const c = this.ctrl;
    const sin = Math.sin(this.heading), cos = Math.cos(this.heading);
    let vF = this.vx * sin + this.vz * cos;
    let vL = this.vx * cos - this.vz * sin; // componente hacia la izquierda
    const ground = terrain.groundAt(this.pos.x, this.pos.z);
    const inWater = ground < -0.8 && this.pos.y < 0.3;
    const surf = g.roads.surfaceAt(this.pos.x, this.pos.z);
    const offroad = surf === 0 || surf === 2;
    const engineOk = !this.dead && this.sinking < 1 && (this.driver || this.aiDriving);
    this.grounded = this.pos.y <= ground + 0.25;

    if (this.grounded && !inWater) {
      // motor / freno
      const thr = engineOk ? c.throttle : 0;
      const offPen = offroad ? (T.offroad ? 0.1 : 0.45) : 0;
      if (thr > 0.05) {
        if (vF < -0.5) vF = approach(vF, 0, T.brake * dt * thr);
        else {
          const r = clamp(vF / (T.maxSpeed * (1 - offPen * 0.5)), 0, 1);
          vF += T.power * thr * (1 - r * r) * (1 - offPen * 0.4) * dt;
        }
      } else if (thr < -0.05) {
        if (vF > 0.5) vF = approach(vF, 0, T.brake * dt * -thr);
        else if (vF > -T.maxSpeed * 0.3) vF += T.power * 0.55 * thr * dt;
      }
      if (c.brake > 0) vF = approach(vF, 0, T.brake * c.brake * dt);
      // resistencia
      vF -= vF * (0.08 + offPen * 0.9 + (thr === 0 ? 0.25 : 0)) * dt;
      // pendiente
      terrain.normalAt(this.pos.x, this.pos.z, tmpN);
      vF += 9.8 * (tmpN.x * sin + tmpN.z * cos) * dt;
      // agarre lateral
      let grip = T.grip * (offroad && !T.offroad ? 0.7 : 1);
      if (c.handbrake) { grip *= 0.22; vF = approach(vF, 0, 5 * dt); }
      vL *= Math.exp(-grip * dt);
      // dirección
      const sp = Math.abs(vF);
      const steerAmt = c.steer * T.steer * clamp(sp / 5, 0, 1) * (1 / (1 + sp * 0.022)) * Math.sign(vF || 1) * (c.handbrake ? 1.45 : 1);
      this.angVel = lerp(this.angVel, steerAmt, 1 - Math.exp(-9 * dt));
    } else if (inWater) {
      vF *= Math.exp(-2.5 * dt); vL *= Math.exp(-2.5 * dt);
      this.angVel *= Math.exp(-2 * dt);
      this.sinking += dt;
    } else {
      // en el aire
      this.angVel *= Math.exp(-0.8 * dt);
      if (T.bike) this.angVel += c.steer * 1.5 * dt;
    }
    this.heading = angleWrap(this.heading + this.angVel * dt);
    this.vx = sin * vF + cos * vL;
    this.vz = cos * vF - sin * vL;

    // viento lateral (vehículos altos y motos)
    if (g.env && this.grounded) {
      const push = g.env.windSpeed * g.env.windSpeed * 0.0009 * (T.style === 'bus' || T.style === 'tanker' ? 1.2 : T.bike ? 0.9 : 0.35);
      this.vx += g.env.windDir.x * push * dt;
      this.vz += g.env.windDir.y * push * dt;
    }

    // integrar posición
    const prevY = this.pos.y;
    this.pos.x += this.vx * dt;
    this.pos.z += this.vz * dt;
    const gNew = terrain.groundAt(this.pos.x, this.pos.z);
    this.vy -= 22 * dt;
    this.pos.y += this.vy * dt;
    if (inWater) {
      this.pos.y = Math.max(gNew, Math.min(this.pos.y, 0.2 - Math.min(3, this.sinking * 0.7)));
      this.vy = 0;
    } else if (this.pos.y <= gNew) {
      const landing = -this.vy;
      if (this.airTime > 0.25 && landing > 8) {
        this.damage((landing - 8) * 25);
        this.susp = -0.25;
        g.audio && g.audio.thud(this.pos, 0.6);
      }
      this.pos.y = gNew;
      const rise = (gNew - prevY) / Math.max(dt, 1e-3);
      this.vy = clamp(rise, 0, 14);
      if (this.airTime > 0.4) this.lastAir = this.airTime;
      this.airTime = 0;
    } else {
      this.airTime += dt;
      this.maxAir = Math.max(this.maxAir, this.airTime);
    }

    // colisiones con el mundo
    const o = this.obb();
    const hit = g.colliders.resolveOBB(o);
    if (hit) {
      this.pos.x = o.x; this.pos.z = o.z;
      const vn = this.vx * hit.nx + this.vz * hit.nz;
      if (vn < 0) {
        const impact = -vn;
        this.vx -= hit.nx * vn * 1.25;
        this.vz -= hit.nz * vn * 1.25;
        this.vx *= 0.85; this.vz *= 0.85;
        this.angVel += (Math.random() - 0.5) * impact * 0.12;
        if (impact > 3.5) {
          this.damage((impact - 3.5) ** 1.35 * 9);
          this.lastImpact = impact;
          g.audio && g.audio.crash(this.pos, clamp(impact / 20, 0.2, 1));
          if (g.effects && impact > 6) g.effects.sparks(this.pos.x + hit.nx * -o.hl * 0.5, this.pos.y + 0.6, this.pos.z - hit.nz * o.hl * 0.5, 6);
          this.onImpact && this.onImpact(impact, hit);
        }
      }
    }
    // límites del mundo
    const W = g.worldBounds;
    if (W) {
      if (this.pos.x < W.minX + 5) { this.pos.x = W.minX + 5; this.vx = Math.abs(this.vx) * 0.3; }
      if (this.pos.x > W.maxX - 5) { this.pos.x = W.maxX - 5; this.vx = -Math.abs(this.vx) * 0.3; }
      if (this.pos.z < W.minZ + 5) { this.pos.z = W.minZ + 5; this.vz = Math.abs(this.vz) * 0.3; }
      if (this.pos.z > W.maxZ - 5) { this.pos.z = W.maxZ - 5; this.vz = -Math.abs(this.vz) * 0.3; }
    }

    // fuego y explosión
    if (this.fireT > 0 && !this.dead) {
      this.fireT += dt;
      if (g.effects && Math.random() < dt * 30) g.effects.fire(this.pos.x + (Math.random() - 0.5), this.pos.y + this.type.H * 0.7, this.pos.z + this.fwd.z * this.type.L * 0.3);
      if (this.fireT > 4.5) this.explode();
    }
    if (!this.dead && g.effects) {
      this.smokeT -= dt;
      if (this.health < 420 && this.smokeT <= 0) {
        this.smokeT = this.health < 250 ? 0.05 : 0.12;
        const f = this.fwd;
        g.effects.smoke(this.pos.x + f.x * this.type.L * 0.4, this.pos.y + this.type.H * 0.7, this.pos.z + f.z * this.type.L * 0.4, this.health < 250 ? 0.15 : 0.7);
      }
    }
    if (this.dead) this.deadT += dt;

    // sirena
    if (this.type.police) {
      this.sirenT += dt;
      const on = this.siren;
      const ph = Math.floor(this.sirenT * 6) % 2;
      this.sirenR.material.color.setHex(on && ph ? 0xff2020 : 0x400000);
      this.sirenB.material.color.setHex(on && !ph ? 0x2040ff : 0x000040);
    }
    this.updateVisual(dt, vF);
  }

  updateVisual(dt, vF = 0) {
    const g = this.game;
    const T = this.type;
    this.group.position.copy(this.pos);
    // inclinación según el terreno
    if (this.grounded || !dt) {
      const f = this.fwd;
      const hl = T.L * 0.4, hw = T.W * 0.45;
      const t = g.terrain;
      const hF = t.groundAt(this.pos.x + f.x * hl, this.pos.z + f.z * hl);
      const hB = t.groundAt(this.pos.x - f.x * hl, this.pos.z - f.z * hl);
      const lx = f.z, lz = -f.x;
      const hLft = t.groundAt(this.pos.x + lx * hw, this.pos.z + lz * hw);
      const hRgt = t.groundAt(this.pos.x - lx * hw, this.pos.z - lz * hw);
      const tp = Math.atan2(hB - hF, 2 * hl);
      const tr = Math.atan2(hLft - hRgt, 2 * hw);
      const k = dt ? 1 - Math.exp(-12 * dt) : 1;
      this.pitch = lerp(this.pitch, tp, k);
      this.roll = lerp(this.roll, tr, k);
    } else {
      this.pitch = lerp(this.pitch, 0.25, dt * 0.8);
    }
    if (T.bike) {
      const target = -this.ctrl.steer * clamp(Math.abs(vF) / 10, 0, 1) * 0.45;
      this.lean = lerp(this.lean, target, dt ? 1 - Math.exp(-6 * dt) : 1);
    }
    this.susp = lerp(this.susp, 0, dt ? 1 - Math.exp(-6 * dt) : 1);
    this.group.rotation.set(this.pitch, this.heading, this.roll + (T.bike ? this.lean : 0));
    this.body.position.y = this.susp * 0.3;
    // ruedas
    this.wheelSpin += (vF / this.model.wheelR) * dt;
    this.wheels.forEach((w, i) => {
      w.rotation.x = this.wheelSpin;
      const steerable = T.bike ? i === 0 : i < 2;
      w.rotation.y = steerable ? this.ctrl.steer * 0.45 : 0;
    });
    this.shadow.visible = this.pos.y - this.game.terrain.groundAt(this.pos.x, this.pos.z) < 4;
  }

  dispose() {
    this.game.scene.remove(this.group);
    this.removed = true;
  }
}
