import * as THREE from 'three';
import { lam } from '../render/style.js';
import { GeoBuilder, hexColor } from './geom.js';
import { MAP, LANDMARKS, BAGS, POI, FRAME, fromAB } from './mapdata.js';
import { RNG, clamp } from '../util.js';
import { foliageAtlas, treeGeometry, tuftAssets } from './foliage.js';
import { InstChunks } from './culling.js';

const vcMat = () => lam({ vertexColors: true });

function instanced(geo, mat, count) {
  const m = new THREE.InstancedMesh(geo, mat, count);
  m.frustumCulled = false;
  return m;
}

const tmpM = new THREE.Matrix4();
const tmpQ = new THREE.Quaternion();
const tmpS = new THREE.Vector3(1, 1, 1);
const tmpP = new THREE.Vector3();
const tmpE = new THREE.Euler();
const tmpC = new THREE.Color();

export class Props {
  constructor() {
    this.group = new THREE.Group();
    this.pumps = [];
    this.turbines = [];
    this.blinkers = [];
  }

  build(game) {
    const { terrain, roads, city, colliders, textures: T } = game;
    this.game = game;
    const rng = new RNG(7);
    this.buildPumpjacks(terrain, roads, city, colliders, rng);
    this.buildTurbines(terrain, colliders);
    this.buildAntennas(terrain, colliders);
    this.buildLamps(terrain, roads, city, colliders, T);
    this.buildTrees(terrain, roads, city, colliders, rng);
    this.buildScrub(terrain, roads, city, rng);
    this.buildContainers(city);
    this.buildBoats(terrain, colliders);
    this.buildRamps(terrain, colliders);
    this.buildFences(terrain);
    this.buildLoberia(terrain);
    this.buildTrafficLight(terrain, colliders);
    this.buildBenches(city, terrain, colliders);
    this.buildOilTanks(terrain, colliders);
    for (const o of this.group.children) if (o.isMesh && !o.userData.noShadow) o.castShadow = true;
    game.scene.add(this.group);
  }

  // ---- Cigüeñas (bombas de petróleo) ----
  buildPumpjacks(terrain, roads, city, colliders, rng) {
    const spots = [];
    for (const [x, z] of this.points(0)) {
      if (terrain.heightAt(x, z) < 2 || terrain.seaDist(x, z) < 40) continue;
      if (roads.clearance(x, z, 12) < 5) continue;
      if (!city.isFree({ cx: x, cz: z, ax: 1, az: 0, hw: 5, hd: 5 })) continue;
      spots.push([x, z, rng.range(0, Math.PI * 2)]);
    }
    // piezas
    const base = new GeoBuilder();
    const yellow = hexColor(0xd8a824), dark = hexColor(0x3a3a3a), grey = hexColor(0x8a8a86), blue = hexColor(0x2d4f7a);
    base.box(-0.9, 0.9, 0, 0.4, -4.2, 4.6, grey);
    // poste sansón (A)
    base.box(-0.9, -0.6, 0.4, 4.2, 0.1, 0.5, dark);
    base.box(0.6, 0.9, 0.4, 4.2, 0.1, 0.5, dark);
    base.box(-0.9, 0.9, 4.0, 4.3, 0.0, 0.6, dark);
    // motor y reductor
    base.box(-0.6, 0.6, 0.4, 1.4, -4.1, -3.2, blue);
    base.box(-0.5, 0.5, 0.4, 2.2, -3.0, -2.0, dark);
    // boca de pozo
    base.box(-0.25, 0.25, 0, 0.9, 4.1, 4.6, hexColor(0x6a6a66));
    base.box(-0.05, 0.05, 0.9, 2.2, 4.3, 4.4, hexColor(0xcccccc));
    const beam = new GeoBuilder();
    // balancín relativo al pivote (0,0,0)
    beam.box(-0.2, 0.2, -0.25, 0.25, -3.2, 3.9, yellow);
    // cabeza de caballo
    beam.box(-0.28, 0.28, -1.8, 0.4, 3.9, 4.5, yellow);
    beam.box(-0.28, 0.28, -1.2, 0.2, 4.5, 4.8, yellow);
    // biela (hacia la manivela)
    beam.box(-0.62, -0.5, -2.5, 0, -3.1, -2.9, dark);
    beam.box(0.5, 0.62, -2.5, 0, -3.1, -2.9, dark);
    const crank = new GeoBuilder();
    crank.box(-0.75, -0.55, -1.3, 1.3, -0.35, 0.35, dark);
    crank.box(0.55, 0.75, -1.3, 1.3, -0.35, 0.35, dark);
    crank.box(-0.8, -0.5, 0.6, 1.5, -0.55, 0.55, hexColor(0xb02020));
    crank.box(0.5, 0.8, 0.6, 1.5, -0.55, 0.55, hexColor(0xb02020));
    const mat = vcMat();
    const n = spots.length;
    const cBase = new InstChunks(base.toGeometry(), mat), cBeam = new InstChunks(beam.toGeometry(), mat), cCrank = new InstChunks(crank.toGeometry(), mat);
    spots.forEach(([x, z, rot], i) => {
      const y = terrain.heightAt(x, z) - 0.1;
      tmpE.set(0, rot, 0);
      tmpQ.setFromEuler(tmpE);
      tmpP.set(x, y, z);
      tmpM.compose(tmpP, tmpQ, tmpS);
      cBase.add(x, z, tmpM);
      this.pumps.push({ x, y, z, rot, phase: rng.range(0, 10), speed: rng.range(0.9, 1.4), beam: cBeam.add(x, z, tmpM), crank: cCrank.add(x, z, tmpM) });
      const fx = Math.sin(rot), fz = Math.cos(rot);
      for (const o of [-3, 0, 3.5]) colliders.addCircle(x + fx * o, z + fz * o, 1.3, y - 1, y + 5, 'cigüeña');
    });
    cBase.build(this.group, { castShadow: true, cullDist: 600 });
    cBeam.build(this.group, { castShadow: true, pad: 6, cullDist: 600 });
    cCrank.build(this.group, { castShadow: true, pad: 6, cullDist: 600 });
    this.pumpSpots = spots;
  }

