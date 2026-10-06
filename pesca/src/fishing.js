'use strict';
// La caña en 3D: lanzar donde apunta la mira, esperar el pique, clavar, pelear y sacar el pez.
//
//  libre -> lanzando -> espera -> (mordisqueo) -> picada -> pelea -> captura -> libre
//  Un clic en "espera" o "mordisqueo" recoge la línea. Un clic en "picada" clava. En "pelea" mantené para recoger.

const LINEA = {
  estado: 'libre', x: 0, y: 0, z: 0, ox: 0, oy: 0, oz: 0, tx: 0, tz: 0, t: 0, dur: 0.5,
  pez: null, jefe: null, nib: 0, tNib: 0, ventana: 0, espera: 0, esperaMax: 5, zona: 'orilla',
  pelea: null, hundida: 0, perfecto: false, dirFija: 0, d0: 0, rec: 0, equipo: null, captura: null, ripT: 0, avisoJefe: false, avisoSonado: false,
};
const LIN3D = { tubo: null, boya: null, lista: false };

const mensaje = (txt, col) => { if (typeof toast === 'function') toast(txt, col); };

function motivoNoLanzar() {
  if (P.stun > 0) return 'Estás aturdido';
  if (mochilaLlena()) return 'Mochila llena: vendé o comé algo';
  return '';
}

function lanzarCana() {
  const mot = motivoNoLanzar();
  if (mot) { mensaje(mot, '#ffb3a8'); sfx('error'); return false; }
  const eq = equipoCana();
  const tip = puntaCana();
  const m = P.mira;
  if (!m.agua) { mensaje(m.tierra ? 'Ahí hay tierra. Apuntá al agua.' : 'Apuntá más abajo, al agua.', '#ffe39a'); sfx('error'); return false; }
  let tx = m.x, tz = m.z;
  const dd = Math.hypot(tx - tip.x, tz - tip.z);
  if (dd > eq.alcance) { const k = eq.alcance / dd; tx = tip.x + (tx - tip.x) * k; tz = tip.z + (tz - tip.z) * k; }
  const disp = 0.15 + Math.min(dd, eq.alcance) * 0.012;
  tx += rand(-disp, disp); tz += rand(-disp, disp);
  if (!esAgua(tx, tz) || H(tx, tz) > -0.5) { mensaje('Muy cerca de la orilla: tirá un poco más lejos.', '#ffe39a'); sfx('error'); return false; }
  if (enMuelle(tx, tz, 1.2)) { mensaje('Tirá un poco más lejos del muelle.', '#ffe39a'); sfx('error'); return false; }
  Object.assign(LINEA, {
    estado: 'lanzando', ox: tip.x, oy: tip.y, oz: tip.z, tx, tz, x: tip.x, y: tip.y, z: tip.z, t: 0,
    dur: 0.32 + Math.hypot(tx - tip.x, tz - tip.z) / 34, pez: null, jefe: null, nib: 0, ventana: 0, espera: 0, hundida: 0,
    pelea: null, equipo: eq, ripT: 0, perfecto: false, avisoJefe: false, rec: 0,
  });
  P.hambre = Math.max(0, P.hambre - 0.35);
  P.accion = 1;
  sfx('lanzar');
  return true;
}

function recogerLinea(rapido) {
  if (LINEA.pez && LINEA.pez.estado !== 'colgado') { LINEA.pez.estado = 'nada'; LINEA.pez.meta = null; LINEA.pez.susto = 1.2; }
  if (LINEA.jefe && (LINEA.jefe.estado === 'atraido' || LINEA.jefe.estado === 'mordiendo')) jefeSoltarCebo(LINEA.jefe);
  LINEA.pez = null;
  LINEA.estado = 'recogiendo';
  LINEA.t = 0; LINEA.dur = rapido ? 0.15 : 0.4;
  LINEA.ox = LINEA.x; LINEA.oy = LINEA.y; LINEA.oz = LINEA.z;
  sfx('recoger');
}
function soltarTodo() {
  LINEA.estado = 'libre';
  LINEA.pez = null; LINEA.jefe = null; LINEA.pelea = null;
  const a = $('#alerta'); if (a) a.hidden = true;
}

