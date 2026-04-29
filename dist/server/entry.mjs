import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_mb_1oN5j.mjs';
import { manifest } from './manifest_ZFgJJ8aL.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/bajo-pedido.astro.mjs');
const _page3 = () => import('./pages/blog/_slug_.astro.mjs');
const _page4 = () => import('./pages/blog.astro.mjs');
const _page5 = () => import('./pages/catalogo/combos.astro.mjs');
const _page6 = () => import('./pages/catalogo/perfumes.astro.mjs');
const _page7 = () => import('./pages/catalogo.astro.mjs');
const _page8 = () => import('./pages/checkout.astro.mjs');
const _page9 = () => import('./pages/combo/_id_.astro.mjs');
const _page10 = () => import('./pages/confirmacion.astro.mjs');
const _page11 = () => import('./pages/contacto.astro.mjs');
const _page12 = () => import('./pages/mi-cuenta.astro.mjs');
const _page13 = () => import('./pages/orden/confirmacion.astro.mjs');
const _page14 = () => import('./pages/orden/_id_.astro.mjs');
const _page15 = () => import('./pages/producto/_id_.astro.mjs');
const _page16 = () => import('./pages/rastrear.astro.mjs');
const _page17 = () => import('./pages/restablecer-contrasena.astro.mjs');
const _page18 = () => import('./pages/verificar-email.astro.mjs');
const _page19 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/bajo-pedido.astro", _page2],
    ["src/pages/blog/[slug].astro", _page3],
    ["src/pages/blog/index.astro", _page4],
    ["src/pages/catalogo/combos.astro", _page5],
    ["src/pages/catalogo/perfumes.astro", _page6],
    ["src/pages/catalogo.astro", _page7],
    ["src/pages/checkout.astro", _page8],
    ["src/pages/combo/[id].astro", _page9],
    ["src/pages/confirmacion.astro", _page10],
    ["src/pages/contacto.astro", _page11],
    ["src/pages/mi-cuenta.astro", _page12],
    ["src/pages/orden/confirmacion.astro", _page13],
    ["src/pages/orden/[id].astro", _page14],
    ["src/pages/producto/[id].astro", _page15],
    ["src/pages/rastrear.astro", _page16],
    ["src/pages/restablecer-contrasena.astro", _page17],
    ["src/pages/verificar-email.astro", _page18],
    ["src/pages/index.astro", _page19]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///C:/Users/Jaely/Documents/Nondecansts/nondecants-front/dist/client/",
    "server": "file:///C:/Users/Jaely/Documents/Nondecansts/nondecants-front/dist/server/",
    "host": false,
    "port": 4321,
    "assets": "_astro"
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
{
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