  updatePumps(t, cam) {
    const q2 = this._q2 || (this._q2 = new THREE.Quaternion());
    const off = this._off || (this._off = new THREE.Vector3());
    const dirty = this._dirty || (this._dirty = new Set());
    dirty.clear();
    for (let i = 0; i < this.pumps.length; i++) {
      const p = this.pumps[i];
      if (p.init && (!p.beam.mesh.visible || (cam && Math.abs(p.x - cam.x) + Math.abs(p.z - cam.z) > 450))) continue;
      p.init = true;
      dirty.add(p.beam.mesh); dirty.add(p.crank.mesh);
      const a = t * p.speed + p.phase;
      const tilt = Math.sin(a) * 0.32;
      tmpE.set(0, p.rot, 0);
      tmpQ.setFromEuler(tmpE);
      // balancín: pivote en (0,4.45,0.3)
      off.set(0, 4.45, 0.3).applyQuaternion(tmpQ);
      tmpP.set(p.x + off.x, p.y + off.y, p.z + off.z);
      tmpE.set(tilt, p.rot, 0, 'YXZ');
      q2.setFromEuler(tmpE);
      tmpM.compose(tmpP, q2, tmpS);
      p.beam.mesh.setMatrixAt(p.beam.index, tmpM);
      // manivela en (0,1.6,-2.5)
      off.set(0, 1.6, -2.5).applyQuaternion(tmpQ);
      tmpP.set(p.x + off.x, p.y + off.y, p.z + off.z);
      tmpE.set(-a, p.rot, 0, 'YXZ');
      q2.setFromEuler(tmpE);
      tmpM.compose(tmpP, q2, tmpS);
      p.crank.mesh.setMatrixAt(p.crank.index, tmpM);
    }
    for (const m of dirty) m.instanceMatrix.needsUpdate = true;
  }

  // ---- Molinos del parque eólico ----
  buildTurbines(terrain, colliders) {
    const tower = new GeoBuilder();
    const w = hexColor(0xeeeeec);
    for (let k = 0; k < 8; k++) {
      const y0 = (k / 8) * 42, y1 = ((k + 1) / 8) * 42;
      const r0 = 1.6 - (k / 8) * 0.7;
      tower.cylinder(0, 0, r0, y0, y1, w, 10, false);
    }
    tower.box(-1.2, 1.2, 41.5, 44, -1.5, 4, w);
    const rotor = new GeoBuilder();
    rotor.box(-0.8, 0.8, -0.8, 0.8, -0.6, 0.8, w);
    for (let b = 0; b < 3; b++) {
      const a = (b / 3) * Math.PI * 2;
      const L = 20;
      // pala como caja fina orientada en el plano XY
      const cx = Math.cos(a), cy = Math.sin(a);
      const steps = 6;
      for (let s = 0; s < steps; s++) {
        const r0 = 0.8 + (s / steps) * L, r1 = 0.8 + ((s + 1) / steps) * L;
        const wd = 0.9 - (s / steps) * 0.6;
        const p0x = cx * r0, p0y = cy * r0, p1x = cx * r1, p1y = cy * r1;
        const nx = -cy * wd, ny = cx * wd;
        rotor.quad([p0x - nx, p0y - ny, 0], [p1x - nx, p1y - ny, 0], [p1x + nx, p1y + ny, 0], [p0x + nx, p0y + ny, 0], [0, 0], [1, 0], [1, 1], [0, 1], w);
        rotor.quad([p0x + nx, p0y + ny, 0], [p1x + nx, p1y + ny, 0], [p1x - nx, p1y - ny, 0], [p0x - nx, p0y - ny, 0], [0, 0], [1, 0], [1, 1], [0, 1], w);
      }
    }
    const mat = vcMat();
    const TURBINES = this.points(1);
    this.turbTower = instanced(tower.toGeometry(), mat, TURBINES.length);
    this.turbRotor = instanced(rotor.toGeometry(), mat, TURBINES.length);
    TURBINES.forEach(([x, z], i) => {
      const y = terrain.heightAt(x, z);
      // mirando al Oeste (de donde viene el viento)
      tmpE.set(0, -Math.PI / 2, 0);
      tmpQ.setFromEuler(tmpE);
      tmpP.set(x, y, z);
      tmpM.compose(tmpP, tmpQ, tmpS);
      this.turbTower.setMatrixAt(i, tmpM);
      this.turbines.push({ x, y, z, phase: i * 0.7 });
      colliders.addCircle(x, z, 1.8, y - 1, y + 44, 'molino');
      this.blinkers.push({ x, y: y + 44.5, z, phase: i * 0.3 });
    });
    this.turbTower.userData.noCull = this.turbRotor.userData.noCull = true;
    this.group.add(this.turbTower, this.turbRotor);
  }