function candidatosPique() {
  const eq = LINEA.equipo, out = [];
  for (const f of PECES) {
    if (f.estado !== 'nada' && f.estado !== 'asustado') continue;
    const d = Math.hypot(f.x - LINEA.x, f.z - LINEA.z);
    if (d > eq.atrae || f.alfa < 0.3) continue;
    out.push({ f, d });
  }
  return out;
}

function aterrizar() {
  LINEA.estado = 'espera';
  LINEA.x = LINEA.tx; LINEA.z = LINEA.tz; LINEA.y = alturaOla(LINEA.x, LINEA.z, J.t);
  LINEA.t = 0; LINEA.espera = 0;
  LINEA.zona = zonaDe(distCosta(LINEA.x, LINEA.z));
  LINEA.esperaMax = rand(2.2, 5.5);
  chapoteo(LINEA.x, LINEA.z, 9, 0.8);
  sfx('splash');
  for (const f of PECES) {
    if (f.estado === 'nada' && Math.hypot(f.x - LINEA.x, f.z - LINEA.z) < 3.2) { f.estado = 'asustado'; f.susto = 1.1; f.meta = null; f.ang = Math.atan2(f.z - LINEA.z, f.x - LINEA.x); }
  }
  // ¿caíste sobre un jefe que ya está peleando pero sin anzuelo? Se vuelve a enganchar
  for (const b of BOSSES) {
    if (b.estado === 'pelea' && !b.hooked && Math.hypot(b.x - LINEA.x, b.z - LINEA.z) < b.def.radio + 4) {
      LINEA.jefe = b; LINEA.estado = 'picada'; LINEA.ventana = 1; LINEA.hundida = 1; LINEA.t = 0;
      clavar();
      return;
    }
  }
  if (G.carnadaArmada && tiene('carnada')) {
    const j = jefeBuscarCebo(LINEA.x, LINEA.z);
    if (j) { LINEA.jefe = j; sacarItem('carnada'); G.carnadaArmada = false; j.estado = 'atraido'; mensaje('¡Algo enorme se acerca a tu carnada!', '#ff9d8a'); sfx('jefeCerca'); sacudir(6); return; }
    if (!LINEA.avisoJefe) { LINEA.avisoJefe = true; mensaje('Ningún jefe se acerca. Probá más cerca de su sombra.', '#ffe39a'); }
  }
  const c = candidatosPique();
  if (c.length) {
    const eleg = wpick(c, (o) => (1 - o.d / (LINEA.equipo.atrae + 1)) * (1 + LINEA.equipo.suerte * o.f.sp.rareza * 2.2) * (o.f.sp.tipo ? 0.55 : 1) + 0.05);
    elegirPicador(eleg.f);
  }
}
function elegirPicador(f) {
  LINEA.pez = f;
  f.estado = 'curioso';
  f.meta = { x: LINEA.x, z: LINEA.z };
  f.vel = Math.max(f.vel, 2.6);
  f.susto = 0; f.lider = null;
}
function aparecerPezCerca() {
  const eq = LINEA.equipo, zona = LINEA.zona;
  const sp = elegirEspecie(zona, eq.suerte);
  let pos = null;
  for (let i = 0; i < 14 && !pos; i++) {
    const a = rand(TAU), r = rand(12, 22);
    const x = LINEA.x + Math.cos(a) * r, z = LINEA.z + Math.sin(a) * r;
    if (H(x, z) < -0.7) pos = { x, z };
  }
  if (!pos) pos = { x: LINEA.x + 8, z: LINEA.z };
  const f = crearPez(sp, pos.x, pos.z, { zona, alfa: 0.6 });
  f.ang = Math.atan2(LINEA.z - pos.z, LINEA.x - pos.x);
  PECES.push(f);
  elegirPicador(f);
}

