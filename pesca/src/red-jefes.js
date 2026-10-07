'use strict';
// Multijugador: jefes compartidos. El ANFITRIÓN (el jugador de id más bajo que ya tiene el mundo al día) simula a todos los jefes y publica
// su estado cada ~0,1 s dentro de su presencia (jf = jefes, hz = zonas rojas). Los demás solo lo muestran y le mandan, también por presencia:
//   dm  daño acumulado que le hicieron a cada jefe      cb  "puse carnada acá"      hk  "lo enganché"
// Cada uno cobra su propio daño de las zonas rojas (se crean idénticas en todos los juegos) y su propio botín si peleó.

const RJ = {
  seq: 0, zonas: [], vistas: new Map(), // zonas que publico (anfitrión) / zonas ya creadas por id (resto)
  tSnap: 0, ultJf: '', ultHz: '', tHz: 0,
  dano: {}, danoSucio: false, tDano: 0, // lo que yo le hice a cada jefe
  cebo: null, seqCebo: 0, enganche: null, seqHk: 0, ceboPend: null,
  adoptado: false, tConexion: 0, listo: false,
  ultAplic: 0,
};
const ESTADOS_JEFE = ['oculto', 'patrulla', 'atraido', 'mordiendo', 'pelea', 'huyendo', 'muriendo', 'muerto', 'dormido', 'reinicio'];
const COLORES_TENT = ['#a05fb8', '#8a4aa0', '#2a5acc'];
const listaAtaques = (b) => (b.tierra ? ATAQUES_TIERRA[b.def.id] : ATAQUES_JEFE[b.def.id]) || [];
const FLAG_ZONA = { rayo: 1, campo: 2, impacto: 4, tent: 64 };
const EFECTO_ZONA = { lento: 8, veneno: 16, fuego: 32 };

// ---------------------------------------------------------------------------
// ANFITRIÓN: lo que publica
// ---------------------------------------------------------------------------
// Cada zona roja nueva se anota para que los demás la creen igual
function registrarZonaRed(p) {
  if (!RED.activa || !RED.anfitrion) return;
  p.nid = ++RJ.seq; p.t0 = J.t;
  RJ.zonas.push(p);
}
function codificarZona(p) {
  let flags = 0;
  for (const k in FLAG_ZONA) if (p[k]) flags |= FLAG_ZONA[k];
  if (p.efecto) flags |= EFECTO_ZONA[p.efecto] || 0;
  const t = p.tent;
  const base = p.tipo === 'circ' ? [p.nid, 0, r1(p.x), r1(p.z), r1(p.r), 0, 0] : [p.nid, 1, r1(p.x), r1(p.z), r1(p.x2), r1(p.z2), r1(p.w)];
  base.push(r2(p.delay), Math.round(p.dmg), flags, r2(J.t - p.t0), p.dur || 0);
  if (t) base.push(r1(t.x), r1(t.z), r1(t.ancho || 1), Math.max(0, COLORES_TENT.indexOf(t.col)));
  return base;
}
function snapshotJefe(b) {
  const lista = listaAtaques(b);
  const ak = b.atk ? lista.findIndex((a) => a.id === b.atk.id) : -1;
  const idx = JEFES.indexOf(b.def);
  const e = [idx, ESTADOS_JEFE.indexOf(b.estado), r1(b.x), r1(b.z), r2(b.ang), Math.round(b.hp), b.hpMax, b.fase, r1(b.aturdido), r1(b.vel), ak, b.atk ? r2(b.atk.t) : 0, r2(b.alza), r2(b.abierto), r1(b.aire || 0), b.oculto ? 1 : 0, b.vida, b.kid,
    b.blancoId === 'yo' ? miIdRed() : b.blancoId, b.cebo ? (b.cebo.id === 'yo' || b.cebo.local ? miIdRed() : b.cebo.id) : null, Math.round(Math.max(0, b.respawn || 0))];
  if (b.estado === 'pelea' || b.estado === 'muriendo') e.push(Object.entries(b.contrib || {}).map(([k, v]) => [k === 'yo' ? miIdRed() : k, Math.round(v)]));
  else e.push(0);
  e.push(b.kid > 0 && (b.estado === 'muriendo' || J.t - (b.tMuerte || -99) < 40) ? b.dignos : 0);
  return e;
}
function publicarJefesAnfitrion(dt) {
  const S = RED.sala;
  RJ.tSnap -= dt; RJ.tHz -= dt;
  const activo = BOSSES.some((b) => b.estado === 'pelea' || b.estado === 'muriendo' || b.estado === 'atraido' || b.estado === 'mordiendo' || b.estado === 'huyendo');
  const patch = {};
  if (RJ.tSnap <= 0) {
    RJ.tSnap = activo ? 0.1 : 1;
    const jf = BOSSES.map(snapshotJefe);
    const k = JSON.stringify(jf);
    if (k !== RJ.ultJf) { RJ.ultJf = k; patch.jf = jf; }
  }
  if (RJ.tHz <= 0) {
    RJ.tHz = 0.1;
    RJ.zonas = RJ.zonas.filter((p) => J.t - p.t0 < p.delay + (p.dur || 0) + 1.5);
    const hz = RJ.zonas.map(codificarZona);
    const k = JSON.stringify(hz);
    if (k !== RJ.ultHz) { RJ.ultHz = k; patch.hz = hz.length ? hz : null; }
  }
  if (Object.keys(patch).length) S.presencia(patch);
}

