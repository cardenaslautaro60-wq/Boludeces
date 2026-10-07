'use strict';
// Casino El Anzuelo de Oro: un panel con cinco juegos. La matemática vive en casino-logica.js (CASINO).
// El dinero se descuenta al apostar y se cobra al terminar la animación (si cerrás el panel en medio, se cobra al instante).

const CAS = {
  apuesta: 500, ocupado: false, pend: null, cierre: null, timer: 0, raf: 0,
  turco: '¡Pase, amigo! La casa invita... a perder.',
  traga: { paradas: [2, 7, 10], msg: '' },
  ruleta: { ap: {}, ultimas: [], rep: null, resultado: null, msg: '', ang: 0, casillero: -1 },
  bj: { fase: 'apuesta', zapato: null, jug: [], cru: [], apuesta: 0, doblada: false, oculta: false, resuelto: true, msg: '' },
  doble: { fase: 'apuesta', apuesta: 0, pozo: 0, racha: 0, msg: '', lado: null, girando: null },
  carrera: { datos: null, elegido: 0, fase: 'apuesta', t: 0, msg: '', apuesta: 0 },
};
const FRASES_TURCO = {
  gana: ['¡Bien jugado, amigo! La suerte lo quiere.', 'Mmm... el próximo me lo lleva a mí.', 'Suerte de principiante. Ya se le va a pasar.', 'Cobre, cobre... y vuelva, que la casa extraña.'],
  pierde: ['La casa agradece su contribución.', 'Casi, amigo, casi...', 'Así es la vida del pescador: unas veces se pesca, otras se pierde.', '¿Doble o nada? No se me achique.', 'El mar da y el Turco quita.'],
  grande: ['¡¡CARAMBA!! ¿Seguro que no hace trampa?', '¡Que alguien me traiga un té! Me tiemblan las manos...', 'Esto no figura en mi contrato...'],
  empate: ['Tablas. Ni fu ni fa.', 'Ni usted ni yo. Otra.'],
};
const frase = (k) => FRASES_TURCO[k][Math.floor(Math.random() * FRASES_TURCO[k].length)];
const abrevFicha = (v) => (v >= 1000000 ? v / 1000000 + 'M' : v >= 1000 ? v / 1000 + 'K' : String(v));
const COL_FICHA = { 10: '#8a8a94', 50: '#3f7fd9', 100: '#c8423a', 500: '#2fa05a', 1000: '#7a4cc0', 5000: '#e08a1e', 25000: '#222a3a', 100000: '#b8962e', 500000: '#d33a8a' };

// ---- Dinero ------------------------------------------------------------------
function casApostar(n) { G.plata -= n; G.stats.apuestas++; sfx('ficha'); }
// Cobra el pago pendiente (apuesta total en juego y lo que devuelve la mesa)
function casLiquidar() {
  const p = CAS.pend;
  if (!p) return;
  CAS.pend = null;
  G.plata += p.pago;
  const neto = p.pago - p.apuesta;
  if (neto > 0) G.stats.ganadoCasino += neto; else if (neto < 0) G.stats.perdidoCasino += -neto;
  CAS.turco = p.turco || (neto > p.apuesta * 9 ? frase('grande') : neto > 0 ? frase('gana') : neto < 0 ? frase('pierde') : frase('empate'));
  if (p.jackpot) sfx('jackpot'); else if (neto > 0) sfx(neto >= p.apuesta * 8 ? 'tesoro' : 'gana'); else if (neto < 0) sfx('pierde'); else sfx('click');
  revisarMisiones();
  guardar();
}
function casDetener() {
  clearInterval(CAS.timer); clearTimeout(CAS.timer); CAS.timer = 0;
  cancelAnimationFrame(CAS.raf); CAS.raf = 0;
  const f = CAS.cierre; CAS.cierre = null;
  if (f) f();
  casLiquidar();
  CAS.ocupado = false;
}
function casAjustarApuesta() {
  const ok = FICHAS.filter((f) => f <= G.plata);
  if (CAS.apuesta > G.plata) CAS.apuesta = ok.length ? ok[ok.length - 1] : FICHAS[0];
}
const casFichas = () => `<div class="fichas">${FICHAS.map((v) => `<button class="ficha ${CAS.apuesta === v ? 'on' : ''}" style="--c:${COL_FICHA[v]}" data-act="ficha" data-v="${v}" ${CAS.ocupado || v > G.plata ? 'disabled' : ''} title="${fmtMoney(v)}">${abrevFicha(v)}</button>`).join('')}</div>`;
ACC.ficha = (d) => { if (!CAS.ocupado && +d.v <= G.plata) { CAS.apuesta = +d.v; sfx('ficha'); } };

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------
PANELES.casino = {
  titulo: 'Casino El Anzuelo de Oro', tabs: [['traga', '🎰 Tragamonedas'], ['ruleta', '🎡 Ruleta'], ['bj', '🃏 Veintiuno'], ['doble', '🪙 Doble o nada'], ['carrera', '🐟 Carrera de peces']], tab0: 'traga', clase: 'ancha casino', musica: 'casino',
  ocupado: () => CAS.ocupado,
  pieExtra: () => '<span class="legal">A la larga la casa siempre gana. Todo es dinero de mentira.</span>',
  render(tab) {
    casAjustarApuesta();
    const juego = tab === 'ruleta' ? casRuleta() : tab === 'bj' ? casBj() : tab === 'doble' ? casDoble() : tab === 'carrera' ? casCarrera() : casTraga();
    return `<div class="turco"><span class="cara">🎩</span><p>${esc(CAS.turco)}</p></div>${juego}`;
  },
  despues() { if (PANEL.tab === 'ruleta') dibujarRuleta(CAS.ruleta.ang, CAS.ruleta.casillero >= 0 && !CAS.ocupado ? { ang: CAS.ruleta.casillero * (TAU / 37), rad: 0.8 } : null); },
  alCerrar() { casDetener(); },
};

