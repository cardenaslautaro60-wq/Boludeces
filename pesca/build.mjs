// Compila Isla Anzuelo (3D): empaqueta Three.js y arma una sola página HTML con todo adentro.
//   node pesca/build.mjs                      -> build/three.global.js y dist/isla-anzuelo.html
//   node pesca/build.mjs --artifact=ruta.html -> además, solo el contenido (sin <html>/<head>) para publicar como Artifact
import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const R = (...p) => resolve(aqui, ...p);
const artefacto = (process.argv.find((a) => a.startsWith('--artifact=')) || '').slice(11);

// 1) Three.js como global
mkdirSync(R('build'), { recursive: true });
await esbuild.build({
  entryPoints: [R('vendor/three-entry.js')], bundle: true, format: 'iife', globalName: 'THREE', minify: true,
  outfile: R('build/three.global.js'), legalComments: 'none', logLevel: 'warning', target: 'es2020',
  nodePaths: [resolve(aqui, '..', 'node_modules')],
});
const three = readFileSync(R('build/three.global.js'), 'utf8');

// 2) Los scripts salen de index.html, en el mismo orden
const html = readFileSync(R('index.html'), 'utf8');
const srcs = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);
const propios = srcs.filter((s) => s.startsWith('src/'));
const css = readFileSync(R('src/style.css'), 'utf8');
const js = propios.map((s) => `// ---- ${s}\n` + readFileSync(R(s), 'utf8')).join('\n');
const seguro = (t) => t.replace(/<\/script/gi, '<\\/script');

const fuentes = (html.match(/<link[^>]+(fonts\.googleapis|fonts\.gstatic)[^>]+>/g) || []).join('\n');
const titulo = (html.match(/<title>[^<]*<\/title>/) || ['<title>Isla Anzuelo</title>'])[0];
const cuerpo = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>')).replace(/<script src="[^"]+"><\/script>\s*/g, '').trim();

const contenido = `${titulo}\n${fuentes}\n<style>\n${css}\n</style>\n${cuerpo}\n<script>\n${seguro(three)}\n</script>\n<script>\n${seguro(js)}\n</script>\n`;
const completo = `<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${titulo}\n${fuentes}\n<style>\n${css}\n</style>\n</head>\n<body>\n${cuerpo}\n<script>\n${seguro(three)}\n</script>\n<script>\n${seguro(js)}\n</script>\n</body>\n</html>\n`;

mkdirSync(R('dist'), { recursive: true });
writeFileSync(R('dist/isla-anzuelo.html'), completo);
console.log(`dist/isla-anzuelo.html  ${(completo.length / 1024).toFixed(0)} KB`);
if (artefacto) {
  mkdirSync(dirname(resolve(artefacto)), { recursive: true });
  writeFileSync(resolve(artefacto), contenido);
  console.log(`artifact: ${artefacto}  ${(contenido.length / 1024).toFixed(0)} KB`);
}
void existsSync;
