import visaSvg from '@/assets/svg/visa.svg';
import mastercardSvg from '@/assets/svg/mastercard.svg';
import dinnersSvg from '@/assets/svg/dinners.svg';
import discoverSvg from '@/assets/svg/discover.svg';
import pichinchaSvg from '@/assets/svg/bancoPichincha.svg';

/**
 * Medios de pago aceptados — logos oficiales, sin marcos ni fondos: los SVG de
 * las tarjetas ya traen su propia tarjeta blanca, PayPhone su cuadro naranja y
 * el wordmark de Pichincha se lee directo sobre el fondo del sitio.
 */
const LOGOS = [
  { src: '/pagos/payphone-icon.png', alt: 'PayPhone', cls: 'h-10' },
  { src: visaSvg.src, alt: 'Visa', cls: 'h-10' },
  { src: mastercardSvg.src, alt: 'Mastercard', cls: 'h-10' },
  { src: dinnersSvg.src, alt: 'Diners Club', cls: 'h-10' },
  { src: discoverSvg.src, alt: 'Discover', cls: 'h-10' },
  { src: pichinchaSvg.src, alt: 'Banco Pichincha', cls: 'h-6' },
];

interface PaymentMethodIconsProps {
  className?: string;
}

export default function PaymentMethodIcons({ className = '' }: PaymentMethodIconsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-3 ${className}`}>
      {LOGOS.map((logo) => (
        <img
          key={logo.alt}
          src={logo.src}
          alt={logo.alt}
          title={logo.alt}
          className={`${logo.cls} w-auto object-contain`}
        />
      ))}
    </div>
  );
}