// ---------------------------------------------------------------------------
// ANFITRIÓN: lo que le piden los demás (daño, carnada, anzuelo)
// ---------------------------------------------------------------------------
function atenderPedidos(dt) {
  for (const r of RED.remotos.values()) {
    const p = r.p || {};
    // daño acumulado → vida del jefe
    if (p.dm && typeof p.dm === 'object') {
      r.dmBase = r.dmBase || {};
      for (const id in p.dm) {
        const par = p.dm[id], b = BOSSES.find((q) => q.def.id === id);
        if (!b || !Array.isArray(par)) continue;
        const vida = finito(par[0]), total = finito(par[1]);
        const base = r.dmBase[id];
        if (!base || base.vida !== vida) { r.dmBase[id] = { vida, total: vida === b.vida ? 0 : total, t: performance.now() }; if (vida !== b.vida) continue; }
        const o = r.dmBase[id];
        if (vida !== b.vida) continue;
        let delta = total - o.total;
        if (delta <= 0) continue;
        const seg = Math.max(0.05, (performance.now() - o.t) / 1000);
        delta = Math.min(delta, 6000 * Math.max(seg, 0.2)); // tope: nadie le pega tan fuerte
        o.total = total; o.t = performance.now();
        if (b.estado === 'pelea' && !b.oculto) aplicarDanoJefe(b, Math.round(delta), r.id);
      }
    }
    // carnada
    const c = p.cb;
    if (Array.isArray(c) && c[3] !== r.ceboSeq) {
      r.ceboSeq = c[3];
      const b = BOSSES[c[0] | 0];
      if (b && !b.tierra && b.estado === 'patrulla' && Math.hypot(b.x - finito(c[1]), b.z - finito(c[2])) < RANGO_CEBO + 10) { b.estado = 'atraido'; b.cebo = { id: r.id }; }
    }
    // anzuelo
    const k = p.hk;
    if (Array.isArray(k) && k[1] !== r.hkSeq) {
      r.hkSeq = k[1];
      const b = BOSSES[k[0] | 0];
      if (b && !b.tierra && b.estado === 'mordiendo' && b.cebo && b.cebo.id === r.id) empezarPeleaMar(b, r.id);
    }
  }
}
// Si el anfitrión se va y me toca a mí: sigo desde el estado que venía copiando
function tomarJefesComoAnfitrion(soyYo) {
  if (!soyYo) return;
  for (const b of BOSSES) {
    b.atk = null; b.cd = 1.4;
    if (b.estado === 'pelea') b.aturdido = Math.min(b.aturdido, 1);
  }
  // lo que ya se había aplicado de los demás no se vuelve a sumar
  for (const r of RED.remotos.values()) {
    r.dmBase = {};
    if (r.p && r.p.dm) for (const id in r.p.dm) { const par = r.p.dm[id]; if (Array.isArray(par)) r.dmBase[id] = { vida: finito(par[0]), total: finito(par[1]), t: performance.now() }; }
    const c = r.p && r.p.cb; if (Array.isArray(c)) r.ceboSeq = c[3];
    const k = r.p && r.p.hk; if (Array.isArray(k)) r.hkSeq = k[1];
  }
}

