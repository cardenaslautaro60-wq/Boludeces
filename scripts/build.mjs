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
    .replace(/<script src="build\/game\.js"><\/script>/, '');
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

if (watch) {
  const ctx = await esbuild.context(opts);
  await ctx.watch();
  console.log('Mirando cambios...');
} else {
  await esbuild.build(opts);
  single(true, 'dist/gta-san-jorge.html');
  const art = process.argv.find((a) => a.startsWith('--artifact='));
  if (art) single(false, art.slice('--artifact='.length));
}
