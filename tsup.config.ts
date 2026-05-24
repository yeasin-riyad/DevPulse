import { defineConfig } from 'tsup';

export default defineConfig({
  // 1. Entry points for the bundler
  entry: ['src/server.ts'],

  // 2. Output formats: CommonJS and ES Modules
  format: ['esm'],
  target:'esnext',
  outDir:'dist',

  

  // 4. Clear the output directory before each build
  clean: true,
  bundle:true,
  splitting:false,

  // 5. Generate source maps for debugging
  sourcemap: true,

  // 6. Minify output code for production
  minify: true,

  // 7. Prevent bundling external dependencies
  external: ['react', 'lodash'],
  banner:{
    js:`
    import {createRequire} from 'module';
    const require=createRequire(import.meta.url);
    `,
  },
});
