#!/usr/bin/env node
// Servidor opcional de Isla Anzuelo para jugar con amigos fuera del Artifact.
// Sirve el juego y reenvía (por WebSocket, sin dependencias) la presencia y los eventos de cada sala. No decide nada del juego:
// el anfitrión (el jugador de id más bajo) simula a los jefes, igual que en el Artifact.
//
//   node pesca/servidor.mjs                 → http://localhost:8787 (sirve pesca/index.html)
//   node pesca/servidor.mjs --dist          → sirve el juego ya armado (pesca/dist/isla-anzuelo.html)
//   node pesca/servidor.mjs -p 9000 --host 0.0.0.0
//
// Para jugar por internet hace falta que el puerto sea alcanzable (reenvío de puertos o un túnel como cloudflared / ngrok).
import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const arg = (n, c, d) => { const i = process.argv.findIndex((a) => a === n || a === c); return i >= 0 ? process.argv[i + 1] : d; };
const PUERTO = +arg('--puerto', '-p', process.env.PORT || 8787);
const HOST = arg('--host', '-h', process.env.HOST || '0.0.0.0');
const USAR_DIST = process.argv.includes('--dist');
const MAX_SALA = 16, MAX_SALAS = 256, MAX_MSG = 8192, MAX_PRES = 4096, MAX_EVT = 4096;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };

// ---------------------------------------------------------------------------
// Archivos estáticos (el index.html lleva una marca para que el juego sepa que acá hay sala)
// ---------------------------------------------------------------------------
const MARCA = '<script>window.__RED_SERVIDOR=true</script>';
function servirArchivo(req, res) {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/red.json') { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify({ ok: true, jugadores: totalJugadores() })); return; }
  if (p === '/') p = USAR_DIST ? '/dist/isla-anzuelo.html' : '/index.html';
  const f = path.normalize(path.join(AQUI, p));
  if (!f.startsWith(AQUI + path.sep) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404, { 'content-type': 'text/plain' }); res.end('No encontrado'); return; }
  const ext = path.extname(f);
  const tipo = MIME[ext] || 'application/octet-stream';
  if (ext === '.html') {
    let html = fs.readFileSync(f, 'utf8');
    html = html.includes('<head>') ? html.replace('<head>', '<head>\n' + MARCA) : MARCA + html;
    res.writeHead(200, { 'content-type': tipo, 'cache-control': 'no-store' });
    res.end(html);
    return;
  }
  res.writeHead(200, { 'content-type': tipo, 'cache-control': 'no-store' });
  fs.createReadStream(f).pipe(res);
}

// ---------------------------------------------------------------------------
// WebSocket mínimo (RFC 6455): texto, ping/pong y cierre
// ---------------------------------------------------------------------------
const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
function marco(texto, op = 0x1) {
  const cuerpo = Buffer.from(texto, 'utf8'), n = cuerpo.length;
  let cab;
  if (n < 126) cab = Buffer.from([0x80 | op, n]);
  else if (n < 65536) { cab = Buffer.alloc(4); cab[0] = 0x80 | op; cab[1] = 126; cab.writeUInt16BE(n, 2); } else { cab = Buffer.alloc(10); cab[0] = 0x80 | op; cab[1] = 127; cab.writeBigUInt64BE(BigInt(n), 2); }
  return Buffer.concat([cab, cuerpo]);
}
// Saca los mensajes completos de un buffer acumulado. Devuelve el resto.
function leerMarcos(c, buf, alMensaje) {
  for (;;) {
    if (buf.length < 2) return buf;
    const b0 = buf[0], b1 = buf[1], op = b0 & 0x0f, enmascarado = (b1 & 0x80) !== 0;
    let n = b1 & 0x7f, pos = 2;
    if (n === 126) { if (buf.length < 4) return buf; n = buf.readUInt16BE(2); pos = 4; } else if (n === 127) { if (buf.length < 10) return buf; n = Number(buf.readBigUInt64BE(2)); pos = 10; }
    if (n > MAX_MSG * 4) { c.cerrar(1009); return Buffer.alloc(0); }
    const total = pos + (enmascarado ? 4 : 0) + n;
    if (buf.length < total) return buf;
    let cuerpo = buf.subarray(pos + (enmascarado ? 4 : 0), total);
    if (enmascarado) { const m = buf.subarray(pos, pos + 4); cuerpo = Buffer.from(cuerpo); for (let i = 0; i < cuerpo.length; i++) cuerpo[i] ^= m[i & 3]; }
    buf = buf.subarray(total);
    if (op === 0x8) { c.cerrar(1000); return Buffer.alloc(0); }
    if (op === 0x9) c.socket.write(marco(cuerpo.toString('utf8'), 0xa));
    else if (op === 0xa) c.vivo = Date.now();
    else if (op === 0x1 || op === 0x0) {
      c.frag = op === 0x1 ? [cuerpo] : [...(c.frag || []), cuerpo];
      if (b0 & 0x80) { const t = Buffer.concat(c.frag).toString('utf8'); c.frag = null; if (t.length <= MAX_MSG) alMensaje(c, t); }
      else if (c.frag.reduce((a, b) => a + b.length, 0) > MAX_MSG) { c.cerrar(1009); return Buffer.alloc(0); }
    }
  }
}

