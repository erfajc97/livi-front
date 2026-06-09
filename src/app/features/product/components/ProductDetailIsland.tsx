import { useState, useMemo } from 'react';
import ProductPurchaseOptions from './ProductPurchaseOptions';
import type { Product, ProductVariant } from '@/app/types/global.types';

interface ProductDetailIslandProps {
  product: Product;
}

function ProductGallery({
  images,
  name,
  bajoPedido,
}: {
  images: string[];
  name: string;
  bajoPedido?: boolean;
}) {
  const [active, setActive] = useState(0);
  const list = images.filter(Boolean);
  const idx = Math.min(active, Math.max(0, list.length - 1));

  if (list.length === 0) {
    return (
      <div className="flex aspect-[5/6] items-center justify-center bg-surface-raised text-text-muted">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-raised md:aspect-[5/6]">
        <img src={list[idx]} alt={name} className="h-full w-full object-cover transition-opacity duration-300" />
        {bajoPedido && (
          <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 border border-accent bg-bg px-3 py-1.5 font-body text-[10px] uppercase tracking-[0.22em] text-text">
            <span className="h-[5px] w-[5px] rounded-full bg-accent" />
            Bajo Pedido
          </span>
        )}
      </div>
      {list.length > 1 && (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {list.slice(0, 3).map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`aspect-square overflow-hidden border transition-colors ${
                idx === i ? 'border-text' : 'border-border opacity-90 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`${name} ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductDetailIsland({ product }: ProductDetailIslandProps) {
  // Default: null = full bottle (product itself), not a variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // When a variant is selected and has images, show those; otherwise show product images
  const galleryImages = useMemo(() => {
    if (selectedVariant?.images && selectedVariant.images.length > 0) {
      return selectedVariant.images;
    }
    const productImages = product.images?.length
      ? product.images
      : [product.image].filter((img): img is string => Boolean(img));
    return productImages;
  }, [selectedVariant, product.images, product.image]);

  return (
    <div className="mt-4 grid grid-cols-1 items-start gap-12 md:grid-cols-[1.05fr_1fr] md:gap-20">
      <div className="max-w-full overflow-hidden">
        <ProductGallery images={galleryImages} name={product.name} bajoPedido={product.bajoPedido} />
      </div>
      <div className="md:sticky md:top-24">
        <ProductPurchaseOptions
          product={product}
          selectedVariant={selectedVariant}
          onVariantChange={setSelectedVariant}
        />
      </div>
    </div>
  );
}
