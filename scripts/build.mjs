// Compila el juego con esbuild. Dos versiones:
//  - PS2 (la original): build/game.js para index.html y dist/gta-san-jorge.html
//  - Realista: build/game-realista.js para realista.html y dist/gta-san-jorge-realista.html
// Opciones: --watch, --solo=ps2|realista, --artifact=ruta.html, --artifact-realista=ruta.html
import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const watch = process.argv.includes('--watch');
const solo = (process.argv.find((a) => a.startsWith('--solo=')) || '').slice(7);
const VARIANTS = {
  ps2: { entry: 'src/main.js', out: 'build/game.js', html: 'index.html', dist: 'dist/gta-san-jorge.html' },
  realista: { entry: 'src/main-realista.js', out: 'build/game-realista.js', html: 'realista.html', dist: 'dist/gta-san-jorge-realista.html' },
};
const base = {
  bundle: true,
  format: 'iife',
  target: 'es2020',
  minify: !watch,
  sourcemap: watch ? 'inline' : false,
  legalComments: 'none',
  logLevel: 'info',
  loader: { '.webp': 'dataurl', '.bin': 'binary' },
};
const optsFor = (v) => ({ ...base, entryPoints: [v.entry], outfile: v.out });

// Genera una sola página HTML con todo adentro.
//  full = true: documento completo (para descargar y abrir con doble clic)
//  full = false: solo el contenido (para publicar como Artifact)
function single(v, full, outPath) {
  const html = readFileSync(v.html, 'utf8');
  const css = readFileSync('src/style.css', 'utf8');
  const js = readFileSync(v.out, 'utf8').replace(/<\/script/gi, '<\\/script');
  const body = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'))
    .replace(/<script src="build\/game(-realista)?\.js"><\/script>/, '').replace(/<script src="media\/medios\.js"><\/script>/, '');
  const fonts = (html.match(/<link[^>]+fonts\.googleapis[^>]+>/g) || []).join('\n');
  const title = (html.match(/<title>[^<]*<\/title>/) || [''])[0];
  const inner = `${fonts}\n<style>\n${css}\n</style>\n${body}\n<script>\n${js}\n</script>\n`;
  const out = full
    ? `<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${title}\n${inner.split('<style>')[0]}<style>${inner.split('<style>')[1].split('</style>')[0]}</style>\n</head>\n<body>\n${body}\n<script>\n${js}\n</script>\n</body>\n</html>\n`
    : `${title}\n${inner}`;
  mkdirSync(outPath.split('/').slice(0, -1).join('/') || '.', { recursive: true });
  writeFileSync(outPath, out);
  console.log(outPath, (out.length / 1024).toFixed(0) + ' KB');
}

// Versión para publicar como Artifact: Three.js se carga desde jsDelivr con un importmap
async function artifact(v, outPath) {
  const res = await esbuild.build({ ...optsFor(v), format: 'esm', external: ['three'], write: false, outfile: 'build/game.esm.js' });
  const js = res.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
  const pkg = JSON.parse(readFileSync('node_modules/three/package.json', 'utf8'));
  const cdn = `https://cdn.jsdelivr.net/npm/three@${pkg.version}`;
  const html = readFileSync(v.html, 'utf8');
  const css = readFileSync('src/style.css', 'utf8');
  const body = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>')).replace(/<script src="build\/game(-realista)?\.js"><\/script>/, '').replace(/<script src="media\/medios\.js"><\/script>/, '');
  const fonts = (html.match(/<link[^>]+fonts\.googleapis[^>]+>/g) || []).join('\n');
  const title = (html.match(/<title>[^<]*<\/title>/) || [''])[0];
  // (three/addons/ es un alias del package.json; en el CDN la carpeta real es examples/jsm/)
  const importmap = JSON.stringify({ imports: { three: `${cdn}/build/three.module.min.js`, 'three/addons/': `${cdn}/examples/jsm/`, 'three/': `${cdn}/` } });
  const out = `${title}\n${fonts}\n<style>\n${css}\n</style>\n${body}\n<script type="importmap">${importmap}</script>\n<script type="module">\n${js}\n</script>\n`;
  mkdirSync(outPath.split('/').slice(0, -1).join('/') || '.', { recursive: true });
  writeFileSync(outPath, out);
  console.log(outPath, (out.length / 1024).toFixed(0) + ' KB');
}

const names = solo ? [solo] : Object.keys(VARIANTS);
if (watch) {
  for (const n of names) {
    const ctx = await esbuild.context(optsFor(VARIANTS[n]));
    await ctx.watch();
  }
  console.log('Mirando cambios...');
} else {
  for (const n of names) {
    await esbuild.build(optsFor(VARIANTS[n]));
    single(VARIANTS[n], true, VARIANTS[n].dist);
  }
  const art = process.argv.find((a) => a.startsWith('--artifact='));
  if (art) await artifact(VARIANTS.ps2, art.slice('--artifact='.length));
  const artR = process.argv.find((a) => a.startsWith('--artifact-realista='));
  if (artR) await artifact(VARIANTS.realista, artR.slice('--artifact-realista='.length));
}
