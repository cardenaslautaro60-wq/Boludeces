'use strict';
// Todo el contenido del juego en tablas: zonas, especies, jefes, cañas, herramientas, comida y misiones.
// La plata es en pesos ($). Las distancias son en metros (la isla principal mide unos 170 m de punta a punta).

// Zonas del mar según la distancia a la costa (en metros). 1 unidad del mundo = 1 metro.
const ZONAS = [
  { id: 'orilla', nombre: 'La Orilla', desde: 0, hasta: 30, tono: '#7fe5e0' },
  { id: 'arrecife', nombre: 'El Arrecife', desde: 30, hasta: 90, tono: '#37b9d9' },
  { id: 'mar', nombre: 'Mar Abierto', desde: 90, hasta: 170, tono: '#1b7cc2' },
  { id: 'abismo', nombre: 'El Abismo', desde: 170, hasta: 1e9, tono: '#0b3b86' },
];
const zonaDe = (d) => (d < 30 ? 'orilla' : d < 90 ? 'arrecife' : d < 170 ? 'mar' : 'abismo');
const ZONA = Object.fromEntries(ZONAS.map((z) => [z.id, z]));

// Rarezas
const RAREZAS = [
  { id: 'comun', nombre: 'Común', color: '#cfd8e0' },
  { id: 'poco', nombre: 'Poco común', color: '#74d97a' },
  { id: 'rara', nombre: 'Rara', color: '#4aa8ff' },
  { id: 'epica', nombre: 'Épica', color: '#b86bff' },
  { id: 'leyenda', nombre: 'Legendaria', color: '#ffc63d' },
  { id: 'jefe', nombre: 'Jefe', color: '#ff5a4d' },
];

// Patrones de pelea: pesos de cada "modo" (calma, tirón, corrida, sacudida)
const PAT = {
  manso: { calma: 6, tiron: 3, corrida: 0, sacudida: 0 },
  normal: { calma: 4, tiron: 4, corrida: 1, sacudida: 1 },
  corredor: { calma: 2, tiron: 3, corrida: 4, sacudida: 0 },
  nervioso: { calma: 2, tiron: 3, corrida: 1, sacudida: 4 },
  bruto: { calma: 1, tiron: 4, corrida: 3, sacudida: 2 },
};

