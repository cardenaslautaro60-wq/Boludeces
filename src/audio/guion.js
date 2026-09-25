// Guion de todo lo que se dice en voz alta: la radio de Santiago Sánchez, los anuncios de
// Radio Comodoro, la gente con la que se habla y los gritos de la calle. Está aparte para que
// tools/voz/ genere las voces grabadas con exactamente las mismas frases.

// "La Ciudad Perdida" (1992-2016): el programa de Santiago Sánchez, humor para mirar la realidad
// desde otro lado y criticar al poder. Estos textos son ficción escrita en homenaje.
export const SANTIAGO = 'Santiago Sánchez';
export const TALK = [
  'Buenas noches, Comodoro. Esto es La Ciudad Perdida. Una ciudad que se pierde todos los días un poco, sobre todo cuando sopla del Oeste.',
  'Dicen que Comodoro es la Capital Nacional del Petróleo. Del petróleo, sí. De la capital, ni noticias.',
  'Sección filosofía cotidiana: si una bolsa de La Anómala vuela del Km 3 a Rada Tilly, ¿cambia de barrio o cambia de clase social?',
  'Don Crudo anunció que va a perforar donde haya petróleo. O sea, en cualquier lado donde viva alguien que no pueda pagar un abogado.',
  'El comisario Tenpesos dice que va a limpiar el Centro. Empezó por los bolsillos de los malabaristas. Yo sé de qué me río.',
  'Informe del tránsito: la Ruta 3 por el Chenque, cortada. Si llegás tarde al laburo, decí que fue el cerro. Es la única excusa que nadie discute.',
  'El viento de hoy viene con ráfagas de ciento veinte. Técnicamente no es viento: es la Patagonia pidiéndote amablemente que te vayas.',
  'Llamó un oyente del barrio 9 de Julio: pregunta si es cierto que quieren perforar La Madriguera. Tranquilo: primero tienen que encontrar el arco.',
  'En Comodoro hay dos estaciones del año: la del viento y la de esperar que pare el viento.',
  'El boom petrolero trajo chatas nuevas, alquileres imposibles y una pregunta filosófica: ¿se puede ser feliz con sueldo de boca de pozo? Consulten al Petroca.',
  'Sección "el poder explicado para chicos": el poder es cuando uno decide dónde se perfora y otro tiene que decidir dónde vive. Casi nunca es la misma persona.',
  'Nos escribe una señora de Rada Tilly: "mi hijo anda con una patota". Señora, eso no es una patota: es un club náutico con remeras violetas.',
  'Un minuto de silencio por los paraguas de Comodoro, que murieron dignamente en cumplimiento del deber.',
  'Estás escuchando La Ciudad Perdida: radio para leer, para pensar y para reírse de lo que haya que reírse. Y de lo otro también.',
  'El humor no es contar chistes. El humor es mirar la realidad desde otro lado. Por ejemplo, desde arriba del Chenque, que es donde te deja la cana.',
  'Dato científico: el comodorense camina inclinado treinta grados hacia el Oeste. No es mala postura. Es experiencia.',
  'La Municipalidad informa que las bolsas enganchadas en los alambrados ya son patrimonio cultural. Se ruega no tocarlas.',
  '¿Por qué los malabaristas trabajan en el semáforo? Porque es el único lugar de la ciudad donde todos, por un minuto, se quedan quietos y miran.',
  'Pregunta del día: si el Petroca cobra el bono y lo gasta en un fin de semana en Buenos Aires, ¿el bono vuelve alguna vez al Chubut?',
  'Hoy en el Centro, el comisario Tenpesos declaró que la seguridad está garantizada. La suya, se entiende.',
  'A los que dicen que en Comodoro no pasa nada: acá pasa todo. Lo que pasa es que pasa volando.',
  'Parte meteorológico: nublado en el Centro, despejado en Rada Tilly, y en el Km 8 no sabemos porque se voló el anemómetro.',
  'Se viene el clásico Newbery–Huracán. Recomendación: no discutan en la Costanera, que el viento se lleva los argumentos.',
  'Llegamos al final del bloque. Gracias por perderse con nosotros. Ya volvemos a perdernos. Yo sé de qué me río.',
];
export const BUMPERS = {
  cumbia: ['Acá Santiago Sánchez. Les dejo cumbia, que es lo único que tapa el ruido del viento.', 'Cumbia en Comodoro: ni el temporal la para.'],
  rock: ['Rock del Golfo. Si el rock nacional es la banda sonora de la bronca, en Comodoro tenemos para rato.', 'Subile el volumen, que afuera sopla fuerte.'],
  electro: ['Boliche FM: para los que salen a las tres de la mañana y vuelven cuando para el viento. O sea, el martes.'],
  folk: ['Chacarera. El único ritmo que las cigüeñas de la meseta bailan sin parar.'],
  tango: ['Tango, porque en Comodoro también hay nostalgia. Y casi toda viene de otra provincia.'],
  any: ['Te habla Santiago Sánchez. Seguí escuchando la radio, que afuera está peor.', 'La Ciudad Perdida, todas las noches. Perderse también es una forma de llegar.'],
};


