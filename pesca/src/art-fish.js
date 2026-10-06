'use strict';
// Criaturas marinas dibujadas con código. Todas miran hacia +x y miden L de largo.
// o.sombra: si viene un color, se dibuja como silueta (la sombra que se ve en el agua).
// o.wig: oscilación de -1 a 1 (coletazo / aleteo).

const DK = 'rgba(8,24,52,.4)'; // trazo oscuro para contornos

function colaPath(c, tipo, L, ht) {
  const e = L * 0.27;
  c.beginPath();
  if (tipo === 'lun') {
    c.moveTo(L * 0.05, -ht * 0.1);
    c.bezierCurveTo(-e * 0.3, -ht * 0.16, -e * 0.7, -ht * 0.45, -e * 1.2, -ht * 0.88);
    c.bezierCurveTo(-e * 0.85, -ht * 0.3, -e * 0.8, ht * 0.3, -e * 1.2, ht * 0.88);
    c.bezierCurveTo(-e * 0.7, ht * 0.45, -e * 0.3, ht * 0.16, L * 0.05, ht * 0.1);
  } else if (tipo === 'red') {
    c.moveTo(L * 0.05, -ht * 0.14);
    c.bezierCurveTo(-e * 0.45, -ht * 0.62, -e * 1.2, -ht * 0.6, -e * 1.15, 0);
    c.bezierCurveTo(-e * 1.2, ht * 0.6, -e * 0.45, ht * 0.62, L * 0.05, ht * 0.14);
  } else if (tipo === 'trunc') {
    c.moveTo(L * 0.04, -ht * 0.46);
    c.bezierCurveTo(-e * 0.3, -ht * 0.54, -e * 0.62, -ht * 0.3, -e * 0.55, 0);
    c.bezierCurveTo(-e * 0.62, ht * 0.3, -e * 0.3, ht * 0.54, L * 0.04, ht * 0.46);
  } else {
    c.moveTo(L * 0.05, -ht * 0.12);
    c.bezierCurveTo(-e * 0.3, -ht * 0.2, -e * 0.75, -ht * 0.5, -e * 1.05, -ht * 0.66);
    c.bezierCurveTo(-e * 0.82, -ht * 0.22, -e * 0.8, ht * 0.22, -e * 1.05, ht * 0.66);
    c.bezierCurveTo(-e * 0.75, ht * 0.5, -e * 0.3, ht * 0.2, L * 0.05, ht * 0.12);
  }
  c.closePath();
}
function cuerpoPath(c, L, H) {
  c.beginPath();
  c.moveTo(L * 0.5, H * 0.03);
  c.bezierCurveTo(L * 0.47, -H * 0.28, L * 0.3, -H * 0.5, L * 0.06, -H * 0.5);
  c.bezierCurveTo(-L * 0.14, -H * 0.5, -L * 0.28, -H * 0.25, -L * 0.36, -H * 0.12);
  c.lineTo(-L * 0.36, H * 0.12);
  c.bezierCurveTo(-L * 0.27, H * 0.26, -L * 0.13, H * 0.5, L * 0.08, H * 0.5);
  c.bezierCurveTo(L * 0.3, H * 0.5, L * 0.47, H * 0.3, L * 0.5, H * 0.03);
  c.closePath();
}

function aletasPez(c, a, L, H, o) {
  const sil = o.sombra;
  c.fillStyle = sil || a.aleta;
  c.strokeStyle = sil ? 'rgba(0,0,0,0)' : DK;
  c.lineWidth = Math.max(0.7, L / 75);
  c.lineJoin = 'round';
  const top = -H * 0.5, b = top * 0.8;
  const D = a.dorsal;
  const wig = o.wig || 0;
  c.beginPath();
  if (D === 'norm') {
    c.moveTo(L * 0.16, b);
    c.quadraticCurveTo(L * 0.02, top - H * 0.62, -L * 0.15, b * 0.9);
  } else if (D === 'larga') {
    c.moveTo(L * 0.3, b);
    for (let i = 0; i < 6; i++) {
      const x0 = L * 0.3 - i * L * 0.1;
      c.quadraticCurveTo(x0 - L * 0.05, top - H * (0.34 - i * 0.025), x0 - L * 0.1, b * (0.9 - i * 0.03));
    }
  } else if (D === 'vela') {
    c.moveTo(L * 0.3, b);
    c.quadraticCurveTo(L * 0.2, top - H * 1.0, L * 0.12, top - H * 0.98);
    c.quadraticCurveTo(-L * 0.05, top - H * 0.82, -L * 0.2, top - H * 0.55);
    c.lineTo(-L * 0.27, b * 0.8);
  } else if (D === 'espinas') {
    c.moveTo(L * 0.28, b);
    for (let i = 0; i < 7; i++) {
      const x = L * 0.28 - i * L * 0.075;
      c.lineTo(x - L * 0.02, top - H * (0.4 - i * 0.025));
      c.lineTo(x - L * 0.06, b * 0.95);
    }
  } else if (D === 'aletillas') {
    c.moveTo(L * 0.16, b);
    c.quadraticCurveTo(L * 0.05, top - H * 0.55, -L * 0.1, b * 0.9);
    c.moveTo(-L * 0.14, b * 0.8);
    for (let i = 0; i < 5; i++) {
      const x = -L * 0.14 - i * L * 0.04;
      c.lineTo(x - L * 0.02, top * 0.62 - H * 0.12);
      c.lineTo(x - L * 0.04, b * 0.6);
    }
  } else if (D === 'aletaalta') {
    c.moveTo(L * 0.1, b);
    c.quadraticCurveTo(-L * 0.08, top - H * 0.5, -L * 0.22, top - H * 0.46);
    c.quadraticCurveTo(-L * 0.28, top - H * 0.2, -L * 0.3, b * 0.9);
    c.moveTo(L * 0.1, -b);
    c.quadraticCurveTo(-L * 0.08, -top + H * 0.5, -L * 0.22, -top + H * 0.46);
    c.quadraticCurveTo(-L * 0.28, -top + H * 0.2, -L * 0.3, -b * 0.9);
  }
  c.closePath();
  c.fill();
  if (!sil) c.stroke();
  if (D === 'vela' && !sil) {
    // radios y manchas de la vela
    c.strokeStyle = 'rgba(10,30,60,.28)';
    c.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      c.beginPath();
      c.moveTo(L * 0.28 - i * L * 0.075, b);
      c.lineTo(L * 0.12 - i * L * 0.06, top - H * (0.92 - i * 0.1));
      c.stroke();
    }
    if (a.patron === 'puntos') {
      c.fillStyle = a.pcolor;
      for (let i = 0; i < 9; i++) {
        c.beginPath();
        c.arc(L * 0.16 - (i % 3) * L * 0.07, top - H * (0.3 + Math.floor(i / 3) * 0.22), Math.max(1.2, L * 0.012), 0, TAU);
        c.fill();
      }
    }
  }
  // aleta anal y ventral
  if (D !== 'aletaalta') {
    c.fillStyle = sil || a.aleta;
    c.beginPath();
    c.moveTo(-L * 0.02, -b);
    c.quadraticCurveTo(-L * 0.14, -top + H * 0.5, -L * 0.28, -b * 0.7);
    c.closePath();
    c.fill();
    if (!sil) c.stroke();
    c.beginPath();
    c.moveTo(L * 0.14, -b);
    c.quadraticCurveTo(L * 0.06, -top + H * 0.42, -L * 0.04, -b);
    c.closePath();
    c.fill();
    if (!sil) c.stroke();
  }
  void wig;
}

