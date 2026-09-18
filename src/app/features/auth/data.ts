import { BTN_PRIMARY, INPUT_UNDERLINE, LABEL_MONO } from '@/app/components/UI/formClasses';

/**
 * Auth reutiliza el sistema de formularios del flujo de compra
 * (`components/UI/formClasses`): el modal de login aparece dentro del
 * checkout, así que el botón y los campos tienen que ser los mismos.
 * Se mantienen los alias AUTH_* para no tocar los componentes que ya los
 * importan.
 */
export const AUTH_INPUT_CLASS = INPUT_UNDERLINE;

export const AUTH_SUBMIT_CLASS = BTN_PRIMARY;

export const AUTH_LABEL_CLASS = `mb-2 block ${LABEL_MONO}`;

/** Propio de auth: el botón de Google va en contorno, nunca compite con el CTA. */
export const AUTH_GOOGLE_BTN_CLASS =
  'w-full flex items-center justify-center gap-2.5 border border-border py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-text transition-colors hover:border-text';