// ---------------------------------------------------------------------------
// ESPECIES. z = peso de aparición por zona. kg = [mínimo, máximo]; precio vale para el peso medio.
// fuerza: qué tan fuerte tira. dureza: qué arpón/red hace falta. cardumen: [mín, máx] de peces juntos.
// arte: cómo se dibuja (ver art.js)
// ---------------------------------------------------------------------------
const ESPECIES = [
  // ---- La Orilla
  { id: 'sardina', nombre: 'Sardina', z: { orilla: 10 }, rareza: 0, precio: 8, kg: [0.05, 0.16], len: 20, dureza: 1, fuerza: 0.28, aguante: 2.6, pat: 'manso', cardumen: [5, 9],
    arte: { forma: 'pez', lomo: '#7fa8c9', panza: '#e9f2f8', aleta: '#7a9db8', alto: 0.23, cola: 'horq', dorsal: 'norm', patron: 'linea', pcolor: '#d7ecfa' },
    texto: 'Chiquita pero cumplidora. En lata es otra cosa.' },
  { id: 'anchoita', nombre: 'Anchoíta', z: { orilla: 7 }, rareza: 0, precio: 10, kg: [0.03, 0.09], len: 17, dureza: 1, fuerza: 0.25, aguante: 2.4, pat: 'manso', cardumen: [6, 11],
    arte: { forma: 'pez', lomo: '#6d8f7f', panza: '#e8efe9', aleta: '#86a595', alto: 0.17, cola: 'horq', dorsal: 'norm', patron: 'linea', pcolor: '#c6e0d2' },
    texto: 'La reina del Mar Argentino. Con limón.' },
  { id: 'mojarra', nombre: 'Mojarra', z: { orilla: 8, arrecife: 1 }, rareza: 0, precio: 14, kg: [0.15, 0.5], len: 26, dureza: 1, fuerza: 0.34, aguante: 3, pat: 'manso',
    arte: { forma: 'pez', lomo: '#b5b38a', panza: '#f4eecf', aleta: '#d6b25e', alto: 0.34, cola: 'horq', dorsal: 'larga', patron: 'barras', pcolor: '#9a9770' },
    texto: 'Pica a todo lo que se mueve.' },
  { id: 'pejerrey', nombre: 'Pejerrey', z: { orilla: 7, arrecife: 2 }, rareza: 0, precio: 20, kg: [0.2, 0.8], len: 32, dureza: 1, fuerza: 0.38, aguante: 3.2, pat: 'normal',
    arte: { forma: 'pez', lomo: '#9bbbd0', panza: '#f2f6f8', aleta: '#b6cfde', alto: 0.17, cola: 'horq', dorsal: 'norm', patron: 'linea', pcolor: '#f4fbff' },
    texto: 'El clásico de la caña. Frito, con limón.' },
  { id: 'camaron', nombre: 'Camarón', z: { orilla: 6 }, rareza: 0, precio: 12, kg: [0.03, 0.09], len: 16, dureza: 1, fuerza: 0.22, aguante: 2.2, pat: 'manso', cardumen: [3, 5],
    arte: { forma: 'camaron', c1: '#f2a38c', c2: '#ffd9c9' }, texto: 'Saltarín. Un langostino de bolsillo.' },
  { id: 'cangrejo', nombre: 'Cangrejo', z: { orilla: 5 }, rareza: 1, precio: 26, kg: [0.2, 0.8], len: 24, dureza: 2, fuerza: 0.45, aguante: 3, pat: 'normal',
    arte: { forma: 'cangrejo', c1: '#d9784a', c2: '#f3b18a' }, texto: 'Camina de costado, como los políticos.' },
  { id: 'estrella', nombre: 'Estrella de mar', z: { orilla: 3, arrecife: 2 }, rareza: 1, precio: 34, kg: [0.15, 0.5], len: 24, dureza: 2, fuerza: 0.3, aguante: 3, pat: 'manso',
    arte: { forma: 'estrella', c1: '#f08a3c', c2: '#ffd079' }, texto: 'No brilla, pero vale.' },

  // ---- El Arrecife
  { id: 'payaso', nombre: 'Pez payaso', z: { arrecife: 6 }, rareza: 1, precio: 48, kg: [0.08, 0.25], len: 22, dureza: 2, fuerza: 0.4, aguante: 3, pat: 'nervioso',
    arte: { forma: 'pez', lomo: '#ff8a2a', panza: '#ffa655', aleta: '#ff7a1a', alto: 0.38, cola: 'red', dorsal: 'larga', patron: 'franjas', pcolor: '#fff6ea' },
    texto: 'No hace reír, pero se paga bien.' },
  { id: 'angel', nombre: 'Pez ángel', z: { arrecife: 5 }, rareza: 1, precio: 75, kg: [0.2, 0.7], len: 28, dureza: 2, fuerza: 0.46, aguante: 3.2, pat: 'normal',
    arte: { forma: 'pez', lomo: '#ffd23c', panza: '#4a86e8', aleta: '#2f63c4', alto: 0.62, cola: 'red', dorsal: 'vela', patron: 'barras', pcolor: '#2f63c4' },
    texto: 'Cara de bueno, bolsillo de ladrón.' },
  { id: 'besugo', nombre: 'Besugo', z: { arrecife: 7, mar: 1 }, rareza: 0, precio: 52, kg: [0.5, 1.6], len: 34, dureza: 2, fuerza: 0.5, aguante: 3.4, pat: 'normal',
    arte: { forma: 'pez', lomo: '#e0707a', panza: '#fbe0dc', aleta: '#c8505c', alto: 0.3, cola: 'horq', dorsal: 'espinas', patron: 'ninguno', pcolor: '#fff' },
    texto: 'Tiene cara de enojado todo el día.' },
  { id: 'corvina', nombre: 'Corvina', z: { arrecife: 6, mar: 2 }, rareza: 0, precio: 66, kg: [0.8, 2.4], len: 40, dureza: 2, fuerza: 0.56, aguante: 3.6, pat: 'normal',
    arte: { forma: 'pez', lomo: '#8c98a6', panza: '#e5e9ee', aleta: '#6f7c8a', alto: 0.25, cola: 'horq', dorsal: 'norm', patron: 'linea', pcolor: '#4f5a66' },
    texto: 'Para la parrilla, sin pensarlo.' },
  { id: 'dorado', nombre: 'Dorado', z: { arrecife: 3, mar: 2 }, rareza: 2, precio: 110, kg: [2, 6.5], len: 56, dureza: 3, fuerza: 0.86, aguante: 4.5, pat: 'corredor',
    arte: { forma: 'pez', lomo: '#2f9c63', panza: '#ffd23c', aleta: '#e8a81a', alto: 0.3, cola: 'horq', dorsal: 'larga', patron: 'manchas', pcolor: '#b9751c' },
    texto: 'El tigre del río, acá de visita.' },
  { id: 'globo', nombre: 'Pez globo', z: { arrecife: 2, orilla: 1 }, rareza: 2, precio: 140, kg: [0.4, 1.4], len: 24, dureza: 2, fuerza: 0.5, aguante: 3.4, pat: 'nervioso', veneno: true,
    arte: { forma: 'globo', c1: '#d8c27a', c2: '#fff4cf' }, texto: 'No lo abraces. Y crudo, ni lo pienses.' },
  { id: 'pulpo', nombre: 'Pulpo', z: { arrecife: 2.5 }, rareza: 2, precio: 150, kg: [1, 3.5], len: 44, dureza: 3, fuerza: 0.76, aguante: 4.4, pat: 'bruto',
    arte: { forma: 'pulpo', c1: '#a05fb8', c2: '#d9a8e8' }, texto: 'Ocho brazos y ninguno para pagar la cuenta.' },
  { id: 'langosta', nombre: 'Langosta', z: { arrecife: 2 }, rareza: 2, precio: 190, kg: [0.7, 2.2], len: 40, dureza: 3, fuerza: 0.66, aguante: 4, pat: 'normal',
    arte: { forma: 'langosta', c1: '#d0492f', c2: '#f28a62' }, texto: 'Ricos y famosos: $$$.' },
  { id: 'medusa', nombre: 'Medusa', z: { arrecife: 4, mar: 2 }, rareza: 1, precio: 60, kg: [0.2, 1], len: 30, dureza: 1, fuerza: 0.2, aguante: 3, pat: 'manso', pica: true,
    arte: { forma: 'medusa', c1: '#d98cf0', c2: '#f6d8ff' }, texto: 'Linda, transparente y te pica.' },
  { id: 'raya', nombre: 'Raya', z: { arrecife: 2, mar: 1.5 }, rareza: 2, precio: 170, kg: [3, 9], len: 70, dureza: 3, fuerza: 0.82, aguante: 4.6, pat: 'bruto',
    arte: { forma: 'raya', c1: '#6a7f94', c2: '#cfd9e2' }, texto: 'Vuela por el fondo. No la pises.' },
  { id: 'morena', nombre: 'Morena', z: { arrecife: 1.2, mar: 1 }, rareza: 3, precio: 320, kg: [1.8, 5], len: 70, dureza: 3, fuerza: 1.0, aguante: 5, pat: 'nervioso',
    arte: { forma: 'morena', c1: '#7a8b4a', c2: '#d9d27a' }, texto: 'Tiene muy mala onda y peor dentadura.' },

  // ---- Mar Abierto
  { id: 'salmon', nombre: 'Salmón', z: { mar: 6 }, rareza: 1, precio: 210, kg: [2.5, 7], len: 60, dureza: 3, fuerza: 0.92, aguante: 4.6, pat: 'corredor',
    arte: { forma: 'pez', lomo: '#6f8aa6', panza: '#f2a99a', aleta: '#5d7792', alto: 0.26, cola: 'horq', dorsal: 'norm', patron: 'puntos', pcolor: '#2c3e55' },
    texto: 'Viene de lejos y nada contra la corriente.' },
  { id: 'atun', nombre: 'Atún', z: { mar: 4 }, rareza: 2, precio: 290, kg: [14, 48], len: 96, dureza: 4, fuerza: 1.25, aguante: 5.6, pat: 'corredor',
    arte: { forma: 'pez', lomo: '#2c4b7a', panza: '#dbe6f1', aleta: '#e5c447', alto: 0.3, cola: 'lun', dorsal: 'aletillas', patron: 'linea', pcolor: '#e5c447' },
    texto: 'Un torpedo con aleta. Peleador.' },
  { id: 'mahi', nombre: 'Mahi-mahi', z: { mar: 3.5 }, rareza: 2, precio: 340, kg: [7, 20], len: 84, dureza: 4, fuerza: 1.1, aguante: 5.2, pat: 'nervioso',
    arte: { forma: 'pez', lomo: '#2ecf8b', panza: '#ffe27a', aleta: '#3bb0c9', alto: 0.34, cola: 'horq', dorsal: 'larga', patron: 'puntos', pcolor: '#4fc3ff' },
    texto: 'Cambia de color cuando se enoja.' },
  { id: 'barracuda', nombre: 'Barracuda', z: { mar: 3 }, rareza: 2, precio: 380, kg: [4, 13], len: 92, dureza: 4, fuerza: 1.15, aguante: 5.2, pat: 'corredor',
    arte: { forma: 'pez', lomo: '#6f7f8a', panza: '#e9eef0', aleta: '#56656f', alto: 0.14, cola: 'horq', dorsal: 'norm', patron: 'barras', pcolor: '#4d5a63', dientes: true },
    texto: 'Dientes de sobra, modales de menos.' },
  { id: 'espada', nombre: 'Pez espada', z: { mar: 1.6 }, rareza: 3, precio: 560, kg: [28, 90], len: 130, dureza: 5, fuerza: 1.6, aguante: 6.4, pat: 'bruto',
    arte: { forma: 'pez', lomo: '#34507e', panza: '#d8e0ea', aleta: '#2a416a', alto: 0.22, cola: 'lun', dorsal: 'vela', patron: 'ninguno', pcolor: '#fff', pico: 0.34 },
    texto: 'Trae su propia espada. Pide respeto.' },
  { id: 'vela', nombre: 'Pez vela', z: { mar: 1.2 }, rareza: 3, precio: 720, kg: [24, 70], len: 125, dureza: 5, fuerza: 1.55, aguante: 6.2, pat: 'corredor',
    arte: { forma: 'pez', lomo: '#2f78c4', panza: '#e3f1fb', aleta: '#1f5ea8', alto: 0.2, cola: 'lun', dorsal: 'vela', patron: 'puntos', pcolor: '#0e3d7a', pico: 0.24 },
    texto: 'Se las da de velero.' },
  { id: 'martillo', nombre: 'Tiburón martillo', z: { mar: 1.1 }, rareza: 3, precio: 1100, kg: [60, 180], len: 170, dureza: 5, fuerza: 1.85, aguante: 7, pat: 'bruto',
    arte: { forma: 'tiburon', c1: '#6d7b8c', c2: '#e6ecf1', variante: 'martillo' }, texto: 'No es jefe, pero se cree.' },
  { id: 'gris', nombre: 'Tiburón gris', z: { mar: 1.5 }, rareza: 3, precio: 950, kg: [45, 140], len: 150, dureza: 5, fuerza: 1.75, aguante: 6.8, pat: 'bruto',
    arte: { forma: 'tiburon', c1: '#7d8c9c', c2: '#e8edf2', variante: 'gris' }, texto: 'Muerde primero y pregunta después.' },
  { id: 'luna', nombre: 'Pez luna', z: { mar: 1 }, rareza: 3, precio: 780, kg: [80, 250], len: 120, dureza: 5, fuerza: 1.0, aguante: 7.5, pat: 'manso',
    arte: { forma: 'pez', lomo: '#8d9bab', panza: '#dfe5ea', aleta: '#76879a', alto: 0.95, cola: 'trunc', dorsal: 'aletaalta', patron: 'ninguno', pcolor: '#fff' },
    texto: 'Gigante, redondo y siempre sorprendido.' },

  // ---- El Abismo
  { id: 'linterna', nombre: 'Pez linterna', z: { abismo: 5 }, rareza: 2, precio: 600, kg: [0.1, 0.4], len: 26, dureza: 3, fuerza: 0.7, aguante: 4, pat: 'nervioso',
    arte: { forma: 'pez', lomo: '#26334f', panza: '#4c6a96', aleta: '#34456a', alto: 0.28, cola: 'horq', dorsal: 'norm', patron: 'ninguno', pcolor: '#fff', brilla: true },
    texto: 'Lleva su propia lamparita.' },
  { id: 'gota', nombre: 'Pez gota', z: { abismo: 3 }, rareza: 3, precio: 1100, kg: [1, 3.2], len: 34, dureza: 4, fuerza: 0.5, aguante: 5, pat: 'manso',
    arte: { forma: 'gota', c1: '#e8a0a8', c2: '#f9d2d6' }, texto: 'Dicen que es el más feo del mar. Vale oro.' },
  { id: 'vibora', nombre: 'Pez víbora', z: { abismo: 3.5 }, rareza: 3, precio: 1800, kg: [0.3, 1.2], len: 52, dureza: 4, fuerza: 1.6, aguante: 5.4, pat: 'nervioso',
    arte: { forma: 'pez', lomo: '#1f2a3c', panza: '#37496a', aleta: '#2a3a55', alto: 0.16, cola: 'horq', dorsal: 'larga', patron: 'ninguno', pcolor: '#fff', dientes: true, brilla: true },
    texto: 'Dientes que no le caben en la boca.' },
  { id: 'rape', nombre: 'Rape', z: { abismo: 3 }, rareza: 3, precio: 2600, kg: [3, 12], len: 60, dureza: 5, fuerza: 1.7, aguante: 6, pat: 'bruto',
    arte: { forma: 'rape', c1: '#4a3b34', c2: '#8f7566' }, texto: 'Pesca con caña, como vos.' },
  { id: 'calamar', nombre: 'Calamar gigante', z: { abismo: 1.4 }, rareza: 4, precio: 4800, kg: [18, 60], len: 110, dureza: 5, fuerza: 1.9, aguante: 7, pat: 'bruto',
    arte: { forma: 'calamar', c1: '#c8445a', c2: '#f2a3b0' }, texto: 'Tinta, tentáculos y malhumor.' },
  { id: 'remo', nombre: 'Pez remo', z: { abismo: 1 }, rareza: 4, precio: 7500, kg: [35, 95], len: 190, dureza: 6, fuerza: 1.5, aguante: 7.4, pat: 'corredor',
    arte: { forma: 'cinta', c1: '#cfd8e2', c2: '#ff4d5e' }, texto: 'Una cinta de plata de varios metros.' },
  { id: 'duende', nombre: 'Tiburón duende', z: { abismo: 0.9 }, rareza: 4, precio: 11000, kg: [70, 200], len: 180, dureza: 6, fuerza: 2.2, aguante: 8, pat: 'bruto',
    arte: { forma: 'tiburon', c1: '#d9a0b0', c2: '#f6dfe5', variante: 'duende' }, texto: 'Fósil viviente con cara de pocos amigos.' },
  { id: 'celacanto', nombre: 'Celacanto', z: { abismo: 0.6 }, rareza: 4, precio: 15000, kg: [40, 90], len: 130, dureza: 6, fuerza: 2.0, aguante: 8, pat: 'bruto',
    arte: { forma: 'pez', lomo: '#3b4f86', panza: '#6b82bf', aleta: '#4a64a8', alto: 0.34, cola: 'red', dorsal: 'larga', patron: 'manchas', pcolor: '#dfe8ff' },
    texto: 'Se creía extinto. Aparece a cobrar.' },

  // ---- Hallazgos: no son peces
  { id: 'bota', nombre: 'Bota vieja', tipo: 'basura', z: { orilla: 1.1, arrecife: 0.8 }, rareza: 0, precio: 1, kg: [0.3, 0.8], len: 24, dureza: 1, fuerza: 0.18, aguante: 2, pat: 'manso',
    arte: { forma: 'bota' }, texto: 'Una bota vieja. Del pie izquierdo, claro.' },
  { id: 'lata', nombre: 'Lata oxidada', tipo: 'basura', z: { orilla: 1, arrecife: 0.7 }, rareza: 0, precio: 1, kg: [0.1, 0.3], len: 18, dureza: 1, fuerza: 0.16, aguante: 2, pat: 'manso',
    arte: { forma: 'lata' }, texto: 'Latita oxidada. Algo suena adentro.' },
  { id: 'neumatico', nombre: 'Neumático', tipo: 'basura', z: { orilla: 0.5, arrecife: 0.8, mar: 0.5 }, rareza: 0, precio: 3, kg: [4, 9], len: 34, dureza: 1, fuerza: 0.2, aguante: 3, pat: 'manso',
    arte: { forma: 'neumatico' }, texto: '¿De dónde salió un neumático?' },
  { id: 'botella', nombre: 'Botella con mensaje', tipo: 'basura', z: { orilla: 0.5, arrecife: 0.6, mar: 0.8, abismo: 0.4 }, rareza: 1, precio: 30, kg: [0.2, 0.4], len: 22, dureza: 1, fuerza: 0.14, aguante: 2, pat: 'manso',
    arte: { forma: 'botella' }, texto: 'Hay un papel adentro.' },
  { id: 'cofre', nombre: 'Cofre del tesoro', tipo: 'tesoro', z: { orilla: 0.25, arrecife: 0.45, mar: 0.6, abismo: 0.6 }, rareza: 3, precio: 0, kg: [6, 14], len: 30, dureza: 1, fuerza: 0.3, aguante: 4, pat: 'manso',
    arte: { forma: 'cofre' }, texto: '¡Un cofre del tesoro! Pesa lo suyo.' },
];
const SP = Object.fromEntries(ESPECIES.map((s) => [s.id, s]));
const peces = ESPECIES.filter((s) => !s.tipo);

