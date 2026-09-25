import * as THREE from 'three';
import { faceTexture, shirtTexture } from '../render/textures.js';
import { clamp, lerp } from '../util.js';

import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { hexColor } from '../world/geom.js';

const matCache = new Map();
function lam(color, map = null, vc = false) {
  const key = color + (map ? map.uuid : '') + (vc ? 'vc' : '');
  if (matCache.has(key)) return matCache.get(key);
  const m = new THREE.MeshLambertMaterial({ color, map, vertexColors: vc });
  matCache.set(key, m);
  return m;
}
const VC = () => lam(0xffffff, null, true);

// Caja con color por vértice (y UV opcional fijo para muestrear un color de la textura)
function cbox(w, h, d, oy = 0, oz = 0, color = 0xffffff, uvFix = null, ox = 0) {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(ox, oy, oz);
  const c = hexColor(color);
  const n = g.attributes.position.count;
  const col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2]; }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  if (uvFix) {
    const uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uvFix[0], uvFix[1]);
  }
  return g;
}
const merge = (arr) => mergeGeometries(arr, false);

// Personajes armados con cajas, estilo PS2 low-poly.
export class Humanoid {
  constructor(look, shadowTex) {
    this.look = look;
    this.root = new THREE.Group();
    this.body = new THREE.Group();
    this.root.add(this.body);
    this.anim = { phase: 0, speed: 0, punch: 0, aim: 0, air: 0, sit: 0, dead: 0, swim: 0, jugg: 0, wave: 0, dance: 0 };
    this.build(look);
    if (shadowTex) {
      const sh = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.3), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, fog: true }));
      sh.rotation.x = -Math.PI / 2;
      sh.position.y = 0.04;
      sh.renderOrder = 4;
      this.shadow = sh;
      this.root.add(sh);
    }
  }

  build(L) {
    const fat = L.fat || 0;
    const H = L.height || 1;
    const sleeveCol = L.shirtKind === 'banda' ? (L.sleeveColor || 0xf4f4f4) : L.shirt;
    const shirtMat = L.shirtKind ? lam(0xffffff, shirtTexture(L.shirtKind, L.shirtHex, L.shirtAccent || '#000')) : lam(L.shirt);
    const vc = VC();

    const hipY = 0.93 * H;
    this.hips = new THREE.Group();
    this.hips.position.y = hipY;
    this.body.add(this.hips);

    // Torso (+ panza)
    const tw = 0.42 + fat * 0.26, td = 0.23 + fat * 0.2;
    this.torso = new THREE.Group();
    this.hips.add(this.torso);
    const tparts = [new THREE.BoxGeometry(tw, 0.6 * H, td).translate(0, 0.3 * H, 0)];
    if (fat > 0.15) tparts.push(new THREE.BoxGeometry(tw * 0.86, 0.34, 0.12 + fat * 0.12).translate(0, 0.2, td / 2));
    this.torso.add(new THREE.Mesh(tparts.length > 1 ? merge(tparts) : tparts[0], shirtMat));
    // cadera
    this.hips.add(new THREE.Mesh(cbox(tw * 0.95, 0.18, td * 0.95, -0.02, 0, L.pants), vc));

    // Cabeza: cara en el frente; pelo y gorra muestrean parches de la misma textura
    this.neck = new THREE.Group();
    this.neck.position.y = 0.6 * H;
    this.torso.add(this.neck);
    const hex = (v) => '#' + new THREE.Color(v).getHexString();
    const face = faceTexture({ skin: hex(L.skin), hair: hex(L.hair || 0x2a1d14), hat: hex(L.hat || 0x1c2f6b), glasses: L.glasses, mustache: L.mustache, beard: L.beard, beardColor: L.beardColor, smile: L.smile });
    const faceMat = lam(0xffffff, face);
    const hw = 0.25 + fat * 0.04;
    const SKIN = [0.5, 0.97], HAIR = [0.05, 0.95], HAT = [0.95, 0.95];
    const headG = new THREE.BoxGeometry(hw, 0.28, 0.26).translate(0, 0.17, 0);
    { // solo la cara frontal (+z, caras 8..11 del BoxGeometry) usa la textura completa
      const uv = headG.attributes.uv;
      for (let i = 0; i < uv.count; i++) if (i < 16 || i >= 20) uv.setXY(i, SKIN[0], SKIN[1]);
    }
    const hp = [headG];
    const hb = (w, h, d, oy, oz, fix) => { const g = new THREE.BoxGeometry(w, h, d).translate(0, oy, oz || 0); const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, fix[0], fix[1]); hp.push(g); };
    const hs = L.hairStyle || 'short';
    if (hs === 'short') hb(hw + 0.02, 0.07, 0.28, 0.33, -0.01, HAIR);
    if (hs === 'long') { hb(hw + 0.03, 0.08, 0.29, 0.33, -0.01, HAIR); hb(hw + 0.03, 0.3, 0.08, 0.18, -0.13, HAIR); }
    if (hs === 'cap') { hb(hw + 0.03, 0.09, 0.29, 0.34, -0.01, HAT); hb(hw, 0.03, 0.14, 0.31, 0.19, HAT); }
    if (hs === 'helmet') { hb(hw + 0.07, 0.13, 0.33, 0.34, 0, HAT); hb(hw + 0.12, 0.03, 0.4, 0.29, 0, HAT); }
    if (hs === 'police') { hb(hw + 0.05, 0.1, 0.3, 0.35, 0, HAT); hb(hw, 0.03, 0.12, 0.31, 0.19, HAIR); }
    if (hs === 'beanie') hb(hw + 0.03, 0.12, 0.29, 0.34, -0.01, HAT);
    this.head = new THREE.Mesh(merge(hp), faceMat);
    this.neck.add(this.head);

    // Brazos
    const armX = tw / 2 + 0.075;
    const lowerCol = L.longSleeves ? sleeveCol : L.skin;
    const armGeo = merge([
      cbox(0.13 + fat * 0.04, 0.32, 0.14 + fat * 0.03, -0.15, 0, sleeveCol),
      cbox(0.11 + fat * 0.03, 0.3, 0.12, -0.45, 0, lowerCol),
      cbox(0.1, 0.1, 0.11, -0.64, 0, L.skin),
    ]);
    const mkArm = (side) => {
      const g = new THREE.Group();
      g.position.set(side * armX, 0.55 * H, 0);
      g.add(new THREE.Mesh(armGeo, vc));
      this.torso.add(g);
      return g;
    };
    this.armL = mkArm(1);
    this.armR = mkArm(-1);

    // Piernas
    const legX = tw * 0.25;
    const legGeo = merge([
      cbox(0.17 + fat * 0.05, 0.86 * H, 0.19 + fat * 0.04, -0.43 * H, 0, L.pants),
      cbox(0.17, 0.1, 0.29, -0.88 * H, 0.05, L.shoes || 0x222222),
    ]);
    const mkLeg = (side) => {
      const g = new THREE.Group();
      g.position.set(side * legX, -0.02, 0);
      g.add(new THREE.Mesh(legGeo, vc));
      this.hips.add(g);
      return g;
    };
    this.legL = mkLeg(1);
    this.legR = mkLeg(-1);

    // Objeto en la mano derecha (arma)
    this.handSlot = new THREE.Group();
    this.handSlot.position.set(0, -0.64, 0.02);
    this.armR.add(this.handSlot);
    this.hipY = hipY;
  }

  setHeld(mesh) {
    while (this.handSlot.children.length) this.handSlot.remove(this.handSlot.children[0]);
    if (mesh) this.handSlot.add(mesh);
  }

  // Actualiza la pose. speed en m/s.
  update(dt, st) {
    const a = this.anim;
    const sp = st.speed || 0;
    const moving = sp > 0.2;
    a.phase += dt * (moving ? Math.min(12, 3 + sp * 1.55) : 0);
    const run = clamp(sp / 5, 0, 1.3);
    const s = Math.sin(a.phase);
    const c = Math.cos(a.phase);

    let legL = 0, legR = 0, armL = 0, armR = 0, armLz = 0, armRz = 0, torsoX = 0, bob = 0, torsoY = 0;
    if (moving) {
      const amp = lerp(0.45, 0.95, clamp(run, 0, 1));
      legL = s * amp; legR = -s * amp;
      armL = -s * amp * 0.8; armR = s * amp * 0.8;
      torsoX = 0.05 + run * 0.12;
      bob = Math.abs(c) * 0.05 * (0.5 + run);
    } else {
      bob = Math.sin(performance.now() * 0.002) * 0.008;
      armLz = 0.06; armRz = -0.06;
    }
    // salto / caída
    a.air = lerp(a.air, st.air ? 1 : 0, clamp(dt * 10, 0, 1));
    if (a.air > 0.05) {
      legL = lerp(legL, -0.5, a.air); legR = lerp(legR, 0.3, a.air);
      armL = lerp(armL, -0.9, a.air); armR = lerp(armR, -0.9, a.air);
      armLz = lerp(armLz, 0.5, a.air); armRz = lerp(armRz, -0.5, a.air);
    }
    // nadar
    a.swim = lerp(a.swim, st.swim ? 1 : 0, clamp(dt * 5, 0, 1));
    if (a.swim > 0.05) {
      const k = a.swim;
      torsoX = lerp(torsoX, 1.2, k);
      armL = lerp(armL, -2.5 + Math.sin(a.phase * 0.6) * 1.5, k);
      armR = lerp(armR, -2.5 - Math.sin(a.phase * 0.6) * 1.5, k);
      legL = lerp(legL, s * 0.3, k); legR = lerp(legR, -s * 0.3, k);
    }
    // apuntar
    a.aim = lerp(a.aim, st.aim ? 1 : 0, clamp(dt * 14, 0, 1));
    if (a.aim > 0.02) {
      armR = lerp(armR, -Math.PI / 2 + (st.aimPitch || 0), a.aim);
      armRz = lerp(armRz, 0, a.aim);
      if (st.twoHanded) { armL = lerp(armL, -Math.PI / 2 + (st.aimPitch || 0) + 0.1, a.aim); armLz = lerp(armLz, -0.5, a.aim); }
    }
    // golpe
    if (a.punch > 0) {
      a.punch = Math.max(0, a.punch - dt * 3.2);
      const p = Math.sin((1 - a.punch) * Math.PI);
      if (st.melee === 'bate') {
        armR = lerp(armR, -2.4 + (1 - a.punch) * 2.6, 1); armRz = -0.3;
        armL = armR; armLz = 0.3;
        torsoY = (1 - a.punch) * 1.2 - 0.6;
      } else {
        const side = st.punchSide || 1;
        if (side > 0) { armR = -1.5 * p; armRz = -0.1; } else { armL = -1.5 * p; armLz = 0.1; }
        torsoY = side * p * 0.35;
      }
    }
    // malabares
    if (st.jugg) {
      const j = performance.now() * 0.012;
      armL = -1.2 + Math.sin(j) * 0.35; armR = -1.2 + Math.sin(j + Math.PI) * 0.35;
      armLz = 0.25; armRz = -0.25;
    }
    // saludo / baile
    if (st.wave) { armR = -2.6 + Math.sin(performance.now() * 0.015) * 0.3; armRz = -0.4; }
    if (st.dance) {
      const d = performance.now() * 0.009;
      armL = -1.5 + Math.sin(d) * 0.8; armR = -1.5 + Math.cos(d) * 0.8;
      legL = Math.max(0, Math.sin(d * 2)) * 0.5; legR = Math.max(0, -Math.sin(d * 2)) * 0.5;
      torsoY = Math.sin(d) * 0.3; bob = Math.abs(Math.sin(d * 2)) * 0.08;
    }
    // en bici o moto
    if (st.ride) {
      const ped = st.pedal || 0;
      legL = -0.95 + Math.sin(ped) * 0.45; legR = -0.95 - Math.sin(ped) * 0.45;
      torsoX = st.ride === 'moto' ? 0.3 : 0.45; bob = 0;
      armL = -1.25; armR = -1.25; armLz = 0.2; armRz = -0.2;
      this.legL.rotation.x = legL; this.legR.rotation.x = legR;
      this.armL.rotation.x = armL; this.armR.rotation.x = armR;
      this.armL.rotation.z = armLz; this.armR.rotation.z = armRz;
      this.torso.rotation.x = torsoX; this.torso.rotation.y = 0;
      this.hips.position.y = this.hipY - 0.25;
      this.body.rotation.x = 0; this.body.position.y = 0; this.body.position.z = 0;
      if (st.aim) { this.armR.rotation.x = -Math.PI / 2; this.armR.rotation.z = st.aimSide > 0 ? 1.3 : -0.2; }
      if (this.shadow) this.shadow.visible = false;
      return;
    }
    // sentado (manejando)
    a.sit = st.sit ? 1 : 0;
    if (a.sit) {
      legL = -1.45; legR = -1.45; torsoX = -0.05; bob = 0;
      armL = -1.1; armR = -1.1; armLz = 0.15; armRz = -0.15;
      if (st.steer) { armL += st.steer * 0.3; armR -= st.steer * 0.3; }
      if (st.aim) { armR = -Math.PI / 2; armRz = st.aimSide > 0 ? 1.3 : -0.2; }
    }

    this.legL.rotation.x = legL; this.legR.rotation.x = legR;
    this.armL.rotation.x = armL; this.armR.rotation.x = armR;
    this.armL.rotation.z = armLz; this.armR.rotation.z = armRz;
    this.torso.rotation.x = torsoX;
    this.torso.rotation.y = torsoY;
    this.hips.position.y = this.hipY + bob - (a.sit ? 0.45 : 0);
    this.neck.rotation.y = st.lookYaw || 0;

    // muerto / tirado
    const targetDead = st.dead ? 1 : 0;
    a.dead = lerp(a.dead, targetDead, clamp(dt * 6, 0, 1));
    this.body.rotation.x = -a.dead * Math.PI / 2 * 0.98 + (st.knock || 0);
    this.body.position.y = a.dead * 0.18;
    this.body.position.z = -a.dead * 0.1;
    if (this.shadow) this.shadow.visible = !a.sit;
  }
}

