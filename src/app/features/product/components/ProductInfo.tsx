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

const CONCENTRATION_SHORT: Record<string, string> = {
  EAU_DE_PARFUM: 'EDP', EAU_DE_TOILETTE: 'EDT', EAU_DE_TOILETTE_INTENSE: 'EDT Intense',
  EAU_DE_COLOGNE: 'EDC', BODY_MIST: 'Body Mist', ELIXIR: 'Elixir',
  PARFUM: 'Parfum', EXTRAIT_DE_PARFUM: 'Extrait',
};
const CONCENTRATION_LONG: Record<string, string> = {
  EAU_DE_PARFUM: 'Eau de Parfum', EAU_DE_TOILETTE: 'Eau de Toilette', EAU_DE_TOILETTE_INTENSE: 'Eau de Toilette Intense',
  EAU_DE_COLOGNE: 'Eau de Cologne', BODY_MIST: 'Body Mist', ELIXIR: 'Elixir',
  PARFUM: 'Parfum', EXTRAIT_DE_PARFUM: 'Extrait de Parfum',
};
const GENDER_LABELS: Record<string, string> = { HOMBRE: 'Hombre', MUJER: 'Mujer', UNISEX: 'Unisex' };
const TIME_LABELS: Record<string, string> = { DIA: 'Día', NOCHE: 'Noche' };

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
  const isBajo = !!product.bajoPedido;

  const eyebrow = product.concentration
    ? CONCENTRATION_LONG[product.concentration] ?? product.concentration
    : '';
  const tags = [
    product.gender && (GENDER_LABELS[product.gender] ?? product.gender),
    product.timeOfDay && (TIME_LABELS[product.timeOfDay] ?? product.timeOfDay),
    product.concentration && (CONCENTRATION_SHORT[product.concentration] ?? product.concentration),
  ].filter(Boolean);

  const current = selectedVariant ?? variants[0] ?? null;
  const price = current?.price ?? product.price ?? 0;

  return (
    <div className="md:sticky md:top-24">
      {eyebrow && (
        <span className="font-body text-[10px] uppercase tracking-[0.22em] text-text-muted">{eyebrow}</span>
      )}
      <h1 className="mt-3 font-display text-5xl font-light leading-none tracking-[-0.025em] text-text md:text-6xl">
        {product.name}
      </h1>
      {tags.length > 0 && (
        <p className="mt-3 font-display text-xl italic text-text-soft md:text-2xl">{tags.join(' · ')}</p>
      )}
      {product.description && (
        <p className="mt-5 max-w-md font-body text-sm leading-relaxed text-text-soft">{product.description}</p>
      )}

      {/* Caja bajo pedido — SOLO productos bajo pedido */}
      {isBajo && (
        <div className="mt-7 border-l-2 border-accent bg-bg-alt px-5 py-5">
          <span className="font-body text-[10px] uppercase tracking-[0.22em] text-text-muted">— Bajo pedido</span>
          <p className="mt-2.5 font-body text-[11px] uppercase tracking-[0.18em] text-text-soft">
            Plazo
            <span className="ml-2 font-display text-xl italic normal-case tracking-normal text-text">13–17 días</span>
          </p>
          <p className="mt-3 max-w-sm font-display text-sm italic leading-relaxed text-text-soft">
            Pedido especialmente para ti. Verificado por NonDecants antes de llegar a tus manos.
          </p>
        </div>
      )}

      <div className="my-9 h-px bg-border" />

      {/* Selector de formato (variantes del back) */}
      <span className="eyebrow">Selecciona tu formato</span>
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {variants.map((v) => {
          const inStock = v.availableQuantity > 0;
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
                {v.ml}<span className="ml-0.5 text-[11px]">ml</span>
              </span>
              <span className={`font-body text-[9px] uppercase tracking-[0.18em] ${active ? 'text-bg/70' : 'text-text-muted'}`}>
                {v.isFullBottle ? 'Sellado' : 'Decant'}
              </span>
              <span className="font-body text-xs">{formatCurrency(v.price)}</span>
            </button>
          );
        })}
      </div>

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
          disabled={!current}
          className="gold-frame flex flex-1 items-center justify-between bg-text px-6 py-4 font-body text-xs font-medium uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span>Añadir — {formatCurrency(price)}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M5 12h14M14 6l6 6-6 6" /></svg>
        </button>
      </div>
      <p className="mt-3 font-body text-[10px] uppercase tracking-[0.18em] text-text-muted">
        {isBajo ? 'Reserva confirmada al completar el pago' : 'Envío inmediato al confirmar el pago'}
      </p>

      {/* Confianza — datos reales del servicio */}
      <div className="mt-9 space-y-5 border-t border-border pt-7">
        <TrustRow label="Autenticidad">Verificado por NonDecants</TrustRow>
        <TrustRow label="Entrega">
          {isBajo ? 'Bajo pedido · 13–17 días' : 'Servientrega 24–72h · todo el Ecuador'}
        </TrustRow>
        <TrustRow label="Pago">Tarjeta · Transferencia · PayPhone</TrustRow>
      </div>
    </div>
  );
}
