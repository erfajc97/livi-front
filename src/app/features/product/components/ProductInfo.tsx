import { formatCurrency } from '@/app/helpers/formatCurrency';
import type { Product, ProductVariant } from '@/app/types/global.types';

interface ProductInfoProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  quantity: number;
  onVariantSelect: (variant: ProductVariant) => void;
  onQtyChange: (qty: number) => void;
  onAddToCart: () => void;
}

function TrustRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[96px_1fr] items-baseline gap-4">
      <span className="font-body text-[10px] uppercase tracking-[0.22em] text-text-muted">— {label}</span>
      <span className="font-display text-sm italic leading-snug text-text-soft">{children}</span>
    </div>
  );
}

export default function ProductInfo({
  product, selectedVariant, quantity, onVariantSelect, onQtyChange, onAddToCart,
}: ProductInfoProps) {
  const variants = product.variants ?? [];
  const stock = Number(product.stock ?? 0);
  const inStock = stock > 0;

  const current = selectedVariant ?? variants[0] ?? null;
  const price = Number(current?.price ?? product.price ?? 0);

  return (
    <div className="md:sticky md:top-24">
      {product.marca?.name && (
        <span className="font-body text-[10px] uppercase tracking-[0.22em] text-text-muted">{product.marca.name}</span>
      )}
      <h1 className="mt-3 font-display text-5xl font-light leading-none tracking-[-0.025em] text-text md:text-6xl">
        {product.name}
      </h1>
      {product.description && (
        <p className="mt-5 max-w-md font-body text-sm leading-relaxed text-text-soft">{product.description}</p>
      )}

      <div className="my-9 h-px bg-border" />

      {/* Selector de color (variantes del back) */}
      {variants.length > 0 && (
        <>
          <span className="eyebrow">Color</span>
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {variants.map((v) => {
              const active = current?.id === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => inStock && onVariantSelect(v)}
                  disabled={!inStock}
                  className={`flex flex-col gap-1 border px-3 py-3 text-left transition-colors ${
                    active
                      ? 'border-text bg-text text-bg'
                      : inStock
                        ? 'border-border text-text hover:border-text'
                        : 'cursor-not-allowed border-border text-text-muted opacity-40'
                  }`}
                >
                  <span className="font-display text-lg leading-none">
                    {v.name ?? 'Único'}
                  </span>
                  <span className="font-body text-xs">{formatCurrency(Number(v.price))}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Cantidad + Añadir — fijo en la parte inferior en mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-stretch gap-3 border-t border-border bg-bg/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm md:static md:mt-8 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
        <div className="flex items-center border border-border">
          <button type="button" onClick={() => onQtyChange(Math.max(1, quantity - 1))} className="px-3.5 text-text-soft transition-colors hover:text-text">−</button>
          <span className="w-9 text-center font-body text-sm text-text">{quantity}</span>
          <button type="button" onClick={() => onQtyChange(quantity + 1)} className="px-3.5 text-text-soft transition-colors hover:text-text">+</button>
        </div>
        <button
          type="button"
          onClick={onAddToCart}
          disabled={!current || !inStock}
          className="gold-frame flex flex-1 items-center justify-between bg-text px-6 py-4 font-body text-xs font-medium uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span>{inStock ? `Añadir — ${formatCurrency(price)}` : 'Agotado'}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M5 12h14M14 6l6 6-6 6" /></svg>
        </button>
      </div>
      <p className="mt-3 font-body text-[10px] uppercase tracking-[0.18em] text-text-muted">
        Envío inmediato al confirmar el pago
      </p>

      {/* Confianza — datos reales del servicio */}
      <div className="mt-9 space-y-5 border-t border-border pt-7">
        <TrustRow label="Calidad">Cuero premium verificado por LIVI</TrustRow>
        <TrustRow label="Entrega">Servientrega 24–72h · todo el Ecuador</TrustRow>
        <TrustRow label="Pago">Tarjeta · Transferencia · PayPhone</TrustRow>
      </div>
    </div>
  );
}
