// Prueba del modo online en el navegador: dos pestañas del juego compacto con la sala de prueba
// (?red=bc). Ana crea una sala, Beto entra, se ven, se disparan, chatean y se revisan los topes.
//   node scripts/build.mjs --solo=compacto && node scripts/prueba-online-navegador.mjs
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const archivo = path.resolve('dist/gta-san-jorge-compacto.html');
const srv = http.createServer((req, res) => { res.writeHead(200, { 'content-type': 'text/html' }); fs.createReadStream(archivo).pipe(res); });
await new Promise((r) => srv.listen(0, r));
const url = `http://127.0.0.1:${srv.address().port}/juego.html?red=bc`;
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
const traza = async (n) => { if (process.env.TRAZA) console.log('   [' + n + ']', JSON.stringify(await B.evaluate(() => { const g = window.__game, p = g.player; return { hp: Math.round(p.health), dead: !!p.dead, resp: !!g.respawning, x: Math.round(p.pos.x), z: Math.round(p.pos.z) }; }))); };
let fallas = 0;
const ok = (c, m) => { console.log((c ? '  ok  ' : '  MAL ') + m); if (!c) fallas++; };

const nav = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--autoplay-policy=no-user-gesture-required','--disable-renderer-backgrounding','--disable-background-timer-throttling','--disable-backgrounding-occluded-windows'] });
const ctx = await nav.newContext({ viewport: { width: 960, height: 540 } });
const errores = [];
const abrir = async (nombre) => {
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errores.push(nombre + ': ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error') errores.push(nombre + ' consola: ' + m.text()); });
  await p.goto(url);
  await p.waitForFunction(() => window.__game && window.__game.online && window.__game.online.canal, null, { timeout: 60000 });
  await p.evaluate((n) => {
    const g = window.__game;
    g.online.setNombre(n);
    g.menus.main.hidden = true; g.menus.attract = false; g.hud.show(true);
    g.started = true; g.paused = false;
    // el navegador de prueba dibuja por software (~1 cuadro por segundo): se apaga el dibujo para que
    // el juego corra a velocidad normal; la lógica, la red y el HUD siguen igual
    g._render = g.render; g.render = () => {};
  }, nombre);
  return p;
};
const A = await abrir('Ana');
const B = await abrir('Beto');
await B.evaluate(() => { const p = window.__game.player, h = p.hurt.bind(p); window.__recibido = 0; p.hurt = (d, ...r) => { if (!p.dead) window.__recibido += d; return h(d, ...r); }; });
ok(await A.evaluate(() => !document.querySelector('[data-a=online]').hidden), 'aparece el botón Jugar online');

const sala = await A.evaluate(async () => (await window.__game.online.crearSala('Prueba', 'publica')).sala.id);
await esperar(500);
const r = await B.evaluate(async (id) => window.__game.online.entrar(id), sala);
ok(r.ok, 'Beto entra a la sala de Ana');
// juntarlos cerca
await A.evaluate(() => { const p = window.__game.player; window.__pos = { x: p.pos.x, y: p.pos.y, z: p.pos.z }; });
const pos = await A.evaluate(() => window.__pos);
await B.evaluate((q) => { const p = window.__game.player; p.pos.set(q.x + 3, q.y, q.z); }, pos);
await A.waitForFunction(() => window.__game.red.remotos.size > 0, null, { timeout: 40000 }).catch(() => {});
await B.waitForFunction(() => window.__game.red.remotos.size > 0, null, { timeout: 40000 }).catch(() => {});
await esperar(1500);
const vistoA = await A.evaluate(() => { const r = [...window.__game.red.remotos.values()][0]; return r && { nombre: r.nombre, x: r.ped.pos.x, z: r.ped.pos.z, enPeds: window.__game.peds.includes(r.ped) }; });
ok(vistoA && vistoA.nombre === 'Beto', 'Ana ve a Beto en el juego');
const posB = await B.evaluate(() => { const p = window.__game.player.pos; return { x: p.x, z: p.z }; });
ok(vistoA && Math.abs(vistoA.x - posB.x) < 1.5 && Math.abs(vistoA.z - posB.z) < 1.5, `Beto aparece donde está (${vistoA && vistoA.x.toFixed(1)},${vistoA && vistoA.z.toFixed(1)} / ${posB.x.toFixed(1)},${posB.z.toFixed(1)})`);
ok(await A.evaluate(() => /1|2/.test(document.querySelector('.online-hud')?.textContent || '') && /2\/8/.test(document.querySelector('.online-hud').textContent)), 'el contador del HUD dice 2/8');