  updateTurbines(t, windSpeed) {
    for (let i = 0; i < this.turbines.length; i++) {
      const p = this.turbines[i];
      const a = t * (0.4 + windSpeed * 0.04) + p.phase;
      tmpE.set(0, -Math.PI / 2, a, 'YXZ');
      tmpQ.setFromEuler(tmpE);
      tmpP.set(p.x - 3.6, p.y + 42.8, p.z);
      tmpM.compose(tmpP, tmpQ, tmpS);
      this.turbRotor.setMatrixAt(i, tmpM);
    }
    this.turbRotor.instanceMatrix.needsUpdate = true;
  }

  // ---- Antenas del Chenque ----
  buildAntennas(terrain, colliders) {
    const gb = new GeoBuilder();
    const red = hexColor(0xc83020), white = hexColor(0xeeeeee);
    const ch = LANDMARKS.chenque || { x: -190, z: -406 };
    const spots = this.points(2).map(([x, z], i) => {
      const nearCh = Math.hypot(x - ch.x, z - ch.z) < 450;
      return [x, z, nearCh ? 36 + ((i * 17) % 28) : 18 + ((i * 7) % 12)];
    }).filter(([x, z]) => terrain.heightAt(x, z) > 1 && this.game.roads.clearance(x, z, 8) > 2);
    // las antenas de radio y TV en la cima del Chenque
    if (POI.antenas) {
      const A = POI.antenas;
      [[0, 0, 62], [22, 14, 48], [-18, 20, 42], [10, -24, 38]].forEach(([dx, dz, H]) => {
        if (this.game.roads.clearance(A.x + dx, A.z + dz, 10) > 3) spots.push([A.x + dx, A.z + dz, H]);
      });
    }
    this.antennaSpots = spots;
    for (const [x, z, H] of spots) {
      const y = terrain.heightAt(x, z);
      const s = 0.9;
      const segs = Math.round(H / 4);
      for (let k = 0; k < segs; k++) {
        const y0 = y + (k / segs) * H, y1 = y + ((k + 1) / segs) * H;
        const c = k % 2 ? red : white;
        for (const [ox, oz] of [[-s, -s], [s, -s], [s, s], [-s, s]]) gb.box(x + ox - 0.08, x + ox + 0.08, y0, y1, z + oz - 0.08, z + oz + 0.08, c);
        gb.box(x - s, x + s, y1 - 0.1, y1, z - s, z - s + 0.1, c);
        gb.box(x - s, x + s, y1 - 0.1, y1, z + s - 0.1, z + s, c);
        gb.box(x - s, x - s + 0.1, y1 - 0.1, y1, z - s, z + s, c);
        gb.box(x + s - 0.1, x + s, y1 - 0.1, y1, z - s, z + s, c);
      }
      colliders.addBox(x - s, x + s, z - s, z + s, y - 1, y + H, 'antena');
      this.blinkers.push({ x, y: y + H + 0.5, z, phase: x * 0.01 });
      // casilla
      gb.box(x + 2, x + 6, y, y + 2.6, z - 2, z + 2, hexColor(0xd0ccc0));
      colliders.addBox(x + 2, x + 6, z - 2, z + 2, y - 1, y + 2.6, 'casilla');
    }
    const m = new THREE.Mesh(gb.toGeometry(), vcMat());
    m.matrixAutoUpdate = false;
    this.group.add(m);
  }

