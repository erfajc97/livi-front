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

  return (
    <a href={`/combo/${combo.id}`} className="group relative flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden w-full hover:shadow-md transition-shadow">
      {/* Discount badge */}
      {discountPercent > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-error text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          -{discountPercent}%
        </div>
      )}

      {/* Image */}
      <div className="block overflow-hidden">
        {comboImage ? (
          <img
            src={comboImage}
            alt={combo.name}
            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a4 4 0 0 0-8 0v2" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4">
        <h3 className="font-heading font-semibold text-base text-black leading-snug line-clamp-2 tracking-wide">
          {combo.name}
        </h3>

        {combo.description && (
          <p className="text-gray-500 text-xs line-clamp-2">{combo.description}</p>
        )}

        {/* Included products */}
        {products.length > 0 && (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Incluye:
            </span>
            <ul className="space-y-0.5">
              {products.slice(0, 4).map((cp) => {
                const isFullBottle = cp.productVariation?.isFullBottle;
                const mlSize = cp.productVariation?.mlSize;
                return (
                  <li key={cp.id} className="text-sm text-gray-500 leading-tight">
                    {cp.quantity > 1 && <span className="font-medium">{cp.quantity}x </span>}
                    {cp.product?.name ?? 'Producto'}
                    {mlSize && ` (${mlSize}ml${isFullBottle ? ' - Botella' : ''})`}
                  </li>
                );
              })}
              {products.length > 4 && (
                <li className="text-sm text-gray-500">
                  +{products.length - 4} producto{products.length - 4 > 1 ? 's' : ''} más
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Pricing */}
        <div className="flex flex-col gap-1 mt-1">
          {hasDiscount && (
            <span className="font-body text-xs text-error line-through">
              {formatCurrency(combo.finalPrice)}
            </span>
          )}
          <span className={`font-heading text-lg font-bold ${hasDiscount ? 'text-success' : 'text-black'}`}>
            {formatCurrency(actualPrice)}
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4 mt-auto">
        <span className="flex items-center justify-center w-full py-2.5 font-heading text-xs font-bold uppercase tracking-wider transition-colors rounded-full bg-black text-white group-hover:bg-neutral-800">
          Ver Combo
        </span>
      </div>
    </a>
  );
}
