'use strict';
// Objetivos en orden: enseñan el juego y llevan hasta reparar el barco. Se cumplen solos al lograr la meta.

const jefeKills = (id) => (G.jefes[id] && G.jefes[id].kills) || 0;
const MISIONES = [
  { id: 'primeros', titulo: 'Primeros piques', desc: 'Pescá 3 peces. Apuntá al agua con la mira, hacé clic para lanzar y esperá el pique.', meta: 3, prog: () => G.stats.capturas, premio: { plata: 40 } },
  { id: 'vender', titulo: 'A vender', desc: 'Vendé tus peces en la pescadería de Doña Rosa (al sur, cerca del muelle). Acercate y apretá E.', meta: 1, prog: () => G.stats.ventas, premio: { plata: 60, items: { empanada: 1 } } },
  { id: 'comer', titulo: 'Panza llena', desc: 'Comé algo: apretá F para comer una empanada.', meta: 1, prog: () => G.stats.comidas, premio: { plata: 30 } },
  { id: 'cana1', titulo: 'Mejor equipo', desc: 'Comprá la Caña de Fibra en el almacén de Don Anselmo.', meta: 1, prog: () => (G.cana >= 1 ? 1 : 0), premio: { items: { vendas: 3 } } },
  { id: 'arpon', titulo: 'Cazador', desc: 'Comprá un arpón en el almacén y cazá 3 peces (tecla 2, apuntá a una sombra y clic).', meta: 3, prog: () => G.stats.arponeados, premio: { plata: 150, items: { dinamita: 2 } } },
  { id: 'arrecife', titulo: 'Aguas más hondas', desc: 'Pescá algo en El Arrecife (30 a 90 m de la costa). Lanzá desde la punta del muelle.', meta: 1, prog: () => G.stats.zonas.arrecife || 0, premio: { plata: 200 } },
  { id: 'casino', titulo: 'Probar suerte', desc: 'Pasá por el casino del Turco y jugá una vez. La casa siempre gana un poquito más seguido.', meta: 1, prog: () => G.stats.apuestas, premio: { plata: 100 } },
  { id: 'bote', titulo: 'A navegar', desc: 'Comprá un bote a remo en el almacén (pestaña Botes) y subite desde el muelle apretando E.', meta: 1, prog: () => (G.botes && G.botes.remo ? 1 : 0), premio: { plata: 200, items: { empanada: 2 } } },
  { id: 'pinza', titulo: 'El Rey del Arrecife', desc: 'Comprá carnada de jefe, armala con B, lanzá cerca de la sombra de Don Pinza (patrulla el arrecife) y vencelo.', meta: 1, prog: () => jefeKills('pinza'), premio: { plata: 3000, items: { dinamita: 5, botiquin: 2 } } },
  { id: 'mar', titulo: 'Mar abierto', desc: 'Pescá algo en el Mar Abierto (más de 90 m de la costa). Necesitás una lancha con motor.', meta: 1, prog: () => G.stats.zonas.mar || 0, premio: { plata: 1500 } },
  { id: 'diezmil', titulo: 'Primeros ahorros', desc: 'Juntá $10.000.', meta: 10000, prog: () => G.plata, premio: { items: { carnada: 1, botiquin: 1 } } },
  { id: 'matungo', titulo: 'Sombra en el agua', desc: 'Vencé al Matungo, el tiburón blanco del mar abierto.', meta: 1, prog: () => jefeKills('matungo'), premio: { plata: 8000, items: { botiquin: 3 } } },
  { id: 'abismo', titulo: 'Al abismo', desc: 'Pescá algo en El Abismo (más de 170 m de la costa). Con una lancha llegás al borde; el pesquero lo cruza.', meta: 1, prog: () => G.stats.zonas.abismo || 0, premio: { plata: 6000 } },
  { id: 'relampago', titulo: 'Tormenta eléctrica', desc: 'Vencé a La Relámpago. No te quedes quieto cuando carga.', meta: 1, prog: () => jefeKills('relampago'), premio: { plata: 25000, items: { elixir: 2 } } },
  { id: 'arsenal', titulo: 'Nivel 2: Isla Arsenal', desc: 'Navegá hasta la Isla Arsenal, al este: está más allá del mar abierto. Necesitás una lancha (o el pesquero) y atracar en su muelle.', meta: 1, prog: () => (G.visitas.arsenal ? 1 : 0), premio: { plata: 5000, items: { botiquin: 2 } } },
  { id: 'armeria', titulo: 'Fierros', desc: 'Comprá un arma en la armería del Sargento Roca (rifle o escopeta). Sacala con la tecla 5.', meta: 1, prog: () => (ARMAS.some((a) => G.armas[a.id]) ? 1 : 0), premio: { plata: 2000, items: { balas: 30, cartuchos: 12 } } },
  { id: 'gorila', titulo: 'El Rey de la Selva', desc: 'Vencé a Don Gorila, en el claro de la selva (noroeste de la isla). Esquivá el círculo rojo y pegale cuando se canse.', meta: 1, prog: () => jefeKills('gorila'), premio: { plata: 30000, items: { botiquin: 3 } } },
  { id: 'escorpion', titulo: 'La Dueña del Pedregal', desc: 'Vencé a La Reina Escorpión, en el pedregal del este. Cuando se entierra, mirá dónde se marca el círculo.', meta: 1, prog: () => jefeKills('escorpion'), premio: { plata: 60000, items: { elixir: 2 } } },
  { id: 'draco', titulo: 'El Dragón del Volcán', desc: 'Subí al volcán y vencé a Draco. Llevá curas, munición y buena cabeza: en la última fase llueven meteoros.', meta: 1, prog: () => jefeKills('draco'), premio: { plata: 150000, items: { elixir: 3 } } },
  { id: 'tentacula', titulo: 'Ocho brazos', desc: 'Vencé a Doña Tentácula en el abismo.', meta: 1, prog: () => jefeKills('tentacula'), premio: { plata: 70000, items: { elixir: 3 } } },
  { id: 'leviatan', titulo: 'El Señor de la Noche', desc: 'Vencé al Leviatán. Solo aparece de noche. Necesitás su corona.', meta: 1, prog: () => jefeKills('leviatan'), premio: { plata: 150000 } },
  { id: 'barco', titulo: 'Zarpar', desc: 'Reparar el barco del Capitán: $450.000 y la Corona del Leviatán.', meta: 1, prog: () => (G.barcoListo ? 1 : 0), premio: {} },
];