// Apariencias
export const LOOKS = {
  gordopin: {
    skin: 0xc99a74, hair: 0x1e140c, hairStyle: 'short', fat: 0.95, height: 1.0,
    shirt: 0x1c2f6b, shirtKind: 'banda', shirtHex: '#f4f4f4', shirtAccent: '#1c2f6b',
    pants: 0x2a2f3a, shoes: 0xeeeeee, beard: true, beardColor: '#2a1d14', smile: true,
  },
  petroca: {
    skin: 0xd2a07c, hair: 0x2a1d14, hairStyle: 'short', fat: 0.3, height: 1.04,
    shirt: 0x4f6f96, shirtKind: 'jean', shirtHex: '#4f6f96', longSleeves: true,
    pants: 0x2d3a55, shoes: 0x6a4424, glasses: true, mustache: true,
  },
};

const SKINS = [0xf0c8a0, 0xd9a47c, 0xc08a64, 0x9a6a48, 0xe8b890, 0x7a5236];
const HAIRS = [0x1e140c, 0x3a2614, 0x5a3a1c, 0x2a2a2a, 0x8a6a3a, 0xb0a090, 0x111111];
const SHIRTS = [0x8a2020, 0x2a4a8a, 0x3a6a3a, 0xd8d0c0, 0x5a5a5a, 0xc86a20, 0x6a3a6a, 0xe8e0a0, 0x203040, 0xa0b8c8, 0x7a5a3a, 0xf2f2f2];
const PANTS = [0x2a3a55, 0x1e1e22, 0x4a4a4a, 0x6a5a40, 0x3a4a6a, 0x5a3a2a];

