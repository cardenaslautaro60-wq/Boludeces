// Los otros jugadores de la sala, dentro del juego: cada uno es un Ped (y su auto, un Vehicle) que no
// simula nada por su cuenta; se mueve con lo que manda su dueño (interpolado para que se vea suave).
//
// Daño entre jugadores: el que pega no le resta vida al otro. Suma lo que hizo en un contador por
// víctima (g: daño a la persona, ga: daño a su auto) y lo publica en su presencia. La víctima lee
// cuánto subió el contador desde la última vez y se aplica el daño ella misma, con topes: distancia
// máxima según el arma y un máximo de daño por segundo por atacante. Como los contadores son
// acumulados, un mensaje perdido no pierde golpes, y quien entra tarde no recibe golpes viejos.
// Atropellos, choques y explosiones no viajan: cada uno los calcula en su propio juego.
import * as THREE from 'three';
import { Ped } from '../entities/ped.js';
import { Vehicle, VTYPES } from '../entities/vehicle.js';
import { LOOKS } from '../entities/humanoid.js';
import { WEAPONS, WEAPON_ORDER } from '../game/weapons.js';
import { leerEstado as leer, textoChat, MAX_GOLPES } from './estado.js';
export { textoChat };

const HZ = 12;             // envíos de presencia por segundo
const RETRASO = 0.13;      // s de atraso para tener dos muestras entre las que interpolar
const EXTRAPOLA = 0.3;     // s que se sigue de largo si dejan de llegar datos
const DPS_PERSONA = 300;   // daño máximo por segundo que un atacante le puede hacer a uno
const DPS_AUTO = 1500;     // ídem al auto
const PJS = ['gordopin', 'petroca'];
const COLORES = ['#39d0ff', '#ffd23f', '#ff6bd6', '#7dff6b', '#ff8a3d', '#b48cff', '#ffffff', '#3dffd0'];
const F = { apunta: 1, muerto: 2, nada: 4, caido: 8, pausa: 16, adentro: 32, buceo: 64 };

