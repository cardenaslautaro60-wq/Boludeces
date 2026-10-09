// Interior del Draw Bar & Pool (San Martín 371, Comodoro Rivadavia), armado a partir de las
// fotos públicas del local: arriba de la escalera, el salón con paredes verde oscuro, dos
// ventanales en arco que dan al balcón de San Martín, lámparas naranjas, mesitas, una mesa de
// cartas con paño verde, la barra y el escenario donde canta Charly Amado; al fondo, la sala de
// pool: techo azul, paredes blancas con zócalo azul, banderas argentinas colgadas, ocho mesas
// (celestes, dos verdes y una de marco blanco con paño gris), lámparas negras, cuadros de
// jugadores, televisores, banquetas contra la pared y los carteles de neón de los baños.
//
// Coordenadas locales en metros: x a lo ancho (-12..12), z hacia el fondo (0 = frente a la calle),
// y = 0 el piso. Todo se suma a la escena en un grupo ubicado en (ox, oy, oz).
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { lam } from '../render/style.js';
import { RNG } from '../util.js';

export const DRAW_H = 3.6;            // alto del techo
export const DRAW_TABLE = { L: 2.84, W: 1.6, playL: 2.54, playW: 1.27, h: 0.8 };
// mesas de pool: centro (x, z), paño y marco
export const DRAW_TABLES = [
  { n: 1, x: -5.6, z: 13.6, cloth: '#1fa3dc', frame: '#6b3a1c' },
  { n: 2, x: 5.6, z: 13.6, cloth: '#1fa3dc', frame: '#6b3a1c' },
  { n: 3, x: -5.6, z: 17.8, cloth: '#1fa3dc', frame: '#6b3a1c' },
  { n: 4, x: 5.6, z: 17.8, cloth: '#1fa3dc', frame: '#6b3a1c' },
  { n: 5, x: -5.6, z: 22.0, cloth: '#9aa3ab', frame: '#e8e6e0' },
  { n: 6, x: 5.6, z: 22.0, cloth: '#1fa3dc', frame: '#6b3a1c' },
  { n: 7, x: -5.6, z: 26.2, cloth: '#1d8a45', frame: '#5a3018' },
  { n: 8, x: 5.6, z: 26.2, cloth: '#1d8a45', frame: '#5a3018' },
];

function cv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function tx(c, rx = 1, ry = 1) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  t.anisotropy = 4;
  return t;
}

// ---------- Texturas pintadas ----------
function speckle(g, w, h, base, amp, n, rng) {
  g.fillStyle = base; g.fillRect(0, 0, w, h);
  for (let i = 0; i < n; i++) {
    const v = (rng.next() - 0.5) * amp;
    g.fillStyle = v > 0 ? `rgba(255,255,255,${v})` : `rgba(0,0,0,${-v})`;
    g.fillRect(rng.next() * w, rng.next() * h, 1 + rng.next() * 2, 1 + rng.next() * 2);
  }
}

function texFloorTile(rng, base, line) {
  const c = cv(128, 128), g = c.getContext('2d');
  speckle(g, 128, 128, base, 0.18, 900, rng);
  g.strokeStyle = line; g.lineWidth = 2;
  g.strokeRect(1, 1, 126, 126);
  return c;
}

function texCloth(rng, col) {
  const c = cv(64, 64), g = c.getContext('2d');
  speckle(g, 64, 64, col, 0.08, 500, rng);
  return c;
}

function texWallGreen(rng) {
  const c = cv(128, 128), g = c.getContext('2d');
  speckle(g, 128, 128, '#1f3a2c', 0.12, 700, rng);
  return c;
}

function texWallWhite(rng) {
  // blanco arriba, zócalo azul abajo (0..1 m de 3,6 m)
  const c = cv(64, 256), g = c.getContext('2d');
  speckle(g, 64, 256, '#e9ecef', 0.06, 300, rng);
  const z = Math.round(256 * (1 - 1.0 / DRAW_H));
  g.fillStyle = '#1b3f8f'; g.fillRect(0, z, 64, 256 - z);
  g.fillStyle = '#2a58b8'; g.fillRect(0, z, 64, 5);
  return c;
}

function texCeiling(rng) {
  const c = cv(128, 128), g = c.getContext('2d');
  speckle(g, 128, 128, '#16349a', 0.1, 400, rng);
  g.strokeStyle = 'rgba(0,0,0,0.25)'; g.lineWidth = 2; g.strokeRect(0, 0, 128, 128);
  return c;
}

function texWood(rng, base = '#6b3a1c') {
  const c = cv(64, 64), g = c.getContext('2d');
  g.fillStyle = base; g.fillRect(0, 0, 64, 64);
  for (let i = 0; i < 40; i++) {
    g.strokeStyle = `rgba(0,0,0,${0.05 + rng.next() * 0.12})`;
    g.beginPath(); const y = rng.next() * 64; g.moveTo(0, y); g.bezierCurveTo(20, y + rng.next() * 6 - 3, 40, y + rng.next() * 6 - 3, 64, y); g.stroke();
  }
  return c;
}

