import { resolve } from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const BASE_URL_DEV = '/';
const BASE_URL_PROD = '/coffee-house/';

export default defineConfig(() => {
  return {
    root: 'src',
    base: process.env.NODE_ENV === 'production' ? BASE_URL_PROD : BASE_URL_DEV,
    build: {
      outDir: '../build',
      emptyOutDir: true,
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name][extname]',
        },
        input: {
          main: resolve(__dirname, 'src/index.html'),
          menu: resolve(__dirname, 'src/menu.html'),
        },
      },
    },
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: 'assets/**/*',
            dest: 'assets',
          },
        ],
      }),
    ],
    server: {
      port: 3000,
      open: true,
    },
  };
});
