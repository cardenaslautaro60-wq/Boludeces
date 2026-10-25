// Lectura del estado que manda otro jugador por la sala. Sin dependencias del juego (se prueba en Node).
// Todo lo que llega es de otro navegador: se valida tipo por tipo y se acota.
export const MAX_GOLPES = 8; // víctimas que entran en la presencia a la vez

const n = (v, d = 0) => (typeof v === 'number' && Number.isFinite(v) && Math.abs(v) < 1e5 ? v : d);
export function textoChat(s) { return String(s == null ? '' : s).replace(/[\p{C}]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 100); }
// Lee y valida el estado que manda otro jugador. Devuelve null si no sirve.
export function leerEstado(j, { autos = {}, armas = 6 } = {}) {
  if (!j || typeof j !== 'object' || !Array.isArray(j.s) || j.s.length < 12) return null;
  const s = j.s.map((v) => n(v));
  const e = {
    x: s[0], y: s[1], z: s[2], h: s[3], vx: Math.max(-80, Math.min(80, s[4])), vz: Math.max(-80, Math.min(80, s[5])),
    f: Math.floor(s[6]) & 255, arma: Math.max(0, Math.min(armas - 1, Math.floor(s[7]))), pitch: Math.max(-1.2, Math.min(1.2, s[8])),
    pj: s[9] === 1 ? 1 : 0, hp: Math.max(0, Math.min(500, s[10])),
  };
  const a = j.a;
  if (Array.isArray(a) && a.length >= 13 && typeof a[0] === 'string' && Object.prototype.hasOwnProperty.call(autos, a[0])) {
    e.auto = {
      key: a[0], color: Math.floor(n(a[1], 0xffffff)) & 0xffffff, x: n(a[2]), y: n(a[3]), z: n(a[4]), h: n(a[5]),
      vx: Math.max(-90, Math.min(90, n(a[6]))), vz: Math.max(-90, Math.min(90, n(a[7]))), steer: Math.max(-1, Math.min(1, n(a[8]))),
      muerto: a[10] === 1, sirena: a[11] === 1, asiento: Math.max(0, Math.min(3, Math.floor(n(a[12])))),
    };
  }
  const lista = (x, len) => (Array.isArray(x) ? x.slice(0, MAX_GOLPES).filter((g) => Array.isArray(g) && g.length >= len && typeof g[0] === 'string' && g[0].length <= 64) : []);
  e.golpes = lista(j.g, 3).map((g) => ({ v: g[0], cum: Math.max(0, n(g[1])), arma: Math.max(0, Math.min(armas - 1, Math.floor(n(g[2])))) }));
  e.golpesAuto = lista(j.ga, 2).map((g) => ({ v: g[0], cum: Math.max(0, n(g[1])) }));
  e.disparos = Array.isArray(j.d) ? { k: Math.floor(n(j.d[0])), dx: n(j.d[1]), dy: n(j.d[2]), dz: n(j.d[3], 1) } : null;
  e.mano = Math.floor(n(j.pu));
  e.muertes = Array.isArray(j.m) ? { k: Math.floor(n(j.m[0])), por: typeof j.m[1] === 'string' ? j.m[1].slice(0, 64) : '' } : { k: 0, por: '' };
  e.chat = Array.isArray(j.c) ? { k: Math.floor(n(j.c[0])), t: textoChat(j.c[1]) } : null;
  return e;
}

