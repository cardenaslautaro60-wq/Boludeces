// Datos del mapa de "San Jorge" (Comodoro Rivadavia estilizado, año 2004).
// Coordenadas en metros. +X = Este (mar), +Z = Sur. El Norte está hacia -Z.
// Es una versión libre: la geografía está comprimida y simplificada, como hizo
// Rockstar con Los Santos.

export const WORLD = { minX: -1500, maxX: 1150, minZ: -1800, maxZ: 1750 };
export const SEA_LEVEL = 0;

// Línea de costa: para cada Z, la X donde termina la tierra (el mar está al Este)
export const COAST = [
  [-1800, 520], [-1650, 485], [-1500, 455], [-1300, 445], [-1100, 458], [-900, 468],
  [-700, 476], [-560, 482], [-460, 440], [-300, 432], [-160, 462], [0, 480],
  [200, 486], [330, 505], [400, 575], [520, 585], [600, 525], [750, 470],
  [900, 420], [1050, 365], [1150, 325], [1300, 310], [1420, 335], [1500, 430],
  [1560, 570], [1620, 630], [1700, 575], [1750, 540],
];

// Barrios con calles en damero. Las líneas de calle están en x0 + i*px y z0 + j*pz.
// skip: lados del damero que no se dibujan (porque ya hay una ruta ahí)
// ext: prolonga las calles para conectarlas con rutas o barrios vecinos
export const GRIDS = [
  { id: 'centro', name: 'Centro', type: 'centro', x0: -10, z0: -110, px: 82, pz: 82, cols: 5, rows: 5, sw: 12, ext: { E: 45 } },
  { id: 'pietrobelli', name: 'Barrio Pietrobelli', type: 'barrio', x0: -440, z0: -80, px: 80, pz: 74.5, cols: 5, rows: 4, sw: 10, skip: { S: true }, ext: { E: 30 } },
  { id: 'juan23', name: 'Barrio Juan XXIII', type: 'barrio', x0: -760, z0: -80, px: 64, pz: 74.5, cols: 5, rows: 4, sw: 9, skip: { S: true, E: true } },
  { id: 'nuevejulio', name: 'Barrio 9 de Julio', type: 'barrio', x0: -440, z0: 218, px: 80, pz: 70, cols: 5, rows: 4, sw: 10, skip: { N: true }, ext: { E: 30 } },
  { id: 'treintaoct', name: 'Barrio 30 de Octubre', type: 'barrio', x0: -760, z0: 218, px: 64, pz: 70, cols: 5, rows: 4, sw: 9, skip: { N: true, E: true } },
  { id: 'industrial', name: 'Barrio Industrial', type: 'industrial', x0: -10, z0: 560, px: 82, pz: 80, cols: 3, rows: 3, sw: 12, ext: { E: 62, N: 260 } },
  { id: 'pueyrredon', name: 'Barrio Pueyrredón', type: 'barrio', x0: -440, z0: 560, px: 80, pz: 80, cols: 5, rows: 3, sw: 10, ext: { E: 30, N: 62 } },
  { id: 'km3', name: 'Km 3', type: 'km', x0: 80, z0: -900, px: 70, pz: 70, cols: 4, rows: 4, sw: 10, ext: { E: 50 } },
  { id: 'km5', name: 'Km 5', type: 'km', x0: 80, z0: -1150, px: 70, pz: 70, cols: 4, rows: 3, sw: 10, ext: { E: 50, S: 40 } },
  { id: 'km8', name: 'Km 8', type: 'barrio', x0: 80, z0: -1450, px: 70, pz: 70, cols: 4, rows: 4, sw: 10, ext: { E: 50, S: 20 } },
  { id: 'caleta', name: 'Caleta Córdova', type: 'km', x0: 260, z0: -1740, px: 60, pz: 60, cols: 2, rows: 2, sw: 9, ext: { E: 40 } },
  { id: 'rada', name: 'Rada Tilly', type: 'rada', x0: 20, z0: 1100, px: 62, pz: 66, cols: 4, rows: 5, sw: 10 },
];

