'use strict';
// Peces nadando en 3D: aparecen en la zona del mar donde estás (según la distancia a la costa), nadan, forman
// cardúmenes y se ven como sombras bajo la superficie. La pesca los atrae a la boya; el arpón y la dinamita los cazan.

let sigPezId = 1;
const VEL_FORMA = { estrella: 0.1, cangrejo: 0.35, medusa: 0.25, pulpo: 0.6, globo: 0.55, camaron: 0.7, cofre: 0, bota: 0.05, lata: 0.05, neumatico: 0.05, botella: 0.1, langosta: 0.4, gota: 0.4, raya: 0.8, cinta: 0.9 };
const OBJETIVO_ZONA = { orilla: 9, arrecife: 11, mar: 9, abismo: 6 };
const PROF_ZONA = { orilla: 0.4, arrecife: 0.9, mar: 1.6, abismo: 2.6 };
const RADIO_SPAWN = 150; // metros alrededor del jugador

function sortearKg(sp) { return sp.kg[0] + (sp.kg[1] - sp.kg[0]) * Math.pow(Math.random(), 1.7); }

function crearPez(sp, x, z, o = {}) {
  const kg = o.kg || sortearKg(sp);
  const largo = Math.max(0.12, sp.len * ESC_PEZ * clamp(Math.pow(kg / kgMedio(sp), 0.34), 0.75, 1.35));
  const zona = o.zona || zonaDe(distCosta(x, z));
  const f = {
    id: sigPezId++, sp, kg, brillo: o.brillo !== undefined ? o.brillo : (!sp.tipo && chance(0.025)),
    x, z, y: -0.5, ang: o.ang !== undefined ? o.ang : rand(TAU), v: 0, largo, zona,
    estado: 'nada', t: 0, fase: rand(TAU), alfa: o.alfa !== undefined ? o.alfa : 0,
    meta: null, tMeta: 0, grupo: o.grupo || 0, lider: o.lider || null, off: { x: rand(-2.5, 2.5), z: rand(-2.5, 2.5) },
    vf: VEL_FORMA[sp.arte.forma] !== undefined ? VEL_FORMA[sp.arte.forma] : 1, vivo: true, susto: 0, prof: PROF_ZONA[zona] * rand(0.8, 1.25),
  };
  f.vel = (0.7 + sp.fuerza * 0.9 + largo * 0.9) * f.vf;
  f.mod = crearModeloEspecie(sp, largo);
  // los peces son finitos vistos desde arriba: la sombra se ensancha para que se lea (hasta ~35% del largo)
  { const bb = new THREE.Box3().setFromObject(f.mod.grupo), sz = bb.getSize(new THREE.Vector3()); f.latSombra = clamp(0.38 / Math.max(0.05, sz.z / Math.max(0.05, sz.x)), 1, 3.2); }
  modoModelo(f.mod, 'sombra', zona);
  f.mod.grupo.visible = false;
  ESC.escena.add(f.mod.grupo);
  f.y = fondoY(f);
  return f;
}
function fondoY(f) {
  const suelo = H(f.x, f.z);
  if (f.sp.arte.forma === 'cofre') return Math.max(suelo + 0.3, -1.2);
  if (f.sp.tipo === 'basura') return -0.14;
  // lo más hondo que corresponde a su zona, pero sin atravesar el fondo ni sacar la cabeza
  return Math.min(-0.12, Math.max(-f.prof, suelo + 0.25));
}
function liberarPez(f) {
  f.vivo = false;
  if (f.mod) { ESC.escena.remove(f.mod.grupo); f.mod.grupo.traverse((o) => { if (o.isMesh && o.geometry && !o.userData.compartida) o.geometry.dispose(); }); f.mod = null; }
}

function elegirEspecie(zona, suerte = 0, soloPeces = false) {
  const lista = ESPECIES.filter((s) => s.z[zona] && (!soloPeces || !s.tipo));
  return wpick(lista, (s) => s.z[zona] * (1 + suerte * s.rareza * 2.2));
}
// Punto de agua alrededor de (cx,cz) con la distancia a la costa dentro de [d0,d1]
function puntoZona(cx, cz, d0, d1, rmin = 12, rmax = RADIO_SPAWN) {
  for (let i = 0; i < 16; i++) {
    const a = rand(TAU), r = rand(rmin, rmax);
    const x = cx + Math.cos(a) * r, z = cz + Math.sin(a) * r;
    if (Math.hypot(x, z) > MUNDO.R - 10) continue;
    const d = distCosta(x, z);
    if (d >= d0 && d < d1 && H(x, z) < -0.5) return { x, z };
  }
  return null;
}