const misionActual = () => MISIONES[G.mision] || null;
function progresoMision() {
  const m = misionActual();
  if (!m) return '';
  const v = Math.min(m.meta, Math.floor(m.prog()));
  return m.meta > 1 ? (m.meta >= 1000 ? `${fmtMoney(v)} / ${fmtMoney(m.meta)}` : `${v} / ${m.meta}`) : (v >= 1 ? 'Listo' : 'Pendiente');
}
function textoMision() {
  const m = misionActual();
  return m ? m.id + progresoMision() : 'fin';
}
function revisarMisiones() {
  let guard = 0;
  while (guard++ < 20) {
    const m = misionActual();
    if (!m || m.prog() < m.meta) break;
    // cumplida
    G.mision++;
    const pr = m.premio || {};
    let txt = `¡Objetivo cumplido: ${m.titulo}!`;
    const partes = [];
    if (pr.plata) { G.plata += pr.plata; partes.push(fmtMoney(pr.plata)); }
    if (pr.items) for (const k in pr.items) { darItem(k, pr.items[k]); partes.push(`${pr.items[k]} ${ITEMS[k].nombre}`); }
    toast(txt, '#9bffb0');
    if (partes.length) toast('Premio: ' + partes.join(' + '), '#ffe36b');
    sfx('mision');
    const c = pecho();
    chispas(c.x, c.y + 0.6, c.z, '#ffe36b', 18, 5);
    HUD.cache.mision = null;
  }
}

// Llegar por primera vez a una isla del Nivel 2: cartel de bienvenida y objetivo cumplido
const VISITA = { t: 0 };
function actualizarVisitas(dt) {
  VISITA.t -= dt;
  if (VISITA.t > 0 || J.modo !== 'jugando') return;
  VISITA.t = 0.5;
  const is = islaDe(P.pos.x, P.pos.z, 38);
  if (!is || is.nivel !== 2 || G.visitas[is.id]) return;
  G.visitas[is.id] = true;
  bannerNivel('NIVEL 2', is.nombre, 'Armas, selva, pedregal y un volcán con dragón. Cuidado: acá los jefes no se pescan, se pelean.');
  sfx('mision');
  toast('Llegaste a la Isla Arsenal. La armería del Sargento Roca está en la plaza, junto al muelle.', '#ffe39a');
  revisarMisiones();
  guardar();
}
