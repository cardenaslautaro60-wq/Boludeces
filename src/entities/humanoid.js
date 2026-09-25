import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { clamp, lerp, RNG } from '../util.js';

// ---------------------------------------------------------------------------
// Personajes con malla con huesos (SkinnedMesh): una sola malla por personaje,
// con codos y rodillas, cara pintada y ropa con textura. Estilo PS2.
// ---------------------------------------------------------------------------

const ATLAS = 512;
// Regiones del atlas de cada personaje (en píxeles)
const REG = {
  shirt: [0, 0, 256, 256],
  pants: [256, 0, 128, 256],
  skin: [384, 0, 128, 128],
  shoes: [384, 128, 128, 128],
  head: [0, 256, 256, 256],
  hair: [256, 256, 128, 128],
  hat: [384, 256, 128, 128],
  dark: [256, 384, 64, 64],
  sleeve: [320, 384, 64, 128],
  metal: [384, 384, 64, 64],
};

function remapUV(geo, name) {
  const [rx, ry, rw, rh] = REG[name];
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    const u = uv.getX(i), v = uv.getY(i);
    const cx = rx + clamp(u, 0, 1) * rw, cy = ry + (1 - clamp(v, 0, 1)) * rh;
    uv.setXY(i, cx / ATLAS, 1 - cy / ATLAS);
  }
  return geo;
}

// Perfil para torno: puntos [radio, y] de abajo hacia arriba
function lathe(profile, seg = 12) {
  const pts = profile.map(([r, y]) => new THREE.Vector2(Math.max(0.0001, r), y));
  return new THREE.LatheGeometry(pts, seg);
}

// Cápsula ahusada que cuelga hacia -y desde el origen del hueso
function limb(r0, r1, len, seg = 10) {
  const p = [
    [0, -len - r1 * 0.75], [r1 * 0.55, -len - r1 * 0.6], [r1 * 0.9, -len - r1 * 0.25], [r1, -len],
    [lerp(r1, r0, 0.5), -len * 0.5], [r0, -r0 * 0.2], [r0 * 0.85, r0 * 0.45], [r0 * 0.45, r0 * 0.8], [0, r0 * 0.9],
  ];
  return lathe(p, seg);
}

function ellipsoid(rx, ry, rz, ws = 12, hs = 8) {
  const g = new THREE.SphereGeometry(1, ws, hs);
  g.scale(rx, ry, rz);
  return g;
}

function toNonIndexedClean(g) {
  const out = g.index ? g.toNonIndexed() : g;
  for (const k of Object.keys(out.attributes)) if (!['position', 'normal', 'uv'].includes(k)) out.deleteAttribute(k);
  return out;
}

// ---------- Texturas pintadas ----------
const texCache = new Map();

function hex(c) { return '#' + new THREE.Color(c).getHexString(); }
function shade(c, k) {
  const col = new THREE.Color(c);
  col.r = clamp(col.r * k, 0, 1); col.g = clamp(col.g * k, 0, 1); col.b = clamp(col.b * k, 0, 1);
  return '#' + col.getHexString();
}