// daño con arma de Ana a Beto
const hpAntes = await B.evaluate(() => window.__game.player.health);
await A.evaluate(() => { const g = window.__game; const r = [...g.red.remotos.values()][0]; g.red.sumarGolpe(r.peer, 25, 'pistola'); });
await esperar(800);
const hpDesp = await B.evaluate(() => window.__game.player.health);
ok(hpDesp <= hpAntes - 24 && hpDesp >= hpAntes - 26, `un tiro de 25 le baja la vida a Beto (${hpAntes} → ${hpDesp})`);

await traza('// tope por segundo');
// tope por segundo: 5000 de golpe se cobran de a 300 por segundo como mucho
await B.evaluate(() => { const p = window.__game.player; p.health = 5000; p.armor = 0; });
await A.evaluate(() => { const g = window.__game; const r = [...g.red.remotos.values()][0]; g.red.sumarGolpe(r.peer, 5000, 'pistola'); });
await esperar(500);
const hpTope = await B.evaluate(() => window.__game.player.health);
ok(hpTope >= 5000 - 300 - 160, `5000 de daño de golpe no se cobran de una: se cobró ${5000 - hpTope}`);
await B.evaluate(() => { const p = window.__game.player; p.dead = false; p.health = 100; });
await esperar(1000);
await traza('// fuera de alcance');
// fuera de alcance: lejos, un golpe de puño no cuenta
await B.evaluate((q) => { const p = window.__game.player; p.dead = false; p.health = 100; p.pos.set(q.x + 60, q.y, q.z); }, pos);
await esperar(1200);
await A.evaluate(() => { const g = window.__game; const r = [...g.red.remotos.values()][0]; g.red.sumarGolpe(r.peer, 10, 'punos'); });
await esperar(800);
ok(await B.evaluate(() => window.__game.player.health) === 100, 'un golpe de puño a 60 m no cuenta');

await traza('// disparo real con el');
// disparo real con el arma del juego
await B.evaluate((q) => { const p = window.__game.player; p.health = 100; p.pos.set(q.x, q.y, q.z + 6); }, pos);
await esperar(1500);
await traza('const tiro = await A.e');
const tiro = await A.evaluate(async () => {
  const g = window.__game, p = g.player, r = [...g.red.remotos.values()][0];
  const dx = r.ped.pos.x - p.pos.x, dz = r.ped.pos.z - p.pos.z;
  p.heading = Math.atan2(dx, dz);
  const L = Math.hypot(dx, dz);
  p.give('pistola', 60); p.setWeapon('pistola'); p.aiming = true;
  if (p.mag) p.mag.pistola = 17;
  p.aimDir.set(dx / L, 0, dz / L);
  const antes = (g.red.mios.get(r.peer) || { cum: 0 }).cum;
  for (let i = 0; i < 3; i++) { p.attackCD = 0; p.reloadT = 0; p.aiming = true; p.aimDir.set(dx / L, 0, dz / L); p.attack(); await new Promise((s) => setTimeout(s, 400)); }
  return { antes, despues: (g.red.mios.get(r.peer) || { cum: 0 }).cum, disparos: g.red.disparos };
});
console.log('   ', JSON.stringify(tiro));
await esperar(800);
const hpTiro = await B.evaluate(() => window.__game.player.health);
const recibido = await B.evaluate(() => Math.round(window.__recibido || 0));
ok(typeof tiro === 'object' && tiro.despues > tiro.antes, 'disparar con la pistola del juego suma daño a Beto');
const infoB = recibido > 0 ? '' : ' ' + JSON.stringify(await B.evaluate(() => { const g = window.__game, p = g.player; const V = [...g.red.vistos.values()][0]; return { dead: p.dead, resp: g.respawning, inside: !!(g.interiors && g.interiors.inside), V, pos: [p.pos.x, p.pos.z] }; })) + JSON.stringify(await A.evaluate(() => { const g = window.__game; const r = [...g.red.remotos.values()][0]; return { mios: [...g.red.mios.values()], ped: [g.player.pos.x, g.player.pos.z], r: r && [r.ped.pos.x, r.ped.pos.z] }; }));
ok(recibido > 0, `y Beto recibe el daño (${recibido} de vida; si pasa de 100 muere y revive en el hospital)` + infoB);

