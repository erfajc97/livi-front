import { f as createComponent, h as addAttribute, n as renderHead, l as renderSlot, r as renderTemplate, i as createAstro, m as maybeRenderHead } from './astro/server_DrPyCXaf.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                               */

const $$Astro = createAstro();
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title = "N\xF6nDecants \u2014 Perfumes sellados, decants y nondecants",
    description = "Compra perfumes sellados, decants y nondecants en Ecuador. Env\xEDos a todo el pa\xEDs v\xEDa Servientrega."
  } = Astro2.props;
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"${addAttribute(description, "content")}><title>${title}</title><link rel="icon" type="image/svg+xml" href="/favicon.svg"><!-- Google Fonts: Oswald + Inter --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">${renderHead()}</head> <body> <!-- Sin AppProviders aquí: cada island gestiona su propio QueryClientProvider
         con el singleton de queryClient.ts. Zustand no necesita provider. --> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/layouts/BaseLayout.astro", void 0);

const $$AnnouncementBar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="w-full bg-accent-hover"> <p class="max-w-7xl mx-auto px-4 py-2 text-center text-xs font-semibold text-bg tracking-[0.05em]">
100% Compra segura aprovecha nuestros descuentos, compra con confianza
</p> </div>`;
}, "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/app/features/landing/components/layout/AnnouncementBar.astro", void 0);

export { $$BaseLayout as $, $$AnnouncementBar as a };