// Mensajes de las botellas
const MENSAJES_BOTELLA = [
  'Don Pinza duerme en el arrecife. Necesita carnada de jefe y un buen arpón.',
  'El Matungo patrulla el mar abierto. Cuando embiste, queda aturdido. Pegale ahí.',
  'La Relámpago tira rayos donde estés parado. Movete.',
  'Dicen que el Leviatán solo sale de noche. Yo no me quedaría a averiguarlo.',
  'Las medusas pican. Las botas no.',
  'El muelle te deja llegar más lejos. Probá desde la punta.',
  'Doña Rosa paga mejor las piezas grandes. Y más todavía los jefes.',
  'Apostá solo lo que podés perder. La casa siempre gana un poquito más seguido.',
  'Comer mal es peor que pelear mal.',
  'El pez globo crudo es veneno. Asado es otra historia.',
];

// ---------------------------------------------------------------------------
// JEFES
// d = distancia a la costa a la que patrulla. ang = sector (radianes; PI/2 = el sur, donde está el muelle).
// ---------------------------------------------------------------------------
const JEFES = [
  { id: 'pinza', fl: 0.9, ac: 7, stun: 1.7, nombre: 'Don Pinza', apodo: 'el Cangrejo Rey', forma: 'cangrejo', hp: 1500, precio: 6000, radio: 3.3, vel: 6, dmg: 14, d: 55, ang: 1.9, vaiven: 0.9, per: 90, cuando: 'siempre', color: '#e0583a',
    intro: 'Rey del arrecife. Armadura de roca, pinzas de acero y cero sentido del humor.', consejo: 'Con el caparazón cerrado casi no siente los golpes. Pegale cuando abre las pinzas.',
    botin: [['dinamita', 3]], danoLinea: 1 },
  { id: 'matungo', fl: 1.3, ac: 16, stun: 2.0, nombre: 'El Matungo', apodo: 'el Tiburón Blanco', forma: 'tiburon', hp: 3600, precio: 20000, radio: 4.4, vel: 12, dmg: 22, d: 120, ang: 1.3, vaiven: 1.1, per: 80, cuando: 'siempre', color: '#8aa0b5',
    intro: 'Una sombra de siete metros que ya se comió dos botes y un mate.', consejo: 'Embiste en línea recta. Esquivá y pegale mientras queda aturdido.',
    botin: [['botiquin', 2]], danoLinea: 1 },
  { id: 'relampago', fl: 1.6, ac: 18, stun: 1.7, nombre: 'La Relámpago', apodo: 'la Anguila Eléctrica', forma: 'anguila', hp: 7000, precio: 55000, radio: 3.6, vel: 13, dmg: 26, d: 140, ang: 2.0, vaiven: 1.2, per: 70, cuando: 'siempre', color: '#ffe14a',
    intro: 'Una anguila gigante que carga la electricidad de todo el mar.', consejo: 'Tira rayos donde estés parado. No te quedes quieto cerca de ella.',
    botin: [['botiquin', 3], ['dinamita', 5]], danoLinea: 1 },
  { id: 'tentacula', fl: 1.9, ac: 38, stun: 1.6, nombre: 'Doña Tentácula', apodo: 'la Pulpa Gigante', forma: 'pulpo', hp: 14000, precio: 150000, radio: 6.5, vel: 6, dmg: 32, d: 210, ang: 1.6, vaiven: 0.7, per: 100, cuando: 'siempre', color: '#a05fb8',
    intro: 'Ocho brazos, cero paciencia. Vive en el abismo y odia el ruido.', consejo: 'Sus tentáculos caen en varios lugares a la vez. Buscá el hueco y no pares.',
    botin: [['elixir', 2]], danoLinea: 1 },
  { id: 'leviatan', fl: 2.4, ac: 52, stun: 1.8, nombre: 'El Leviatán', apodo: 'el Señor de la Noche', forma: 'leviatan', hp: 28000, precio: 480000, radio: 9, vel: 6, dmg: 40, d: 260, ang: 1.45, vaiven: 0.8, per: 120, cuando: 'noche', color: '#4a7dff',
    intro: 'Sale de noche. Dicen que el mar entero se mueve cuando respira.', consejo: 'Solo aparece de noche. Aguantá las tres fases y tené curas a mano.',
    botin: [['elixir', 3], ['corona', 1]], danoLinea: 1 },
];
const JEFE = Object.fromEntries(JEFES.map((j) => [j.id, j]));

