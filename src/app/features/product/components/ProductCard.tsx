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
  const productImages = (product.images ?? []).map((img: any) => (typeof img === 'string' ? img : img.url)).filter(Boolean);
  const productImage = productImages[0] || product.image || product.imageUrl;
  const hoverImage = productImages[1];

  const variants = product.variants ?? [];
  const prices = variants.map((v) => v.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : (product.price ?? 0);
  const maxPrice = prices.length > 0 ? Math.max(...prices) : (product.price ?? 0);

  const sealedStock = product.stock ?? 0;
  const openMl = product.openBottleMlRemaining ?? 0;
  const totalMl = product.totalMl ?? 0;
  const availableMl = openMl + sealedStock * totalMl;
  const hasStock = sealedStock > 0 || availableMl > 0;

  const discount = product.discount ?? 0;
  const hasDiscount = discount > 0;
  const discountedMin = hasDiscount ? minPrice * (1 - discount / 100) : minPrice;

  const formatCount = variants.length || 1;

  // Línea editorial de atributos (reemplaza "familia olfativa", que no viene del back)
  const tags = [
    product.gender && (GENDER_LABELS[product.gender] ?? product.gender),
    product.timeOfDay && (TIME_LABELS[product.timeOfDay] ?? product.timeOfDay),
    product.concentration && (CONCENTRATION_SHORT[product.concentration] ?? product.concentration),
  ].filter(Boolean);

  const productUrl = `/producto/${product.id}`;

  return (
    <a href={productUrl} className="group/card flex flex-col">
      {/* Imagen — formato editorial alargado (≈2:3, igual que la referencia) */}
      <div className="relative aspect-2/3 overflow-hidden bg-surface-raised">
        {productImage ? (
          <>
            <img
              src={productImage}
              alt={product.name}
              loading="lazy"
              className={`h-full w-full object-cover transition-all duration-700 ${hoverImage ? 'group-hover/card:opacity-0' : 'group-hover/card:scale-[1.04]'}`}
            />
            {hoverImage && (
              <img
                src={hoverImage}
                alt={product.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover/card:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-muted">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}

        {/* Descuento — sobre la imagen, abajo izq. */}
        {hasDiscount && (
          <span className="absolute bottom-4 left-4 bg-accent px-2.5 py-1 font-body text-[9px] font-medium uppercase tracking-[0.18em] text-bg">
            -{discount}%
          </span>
        )}

        {/* Vista rápida — barra inferior que se revela al hover (ref. Atelier) */}
        <div className="pointer-events-none absolute inset-x-4 bottom-4 flex translate-y-2 items-center justify-between bg-bg px-3.5 py-3 font-body text-[11px] uppercase tracking-[0.18em] text-text opacity-0 transition-all duration-300 ease-out group-hover/card:translate-y-0 group-hover/card:opacity-100">
          <span>Vista rápida</span>
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="M13 6l6 6-6 6" />
          </svg>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 pt-4">
        {tags.length > 0 && (
          <span className="font-body text-[10px] uppercase tracking-[0.22em] text-text-muted">
            {tags.join(' · ')}
          </span>
        )}

        <h3 className="font-display text-[22px] font-normal leading-tight tracking-[-0.005em] text-text">
          {product.name}
        </h3>

        <span className="mt-2 font-body text-[10px] uppercase tracking-[0.18em] text-text-muted">
          {formatCount} {formatCount === 1 ? 'formato disponible' : 'formatos disponibles'}
        </span>

        <div className="mt-3 flex items-baseline justify-between">
          <span className="font-body text-xs tracking-[0.04em] text-text">
            {hasDiscount ? (
              <>
                <span className="mr-2 text-text-muted line-through">Desde {formatCurrency(minPrice)}</span>
                Desde {formatCurrency(discountedMin)}
              </>
            ) : (
              <>Desde {formatCurrency(minPrice)}</>
            )}
          </span>
          <span
            className={`font-body text-[9px] uppercase tracking-[0.18em] ${
              product.bajoPedido ? 'text-accent' : hasStock ? 'text-text-muted' : 'text-error'
            }`}
          >
            {product.bajoPedido ? 'Entrega 15–30 días' : hasStock ? 'En stock' : 'Sin stock'}
          </span>
        </div>
      </div>
    </a>
  );
}
