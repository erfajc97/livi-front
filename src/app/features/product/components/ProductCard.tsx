import { formatCurrency } from '@/app/helpers/formatCurrency';
import type { Product } from '@/app/types/global.types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const productImages = (product.images ?? [])
    .map((img: any) => (typeof img === 'string' ? img : img.url))
    .filter(Boolean);
  const productImage = productImages[0] || product.image || product.imageUrl;
  const hoverImage = productImages[1];

  const variants = product.variants ?? [];
  // Formatos: preferir la lista compacta del backend; si no, derivar de las
  // variantes cargadas (mock / detalle).
  const formats = (product.formats && product.formats.length
    ? product.formats
    : variants.map((v) => ({
        id: v.id,
        ml: v.ml,
        price: v.price,
        isFullBottle: v.isFullBottle,
      }))
  ).filter((f) => f.ml > 0 || f.price > 0);

  const prices = formats.map((f) => f.price).filter((n) => n > 0);
  const minPrice =
    product.minFormatPrice ?? (prices.length ? Math.min(...prices) : (product.price ?? 0));
  const maxPrice =
    product.maxFormatPrice ?? (prices.length ? Math.max(...prices) : (product.price ?? 0));
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

  // Máximo 2 formatos como chips; el resto se ve en el detalle (botón +).
  const chipFormats = formats.slice(0, 2);

  const productUrl = `/producto/${product.id}`;

  return (
    <div className="group/card flex flex-col">
      {/* Imagen — tile blanco (4:5); la botella llena casi todo con margen chico */}
      <a href={productUrl} className="block">
        <div className="relative aspect-4/5 overflow-hidden bg-white">
          {productImage ? (
            <>
              <img
                src={productImage}
                alt={product.name}
                loading="lazy"
                className={`h-full w-full object-contain p-3 sm:p-4 transition-all duration-700 ${hoverImage ? 'group-hover/card:opacity-0' : 'group-hover/card:scale-[1.04]'}`}
              />
              {hoverImage && (
                <img
                  src={hoverImage}
                  alt={product.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-contain p-3 opacity-0 transition-opacity duration-700 sm:p-4 group-hover/card:opacity-100"
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

          {hasDiscount && (
            <span className="absolute left-3 top-3 bg-accent px-2.5 py-1 font-body text-[9px] font-medium uppercase tracking-[0.18em] text-bg">
              -{discount}%
            </span>
          )}
        </div>
      </a>

      {/* Info */}
      <div className="flex flex-col gap-1.5 pt-3">
        <a href={productUrl}>
          <h3 className="font-display text-[15px] font-normal leading-snug tracking-[-0.005em] text-text transition-colors group-hover/card:text-accent">
            {product.name}
          </h3>
        </a>

        {/* Precio (rango) + estado */}
        <div className="flex items-baseline justify-between gap-2">
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
            {product.bajoPedido ? 'Bajo pedido' : hasStock ? 'En stock' : 'Sin stock'}
          </span>
        </div>

        {/* Chips de formato (máx 2) + botón + → detalle */}
        {chipFormats.length > 0 && (
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {chipFormats.map((f) => (
              <a
                key={f.id}
                href={productUrl}
                className="border border-border px-2.5 py-1 font-body text-[10px] uppercase tracking-[0.08em] text-text-soft transition-colors hover:border-text hover:text-text"
              >
                {f.ml} ml
              </a>
            ))}
            <a
              href={productUrl}
              aria-label="Ver todos los formatos"
              className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-text-soft transition-colors hover:border-text hover:text-text"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
