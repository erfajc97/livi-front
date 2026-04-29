import { formatCurrency } from '@/app/helpers/formatCurrency';
import type { Product } from '@/app/types/global.types';

interface ProductCardProps {
  product: Product;
}

const CONCENTRATION_SHORT: Record<string, string> = {
  EAU_DE_PARFUM: 'EDP',
  EAU_DE_TOILETTE: 'EDT',
  ELIXIR_DE_PARFUM: 'Elixir',
  EAU_DE_COLOGNE: 'EDC',
  BODY_MIST: 'Body Mist',
  PARFUM_EXTRAIT: 'Extrait',
};

const GENDER_LABELS: Record<string, string> = {
  HOMBRE: 'Hombre',
  MUJER: 'Mujer',
  UNISEX: 'Unisex',
};

const TIME_LABELS: Record<string, string> = {
  DIA: 'Día',
  NOCHE: 'Noche',
};

export default function ProductCard({ product }: ProductCardProps) {
  const productImages = (product.images ?? []).map((img: any) => typeof img === 'string' ? img : img.url).filter(Boolean);
  const productImage = productImages[0] || product.image || product.imageUrl;
  const hoverImage = productImages[1];
  const variants = product.variants ?? [];
  const prices   = variants.map((v) => v.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : (product.price ?? 0);
  const maxPrice = prices.length > 0 ? Math.max(...prices) : (product.price ?? 0);
  const sealedStock = product.stock ?? 0;
  const openMl = product.openBottleMlRemaining ?? 0;
  const totalMl = product.totalMl ?? 0;
  const availableMl = openMl + sealedStock * totalMl;
  const hasFullBottleStock = sealedStock > 0;
  const hasDecantStock = availableMl > 0;
  const hasStock = hasFullBottleStock || hasDecantStock;

  const totalStock = sealedStock;

  const discount = product.discount ?? 0;
  const hasDiscount = discount > 0;

  const discountedMin = hasDiscount ? minPrice * (1 - discount / 100) : minPrice;
  const discountedMax = hasDiscount ? maxPrice * (1 - discount / 100) : maxPrice;

  const priceLabel = discountedMin === discountedMax
    ? formatCurrency(discountedMin)
    : `Desde ${formatCurrency(discountedMin)}`;

  const originalLabel = minPrice === maxPrice
    ? formatCurrency(minPrice)
    : `Desde ${formatCurrency(minPrice)}`;

  const productUrl = `/producto/${product.id}`;

  return (
    <a href={productUrl} className="group/card relative flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden w-full hover:shadow-md transition-shadow">
      {/* Discount badge */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10 bg-error text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          -{discount}%
        </div>
      )}

      {/* Stock badge */}
      {hasStock && totalStock <= 5 && (
        <div className="absolute top-3 right-3 z-10 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          Quedan {totalStock}
        </div>
      )}

      {/* Image */}
      <div className="block overflow-hidden relative">
        {productImage ? (
          <>
            <img
              src={productImage}
              alt={product.name}
              className={`w-full aspect-square object-cover transition-all duration-500 ${hoverImage ? 'group-hover/card:opacity-0' : 'group-hover/card:scale-105'}`}
              loading="lazy"
            />
            {hoverImage && (
              <img
                src={hoverImage}
                alt={product.name}
                className="absolute inset-0 w-full aspect-square object-cover opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"
                loading="lazy"
              />
            )}
          </>
        ) : (
          <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 p-4">
        <h3 className="font-heading font-semibold text-base text-black leading-snug line-clamp-1 tracking-wide">
          {product.name}
        </h3>
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {product.gender && (
            <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
              {GENDER_LABELS[product.gender] ?? product.gender}
            </span>
          )}
          {product.timeOfDay && (
            <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
              {TIME_LABELS[product.timeOfDay] ?? product.timeOfDay}
            </span>
          )}
          {product.concentration && (
            <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
              {CONCENTRATION_SHORT[product.concentration] ?? product.concentration}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {hasDiscount ? (
            <>
              <span className="font-body text-xs text-gray-500 line-through">{originalLabel}</span>
              <span className="font-heading text-sm font-bold text-error">{priceLabel}</span>
            </>
          ) : (
            <span className="font-body text-xs text-gray-500">{priceLabel}</span>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4 mt-auto">
        <span
          className={`flex items-center justify-center w-full py-2.5 font-heading text-xs font-bold uppercase tracking-wider transition-colors rounded-full ${
            hasStock
              ? 'bg-black text-white group-hover/card:bg-neutral-800'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {hasStock
            ? (hasDecantStock && !hasFullBottleStock ? 'DECANTS DISPONIBLES' : 'VER PRODUCTO')
            : 'SIN STOCK'}
        </span>
      </div>
    </a>
  );
}
