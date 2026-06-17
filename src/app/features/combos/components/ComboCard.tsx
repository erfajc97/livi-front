import { formatCurrency } from '@/app/helpers/formatCurrency';
import type { Combo } from '@/app/types/global.types';

interface ComboCardProps {
  combo: Combo;
}

export default function ComboCard({ combo }: ComboCardProps) {
  const comboImage = combo.imageUrl;
  const products = combo.comboProducts ?? [];

  const discount = combo.discount ?? 0;
  const hasDiscount = discount > 0;
  const actualPrice = hasDiscount ? combo.finalPrice - discount : combo.finalPrice;
  const discountPercent = hasDiscount ? Math.round((discount / combo.finalPrice) * 100) : 0;

  const comboInStock = products.every((cp) => {
    const prod = cp.product;
    if (!prod) return false;
    const sealedStock = prod.stock ?? 0;
    const openMl = Number(prod.openBottleMlRemaining ?? 0);
    const totalMl = Number(prod.totalMl ?? 0);
    const availableMl = openMl + sealedStock * totalMl;
    if (cp.productVariation) {
      return availableMl >= Number(cp.productVariation.mlSize ?? 0) * cp.quantity;
    }
    return sealedStock >= cp.quantity;
  });

  return (
    <a href={`/combo/${combo.id}`} className="group/card flex flex-col">
      {/* Imagen — formato editorial alargado (≈2:3, igual que ProductCard) */}
      <div className="relative aspect-2/3 overflow-hidden bg-surface-raised">
        {/* Frame con padding (más en eje Y) — la imagen no queda pegada al borde */}
        <div className="absolute inset-0 overflow-hidden px-3 py-5">
          <div className="relative h-full w-full overflow-hidden">
            {comboImage ? (
              <img
                src={comboImage}
                alt={combo.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-text-muted">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75">
                  <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a4 4 0 0 0-8 0v2" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Descuento — abajo izq. */}
        {discountPercent > 0 && (
          <span className="absolute bottom-5 left-3 bg-accent px-2.5 py-1 font-body text-[9px] font-medium uppercase tracking-[0.18em] text-bg">
            -{discountPercent}%
          </span>
        )}

        {/* Vista rápida — barra inferior al hover */}
        <div className="pointer-events-none absolute inset-x-3 bottom-5 flex translate-y-2 items-center justify-between bg-bg px-3.5 py-3 font-body text-[11px] uppercase tracking-[0.18em] text-text opacity-0 transition-all duration-300 ease-out group-hover/card:translate-y-0 group-hover/card:opacity-100">
          <span>Ver combo</span>
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="M13 6l6 6-6 6" />
          </svg>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 pt-4">
        {products.length > 0 && (
          <span className="font-body text-[10px] uppercase tracking-[0.22em] text-text-muted">
            {products.length} {products.length === 1 ? 'producto' : 'productos'}
          </span>
        )}

        <h3 className="font-display text-[22px] font-normal leading-tight tracking-[-0.005em] text-text">
          {combo.name}
        </h3>

        <div className="mt-3 flex items-baseline justify-between">
          <span className="font-body text-xs tracking-[0.04em] text-text">
            {hasDiscount ? (
              <>
                <span className="mr-2 text-text-muted line-through">{formatCurrency(combo.finalPrice)}</span>
                {formatCurrency(actualPrice)}
              </>
            ) : (
              formatCurrency(actualPrice)
            )}
          </span>
          <span
            className={`font-body text-[9px] uppercase tracking-[0.18em] ${
              comboInStock ? 'text-text-muted' : 'text-error'
            }`}
          >
            {comboInStock ? 'En stock' : 'Agotado'}
          </span>
        </div>
      </div>
    </a>
  );
}
