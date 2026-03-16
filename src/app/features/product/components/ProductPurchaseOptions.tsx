import { useState, useEffect } from 'react';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import { useCartStore } from '@/app/store/cart/cartStore';
import { sonnerResponse } from '@/app/helpers/sonnerResponse';
import type { Product, ProductVariant } from '@/app/types/global.types';

interface ProductPurchaseOptionsProps {
  product: Product;
}

export default function ProductPurchaseOptions({ product }: ProductPurchaseOptionsProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const setDrawerOpen = useCartStore((s) => s.setDrawerOpen);

  // Esperar a que Zustand se hidrate desde localStorage
  useEffect(() => {
    const unsub = useCartStore.subscribe(
      (state: any) => {
        if (state._hasHydrated) {
          setHasHydrated(true);
        }
      }
    );

    // Check immediate state
    if (useCartStore.getState()._hasHydrated) {
      setHasHydrated(true);
    }

    return unsub;
  }, []);

  const handleAddToCart = () => {
    if (!hasHydrated) {
      sonnerResponse('Cargando carrito...', 'error');
      return;
    }
    if (!selectedVariant) {
      sonnerResponse('Selecciona un tamaño primero.', 'error');
      return;
    }
    if (selectedVariant.stock < 1) {
      sonnerResponse('No hay suficiente stock disponible.', 'error');
      return;
    }
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name:      product.name,
      brand:     product.brand,
      image:     product.image,
      ml:        selectedVariant.ml,
      price:     selectedVariant.price,
      quantity:  1,
    });
    sonnerResponse(`${product.name} agregado al carrito.`, 'success');
    setDrawerOpen(true);
  };

  const handleFastPurchase = () => {
    if (!hasHydrated) {
      sonnerResponse('Cargando carrito...', 'error');
      return;
    }
    if (!selectedVariant) {
      sonnerResponse('Selecciona un tamaño primero.', 'error');
      return;
    }
    if (selectedVariant.stock < 1) {
      sonnerResponse('No hay suficiente stock disponible.', 'error');
      return;
    }
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name:      product.name,
      brand:     product.brand,
      image:     product.image,
      ml:        selectedVariant.ml,
      price:     selectedVariant.price,
      quantity:  1,
    });
    window.location.href = '/checkout';
  };

  const handleWhatsapp = () => {
    if (!selectedVariant) {
      sonnerResponse('Selecciona un tamaño primero.', 'error');
      return;
    }
    const msg = `Hola, quiero comprar el perfume ${product.name} de ${selectedVariant.ml}ml por ${formatCurrency(selectedVariant.price)}.`;
    window.open(`https://wa.me/593999999999?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const variants = product.variants ?? [];
  const minPrice = variants.length > 0 ? Math.min(...variants.map((v) => v.price)) : 0;
  const maxPrice = variants.length > 0 ? Math.max(...variants.map((v) => v.price)) : 0;
  const priceDisplay = selectedVariant
    ? formatCurrency(selectedVariant.price)
    : (minPrice === maxPrice ? formatCurrency(minPrice) : `Desde ${formatCurrency(minPrice)}`);

  const fullBottles = variants.filter(v => v.ml >= 30);
  const decants = variants.filter(v => v.ml < 30);

  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
  const inStock = totalStock > 0;

  return (
    <div className="flex flex-col space-y-6">
      {/* Brand + Title + Reviews */}
      <div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{product.brand}</p>
        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl text-black font-bold leading-tight mb-3">{product.name}</h1>
        <div className="flex items-center gap-3">
          <div className="flex gap-0.5 text-lg">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={star <= 4 ? 'text-accent-hover' : 'text-gray-300'}>
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-500 font-medium">4.5 (212 reviews)</span>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Price + Stock + Favorite */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-heading text-2xl sm:text-3xl font-bold text-black">
            {priceDisplay} <span className="text-base sm:text-lg font-semibold text-gray-400">USD</span>
          </p>
          <p className={`text-xs font-bold mt-1 ${inStock ? 'text-green-600' : 'text-red-500'}`}>
            {inStock ? 'En stock — Disponible' : 'Agotado'}
          </p>
        </div>
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors font-medium">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          Favoritos
        </button>
      </div>

      <hr className="border-gray-200" />

      {/* Variant Selectors */}
      <div className="space-y-5">
        {fullBottles.length > 0 && (
          <div>
            <h3 className="font-heading text-base font-bold uppercase tracking-wide mb-3">Botella Completa</h3>
            <div className="grid grid-cols-2 gap-3">
              {fullBottles.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`py-3 px-4 rounded-lg border text-sm font-bold transition-all flex items-center justify-between ${
                    selectedVariant?.id === v.id
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-gray-300 hover:border-black'
                  }`}
                >
                  <span>{v.ml}ml</span>
                  <span className={selectedVariant?.id === v.id ? 'text-gray-300' : 'text-gray-500'}>
                    {formatCurrency(v.price)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {decants.length > 0 && (
          <div>
            <h3 className="font-heading text-base font-bold uppercase tracking-wide mb-3">Decants</h3>
            <div className="grid grid-cols-2 gap-3">
              {decants.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`py-3 px-4 rounded-lg border text-sm font-bold transition-all flex items-center justify-between ${
                    selectedVariant?.id === v.id
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-gray-300 hover:border-black'
                  }`}
                >
                  <span>{v.ml}ml</span>
                  <span className={selectedVariant?.id === v.id ? 'text-gray-300' : 'text-gray-500'}>
                    {formatCurrency(v.price)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAddToCart}
            disabled={!hasHydrated}
            className="flex-1 bg-black text-white py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Agregar al carrito
          </button>
          <button
            onClick={handleWhatsapp}
            className="flex-1 bg-green-600 text-white py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.996 2C6.474 2 2 6.474 2 11.996C2 13.921 2.548 15.717 3.511 17.25L2.146 22.18L7.204 20.852C8.683 21.688 10.297 22.158 11.996 22.158C17.518 22.158 22 17.684 22 12.162C22 6.64 17.518 2.166 11.996 2.166V2ZM17.152 16.315C16.94 16.91 16.1 17.433 15.441 17.545C14.945 17.625 14.284 17.682 11.838 16.669C8.91 15.452 7.027 12.441 6.884 12.253C6.741 12.064 5.72 10.71 5.72 9.31C5.72 7.91 6.442 7.238 6.741 6.93C6.983 6.681 7.404 6.551 7.82 6.551C7.962 6.551 8.089 6.558 8.199 6.564C8.484 6.577 8.627 6.602 8.814 7.051C9.05 7.618 9.623 9.022 9.693 9.172C9.764 9.322 9.851 9.531 9.742 9.742C9.643 9.941 9.551 10.035 9.408 10.203C9.266 10.372 9.13 10.493 8.979 10.672C8.847 10.832 8.694 10.992 8.865 11.282C9.036 11.571 9.625 12.532 10.489 13.303C11.603 14.298 12.51 14.611 12.83 14.743C13.151 14.875 13.34 14.856 13.568 14.613C13.797 14.368 14.441 13.621 14.713 13.313C14.985 13.003 15.241 13.041 15.526 13.144C15.811 13.248 17.324 13.996 17.625 14.145C17.925 14.295 18.125 14.369 18.196 14.494C18.267 14.618 18.267 15.308 17.965 15.939L17.152 16.315Z" />
            </svg>
            Comprar por Whatsapp
          </button>
        </div>

        <button 
          onClick={handleFastPurchase}
          disabled={!hasHydrated}
          className="w-full bg-accent text-white py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Compra rápida
        </button>
      </div>

      {/* Refund + Shipping Info */}
      <div className="space-y-3">
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex items-start gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 text-green-600 mt-0.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <div>
            <p className="text-sm font-bold text-black">Garantía de satisfacción</p>
            <p className="text-xs text-gray-500 mt-0.5">7 días de reembolso si no estás satisfecho con tu producto</p>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex items-start gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 text-accent-hover mt-0.5">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <div>
            <p className="text-sm font-bold text-black">Envío a todo Ecuador</p>
            <p className="text-xs text-gray-500 mt-0.5">Guayaquil $3 — Provincias $7 — Retiro en tienda gratis</p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="pt-1">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Métodos de Pago</p>
        <div className="flex flex-wrap gap-2">
          <div className="h-8 border border-gray-200 rounded-md px-2 flex items-center justify-center bg-orange-500 text-white font-bold text-xs italic">
            PayPhone
          </div>
          <div className="h-8 w-12 border border-gray-200 rounded-md flex items-center justify-center bg-white">
            <span className="text-blue-800 font-bold text-[10px] italic">VISA</span>
          </div>
          <div className="h-8 w-12 border border-gray-200 rounded-md flex items-center justify-center bg-white">
            <div className="w-5 h-5 rounded-full border-2 border-blue-500 overflow-hidden flex items-center justify-center">
              <div className="w-2.5 h-6 bg-blue-500 skew-x-12" />
            </div>
          </div>
          <div className="h-8 w-12 border border-gray-200 rounded-md flex items-center justify-center bg-blue-500">
            <span className="text-white font-bold text-[8px]">AMEX</span>
          </div>
          <div className="h-8 w-12 border border-gray-200 rounded-md flex items-center justify-center bg-white">
            <span className="text-orange-500 font-bold text-[8px]">DISCOVER</span>
          </div>
        </div>
      </div>
    </div>
  );
}
