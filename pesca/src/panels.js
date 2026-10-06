'use strict';
// Paneles de pantalla completa (el mundo se pausa): pescadería, almacén, cabaña, mochila, bitácora, pausa, etc.

const PANEL = { id: null, tab: null, scroll: 0, abierto: 0 };
const PANELES = {};
const ACC = {}; // acciones de los botones (data-act)

function abrirLugar(id) {
  const mapa = { mercado: 'mercado', tienda: 'tienda', casino: 'casino', cabana: 'cabana', faro: 'capitan', fogata: 'fogata', barco: 'barco' };
  if (mapa[id]) abrirPanel(mapa[id]);
  else if (id === 'cartel') abrirPanel('mapa');
}
function abrirPanel(id, tab) {
  const def = PANELES[id];
  if (!def || (J.modo !== 'jugando' && id !== 'pausa' && !(J.modo === 'titulo' && id === 'ayuda'))) return;
  if (J.panel && J.panel !== id) cerrarPanel(true);
  PANEL.id = id;
  PANEL.tab = tab || def.tab0 || null;
  PANEL.scroll = 0;
  J.panel = id;
  PANEL.abierto = J.t;
  IN.botones[0] = IN.botones[1] = IN.botones[2] = false;
  IN.soltando = true; soltarLock(); setTimeout(() => { IN.soltando = false; }, 250);
  const root = $('#panel');
  root.hidden = false;
  root.className = 'panel-' + id;
  root.innerHTML = `<div class="velo"></div><div class="caja ${def.clase || ''}" role="dialog" aria-label="${esc(def.titulo)}"><div class="cab"><h2>${esc(def.titulo)}</h2><button class="x" data-x aria-label="Cerrar">✕</button></div><div class="tabs"></div><div class="cuerpo"></div><div class="pie"></div></div>`;
  renderPanel();
  sfx('click');
  if (def.musica) musica(def.musica);
}
function cerrarPanel(sinMusica) {
  if (!J.panel) return;
  const def = PANELES[PANEL.id];
  if (def && def.alCerrar) def.alCerrar();
  PANEL.confirmarBorrar = false;
  $('#panel').hidden = true;
  $('#panel').innerHTML = '';
  J.panel = null;
  PANEL.id = null;
  if (!sinMusica) musica(enCombate() ? 'jefe' : 'isla');
  guardar();
}
function renderPanel() {
  const def = PANELES[PANEL.id];
  if (!def) return;
  const root = $('#panel');
  const cuerpo = $('.cuerpo', root);
  if (!cuerpo) return;
  const sc = cuerpo.scrollTop;
  if (def.tabs) {
    $('.tabs', root).innerHTML = def.tabs.map(([k, n]) => `<button class="tab ${k === PANEL.tab ? 'on' : ''}" data-tab="${k}">${n}</button>`).join('');
    $('.tabs', root).hidden = false;
  } else $('.tabs', root).hidden = true;
  cuerpo.innerHTML = def.render(PANEL.tab);
  cuerpo.scrollTop = sc;
  const pie = $('.pie', root);
  if (def.pie !== false) { pie.innerHTML = `<span class="pie-plata"><i class="moneda"></i> ${fmtMoney(G.plata)}</span>` + (def.pieExtra ? def.pieExtra() : ''); pie.hidden = false; } else pie.hidden = true;
  if (def.despues) def.despues(root);
}

document.addEventListener('click', (e) => {
  const root = $('#panel');
  if (!root || root.hidden || !root.contains(e.target)) return;
  if (e.target.closest('[data-x]') || (e.target.classList.contains('velo') && PANELES[PANEL.id] && !PANELES[PANEL.id].fijo)) { cerrarPanel(); return; }
  const tab = e.target.closest('[data-tab]');
  if (tab) { PANEL.tab = tab.dataset.tab; sfx('click'); renderPanel(); $('.cuerpo', root).scrollTop = 0; return; }
  const b = e.target.closest('[data-act]');
  if (b && !b.disabled) {
    const f = ACC[b.dataset.act];
    if (f) { f(b.dataset, b); renderPanel(); }
  }
});

// ---- helpers de HTML -------------------------------------------------------
const btn = (act, txt, o = {}) => `<button class="btn ${o.cls || 'gold'} ${o.chico ? 'chico' : ''}" data-act="${act}" ${Object.entries(o.d || {}).map(([k, v]) => `data-${k}="${esc(v)}"`).join(' ')} ${o.off ? 'disabled' : ''}>${txt}</button>`;
const precioTxt = (n) => `<b class="precio">${fmtMoney(n)}</b>`;
function fila(ico, titulo, desc, medio, acc, cls = '') {
  return `<div class="fila ${cls}"><div class="f-ico">${ico}</div><div class="f-info"><b>${titulo}</b><small>${desc || ''}</small></div><div class="f-medio">${medio || ''}</div><div class="f-acc">${acc || ''}</div></div>`;
}
const imgEsp = (id, px = 52) => `<img src="${iconoEspecie(id, px)}" width="${px}" height="${px}" alt="">`;
function pips(n, max) { let s = ''; for (let i = 0; i < max; i++) s += `<i class="pip ${i < n ? 'on' : ''}"></i>`; return `<span class="pips">${s}</span>`; }
function statBar(txt, v, max) { return `<span class="stat"><em>${txt}</em><i style="--w:${clamp(v / max, 0.04, 1) * 100}%"></i></span>`; }
const cache = {};
function iconoCana(color, px = 52) {
  const k = 'cana' + color + px;
  if (cache[k]) return cache[k];
  const cv = makeCanvas(px * 2, px * 2), g = cv.getContext('2d');
  g.scale(2, 2);
  g.lineCap = 'round';
  g.strokeStyle = 'rgba(0,0,0,.25)';
  g.lineWidth = 6;
  g.beginPath(); g.moveTo(px * 0.2, px * 0.86); g.quadraticCurveTo(px * 0.55, px * 0.5, px * 0.86, px * 0.16); g.stroke();
  g.strokeStyle = color;
  g.lineWidth = 4.2;
  g.beginPath(); g.moveTo(px * 0.18, px * 0.84); g.quadraticCurveTo(px * 0.52, px * 0.5, px * 0.84, px * 0.14); g.stroke();
  g.fillStyle = '#3a2412';
  g.beginPath(); g.arc(px * 0.3, px * 0.7, px * 0.1, 0, TAU); g.fill();
  g.fillStyle = '#e8c860';
  g.beginPath(); g.arc(px * 0.3, px * 0.7, px * 0.05, 0, TAU); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.85)';
  g.lineWidth = 1;
  g.beginPath(); g.moveTo(px * 0.84, px * 0.14); g.quadraticCurveTo(px * 0.95, px * 0.4, px * 0.86, px * 0.62); g.stroke();
  cache[k] = `<img src="${cv.toDataURL()}" width="${px}" height="${px}" alt="">`;
  return cache[k];
}
const emo = (e, col) => `<span class="emo" style="${col ? '--c:' + col : ''}">${e}</span>`;