function pezLado(c, a, L, o) {
  const H = L * a.alto, wig = o.wig || 0, sil = o.sombra;
  const lw = Math.max(0.8, L / 55);
  // pico (pez espada / vela)
  if (a.pico) {
    c.fillStyle = sil || '#27324a';
    c.beginPath();
    c.moveTo(L * 0.46, -H * 0.05);
    c.lineTo(L * (0.5 + a.pico), H * 0.0);
    c.lineTo(L * 0.46, H * 0.07);
    c.closePath();
    c.fill();
  }
  // cola
  const ht = Math.max(H * 0.95, L * 0.16);
  c.save();
  c.translate(-L * 0.34, 0);
  c.rotate(wig * 0.34);
  colaPath(c, a.cola, L, ht);
  c.fillStyle = sil || a.aleta;
  c.fill();
  if (!sil) {
    c.strokeStyle = DK;
    c.lineWidth = lw;
    c.stroke();
    c.strokeStyle = 'rgba(255,255,255,.25)';
    c.lineWidth = 1;
    for (const k of [-0.5, -0.2, 0.2, 0.5]) {
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(-L * 0.25, ht * k);
      c.stroke();
    }
  }
  c.restore();
  aletasPez(c, a, L, H, o);
  // cuerpo
  cuerpoPath(c, L, H);
  if (sil) {
    c.fillStyle = sil;
    c.fill();
    return;
  }
  const g = c.createLinearGradient(0, -H * 0.5, 0, H * 0.5);
  g.addColorStop(0, shade(a.lomo, -0.22));
  g.addColorStop(0.4, a.lomo);
  g.addColorStop(0.6, mixHex(a.lomo, a.panza, 0.55));
  g.addColorStop(0.82, a.panza);
  g.addColorStop(1, shade(a.panza, -0.08));
  c.fillStyle = g;
  c.fill();
  c.save();
  c.clip();
  // patrones
  const pc = a.pcolor || '#fff';
  const P = a.patron;
  if (P === 'linea') {
    c.fillStyle = pc;
    c.globalAlpha = 0.75;
    c.beginPath();
    c.moveTo(L * 0.4, -H * 0.02);
    c.lineTo(-L * 0.37, -H * 0.05);
    c.lineTo(-L * 0.37, H * 0.05);
    c.lineTo(L * 0.4, H * 0.07);
    c.closePath();
    c.fill();
    c.globalAlpha = 1;
  } else if (P === 'barras') {
    c.fillStyle = pc;
    c.globalAlpha = 0.5;
    for (let i = 0; i < 5; i++) {
      const x = L * 0.27 - i * L * 0.13;
      c.beginPath();
      c.moveTo(x, -H * 0.55);
      c.lineTo(x + L * 0.045, -H * 0.55);
      c.lineTo(x + L * 0.02, H * 0.55);
      c.lineTo(x - L * 0.025, H * 0.55);
      c.closePath();
      c.fill();
    }
    c.globalAlpha = 1;
  } else if (P === 'puntos') {
    c.fillStyle = pc;
    c.globalAlpha = 0.75;
    for (let i = 0; i < 16; i++) {
      c.beginPath();
      c.arc(-L * 0.3 + L * 0.62 * hash2(i, 3), -H * 0.4 + H * 0.5 * hash2(i, 9), Math.max(1, H * (0.035 + 0.03 * hash2(i, 5))), 0, TAU);
      c.fill();
    }
    c.globalAlpha = 1;
  } else if (P === 'franjas') {
    for (const [x, w] of [[0.27, 0.07], [0.0, 0.09], [-0.27, 0.05]]) {
      c.fillStyle = '#1b1b1b';
      c.fillRect(L * (x - w / 2 - 0.012), -H * 0.55, L * (w + 0.024), H * 1.1);
      c.fillStyle = pc;
      c.fillRect(L * (x - w / 2), -H * 0.55, L * w, H * 1.1);
    }
  } else if (P === 'manchas') {
    c.fillStyle = pc;
    c.globalAlpha = 0.5;
    for (let i = 0; i < 9; i++) {
      c.beginPath();
      c.ellipse(-L * 0.28 + L * 0.58 * hash2(i, 11), -H * 0.36 + H * 0.62 * hash2(i, 7), L * 0.035, H * 0.09, 0.5, 0, TAU);
      c.fill();
    }
    c.globalAlpha = 1;
  }
  if (a.brilla) {
    for (let i = 0; i < 9; i++) {
      const px = L * 0.3 - i * L * 0.075, py = H * 0.3;
      const gl = 0.55 + 0.45 * Math.sin(J.t * 3 + i);
      c.fillStyle = `rgba(110,255,240,${(0.5 * gl).toFixed(2)})`;
      c.beginPath();
      c.arc(px, py, Math.max(1.6, L * 0.028), 0, TAU);
      c.fill();
      c.fillStyle = '#e8fffb';
      c.beginPath();
      c.arc(px, py, Math.max(0.9, L * 0.012), 0, TAU);
      c.fill();
    }
  }
  // brillo del lomo
  c.strokeStyle = 'rgba(255,255,255,.35)';
  c.lineWidth = Math.max(1, L / 40);
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(L * 0.3, -H * 0.38);
  c.quadraticCurveTo(0, -H * 0.46, -L * 0.2, -H * 0.3);
  c.stroke();
  c.restore();
  cuerpoPath(c, L, H);
  c.strokeStyle = DK;
  c.lineWidth = lw;
  c.stroke();
  // agalla, ojo, boca
  c.strokeStyle = 'rgba(10,30,50,.3)';
  c.lineWidth = Math.max(1, L / 60);
  c.beginPath();
  c.arc(L * 0.12, 0, Math.min(H * 0.38, L * 0.2), -0.95, 0.95);
  c.stroke();
  const er = clamp(H * 0.085, 1.5, L * 0.055);
  c.fillStyle = '#fff';
  c.beginPath();
  c.arc(L * 0.36, -H * 0.09, er * 1.35, 0, TAU);
  c.fill();
  c.fillStyle = '#10151c';
  c.beginPath();
  c.arc(L * 0.365, -H * 0.09, er, 0, TAU);
  c.fill();
  c.fillStyle = '#fff';
  c.beginPath();
  c.arc(L * 0.36, -H * 0.12, er * 0.35, 0, TAU);
  c.fill();
  c.strokeStyle = 'rgba(10,20,30,.55)';
  c.lineWidth = Math.max(1, L / 70);
  c.beginPath();
  c.moveTo(L * 0.5, H * 0.07);
  c.lineTo(L * 0.42, H * 0.1);
  c.stroke();
  if (a.dientes) {
    c.fillStyle = '#fff';
    for (let i = 0; i < 6; i++) {
      const x = L * 0.49 - i * L * 0.016;
      c.beginPath();
      c.moveTo(x, H * 0.07 + i * 0.1);
      c.lineTo(x - L * 0.007, H * 0.07 + L * 0.03 + i * 0.1);
      c.lineTo(x - L * 0.014, H * 0.07 + i * 0.1 + H * 0.02);
      c.closePath();
      c.fill();
    }
  }
  // pectoral
  c.save();
  c.translate(L * 0.2, H * 0.12);
  c.rotate(0.55 + wig * 0.25);
  c.fillStyle = a.aleta;
  c.globalAlpha = 0.9;
  c.beginPath();
  c.ellipse(-L * 0.06, 0, L * 0.09, Math.max(H * 0.1, L * 0.025), 0, 0, TAU);
  c.fill();
  c.globalAlpha = 1;
  c.strokeStyle = DK;
  c.lineWidth = Math.max(0.7, L / 80);
  c.stroke();
  c.restore();
}

// ---------------------------------------------------------------------------
// Camarón (visto desde arriba)
function camaronArte(c, a, L, o) {
  const sil = o.sombra, wig = o.wig || 0;
  const N = 8;
  const seg = [];
  for (let i = 0; i < N; i++) {
    const u = i / (N - 1);
    seg.push({ x: L * 0.4 - u * L * 0.8, y: Math.sin(u * 3 + wig * 0.6) * L * 0.07 * u, r: L * (0.09 - u * 0.045) });
  }
  // antenas
  c.strokeStyle = sil || mixHex(a.c1, '#ffffff', 0.2);
  c.lineWidth = Math.max(0.8, L / 28);
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(L * 0.4, -L * 0.03);
  c.quadraticCurveTo(L * 0.72, -L * 0.28, L * 0.62, -L * 0.42 + wig * 3);
  c.moveTo(L * 0.4, L * 0.03);
  c.quadraticCurveTo(L * 0.72, L * 0.28, L * 0.62, L * 0.42 - wig * 3);
  c.stroke();
  // patitas
  c.lineWidth = Math.max(0.7, L / 40);
  for (let i = 1; i < 5; i++) {
    const s = seg[i];
    c.beginPath();
    c.moveTo(s.x, s.y - s.r * 0.6);
    c.lineTo(s.x + L * 0.05, s.y - s.r - L * 0.08 + wig * 1.2 * (i % 2 ? 1 : -1));
    c.moveTo(s.x, s.y + s.r * 0.6);
    c.lineTo(s.x + L * 0.05, s.y + s.r + L * 0.08 - wig * 1.2 * (i % 2 ? 1 : -1));
    c.stroke();
  }
  // cola en abanico
  const t = seg[N - 1];
  c.save();
  c.translate(t.x, t.y);
  c.rotate(wig * 0.25);
  c.fillStyle = sil || a.c1;
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(-L * 0.2, -L * 0.1);
  c.lineTo(-L * 0.24, 0);
  c.lineTo(-L * 0.2, L * 0.1);
  c.closePath();
  c.fill();
  c.restore();
  // cuerpo segmentado
  for (let i = 0; i < N; i++) {
    const s = seg[i];
    c.fillStyle = sil || (i % 2 ? a.c1 : mixHex(a.c1, a.c2, 0.45));
    c.beginPath();
    c.ellipse(s.x, s.y, s.r * (i === 0 ? 1.6 : 1.15), s.r, 0, 0, TAU);
    c.fill();
    if (!sil) {
      c.strokeStyle = DK;
      c.lineWidth = 0.8;
      c.stroke();
    }
  }
  if (!sil) {
    c.fillStyle = '#10151c';
    c.beginPath();
    c.arc(L * 0.43, -L * 0.04, L * 0.022, 0, TAU);
    c.arc(L * 0.43, L * 0.04, L * 0.022, 0, TAU);
    c.fill();
  }
}