function paintAtlas(L) {
  const key = JSON.stringify(L);
  if (texCache.has(key)) return texCache.get(key);
  const c = document.createElement('canvas');
  c.width = c.height = ATLAS;
  const g = c.getContext('2d');
  const rng = new RNG(key.length * 7919 + (L.skin || 0));
  const noise = (x, y, w, h, amp, n = 600, size = 2) => {
    for (let i = 0; i < n; i++) {
      const v = (rng.next() - 0.5) * amp;
      g.fillStyle = v > 0 ? `rgba(255,255,255,${v})` : `rgba(0,0,0,${-v})`;
      g.fillRect(x + rng.next() * w, y + rng.next() * h, size, size);
    }
  };
  // --- piel
  {
    const [x, y, w, h] = REG.skin;
    const gr = g.createLinearGradient(x, y, x, y + h);
    gr.addColorStop(0, shade(L.skin, 1.05)); gr.addColorStop(1, shade(L.skin, 0.9));
    g.fillStyle = gr; g.fillRect(x, y, w, h);
    noise(x, y, w, h, 0.05, 200, 2);
  }
  // --- remera / camisa (el torso envuelve la región: frente en u = 0.25)
  {
    const [x, y, w, h] = REG.shirt;
    const base = L.shirtHex || hex(L.shirt);
    g.fillStyle = base; g.fillRect(x, y, w, h);
    const fx = x + w * 0.25;
    const kind = L.shirtKind || 'plain';
    if (kind === 'banda') {
      // camiseta de Newbery: blanca con banda azul en el medio
      g.fillStyle = L.shirtAccent || '#1c2f6b';
      g.fillRect(x, y + h * 0.36, w, h * 0.2);
      g.fillStyle = '#1c2f6b'; g.fillRect(x, y, w, 10);
      g.fillStyle = '#1c2f6b'; g.beginPath(); g.arc(fx + 22, y + h * 0.27, 7, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#f4f4f4'; g.font = 'bold 8px Arial'; g.fillText('JN', fx + 16, y + h * 0.27 + 3);
      g.fillStyle = '#1c2f6b'; g.font = 'bold 44px Arial'; g.textAlign = 'center'; g.fillText('10', x + w * 0.75, y + h * 0.33); g.textAlign = 'left';
    } else if (kind === 'jean') {
      noise(x, y, w, h, 0.18, 2500, 1);
      g.strokeStyle = 'rgba(230,220,190,0.55)'; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(fx, y + 14); g.lineTo(fx, y + h); g.stroke();
      for (let k = 0; k < 6; k++) { g.fillStyle = '#e8e0c8'; g.beginPath(); g.arc(fx + 3, y + 26 + k * 34, 2.2, 0, 7); g.fill(); }
      for (const s of [-1, 1]) {
        const px = fx + s * 30 - 14;
        g.strokeRect(px, y + 44, 28, 26); g.beginPath(); g.moveTo(px, y + 52); g.lineTo(px + 28, y + 52); g.stroke();
      }
      g.fillStyle = shade(base, 0.8); g.fillRect(x, y, w, 12);
    } else if (kind === 'polo') {
      g.fillStyle = L.shirtAccent || '#f2f2f2'; g.fillRect(fx - 26, y, 52, 16);
      g.fillStyle = shade(base, 0.85); g.fillRect(fx - 3, y + 14, 6, 40);
      g.fillStyle = '#fff'; g.beginPath(); g.arc(fx + 34, y + 50, 5, 0, 7); g.fill();
    } else if (kind === 'mameluco') {
      noise(x, y, w, h, 0.1, 1000, 2);
      g.fillStyle = L.shirtAccent || '#e8e8d0';
      g.fillRect(x, y + h * 0.62, w, 7); g.fillRect(x, y + h * 0.72, w, 7);
      g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(fx - 1, y + 10, 3, h * 0.5);
      g.fillStyle = '#222'; g.fillRect(fx + 18, y + 40, 26, 12);
      g.fillStyle = '#f2f2f2'; g.font = 'bold 8px Arial'; g.fillText('PSJ', fx + 21, y + 49);
    } else if (kind === 'police') {
      g.fillStyle = shade(base, 0.75); g.fillRect(x, y, w, 12);
      g.fillStyle = '#d8b030'; g.beginPath(); g.moveTo(fx - 30, y + 46); g.lineTo(fx - 22, y + 38); g.lineTo(fx - 14, y + 46); g.lineTo(fx - 22, y + 58); g.closePath(); g.fill();
      g.fillStyle = '#f2f2f2'; g.font = 'bold 13px Arial'; g.textAlign = 'center'; g.fillText('POLICÍA', x + w * 0.75, y + 60); g.textAlign = 'left';
      for (let k = 0; k < 6; k++) { g.fillStyle = '#c8c8c8'; g.beginPath(); g.arc(fx, y + 24 + k * 32, 2, 0, 7); g.fill(); }
    } else if (kind === 'traje') {
      g.fillStyle = '#f2f2f2'; g.beginPath(); g.moveTo(fx - 20, y); g.lineTo(fx + 20, y); g.lineTo(fx, y + 70); g.closePath(); g.fill();
      g.fillStyle = '#8a1a1a'; g.beginPath(); g.moveTo(fx - 5, y + 6); g.lineTo(fx + 5, y + 6); g.lineTo(fx + 3, y + 64); g.lineTo(fx, y + 72); g.lineTo(fx - 3, y + 64); g.closePath(); g.fill();
    } else if (kind === 'campera') {
      noise(x, y, w, h, 0.08, 800, 2);
      for (let k = 1; k < 6; k++) { g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(x, y + k * h / 6, w, 3); }
      g.fillStyle = '#c8c8c8'; g.fillRect(fx - 1, y + 8, 2, h);
      g.fillStyle = shade(base, 0.7); g.fillRect(x, y, w, 16);
    } else {
      g.fillStyle = shade(base, 0.8); g.beginPath(); g.ellipse(fx, y, 26, 14, 0, 0, Math.PI); g.fill();
    }
    for (let i = 0; i < 16; i++) {
      g.strokeStyle = `rgba(0,0,0,${0.03 + rng.next() * 0.05})`; g.lineWidth = 2 + rng.next() * 3;
      const sx = x + rng.next() * w;
      g.beginPath(); g.moveTo(sx, y + h * 0.5 + rng.next() * h * 0.4); g.lineTo(sx + (rng.next() - 0.5) * 20, y + h); g.stroke();
    }
    const gr = g.createLinearGradient(0, y + h * 0.7, 0, y + h);
    gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,0.22)');
    g.fillStyle = gr; g.fillRect(x, y + h * 0.7, w, h * 0.3);
  }
  // --- mangas
  {
    const [x, y, w, h] = REG.sleeve;
    g.fillStyle = L.sleeveHex || L.shirtHex || hex(L.shirt); g.fillRect(x, y, w, h);
    if (L.shirtKind === 'jean') noise(x, y, w, h, 0.18, 600, 1);
    g.fillStyle = 'rgba(0,0,0,0.2)'; g.fillRect(x, y + h - 8, w, 8);
  }
  // --- pantalón
  {
    const [x, y, w, h] = REG.pants;
    g.fillStyle = hex(L.pants); g.fillRect(x, y, w, h);
    if (L.pantsKind === 'jogging') {
      g.fillStyle = L.stripe || '#f2f2f2'; g.fillRect(x + w * 0.5 - 4, y, 3, h); g.fillRect(x + w * 0.5 + 2, y, 3, h);
      noise(x, y, w, h, 0.06, 400, 2);
    } else {
      noise(x, y, w, h, 0.16, 2200, 1);
      g.strokeStyle = 'rgba(210,170,90,0.45)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(x + w * 0.5, y); g.lineTo(x + w * 0.5, y + h); g.stroke();
    }
    g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(x, y + h - 10, w, 10);
    g.fillStyle = '#2a1e14'; g.fillRect(x, y, w, 7);
  }
  // --- calzado
  {
    const [x, y, w, h] = REG.shoes;
    g.fillStyle = hex(L.shoes || 0x222222); g.fillRect(x, y, w, h);
    g.fillStyle = L.shoeKind === 'bota' ? '#3a2616' : '#f2f2f2';
    g.fillRect(x, y + h * 0.72, w, h * 0.28);
    g.strokeStyle = 'rgba(0,0,0,0.3)'; g.lineWidth = 2;
    for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(x + w * 0.2, y + 20 + k * 9); g.lineTo(x + w * 0.3, y + 20 + k * 9); g.stroke(); }
    noise(x, y, w, h, 0.08, 200, 2);
  }
  // --- pelo
  {
    const [x, y, w, h] = REG.hair;
    g.fillStyle = hex(L.hair || 0x2a1d14); g.fillRect(x, y, w, h);
    for (let i = 0; i < 260; i++) {
      g.strokeStyle = rng.chance(0.5) ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.18)';
      g.lineWidth = 1;
      const sx = x + rng.next() * w, sy = y + rng.next() * h;
      g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + (rng.next() - 0.5) * 6, sy + 6 + rng.next() * 8); g.stroke();
    }
  }
  // --- gorra / casco
  {
    const [x, y, w, h] = REG.hat;
    g.fillStyle = hex(L.hat || 0x1c2f6b); g.fillRect(x, y, w, h);
    noise(x, y, w, h, 0.08, 300, 2);
    if (L.hairStyle === 'police') { g.fillStyle = '#d8b030'; g.fillRect(x + w * 0.22, y + h * 0.55, 16, 10); }
  }
  { const [x, y, w, h] = REG.dark; g.fillStyle = '#0c0c0e'; g.fillRect(x, y, w, h); g.fillStyle = 'rgba(120,160,210,0.35)'; g.fillRect(x + 6, y + 6, 20, 8); }
  { const [x, y, w, h] = REG.metal; g.fillStyle = '#9a9ea2'; g.fillRect(x, y, w, h); }
  // --- cabeza (la cara centrada en u = 0.25)
  {
    const [x, y, w, h] = REG.head;
    g.fillStyle = hex(L.skin); g.fillRect(x, y, w, h);
    const cx = x + w * 0.25;
    const eyeY = y + h * 0.47, mouthY = y + h * 0.66;
    const jaw = g.createRadialGradient(cx, y + h * 0.5, 10, cx, y + h * 0.55, 70);
    jaw.addColorStop(0, 'rgba(255,220,200,0.12)'); jaw.addColorStop(1, 'rgba(0,0,0,0.12)');
    g.fillStyle = jaw; g.fillRect(x, y, w * 0.5, h);
    const hairC = hex(L.hair || 0x2a1d14);
    if (L.beard || L.stubble) {
      g.fillStyle = L.beard ? (L.beardColor || hairC) : 'rgba(40,30,25,0.35)';
      g.globalAlpha = L.beard ? 0.8 : 0.5;
      g.beginPath(); g.ellipse(cx, y + h * 0.7, 36, 26, 0, 0, Math.PI * 2); g.fill();
      g.fillRect(cx - 38, y + h * 0.55, 10, 32); g.fillRect(cx + 28, y + h * 0.55, 10, 32);
      g.globalAlpha = 1;
    }
    g.fillStyle = hairC;
    g.save(); g.translate(cx - 17, eyeY - 12); g.rotate(-0.08); g.fillRect(-11, -2, 22, 4.5); g.restore();
    g.save(); g.translate(cx + 17, eyeY - 12); g.rotate(0.08); g.fillRect(-11, -2, 22, 4.5); g.restore();
    if (!L.glasses) {
      for (const s of [-1, 1]) {
        const ex = cx + s * 16;
        g.fillStyle = '#f4f0ea'; g.beginPath(); g.ellipse(ex, eyeY, 8, 4.5, 0, 0, Math.PI * 2); g.fill();
        g.fillStyle = L.eyes || '#4a3220'; g.beginPath(); g.arc(ex + s * 0.5, eyeY, 3.4, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#111'; g.beginPath(); g.arc(ex + s * 0.5, eyeY, 1.6, 0, Math.PI * 2); g.fill();
        g.strokeStyle = 'rgba(40,20,10,0.7)'; g.lineWidth = 1.6; g.beginPath(); g.ellipse(ex, eyeY - 0.5, 8.5, 5, 0, Math.PI, Math.PI * 2); g.stroke();
      }
    }
    g.fillStyle = 'rgba(0,0,0,0.13)';
    g.beginPath(); g.moveTo(cx - 2, eyeY + 2); g.lineTo(cx - 6, y + h * 0.58); g.lineTo(cx + 6, y + h * 0.58); g.closePath(); g.fill();
    g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(cx - 6, y + h * 0.585, 3, 2); g.fillRect(cx + 3, y + h * 0.585, 3, 2);
    if (L.mustache) { g.fillStyle = hairC; g.beginPath(); g.ellipse(cx, mouthY - 7, 16, 5, 0, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = '#8a4a40';
    g.beginPath(); g.ellipse(cx, mouthY, 11, L.smile ? 3.5 : 2.4, 0, 0, Math.PI * 2); g.fill();
    if (L.smile) { g.strokeStyle = 'rgba(80,30,20,0.6)'; g.lineWidth = 1.5; g.beginPath(); g.arc(cx, mouthY - 8, 14, 0.35 * Math.PI, 0.65 * Math.PI); g.stroke(); }
    g.fillStyle = shade(L.skin, 0.85);
    g.beginPath(); g.ellipse(x + 3, y + h * 0.5, 6, 12, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(x + w * 0.5, y + h * 0.5, 6, 12, 0, 0, Math.PI * 2); g.fill();
    if (L.hairStyle !== 'bald') {
      g.fillStyle = hairC;
      g.fillRect(x + w * 0.4, y, w * 0.6, h * 0.42);
      g.fillRect(x, y, w, h * 0.2);
      g.fillRect(cx - 44, y, 8, h * 0.52); g.fillRect(cx + 36, y, 8, h * 0.52);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  texCache.set(key, t);
  return t;
}

// ---------- Geometría del cuerpo ----------
const geoCache = new Map();

function buildBody(L, bones, B) {
  const fat = clamp(L.fat || 0, 0, 1.2), mus = clamp(L.muscle || 0, 0, 1), H = L.height || 1;
  const parts = [];
  const add = (geo, region, bone, mat = null) => {
    remapUV(geo, region);
    if (mat) geo.applyMatrix4(mat);
    geo.applyMatrix4(bone.matrixWorld);
    const g2 = toNonIndexedClean(geo);
    const n = g2.attributes.position.count;
    const idx = new Uint16Array(n * 4), w = new Float32Array(n * 4);
    const bi = bones.indexOf(bone);
    for (let i = 0; i < n; i++) { idx[i * 4] = bi; w[i * 4] = 1; }
    g2.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(idx, 4));
    g2.setAttribute('skinWeight', new THREE.Float32BufferAttribute(w, 4));
    parts.push(g2);
  };
  const M = (x, y, z, rx = 0, ry = 0, rz = 0) => new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(1, 1, 1));

  // pelvis
  {
    const g = lathe([[0.1, -0.14], [0.155, -0.08], [0.165, 0.02], [0.15, 0.12]], 12);
    g.scale(1.12 + fat * 0.25, 1, 0.78 + fat * 0.3);
    add(g, 'pants', B.hips);
  }
  // torso (con panza según la grasa)
  {
    const prof = [
      [0.15, -0.14], [0.152 + fat * 0.07, -0.02], [0.16 + fat * 0.13, 0.1], [0.165 + fat * 0.12 + mus * 0.02, 0.22],
      [0.172 + fat * 0.07 + mus * 0.04, 0.33], [0.18 + fat * 0.04 + mus * 0.05, 0.42], [0.15, 0.49], [0.07, 0.53],
    ];
    const g = lathe(prof, 14);
    g.rotateY(-Math.PI / 2); // el pecho de la textura (u = 0.25) mira hacia +z
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      x *= 1.16 + mus * 0.12 + fat * 0.05;
      z *= 0.74 + fat * 0.22;
      if (z > 0) z *= 1 + fat * 0.45 * Math.exp(-((y - 0.12) ** 2) / 0.012);
      p.setXYZ(i, x, y, z);
    }
    g.computeVertexNormals();
    add(g, 'shirt', B.spine);
  }
  // cuello
  { const g = new THREE.CylinderGeometry(0.052 + fat * 0.02, 0.058 + fat * 0.025, 0.12, 10); g.translate(0, 0.03, 0); add(g, 'skin', B.neck); }
  // cabeza
  {
    const g = new THREE.SphereGeometry(1, 18, 14);
    g.scale(0.108 + fat * 0.012, 0.128, 0.118);
    g.translate(0, 0.13, 0.005);
    add(g, 'head', B.head);
    const n = new THREE.ConeGeometry(0.018, 0.045, 5);
    n.rotateX(Math.PI / 2 + 0.5);
    add(n, 'skin', B.head, M(0, 0.125, 0.118));
    for (const s of [-1, 1]) add(ellipsoid(0.018, 0.03, 0.012, 6, 5), 'skin', B.head, M(s * (0.108 + fat * 0.012), 0.13, 0));
    const hs = L.hairStyle || 'short';
    const W = 1 + fat * 0.11;
    const cap = (r, thetaLen, region, ty, tz, sx, sy, sz) => {
      const c = new THREE.SphereGeometry(r, 16, 8, 0, Math.PI * 2, 0, thetaLen);
      c.scale(sx, sy, sz);
      add(c, region, B.head, M(0, ty, tz, -0.18));
    };
    if (hs === 'short') cap(0.122, 1.35, 'hair', 0.145, -0.01, 0.92 * W, 1.07, 1.02);
    if (hs === 'long') { cap(0.126, 1.55, 'hair', 0.14, -0.012, 0.93 * W, 1.08, 1.04); const b = lathe([[0.07, -0.16], [0.1, -0.05], [0.105, 0.05]], 10); b.scale(1, 1, 0.55); add(b, 'hair', B.head, M(0, 0.12, -0.06)); }
    if (hs === 'cap') {
      cap(0.126, 1.3, 'hat', 0.15, -0.005, 0.95 * W, 1.0, 1.04);
      const v = new THREE.CylinderGeometry(0.1, 0.1, 0.012, 12, 1, false, -Math.PI / 2, Math.PI);
      v.scale(0.9 * W, 1, 0.9);
      add(v, 'hat', B.head, M(0, 0.2, 0.07, 0.12));
    }
    if (hs === 'beanie') cap(0.128, 1.5, 'hat', 0.15, -0.008, 0.95 * W, 1.12, 1.04);
    if (hs === 'helmet') {
      cap(0.148, 1.5, 'hat', 0.16, 0, 1.0 * W, 1.0, 1.08);
      const brim = new THREE.CylinderGeometry(0.17 * W, 0.17 * W, 0.015, 16);
      brim.scale(1, 1, 1.15);
      add(brim, 'hat', B.head, M(0, 0.17, 0.01));
    }
    if (hs === 'police') {
      add(new THREE.CylinderGeometry(0.135 * W, 0.12 * W, 0.07, 14), 'hat', B.head, M(0, 0.24, -0.005, -0.08));
      add(new THREE.CylinderGeometry(0.1, 0.1, 0.012, 12, 1, false, -Math.PI / 2, Math.PI), 'dark', B.head, M(0, 0.205, 0.07, 0.25));
    }
    if (L.glasses) {
      add(new THREE.BoxGeometry(0.2, 0.042, 0.02), 'dark', B.head, M(0, 0.148, 0.115));
      for (const s of [-1, 1]) add(new THREE.BoxGeometry(0.008, 0.012, 0.12), 'dark', B.head, M(s * 0.1 * W, 0.155, 0.055));
    }
  }
  // brazos
  for (const s of [1, -1]) {
    const sh = s > 0 ? B.shL : B.shR, el = s > 0 ? B.elL : B.elR, ha = s > 0 ? B.haL : B.haR;
    const ua = limb(0.058 + mus * 0.022 + fat * 0.024, 0.047 + mus * 0.01 + fat * 0.012, 0.27 * H, 10);
    ua.scale(1, 1, 0.92);
    add(ua, 'sleeve', sh);
    add(limb(0.046 + mus * 0.012 + fat * 0.012, 0.037, 0.25 * H, 10), L.longSleeves ? 'sleeve' : 'skin', el);
    add(ellipsoid(0.036, 0.058, 0.027, 8, 6), 'skin', ha, M(0, -0.05, 0.005));
    add(ellipsoid(0.013, 0.028, 0.013, 5, 4), 'skin', ha, M(-s * 0.03, -0.03, 0.02, 0, 0, s * 0.4));
  }
  // piernas
  for (const s of [1, -1]) {
    const th = s > 0 ? B.thL : B.thR, kn = s > 0 ? B.knL : B.knR, ft = s > 0 ? B.ftL : B.ftR;
    add(limb(0.09 + fat * 0.035 + mus * 0.01, 0.062 + fat * 0.01, 0.42 * H, 11), 'pants', th);
    add(limb(0.062 + fat * 0.012, 0.047, 0.41 * H, 10), 'pants', kn);
    const boot = L.shoeKind === 'bota';
    add(ellipsoid(0.056, boot ? 0.07 : 0.045, 0.125, 10, 6), 'shoes', ft, M(0, boot ? -0.02 : -0.035, 0.05));
  }
  return mergeGeometries(parts, false);
}

function makeSkeleton(L) {
  const H = L.height || 1, fat = clamp(L.fat || 0, 0, 1.2), mus = clamp(L.muscle || 0, 0, 1);
  const bone = (name, x, y, z, parent) => { const b = new THREE.Bone(); b.name = name; b.position.set(x, y, z); if (parent) parent.add(b); return b; };
  const B = {};
  B.root = bone('root', 0, 0, 0, null);
  B.hips = bone('hips', 0, 0.93 * H, 0, B.root);
  B.spine = bone('spine', 0, 0.1 * H, 0, B.hips);
  B.neck = bone('neck', 0, 0.5 * H, 0, B.spine);
  B.head = bone('head', 0, 0.07 * H, 0.005, B.neck);
  const sx = 0.2 + fat * 0.06 + mus * 0.04;
  B.shL = bone('shL', sx, 0.43 * H, 0, B.spine);
  B.elL = bone('elL', 0, -0.285 * H, 0, B.shL);
  B.haL = bone('haL', 0, -0.265 * H, 0, B.elL);
  B.shR = bone('shR', -sx, 0.43 * H, 0, B.spine);
  B.elR = bone('elR', 0, -0.285 * H, 0, B.shR);
  B.haR = bone('haR', 0, -0.265 * H, 0, B.elR);
  const hx = 0.092 + fat * 0.035;
  B.thL = bone('thL', hx, -0.04, 0, B.hips);
  B.knL = bone('knL', 0, -0.43 * H, 0, B.thL);
  B.ftL = bone('ftL', 0, -0.42 * H, 0, B.knL);
  B.thR = bone('thR', -hx, -0.04, 0, B.hips);
  B.knR = bone('knR', 0, -0.43 * H, 0, B.thR);
  B.ftR = bone('ftR', 0, -0.42 * H, 0, B.knR);
  const list = ['root', 'hips', 'spine', 'neck', 'head', 'shL', 'elL', 'haL', 'shR', 'elR', 'haR', 'thL', 'knL', 'ftL', 'thR', 'knR', 'ftR'].map((k) => B[k]);
  return { B, list };
}

const matCache = new Map();
function materialFor(L) {
  const tex = paintAtlas(L);
  let m = matCache.get(tex);
  if (!m) { m = new THREE.MeshLambertMaterial({ map: tex }); matCache.set(tex, m); }
  return m;
}

export class Humanoid {
  constructor(look, shadowTex) {
    this.look = { ...look };
    this.root = new THREE.Group();
    this.body = new THREE.Group();
    this.root.add(this.body);
    this.anim = { phase: 0, speed: 0, punch: 0, aim: 0, air: 0, sit: 0, dead: 0, swim: 0 };
    this.build();
    if (shadowTex) {
      const sh = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, fog: true }));
      sh.rotation.x = -Math.PI / 2;
      sh.position.y = 0.04;
      sh.renderOrder = 4;
      this.shadow = sh;
      this.root.add(sh);
    }
  }

  build() {
    const L = this.look;
    if (this.mesh) this.body.remove(this.mesh);
    const { B, list } = makeSkeleton(L);
    this.B = B;
    B.root.updateMatrixWorld(true);
    const key = JSON.stringify(L);
    let geo = geoCache.get(key);
    if (!geo) { geo = buildBody(L, list, B); geoCache.set(key, geo); }
    const mesh = new THREE.SkinnedMesh(geo, materialFor(L));
    mesh.add(B.root);
    mesh.bind(new THREE.Skeleton(list));
    mesh.frustumCulled = false;
    mesh.castShadow = true;
    this.mesh = mesh;
    this.body.add(mesh);
    this.hipY = B.hips.position.y;
    this.handSlot = new THREE.Group();
    this.handSlot.position.set(0, -0.07, 0.02);
    B.haR.add(this.handSlot);
    if (this.held) this.handSlot.add(this.held);
  }

  // Cambiar el cuerpo (grasa y músculo del Gordopin)
  setBody(fat, muscle) {
    const f = Math.round(fat * 20) / 20, m = Math.round(muscle * 20) / 20;
    if (f === this.look.fat && m === (this.look.muscle || 0)) return;
    this.look.fat = f; this.look.muscle = m;
    this.build();
  }

  setHeld(mesh) {
    while (this.handSlot.children.length) this.handSlot.remove(this.handSlot.children[0]);
    this.held = mesh;
    if (mesh) this.handSlot.add(mesh);
  }

  update(dt, st) {
    const a = this.anim;
    const B = this.B;
    const sp = st.speed || 0;
    const moving = sp > 0.2;
    a.phase += dt * (moving ? Math.min(12, 3 + sp * 1.55) : 0);
    const run = clamp(sp / 5, 0, 1.3);
    const s = Math.sin(a.phase), c = Math.cos(a.phase);
    const now = performance.now();

    let legL = 0, legR = 0, knL = 0.05, knR = 0.05, armL = 0.05, armR = 0.05, armLz = 0.1, armRz = -0.1, elL = -0.12, elR = -0.12;
    let torsoX = 0, torsoY = 0, bob = 0, lower = 0, headX = 0;
    if (moving) {
      const amp = lerp(0.42, 0.9, clamp(run, 0, 1));
      legL = s * amp; legR = -s * amp;
      const kAmp = 0.35 + clamp(run, 0, 1) * 1.0;
      knL = 0.1 + Math.max(0, -c) * kAmp; knR = 0.1 + Math.max(0, c) * kAmp;
      armL = -s * amp * 0.85; armR = s * amp * 0.85;
      elL = -0.25 - run * 0.9; elR = -0.25 - run * 0.9;
      armLz = 0.08; armRz = -0.08;
      torsoX = 0.04 + run * 0.14;
      torsoY = s * 0.06 * (0.5 + run);
      bob = Math.abs(c) * 0.045 * (0.5 + run);
      lower = run * 0.03;
    } else {
      const br = Math.sin(now * 0.0021);
      bob = br * 0.006;
      armL = 0.04 + br * 0.015; armR = 0.04 - br * 0.015;
      headX = br * 0.02;
    }
    a.air = lerp(a.air, st.air ? 1 : 0, clamp(dt * 10, 0, 1));
    if (a.air > 0.05) {
      legL = lerp(legL, -0.6, a.air); legR = lerp(legR, 0.25, a.air);
      knL = lerp(knL, 1.0, a.air); knR = lerp(knR, 0.6, a.air);
      armL = lerp(armL, -1.0, a.air); armR = lerp(armR, -1.0, a.air);
      armLz = lerp(armLz, 0.6, a.air); armRz = lerp(armRz, -0.6, a.air);
    }
    a.swim = lerp(a.swim, st.swim ? 1 : 0, clamp(dt * 5, 0, 1));
    if (a.swim > 0.05) {
      const k = a.swim;
      torsoX = lerp(torsoX, 1.25, k);
      armL = lerp(armL, -2.6 + Math.sin(a.phase * 0.6) * 1.4, k);
      armR = lerp(armR, -2.6 - Math.sin(a.phase * 0.6) * 1.4, k);
      elL = lerp(elL, -0.3, k); elR = lerp(elR, -0.3, k);
      legL = lerp(legL, s * 0.35, k); legR = lerp(legR, -s * 0.35, k);
      knL = lerp(knL, 0.3, k); knR = lerp(knR, 0.3, k);
    }
    a.aim = lerp(a.aim, st.aim ? 1 : 0, clamp(dt * 14, 0, 1));
    if (a.aim > 0.02) {
      armR = lerp(armR, -Math.PI / 2 + (st.aimPitch || 0), a.aim);
      armRz = lerp(armRz, 0.05, a.aim); elR = lerp(elR, 0, a.aim);
      if (st.twoHanded) { armL = lerp(armL, -Math.PI / 2 + (st.aimPitch || 0) + 0.15, a.aim); armLz = lerp(armLz, -0.55, a.aim); elL = lerp(elL, -0.5, a.aim); }
    }
    if (a.punch > 0) {
      a.punch = Math.max(0, a.punch - dt * 3.2);
      const p = Math.sin((1 - a.punch) * Math.PI);
      if (st.melee === 'bate') {
        const k = 1 - a.punch;
        armR = -2.5 + k * 2.7; armRz = -0.35; elR = -0.3;
        armL = armR; armLz = 0.35; elL = -0.3;
        torsoY = k * 1.3 - 0.65;
      } else {
        const side = st.punchSide || 1;
        if (side > 0) { armR = -1.45 * p - 0.1; elR = -1.6 * (1 - p); armRz = -0.1; armL = -0.9; elL = -1.9; }
        else { armL = -1.45 * p - 0.1; elL = -1.6 * (1 - p); armLz = 0.1; armR = -0.9; elR = -1.9; }
        torsoY = side * p * 0.4;
      }
    }
    if (st.jugg) {
      const j = now * 0.012;
      armL = -0.55 + Math.sin(j) * 0.25; armR = -0.55 + Math.sin(j + Math.PI) * 0.25;
      elL = -1.2 + Math.sin(j) * 0.3; elR = -1.2 + Math.sin(j + Math.PI) * 0.3;
      armLz = 0.2; armRz = -0.2; headX = -0.25;
    }
    if (st.wave) { armR = -2.7 + Math.sin(now * 0.015) * 0.25; armRz = -0.5; elR = -0.4; }
    if (st.dance) {
      const d = now * 0.009;
      armL = -1.3 + Math.sin(d) * 0.9; armR = -1.3 + Math.cos(d) * 0.9; elL = -1; elR = -1;
      legL = Math.max(0, Math.sin(d * 2)) * -0.5; legR = Math.max(0, -Math.sin(d * 2)) * -0.5;
      knL = -legL * 1.5; knR = -legR * 1.5;
      torsoY = Math.sin(d) * 0.3; bob = Math.abs(Math.sin(d * 2)) * 0.07;
    }
    if (st.ride) {
      const ped = st.pedal || 0;
      legL = -1.05 + Math.sin(ped) * 0.4; legR = -1.05 - Math.sin(ped) * 0.4;
      knL = 1.0 + Math.cos(ped) * 0.35; knR = 1.0 - Math.cos(ped) * 0.35;
      torsoX = st.ride === 'moto' ? 0.3 : 0.42; bob = 0; torsoY = 0;
      armL = -1.15; armR = -1.15; elL = -0.45; elR = -0.45; armLz = 0.25; armRz = -0.25;
      lower = 0.22;
      if (st.aim) { armR = -Math.PI / 2; armRz = st.aimSide > 0 ? 1.3 : -0.2; elR = 0; }
      if (this.shadow) this.shadow.visible = false;
    } else if (st.sit) {
      legL = -1.5; legR = -1.5; knL = 1.45; knR = 1.45; torsoX = -0.08; bob = 0;
      armL = -1.05; armR = -1.05; elL = -0.55; elR = -0.55; armLz = 0.18; armRz = -0.18;
      lower = 0.47;
      if (st.steer) { armL += st.steer * 0.3; armR -= st.steer * 0.3; }
      if (st.aim) { armR = -Math.PI / 2; armRz = st.aimSide > 0 ? 1.3 : -0.2; elR = 0; }
    }

    B.thL.rotation.x = legL; B.thR.rotation.x = legR;
    B.knL.rotation.x = knL; B.knR.rotation.x = knR;
    B.ftL.rotation.x = -knL * 0.35 - legL * 0.15; B.ftR.rotation.x = -knR * 0.35 - legR * 0.15;
    B.shL.rotation.set(armL, 0, armLz); B.shR.rotation.set(armR, 0, armRz);
    B.elL.rotation.x = elL; B.elR.rotation.x = elR;
    B.spine.rotation.set(torsoX, torsoY, 0);
    B.head.rotation.set(headX - torsoX * 0.5, st.lookYaw || 0, 0);
    B.hips.position.y = this.hipY + bob - lower;

    const targetDead = st.dead ? 1 : 0;
    a.dead = lerp(a.dead, targetDead, clamp(dt * 6, 0, 1));
    if (a.dead > 0.01) {
      this.body.rotation.x = -a.dead * Math.PI / 2 * 0.97 + (st.knock || 0);
      this.body.position.y = a.dead * 0.14;
      this.body.position.z = -a.dead * 0.1;
      B.shL.rotation.z = lerp(B.shL.rotation.z, 1.3, a.dead); B.shR.rotation.z = lerp(B.shR.rotation.z, -1.3, a.dead);
    } else { this.body.rotation.x = 0; this.body.position.y = 0; this.body.position.z = 0; }
    if (this.shadow && !st.ride) this.shadow.visible = !st.sit;
  }
}