// ---------------------------------------------------------------------------
// Pescadería de Doña Rosa: vender, comida y curas
// ---------------------------------------------------------------------------
function agruparPeces() {
  const g = {};
  G.peces.forEach((p, i) => {
    const k = p.id + (p.brillo ? '*' : '');
    const o = g[k] || (g[k] = { k, id: p.id, brillo: !!p.brillo, n: 0, idx: [], mejor: 0, total: 0 });
    o.n++; o.idx.push(i); o.mejor = Math.max(o.mejor, p.kg); o.total += valorPez(p);
  });
  return Object.values(g).sort((a, b) => b.total / b.n - a.total / a.n);
}
PANELES.mercado = {
  titulo: 'Pescadería de Doña Rosa', tabs: [['vender', 'Vender'], ['comida', 'Comida'], ['curas', 'Curas']], tab0: 'vender', clase: 'ancha',
  render(tab) {
    if (tab === 'vender') {
      const gs = agruparPeces();
      let html = '<p class="nota">«Pago al contado. Los precios cambian cada día y bajan si me traés mucho de lo mismo.»</p>';
      if (!gs.length && !G.cuerpos.length) html += '<div class="vacio">No traés nada para vender. ¡A pescar!</div>';
      for (const c of G.cuerpos) {
        const j = JEFE[c.id];
        html += fila(emo('☠️', j.color), `Cuerpo de ${j.nombre}`, 'Pieza de jefe. Ocupa 4 lugares en la mochila.', precioTxt(valorCuerpo(c)), btn('venderCuerpo', 'Vender', { d: { id: c.id } }), 'jefe');
      }
      for (const o of gs) {
        const sp = SP[o.id], tend = tendencia(o.id);
        const unit = Math.round(o.total / o.n);
        html += fila(imgEsp(o.id), `${sp.nombre}${o.brillo ? ' ✨' : ''} <span class="cant">×${o.n}</span>`,
          `<span style="color:${RAREZAS[sp.rareza].color}">${RAREZAS[sp.rareza].nombre}</span> · mejor ${fmtKg(o.mejor)}`,
          `${precioTxt(unit)} <span class="tend ${tend > 0 ? 'sube' : tend < 0 ? 'baja' : ''}">${tend > 0 ? '▲' : tend < 0 ? '▼' : '•'}</span><small>c/u hoy</small>`,
          btn('venderUno', 'Vender 1', { chico: true, d: { k: o.k } }) + (o.n > 1 ? btn('venderTodos', `Todos (${fmtMoney(o.total)})`, { chico: true, cls: 'verde', d: { k: o.k } }) : ''));
      }
      const tot = G.peces.reduce((s, p) => s + valorPez(p), 0) + G.cuerpos.reduce((s, c) => s + valorCuerpo(c), 0);
      if (G.peces.length + G.cuerpos.length) html += `<div class="barra-total">${btn('venderTodo', `Vender todo · ${fmtMoney(tot)}`, { cls: 'verde' })}</div>`;
      return html;
    }
    const lista = tab === 'comida' ? COMIDAS : CURAS;
    return '<p class="nota">' + (tab === 'comida' ? '«Comé bien, que el mar no perdona.»' : '«Mejor prevenir que ser rescatado.»') + '</p>' + lista.map((c) => {
      const efecto = tab === 'comida' ? `+${c.hambre} hambre${c.hp ? ` · +${c.hp} vida` : ''}${c.buff ? ` · ${c.buff.txt} (${Math.round(c.buff.dur / 60 * 10) / 10} min)` : ''}` : c.hp >= 9999 ? 'Cura toda la vida' : `+${c.hp} vida`;
      return fila(emo(c.icono), c.nombre, efecto, `<small>Tenés: ${G.items[c.id] || 0}</small>`, btn('comprarItem', `Comprar ${precioTxt(c.precio)}`, { off: G.plata < c.precio, d: { id: c.id } }));
    }).join('');
  },
};
ACC.venderUno = (d) => { vender(G.peces.findIndex((p) => p.id + (p.brillo ? '*' : '') === d.k), 1); };
ACC.venderTodos = (d) => { const idx = []; G.peces.forEach((p, i) => { if (p.id + (p.brillo ? '*' : '') === d.k) idx.push(i); }); vender(idx); };
ACC.venderTodo = () => { vender(G.peces.map((_, i) => i)); for (const c of G.cuerpos.slice()) ACC.venderCuerpo({ id: c.id }); };
ACC.venderCuerpo = (d) => {
  const i = G.cuerpos.findIndex((c) => c.id === d.id);
  if (i < 0) return;
  const v = valorCuerpo(G.cuerpos[i]);
  G.cuerpos.splice(i, 1);
  G.plata += v; G.stats.vendido += v; G.stats.ventas++;
  toast(`Vendiste el cuerpo de ${JEFE[d.id].nombre} por ${fmtMoney(v)}`, '#ffe36b');
  sfx('vender'); { const c = pecho(); lluviaMonedas(c.x, c.y, c.z, 22); }
  revisarMisiones();
};
function vender(idx, n) {
  const lista = Array.isArray(idx) ? idx.slice() : [idx];
  if (n === 1) lista.splice(1);
  lista.sort((a, b) => b - a);
  let total = 0, cant = 0;
  // se vende de a uno: cada venta baja un poco el precio de esa especie
  const ordenados = lista.filter((i) => i >= 0 && G.peces[i]).map((i) => ({ i, p: G.peces[i] }));
  for (const o of ordenados) {
    total += valorPez(o.p);
    G.mercado.sat[o.p.id] = Math.max(0.6, satur(o.p.id) * 0.972);
    cant++;
  }
  for (const o of ordenados) G.peces.splice(o.i, 1);
  if (!cant) return;
  G.plata += total; G.stats.vendido += total; G.stats.ventas++;
  toast(`Vendiste ${cant} ${cant === 1 ? 'pez' : 'peces'} por ${fmtMoney(total)}`, '#ffe36b');
  sfx('vender'); { const c = pecho(); lluviaMonedas(c.x, c.y, c.z, Math.min(26, 6 + cant * 2)); }
  revisarMisiones();
}
ACC.comprarItem = (d) => {
  const it = [...COMIDAS, ...CURAS].find((c) => c.id === d.id);
  if (!it || G.plata < it.precio) { sfx('error'); return; }
  G.plata -= it.precio; darItem(it.id);
  sfx('comprar');
};

