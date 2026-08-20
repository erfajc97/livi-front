import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // Dominio público: sin esto las URLs absolutas de og:image y canonical se
  // arman con el host de la request, que en las páginas prerenderizadas es
  // localhost y rompe la vista previa al compartir.
  site: 'https://nondecants.com',
  output: 'hybrid',
  adapter: node({ mode: 'standalone' }),
  integrations: [react()],
  server: {
    port: 4321,
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },
});