// ---------------------------------------------------------------------------
// RESTO: aplicar lo que publica el anfitrión
// ---------------------------------------------------------------------------
function aplicarJefesAnfitrion(hp) {
  const jf = hp && hp.jf;
  if (!Array.isArray(jf)) return;
  RJ.adoptado = true;
  for (const e of jf) {
    if (!Array.isArray(e) || e.length < 21) continue;
    const b = BOSSES[e[0] | 0];
    if (!b) continue;
    const estado = ESTADOS_JEFE[e[1] | 0];
    if (!estado) continue;
    const antes = b.estado;
    // vida nueva (volvió a aparecer)
    const vida = finito(e[16], 1), kid = finito(e[17]);
    if (b.vidaVista === undefined) { b.vidaVista = vida; b.kidVisto = kid; }
    if (vida !== b.vida) { b.vida = vida; b.cuerpoLocal = null; b.hooked = false; b.contrib = {}; if (RJ.dano[b.def.id] && RJ.dano[b.def.id].vida !== vida) delete RJ.dano[b.def.id]; }
    b.estado = estado;
    b.hp = finito(e[5]); b.hpMax = Math.max(1, finito(e[6], b.hpMax));
    b.fase = e[7] | 0; b.aturdido = finito(e[8]); b.vel = finito(e[9]);
    const lista = listaAtaques(b), ak = e[10] | 0;
    if (ak >= 0 && lista[ak]) { if (!b.atk || b.atk.id !== lista[ak].id) b.atk = { id: lista[ak].id, t: finito(e[11]), fase: 0 }; else b.atk.t = Math.max(b.atk.t, finito(e[11])) - 0; } else b.atk = null;
    b.alza = finito(e[12]); b.abierto = finito(e[13]); b.aire = finito(e[14]); b.oculto = !!e[15];
    b.blancoId = e[18] || null;
    b.cebo = e[19] ? { id: String(e[19]) === miIdRed() ? 'yo' : String(e[19]), remoto: true } : null;
    b.respawn = finito(e[20]);
    if (Array.isArray(e[21])) b.contrib = Object.fromEntries(e[21].map(([k, v]) => [String(k) === miIdRed() ? 'yo' : k, finito(v)]));
    const sx = finito(e[2], b.x), sz = finito(e[3], b.z);
    b.sx = sx; b.sz = sz; b.sang = finito(e[4]);
    if (b.snapInicial === undefined || Math.hypot(sx - b.x, sz - b.z) > 30 || b.estado === 'dormido') { b.x = sx; b.z = sz; b.ang = b.sang; b.snapInicial = true; }
    // muerte (por id de baja, así no se pierde si se salteó un estado)
    if (kid > b.kidVisto) {
      b.kidVisto = kid; b.kid = kid; b.dignos = Array.isArray(e[22]) ? e[22].map(String) : []; b.muerteT = 0; b.tMuerte = J.t;
      alMorirJefe(b);
    } else if (Array.isArray(e[22])) b.dignos = e[22].map(String);
    // transiciones de estado con efectos locales
    if (estado !== antes) transicionJefeProxy(b, antes, estado);
  }
}
function transicionJefeProxy(b, antes, ahora) {
  const d = b.def, cerca = Math.hypot(b.x - P.pos.x, b.z - P.pos.z);
  if (ahora === 'pelea' && antes !== 'pelea') {
    if (cerca < 280) {
      (G.jefes[d.id] = G.jefes[d.id] || { kills: 0 }).visto = true;
      sfx('rugido'); sacudir(22); musica('jefe'); bannerJefe(d);
      if (d.tierra) toast(`¡${d.nombre} se despertó!`, '#ff9d8a');
    }
  } else if (antes === 'pelea' && ahora !== 'pelea' && ahora !== 'muriendo') {
    limpiarPeligros();
    musica(enCombate() ? 'jefe' : 'isla');
    if (b.tierra && ahora === 'reinicio' && cerca < 300) toast(`${d.nombre} perdió el interés y volvió a su guarida.`, '#ffe39a');
  }
  if (ahora === 'mordiendo' && b.cebo && b.cebo.id === 'yo' && LINEA.jefe === b && (LINEA.estado === 'espera' || LINEA.estado === 'mordisqueo')) {
    LINEA.estado = 'picada'; LINEA.t = 0; LINEA.ventana = 1.8; LINEA.hundida = 1; LINEA.pez = null;
    toast('¡EL JEFE PICÓ! ¡Clavá!', '#ff8a7a'); chapoteo(LINEA.x, LINEA.z, 20, 1.8); sfx('rugido'); sacudir(22);
    RJ.ceboPend = null;
  }
  if ((ahora === 'huyendo' || ahora === 'patrulla' || ahora === 'oculto' || ahora === 'muerto') && LINEA.jefe === b && LINEA.estado !== 'pelea') { LINEA.jefe = null; if (LINEA.estado === 'picada') { LINEA.estado = 'espera'; LINEA.espera = 0; LINEA.esperaMax = 99; } }
  if (ahora === 'patrulla' && antes === 'muerto' && G.jefes[d.id] && G.jefes[d.id].kills > 0 && cerca < 600) toast(`${d.nombre} volvió a su guarida, más fuerte.`, '#ffb3a8');
}
// Cada cuadro, un jefe visto desde un juego que no es el anfitrión
function actualizarJefeProxy(b, dt) {
  b.t += dt;
  b.flash = Math.max(0, b.flash - dt * 4);
  b.emerge = Math.min(1, b.emerge + dt * 1.2);
  b.aturdido = Math.max(0, b.aturdido - dt);
  if (b.atk) b.atk.t += dt;
  if (b.sx !== undefined && !b.cuerpoLocal) {
    const k = Math.min(1, dt * 11);
    b.x += (b.sx - b.x) * k; b.z += (b.sz - b.z) * k;
    b.ang = b.ang + angDiff(b.ang, b.sang) * k;
  }
  if (b.estado === 'patrulla') avisoSombra(b);
  if (b.estado === 'muriendo') { if (b.tierra) muriendoJefeTierra(b, dt); else muriendoJefe(b, dt); } else if (b.estado === 'muerto') b.respawn = Math.max(0, b.respawn - dt);
  if (b.tierra) sincronizarJefeTierra(b, dt); else sincronizarJefe(b, dt);
}
// Las zonas rojas del anfitrión: se crean acá con la misma forma y el mismo reloj
function aplicarZonasAnfitrion(hp) {
  const hz = hp && hp.hz;
  if (!Array.isArray(hz)) return;
  for (const e of hz) {
    if (!Array.isArray(e) || e.length < 12) continue;
    const key = RED.hostId + ':' + e[0];
    if (RJ.vistas.has(key)) continue;
    RJ.vistas.set(key, J.t + 30);
    const tipo = e[1], delay = finito(e[7]), dmg = finito(e[8]), flags = e[9] | 0, edad = finito(e[10]), dur = finito(e[11]);
    const persiste = (flags & 56) !== 0;
    if (edad > delay + (persiste ? dur : 0.35)) continue; // llegó tarde
    const o = {};
    if (flags & 1) o.rayo = true; if (flags & 2) o.campo = true; if (flags & 4) o.impacto = true;
    if (flags & 8) { o.efecto = 'lento'; o.dur = dur; } else if (flags & 16) { o.efecto = 'veneno'; o.dur = dur; } else if (flags & 32) { o.efecto = 'fuego'; o.dur = dur; }
    if (flags & 64 && e.length >= 16) o.tent = { x: finito(e[12]), z: finito(e[13]), ancho: finito(e[14], 1), col: COLORES_TENT[e[15] | 0] || COLORES_TENT[0] };
    const x = finito(e[2]), z = finito(e[3]);
    const p = tipo === 0 ? peligroCirculo(x, z, finito(e[4], 3), delay, dmg, o) : peligroLinea(x, z, finito(e[4]), finito(e[5]), finito(e[6], 4), delay, dmg, o);
    p.t = edad;
    if (edad >= delay) { // ya había golpeado: solo queda la zona persistente
      p.res = true; p.tr = 0; p.persist = Math.max(0.1, dur - (edad - delay)); p.mat.uniforms.uK.value = 1;
      if (p.efecto === 'fuego') p.dmg = Math.max(2, Math.round(p.dmg * 0.3));
    }
  }
  if (RJ.vistas.size > 80) for (const [k, t] of RJ.vistas) if (t < J.t) RJ.vistas.delete(k);
}