// ---------- Apariencias ----------
export const LOOKS = {
  gordopin: {
    skin: 0xc99a74, hair: 0x1e140c, hairStyle: 'short', fat: 0.95, muscle: 0.1, height: 1.0,
    shirt: 0xf4f4f4, shirtKind: 'banda', shirtHex: '#f4f4f4', shirtAccent: '#1c2f6b', sleeveHex: '#f4f4f4',
    pants: 0x1e2433, pantsKind: 'jogging', stripe: '#1c2f6b', shoes: 0xeeeeee, stubble: true, smile: true,
  },
  petroca: {
    skin: 0xd2a07c, hair: 0x2a1d14, hairStyle: 'short', fat: 0.35, muscle: 0.3, height: 1.04,
    shirt: 0x4f6f96, shirtKind: 'jean', shirtHex: '#55769c', longSleeves: true,
    pants: 0x2d3a55, shoes: 0x5a3a20, shoeKind: 'bota', glasses: true, mustache: true, stubble: true,
  },
};

const SKINS = [0xf0c8a0, 0xd9a47c, 0xc08a64, 0x9a6a48, 0xe8b890, 0x7a5236, 0xd8b090];
const HAIRS = [0x1e140c, 0x3a2614, 0x5a3a1c, 0x2a2a2a, 0x8a6a3a, 0xb0a090, 0x111111, 0x6a4a2a];
const SHIRTS = [0x8a2020, 0x2a4a8a, 0x3a6a3a, 0xd8d0c0, 0x5a5a5a, 0xc86a20, 0x6a3a6a, 0xe8e0a0, 0x203040, 0xa0b8c8, 0x7a5a3a, 0xf2f2f2, 0x1a1a1a, 0x4a6a8a];
const PANTS = [0x2a3a55, 0x1e1e22, 0x4a4a4a, 0x6a5a40, 0x3a4a6a, 0x5a3a2a, 0x2d3a55];

