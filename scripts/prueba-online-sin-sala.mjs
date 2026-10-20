// Prueba de qué ve quien abre el juego donde la sala del Artifact no aparece (por ejemplo, el celular de
// una cuenta invitada): el botón aparece igual, el panel explica por qué y qué hacer, y si la sala aparece
// después (o se acepta el permiso) se conecta.
//   node scripts/build.mjs --solo=compacto && node scripts/prueba-online-sin-sala.mjs
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const archivo = path.resolve('dist/gta-san-jorge-compacto.html');
const srv = http.createServer((q, s) => {
  s.writeHead(200, { 'content-type': 'text/html' });
  // /marco.html: el juego dentro de un marco, como lo muestra Claude (dentro de un Artifact)
  if (q.url.startsWith('/marco.html')) s.end('<!doctype html><body style="margin:0"><iframe src="/juego.html" style="width:100vw;height:100vh;border:0"></iframe>');
  else fs.createReadStream(archivo).pipe(s);
});
await new Promise((r) => srv.listen(0, r));
const base = `http://127.0.0.1:${srv.address().port}`;
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
let fallas = 0;
const ok = (c, m) => { console.log((c ? '  ok  ' : '  MAL ') + m); if (!c) fallas++; };

const nav = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--disable-renderer-backgrounding', '--disable-background-timer-throttling'] });
const celu = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36' };

// salas falsas mínimas: alcanzan para que el juego las dé por conectadas (o por rechazadas)
const SALA = `({ presence: async () => {}, peers: () => [], onPeers: (f) => { setTimeout(() => f({ peers: [], joined: [], left: [], updated: [] }), 0); return () => {}; }, connected: () => true, onConnection: () => () => {}, join: async () => { throw { code: 'not_permitted' }; } })`;
const SALA_NO_ADMITIDA = `({ presence: async () => { throw { code: 'not_granted' }; }, peers: () => [], onPeers: (f, err) => { setTimeout(() => err && err({ code: 'not_granted', message: 'x' }), 50); return () => {}; }, connected: () => false, onConnection: () => () => {}, join: async () => { throw { code: 'not_granted' }; } })`;

// Abre el juego (suelto, o dentro de un marco) con un window.claude de mentira; devuelve la página y donde está el juego
async function abrir(initScript, { marco = false } = {}) {
  const ctx = await nav.newContext(celu);
  const p = await ctx.newPage();
  const errores = [];
  p.on('pageerror', (e) => errores.push(e.message));
  if (initScript) await p.addInitScript(initScript);
  await p.goto(base + (marco ? '/marco.html' : '/juego.html'));
  let t = p;
  if (marco) {
    for (let i = 0; i < 100 && !p.frames().some((f) => f.url().endsWith('/juego.html')); i++) await esperar(100);
    t = p.frames().find((f) => f.url().endsWith('/juego.html'));
  }
  await t.waitForFunction(() => window.__game && window.__game.onlineUI, null, { timeout: 90000 });
  await t.evaluate(() => { window.__game.render = () => {}; });
  await t.click('body');
  await p.keyboard.press('Enter'); // pasa la pantalla de "apretá una tecla"
  await esperar(1500);
  return { p, t, errores, ctx };
}
const botones = (t) => t.evaluate(() => [...document.querySelectorAll('[data-a=online]')].map((b) => ({ oculto: b.hidden, txt: b.textContent })));
const panel = (t) => t.evaluate(() => document.querySelector('.online-screen').innerText.replace(/\s+/g, ' '));
async function abrirPanel(t) {
  await t.waitForFunction(() => /sin conexión/.test(document.querySelector('[data-a=online]').textContent), null, { timeout: 30000 });
  await t.click('.menu [data-a=online] >> visible=true');
  await esperar(500);
}
const conectado = (t) => t.evaluate(() => window.__game.online.disponible);

console.log('Sin Artifact (archivo suelto, .exe, .apk)');
{
  const { t, ctx } = await abrir(null);
  await esperar(1500);
  const b = await botones(t);
  ok(b.length === 2 && b.every((x) => x.oculto), 'el botón online no aparece');
  await ctx.close();
}

