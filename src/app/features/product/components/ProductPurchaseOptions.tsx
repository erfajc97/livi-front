import { useState, useEffect } from 'react';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import { useCartStore } from '@/app/store/cart/cartStore';
import { sonnerResponse } from '@/app/helpers/sonnerResponse';
import type { Product, ProductVariant } from '@/app/types/global.types';

type SelectedOption = { type: 'full' } | { type: 'decant'; variant: ProductVariant };

interface ProductPurchaseOptionsProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
  onVariantChange?: (variant: ProductVariant | null) => void;
}

export default function ProductPurchaseOptions({
  product,
  selectedVariant: externalVariant,
  onVariantChange,
}: ProductPurchaseOptionsProps) {
  // Default selection: full bottle
  const [selected, setSelected] = useState<SelectedOption>({ type: 'full' });
  const [hasHydrated, setHasHydrated] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const setDrawerOpen = useCartStore((s) => s.setDrawerOpen);

  // Sync external variant prop
  useEffect(() => {
    if (externalVariant === null) {
      setSelected({ type: 'full' });
    }
  }, [externalVariant]);

  // Notify parent when selection changes (for gallery image switching)
  const handleSelectFull = () => {
    setSelected({ type: 'full' });
    onVariantChange?.(null);
  };

  const handleSelectDecant = (v: ProductVariant) => {
    setSelected({ type: 'decant', variant: v });
    onVariantChange?.(v);
  };

  useEffect(() => {
    const unsub = useCartStore.subscribe((state: any) => {
      if (state._hasHydrated) setHasHydrated(true);
    });
    if (useCartStore.getState()._hasHydrated) setHasHydrated(true);
    return unsub;
  }, []);

  const fullBottlePrice = product.price ?? 0;
  const fullBottleStock = product.stock ?? 0;
  const fullBottleMl = product.totalMl ?? 0;

  const variants = product.variants ?? [];
  const decants = variants.filter(v => !v.isFullBottle);

  const isFullSelected = selected.type === 'full';
  const selectedDecant = selected.type === 'decant' ? selected.variant : null;

  // Price display
  const currentPrice = isFullSelected ? fullBottlePrice : (selectedDecant?.price ?? 0);
  const discount = product.discount ?? 0;
  const hasDiscount = discount > 0;
  const discountedPrice = hasDiscount ? currentPrice * (1 - discount / 100) : currentPrice;

  // Stock
  const inStock = isFullSelected
    ? fullBottleStock > 0
    : (selectedDecant?.availableQuantity ?? 0) > 0;

  const totalAvailable = fullBottleStock + decants.reduce((sum, v) => sum + v.availableQuantity, 0);

  const getCartItem = () => {
    if (isFullSelected) {
      return {
        productId: product.id,
        variantId: `full-${product.id}`,
        name: product.name,
        image: product.image || product.images?.[0],
        ml: fullBottleMl,
        price: hasDiscount ? discountedPrice : fullBottlePrice,
        quantity: 1,
      };
    }
    if (selectedDecant) {
      return {
        productId: product.id,
        variantId: selectedDecant.id,
        name: product.name,
        image: selectedDecant.images?.[0] || product.image,
        ml: selectedDecant.ml,
        price: hasDiscount ? selectedDecant.price * (1 - discount / 100) : selectedDecant.price,
        quantity: 1,
      };
    }
    return null;
  };

  const handleAddToCart = () => {
    if (!hasHydrated) { sonnerResponse('Cargando carrito...', 'error'); return; }
    const item = getCartItem();
    if (!item) { sonnerResponse('Selecciona una opcion.', 'error'); return; }
    if (!inStock) { sonnerResponse('No hay stock disponible.', 'error'); return; }
    addItem(item);
    sonnerResponse(`${product.name} agregado al carrito.`, 'success');
    setDrawerOpen(true);
  };

  const handleFastPurchase = () => {
    if (!hasHydrated) { sonnerResponse('Cargando carrito...', 'error'); return; }
    const item = getCartItem();
    if (!item) { sonnerResponse('Selecciona una opcion.', 'error'); return; }
    if (!inStock) { sonnerResponse('No hay stock disponible.', 'error'); return; }
    addItem(item);
    window.location.href = '/checkout';
  };

  const handleWhatsapp = () => {
    const ml = isFullSelected ? fullBottleMl : selectedDecant?.ml;
    const price = isFullSelected ? fullBottlePrice : selectedDecant?.price;
    if (!ml || !price) return;
    const msg = `Hola, quiero comprar el perfume ${product.name} de ${ml}ml por ${formatCurrency(price)}.`;
    window.open(`https://wa.me/593999707768?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const detailTags = [
    product.gender && { label: 'Género', value: product.gender === 'HOMBRE' ? 'Hombre' : product.gender === 'MUJER' ? 'Mujer' : 'Unisex' },
    product.concentration && { label: 'Concentración', value: product.concentration.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace('De ', 'de ') },
    product.timeOfDay && { label: 'Hora', value: product.timeOfDay === 'DIA' ? 'Día' : 'Noche' },
    product.projection && { label: 'Proyección', value: product.projection === 'DISCRETA' ? 'Discreta' : product.projection === 'MODERADA' ? 'Moderada' : 'Alta' },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="flex flex-col gap-3">
      {/* Title */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-heading text-2xl sm:text-3xl text-black font-bold leading-none">{product.name}</h1>
          <button className="shrink-0 text-gray-500 hover:text-error transition-colors mt-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex gap-0.5 text-xs">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={star <= 4 ? 'text-accent-hover' : 'text-gray-500'}>★</span>
            ))}
          </div>
          <span className="text-sm text-gray-500">4.5 (212)</span>
          <span className="text-sm text-gray-500">·</span>
          <span className={`text-sm font-bold ${totalAvailable > 0 ? 'text-success' : 'text-error'}`}>
            {totalAvailable > 0 ? 'En stock' : 'Agotado'}
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2">
        <p className="font-heading text-xl font-bold text-black">{formatCurrency(discountedPrice)}</p>
        {hasDiscount && (
          <>
            <p className="text-sm text-gray-500 line-through">{formatCurrency(currentPrice)}</p>
            <span className="bg-error text-white text-xs font-bold px-1.5 py-px rounded">-{discount}%</span>
          </>
        )}
      </div>

      {/* Description + Tags */}
      {product.description && (
        <p className="text-xs text-gray-500 leading-relaxed">{product.description}</p>
      )}

      {detailTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {detailTags.map(tag => (
            <span key={tag.label} className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm">
              <span className="text-gray-500 font-medium">{tag.label}:</span>
              <span className="text-black font-semibold">{tag.value}</span>
            </span>
          ))}
        </div>
      )}

      {/* Full Bottle — always first, selected by default */}
      {fullBottlePrice > 0 && (
        <div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1.5">Botella Completa</p>
          <button
            onClick={handleSelectFull}
            className={`w-full py-2.5 px-4 rounded-lg border text-sm font-bold transition-all flex items-center justify-between ${
              isFullSelected
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-gray-200 hover:border-black'
            }`}
          >
            <span>{fullBottleMl}ml — Sellada</span>
            <span className={isFullSelected ? 'text-gray-300' : 'text-gray-500'}>
              {formatCurrency(fullBottlePrice)}
            </span>
          </button>
        </div>
      )}

      {/* Decants */}
      {decants.length > 0 && (
        <div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1.5">Decants</p>
          <div className="grid grid-cols-3 gap-1.5">
            {decants.map(v => (
              <button
                key={v.id}
                onClick={() => handleSelectDecant(v)}
                className={`py-2 px-2.5 rounded-lg border text-xs font-bold transition-all flex items-center justify-between ${
                  selectedDecant?.id === v.id
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-200 hover:border-black'
                }`}
              >
                <span>{v.ml}ml</span>
                <span className={selectedDecant?.id === v.id ? 'text-gray-300' : 'text-gray-500'}>
                  {formatCurrency(v.price)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <button
        onClick={handleFastPurchase}
        className="w-full bg-accent text-white py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-accent-hover transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
        Comprar ahora — Pago seguro
      </button>
      <div className="flex gap-1.5">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-black text-white py-2.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Agregar al carrito
        </button>
        <button
          onClick={handleWhatsapp}
          className="shrink-0 w-11 h-11 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
          title="Consultar por WhatsApp"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.996 2C6.474 2 2 6.474 2 11.996C2 13.921 2.548 15.717 3.511 17.25L2.146 22.18L7.204 20.852C8.683 21.688 10.297 22.158 11.996 22.158C17.518 22.158 22 17.684 22 12.162C22 6.64 17.518 2.166 11.996 2.166V2ZM17.152 16.315C16.94 16.91 16.1 17.433 15.441 17.545C14.945 17.625 14.284 17.682 11.838 16.669C8.91 15.452 7.027 12.441 6.884 12.253C6.741 12.064 5.72 10.71 5.72 9.31C5.72 7.91 6.442 7.238 6.741 6.93C6.983 6.681 7.404 6.551 7.82 6.551C7.962 6.551 8.089 6.558 8.199 6.564C8.484 6.577 8.627 6.602 8.814 7.051C9.05 7.618 9.623 9.022 9.693 9.172C9.764 9.322 9.851 9.531 9.742 9.742C9.643 9.941 9.551 10.035 9.408 10.203C9.266 10.372 9.13 10.493 8.979 10.672C8.847 10.832 8.694 10.992 8.865 11.282C9.036 11.571 9.625 12.532 10.489 13.303C11.603 14.298 12.51 14.611 12.83 14.743C13.151 14.875 13.34 14.856 13.568 14.613C13.797 14.368 14.441 13.621 14.713 13.313C14.985 13.003 15.241 13.041 15.526 13.144C15.811 13.248 17.324 13.996 17.625 14.145C17.925 14.295 18.125 14.369 18.196 14.494C18.267 14.618 18.267 15.308 17.965 15.939L17.152 16.315Z" />
          </svg>
        </button>
      </div>

      {/* Shipping + Guarantee */}
      <div className="grid grid-cols-2 gap-1.5">
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-success">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <p className="text-xs text-gray-500 leading-tight"><span className="font-bold text-black">Garantía</span> · 7 días</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-accent-hover">
            <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <p className="text-xs text-gray-500 leading-tight"><span className="font-bold text-black">Envío</span> · desde $3</p>
        </div>
      </div>

      {/* Payment */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 font-medium">Pago:</span>
        <div className="flex gap-1">
          <div className="h-5 border border-gray-200 rounded px-1.5 flex items-center bg-orange-500 text-white font-bold text-xs italic">PayPhone</div>
          <div className="h-5 w-8 border border-gray-200 rounded flex items-center justify-center bg-white"><span className="text-blue-800 font-bold text-xs italic">VISA</span></div>
          <div className="h-5 w-8 border border-gray-200 rounded flex items-center justify-center bg-white"><span className="text-error font-bold text-xs">MC</span></div>
          <div className="h-5 w-8 border border-gray-200 rounded flex items-center justify-center bg-blue-500"><span className="text-white font-bold text-xs">AMEX</span></div>
        </div>
      </div>
    </div>
  );
}