function makeLook(kind, rnd) {
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const L = {
    skin: pick(SKINS), hair: pick(HAIRS), hairStyle: pick(['short', 'short', 'short', 'long', 'cap', 'beanie', 'bald']),
    fat: rnd() < 0.3 ? 0.3 + rnd() * 0.5 : rnd() * 0.25, muscle: rnd() * 0.3, height: 0.94 + rnd() * 0.12,
    shirt: pick(SHIRTS), pants: pick(PANTS), shoes: pick([0x222222, 0xeeeeee, 0x5a3a20, 0x333a44]),
    mustache: rnd() < 0.2, beard: rnd() < 0.1, stubble: rnd() < 0.35, glasses: rnd() < 0.06, longSleeves: rnd() < 0.65,
    shirtKind: pick(['plain', 'plain', 'campera', 'campera', 'plain', 'polo']),
    pantsKind: rnd() < 0.3 ? 'jogging' : 'jean', hat: pick([0x1c2f6b, 0x8a1a1a, 0x222222, 0x3a5a3a]),
  };
  L.shirtHex = hex(L.shirt);
  if (kind === 'lobo') {
    L.shirtKind = 'banda'; L.shirtHex = '#f4f4f4'; L.shirtAccent = '#1c2f6b'; L.shirt = 0xf4f4f4; L.sleeveHex = '#f4f4f4';
    L.hairStyle = pick(['short', 'cap', 'beanie']); L.hat = 0x1c2f6b; L.pantsKind = 'jogging'; L.stripe = '#f4f4f4'; L.pants = 0x1c2f6b;
  }
  if (kind === 'cheto') {
    L.shirtKind = 'polo'; L.shirtHex = pick(['#7b2d8b', '#b04a9a', '#f0a0c8']); L.shirtAccent = '#f2f2f2'; L.shirt = 0x7b2d8b;
    L.pants = pick([0xe8e0c8, 0xd8d0b8]); L.pantsKind = 'jean'; L.hairStyle = pick(['long', 'short']); L.hair = pick([0x8a6a3a, 0xc8a060, 0x3a2614]); L.glasses = rnd() < 0.4; L.fat = 0.05;
    L.skin = pick([0xf0c8a0, 0xe8b890]); L.longSleeves = false;
  }
  if (kind === 'caleta') {
    L.shirt = 0xe8c020; L.shirtHex = '#e8c020'; L.shirtKind = 'plain'; L.hairStyle = pick(['cap', 'short']); L.hat = 0xe8c020; L.pants = 0x1e1e22; L.pantsKind = 'jogging'; L.stripe = '#e8c020';
  }
  if (kind === 'cana') {
    L.shirt = 0x2a3a5a; L.shirtHex = '#2a3a5a'; L.shirtKind = 'police'; L.longSleeves = true; L.pants = 0x1a2a4a; L.pantsKind = 'jogging'; L.stripe = '#1a2a4a';
    L.hairStyle = 'police'; L.hat = 0x1a2a4a; L.shoes = 0x111111; L.shoeKind = 'bota'; L.fat = rnd() * 0.4;
  }
  if (kind === 'petrolero') {
    L.shirtKind = 'mameluco'; L.shirtHex = pick(['#e8661a', '#1b4fa0', '#d0a020']); L.shirtAccent = '#e8e8d0'; L.longSleeves = true;
    L.pants = L.shirtHex === '#1b4fa0' ? 0x1b4fa0 : 0xe8661a; L.pantsKind = 'jogging'; L.stripe = '#e8e8d0'; L.hairStyle = 'helmet'; L.hat = pick([0xf2f2f2, 0xf2c230]); L.shoes = 0x5a3a20; L.shoeKind = 'bota';
  }
  if (kind === 'abuela') {
    L.shirt = 0x8a5a7a; L.shirtHex = '#8a5a7a'; L.shirtKind = 'campera'; L.pants = 0x3a3a4a; L.hair = 0xd8d8d8; L.hairStyle = 'long'; L.fat = 0.45; L.height = 0.9; L.glasses = true; L.skin = 0xe8b890; L.longSleeves = true;
  }
  if (kind === 'tenpesos') {
    L.shirt = 0x2a3a5a; L.shirtHex = '#2a3a5a'; L.shirtKind = 'police'; L.pants = 0x1a2a4a; L.hairStyle = 'police'; L.hat = 0x1a2a4a; L.mustache = true; L.fat = 0.7; L.skin = 0xd9a47c; L.longSleeves = true; L.shoes = 0x111111; L.shoeKind = 'bota'; L.stubble = true;
  }
  if (kind === 'crudo') {
    L.shirt = 0x2a2a2e; L.shirtHex = '#2a2a2e'; L.shirtKind = 'traje'; L.pants = 0x2a2a2e; L.hairStyle = 'short'; L.hair = 0xb0b0b0; L.fat = 0.5; L.glasses = true; L.longSleeves = true; L.shoes = 0x111111; L.skin = 0xf0c8a0;
  }
  return L;
}

// Pool acotado de apariencias (así se reutilizan texturas y mallas)
const POOL = {};
const POOL_SIZE = { civil: 26, lobo: 5, cheto: 6, caleta: 5, cana: 5, petrolero: 6 };
export function randomLook(kind = 'civil', rnd = Math.random) {
  if (!POOL_SIZE[kind]) return makeLook(kind, rnd);
  if (!POOL[kind]) {
    const r = new RNG(1000 + Object.keys(POOL_SIZE).indexOf(kind) * 97);
    POOL[kind] = [];
    for (let i = 0; i < POOL_SIZE[kind]; i++) POOL[kind].push(makeLook(kind, () => r.next()));
  }
  return { ...POOL[kind][Math.floor(rnd() * POOL[kind].length)] };
}