// Cangrejo (desde arriba)
function cangrejoArte(c, a, L, o) {
  const sil = o.sombra, wig = o.wig || 0, s = L / 44;
  c.scale(s, s);
  const col = sil || a.c1, col2 = sil || mixHex(a.c1, '#000000', 0.18);
  c.lineCap = 'round';
  c.lineJoin = 'round';
  // patas
  c.strokeStyle = col2;
  c.lineWidth = 2.6;
  for (const sd of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const bx = -9 + i * 7, w = Math.sin(J.t * 9 + i * 2 + sd) * wig * 2.5 + (o.cam ? 0 : 0);
      c.beginPath();
      c.moveTo(bx, sd * 8);
      c.lineTo(bx - 3 + w, sd * 17);
      c.lineTo(bx - 8 + w, sd * 20);
      c.stroke();
    }
  }
  // brazos y pinzas
  for (const sd of [-1, 1]) {
    const ab = Math.sin(J.t * 6 + sd) * wig * 2;
    c.strokeStyle = col2;
    c.lineWidth = 3.4;
    c.beginPath();
    c.moveTo(11, sd * 7);
    c.lineTo(20, sd * 12 + ab);
    c.stroke();
    c.fillStyle = col;
    c.beginPath();
    c.ellipse(26 + (o.alza || 0) * 5, sd * 12 + ab - sd * (o.alza || 0) * 3, 8.5 * (1 + (o.alza || 0) * 0.35), 5.8 * (1 + (o.alza || 0) * 0.35), sd * 0.2, 0, TAU);
    c.fill();
    c.strokeStyle = col2;
    c.lineWidth = 1.4;
    c.stroke();
    c.fillStyle = sil || '#1c0f08';
    c.beginPath();
    c.moveTo(32, sd * 12 + ab - 1);
    c.lineTo(38, sd * 9 + ab);
    c.lineTo(34, sd * 12 + ab + 3);
    c.closePath();
    c.fill();
  }
  // caparazón
  c.beginPath();
  for (let i = 0; i < 16; i++) {
    const th = (i / 16) * TAU, r = 1 + (i % 2) * 0.05;
    const x = Math.cos(th) * 15 * r, y = Math.sin(th) * 12 * r;
    if (i) c.lineTo(x, y); else c.moveTo(x, y);
  }
  c.closePath();
  if (sil) {
    c.fillStyle = sil;
    c.fill();
    return;
  }
  const g = c.createRadialGradient(-3, -3, 2, 0, 0, 16);
  g.addColorStop(0, a.c2);
  g.addColorStop(1, a.c1);
  c.fillStyle = g;
  c.fill();
  c.strokeStyle = col2;
  c.lineWidth = 1.6;
  c.stroke();
  c.fillStyle = 'rgba(255,255,255,.3)';
  c.beginPath();
  c.ellipse(-3, -5, 6, 3, -0.2, 0, TAU);
  c.fill();
  c.fillStyle = '#10151c';
  c.beginPath();
  c.arc(13, -3.5, 1.9, 0, TAU);
  c.arc(13, 3.5, 1.9, 0, TAU);
  c.fill();
  if (o.corona) {
    c.fillStyle = '#ffd23c';
    c.strokeStyle = '#a8761a';
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(-8, 5); c.lineTo(-8, -5); c.lineTo(-4, -1); c.lineTo(0, -6); c.lineTo(4, -1); c.lineTo(8, -5); c.lineTo(8, 5); c.closePath();
    c.fill(); c.stroke();
    c.fillStyle = '#ff4d5e';
    c.beginPath(); c.arc(0, 0, 1.6, 0, TAU); c.fill();
  }
}

// Estrella de mar
function estrellaArte(c, a, L, o) {
  const sil = o.sombra, R1 = L * 0.5, R2 = L * 0.2;
  c.rotate((o.wig || 0) * 0.12);
  c.beginPath();
  for (let i = 0; i < 10; i++) {
    const th = (i / 10) * TAU - Math.PI / 2, r = i % 2 ? R2 : R1;
    const x = Math.cos(th) * r, y = Math.sin(th) * r;
    if (i) c.lineTo(x, y); else c.moveTo(x, y);
  }
  c.closePath();
  c.lineJoin = 'round';
  if (sil) {
    c.fillStyle = sil;
    c.lineWidth = L * 0.1;
    c.strokeStyle = sil;
    c.stroke();
    c.fill();
    return;
  }
  const g = c.createRadialGradient(0, 0, 1, 0, 0, R1);
  g.addColorStop(0, a.c2);
  g.addColorStop(1, a.c1);
  c.fillStyle = g;
  c.strokeStyle = a.c1;
  c.lineWidth = L * 0.1;
  c.stroke();
  c.fill();
  c.fillStyle = 'rgba(120,50,10,.55)';
  for (let k = 0; k < 5; k++) {
    const th = (k / 5) * TAU - Math.PI / 2;
    for (let j = 1; j < 5; j++) {
      c.beginPath();
      c.arc(Math.cos(th) * R1 * 0.18 * j, Math.sin(th) * R1 * 0.18 * j, Math.max(0.8, L * 0.022 * (1 - j * 0.1)), 0, TAU);
      c.fill();
    }
  }
}

// Pez globo
function globoArte(c, a, L, o) {
  const sil = o.sombra, wig = o.wig || 0;
  const rx = L * 0.38, ry = L * 0.34;
  c.save();
  c.translate(-L * 0.36, 0);
  c.rotate(wig * 0.4);
  c.fillStyle = sil || mixHex(a.c1, '#8a6a2a', 0.3);
  c.beginPath();
  c.moveTo(L * 0.1, -2);
  c.quadraticCurveTo(-L * 0.12, -L * 0.18, -L * 0.18, -L * 0.1);
  c.quadraticCurveTo(-L * 0.12, 0, -L * 0.18, L * 0.1);
  c.quadraticCurveTo(-L * 0.12, L * 0.18, L * 0.1, 2);
  c.closePath();
  c.fill();
  c.restore();
  c.beginPath();
  c.ellipse(0, 0, rx, ry, 0, 0, TAU);
  if (sil) {
    c.fillStyle = sil;
    c.fill();
    return;
  }
  const g = c.createLinearGradient(0, -ry, 0, ry);
  g.addColorStop(0, mixHex(a.c1, '#6a4a1a', 0.35));
  g.addColorStop(0.5, a.c1);
  g.addColorStop(0.7, a.c2);
  g.addColorStop(1, '#fffbe8');
  c.fillStyle = g;
  c.fill();
  c.strokeStyle = DK;
  c.lineWidth = Math.max(1, L / 40);
  c.stroke();
  c.save();
  c.clip();
  c.fillStyle = 'rgba(80,50,10,.5)';
  for (let i = 0; i < 12; i++) {
    c.beginPath();
    c.arc(-rx * 0.7 + rx * 1.1 * hash2(i, 2), -ry * 0.8 + ry * 0.9 * hash2(i, 4), L * 0.025, 0, TAU);
    c.fill();
  }
  c.restore();
  // púas
  c.fillStyle = '#fff6d6';
  for (let i = 0; i < 16; i++) {
    const th = Math.PI + 0.2 + (i / 15) * (Math.PI * 1.55) - 0.4;
    const px = Math.cos(th) * rx, py = Math.sin(th) * ry;
    const nx = Math.cos(th), ny = Math.sin(th);
    c.beginPath();
    c.moveTo(px - ny * 2, py + nx * 2);
    c.lineTo(px + nx * L * 0.06, py + ny * L * 0.06);
    c.lineTo(px + ny * 2, py - nx * 2);
    c.closePath();
    c.fill();
  }
  // aleta, ojo, boca
  c.fillStyle = a.c2;
  c.beginPath();
  c.ellipse(L * 0.04, L * 0.1, L * 0.09, L * 0.04, 0.7 + wig * 0.3, 0, TAU);
  c.fill();
  c.fillStyle = '#fff';
  c.beginPath();
  c.arc(L * 0.22, -L * 0.07, L * 0.07, 0, TAU);
  c.fill();
  c.fillStyle = '#10151c';
  c.beginPath();
  c.arc(L * 0.235, -L * 0.07, L * 0.045, 0, TAU);
  c.fill();
  c.fillStyle = '#e8b4a0';
  c.beginPath();
  c.ellipse(L * 0.37, L * 0.05, L * 0.035, L * 0.03, 0, 0, TAU);
  c.fill();
}

