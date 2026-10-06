'use strict';
// Datos de la partida (G): plata, equipo, inventario, estadísticas. Se guardan en el navegador.

const CLAVE = 'isla-anzuelo-v1';
let G = nuevoG();

function nuevoG() {
  return {
    v: 1,
    plata: 0,
    cana: 0, partes: { carretel: 0, linea: 0, anzuelo: 0, senuelo: 0 },
    arpon: -1, red: -1, mochila: 0, chaleco: 0,
    botes: {}, boteAct: null, // botes comprados: id -> {x,z,ang}
    armas: {}, armaSel: null, municion: { balas: 0, cartuchos: 0, cohetes: 0 }, cargador: {}, // Nivel 2: armas que tenés, la elegida, balas de reserva y de cada cargador
    visitas: {}, // islas donde ya estuviste
    peces: [], // {id, kg, brillo}
    cuerpos: [], // cuerpos de jefes que todavía no vendiste: {id}
    items: { empanada: 2, vendas: 1 },
    carnadaArmada: false,
    stats: { capturas: 0, arponeados: 0, ventas: 0, vendido: 0, comidas: 0, curas: 0, apuestas: 0, ganadoCasino: 0, perdidoCasino: 0, muertes: 0, zonas: {}, mayorKg: 0, dinamitas: 0, piques: 0, escapados: 0, cortes: 0, jefesMatados: 0, segundos: 0 },
    bitacora: {}, // id -> {n, max, brillo, primera}
    jefes: {}, // id -> {kills, visto}
    mision: 0, // índice de la misión en curso
    barcoListo: false, fin: false,
    casino: { pozo: 5000 },
    mercado: { sat: {} },
    hora: 8, dia: 1, hambre: 100, hp: 100,
    ajustes: { sonido: true, musica: true, calidad: 1, ayuda: true },
    visto: {}, // ayudas ya mostradas
    pos: null,
  };
}

function guardar() {
  if (!J.partida) return false;
  try {
    if (typeof sincronizarBotesG === 'function') sincronizarBotesG();
    G.hora = J.hora; G.hambre = P.hambre; G.hp = P.hp;
    G.pos = { x: +P.pos.x.toFixed(2), z: +P.pos.z.toFixed(2) };
    localStorage.setItem(CLAVE, JSON.stringify(G));
    return true;
  } catch (e) { return false; }
}
function hayPartida() {
  try { return !!localStorage.getItem(CLAVE); } catch (e) { return false; }
}
function cargarPartida() {
  try {
    const raw = localStorage.getItem(CLAVE);
    if (!raw) return false;
    return aplicarG(JSON.parse(raw));
  } catch (e) { return false; }
}
// Mezcla lo guardado con los valores por defecto (por si se agregaron campos en una versión nueva)
function aplicarG(data) {
  const base = nuevoG();
  const merge = (a, b) => {
    for (const k in b) {
      if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]) && a[k] && typeof a[k] === 'object' && !Array.isArray(a[k])) merge(a[k], b[k]);
      else a[k] = b[k];
    }
    return a;
  };
  G = merge(base, data);
  return true;
}
function borrarPartida() {
  try { localStorage.removeItem(CLAVE); } catch (e) { /* sin acceso */ }
}

// ---------------------------------------------------------------------------
// Inventario y precios
// ---------------------------------------------------------------------------
const cupoUsado = () => G.peces.length + G.cuerpos.length * 4;
const cupoMax = () => MOCHILAS[G.mochila].cap;
const mochilaLlena = () => cupoUsado() >= cupoMax();
const tiene = (id) => (G.items[id] || 0) > 0;
function darItem(id, n = 1) {
  if (MUN_ID[id]) { G.municion[id] = Math.min(MUN_ID[id].max, (G.municion[id] || 0) + n); return; }
  G.items[id] = (G.items[id] || 0) + n;
}
function sacarItem(id, n = 1) { G.items[id] = Math.max(0, (G.items[id] || 0) - n); }

function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
// Demanda del día: cada especie se paga distinto según el día
const demandaDe = (id, dia) => 0.72 + 0.63 * hash2(hashStr(id) % 9973, dia * 7 + 3);
function demandaHoy(id) { return demandaDe(id, G.dia); }
function tendencia(id) {
  const a = demandaDe(id, G.dia), b = demandaDe(id, G.dia - 1);
  return a > b + 0.04 ? 1 : a < b - 0.04 ? -1 : 0;
}
const satur = (id) => (G.mercado.sat[id] === undefined ? 1 : G.mercado.sat[id]);
const kgMedio = (sp) => (sp.kg[0] + sp.kg[1]) / 2;
// Valor base de un pez (sin demanda): por especie, peso y brillo
function valorBase(p) {
  const sp = SP[p.id];
  return Math.max(1, Math.round(sp.precio * Math.pow(p.kg / kgMedio(sp), 0.85) * (p.brillo ? 3 : 1)));
}
function valorPez(p) {
  return Math.max(1, Math.round(valorBase(p) * demandaHoy(p.id) * satur(p.id)));
}
function valorCuerpo(c) { return Math.round(JEFE[c.id].precio * (0.92 + 0.16 * hash2(hashStr(c.id) % 997, G.dia))); }

// Equipo efectivo de la caña (con mejoras y bonos)
function bonoBuff(tipo) {
  let m = 1;
  for (const b of P.buffs) if ((b.id === tipo || b.id === 'todo') && b.hasta > J.t) m *= b.mult;
  return m;
}
function equipoCana() {
  const r = CANIAS[G.cana], pt = G.partes;
  const hamb = P.hambre < 20 ? 0.85 : 1;
  return {
    id: r.id, nombre: r.nombre, color: r.color,
    reel: r.fuerza * (1 + 0.08 * pt.carretel) * bonoBuff('fuerza') * hamb,
    line: r.aguante * (1 + 0.1 * pt.linea),
    alcance: r.alcance,
    suerte: r.suerte + 0.07 * pt.senuelo + (J.clima.lluvia > 0.4 ? 0.05 : 0),
    ventana: PESCA.ventanaPique + 0.12 * pt.anzuelo,
    atrae: 150 + 18 * pt.senuelo + 0.12 * r.alcance,
    dps: 22 * r.fuerza * (1 + 0.08 * pt.carretel) * bonoBuff('fuerza'),
  };
}
const arponActual = () => (G.arpon >= 0 ? ARPONES[G.arpon] : null);
const redActual = () => (G.red >= 0 ? REDES[G.red] : null);
function hpMaxActual() { return CHALECOS[G.chaleco].hp; }

// Registro en la bitácora
function registrarCaptura(id, kg, brillo) {
  const b = G.bitacora[id] || (G.bitacora[id] = { n: 0, max: 0, brillo: 0, primera: G.stats.segundos | 0 });
  const nuevo = b.n === 0;
  b.n++;
  const record = kg > b.max;
  if (record) b.max = kg;
  if (brillo) b.brillo++;
  return { nuevo, record };
}