// Rutas y avenidas principales (polilíneas)
export const ROADS = [
  {
    id: 'ruta3', name: 'Ruta 3', kind: 'ruta', width: 14, pts: [
      [420, -1800], [412, -1600], [405, -1400], [402, -1150], [408, -900], [412, -640],
      [400, -470], [392, -300], [415, -185], [445, -130], [445, 320], [405, 346],
      [295, 346], [295, 560], [300, 830], [150, 950], [-120, 1100], [-220, 1750],
    ],
  },
  { id: 'ruta26', name: 'Ruta 26', kind: 'ruta', width: 13, pts: [[-10, 218], [-440, 218], [-760, 218], [-840, 214], [-905, 204], [-1000, 190], [-1200, 175], [-1500, 160]] },
  { id: 'polonia', name: 'Av. Polonia', kind: 'avenida', width: 12, pts: [[-10, -110], [-80, -250], [-70, -460], [0, -600], [80, -660]] },
  { id: 'chenque', name: 'Subida al Chenque', kind: 'calle', width: 9, pts: [[72, -110], [45, -165], [125, -205], [60, -255], [135, -295], [165, -355], [190, -370]] },
  { id: 'pampa', name: 'Camino a Pampa del Castillo', kind: 'ruta', width: 11, pts: [[80, -760], [-300, -760], [-650, -720], [-900, -650], [-1050, -600]] },
  { id: 'aeropuerto', name: 'Acceso Aeropuerto', kind: 'avenida', width: 12, pts: [[80, -1310], [-300, -1310], [-360, -1310]] },
  { id: 'accesorada', name: 'Acceso Rada Tilly', kind: 'avenida', width: 12, pts: [[100, 978], [144, 1100]] },
  { id: 'marques', name: 'Camino a Punta del Marqués', kind: 'calle', width: 9, pts: [[268, 1430], [330, 1478], [420, 1535], [490, 1575], [560, 1600]] },
  // Puerto
  { id: 'puerto1', name: 'Puerto', kind: 'calle', width: 11, pts: [[295, 390], [560, 390]] },
  { id: 'puerto2', name: 'Puerto', kind: 'calle', width: 11, pts: [[295, 480], [585, 480]] },
  { id: 'puerto3', name: 'Puerto', kind: 'calle', width: 10, pts: [[430, 390], [430, 480]] },
  { id: 'muelle1', name: 'Muelle de Ultramar', kind: 'muelle', width: 12, pts: [[560, 390], [730, 390]] },
  { id: 'muelle2', name: 'Muelle Pesquero', kind: 'muelle', width: 10, pts: [[585, 480], [700, 480]] },
  // Meseta (caminos de ripio del yacimiento)
  { id: 'picada', name: 'Picada Principal', kind: 'tierra', width: 9, pts: [[-1050, -1600], [-1080, -1000], [-1050, -600], [-1000, -200], [-1000, 190], [-1060, 600], [-1000, 1000], [-1100, 1600]] },
  { id: 'eolico', name: 'Acceso Parque Eólico', kind: 'tierra', width: 8, pts: [[-1000, -200], [-900, -310], [-860, -450]] },
  { id: 'picada2', name: 'Picada Norte', kind: 'tierra', width: 8, pts: [[-1080, -1000], [-1320, -1060]] },
  { id: 'picada3', name: 'Picada Sur', kind: 'tierra', width: 8, pts: [[-1060, 600], [-1330, 660]] },
  { id: 'picada4', name: 'Picada Este', kind: 'tierra', width: 8, pts: [[-1000, 1000], [-1300, 1080]] },
];

// Plataformas elevadas (muelles) — altura fija de piso
export const DECKS = [
  { x0: 555, x1: 740, z0: 380, z1: 400, h: 2.6, name: 'muelle1' },
  { x0: 575, x1: 710, z0: 471, z1: 489, h: 2.6, name: 'muelle2' },
  { x0: 468, x1: 560, z0: 134, z1: 146, h: 2.4, name: 'muelleCostanera' },
];

// Zonas planas (urbanizadas) — se aplana el terreno
export const FLATS = [
  { x0: -30, x1: 470, z0: -125, z1: 320, h: (x) => 4 + (470 - x) * 0.018, edge: 45 },
  { x0: 280, x1: 600, z0: 330, z1: 575, h: () => 3.2, edge: 30 },
  { x0: -990, x1: -330, z0: -1420, z1: -1270, h: () => 36, edge: 60 },
  { x0: 10, x1: 290, z0: 1085, z1: 1445, h: (x, z) => 3.5 + (290 - x) * 0.04 + (z - 1085) * 0.004, edge: 40 },
  { x0: -30, x1: 290, z0: 540, z1: 820, h: (x) => 6 + (290 - x) * 0.03, edge: 40 },
];

// Nombres de zona (se muestran abajo a la derecha como en San Andreas)
export const ZONES = [
  { name: 'Muelle', rect: [460, 740, 370, 495] },
  { name: 'Puerto', rect: [285, 600, 330, 575] },
  { name: 'Centro', rect: [-20, 470, -125, 320] },
  { name: 'Cerro Chenque', ellipse: [150, -360, 200, 270] },
  { name: 'Restinga Alí', rect: [415, 530, -640, -440] },
  { name: 'Km 3', rect: [40, 480, -930, -600] },
  { name: 'Km 5', rect: [40, 480, -1160, -930] },
  { name: 'Km 8', rect: [40, 480, -1470, -1160] },
  { name: 'Caleta Córdova', rect: [230, 560, -1800, -1580] },
  { name: 'Aeropuerto', rect: [-1000, -300, -1460, -1250] },
  { name: 'Barrio Pietrobelli', rect: [-450, -15, -95, 214] },
  { name: 'Barrio Juan XXIII', rect: [-775, -440, -95, 214] },
  { name: 'Barrio 9 de Julio', rect: [-450, -15, 214, 505] },
  { name: 'Barrio 30 de Octubre', rect: [-775, -440, 214, 505] },
  { name: 'Barrio Industrial', rect: [-15, 300, 505, 830] },
  { name: 'Barrio Pueyrredón', rect: [-450, -15, 505, 830] },
  { name: 'Punta del Marqués', rect: [340, 720, 1450, 1750] },
  { name: 'Rada Tilly', rect: [-20, 360, 1060, 1460] },
  { name: 'Parque Eólico', rect: [-1000, -780, -520, -150] },
  { name: 'Pampa del Castillo', rect: [-1500, -840, -1800, 1750] },
  { name: 'Loma de Rada Tilly', rect: [-300, 500, 830, 1060] },
];

