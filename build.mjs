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

  // Copy TypeScript declarations to both CJS and ESM directories
  cpSync('./dist/types', './dist/cjs', { recursive: true });
  cpSync('./dist/types', './dist/esm', { recursive: true });

  console.log('Build complete!');
}

build().catch(() => process.exit(1));
