import { useState, useMemo } from 'react';
import ProductPurchaseOptions from './ProductPurchaseOptions';
import type { Product, ProductVariant } from '@/app/types/global.types';

interface ProductDetailIslandProps {
  product: Product;
}

function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const src = images.length > 0 ? images[0] : '';

  if (!src) {
    return (
      <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-500 rounded-xl">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-gray-50 rounded-2xl flex items-center justify-center aspect-square">
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover transition-all duration-300"
      />
    </div>
  );
}

function getDefaultVariant(product: Product): ProductVariant | null {
  const variants = product.variants ?? [];
  // Prefer first full bottle, then first decant
  return variants.find(v => v.isFullBottle) ?? variants[0] ?? null;
}

export default function ProductDetailIsland({ product }: ProductDetailIslandProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(() => getDefaultVariant(product));

  // When a variant is selected and has images, show those; otherwise show product images
  const galleryImages = useMemo(() => {
    if (selectedVariant?.images && selectedVariant.images.length > 0) {
      return selectedVariant.images;
    }
    const productImages = product.images?.length ? product.images : [product.image].filter(Boolean);
    return productImages;
  }, [selectedVariant, product.images, product.image]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-4">
      <div className="max-w-full overflow-hidden">
        <ProductGallery images={galleryImages} name={product.name} />
      </div>
      <div>
        <ProductPurchaseOptions
          product={product}
          selectedVariant={selectedVariant}
          onVariantChange={setSelectedVariant}
        />
      </div>
    </div>
  );
}
