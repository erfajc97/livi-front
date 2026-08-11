import { PAYMENT_LOGOS } from './paymentLogos';

interface PaymentMethodIconsProps {
  className?: string;
}

/**
 * Medios de pago aceptados — logos oficiales, sin marcos ni fondos. El catálogo
 * y las alturas viven en `paymentLogos.ts` para que footer, ficha de producto,
 * carrito y combos se vean igual.
 */
export default function PaymentMethodIcons({ className = '' }: PaymentMethodIconsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-2.5 md:gap-x-4 md:gap-y-3 ${className}`}>
      {PAYMENT_LOGOS.map((logo) => (
        <img
          key={logo.alt}
          src={logo.src}
          alt={logo.alt}
          title={logo.alt}
          loading="lazy"
          className={`${logo.cls} w-auto object-contain`}
        />
      ))}
    </div>
  );
}
