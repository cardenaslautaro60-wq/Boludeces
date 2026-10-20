// Prueba de las salas del modo online sin navegador: tres "jugadores" en el mismo proceso, conectados
// por la sala de prueba (BroadcastChannel). Revisa crear, listar, entrar, código, sala llena, pedido
// de entrada (aceptar y rechazar), echar, cambio de anfitrión y que lo raro que llega se descarte.
//   node scripts/prueba-online.mjs
import { Online, MAX_SALA, idDeCodigo, codigoDe } from '../src/red/sala.js';
import { salaPestanas } from '../src/red/canal.js';
import { leerEstado as leer, textoChat } from '../src/red/estado.js';
const leerEstado = (j) => leer(j, { autos: { fitito: 1, falcon: 1 }, armas: 6 });

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
let fallas = 0;
const ok = (cond, msg) => { console.log((cond ? '  ok  ' : '  MAL ') + msg); if (!cond) fallas++; };
const prefijo = 'prueba-' + Date.now() + '-';
const nuevo = async (nombre, acceso = 'completo') => {
  const o = new Online({ acceso, canal: { tipo: 'bc', room: salaPestanas({ prefijo }) } });
  o.setNombre(nombre);
  await o.conectar();
  return o;
};

const ana = await nuevo('Ana'), beto = await nuevo('Beto'), caro = await nuevo('Caro');
console.log('Sala pública');
let r = await ana.crearSala('La del Pin', 'publica');
ok(r.ok && ana.esAnfitrion(), 'Ana crea una sala pública y es la anfitriona');
await esperar(300);
let lista = beto.salasAbiertas();
ok(lista.length === 1 && lista[0].nombre === 'La del Pin' && lista[0].tipo === 'publica', 'Beto la ve en la lista');
r = await beto.entrar(lista[0].id);
ok(r.ok && !beto.esAnfitrion(), 'Beto entra y no es anfitrión');
await esperar(300);
ok(ana.jugadores().length === 2 && beto.jugadores().length === 2, 'los dos se ven (2/8)');
ok(ana.salasAbiertas()[0].j === 2, 'el contador de la lista dice 2');

console.log('Echar');
ana.echar(beto.miPeer());
await esperar(500);
ok(!beto.sala, 'Beto quedó afuera al ser echado');
ok(ana.jugadores().length === 1, 'Ana ya no lo cuenta');
await ana.salir(true);
await esperar(300);
ok(beto.salasAbiertas().length === 0, 'al salir la anfitriona, la sala deja de aparecer');

console.log('Privada con código (amigos)');
r = await ana.crearSala('Amigos', 'amigos');
const codigo = codigoDe(r.sala.id);
ok(r.ok && /^[A-Z0-9]{6}$/.test(codigo), 'Ana crea una sala con código ' + codigo);
await esperar(300);
ok(caro.salasAbiertas().length === 0, 'no aparece en la lista');
r = await caro.entrar(idDeCodigo(codigo.toLowerCase() + ' '));
ok(r.ok && caro.sala.tipo === 'amigos', 'Caro entra con el código (aunque lo escriba en minúscula)');
r = await beto.entrar(idDeCodigo('ZZZZZZ'));
ok(!r.ok && /nadie/.test(r.error), 'con un código que no existe avisa que no hay nadie');
await caro.salir(true); await ana.salir(true);

console.log('Privada con pedido');
r = await ana.crearSala('Con pedido', 'pedido');
await esperar(300);
lista = beto.salasAbiertas();
ok(lista.length === 1 && lista[0].tipo === 'pedido', 'aparece en la lista como privada con pedido');
const pedido = beto.entrar(lista[0].id);
await esperar(3500);
ok(ana.pendientes().length === 1 && ana.pendientes()[0].nombre === 'Beto', 'a Ana le aparece el pedido de Beto');
ok(ana.jugadores().length === 1, 'mientras espera, Beto no cuenta como jugador');
ana.aceptar(ana.pendientes()[0].peer);
r = await pedido;
ok(r.ok && beto.sala && !beto.esperando, 'Ana lo acepta y Beto entra');
await esperar(300);
ok(ana.jugadores().length === 2, 'ahora son 2');
const pedido2 = caro.entrar(lista[0].id);
await esperar(3500);
ana.rechazar(ana.pendientes()[0].peer);
r = await pedido2;
ok(!r.ok && /no te aceptó/.test(r.error), 'a Caro la rechazan y le avisa');

console.log('Cambio de anfitrión');
await ana.salir(true);
await esperar(4500);
ok(beto.esAnfitrion(), 'si se va la anfitriona, Beto pasa a ser anfitrión');
await esperar(300);
ok(caro.salasAbiertas().some((s) => s.nombre === 'Con pedido'), 'y la sala sigue en la lista');
await beto.salir(true);

console.log('Sala llena');
const otros = [];
r = await ana.crearSala('Llena', 'publica');
for (let i = 0; i < MAX_SALA - 1; i++) { const o = await nuevo('J' + i); otros.push(o); const x = await o.entrar(r.sala.id); if (!x.ok) console.log('   ', x.error); }
await esperar(500);
ok(ana.jugadores().length === MAX_SALA, `entraron ${MAX_SALA}`);
r = await caro.entrar(ana.sala.id);
ok(!r.ok && /llena/.test(r.error), 'el noveno no entra: sala llena (' + (r.error || 'entró') + ')');

console.log('Datos raros');
ok(leerEstado({ s: [1, 2] }) === null, 'un estado incompleto se descarta');
const e = leerEstado({ s: [1, 2, 3, 0, 999, -999, 2, 99, 9, 1, 100, 0], a: ['tanque', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], g: [['x', 1e9, 3], 'basura', [5, 5, 5]] });
ok(e && e.vx === 80 && e.vz === -80 && e.arma === 5, 'velocidades y arma se acotan');
ok(e && !e.auto, 'un auto que no existe se ignora');
ok(e && e.golpes.length === 1, 'los golpes mal formados se descartan');
ok(textoChat('hola\u0000‮ mundo<script>'.repeat(10)).length <= 100 && !/[\u0000‮]/.test(textoChat('a\u0000‮b')), 'el chat saca caracteres de control y se corta en 100');

console.log('Acceso solo por código (lo que queda hasta que se decida)');
{
  const dani = await nuevo('Dani', 'codigo'), eli = await nuevo('Eli', 'codigo');
  const x = await dani.crearSala('Quiere ser pública', 'publica');
  ok(x.ok && x.sala.tipo === 'amigos', 'aunque pida pública o con pedido, la sala sale privada con código');
  await esperar(400);
  ok(eli.salasAbiertas().length === 0 && ana.salasAbiertas().every((s) => s.nombre !== 'Quiere ser pública'), 'no aparece en ninguna lista');
  const y = await eli.entrar('p-abcdefgh');
  ok(!y.ok, 'no se puede entrar a una sala pública ni con pedido por id');
  const z = await eli.entrar(idDeCodigo(codigoDe(x.sala.id)));
  ok(z.ok, 'con el código se entra');
  for (const o of [dani, eli]) { await o.salir(true); o.canal.room.cerrarTodo(); }
}

for (const o of [ana, beto, caro, ...otros]) { await o.salir(true); o.canal.room.cerrarTodo(); }
console.log(fallas ? `\n${fallas} pruebas fallaron` : '\nTodas las pruebas pasaron');
process.exit(fallas ? 1 : 0);
