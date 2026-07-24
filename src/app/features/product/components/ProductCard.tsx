import { formatCurrency } from '@/app/helpers/formatCurrency';
import type { Product } from '@/app/types/global.types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const productImages = (product.images ?? []).map((img: any) => (typeof img === 'string' ? img : img.url)).filter(Boolean);
  const productImage = productImages[0] || product.image || product.imageUrl;
  const hoverImage = productImages[1];

  const variants = product.variants ?? [];
  const variantPrices = variants.map((v) => v.price).filter((n) => n > 0);
  // Rango de precio de formatos: preferir lo que calcula el backend
  // (minFormatPrice/maxFormatPrice); si no, derivar de las variantes cargadas.
  const minPrice =
    product.minFormatPrice ??
    (variantPrices.length ? Math.min(...variantPrices) : (product.price ?? 0));
  const maxPrice =
    product.maxFormatPrice ??
    (variantPrices.length ? Math.max(...variantPrices) : (product.price ?? 0));
  const hasRange = maxPrice > minPrice;

  const sealedStock = product.stock ?? 0;
  const openMl = product.openBottleMlRemaining ?? 0;
  const totalMl = product.totalMl ?? 0;
  const availableMl = openMl + sealedStock * totalMl;
  const hasStock = sealedStock > 0 || availableMl > 0;

  const discount = product.discount ?? 0;
  const hasDiscount = discount > 0;
  const discountedMin = hasDiscount ? minPrice * (1 - discount / 100) : minPrice;
  const discountedMax = hasDiscount ? maxPrice * (1 - discount / 100) : maxPrice;

  // Formatos comprables (frasco + decants). El listado del back trae
  // variationsCount; si no, cae a las variantes cargadas.
  const formatCount =
    product.variationsCount && product.variationsCount > 0
      ? product.variationsCount
      : variants.length || 1;

  const productUrl = `/producto/${product.id}`;

  return (
    <a href={productUrl} className="group/card flex flex-col">
      {/* Imagen — tile blanco uniforme; la botella se muestra COMPLETA
          (object-contain) y centrada con aire, nunca recortada ni pegada a
          los lados. El fondo blanco de la foto se funde con el tile. */}
      <div className="group/img relative aspect-3/4 overflow-hidden bg-white">
        {productImage ? (
          <>
            <img
              src={productImage}
              alt={product.name}
              loading="lazy"
              className={`h-full w-full object-contain p-4 transition-all duration-700 ${hoverImage ? 'group-hover/card:opacity-0' : 'group-hover/card:scale-[1.04]'}`}
            />
            {hoverImage && (
              <img
                src={hoverImage}
                alt={product.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-contain p-4 opacity-0 transition-opacity duration-700 group-hover/card:opacity-100"
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
          <span className="absolute bottom-3 left-3 bg-accent px-2.5 py-1 font-body text-[9px] font-medium uppercase tracking-[0.18em] text-bg">
            -{discount}%
          </span>
        )}

        {/* Vista rápida — barra inferior que se revela al hover */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between bg-bg px-3.5 py-2.5 font-body text-[10px] uppercase tracking-[0.18em] text-text opacity-0 transition-all duration-300 ease-out group-hover/card:translate-y-0 group-hover/card:opacity-100">
          <span>Vista rápida</span>
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="M13 6l6 6-6 6" />
          </svg>
        </div>
      </div>

      {/* Info — orden: nombre · precio + estado · formatos */}
      <div className="flex flex-col gap-1 pt-3">
        <h3 className="font-display text-[15px] font-normal leading-snug tracking-[-0.005em] text-text">
          {product.name}
        </h3>

        <div className="mt-0.5 flex items-baseline justify-between gap-2">
          <span className="font-body text-[11px] tracking-[0.02em] text-text">
            {hasDiscount && (
              <span className="mr-1.5 text-text-muted line-through">{formatCurrency(minPrice)}</span>
            )}
            Desde {formatCurrency(discountedMin)}
            {hasRange && <> – {formatCurrency(discountedMax)}</>}
          </span>
          <span
            className={`shrink-0 font-body text-[9px] uppercase tracking-[0.16em] ${
              product.bajoPedido ? 'text-accent' : hasStock ? 'text-text-muted' : 'text-error'
            }`}
          >
            {product.bajoPedido ? 'Entrega 15–30 días' : hasStock ? 'En stock' : 'Sin stock'}
          </span>
        </div>

        <span className="mt-0.5 font-body text-[9px] uppercase tracking-[0.16em] text-text-muted">
          {formatCount} {formatCount === 1 ? 'formato disponible' : 'formatos disponibles'}
        </span>
      </div>
    </a>
  );
}
