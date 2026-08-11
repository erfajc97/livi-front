import { formatCurrency } from '@/app/helpers/formatCurrency';
import { useCartStore } from '@/app/store/cart/cartStore';
import Loader from '@/app/components/Loader';
import type { Combo } from '@/app/types/global.types';

interface ComboEditorialListProps {
  combos: Combo[];
  isLoading: boolean;
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

function comboInStock(combo: Combo): boolean {
  const products = combo.comboProducts ?? [];
  return products.every((cp) => {
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
}

function ComboRow({ combo, index }: { combo: Combo; index: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const products = combo.comboProducts ?? [];

  const discount = combo.discount ?? 0;
  const hasDiscount = discount > 0;
  const actualPrice = hasDiscount ? combo.finalPrice - discount : combo.finalPrice;
  const originalSum = products.reduce((sum, cp) => {
    const price = Number(cp.productVariation?.price ?? cp.product?.price ?? 0);
    return sum + price * cp.quantity;
  }, 0);
  const savings = originalSum > actualPrice ? originalSum - actualPrice : 0;

  const hasBajoPedido = products.some((cp) => cp.product?.bajoPedido);
  const inStock = comboInStock(combo);

  const description =
    combo.description ||
    (products.length
      ? `${products.length} ${products.length === 1 ? 'fragancia' : 'fragancias'} — ${products.map((cp) => cp.product?.name).filter(Boolean).join(', ')}`
      : '');

  const handleAdd = () => {
    const comboProducts = products.map((cp) => {
      const variant = cp.productVariation;
      if (variant) return { productVariationId: parseInt(String(variant.id), 10), quantity: cp.quantity };
      return { productId: parseInt(String(cp.productId), 10), quantity: cp.quantity };
    });
    addItem({
      productId: `combo-${combo.id}`,
      variantId: `combo-${combo.id}`,
      name: combo.name,
      image: combo.imageUrl || products[0]?.product?.image || '',
      ml: 0,
      price: actualPrice,
      quantity: 1,
      comboId: combo.id,
      comboProducts,
      bajoPedido: hasBajoPedido,
    });
    window.location.href = '/carrito';
  };

  const reversed = index % 2 === 1;

  const media = (
    <a
      href={`/combo/${combo.id}`}
      className="group relative block aspect-[4/3] overflow-hidden bg-surface-raised md:aspect-[5/6]"
    >
      {combo.imageUrl ? (
        <img
          src={combo.imageUrl}
          alt={combo.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-text-muted">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.6">
            <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a4 4 0 0 0-8 0v2" />
          </svg>
        </div>
      )}
      {hasBajoPedido && (
        <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 border border-accent bg-bg px-3 py-1.5 font-body text-[10px] uppercase tracking-[0.22em] text-text">
          <span className="h-[5px] w-[5px] rounded-full bg-accent" />
          Bajo Pedido
        </span>
      )}
    </a>
  );

  const detail = (
    <div className="flex flex-col justify-center">
      {/* Orden mobile (REQ-054): nombre → precio → descripción recortada → botón.
          Desktop mantiene: nombre → descripción → precio → botones. */}
      <div className="order-1">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-lg italic text-text-muted">— {ROMAN[index] ?? index + 1}</span>
          <span className="font-body text-[10px] uppercase tracking-[0.22em] text-text-muted">
            {products.length} {products.length === 1 ? 'fragancia' : 'fragancias'}
          </span>
        </div>

        <h3 className="mt-3 font-display text-4xl font-light leading-[1.02] tracking-[-0.02em] text-text md:text-5xl">
          <a href={`/combo/${combo.id}`} className="transition-colors hover:text-accent">{combo.name}</a>
        </h3>
      </div>

      {description && (
        <div className="order-3 mt-4 max-w-md md:order-2">
          <p className="line-clamp-3 font-body text-sm leading-relaxed text-text-soft">{description}</p>
          <a
            href={`/combo/${combo.id}`}
            className="mt-2 inline-block border-b border-border pb-0.5 font-body text-[10px] uppercase tracking-[0.18em] text-text transition-colors hover:border-accent hover:text-accent"
          >
            Leer más
          </a>
        </div>
      )}

      <div className="order-2 mt-5 flex items-baseline gap-3 md:order-3 md:mt-6">
        <span className="font-display text-3xl text-text">{formatCurrency(actualPrice)}</span>
        {originalSum > actualPrice && (
          <span className="font-body text-sm text-text-muted line-through">{formatCurrency(originalSum)}</span>
        )}
        {savings > 0 && (
          <span className="font-body text-[10px] uppercase tracking-[0.18em] text-accent">Ahorra {formatCurrency(savings)}</span>
        )}
      </div>

      <div className="order-4 mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
        <button
          onClick={inStock ? handleAdd : undefined}
          disabled={!inStock}
          className="inline-flex items-center gap-2 bg-text px-7 py-4 font-body text-xs font-medium uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          {inStock ? 'Añadir al carrito' : 'Combo agotado'}
          {inStock && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M5 12h14M14 6l6 6-6 6" /></svg>
          )}
        </button>
        <a
          href={`/combo/${combo.id}`}
          className="border-b border-border pb-1 font-body text-[11px] uppercase tracking-[0.18em] text-text transition-colors hover:border-accent hover:text-accent"
        >
          Ver composición completa
        </a>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 items-stretch gap-6 py-6 md:grid-cols-2 md:gap-16 md:py-12">
      {reversed ? (
        <>
          <div className="order-2 md:order-1">{detail}</div>
          <div className="order-1 md:order-2">{media}</div>
        </>
      ) : (
        <>
          {media}
          {detail}
        </>
      )}
    </div>
  );
}

export default function ComboEditorialList({ combos, isLoading }: ComboEditorialListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 md:py-32">
        <Loader size={45} />
      </div>
    );
  }

  if (combos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center md:py-20">
        <p className="font-body text-sm text-text-muted">No hay combos disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      {/* Encabezado editorial — compacto */}
      <header className="mx-auto max-w-3xl px-6 py-7 text-center md:py-10">
        <span className="eyebrow">— Selecciones de la casa</span>
        <h1 className="mt-2.5 font-display text-3xl font-light leading-[1.1] tracking-[-0.02em] text-text md:text-5xl">
          Cada combo, pensado para un momento.
        </h1>
      </header>

      {/* Filas alternadas */}
      <div className="divide-y divide-border px-6 md:px-14">
        {combos.map((combo, i) => (
          <ComboRow key={combo.id} combo={combo} index={i} />
        ))}
      </div>
    </div>
  );
}
