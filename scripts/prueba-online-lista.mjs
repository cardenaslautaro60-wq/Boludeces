// Prueba de la pantalla Online con tres jugadores (tres pestañas del juego con la sala de prueba ?red=bc):
// la lista de salas públicas con cuánta gente hay, entrar desde la lista, el contador que sube y baja,
// la sala privada con código (que no aparece en la lista) y que no haya nada de "con pedido".
//   node scripts/build.mjs --solo=compacto && node scripts/prueba-online-lista.mjs
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const archivo = path.resolve('dist/gta-san-jorge-compacto.html');
const srv = http.createServer((q, s) => { s.writeHead(200, { 'content-type': 'text/html' }); fs.createReadStream(archivo).pipe(s); });
await new Promise((r) => srv.listen(0, r));
const url = `http://127.0.0.1:${srv.address().port}/juego.html?red=bc`;
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
const texto = (p, sel) => p.evaluate((s) => [...document.querySelectorAll(s)].map((e) => e.innerText.replace(/\s+/g, ' ').trim()), sel);
const filas = (p) => texto(p, '.online-lista .online-fila');
const cab = async (p) => (await texto(p, '.online-cab'))[0] || '';
const esperarTexto = (p, sel, re, ms = 15000) => p.waitForFunction(([s, r]) => [...document.querySelectorAll(s)].some((e) => new RegExp(r).test(e.innerText)), [sel, re.source], { timeout: ms }).then(() => true, () => false);

const A = await jugador('Ana'), B = await jugador('Beto'), C = await jugador('Caro');

console.log('Sala pública');
await abrirPanel(A);
ok(/Salas públicas/.test(await A.evaluate(() => document.querySelector('.online-screen').innerText)), 'el panel tiene la sección "Salas públicas"');
ok((await filas(A)).length === 0 && /No hay salas públicas abiertas/.test(await A.evaluate(() => document.querySelector('.online-lista').innerText)), 'al principio dice que no hay salas');
const botones = await A.evaluate(() => [...document.querySelectorAll('.online-screen button')].map((b) => b.textContent));
ok(botones.includes('Crear sala pública') && botones.includes('Crear sala privada (con código)'), 'ofrece crear sala pública y sala privada con código');
ok(!botones.some((t) => /piden entrar|Pedir entrar/.test(t)) && !(await A.evaluate(() => /con pedido|piden entrar/i.test(document.querySelector('.online-screen').innerText))), 'no aparece nada de "con pedido"');
await A.fill('.online-crear input', 'La Costanera');
await A.click('button:has-text("Crear sala pública")');
await esperarTexto(A, '.online-cab', /La Costanera/);
ok(/La Costanera.*1\/8/.test(await cab(A)), 'Ana crea la sala y ve 1/8: ' + await cab(A));

await abrirPanel(B);
await esperarTexto(B, '.online-lista .online-fila', /La Costanera/);
let f = await filas(B);
ok(f.length === 1 && /La Costanera/.test(f[0]) && /Pública/.test(f[0]) && /1\/8/.test(f[0]) && /quedan 7 lugares/.test(f[0]) && /Entrar/.test(f[0]), 'Beto la ve en la lista: ' + f[0]);
await B.click('.online-lista button:has-text("Entrar")');
await esperarTexto(B, '.online-cab', /2\/8/);
ok(/La Costanera.*2\/8/.test(await cab(B)), 'Beto entra y ve 2/8');

await abrirPanel(C);
await esperarTexto(C, '.online-lista .online-fila', /2\/8/);
f = await filas(C);
ok(f.length === 1 && /2\/8/.test(f[0]) && /quedan 6 lugares/.test(f[0]), 'Caro ve la lista con 2/8: ' + f[0]);
await C.screenshot({ path: process.env.CAPTURA || 'lista.png' });
await C.click('.online-lista button:has-text("Entrar")');
await esperarTexto(C, '.online-cab', /3\/8/);
ok(/3\/8/.test(await cab(C)), 'Caro entra y ve 3/8');
ok(await esperarTexto(A, '.online-cab', /3\/8/), 'Ana también ve 3/8');
const jugadores = await texto(A, '.online-jug .online-fila');
ok(jugadores.length === 3 && jugadores.some((x) => /Beto/.test(x)) && jugadores.some((x) => /Caro/.test(x)), 'la lista de jugadores muestra a los tres: ' + jugadores.map((x) => x.split(' ')[0]).join(', '));

console.log('Se va uno: el contador baja');
await B.click('button:has-text("Salir de la sala")');
await esperarTexto(B, '.online-lista .online-fila', /La Costanera/);
ok(await esperarTexto(B, '.online-lista .online-fila', /2\/8/, 20000), 'en la lista de Beto la sala vuelve a 2/8: ' + (await filas(B))[0]);

console.log('Sala privada con código');
await B.fill('.online-crear input', 'Solo amigos');
await B.click('button:has-text("Crear sala privada (con código)")');
await esperarTexto(B, '.online-cod', /[A-Z0-9]{6}/);
const codigo = (await texto(B, '.online-code'))[0];
ok(/^[A-Z0-9]{6}$/.test(codigo || ''), 'Beto crea una privada y le da un código de 6 letras: ' + codigo);
ok((await texto(B, '.online-cab'))[0].includes('Privada'), 'dice que es privada');
// Ana y Caro siguen en la pública: la lista de Ana (si saliera) no tendría la privada
await A.click('button:has-text("Salir de la sala")');
await esperar(1500);
f = await filas(A);
ok(f.length === 1 && /La Costanera/.test(f[0]) && !f.some((x) => /Solo amigos/.test(x)), 'la privada no aparece en la lista, solo la pública: ' + f.join(' | '));
await A.fill('.online-codigo input', codigo.toLowerCase());
await A.click('.online-codigo button');
await esperarTexto(A, '.online-cab', /Solo amigos/);
ok(/Solo amigos.*2\/8/.test(await cab(A)), 'Ana entra con el código y ve 2/8: ' + await cab(A));
await A.click('button:has-text("Salir de la sala")');
await esperar(1000);
await A.fill('.online-codigo input', 'ZZZZZZ');
await A.click('.online-codigo button');
ok(await esperarTexto(A, '.online-msg', /nadie|código/i, 15000), 'con un código que no existe avisa');

ok(errores.length === 0, 'sin errores en la consola' + (errores.length ? ': ' + errores[0] : ''));
await nav.close(); srv.close();
console.log(fallas ? `\n${fallas} pruebas fallaron` : '\nTodas las pruebas pasaron');
process.exit(fallas ? 1 : 0);