// ---------------------------------------------------------------------------
// Almacén de Don Anselmo: cañas, mejoras, caza, equipo
// ---------------------------------------------------------------------------
PANELES.tienda = {
  titulo: 'Almacén de Don Anselmo', tabs: [['canias', 'Cañas'], ['mejoras', 'Mejoras'], ['caza', 'Caza'], ['botes', 'Botes'], ['equipo', 'Equipo']], tab0: 'canias', clase: 'ancha',
  render(tab) {
    if (tab === 'canias') {
      return '<p class="nota">«Una buena caña es media pesca. La otra media es la paciencia.»</p>' + CANIAS.map((r, i) => {
        const stats = `${statBar('Alcance', r.alcance, 1000)}${statBar('Fuerza', r.fuerza, 3.2)}${statBar('Aguante', r.aguante, 3.2)}${statBar('Suerte', r.suerte + 0.05, 0.45)}`;
        const acc = i === G.cana ? '<span class="badge on">En uso</span>' : i < G.cana ? '<span class="badge">Superada</span>' : btn('comprarCana', `Comprar ${precioTxt(r.precio)}`, { off: G.plata < r.precio, d: { i } });
        return fila(iconoCana(r.color), r.nombre, `${r.desc}<div class="stats">${stats}</div>`, '', acc, i === G.cana ? 'actual' : '');
      }).join('');
    }
    if (tab === 'mejoras') {
      const r = CANIAS[G.cana];
      return `<p class="nota">«Cada pieza mejora tu ${esc(r.nombre)}. Y se queda con vos aunque cambies de caña.»</p>` + PARTES.map((p) => {
        const n = G.partes[p.id];
        const max = n >= p.max;
        const costo = max ? 0 : costoParte(p, n);
        return fila(emo(p.icono), p.nombre, `${p.desc}<br>${pips(n, p.max)}`, '', max ? '<span class="badge on">Al máximo</span>' : btn('mejorar', `Mejorar ${precioTxt(costo)}`, { off: G.plata < costo, d: { id: p.id } }));
      }).join('');
    }
    if (tab === 'caza') {
      let h2 = '<p class="nota">«Para cazar hay que tener buena puntería... o buena dinamita.»</p><h3>Arpones</h3>';
      h2 += ARPONES.map((a, i) => {
        const acc = i === G.arpon ? '<span class="badge on">En uso</span>' : i < G.arpon ? '<span class="badge">Superado</span>' : btn('comprarArpon', `Comprar ${precioTxt(a.precio)}`, { off: G.plata < a.precio, d: { i } });
        return fila(emo('🔱', a.color), a.nombre, `${a.desc}<div class="stats">${statBar('Daño', a.dano, 800)}${statBar('Alcance', a.alcance, 560)}${statBar('Fuerza', a.dureza, 6)}</div>`, '', acc, i === G.arpon ? 'actual' : '');
      }).join('');
      h2 += '<h3>Redes</h3>' + REDES.map((a, i) => {
        const acc = i === G.red ? '<span class="badge on">En uso</span>' : i < G.red ? '<span class="badge">Superada</span>' : btn('comprarRed', `Comprar ${precioTxt(a.precio)}`, { off: G.plata < a.precio, d: { i } });
        return fila(emo('🕸️'), a.nombre, `${a.desc}<div class="stats">${statBar('Radio', a.radio, 125)}${statBar('Capacidad', a.tope, 14)}</div>`, '', acc, i === G.red ? 'actual' : '');
      }).join('');
      const pd = Math.round(DINAMITA.precio * DINAMITA.pack * 0.9);
      h2 += '<h3>Explosivos y carnada</h3>';
      h2 += fila(emo('🧨'), `${DINAMITA.nombre} ×${DINAMITA.pack}`, DINAMITA.desc + ` Daño ${DINAMITA.dano} a jefes.`, `<small>Tenés: ${G.items.dinamita || 0}</small>`, btn('comprarDina', `Comprar ${precioTxt(pd)}`, { off: G.plata < pd }));
      h2 += fila(emo('🦐'), CARNADA_JEFE.nombre, CARNADA_JEFE.desc + ' Armala con B y lanzá cerca de la sombra del jefe.', `<small>Tenés: ${G.items.carnada || 0}</small>`, btn('comprarCarnada', `Comprar ${precioTxt(CARNADA_JEFE.precio)}`, { off: G.plata < CARNADA_JEFE.precio }));
      return h2;
    }
    if (tab === 'botes') {
      return '<p class="nota">«Sin bote, el mar es un cuadro. Con bote, es un mundo.» Los botes se amarran al muelle y los manejás con WASD: la proa sigue a la cámara.</p>' + BOTES.map((b) => {
        const tiene = !!G.botes[b.id];
        const acc = tiene ? '<span class="badge on">Tuyo</span>' : btn('comprarBote', `Comprar ${precioTxt(b.precio)}`, { off: G.plata < b.precio, d: { id: b.id } });
        const alc = b.maxD >= 9999 ? 'Todo el mapa' : `Hasta ${b.maxD} m de la costa`;
        return fila(emo('⛵', b.color), b.nombre, `${b.desc}<div class="stats">${statBar('Velocidad', b.vel, 18)}${statBar('Giro', b.giro, 1.8)}${statBar('Alcance', Math.min(b.maxD, 260), 260)}</div><small>${alc}</small>`, '', acc, tiene ? 'actual' : '');
      }).join('');
    }
    let h3 = '<h3>Mochilas</h3>' + MOCHILAS.map((m, i) => {
      const acc = i === G.mochila ? '<span class="badge on">En uso</span>' : i < G.mochila ? '<span class="badge">Superada</span>' : btn('comprarMochila', `Comprar ${precioTxt(m.precio)}`, { off: G.plata < m.precio, d: { i } });
      return fila(emo('🎒'), m.nombre, `Capacidad: ${m.cap} lugares`, '', acc, i === G.mochila ? 'actual' : '');
    }).join('');
    h3 += '<h3>Ropa de abrigo</h3>' + CHALECOS.map((m, i) => {
      const acc = i === G.chaleco ? '<span class="badge on">En uso</span>' : i < G.chaleco ? '<span class="badge">Superada</span>' : btn('comprarChaleco', `Comprar ${precioTxt(m.precio)}`, { off: G.plata < m.precio, d: { i } });
      return fila(emo('🦺'), m.nombre, `Vida máxima: ${m.hp}`, '', acc, i === G.chaleco ? 'actual' : '');
    }).join('');
    return h3;
  },
};
const gasto = (n) => { if (G.plata < n) { sfx('error'); return false; } G.plata -= n; sfx('comprar'); return true; };
ACC.comprarBote = (d) => { const b = BOTES.find((x) => x.id === d.id); if (b && !G.botes[b.id] && gasto(b.precio)) { comprarBote(b.id); revisarMisiones(); } };
ACC.comprarCana = (d) => { const r = CANIAS[+d.i]; if (+d.i > G.cana && gasto(r.precio)) { G.cana = +d.i; toast(`¡Compraste la ${r.nombre}!`, '#9bffb0'); revisarMisiones(); } };
ACC.mejorar = (d) => { const p = PARTES.find((x) => x.id === d.id); const n = G.partes[p.id]; if (n < p.max && gasto(costoParte(p, n))) { G.partes[p.id]++; toast(`${p.nombre} nivel ${n + 1}`, '#9bffb0'); } };
ACC.comprarArpon = (d) => { const a = ARPONES[+d.i]; if (+d.i > G.arpon && gasto(a.precio)) { G.arpon = +d.i; toast(`¡Compraste el ${a.nombre}!`, '#9bffb0'); } };
ACC.comprarRed = (d) => { const a = REDES[+d.i]; if (+d.i > G.red && gasto(a.precio)) { G.red = +d.i; toast(`¡Compraste la ${a.nombre}!`, '#9bffb0'); } };
ACC.comprarDina = () => { if (gasto(Math.round(DINAMITA.precio * DINAMITA.pack * 0.9))) darItem('dinamita', DINAMITA.pack); };
ACC.comprarCarnada = () => { if (gasto(CARNADA_JEFE.precio)) darItem('carnada', 1); };
ACC.comprarMochila = (d) => { const m = MOCHILAS[+d.i]; if (+d.i > G.mochila && gasto(m.precio)) { G.mochila = +d.i; toast(`${m.nombre}: ${m.cap} lugares`, '#9bffb0'); } };
ACC.comprarChaleco = (d) => { const m = CHALECOS[+d.i]; if (+d.i > G.chaleco && gasto(m.precio)) { G.chaleco = +d.i; P.hpMax = hpMaxActual(); P.hp = P.hpMax; toast(`${m.nombre}: ${m.hp} de vida`, '#9bffb0'); } };