// Pulpo
function pulpoArte(c, a, L, o) {
  const sil = o.sombra, wig = o.wig || 0, t = J.t;
  const R = L * 0.2;
  const cuerpo = sil || a.c1;
  c.lineCap = 'round';
  for (let i = 0; i < 8; i++) {
    const base = Math.PI * 0.62 + (i / 7) * Math.PI * 0.76 + Math.PI;
    const dir = -1 + ((i - 3.5) / 3.5) * 0.7;
    const pts = [];
    for (let k = 0; k <= 8; k++) {
      const u = k / 8;
      const ang = Math.PI + dir * 0.9 * u + Math.sin(t * 3.5 + i * 0.8 + u * 5) * 0.45 * u * (0.5 + Math.abs(wig));
      pts.push([-R * 0.4 + Math.cos(ang) * L * 0.46 * u * 1.05, Math.sin(ang) * L * 0.46 * u * 1.15 + (i - 3.5) * R * 0.2 * (1 - u)]);
    }
    void base;
    for (let k = 0; k < pts.length - 1; k++) {
      c.strokeStyle = cuerpo;
      c.lineWidth = Math.max(1.2, R * 0.55 * (1 - k / 9));
      c.beginPath();
      c.moveTo(pts[k][0], pts[k][1]);
      c.lineTo(pts[k + 1][0], pts[k + 1][1]);
      c.stroke();
      if (!sil && k % 2 === 1) {
        c.fillStyle = a.c2;
        c.beginPath();
        c.arc(pts[k][0], pts[k][1] + 0.5, Math.max(0.6, R * 0.08), 0, TAU);
        c.fill();
      }
    }
  }
  // manto y cabeza
  c.beginPath();
  c.ellipse(R * 0.1, 0, R * 1.5, R * 1.05, 0, 0, TAU);
  if (sil) {
    c.fillStyle = sil;
    c.fill();
    return;
  }
  const g = c.createRadialGradient(R * 0.3, -R * 0.4, 1, R * 0.1, 0, R * 1.5);
  g.addColorStop(0, a.c2);
  g.addColorStop(1, a.c1);
  c.fillStyle = g;
  c.fill();
  c.strokeStyle = DK;
  c.lineWidth = Math.max(1, L / 50);
  c.stroke();
  c.fillStyle = 'rgba(255,255,255,.3)';
  c.beginPath();
  c.ellipse(-R * 0.2, -R * 0.5, R * 0.5, R * 0.2, -0.3, 0, TAU);
  c.fill();
  for (const sd of [-1, 1]) {
    c.fillStyle = '#fff6d0';
    c.beginPath();
    c.arc(R * 0.95, sd * R * 0.46, R * 0.3, 0, TAU);
    c.fill();
    c.fillStyle = '#10151c';
    c.beginPath();
    c.ellipse(R * 1.0, sd * R * 0.46, R * 0.18, R * 0.08, 0, 0, TAU);
    c.fill();
  }
}

// Langosta
function langostaArte(c, a, L, o) {
  const sil = o.sombra, wig = o.wig || 0, s = L / 44;
  c.scale(s, s);
  c.lineCap = 'round';
  c.lineJoin = 'round';
  const col = sil || a.c1, col2 = sil || mixHex(a.c1, '#000', 0.2);
  // antenas largas
  c.strokeStyle = col2;
  c.lineWidth = 1.4;
  c.beginPath();
  c.moveTo(18, -3);
  c.quadraticCurveTo(34, -14 + wig * 3, 44, -22);
  c.moveTo(18, 3);
  c.quadraticCurveTo(34, 14 - wig * 3, 44, 22);
  c.stroke();
  // patas
  c.lineWidth = 2;
  for (const sd of [-1, 1]) for (let i = 0; i < 4; i++) {
    const bx = 10 - i * 5, w = Math.sin(J.t * 8 + i + sd) * wig * 2;
    c.beginPath();
    c.moveTo(bx, sd * 5);
    c.lineTo(bx + 3 + w, sd * 12);
    c.stroke();
  }
  // pinzas
  for (const sd of [-1, 1]) {
    c.strokeStyle = col2;
    c.lineWidth = 3.2;
    c.beginPath();
    c.moveTo(14, sd * 6);
    c.lineTo(26, sd * 11);
    c.stroke();
    c.fillStyle = col;
    c.beginPath();
    c.ellipse(32, sd * 13, 8, 5, sd * 0.35, 0, TAU);
    c.fill();
    c.strokeStyle = col2;
    c.lineWidth = 1.2;
    c.stroke();
    c.fillStyle = col;
    c.beginPath();
    c.moveTo(38, sd * 11);
    c.lineTo(45, sd * 14);
    c.lineTo(38, sd * 16);
    c.closePath();
    c.fill();
  }
  // abdomen segmentado
  for (let i = 0; i < 5; i++) {
    const x = -4 - i * 6.5, r = 7.5 - i * 0.7;
    c.fillStyle = sil || (i % 2 ? col : mixHex(a.c1, a.c2, 0.35));
    c.beginPath();
    c.ellipse(x, Math.sin(wig + i) * wig * 1.5, 4, r, 0, 0, TAU);
    c.fill();
    if (!sil) {
      c.strokeStyle = col2;
      c.lineWidth = 1;
      c.stroke();
    }
  }
  // abanico de la cola
  c.fillStyle = col;
  c.save();
  c.translate(-37, 0);
  c.rotate(wig * 0.3);
  for (const ang of [-0.7, -0.25, 0.25, 0.7]) {
    c.save();
    c.rotate(ang);
    c.beginPath();
    c.ellipse(-5, 0, 7, 3.4, 0, 0, TAU);
    c.fill();
    c.restore();
  }
  c.restore();
  // cefalotórax
  c.beginPath();
  c.ellipse(8, 0, 13, 9, 0, 0, TAU);
  c.fillStyle = sil || a.c1;
  if (sil) {
    c.fillStyle = sil;
    c.fill();
    return;
  }
  const g = c.createLinearGradient(0, -9, 0, 9);
  g.addColorStop(0, a.c2);
  g.addColorStop(1, a.c1);
  c.fillStyle = g;
  c.fill();
  c.strokeStyle = col2;
  c.lineWidth = 1.4;
  c.stroke();
  c.fillStyle = '#10151c';
  c.beginPath();
  c.arc(18, -4, 1.6, 0, TAU);
  c.arc(18, 4, 1.6, 0, TAU);
  c.fill();
}