export const PED_LINES = {
  hit: ['¡Eh, qué hacé\', loco!', '¡Ay, la puta madre!', '¡Pará, pará!', '¡Te voy a denunciar!', '¡Salí de acá, gil!'],
  car: ['¡Mirá por dónde manejás!', '¡Aprendé a manejar, bolú!', '¡Casi me pisás!', '¡Sacaste el registro en una rifa!'],
  flee: ['¡Socorro!', '¡Llamen a la cana!', '¡Corré, corré!', '¡Está loco este!'],
  gordopin: ['¡Aguante el Lobo, Gordopin!', '¡Eh, Gordopin! ¡Hacé los malabares!', '¡Vamos Newbery!', '¡Buena, Gordo!'],
  wind: ['¡Qué viento, la puta!', 'Se me voló la gorra...', 'Hoy sopla fuerte, eh.', 'Ni el perro sale con este viento.'],
  cheto: ['¿Y vos quién sos, negro?', 'Mi viejo es gerente de la petrolera.', 'Salí de mi playa.', 'Esto es Rada, no el Km 8.'],
  cana: ['¡Alto, policía!', '¡Al suelo!', '¡Quieto ahí!', '¡Documentos!'],
};

export const HEADLINES = [
  'VIENTO: RÁFAGAS DE 120 KM/H. SE VOLÓ EL TECHO DE UN KIOSCO EN EL KM 5',
  'EL LOBO GANÓ EN LA MADRIGUERA Y LA CARAVANA LLEGÓ HASTA LA COSTANERA',
  'SIGUEN LOS CORTES DE LOS PETROLEROS EN LA RUTA 3',
  'VECINOS DICEN HABER VISTO A UN GORDO HACIENDO MALABARES A LAS 3 DE LA MAÑANA',
  'EL BARRIL SUPERÓ LOS 40 DÓLARES: EN EL KM 3 NO ALCANZAN LAS CHATAS',
  'OTRA VEZ SIN LUZ MEDIO COMODORO: "FUE EL VIENTO", DICE LA COOPERATIVA',
  'RADA TILLY: PIDEN NO DEJAR LAS SOMBRILLAS CLAVADAS CON ESTE VIENTO',
  'CALETA CÓRDOVA: LOS PESCADORES VOLVIERON CON EL CAJÓN LLENO',
  'LOBOS MARINOS EN PUNTA DEL MARQUÉS: "HAY MÁS QUE EN LA TRIBUNA DE NEWBERY"',
  'EL CHENQUE SIGUE AHÍ, DICEN LOS EXPERTOS',
];
export const TIPS = [
  'Dicen que si escribís SUPERSALTO saltás como un guanaco.',
  'Un petrolero me juró que escribiendo PETRODOLARES te llegan las regalías.',
  'Si escribís CHENQUE aparecés arriba del cerro. No me preguntes cómo.',
  'En el Centro dicen que escribiendo VIENTAZO se arma un temporal.',
  'Con BALASINFINITAS dicen que no hace falta recargar nunca.',
  'Si escribís NEVADA... bueno, en Comodoro nieva poco, pero nieva.',
];
export const STORIES = [
  ['¿Sabías que el petróleo lo encontraron en 1907 buscando agua?', 'Querían agua para el pueblo y salió crudo.', 'Así es Comodoro, pibe: pedís una cosa y te sale otra.'],
  ['Comodoro se fundó en 1901. Era un puerto para sacar la lana.', 'Después vino el petróleo y llegó gente de todos lados.', 'Chilenos, bolivianos, bóers, italianos... acá somos todos de afuera.'],
  ['Acá el viento te despeina hasta el documento.', 'Yo una vez perdí el sombrero en el Km 3...', '...y lo encontré en Rada Tilly. Tres días después.'],
  ['Desde acá arriba se ve todo el Golfo San Jorge.', 'A la izquierda, Rada Tilly y Punta del Marqués, con los lobos marinos.', 'A la derecha, el Km 5, el Km 8 y allá lejos Caleta Córdova.'],
];