// ---------------------------------------------------------------------------
// RESTO: lo que le pido al anfitrión
// ---------------------------------------------------------------------------
function acumularDanoRed(b, real) {
  const k = b.def.id;
  let o = RJ.dano[k];
  if (!o || o.vida !== b.vida) o = RJ.dano[k] = { vida: b.vida, total: 0 };
  o.total += real;
  RJ.danoSucio = true;
}
function pedirCebo(b, x, z) {
  RJ.cebo = [JEFES.indexOf(b.def), r1(x), r1(z), ++RJ.seqCebo];
  RJ.ceboPend = { b, t: J.t };
  RJ.pedidoSucio = true;
}
function pedirSoltarCebo() { RJ.ceboPend = null; }
function pedirEnganche(b) { RJ.enganche = [JEFES.indexOf(b.def), ++RJ.seqHk]; RJ.pedidoSucio = true; }
function publicarPedidos(dt) {
  const patch = {};
  RJ.tDano -= dt;
  if (RJ.danoSucio && RJ.tDano <= 0) { RJ.tDano = 0.2; RJ.danoSucio = false; patch.dm = Object.fromEntries(Object.entries(RJ.dano).map(([k, o]) => [k, [o.vida, Math.round(o.total)]])); }
  if (RJ.pedidoSucio) { RJ.pedidoSucio = false; patch.cb = RJ.cebo; patch.hk = RJ.enganche; }
  if (Object.keys(patch).length) RED.sala.presencia(patch);
  // la carnada que el anfitrión nunca aceptó: se devuelve
  const c = RJ.ceboPend;
  if (c && J.t - c.t > 3.5) {
    RJ.ceboPend = null;
    if (!(c.b.cebo && c.b.cebo.id === 'yo' && (c.b.estado === 'atraido' || c.b.estado === 'mordiendo' || c.b.estado === 'pelea'))) {
      if (LINEA.jefe === c.b && LINEA.estado !== 'pelea') LINEA.jefe = null;
      darItem('carnada', 1); toast('El jefe ya no estaba: te devolvimos la carnada.', '#ffe39a');
    }
  }
}

