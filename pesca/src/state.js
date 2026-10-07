'use strict';
// Estado de ejecución (lo que no se guarda): cámara, jugador y entidades.

const J = {
  t: 0, // segundos de juego
  modo: 'titulo', // titulo | jugando | desmayo
  partida: false, // hay una partida en curso (si no, no se guarda nada)
  panel: null, // id del panel abierto (pausa el mundo)
  w: 800, h: 600, dpr: 1,
  hora: 8, luz: 1, noche: 0,
  clima: { lluvia: 0, objetivo: 0, ola: 1, tClima: 150, viento: 0.3 },
  calidad: 1, sombras: true,
  debug: false,
};

// Jugador (en tierra o en un bote)
const P = {
  pos: { x: 0, y: 0, z: 0 }, vel: { x: 0, y: 0, z: 0 }, yaw: 0, mov: 0, walkT: 0,
  enSuelo: true, modo: 'tierra', // tierra | bote
  tool: 'cana', hp: 100, hpMax: 100, hambre: 100,
  flash: 0, inv: 0, comiendo: 0, cdItem: 0, cdArpon: 0, cdRed: 0, cdDina: 0, cdArma: 0, recarga: null, stun: 0, lento: 0, sinDano: 10,
  rodar: { t: 0, cd: 0, dx: 0, dz: 1 },
  buffs: [], cerca: null,
  mira: { x: 0, y: 0, z: 0, agua: false, dist: 0 },
  accion: 0, // animación de lanzar / arpón
};

// Cámara en tercera persona
const CAM = { yaw: 0, pitch: -0.28, dist: 6.2, distObj: 6.2, shake: 0, fov: 62, bloqueado: false, foco: { x: 0, y: 0, z: 0 } };

// Entidades
const PECES = [];
const BOSSES = [];
const PROY = [];
const PELIGROS = [];
const NPCS = [];