// ---------------------------------------------------------------------------
// EQUIPO
// ---------------------------------------------------------------------------
const CANIAS = [
  { id: 'bambu', nombre: 'Caña de Bambú', precio: 0, alcance: 24, fuerza: 1.0, aguante: 1.0, suerte: 0.0, color: '#c9a45c', desc: 'Una vara y buena voluntad.' },
  { id: 'fibra', nombre: 'Caña de Fibra', precio: 300, alcance: 30, fuerza: 1.18, aguante: 1.2, suerte: 0.05, color: '#3ec1d3', desc: 'Liviana y flexible. Llega un poco más lejos.' },
  { id: 'carbono', nombre: 'Caña de Carbono', precio: 1600, alcance: 38, fuerza: 1.4, aguante: 1.45, suerte: 0.1, color: '#3a3f4a', desc: 'Dura como piedra, liviana como pluma.' },
  { id: 'telescopica', nombre: 'Caña Telescópica', precio: 7500, alcance: 47, fuerza: 1.7, aguante: 1.75, suerte: 0.16, color: '#9aa6b5', desc: 'Se estira hasta el mar abierto.' },
  { id: 'titanio', nombre: 'Caña de Titanio', precio: 30000, alcance: 58, fuerza: 2.05, aguante: 2.1, suerte: 0.23, color: '#d7dde5', desc: 'Aguanta lo que le tires. Casi.' },
  { id: 'capitan', nombre: 'Caña del Capitán', precio: 110000, alcance: 72, fuerza: 2.5, aguante: 2.6, suerte: 0.31, color: '#e0b13a', desc: 'La usaba un capitán que nunca volvió.' },
  { id: 'leviatana', nombre: 'La Leviatana', precio: 350000, alcance: 90, fuerza: 3.1, aguante: 3.2, suerte: 0.4, color: '#b04bff', desc: 'Forjada con un diente del abismo.' },
];
const PARTES = [
  { id: 'carretel', nombre: 'Carretel', desc: '+8% de velocidad al recoger, por nivel.', max: 5, base: 220, mult: 2.4, icono: '⚙️' },
  { id: 'linea', nombre: 'Línea trenzada', desc: '+10% de aguante de la línea, por nivel.', max: 5, base: 220, mult: 2.4, icono: '🧵' },
  { id: 'anzuelo', nombre: 'Anzuelo afilado', desc: 'Más tiempo para clavar el pique, por nivel.', max: 5, base: 260, mult: 2.4, icono: '🪝' },
  { id: 'senuelo', nombre: 'Señuelo brillante', desc: '+7% de suerte y atrae desde más lejos, por nivel.', max: 5, base: 300, mult: 2.4, icono: '✨' },
];
const costoParte = (p, nivel) => Math.round(p.base * Math.pow(p.mult, nivel));