  // ---- Luminarias ----
  buildLamps(terrain, roads, city, colliders, T) {
    const jc = POI.semaforo && POI.semaforo.corner;
    const spots = city.lampSpots.filter(([x, z]) => !jc || Math.hypot(x - jc.x, z - jc.z) > 9);
    // rutas fuera de la ciudad: faroles cada tanto
    for (const e of roads.edges) {
      if (e.kind !== 'ruta' || e.sw || e.len < 30) continue;
      const A = roads.nodes[e.a];
      const n = Math.floor(e.len / 60);
      for (let k = 1; k <= n; k++) {
        const t = k / (n + 1);
        const side = k % 2 ? 1 : -1;
        const off = e.width / 2 + 1;
        const px = A.x + e.dx * e.len * t - e.dz * off * side, pz = A.z + e.dz * e.len * t + e.dx * off * side;
        if (terrain.groundAt(px, pz) < 0.5) continue;
        spots.push([px, pz, Math.atan2(e.dz * side, -e.dx * side)]);
      }
    }
    const pole = new GeoBuilder();
    const g = hexColor(0x5a5f63);
    pole.box(-0.09, 0.09, 0, 7.5, -0.09, 0.09, g);
    pole.box(-0.06, 0.06, 7.3, 7.45, 0, 1.8, g);
    pole.box(-0.25, 0.25, 7.1, 7.35, 1.5, 2.2, hexColor(0x8a8f93));
    const n = spots.length;
    const lamps = new InstChunks(pole.toGeometry(), vcMat());
    const glowPos = new Float32Array(n * 3);
    spots.forEach((s, i) => {
      const [x, z] = s;
      const y = terrain.groundAt(x, z) + (city.curbAt(x, z) || 0);
      let rot = s[2] || 0;
      if (s.length < 3) {
        const near = roads.nearestEdge(x, z, 20);
        if (near) rot = Math.atan2(near.x - x, near.z - z);
      }
      tmpE.set(0, rot, 0);
      tmpQ.setFromEuler(tmpE);
      tmpP.set(x, y, z);
      tmpM.compose(tmpP, tmpQ, tmpS);
      lamps.add(x, z, tmpM);
      glowPos[i * 3] = x + Math.sin(rot) * 1.85;
      glowPos[i * 3 + 1] = y + 7.0;
      glowPos[i * 3 + 2] = z + Math.cos(rot) * 1.85;
      colliders.addCircle(x, z, 0.18, y - 1, y + 7.5, 'poste');
    });
    lamps.build(this.group, { castShadow: true, cullDist: 520 });
    const gg = new THREE.BufferGeometry();
    gg.setAttribute('position', new THREE.BufferAttribute(glowPos, 3));
    this.lampGlow = new THREE.Points(gg, new THREE.PointsMaterial({
      map: T.glow, size: 5, color: 0xffc880, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true, fog: false,
    }));
    this.lampGlow.frustumCulled = false;
    this.group.add(this.lampGlow);
    this.lampPositions = glowPos;
  }

