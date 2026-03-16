import { formatCurrency } from '@/app/helpers/formatCurrency';
import type { Product } from '@/app/types/global.types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const variants = product.variants ?? [];
  const prices   = variants.map((v) => v.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const hasStock = variants.some((v) => v.stock > 0);

  const priceLabel =
    minPrice === maxPrice
      ? formatCurrency(minPrice)
      : `Desde ${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;

  return (
    <article className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden w-full">
      {/* Image */}
      <a href={`/producto/${product.id}`} className="block overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-300">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </a>

      {/* Info */}
      <div className="flex flex-col gap-1 p-4">
        <h3 className="font-heading font-semibold text-base text-black leading-snug line-clamp-1 tracking-wide">
          {product.name}
        </h3>
        <span className="font-body text-xs text-gray-500">{priceLabel}</span>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4 mt-auto">
        <a
          href={`/producto/${product.id}`}
          className={`flex items-center justify-center w-full py-2.5 font-heading text-xs font-bold uppercase tracking-wider transition-colors rounded-full ${
            hasStock
              ? 'bg-black text-white hover:bg-neutral-800'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
          }`}
        >
          {hasStock ? 'VER PRODUCTO' : 'SIN STOCK'}
        </a>
      </div>
    </article>
  );
}