const ARPONES = [
  { id: 'palo', nombre: 'Arpón de Palo', precio: 120, dano: 40, alcance: 16, enfr: 1.15, dureza: 2, color: '#b98a52', desc: 'Una vara con punta. Sirve para empezar a cazar.' },
  { id: 'hierro', nombre: 'Arpón de Hierro', precio: 1100, dano: 90, alcance: 20, enfr: 0.95, dureza: 3, color: '#aab3bd', desc: 'Pesado y filoso.' },
  { id: 'acero', nombre: 'Arpón de Acero', precio: 8500, dano: 190, alcance: 25, enfr: 0.8, dureza: 4, color: '#dfe7ee', desc: 'Atraviesa casi cualquier cosa.' },
  { id: 'canon', nombre: 'Arponcañón', precio: 42000, dano: 400, alcance: 31, enfr: 0.68, dureza: 5, color: '#f0a94a', desc: 'Dispara con resorte. Mete miedo.' },
  { id: 'electrico', nombre: 'Arpón Eléctrico', precio: 170000, dano: 800, alcance: 38, enfr: 0.55, dureza: 6, color: '#58e6ff', desc: 'Clava y electrocuta.' },
];
const REDES = [
  { id: 'red1', nombre: 'Red de Pesca', precio: 260, radio: 3.6, alcance: 14, dureza: 1, tope: 6, enfr: 3.4, desc: 'Atrapa cardúmenes de peces chicos.' },
  { id: 'red2', nombre: 'Red Reforzada', precio: 3500, radio: 5, alcance: 18, dureza: 2, tope: 9, enfr: 3.0, desc: 'Más grande y con hilo grueso.' },
  { id: 'red3', nombre: 'Red Gigante', precio: 22000, radio: 6.6, alcance: 23, dureza: 3, tope: 14, enfr: 2.6, desc: 'Barre media orilla de un tirón.' },
];
const DINAMITA = { id: 'dinamita', nombre: 'Dinamita', precio: 90, pack: 5, radio: 7, dano: 260, mecha: 1.4, alcance: 24, dureza: 4, desc: 'Explota a los 1,4 segundos. Cuidado con los pies.' };
const CARNADA_JEFE = { id: 'carnada', nombre: 'Carnada de jefe', precio: 250, desc: 'Atrae a un jefe cercano. Se gasta cuando pica.' };