  // ---- Árboles (álamos y pinos) ----
  buildTrees(terrain, roads, city, colliders, rng) {
    const spots = city.treeSpots.map((s) => [...s]);
    // Cordón Forestal del Chenque: pinos en las laderas
    const ch = LANDMARKS.chenque || LANDMARKS.miradorChenque;
    if (ch) {
      for (let i = 0; i < 260; i++) {
        const a = rng.range(0, Math.PI * 2), r = rng.range(60, 380);
        const x = ch.x + Math.cos(a) * r, z = ch.z + Math.sin(a) * r;
        const h = terrain.heightAt(x, z);
        if (h < 8) continue;
        if (roads.clearance(x, z, 10) < 3) continue;
        if (!city.isFree({ cx: x, cz: z, ax: 1, az: 0, hw: 1, hd: 1 })) continue;
        spots.push([x, z, 'pino']);
      }
    }
    // cortinas de álamos (rompevientos) junto a chacras y canchas de las afueras
    // (adentro de La Madriguera no: ahí están las tribunas)
    const MG = city.markers && city.markers.madriguera;
    const inStadium = (x, z) => {
      if (!MG || !MG.pw) return false;
      const dx = x - MG.cx, dz = z - MG.cz;
      return Math.abs(dx * MG.ax + dz * MG.az) < MG.pw + 10 && Math.abs(-dx * MG.az + dz * MG.ax) < MG.pd + 11;
    };
    for (const ar of this.game.zones.areas) {
      if (ar.kind !== 'cancha' && ar.kind !== 'escuela') continue;
      const P = ar.pts;
      for (let i = 0; i < P.length; i += 2) {
        const j = (i + 2) % P.length;
        const L = Math.hypot(P[j] - P[i], P[j + 1] - P[i + 1]);
        if (L < 25 || !rng.chance(0.5)) continue;
        for (let d = 3; d < L - 3; d += 6) {
          const x = P[i] + ((P[j] - P[i]) * d) / L, z = P[i + 1] + ((P[j + 1] - P[i + 1]) * d) / L;
          if (roads.clearance(x, z, 8) < 2.5 || inStadium(x, z)) continue;
          spots.push([x, z, 'alamo']);
        }
      }
    }
    const trunk = new GeoBuilder();
    trunk.cylinder(0, 0, 0.2, 0.08, 4.5, hexColor(0x4a3a2a), 6, false);
    const mat = vcMat();
    const fol = foliageAtlas().material;
    const al = spots.filter((s) => s[2] === 'alamo'), pi = spots.filter((s) => s[2] !== 'alamo');
    const trunks = new InstChunks(trunk.toGeometry(), mat);
    const alMesh = new InstChunks(treeGeometry('alamo'), fol);
    const piMesh = new InstChunks(treeGeometry('pino'), fol);
    const tint = new THREE.Color();
    let ti = 0;
    const place = (arr, mesh) => arr.forEach(([x, z], i) => {
      const y = terrain.heightAt(x, z) + (city.curbAt(x, z) || 0) - 0.1;
      const s = 0.8 + ((i * 7919) % 100) / 200;
      tmpE.set(0, i, 0); tmpQ.setFromEuler(tmpE);
      tmpP.set(x, y, z);
      tmpM.compose(tmpP, tmpQ, new THREE.Vector3(s, s, s));
      const k = ((i * 2654435761) >>> 0) / 4294967296;
      tint.setRGB(0.85 + k * 0.3, 0.9 + ((k * 7) % 1) * 0.2, 0.8 + ((k * 13) % 1) * 0.25);
      mesh.add(x, z, tmpM, tint);
      trunks.add(x, z, tmpM);
      ti++;
      colliders.addCircle(x, z, 0.3, y - 1, y + 10, 'arbol');
    });
    place(al, alMesh);
    place(pi, piMesh);
    trunks.build(this.group, { castShadow: true, cullDist: 520 });
    this.treeMeshes = [...alMesh.build(this.group, { castShadow: true }), ...piMesh.build(this.group, { castShadow: true })];
  }

  // ---- Matas de la estepa (coirón, neneo) ----
  buildScrub(terrain, roads, city, rng) {
    const tf = tuftAssets();
    const N = 6500;
    const meshA = new InstChunks(tf.coiron, tf.material), meshB = new InstChunks(tf.neneo, tf.material);
    const colors = [0x6b6a3a, 0x7a7440, 0x8a8150, 0x5e6438, 0x9a8c5a, 0x707a4a];
    const c = new THREE.Color();
    let i = 0, tries = 0;
    const urban = (x, z) => { const [fi, fj] = terrain.cellOf(x, z); const k = Math.round(fj) * terrain.na + Math.round(fi); return terrain.urban && terrain.urban[k]; };
    while (i < N && tries++ < N * 6) {
      const [x, z] = fromAB(rng.range(FRAME.a0, FRAME.a1), rng.range(FRAME.b0, FRAME.b1));
      const h = terrain.heightAt(x, z);
      if (h < 2.5) continue;
      if (terrain.seaDist(x, z) < 30) continue;
      if (urban(x, z) && rng.chance(0.9)) continue;
      const near = roads.nearestEdge(x, z, 10);
      if (near && near.d < near.edge.width / 2 + 1.5) continue;
      const s = rng.range(0.4, 1.05);
      tmpE.set(0, rng.range(0, 6.28), 0); tmpQ.setFromEuler(tmpE);
      tmpP.set(x, h - 0.08, z);
      tmpM.compose(tmpP, tmpQ, new THREE.Vector3(s * rng.range(0.8, 1.3), s * rng.range(0.8, 1.2), s * rng.range(0.8, 1.3)));
      c.setHex(rng.pick(colors)).lerp(tmpC.setRGB(1, 1, 1), 0.55);
      (rng.chance(0.62) ? meshA : meshB).add(x, z, tmpM, c);
      i++;
    }
    meshA.build(this.group, { noShadow: true, cullDist: 380 });
    meshB.build(this.group, { noShadow: true, cullDist: 380 });
  }

