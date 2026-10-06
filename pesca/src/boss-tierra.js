'use strict';
// Jefes de tierra del Nivel 2 (Isla Arsenal): Don Gorila, La Reina Escorpión y Draco.
// Duermen en su guarida; si te acercás se despiertan y pelean con ataques telegrafiados (zonas rojas), igual que los del mar.
// Si te alejás demasiado o te desmayás, vuelven a su guarida y se curan. Al vencerlos sueltan plata, munición y, a veces, un arma.

const REAPARECE_TIERRA = 270;
const PREF_TIERRA = { gorila: 6.5, escorpion: 8, draco: 15 };

function malla(partes, mat) { const m = new THREE.Mesh(unir(partes), mat); m.castShadow = true; m.receiveShadow = true; return m; }
function pivote(padre, x, y, z) { const g = new THREE.Group(); g.position.set(x, y, z); padre.add(g); return g; }
const mbasic = (c) => new THREE.MeshBasicMaterial({ color: c, fog: false });

// ---------------------------------------------------------------------------
// Modelos (miran hacia +x; z es el costado)
// ---------------------------------------------------------------------------
function modeloGorila() {
  const mat = MAT.vc.clone(), g = new THREE.Group();
  const pelo = '#5b4a3b', osc = '#463a30', plata = '#9aa0a8', piel = '#2f2722', cara = '#3b312a';
  g.add(malla([esf(1.35, pelo, 0.1, 2.75, 0, 1.0, 1.1, 1.1, 1), esf(1.1, '#6d5a46', 0.45, 2.55, 0, 0.9, 1.0, 0.95, 1), esf(1.0, osc, -0.55, 2.0, 0, 1, 0.9, 1, 1), esf(0.85, plata, -0.7, 3.25, 0, 1.25, 0.55, 1.05, 1), esf(0.62, pelo, 0.15, 3.65, 0.98, 1, 1, 1, 1), esf(0.62, pelo, 0.15, 3.65, -0.98, 1, 1, 1, 1)], mat));
  const cab = pivote(g, 1.05, 4.0, 0);
  cab.add(malla([esf(0.62, cara, 0, 0, 0, 1.05, 1, 0.95, 1), esf(0.48, '#6a5646', 0.45, -0.18, 0, 1.1, 0.8, 0.9, 1), caja(0.9, 0.16, 1.1, osc, 0.25, 0.28, 0), cono(0.4, 0.6, osc, -0.1, 0.62, 0, 6), esf(0.12, '#ffffff', 0.5, 0.12, 0.28, 1, 1, 1, 0), esf(0.12, '#ffffff', 0.5, 0.12, -0.28, 1, 1, 1, 0), esf(0.06, '#10151c', 0.59, 0.12, 0.28, 1, 1, 1, 0), esf(0.06, '#10151c', 0.59, 0.12, -0.28, 1, 1, 1, 0), esf(0.1, '#10151c', 0.9, 0.02, 0.15, 1, 1, 1, 0), esf(0.1, '#10151c', 0.9, 0.02, -0.15, 1, 1, 1, 0)], mat));
  const mand = pivote(cab, 0.3, -0.38, 0);
  mand.add(malla([esf(0.4, '#4a3b32', 0.2, 0, 0, 1.2, 0.55, 0.9, 1), esf(0.1, '#f2ead2', 0.55, 0.12, 0.18, 1, 1, 1, 0), esf(0.1, '#f2ead2', 0.55, 0.12, -0.18, 1, 1, 1, 0)], mat));
  const brazo = (sz) => {
    const b = pivote(g, 0.15, 3.65, sz * 1.15);
    b.add(malla([cilEntre({ x: 0, y: 0, z: 0 }, { x: 0.3, y: -1.35, z: sz * 0.2 }, 0.5, 0.42, pelo, 7), cilEntre({ x: 0.3, y: -1.35, z: sz * 0.2 }, { x: 0.6, y: -2.55, z: sz * 0.1 }, 0.42, 0.34, osc, 7), esf(0.52, piel, 0.62, -2.75, sz * 0.1, 1, 1.05, 1, 1)], mat));
    return b;
  };
  const bI = brazo(-1), bD = brazo(1);
  const pierna = (sz) => { const p = pivote(g, 0, 1.55, sz * 0.62); p.add(malla([cilEntre({ x: 0, y: 0, z: 0 }, { x: 0.1, y: -0.85, z: 0 }, 0.5, 0.36, osc, 7), esf(0.45, piel, 0.3, -1.45, 0, 1.5, 0.45, 0.9, 1)], mat)); return p; };
  const pI = pierna(-1), pD = pierna(1);
  const mod = { grupo: g, mat, tierra: true };
  mod.animar = (dt, v, t, fase, b) => {
    const k = clamp(v / 6, 0, 1.4), w = t * (4 + k * 4) + fase;
    pI.rotation.z = Math.sin(w) * 0.55 * k; pD.rotation.z = -pI.rotation.z;
    const alza = b ? b.alza : 0, ab = b ? b.abierto : 0;
    const pecho = b && b.estado === 'dormido' ? 0 : Math.sin(t * 2.4 + fase) * 0.06;
    bI.rotation.z = -Math.sin(w) * 0.45 * k - 2.7 * alza + pecho; bD.rotation.z = Math.sin(w) * 0.45 * k - 2.7 * alza - pecho;
    bI.rotation.x = bD.rotation.x = 0;
    if (alza > 0.5) { bI.rotation.x = 0.35 * Math.sin(t * 22); bD.rotation.x = -0.35 * Math.sin(t * 22); } // golpea el pecho
    cab.rotation.z = 0.5 * ab + (b && b.estado === 'dormido' ? -0.35 : 0);
    mand.rotation.z = -0.85 * ab;
    g.children[0].rotation.z = Math.sin(w * 2) * 0.03 * k - (b && b.estado === 'dormido' ? 0.18 : 0);
  };
  return mod;
}