function texFlag() {
  const c = cv(96, 160), g = c.getContext('2d');
  g.fillStyle = '#74acdf'; g.fillRect(0, 0, 96, 160);
  g.fillStyle = '#ffffff'; g.fillRect(32, 0, 32, 160);
  // sol de mayo (bandera colgada vertical)
  g.save(); g.translate(48, 80);
  g.fillStyle = '#f6b40e';
  for (let i = 0; i < 16; i++) { g.rotate(Math.PI / 8); g.fillRect(-1.5, 7, 3, 7); }
  g.beginPath(); g.arc(0, 0, 8, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#85340a'; g.fillRect(-3, -2, 2, 2); g.fillRect(1, -2, 2, 2);
  g.restore();
  return c;
}

// Cuadro de un jugador de pool (silueta, no es nadie en particular)
function texPoster(rng, i) {
  const c = cv(128, 192), g = c.getContext('2d');
  const bg = ['#0d2a6b', '#0b1f4a', '#123c8a', '#1a1a3a'][i % 4];
  const grd = g.createLinearGradient(0, 0, 0, 192);
  grd.addColorStop(0, bg); grd.addColorStop(1, '#05070f');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 192);
  // mesa
  g.fillStyle = '#1fa3dc'; g.fillRect(0, 140, 128, 52);
  g.fillStyle = '#3a2210'; g.fillRect(0, 136, 128, 6);
  // jugador agachado sobre el taco
  g.fillStyle = ['#e8c8a8', '#c8a080', '#a07858'][i % 3];
  g.beginPath(); g.arc(70 - i * 3, 92, 11, 0, Math.PI * 2); g.fill();
  g.fillStyle = ['#d02020', '#f0f0f0', '#202020', '#e0a020'][i % 4];
  g.beginPath(); g.moveTo(50, 100); g.lineTo(110, 96); g.lineTo(118, 140); g.lineTo(60, 140); g.closePath(); g.fill();
  g.strokeStyle = '#d8c090'; g.lineWidth = 3;
  g.beginPath(); g.moveTo(10, 128); g.lineTo(122, 104); g.stroke();
  g.fillStyle = '#ffffff'; g.beginPath(); g.arc(14, 150, 4, 0, Math.PI * 2); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.85)';
  g.font = 'bold 16px sans-serif'; g.textAlign = 'center';
  g.fillText(['POOL', 'BOLA 8', 'DRAW', 'TACO'][i % 4], 64, 26);
  return c;
}

function texFrame(rng, i) {
  // cuadritos del salón (afiches viejos y fotos)
  const c = cv(64, 80), g = c.getContext('2d');
  g.fillStyle = '#d8d0b8'; g.fillRect(0, 0, 64, 80);
  const cols = ['#b03020', '#2050a0', '#e0b040', '#305030', '#7a3a7a'];
  g.fillStyle = cols[i % cols.length]; g.fillRect(6, 6, 52, 52);
  g.fillStyle = 'rgba(255,255,255,0.7)';
  for (let k = 0; k < 3; k++) g.fillRect(10, 62 + k * 5, 30 + rng.next() * 14, 2);
  g.fillStyle = 'rgba(0,0,0,0.35)';
  g.beginPath(); g.arc(32, 32, 10 + rng.next() * 8, 0, Math.PI * 2); g.fill();
  return c;
}

function texNumber(n) {
  const c = cv(64, 64), g = c.getContext('2d');
  g.fillStyle = '#f2f2f2'; g.fillRect(0, 0, 64, 64);
  g.fillStyle = '#111'; g.font = 'bold 48px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(String(n), 32, 35);
  return c;
}

function texNeonDraw() {
  const c = cv(256, 96), g = c.getContext('2d');
  g.clearRect(0, 0, 256, 96);
  g.font = 'italic bold 58px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.shadowColor = '#40c8ff'; g.shadowBlur = 14;
  g.fillStyle = '#bff0ff'; g.fillText('Draw', 128, 40);
  g.font = 'bold 18px sans-serif'; g.shadowColor = '#ff3aa0'; g.fillStyle = '#ffd0ea';
  g.fillText('BAR & POOL', 128, 80);
  return c;
}

function texNeonWC(woman) {
  const c = cv(64, 96), g = c.getContext('2d');
  g.clearRect(0, 0, 64, 96);
  const col = woman ? '#ff4fd0' : '#3aa0ff';
  g.strokeStyle = col; g.lineWidth = 4; g.shadowColor = col; g.shadowBlur = 10; g.lineCap = 'round';
  g.beginPath(); g.arc(32, 18, 8, 0, Math.PI * 2); g.stroke();
  if (woman) { g.beginPath(); g.moveTo(32, 30); g.lineTo(18, 66); g.lineTo(46, 66); g.closePath(); g.stroke(); }
  else { g.beginPath(); g.moveTo(32, 30); g.lineTo(32, 62); g.stroke(); }
  g.beginPath(); g.moveTo(26, 64); g.lineTo(24, 88); g.moveTo(38, 64); g.lineTo(40, 88); g.stroke();
  g.beginPath(); g.moveTo(16, 42); g.lineTo(48, 42); g.stroke();
  return c;
}

