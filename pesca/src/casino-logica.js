'use strict';
// Reglas y matemática del casino (sin interfaz): tragamonedas, ruleta, veintiuno, doble o nada y carrera de peces.
// Todo recibe un generador `rnd` (0 <= rnd() < 1) para poder probarlo con scripts. Los pagos se devuelven en "múltiplos de la apuesta"
// e INCLUYEN la apuesta (un pago de 0 es una pérdida, de 1 es empate).

const CASINO = {};

// ---------------------------------------------------------------------------
// Tragamonedas: tres rodillos, una línea. 13 casillas por rodillo (los pesos son cuántas casillas ocupa cada símbolo).
// El 7 triple se lleva el pozo progresivo (con apuesta de $500 o más). Retorno al jugador ≈ 94 %.
// ---------------------------------------------------------------------------
CASINO.traga = {
  simbolos: [
    { id: 'concha', ico: '🐚', peso: 4, triple: 7, par: 0.5 },
    { id: 'cangrejo', ico: '🦀', peso: 3, triple: 10, par: 0.75 },
    { id: 'ancla', ico: '⚓', peso: 2, triple: 20, par: 1 },
    { id: 'pulpo', ico: '🐙', peso: 2, triple: 35, par: 1.5 },
    { id: 'diamante', ico: '💎', peso: 1, triple: 100, par: 3 },
    { id: 'siete', ico: '7️⃣', peso: 1, triple: 0, par: 6, jackpot: true },
  ],
  aportePozo: 0.04, pozoInicial: 5000, apuestaMinPozo: 500,
  tira: [],
};
// La tira del rodillo: los símbolos intercalados para que no se junten los iguales
(() => {
  const T = CASINO.traga, rest = T.simbolos.map((s) => s.peso), n = rest.reduce((a, b) => a + b, 0);
  let ult = -1;
  for (let k = 0; k < n; k++) {
    let mejor = -1;
    for (let i = 0; i < rest.length; i++) if (rest[i] > 0 && i !== ult && (mejor < 0 || rest[i] > rest[mejor])) mejor = i;
    if (mejor < 0) mejor = rest.findIndex((r) => r > 0);
    T.tira.push(mejor); rest[mejor]--; ult = mejor;
  }
})();
// Resultado de una tirada. `pozo` es el pozo actual (para pagar el jackpot).
CASINO.traga.girar = function (apuesta, pozo, rnd = Math.random) {
  const T = CASINO.traga, n = T.tira.length;
  const paradas = [0, 1, 2].map(() => Math.floor(rnd() * n));
  const ids = paradas.map((p) => T.tira[p]);
  const [a, b, c] = ids;
  let mult = 0, tipo = 'nada', sim = null;
  if (a === b && b === c) {
    sim = T.simbolos[a];
    if (sim.jackpot) { tipo = apuesta >= T.apuestaMinPozo ? 'jackpot' : 'siete'; mult = tipo === 'jackpot' ? pozo / apuesta : 20; } else { tipo = 'triple'; mult = sim.triple; }
  } else if (a === b || b === c) { sim = T.simbolos[a === b ? a : b]; tipo = 'par'; mult = sim.par; }
  return { paradas, ids, tipo, mult, simbolo: sim, pago: Math.round(apuesta * mult) };
};