// auto: Beto se sube a un auto y Ana lo ve
await B.evaluate(() => { const g = window.__game, p = g.player; p.dead = false; p.health = 100; g.respawning = false; });
await esperar(500);
const subio = await B.evaluate(() => { const g = window.__game, p = g.player; const v = g.vehicles.filter((v) => !v.remoto && !v.dead).sort((a, b) => a.pos.distanceTo(p.pos) - b.pos.distanceTo(p.pos))[0]; if (!v) return false; if (g.enterVehicle) g.enterVehicle(v); else { p.vehicle = v; v.driver = p; } return !!p.vehicle; });
await esperar(1500);
const autoA = await A.evaluate(() => { const r = [...window.__game.red.remotos.values()][0]; return !!(r && r.auto && window.__game.vehicles.includes(r.auto)); });
ok(subio, 'Beto se pudo subir a un auto');
const dbg = autoA ? '' : ' ' + JSON.stringify(await B.evaluate(() => { const p = window.__game.player; return { a: window.__game.red.estadoMio().a, dead: p.dead, veh: !!p.vehicle }; })) + JSON.stringify(await A.evaluate(() => { const r = [...window.__game.red.remotos.values()][0]; return r && { auto: !!r.auto, e: !!r.ultP }; }));
ok(autoA, 'cuando Beto maneja, Ana ve su auto' + dbg);

// chat
await B.evaluate(() => window.__game.red.decir('hola <b>che</b>'));
await A.waitForFunction(() => /hola/.test(document.querySelector('.online-log')?.innerHTML || ''), null, { timeout: 8000 }).catch(() => {});
const log = await A.evaluate(() => document.querySelector('.online-log')?.innerHTML || '');
ok(/hola &lt;b&gt;che&lt;\/b&gt;/.test(log), 'el chat llega y se muestra como texto, no como HTML' + (/hola/.test(log) ? '' : ' [' + log + '] ' + JSON.stringify(await A.evaluate(() => { const r = [...window.__game.red.remotos.values()][0]; return r && { k: r.chatK, n: r.nombre, s: window.__game.online.sala && 1 }; }))));

// panel
await A.evaluate(() => window.__game.onlineUI.abrir(window.__game.menus.pause));
await esperar(600);
const panel = await A.evaluate(() => document.querySelector('.online-screen')?.innerText || '');
ok(/Beto/.test(panel) && /2\/8|2 de 8/.test(panel), 'el panel muestra a Beto y el contador');
await A.evaluate(() => { window.__game.render = window.__game._render; });
await esperar(4000);
await A.screenshot({ path: process.env.CAPTURA || 'prueba-online.png' });

// Beto sale y desaparece
await B.evaluate(() => window.__game.online.salir(true));
await esperar(5000);
ok(await A.evaluate(() => window.__game.red.remotos.size === 0), 'cuando Beto sale, desaparece del juego de Ana');

const malos = errores.filter((e) => !/favicon|AudioContext|WebGL|GPU|autoplay/i.test(e));
ok(malos.length === 0, 'sin errores en la consola' + (malos.length ? ':\n      ' + malos.slice(0, 8).join('\n      ') : ''));
await nav.close(); srv.close();
console.log(fallas ? `\n${fallas} pruebas fallaron` : '\nTodas las pruebas pasaron');
process.exit(fallas ? 1 : 0);