// Medusa
function medusaArte(c, a, L, o) {
  const sil = o.sombra, wig = o.wig || 0, t = J.t;
  const R = L * 0.32, pulso = 1 + wig * 0.1;
  c.lineCap = 'round';
  // tentáculos largos
  c.strokeStyle = sil || mixHex(a.c1, '#fff', 0.2);
  for (let i = 0; i < 7; i++) {
    const y0 = (i - 3) * R * 0.28;
    c.lineWidth = Math.max(0.8, L / 32);
    c.beginPath();
    c.moveTo(-R * 0.3, y0);
    for (let k = 1; k <= 7; k++) c.lineTo(-R * 0.3 - k * L * 0.1, y0 + Math.sin(t * 3 + i + k * 0.9) * L * 0.05 * k * 0.4);
    c.stroke();
  }
  // brazos orales
  c.lineWidth = Math.max(2, L / 12);
  c.strokeStyle = sil || a.c2;
  for (let i = -1; i <= 1; i++) {
    c.beginPath();
    c.moveTo(-R * 0.1, i * R * 0.25);
    c.quadraticCurveTo(-R * 0.9, i * R * 0.45 + wig * 3, -R * 1.5, i * R * 0.2 + Math.sin(t * 3 + i) * 3);
    c.stroke();
  }
  // campana
  c.beginPath();
  c.moveTo(-R * 0.3, -R * 1.0 * pulso);
  c.bezierCurveTo(R * 1.3 * pulso, -R * 1.1, R * 1.3 * pulso, R * 1.1, -R * 0.3, R * 1.0 * pulso);
  for (let i = 0; i < 6; i++) {
    const y = R * 1.0 * pulso - (i + 0.5) * ((R * 2 * pulso) / 6);
    c.quadraticCurveTo(-R * 0.15, y + R * 0.17, -R * 0.3, y - R * 0.17);
  }
  c.closePath();
  if (sil) {
    c.fillStyle = sil;
    c.fill();
    return;
  }
  const g = c.createRadialGradient(R * 0.2, 0, 2, 0, 0, R * 1.3);
  g.addColorStop(0, 'rgba(255,255,255,.85)');
  g.addColorStop(0.55, mixHex(a.c2, a.c1, 0.4));
  g.addColorStop(1, a.c1);
  c.globalAlpha = 0.82;
  c.fillStyle = g;
  c.fill();
  c.globalAlpha = 1;
  c.strokeStyle = 'rgba(255,255,255,.65)';
  c.lineWidth = 1.2;
  c.stroke();
  c.strokeStyle = 'rgba(255,255,255,.5)';
  for (let i = -2; i <= 2; i++) {
    c.beginPath();
    c.moveTo(-R * 0.25, i * R * 0.3);
    c.quadraticCurveTo(R * 0.5, i * R * 0.34, R * 0.95, i * R * 0.22);
    c.stroke();
  }
}

// Raya (desde arriba)
function rayaArte(c, a, L, o) {
  const sil = o.sombra, wig = o.wig || 0;
  const W = L * 0.5;
  c.lineCap = 'round';
  c.strokeStyle = sil || mixHex(a.c1, '#000', 0.25);
  c.lineWidth = Math.max(1, L * 0.018);
  c.beginPath();
  c.moveTo(-L * 0.18, 0);
  c.quadraticCurveTo(-L * 0.6, wig * L * 0.1, -L * 0.98, wig * L * 0.18);
  c.stroke();
  const f = wig * W * 0.14;
  c.beginPath();
  c.moveTo(L * 0.42, 0);
  c.bezierCurveTo(L * 0.3, -W * 0.5, L * 0.08, -W * 0.82 - f, -L * 0.1, -W * 1.0 - f * 1.6);
  c.quadraticCurveTo(-L * 0.2, -W * 0.7 - f, -L * 0.2, -W * 0.18);
  c.lineTo(-L * 0.2, W * 0.18);
  c.quadraticCurveTo(-L * 0.2, W * 0.7 + f, -L * 0.1, W * 1.0 + f * 1.6);
  c.bezierCurveTo(L * 0.08, W * 0.82 + f, L * 0.3, W * 0.5, L * 0.42, 0);
  c.closePath();
  if (sil) {
    c.fillStyle = sil;
    c.fill();
    return;
  }
  const g = c.createLinearGradient(0, -W, 0, W);
  g.addColorStop(0, mixHex(a.c1, '#fff', 0.3));
  g.addColorStop(0.5, a.c1);
  g.addColorStop(1, mixHex(a.c1, '#fff', 0.3));
  c.fillStyle = g;
  c.fill();
  c.strokeStyle = DK;
  c.lineWidth = Math.max(1, L / 50);
  c.stroke();
  c.save();
  c.clip();
  c.fillStyle = 'rgba(255,255,255,.45)';
  for (let i = 0; i < 16; i++) {
    c.beginPath();
    c.arc(-L * 0.15 + L * 0.5 * hash2(i, 21), -W * 0.8 + W * 1.6 * hash2(i, 22), L * (0.012 + 0.02 * hash2(i, 23)), 0, TAU);
    c.fill();
  }
  c.restore();
  c.fillStyle = '#10151c';
  c.beginPath();
  c.arc(L * 0.28, -W * 0.14, L * 0.02, 0, TAU);
  c.arc(L * 0.28, W * 0.14, L * 0.02, 0, TAU);
  c.fill();
}

// Culebra: cuerpo largo que ondula (morena, cinta, anguila, leviatán)
function culebraPuntos(L, n, amp, k, fase, tail) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const env = tail ? 0.3 + 0.7 * u : 1;
    pts.push({ u, x: L * 0.5 - u * L, y: amp * Math.sin(u * k * TAU - fase) * env });
  }
  for (let i = 0; i <= n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n, i + 1)];
    const tx = b.x - a.x, ty = b.y - a.y, tl = Math.hypot(tx, ty) || 1;
    pts[i].nx = -ty / tl;
    pts[i].ny = tx / tl;
  }
  return pts;
}
function culebraArte(c, a, L, o, cfg) {
  const sil = o.sombra, wig = o.wig || 0;
  const n = 28;
  const cb = cfg || {};
  const pts = culebraPuntos(L, n, L * (cb.amp || 0.07), cb.k || 1.5, J.t * (cb.vel || 4) + wig, true);
  const gr = L * (cb.grosor || 0.06);
  const prof = (u) => (u < 0.1 ? 0.7 + u * 3 : 1) * Math.pow(1 - u, cb.afil || 0.55) * (cb.cuello && u > 0.06 && u < 0.2 ? 0.85 : 1);
  // aleta dorsal pegada al lomo
  if (cb.aleta !== false) {
    c.beginPath();
    for (let i = 3; i <= n - 1; i++) {
      const p = pts[i], w = gr * prof(p.u), fh = gr * (cb.alto || 0.6) * (0.7 + 0.3 * Math.sin(i * 1.7)) * (1 - p.u * 0.5);
      const x = p.x + p.nx * (w + fh), y = p.y + p.ny * (w + fh);
      if (i === 3) c.lineTo(p.x + p.nx * w, p.y + p.ny * w);
      c.lineTo(x, y);
    }
    for (let i = n - 1; i >= 3; i--) {
      const p = pts[i], w = gr * prof(p.u);
      c.lineTo(p.x + p.nx * w * 0.8, p.y + p.ny * w * 0.8);
    }
    c.closePath();
    c.fillStyle = sil || cb.cAleta || mixHex(a.c1, a.c2, 0.6);
    c.globalAlpha = sil ? 1 : 0.85;
    c.fill();
    c.globalAlpha = 1;
  }
  // cuerpo
  c.beginPath();
  for (let i = 0; i <= n; i++) {
    const p = pts[i], w = gr * prof(p.u);
    const x = p.x + p.nx * w, y = p.y + p.ny * w;
    if (i) c.lineTo(x, y); else c.moveTo(x, y);
  }
  for (let i = n; i >= 0; i--) {
    const p = pts[i], w = gr * prof(p.u);
    c.lineTo(p.x - p.nx * w, p.y - p.ny * w);
  }
  c.closePath();
  if (sil) {
    c.fillStyle = sil;
    c.fill();
    return pts;
  }
  const g = c.createLinearGradient(0, -gr * 1.5, 0, gr * 1.5);
  g.addColorStop(0, shade(a.c1, -0.15));
  g.addColorStop(0.5, a.c1);
  g.addColorStop(1, a.c2);
  c.fillStyle = g;
  c.fill();
  c.strokeStyle = DK;
  c.lineWidth = Math.max(1, L / 90);
  c.stroke();
  // manchas
  if (cb.manchas !== false) {
    c.save();
    c.clip();
    c.fillStyle = cb.cMancha || 'rgba(30,50,10,.35)';
    for (let i = 2; i < n; i += 1) {
      const p = pts[i];
      if (hash2(i, 5) < 0.4) continue;
      c.beginPath();
      c.arc(p.x + p.nx * gr * (hash2(i, 6) - 0.5), p.y + p.ny * gr * (hash2(i, 6) - 0.5), gr * (0.18 + 0.25 * hash2(i, 8)) * prof(p.u) * 1.6, 0, TAU);
      c.fill();
    }
    c.restore();
  }
  // cabeza: ojos y boca
  const h = pts[1];
  c.fillStyle = '#10151c';
  c.beginPath();
  c.arc(h.x - L * 0.005 + h.nx * gr * 0.5, h.y + h.ny * gr * 0.5, Math.max(1.4, gr * 0.2), 0, TAU);
  c.arc(h.x - L * 0.005 - h.nx * gr * 0.5, h.y - h.ny * gr * 0.5, Math.max(1.4, gr * 0.2), 0, TAU);
  c.fill();
  c.fillStyle = '#fff';
  c.beginPath();
  c.arc(h.x - L * 0.012 + h.nx * gr * 0.5, h.y + h.ny * gr * 0.5 - 0.5, Math.max(0.6, gr * 0.07), 0, TAU);
  c.arc(h.x - L * 0.012 - h.nx * gr * 0.5, h.y - h.ny * gr * 0.5 - 0.5, Math.max(0.6, gr * 0.07), 0, TAU);
  c.fill();
  if (cb.dientes !== false) {
    c.fillStyle = '#fff';
    const p0 = pts[0];
    for (let i = 0; i < 4; i++) {
      for (const sd of [-1, 1]) {
        c.beginPath();
        c.moveTo(p0.x - i * gr * 0.3, p0.y + sd * gr * 0.3);
        c.lineTo(p0.x - i * gr * 0.3 - gr * 0.12, p0.y + sd * gr * 0.62);
        c.lineTo(p0.x - i * gr * 0.3 - gr * 0.24, p0.y + sd * gr * 0.3);
        c.fill();
      }
    }
  }
  return pts;
}
const moreneaArte = (c, a, L, o) => culebraArte(c, a, L, o, { amp: 0.07, k: 1.4, grosor: 0.06, vel: 4, alto: 0.5 });
const cintaArte = (c, a, L, o) => culebraArte(c, a, L, o, { amp: 0.06, k: 2.2, grosor: 0.028, vel: 3, alto: 1.6, cAleta: a.c2, manchas: false, dientes: false, afil: 0.35 });