function spawnPez(zona, o = {}) {
  const z = ZONA[zona];
  const c = o.centro || { x: P.pos.x, z: P.pos.z };
  const p = o.pos || puntoZona(c.x, c.z, z.desde + (zona === 'orilla' ? 3 : 0), Math.min(z.hasta, 900), 10, RADIO_SPAWN);
  if (!p) return null;
  const sp = o.sp || elegirEspecie(zona);
  if (sp.cardumen && !o.sinGrupo) {
    const n = randi(sp.cardumen[0], sp.cardumen[1]);
    const grupo = sigPezId + 1000;
    let lider = null;
    for (let i = 0; i < n; i++) {
      const q = { x: p.x + rand(-3, 3), z: p.z + rand(-3, 3) };
      if (H(q.x, q.z) > -0.4) continue;
      const f = crearPez(sp, q.x, q.z, { grupo, zona, lider, ang: lider ? lider.ang : undefined, alfa: o.alfa });
      if (!lider) lider = f;
      PECES.push(f);
    }
    return lider;
  }
  const f = crearPez(sp, p.x, p.z, { zona, alfa: o.alfa });
  PECES.push(f);
  return f;
}

let tSpawn = 0;
function intentarSpawns() {
  const cx = P.pos.x, cz = P.pos.z;
  const cuenta = { orilla: 0, arrecife: 0, mar: 0, abismo: 0 };
  for (const f of PECES) {
    if (f.estado === 'colgado' || f.estado === 'muerto' || f.estado === 'capturado') continue;
    if (Math.hypot(f.x - cx, f.z - cz) < RADIO_SPAWN * 1.25) cuenta[f.zona]++;
  }
  // solo se pobla una zona si hay agua de esa zona cerca
  for (const z of ZONAS) {
    if (cuenta[z.id] >= OBJETIVO_ZONA[z.id] || PECES.length > 110) continue;
    spawnPez(z.id);
  }
}
function poblarInicial() {
  for (const f of PECES) liberarPez(f);
  PECES.length = 0;
  for (let i = 0; i < 60; i++) intentarSpawns();
  for (const f of PECES) f.alfa = 1;
}

function ponerMeta(f) {
  const z = ZONA[f.zona];
  for (let i = 0; i < 8; i++) {
    const a = f.ang + rand(-0.9, 0.9), r = rand(8, 26);
    const x = f.x + Math.cos(a) * r, zz = f.z + Math.sin(a) * r;
    const d = distCosta(x, zz);
    if (H(x, zz) < -0.5 && d >= z.desde * 0.9 && d < z.hasta + 8 && Math.hypot(x, zz) < MUNDO.R - 10) { f.meta = { x, z: zz }; f.tMeta = rand(3, 7); return; }
  }
  f.meta = { x: f.x + Math.cos(f.ang + Math.PI) * 12, z: f.z + Math.sin(f.ang + Math.PI) * 12 };
  f.tMeta = 3;
}

function actualizarPeces(dt) {
  tSpawn -= dt;
  if (tSpawn <= 0) { tSpawn = 0.5; intentarSpawns(); }
  for (let i = PECES.length - 1; i >= 0; i--) {
    const f = PECES[i];
    f.t += dt;
    if (f.estado === 'colgado' || f.estado === 'capturado') { sincronizarPez(f, dt); continue; }
    if (f.estado === 'muerto') { actualizarMuerto(f, dt, i); sincronizarPez(f, dt); continue; }
    const dj = Math.hypot(f.x - P.pos.x, f.z - P.pos.z);
    if (dj > RADIO_SPAWN * 1.9 || (f.estado === 'huye' && f.alfa < 0.02)) { liberarPez(f); PECES.splice(i, 1); continue; }
    f.alfa = Math.min(1, f.alfa + dt * 0.7);
    if (f.estado === 'huye') f.alfa = Math.max(0, f.alfa - dt * 1.3);
    let vObj = f.vel;
    if (f.estado === 'nada' || f.estado === 'asustado') {
      if (f.susto > 0) { f.susto -= dt; vObj = f.vel * 2.6; if (f.susto <= 0) f.estado = 'nada'; }
      if (f.lider && f.lider.vivo && f.lider.estado !== 'colgado' && f.lider.estado !== 'muerto') {
        f.meta = { x: f.lider.x + f.off.x, z: f.lider.z + f.off.z };
        const dl = Math.hypot(f.x - f.meta.x, f.z - f.meta.z);
        vObj = f.lider.v * (dl > 2 ? 1.5 : 1);
      } else {
        if (f.lider) f.lider = null;
        f.tMeta -= dt;
        if (!f.meta || f.tMeta <= 0 || Math.hypot(f.x - f.meta.x, f.z - f.meta.z) < 2) ponerMeta(f);
      }
    } else if (f.estado === 'huye') vObj = f.vel * 3;
    if (f.meta && f.estado !== 'mordisqueo') {
      const des = Math.atan2(f.meta.z - f.z, f.meta.x - f.x);
      f.ang = turnToward(f.ang, des, dt * (f.estado === 'curioso' ? 4 : 2.1) * (f.vf > 0.5 ? 1 : 0.5));
    }
    f.v += (vObj - f.v) * Math.min(1, dt * 2.4);
    const nx = f.x + Math.cos(f.ang) * f.v * dt, nz = f.z + Math.sin(f.ang) * f.v * dt;
    if (H(nx, nz) < -0.35 && Math.hypot(nx, nz) < MUNDO.R - 6) { f.x = nx; f.z = nz; } else { f.ang += Math.PI * (0.6 + Math.random() * 0.8); f.meta = null; }
    sincronizarPez(f, dt);
  }
}