function actualizarLinea(dt) {
  const L = LINEA;
  L.t += dt;
  if (L.estado === 'libre') { actualizarAlerta(); return; }
  const tip = puntaCana();
  L.hundida = Math.max(0, L.hundida - dt * 2.2);
  if (L.estado === 'lanzando') {
    const k = Math.min(1, L.t / L.dur);
    L.x = lerp(L.ox, L.tx, k); L.z = lerp(L.oz, L.tz, k);
    L.y = lerp(L.oy, 0, k) + Math.sin(k * Math.PI) * (1.2 + Math.hypot(L.tx - L.ox, L.tz - L.oz) * 0.1);
    if (k >= 1) aterrizar();
    return;
  }
  if (L.estado === 'recogiendo') {
    const k = Math.min(1, L.t / L.dur);
    L.x = lerp(L.ox, tip.x, k); L.z = lerp(L.oz, tip.z, k); L.y = lerp(L.oy, tip.y, k);
    if (k >= 1) soltarTodo();
    return;
  }
  if (L.estado === 'espera' || L.estado === 'mordisqueo' || L.estado === 'picada') {
    L.y = alturaOla(L.x, L.z, J.t);
    const dl = Math.hypot(tip.x - L.x, tip.z - L.z);
    if (dl > L.equipo.alcance * 1.35 + 4) { mensaje('La línea quedó muy tirante: la recogiste.', '#ffe39a'); recogerLinea(true); return; }
    L.ripT -= dt;
    if (L.ripT <= 0) { L.ripT = rand(1.1, 1.9); ondaAgua(L.x, L.z, 1.1, 1.2, 0.45, 1); }
  }
  if (L.estado === 'espera') {
    L.espera += dt;
    if (L.jefe) return;
    if (!L.pez) {
      if (L.espera > 0.8) {
        const c = candidatosPique();
        if (c.length && Math.random() < dt * 1.2) elegirPicador(wpick(c, (o) => 1 - o.d / (L.equipo.atrae + 1) + 0.05).f);
      }
      if (L.espera > L.esperaMax) { aparecerPezCerca(); L.esperaMax = 99; }
    } else {
      const f = L.pez;
      if (!PECES.includes(f) || f.estado === 'muerto') { L.pez = null; L.espera = 0; L.esperaMax = rand(1.5, 3.5); return; }
      f.meta = { x: L.x, z: L.z };
      if (Math.hypot(f.x - L.x, f.z - L.z) < 0.9) {
        L.estado = 'mordisqueo'; L.t = 0;
        L.nib = f.sp.tipo ? 0 : randi(1, 3);
        L.tNib = rand(0.5, 1.1);
        f.estado = 'mordisqueo'; f.meta = null;
      }
    }
  } else if (L.estado === 'mordisqueo') {
    const f = L.pez;
    if (!f || !PECES.includes(f)) { L.estado = 'espera'; L.pez = null; L.espera = 0; L.esperaMax = rand(1.5, 3.5); return; }
    f.ang += dt * 2.4;
    f.x = lerp(f.x, L.x + Math.cos(f.t * 2.6) * 0.8, Math.min(1, dt * 6));
    f.z = lerp(f.z, L.z + Math.sin(f.t * 2.6) * 0.8, Math.min(1, dt * 6));
    L.tNib -= dt;
    if (L.tNib <= 0) {
      if (L.nib > 0) {
        L.nib--; L.hundida = 0.55; L.tNib = rand(0.7, 1.5);
        ondaAgua(L.x, L.z, 1.6, 0.8, 0.7, 1);
        sfx('tiron'); P.vibrar = 0.05;
      } else {
        L.estado = 'picada'; L.t = 0; L.ventana = L.equipo.ventana; L.hundida = 1;
        chapoteo(L.x, L.z, 8, 0.7);
        sfx('pique');
        if (navigator.vibrate) { try { navigator.vibrate(80); } catch (e) { /* sin vibración */ } }
      }
    }
  } else if (L.estado === 'picada') {
    L.ventana -= dt;
    L.hundida = Math.max(L.hundida, 0.9);
    const f = L.pez;
    if (f) { f.x = lerp(f.x, L.x, Math.min(1, dt * 8)); f.z = lerp(f.z, L.z, Math.min(1, dt * 8)); }
    if (L.ventana <= 0 && L.jefe) {
      jefeSoltarCebo(L.jefe);
      L.jefe = null; L.estado = 'espera'; L.espera = 0; L.esperaMax = 99;
      mensaje('El jefe se llevó la carnada y se fue. ¡Clavá más rápido!', '#ffb3a8');
      sfx('error');
    } else if (L.ventana <= 0) {
      if (f) { f.estado = 'huye'; f.meta = null; f.ang = rand(TAU); }
      L.pez = null; L.estado = 'espera'; L.espera = 0; L.esperaMax = rand(2, 4);
      G.stats.escapados++;
      textoFlotante(L.x, 1.4, L.z, '¡Se fue!', '#ffb3a8', 22);
      sfx('error');
    }
  } else if (L.estado === 'pelea') {
    if (L.jefe) actualizarPeleaJefe(dt); else actualizarPelea(dt);
  } else if (L.estado === 'captura') actualizarCaptura(dt);
  actualizarAlerta();
}
function actualizarAlerta() {
  const a = $('#alerta');
  if (!a) return;
  if (LINEA.estado !== 'picada') { a.hidden = true; return; }
  _p.set(LINEA.x, 1.6, LINEA.z).project(ESC.camara);
  a.hidden = _p.z > 1;
  a.style.transform = `translate(-50%,-50%) translate(${((_p.x + 1) / 2) * J.w}px, ${((1 - _p.y) / 2) * J.h}px)`;
}

