// Prueba de la pantalla Online como queda por defecto (decisión del 25/10: "Solo código"): sin lista de
// salas, una sola forma de crear (sala privada con código) y entrar con el código de 6 letras. Tres
// pestañas del juego con la sala de prueba ?red=bc, en tamaño de celular.
//   node scripts/build.mjs --solo=compacto && node scripts/prueba-online-codigo.mjs
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const archivo = path.resolve('dist/gta-san-jorge-compacto.html');
const srv = http.createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); fs.createReadStream(archivo).pipe(s); });
await new Promise((r) => srv.listen(0, r));
const url = `http://127.0.0.1:${srv.address().port}/juego.html?red=bc`; // sin ?acceso=: lo que ve cualquiera
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
let fallas = 0;
const ok = (c, m) => { console.log((c ? '  ok  ' : '  MAL ') + m); if (!c) fallas++; };

const nav = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--disable-renderer-backgrounding', '--disable-background-timer-throttling'] });
const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const errores = [];

async function jugador(nombre) {
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errores.push(nombre + ': ' + e.message));
  await p.goto(url);
  await p.waitForFunction(() => window.__game && window.__game.onlineUI && window.__game.online.disponible, null, { timeout: 90000 });
  await p.evaluate((n) => { window.__game.render = () => {}; window.__game.online.setNombre(n); }, nombre);
  await p.click('body');
  await p.keyboard.press('Enter');
  await esperar(1200);
  return p;
}
const abrirPanel = async (p) => { await p.click('.menu [data-a=online] >> visible=true'); await esperar(400); };
const visible = (p, sel) => p.evaluate((s) => { const e = document.querySelector(s); return !!e && !e.hidden && !!(e.offsetWidth || e.offsetHeight); }, sel);
const textoPanel = (p) => p.evaluate(() => document.querySelector('.online-screen').innerText.replace(/\s+/g, ' '));
const botones = (p) => p.evaluate(() => [...document.querySelectorAll('.online-screen button')].filter((b) => b.offsetWidth || b.offsetHeight).map((b) => b.textContent));
const cab = (p) => p.evaluate(() => (document.querySelector('.online-cab') || {}).innerText || '').then((t) => t.replace(/\s+/g, ' ').trim());
const esperarTexto = (p, sel, re, ms = 15000) => p.waitForFunction(([s, r]) => [...document.querySelectorAll(s)].some((e) => new RegExp(r).test(e.innerText)), [sel, re.source], { timeout: ms }).then(() => true, () => false);

const A = await jugador('Ana'), B = await jugador('Beto'), C = await jugador('Caro');

console.log('Pantalla por defecto: solo código');
await abrirPanel(A);
let txt = await textoPanel(A), bs = await botones(A);
ok(!(await visible(A, '.online-lista')) && !/Salas públicas|Salas abiertas|No hay salas/.test(txt), 'no hay lista de salas ni título de salas');
ok(/Crear una sala privada/.test(txt), 'el título dice "Crear una sala privada"');
ok(bs.includes('Crear sala privada (con código)') && !bs.some((t) => /pública|piden entrar|Pedir entrar/.test(t)), 'un solo botón para crear: sala privada con código (' + bs.join(' | ') + ')');
ok(!/con pedido|piden entrar/i.test(txt), 'no aparece nada de "con pedido"');
ok(/Entrar a una sala privada con código/.test(txt) && bs.includes('Entrar'), 'se puede entrar con un código');
await A.screenshot({ path: process.env.CAPTURA || 'codigo.png' });

console.log('Crear y entrar con el código');
await A.fill('.online-crear input', 'Entre amigos');
await A.click('button:has-text("Crear sala privada (con código)")');
await esperarTexto(A, '.online-cab', /Entre amigos/);
ok(/Entre amigos.*Privada.*1\/8/.test(await cab(A)), 'Ana crea la sala privada y ve 1/8: ' + await cab(A));
await esperarTexto(A, '.online-code', /^[A-Z0-9]{6}$/);
const codigo = await A.evaluate(() => (document.querySelector('.online-code') || {}).textContent || '');
ok(/^[A-Z0-9]{6}$/.test(codigo), 'le da un código de 6 letras: ' + codigo);

await abrirPanel(B);
txt = await textoPanel(B);
ok(!(await visible(B, '.online-lista')) && !/Entre amigos/.test(txt), 'Beto no ve la sala de Ana en ninguna lista');
await B.fill('.online-codigo input', codigo.toLowerCase());
await B.click('.online-codigo button');
await esperarTexto(B, '.online-cab', /2\/8/);
ok(/Entre amigos.*2\/8/.test(await cab(B)), 'Beto entra con el código (en minúscula) y ve 2/8: ' + await cab(B));
ok(await esperarTexto(A, '.online-cab', /2\/8/), 'Ana también ve 2/8');

await abrirPanel(C);
txt = await textoPanel(C);
ok(!(await visible(C, '.online-lista')) && !/Entre amigos/.test(txt), 'Caro tampoco la ve mientras estén dos adentro');
await C.fill('.online-codigo input', 'ZZZZZZ');
await C.click('.online-codigo button');
ok(await esperarTexto(C, '.online-msg', /nadie|código/i, 15000), 'con un código que no existe avisa');
await C.fill('.online-codigo input', codigo);
await C.click('.online-codigo button');
await esperarTexto(C, '.online-cab', /3\/8/);
ok(/3\/8/.test(await cab(C)), 'con el código bueno entra y ve 3/8');

console.log('Se va uno: el contador baja y la sala sigue');
await B.click('button:has-text("Salir de la sala")');
ok(await esperarTexto(A, '.online-cab', /2\/8/, 20000), 'Ana ve que quedan 2/8');
txt = await textoPanel(B);
ok(!(await visible(B, '.online-lista')) && !/Entre amigos/.test(txt), 'Beto, afuera, sigue sin ver la sala en una lista');

ok(errores.length === 0, 'sin errores en la consola' + (errores.length ? ': ' + errores[0] : ''));
await nav.close(); srv.close();
console.log(fallas ? `\n${fallas} pruebas fallaron` : '\nTodas las pruebas pasaron');
process.exit(fallas ? 1 : 0);
