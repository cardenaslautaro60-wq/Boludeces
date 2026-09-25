// Junta todas las frases que se dicen en voz alta y a qué voz le toca cada una.
// Uso: node tools/voz/lineas.mjs > lineas.json   (lo usa tools/voz/generar.py)
import { readFileSync } from 'node:fs';
import { TALK, BUMPERS, PED_LINES, TIPS, STORIES, NPC_LINES, EVENT_TEXT } from '../../src/audio/guion.js';
import { voiceKey, SPEAKERS as WHO } from '../../src/audio/vozkey.js';

const out = [];
const seen = new Set();
const add = (voice, text) => {
  const key = voiceKey(voice, text);
  if (!text || seen.has(key)) return;
  seen.add(key);
  out.push({ key, voice, text });
};
TALK.forEach((t) => add('santiago', t));
Object.values(BUMPERS).flat().forEach((t) => add('santiago', t));
Object.values(EVENT_TEXT).forEach((t) => add('locutora', t));
for (const [id, L] of Object.entries(NPC_LINES)) for (const v of Object.values(L)) (Array.isArray(v) ? v : [v]).forEach((t) => add(id, t));
TIPS.forEach((t) => { add('canillita', t); add('viejo', t); });
STORIES.flat().forEach((t) => add('viejo', t));
for (const k of ['hit', 'car', 'flee', 'wind', 'gordopin']) PED_LINES[k].forEach((t) => add('vecino', t));
PED_LINES.cana.forEach((t) => add('cana', t));
PED_LINES.cheto.forEach((t) => add('cheto', t));

// diálogos de las misiones: c.say('Quién', 'texto') (los que arman el texto con ${...} quedan con la voz del navegador)
const src = readFileSync(new URL('../../src/game/missions.js', import.meta.url), 'utf8');
const re = /c\.say\(\s*'([^']*)'\s*,\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\$]|\\.)*`)/g;
let m;
while ((m = re.exec(src))) {
  const who = m[1];
  const text = new Function('return ' + m[2])();
  add(WHO[who] || 'vecino', text);
}
process.stdout.write(JSON.stringify(out, null, 1));
