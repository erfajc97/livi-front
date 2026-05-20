import { useState } from 'react';
import AppProviders from '@/app/providers/AppProviders';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import { useCartStore } from '@/app/store/cart/cartStore';
import { useAuthStore } from '@/app/store/auth/authStore';
import AuthModal from '@/app/features/auth/components/AuthModal';
import type { Combo } from '@/app/types/global.types';

interface ComboDetailIslandProps {
  combo: Combo;
}

function ComboDetailContent({ combo }: ComboDetailIslandProps) {
  const addItem = useCartStore((s) => s.addItem);
  const setDrawerOpen = useCartStore((s) => s.setDrawerOpen);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [showAuth, setShowAuth] = useState(false);

  const products = combo.comboProducts ?? [];
  const discount = combo.discount ?? 0;
  const hasDiscount = discount > 0;
  const actualPrice = hasDiscount ? combo.finalPrice - discount : combo.finalPrice;
  const discountPercent = hasDiscount ? Math.round((discount / combo.finalPrice) * 100) : 0;

  // Check if all products in the combo have enough stock
  const comboInStock = products.every((cp) => {
    const prod = cp.product;
    if (!prod) return false;
    const sealedStock = prod.stock ?? 0;
    const openMl = Number(prod.openBottleMlRemaining ?? 0);
    const totalMl = Number(prod.totalMl ?? 0);
    const availableMl = openMl + sealedStock * totalMl;

    if (cp.productVariation) {
      // Decant — check if enough ml
      return availableMl >= Number(cp.productVariation.mlSize ?? 0) * cp.quantity;
    }
    // Full bottle — need sealed stock
    return sealedStock >= cp.quantity;
  });

  // Sum of individual product prices
  const originalSum = products.reduce((sum, cp) => {
    const price = Number(cp.productVariation?.price ?? cp.product?.price ?? 0);
    return sum + price * cp.quantity;
  }, 0);

  const savings = originalSum > actualPrice ? originalSum - actualPrice : 0;

  const comboHasBajoPedido = products.some((cp) => cp.product?.bajoPedido);

  const buildComboCartItem = () => {
    const comboProducts = products.map((cp) => {
      const variant = cp.productVariation;
      if (variant) {
        return { productVariationId: parseInt(String(variant.id), 10), quantity: cp.quantity };
      }
      return { productId: parseInt(String(cp.productId), 10), quantity: cp.quantity };
    });

    return {
      productId: `combo-${combo.id}`,
      variantId: `combo-${combo.id}`,
      name: combo.name,
      image: combo.imageUrl || products[0]?.product?.image || '',
      ml: 0,
      price: actualPrice,
      quantity: 1,
      comboId: combo.id,
      comboProducts,
      bajoPedido: comboHasBajoPedido,
    };
  };

  const handleAddToCart = () => {
    addItem(buildComboCartItem());
    setDrawerOpen(true);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }
    addItem(buildComboCartItem());
    window.location.href = '/checkout';
  };

  const handleWhatsapp = () => {
    const productList = products.map((cp) => cp.product?.name ?? 'Producto').join(', ');
    const msg = `Hola, me interesa el combo "${combo.name}" (${productList}) por ${formatCurrency(actualPrice)}.`;
    window.open(`https://wa.me/593999707768?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
      {/* Image */}
      <div className="overflow-hidden bg-gray-100 rounded-2xl flex items-center justify-center aspect-square">
        {combo.imageUrl ? (
          <img src={combo.imageUrl} alt={combo.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-500 flex flex-col items-center gap-2">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75">
              <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a4 4 0 0 0-8 0v2" />
            </svg>
            <span className="text-sm">Sin imagen</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-4">
        <div>
          <span className="text-xs font-bold text-accent uppercase tracking-wider">Combo</span>
          <h1 className="font-heading text-2xl sm:text-3xl text-black font-bold leading-tight mt-1">{combo.name}</h1>
        </div>

        {combo.description && (
          <p className="text-sm text-gray-500 leading-relaxed">{combo.description}</p>
        )}

        {/* Pricing */}
        <div className="flex items-baseline gap-3">
          <span className="font-heading text-2xl font-bold text-black">{formatCurrency(actualPrice)}</span>
          {hasDiscount && (
            <span className="text-sm text-error line-through">{formatCurrency(combo.finalPrice)}</span>
          )}
          {discountPercent > 0 && (
            <span className="bg-error text-white text-xs font-bold px-2 py-0.5 rounded">-{discountPercent}%</span>
          )}
        </div>

        {savings > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <p className="text-xs text-green-700">
              Comprar por separado costaría <span className="font-bold">{formatCurrency(originalSum)}</span>.
              Ahorras <span className="font-bold">{formatCurrency(savings)}</span> con este combo.
            </p>
          </div>
        )}

        {/* Included products */}
        <div>
          <h3 className="font-heading text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Productos incluidos</h3>
          <div className="flex flex-col gap-2">
            {products.map((cp) => {
              const variant = cp.productVariation;
              const productPrice = Number(variant?.price ?? cp.product?.price ?? 0);
              return (
                <div key={cp.id} className="flex items-center gap-3 rounded-lg border border-gray-200 p-2.5">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    {(() => {
                      const img = cp.product?.imageUrl || cp.product?.image || (cp.product as any)?.images?.[0]?.url;
                      return img ? (
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">N/A</div>
                      );
                    })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">{cp.product?.name ?? 'Producto'}</p>
                    <p className="text-sm text-gray-500">
                      {variant?.mlSize ? `${variant.mlSize}ml` : ''} {variant?.isFullBottle ? 'Botella' : variant?.mlSize ? 'Decant' : ''}
                      {cp.quantity > 1 && ` · ${cp.quantity}x`}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{formatCurrency(productPrice)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <button
          onClick={comboInStock ? handleBuyNow : undefined}
          disabled={!comboInStock}
          className={`w-full py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
            comboInStock
              ? 'bg-accent text-white hover:bg-accent-hover'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {comboInStock ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
              Comprar combo — {formatCurrency(actualPrice)}
            </>
          ) : (
            'Combo agotado'
          )}
        </button>
        <button
          onClick={comboInStock ? handleAddToCart : undefined}
          disabled={!comboInStock}
          className={`w-full py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-colors border ${
            comboInStock
              ? 'border-black text-black hover:bg-black hover:text-white'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Agregar al carrito
        </button>
        <button
          onClick={handleWhatsapp}
          className="w-full border border-green-600 text-success py-2.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-50 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.996 2C6.474 2 2 6.474 2 11.996C2 13.921 2.548 15.717 3.511 17.25L2.146 22.18L7.204 20.852C8.683 21.688 10.297 22.158 11.996 22.158C17.518 22.158 22 17.684 22 12.162C22 6.64 17.518 2.166 11.996 2.166V2ZM17.152 16.315C16.94 16.91 16.1 17.433 15.441 17.545C14.945 17.625 14.284 17.682 11.838 16.669C8.91 15.452 7.027 12.441 6.884 12.253C6.741 12.064 5.72 10.71 5.72 9.31C5.72 7.91 6.442 7.238 6.741 6.93C6.983 6.681 7.404 6.551 7.82 6.551C7.962 6.551 8.089 6.558 8.199 6.564C8.484 6.577 8.627 6.602 8.814 7.051C9.05 7.618 9.623 9.022 9.693 9.172C9.764 9.322 9.851 9.531 9.742 9.742C9.643 9.941 9.551 10.035 9.408 10.203C9.266 10.372 9.13 10.493 8.979 10.672C8.847 10.832 8.694 10.992 8.865 11.282C9.036 11.571 9.625 12.532 10.489 13.303C11.603 14.298 12.51 14.611 12.83 14.743C13.151 14.875 13.34 14.856 13.568 14.613C13.797 14.368 14.441 13.621 14.713 13.313C14.985 13.003 15.241 13.041 15.526 13.144C15.811 13.248 17.324 13.996 17.625 14.145C17.925 14.295 18.125 14.369 18.196 14.494C18.267 14.618 18.267 15.308 17.965 15.939L17.152 16.315Z" />
          </svg>
          Consultar por WhatsApp
        </button>

        {/* Trust */}
        <div className="grid grid-cols-2 gap-1.5">
          <div className="bg-gray-100 border border-gray-200 rounded-lg px-2.5 py-2 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-success">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p className="text-xs text-gray-500"><span className="font-bold text-black">Garantía</span> · 7 días</p>
          </div>
          <div className="bg-gray-100 border border-gray-200 rounded-lg px-2.5 py-2 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-accent-hover">
              <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <p className="text-xs text-gray-500"><span className="font-bold text-black">Envío</span> · desde $3</p>
          </div>
        </div>
      </div>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
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
