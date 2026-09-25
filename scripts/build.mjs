// Compila el juego con esbuild.
//  - build/game.js: bundle para index.html (funciona con doble clic, sin servidor)
//  - dist/gta-san-jorge.html: una sola página autocontenida (para publicar)
import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const watch = process.argv.includes('--watch');
const opts = {
  entryPoints: ['src/main.js'],
  bundle: true,
  format: 'iife',
  target: 'es2020',
  minify: !watch,
  sourcemap: watch ? 'inline' : false,
  outfile: 'build/game.js',
  legalComments: 'none',
  logLevel: 'info',
};

// Genera una sola página HTML con todo adentro.
//  full = true: documento completo (para descargar y abrir con doble clic)
//  full = false: solo el contenido (para publicar como Artifact)
function single(full, outPath) {
  const html = readFileSync('index.html', 'utf8');
  const css = readFileSync('src/style.css', 'utf8');
  const js = readFileSync('build/game.js', 'utf8').replace(/<\/script/gi, '<\\/script');
  const body = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'))
    .replace(/<script src="build\/game\.js"><\/script>/, '').replace(/<script src="media\/medios\.js"><\/script>/, '');
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
async function artifact(outPath) {
  const res = await esbuild.build({ ...opts, format: 'esm', external: ['three', 'three/*'], write: false, outfile: 'build/game.esm.js' });
  const js = res.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
  const pkg = JSON.parse(readFileSync('node_modules/three/package.json', 'utf8'));
  const cdn = `https://cdn.jsdelivr.net/npm/three@${pkg.version}`;
  const html = readFileSync('index.html', 'utf8');
  const css = readFileSync('src/style.css', 'utf8');
  const body = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>')).replace(/<script src="build\/game\.js"><\/script>/, '').replace(/<script src="media\/medios\.js"><\/script>/, '');
  const fonts = (html.match(/<link[^>]+fonts\.googleapis[^>]+>/g) || []).join('\n');
  const title = (html.match(/<title>[^<]*<\/title>/) || [''])[0];
  const importmap = JSON.stringify({ imports: { three: `${cdn}/build/three.module.min.js`, 'three/': `${cdn}/` } });
  const out = `${title}\n${fonts}\n<style>\n${css}\n</style>\n${body}\n<script type="importmap">${importmap}</script>\n<script type="module">\n${js}\n</script>\n`;
  mkdirSync(outPath.split('/').slice(0, -1).join('/') || '.', { recursive: true });
  writeFileSync(outPath, out);
  console.log(outPath, (out.length / 1024).toFixed(0) + ' KB');
}

if (watch) {
  const ctx = await esbuild.context(opts);
  await ctx.watch();
  console.log('Mirando cambios...');
} else {
  await esbuild.build(opts);
  single(true, 'dist/gta-san-jorge.html');
  const art = process.argv.find((a) => a.startsWith('--artifact='));
  if (art) await artifact(art.slice('--artifact='.length));
}
