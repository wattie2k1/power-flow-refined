import { build } from 'esbuild';

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  format: 'esm',
  target: 'es2021',
  minify: true,
  outfile: 'dist/power-flow-refined.js',
  tsconfigRaw: { compilerOptions: { experimentalDecorators: true, useDefineForClassFields: false } },
});