export function randomLook(kind, rnd = Math.random) {
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const L = {
    skin: pick(SKINS), hair: pick(HAIRS), hairStyle: pick(['short', 'short', 'short', 'long', 'cap', 'beanie', 'bald']),
    fat: rnd() < 0.3 ? rnd() * 0.6 : rnd() * 0.2, height: 0.94 + rnd() * 0.12,
    shirt: pick(SHIRTS), pants: pick(PANTS), shoes: pick([0x222222, 0xeeeeee, 0x5a3a20, 0x333a44]),
    mustache: rnd() < 0.2, beard: rnd() < 0.12, glasses: rnd() < 0.08, longSleeves: rnd() < 0.6,
  };
  if (kind === 'lobo') { // pibes del barrio, hinchas de Newbery
    L.shirtKind = 'banda'; L.shirtHex = '#f4f4f4'; L.shirtAccent = '#1c2f6b'; L.shirt = 0xf4f4f4; L.hairStyle = pick(['short', 'cap', 'beanie']); L.hat = 0x1c2f6b;
  }
  if (kind === 'cheto') {
    L.shirtKind = 'polo'; L.shirtHex = pick(['#7b2d8b', '#b04a9a', '#f0a0c8']); L.shirtAccent = '#f2f2f2'; L.shirt = 0x7b2d8b;
    L.pants = pick([0xe8e0c8, 0xd8d0b8]); L.hairStyle = pick(['long', 'short']); L.hair = pick([0x8a6a3a, 0xc8a060, 0x3a2614]); L.glasses = rnd() < 0.4; L.fat = 0.05;
    L.skin = pick([0xf0c8a0, 0xe8b890]);
  }
  if (kind === 'caleta') {
    L.shirt = 0xe8c020; L.shirtKind = null; L.hairStyle = pick(['cap', 'short']); L.hat = 0xe8c020; L.pants = 0x1e1e22;
  }
  if (kind === 'cana') {
    L.shirt = 0x2a3a5a; L.shirtKind = null; L.longSleeves = true; L.pants = 0x1a2a4a; L.hairStyle = 'police'; L.shoes = 0x111111; L.fat = rnd() * 0.4;
  }
  if (kind === 'petrolero') {
    L.shirtKind = 'mameluco'; L.shirtHex = pick(['#e8661a', '#1b4fa0', '#d0a020']); L.shirtAccent = '#e8e8d0'; L.shirt = 0xe8661a; L.longSleeves = true;
    L.pants = pick([0xe8661a, 0x1b4fa0]); L.hairStyle = 'helmet'; L.hat = pick([0xf2f2f2, 0xf2c230]); L.shoes = 0x5a3a20;
  }
  if (kind === 'abuela') {
    L.shirt = 0x8a5a7a; L.pants = 0x3a3a4a; L.hair = 0xd8d8d8; L.hairStyle = 'long'; L.fat = 0.35; L.height = 0.9; L.glasses = true; L.skin = 0xe8b890; L.longSleeves = true;
  }
  if (kind === 'tenpesos') {
    L.shirt = 0x2a3a5a; L.pants = 0x1a2a4a; L.hairStyle = 'police'; L.mustache = true; L.fat = 0.55; L.skin = 0xd9a47c; L.longSleeves = true; L.shoes = 0x111111;
  }
  if (kind === 'crudo') {
    L.shirt = 0x2a2a2e; L.pants = 0x2a2a2e; L.hairStyle = 'short'; L.hair = 0xb0b0b0; L.fat = 0.45; L.glasses = true; L.longSleeves = true; L.shoes = 0x111111; L.skin = 0xf0c8a0;
  }
  return L;
}