function modeloEscorpion() {
  const mat = MAT.vc.clone(), g = new THREE.Group();
  const c1 = '#c28a3a', c2 = '#8a5a1e', c3 = '#e0b45a', osc = '#4a3015';
  const cuerpo = [esf(1.45, c1, 1.2, 1.05, 0, 1.45, 0.55, 1.15, 1), esf(0.26, '#10151c', 2.35, 1.45, 0.45, 1, 1, 1, 0), esf(0.26, '#10151c', 2.35, 1.45, -0.45, 1, 1, 1, 0), esf(0.16, '#10151c', 2.5, 1.35, 0.15, 1, 1, 1, 0), esf(0.16, '#10151c', 2.5, 1.35, -0.15, 1, 1, 1, 0)];
  for (let i = 0; i < 5; i++) cuerpo.push(esf(1.15 - i * 0.12, i % 2 ? c2 : c1, -0.5 - i * 0.85, 0.95, 0, 0.95, 0.5, 1 - i * 0.06, 1), caja(0.25, 0.1, 1.1 - i * 0.1, c3, -0.5 - i * 0.85, 1.35 - i * 0.04, 0));
  g.add(malla(cuerpo, mat));
  // cola con aguijón
  const cola = pivote(g, -4.7, 1.0, 0), segs = [];
  let prev = { x: 0, y: 0, z: 0 };
  const pts = [];
  for (let i = 1; i <= 6; i++) { const u = i / 6; pts.push({ x: 2.7 * u * u - 0.3 * u, y: 3.9 * Math.sin(u * Math.PI * 0.52), z: 0, r: 0.5 - 0.05 * i }); }
  const colaP = [];
  pts.forEach((p, i) => { colaP.push(cilEntre(prev, p, 0.5 - 0.05 * i, p.r, i % 2 ? c2 : c1, 7), esf(p.r * 1.1, c1, p.x, p.y, p.z, 1, 1, 1, 1)); prev = p; });
  colaP.push(cono(0.3, 1.1, '#2a1a08', prev.x + 0.55, prev.y - 0.2, 0, 6, 0, 0, -Math.PI / 2 - 0.5));
  cola.add(malla(colaP, mat));
  // pinzas
  const pinza = (sz) => {
    const brazo = pivote(g, 2.0, 1.0, sz * 1.0);
    brazo.add(malla([cilEntre({ x: 0, y: 0, z: 0 }, { x: 1.0, y: -0.1, z: sz * 0.7 }, 0.34, 0.3, c2, 7), esf(0.6, c1, 2.0, -0.1, sz * 1.0, 1.7, 0.5, 0.9, 1), cono(0.22, 0.9, osc, 2.9, -0.1, sz * 0.75, 5, 0, 0, -Math.PI / 2)], mat));
    const dedo = pivote(brazo, 2.0, -0.1, sz * 1.0);
    dedo.add(malla([cono(0.2, 1.0, '#2a1a08', 0.95, 0.0, -sz * 0.18, 5, 0, 0, -Math.PI / 2)], mat));
    return { brazo, dedo, sz };
  };
  const pzI = pinza(-1), pzD = pinza(1);
  const patas = [];
  for (let sz of [-1, 1]) for (let i = 0; i < 4; i++) {
    const p = pivote(g, 0.9 - i * 0.75, 0.85, sz * 0.8);
    p.add(malla([cilEntre({ x: 0, y: 0, z: 0 }, { x: i * 0.1 - 0.15, y: 0.5, z: sz * 0.9 }, 0.12, 0.1, c2, 5), cilEntre({ x: i * 0.1 - 0.15, y: 0.5, z: sz * 0.9 }, { x: i * 0.25 - 0.3, y: -0.8, z: sz * 1.7 }, 0.1, 0.06, osc, 5)], mat));
    patas.push({ p, i, sz });
  }
  const mod = { grupo: g, mat, tierra: true };
  mod.animar = (dt, v, t, fase, b) => {
    const k = clamp(v / 8, 0, 1.4), w = t * (6 + k * 6) + fase;
    patas.forEach(({ p, i, sz }) => { p.rotation.y = Math.sin(w + i * 1.6 + (sz > 0 ? Math.PI : 0)) * 0.35 * (0.2 + k); });
    cola.rotation.z = Math.sin(t * 1.8 + fase) * 0.05 + (b ? (b.alza || 0) * 0.55 : 0);
    cola.rotation.y = Math.sin(t * 1.1 + fase) * 0.08;
    const ab = b ? b.abierto : 0;
    pzI.brazo.rotation.y = 0.15 + ab * 0.5 + Math.sin(t * 2 + fase) * 0.05; pzD.brazo.rotation.y = -0.15 - ab * 0.5 - Math.sin(t * 2 + fase) * 0.05;
    pzI.dedo.rotation.y = ab * 0.7; pzD.dedo.rotation.y = -ab * 0.7;
    pzI.brazo.rotation.z = pzD.brazo.rotation.z = (b ? (b.alza || 0) : 0) * 0.5;
  };
  return mod;
}