// Tiburón (desde arriba)
function tiburonArte(c, a, L, o) {
  const sil = o.sombra, wig = o.wig || 0, v = a.variante || 'gris';
  const W = L * (v === 'martillo' ? 0.1 : 0.12);
  const bend = wig * L * 0.045;
  const cuerpoCol = sil || a.c1;
  // cola (lóbulo superior más largo)
  c.save();
  c.translate(-L * 0.33, bend * 0.4);
  c.rotate(wig * 0.32);
  c.beginPath();
  c.moveTo(L * 0.05, 0);
  c.quadraticCurveTo(-L * 0.08, -W * 0.5, -L * 0.2, -W * 1.5);
  c.quadraticCurveTo(-L * 0.15, -W * 0.4, -L * 0.12, 0);
  c.quadraticCurveTo(-L * 0.14, W * 0.3, -L * 0.17, W * 0.95);
  c.quadraticCurveTo(-L * 0.08, W * 0.3, L * 0.05, 0);
  c.fillStyle = sil || mixHex(a.c1, '#000', 0.12);
  c.fill();
  c.restore();
  // aletas pectorales
  for (const sd of [-1, 1]) {
    c.fillStyle = sil || mixHex(a.c1, '#000', 0.08);
    c.beginPath();
    c.moveTo(L * 0.17, sd * W * 0.55);
    c.quadraticCurveTo(L * 0.02, sd * (W * 1.6 + wig * 2), -L * 0.1, sd * W * 2.0);
    c.quadraticCurveTo(-L * 0.04, sd * W * 1.0, -L * 0.07, sd * W * 0.5);
    c.closePath();
    c.fill();
  }
  // cuerpo
  c.beginPath();
  const N = 24;
  const prof = (u) => {
    // u: 0 hocico .. 1 cola. Máximo cerca del 30%
    if (u < 0.3) return Math.pow(u / 0.3, 0.6);
    return Math.pow(1 - (u - 0.3) / 0.7, 0.8) * 0.97 + 0.03;
  };
  const sp = (u) => ({ x: L * 0.48 - u * L * 0.8, y: Math.sin(u * 3.2 - J.t * 4) * bend * u });
  for (let i = 0; i <= N; i++) {
    const u = i / N, p = sp(u), w = W * prof(u);
    if (i) c.lineTo(p.x, p.y + w); else c.moveTo(p.x, p.y + w);
  }
  for (let i = N; i >= 0; i--) {
    const u = i / N, p = sp(u), w = W * prof(u);
    c.lineTo(p.x, p.y - w);
  }
  c.closePath();
  if (sil) {
    c.fillStyle = sil;
    c.fill();
  } else {
    const g = c.createLinearGradient(0, -W, 0, W);
    g.addColorStop(0, a.c2);
    g.addColorStop(0.28, a.c1);
    g.addColorStop(0.72, a.c1);
    g.addColorStop(1, a.c2);
    c.fillStyle = g;
    c.fill();
    c.strokeStyle = DK;
    c.lineWidth = Math.max(1, L / 90);
    c.stroke();
  }
  // cabeza especial
  if (v === 'martillo') {
    c.fillStyle = cuerpoCol;
    c.beginPath();
    c.moveTo(L * 0.36, -W * 0.5);
    c.quadraticCurveTo(L * 0.4, -W * 1.8, L * 0.45, -W * 2.0);
    c.quadraticCurveTo(L * 0.55, -W * 1.5, L * 0.54, 0);
    c.quadraticCurveTo(L * 0.55, W * 1.5, L * 0.45, W * 2.0);
    c.quadraticCurveTo(L * 0.4, W * 1.8, L * 0.36, W * 0.5);
    c.closePath();
    c.fill();
    if (!sil) {
      c.strokeStyle = DK;
      c.lineWidth = Math.max(1, L / 90);
      c.stroke();
      c.fillStyle = '#10151c';
      c.beginPath();
      c.arc(L * 0.5, -W * 1.55, W * 0.2, 0, TAU);
      c.arc(L * 0.5, W * 1.55, W * 0.2, 0, TAU);
      c.fill();
    }
  } else if (v === 'duende') {
    c.fillStyle = cuerpoCol;
    c.beginPath();
    c.moveTo(L * 0.4, -W * 0.45);
    c.lineTo(L * 0.62, -W * 0.15);
    c.lineTo(L * 0.4, W * 0.45);
    c.closePath();
    c.fill();
  }
  if (o.abierto > 0 && !sil) {
    const ab = o.abierto;
    c.fillStyle = '#5a0f1a';
    c.beginPath();
    c.moveTo(L * 0.5, 0);
    c.lineTo(L * 0.36, -W * 0.7 * ab);
    c.lineTo(L * 0.36, W * 0.7 * ab);
    c.closePath();
    c.fill();
    c.fillStyle = '#fff';
    for (let i = 0; i < 6; i++) {
      for (const sd of [-1, 1]) {
        c.beginPath();
        c.moveTo(L * (0.485 - i * 0.02), sd * W * (0.09 + i * 0.09) * ab);
        c.lineTo(L * (0.5 - i * 0.02), sd * W * (0.0 + i * 0.07) * ab);
        c.lineTo(L * (0.468 - i * 0.02), sd * W * (0.03 + i * 0.08) * ab);
        c.fill();
      }
    }
  }
  if (!sil) {
    // aleta dorsal (de canto) y branquias
    c.strokeStyle = mixHex(a.c1, '#000', 0.35);
    c.lineWidth = Math.max(1.2, L / 38);
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(L * 0.1, 0);
    c.lineTo(-L * 0.08, 0.5);
    c.stroke();
    c.strokeStyle = 'rgba(10,30,50,.3)';
    c.lineWidth = Math.max(1, L / 100);
    for (let i = 0; i < 5; i++) for (const sd of [-1, 1]) {
      c.beginPath();
      c.moveTo(L * (0.2 - i * 0.012), sd * W * 0.55);
      c.lineTo(L * (0.2 - i * 0.012) - 1, sd * W * 0.9);
      c.stroke();
    }
    if (v !== 'martillo') {
      c.fillStyle = '#10151c';
      c.beginPath();
      c.arc(L * 0.37, -W * 0.55, Math.max(1.4, L * 0.012), 0, TAU);
      c.arc(L * 0.37, W * 0.55, Math.max(1.4, L * 0.012), 0, TAU);
      c.fill();
    }
  }
}