// ---------------------------------------------------------------------------
// Ruleta europea (0-36): retorno 97,3 %.
// ---------------------------------------------------------------------------
CASINO.ruleta = {
  rojos: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
  // orden de los números en la rueda
  rueda: [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26],
};
CASINO.ruleta.color = (n) => (n === 0 ? 'verde' : CASINO.ruleta.rojos.includes(n) ? 'rojo' : 'negro');
// tipos de apuesta: 'n:17' (pleno), 'rojo', 'negro', 'par', 'impar', 'falta' (1-18), 'pasa' (19-36), 'd1' 'd2' 'd3' (docenas), 'c1' 'c2' 'c3' (columnas)
CASINO.ruleta.gana = function (tipo, n) {
  if (tipo.startsWith('n:')) return +tipo.slice(2) === n;
  if (n === 0) return false;
  switch (tipo) {
    case 'rojo': return CASINO.ruleta.color(n) === 'rojo';
    case 'negro': return CASINO.ruleta.color(n) === 'negro';
    case 'par': return n % 2 === 0;
    case 'impar': return n % 2 === 1;
    case 'falta': return n <= 18;
    case 'pasa': return n >= 19;
    case 'd1': return n <= 12;
    case 'd2': return n >= 13 && n <= 24;
    case 'd3': return n >= 25;
    case 'c1': return n % 3 === 1;
    case 'c2': return n % 3 === 2;
    case 'c3': return n % 3 === 0;
    default: return false;
  }
};
CASINO.ruleta.paga = (tipo) => (tipo.startsWith('n:') ? 35 : /^[dc]\d$/.test(tipo) ? 2 : 1); // "35 a 1", "2 a 1", "1 a 1"
// Cuánto devuelve la mesa por todas las fichas (las ganadoras cobran apuesta + premio)
CASINO.ruleta.resolver = function (apuestas, n) {
  let devuelto = 0, total = 0;
  const ganadoras = [];
  for (const tipo in apuestas) {
    const m = apuestas[tipo];
    total += m;
    if (CASINO.ruleta.gana(tipo, n)) { devuelto += m * (1 + CASINO.ruleta.paga(tipo)); ganadoras.push(tipo); }
  }
  return { devuelto, total, neto: devuelto - total, ganadoras };
};
CASINO.ruleta.girar = (rnd = Math.random) => Math.floor(rnd() * 37);

// ---------------------------------------------------------------------------
// Veintiuno: zapato de 4 mazos, el crupier se planta con 17 (incluso blando), blackjack paga 3 a 2, se puede doblar con las dos
// primeras cartas. Sin dividir ni seguro. Con buena estrategia la casa gana ~0,6 %.
// ---------------------------------------------------------------------------
CASINO.bj = { palos: ['♠', '♥', '♦', '♣'], rangos: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] };
CASINO.bj.zapato = function (rnd = Math.random, mazos = 4) {
  const z = [];
  for (let m = 0; m < mazos; m++) for (let p = 0; p < 4; p++) for (let r = 0; r < 13; r++) z.push({ r: CASINO.bj.rangos[r], p: CASINO.bj.palos[p] });
  for (let i = z.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [z[i], z[j]] = [z[j], z[i]]; }
  return z;
};
CASINO.bj.valorCarta = (c) => (c.r === 'A' ? 11 : 'JQK'.includes(c.r) || c.r === '10' ? 10 : +c.r);
// {total, blando}: blando = hay un as contando 11
CASINO.bj.valor = function (mano) {
  let t = 0, ases = 0;
  for (const c of mano) { t += CASINO.bj.valorCarta(c); if (c.r === 'A') ases++; }
  while (t > 21 && ases > 0) { t -= 10; ases--; }
  return { total: t, blando: ases > 0 };
};
CASINO.bj.esBlackjack = (mano) => mano.length === 2 && CASINO.bj.valor(mano).total === 21;
// El crupier pide hasta llegar a 17. Devuelve las cartas que sacó.
CASINO.bj.juegaCrupier = function (zapato, mano) {
  const sacadas = [];
  while (CASINO.bj.valor(mano).total < 17) { const c = zapato.pop(); mano.push(c); sacadas.push(c); }
  return sacadas;
};
// Múltiplo que devuelve la mesa (incluye la apuesta). `apuesta` ya incluye el doble si se dobló.
CASINO.bj.resolver = function (jugador, crupier, doblada) {
  const vj = CASINO.bj.valor(jugador).total, vc = CASINO.bj.valor(crupier).total;
  const bjJ = CASINO.bj.esBlackjack(jugador) && !doblada, bjC = CASINO.bj.esBlackjack(crupier);
  if (vj > 21) return { mult: 0, txt: 'Te pasaste' };
  if (bjJ && !bjC) return { mult: 2.5, txt: '¡Veintiuno natural!' };
  if (bjC && !bjJ) return { mult: 0, txt: 'Veintiuno del crupier' };
  if (vc > 21) return { mult: 2, txt: 'El crupier se pasó' };
  if (vj > vc) return { mult: 2, txt: 'Ganaste' };
  if (vj === vc) return { mult: 1, txt: 'Empate' };
  return { mult: 0, txt: 'Gana la casa' };
};
// Estrategia básica (solo para las pruebas y la ayuda "consejo del Turco"): 'pedir' | 'plantar' | 'doblar'
CASINO.bj.consejo = function (jugador, cartaCrupier, puedeDoblar) {
  const { total, blando } = CASINO.bj.valor(jugador), d = CASINO.bj.valorCarta(cartaCrupier);
  if (blando) {
    if (total >= 19) return 'plantar';
    if (total === 18) return puedeDoblar && d >= 3 && d <= 6 ? 'doblar' : d >= 9 ? 'pedir' : 'plantar';
    if (puedeDoblar && total >= 15 && d >= 4 && d <= 6) return 'doblar';
    if (puedeDoblar && total >= 17 && d === 6) return 'doblar';
    return 'pedir';
  }
  if (total >= 17) return 'plantar';
  if (total >= 13) return d <= 6 ? 'plantar' : 'pedir';
  if (total === 12) return d >= 4 && d <= 6 ? 'plantar' : 'pedir';
  if (total === 11) return puedeDoblar ? 'doblar' : 'pedir';
  if (total === 10) return puedeDoblar && d <= 9 ? 'doblar' : 'pedir';
  if (total === 9) return puedeDoblar && d >= 3 && d <= 6 ? 'doblar' : 'pedir';
  return 'pedir';
};

