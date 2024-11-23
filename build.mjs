import esbuild from 'esbuild';
import { cpSync } from 'fs';

const sharedConfig = {
  entryPoints: ['./src/index.ts'], // Adjust this to your entry file
  bundle: true,
  sourcemap: true,
  minify: false,
  logLevel: 'info',
  platform: 'node', // Specify Node.js platform
};

async function build() {
  // Build for ESM
  await esbuild.build({
    ...sharedConfig,
    format: 'esm',
    outdir: 'dist/esm',
  });

  // Build for CJS
  await esbuild.build({
    ...sharedConfig,
    format: 'cjs',
    outdir: 'dist/cjs',
  });

  console.log('Build complete!');
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
