// Clave de cada frase grabada: voz + hash del texto (el mismo en el juego y en tools/voz)
export function voiceKey(voice, text) {
  let h = 5381;
  const s = String(text).normalize('NFC');
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return voice + '|' + h.toString(36);
}

// Quién dice cada diálogo de las misiones (nombre en el subtítulo → voz grabada)
export const SPEAKERS = {
  '': 'narrador', Gordopin: 'gordopin', Petroca: 'petroca', Tenpesos: 'tenpesos', 'Cacho, el utilero': 'cacho',
  'El Chino': 'chino', 'El chorizero': 'choripanero', Pulenta: 'pulenta', Nahuel: 'nahuel',
};