// ---------------------------------------------------------------------------
// 1) Tragamonedas
// ---------------------------------------------------------------------------
function casTraga() {
  const T = CASINO.traga, n = T.tira.length, S = CAS.traga;
  const cel = (k, d) => T.simbolos[T.tira[(S.paradas[k] + d + n) % n]].ico;
  const rod = [0, 1, 2].map((k) => `<div class="rod" id="rod${k}"><i>${cel(k, -1)}</i><i class="mid">${cel(k, 0)}</i><i>${cel(k, 1)}</i></div>`).join('');
  const pagos = T.simbolos.map((s) => `<div><span>${s.ico}${s.ico}${s.ico}</span><b>${s.jackpot ? 'POZO' : '×' + s.triple}</b></div>`).join('');
  return `<div class="traga">
    <div class="izq">
      <div class="pozo">🏆 POZO PROGRESIVO <b id="pozo">${fmtMoney(G.casino.pozo)}</b><small>Tres 7️⃣ con una apuesta de ${fmtMoney(T.apuestaMinPozo)} o más se llevan todo el pozo.</small></div>
      <div class="maquina"><div class="rodillos">${rod}<div class="payline"></div></div></div>
    </div>
    <div class="der">
      <div class="msg" id="traga-msg">${esc(S.msg || 'Elegí tu apuesta y tirá de la palanca.')}</div>
      ${casFichas()}
      <div class="grande">${btn('girar', `🎰 GIRAR · ${fmtMoney(CAS.apuesta)}`, { cls: 'verde', off: CAS.ocupado || G.plata < CAS.apuesta })}</div>
      <div class="pagos">${pagos}<div class="par"><span>Dos iguales juntos</span><b>×0,5 a ×6</b></div></div>
    </div>
  </div>`;
}
ACC.girar = () => {
  const T = CASINO.traga, ap = CAS.apuesta;
  if (CAS.ocupado || G.plata < ap) { sfx('error'); return; }
  casApostar(ap);
  G.casino.pozo += Math.round(ap * T.aportePozo);
  const r = T.girar(ap, G.casino.pozo);
  const jack = r.tipo === 'jackpot';
  if (jack) G.casino.pozo = T.pozoInicial;
  const sim = r.simbolo;
  const txt = jack ? `¡¡JACKPOT!! Te llevás el pozo: ${fmtMoney(r.pago)}` : r.tipo === 'triple' ? `¡Tres ${sim.ico}! Ganás ${fmtMoney(r.pago)}` : r.tipo === 'siete' ? `¡Tres 7️⃣! Ganás ${fmtMoney(r.pago)} (para el pozo hay que apostar ${fmtMoney(T.apuestaMinPozo)} o más)` : r.tipo === 'par' ? (r.pago >= ap ? `Par de ${sim.ico}: ganás ${fmtMoney(r.pago - ap)}` : `Par de ${sim.ico}: recuperás ${fmtMoney(r.pago)}`) : 'Nada esta vez...';
  CAS.pend = { apuesta: ap, pago: r.pago, jackpot: jack };
  CAS.ocupado = true; CAS.traga.msg = '';
  const parar = [false, false, false], stop = [650, 1100, 1600], t0 = performance.now(), n = T.tira.length;
  const fin = () => { CAS.traga.paradas = r.paradas; CAS.traga.msg = txt; };
  CAS.cierre = fin;
  let tick = 0;
  CAS.timer = setInterval(() => {
    const dt = performance.now() - t0;
    for (let k = 0; k < 3; k++) {
      const el = $('#rod' + k);
      if (!el || parar[k]) continue;
      if (dt >= stop[k]) {
        parar[k] = true; sfx('tick'); el.classList.add('para');
        const ic = el.children; for (let i = 0; i < 3; i++) ic[i].textContent = T.simbolos[T.tira[(r.paradas[k] + i - 1 + n) % n]].ico;
      } else { const ic = el.children; for (let i = 0; i < 3; i++) ic[i].textContent = T.simbolos[T.tira[Math.floor(Math.random() * n)]].ico; }
    }
    if (++tick % 2 === 0) sfx('gira');
    if (parar.every(Boolean) || !$('#rod0')) { casDetener(); renderPanel(); }
  }, 75);
};