// ---------------------------------------------------------------------------
// Llamado cada cuadro desde la capa de red
// ---------------------------------------------------------------------------
function actualizarMundoRedJefes(dt) {
  const S = RED.sala;
  if (!S || !RED.activa) { RJ.tConexion = 0; RJ.listo = false; return; }
  RJ.tConexion += dt;
  if (RED.anfitrion) {
    publicarJefesAnfitrion(dt);
    atenderPedidos(dt);
  } else {
    const hp = presenciaAnfitrion();
    if (hp) { aplicarJefesAnfitrion(hp); aplicarZonasAnfitrion(hp); }
    publicarPedidos(dt);
  }
  // estoy listo para hacer de anfitrión cuando ya copié el mundo de otro, o si pasó un rato y no hay nadie que lo tenga
  if (!RJ.listo && (RJ.adoptado || (RJ.tConexion > 1.6 && !hayAnfitrionListo()))) { RJ.listo = true; S.presencia({ lh: 1 }); }
}
const hayAnfitrionListo = () => [...RED.remotos.values()].some((r) => r.p && r.p.lh === 1);
function reiniciarRedJefes() {
  RJ.zonas.length = 0; RJ.vistas.clear(); RJ.ultJf = ''; RJ.ultHz = ''; RJ.dano = {}; RJ.cebo = null; RJ.enganche = null; RJ.ceboPend = null;
  RJ.adoptado = false; RJ.tConexion = 0; RJ.listo = false;
  for (const b of BOSSES) { b.vidaVista = undefined; b.kidVisto = undefined; b.snapInicial = undefined; b.sx = undefined; }
}