  buildContainers(city) {
    if (!city.containers) return;
    const geo = new THREE.BoxGeometry(12.2, 2.6, 2.44);
    geo.translate(0, 1.3, 0);
    const mat = lam({ map: this.game.textures.metal });
    const mesh = new THREE.InstancedMesh(geo, mat, city.containers.length);
    const c = new THREE.Color();
    city.containers.forEach((k, i) => {
      tmpE.set(0, k.rot, 0); tmpQ.setFromEuler(tmpE);
      tmpP.set(k.x, k.y, k.z);
      tmpM.compose(tmpP, tmpQ, tmpS);
      mesh.setMatrixAt(i, tmpM);
      c.setHex(k.color);
      mesh.setColorAt(i, c);
    });
    this.group.add(mesh);
  }

  buildBoats(terrain, colliders) {
    const gb = new GeoBuilder();
    const boat = (x, z, L, W, hull, cabin, rot = 0) => {
      // casco (orientado en X si rot=0)
      const hx = L / 2, hz = W / 2;
      const y0 = -1.4, y1 = 1.4;
      if (rot === 0) {
        gb.box(x - hx, x + hx - 2, y0, y1, z - hz, z + hz, hexColor(hull));
        gb.box(x + hx - 2, x + hx, y0 + 0.8, y1, z - hz * 0.6, z + hz * 0.6, hexColor(hull));
        gb.box(x - hx, x + hx, y1 - 0.2, y1, z - hz, z + hz, hexColor(0x8a6a4a));
        gb.box(x - hx * 0.3, x + hx * 0.2, y1, y1 + 2.4, z - hz * 0.7, z + hz * 0.7, hexColor(cabin));
        gb.box(x - hx * 0.1, x, y1 + 2.4, y1 + 5, z - 0.1, z + 0.1, hexColor(0x333333));
        colliders.addBox(x - hx, x + hx, z - hz, z + hz, y0, y1 + 3, 'barco');
      }
    };
    // pesqueros amarillos y rojos amarrados a los muelles reales
    const hulls = [[0xd8a824, 0xf2f2f2], [0xb02820, 0xf2f2f2], [0x2d6fa8, 0xf2f2f2]];
    const DK = this.game.decks || [];
    DK.forEach((d, k) => {
      if (d.hw < 20) return;
      for (const side of [-1, 1]) {
        const off = d.hd + 3.5;
        const cx = d.cx - d.az * off * side, cz = d.cz + d.ax * off * side;
        if (terrain.heightAt(cx, cz) > -1.5) continue;
        const [hull, cab] = hulls[(k + side + 3) % 3];
        gb.setFrame(cx, cz, d.ax, d.az);
        const L = Math.min(22, d.hw * 1.2), W = 6;
        gb.box(-L / 2, L / 2 - 2, -1.4, 1.4, -W / 2, W / 2, hexColor(hull));
        gb.box(L / 2 - 2, L / 2, -0.6, 1.4, -W * 0.3, W * 0.3, hexColor(hull));
        gb.box(-L / 2, L / 2, 1.2, 1.4, -W / 2, W / 2, hexColor(0x8a6a4a));
        gb.box(-L * 0.15, L * 0.1, 1.4, 3.8, -W * 0.35, W * 0.35, hexColor(cab));
        gb.box(-L * 0.05, 0, 3.8, 6.4, -0.1, 0.1, hexColor(0x333333));
        gb.clearFrame();
        colliders.addOBB(cx, cz, d.ax, d.az, L / 2, W / 2, -1.4, 4.4, 'barco');
      }
    });
    const m = new THREE.Mesh(gb.toGeometry(), vcMat());
    m.matrixAutoUpdate = false;
    this.group.add(m);
    this.boatMesh = m;
    void terrain;
  }
  addSignTo() { }

  buildRamps(terrain, colliders) {
    const gb = new GeoBuilder();
    const col = hexColor(0x8a7a5a), side = hexColor(0x6a5a40);
    for (const r of terrain.ramps) {
      const fx = r.fx, fz = r.fz, rx = fz, rz = -fx;
      const hl = r.len / 2, hw = r.w / 2;
      const P = (l, w, y) => [r.x + fx * l + rx * w, y, r.z + fz * l + rz * w];
      const b = r.base;
      const a0 = P(-hl, -hw, b), a1 = P(-hl, hw, b), b0 = P(hl, -hw, b + r.h), b1 = P(hl, hw, b + r.h);
      const c0 = P(hl, -hw, b - 0.5), c1 = P(hl, hw, b - 0.5);
      gb.quad(a0, b0, b1, a1, [0, 0], [0, 1], [1, 1], [1, 0], col);
      gb.quad(a1, b1, b0, a0, [0, 0], [0, 1], [1, 1], [1, 0], col);
      gb.quad(c0, c1, b1, b0, [0, 0], [1, 0], [1, 1], [0, 1], side);
      gb.tri(a0, c0, b0, [rx, 0, rz], [0, 0], [1, 0], [1, 1], side);
      gb.tri(a1, b1, c1, [-rx, 0, -rz], [0, 0], [1, 0], [1, 1], side);
      // listones
      for (let k = 1; k < 6; k++) {
        const l = -hl + (k / 6) * r.len;
        const y = b + (r.h * k) / 6 + 0.03;
        gb.quad(P(l - 0.1, -hw, y), P(l + 0.1, -hw, y), P(l + 0.1, hw, y), P(l - 0.1, hw, y), [0, 0], [1, 0], [1, 1], [0, 1], side);
      }
      // la cara trasera bloquea
      const bx = r.x + fx * hl, bz = r.z + fz * hl;
      colliders.addCircle(bx - fx * 0.5, bz - fz * 0.5, 0.01, b - 5, b - 4, 'rampa');
    }
    const m = new THREE.Mesh(gb.toGeometry(), vcMat());
    m.matrixAutoUpdate = false;
    this.group.add(m);
  }