function clavar() {
  const L = LINEA;
  if (L.estado !== 'picada') return;
  L.perfecto = L.equipo.ventana - L.ventana < 0.4;
  G.stats.piques++;
  if (L.jefe) { jefeEnganchado(L.jefe, L.perfecto); return; }
  const f = L.pez;
  if (!f) return;
  f.estado = 'colgado'; f.visible = false; f.meta = null;
  L.estado = 'pelea'; L.t = 0;
  const tip = puntaCana();
  L.dirFija = Math.atan2(L.z - tip.z, L.x - tip.x);
  L.d0 = Math.hypot(L.x - tip.x, L.z - tip.z);
  L.pelea = nuevaPelea(f.sp, f.kg, L.equipo, { perfecto: L.perfecto });
  P.hambre = Math.max(0, P.hambre - 1);
  chapoteo(L.x, L.z, 14, 1);
  textoFlotante(L.x, 1.6, L.z, L.perfecto ? '¡Perfecto!' : '¡Clavado!', L.perfecto ? '#ffe36b' : '#ffffff', L.perfecto ? 28 : 22);
  sfx('clavar');
  sacudir(8);
  const a = $('#alerta'); if (a) a.hidden = true;
}

// Metros desde (x,z) hasta que empieza el agua en la dirección ang
function distHastaAgua(x, z, ang) {
  const dx = Math.cos(ang), dz = Math.sin(ang);
  for (let s = 0; s < 240; s += 0.6) { const px = x + dx * s, pz = z + dz * s; if (H(px, pz) < -0.55 && !enMuelle(px, pz, 0.4)) return s; }
  return 240;
}
function leerReel() { return (P.tool === 'cana' && IN.botones[0]) || IN.teclas.has('Space') || IN.accionTactil; }

function actualizarPelea(dt) {
  const L = LINEA, s = L.pelea, f = L.pez;
  const tip = puntaCana();
  if (!f || !PECES.includes(f)) { soltarTodo(); return; }
  const reel = leerReel() && P.stun <= 0;
  const ev = pasoPelea(s, dt, reel);
  // dónde está el pez: sobre la línea entre el punto inicial y la orilla, con un zigzag lateral
  const dEnd = Math.max(1.8, distHastaAgua(P.pos.x, P.pos.z, L.dirFija) + 1.2);
  const dTot = Math.max(L.d0, dEnd + 3);
  const d = lerp(dTot, dEnd, s.prog);
  const lat = (Math.sin(s.t * 1.9 + s.fase) * 0.22 * (1 - s.prog * 0.5) + (s.modo === 'corrida' ? Math.sin(s.t * 6) * 0.26 : 0) + (s.modo === 'sacudida' ? Math.sin(s.t * 14) * 0.1 : 0));
  const ang = L.dirFija + lat;
  const nx = P.pos.x + Math.cos(ang) * d, nz = P.pos.z + Math.sin(ang) * d;
  if (H(nx, nz) < -0.4) { f.x = lerp(f.x, nx, Math.min(1, dt * 12)); f.z = lerp(f.z, nz, Math.min(1, dt * 12)); }
  f.ang = Math.atan2(f.z - tip.z, f.x - tip.x) + Math.PI + Math.sin(s.t * 9) * 0.5 * (s.pull > 0.5 ? 1 : 0.3);
  L.x = f.x; L.z = f.z; L.y = f.y;
  f.visible = s.prog > 0.5;
  f.alfa = 1;
  L.ripT -= dt;
  if (L.ripT <= 0) { L.ripT = s.pull > 0.8 ? 0.12 : 0.32; ondaAgua(f.x, f.z, 1.1 + s.pull * 1.4, 0.7, 0.55, 1); if (s.pull > 0.5) chapoteo(f.x, f.z, 3, 0.45); }
  if (reel && Math.random() < dt * 14) sfx('carretel', s.T);
  if (s.modo === 'aviso') { if (!L.avisoSonado) { sfx('aviso'); L.avisoSonado = true; } } else L.avisoSonado = false;
  CAM.shake = Math.max(CAM.shake, s.pull * s.str * 2.5);
  if (ev === 'gano') iniciarCaptura(f);
  else if (ev === 'corte') {
    f.estado = 'huye'; f.meta = null;
    textoFlotante(P.pos.x, P.pos.y + 2.4, P.pos.z, '¡Se cortó la línea!', '#ff8a7a', 26, 1.6);
    mensaje('¡Se cortó la línea! Soltá el carretel cuando el pez avise.', '#ff9d8a');
    sfx('corte'); sacudir(14); G.stats.cortes++;
    soltarTodo();
  } else if (ev === 'suelta') {
    f.estado = 'huye'; f.meta = null;
    textoFlotante(P.pos.x, P.pos.y + 2.4, P.pos.z, '¡Se soltó!', '#ffcf8a', 26, 1.4);
    mensaje('El pez se soltó: la línea estaba floja. Seguí recogiendo.', '#ffe39a');
    sfx('error'); G.stats.escapados++;
    soltarTodo();
  }
}

