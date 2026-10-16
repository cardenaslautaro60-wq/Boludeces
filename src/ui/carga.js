// Pantalla de carga al estilo San Andreas: al pisar el aro rojo de un local la pantalla se va a
// negro, aparece un dibujo del lugar con su nombre y la barra se llena mientras se arma el
// interior (que es otro mapa, aparte de la calle). Lo mismo al salir, con la ciudad.

const W = 1280, H = 720;

function glowText(g, text, x, y, font, color, glow, blur = 26) {
  g.font = font;
  g.shadowColor = glow; g.shadowBlur = blur; g.fillStyle = color;
  g.fillText(text, x, y); g.fillText(text, x, y);
  g.shadowBlur = 0;
}

function ball(g, x, y, r, color, num) {
  const grd = g.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  grd.addColorStop(0, '#ffffff'); grd.addColorStop(0.25, color); grd.addColorStop(1, '#000');
  g.fillStyle = grd; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  if (num) {
    g.fillStyle = '#f4f0e6'; g.beginPath(); g.arc(x, y - r * 0.05, r * 0.42, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#111'; g.font = `bold ${Math.round(r * 0.5)}px sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(num, x, y - r * 0.02);
  }
}

// El Draw de noche: salón oscuro, mesa de pool en perspectiva y el neón del local
function artDraw(g) {
  const bg = g.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#07060f'); bg.addColorStop(0.55, '#141026'); bg.addColorStop(1, '#05040a');
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  // luz de la lámpara sobre la mesa
  const lamp = g.createRadialGradient(W * 0.5, H * 0.62, 20, W * 0.5, H * 0.62, 520);
  lamp.addColorStop(0, 'rgba(255,214,140,0.35)'); lamp.addColorStop(1, 'rgba(255,214,140,0)');
  g.fillStyle = lamp; g.fillRect(0, 0, W, H);
  // mesa en perspectiva
  g.save();
  g.beginPath();
  g.moveTo(W * 0.27, H * 0.92); g.lineTo(W * 0.73, H * 0.92); g.lineTo(W * 0.64, H * 0.5); g.lineTo(W * 0.36, H * 0.5); g.closePath();
  g.fillStyle = '#4a2a14'; g.fill();
  g.beginPath();
  g.moveTo(W * 0.3, H * 0.895); g.lineTo(W * 0.7, H * 0.895); g.lineTo(W * 0.625, H * 0.52); g.lineTo(W * 0.375, H * 0.52); g.closePath();
  const felt = g.createLinearGradient(0, H * 0.52, 0, H * 0.9);
  felt.addColorStop(0, '#0f5a3a'); felt.addColorStop(1, '#147a4c');
  g.fillStyle = felt; g.fill();
  g.restore();
  // triángulo de bolas
  const cols = ['#d8b400', '#1f3fbf', '#c81e1e', '#5a1e8a', '#e06a10', '#167a2a', '#7a1414', '#111'];
  let k = 0;
  for (let row = 0; row < 4; row++) {
    for (let i = 0; i <= row; i++) {
      const x = W * 0.5 + (i - row / 2) * 26, y = H * 0.6 + row * 20;
      const ocho = row === 2 && i === 1;
      ball(g, x, y, 12 + row * 0.6, ocho ? '#111' : cols[k % cols.length], ocho ? '8' : '');
      k++;
    }
  }
  ball(g, W * 0.5, H * 0.82, 16, '#f2efe6');
  // taco
  g.save();
  g.translate(W * 0.5, H * 0.82); g.rotate(0.42);
  const cue = g.createLinearGradient(30, 0, 520, 0);
  cue.addColorStop(0, '#e8d9b5'); cue.addColorStop(0.7, '#a0662a'); cue.addColorStop(1, '#2a1a0c');
  g.fillStyle = cue; g.beginPath(); g.moveTo(30, -3); g.lineTo(520, -9); g.lineTo(520, 9); g.lineTo(30, 3); g.closePath(); g.fill();
  g.restore();
  // neón
  g.textAlign = 'center'; g.textBaseline = 'middle';
  glowText(g, 'Draw', W * 0.5, H * 0.2, 'italic bold 170px sans-serif', '#d6f6ff', '#40c8ff', 40);
  glowText(g, 'BAR & POOL', W * 0.5, H * 0.36, 'bold 54px sans-serif', '#ffd6ee', '#ff3aa0', 30);
}

// Comodoro desde la costa: el Chenque, el mar y el atardecer
function artCiudad(g) {
  const sky = g.createLinearGradient(0, 0, 0, H * 0.7);
  sky.addColorStop(0, '#1b2350'); sky.addColorStop(0.5, '#b4506a'); sky.addColorStop(1, '#f2a65a');
  g.fillStyle = sky; g.fillRect(0, 0, W, H);
  // cerro Chenque
  g.fillStyle = '#2a1d24';
  g.beginPath(); g.moveTo(0, H * 0.62);
  g.bezierCurveTo(W * 0.15, H * 0.4, W * 0.32, H * 0.3, W * 0.48, H * 0.36);
  g.bezierCurveTo(W * 0.6, H * 0.4, W * 0.7, H * 0.52, W, H * 0.58);
  g.lineTo(W, H); g.lineTo(0, H); g.closePath(); g.fill();
  // ciudad
  g.fillStyle = '#140e14';
  let x = 0;
  let s = 7;
  while (x < W) {
    s = (s * 9301 + 49297) % 233280;
    const w = 26 + (s % 50), h = 30 + (s % 120);
    g.fillRect(x, H * 0.7 - h, w, h + H * 0.3);
    x += w + 3;
  }
  // luces
  g.fillStyle = 'rgba(255,214,120,0.85)';
  for (let i = 0; i < 260; i++) {
    s = (s * 9301 + 49297) % 233280;
    g.fillRect(s % W, H * 0.56 + (s % 140), 3, 3);
  }
  // mar
  const sea = g.createLinearGradient(0, H * 0.78, 0, H);
  sea.addColorStop(0, '#3a2a48'); sea.addColorStop(1, '#0b0a18');
  g.fillStyle = sea; g.fillRect(0, H * 0.78, W, H * 0.22);
  g.textAlign = 'center'; g.textBaseline = 'middle';
}

const ARTS = { draw: artDraw, ciudad: artCiudad };

export class LoadingScreen {
  constructor(root) {
    this.el = document.createElement('div');
    this.el.className = 'hud-load';
    this.el.innerHTML = '<canvas width="1280" height="720"></canvas><div class="ld-txt"><div class="ld-name"></div><div class="ld-sub"></div></div><div class="ld-bar"><i></i></div>';
    root.appendChild(this.el);
    this.canvas = this.el.querySelector('canvas');
    this.name = this.el.querySelector('.ld-name');
    this.sub = this.el.querySelector('.ld-sub');
    this.bar = this.el.querySelector('.ld-bar i');
    this.drawn = null;
    this.visible = false;
  }

  // Muestra la pantalla, corre `work` (puede ser async y avisar su avance con prog(0..1)) y
  // tarda al menos `min` segundos para que se lea el nombre del lugar. La deja puesta: la saca hide().
  async run({ art, name, sub, min = 1.8 }, work) {
    if (this.drawn !== art) {
      const g = this.canvas.getContext('2d');
      g.clearRect(0, 0, W, H);
      (ARTS[art] || artCiudad)(g);
      this.drawn = art;
    }
    this.name.textContent = name || '';
    this.sub.textContent = sub || '';
    this.bar.style.width = '0%';
    this.el.classList.add('show');
    this.visible = true;
    let done = 0;
    const t0 = performance.now();
    let raf = 0;
    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      // la barra avanza con el tiempo pero no pasa lo que de verdad se cargó
      const shown = Math.min(t / min, 0.15 + done * 0.85);
      this.bar.style.width = `${(shown * 100).toFixed(1)}%`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    // dejar que se pinte antes de trabajar (armar el interior traba el hilo un rato)
    await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 30)));
    try {
      if (work) await work((v) => { done = Math.max(done, Math.min(1, v)); });
    } finally {
      done = 1;
      const left = min * 1000 - (performance.now() - t0);
      if (left > 0) await new Promise((r) => setTimeout(r, left));
      cancelAnimationFrame(raf);
      this.bar.style.width = '100%';
      await new Promise((r) => setTimeout(r, 120));
    }
  }

  hide() { this.el.classList.remove('show'); this.visible = false; }
}