// ---------------------------------------------------------------------------
// Salas
// ---------------------------------------------------------------------------
const salas = new Map(); // nombre -> Map(id -> cliente)
let contador = 0;
const totalJugadores = () => [...salas.values()].reduce((n, s) => n + s.size, 0);
const nombreSala = (s) => (/^[a-z0-9][a-z0-9_.-]{0,47}$/.test(s || '') ? s : 'isla');
function difundir(sala, desde, msg) {
  const m = marco(JSON.stringify(msg));
  for (const c of sala.values()) if (c !== desde && c.hola) { try { c.socket.write(m); } catch (e) { /* se cayó */ } }
}
function alMensaje(c, texto) {
  let m;
  try { m = JSON.parse(texto); } catch (e) { return; }
  if (!m || typeof m !== 'object') return;
  const sala = salas.get(c.sala);
  if (!sala) return;
  const ahora = Date.now();
  if (m.t === 'hola') {
    if (c.hola) return;
    c.hola = true;
    c.socket.write(marco(JSON.stringify({ t: 'yo', id: c.id })));
    c.socket.write(marco(JSON.stringify({ t: 'estado', pares: [...sala.values()].filter((q) => q !== c && q.hola).map((q) => [q.id, q.p]) })));
    console.log(`[red] + ${c.id} en "${c.sala}" (${sala.size} jugando)`);
    return;
  }
  if (!c.hola) return;
  if (m.t === 'p') {
    if (ahora - c.ultP < 20) return; // como mucho ~50 por segundo
    c.ultP = ahora;
    const s = JSON.stringify(m.p);
    if (!m.p || typeof m.p !== 'object' || s.length > MAX_PRES) return;
    c.p = m.p;
    difundir(sala, c, { t: 'p', id: c.id, p: c.p });
  } else if (m.t === 'e') {
    if (typeof m.k !== 'string' || !/^[a-z][a-z0-9_.-]{0,47}$/.test(m.k)) return;
    if (JSON.stringify(m.d === undefined ? null : m.d).length > MAX_EVT) return;
    c.evt = c.evt.filter((t) => ahora - t < 1000);
    if (c.evt.length >= 40) return;
    c.evt.push(ahora);
    difundir(sala, c, { t: 'e', id: c.id, k: m.k, d: m.d });
  }
}
function nuevoCliente(socket, nombre) {
  const sala = salas.get(nombre) || new Map();
  const c = {
    id: 'w' + (++contador).toString(36) + crypto.randomBytes(2).toString('hex'), socket, sala: nombre, p: {}, hola: false, vivo: Date.now(), ultP: 0, evt: [], frag: null, buf: Buffer.alloc(0),
    cerrar(codigo = 1000) {
      if (c.cerrado) return;
      c.cerrado = true;
      try { const b = Buffer.alloc(2); b.writeUInt16BE(codigo); socket.write(Buffer.concat([Buffer.from([0x88, 2]), b])); socket.end(); } catch (e) { /* ya cerrado */ }
      salir();
    },
  };
  const salir = () => {
    const s = salas.get(nombre);
    if (!s || !s.delete(c.id)) return;
    if (c.hola) { difundir(s, c, { t: 'sale', id: c.id }); console.log(`[red] - ${c.id} de "${nombre}" (${s.size} quedan)`); }
    if (!s.size) salas.delete(nombre);
  };
  sala.set(c.id, c);
  salas.set(nombre, sala);
  socket.on('data', (d) => { c.buf = leerMarcos(c, Buffer.concat([c.buf, d]), alMensaje); });
  socket.on('close', () => { c.cerrado = true; salir(); });
  socket.on('error', () => { c.cerrado = true; salir(); });
  return c;
}

const servidor = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); res.end(); return; }
  try { servirArchivo(req, res); } catch (e) { res.writeHead(500); res.end('Error'); }
});
servidor.on('upgrade', (req, socket) => {
  const u = new URL(req.url, 'http://x');
  const key = req.headers['sec-websocket-key'];
  if (u.pathname !== '/ws' || !key || String(req.headers.upgrade).toLowerCase() !== 'websocket') { socket.destroy(); return; }
  const nombre = nombreSala(u.searchParams.get('sala'));
  const sala = salas.get(nombre);
  if ((sala && sala.size >= MAX_SALA) || (!sala && salas.size >= MAX_SALAS)) { socket.write('HTTP/1.1 503 Service Unavailable\r\n\r\n'); socket.destroy(); return; }
  const accept = crypto.createHash('sha1').update(key + GUID).digest('base64');
  socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${accept}\r\n\r\n`);
  socket.setNoDelay(true);
  nuevoCliente(socket, nombre);
});
// latido: se cierran las conexiones mudas
setInterval(() => {
  const ahora = Date.now();
  for (const sala of salas.values()) for (const c of sala.values()) {
    if (ahora - c.vivo > 60000) { c.cerrar(1001); continue; }
    try { c.socket.write(marco('', 0x9)); } catch (e) { /* nada */ }
  }
}, 20000).unref();

servidor.listen(PUERTO, HOST, () => {
  console.log(`Isla Anzuelo · servidor multijugador en el puerto ${PUERTO}${USAR_DIST ? ' (juego armado: dist/isla-anzuelo.html)' : ''}`);
  console.log(`  Local:  http://localhost:${PUERTO}`);
  for (const lista of Object.values(os.networkInterfaces())) for (const i of lista || []) if (i.family === 'IPv4' && !i.internal) console.log(`  Red:    http://${i.address}:${PUERTO}`);
  console.log('  Todos los que entren a la misma dirección (y el mismo código de sala) comparten la isla. Ctrl+C para cerrar.');
});
export { servidor };