function iniciarCaptura(f) {
  const L = LINEA;
  L.estado = 'captura'; L.t = 0;
  L.captura = { f, x0: f.x, y0: f.y, z0: f.z, x: f.x, y: f.y, z: f.z };
  f.estado = 'capturado'; f.visible = true;
  sfx('sacar');
  chapoteo(f.x, f.z, 12, 0.9);
}
function actualizarCaptura(dt) {
  const L = LINEA, c = L.captura;
  const k = Math.min(1, L.t / 0.75);
  const meta = pecho();
  c.x = lerp(c.x0, meta.x, k); c.z = lerp(c.z0, meta.z, k);
  c.y = lerp(0.1, meta.y, k) + Math.sin(k * Math.PI) * 1.8;
  const f = c.f;
  L.x = c.x; L.y = c.y; L.z = c.z;
  if (f.mod) { f.mod.grupo.position.set(c.x, c.y, c.z); f.mod.grupo.rotation.set(0, -f.ang, k * 6.0); f.mod.animar(dt, 8, J.t, f.fase); f.mod.grupo.scale.setScalar(1); }
  if (k >= 1) {
    const i = PECES.indexOf(f);
    if (i >= 0) PECES.splice(i, 1);
    const zonaCaptura = L.zona;
    soltarTodo();
    liberarPez(f);
    alCapturar(f, zonaCaptura);
  }
}