// ---------------------------------------------------------------------------
// Doble o nada: la moneda del Turco cae de tu lado el 48 % de las veces. Hasta 8 aciertos seguidos (x256).
// ---------------------------------------------------------------------------
CASINO.doble = { prob: 0.48, maxRacha: 8, tope: 3000000 };
CASINO.doble.tirar = (rnd = Math.random) => rnd() < CASINO.doble.prob;

// ---------------------------------------------------------------------------
// Carrera de peces: seis peces con distinta fuerza. La cuota paga 88 % de lo que "debería" (la casa se queda con el 12 %).
// ---------------------------------------------------------------------------
CASINO.carrera = { n: 6, retorno: 0.88 };
// pool: ids de especies; genera una carrera. `fuerza` va de 0.6 a 1.6 y define la chance de ganar.
CASINO.carrera.generar = function (pool, rnd = Math.random) {
  const C = CASINO.carrera, ids = pool.slice();
  for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
  const fuerzas = ids.slice(0, C.n).map(() => 0.55 + rnd() * 1.1);
  const q = fuerzas.map((f) => f * f), sum = q.reduce((a, b) => a + b, 0);
  const peces = ids.slice(0, C.n).map((id, i) => {
    const p = q[i] / sum;
    return { id, fuerza: fuerzas[i], p, cuota: Math.max(1.2, Math.round((C.retorno / p) * 10) / 10) };
  });
  // quién gana: sorteo según la chance
  let u = rnd(), ganador = 0;
  for (let i = 0; i < peces.length; i++) { u -= peces[i].p; if (u <= 0) { ganador = i; break; } ganador = i; }
  // tiempos de llegada: el ganador llega primero; el resto detrás (los más fuertes, más cerca)
  const tg = 6.4 + rnd() * 0.8;
  peces.forEach((f, i) => { f.T = i === ganador ? tg : tg + 0.15 + rnd() * (0.7 + (1.7 - f.fuerza)); f.fase = rnd() * 6.28; });
  return { peces, ganador };
};
// Avance (0..1) del pez `f` a los `t` segundos de carrera: parte de una recta hacia la meta y le suma ondas que se apagan al llegar
CASINO.carrera.avance = function (f, t) {
  if (t >= f.T) return 1;
  const u = t / f.T, ond = Math.sin(t * 2.1 + f.fase) * 0.045 + Math.sin(t * 4.7 + f.fase * 2) * 0.02;
  return Math.max(0, Math.min(0.999, u + ond * Math.sin(u * Math.PI)));
};