const MOCHILAS = [
  { id: 'm0', nombre: 'Bolsita de red', cap: 12, precio: 0 },
  { id: 'm1', nombre: 'Mochila de lona', cap: 24, precio: 400 },
  { id: 'm2', nombre: 'Mochila de pescador', cap: 40, precio: 2400 },
  { id: 'm3', nombre: 'Conservadora portátil', cap: 70, precio: 12000 },
  { id: 'm4', nombre: 'Heladera con ruedas', cap: 120, precio: 50000 },
  { id: 'm5', nombre: 'Cámara frigorífica', cap: 200, precio: 150000 },
];
const CHALECOS = [
  { id: 'c0', nombre: 'Camisa floreada', hp: 100, precio: 0 },
  { id: 'c1', nombre: 'Chaleco salvavidas', hp: 130, precio: 800 },
  { id: 'c2', nombre: 'Chaleco reforzado', hp: 170, precio: 6500 },
  { id: 'c3', nombre: 'Traje de neopreno', hp: 220, precio: 32000 },
  { id: 'c4', nombre: 'Armadura de coral', hp: 300, precio: 130000 },
];

// Comida y curas (Doña Rosa)
const COMIDAS = [
  { id: 'mate', nombre: 'Mate con facturas', precio: 12, hambre: 12, hp: 4, icono: '🧉' },
  { id: 'empanada', nombre: 'Empanada de carne', precio: 28, hambre: 28, icono: '🥟' },
  { id: 'milanesa', nombre: 'Milanesa a caballo', precio: 70, hambre: 52, hp: 10, icono: '🍳' },
  { id: 'guiso', nombre: 'Guiso de mariscos', precio: 160, hambre: 75, buff: { id: 'fuerza', mult: 1.15, dur: 180, txt: 'Fuerza +15%' }, icono: '🍲' },
  { id: 'parrilla', nombre: 'Parrillada completa', precio: 420, hambre: 100, hp: 30, buff: { id: 'todo', mult: 1.12, dur: 300, txt: 'Todo +12%' }, icono: '🍖' },
];
const CURAS = [
  { id: 'vendas', nombre: 'Vendas', precio: 45, hp: 30, icono: '🩹' },
  { id: 'botiquin', nombre: 'Botiquín', precio: 160, hp: 80, icono: '🧰' },
  { id: 'elixir', nombre: 'Elixir de Doña Rosa', precio: 650, hp: 9999, icono: '🧪' },
];
const ITEMS = Object.fromEntries([...COMIDAS, ...CURAS].map((i) => [i.id, i]));
ITEMS.dinamita = { id: 'dinamita', nombre: 'Dinamita', icono: '🧨' };
ITEMS.carnada = { id: 'carnada', nombre: 'Carnada de jefe', icono: '🦐' };
ITEMS.corona = { id: 'corona', nombre: 'Corona del Leviatán', icono: '👑' };