// Puntos de interés (se ubican en el mapa y el radar)
export const POI = {
  semaforo: { x: 236, z: 54, name: 'Semáforo de San Martín y Rivadavia' },
  casaAbuela: { x: -118, z: 100, name: 'Casa de la Abuela' },
  garagePetroca: { x: -118, z: 128, name: 'Garage del Petroca' },
  madriguera: { x: -240, z: 323, name: 'La Madriguera' },
  hospital: { x: 31, z: 45, name: 'Hospital Regional' },
  comisaria: { x: 113, z: -38, name: 'Comisaría Primera' },
  chori: { x: 458, z: 60, name: 'El Chori del Viento' },
  pizzeria: { x: 195, z: 146, name: 'Pizzería La Tuerca' },
  armeria: { x: 31, z: 136, name: 'Armería La Patagónica' },
  chapa: { x: 113, z: 632, name: 'Chapa y Pintura Don Tito' },
  gimnasio: { x: 31, z: 632, name: 'Gimnasio Músculo Patagónico' },
  terminal: { x: 359, z: 218, name: 'Terminal de Ómnibus' },
  catedral: { x: 277, z: 13, name: 'Catedral San Juan Bosco' },
  torreCrudo: { x: 359, z: 13, name: 'Torre Crudo' },
  museo: { x: 185, z: -725, name: 'Museo del Petróleo' },
  depositoCrudo: { x: 20, z: -700, name: 'Depósito de Don Crudo' },
  yacimiento: { x: -1160, z: -900, name: 'Campamento Pampa del Castillo' },
  mansionChetos: { x: 237, z: 1397, name: 'La Mansión de los Chetos' },
  loberia: { x: 575, z: 1620, name: 'Lobería de Punta del Marqués' },
  anomala: { x: 31, z: 259, name: 'La Anómala' },
  casino: { x: 462, z: 205, name: 'Casino del Golfo' },
  antenas: { x: 185, z: -380, name: 'Antenas del Chenque' },
  remiseria: { x: 318, z: 177, name: 'Remisería El Viento' },
};

// Bolsitas de La Anómala enganchadas en alambrados (coleccionables)
export const BAGS = [
  [150, -330], [-60, -300], [430, -520], [300, -760], [-120, -1000], [200, -1400], [330, -1700],
  [-600, -1330], [-930, -380], [-1250, -1000], [-1200, 100], [-1250, 700], [-980, 1300],
  [-640, 440], [-600, -60], [-330, 700], [230, 900], [320, 1250], [520, 1640], [650, 400],
  [500, -80], [120, 780], [-300, -700], [470, 480],
];

// Saltos únicos (rampas): posición, rumbo (radianes, 0 = hacia +Z), largo, alto
export const RAMPS = [
  { x: 330, z: 520, rot: Math.PI / 2, len: 14, h: 3.5, w: 7 },
  { x: -700, z: 330, rot: Math.PI, len: 12, h: 3, w: 6 },
  { x: 250, z: 1250, rot: 0, len: 14, h: 3.2, w: 7 },
  { x: -1020, z: -300, rot: Math.PI, len: 16, h: 4, w: 7 },
  { x: 235, z: -840, rot: -Math.PI / 2, len: 12, h: 3, w: 6 },
  { x: -300, z: -1305, rot: -Math.PI / 2, len: 16, h: 4.5, w: 8 },
];

// Cigüeñas (bombas de petróleo) — zonas donde se esparcen
export const PUMP_AREAS = [
  { x0: -1450, x1: -870, z0: -1700, z1: 1700, n: 70 },
  { x0: -300, x1: 60, z0: -1000, z1: -780, n: 10 },
  { x0: -200, x1: 30, z0: -1450, z1: -1100, n: 8 },
  { x0: 250, x1: 380, z0: -560, z1: -470, n: 3 },
  { x0: -840, x1: -780, z0: -100, z1: 500, n: 6 },
  { x0: -300, x1: 200, z0: 840, z1: 1040, n: 8 },
  { x0: -700, x1: -470, z0: 520, z1: 820, n: 5 },
];

// Parque eólico Antonio Morán (estilizado)
export const TURBINES = [
  [-900, -470], [-880, -420], [-925, -380], [-905, -330], [-950, -280], [-930, -230], [-960, -180], [-870, -520],
];

// Lugares de reaparición
export const SPAWNS = {
  hospital: { x: 31, z: 50, rot: Math.PI },
  comisaria: { x: 113, z: -40, rot: Math.PI },
  casa: { x: -110, z: 100, rot: Math.PI / 2 },
};