// Pez gota
function gotaArte(c, a, L, o) {
  const sil = o.sombra, wig = o.wig || 0;
  c.save();
  c.translate(-L * 0.4, 0);
  c.rotate(wig * 0.4);
  c.fillStyle = sil || a.c1;
  c.beginPath();
  c.moveTo(L * 0.1, -3);
  c.quadraticCurveTo(-L * 0.08, -L * 0.18, -L * 0.14, -L * 0.07);
  c.quadraticCurveTo(-L * 0.1, 0, -L * 0.14, L * 0.07);
  c.quadraticCurveTo(-L * 0.08, L * 0.18, L * 0.1, 3);
  c.fill();
  c.restore();
  c.beginPath();
  c.moveTo(L * 0.5, L * 0.02);
  c.bezierCurveTo(L * 0.5, -L * 0.24, L * 0.28, -L * 0.42, L * 0.0, -L * 0.4);
  c.bezierCurveTo(-L * 0.3, -L * 0.38, -L * 0.42, -L * 0.14, -L * 0.4, L * 0.08);
  c.bezierCurveTo(-L * 0.38, L * 0.3, -L * 0.1, L * 0.38, L * 0.2, L * 0.36);
  c.bezierCurveTo(L * 0.4, L * 0.34, L * 0.5, L * 0.22, L * 0.5, L * 0.02);
  c.closePath();
  if (sil) {
    c.fillStyle = sil;
    c.fill();
    return;
  }
  const g = c.createRadialGradient(L * 0.1, -L * 0.1, 2, 0, 0, L * 0.5);
  g.addColorStop(0, a.c2);
  g.addColorStop(1, a.c1);
  c.fillStyle = g;
  c.fill();
  c.strokeStyle = DK;
  c.lineWidth = Math.max(1, L / 40);
  c.stroke();
  // nariz caída y cara triste
  c.fillStyle = mixHex(a.c1, '#c46070', 0.3);
  c.beginPath();
  c.ellipse(L * 0.38, L * 0.06, L * 0.11, L * 0.09, 0.3, 0, TAU);
  c.fill();
  c.stroke();
  c.fillStyle = '#10151c';
  c.beginPath();
  c.arc(L * 0.26, -L * 0.12, L * 0.03, 0, TAU);
  c.arc(L * 0.36, -L * 0.1, L * 0.028, 0, TAU);
  c.fill();
  c.strokeStyle = 'rgba(90,30,40,.7)';
  c.lineWidth = Math.max(1, L / 40);
  c.beginPath();
  c.arc(L * 0.3, L * 0.3, L * 0.14, Math.PI * 1.1, Math.PI * 1.85);
  c.stroke();
}

// Rape (pez abisal con señuelo)
function rapeArte(c, a, L, o) {
  const sil = o.sombra, wig = o.wig || 0;
  c.save();
  c.translate(-L * 0.36, 0);
  c.rotate(wig * 0.35);
  c.fillStyle = sil || mixHex(a.c1, '#000', 0.1);
  c.beginPath();
  c.moveTo(L * 0.1, -3);
  c.quadraticCurveTo(-L * 0.1, -L * 0.2, -L * 0.16, -L * 0.1);
  c.quadraticCurveTo(-L * 0.12, 0, -L * 0.16, L * 0.1);
  c.quadraticCurveTo(-L * 0.1, L * 0.2, L * 0.1, 3);
  c.fill();
  c.restore();
  // señuelo
  const lx = L * 0.64 + wig * 2, ly = -L * 0.5 + Math.sin(J.t * 2) * 2;
  c.strokeStyle = sil || '#2a1f1a';
  c.lineWidth = Math.max(1, L / 42);
  c.beginPath();
  c.moveTo(L * 0.2, -L * 0.3);
  c.quadraticCurveTo(L * 0.45, -L * 0.72, lx, ly);
  c.stroke();
  if (!sil) {
    const gl = 0.7 + 0.3 * Math.sin(J.t * 5);
    const g = c.createRadialGradient(lx, ly, 0, lx, ly, L * 0.16);
    g.addColorStop(0, `rgba(190,255,250,${gl.toFixed(2)})`);
    g.addColorStop(1, 'rgba(120,255,240,0)');
    c.fillStyle = g;
    c.beginPath();
    c.arc(lx, ly, L * 0.16, 0, TAU);
    c.fill();
    c.fillStyle = '#eafffc';
    c.beginPath();
    c.arc(lx, ly, L * 0.035, 0, TAU);
    c.fill();
  } else {
    c.fillStyle = sil;
    c.beginPath();
    c.arc(lx, ly, L * 0.04, 0, TAU);
    c.fill();
  }
  // cuerpo
  c.beginPath();
  c.moveTo(L * 0.5, L * 0.08);
  c.bezierCurveTo(L * 0.5, -L * 0.3, L * 0.24, -L * 0.44, -L * 0.04, -L * 0.38);
  c.bezierCurveTo(-L * 0.3, -L * 0.3, -L * 0.4, -L * 0.1, -L * 0.38, 0);
  c.bezierCurveTo(-L * 0.4, L * 0.1, -L * 0.28, L * 0.34, -L * 0.02, L * 0.38);
  c.bezierCurveTo(L * 0.26, L * 0.42, L * 0.5, L * 0.32, L * 0.5, L * 0.08);
  c.closePath();
  if (sil) {
    c.fillStyle = sil;
    c.fill();
    return;
  }
  const g = c.createLinearGradient(0, -L * 0.4, 0, L * 0.4);
  g.addColorStop(0, shade(a.c1, -0.2));
  g.addColorStop(0.6, a.c1);
  g.addColorStop(1, a.c2);
  c.fillStyle = g;
  c.fill();
  c.strokeStyle = DK;
  c.lineWidth = Math.max(1, L / 45);
  c.stroke();
  // bocota con dientes
  c.fillStyle = '#1a0d0a';
  c.beginPath();
  c.moveTo(L * 0.5, L * 0.08);
  c.quadraticCurveTo(L * 0.3, L * 0.3, L * 0.02, L * 0.12);
  c.quadraticCurveTo(L * 0.3, L * 0.14, L * 0.5, L * 0.08);
  c.fill();
  c.fillStyle = '#f4f0e0';
  for (let i = 0; i < 9; i++) {
    const x = L * 0.46 - i * L * 0.045;
    c.beginPath();
    c.moveTo(x, L * 0.1 + (i * L * 0.006));
    c.lineTo(x - L * 0.01, L * 0.1 + L * 0.065);
    c.lineTo(x - L * 0.022, L * 0.1);
    c.fill();
    c.beginPath();
    c.moveTo(x - L * 0.01, L * 0.17 + i * L * 0.01);
    c.lineTo(x - L * 0.018, L * 0.12);
    c.lineTo(x - L * 0.03, L * 0.17 + i * L * 0.01);
    c.fill();
  }
  c.fillStyle = '#ffe9a0';
  c.beginPath();
  c.arc(L * 0.3, -L * 0.1, L * 0.055, 0, TAU);
  c.fill();
  c.fillStyle = '#10151c';
  c.beginPath();
  c.arc(L * 0.31, -L * 0.1, L * 0.03, 0, TAU);
  c.fill();
}

// Calamar (desde arriba)
function calamarArte(c, a, L, o) {
  const sil = o.sombra, wig = o.wig || 0, t = J.t;
  const W = L * 0.12;
  c.lineCap = 'round';
  // tentáculos
  c.strokeStyle = sil || mixHex(a.c1, '#000', 0.12);
  for (let i = 0; i < 8; i++) {
    c.lineWidth = Math.max(1.2, L * 0.025);
    c.beginPath();
    const y0 = (i - 3.5) * W * 0.22;
    c.moveTo(L * 0.1, y0);
    for (let k = 1; k <= 5; k++) c.lineTo(L * 0.1 + k * L * 0.075, y0 * (1 + k * 0.2) + Math.sin(t * 5 + i + k) * 3 * (0.5 + Math.abs(wig)));
    c.stroke();
  }
  for (const sd of [-1, 1]) {
    c.lineWidth = Math.max(1.5, L * 0.02);
    c.beginPath();
    c.moveTo(L * 0.1, sd * W * 0.3);
    c.quadraticCurveTo(L * 0.6, sd * (W * 0.9 + Math.sin(t * 3) * 6), L * 0.82, sd * W * 0.5 + Math.sin(t * 4 + sd) * 4);
    c.stroke();
    c.fillStyle = sil || a.c2;
    c.beginPath();
    c.ellipse(L * 0.82, sd * W * 0.5 + Math.sin(t * 4 + sd) * 4, L * 0.04, L * 0.025, 0.2, 0, TAU);
    c.fill();
  }
  // aletas
  c.fillStyle = sil || mixHex(a.c1, '#fff', 0.1);
  c.beginPath();
  c.moveTo(-L * 0.22, 0);
  c.quadraticCurveTo(-L * 0.36, -W * 1.5 - wig * 4, -L * 0.5, 0);
  c.quadraticCurveTo(-L * 0.36, W * 1.5 + wig * 4, -L * 0.22, 0);
  c.fill();
  // manto
  c.beginPath();
  c.moveTo(L * 0.12, -W * 0.7);
  c.quadraticCurveTo(-L * 0.1, -W * 1.1, -L * 0.5, 0);
  c.quadraticCurveTo(-L * 0.1, W * 1.1, L * 0.12, W * 0.7);
  c.closePath();
  if (sil) {
    c.fillStyle = sil;
    c.fill();
    return;
  }
  const g = c.createLinearGradient(0, -W, 0, W);
  g.addColorStop(0, shade(a.c1, -0.15));
  g.addColorStop(0.5, a.c1);
  g.addColorStop(1, a.c2);
  c.fillStyle = g;
  c.fill();
  c.strokeStyle = DK;
  c.lineWidth = Math.max(1, L / 80);
  c.stroke();
  c.fillStyle = 'rgba(255,255,255,.35)';
  for (let i = 0; i < 16; i++) {
    c.beginPath();
    c.arc(-L * 0.4 + L * 0.46 * hash2(i, 1), (hash2(i, 2) - 0.5) * W * 1.2, L * 0.012, 0, TAU);
    c.fill();
  }
  // cabeza y ojos
  c.fillStyle = mixHex(a.c1, a.c2, 0.3);
  c.beginPath();
  c.ellipse(L * 0.14, 0, L * 0.07, W * 0.85, 0, 0, TAU);
  c.fill();
  c.fillStyle = '#ffe7b0';
  c.beginPath();
  c.arc(L * 0.16, -W * 0.7, L * 0.04, 0, TAU);
  c.arc(L * 0.16, W * 0.7, L * 0.04, 0, TAU);
  c.fill();
  c.fillStyle = '#10151c';
  c.beginPath();
  c.arc(L * 0.17, -W * 0.7, L * 0.022, 0, TAU);
  c.arc(L * 0.17, W * 0.7, L * 0.022, 0, TAU);
  c.fill();
}