// ---------------------------------------------------------------------------
// Cabaña: dormir, guardar, resumen y ajustes
// ---------------------------------------------------------------------------
function tiempoJugado() {
  const s = Math.floor(G.stats.segundos);
  const m = Math.floor(s / 60);
  return m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min ${s % 60} s`;
}
PANELES.cabana = {
  titulo: 'Tu cabaña', tabs: [['descanso', 'Descansar'], ['resumen', 'Resumen'], ['ajustes', 'Ajustes']], tab0: 'descanso', pie: true,
  render(tab) {
    if (tab === 'descanso') {
      return `<p class="nota">Un colchón de paja, una lámpara y el sonido del mar. Dormir cura toda la vida, pasa la noche y cambia los precios del mercado.</p>
      <div class="grande">${btn('dormir', '😴 Dormir hasta la mañana')}${btn('guardar', '💾 Guardar partida', { cls: 'verde' })}</div>
      <p class="nota chico">La partida se guarda sola cada tanto en este navegador.</p>`;
    }
    if (tab === 'resumen') {
      const s = G.stats;
      const filas = [['Tiempo de juego', tiempoJugado()], ['Peces pescados', s.capturas], ['Peces cazados con arpón', s.arponeados], ['Pez más grande', s.mayorKg ? fmtKg(s.mayorKg) : '—'], ['Jefes vencidos', s.jefesMatados], ['Plata ganada vendiendo', fmtMoney(s.vendido)], ['Piques perdidos', s.escapados], ['Líneas cortadas', s.cortes], ['Veces desmayado', s.muertes], ['Casino: ganado', fmtMoney(s.ganadoCasino)], ['Casino: perdido', fmtMoney(s.perdidoCasino)]];
      return '<div class="resumen">' + filas.map(([a, b]) => `<div><span>${a}</span><b>${b}</b></div>`).join('') + '</div>';
    }
    return `<div class="ajustes">
      <label class="sw"><input type="checkbox" data-aj="sonido" ${G.ajustes.sonido ? 'checked' : ''}><i></i><span>Sonido</span></label>
      <label class="sw"><input type="checkbox" data-aj="musica" ${G.ajustes.musica ? 'checked' : ''}><i></i><span>Música</span></label>
      <label class="sw"><input type="checkbox" data-aj="ayuda" ${G.ajustes.ayuda ? 'checked' : ''}><i></i><span>Ayudas en pantalla</span></label>
      <label class="sw"><input type="checkbox" data-aj="calidad" ${G.ajustes.calidad >= 1 ? 'checked' : ''}><i></i><span>Calidad alta (pantallas retina)</span></label>
      <div class="peligro">${PANEL.confirmarBorrar ? `<p><b>¿Seguro?</b> Se pierde todo el progreso.</p>${btn('borrar2', 'Sí, borrar todo', { cls: 'rojo' })}${btn('borrarNo', 'No, volver', { cls: 'gris' })}` : btn('borrar1', 'Borrar partida y empezar de nuevo', { cls: 'rojo' })}</div></div>`;
  },
  despues(root) {
    $$('[data-aj]', root).forEach((i) => i.addEventListener('change', () => {
      const k = i.dataset.aj;
      if (k === 'calidad') { G.ajustes.calidad = i.checked ? 1 : 0; J.calidad = G.ajustes.calidad; redimensionar(); } else G.ajustes[k] = i.checked;
      aplicarVolumenes();
      sfx('click');
      guardar();
    }));
  },
};
ACC.dormir = () => {
  G.dia++;
  J.hora = 7;
  P.hp = P.hpMax; P.hambre = Math.max(30, P.hambre - 14);
  P.buffs.length = 0;
  sfx('dormir');
  toast('Dormiste hasta las 7:00. ¡Amaneció un día nuevo! Cambiaron los precios.', '#ffe39a');
  guardar();
};
ACC.guardar = () => { guardar(); toast('Partida guardada.', '#9bffb0'); sfx('click'); };
ACC.borrar1 = () => { PANEL.confirmarBorrar = true; };
ACC.borrarNo = () => { PANEL.confirmarBorrar = false; };
ACC.borrar2 = () => { PANEL.confirmarBorrar = false; cerrarPanel(true); borrarPartida(); nuevaPartida(); };

// ---------------------------------------------------------------------------
// Mochila
// ---------------------------------------------------------------------------
PANELES.mochila = {
  titulo: 'Mochila', tabs: [['peces', 'Pescado'], ['cosas', 'Cosas'], ['equipo', 'Equipo']], tab0: 'peces', clase: 'ancha',
  pieExtra: () => `<span class="pie-cupo">🎒 ${cupoUsado()}/${cupoMax()}</span>`,
  render(tab) {
    if (tab === 'peces') {
      const gs = agruparPeces();
      let html = '';
      if (!gs.length && !G.cuerpos.length) html = '<div class="vacio">La mochila de pescado está vacía.</div>';
      for (const c of G.cuerpos) html += fila(emo('☠️', JEFE[c.id].color), `Cuerpo de ${JEFE[c.id].nombre}`, 'Ocupa 4 lugares. Se vende en la pescadería.', precioTxt(valorCuerpo(c)), '', 'jefe');
      for (const o of gs) {
        const sp = SP[o.id];
        html += fila(imgEsp(o.id), `${sp.nombre}${o.brillo ? ' ✨' : ''} <span class="cant">×${o.n}</span>`, `${fmtKg(o.mejor)} el más grande${sp.veneno ? ' · <span class="mal">crudo es veneno</span>' : ''}`, precioTxt(Math.round(o.total / o.n)),
          btn('comerPez', 'Comer crudo', { chico: true, cls: 'naranja', d: { k: o.k } }) + btn('soltarPez', 'Soltar', { chico: true, cls: 'gris', d: { k: o.k } }));
      }
      return html + '<p class="nota chico">Para sacarle más jugo, cocinalo en la fogata (al sur, junto a la pescadería).</p>';
    }
    if (tab === 'cosas') {
      let html = '';
      for (const c of COMIDAS) if (G.items[c.id]) html += fila(emo(c.icono), c.nombre, `+${c.hambre} hambre${c.hp ? ` · +${c.hp} vida` : ''}`, `<span class="cant">×${G.items[c.id]}</span>`, btn('usarComida', 'Comer', { chico: true, cls: 'naranja', d: { id: c.id } }));
      for (const c of CURAS) if (G.items[c.id]) html += fila(emo(c.icono), c.nombre, c.hp >= 9999 ? 'Cura toda la vida' : `+${c.hp} vida`, `<span class="cant">×${G.items[c.id]}</span>`, btn('usarCura', 'Usar', { chico: true, cls: 'verde', d: { id: c.id } }));
      if (G.items.dinamita) html += fila(emo('🧨'), 'Dinamita', 'Se tira con Q (o eligiendo la herramienta 4).', `<span class="cant">×${G.items.dinamita}</span>`, '');
      if (G.items.carnada) html += fila(emo('🦐'), 'Carnada de jefe', G.carnadaArmada ? 'Armada: se usa al lanzar cerca de un jefe.' : 'Armala con B antes de lanzar.', `<span class="cant">×${G.items.carnada}</span>`, btn('armar', G.carnadaArmada ? 'Desarmar' : 'Armar', { chico: true, cls: G.carnadaArmada ? 'gris' : 'gold' }));
      if (G.items.corona) html += fila(emo('👑'), 'Corona del Leviatán', 'Necesaria para reparar el barco.', '', '', 'jefe');
      return html || '<div class="vacio">No tenés cosas todavía. Doña Rosa vende comida y curas.</div>';
    }
    const e = equipoCana();
    return fila(iconoCana(CANIAS[G.cana].color), e.nombre, `Alcance ${Math.round(e.alcance)} · Fuerza ×${e.reel.toFixed(2)} · Aguante ×${e.line.toFixed(2)} · Suerte +${Math.round(e.suerte * 100)}%`, '', '', 'actual')
      + fila(emo('🔱'), G.arpon >= 0 ? ARPONES[G.arpon].nombre : 'Sin arpón', G.arpon >= 0 ? `Daño ${ARPONES[G.arpon].dano} · Alcance ${ARPONES[G.arpon].alcance}` : 'Se compra en el almacén', '', '')
      + fila(emo('🕸️'), G.red >= 0 ? REDES[G.red].nombre : 'Sin red', G.red >= 0 ? `Radio ${REDES[G.red].radio} · hasta ${REDES[G.red].tope} peces` : 'Se compra en el almacén', '', '')
      + fila(emo('🎒'), MOCHILAS[G.mochila].nombre, `${MOCHILAS[G.mochila].cap} lugares`, '', '') + fila(emo('🦺'), CHALECOS[G.chaleco].nombre, `${CHALECOS[G.chaleco].hp} de vida`, '', '')
      + '<div class="stats grande-stats">' + PARTES.map((p) => `<div><span>${p.nombre}</span>${pips(G.partes[p.id], p.max)}</div>`).join('') + '</div>';
  },
};
ACC.comerPez = (d) => { const i = G.peces.findIndex((p) => p.id + (p.brillo ? '*' : '') === d.k); if (i >= 0) comerPez(i, false); };
ACC.soltarPez = (d) => { const i = G.peces.findIndex((p) => p.id + (p.brillo ? '*' : '') === d.k); if (i >= 0) { G.peces.splice(i, 1); sfx('splash'); } };
ACC.usarComida = (d) => { const c = COMIDAS.find((x) => x.id === d.id); if (c && tiene(c.id)) usarComida(c); };
ACC.usarCura = (d) => { const c = CURAS.find((x) => x.id === d.id); if (c && tiene(c.id)) usarCura(c); };
ACC.armar = () => alternarCarnada();

// Fogata: cocinar y comer
PANELES.fogata = {
  titulo: 'La fogata', clase: 'ancha',
  render() {
    const gs = agruparPeces().sort((a, b) => a.total / a.n - b.total / b.n);
    let html = '<p class="nota">Asado al fuego rinde casi el doble que crudo y los peces raros dan un bonito empujón. Pero ojo: comés lo que podrías vender.</p>';
    if (!gs.length) return html + '<div class="vacio">No tenés pescado para cocinar.</div>';
    for (const o of gs) {
      const p = G.peces[o.idx[0]];
      const sp = SP[o.id];
      const hh = Math.round(12 + Math.min(58, Math.sqrt(valorBase(p)) * 2.2));
      html += fila(imgEsp(o.id), `${sp.nombre}${o.brillo ? ' ✨' : ''} <span class="cant">×${o.n}</span>`, `Asado: +${hh} hambre${sp.rareza >= 2 ? ' y +6% a todo por 2,5 min' : ''}`, `<small>vale ${fmtMoney(valorPez(p))}</small>`, btn('asar', 'Asar y comer', { chico: true, cls: 'naranja', d: { k: o.k } }));
    }
    return html;
  },
};
ACC.asar = (d) => { const i = G.peces.findIndex((p) => p.id + (p.brillo ? '*' : '') === d.k); if (i >= 0) { comerPez(i, true); const f = MUN.props.find((q) => q.kind === 'fogata'); if (f) for (let k = 0; k < 5; k++) humo(f.x + rand(-0.4, 0.4), 1.2, f.z + rand(-0.4, 0.4)); } };

// ---------------------------------------------------------------------------
// Bitácora
// ---------------------------------------------------------------------------
PANELES.bitacora = {
  titulo: 'Bitácora del náufrago', tabs: [['peces', 'Peces'], ['jefes', 'Jefes'], ['zonas', 'El mar']], tab0: 'peces', clase: 'ancha', pie: false,
  render(tab) {
    if (tab === 'peces') {
      const todos = ESPECIES;
      const vistos = todos.filter((s) => G.bitacora[s.id]).length;
      let html = `<p class="nota">Descubiertas: <b>${vistos}</b> de ${todos.length}</p><div class="grilla">`;
      for (const zona of ZONAS) {
        const lista = todos.filter((s) => s.z[zona.id] && Object.keys(s.z).sort((a, b) => s.z[b] - s.z[a])[0] === zona.id);
        html += `</div><h3>${zona.nombre}</h3><div class="grilla">`;
        for (const sp of lista) {
          const b = G.bitacora[sp.id];
          if (b) {
            html += `<div class="carta r${sp.rareza}"><div class="carta-img">${imgEsp(sp.id, 74)}</div><b>${sp.nombre}</b><small style="color:${RAREZAS[sp.rareza].color}">${RAREZAS[sp.rareza].nombre}</small><small>×${b.n} · récord ${fmtKg(b.max)}</small><small>Vale ~${fmtMoney(sp.precio)}</small>${b.brillo ? `<small class="bri">✨ brillante ×${b.brillo}</small>` : ''}<em>${esc(sp.texto)}</em></div>`;
          } else html += `<div class="carta oculta"><div class="carta-img"><span>?</span></div><b>???</b><small>Todavía no la viste</small></div>`;
        }
      }
      return html + '</div>';
    }
    if (tab === 'jefes') {
      return '<p class="nota">Los jefes patrullan el mar alrededor de la isla. Comprá carnada de jefe, armala con B y lanzá cerca de su sombra.</p>' + JEFES.map((j) => {
        const k = jefeKills(j.id);
        const b = BOSSES.find((x) => x.def === j);
        const estado = k > 0 ? `Vencido ×${k}` : G.jefes[j.id] && G.jefes[j.id].visto ? 'Visto' : 'Sin ver';
        const resp = b && b.estado === 'muerto' ? ` · reaparece en ${Math.max(0, Math.ceil(b.respawn))} s` : '';
        return fila(emo('☠️', j.color), `${j.nombre} — ${j.apodo}`, `${esc(j.intro)}<br><em>${esc(j.consejo)}</em><br>Patrulla a ~${j.d} m de la costa${j.cuando === 'noche' ? ' · solo de noche' : ''} · vida ${fmtNum(j.hp)}`, `${precioTxt(j.precio)}<small>${estado}${resp}</small>`, '', 'jefe');
      }).join('');
    }
    return '<p class="nota">El mar se divide en cuatro zonas según qué tan lejos de la costa estés. Cuanto más hondo, más valen los peces... y más fuertes tiran.</p>' + ZONAS.map((z) => {
      const n = ESPECIES.filter((s) => !s.tipo && s.z[z.id]).length;
      const vistos = ESPECIES.filter((s) => !s.tipo && s.z[z.id] && G.bitacora[s.id]).length;
      return fila(`<span class="zona-pt" style="background:${z.tono}"></span>`, z.nombre, `${z.hasta > 9e8 ? `Desde ${z.desde} m de la costa` : `${z.desde} a ${z.hasta} m de la costa`}`, `<small>${vistos}/${n} especies</small>`, '');
    }).join('');
  },
};

// ---------------------------------------------------------------------------
// Capitán y barco
// ---------------------------------------------------------------------------
PANELES.capitan = {
  titulo: 'El Capitán', clase: '',
  render() {
    const m = misionActual();
    const t = m ? `«${m.desc}»` : '«Lo lograste todo, marinero. Solo queda zarpar.»';
    const vencidos = JEFES.filter((j) => jefeKills(j.id) > 0).length;
    return `<div class="dialogo"><div class="d-cara">${emo('👴')}</div><div><b>El Capitán</b><p>${esc(t)}</p><p class="chico">Jefes vencidos: ${vencidos} de ${JEFES.length}. Para reparar mi barco necesito ${fmtMoney(BARCO.precio)} y la corona de la bestia que domina la noche.</p></div></div>`;
  },
};
PANELES.barco = {
  titulo: 'El barco roto', clase: '',
  render() {
    const ok1 = G.plata >= BARCO.precio, ok2 = tiene('corona');
    if (G.barcoListo) return '<div class="dialogo"><div class="d-cara">⛵</div><div><b>La Esperanza</b><p>Está lista para zarpar cuando quieras.</p></div></div>' + `<div class="grande">${btn('zarpar', '⛵ Zarpar (ver final)', { cls: 'verde' })}</div>`;
    return `<div class="dialogo"><div class="d-cara">⛵</div><div><b>La Esperanza</b><p>El casco tiene un agujero enorme y el mástil está partido. Con los materiales justos, sale a flote.</p></div></div>
    <div class="reqs"><div class="${ok1 ? 'ok' : 'no'}">${ok1 ? '✔' : '✘'} ${fmtMoney(BARCO.precio)}</div><div class="${ok2 ? 'ok' : 'no'}">${ok2 ? '✔' : '✘'} Corona del Leviatán</div></div>
    <div class="grande">${btn('reparar', '🔧 Reparar el barco', { off: !(ok1 && ok2), cls: 'verde' })}</div>`;
  },
};
ACC.reparar = () => {
  if (G.plata < BARCO.precio || !tiene('corona')) { sfx('error'); return; }
  G.plata -= BARCO.precio; sacarItem('corona');
  G.barcoListo = true;
  sfx('mision');
  revisarMisiones();
  const bq = MUN.props.find((q) => q.kind === 'barco');
  if (bq) chispas(bq.x, 4, bq.z, '#ffe36b', 30, 7);
};
ACC.zarpar = () => { cerrarPanel(); mostrarFinal(); };

function mostrarFinal() {
  G.fin = true;
  guardar();
  musica('isla');
  const s = G.stats;
  const v = h('div', 'final', `<div class="f-caja"><div class="f-logo">⛵</div><h1>¡Zarpaste de la isla!</h1><p>El mar quedó atrás, con sus jefes, su casino y su dueño de almacén. Volvés a casa con la bodega llena y una historia que nadie va a creer.</p>
    <div class="resumen"><div><span>Tiempo de juego</span><b>${tiempoJugado()}</b></div><div><span>Peces pescados</span><b>${s.capturas}</b></div><div><span>Jefes vencidos</span><b>${s.jefesMatados}</b></div><div><span>Plata final</span><b>${fmtMoney(G.plata)}</b></div></div>
    <div class="grande"><button class="btn gold" id="f-seguir">Seguir jugando en la isla</button><button class="btn gris" id="f-titulo">Volver al título</button></div></div>`, $('#app'));
  $('#f-seguir', v).addEventListener('click', () => v.remove());
  $('#f-titulo', v).addEventListener('click', () => { v.remove(); irAlTitulo(); });
}

// ---------------------------------------------------------------------------
// Pausa y ayuda
// ---------------------------------------------------------------------------
PANELES.pausa = {
  titulo: 'Pausa', pie: false, fijo: false,
  render() {
    return `<div class="menu-pausa">${btn('seguir', 'Seguir jugando', { cls: 'gold' })}${btn('ayuda', '❓ Cómo se juega', { cls: 'verde' })}
    <label class="sw"><input type="checkbox" data-aj="sonido" ${G.ajustes.sonido ? 'checked' : ''}><i></i><span>Sonido</span></label>
    <label class="sw"><input type="checkbox" data-aj="musica" ${G.ajustes.musica ? 'checked' : ''}><i></i><span>Música</span></label>
    ${btn('guardar', '💾 Guardar', { cls: 'gris' })}${btn('titulo', '🏝️ Volver al título', { cls: 'gris' })}</div>`;
  },
  despues: PANELES.cabana.despues,
};
ACC.seguir = () => cerrarPanel();
ACC.ayuda = () => { abrirPanel('ayuda'); };
ACC.titulo = () => { cerrarPanel(); guardar(); irAlTitulo(); };
PANELES.ayuda = {
  titulo: 'Cómo se juega', pie: false, clase: 'ancha',
  render() {
    const t = IN.tactil;
    return `<div class="ayuda">
    <h3>Lo básico</h3>
    <ul>
      <li><b>Pescar:</b> apuntá con la mira al agua y ${t ? 'tocá el botón grande' : 'hacé clic'} para lanzar. Cuando la boya se hunda y aparezca <b>¡!</b>, ${t ? 'tocá' : 'hacé clic'} para clavar. Después <b>mantené</b> para recoger y <b>soltá</b> cuando el pez avise o la tensión se ponga roja.</li>
      <li><b>Sombras:</b> los peces se ven como sombras bajo el agua. Cuanto más hondo, más tenues. Lanzá cerca de la que quieras.</li>
      <li><b>Vender:</b> en la pescadería de Doña Rosa. Los precios cambian cada día y bajan si vendés mucho de lo mismo.</li>
      <li><b>Mejorar:</b> en el almacén de Don Anselmo: cañas, partes, arpones, redes, mochilas, ropa y <b>botes</b>.</li>
      <li><b>Mundo abierto:</b> el mar se divide en zonas por distancia a la costa. Con un bote llegás a islotes, naufragios y cofres; cada bote aguanta el mar hasta cierta distancia.</li>
      <li><b>Jefes:</b> comprá carnada de jefe, armala, lanzá cerca de su sombra y pelealos. Esquivá las zonas rojas y pegales con arpón o dinamita cuando queden aturdidos.</li>
      <li><b>Casino:</b> el Turco te espera. Apostá con cabeza.</li>
    </ul>
    <h3>Controles</h3>
    <div class="teclas">${t ? `<div><b>Joystick</b> moverse / navegar</div><div><b>Arrastrar a la derecha</b> mirar</div><div><b>Botón grande</b> lanzar · clavar · recoger</div><div><b>E</b> entrar / subir / bajar</div><div><b>⤒</b> saltar · <b>↻</b> rodar</div><div><b>🔱 🧨</b> arpón y dinamita</div>` : `
      <div><kbd>W A S D</kbd> moverse / navegar</div><div><kbd>Mouse</kbd> mirar</div><div><kbd>Clic</kbd> usar herramienta</div><div><kbd>Espacio</kbd> saltar · mantener para recoger</div>
      <div><kbd>Clic der.</kbd> arpón</div><div><kbd>Q</kbd> dinamita</div><div><kbd>Shift</kbd> correr</div><div><kbd>V</kbd> rodar (esquivar)</div>
      <div><kbd>E</kbd> entrar · subir · bajar</div><div><kbd>1</kbd>-<kbd>4</kbd> herramienta</div><div><kbd>F</kbd> comer</div><div><kbd>H</kbd> curarse</div>
      <div><kbd>B</kbd> armar carnada</div><div><kbd>I</kbd> mochila</div><div><kbd>C</kbd> bitácora</div><div><kbd>M</kbd> mapa</div><div><kbd>Rueda</kbd> zoom</div><div><kbd>Esc</kbd> menú</div>`}</div></div>`;
  },
};

// ---------------------------------------------------------------------------
// Mapa del mundo
// ---------------------------------------------------------------------------
const LIMITES_MAPA = {};
function contornoLimite(maxD) {
  if (LIMITES_MAPA[maxD]) return LIMITES_MAPA[maxD];
  const S = MAPA.px, cv = makeCanvas(S, S), g = cv.getContext('2d'), img = g.createImageData(S, S);
  for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) {
    const x = (i / (S - 1) - 0.5) * MAPA.ext, z = (j / (S - 1) - 0.5) * MAPA.ext;
    const d = distCosta(x, z);
    if (Math.abs(d - maxD) < 2.1 && ((i + j) % 6 < 3) && H(x, z) < 0) { const o = (j * S + i) * 4; img.data[o] = 255; img.data[o + 1] = 236; img.data[o + 2] = 140; img.data[o + 3] = 230; }
  }
  g.putImageData(img, 0, 0);
  LIMITES_MAPA[maxD] = cv;
  return cv;
}
function dibujarMapaGrande(cv) {
  if (!cv) return;
  if (!MAPA.cv) construirMapaBase();
  const g = cv.getContext('2d'), W = cv.width, k = W / MAPA.px;
  g.imageSmoothingEnabled = true;
  g.drawImage(MAPA.cv, 0, 0, W, W);
  // hasta dónde llega tu mejor bote
  let maxD = 0;
  for (const b of BOTES) if (G.botes[b.id]) maxD = Math.max(maxD, b.maxD);
  if (maxD < 9999) g.drawImage(contornoLimite(maxD || BOTES[0].maxD), 0, 0, W, W);
  g.textAlign = 'center'; g.textBaseline = 'middle';
  const marc = marcadoresMapa();
  for (const m of marc) {
    const [px, py] = mapaPx(m.x, m.z);
    const sx = px * k, sy = py * k;
    if (m.jefe) { g.fillStyle = m.col; g.beginPath(); g.arc(sx, sy, 10, 0, TAU); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 2; g.stroke(); }
    g.font = `${m.tam}px sans-serif`;
    g.fillText(m.ico, sx, sy + 1);
    g.font = 'bold 11px sans-serif';
    g.lineWidth = 3; g.strokeStyle = 'rgba(8,24,48,.85)'; g.strokeText(m.txt, sx, sy + m.tam * 0.95 + 4);
    g.fillStyle = '#fff6dc'; g.fillText(m.txt, sx, sy + m.tam * 0.95 + 4);
  }
  for (const is of ISLAS.slice(1)) {
    const [px, py] = mapaPx(is.x, is.z - is.base - 12);
    g.font = 'italic bold 12px sans-serif'; g.lineWidth = 3; g.strokeStyle = 'rgba(8,24,48,.85)'; g.strokeText(is.nombre, px * k, py * k); g.fillStyle = '#d6f1ff'; g.fillText(is.nombre, px * k, py * k);
  }
  // jugador
  const [qx, qy] = mapaPx(P.pos.x, P.pos.z);
  g.save(); g.translate(qx * k, qy * k); g.rotate(Math.PI - P.yaw);
  g.fillStyle = '#ffffff'; g.strokeStyle = '#d6231a'; g.lineWidth = 2.5;
  g.beginPath(); g.moveTo(0, -10); g.lineTo(7, 7); g.lineTo(0, 3); g.lineTo(-7, 7); g.closePath(); g.fill(); g.stroke();
  g.restore();
  g.fillStyle = '#fff6dc'; g.font = 'bold 13px sans-serif'; g.fillText('N ↑', W - 24, 18);
}
PANELES.mapa = {
  titulo: 'Mapa', clase: 'ancha', pie: false,
  render() {
    const botes = BOTES.filter((b) => G.botes[b.id]);
    const lista = botes.map((b) => {
      const o = BOTE.lista.find((x) => x.def.id === b.id);
      const am = amarre(b);
      const alMuelle = Math.hypot(o.x - am.x, o.z - am.z) < 3;
      const usando = BOTE.act === o;
      return fila(emo('⛵', b.color), b.nombre, usando ? 'Lo estás usando' : alMuelle ? 'Amarrado en el muelle' : `A ${Math.round(Math.hypot(o.x - P.pos.x, o.z - P.pos.z))} m de vos`, '', usando || alMuelle || P.modo === 'bote' ? '' : btn('traerBote', 'Traer al muelle', { chico: true, cls: 'verde', d: { id: b.id } }));
    }).join('');
    return `<div class="mapa-wrap"><canvas id="mapa-cv" width="560" height="560"></canvas>
      <div class="mapa-info"><h3>Zonas del mar</h3>${ZONAS.map((z) => `<div class="leyenda"><span class="zona-pt" style="background:${z.tono}"></span><b>${z.nombre}</b><small>${z.hasta > 9e8 ? `desde ${z.desde} m` : `${z.desde}–${z.hasta} m`}</small></div>`).join('')}
      <p class="nota chico">La línea punteada amarilla marca hasta dónde aguanta el mar tu mejor bote.</p>
      <h3>Tus botes</h3>${lista || '<div class="vacio">Todavía no tenés botes. Se compran en el almacén.</div>'}</div></div>`;
  },
  despues(root) { dibujarMapaGrande($('#mapa-cv', root)); },
};
ACC.traerBote = (d) => { if (llamarBote(d.id)) toast('Tu bote volvió al muelle.', '#9bffb0'); };
