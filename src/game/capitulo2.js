// Capítulo 2: "El boom" (misiones 8 a 15). Sigue después del final de Tenpesos, en el mismo 2004.
// El Petroca se queda sin laburo, con el Pin arman el Remís San Jorge y aparece Mister Barril, un
// empresario de Rada Tilly (socio porteño de Don Crudo) que quiere poner pantallas de publicidad en
// las esquinas del Centro, empezando por el semáforo del Pin.
// Todos los personajes nuevos son parodias con nombre inventado (como Tenpesos o Don Crudo).
import * as THREE from 'three';
import { lam } from '../render/style.js';
import { POI, LANDMARKS } from '../world/mapdata.js';
import { Brain } from './ai.js';
import { DriverAI } from './traffic.js';
import { randomLook } from '../entities/humanoid.js';
import { BUS_LINES } from '../entities/vehicle.js';
import { signTexture } from '../render/textures.js';
import { dist, pick } from '../util.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

// Apariencias de los personajes nuevos
const LOOK = {
  barril: () => ({ ...randomLook('crudo'), hair: 0x16110c, glasses: false, fat: 0.2, height: 1.04, shirt: 0x1c2a44, shirtHex: '#1c2a44', pants: 0x1c2a44, mustache: false, beard: false, stubble: false, skin: 0xe8b890 }),
  chela: () => ({ ...randomLook('abuela'), shirt: 0x2f6a5a, shirtHex: '#2f6a5a', fat: 0.55, height: 0.92 }),
  jefeEscarcha: () => ({ ...randomLook('escarcha'), fat: 0.65, height: 1.05, beard: true }),
  jefePrimavera: () => ({ ...randomLook('primavera'), muscle: 0.6, height: 1.03, mustache: true }),
};