// ---------------------------------------------------------------------------
// 2) Ruleta europea
// ---------------------------------------------------------------------------
const RUL_FILAS = [[3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36], [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35], [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]];
const totalRul = () => Object.values(CAS.ruleta.ap).reduce((a, b) => a + b, 0);
function casRuleta() {
  const R = CAS.ruleta, ap = R.ap;
  const chip = (t) => (ap[t] ? `<em class="chipmini">${abrevFicha(ap[t])}</em>` : '');
  const off = CAS.ocupado ? 'disabled' : '';
  const col = (n) => CASINO.ruleta.color(n);
  let mesa = `<button class="num cero" data-act="apRul" data-t="n:0" style="grid-row:1/span 3;grid-column:1" ${off}>0${chip('n:0')}</button>`;
  RUL_FILAS.forEach((fila, r) => fila.forEach((n, c) => { mesa += `<button class="num ${col(n)}" data-act="apRul" data-t="n:${n}" style="grid-row:${r + 1};grid-column:${c + 2}" ${off}>${n}${chip('n:' + n)}</button>`; }));
  ['c3', 'c2', 'c1'].forEach((t, r) => { mesa += `<button class="num ext" data-act="apRul" data-t="${t}" style="grid-row:${r + 1};grid-column:14" ${off}>2:1${chip(t)}</button>`; });
  [['d1', '1ª docena'], ['d2', '2ª docena'], ['d3', '3ª docena']].forEach(([t, n], i) => { mesa += `<button class="num ext" data-act="apRul" data-t="${t}" style="grid-row:4;grid-column:${2 + i * 4}/span 4" ${off}>${n}${chip(t)}</button>`; });
  [['falta', '1-18'], ['par', 'Par'], ['rojo', '◆ Rojo'], ['negro', '◆ Negro'], ['impar', 'Impar'], ['pasa', '19-36']].forEach(([t, n], i) => { mesa += `<button class="num ext ${t === 'rojo' ? 'rojo' : t === 'negro' ? 'negro' : ''}" data-act="apRul" data-t="${t}" style="grid-row:5;grid-column:${2 + i * 2}/span 2" ${off}>${n}${chip(t)}</button>`; });
  const hist = R.ultimas.slice(0, 14).map((n) => `<i class="bola ${col(n)}">${n}</i>`).join('');
  const total = totalRul();
  return `<div class="ruleta">
    <div class="rul-izq"><canvas id="rul-cv" width="240" height="240"></canvas>
      <div class="rul-res">${R.resultado === null ? '<span class="vacio">¡Hagan sus apuestas!</span>' : `<i class="bola grande ${col(R.resultado)}">${R.resultado}</i>`}</div>
      <div class="hist">${hist}</div></div>
    <div class="rul-der"><div class="mesa">${mesa}</div>
      <div class="msg" id="rul-msg">${esc(R.msg || 'Tocá la mesa para apostar · pleno 35:1 · docenas y columnas 2:1 · el resto 1:1')}</div>
      <div class="grande">${btn('rulGirar', `🎡 GIRAR · ${fmtMoney(total)}`, { cls: 'verde', off: CAS.ocupado || total <= 0 })}${btn('rulBorrar', 'Borrar', { cls: 'gris', off: CAS.ocupado || total <= 0 })}${btn('rulRepetir', 'Repetir', { cls: 'gris', off: CAS.ocupado || !R.rep })}${btn('rulDoblar', 'Doblar', { cls: 'gris', off: CAS.ocupado || total <= 0 || total * 2 > G.plata })}</div>
      ${casFichas()}
    </div></div>`;
}
ACC.apRul = (d) => {
  if (CAS.ocupado) return;
  if (totalRul() + CAS.apuesta > G.plata) { sfx('error'); toast('No te alcanza para esa ficha.', '#ffb3a8'); return; }
  CAS.ruleta.ap[d.t] = (CAS.ruleta.ap[d.t] || 0) + CAS.apuesta; sfx('ficha');
};
ACC.rulBorrar = () => { if (!CAS.ocupado) { CAS.ruleta.ap = {}; sfx('click'); } };
ACC.rulRepetir = () => { const r = CAS.ruleta; if (!CAS.ocupado && r.rep) { const t = Object.values(r.rep).reduce((a, b) => a + b, 0); if (t <= G.plata) { r.ap = Object.assign({}, r.rep); sfx('ficha'); } else sfx('error'); } };
ACC.rulDoblar = () => { const r = CAS.ruleta; if (!CAS.ocupado && totalRul() * 2 <= G.plata) { for (const k in r.ap) r.ap[k] *= 2; sfx('ficha'); } };