// Hallazgos
function cofreArte(c, a, L, o) {
  const s = L / 30, sil = o.sombra;
  c.scale(s, s);
  if (sil) {
    c.fillStyle = sil;
    rrect(c, -14, -12, 28, 24, 4);
    c.fill();
    return;
  }
  c.fillStyle = '#7a4a22';
  rrect(c, -14, -2, 28, 14, 3);
  c.fill();
  c.fillStyle = gradV(c, -12, -2, [[0, '#a8672e'], [1, '#7a4a22']]);
  c.beginPath();
  c.moveTo(-14, -2);
  c.quadraticCurveTo(-14, -14, 0, -14);
  c.quadraticCurveTo(14, -14, 14, -2);
  c.closePath();
  c.fill();
  c.strokeStyle = '#3d2410';
  c.lineWidth = 1.4;
  c.stroke();
  c.fillStyle = '#f2c94c';
  c.fillRect(-14, -3, 28, 3.4);
  c.fillRect(-9, -13, 3, 24);
  c.fillRect(6, -13, 3, 24);
  c.fillStyle = '#ffe58a';
  rrect(c, -3, -5, 6, 7, 1.5);
  c.fill();
  c.fillStyle = '#3d2410';
  c.fillRect(-0.8, -2, 1.6, 3);
  const k = 0.5 + 0.5 * Math.sin(J.t * 4);
  c.fillStyle = `rgba(255,250,200,${(0.5 + k * 0.4).toFixed(2)})`;
  c.beginPath();
  c.arc(9, -10, 1.5 + k, 0, TAU);
  c.fill();
}
function botaArte(c, a, L, o) {
  const s = L / 30, sil = o.sombra;
  c.scale(s, s);
  c.beginPath();
  c.moveTo(-12, -14);
  c.lineTo(-2, -14);
  c.lineTo(-1, -2);
  c.quadraticCurveTo(14, 0, 15, 8);
  c.lineTo(-12, 8);
  c.closePath();
  c.fillStyle = sil || '#6b4a2b';
  c.fill();
  if (sil) return;
  c.strokeStyle = '#2f1d0e';
  c.lineWidth = 1.4;
  c.stroke();
  c.fillStyle = '#3b2814';
  c.fillRect(-12, 4, 27, 4);
  c.fillStyle = '#4a7a3a';
  c.beginPath();
  c.ellipse(4, 2, 4, 2, 0, 0, TAU);
  c.fill();
}
function lataArte(c, a, L, o) {
  const s = L / 22, sil = o.sombra;
  c.scale(s, s);
  c.fillStyle = sil || '#b0603a';
  rrect(c, -8, -10, 16, 20, 2);
  c.fill();
  if (sil) return;
  c.fillStyle = '#d9d2c4';
  c.fillRect(-8, -3, 16, 6);
  c.fillStyle = '#7a3a1e';
  c.fillRect(-8, -10, 16, 2.5);
  c.fillRect(-8, 7.5, 16, 2.5);
  c.fillStyle = 'rgba(80,30,10,.5)';
  c.beginPath();
  c.arc(-3, 6, 2, 0, TAU);
  c.arc(4, -6, 1.6, 0, TAU);
  c.fill();
}
function neumaticoArte(c, a, L, o) {
  const sil = o.sombra, r = L * 0.5;
  c.beginPath();
  c.arc(0, 0, r, 0, TAU);
  c.arc(0, 0, r * 0.45, 0, TAU, true);
  c.fillStyle = sil || '#2a2f36';
  c.fill('evenodd');
  if (sil) return;
  c.strokeStyle = '#3d444d';
  c.lineWidth = Math.max(1, r * 0.1);
  for (let i = 0; i < 14; i++) {
    const th = (i / 14) * TAU;
    c.beginPath();
    c.moveTo(Math.cos(th) * r * 0.55, Math.sin(th) * r * 0.55);
    c.lineTo(Math.cos(th) * r * 0.95, Math.sin(th) * r * 0.95);
    c.stroke();
  }
}
function botellaArte(c, a, L, o) {
  const s = L / 30, sil = o.sombra;
  c.scale(s, s);
  c.rotate(-0.4);
  c.beginPath();
  c.moveTo(-15, -4);
  c.lineTo(2, -4);
  c.quadraticCurveTo(6, -4, 7, -2);
  c.lineTo(12, -1.5);
  c.lineTo(12, 1.5);
  c.lineTo(7, 2);
  c.quadraticCurveTo(6, 4, 2, 4);
  c.lineTo(-15, 4);
  c.closePath();
  c.fillStyle = sil || 'rgba(120,220,160,.8)';
  c.fill();
  if (sil) return;
  c.strokeStyle = 'rgba(30,90,60,.8)';
  c.lineWidth = 1.2;
  c.stroke();
  c.fillStyle = '#f4ecd0';
  c.fillRect(-12, -2.4, 11, 4.8);
  c.fillStyle = '#8a5a2b';
  c.fillRect(12, -1.8, 4, 3.6);
}

const CRIATURAS = {
  pez: pezLado, camaron: camaronArte, cangrejo: cangrejoArte, estrella: estrellaArte, globo: globoArte, pulpo: pulpoArte,
  langosta: langostaArte, medusa: medusaArte, raya: rayaArte, morena: moreneaArte, cinta: cintaArte, tiburon: tiburonArte,
  gota: gotaArte, rape: rapeArte, calamar: calamarArte, cofre: cofreArte, bota: botaArte, lata: lataArte,
  neumatico: neumaticoArte, botella: botellaArte,
};

function dibujarCriatura(c, a, L, o = {}) {
  const f = CRIATURAS[a.forma];
  if (!f) return;
  c.save();
  c.lineJoin = 'round';
  c.lineCap = 'round';
  f(c, a, L, o);
  c.restore();
}

// Íconos para las listas y tarjetas (se guardan en un caché)
const iconoCache = new Map();
function iconoEspecie(id, px = 64) {
  const key = id + ':' + px;
  if (iconoCache.has(key)) return iconoCache.get(key);
  const sp = SP[id];
  const cv = makeCanvas(px * 2, px * 2);
  const g = cv.getContext('2d');
  g.scale(2, 2);
  g.translate(px / 2, px / 2);
  const f = sp.arte.forma;
  // los que miran de costado se achican para entrar; los largos se rotan un poco
  let L = px * 0.86;
  if (f === 'cinta' || f === 'morena') L = px * 1.0;
  if (f === 'tiburon') L = px * 0.98;
  const saveT = J.t;
  J.t = 1.7;
  dibujarCriatura(g, sp.arte, L, { wig: 0.2 });
  J.t = saveT;
  const url = cv.toDataURL('image/png');
  iconoCache.set(key, url);
  return url;
}