export function capitulo2(g, M, garage) {
  // ---------- lugares ----------
  // vereda al costado de la calle más cercana a (x, z)
  const vereda = (x, z, extra = 1.6) => {
    const n = g.roads.nearestEdge(x, z, 300, (e) => e.kind !== 'peatonal' && e.kind !== 'muelle') || g.roads.nearestEdge(x, z, 1500);
    if (!n) return { x, z, rot: 0 };
    const e = n.edge, A = g.roads.nodes[e.a];
    const side = (e.dx * (z - A.z) - e.dz * (x - A.x)) >= 0 ? 1 : -1;
    const nx = -e.dz * side, nz = e.dx * side;
    const off = e.width / 2 + extra;
    return { x: n.x + nx * off, z: n.z + nz * off, rot: Math.atan2(-nx, -nz), cx: n.x, cz: n.z, dx: e.dx, dz: e.dz, nx, nz, w: e.width };
  };
  // punto sobre el asfalto (para estacionar un auto) cerca de (x, z)
  const calle = (x, z, lane = 0.25) => {
    const n = g.roads.nearestEdge(x, z, 300, (e) => e.kind !== 'peatonal' && e.kind !== 'muelle') || g.roads.nearestEdge(x, z, 1500);
    if (!n) return { x, z, rot: 0 };
    const e = n.edge, A = g.roads.nodes[e.a];
    const side = (e.dx * (z - A.z) - e.dz * (x - A.x)) >= 0 ? 1 : -1;
    return { x: n.x - e.dz * side * e.width * lane, z: n.z + e.dx * side * e.width * lane, rot: Math.atan2(e.dx, e.dz) };
  };
  let agenciaCache = null;
  // la agencia vieja de Doña Chela, en el Km 3 (al lado del Museo del Petróleo)
  const agencia = () => {
    if (agenciaCache) return agenciaCache;
    const mu = M().museo || POI.museo || { x: -215, z: -1446 };
    agenciaCache = vereda(mu.x + 55, mu.z + 25);
    return agenciaCache;
  };
  const semaforo = () => { const S = POI.semaforo; const c = (S && (S.corner || S)) || M().casaAbuela; return { x: c.x, z: c.z }; };
  const yacimiento = () => POI.yacimiento || { x: -3272, z: -2444 };
  const turf = (k) => g.population.turfs.find((t) => t.kind === k);
  const lugar = (k, fb) => LANDMARKS[k] || POI[k] || fb;

  // recorrido real por las calles entre dos puntos: lista de puntos y largo total
  const recorrido = (ax, az, bx, bz) => {
    const R = g.roads;
    const ids = R.path(R.nearestNode(ax, az), R.nearestNode(bx, bz)) || [];
    const pts = ids.map((i) => ({ x: R.nodes[i].x, z: R.nodes[i].z }));
    let L = 0;
    const acc = [0];
    for (let i = 1; i < pts.length; i++) { L += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z); acc.push(L); }
    const at = (f) => {
      const d = f * L;
      for (let i = 1; i < pts.length; i++) {
        if (acc[i] >= d) {
          const t = (d - acc[i - 1]) / Math.max(1e-6, acc[i] - acc[i - 1]);
          return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t, z: pts[i - 1].z + (pts[i].z - pts[i - 1].z) * t, dx: (pts[i].x - pts[i - 1].x) / Math.max(1e-6, acc[i] - acc[i - 1]), dz: (pts[i].z - pts[i - 1].z) / Math.max(1e-6, acc[i] - acc[i - 1]) };
        }
      }
      return pts.length ? { ...pts[pts.length - 1], dx: 1, dz: 0 } : { x: bx, z: bz, dx: 1, dz: 0 };
    };
    return { pts, L, at };
  };

  // cámara de charla entre dos personajes
  const charla = (c, a, b, dur = 10, lado = 1) => {
    const mx = (a.pos.x + b.pos.x) / 2, mz = (a.pos.z + b.pos.z) / 2, y = Math.max(a.pos.y, b.pos.y);
    const dx = b.pos.x - a.pos.x, dz = b.pos.z - a.pos.z, L = Math.hypot(dx, dz) || 1;
    const px = -dz / L * lado, pz = dx / L * lado;
    c.cam(V3(mx + px * 5.5 - dx / L, y + 2, mz + pz * 5.5 - dz / L), V3(mx + px * 4.2, y + 1.8, mz + pz * 4.2), V3(mx, y + 1.5, mz), dur);
  };

  // falla si el objetivo queda lejos más de 'seg' segundos de juego seguidos
  const siSeAleja = (c, getA, getB, maxD, seg, reason) => {
    let desde = null;
    return c.failIf(() => {
      const a = getA(), b = getB();
      if (dist(a.x, a.z, b.x, b.z) > maxD) { if (desde === null) desde = c.t; return c.t - desde > seg; }
      desde = null;
      return false;
    }, reason);
  };

  // un personaje quieto (sin cerebro que lo mueva)
  const quieto = (c, ped) => { c.script(ped, () => {}); return ped; };

  // perseguir a pie al que se escapa hasta agarrarlo
  const agarrarAPie = async (c, G, ped, speed = 0.62) => {
    c.script(ped, () => { const dx = ped.pos.x - G.pos.x, dz = ped.pos.z - G.pos.z, d = Math.hypot(dx, dz) || 1; ped.moveX = dx / d; ped.moveZ = dz / d; ped.moveMag = 1; ped.gait = d < 15 ? 2 : 1; });
    ped.speedMul = speed;
    ped.blip = '#ff3030';
    await c.until(() => !G.vehicle && dist(ped.pos.x, ped.pos.z, G.pos.x, G.pos.z) < 2.2);
    c.script(ped, () => {});
    ped.knockdown(0, 0, 1);
    ped.blip = null;
  };

  // un auto enemigo que huye hacia un punto (con o sin tiradores)
  const autoQueHuye = (c, key, at, color, health = 1.5) => {
    const v = c.spawnVehicle(key, at.x, at.z, at.rot || 0, { color, exact: true });
    v.health = v.maxHealth * health;
    return v;
  };

  // pantalla de publicidad de Mister Barril (para la misión final)
  const pantalla = (x, z, rot) => {
    const grp = new THREE.Group();
    const y = g.world.footGround(x, z);
    const pole = lam({ color: 0x3a3d42 });
    for (const s of [-1.6, 1.6]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.25, 5.2, 0.25), pole);
      m.position.set(s, 2.6, 0);
      grp.add(m);
    }
    const marco = new THREE.Mesh(new THREE.BoxGeometry(4.6, 2.8, 0.35), lam({ color: 0x15171a }));
    marco.position.set(0, 6.2, 0);
    grp.add(marco);
    const tex = signTexture(['MISTER BARRIL', 'PUBLICIDAD · 24 HS'], { w: 512, h: 300, bg: '#0a1a3a', fg: '#ffd21a', borderColor: '#ffd21a' });
    for (const s of [1, -1]) {
      const sc = new THREE.Mesh(new THREE.PlaneGeometry(4.3, 2.5), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
      sc.position.set(0, 6.2, 0.18 * s);
      if (s < 0) sc.rotation.y = Math.PI;
      grp.add(sc);
    }
    grp.position.set(x, y, z);
    grp.rotation.y = rot;
    g.scene.add(grp);
    return grp;
  };


  return [
    // ------------------------------------------------------------------
    // 8. Despedido en Pampa del Castillo
    {
      id: 'despido', title: 'Despedido en Pampa del Castillo', giver: 'P', chapter: 2,
      hint: 'Al Petroca lo rajaron. Buscalo en el yacimiento de Pampa del Castillo, en pleno temporal y con un corte de ruta en el camino.',
      reward: 1500, respect: 6, needGordopin: true,
      start: semaforo,
      run: async (c, g) => {
        const G = g.player, P = g.petroca;
        const Y = yacimiento();
        // el Petroca no está con vos: está varado en el yacimiento
        if (!g.companionActive) g.setCompanionActive(true, Y.x + 6, Y.z + 10);
        c.place(P, Y.x + 6, Y.z + 10, 0);
        quieto(c, P);
        c.failIf(() => P.dead, '¡Mataron al Petroca!');
        g.env.time = 17 * 60;
        const s = semaforo();
        await c.cutscene(async () => {
          c.place(G, s.x, s.z, G.heading);
          c.cam(V3(s.x + 4, G.pos.y + 2.2, s.z + 4), V3(s.x + 3, G.pos.y + 1.9, s.z + 3), V3(s.x, G.pos.y + 1.5, s.z), 12);
          await c.say('', 'Comodoro, unos meses después. El juicio a Don Crudo salió en todos los diarios... y el barril sigue subiendo.', 5);
          await c.say('', 'En el semáforo de San Martín suena el celular del Pin.', 3);
          await c.say('Petroca', 'Gordo, estoy en la ruta 26, a la altura de Pampa del Castillo. Me rajaron, loco. Recorte de personal, dicen.');
          await c.say('Gordopin', '¿A vos? Si eras el que más laburaba.');
          await c.say('Petroca', 'El que más cobraba, gordo. Hay un corte de ruta y un temporal que no se ve nada. Vení a buscarme.');
        });
        g.env.forcedWeather = 'temporal';
        g.env.setWeather('temporal');
        // un auto para ir
        const k = calle(s.x + 20, s.z + 20);
        const auto = c.spawnVehicle('falcon', k.x, k.z, k.rot, { color: 0x5a5a5a, exact: true });
        auto.blip = '#40a0ff';
        c.objective('Subite al <b>Falcón</b>.');
        c.failIf(() => auto.dead && G.vehicle === auto, 'Se hizo bolsa el Falcón.');
        await c.until(() => !!G.vehicle);
        auto.blip = null;
        // el corte de ruta: en el camino, a dos tercios del recorrido
        const r = recorrido(G.pos.x, G.pos.z, Y.x, Y.z);
        const q = r.at(0.7);
        const grp = new THREE.Group();
        const goma = lam({ color: 0x1c1c1c });
        const nx = -q.dz, nz = q.dx;
        for (let i = -2; i <= 2; i++) {
          const x = q.x + nx * i * 2.2, z = q.z + nz * i * 2.2;
          const m = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.18, 6, 14), goma);
          m.rotation.x = Math.PI / 2;
          m.position.set(x, g.terrain.heightAt(x, z) + 0.2, z);
          grp.add(m);
        }
        g.scene.add(grp);
        c.cleanup.push(() => g.scene.remove(grp));
        const piq = [];
        for (let i = 0; i < 5; i++) {
          const a = (i - 2) * 2.4;
          const x = q.x + nx * a + q.dx * 2.5, z = q.z + nz * a + q.dz * 2.5;
          const p = c.spawnPed('petrolero', x, z, { exact: true, name: 'Manifestante' });
          quieto(c, p);
          p.heading = Math.atan2(-q.dx, -q.dz);
          piq.push(p);
        }
        const pb = c.blip(q.x, q.z, '#ff8a2a');
        c.failIf(() => piq.some((p) => p.dead), 'Lastimaste a un manifestante del corte.');
        let avisado = false;
        c.failIf(() => {
          const v = G.vehicle;
          const d = dist(G.pos.x, G.pos.z, q.x, q.z);
          if (!avisado && d < 140) { avisado = true; c.help('Hay un <b>corte de ruta</b> adelante. Pasá <b>despacio</b> por el costado: si vas rápido, no te dejan pasar.', 7); }
          return v && d < 13 && v.speed > 8;
        }, 'Pasaste el corte a lo loco y se armó lío.');
        c.help('Con el temporal, el viento empuja los autos hacia el <b>Este</b>. Contravolanteá.', 6);
        await c.goTo(Y.x + 6, Y.z + 4, { text: 'Andá a buscar al <b>Petroca</b> al yacimiento de <b>Pampa del Castillo</b>.', vehicle: true, radius: 9 });
        c.removeBlip(pb);
        c.fails = c.fails.filter((f) => f.reason !== 'Pasaste el corte a lo loco y se armó lío.');
        P.brain = new Brain(g, P, 'follow');
        c.objective('Esperá que suba el <b>Petroca</b>.');
        await c.until(() => G.vehicle && P.vehicle === G.vehicle);
        await c.say('Petroca', 'Me dieron una indemnización que no alcanza ni para el alquiler. Un monoambiente en el Centro sale como una casa en Buenos Aires.');
        await c.say('Gordopin', 'Bienvenido a la calle, Petroca. Acá abajo hace frío, pero se labura.');
        const gp = garage();
        await c.goTo(gp.x + 4, gp.z, { text: 'Volvé con el Petroca al <b>garage</b>, en Pietrobelli.', vehicle: true, radius: 5, slow: true });
        await c.say('Petroca', 'Gordo... ¿y si ponemos un remís? Tengo la plata justa. Me dijeron de una agencia vieja en el Km 3.', 4);
        g.env.forcedWeather = null;
        g.env.setWeather('ventoso');
      },
    },
    // ------------------------------------------------------------------
    // 9. Remís San Jorge
    {
      id: 'remisSJ', title: 'Remís San Jorge', giver: 'P', chapter: 2,
      hint: 'Comprale la agencia a Doña Chela en el Km 3 y hacé cinco viajes con clientes apurados.',
      reward: 2000, respect: 7, needPetroca: true, needGordopin: true,
      start: agencia,
      run: async (c, g) => {
        const G = g.player, P = g.companion;
        const A = agencia();
        const chela = quieto(c, c.spawnPed('abuela', A.x + A.dx * 2.5, A.z + A.dz * 2.5, { look: LOOK.chela(), name: 'Doña Chela', exact: true }));
        await c.cutscene(async () => {
          c.place(P, A.x - A.dx * 1.5, A.z - A.dz * 1.5, 0);
          c.face(chela, G); c.face(G, chela); c.face(P, chela);
          charla(c, G, chela, 14);
          await c.say('Doña Chela', 'Tres autos, la radio y la licencia. Con la plata de la indemnización te alcanza justo.');
          await c.say('Petroca', 'Remís San Jorge. Suena a empresa seria, ¿no?');
          await c.say('Gordopin', 'Suena a que yo voy a manejar y vos vas a hablar por la radio.');
          await c.say('Petroca', 'Exacto. Buena petroca. Yo me quedo acá con la radio; vos salí a buscar clientes.');
        });
        // el Petroca atiende la radio en la agencia
        c.place(P, A.x - A.dx * 1.5, A.z - A.dz * 1.5, A.rot);
        quieto(c, P);
        const k = calle(A.x, A.z);
        const auto = c.spawnVehicle('remis', k.x, k.z, k.rot, { exact: true });
        auto.persistent = true;
        auto.blip = '#40a0ff';
        c.objective('Subite al <b>remís</b>.');
        c.failIf(() => auto.dead, 'Se hizo bolsa el remís de la agencia.');
        await c.until(() => G.vehicle === auto);
        auto.blip = null;
        const T = M().terminal, H = M().hospital, MA = M().madriguera, CA = lugar('catedral', T), CH = POI.chori || T;
        const viajes = [
          { who: 'Petrolero apurado', kind: 'petrolero', n: 1, dest: T, nombre: 'la Terminal', linea: 'A la Terminal, maestro. Si pierdo el micro a Caleta me descuentan el día.' },
          { who: 'Señora con bolsos', kind: 'abuela', n: 1, dest: H, nombre: 'el Hospital Regional', linea: 'Al Hospital, querido. Y despacito, que llevo los huevos.' },
          { who: 'Hincha del Lobo', kind: 'lobo', n: 2, dest: MA, nombre: 'La Madriguera', linea: '¡A La Madriguera! Hoy entrena el Lobo y no nos lo perdemos.' },
          { who: 'Estudiante', kind: 'civil', n: 1, dest: CA, nombre: 'la Catedral', linea: 'A la Catedral, por favor. Tengo un casamiento y estoy re tarde.' },
          { who: 'Turista porteño', kind: 'civil', n: 1, dest: CH, nombre: 'el Chori del Viento', linea: '¿Me llevás a comer el famoso choripán? Me dijeron que es en la Costanera.' },
        ];
        let hechos = 0;
        const cnt = () => g.hud.setCounter('remisSJ', 'VIAJES', `${hechos}/5`);
        cnt();
        c.cleanup.push(() => g.hud.removeCounter('remisSJ'));
        for (const v of viajes) {
          const sw = g.city.randomSidewalk(auto.pos.x, auto.pos.z, 70, 220) || vereda(auto.pos.x + 80, auto.pos.z + 40);
          const pax = [];
          for (let i = 0; i < v.n; i++) {
            const p = c.spawnPed(v.kind, sw.x + i * 1.2, sw.z, { name: v.who });
            p.brain = new Brain(g, p, 'idle');
            p.wave = true;
            pax.push(p);
          }
          pax[0].blip = '#20c0ff'; pax[0].blipEdge = true;
          c.objective(`Buscá al cliente: <b>${v.who.toLowerCase()}</b> (marcado en el radar).`);
          const pf = c.failIf(() => pax.some((p) => p.dead), 'Le hiciste daño a un cliente.');
          await c.until(() => {
            if (G.vehicle !== auto) return false;
            return dist(auto.pos.x, auto.pos.z, pax[0].pos.x, pax[0].pos.z) < 8 && auto.speed < 2;
          });
          for (const p of pax) {
            const seat = auto.seats.findIndex((s, i) => i > 0 && !s);
            p.wave = false; p.blip = null;
            if (seat >= 0) p.enterVehicle(auto, seat);
          }
          c.removeFail(pf);
          g.hud.subtitle(`<span class="who">${v.who}:</span> ${v.linea}`, 5);
          // si chocás fuerte, el cliente se queja y paga menos
          let hp = auto.health, quejas = 0;
          const qf = c.failIf(() => {
            if (auto.health < hp - 40) { quejas++; g.hud.subtitle(`<span class="who">${v.who}:</span> ${pick(['¡Epa! ¿Quién te dio el registro?', '¡Despacio, que no es el Dakar!', '¡Me vas a matar, flaco!'])}`, 3); }
            hp = auto.health;
            return false;
          }, '');
          const tm = c.timerTo(v.dest.x, v.dest.z, 'VIAJE', 12, 50);
          const d = calle(v.dest.x, v.dest.z, 0.25);
          await c.goTo(d.x, d.z, { text: `Llevá al cliente a <b>${v.nombre}</b>.`, vehicle: auto, radius: 5, slow: true });
          tm.stop();
          c.removeFail(qf);
          for (const p of pax) { if (p.vehicle) p.exitVehicle(); p.persistent = false; p.spawned = true; p.brain = new Brain(g, p, 'wander'); }
          const pago = Math.max(20, 120 - quejas * 35);
          g.addMoney(pago);
          hechos++;
          cnt();
          g.hud.showToast(quejas ? `Viaje hecho, pero el cliente se quejó. +$${pago}` : `¡Viaje hecho! Con propina. +$${pago}`, 2.5);
          g.stats.fares = (g.stats.fares || 0) + 1;
        }
        g.hud.removeCounter('remisSJ');
        await c.goTo(k.x, k.z, { text: 'Volvé a la <b>agencia</b> en el Km 3.', vehicle: auto, radius: 6, slow: true });
        const pul = quieto(c, c.spawnPed('cana', A.x + A.dx * 5, A.z + A.dz * 5, { name: 'Pulenta', look: { ...randomLook('cana'), shirt: 0x6a6a6a, shirtHex: '#6a6a6a', shirtKind: 'campera', hat: null, hairStyle: 'short' } }));
        await c.cutscene(async () => {
          auto.ctrl.brake = 1;
          G.exitVehicle();
          c.place(G, A.x, A.z, 0);
          c.face(pul, G); c.face(G, pul); c.face(P, pul);
          charla(c, G, pul, 14, -1);
          await c.say('Pulenta', 'Lindo negocito. Mi jefe nuevo dice que en esta ciudad los remises van a ser todos de él.');
          await c.say('Gordopin', '¿Y quién es tu jefe ahora, Pulenta? ¿Otro comisario?');
          await c.say('Pulenta', 'Uno con más plata que todos ustedes juntos.');
        });
        g.removePed(pul); g.removePed(chela);
        P.brain = new Brain(g, P, 'follow');
        auto.persistent = true; auto.playerOwned = true;
      },
    },
    // ------------------------------------------------------------------
    // 10. La línea 9
    {
      id: 'linea9', title: 'La línea 9', giver: 'C', chapter: 2,
      hint: 'Cubrí al chofer de un colectivo: del Km 3 a la Terminal, parando en cada parada y sin pasarte de horario.',
      reward: 1800, respect: 6, needPetroca: true, needGordopin: true,
      start: agencia,
      run: async (c, g) => {
        const G = g.player, P = g.companion;
        const A = agencia();
        const chela = quieto(c, c.spawnPed('abuela', A.x + A.dx * 2.5, A.z + A.dz * 2.5, { look: LOOK.chela(), name: 'Doña Chela', exact: true }));
        await c.cutscene(async () => {
          c.place(P, A.x - A.dx * 1.5, A.z - A.dz * 1.5, 0);
          c.face(chela, G); c.face(G, chela);
          charla(c, G, chela, 12);
          await c.say('Doña Chela', 'El chofer de la 9 no vino. Si alguien la cubre, la empresa paga la changa.');
          await c.say('Doña Chela', 'Es un recorrido, gordo. Paradas, horario y nada de pasarte de largo.');
          await c.say('Gordopin', 'Yo hago malabares con tres clavas en un semáforo. Un colectivo es más fácil.');
        });
        g.removePed(chela);
        const k = calle(A.x, A.z);
        const bus = c.spawnVehicle('colectivo', k.x, k.z, k.rot, { exact: true, line: BUS_LINES[0] });
        bus.blip = '#40a0ff';
        c.objective('Subite al <b>colectivo</b>.');
        c.failIf(() => bus.dead, 'Se prendió fuego el colectivo.');
        await c.until(() => G.vehicle === bus);
        bus.blip = null;
        const T = M().terminal;
        const r = recorrido(bus.pos.x, bus.pos.z, T.x, T.z);
        const total = Math.max(150, Math.round((r.L / 11 + 50) / 10) * 10);
        c.timer(total, 'HORARIO');
        c.help('Pará en cada <b>parada</b> (el círculo amarillo) hasta que suba la gente. Frená bien: el colectivo pesa nueve toneladas.', 7);
        // la camioneta de los Escarcha cruzada en la calle, antes de la tercera parada
        const bq = r.at(0.5);
        const camio = c.spawnVehicle('f100', bq.x, bq.z, Math.atan2(-bq.dz, bq.dx), { color: 0x9ad0f0, exact: true });
        const esc = [0, 1].map((i) => {
          const p = c.spawnPed('escarcha', bq.x - bq.dz * (4 + i * 2), bq.z + bq.dx * (4 + i * 2), {});
          p.give('bate'); p.setWeapon('bate');
          p.brain = new Brain(g, p, 'guard', { hostile: true, home: { x: p.pos.x, z: p.pos.z } });
          p.brain.aggroRange = 9; p.brain.aggroDelay = 1;
          return p;
        });
        let avisoEsc = false;
        const paradas = [0.2, 0.4, 0.6, 0.8, 1].map((f) => r.at(f));
        let gente = 0;
        for (let i = 0; i < paradas.length; i++) {
          const s = i === paradas.length - 1 ? calle(T.x, T.z, 0.25) : calle(paradas[i].x, paradas[i].z, 0.25);
          const sw = vereda(s.x, s.z, 1.4);
          const esperan = [];
          for (let j = 0; j < 3; j++) {
            const p = c.spawnPed('civil', sw.x + j * 0.9, sw.z, {});
            p.brain = new Brain(g, p, 'idle');
            esperan.push(p);
          }
          c.cleanup.push(() => { for (const p of esperan) if (!p.removed) g.removePed(p); });
          let desde = null;
          await c.goTo(s.x, s.z, {
            text: i === paradas.length - 1 ? 'Última parada: la <b>Terminal</b>.' : `Pará en la <b>parada ${i + 1}</b>.`,
            vehicle: bus, radius: 6,
            check: () => {
              if (!avisoEsc && dist(bus.pos.x, bus.pos.z, bq.x, bq.z) < 90) { avisoEsc = true; g.hud.showToast('¡Los Escarcha te cruzaron una camioneta!', 2.5); c.help('Esquivala o empujala con el colectivo.', 4); }
              if (bus.speed >= 1.5) { desde = null; return false; }
              if (desde === null) desde = c.t;
              return c.t - desde > 1.2;
            },
          });
          const sube = esperan.length;
          gente += sube;
          for (const p of esperan) g.removePed(p);
          g.audio.pickup && g.audio.pickup();
          g.hud.showToast(i === paradas.length - 1 ? `Terminal. Bajaron todos (${gente} pasajeros en el viaje).` : `Subieron ${sube} pasajeros.`, 2);
        }
        void esc; void camio;
        await c.say('Petroca', 'Esa camioneta no estaba ahí de casualidad. Alguien les paga a los Escarcha para que nos arruinen el día.', 4);
      },
    },
    // ------------------------------------------------------------------
    // 11. Noche en el Draw
    {
      id: 'drawEscarcha', title: 'Noche en el Draw', giver: 'P', chapter: 2,
      hint: 'El jefe de los Escarcha juega al pool en el Draw. Ganale una partida y que cante quién les paga.',
      reward: 2500, respect: 8, needPetroca: true, needGordopin: true,
      start: () => { const I = g.interiors; if (I && I.door) return { x: I.door.x - I.inward.x * 3 + I.inward.z * 6, z: I.door.z - I.inward.z * 3 - I.inward.x * 6 }; return semaforo(); },
      run: async (c, g) => {
        const G = g.player, P = g.companion;
        const I = g.interiors;
        c.allowShops = true;
        g.env.time = Math.max(g.env.time % 1440, 21 * 60);
        await c.cutscene(async () => {
          const d = I.door;
          c.place(P, G.pos.x + 1.2, G.pos.z + 0.8, 0);
          c.face(P, G); c.face(G, P);
          c.cam(V3(G.pos.x + 4, G.pos.y + 2, G.pos.z + 3), V3(G.pos.x + 3.2, G.pos.y + 1.8, G.pos.z + 2.4), V3(d.x, d.y + 2, d.z), 12);
          await c.say('Petroca', 'El jefe de los Escarcha juega al pool acá todos los jueves. Si le ganás, nos dice quién les paga.');
          await c.say('Gordopin', '¿Y si pierdo?');
          await c.say('Petroca', 'Si perdés, salimos corriendo. Buena petroca.');
        });
        c.objective('Entrá al <b>Draw</b>: pisá el aro rojo de la puerta.');
        await c.until(() => I.inside && !I.busy);
        await c.wait(0.8);
        await c.say('Jefe de los Escarcha', '¿El malabarista? ¿Viniste a perder plata o a hacer preguntas?', 3.5);
        await c.say('Gordopin', 'Las dos cosas. Si te gano, me decís quién les paga.', 3);
        await c.say('Jefe de los Escarcha', 'Trato hecho. Rompés vos.', 2.5);
        // partida en una mesa libre
        let T = I.tables.find((t) => !t.match && !t.players.length) || I.tables.find((t) => !t.match);
        if (T && T.players.length) T.players.length = 0;
        if (!T) { c.objective('No hay mesa libre: volvé a intentarlo.'); throw new Error('sin mesa'); }
        await I.startPool(T, 'el Jefe de los Escarcha', 0);
        const MT = I.match;
        if (MT) MT.skill = 0.55;
        c.objective('Ganale al <b>Jefe de los Escarcha</b> al pool (bola 8).', 5);
        await c.until(() => !I.match);
        if (!MT || MT.result !== 0) {
          await c.say('Jefe de los Escarcha', 'Andá a practicar a la Rada, gordo. No te digo nada.', 3);
          c.fails.push({ fn: () => true, reason: 'Perdiste la partida y el jefe de los Escarcha no habló.' });
          await c.wait(0.1);
        }
        await c.say('Jefe de los Escarcha', 'Está bien, está bien. Un trato es un trato.', 3);
        await c.say('Jefe de los Escarcha', 'Un tipo de Rada Tilly. Le dicen Mister Barril. Quiere las esquinas del Centro para poner pantallas.', 5);
        await c.say('Jefe de los Escarcha', 'Y la primera es la tuya, gordo.', 3);
        await c.say('Gordopin', 'Mi semáforo no se vende.', 2.5);
        c.objective('Salí del <b>Draw</b> por el aro rojo de la escalera.');
        await c.until(() => !I.inside && !I.busy);
      },
    },
    // ------------------------------------------------------------------
    // 12. En vivo desde el Chenque
    {
      id: 'chenque', title: 'En vivo desde el Chenque', giver: 'P', chapter: 2,
      hint: 'Mister Barril presenta sus pantallas arriba del Cerro Chenque. Arruinale la conferencia y escapá con el móvil de ADNSUR filmando.',
      reward: 3000, respect: 9, needPetroca: true, needGordopin: true,
      start: garage,
      run: async (c, g) => {
        const G = g.player, P = g.companion;
        const gp = garage();
        await c.cutscene(async () => {
          c.cam(V3(gp.x + 10, G.pos.y + 2.5, gp.z - 4), V3(gp.x + 9, G.pos.y + 2.2, gp.z - 3), V3(gp.x + 3, G.pos.y + 1.3, gp.z), 8);
          await c.say('Petroca', 'Gordo, Mister Barril da una conferencia arriba del Chenque. Va a estar la prensa y todo.');
          await c.say('Gordopin', 'Entonces vamos a saludarlo.');
        });
        const k = calle(gp.x + 12, gp.z);
        const chata = c.spawnVehicle('jilux', k.x, k.z, k.rot, { color: 0xb01818, exact: true });
        chata.blip = '#40a0ff';
        const top = POI.antenas || lugar('chenque', { x: -172, z: -369 });
        const near = g.roads.nearestEdge(top.x, top.z, 400, (e) => e.kind !== 'peatonal') || g.roads.nearestEdge(top.x, top.z, 1500);
        const cx = near ? near.x : top.x, cz = near ? near.z : top.z;
        const e = near ? near.edge : { dx: 1, dz: 0, width: 8 };
        const ox = -e.dz, oz = e.dx;
        // la conferencia, a un costado del camino
        const sx = cx + ox * (e.width / 2 + 3), sz = cz + oz * (e.width / 2 + 3);
        await c.goTo(cx - e.dx * 25, cz - e.dz * 25, { text: 'Andá a la conferencia de <b>Mister Barril</b>, arriba del <b>Cerro Chenque</b>.', radius: 9 });
        chata.blip = null;
        const barril = quieto(c, c.spawnPed('crudo', sx, sz, { look: LOOK.barril(), name: 'Mister Barril', exact: true }));
        const guardias = [-1, 1].map((s) => {
          const p = c.spawnPed('cheto', sx + e.dx * 2.5 * s, sz + e.dz * 2.5 * s, { name: 'Guardia de Barril', exact: true, look: { ...randomLook('cheto'), shirt: 0x111111, shirtHex: '#111111', shirtKind: 'traje', glasses: true } });
          p.give('pistola', 80); p.setWeapon('pistola');
          quieto(c, p);
          return p;
        });
        const mv = calle(cx + e.dx * 14, cz + e.dz * 14);
        const movil = c.spawnVehicle('movil', mv.x, mv.z, mv.rot, { exact: true });
        const cro = quieto(c, c.spawnPed('civil', sx - ox * 5, sz - oz * 5, { look: g.prensa.look('cronista'), name: 'Cronista de ADNSUR', exact: true }));
        const cam = quieto(c, c.spawnPed('civil', sx - ox * 6 + e.dx * 1.5, sz - oz * 6 + e.dz * 1.5, { look: g.prensa.look('camara'), name: 'Camarógrafo de ADNSUR', exact: true }));
        for (const p of [cro, cam]) p.press = true;
        await c.goTo(sx - ox * 4 + e.dx * 3, sz - oz * 4 + e.dz * 3, { text: 'Acercate a <b>Mister Barril</b>.', radius: 2.2, onFoot: true });
        await c.cutscene(async () => {
          c.face(barril, G); c.face(G, barril); c.face(cro, barril); c.face(cam, barril);
          charla(c, G, barril, 16);
          await c.say('Mister Barril', 'Comodoro merece una ciudad moderna. Pantallas, luces, inversión. Basta de gente pidiendo monedas en las esquinas.');
          await c.say('Gordopin', 'Yo no pido monedas. Yo trabajo.');
          await c.say('Mister Barril', 'Usted es un obstáculo con clavas, señor.');
          await c.say('', 'El Pin saca un choripán del bolsillo...', 2.5);
          await c.say('Cronista de ADNSUR', '¡Insólito! ¡Le tiraron un choripán en vivo!', 2.5);
          await c.say('Mister Barril', '¡Agárrenlo!', 1.8);
        });
        for (const p of guardias) { p.brain = new Brain(g, p, 'attack', { hostile: true }); p.brain.target = G; p.blip = '#ff3030'; }
        g.removePed(barril);
        g.police.setLevel(3);
        // el móvil de ADNSUR te sigue filmando
        cro.enterVehicle(movil, 1); cam.enterVehicle(movil, 0);
        movil.ai = new DriverAI(g, movil, 'chase', { target: G, speedMul: 0.95 });
        movil.ai.ram = false;
        g.traffic.cars.push(movil);
        movil.blip = '#e02020';
        c.noWanted = false;
        const CH = POI.chori || M().terminal;
        siSeAleja(c, () => movil.pos, () => G.pos, 260, 12, 'Perdiste al móvil de ADNSUR: la nota no salió.');
        c.failIf(() => movil.dead, '¡Le hiciste bolsa el móvil a la prensa!');
        c.help('Escapá de la cana y de los guardias. El <b>móvil de ADNSUR</b> te sigue: no lo pierdas, que tiene que salir la nota.', 7);
        await c.goTo(CH.x, CH.z, { text: 'Bajá del Chenque hasta la <b>Costanera</b> (Chori del Viento) con el móvil atrás.', radius: 14 });
        g.police.clear();
        const nota = 'Insólito: un malabarista arruinó la conferencia del empresario Mister Barril en el Chenque. En las redes ya lo llaman el héroe del semáforo';
        if (g.prensa) { g.prensa.news.unshift(nota); g.prensa.unread.push(nota); }
        await c.say('Cronista de ADNSUR', 'Insólito: un malabarista arruinó la conferencia del empresario Mister Barril. La gente en las redes ya lo llama "el héroe del semáforo".', 5);
        await c.say('Petroca', 'Gordo, sos famoso. Eso no nos sirve para pagar el alquiler, pero está bueno.', 4);
        movil.ai = null; movil.blip = null;
        void P;
      },
    },
    // ------------------------------------------------------------------
    // 13. El primer robo
    {
      id: 'robo', title: 'El primer robo', giver: 'P', chapter: 2,
      hint: 'Barril le sacó los autos a Doña Chela. Asaltá la oficina de cobranzas de Crudo S.A. en el Centro y escapá de la cana.',
      reward: 0, respect: 10, needGordopin: true,
      start: garage,
      run: async (c, g) => {
        const G = g.player, P = g.companion;
        const gp = garage();
        await c.cutscene(async () => {
          c.cam(V3(gp.x + 10, G.pos.y + 2.5, gp.z - 4), V3(gp.x + 9, G.pos.y + 2.2, gp.z - 3), V3(gp.x + 3, G.pos.y + 1.3, gp.z), 10);
          await c.say('', 'Barril le hizo firmar a Doña Chela un papel con una deuda trucha y se quedó con dos autos de la agencia.', 4.5);
          await c.say('Petroca', 'Barril guarda la plata de las pantallas en la oficina de cobranzas de Crudo S.A., en el Centro. Si se la sacamos, recuperamos los autos.');
          await c.say('Gordopin', 'Esto ya no es malabares, Petroca.');
          await c.say('Petroca', 'No, esto es justicia con pasamontañas. Tomá, por las dudas. Yo te espero en la agencia con Chela.');
        });
        // el Petroca no entra al robo: espera en la agencia
        const conPetroca = g.companionActive;
        if (conPetroca) g.setCompanionActive(false);
        c.cleanup.push(() => { if (conPetroca && !g.companionActive) g.setCompanionActive(true, G.pos.x + 2, G.pos.z + 2); });
        if (!G.owned.includes('pistola')) G.give('pistola', 40); else G.ammo.pistola = Math.max(G.ammo.pistola || 0, 40);
        G.setWeapon('pistola');
        G.armor = Math.max(G.armor || 0, 50);
        g.hud.showToast('El Petroca te dio un chaleco.', 2);
        const O = M().torreCrudo || M().terminal;
        const of = vereda(O.x, O.z, 1.4);
        const cajero = quieto(c, c.spawnPed('civil', of.x, of.z, { name: 'Cajero de Crudo S.A.', exact: true, look: { ...randomLook('civil'), shirt: 0xe8e8e8, shirtHex: '#e8e8e8', glasses: true } }));
        cajero.heading = of.rot;
        const guardia = c.spawnPed('caleta', of.x + of.dx * 4, of.z + of.dz * 4, { name: 'Seguridad', exact: true });
        guardia.give('pistola', 60); guardia.setWeapon('pistola');
        quieto(c, guardia);
        await c.goTo(of.x + of.nx * -3, of.z + of.nz * -3, { text: 'Andá a la <b>oficina de cobranzas de Crudo S.A.</b>, en el Centro.', radius: 4, onFoot: true });
        cajero.blip = '#40a0ff';
        c.objective(`Apuntale al <b>cajero</b> (${g.key('aim')}) para que llene el bolso.`);
        c.failIf(() => cajero.dead, 'Mataste al cajero: no hay plata y hay muchos problemas.');
        await c.until(() => G.aiming && G.weapon !== 'punos' && dist(G.pos.x, G.pos.z, cajero.pos.x, cajero.pos.z) < 9);
        guardia.brain = new Brain(g, guardia, 'attack', { hostile: true }); guardia.brain.target = G; guardia.blip = '#ff3030';
        g.police.setLevel(2);
        g.hud.showToast('¡Sonó la alarma!', 2);
        c.help('Quedate cerca del cajero: <b>cuanto más tiempo, más plata</b> y más cana. Alejate cuando quieras irte (mínimo 15 segundos).', 7);
        let t = 0, prev = c.t;
        const plata = () => Math.round(3000 + 3000 * Math.min(1, t / 40));
        await c.until(() => {
          const d = dist(G.pos.x, G.pos.z, cajero.pos.x, cajero.pos.z);
          if (d < 12) t += c.t - prev;
          prev = c.t;
          g.hud.setCounter('bolso', 'BOLSO', `$${plata().toLocaleString('es-AR')}`);
          if (t > 20 && g.police.level < 3) { g.police.setLevel(3); g.hud.showToast('¡Más patrulleros!', 1.5); }
          if (t >= 40) return true;
          if (d > 14 && t < 15) { t = 0; return false; }
          return d > 14 && t >= 15;
        });
        c.cleanup.push(() => g.hud.removeCounter('bolso'));
        const botin = plata();
        cajero.blip = null;
        g.hud.showToast(`¡Tenés el bolso! $${botin.toLocaleString('es-AR')}`, 2.5);
        c.objective('¡Perdé a la <b>cana</b>!');
        await c.until(() => g.police.level === 0);
        g.hud.removeCounter('bolso');
        g.addMoney(botin);
        const A = agencia();
        await c.goTo(A.x, A.z, { text: 'Llevale la plata a <b>Doña Chela</b>, en el Km 3.', radius: 4 });
        const chela = quieto(c, c.spawnPed('abuela', A.x + A.dx * 2.5, A.z + A.dz * 2.5, { look: LOOK.chela(), name: 'Doña Chela', exact: true }));
        if (conPetroca) { g.setCompanionActive(true, A.x - A.dx * 1.5, A.z - A.dz * 1.5); quieto(c, P); }
        await c.cutscene(async () => {
          if (G.vehicle) G.exitVehicle();
          c.face(chela, G); c.face(G, chela);
          if (conPetroca) c.face(P, G);
          charla(c, G, chela, 10);
          await c.say('Doña Chela', 'Con esto pago la deuda trucha y me devuelven los autos. Y sobra para el alquiler del Petroca.');
          await c.say('Petroca', 'Buena petroca. Ahora sí, Remís San Jorge tiene flota.');
        });
        g.removePed(chela);
        if (conPetroca) P.brain = new Brain(g, P, 'follow');
      },
    },
    // ------------------------------------------------------------------
    // 14. Los Primavera
    {
      id: 'primavera', title: 'Los Primavera', giver: 'C', chapter: 2,
      hint: 'Los Escarcha vienen con plata de Barril a quedarse con el barrio de los Primavera. Ayudalos a defenderlo.',
      reward: 4000, respect: 10, needPetroca: true, needGordopin: true,
      start: agencia,
      run: async (c, g) => {
        const G = g.player, P = g.companion;
        const A = agencia();
        const chela = quieto(c, c.spawnPed('abuela', A.x + A.dx * 2.5, A.z + A.dz * 2.5, { look: LOOK.chela(), name: 'Doña Chela', exact: true }));
        await c.cutscene(async () => {
          c.face(chela, G); c.face(G, chela);
          charla(c, G, chela, 8);
          await c.say('Doña Chela', 'Llamaron los Primavera, del Laprida. Dicen que los Escarcha van para allá con plata de Barril.');
          await c.say('Gordopin', 'Vamos. El barrio no se vende.');
        });
        g.removePed(chela);
        // en el barrio de los Primavera nadie te ataca mientras dure la misión
        const tp = turf('primavera');
        const te = turf('escarcha');
        if (tp) { const prev = tp.hostile; tp.hostile = false; c.cleanup.push(() => { tp.hostile = prev; }); }
        for (const q of g.peds) if (q.kind === 'primavera' && q.brain) { q.brain.hostile = false; if (q.brain.mode === 'attack') q.brain.setMode('wander'); }
        const L = tp ? { x: tp.x, z: tp.z } : { x: -2572, z: -1909 };
        const k = calle(A.x + 10, A.z);
        const chata = c.spawnVehicle('jilux', k.x, k.z, k.rot, { color: 0xb01818, exact: true });
        chata.blip = '#40a0ff';
        const ll = vereda(L.x, L.z, 1.5);
        await c.goTo(ll.x, ll.z, { text: 'Andá al barrio <b>Laprida</b>, donde paran los Primavera.', radius: 8 });
        chata.blip = null;
        if (G.vehicle) G.exitVehicle();
        const jefe = quieto(c, c.spawnPed('primavera', ll.x + ll.dx * 2, ll.z + ll.dz * 2, { look: LOOK.jefePrimavera(), name: 'Jefe de los Primavera' }));
        await c.cutscene(async () => {
          c.face(jefe, G); c.face(G, jefe);
          charla(c, G, jefe, 12);
          await c.say('Jefe de los Primavera', 'Gordo, vos sos del barrio. Los Escarcha vienen con plata de Barril. Los Primavera no se achican, pero solos no llegamos.');
          await c.say('Gordopin', 'El barrio no se vende.');
        });
        // aliados
        const aliados = [jefe];
        for (let i = 0; i < 2; i++) aliados.push(c.spawnPed('primavera', ll.x + i * 1.5, ll.z + 1.5, { name: 'Primavera' }));
        for (const q of aliados) { q.give('pistola', 200); q.setWeapon('pistola'); q.isFriend = true; q.brain = new Brain(g, q, 'follow'); }
        if (!G.owned.includes('pistola')) G.give('pistola', 60);
        G.ammo.pistola = Math.max(G.ammo.pistola || 0, 60);
        // tres oleadas de los Escarcha
        for (let w = 0; w < 3; w++) {
          g.hud.showToast(w === 0 ? '¡Llegan los Escarcha!' : `¡Otra oleada! (${w + 1} de 3)`, 2);
          const ola = [];
          for (let i = 0; i < 3 + w; i++) {
            const a = (w * 2.1) + i * 0.7;
            const x = ll.x + Math.cos(a) * 45, z = ll.z + Math.sin(a) * 45;
            const q = c.spawnPed('escarcha', x, z, {});
            const wpn = i % 2 ? 'bate' : 'pistola';
            q.give(wpn, 80); q.setWeapon(wpn);
            q.brain = new Brain(g, q, 'attack', { hostile: true });
            q.brain.target = G;
            q.blip = '#ff3030';
            ola.push(q);
          }
          c.objective(`Defendé el barrio: <b>oleada ${w + 1} de 3</b>.`);
          await c.until(() => ola.every((q) => q.dead || q.removed));
        }
        // la camioneta escapa hacia el territorio de los Escarcha
        const E = te ? { x: te.x, z: te.z } : { x: -2116, z: -288 };
        const sp = calle(ll.x + 60, ll.z + 30);
        const camio = autoQueHuye(c, 'f100', sp, 0x9ad0f0, 1.4);
        const pul = c.spawnPed('cana', sp.x, sp.z, { name: 'Pulenta', look: { ...randomLook('cana'), shirt: 0x6a6a6a, shirtHex: '#6a6a6a', shirtKind: 'campera', hat: null, hairStyle: 'short' } });
        const tir = c.spawnPed('escarcha', sp.x, sp.z, {});
        tir.give('uzi', 400); tir.setWeapon('uzi');
        pul.enterVehicle(camio, 0); tir.enterVehicle(camio, 1);
        c.script(pul, () => {});
        c.script(tir, (dt, b) => { if (tir.vehicle && dist(camio.pos.x, camio.pos.z, G.pos.x, G.pos.z) < 40) b.shootFromCar(dt, g.player.vehicle || g.player); });
        camio.ai = new DriverAI(g, camio, 'route', { speedMul: 1.05 });
        camio.ai.planRoute(E.x, E.z);
        g.traffic.cars.push(camio);
        camio.blip = '#ff3030';
        g.hud.showToast('¡Se escapa la camioneta de los Escarcha!', 2.5);
        await c.say('Jefe de los Primavera', '¡Es la camioneta de ellos! ¡Que no llegue a su barrio!', 2.5);
        c.objective('Subite a un auto y hacé bolsa la <b>camioneta de los Escarcha</b> antes de que llegue a su barrio.');
        c.failIf(() => dist(camio.pos.x, camio.pos.z, E.x, E.z) < 45 && camio.health > 300, 'La camioneta llegó al barrio de los Escarcha.');
        siSeAleja(c, () => camio.pos, () => G.pos, 300, 10, 'Se te escapó la camioneta.');
        P.brain.driveTarget = camio;
        await c.until(() => camio.health < 300 || camio.dead);
        c.fails = c.fails.filter((f) => f.reason !== 'La camioneta llegó al barrio de los Escarcha.' && f.reason !== 'Se te escapó la camioneta.');
        camio.ai = null; camio.ctrl.throttle = 0; camio.ctrl.brake = 1;
        camio.health = Math.max(camio.health, 100); camio.fireT = 0;
        P.brain.driveTarget = null;
        if (!tir.dead) tir.hurt(999, G);
        if (pul.dead) g.revive(pul);
        pul.exitVehicle();
        c.failIf(() => pul.dead, 'Pulenta tenía que hablar, no terminar así.');
        c.objective('¡Agarrá a <b>Pulenta</b> antes de que se escape!');
        await agarrarAPie(c, G, pul, 0.6);
        await c.cutscene(async () => {
          c.place(P, G.pos.x + 1.5, G.pos.z + 1, 0);
          c.face(G, pul); c.face(P, pul);
          const x = pul.pos.x, z = pul.pos.z;
          c.cam(V3(x + 4, G.pos.y + 2.2, z + 4), V3(x + 3, G.pos.y + 1.8, z + 3), V3(x, G.pos.y + 0.8, z), 12);
          await c.say('Pulenta', '¡Está bien, está bien! ¡Barril se va a Buenos Aires mañana con todo! Sale en avioneta desde el Aeropuerto...');
          await c.say('Pulenta', '...y antes pasa por la esquina del gordo para poner la primera pantalla.');
          await c.say('Gordopin', 'Entonces mañana lo esperamos.');
        });
        g.removePed(pul);
        for (const q of aliados) if (!q.dead) { q.brain = new Brain(g, q, 'wander'); q.isFriend = false; q.persistent = false; q.spawned = true; }
      },
    },
    // ------------------------------------------------------------------
    // 15. El dueño del semáforo (final del capítulo 2)
    {
      id: 'finalBarril', title: 'El dueño del semáforo', giver: 'P', chapter: 2,
      hint: 'De madrugada, Barril pone su pantalla en tu esquina. Tirala abajo y frenalo antes de que llegue al Aeropuerto.',
      reward: 15000, respect: 20, needPetroca: true, needGordopin: true,
      start: garage,
      run: async (c, g) => {
        const G = g.player, P = g.companion;
        g.env.time = 5 * 60 + 40;
        g.env.setWeather('despejado', true);
        const gp = garage();
        await c.cutscene(async () => {
          c.cam(V3(gp.x + 10, G.pos.y + 2.5, gp.z - 4), V3(gp.x + 9, G.pos.y + 2.2, gp.z - 3), V3(gp.x + 3, G.pos.y + 1.3, gp.z), 8);
          await c.say('', 'De madrugada. En San Martín y Rivadavia, una cuadrilla de Barril termina de instalar una pantalla gigante.', 4.5);
          await c.say('Gordopin', 'Esa es mi esquina.');
          await c.say('Petroca', 'Subí. Hoy el Remís San Jorge hace su viaje más importante.');
        });
        const k = calle(gp.x + 12, gp.z);
        const remis = c.spawnVehicle('remis', k.x, k.z, k.rot, { exact: true });
        remis.health = remis.maxHealth * 1.5;
        remis.blip = '#40a0ff';
        c.objective('Subite al <b>remís</b>.');
        await c.until(() => G.vehicle);
        remis.blip = null;
        // la pantalla, en la vereda de la esquina del Pin
        const S = POI.semaforo || semaforo();
        const sc = S.corner || semaforo();
        const [dx, dz] = S.dir || [1, 0];
        const px = sc.x + dx * 6, pz = sc.z + dz * 6;
        const pan = pantalla(px, pz, Math.atan2(dx, dz) + Math.PI / 2);
        c.cleanup.push(() => g.scene.remove(pan));
        const pb = c.blip(px, pz, '#ff3030');
        c.objective('Andá a tu <b>semáforo</b> y <b>embestí la pantalla</b> de Barril con el auto.');
        c.help('Agarrá carrera: la pantalla se cae si la chocás rápido.', 6);
        let tumbada = false;
        await c.until(() => {
          const v = G.vehicle;
          if (v && dist(v.pos.x, v.pos.z, px, pz) < 5.5 && v.speed > 6) tumbada = true;
          return tumbada;
        });
        c.removeBlip(pb);
        g.audio.explosion ? g.audio.explosion(pan.position) : null;
        g.hud.showToast('¡Pantalla al piso!', 2);
        // la pantalla se cae
        let ang = 0;
        const axis = new THREE.Vector3(Math.cos(pan.rotation.y), 0, -Math.sin(pan.rotation.y));
        const base = pan.quaternion.clone();
        void c.until(() => { ang = Math.min(Math.PI / 2, ang + 0.04); pan.quaternion.copy(base).premultiply(new THREE.Quaternion().setFromAxisAngle(axis, ang)); return ang >= Math.PI / 2; }).catch(() => {});
        // Barril escapa hacia el Aeropuerto
        const AP = lugar('aeropuerto', { x: 375, z: -4217 });
        const sp = calle(sc.x - dx * 45, sc.z - dz * 45);
        const auto = autoQueHuye(c, 'pijo504', sp, 0x111111, 1.6);
        const barril = c.spawnPed('crudo', sp.x, sp.z, { look: LOOK.barril(), name: 'Mister Barril', health: 200 });
        const guar = c.spawnPed('cheto', sp.x, sp.z, { name: 'Guardia de Barril', look: { ...randomLook('cheto'), shirt: 0x111111, shirtHex: '#111111', shirtKind: 'traje', glasses: true } });
        guar.give('uzi', 500); guar.setWeapon('uzi');
        barril.enterVehicle(auto, 0); guar.enterVehicle(auto, 1);
        c.script(barril, () => {});
        c.script(guar, (dt, b) => { if (guar.vehicle && dist(auto.pos.x, auto.pos.z, G.pos.x, G.pos.z) < 40) b.shootFromCar(dt, g.player.vehicle || g.player); });
        auto.ai = new DriverAI(g, auto, 'route', { speedMul: 1.15 });
        auto.ai.planRoute(AP.x, AP.z);
        g.traffic.cars.push(auto);
        auto.blip = '#ff3030';
        await c.say('Petroca', '¡Ahí va Barril, en el Pijó negro! ¡Se va para el Aeropuerto!', 3);
        c.objective('¡Hacé bolsa el <b>auto de Mister Barril</b> antes de que llegue al <b>Aeropuerto</b>! El Petroca tira desde el auto.');
        const ab = c.blip(AP.x, AP.z, '#ffd21a');
        c.failIf(() => dist(auto.pos.x, auto.pos.z, AP.x, AP.z) < 90 && auto.health > 300, 'Barril llegó al Aeropuerto y se tomó la avioneta.');
        siSeAleja(c, () => auto.pos, () => G.pos, 320, 12, 'Barril se te escapó.');
        P.brain.driveTarget = auto;
        await c.until(() => auto.health < 300 || auto.dead);
        c.fails = c.fails.filter((f) => f.reason !== 'Barril llegó al Aeropuerto y se tomó la avioneta.' && f.reason !== 'Barril se te escapó.');
        c.removeBlip(ab);
        auto.ai = null; auto.ctrl.throttle = 0; auto.ctrl.brake = 1;
        auto.health = Math.max(auto.health, 100); auto.fireT = 0;
        P.brain.driveTarget = null;
        if (!guar.dead) guar.hurt(999, G);
        if (barril.dead) g.revive(barril);
        barril.exitVehicle();
        auto.blip = null;
        c.failIf(() => barril.dead, 'Barril tiene que terminar preso, no muerto.');
        c.objective('¡Se le fundió el motor! Agarrá a <b>Mister Barril</b>.');
        await agarrarAPie(c, G, barril, 0.58);
        await c.cutscene(async () => {
          c.place(P, G.pos.x + 1.5, G.pos.z + 1, 0);
          c.face(G, barril); c.face(P, barril);
          const x = barril.pos.x, z = barril.pos.z;
          c.cam(V3(x + 4, G.pos.y + 2.2, z + 4), V3(x + 3, G.pos.y + 1.8, z + 3), V3(x, G.pos.y + 0.8, z), 14);
          await c.say('Mister Barril', 'Ustedes no entienden cómo funciona el progreso.');
          await c.say('Gordopin', 'Usted no entiende cómo funciona Comodoro. Acá el viento se lleva todo lo que no está bien atado.');
          await c.say('Petroca', 'Y nosotros estamos bien atados. Buena petroca.');
          await c.fade(true, 1);
          g.hud.clearSubtitle();
          await c.say('', 'La nota del móvil de ADNSUR circuló por toda la Patagonia y Mister Barril no volvió a pisar Rada Tilly.', 5);
          await c.say('', 'El Remís San Jorge llegó a tener doce autos. El Petroca atiende la radio y no maneja nunca.', 5);
          await c.say('', 'Y el Pin volvió a su semáforo. El que a él se le da la gana.', 4.5);
          await c.fade(false, 1);
        });
        g.removePed(barril);
        g.hud.bigText('¡FIN DEL CAPÍTULO 2!', 'Gracias por jugar · Aguante Comodoro<br><small>Seguí jugando: bolsitas, saltos, remís, pool y malabares</small>', 8);
      },
    },
  ];
}