function sincronizarPez(f, dt) {
  const m = f.mod;
  if (!m) return;
  m.grupo.visible = f.alfa > 0.02 || f.estado === 'colgado';
  // altura: bajo el agua, pegada al fondo si es poco profundo
  let ty = fondoY(f);
  if (f.estado === 'colgado' && f.visible) ty = 0.06 + Math.sin(J.t * 9 + f.fase) * 0.05;
  f.y += (ty - f.y) * Math.min(1, dt * 3);
  if (f.estado === 'muerto' || f.estado === 'capturado') { /* y lo fija quien lo mueve */ } else m.grupo.position.set(f.x, f.y, f.z);
  if (f.estado !== 'capturado') m.grupo.rotation.set(0, -f.ang, f.estado === 'muerto' ? Math.PI : 0);
  m.animar(dt, f.estado === 'colgado' ? f.vel * 2 : f.v, J.t, f.fase);
  // color o sombra: los peces pelando se ven en color al acercarse
  const color = f.estado === 'muerto' || f.estado === 'capturado' || (f.estado === 'colgado' && f.visible);
  modoModelo(m, color ? 'color' : 'sombra', f.zona);
  // opacidad por aparición gradual: se escala desde cero
  const k = f.estado === 'nada' || f.estado === 'asustado' || f.estado === 'curioso' || f.estado === 'mordisqueo' ? smooth(0, 1, f.alfa) : 1;
  // las sombras se agrandan un poco para que se lean desde lejos
  const esc = color ? 1 : clamp(1.4 / Math.max(0.12, f.largo), 1.25, 3.6);
  const kk = Math.max(0.001, k * esc);
  m.grupo.scale.set(kk, kk, kk * (color ? 1 : f.latSombra || 1));
}

function actualizarMuerto(f, dt, idx) {
  f.tMuerto = (f.tMuerto || 0) + dt;
  const m = f.mod;
  if (f.tMuerto < 0.9) {
    f.y = 0.08 + Math.sin(f.tMuerto * 4) * 0.03;
    if (f.neta) { f.x += (f.neta.x - f.x) * dt * 3; f.z += (f.neta.z - f.z) * dt * 3; }
    m.grupo.position.set(f.x, f.y, f.z);
    return;
  }
  // flota hacia el jugador
  const dx = P.pos.x - f.x, dz = P.pos.z - f.z, d = Math.hypot(dx, dz);
  const v = 9 + f.tMuerto * 3;
  f.y = 0.1 + Math.min(1.5, Math.max(0, 1.6 - d * 0.25));
  if (d < 1.4 || f.tMuerto > 7) {
    PECES.splice(idx, 1);
    liberarPez(f);
    if (typeof alRecogerCazado === 'function') alRecogerCazado(f);
    return;
  }
  f.x += (dx / d) * v * dt; f.z += (dz / d) * v * dt;
  f.ang = Math.atan2(dz, dx);
  m.grupo.position.set(f.x, f.y, f.z);
}

function pecesEn(x, z, r, filtro) {
  const out = [];
  for (const f of PECES) {
    if (f.estado === 'colgado' || f.estado === 'muerto' || f.estado === 'capturado') continue;
    if (Math.hypot(f.x - x, f.z - z) <= r && (!filtro || filtro(f))) out.push(f);
  }
  return out;
}