// La rueda: 37 sectores. `rot` gira la rueda; `bola` = {ang (relativo a la rueda), rad (0..1)} o null
function dibujarRuleta(rot = CAS.ruleta.ang, bola = null) {
  const cv = $('#rul-cv');
  if (!cv) return;
  const g = cv.getContext('2d'), W = cv.width, c = W / 2, R = c - 6, rueda = CASINO.ruleta.rueda, n = rueda.length, da = TAU / n;
  g.clearRect(0, 0, W, W);
  g.save(); g.translate(c, c);
  g.fillStyle = '#4a2a10'; g.beginPath(); g.arc(0, 0, R + 4, 0, TAU); g.fill();
  g.rotate(rot);
  for (let i = 0; i < n; i++) {
    const a0 = i * da - da / 2 - Math.PI / 2, num = rueda[i], col = CASINO.ruleta.color(num);
    g.fillStyle = col === 'verde' ? '#1f8a4a' : col === 'rojo' ? '#c8302a' : '#1c1c24';
    g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, R, a0, a0 + da); g.closePath(); g.fill();
    g.save(); g.rotate(a0 + da / 2); g.fillStyle = '#f6ecd0'; g.font = 'bold 11px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.translate(R * 0.84, 0); g.rotate(Math.PI / 2); g.fillText(String(num), 0, 0); g.restore();
  }
  g.strokeStyle = '#d6b24a'; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, R, 0, TAU); g.stroke();
  g.fillStyle = '#2a1a0c'; g.beginPath(); g.arc(0, 0, R * 0.66, 0, TAU); g.fill();
  g.strokeStyle = '#d6b24a'; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, R * 0.66, 0, TAU); g.stroke();
  g.fillStyle = '#c9a227'; g.beginPath(); g.arc(0, 0, R * 0.2, 0, TAU); g.fill();
  g.fillStyle = '#7a5a10'; g.beginPath(); g.arc(0, 0, R * 0.08, 0, TAU); g.fill();
  if (bola) {
    const a = bola.ang - Math.PI / 2, r = R * bola.rad;
    g.fillStyle = '#fff'; g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 4;
    g.beginPath(); g.arc(Math.cos(a) * r, Math.sin(a) * r, 5.5, 0, TAU); g.fill();
  }
  g.restore();
  // marca fija arriba
  g.fillStyle = '#ffe36b'; g.beginPath(); g.moveTo(c - 7, 2); g.lineTo(c + 7, 2); g.lineTo(c, 14); g.closePath(); g.fill();
}
ACC.rulGirar = () => {
  const R = CAS.ruleta, total = totalRul();
  if (CAS.ocupado || total <= 0 || total > G.plata) { sfx('error'); return; }
  casApostar(total);
  const n = CASINO.ruleta.girar(), res = CASINO.ruleta.resolver(R.ap, n);
  const txt = `Salió el ${n} (${CASINO.ruleta.color(n)}). ` + (res.neto > 0 ? `¡Ganás ${fmtMoney(res.neto)}!` : res.neto === 0 ? 'Recuperás lo apostado.' : `Perdés ${fmtMoney(-res.neto)}.`);
  CAS.pend = { apuesta: total, pago: res.devuelto };
  CAS.ocupado = true; R.msg = ''; R.casillero = -1;
  const rep = Object.assign({}, R.ap), idx = CASINO.ruleta.rueda.indexOf(n);
  CAS.cierre = () => { R.resultado = n; R.casillero = idx; R.ultimas.unshift(n); R.rep = rep; R.ap = {}; R.msg = txt; };
  const T = 4.6, t0 = performance.now(), rot0 = R.ang || Math.random() * TAU;
  // la rueda frena con el casillero ganador justo bajo la marca de arriba
  const giro = 2.5 * TAU + ((((-idx * (TAU / 37) - rot0 - 2.5 * TAU) % TAU) + TAU) % TAU);
  const ease = (s) => 1 - Math.pow(1 - s, 3);
  let tkAnt = -1;
  const paso = () => {
    const s = Math.min(1, (performance.now() - t0) / 1000 / T), rot = rot0 + giro * ease(s);
    // la bola gira al revés respecto de la rueda y se frena justo en el casillero ganador
    const ang = idx * (TAU / 37) - (1 - ease(Math.min(1, s * 1.08))) * 7 * TAU;
    dibujarRuleta(rot, { ang, rad: s < 0.7 ? 0.93 : 0.93 - ((s - 0.7) / 0.3) * 0.13 });
    R.ang = rot;
    const tk = Math.floor(s * 28);
    if (tk !== tkAnt && s < 0.92) { tkAnt = tk; sfx('tick'); }
    if (s >= 1 || !$('#rul-cv')) { casDetener(); renderPanel(); } else CAS.raf = requestAnimationFrame(paso);
  };
  CAS.raf = requestAnimationFrame(paso);
};