function texWindow() {
  // ventanal en arco: marco blanco con varillas; el vidrio se tiñe según la hora
  const c = cv(128, 160), g = c.getContext('2d');
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, 128, 160);
  // los vidrios quedan transparentes: atrás se ve el vidrio que cambia con la hora
  const cols = 4, rows = 5;
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) g.clearRect(6 + i * 30, 46 + j * 22, 26, 18);
  // abanico del arco
  g.save(); g.beginPath(); g.arc(64, 44, 58, Math.PI, 0); g.lineTo(122, 44); g.lineTo(6, 44); g.closePath(); g.clip();
  g.clearRect(0, 0, 128, 44);
  g.strokeStyle = '#ffffff'; g.lineWidth = 4;
  for (let k = 1; k < 5; k++) { const a = Math.PI + (k / 5) * Math.PI; g.beginPath(); g.moveTo(64, 44); g.lineTo(64 + Math.cos(a) * 70, 44 + Math.sin(a) * 70); g.stroke(); }
  g.beginPath(); g.arc(64, 44, 26, Math.PI, 0); g.stroke();
  g.restore();
  // fuera del arco: pared (verde, opaca)
  const img = g.getImageData(0, 0, 128, 160);
  for (let y = 0; y < 44; y++) for (let x = 0; x < 128; x++) {
    if (Math.hypot(x - 64, y - 44) > 60) { const k = (y * 128 + x) * 4; img.data[k] = 31; img.data[k + 1] = 58; img.data[k + 2] = 44; img.data[k + 3] = 255; }
  }
  g.putImageData(img, 0, 0);
  return c;
}

function texTV(rng) {
  const c = cv(128, 72), g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 128, 72);
  grd.addColorStop(0, '#0a3aa8'); grd.addColorStop(1, '#40c0ff');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 72);
  g.fillStyle = '#2a8a2a'; g.fillRect(8, 30, 112, 34);
  g.fillStyle = '#ffffff'; g.fillRect(8, 46, 112, 1);
  g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = 'bold 11px sans-serif'; g.fillText('CAI 1 - 0 NEWBERY', 10, 18);
  return c;
}

