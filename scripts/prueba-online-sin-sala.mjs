// Prueba de qué ve quien abre el juego en un celular donde la sala del Artifact no responde:
// el botón aparece igual, el panel explica y el juego sigue; y si la sala aparece después, se conecta sola.
//   node scripts/build.mjs --solo=compacto && node scripts/prueba-online-sin-sala.mjs
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const archivo = path.resolve('dist/gta-san-jorge-compacto.html');
const srv = http.createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); fs.createReadStream(archivo).pipe(s); });
await new Promise((r) => srv.listen(0, r));
const base = `http://127.0.0.1:${srv.address().port}/juego.html`;
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
let fallas = 0;
const ok = (c, m) => { console.log((c ? '  ok  ' : '  MAL ') + m); if (!c) fallas++; };

const nav = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--disable-renderer-backgrounding', '--disable-background-timer-throttling'] });
const celu = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };

// sala falsa mínima: alcanza para que el juego la dé por conectada
const SALA = `({ presence: async () => {}, peers: () => [], onPeers: (f) => { setTimeout(() => f({ peers: [], joined: [], left: [], updated: [] }), 0); return () => {}; }, connected: () => true, onConnection: () => () => {}, join: async () => { throw { code: 'not_permitted' }; } })`;

async function abrir(initScript, query = '') {
  const ctx = await nav.newContext(celu);
  const p = await ctx.newPage();
  const errores = [];
  p.on('pageerror', (e) => errores.push(e.message));
  if (initScript) await p.addInitScript(initScript);
  await p.goto(base + query);
  await p.waitForFunction(() => window.__game && window.__game.onlineUI, null, { timeout: 90000 });
  await p.evaluate(() => { window.__game.render = () => {}; });
  await p.keyboard.press('Enter'); // pasa la pantalla de "apretá una tecla"
  await esperar(1500);
  return { p, errores, ctx };
}
const botones = (p) => p.evaluate(() => [...document.querySelectorAll('[data-a=online]')].map((b) => ({ oculto: b.hidden, txt: b.textContent })));

console.log('Sin Artifact (archivo suelto, .exe, .apk)');
{
  const { p, ctx } = await abrir(null);
  await esperar(1500);
  const b = await botones(p);
  ok(b.length === 2 && b.every((x) => x.oculto), 'el botón online no aparece');
  await ctx.close();
}

console.log('Artifact donde la sala no responde (use devuelve null)');
{
  const { p, errores, ctx } = await abrir('window.claude = { use: async () => null };');
  await p.waitForFunction(() => /sin conexión/.test(document.querySelector('[data-a=online]').textContent), null, { timeout: 20000 });
  const b = await botones(p);
  ok(b.every((x) => !x.oculto) && /Jugar online \(sin conexión\)/.test(b[0].txt), 'el botón aparece y dice "sin conexión": ' + b[0].txt);
  await p.click('.menu [data-a=online] >> visible=true');
  await esperar(500);
  const panel = await p.evaluate(() => document.querySelector('.online-screen').innerText);
  ok(/No pude conectarme/.test(panel) && /Reintentar/.test(panel) && /sin-permiso/.test(panel), 'el panel explica qué hacer y trae el dato para ayudar');
  ok(!/Crear una sala/.test(panel.replace(/\n/g, ' ')) || await p.evaluate(() => document.querySelector('.online-resto').hidden), 'no ofrece crear salas si no hay conexión');
  await p.screenshot({ path: process.env.CAPTURA || 'sin-sala.png' });
  // ahora la sala aparece: "Reintentar" la conecta
  await p.evaluate((S) => { window.claude.use = async () => eval(S); }, SALA);
  await p.click('.online-screen button:has-text("Reintentar")');
  await p.waitForFunction(() => /Crear una sala/.test(document.querySelector('.online-screen').innerText) && !document.querySelector('.online-resto').hidden, null, { timeout: 20000 }).catch(() => {});
  ok(await p.evaluate(() => window.__game.online.disponible), 'con "Reintentar" se conecta');
  ok(await p.evaluate(() => !document.querySelector('.online-resto').hidden), 'y aparecen crear sala y entrar con código');
  ok(errores.length === 0, 'sin errores' + (errores.length ? ': ' + errores[0] : ''));
  await ctx.close();
}

console.log('Artifact donde la sala responde tarde (se conecta sola)');
{
  const { p, ctx } = await abrir(`window.__n = 0; window.claude = { use: async () => (++window.__n < 2 ? null : ${SALA}) };`);
  await p.waitForFunction(() => window.__game.online.disponible, null, { timeout: 40000 }).catch(() => {});
  ok(await p.evaluate(() => window.__game.online.disponible), 'si la primera vez falla, vuelve a probar y se conecta sola');
  const b = await botones(p);
  ok(b.every((x) => !x.oculto && x.txt === (x === b[0] ? 'Jugar online' : 'Online')), 'el botón queda como siempre: ' + b.map((x) => x.txt).join(' / '));
  await ctx.close();
}

await nav.close(); srv.close();
console.log(fallas ? `\n${fallas} pruebas fallaron` : '\nTodas las pruebas pasaron');
process.exit(fallas ? 1 : 0);