  // Alambrados donde se enganchan las bolsitas
  buildFences(terrain) {
    const gb = new GeoBuilder();
    const post = hexColor(0x6a5a44), wire = hexColor(0x9a9a9a);
    for (const [x, z] of BAGS) {
      const rot = (x * 13 + z * 7) % 3;
      const dx = Math.cos(rot), dz = Math.sin(rot);
      for (let k = -2; k <= 2; k++) {
        const px = x + dx * k * 2.5, pz = z + dz * k * 2.5;
        const y = terrain.groundAt(px, pz);
        gb.box(px - 0.06, px + 0.06, y - 0.2, y + 1.3, pz - 0.06, pz + 0.06, post);
      }
      for (const hh of [0.4, 0.8, 1.2]) {
        const x0 = x - dx * 5, z0 = z - dz * 5, x1 = x + dx * 5, z1 = z + dz * 5;
        const y0 = terrain.groundAt(x0, z0) + hh, y1 = terrain.groundAt(x1, z1) + hh;
        gb.quad([x0, y0, z0], [x1, y1, z1], [x1, y1 + 0.025, z1], [x0, y0 + 0.025, z0], [0, 0], [1, 0], [1, 1], [0, 1], wire);
        gb.quad([x0, y0 + 0.025, z0], [x1, y1 + 0.025, z1], [x1, y1, z1], [x0, y0, z0], [0, 0], [1, 0], [1, 1], [0, 1], wire);
      }
    }
    const m = new THREE.Mesh(gb.toGeometry(), vcMat());
    m.matrixAutoUpdate = false;
    this.group.add(m);
  }

  // Lobos marinos en Punta del Marqués
  buildLoberia(terrain) {
    const geo = new THREE.SphereGeometry(1, 7, 5);
    geo.scale(0.7, 0.45, 1.3);
    const mat = lam({ color: 0x5a4432 });
    const n = 16;
    this.lobos = new THREE.InstancedMesh(geo, mat, n);
    this.loboData = [];
    const rng = new RNG(99);
    let i = 0, tries = 0;
    const L0 = POI.loberia || { x: 0, z: 0 };
    while (i < n && tries++ < 800) {
      const x = L0.x + rng.range(-70, 70), z = L0.z + rng.range(-70, 70);
      const h = terrain.heightAt(x, z);
      if (h < 0.2 || h > 2.5) continue;
      this.loboData.push({ x, z, y: h + 0.3, rot: rng.range(0, 6.28), ph: rng.range(0, 6) });
      i++;
    }
    this.lobos.count = this.loboData.length;
    this.group.add(this.lobos);
  }

  updateLobos(t) {
    if (!this.lobos) return;
    this.loboData.forEach((l, i) => {
      tmpE.set(Math.sin(t * 0.7 + l.ph) * 0.15, l.rot, 0); tmpQ.setFromEuler(tmpE);
      tmpP.set(l.x, l.y + Math.max(0, Math.sin(t * 1.3 + l.ph)) * 0.1, l.z);
      tmpM.compose(tmpP, tmpQ, tmpS);
      this.lobos.setMatrixAt(i, tmpM);
    });
    this.lobos.instanceMatrix.needsUpdate = true;
  }

