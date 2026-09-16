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
  site: 'https://livi.ec',
  output: 'hybrid',
  adapter: node({ mode: 'standalone' }),
  integrations: [react()],
  // El CSS de página (~15 KiB) no sale como <link> bloqueante: va en el HTML.
  build: {
    inlineStylesheets: 'always',
  },
  server: {
    port: 4321,
  },
  vite: {
    // Las islas React leen VITE_* (API, Google, clave de storage). Astro solo
    // expone PUBLIC_* al navegador por defecto: sin esto el checkout, login y
    // subida de comprobante pegaban al fallback en vez de VITE_API_BASE_URL.
    envPrefix: ['PUBLIC_', 'VITE_'],
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },
});
