import * as THREE from 'three';
import { WORLD, POI, FRAME, fromAB } from '../world/mapdata.js';
import { formatMoney, clamp } from '../util.js';
import { WEAPONS } from '../game/weapons.js';

const el = (tag, cls, parent, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  if (parent) parent.appendChild(e);
  return e;
};

// Íconos de armas dibujados con canvas (estilo HUD de SA)
function weaponIcon(id) {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 64;
  const g = c.getContext('2d');
  g.translate(32, 32);
  g.fillStyle = '#e8e8e8'; g.strokeStyle = '#111'; g.lineWidth = 2;
  const shape = (fn) => { g.beginPath(); fn(); g.fill(); g.stroke(); };
  if (id === 'punos') {
    shape(() => { g.roundRect(-14, -10, 26, 20, 5); });
    g.fillStyle = '#c9a07a'; shape(() => { g.roundRect(-14, -10, 26, 20, 5); });
    g.strokeStyle = '#6a4a30'; for (let i = -8; i <= 8; i += 6) { g.beginPath(); g.moveTo(i, -10); g.lineTo(i, 2); g.stroke(); }
  } else if (id === 'clavas') {
    g.rotate(-0.6);
    shape(() => { g.ellipse(0, -6, 7, 16, 0, 0, Math.PI * 2); });
    g.fillStyle = '#1c2f6b'; g.fillRect(-7, -4, 14, 5);
    g.fillStyle = '#e8e8e8'; shape(() => { g.rect(-3, 8, 6, 16); });
  } else if (id === 'bate') {
    g.rotate(-0.7); g.fillStyle = '#b07a44';
    shape(() => { g.moveTo(-3, 24); g.lineTo(3, 24); g.lineTo(7, -24); g.lineTo(-7, -24); g.closePath(); });
  } else if (id === 'pistola') {
    g.fillStyle = '#2a2a2a';
    shape(() => { g.rect(-18, -10, 34, 10); });
    shape(() => { g.moveTo(4, 0); g.lineTo(14, 0); g.lineTo(10, 16); g.lineTo(2, 16); g.closePath(); });
  } else if (id === 'escopeta') {
    g.fillStyle = '#2a2a2a'; shape(() => { g.rect(-28, -5, 40, 6); });
    g.fillStyle = '#7a5030'; shape(() => { g.moveTo(10, -6); g.lineTo(28, -2); g.lineTo(28, 8); g.lineTo(10, 3); g.closePath(); });
  } else if (id === 'uzi') {
    g.fillStyle = '#2a2a2a'; shape(() => { g.rect(-18, -8, 30, 10); });
    shape(() => { g.rect(-4, 2, 7, 18); });
  }
  return c.toDataURL();
}

export class HUD {
  constructor(game) {
    this.game = game;
    const root = el('div', 'hud', document.body);
    this.root = root;
    // arriba a la derecha
    const tr = el('div', 'hud-tr', root);
    const row = el('div', 'hud-row', tr);
    this.weapon = el('div', 'hud-weapon', row);
    this.weaponImg = el('img', '', this.weapon);
    this.ammo = el('div', 'hud-ammo', this.weapon);
    const col = el('div', 'hud-col', row);
    this.clock = el('div', 'hud-clock', col, '12:00');
    this.armorBar = el('div', 'hud-bar armor', col, '<i></i>');
    this.healthBar = el('div', 'hud-bar health', col, '<i></i>');
    this.breathBar = el('div', 'hud-bar breath', col, '<i></i>');
    this.money = el('div', 'hud-money', tr, '$00000000');
    this.stars = el('div', 'hud-stars', tr);
    this.starEls = [];
    for (let i = 0; i < 6; i++) this.starEls.push(el('span', 'star', this.stars, '★'));
    this.counters = el('div', 'hud-counters', tr);
    // radar
    this.radarWrap = el('div', 'hud-radar', root);
    this.radar = el('canvas', '', this.radarWrap);
    this.radar.width = 200; this.radar.height = 200;
    this.rctx = this.radar.getContext('2d');
    // textos
    this.zone = el('div', 'hud-zone', root);
    this.vname = el('div', 'hud-vname', root);
    this.radio = el('div', 'hud-radio', root);
    this.help = el('div', 'hud-help', root);
    this.sub = el('div', 'hud-sub', root);
    this.big = el('div', 'hud-big', root);
    this.bigSub = el('div', 'hud-bigsub', root);
    this.title = el('div', 'hud-title', root);
    this.cross = el('div', 'hud-cross', root);
    this.lockEl = el('div', 'hud-lock', root);
    this.hitEl = el('div', 'hud-hit', root);
    this.spread = 0; this.hitT = 0;
    this._v = new THREE.Vector3();
    this.bars = el('div', 'hud-letterbox', root, '<div></div><div></div>');
    this.fade = el('div', 'hud-fade', root);
    this.toast = el('div', 'hud-toast', root);
    this.charTag = el('div', 'hud-char', root);
    this.prompt = el('div', 'hud-prompt', root);
    this.radioCap = el('div', 'hud-radiocap', root);
    this.timers = {};
    this.helpQueue = [];
    this.lastWeapon = null;
    this.zoneName = '';
    this.buildMapImage();
  }