const r2 = (v) => Math.round(v * 100) / 100;
const angLerp = (a, b, t) => { let d = (b - a) % (Math.PI * 2); if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2; return a + d * t; };
export function colorDe(peer) { let h = 0; for (const c of String(peer)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return COLORES[h % COLORES.length]; }
function rangoArma(i) { const W = WEAPONS[WEAPON_ORDER[i]]; return !W ? 6 : W.melee ? 6 : W.range + 10; }
const leerEstado = (j) => leer(j, { autos: VTYPES, armas: WEAPON_ORDER.length });

export class JugadoresRed {
  constructor(game, online) {
    this.g = game;
    this.o = online;
    this.remotos = new Map();   // peer -> remoto
    this.mios = new Map();      // víctima -> { cum, arma, t } (daño que hice a personas)
    this.miosAuto = new Map();  // víctima -> { cum, t } (daño que hice a autos)
    this.vistos = new Map();    // atacante -> { g, ga, cubo, cuboA, t }
    this.muertes = 0;
    this.asesino = '';
    this.estabaMuerto = false;
    this.disparos = 0;
    this.dir = [0, 0, 1];
    this.mano = 0;
    this.chat = { k: 0, t: '' };
    this.tEnvio = 0;
    this.alChat = null;  // (nombre, texto, color) => void
    this.alAviso = null; // (texto) => void
  }

  // ---------- lo mío ----------
  miDisparo(p) {
    this.disparos++;
    const d = p.aimDir || { x: Math.sin(p.heading), y: 0, z: Math.cos(p.heading) };
    this.dir = [r2(d.x), r2(d.y), r2(d.z)];
  }
  miGolpeMano() { this.mano++; }
  decir(txt) {
    const t = textoChat(txt);
    if (!t) return false;
    this.chat = { k: this.chat.k + 1, t };
    if (this.alChat) this.alChat(this.o.nombre + ' (vos)', t, '#fff');
    return true;
  }

  sumarGolpe(peer, dmg, arma) {
    const m = this.mios.get(peer) || { cum: 0, arma: 0, t: 0 };
    m.cum = Math.round((m.cum + dmg) * 10) / 10;
    m.arma = Math.max(0, WEAPON_ORDER.indexOf(arma));
    m.t = performance.now();
    this.mios.set(peer, m);
  }
  sumarAuto(peer, dmg) {
    const m = this.miosAuto.get(peer) || { cum: 0, t: 0 };
    m.cum = Math.round(m.cum + dmg);
    m.t = performance.now();
    this.miosAuto.set(peer, m);
  }

  estadoMio() {
    const g = this.g, p = g.player;
    let f = 0;
    if (p.aiming || p.driveBy) f |= F.apunta;
    if (p.dead) f |= F.muerto;
    if (p.swimming) f |= F.nada;
    if (p.knockT > 0) f |= F.caido;
    if (g.paused) f |= F.pausa;
    if (g.interiors && g.interiors.inside) f |= F.adentro;
    if (p.diving) f |= F.buceo;
    const j = {
      s: [r2(p.pos.x), r2(p.pos.y), r2(p.pos.z), r2(p.heading), r2(p.vx), r2(p.vz), f, Math.max(0, WEAPON_ORDER.indexOf(p.weapon)), r2(p.aimPitch || 0), p === g.petroca ? 1 : 0, Math.round(p.health), Math.round(p.armor || 0)],
      a: null,
      d: [this.disparos, ...this.dir],
      pu: this.mano,
      m: [this.muertes, this.asesino],
    };
    const v = p.vehicle;
    if (v && !v.removed) j.a = [v.key, v.color >>> 0, r2(v.pos.x), r2(v.pos.y), r2(v.pos.z), r2(v.heading), r2(v.vx), r2(v.vz), r2(v.ctrl.steer || 0), Math.round(v.health), v.dead ? 1 : 0, v.siren ? 1 : 0, Math.max(0, p.seat)];
    const top = (m) => [...m.entries()].sort((a, b) => b[1].t - a[1].t).slice(0, MAX_GOLPES);
    j.g = top(this.mios).map(([k, m]) => [k, m.cum, m.arma]);
    j.ga = top(this.miosAuto).map(([k, m]) => [k, m.cum]);
    if (this.chat.k) j.c = [this.chat.k, this.chat.t];
    return j;
  }

  // ---------- cada cuadro ----------
  tick(dt) {
    const o = this.o, g = this.g;
    if (!o.sala || o.esperando || !g.player) { if (this.remotos.size) this.limpiar(); return; }
    const ahora = performance.now() / 1000;
    const yo = o.miPeer();
    // mi muerte (y quién fue)
    const muerto = !!g.player.dead;
    if (muerto && !this.estabaMuerto) {
      this.muertes++;
      const a = g.player.lastAttacker;
      this.asesino = a && a.remoto ? a.remoto : '';
      if (a && a.remoto && this.alAviso) { const r = this.remotos.get(a.remoto); this.alAviso(`<b>${escapar(r ? r.nombre : 'Alguien')}</b> te hizo bolsa`); }
    }
    this.estabaMuerto = muerto;
    // publicar
    this.tEnvio -= dt;
    if (this.tEnvio <= 0) { this.tEnvio = 1 / HZ; o.mandar({ j: this.estadoMio() }); }
    // los demás
    const vivos = new Set();
    for (const q of o.jugadores()) {
      if (q.esYo) continue;
      const e = leerEstado(q.p.j);
      if (!e) continue;
      vivos.add(q.peer);
      let r = this.remotos.get(q.peer);
      if (!r || r.pj !== e.pj) { if (r) this.sacar(r); r = this.crear(q, e); }
      if (r.nombre !== q.nombre || r.pausa !== !!(e.f & F.pausa)) { r.nombre = q.nombre; r.pausa = !!(e.f & F.pausa); r.rotulo(); }
      if (q.p !== r.ultP) { r.ultP = q.p; r.buf.push({ t: ahora, e }); if (r.buf.length > 8) r.buf.shift(); this.novedades(r, e, yo); }
      this.mover(r, ahora - RETRASO, dt);
    }
    for (const [k, r] of this.remotos) if (!vivos.has(k)) this.sacar(r);
    // limpiar contadores de los que se fueron
    for (const m of [this.mios, this.miosAuto]) for (const k of m.keys()) if (!vivos.has(k)) m.delete(k);
  }

  crear(q, e) {
    const g = this.g;
    const ped = new Ped(g, LOOKS[PJS[e.pj]] || LOOKS.gordopin, { x: e.x, z: e.z, rot: e.h, kind: 'online', name: q.nombre, persistent: true, money: 0, health: 100 });
    ped.remoto = q.peer;
    ped.npc = true; // sin voz de la calle
    ped.color = colorDe(q.peer);
    ped.blip = ped.color;
    ped.owned = WEAPON_ORDER.slice();
    for (const w of WEAPON_ORDER) ped.ammo[w] = Infinity;
    ped.infiniteAmmo = true;
    g.peds.push(ped);
    const self = this;
    // el daño que le hago yo lo cobra él en su juego (ver arriba)
    ped.hurt = function (dmg, atacante) {
      if (atacante !== g.player || !g.enArma || !(dmg > 0)) return;
      self.sumarGolpe(q.peer, dmg, g.player.weapon);
      this.hurtT = 0.3;
    };
    const r = { peer: q.peer, nombre: q.nombre, pj: e.pj, ped, auto: null, buf: [], ultP: null, pausa: false, ultChat: null, chatT: 0, primera: true };
    r.rotulo = () => this.rotulo(r);
    this.rotulo(r);
    this.remotos.set(q.peer, r);
    return r;
  }

  rotulo(r) {
    const c = r.canvas || (r.canvas = document.createElement('canvas'));
    c.width = 512; c.height = r.ultChat && r.chatT > 0 ? 160 : 64;
    const x = c.getContext('2d');
    x.clearRect(0, 0, c.width, c.height);
    x.font = 'bold 34px Arial, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.lineWidth = 6; x.strokeStyle = 'rgba(0,0,0,0.85)';
    const linea = (txt, y, col) => { x.strokeText(txt, 256, y); x.fillStyle = col; x.fillText(txt, 256, y); };
    const base = c.height - 32;
    linea(r.nombre + (r.pausa ? ' (pausa)' : ''), base, r.ped.color);
    if (r.ultChat && r.chatT > 0) {
      x.font = '28px Arial, sans-serif';
      const t = r.ultChat.length > 34 ? [r.ultChat.slice(0, 34), r.ultChat.slice(34, 68)] : [r.ultChat];
      t.forEach((s, i) => linea(s, 26 + i * 36, '#fff'));
    }
    if (!r.sprite) {
      r.tex = new THREE.CanvasTexture(c);
      r.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: r.tex, transparent: true, depthWrite: false }));
      r.sprite.renderOrder = 20;
      r.ped.group.add(r.sprite);
    } else { r.tex.image = c; r.tex.needsUpdate = true; }
    const alto = c.height / 64;
    r.sprite.scale.set(2.6, 0.325 * alto, 1);
    r.sprite.position.y = 2.15 + 0.16 * (alto - 1);
  }

  // Lo que pasó desde la última presencia: disparos, golpes, muertes, chat y daño que me hicieron
  novedades(r, e, yo) {
    const g = this.g, p = g.player;
    const primera = r.primera;
    r.primera = false;
    const mismoLugar = !!(e.f & F.adentro) === !!(g.interiors && g.interiors.inside);
    // disparos (solo efecto: el daño lo cuenta cada uno)
    if (e.disparos) {
      const nuevos = primera || r.disparos === undefined ? 0 : Math.max(0, Math.min(3, e.disparos.k - r.disparos));
      r.disparos = e.disparos.k;
      if (nuevos && mismoLugar) this.efectoDisparo(r, e, nuevos);
    }
    if (!primera && e.mano > (r.mano || 0) && mismoLugar) r.ped.model.anim.punch = 1;
    r.mano = e.mano;
    // muertes
    if (!primera && e.muertes.k > (r.muertes || 0) && this.alAviso) {
      const por = e.muertes.por;
      if (por && por === yo) { this.alAviso(`Hiciste bolsa a <b>${escapar(r.nombre)}</b>`); g.stats.onlineKills = (g.stats.onlineKills || 0) + 1; }
      else if (por && this.remotos.has(por)) this.alAviso(`<b>${escapar(this.remotos.get(por).nombre)}</b> hizo bolsa a <b>${escapar(r.nombre)}</b>`);
      else this.alAviso(`<b>${escapar(r.nombre)}</b> quedó hecho bolsa`);
    }
    r.muertes = e.muertes.k;
    // chat
    // (el mensaje que ya estaba al aparecer no se muestra; si todavía no había escrito, cuenta desde 0)
    const chatK = e.chat ? e.chat.k : 0;
    if (primera) r.chatK = chatK;
    else if (chatK > r.chatK) {
      r.chatK = chatK;
      if (e.chat.t && !this.o.silenciados.has(r.peer)) {
        r.ultChat = e.chat.t; r.chatT = 6; this.rotulo(r);
        if (this.alChat) this.alChat(r.nombre, e.chat.t, r.ped.color);
      }
    } else r.chatK = chatK;
    // daño que me hicieron
    let V = this.vistos.get(r.peer);
    if (!V) { V = { g: undefined, ga: undefined, cubo: DPS_PERSONA, cuboA: DPS_AUTO, t: performance.now() / 1000 }; this.vistos.set(r.peer, V); }
    const t = performance.now() / 1000;
    const dt = Math.min(2, t - V.t); V.t = t;
    V.cubo = Math.min(DPS_PERSONA, V.cubo + DPS_PERSONA * dt);
    V.cuboA = Math.min(DPS_AUTO, V.cuboA + DPS_AUTO * dt);
    // Contador de daño que este jugador me lleva: lo que ya traía la primera vez que lo vi no se cobra
    // (era de antes); si no traía nada, arranca de 0 y el primer golpe cuenta entero.
    const mio = e.golpes.find((x) => x.v === yo);
    const mioA = e.golpesAuto.find((x) => x.v === yo);
    if (V.g === undefined) { V.g = mio ? mio.cum : 0; V.ga = mioA ? mioA.cum : 0; }
    if (!mio) V.g = 0; // me sacó de su lista (me fui o lo reinició): el próximo arranca de 0
    else {
      if (mio.cum < V.g) V.g = mio.cum; // contador reiniciado: no cobra lo viejo
      else if (mio.cum > V.g) {
        const delta = mio.cum - V.g;
        V.g = mio.cum;
        const d = Math.hypot(e.x - p.pos.x, e.z - p.pos.z);
        const ok = mismoLugar && !g.respawning && !p.dead && d <= rangoArma(mio.arma);
        const dmg = ok ? Math.min(delta, V.cubo) : 0;
        if (dmg > 0) {
          V.cubo -= dmg;
          const L = d || 1;
          g.enRed = true;
          try { p.hurt(dmg, r.ped, { x: (p.pos.x - e.x) / L, z: (p.pos.z - e.z) / L, force: 0.6 }); } finally { g.enRed = false; }
        }
      }
    }
    if (!mioA) V.ga = 0;
    else {
      if (mioA.cum < V.ga) V.ga = mioA.cum;
      else if (mioA.cum > V.ga) {
        const delta = mioA.cum - V.ga;
        V.ga = mioA.cum;
        const v = p.vehicle;
        if (v && p.seat === 0 && mismoLugar && Math.hypot(e.x - v.pos.x, e.z - v.pos.z) <= 90) {
          const dmg = Math.min(delta, V.cuboA);
          V.cuboA -= dmg;
          if (dmg > 0) v.damage(dmg, r.ped);
        }
      }
    }
  }

  efectoDisparo(r, e, k) {
    const g = this.g, ped = r.ped;
    const W = WEAPONS[WEAPON_ORDER[e.arma]];
    if (!W || W.melee) return;
    const L = Math.hypot(e.disparos.dx, e.disparos.dy, e.disparos.dz) || 1;
    const dx = e.disparos.dx / L, dy = e.disparos.dy / L, dz = e.disparos.dz / L;
    ped.aimDir.set(dx, dy, dz);
    const h = ped.handWorld();
    for (let i = 0; i < k; i++) {
      const s = g.colliders.raycast(h.x, h.y, h.z, dx, dy, dz, W.range);
      const t = s ? s.t : W.range;
      g.effects.tracer(h.x, h.y, h.z, h.x + dx * t, h.y + dy * t, h.z + dz * t);
    }
    g.effects.muzzle(h.x + dx * 0.3, h.y + dy * 0.3, h.z + dz * 0.3);
    g.audio && g.audio.gun && g.audio.gun(W.sound, ped.pos);
    // los tiros asustan a la gente de mi calle también
    g.population && g.population.panic && g.population.panic(ped.pos, 35, ped);
  }

  // Posición interpolada entre las dos muestras que rodean el instante t
  muestra(r, t) {
    const b = r.buf;
    if (!b.length) return null;
    let a = b[0], c = b[b.length - 1];
    if (t <= a.t) return a.e;
    if (t >= c.t) {
      const ex = Math.min(EXTRAPOLA, t - c.t), e = c.e;
      return { ...e, x: e.x + e.vx * ex, z: e.z + e.vz * ex, auto: e.auto ? { ...e.auto, x: e.auto.x + e.auto.vx * ex, z: e.auto.z + e.auto.vz * ex } : null };
    }
    for (let i = 0; i < b.length - 1; i++) if (b[i].t <= t && b[i + 1].t >= t) { a = b[i]; c = b[i + 1]; break; }
    const k = (t - a.t) / Math.max(1e-3, c.t - a.t);
    const A = a.e, C = c.e;
    const l = (u, v) => u + (v - u) * k;
    const s = { ...C, x: l(A.x, C.x), y: l(A.y, C.y), z: l(A.z, C.z), h: angLerp(A.h, C.h, k) };
    // si se teletransportó (truco, hospital), no se arrastra por la ciudad
    if (Math.hypot(C.x - A.x, C.z - A.z) > 40) Object.assign(s, { x: C.x, y: C.y, z: C.z, h: C.h });
    if (A.auto && C.auto && A.auto.key === C.auto.key) s.auto = { ...C.auto, x: l(A.auto.x, C.auto.x), y: l(A.auto.y, C.auto.y), z: l(A.auto.z, C.auto.z), h: angLerp(A.auto.h, C.auto.h, k) };
    return s;
  }

  mover(r, t, dt) {
    const g = this.g, ped = r.ped;
    const e = this.muestra(r, t);
    if (!e) return;
    const visible = !!(e.f & F.adentro) === !!(g.interiors && g.interiors.inside);
    ped.group.visible = visible;
    ped.hidden = !visible; // invisible: ni choca ni recibe tiros
    if (r.chatT > 0) { r.chatT -= dt; if (r.chatT <= 0) this.rotulo(r); }
    const W = WEAPONS[WEAPON_ORDER[e.arma]];
    if (ped.weapon !== WEAPON_ORDER[e.arma]) ped.setWeapon(WEAPON_ORDER[e.arma]);
    ped.health = e.hp;
    ped.dead = !!(e.f & F.muerto);
    // auto
    const A = e.auto;
    if (A) {
      let v = r.auto;
      if (!v || v.key !== A.key || v.removed) {
        if (v) this.sacarAuto(r);
        v = g.spawnVehicle(A.key, A.x, A.z, A.h, { color: A.color, persistent: true });
        v.remoto = r.peer;
        v.locked = true;
        const self = this;
        v.damage = function (dmg, causa) { if (causa === g.player && g.enArma && dmg > 0) self.sumarAuto(r.peer, dmg); };
        r.auto = v;
      }
      if (ped.vehicle !== v) { if (ped.vehicle) ped.exitVehicle(); ped.enterVehicle(v, Math.min(A.asiento, v.seats.length - 1)); }
      v.pos.set(A.x, A.y, A.z);
      v.heading = A.h;
      v.vx = A.vx; v.vz = A.vz;
      v.ctrl.steer = A.steer;
      v.siren = A.sirena;
      v.group.visible = visible;
      if (A.muerto && !v.dead) v.explode();
      v.updateVisual(dt, v.forwardSpeed);
      ped.pos.copy(v.pos);
      ped.model.update(dt, { sit: true, steer: A.asiento === 0 ? A.steer : 0, ride: v.type.bike ? (v.key === 'bmx' ? 'bici' : 'moto') : null, aim: !!(e.f & F.apunta), aimSide: 1 });
      return;
    }
    if (ped.vehicle) ped.exitVehicle();
    if (r.auto) this.sacarAuto(r);
    ped.pos.set(e.x, e.y, e.z);
    ped.heading = e.h;
    ped.vx = e.vx; ped.vz = e.vz;
    ped.aiming = !!(e.f & F.apunta);
    ped.aimPitch = e.pitch;
    ped.swimming = !!(e.f & F.nada);
    const hs = Math.hypot(e.vx, e.vz);
    const caido = !!(e.f & (F.muerto | F.caido));
    ped.model.update(dt, {
      speed: caido ? 0 : ped.swimming ? Math.max(hs, 0.9) : hs,
      air: false, swim: ped.swimming, swimStyle: ped.swimming ? (e.f & F.buceo ? 'buceo' : hs > 2.6 ? 'crol' : 'pecho') : null,
      bodyPitch: ped.swimming ? (e.f & F.buceo ? 1.2 : 1.3) : 0,
      aim: ped.aiming && !caido, aimPitch: e.pitch, twoHanded: W && W.twoHanded, melee: W && W.swing, punchSide: ped.punchSide,
      dead: caido,
    });
    ped.group.position.copy(ped.pos);
    if (ped.swimming) ped.group.position.y = ped.pos.y - 0.9;
    ped.group.rotation.y = ped.heading;
  }

  sacarAuto(r) {
    const v = r.auto;
    r.auto = null;
    if (!v || v.removed) return;
    if (r.ped.vehicle === v) r.ped.exitVehicle();
    this.g.removeVehicle(v);
  }

  sacar(r) {
    this.sacarAuto(r);
    if (r.sprite) { r.sprite.material.dispose(); r.tex.dispose(); }
    this.g.removePed(r.ped);
    this.remotos.delete(r.peer);
    this.vistos.delete(r.peer);
  }

  limpiar() { for (const r of [...this.remotos.values()]) this.sacar(r); this.mios.clear(); this.miosAuto.clear(); }
}

export function escapar(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