// ---------------------------------------------------------------------------
// 3) Veintiuno
// ---------------------------------------------------------------------------
const cartaHtml = (c, oculta) => (oculta ? '<span class="carta dorso"></span>' : `<span class="carta ${c.p === '♥' || c.p === '♦' ? 'rojo' : ''}">${c.r}<small>${c.p}</small></span>`);
function casBj() {
  const B = CAS.bj, V = CASINO.bj.valor;
  const jugando = B.fase === 'jugando';
  const vj = B.jug.length ? V(B.jug) : null, vc = B.cru.length ? V(B.oculta ? [B.cru[0]] : B.cru) : null;
  const tot = (v) => (v ? `<b class="tot ${v.total > 21 ? 'pasado' : ''}">${v.total}${v.blando && v.total <= 21 ? ' (blando)' : ''}</b>` : '');
  const mano = (cs, ocultaSeg) => cs.map((c, i) => cartaHtml(c, ocultaSeg && i === 1)).join('');
  let ctl;
  if (jugando) {
    const puedeDoblar = B.jug.length === 2 && G.plata >= B.apuesta;
    ctl = `<div class="grande">${btn('bjPedir', 'Pedir', { cls: 'verde', off: CAS.ocupado })}${btn('bjPlantar', 'Plantarme', { cls: 'naranja', off: CAS.ocupado })}${btn('bjDoblar', `Doblar · ${fmtMoney(B.apuesta)}`, { cls: 'azul', off: CAS.ocupado || !puedeDoblar })}</div>`;
  } else ctl = `${casFichas()}<div class="grande">${btn('bjRepartir', `🃏 ${B.fase === 'fin' ? 'Otra mano' : 'Repartir'} · ${fmtMoney(CAS.apuesta)}`, { cls: 'verde', off: CAS.ocupado || G.plata < CAS.apuesta })}</div>`;
  return `<div class="bj">
    <div class="paño">
      <div class="mano"><h4>Crupier ${tot(vc)}</h4><div class="cartas">${B.cru.length ? mano(B.cru, B.oculta) : '<span class="carta vacia"></span>'}</div></div>
      <div class="mano"><h4>Vos ${tot(vj)}${B.apuesta ? `<small> · apuesta ${fmtMoney(B.apuesta * (B.doblada ? 2 : 1))}</small>` : ''}</h4><div class="cartas">${B.jug.length ? mano(B.jug) : '<span class="carta vacia"></span>'}</div></div>
    </div>
    <div class="msg" id="bj-msg">${esc(B.msg || 'El crupier se planta con 17. El veintiuno natural paga 3 a 2. Podés doblar con tus dos primeras cartas.')}</div>
    ${ctl}</div>`;
}
function bjSacar() {
  const B = CAS.bj;
  if (!B.zapato || B.zapato.length < 40) B.zapato = CASINO.bj.zapato();
  sfx('carta');
  return B.zapato.pop();
}
ACC.bjRepartir = () => {
  const B = CAS.bj, ap = CAS.apuesta;
  if (CAS.ocupado || G.plata < ap) { sfx('error'); return; }
  casApostar(ap);
  B.apuesta = ap; B.doblada = false; B.msg = ''; B.oculta = true; B.resuelto = false;
  B.jug = [bjSacar(), bjSacar()]; B.cru = [bjSacar(), bjSacar()];
  B.fase = 'jugando';
  if (CASINO.bj.esBlackjack(B.jug) || CASINO.bj.esBlackjack(B.cru)) bjTerminar(); // natural: se resuelve de una
};
ACC.bjPedir = () => {
  const B = CAS.bj;
  if (B.fase !== 'jugando' || CAS.ocupado) return;
  B.jug.push(bjSacar());
  const v = CASINO.bj.valor(B.jug).total;
  if (v >= 21) bjTerminar();
};
ACC.bjDoblar = () => {
  const B = CAS.bj;
  if (B.fase !== 'jugando' || CAS.ocupado || B.jug.length !== 2 || G.plata < B.apuesta) { sfx('error'); return; }
  casApostar(B.apuesta); G.stats.apuestas--;
  B.doblada = true;
  B.jug.push(bjSacar());
  bjTerminar();
};
ACC.bjPlantar = () => { if (CAS.bj.fase === 'jugando' && !CAS.ocupado) bjTerminar(); };
// Termina la mano: el crupier da vuelta la carta y saca las suyas (con pausa entre cada una) y se cobra
function bjTerminar() {
  const B = CAS.bj, V = CASINO.bj.valor;
  CAS.ocupado = true; B.fase = 'crupier'; B.oculta = false;
  const necesita = V(B.jug).total <= 21 && !CASINO.bj.esBlackjack(B.jug) && !CASINO.bj.esBlackjack(B.cru);
  // resuelve todo de golpe (también si cierran el panel en medio de la animación)
  CAS.cierre = () => {
    if (B.resuelto) return;
    B.resuelto = true;
    if (necesita) while (V(B.cru).total < 17) B.cru.push(B.zapato.pop());
    B.oculta = false; B.fase = 'fin';
    const apuestaTot = B.apuesta * (B.doblada ? 2 : 1), r = CASINO.bj.resolver(B.jug, B.cru, B.doblada);
    B.msg = r.txt + (r.mult > 1 ? ` · ganás ${fmtMoney(apuestaTot * r.mult - apuestaTot)}` : r.mult === 1 ? ' · recuperás tu apuesta' : ` · perdés ${fmtMoney(apuestaTot)}`);
    CAS.pend = { apuesta: apuestaTot, pago: Math.round(apuestaTot * r.mult) };
    B.apuesta = 0;
  };
  sfx('carta');
  const fin = () => { casDetener(); renderPanel(); };
  const paso = () => {
    if (!CAS.ocupado) return;
    if (V(B.cru).total < 17) { B.cru.push(bjSacar()); renderPanel(); CAS.timer = setTimeout(paso, 650); } else CAS.timer = setTimeout(fin, 500);
  };
  renderPanel();
  CAS.timer = setTimeout(necesita ? paso : fin, necesita ? 650 : 700);
}