// Gente con la que se habla (src/game/npcs.js)
export const NPC_LINES = {
  canillita: {
    greet: ['¡El Patagónnico! ¡Diario, diario!', '¡Salió la edición de hoy!'],
    broke: 'No te alcanza ni para el diario, maestro.',
    sell: 'Dos pesitos. Tomá, fresquito.',
  },
  choripanero: {
    greet: ['¡Chori, bondiola, vacío! ¡Con viento incluido!', '¡El mejor chori de la Costanera!'],
    ask: '¿Un choripán completo por quince pesos?',
    broke: 'Sin plata no hay chori, hermano.',
    yes: ['¡Ahí tenés! Con chimichurri de la casa.', 'Cuidá que no se te vuele el pan.'],
    no: 'Vos te lo perdés. Mirá que se termina.',
  },
  rosa: {
    greet: ['Ay, nene, ¿me das una mano?', 'Estos colectivos nunca llegan a horario...'],
    ask: '¿Le llevás el bolso a mi hija? Vive en el Km 3, al lado del Museo del Petróleo.',
    done: 'Gracias otra vez, nene. Mi hija te manda saludos.',
    lost: 'Ay, me olvidé a dónde iba...',
    yes: ['¡Qué amoroso! Está al lado del Museo del Petróleo, en el Km 3.', 'Apurate que tiene las tortas fritas en el horno.'],
    no: 'Bueno, bueno. Ya pasará algún otro buen muchacho.',
    thanks: '¡Gracias, nene! Llevate unas tortas fritas, que están calentitas.',
  },
  petrolero: {
    greet: ['¡Eh, vos! ¿Querés hacerte unos pesos?', 'Se rompió la bomba del pozo y no hay chofer...'],
    ask: 'Hay una changa: llevar un repuesto de bomba al yacimiento de Restinga Alí en tres minutos. Son cuatrocientos pesos.',
    none: 'Hoy no hay changa, volvé mañana.',
    yes: ['¡Buenísimo! Va en la caja de la chata que tengas.', 'Si llegás tarde, el capataz me mata. ¡Rajá!'],
    no: 'Bueno, le digo al Turco que lo lleve él.',
    thanks: 'Changa cumplida. Volvé cuando quieras, que laburo sobra.',
  },
  viejo: {
    greet: ['Qué vista, ¿eh?', 'Sentate, pibe, que te cuento una.'],
  },
  barra: {
    greet: ['¡Aguante el Lobo, loco!', '¡Dale, dale, dale Newbery!'],
    talk: ['¿Sos del Lobo? ¡Cantá con nosotros!', '¡Y dale, dale, dale Newbery, dale dale Lobo, que esta tarde tenemos que ganar!'],
  },
};

// Anuncios de Radio Comodoro cuando pasa algo (src/game/events.js)
export const EVENT_TEXT = {
  vientazo: 'Alerta por viento en todo Comodoro: ráfagas de más de cien kilómetros por hora. Agárrense de algo.',
  tierra: 'Temporal de tierra: se levantó la meseta entera. Manejen con las luces prendidas.',
  nevada: '¡Está nevando en Comodoro! Sí, escuchó bien. Cuidado en la Ruta 3 y en la subida del Chenque.',
  apagon: 'Se cortó la luz en varios barrios. La cooperativa dice que fue el viento... como siempre.',
  aniversario: '¡Feliz aniversario, Comodoro! Fuegos artificiales en la Costanera. ¡Salgan a mirar!',
  caravana: 'Ganó el Lobo y la caravana de Newbery sale a festejar por las calles. ¡Bocinazo general!',
  piquete: 'Corte total de petroleros autoconvocados. Busquen un camino alternativo.',
};