  // Semáforo de San Martín y Rivadavia (el del malabarista)
  buildTrafficLight(terrain, colliders) {
    if (!POI.semaforo) return;
    const { x, z } = POI.semaforo;
    const gb = new GeoBuilder();
    const off = (POI.semaforo.w || 10) / 2 + 1.4;
    const d = POI.semaforo.dir || [1, 0];
    // en las esquinas (d - n) y (-d + n): la esquina (d + n) es la del malabarista
    const corners = [[x + (d[0] + d[1]) * off, z + (d[1] - d[0]) * off], [x - (d[0] + d[1]) * off, z - (d[1] - d[0]) * off]];
    this.trafficLights = [];
    for (const [px, pz] of corners) {
      const y = terrain.heightAt(px, pz) + 0.22;
      gb.box(px - 0.1, px + 0.1, y, y + 3.2, pz - 0.1, pz + 0.1, hexColor(0x2a2a2a));
      gb.box(px - 0.25, px + 0.25, y + 3.2, y + 4.3, pz - 0.2, pz + 0.2, hexColor(0x1a1a1a));
      colliders.addCircle(px, pz, 0.2, y - 1, y + 4.3, 'semaforo');
      this.trafficLights.push({ x: px, y: y + 3.75, z: pz });
    }
    const m = new THREE.Mesh(gb.toGeometry(), vcMat());
    this.group.add(m);
    // luces
    const mk = (c) => new THREE.Mesh(new THREE.SphereGeometry(0.14, 6, 4), new THREE.MeshBasicMaterial({ color: c }));
    this.tlLamps = [];
    for (const tl of this.trafficLights) {
      const r = mk(0xff2010), a = mk(0xffa010), g = mk(0x20ff40);
      r.position.set(tl.x, tl.y + 0.35, tl.z + 0.21);
      a.position.set(tl.x, tl.y, tl.z + 0.21);
      g.position.set(tl.x, tl.y - 0.35, tl.z + 0.21);
      const r2 = r.clone(), a2 = a.clone(), g2 = g.clone();
      r2.position.z -= 0.42; a2.position.z -= 0.42; g2.position.z -= 0.42;
      this.group.add(r, a, g, r2, a2, g2);
      this.tlLamps.push([r, a, g], [r2, a2, g2]);
    }
  }

  updateTrafficLight(state) {
    // state: 0 verde, 1 amarillo, 2 rojo
    for (const [r, a, g] of this.tlLamps || []) {
      r.material.color.setHex(state === 2 ? 0xff2010 : 0x301010);
      a.material.color.setHex(state === 1 ? 0xffa010 : 0x302010);
      g.material.color.setHex(state === 0 ? 0x20ff40 : 0x103010);
    }
  }

  buildBenches(city, terrain, colliders) {
    const gb = new GeoBuilder();
    for (const [x, z] of city.benches) {
      const y = terrain.heightAt(x, z) + 0.3;
      gb.box(x - 1, x + 1, y + 0.4, y + 0.5, z - 0.3, z + 0.3, hexColor(0x6a4a2a));
      gb.box(x - 1, x + 1, y + 0.5, y + 0.9, z + 0.25, z + 0.35, hexColor(0x6a4a2a));
      gb.box(x - 0.9, x - 0.8, y, y + 0.4, z - 0.3, z + 0.3, hexColor(0x333333));
      gb.box(x + 0.8, x + 0.9, y, y + 0.4, z - 0.3, z + 0.3, hexColor(0x333333));
      colliders.addBox(x - 1, x + 1, z - 0.3, z + 0.35, y - 1, y + 0.9, 'banco');
    }
    const m = new THREE.Mesh(gb.toGeometry(), vcMat());
    this.group.add(m);
  }

  // Tanques de YPZ en Km 3 y en el yacimiento
  buildOilTanks(terrain, colliders) {
    const gb = new GeoBuilder();
    const tanks = this.points(3).map(([x, z], i) => [x, z, 5 + (i % 4) * 1.5, 7 + (i % 3) * 2]);
    for (const [x, z, r, h] of tanks) {
      if (terrain.heightAt(x, z) < 1 || !this.game.city.isFree({ cx: x, cz: z, ax: 1, az: 0, hw: r, hd: r })) continue;
      this.game.city.reserve({ cx: x, cz: z, ax: 1, az: 0, hw: r, hd: r });
      const y = terrain.heightAt(x, z) - 0.3;
      gb.cylinder(x, z, r, y, y + h, hexColor(0xe8e6e0), 16, true);
      gb.cylinder(x, z, r + 0.05, y + h * 0.45, y + h * 0.55, hexColor(0x1b4fa0), 16, false);
      colliders.addCircle(x, z, r, y - 1, y + h, 'tanque');
    }
    const m = new THREE.Mesh(gb.toGeometry(), vcMat());
    m.matrixAutoUpdate = false;
    this.group.add(m);
  }

  // Puntos reales del mapa: 0 pozos, 1 molinos, 2 antenas, 3 tanques
  points(kind) {
    const P = MAP.points, out = [];
    for (let i = 0; i < P.length; i += 3) if (P[i] === kind) out.push([P[i + 1] / 2, P[i + 2] / 2]);
    return out;
  }

  update(t, dt, env, cam) {
    this.updatePumps(t, cam);
    this.updateTurbines(t, env.windSpeed);
    this.updateLobos(t);
    if (this.lampGlow) this.lampGlow.material.opacity = clamp(env.night * 1.2, 0, 0.9);
  }
}