// ---------- Armado ----------
export function buildDraw(game, ox, oy, oz) {
  const rng = new RNG(371);
  const group = new THREE.Group();
  group.position.set(ox, oy, oz);
  group.name = 'interior-draw';
  const H = DRAW_H;

  const mats = {};
  const M = (key, make) => mats[key] || (mats[key] = make());
  const parts = new Map(); // material -> [geometrías]
  const add = (mat, geo) => { let a = parts.get(mat); if (!a) parts.set(mat, a = []); a.push(geo); };
  const box = (mat, x0, y0, z0, x1, y1, z1, uvScale = 0) => {
    const w = x1 - x0, h = y1 - y0, d = z1 - z0;
    const geo = new THREE.BoxGeometry(w, h, d);
    if (uvScale) {
      // UV en metros (para que las texturas repetidas no se estiren)
      const uv = geo.attributes.uv, n = geo.attributes.normal;
      for (let i = 0; i < uv.count; i++) {
        const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i));
        const u = uv.getX(i), v = uv.getY(i);
        const su = ax > 0.5 ? d : w, sv = ay > 0.5 ? d : h;
        uv.setXY(i, u * su * uvScale, v * sv * uvScale);
      }
    }
    geo.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    add(mat, geo);
    return geo;
  };
  const cols = [];
  const solid = (x0, z0, x1, z1, y0, y1, tag = 'interior') => cols.push([x0, z0, x1, z1, y0, y1, tag]);

  // materiales
  const floorTile = M('floorTile', () => lam({ map: tx(texFloorTile(rng, '#cfc6b4', '#a89e8a'), 1, 1) }));
  const floorBar = M('floorBar', () => lam({ map: tx(texFloorTile(rng, '#3a3530', '#25221e'), 1, 1) }));
  const wallGreen = M('wallGreen', () => lam({ map: tx(texWallGreen(rng), 1, 1) }));
  const wallWhite = M('wallWhite', () => lam({ map: tx(texWallWhite(rng), 1, 1) }));
  const ceilingBlue = M('ceilingBlue', () => lam({ map: tx(texCeiling(rng), 1, 1), emissive: 0x0a1a55, emissiveIntensity: 0.6 }));
  const ceilingDark = M('ceilingDark', () => lam({ color: 0x15201a }));
  const wood = M('wood', () => lam({ map: tx(texWood(rng), 1, 1) }));
  const woodDark = M('woodDark', () => lam({ map: tx(texWood(rng, '#3a2214'), 1, 1) }));
  const white = M('white', () => lam({ color: 0xe8e6e0 }));
  const black = M('black', () => lam({ color: 0x18181a }));
  const metal = M('metal', () => lam({ color: 0x9aa0a8 }, { metalness: 0.7, roughness: 0.35 }));
  const pillarBlue = M('pillarBlue', () => lam({ color: 0x1b3f8f }));
  const beige = M('beige', () => lam({ color: 0xcdbb98 }));
  const felt = M('felt', () => lam({ map: tx(texCloth(rng, '#1d6a3a')) }));
  const glow = (hex, k = 2.2) => lam({ color: 0x000000, emissive: hex, emissiveIntensity: k });
  const bulbWarm = M('bulbWarm', () => glow(0xfff1d0, 2.4));
  const bulbOrange = M('bulbOrange', () => glow(0xff9a30, 2.6));
  const pendant = M('pendant', () => lam({ color: 0xc8701a, emissive: 0x7a3a08, emissiveIntensity: 0.9 }));

  // ---- Piso, techo y paredes ----
  box(floorBar, -12, -0.3, 0, 12, 0, 10, 0.5);
  box(floorTile, -12, -0.3, 10, 12, 0, 32, 0.6);
  solid(-12, 0, 12, 32, -1, 0);
  box(ceilingDark, -12, H, 0, 12, H + 0.3, 10, 0.5);
  box(ceilingBlue, -12, H, 10, 12, H + 0.3, 32, 0.25);
  // el techo solo frena la cámara: si empujara al personaje de costado lo sacaba del local
  solid(-12, 0, 12, 32, H, H + 1, 'techo');
  const T = 0.3;
  // salón: paredes verdes
  // frente (z = 0) con dos ventanales en arco: se arma en paños alrededor de los huecos
  const win = [[-6.4, -3.6], [2.6, 5.4]];
  let xa = -12;
  for (const [a, b] of win) {
    box(wallGreen, xa, 0, -T, a, H, 0, 0.5);
    box(wallGreen, a, 2.95, -T, b, H, 0, 0.5);
    box(wallGreen, a, 0, -T, b, 0.55, 0, 0.5);
    xa = b;
  }
  box(wallGreen, xa, 0, -T, 12, H, 0, 0.5);
  solid(-12, -T, 12, 0, 0, H);
  box(wallGreen, -12 - T, 0, 0, -12, H, 10, 0.5); // izquierda
  box(wallGreen, 12, 0, 0, 12 + T, H, 10, 0.5);   // derecha
  // pared divisoria (z = 10) con abertura central de 10 m
  box(wallGreen, -12, 0, 10 - T, -5, H, 10, 0.5);
  box(wallGreen, 5, 0, 10 - T, 12, H, 10, 0.5);
  box(wallWhite, -12, 0, 10, -5, H, 10.02, 0);
  box(wallWhite, 5, 0, 10, 12, H, 10.02, 0);
  box(wallGreen, -5, 2.9, 10 - T, 5, H, 10.02, 0.5);
  solid(-12, 10 - T, -5, 10, 0, H); solid(5, 10 - T, 12, 10, 0, H);
  // sala de pool: paredes blancas con zócalo azul y columnas azules
  const whiteWall = (x0, z0, x1, z1) => {
    const geo = box(wallWhite, x0, 0, z0, x1, H, z1, 0);
    // UV: u a lo largo (cada 2 m), v de piso a techo
    const uv = geo.attributes.uv, n = geo.attributes.normal;
    const L = Math.max(x1 - x0, z1 - z0);
    for (let i = 0; i < uv.count; i++) { if (Math.abs(n.getY(i)) > 0.5) continue; uv.setX(i, uv.getX(i) * L / 2); }
    solid(x0, z0, x1, z1, 0, H);
  };
  whiteWall(-12 - T, 10, -12, 32);
  whiteWall(12, 10, 12 + T, 32);
  whiteWall(-12, 32, 12, 32 + T);
  for (const z of [14, 20, 26]) {
    box(pillarBlue, -12, 0, z - 0.25, -11.75, H, z + 0.25);
    box(pillarBlue, 11.75, 0, z - 0.25, 12, H, z + 0.25);
  }
  solid(-12 - T, 0, -12, 10, 0, H); solid(12, 0, 12 + T, 10, 0, H);

  // ---- Escalera de entrada (baja a la calle) ----
  // hueco con escalones que se pierden en la oscuridad, con baranda
  const stair = M('stair', () => lam({ color: 0x4a443c }));
  for (let k = 0; k < 7; k++) box(stair, -11.6, -0.25 - k * 0.22, 0.4 + k * 0.32, -9.4, -0.05 - k * 0.22, 0.72 + k * 0.32);
  box(black, -11.6, -2.2, 0.3, -9.4, -1.6, 3.2);
  box(metal, -9.4, 0, 0.3, -9.32, 1.0, 3.0);
  box(metal, -11.6, 0.95, 3.0, -9.32, 1.03, 3.08);
  box(metal, -9.4, 0.95, 0.3, -9.32, 1.03, 3.08);
  solid(-11.7, 0.3, -9.3, 3.1, -1, 1.0);
  // tapar el piso del salón sobre la escalera (agujero): el piso de arriba ya lo cubre,
  // así que se dibuja una boca oscura encima
  box(M('hole', () => new THREE.MeshBasicMaterial({ color: 0x050505 })), -11.6, 0.003, 0.3, -9.4, 0.006, 3.1);

  // ---- Ventanales en arco (dan al balcón de San Martín) ----
  const glassMat = new THREE.MeshBasicMaterial({ color: 0x9cc8ff, fog: false });
  const frameMat = new THREE.MeshBasicMaterial({ map: tx(texWindow()), transparent: true, alphaTest: 0.5, fog: false, color: 0xf2f2f2 });
  for (const [a, b] of win) {
    const w = b - a;
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(w, 2.4), glassMat);
    glass.position.set((a + b) / 2, 0.55 + 1.2, -0.12);
    group.add(glass);
    const frame = new THREE.Mesh(new THREE.PlaneGeometry(w, 2.4), frameMat);
    frame.position.set((a + b) / 2, 0.55 + 1.2, -0.1);
    group.add(frame);
    box(white, a - 0.08, 0.5, -0.06, b + 0.08, 0.6, 0.08); // alféizar
  }

  // ---- Barra ----
  box(woodDark, -9.7, 0, 4.6, -9.0, 1.05, 9.6, 1);
  box(wood, -9.85, 1.05, 4.5, -8.85, 1.12, 9.7, 1);
  box(woodDark, -11.9, 0, 9.0, -9.7, 1.05, 9.6, 1);
  solid(-9.85, 4.5, -8.85, 9.7, 0, 1.12);
  solid(-11.9, 9.0, -9.0, 9.7, 0, 1.12);
  // estantes con botellas
  box(woodDark, -11.95, 1.0, 4.8, -11.6, 1.04, 8.8);
  box(woodDark, -11.95, 1.6, 4.8, -11.6, 1.64, 8.8);
  box(woodDark, -11.95, 2.2, 4.8, -11.6, 2.24, 8.8);
  solid(-12, 4.8, -11.5, 8.8, 0, H); // hasta el techo: no se puede trepar
  const bottleCols = [0x2a6a2a, 0x7a3a10, 0xd8d0b0, 0x3a1a4a, 0x8a1a1a, 0x1a3a7a, 0xc89a20];
  for (let s = 0; s < 3; s++) for (let i = 0; i < 16; i++) {
    const col = bottleCols[rng.int(0, bottleCols.length - 1)];
    const bm = M('bottle' + col, () => lam({ color: col, emissive: col, emissiveIntensity: 0.25 }, { roughness: 0.2 }));
    const hh = 0.22 + rng.next() * 0.12;
    const geo = new THREE.CylinderGeometry(0.035, 0.04, hh, 6);
    geo.translate(-11.78, 1.04 + s * 0.6 + hh / 2, 5 + i * 0.24 + rng.next() * 0.05);
    add(bm, geo);
  }
  // banquetas de barra
  const stools = [];
  for (let i = 0; i < 5; i++) stools.push([-8.35, 5.2 + i * 0.95, 0.72]);
  // banquetas contra la pared de la sala de pool (con el estante de apoyo de las fotos)
  box(wood, 11.5, 1.05, 11, 12, 1.1, 31, 1);
  solid(11.5, 11, 12, 31, 0, 1.1);
  for (let i = 0; i < 8; i++) stools.push([11.0, 11.8 + i * 2.3, 0.72]); // (el último pisaba el sillón)
  box(wood, -12, 1.05, 29, -11.5, 1.1, 31.5, 1);
  for (const [x, z, h] of stools) {
    const seat = new THREE.CylinderGeometry(0.19, 0.19, 0.06, 10); seat.translate(x, h, z); add(black, seat);
    const leg = new THREE.CylinderGeometry(0.03, 0.03, h, 5); leg.translate(x, h / 2, z); add(metal, leg);
    const foot = new THREE.CylinderGeometry(0.2, 0.2, 0.03, 10); foot.translate(x, 0.015, z); add(metal, foot);
  }

  // ---- Mesitas del salón y la mesa de cartas ----
  const smallTables = [[-5.2, 3.0], [-5.2, 6.6], [-1.6, 3.0], [2.0, 3.0], [-1.8, 8.6], [3.6, 7.4]];
  const chairs = [];
  for (const [x, z] of smallTables) {
    box(black, x - 0.42, 0.72, z - 0.42, x + 0.42, 0.76, z + 0.42);
    box(metal, x - 0.04, 0, z - 0.04, x + 0.04, 0.72, z + 0.04);
    box(metal, x - 0.3, 0, z - 0.3, x + 0.3, 0.02, z + 0.3);
    solid(x - 0.42, z - 0.42, x + 0.42, z + 0.42, 0, 0.76);
    chairs.push([x - 0.75, z, Math.PI / 2], [x + 0.75, z, -Math.PI / 2]);
  }
  // mesa de cartas: paño verde, señores mayores
  const CT = { x: 0.6, z: 6.0 };
  box(woodDark, CT.x - 0.95, 0.7, CT.z - 0.6, CT.x + 0.95, 0.76, CT.z + 0.6);
  box(felt, CT.x - 0.85, 0.761, CT.z - 0.5, CT.x + 0.85, 0.765, CT.z + 0.5);
  box(woodDark, CT.x - 0.06, 0, CT.z - 0.06, CT.x + 0.06, 0.7, CT.z + 0.06);
  solid(CT.x - 0.95, CT.z - 0.6, CT.x + 0.95, CT.z + 0.6, 0, 0.76);
  // cartas sobre el paño
  for (let i = 0; i < 6; i++) box(white, CT.x - 0.5 + i * 0.18, 0.766, CT.z - 0.1 + (i % 2) * 0.12, CT.x - 0.44 + i * 0.18, 0.768, CT.z - 0.02 + (i % 2) * 0.12);
  const cardSeats = [[CT.x - 1.25, CT.z, Math.PI / 2], [CT.x + 1.25, CT.z, -Math.PI / 2], [CT.x, CT.z - 0.95, 0], [CT.x, CT.z + 0.95, Math.PI]];
  for (const c of cardSeats) chairs.push(c);
  for (const [x, z, r] of chairs) {
    const fx = Math.sin(r), fz = Math.cos(r);
    box(black, x - 0.22, 0.44, z - 0.22, x + 0.22, 0.48, z + 0.22);
    const bx = x - fx * 0.2, bz = z - fz * 0.2;
    box(black, bx - 0.22 * Math.abs(fz) - 0.03 * Math.abs(fx), 0.48, bz - 0.22 * Math.abs(fx) - 0.03 * Math.abs(fz), bx + 0.22 * Math.abs(fz) + 0.03 * Math.abs(fx), 0.95, bz + 0.22 * Math.abs(fx) + 0.03 * Math.abs(fz));
    for (const [lx, lz] of [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]]) box(metal, x + lx - 0.015, 0, z + lz - 0.015, x + lx + 0.015, 0.44, z + lz + 0.015);
  }

  // ---- Escenario de Charly ----
  const STAGE = { x0: 7.2, x1: 12, z0: 4.2, z1: 9.8, h: 0.3 };
  box(M('stage', () => lam({ color: 0x24201c })), STAGE.x0, 0, STAGE.z0, STAGE.x1, STAGE.h, STAGE.z1, 1);
  box(metal, STAGE.x0 - 0.04, STAGE.h - 0.04, STAGE.z0, STAGE.x0, STAGE.h + 0.004, STAGE.z1);
  solid(STAGE.x0, STAGE.z0, STAGE.x1, STAGE.z1, -1, STAGE.h);
  // parlantes
  for (const z of [4.7, 9.3]) {
    box(black, 11.0, STAGE.h, z - 0.35, 11.7, STAGE.h + 1.3, z + 0.35);
    const cone = new THREE.CylinderGeometry(0.2, 0.2, 0.02, 12); cone.rotateZ(Math.PI / 2); cone.translate(10.99, STAGE.h + 0.9, z); add(M('cone', () => lam({ color: 0x3a3a3e })), cone);
    solid(11.0, z - 0.35, 11.7, z + 0.35, 0, STAGE.h + 1.3);
  }
  // compu con las pistas
  box(black, 11.2, STAGE.h, 6.6, 11.8, STAGE.h + 0.85, 7.4);
  box(M('screen', () => glow(0x60a0ff, 1.2)), 11.18, STAGE.h + 0.86, 6.8, 11.5, STAGE.h + 1.1, 7.2);
  // pie de micrófono
  box(metal, 8.43, STAGE.h, 7.58, 8.47, STAGE.h + 1.45, 7.62);
  // telón de fondo brillante
  const curtain = M('curtain', () => lam({ color: 0x2a0a3a, emissive: 0x3a0a5a, emissiveIntensity: 0.5 }));
  box(curtain, 11.9, STAGE.h, 4.2, 12, H, 9.8);
  // bolas de luces de colores
  const discoCols = [0xff3aa0, 0x40c8ff, 0xffd040, 0x7aff5a];
  discoCols.forEach((c, i) => box(M('disco' + c, () => glow(c, 3)), 7.6 + i * 1.1, H - 0.25, 4.5, 7.8 + i * 1.1, H - 0.05, 4.7));

  // ---- Sillón beige al fondo y puertas de los baños ----
  box(beige, 9.4, 0, 30.2, 11.6, 0.45, 31.7);
  box(beige, 9.4, 0.45, 31.3, 11.6, 1.0, 31.7);
  box(beige, 9.4, 0.45, 30.2, 9.7, 0.7, 31.7);
  box(beige, 11.3, 0.45, 30.2, 11.6, 0.7, 31.7);
  solid(9.4, 30.2, 11.6, 31.7, 0, 0.7);
  const door = M('door', () => lam({ color: 0x3a3e46 }));
  box(door, -3.4, 0, 31.92, -2.4, 2.1, 32, 1);
  box(door, 2.4, 0, 31.92, 3.4, 2.1, 32, 1);

  // ---- Mesas de pool ----
  const clothMats = {};
  for (const t of DRAW_TABLES) {
    const L = DRAW_TABLE.L, Wd = DRAW_TABLE.W, h = DRAW_TABLE.h;
    const fm = t.frame === '#e8e6e0' ? white : t.frame === '#5a3018' ? woodDark : wood;
    const cm = clothMats[t.cloth] || (clothMats[t.cloth] = lam({ map: tx(texCloth(rng, t.cloth)) }));
    const x = t.x, z = t.z;
    // cuerpo, paño y bandas
    box(fm, x - L / 2 + 0.15, 0.45, z - Wd / 2 + 0.12, x + L / 2 - 0.15, h - 0.08, z + Wd / 2 - 0.12, 1);
    box(cm, x - DRAW_TABLE.playL / 2, h - 0.08, z - DRAW_TABLE.playW / 2, x + DRAW_TABLE.playL / 2, h - 0.04, z + DRAW_TABLE.playW / 2);
    const rail = 0.15;
    box(fm, x - L / 2, h - 0.12, z - Wd / 2, x + L / 2, h, z - Wd / 2 + rail, 1);
    box(fm, x - L / 2, h - 0.12, z + Wd / 2 - rail, x + L / 2, h, z + Wd / 2, 1);
    box(fm, x - L / 2, h - 0.12, z - Wd / 2, x - L / 2 + rail, h, z + Wd / 2, 1);
    box(fm, x + L / 2 - rail, h - 0.12, z - Wd / 2, x + L / 2, h, z + Wd / 2, 1);
    // bandas de goma del color del paño
    box(cm, x - DRAW_TABLE.playL / 2, h - 0.04, z - DRAW_TABLE.playW / 2 - 0.035, x + DRAW_TABLE.playL / 2, h - 0.01, z - DRAW_TABLE.playW / 2);
    box(cm, x - DRAW_TABLE.playL / 2, h - 0.04, z + DRAW_TABLE.playW / 2, x + DRAW_TABLE.playL / 2, h - 0.01, z + DRAW_TABLE.playW / 2 + 0.035);
    // troneras
    for (const [px, pz] of [[-1, -1], [0, -1], [1, -1], [-1, 1], [0, 1], [1, 1]]) {
      const pk = new THREE.CylinderGeometry(0.07, 0.07, 0.02, 10);
      pk.translate(x + px * DRAW_TABLE.playL / 2, h - 0.035, z + pz * (DRAW_TABLE.playW / 2 + 0.02));
      add(black, pk);
    }
    // patas (torneadas en las de madera)
    for (const [lx, lz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const lg = new THREE.CylinderGeometry(0.1, 0.07, 0.48, 8);
      lg.translate(x + lx * (L / 2 - 0.3), 0.24, z + lz * (Wd / 2 - 0.25));
      add(fm, lg);
      const kn = new THREE.SphereGeometry(0.12, 8, 6); kn.translate(x + lx * (L / 2 - 0.3), 0.4, z + lz * (Wd / 2 - 0.25)); add(fm, kn);
    }
    solid(x - L / 2, z - Wd / 2, x + L / 2, z + Wd / 2, 0, h);
    // lámpara: barra con tres pantallas negras
    box(black, x - 1.25, 2.55, z - 0.03, x + 1.25, 2.6, z + 0.03);
    box(metal, x - 0.01, 2.6, z - 0.01, x + 0.01, H, z + 0.01);
    for (const k of [-0.85, 0, 0.85]) {
      const sh = new THREE.ConeGeometry(0.34, 0.32, 12, 1, true);
      sh.translate(x + k, 2.42, z); add(M('shade', () => lam({ color: 0x141416, side: THREE.DoubleSide })), sh);
      const bl = new THREE.CircleGeometry(0.28, 12); bl.rotateX(Math.PI / 2); bl.translate(x + k, 2.27, z); add(bulbWarm, bl);
    }
    // número de mesa colgado (como el "5" de las fotos)
    const nm = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.42), lam({ map: tx(texNumber(t.n)) }));
    nm.position.set(x + (x < 0 ? -1.6 : 1.6), 2.75, z);
    nm.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2;
    group.add(nm);
  }

  // ---- Lámparas naranjas del salón ----
  for (const [x, z] of [[-5.2, 4.8], [-1.6, 3.0], [2.0, 3.0], [0.6, 6.0], [-1.8, 8.6], [3.4, 9.2], [-4.5, 8.4]]) {
    const sh = new THREE.ConeGeometry(0.22, 0.28, 10, 1, true); sh.translate(x, H - 1.1, z); add(pendant, sh);
    const bl = new THREE.SphereGeometry(0.09, 8, 6); bl.translate(x, H - 1.22, z); add(bulbOrange, bl);
    box(black, x - 0.005, H - 0.96, z - 0.005, x + 0.005, H, z + 0.005);
  }
  // ventilador de pared y televisores
  box(black, -0.4, 2.6, 9.62, 0.4, 3.0, 9.7);
  const tvMat = lam({ map: tx(texTV(rng)), emissive: 0xffffff, emissiveMap: null, emissiveIntensity: 0.0 });
  tvMat.emissiveMap = tvMat.map; tvMat.emissiveIntensity = 1.1;
  const tvs = [[0, 2.6, 21, 0], [-11.4, 2.5, 7.0, Math.PI / 2], [0, 2.6, 13, Math.PI]];
  for (const [x, y, z, r] of tvs) {
    const fx = Math.sin(r), fz = Math.cos(r);
    const back = new THREE.BoxGeometry(1.1, 0.66, 0.08); back.rotateY(r); back.translate(x - fx * 0.05, y, z - fz * 0.05); add(black, back);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.58), tvMat);
    scr.position.set(x, y, z); scr.rotation.y = r; group.add(scr);
    if (Math.abs(x) < 1) { box(black, x - 0.02, y + 0.33, z - 0.02, x + 0.02, H, z + 0.02); }
  }

  // ---- Banderas argentinas colgadas ----
  const flagMat = new THREE.MeshLambertMaterial({ map: tx(texFlag()), side: THREE.DoubleSide });
  const flags = [];
  for (const [x, z] of [[-9.6, 12.2], [9.6, 12.2], [-9.6, 19.9], [9.6, 19.9], [0, 17.0], [0, 25.4], [-9.6, 28.6], [9.6, 28.6]]) {
    const f = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.7, 1, 4), flagMat);
    f.position.set(x, H - 0.95, z);
    f.rotation.y = Math.PI / 2 * (rng.next() < 0.5 ? 1 : 0) + (rng.next() - 0.5) * 0.2;
    group.add(f); flags.push(f);
  }

  // ---- Cuadros de jugadores (sala de pool) y fotos del salón ----
  const posterMats = [0, 1, 2, 3].map((i) => lam({ map: tx(texPoster(rng, i)) }));
  const posterAt = (x, z, r, i, w = 0.9, h = 1.35) => {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), posterMats[i % 4]);
    p.position.set(x, 2.15, z); p.rotation.y = r; group.add(p);
  };
  let pi = 0;
  for (const z of [12.0, 17.0, 23.0, 28.5]) { posterAt(-11.98, z, Math.PI / 2, pi++); posterAt(11.98, z, -Math.PI / 2, pi++); }
  for (const x of [-9, -5, 6, 9]) posterAt(x, 31.98, Math.PI, pi++);
  const frameMats = [0, 1, 2, 3, 4].map((i) => lam({ map: tx(texFrame(rng, i)) }));
  for (let i = 0; i < 14; i++) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.52), frameMats[i % 5]);
    const x = -11 + (i % 7) * 1.4 + (i < 7 ? 0 : 0.5);
    if (x > -5.2 && x < 5.2) continue;
    p.position.set(x, 1.7 + (i < 7 ? 0.65 : 0), 9.68); p.rotation.y = Math.PI; group.add(p);
  }
  for (let i = 0; i < 6; i++) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.52), frameMats[(i + 2) % 5]);
    p.position.set(-11.98, 1.9 + (i % 2) * 0.62, 1.2 + Math.floor(i / 2) * 1.0); p.rotation.y = Math.PI / 2; group.add(p);
  }

  // ---- Neones ----
  const neonMat = (c) => new THREE.MeshBasicMaterial({ map: tx(c), transparent: true, depthWrite: false, toneMapped: false, fog: false });
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.9), neonMat(texNeonDraw()));
  logo.position.set(0, 3.2, 10.05); group.add(logo);
  const logo2 = logo.clone(); logo2.position.set(-9.0, 2.75, 9.66); logo2.rotation.y = Math.PI; group.add(logo2);
  const wcM = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.63), neonMat(texNeonWC(false)));
  wcM.position.set(-2.9, 2.55, 31.95); wcM.rotation.y = Math.PI; group.add(wcM);
  const wcW = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.63), neonMat(texNeonWC(true)));
  wcW.position.set(2.9, 2.55, 31.95); wcW.rotation.y = Math.PI; group.add(wcW);

  // ---- Juntar geometrías por material ----
  for (const [mat, geos] of parts) {
    const geo = mergeGeometries(geos.map((g) => (g.index ? g.toNonIndexed() : g)), false);
    for (const g of geos) g.dispose();
    const mesh = new THREE.Mesh(geo, mat);
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    group.add(mesh);
  }

  // colisiones en coordenadas del mundo
  for (const [x0, z0, x1, z1, y0, y1, tag] of cols) game.colliders.addBox(ox + x0, ox + x1, oz + z0, oz + z1, oy + y0, oy + y1, tag);

  // luces (se suman a la escena solo adentro)
  const lights = [];
  const pl = (c, i, d, x, y, z) => { const l = new THREE.PointLight(c, i, d, 2); l.position.set(x, y, z); lights.push(l); group.add(l); return l; };
  pl(0xfff0d8, 9, 14, -5.6, 2.3, 15.7);
  pl(0xfff0d8, 9, 14, 5.6, 2.3, 15.7);
  pl(0xfff0d8, 9, 14, -5.6, 2.3, 24.1);
  pl(0xfff0d8, 9, 14, 5.6, 2.3, 24.1);
  pl(0xffa050, 7, 13, -2.0, 2.6, 4.8);
  const stageLight = pl(0xff40c0, 6, 9, 8.6, 2.8, 7.0);

  // ventanales: el vidrio sigue la hora del día
  const day = new THREE.Color(0xbfe0ff), night = new THREE.Color(0x0c1830), dusk = new THREE.Color(0xf0a060);
  let t = 0;
  function update(dt, env) {
    t += dt;
    const d = env ? env.dayLight : 1;
    glassMat.color.copy(night).lerp(d > 0.6 ? day : dusk, Math.min(1, d * 1.4));
    if (d > 0.6) glassMat.color.lerp(day, (d - 0.6) * 2.5);
    // banderas: se mueven un poco con el aire del ventilador
    for (let i = 0; i < flags.length; i++) flags[i].rotation.z = Math.sin(t * 0.9 + i) * 0.025;
    // luz del escenario que cambia de color
    stageLight.color.setHSL((t * 0.07) % 1, 0.85, 0.6);
  }

  return {
    group, lights, update, stools, chairs, cardSeats, STAGE, CT,
    // lugares de la gente
    spawn: { x: -10.5, z: 4.6, rot: 0 },
    exitRing: { x: -10.5, z: 3.4 },
    bar: { x: -8.4, z: 7.2, staff: { x: -10.6, z: 7.2, rot: Math.PI / 2 } },
    charly: { x: 9.0, z: 7.6, y: STAGE.h, rot: -Math.PI / 2 },
  };
}