console.log('Artifact donde la vista contesta que no (use devuelve null), dentro de un marco como en Claude');
{
  const { t, errores, ctx } = await abrir('window.claude = { use: async () => null };', { marco: true });
  await abrirPanel(t);
  const b = await botones(t);
  ok(b.every((x) => !x.oculto) && /Jugar online \(sin conexión: tocá acá\)/.test(b[0].txt), 'el botón aparece y avisa: ' + b[0].txt);
  const txt = await panel(t);
  ok(/no está disponible para esta cuenta/.test(txt) && /invitarte con tu correo/.test(txt), 'explica que la cuenta tiene que estar invitada con su correo');
  ok(/Reintentar/.test(txt) && !/Permitir|Abrir permisos/.test(txt), 'tiene "Reintentar" y no ofrece permisos que no hacen falta');
  ok(/sin-permiso/.test(txt) && /dentro-de-claude/.test(txt) && /celular/.test(txt), 'el dato para ayudar dice qué pasó: ' + txt.slice(txt.indexOf('Dato para ayudar')));
  ok(!(await t.evaluate(() => !document.querySelector('.online-resto').hidden)), 'no ofrece crear salas si no hay conexión');
  await t.screenshot?.({ path: process.env.CAPTURA || 'sin-sala.png' }).catch(() => {});
  // la sala aparece: "Reintentar" la conecta
  await t.evaluate((S) => { window.claude.use = async () => eval(S); }, SALA);
  await t.click('.online-screen button:has-text("Reintentar")');
  await t.waitForFunction(() => window.__game.online.disponible, null, { timeout: 30000 }).catch(() => {});
  ok(await conectado(t), 'con "Reintentar" se conecta');
  ok(await t.evaluate(() => !document.querySelector('.online-resto').hidden), 'y aparecen crear sala y entrar con código');
  ok(errores.length === 0, 'sin errores' + (errores.length ? ': ' + errores[0] : ''));
  await ctx.close();
}

console.log('Juego abierto suelto, fuera de Claude, pero con window.claude');
{
  const { t, ctx } = await abrir('window.claude = { use: async () => null };');
  await abrirPanel(t);
  const txt = await panel(t);
  ok(/Abriste el juego suelto, no dentro de Claude/.test(txt), 'dice que hay que abrirlo desde Claude');
  await ctx.close();
}

console.log('Permiso de salas rechazado (hay que abrir el panel de permisos)');
{
  const init = `window.claude = { use: async (n) => {
    if (n === 'permissions') return { state: async () => 'denied', request: async () => ({ room: 'denied' }), manage: async () => { window.__abierto = true; } };
    return null; } };`;
  const { t, ctx } = await abrir(init, { marco: true });
  await abrirPanel(t);
  const txt = await panel(t);
  ok(/Rechazaste el permiso de salas/.test(txt) && /Abrir permisos/.test(txt), 'explica el permiso rechazado y ofrece "Abrir permisos"');
  // al activarlo en el panel de Claude, la sala responde
  await t.evaluate((S) => { const u = window.claude.use; window.claude.use = async (n) => (n === 'room' ? (window.__abierto ? eval(S) : null) : u(n)); }, SALA);
  await t.click('.online-screen button:has-text("Abrir permisos")');
  await t.waitForFunction(() => window.__game.online.disponible, null, { timeout: 30000 }).catch(() => {});
  ok(await t.evaluate(() => !!window.__abierto) && await conectado(t), '"Abrir permisos" abre el panel de Claude y después se conecta');
  await ctx.close();
}

console.log('Permiso de salas sin aceptar todavía');
{
  const init = `window.claude = { use: async (n) => {
    if (n === 'permissions') return { state: async () => 'prompt', request: async () => { window.__pidio = true; return { room: 'granted' }; }, manage: async () => {} };
    return null; } };`;
  const { t, ctx } = await abrir(init, { marco: true });
  await abrirPanel(t);
  const txt = await panel(t);
  ok(/Falta que aceptes el permiso de salas/.test(txt) && /Permitir/.test(txt), 'explica que falta aceptar y ofrece "Permitir"');
  await t.evaluate((S) => { const u = window.claude.use; window.claude.use = async (n) => (n === 'room' ? (window.__pidio ? eval(S) : null) : u(n)); }, SALA);
  await t.click('.online-screen button:has-text("Permitir")');
  await t.waitForFunction(() => window.__game.online.disponible, null, { timeout: 30000 }).catch(() => {});
  ok(await t.evaluate(() => !!window.__pidio) && await conectado(t), '"Permitir" pide el permiso y después se conecta');
  await ctx.close();
}

console.log('La vista conecta pero Claude no admite a la cuenta (not_granted)');
{
  const { t, ctx } = await abrir(`window.claude = { use: async () => ${SALA_NO_ADMITIDA} };`, { marco: true });
  await abrirPanel(t);
  const txt = await panel(t);
  ok(!(await conectado(t)), 'se da por sin conexión');
  ok(/Claude no deja entrar a esta cuenta a las salas/.test(txt) && /not_granted/.test(txt), 'explica que hay que invitar a la cuenta con su correo');
  await ctx.close();
}

console.log('Artifact donde la sala responde tarde (se conecta sola)');
{
  const { t, ctx } = await abrir(`window.__n = 0; window.claude = { use: async () => (++window.__n < 2 ? null : ${SALA}) };`, { marco: true });
  await t.waitForFunction(() => window.__game.online.disponible, null, { timeout: 40000 }).catch(() => {});
  ok(await conectado(t), 'si la primera vez falla, vuelve a probar y se conecta sola');
  const b = await botones(t);
  ok(b.every((x) => !x.oculto && x.txt === (x === b[0] ? 'Jugar online' : 'Online')), 'el botón queda como siempre: ' + b.map((x) => x.txt).join(' / '));
  await ctx.close();
}

await nav.close(); srv.close();
console.log(fallas ? `\n${fallas} pruebas fallaron` : '\nTodas las pruebas pasaron');
process.exit(fallas ? 1 : 0);