function alCapturar(f, zonaFija) {
  const sp = f.sp, zona = zonaFija || f.zona || 'orilla';
  G.stats.zonas[zona] = (G.stats.zonas[zona] || 0) + 1;
  P.hambre = Math.max(0, P.hambre - 0.5);
  const c = pecho();
  if (sp.tipo === 'basura') {
    const m = randi(1, 6) * (sp.id === 'neumatico' ? 2 : 1);
    if (sp.id === 'botella') {
      G.plata += 30;
      mostrarHallazgo({ titulo: 'Botella con mensaje', icono: sp.id, texto: '«' + pick(MENSAJES_BOTELLA) + '»', plata: 30 });
    } else { G.plata += m; mostrarHallazgo({ titulo: sp.nombre, icono: sp.id, texto: sp.texto, plata: m }); }
    registrarCaptura(sp.id, f.kg, false);
    sfx('basura');
    revisarMisiones();
    return;
  }
  if (sp.tipo === 'tesoro') {
    const rango = { orilla: [120, 500], arrecife: [400, 1800], mar: [1500, 7000], abismo: [8000, 40000] }[zona] || [100, 400];
    const plata = randi(rango[0], rango[1]);
    G.plata += plata;
    let extra = '';
    if (chance(0.3)) { const it = pick([['dinamita', 3], ['botiquin', 1], ['carnada', 1], ['vendas', 3]]); darItem(it[0], it[1]); extra = `+${it[1]} ${ITEMS[it[0]].nombre}`; }
    mostrarHallazgo({ titulo: '¡Cofre del tesoro!', icono: 'cofre', texto: extra || 'Brillaba de lejos. Y no mentía.', plata, oro: true });
    registrarCaptura('cofre', f.kg, false);
    sfx('tesoro');
    lluviaMonedas(c.x, c.y, c.z, 18);
    revisarMisiones();
    return;
  }
  const kg = Math.round(f.kg * 100) / 100;
  if (sp.pica) { P.hp = Math.max(1, P.hp - 8); P.flash = 1; textoFlotante(c.x, c.y + 0.8, c.z, '¡Pica! -8', '#ff8a7a', 22); sfx('hurt'); }
  const item = { id: sp.id, kg, brillo: !!f.brillo };
  if (mochilaLlena()) { mensaje('Mochila llena: lo soltaste.', '#ffb3a8'); return; }
  G.peces.push(item);
  G.stats.capturas++;
  G.stats.mayorKg = Math.max(G.stats.mayorKg, kg);
  const reg = registrarCaptura(sp.id, kg, item.brillo);
  mostrarCaptura({ sp, kg, brillo: item.brillo, valor: valorPez(item), nuevo: reg.nuevo, record: reg.record && !reg.nuevo, zona });
  sfx('captura', sp.rareza);
  if (sp.rareza >= 3 || item.brillo) chispas(c.x, c.y, c.z, sp.rareza >= 4 ? '#ffd23c' : '#b86bff', 24, 5);
  revisarMisiones();
}

// ---------------------------------------------------------------------------
// Línea y boya en 3D
// ---------------------------------------------------------------------------
function crearLinea3D(escena) {
  LIN3D.tubo = crearTubo(escena);
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 8, 0, TAU, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#e8473a', roughness: 0.4 }));
  const bot = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 8, 0, TAU, Math.PI / 2, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.4 }));
  const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.16, 5), new THREE.MeshStandardMaterial({ color: '#e8c860' }));
  ant.position.y = 0.18;
  g.add(top, bot, ant);
  g.visible = false;
  escena.add(g);
  LIN3D.boya = g;
  LIN3D.lista = true;
}
function actualizarLinea3D() {
  if (!LIN3D.lista) return;
  const L = LINEA, tubo = LIN3D.tubo, boya = LIN3D.boya;
  if (L.estado === 'libre' || J.modo === 'titulo') { tubo.m.visible = false; boya.visible = false; return; }
  const tip = puntaCana();
  let fin = { x: L.x, y: L.y, z: L.z };
  let sag = 0.35, grosor = 0.011, col = '#ffffff';
  let verBoya = true;
  if (L.estado === 'lanzando') sag = 0.3;
  else if (L.estado === 'espera' || L.estado === 'mordisqueo' || L.estado === 'picada') {
    const d = Math.hypot(tip.x - L.x, tip.z - L.z);
    sag = Math.min(tip.y - 0.05, 0.6 + d * 0.16);
    fin.y = alturaOla(L.x, L.z, J.t) + 0.02 - L.hundida * 0.12;
  } else if (L.estado === 'pelea' || L.estado === 'captura') {
    verBoya = false;
    const T = L.pelea ? L.pelea.T : 0.5;
    sag = (1 - Math.min(1, T * 1.3)) * 1.4;
    col = T > PELEA.peligro ? '#ff6a5a' : T > PELEA.verdeMax - 0.08 ? '#ffd86a' : '#ffffff';
    grosor = 0.012 + T * 0.01;
    if (L.estado === 'pelea' && L.pez && L.pez.mod) fin = { x: L.pez.x, y: Math.max(L.pez.y + 0.05, 0.05), z: L.pez.z };
    if (L.estado === 'pelea' && L.jefe) fin = { x: L.jefe.x, y: 0.6, z: L.jefe.z };
  } else if (L.estado === 'recogiendo') sag = 0.2;
  boya.visible = verBoya;
  if (verBoya) { boya.position.set(fin.x, fin.y + 0.02 - (L.hundida > 0.7 ? 0.25 : L.hundida * 0.1), fin.z); boya.rotation.z = Math.sin(J.t * 2.6) * 0.1; }
  tubo.poner(tip, fin, sag, grosor, col);
}