  // Imagen del mapa completo en el marco rotado (A a lo largo de la costa, B tierra adentro)
  buildMapImage() {
    const g = this.game;
    const S = 4;
    const F = FRAME;
    const W = Math.ceil((F.a1 - F.a0) / S), H = Math.ceil((F.b1 - F.b0) / S);
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(W, H);
    const t = g.terrain;
    for (let j = 0; j < H; j++) {
      const b = F.b0 + j * S;
      for (let i = 0; i < W; i++) {
        const a = F.a0 + i * S;
        const [x, z] = fromAB(a, b);
        const h = t.heightAt(x, z);
        let r, gg, bl;
        if (h < -0.3) { const d = clamp(-h / 12, 0, 1); r = 70 - d * 25; gg = 104 - d * 30; bl = 140 - d * 25; }
        else if (h < 4 && t.seaDist(x, z) < 50) { r = 196; gg = 186; bl = 150; }
        else {
          const k = clamp(h / 160, 0, 1);
          r = 158 - k * 30; gg = 150 - k * 24; bl = 118 - k * 26;
        }
        const o = (j * W + i) * 4;
        img.data[o] = r; img.data[o + 1] = gg; img.data[o + 2] = bl; img.data[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    // de mundo a imagen
    const tp = (x, z) => [((x * F.ux + z * F.uz) - F.a0) / S, ((x * F.vx + z * F.vz) - F.b0) / S];
    const poly = (pts, fill) => {
      ctx.fillStyle = fill;
      ctx.beginPath();
      for (let i = 0; i < pts.length; i += 2) { const [u, v] = tp(pts[i], pts[i + 1]); if (i) ctx.lineTo(u, v); else ctx.moveTo(u, v); }
      ctx.closePath(); ctx.fill();
    };
    for (const ar of g.zones.areas) {
      if (ar.kind === 'plaza' || ar.kind === 'cancha') poly(ar.pts, 'rgba(80,120,60,0.9)');
      else if (ar.kind === 'industrial') poly(ar.pts, 'rgba(120,112,120,0.45)');
    }
    // casas y edificios
    ctx.fillStyle = 'rgba(95,92,84,0.7)';
    if (g.city.footprints) {
      // huellas reales, con su forma y orientación
      for (const o of g.city.footprints) {
        const bx = -o.az, bz = o.ax;
        ctx.beginPath();
        for (const [s1, t1] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
          const [u, v] = tp(o.cx + o.ax * o.hw * s1 + bx * o.hd * t1, o.cz + o.az * o.hw * s1 + bz * o.hd * t1);
          if (s1 === -1 && t1 === -1) ctx.moveTo(u, v); else ctx.lineTo(u, v);
        }
        ctx.closePath(); ctx.fill();
      }
    } else for (const it of g.city.houses.items) {
      const [u, v] = tp(it.cx, it.cz);
      const s = Math.max(1.2, (it.hw + it.hd) / S);
      ctx.fillRect(u - s / 2, v - s / 2, s, s);
    }
    // calles
    ctx.lineCap = 'round';
    for (const pass of [0, 1]) {
      for (const e of g.roads.edges) {
        const A = g.roads.nodes[e.a], B = g.roads.nodes[e.b];
        const dirt = e.kind === 'tierra';
        ctx.strokeStyle = pass === 0 ? 'rgba(40,40,40,0.7)' : dirt ? '#b8a07a' : e.kind === 'ruta' ? '#f0e6c0' : e.kind === 'avenida' ? '#ece6d2' : '#dcd8cc';
        ctx.lineWidth = (e.width / S) * (pass === 0 ? 1.5 : 1) + (pass === 0 ? 1 : 0);
        const [u0, v0] = tp(A.x, A.z), [u1, v1] = tp(B.x, B.z);
        ctx.beginPath(); ctx.moveTo(u0, v0); ctx.lineTo(u1, v1); ctx.stroke();
      }
    }
    this.mapImg = c;
    this.mapScale = S;
  }

  // Transformación de la imagen del mapa a coordenadas del mundo relativas a (cx, cz)
  mapTransform(ctx, cx, cz) {
    const F = FRAME, S = this.mapScale;
    const [x0, z0] = fromAB(F.a0, F.b0);
    ctx.transform(S * F.ux, S * F.uz, S * F.vx, S * F.vz, x0 - cx, z0 - cz);
  }

  showZone(name) {
    if (name === this.zoneName) return;
    this.zoneName = name;
    this.zone.textContent = name;
    this.zone.classList.remove('show'); void this.zone.offsetWidth; this.zone.classList.add('show');
  }
  showVehicleName(n) { this.vname.textContent = n; this.vname.classList.remove('show'); void this.vname.offsetWidth; this.vname.classList.add('show'); }
  showRadio(n) {
    const g = this.game;
    this.radio.textContent = n;
    this.radio.style.color = g.audio ? g.audio.stationColor(g.player.vehicle ? g.player.vehicle.radio : 0) : '#fff';
    this.radio.classList.remove('show'); void this.radio.offsetWidth; this.radio.classList.add('show');
  }
  showHelp(text, dur = 6) { this.help.innerHTML = text; this.help.classList.add('show'); this.helpT = dur; }
  hideHelp() { this.help.classList.remove('show'); this.helpT = 0; }
  subtitle(text, dur = 4) { this.sub.innerHTML = text; this.sub.classList.add('show'); this.subT = dur; }
  clearSubtitle() { this.sub.classList.remove('show'); this.subT = 0; }
  bigText(text, sub = '', dur = 4, cls = '') {
    this.big.textContent = text; this.big.className = 'hud-big show ' + cls;
    this.bigSub.innerHTML = sub; this.bigSub.className = 'hud-bigsub show ' + cls;
    this.bigT = dur;
  }
  missionTitle(text, dur = 4) { this.title.textContent = text; this.title.classList.add('show'); this.titleT = dur; }
  // Lo que dice el locutor de la radio (abajo, chiquito, como un subtítulo)
  radioCaption(who, text, dur = 7) {
    this.radioCap.innerHTML = `<b>📻 ${who}:</b> ${text}`;
    this.radioCap.classList.add('show');
    this.radioCapT = dur;
  }
  showToast(text, dur = 3) { this.toast.innerHTML = text; this.toast.classList.add('show'); this.toastT = dur; }
  letterbox(on) { this.bars.classList.toggle('on', !!on); this.root.classList.toggle('cinema', !!on); }
  fadeTo(black, dur = 0.6) {
    this.fade.style.transition = `opacity ${dur}s`;
    this.fade.style.opacity = black ? 1 : 0;
    return new Promise((r) => setTimeout(r, dur * 1000));
  }
  setCounter(id, label, value, isBar = false) {
    let c = this.timers[id];
    if (!c) {
      c = el('div', 'hud-counter', this.counters, `<span class="lbl"></span><span class="val"></span>`);
      this.timers[id] = c;
    }
    c.querySelector('.lbl').textContent = label;
    const v = c.querySelector('.val');
    if (isBar) v.innerHTML = `<b class="cbar"><i style="width:${clamp(value, 0, 1) * 100}%"></i></b>`;
    else v.textContent = value;
  }
  removeCounter(id) { if (this.timers[id]) { this.timers[id].remove(); delete this.timers[id]; } }
  clearCounters() { for (const k in this.timers) this.removeCounter(k); }
  // la mira se abre con cada disparo y se cierra sola
  bloom(v) { this.spread = Math.min(1, this.spread + v * 10); }
  hitMarker(head) {
    this.hitT = head ? 0.3 : 0.18;
    this.hitEl.classList.toggle('head', !!head);
    this.hitEl.classList.add('show');
  }

  setPrompt(text) {
    if (text) { this.prompt.innerHTML = text; this.prompt.classList.add('show'); } else this.prompt.classList.remove('show');
  }

  update(dt) {
    const g = this.game;
    const p = g.player;
    if (!p) return;
    this.clock.textContent = g.env.clockString();
    const hpPct = clamp(p.health / p.maxHealth, 0, 1);
    this.healthBar.firstChild.style.width = hpPct * 100 + '%';
    this.healthBar.classList.toggle('low', hpPct < 0.25);
    this.armorBar.style.visibility = p.armor > 0 ? 'visible' : 'hidden';
    this.armorBar.firstChild.style.width = clamp(p.armor, 0, 100) + '%';
    const showBreath = p.gait === 2 && p.stamina < 99 || p.swimming;
    this.breathBar.style.visibility = showBreath ? 'visible' : 'hidden';
    this.breathBar.firstChild.style.width = clamp(p.stamina, 0, 100) + '%';
    // plata (animada como en SA)
    this.shownMoney = this.shownMoney === undefined ? g.money : this.shownMoney;
    const diff = g.money - this.shownMoney;
    if (Math.abs(diff) > 0) this.shownMoney += Math.sign(diff) * Math.max(1, Math.ceil(Math.abs(diff) * dt * 4));
    if (Math.abs(g.money - this.shownMoney) < 2) this.shownMoney = g.money;
    this.money.textContent = formatMoney(this.shownMoney);
    this.money.classList.toggle('neg', g.money < 0);
    // estrellas
    const w = g.police ? g.police.level : 0;
    const flash = g.police && g.police.flashing && Math.floor(performance.now() / 300) % 2;
    this.starEls.forEach((s, i) => {
      s.classList.toggle('on', i < w && !flash);
      s.classList.toggle('dim', i >= w);
    });
    this.stars.style.visibility = w > 0 || (g.police && g.police.showEmpty) ? 'visible' : 'hidden';
    // arma
    if (p.weapon !== this.lastWeapon) {
      this.lastWeapon = p.weapon;
      this.weaponImg.src = weaponIcon(p.weapon);
    }
    const W = WEAPONS[p.weapon];
    if (W && !W.melee) {
      const tot = p.ammo[p.weapon] || 0;
      if (p.isPlayer && !p.infiniteAmmo && W.clip) { const m = p.magOf(p.weapon); this.ammo.textContent = p.reloadT > 0 ? `··· ${tot}` : `${m}-${tot - m}`; }
      else this.ammo.textContent = p.infiniteAmmo ? '∞' : String(tot);
    } else this.ammo.textContent = '';
    // mira: se abre al disparar y al moverse, en rojo con un blanco fijado
    const lock = g.controller && g.controller.lock;
    this.spread = Math.max(0, this.spread - dt * 2.2);
    const mv = Math.min(1, p.speed / 4);
    const size = 26 + (this.spread + mv * 0.35) * 30;
    this.cross.style.width = this.cross.style.height = size.toFixed(1) + 'px';
    this.cross.classList.toggle('show', !!p.aiming);
    this.cross.classList.toggle('locked', !!(p.aiming && lock));
    // marcador del blanco con su vida (verde → rojo), como en San Andreas
    if (p.aiming && lock && !lock.dead) {
      const v = this._v.set(lock.pos.x, lock.pos.y + 2.1, lock.pos.z).project(g.camera);
      const hp = clamp(lock.health / (lock.maxHealth || 100), 0, 1);
      this.lockEl.style.left = ((v.x + 1) / 2 * 100).toFixed(2) + '%';
      this.lockEl.style.top = ((1 - v.y) / 2 * 100).toFixed(2) + '%';
      this.lockEl.style.setProperty('--c', `hsl(${Math.round(hp * 120)},85%,50%)`);
      this.lockEl.classList.toggle('show', v.z < 1);
    } else this.lockEl.classList.remove('show');
    if (this.hitT > 0) { this.hitT -= dt; if (this.hitT <= 0) this.hitEl.classList.remove('show'); }
    // temporizadores de texto
    const tick = (k, elx) => { if (this[k] > 0) { this[k] -= dt; if (this[k] <= 0) elx.classList.remove('show'); } };
    tick('radioCapT', this.radioCap);
    tick('helpT', this.help); tick('subT', this.sub); tick('bigT', this.big); tick('titleT', this.title); tick('toastT', this.toast);
    if (!(this.bigT > 0)) this.bigSub.classList.remove('show');
    this.charTag.textContent = g.playerName ? g.playerName() : '';
    this.drawRadar();
  }

  drawRadar() {
    const g = this.game;
    const ctx = this.rctx;
    const S = 200, R = 96;
    const p = g.player;
    const px = p.vehicle ? p.vehicle.pos.x : p.pos.x, pz = p.vehicle ? p.vehicle.pos.z : p.pos.z;
    const speed = p.vehicle ? p.vehicle.speed : 0;
    const range = 170 + clamp(speed * 6, 0, 150); // metros visibles (radio)
    const scale = R / range; // px por metro
    const yaw = g.cameraRig.yaw;
    ctx.clearRect(0, 0, S, S);
    ctx.save();
    ctx.beginPath(); ctx.arc(S / 2, S / 2, R, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = '#46688c'; ctx.fillRect(0, 0, S, S);
    ctx.translate(S / 2, S / 2);
    // Rotar para que "adelante" de la cámara quede arriba
    ctx.rotate(Math.PI + yaw);
    ctx.scale(scale, scale);
    this.mapTransform(ctx, px, pz);
    ctx.drawImage(this.mapImg, 0, 0);
    ctx.restore();
    // blips
    const toRadar = (x, z) => {
      const dx = x - px, dz = z - pz;
      // coordenadas de cámara: adelante = (sin yaw, cos yaw), derecha = (-cos yaw, sin yaw)
      const fwd = dx * Math.sin(yaw) + dz * Math.cos(yaw);
      const rgt = dx * -Math.cos(yaw) + dz * Math.sin(yaw);
      return [rgt * scale, -fwd * scale];
    };
    const blip = (x, z, draw, clampEdge = false, h = null) => {
      let [bx, by] = toRadar(x, z);
      const d = Math.hypot(bx, by);
      if (d > R - 6) {
        if (!clampEdge) return;
        bx *= (R - 6) / d; by *= (R - 6) / d;
      }
      let yOff = 0;
      if (h !== null) yOff = h - p.pos.y;
      draw(S / 2 + bx, S / 2 + by, yOff);
    };
    const letter = (ch, bg, fg = '#fff') => (x, y) => {
      ctx.fillStyle = bg; ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = fg; ctx.font = 'bold 11px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(ch, x, y + 0.5);
    };
    const square = (col, size = 5) => (x, y, yOff) => {
      ctx.fillStyle = col; ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5;
      if (yOff > 4) { ctx.beginPath(); ctx.moveTo(x, y - size); ctx.lineTo(x + size, y + size); ctx.lineTo(x - size, y + size); ctx.closePath(); ctx.fill(); ctx.stroke(); }
      else if (yOff < -4) { ctx.beginPath(); ctx.moveTo(x, y + size); ctx.lineTo(x + size, y - size); ctx.lineTo(x - size, y - size); ctx.closePath(); ctx.fill(); ctx.stroke(); }
      else { ctx.fillRect(x - size / 2, y - size / 2, size, size); ctx.strokeRect(x - size / 2, y - size / 2, size, size); }
    };
    // íconos de lugares
    for (const b of g.blips || []) {
      if (b.hidden) continue;
      const fn = b.letter ? letter(b.letter, b.bg || '#222', b.fg) : square(b.color || '#ff0', b.size || 6);
      blip(b.x, b.z, fn, b.edge, b.y !== undefined ? b.y : null);
    }
    // peatones/autos relevantes (enemigos, policía)
    const t = performance.now();
    for (const q of g.peds) {
      if (q === p || q.dead || q.removed) continue;
      if (q.blip) blip(q.pos.x, q.pos.z, square(q.blip, 5), q.blipEdge, q.pos.y);
      else if (q.kind === 'cana' && q.brain && q.brain.hostile) blip(q.pos.x, q.pos.z, square(Math.floor(t / 250) % 2 ? '#ff2020' : '#2040ff', 4));
    }
    for (const v of g.vehicles) {
      if (v.dead || v.removed) continue;
      if (v.blip) blip(v.pos.x, v.pos.z, square(v.blip, 6), v.blipEdge, v.pos.y);
      else if (v.type.police && v.siren) blip(v.pos.x, v.pos.z, square(Math.floor(t / 250) % 2 ? '#ff2020' : '#2040ff', 5));
    }
    // norte
    const [nx, ny] = toRadar(px, pz - 10000);
    const nd = Math.hypot(nx, ny);
    const npx = S / 2 + (nx / nd) * (R - 2), npy = S / 2 + (ny / nd) * (R - 2);
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 3; ctx.font = 'bold 13px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.strokeText('N', npx, npy); ctx.fillText('N', npx, npy);
    // jugador (flecha)
    const ph = p.vehicle ? p.vehicle.heading : p.heading;
    const rel = ph - yaw;
    ctx.save();
    ctx.translate(S / 2, S / 2);
    ctx.rotate(-rel);
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(6, 7); ctx.lineTo(0, 3); ctx.lineTo(-6, 7); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
    // borde
    ctx.strokeStyle = '#000'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(S / 2, S / 2, R + 1, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#d8d8d8'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(S / 2, S / 2, R + 3.5, 0, Math.PI * 2); ctx.stroke();
  }

  show(on) { this.root.style.display = on ? '' : 'none'; }
}

export { POI };
