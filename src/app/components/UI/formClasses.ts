/**
 * Clases de formulario compartidas — dialecto editorial LIVI.
 *
 * Por qué existe: el flujo de compra (checkout, carrito, auth y mi-cuenta)
 * repetía la misma botonera y los mismos inputs copiados a mano en cada
 * componente, y cada copia se fue desviando (unos con `font-body`, otros con
 * `font-display`, radios distintos, tracking distinto). Resultado: la misma
 * acción se veía diferente según la pantalla.
 *
 * Aquí viven las cuatro piezas que se repiten de verdad, con los tokens de
 * `src/styles/global.css` como única fuente de color y tipografía:
 * títulos en `font-heading` peso 400, labels y CTAs en `font-mono` versalitas
 * con tracking amplio, sin radios y con hairlines `border-border`.
 *
 * Regla: si una pantalla del flujo de compra necesita un botón o un input,
 * importa de aquí en vez de volver a escribir la cadena de clases.
 */

/** CTA principal: el paso que queremos que el cliente siga (burgundy + marco dorado). */
export const BTN_PRIMARY =
  'gold-frame w-full bg-accent py-4 font-mono text-[11px] uppercase tracking-[0.24em] text-bg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50';

/** Acción secundaria: mismo peso tipográfico, solo contorno. */
export const BTN_SECONDARY =
  'border border-text px-8 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-text transition-colors hover:border-accent hover:text-accent';

/** Rótulo de campo / eyebrow de bloque. */
export const LABEL_MONO =
  'font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted';

/** Campo de texto: subrayado a hairline, sin caja ni radio. */
export const INPUT_UNDERLINE =
  'w-full border-0 border-b border-border bg-transparent px-0 py-2.5 font-body text-sm text-text placeholder:text-text-muted transition-colors focus:border-text focus:ring-0';
