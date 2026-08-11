import visaSvg from '@/assets/svg/visa.svg';
import mastercardSvg from '@/assets/svg/mastercard.svg';
import dinnersSvg from '@/assets/svg/dinners.svg';
import amexSvg from '@/assets/svg/amex.svg';
import discoverSvg from '@/assets/svg/discover.svg';
import pichinchaSvg from '@/assets/svg/bancoPichincha.svg';

export interface PaymentLogo {
  src: string;
  alt: string;
  /** Alto responsivo: compacto en mobile, un punto más grande desde md. */
  cls: string;
}

/**
 * Catálogo único de medios de pago — logos oficiales de cada marca.
 *
 * Las tarjetas traen su propia tarjeta blanca en el SVG, así que van más altas;
 * los bancos son wordmarks y se leen bien a menos altura. Payphone va con su
 * isotipo naranja, a la altura de las tarjetas. Cualquier cambio se hace acá:
 * footer, ficha de producto, carrito y combos consumen esta misma lista.
 */
export const PAYMENT_LOGOS: PaymentLogo[] = [
  { src: '/images/pagos/payphone.svg', alt: 'Payphone',         cls: 'h-6 md:h-7' },
  { src: visaSvg.src,                  alt: 'Visa',             cls: 'h-7 md:h-8' },
  { src: mastercardSvg.src,            alt: 'Mastercard',       cls: 'h-7 md:h-8' },
  { src: dinnersSvg.src,               alt: 'Diners Club',      cls: 'h-7 md:h-8' },
  { src: amexSvg.src,                  alt: 'American Express', cls: 'h-7 md:h-8' },
  { src: discoverSvg.src,              alt: 'Discover',         cls: 'h-7 md:h-8' },
  { src: pichinchaSvg.src,             alt: 'Banco Pichincha',  cls: 'h-4 md:h-5' },
  { src: '/images/pagos/banco-gye-logo.webp', alt: 'Banco Guayaquil', cls: 'h-5 md:h-6' },
  { src: '/images/pagos/produbanco.png',      alt: 'Produbanco',      cls: 'h-5 md:h-6' },
];

/** Rutas sueltas para los sitios que muestran un banco a la vez (checkout). */
export const BANK_LOGO_SRC = {
  pichincha: pichinchaSvg.src,
  guayaquil: '/images/pagos/banco-gye-logo.webp',
  produbanco: '/images/pagos/produbanco.png',
} as const;