// ---------------------------------------------------------------------------
// 4) Doble o nada
// ---------------------------------------------------------------------------
function casDoble() {
  const D = CAS.doble, M = CASINO.doble;
  const escala = Array.from({ length: M.maxRacha + 1 }, (_, i) => `<span class="${i === D.racha && D.fase !== 'apuesta' ? 'on' : i < D.racha ? 'ya' : ''}">×${1 << i}</span>`).join('');
  let ctl;
  if (D.fase === 'jugando') {
    const sig = Math.min(D.pozo * 2, M.tope), tope = D.racha >= M.maxRacha;
    ctl = `<div class="grande">${btn('dobSeguir', `🪙 Doble o nada · ${fmtMoney(sig)}`, { cls: 'naranja', off: CAS.ocupado || tope })}${btn('dobRetirar', `💰 Retirarme · ${fmtMoney(D.pozo)}`, { cls: 'verde', off: CAS.ocupado })}</div>`;
  } else ctl = `${casFichas()}<div class="grande">${btn('dobTirar', `🪙 Tirar la moneda · ${fmtMoney(CAS.apuesta)}`, { cls: 'verde', off: CAS.ocupado || G.plata < CAS.apuesta })}</div>`;
  return `<div class="doble">
    <div class="moneda-wrap"><div class="moneda3d ${D.girando ? 'gira-' + D.girando : D.lado === null ? '' : D.lado ? 'cara' : 'cruz'}" id="moneda"><span class="f1">🐟</span><span class="f2">⚓</span></div></div>
    <div class="escala">${escala}</div>
    <div class="en-juego">${D.fase === 'jugando' ? `En juego: <b>${fmtMoney(D.pozo)}</b>` : 'Salir 🐟 duplica lo que tenés en juego. Salir ⚓ lo pierde todo.'}</div>
    <div class="msg" id="dob-msg">${esc(D.msg || `La moneda del Turco cae de tu lado el ${Math.round(M.prob * 100)} % de las veces. Hasta ${M.maxRacha} aciertos seguidos.`)}</div>
    ${ctl}</div>`;
}
function dobTirada() {
  const D = CAS.doble, M = CASINO.doble;
  const gano = M.tirar();
  CAS.ocupado = true; D.lado = null; D.msg = ''; D.girando = gano ? 'cara' : 'cruz';
  CAS.cierre = () => {
    D.girando = null; D.lado = gano;
    if (gano) {
      D.racha++; D.pozo = Math.min(D.pozo * 2, M.tope);
      if (D.racha >= M.maxRacha || D.pozo >= M.tope) { D.msg = `¡${D.racha} seguidas! Cobrás ${fmtMoney(D.pozo)}.`; CAS.pend = { apuesta: D.apuesta, pago: D.pozo, jackpot: true }; D.fase = 'apuesta'; D.racha = 0; } else { D.msg = `¡Salió 🐟! Tenés ${fmtMoney(D.pozo)} en juego.`; D.fase = 'jugando'; }
    } else {
      D.msg = `Salió ⚓... perdiste ${fmtMoney(D.apuesta)}.`;
      CAS.pend = { apuesta: D.apuesta, pago: 0 }; D.fase = 'apuesta'; D.racha = 0; D.pozo = 0;
    }
  };
  sfx('moneda');
  CAS.timer = setTimeout(() => { casDetener(); if (D.fase === 'jugando') sfx('gana'); renderPanel(); }, 1250);
}
ACC.dobTirar = () => {
  const D = CAS.doble;
  if (CAS.ocupado || G.plata < CAS.apuesta) { sfx('error'); return; }
  casApostar(CAS.apuesta);
  D.apuesta = CAS.apuesta; D.pozo = CAS.apuesta; D.racha = 0; D.fase = 'tirando';
  dobTirada();
};
ACC.dobSeguir = () => { const D = CAS.doble; if (!CAS.ocupado && D.fase === 'jugando') { D.fase = 'tirando'; dobTirada(); } };
ACC.dobRetirar = () => {
  const D = CAS.doble;
  if (CAS.ocupado || D.fase !== 'jugando') return;
  CAS.pend = { apuesta: D.apuesta, pago: D.pozo };
  D.msg = `Te retiraste con ${fmtMoney(D.pozo)}.`; D.fase = 'apuesta'; D.racha = 0; D.lado = null;
  casLiquidar();
};

