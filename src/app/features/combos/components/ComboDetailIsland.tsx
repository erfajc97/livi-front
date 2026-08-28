import { useState } from 'react';
import AppProviders from '@/app/providers/AppProviders';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import { useCartStore } from '@/app/store/cart/cartStore';
/* Medios de pago aceptados — mismo componente que la ficha de producto (ANX-28). */
import PaymentMethodIcons from '@/app/components/PaymentMethodIcons';
import TrustIcons from '@/app/components/UI/TrustIcons';
import type { Combo } from '@/app/types/global.types';

interface ComboDetailIslandProps {
  combo: Combo;
}

function ComboDetailContent({ combo }: ComboDetailIslandProps) {
  const addItem = useCartStore((s) => s.addItem);

  // Versiones: combo base + sus versiones (mismo nombre, otros productos/precio).
  const variants = [combo, ...(combo.versions ?? [])];
  const [activeId, setActiveId] = useState<number>(combo.id);
  const active = variants.find((v) => v.id === activeId) ?? combo;

  const products = active.comboProducts ?? [];
  const discount = Number(active.discount ?? 0);
  const listPrice = Number(active.finalPrice);
  const hasDiscount = discount > 0 && Number.isFinite(listPrice);
  const actualPrice = hasDiscount ? listPrice - discount : listPrice;
  const discountPercent = hasDiscount && listPrice > 0 ? Math.round((discount / listPrice) * 100) : 0;

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

  const originalSum = products.reduce((sum, cp) => {
    const price = Number(cp.productVariation?.price ?? cp.product?.price ?? 0);
    return sum + price * cp.quantity;
  }, 0);
  const savings = originalSum > actualPrice ? originalSum - actualPrice : 0;

  const comboHasBajoPedido = products.some((cp) => cp.product?.bajoPedido);

  const buildComboCartItem = () => {
    const comboProducts = products.map((cp) => {
      const variant = cp.productVariation;
      if (variant) return { productVariationId: parseInt(String(variant.id), 10), quantity: cp.quantity };
      return { productId: parseInt(String(cp.productId), 10), quantity: cp.quantity };
    });
    return {
      productId: `combo-${active.id}`,
      variantId: `combo-${active.id}`,
      name: combo.name,
      image: active.imageUrl || combo.imageUrl || products[0]?.product?.image || '',
      ml: 0,
      price: actualPrice,
      quantity: 1,
      comboId: active.id,
      comboProducts,
      bajoPedido: comboHasBajoPedido,
    };
  };

  const handleAddToCart = () => {
    addItem(buildComboCartItem());
    window.location.href = '/carrito';
  };

  const handleBuyNow = () => {
    addItem(buildComboCartItem());
    window.location.href = '/checkout';
  };

  const handleWhatsapp = () => {
    const url =
      typeof window !== 'undefined'
        ? window.location.href
        : `https://nondecants.com/combo/${combo.id}`;
    const productList = products.map((cp) => cp.product?.name ?? 'Producto').join(', ');
    const msg = `Hola, estoy interesado/a en el combo "${combo.name}" (${productList}): ${url}`;
    window.open(`https://wa.me/593992305463?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[0.8fr_1fr] md:gap-12">
      {/* Imagen — compacta, cabe en el viewport */}
      <div className="relative h-[46svh] overflow-hidden bg-surface-raised sm:h-[54svh] md:h-[calc(100svh-16rem)] md:max-h-[440px]">
        {(active.imageUrl || combo.imageUrl) ? (
          <img src={active.imageUrl || combo.imageUrl} alt={combo.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-muted">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75">
              <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a4 4 0 0 0-8 0v2" />
            </svg>
          </div>
        )}
        {comboHasBajoPedido && (
          <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 border border-accent bg-bg px-3 py-1.5 font-body text-[10px] uppercase tracking-[0.22em] text-text">
            <span className="h-[5px] w-[5px] rounded-full bg-accent" />
            Bajo Pedido
          </span>
        )}
        {discountPercent > 0 && (
          <span className="absolute bottom-5 left-5 bg-accent px-2.5 py-1 font-body text-[9px] font-medium uppercase tracking-[0.18em] text-bg">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="md:sticky md:top-20">
        <span className="font-body text-[10px] uppercase tracking-[0.22em] text-text-muted">
          Combo · {products.length} {products.length === 1 ? 'producto' : 'productos'}
        </span>
        <h1 className="mt-1.5 font-display text-3xl font-light leading-[1.0] tracking-[-0.025em] text-text md:text-4xl">
          {combo.name}
        </h1>
        {active.description && (
          <div className="mt-3 max-w-md">
            <p className="line-clamp-4 font-body text-sm leading-relaxed text-text-soft">{active.description}</p>
            <a
              href={`/combo/${active.id}`}
              className="mt-2 inline-block border-b border-border pb-0.5 font-body text-[10px] uppercase tracking-[0.18em] text-text transition-colors hover:border-accent hover:text-accent"
            >
              Leer más
            </a>
          </div>
        )}

        {/* Selector de versión — mismo combo, otra composición/precio */}
        {variants.length > 1 && (
          <div className="mt-5">
            <span className="eyebrow">Elige tu versión</span>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {variants.map((v, i) => {
                const vDisc = Number(v.discount ?? 0);
                const vList = Number(v.finalPrice);
                const vPrice = vDisc > 0 && Number.isFinite(vList) ? vList - vDisc : vList;
                const isActive = v.id === activeId;
                return (
                  <button
                    key={v.id}
                    onClick={() => setActiveId(v.id)}
                    className={`flex flex-col items-start border px-3 py-2 text-left transition-colors ${
                      isActive ? 'border-text bg-text text-bg' : 'border-border text-text hover:border-text'
                    }`}
                  >
                    <span className={`font-body text-[9px] uppercase tracking-[0.18em] ${isActive ? 'text-bg/70' : 'text-text-muted'}`}>
                      Opción {i + 1} · {(v.comboProducts ?? []).length} prod
                    </span>
                    <span className="mt-0.5 font-display text-base leading-none">{formatCurrency(vPrice)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {comboHasBajoPedido && (
          <div className="mt-5 border-l-2 border-accent bg-bg-alt px-4 py-3">
            <p className="font-body text-[11px] uppercase tracking-[0.18em] text-text-soft">
              <span className="text-text-muted">Bajo pedido ·</span>
              <span className="ml-2 font-display text-lg italic normal-case tracking-normal text-text">13–17 días</span>
            </p>
          </div>
        )}

        <div className="my-5 h-px bg-border" />

        {/* Precio */}
        <div className="flex items-baseline gap-3">
          <span className="font-display text-2xl text-text">{formatCurrency(actualPrice)}</span>
          {hasDiscount && (
            <span className="font-body text-sm text-text-muted line-through">{formatCurrency(listPrice)}</span>
          )}
          {discountPercent > 0 && (
            <span className="bg-accent px-1.5 py-px font-body text-[10px] font-medium tracking-wide text-bg">-{discountPercent}%</span>
          )}
        </div>
        {savings > 0 && (
          <p className="mt-2 font-display text-sm italic text-text-soft">
            Por separado: {formatCurrency(originalSum)} · ahorras {formatCurrency(savings)}.
          </p>
        )}

        {/* Incluidos */}
        <div className="mt-5">
          <span className="eyebrow">Incluye</span>
          <div className="mt-2.5 divide-y divide-border border-y border-border">
            {products.map((cp) => {
              const variant = cp.productVariation;
              const productPrice = Number(variant?.price ?? cp.product?.price ?? 0);
              const img = cp.product?.imageUrl || cp.product?.image || (cp.product as any)?.images?.[0]?.url;
              return (
                <div key={cp.id} className="flex items-center gap-3 py-2">
                  <div className="h-10 w-10 shrink-0 overflow-hidden bg-surface-raised">
                    {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm text-text">{cp.product?.name ?? 'Producto'}</p>
                    <p className="font-body text-[10px] uppercase tracking-[0.16em] text-text-muted">
                      {variant?.mlSize ? `${variant.mlSize}ml · ` : ''}{variant?.isFullBottle ? 'Sellado' : variant?.mlSize ? 'Decant' : ''}
                      {cp.quantity > 1 ? ` · ${cp.quantity}x` : ''}
                    </p>
                  </div>
                  <span className="font-body text-xs text-text-soft">{formatCurrency(productPrice)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={comboInStock ? handleBuyNow : undefined}
            disabled={!comboInStock}
            className={`flex w-full items-center justify-between bg-text px-6 py-3.5 font-body text-xs font-medium uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40 ${
              comboInStock ? 'gold-frame' : ''
            }`}
          >
            <span>{comboInStock ? `Comprar — ${formatCurrency(actualPrice)}` : 'Combo agotado'}</span>
            {comboInStock && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M5 12h14M14 6l6 6-6 6" /></svg>
            )}
          </button>
          <div className="flex gap-2">
            <button
              onClick={comboInStock ? handleAddToCart : undefined}
              disabled={!comboInStock}
              className="flex-1 border border-border py-3 font-body text-xs uppercase tracking-[0.2em] text-text transition-colors hover:border-text disabled:cursor-not-allowed disabled:opacity-40"
            >
              Agregar al carrito
            </button>
            <button
              onClick={handleWhatsapp}
              className="flex h-[42px] w-[42px] shrink-0 items-center justify-center bg-green-700 text-white transition-colors hover:bg-green-600"
              title="Consultar por WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.996 2C6.474 2 2 6.474 2 11.996C2 13.921 2.548 15.717 3.511 17.25L2.146 22.18L7.204 20.852C8.683 21.688 10.297 22.158 11.996 22.158C17.518 22.158 22 17.684 22 12.162C22 6.64 17.518 2.166 11.996 2.166V2ZM17.152 16.315C16.94 16.91 16.1 17.433 15.441 17.545C14.945 17.625 14.284 17.682 11.838 16.669C8.91 15.452 7.027 12.441 6.884 12.253C6.741 12.064 5.72 10.71 5.72 9.31C5.72 7.91 6.442 7.238 6.741 6.93C6.983 6.681 7.404 6.551 7.82 6.551C7.962 6.551 8.089 6.558 8.199 6.564C8.484 6.577 8.627 6.602 8.814 7.051C9.05 7.618 9.623 9.022 9.693 9.172C9.764 9.322 9.851 9.531 9.742 9.742C9.643 9.941 9.551 10.035 9.408 10.203C9.266 10.372 9.13 10.493 8.979 10.672C8.847 10.832 8.694 10.992 8.865 11.282C9.036 11.571 9.625 12.532 10.489 13.303C11.603 14.298 12.51 14.611 12.83 14.743C13.151 14.875 13.34 14.856 13.568 14.613C13.797 14.368 14.441 13.621 14.713 13.313C14.985 13.003 15.241 13.041 15.526 13.144C15.811 13.248 17.324 13.996 17.625 14.145C17.925 14.295 18.125 14.369 18.196 14.494C18.267 14.618 18.267 15.308 17.965 15.939L17.152 16.315Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Garantías + pago — mismos iconos que la ficha de producto. */}
        <div className="mt-5 border-t border-border pt-4">
          <TrustIcons />
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <span className="eyebrow">Pago</span>
          <PaymentMethodIcons className="mt-2.5" />
        </div>
      </div>
    </div>
  );
}

export default function ComboDetailIsland({ combo }: ComboDetailIslandProps) {
  return (
    <AppProviders>
      <ComboDetailContent combo={combo} />
    </AppProviders>
  );
}