function modeloDragon() {
  const mat = MAT.vc.clone(), g = new THREE.Group();
  const rojo = '#a8322a', osc = '#6e1f1b', vientre = '#e8b04a', marfil = '#e9dfc4';
  const dobleMat = MAT.vcDoble.clone();
  const cuerpo = [esf(2.2, rojo, 0, 3.0, 0, 2.6, 1.5, 1.4, 1), esf(1.7, vientre, 0.3, 2.45, 0, 2.3, 1.0, 1.0, 1), esf(1.3, osc, 2.2, 3.5, 0, 1.4, 1.2, 1.1, 1)];
  for (let i = 0; i < 9; i++) cuerpo.push(cono(0.34 + (i % 2) * 0.1, 0.9, osc, -3.2 + i * 0.75, 4.35 - Math.abs(i - 4) * 0.12, 0, 5));
  g.add(malla(cuerpo, mat));
  // cuello y cabeza
  const cuello = [];
  let pv = { x: 2.6, y: 3.6, z: 0 };
  for (let i = 1; i <= 4; i++) { const p = { x: 2.6 + i * 0.55, y: 3.6 + i * 0.5, z: 0 }; cuello.push(cilEntre(pv, p, 0.8 - i * 0.07, 0.8 - (i + 1) * 0.07, i % 2 ? rojo : osc, 7), esf(0.78 - i * 0.07, vientre, p.x - 0.1, p.y - 0.15, 0, 1, 0.85, 0.8, 1)); pv = p; }
  g.add(malla(cuello, mat));
  const cab = pivote(g, 5.0, 5.8, 0);
  cab.add(malla([esf(0.95, rojo, 0, 0, 0, 1.45, 0.8, 0.9, 1), esf(0.6, osc, 1.25, -0.12, 0, 1.5, 0.55, 0.8, 1), cono(0.28, 1.3, marfil, -0.5, 0.75, 0.55, 5, 0, 0, 2.2), cono(0.28, 1.3, marfil, -0.5, 0.75, -0.55, 5, 0, 0, 2.2), esf(0.11, '#10151c', 2.0, 0.05, 0.22, 1, 1, 1, 0), esf(0.11, '#10151c', 2.0, 0.05, -0.22, 1, 1, 1, 0)], mat));
  const ojo = new THREE.Mesh(unir([esf(0.16, '#ffe14a', 0.6, 0.3, 0.62, 1, 1, 1, 1), esf(0.16, '#ffe14a', 0.6, 0.3, -0.62, 1, 1, 1, 1)]), mbasic('#ffe14a'));
  cab.add(ojo);
  const mand = pivote(cab, 0.5, -0.35, 0);
  mand.add(malla([esf(0.55, osc, 0.7, 0, 0, 1.6, 0.4, 0.75, 1), cono(0.1, 0.34, marfil, 1.4, 0.2, 0.25, 4), cono(0.1, 0.34, marfil, 1.4, 0.2, -0.25, 4), cono(0.1, 0.34, marfil, 0.8, 0.2, 0.3, 4), cono(0.1, 0.34, marfil, 0.8, 0.2, -0.3, 4)], mat));
  const fuegoBoca = new THREE.Mesh(new THREE.SphereGeometry(0.6, 10, 8), new THREE.MeshBasicMaterial({ color: '#ff8a1e', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  fuegoBoca.position.set(2.1, -0.1, 0);
  cab.add(fuegoBoca);
  // alas
  const ala = (sz) => {
    const a = pivote(g, 0.2, 4.4, sz * 1.4);
    const hueso = [cilEntre({ x: 0, y: 0, z: 0 }, { x: -0.5, y: 0.7, z: sz * 3.2 }, 0.2, 0.15, osc, 5), cilEntre({ x: -0.5, y: 0.7, z: sz * 3.2 }, { x: -1.8, y: 0.4, z: sz * 6.4 }, 0.15, 0.1, osc, 5)];
    for (const [fx, fz] of [[-4.4, 6.6], [-5.4, 4.5], [-5.1, 2.3]]) hueso.push(cilEntre({ x: -1.8, y: 0.4, z: sz * 6.4 }, { x: fx, y: 0, z: sz * fz }, 0.09, 0.05, osc, 4));
    a.add(malla(hueso, mat));
    const P2 = [[0.2, 0, 0], [-0.5, 0.7, 3.2], [-1.8, 0.4, 6.4], [-4.4, 0, 6.6], [-5.4, 0, 4.5], [-5.1, 0, 2.3], [-3.2, 0, 0.3]];
    const pos = [], col = [], c = new THREE.Color('#c9482f'), c2 = new THREE.Color('#e07a3a');
    const cen = [-2.6, 0.2, 3.0];
    for (let i = 0; i < P2.length; i++) {
      const p0 = P2[i], p1 = P2[(i + 1) % P2.length];
      const v = [[p0[0], p0[1], sz * p0[2]], [p1[0], p1[1], sz * p1[2]], [cen[0], cen[1], sz * cen[2]]];
      if (sz < 0) v.reverse();
      for (const q of v) pos.push(...q);
      col.push(c.r, c.g, c.b, c.r, c.g, c.b, c2.r, c2.g, c2.b);
    }
    const mem = new THREE.Mesh(triangulos(pos, col), dobleMat);
    mem.castShadow = true;
    a.add(mem);
    return a;
  };
  const aI = ala(-1), aD = ala(1);
  // patas y cola
  const pata = (x, sz) => { const p = pivote(g, x, 2.3, sz * 1.2); p.add(malla([cilEntre({ x: 0, y: 0, z: 0 }, { x: 0.2, y: -1.2, z: sz * 0.2 }, 0.6, 0.4, rojo, 7), esf(0.5, osc, 0.5, -1.9, sz * 0.2, 1.5, 0.4, 1, 1), cono(0.12, 0.4, marfil, 1.0, -1.9, sz * 0.2, 4, 0, 0, -Math.PI / 2), cono(0.12, 0.4, marfil, 1.0, -1.9, sz * 0.5, 4, 0, 0, -Math.PI / 2)], mat)); return p; };
  const pa = [pata(1.6, -1), pata(1.6, 1), pata(-1.6, -1), pata(-1.6, 1)];
  const cola = pivote(g, -3.6, 2.6, 0);
  let pc = { x: 0, y: 0, z: 0 };
  const colaP = [];
  for (let i = 1; i <= 7; i++) { const u = i / 7, p = { x: -u * 4.6, y: -u * 1.2 + Math.sin(u * 3) * 0.3, z: 0 }, r = 0.95 - 0.1 * i; colaP.push(cilEntre(pc, p, r + 0.08, r, i % 2 ? rojo : osc, 6)); pc = p; }
  colaP.push(cono(0.5, 1.4, marfil, pc.x - 0.9, pc.y, 0, 4, 0, 0, Math.PI / 2), cono(0.3, 0.8, osc, pc.x - 0.2, pc.y + 0.5, 0, 4, 0, 0, 2.0));
  cola.add(malla(colaP, mat));
  const mod = { grupo: g, mat, tierra: true, dobleMat };
  mod.animar = (dt, v, t, fase, b) => {
    const k = clamp(v / 7, 0, 1.4), w = t * (3 + k * 3) + fase;
    pa[0].rotation.z = Math.sin(w) * 0.35 * k; pa[3].rotation.z = pa[0].rotation.z; pa[1].rotation.z = pa[2].rotation.z = -pa[0].rotation.z;
    const aire = b ? clamp(b.aire / 8, 0, 1) : 0, ab = b ? b.abierto : 0;
    const aleteo = Math.sin(t * (aire > 0.05 ? 9 : 1.6) + fase) * (aire > 0.05 ? 0.7 : 0.1);
    aI.rotation.x = aleteo + 0.1 + (b && b.estado === 'dormido' ? 0.6 : 0); aD.rotation.x = -aleteo - 0.1 - (b && b.estado === 'dormido' ? 0.6 : 0);
    cola.rotation.y = Math.sin(t * 1.4 + fase) * 0.3;
    cab.rotation.z = 0.35 * ab + (b && b.estado === 'dormido' ? -0.5 : 0);
    mand.rotation.z = -0.6 * ab;
    fuegoBoca.material.opacity = ab > 0.6 ? 0.55 + 0.3 * Math.sin(t * 30) : 0;
    fuegoBoca.scale.setScalar(1 + ab * 0.8);
  };
  return mod;
}

function crearModeloTierra(def) {
  if (def.forma === 'gorila') return modeloGorila();
  if (def.forma === 'escorpion') return modeloEscorpion();
  return modeloDragon();
}

// ---------------------------------------------------------------------------
// Creación y estados
// ---------------------------------------------------------------------------
function crearJefeTierra(def) {
  const l = def.lair;
  if (!l) return null;
  const mod = crearModeloTierra(def);
  mod.grupo.visible = false;
  ESC.escena.add(mod.grupo);
  const b = {
    def, mod, tierra: true, estado: 'dormido', x: l.x, z: l.z, ang: Math.atan2(l.z - (ARSENAL.is ? ARSENAL.is.z : 0), l.x - (ARSENAL.is ? ARSENAL.is.x : 0)) + Math.PI,
    vel: 0, hp: def.hp, hpMax: def.hp, t: rand(100), fase0: rand(TAU), respawn: 0, fase: 0, aturdido: 0, cd: 0, atk: null, flash: 0, alza: 0, abierto: 0,
    oculto: false, aire: 0, y: alturaSuelo(l.x, l.z), muerteT: 0, hooked: false, haulando: false, emerge: 1,
  };
  BOSSES.push(b);
  return b;
}

function jefeTierraHpMax(def) { return Math.round(def.hp * (1 + 0.2 * Math.min(5, jefeKills(def.id)))); }
function reiniciarJefeTierra(b) {
  if (b.estado === 'muerto' || b.estado === 'muriendo') return;
  b.estado = 'reinicio'; b.atk = null; b.aturdido = 0; b.alza = 0; b.abierto = 0; b.oculto = false; b.aire = 0;
  limpiarPeligros();
}
function actualizarJefeTierra(b, dt) {
  const d = b.def, l = d.lair;
  b.t += dt;
  b.flash = Math.max(0, b.flash - dt * 4);
  switch (b.estado) {
    case 'dormido': {
      b.vel = 0;
      const dj = Math.hypot(P.pos.x - b.x, P.pos.z - b.z);
      if (J.modo === 'jugando' && dj < d.aggro && Math.abs(P.pos.y - b.y) < (d.id === 'draco' ? 11 : 16)) despertarJefeTierra(b);
      else if (dj < d.aggro * 2.2 && !(G.jefes[d.id] && G.jefes[d.id].visto)) { /* todavía no lo viste */ }
      break;
    }
    case 'pelea': iaJefeTierra(b, dt); break;
    case 'reinicio': {
      const dd = Math.hypot(l.x - b.x, l.z - b.z);
      b.hp = Math.min(b.hpMax, b.hp + b.hpMax * 0.08 * dt);
      if (dd > 1.5) { b.ang = turnToward(b.ang, Math.atan2(l.z - b.z, l.x - b.x), dt * 3); avanzarTierra(b, b.ang, d.vel * 1.3, dt); b.vel = d.vel * 1.3; } else { b.vel = 0; if (b.hp >= b.hpMax - 1) { b.estado = 'dormido'; b.hp = b.hpMax; } }
      break;
    }
    case 'muriendo': muriendoJefeTierra(b, dt); break;
    case 'muerto':
      b.respawn -= dt;
      if (b.respawn <= 0) reaparecerJefeTierra(b);
      break;
    default:
  }
}
function despertarJefeTierra(b) {
  const d = b.def;
  b.estado = 'pelea'; b.cd = 2.0; b.fase = 0; b.aturdido = 0.6; b.atk = null;
  b.hp = Math.min(b.hp, b.hpMax) > 0 ? b.hp : b.hpMax;
  (G.jefes[d.id] = G.jefes[d.id] || { kills: 0 }).visto = true;
  sfx('rugido'); sacudir(22);
  musica('jefe');
  bannerJefe(d);
  toast(`¡${d.nombre} se despertó!`, '#ff9d8a');
}
function reaparecerJefeTierra(b) {
  b.hpMax = jefeTierraHpMax(b.def); b.hp = b.hpMax;
  const l = b.def.lair;
  b.estado = 'dormido'; b.x = l.x; b.z = l.z; b.fase = 0; b.aturdido = 0; b.atk = null; b.alza = 0; b.abierto = 0; b.aire = 0; b.oculto = false; b.muerteT = 0;
  b.y = alturaSuelo(l.x, l.z);
  if (G.jefes[b.def.id] && G.jefes[b.def.id].kills > 0) toast(`${b.def.nombre} volvió a su guarida, más fuerte.`, '#ffb3a8');
}
function avanzarTierra(b, ang, v, dt) {
  const l = b.def.lair, nx = b.x + Math.cos(ang) * v * dt, nz = b.z + Math.sin(ang) * v * dt;
  if (H(nx, nz) > 0.5 && !enMuelle(nx, nz, 1) && Math.hypot(nx - l.x, nz - l.z) < b.def.suelta + 15) { b.x = nx; b.z = nz; return true; }
  return false;
}

// ---------------------------------------------------------------------------
// Inteligencia del combate
// ---------------------------------------------------------------------------
const ATAQUES_TIERRA = {
  gorila: [{ id: 'puno', w: 4, f: 0 }, { id: 'golpeSuelo', w: 3, f: 0 }, { id: 'salto', w: 3, f: 0 }, { id: 'embestidaT', w: 3, f: 0 }, { id: 'lluviaRocas', w: 3, f: 1 }, { id: 'rugidoG', w: 2, f: 1 }],
  escorpion: [{ id: 'tenazas', w: 4, f: 0 }, { id: 'aguijon', w: 3, f: 0 }, { id: 'excavar', w: 3, f: 0 }, { id: 'veneno', w: 3, f: 0 }, { id: 'estampida', w: 3, f: 1 }, { id: 'tormentaArena', w: 3, f: 1 }],
  draco: [{ id: 'aliento', w: 4, f: 0 }, { id: 'bolasFuego', w: 3, f: 0 }, { id: 'coletazo', w: 2, f: 0 }, { id: 'aterrizaje', w: 3, f: 0 }, { id: 'meteoros', w: 3, f: 1 }, { id: 'anillo', w: 3, f: 2 }, { id: 'alientoDoble', w: 3, f: 2 }],
};
function iaJefeTierra(b, dt) {
  const d = b.def, l = d.lair;
  b.aturdido = Math.max(0, b.aturdido - dt);
  const dj = Math.hypot(P.pos.x - b.x, P.pos.z - b.z);
  // se rinde si te alejás o te desmayás
  if (J.modo !== 'jugando' || dj > d.suelta || Math.hypot(P.pos.x - l.x, P.pos.z - l.z) > d.suelta + 30) { toast(`${d.nombre} perdió el interés y volvió a su guarida.`, '#ffe39a'); reiniciarJefeTierra(b); musica('isla'); return; }
  const k = b.hp / b.hpMax;
  const fase = d.id === 'draco' ? (k < 0.33 ? 2 : k < 0.66 ? 1 : 0) : (k < 0.5 ? 1 : 0);
  if (fase > b.fase) {
    b.fase = fase; b.atk = null; b.aturdido = 0; b.cd = 1.5; b.alza = 0; b.abierto = 1; b.oculto = false; b.aire = 0;
    toast(`¡${d.nombre} se enfurece! (fase ${fase + 1})`, '#ff8a7a');
    sfx('rugido'); sacudir(26);
    const c = d.id === 'draco' ? 16 : 10;
    peligroCirculo(b.x, b.z, c, 1.4, dmgJ(b, 0.7), { campo: true });
  }
  const haciaP = Math.atan2(P.pos.z - b.z, P.pos.x - b.x);
  const vel = d.vel * (1 + 0.15 * b.fase);
  b.abierto = Math.max(0, b.abierto - dt * 1.5);
  if (b.atk) {
    if (ATAQUES_T[b.atk.id].act(b, b.atk, dt)) {
      b.atk = null; b.aturdido = d.stun; b.alza = 0; b.abierto = 0; b.oculto = false;
      b.cd = rand(1.3, 2.2) * (1 - 0.14 * b.fase); b.vel = 0;
    }
  } else if (b.aturdido > 0) { b.vel = 0; b.ang = turnToward(b.ang, haciaP, dt * 0.8); b.alza = Math.max(0, b.alza - dt * 3); } else {
    const pref = PREF_TIERRA[d.id] || 8;
    b.ang = turnToward(b.ang, haciaP, dt * 3.2);
    if (dj > pref + 1) { if (avanzarTierra(b, haciaP, vel, dt)) b.vel = vel; else b.vel = 0; } else if (dj < pref * 0.55) { avanzarTierra(b, haciaP + Math.PI, vel * 0.5, dt); b.vel = vel * 0.5; } else b.vel = 0;
    b.cd -= dt;
    if (b.cd <= 0 && dj < pref * 2.4 + d.radio) comenzarAtaqueTierra(b);
  }
}
function comenzarAtaqueTierra(b) {
  const lista = ATAQUES_TIERRA[b.def.id].filter((a) => a.f <= b.fase);
  const a = wpick(lista, (x) => x.w);
  b.atk = { id: a.id, t: 0, fase: 0 };
  ATAQUES_T[a.id].ini(b, b.atk);
}

// Ataques: ini() arma los avisos; act() devuelve true cuando termina
const ATAQUES_T = {
  // ---- Don Gorila
  puno: { ini(b) { peligroCirculo(P.pos.x, P.pos.z, 4.6, 0.95, dmgJ(b)); b.alza = 1; }, act(b, a, dt) { mirar(b, dt, 5); b.alza = a.t < 0.95 ? 1 : Math.max(0, 1 - (a.t - 0.95) * 6); if (a.t >= 0.95 && !a.golpe) { a.golpe = true; sacudir(14); sfx('golpeG'); } return a.t >= 1.25; } },
  golpeSuelo: { ini(b) { peligroCirculo(b.x, b.z, 11, 1.2, dmgJ(b, 1.05)); b.alza = 1; }, act(b, a, dt) { b.alza = a.t < 1.2 ? 1 : Math.max(0, 1 - (a.t - 1.2) * 5); if (a.t >= 1.2 && !a.golpe) { a.golpe = true; sacudir(20); sfx('tierra'); for (let i = 0; i < 12; i++) polvo(b.x + rand(-5, 5), alturaSuelo(b.x, b.z), b.z + rand(-5, 5)); } return a.t >= 1.5; } },
  salto: {
    ini(b, a) { a.tx = P.pos.x; a.tz = P.pos.z; a.x0 = b.x; a.z0 = b.z; peligroCirculo(a.tx, a.tz, 8, 1.35, dmgJ(b, 1.1)); b.alza = 0.7; },
    act(b, a, dt) {
      const k = clamp((a.t - 0.35) / 0.95, 0, 1);
      if (k > 0) { b.x = lerp(a.x0, a.tx, k); b.z = lerp(a.z0, a.tz, k); b.aire = Math.sin(k * Math.PI) * 5.5; b.ang = turnToward(b.ang, Math.atan2(a.tz - a.z0, a.tx - a.x0), dt * 6); }
      if (a.t >= 1.35 && !a.golpe) { a.golpe = true; b.aire = 0; sacudir(22); sfx('tierra'); for (let i = 0; i < 12; i++) polvo(b.x + rand(-4, 4), alturaSuelo(b.x, b.z), b.z + rand(-4, 4)); }
      return a.t >= 1.6;
    },
  },
  embestidaT: { ini(b, a) { prepararEmbestidaT(b, a, 0.9); }, act(b, a, dt) { return actuarEmbestidaT(b, a, dt); } },
  lluviaRocas: {
    ini(b, a) { a.n = 7; a.i = 0; },
    act(b, a, dt) { mirar(b, dt, 3); b.alza = 0.6; if (a.i < a.n && a.t >= a.i * 0.2) { const q = a.i % 3 === 0 ? { x: P.pos.x, z: P.pos.z } : alrededor(P.pos.x, P.pos.z, 11); peligroCirculo(q.x, q.z, 3.3, 0.95, dmgJ(b, 0.7)); a.i++; } return a.t >= a.n * 0.2 + 1.1; },
  },
  rugidoG: { ini(b) { peligroCirculo(b.x, b.z, 16, 1.6, dmgJ(b, 0.9), { campo: true }); b.abierto = 1; sfx('rugido'); }, act(b, a, dt) { b.abierto = 1; mirar(b, dt, 1); return a.t >= 1.9; } },
  // ---- La Reina Escorpión
  tenazas: { ini(b) { peligroCirculo(P.pos.x, P.pos.z, 4.2, 0.8, dmgJ(b, 0.9)); b.abierto = 1; b.alza = 0.6; }, act(b, a, dt) { mirar(b, dt, 5); if (a.t > 0.45 && !a.seg) { a.seg = true; peligroCirculo(P.pos.x, P.pos.z, 4.2, 0.85, dmgJ(b, 0.9)); } b.abierto = a.t < 1.3 ? 1 : 0; return a.t >= 1.45; } },
  aguijon: { ini(b, a) { a.ang = haciaJ(b); lineaDesde(b, a.ang, 22, 3.6, 0.85, dmgJ(b, 1.1)); b.alza = 1; }, act(b, a, dt) { b.ang = turnToward(b.ang, a.ang, dt * 6); b.alza = a.t < 0.85 ? 1 : 0; if (a.t >= 0.85 && !a.golpe) { a.golpe = true; sfx('aguijon'); sacudir(10); } return a.t >= 1.15; } },
  excavar: {
    ini(b, a) { a.tx = P.pos.x; a.tz = P.pos.z; peligroCirculo(a.tx, a.tz, 6.8, 1.55, dmgJ(b, 1.15)); a.hundido = false; },
    act(b, a, dt) {
      if (a.t > 0.25 && !a.hundido) { a.hundido = true; b.oculto = true; sfx('tierra'); for (let i = 0; i < 10; i++) polvo(b.x + rand(-2, 2), alturaSuelo(b.x, b.z), b.z + rand(-2, 2)); }
      if (b.oculto && a.t < 1.5) { const k = (a.t - 0.25) / 1.25; b.x = lerp(b.x, a.tx, Math.min(1, dt * 3)); b.z = lerp(b.z, a.tz, Math.min(1, dt * 3)); if (Math.random() < dt * 14) polvo(b.x + rand(-1, 1), alturaSuelo(b.x, b.z), b.z + rand(-1, 1)); void k; }
      if (a.t >= 1.55 && b.oculto) { b.oculto = false; b.x = a.tx; b.z = a.tz; sacudir(18); sfx('tierra'); for (let i = 0; i < 14; i++) polvo(b.x + rand(-3, 3), alturaSuelo(b.x, b.z), b.z + rand(-3, 3)); b.aturdido = 0; }
      return a.t >= 1.75;
    },
  },
  veneno: {
    ini(b, a) { a.n = 3; a.i = 0; },
    act(b, a, dt) { mirar(b, dt, 4); b.alza = 0.8; if (a.i < a.n && a.t >= 0.3 + a.i * 0.3) { const q = a.i === 0 ? { x: P.pos.x, z: P.pos.z } : alrededor(P.pos.x, P.pos.z, 8); peligroCirculo(q.x, q.z, 4.2, 0.9, Math.round(dmgJ(b, 0.25)), { efecto: 'veneno', dur: 7 }); a.i++; } return a.t >= 1.8; },
  },
  estampida: {
    ini(b, a) { a.ang = haciaJ(b); for (const o of [-0.38, 0, 0.38]) lineaDesde(b, a.ang + o, 24, 3.4, 1.0, dmgJ(b, 0.95)); b.alza = 1; },
    act(b, a, dt) { b.ang = turnToward(b.ang, a.ang, dt * 4); b.alza = a.t < 1.0 ? 1 : 0; return a.t >= 1.3; },
  },
  tormentaArena: {
    ini(b, a) { a.n = 7; a.i = 0; },
    act(b, a, dt) { mirar(b, dt, 3); b.alza = 0.7; if (a.i < a.n && a.t >= a.i * 0.18) { const q = a.i % 3 === 0 ? { x: P.pos.x, z: P.pos.z } : alrededor(P.pos.x, P.pos.z, 10); peligroCirculo(q.x, q.z, 3.5, 0.9, dmgJ(b, 0.7)); a.i++; } return a.t >= a.n * 0.18 + 1.05; },
  },
  // ---- Draco
  aliento: {
    ini(b, a) { a.ang = haciaJ(b); a.n = 3; a.i = 0; b.abierto = 1; sfx('fuego'); },
    act(b, a, dt) {
      b.abierto = 1;
      if (a.t < 0.5) b.ang = turnToward(b.ang, haciaJ(b), dt * 4);
      if (a.i < a.n && a.t >= 0.15 + a.i * 0.35) { const o = (a.i - 1) * 0.36; lineaDesde(b, haciaJ(b) + o, 40, 5.4, 1.0, dmgJ(b, 0.9)); a.i++; }
      return a.t >= 0.15 + a.n * 0.35 + 1.0;
    },
  },
  alientoDoble: {
    ini(b, a) { a.n = 5; a.i = 0; b.abierto = 1; sfx('fuego'); },
    act(b, a, dt) { b.abierto = 1; if (a.t < 0.4) b.ang = turnToward(b.ang, haciaJ(b), dt * 4); if (a.i < a.n && a.t >= 0.15 + a.i * 0.28) { const o = (a.i - 2) * 0.34; lineaDesde(b, haciaJ(b) + o, 42, 5.4, 0.95, dmgJ(b, 0.8)); a.i++; } return a.t >= 0.15 + a.n * 0.28 + 1.0; },
  },
  bolasFuego: {
    ini(b, a) { a.n = 3; a.i = 0; b.abierto = 1; },
    act(b, a, dt) { mirar(b, dt, 3); b.abierto = a.t < 0.9 ? 1 : 0; if (a.i < a.n && a.t >= a.i * 0.32) { const q = a.i === 0 ? { x: P.pos.x, z: P.pos.z } : alrededor(P.pos.x, P.pos.z, 9); peligroCirculo(q.x, q.z, 4.6, 0.95, dmgJ(b, 0.7), { efecto: 'fuego', dur: 3.5, impacto: true }); a.i++; } return a.t >= a.n * 0.32 + 1.15; },
  },
  coletazo: { ini(b) { peligroCirculo(b.x, b.z, 12, 0.95, dmgJ(b, 0.85)); }, act(b, a, dt) { b.ang += dt * (a.t < 0.95 ? 3 : 0); return a.t >= 1.2; } },
  aterrizaje: {
    ini(b, a) { a.tx = P.pos.x; a.tz = P.pos.z; a.x0 = b.x; a.z0 = b.z; peligroCirculo(a.tx, a.tz, 10.5, 1.9, dmgJ(b, 1.15)); sfx('fuego'); },
    act(b, a, dt) {
      const sube = clamp(a.t / 0.7, 0, 1), cae = clamp((a.t - 1.4) / 0.5, 0, 1);
      const k = clamp((a.t - 0.5) / 1.2, 0, 1);
      b.aire = a.t < 1.4 ? sube * 13 : 13 * (1 - cae);
      b.x = lerp(a.x0, a.tx, k); b.z = lerp(a.z0, a.tz, k);
      if (a.t >= 1.9 && !a.golpe) { a.golpe = true; b.aire = 0; sacudir(26); sfx('tierra'); for (let i = 0; i < 16; i++) polvo(b.x + rand(-6, 6), alturaSuelo(b.x, b.z), b.z + rand(-6, 6)); }
      return a.t >= 2.15;
    },
  },
  meteoros: {
    ini(b, a) { a.n = 9; a.i = 0; },
    act(b, a, dt) { mirar(b, dt, 2); b.abierto = 0.6; if (a.i < a.n && a.t >= a.i * 0.17) { const l = b.def.lair; const q = a.i % 3 === 0 ? { x: P.pos.x, z: P.pos.z } : a.i % 3 === 1 ? alrededor(P.pos.x, P.pos.z, 10) : alrededor(l.x, l.z, l.r * 1.4); peligroCirculo(q.x, q.z, 4.2, 0.95, dmgJ(b, 0.6), { impacto: true }); a.i++; } return a.t >= a.n * 0.17 + 1.15; },
  },
  anillo: {
    ini(b, a) { a.n = 10; a.i = 0; b.abierto = 1; sfx('fuego'); },
    act(b, a, dt) { b.abierto = 1; if (a.i < a.n && a.t >= a.i * 0.1) { const an = (a.i / a.n) * TAU; peligroCirculo(b.x + Math.cos(an) * 14, b.z + Math.sin(an) * 14, 4.4, 1.0, dmgJ(b, 0.65), { impacto: true }); a.i++; } return a.t >= a.n * 0.1 + 1.2; },
  },
};
function prepararEmbestidaT(b, a, delay) {
  const dx = P.pos.x - b.x, dz = P.pos.z - b.z, dd = Math.hypot(dx, dz) || 1;
  a.dir = Math.atan2(dz, dx); a.len = Math.min(34, dd + 10); a.delay = delay; a.dash = false; a.rec = 0;
  lineaDesde(b, a.dir, a.len, 5.2, delay, dmgJ(b));
}
function actuarEmbestidaT(b, a, dt) {
  if (a.t < a.delay) { b.ang = turnToward(b.ang, a.dir, dt * 8); b.alza = 0.4; return false; }
  if (!a.dash) { a.dash = true; sfx('rugido'); sacudir(14); }
  const V = 32;
  if (a.rec < a.len) {
    const ok = avanzarTierra(b, a.dir, V, dt);
    a.rec += V * dt; if (!ok) a.rec = a.len;
    b.vel = V;
    if (Math.random() < 0.6) polvo(b.x, alturaSuelo(b.x, b.z), b.z);
    return false;
  }
  b.vel = 0;
  return a.t >= a.delay + a.len / V + 0.25;
}

// ---------------------------------------------------------------------------
// Muerte, botín y dibujo
// ---------------------------------------------------------------------------
function muriendoJefeTierra(b, dt) {
  b.muerteT += dt; b.vel = 0; b.aturdido = 0; b.atk = null; b.alza = 0; b.oculto = false;
  if (Math.random() < dt * 14) { const r = b.def.radio; polvo(b.x + rand(-r, r), alturaSuelo(b.x, b.z), b.z + rand(-r, r)); chispas(b.x + rand(-r, r), alturaSuelo(b.x, b.z) + rand(0.5, 3), b.z + rand(-r, r), '#ffb23a', 3, 4); }
  b.aire = Math.max(0, b.aire - dt * 12);
  if (b.muerteT >= 3.0) {
    const d = b.def;
    let txt = [];
    G.plata += d.plata; txt.push(fmtMoney(d.plata));
    for (const [id, n] of d.botin) { darItem(id, n); txt.push(`${n} ${ITEMS[id].nombre}`); }
    toast(`Botín de ${d.nombre}: ${txt.join(', ')}`, '#ffe36b');
    const c = pecho();
    lluviaMonedas(c.x, c.y, c.z, 24);
    if (d.arma && !G.armas[d.arma]) {
      G.armas[d.arma] = true; if (!G.armaSel) G.armaSel = d.arma;
      G.cargador[d.arma] = ARMA[d.arma].cargador;
      mostrarHallazgo({ titulo: `¡${ARMA[d.arma].nombre}!`, icono: 'cofre', texto: ARMA[d.arma].desc + ' Ya la tenés en la tecla 5.', plata: d.plata, oro: true });
      sfx('tesoro');
    } else sfx('mision');
    revisarMisiones();
    guardar();
    b.estado = 'muerto'; b.respawn = REAPARECE_TIERRA;
  }
}

function estrellasTierra(b, y) {
  if (!b.estrellas) { b.estrellas = new THREE.Group(); for (let i = 0; i < 3; i++) b.estrellas.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.4, 0), new THREE.MeshBasicMaterial({ color: '#ffe36b', fog: false }))); ESC.escena.add(b.estrellas); }
  const ver = b.aturdido > 0 && b.estado === 'pelea' && !b.oculto;
  b.estrellas.visible = ver;
  if (ver) b.estrellas.children.forEach((s, i) => { const a = J.t * 4 + (i / 3) * TAU; s.position.set(b.x + Math.cos(a) * b.def.radio * 0.7, y + (b.def.alto || 3) + 0.8 + Math.sin(a * 2) * 0.3, b.z + Math.sin(a) * b.def.radio * 0.7); s.rotation.y = a * 2; });
}
function sincronizarJefeTierra(b, dt) {
  const m = b.mod;
  const cerca = Math.hypot(b.x - P.pos.x, b.z - P.pos.z) < 430;
  const vis = b.estado !== 'muerto' && !b.oculto && cerca;
  m.grupo.visible = vis;
  if (!vis) { if (b.estrellas) b.estrellas.visible = false; return; }
  const suelo = alturaSuelo(b.x, b.z);
  b.y += (suelo - b.y) * Math.min(1, dt * 8);
  m.grupo.position.set(b.x, b.y + b.aire, b.z);
  m.grupo.rotation.set(0, -b.ang, 0);
  if (b.estado === 'muriendo') { const k = smooth(0.3, 2.4, b.muerteT); m.grupo.rotation.z = k * (Math.PI / 2) * (b.def.id === 'escorpion' ? 0.9 : 1); m.grupo.position.y -= k * 0.4; }
  m.animar(dt, b.vel, J.t, b.fase0, b);
  const em = b.flash > 0 ? b.flash * 0.65 : 0;
  m.mat.emissive.setRGB(em, em * 0.9, em * 0.8);
  if (m.dobleMat) m.dobleMat.emissive.setRGB(em, em * 0.9, em * 0.8);
  estrellasTierra(b, b.y);
}