// Botes: abren el mundo. maxD = hasta qué distancia de cualquier costa aguanta el mar.
const BOTES = [
  { id: 'remo', nombre: 'Bote a remo', precio: 1500, vel: 5.4, giro: 1.7, maxD: 105, color: '#e8d5a8', desc: 'Liviano y silencioso. Llega al arrecife y a los islotes cercanos.' },
  { id: 'lancha', nombre: 'Lancha con motor', precio: 20000, vel: 12.5, giro: 1.45, maxD: 200, color: '#2f9bd0', desc: 'Rápida. Llega al mar abierto y al naufragio.' },
  { id: 'pesquero', nombre: 'Pesquero', precio: 120000, vel: 17, giro: 1.05, maxD: 99999, color: '#e0553d', desc: 'Cruza el abismo sin pestañear. Casi no se mueve con las olas.' },
];

// Barco (final del juego)
const BARCO = { precio: 450000, nombre: 'Reparar el barco' };

// Fichas del casino
const FICHAS = [10, 50, 100, 500, 1000, 5000, 25000, 100000];

// Constantes de pesca
const PESCA = {
  pierLen: 36, // largo del muelle (m) más allá de la costa
  ventanaPique: 1.15, // segundos para clavar
  hambreSeg: 100 / 780, // hambre que baja por segundo (de 100 a 0 en ~13 min)
  diaSeg: 420, // un día completo dura 7 minutos reales
};