// ---------------------------------------------------------------------------
// 5) Carrera de peces
// ---------------------------------------------------------------------------
function nuevaCarrera() {
  const pool = ESPECIES.filter((s) => !s.tipo && s.rareza <= 3).map((s) => s.id);
  CAS.carrera.datos = CASINO.carrera.generar(pool);
  CAS.carrera.fase = 'apuesta'; CAS.carrera.t = 0;
}
function casCarrera() {
  const C = CAS.carrera;
  if (!C.datos) nuevaCarrera();
  const d = C.datos, corriendo = C.fase === 'corriendo', fin = C.fase === 'fin';
  const carriles = d.peces.map((f, i) => {
    const pos = corriendo || fin ? CASINO.carrera.avance(f, C.t) : 0;
    const sel = C.elegido === i;
    return `<div class="carril ${sel ? 'sel' : ''} ${fin && i === d.ganador ? 'gano' : ''}" data-act="${CAS.ocupado || fin ? '' : 'carElegir'}" data-i="${i}">
      <div class="car-info">${imgEsp(f.id, 36)}<b>${esc(SP[f.id].nombre)}</b><span class="cuota">×${String(f.cuota).replace('.', ',')}</span></div>
      <div class="pista"><span class="meta"></span><i class="pez-c" id="cp${i}" style="left:calc(${(pos * 100).toFixed(1)}% - ${(pos * 34).toFixed(1)}px)">${imgEsp(f.id, 34)}</i></div>
    </div>`;
  }).join('');
  let ctl;
  if (fin) ctl = `<div class="grande">${btn('carNueva', '🏁 Nueva carrera', { cls: 'verde' })}</div>`;
  else ctl = `${casFichas()}<div class="grande">${btn('carLargar', `🏁 ¡Largada! · ${fmtMoney(CAS.apuesta)} al ${esc(SP[d.peces[C.elegido].id].nombre)}`, { cls: 'verde', off: CAS.ocupado || G.plata < CAS.apuesta })}</div>`;
  return `<div class="carrera"><div class="carriles">${carriles}</div>
    <div class="msg" id="car-msg">${esc(C.msg || 'Elegí un pez tocando su carril. La cuota (×) es lo que cobrás por cada $1 apostado si gana. Cuanto más difícil, más paga.')}</div>${ctl}</div>`;
}
ACC.carElegir = (d) => { if (!CAS.ocupado && CAS.carrera.fase !== 'fin') { CAS.carrera.elegido = +d.i; sfx('click'); } };
ACC.carNueva = () => { if (!CAS.ocupado) { CAS.carrera.msg = ''; nuevaCarrera(); } };
ACC.carLargar = () => {
  const C = CAS.carrera, ap = CAS.apuesta, d = C.datos;
  if (CAS.ocupado || G.plata < ap) { sfx('error'); return; }
  casApostar(ap);
  const elegido = C.elegido, gano = d.ganador === elegido, f = d.peces[elegido];
  const pago = gano ? Math.round(ap * f.cuota) : 0;
  CAS.pend = { apuesta: ap, pago };
  CAS.ocupado = true; C.fase = 'corriendo'; C.t = 0; C.msg = '';
  const nombre = SP[d.peces[d.ganador].id].nombre;
  const fin = () => { C.fase = 'fin'; C.t = 99; C.msg = gano ? `¡Ganó tu ${nombre}! Cobrás ${fmtMoney(pago)}.` : `Ganó el ${nombre}. Perdés ${fmtMoney(ap)}.`; };
  CAS.cierre = fin;
  const t0 = performance.now(), Tmax = Math.max(...d.peces.map((p) => p.T)) + 0.4;
  let ult = -1;
  const paso = () => {
    C.t = (performance.now() - t0) / 1000;
    let hay = false;
    d.peces.forEach((p, i) => {
      const el = $('#cp' + i); if (!el) return; hay = true;
      const pos = CASINO.carrera.avance(p, C.t);
      el.style.left = `calc(${(pos * 100).toFixed(1)}% - ${(pos * 34).toFixed(1)}px)`;
    });
    const tk = Math.floor(C.t * 5);
    if (tk !== ult) { ult = tk; sfx('tick'); }
    if (C.t >= Tmax || !hay) { casDetener(); renderPanel(); } else CAS.raf = requestAnimationFrame(paso);
  };
  CAS.raf = requestAnimationFrame(paso);
};
