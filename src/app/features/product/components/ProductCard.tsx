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

  // Formatos comprables (frasco + decants). El listado del back trae
  // variationsCount; si no, cae a las variantes cargadas.
  const formatCount =
    product.variationsCount && product.variationsCount > 0
      ? product.variationsCount
      : variants.length || 1;

  const productUrl = `/producto/${product.id}`;

  return (
    <a href={productUrl} className="group/card flex flex-col">
      {/* Imagen — formato editorial (algo menos alto que 2:3 para apreciar mejor la botella) */}
      <div className="relative aspect-3/4 overflow-hidden bg-surface-raised">
        {/* Frame con padding — la imagen no queda pegada al borde */}
        <div className="absolute inset-0 overflow-hidden px-4 py-4">
          <div className="relative h-full w-full overflow-hidden">
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
          </div>
        </div>

        {/* Descuento — sobre la imagen, abajo izq. */}
        {hasDiscount && (
          <span className="absolute bottom-5 left-3 bg-accent px-2.5 py-1 font-body text-[9px] font-medium uppercase tracking-[0.18em] text-bg">
            -{discount}%
          </span>
        )}

        {/* Vista rápida — barra inferior que se revela al hover (ref. Atelier) */}
        <div className="pointer-events-none absolute inset-x-3 bottom-5 flex translate-y-2 items-center justify-between bg-bg px-3.5 py-3 font-body text-[11px] uppercase tracking-[0.18em] text-text opacity-0 transition-all duration-300 ease-out group-hover/card:translate-y-0 group-hover/card:opacity-100">
          <span>Vista rápida</span>
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="M13 6l6 6-6 6" />
          </svg>
        </div>
      </div>

      {/* Info — orden: nombre · precio + estado · formatos */}
      <div className="flex flex-col gap-1.5 pt-4">
        <h3 className="font-display text-[22px] font-normal leading-tight tracking-[-0.005em] text-text">
          {product.name}
        </h3>

        <div className="mt-1 flex items-baseline justify-between">
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

        <span className="mt-1 font-body text-[10px] uppercase tracking-[0.18em] text-text-muted">
          {formatCount} {formatCount === 1 ? 'formato disponible' : 'formatos disponibles'}
        </span>
      </div>
    </a>
  );
}
