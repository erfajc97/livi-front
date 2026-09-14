import { useState, useEffect, useMemo, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AppProviders from '@/app/providers/AppProviders';
import ProductPurchaseOptions from './ProductPurchaseOptions';
import { EMBLA_DURATION } from '@/app/components/UI/CarouselNav';
import type { Product, ProductVariant } from '@/app/types/global.types';

interface ProductDetailIslandProps {
  product: Product;
  /** Productos "Combina con" resueltos en el servidor (mini carrusel del panel). */
  pairsWith?: Product[];
}

function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const list = images.filter(Boolean);
  const [idx, setIdx] = useState(0);

  /* Arrastre real —con el dedo y con el mouse— en móvil. En desktop la
     galería es una pila de fotos grandes con scroll (ref. minabaie). */
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: list.length > 1,
    align: 'start',
    containScroll: false,
    duration: EMBLA_DURATION,
  });

  useEffect(() => {
    if (!emblaApi) return;
    const sync = () => setIdx(emblaApi.selectedScrollSnap());
    sync();
    emblaApi.on('select', sync);
    emblaApi.on('reInit', sync);
    return () => {
      emblaApi.off('select', sync);
      emblaApi.off('reInit', sync);
    };
  }, [emblaApi]);

  // Al cambiar de variante cambia la lista de fotos: volver a la primera.
  useEffect(() => {
    emblaApi?.reInit();
    emblaApi?.scrollTo(0, true);
  }, [emblaApi, images]);

  const goTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  if (list.length === 0) {
    return (
      <div className="flex h-[55svh] items-center justify-center bg-bg-alt text-text-muted">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    );
  }

  return (
    <>
      {/* MÓVIL: carrusel con swipe + puntos */}
      <div className="flex h-[52svh] flex-col gap-2.5 sm:h-[58svh] md:hidden">
        <div className="relative min-h-0 flex-1 overflow-hidden bg-bg-alt">
          <div className="h-full overflow-hidden" ref={emblaRef}>
            <div className="flex h-full">
              {list.map((img, i) => (
                <div key={i} className="h-full min-w-0 shrink-0 basis-full">
                  <img
                    src={img}
                    alt={i === 0 ? name : `${name} ${i + 1}`}
                    draggable={false}
                    className="h-full w-full select-none object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {list.length > 1 && (
          <div className="flex shrink-0 items-center justify-center gap-1.5 py-1">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Imagen ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === i ? 'w-4 bg-text' : 'w-1.5 bg-text/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* DESKTOP: pila editorial de fotos grandes con scroll (2 columnas que
          alternan; la primera y las impares van a ancho completo si son pocas).
          Tiles altos 3:4 — más largos, como la ficha de referencia. */}
      <div className="hidden grid-cols-2 gap-3 md:grid">
        {list.map((img, i) => (
          <div
            key={i}
            className={`overflow-hidden bg-bg-alt ${
              list.length % 2 !== 0 && i === list.length - 1 ? 'col-span-2' : ''
            }`}
          >
            <img
              src={img}
              alt={i === 0 ? name : `${name} ${i + 1}`}
              loading={i < 2 ? 'eager' : 'lazy'}
              className={`w-full object-cover ${
                list.length % 2 !== 0 && i === list.length - 1
                  ? 'aspect-[8/5]'
                  : 'aspect-[3/4]'
              }`}
            />
          </div>
        ))}
      </div>
    </>
  );
}

/**
 * Island raíz del detalle: necesita AppProviders porque dentro se usan queries
 * de TanStack (p. ej. los días de entrega configurados en el admin).
 */
export default function ProductDetailIsland(props: ProductDetailIslandProps) {
  return (
    <AppProviders>
      <ProductDetailContent {...props} />
    </AppProviders>
  );
}

function ProductDetailContent({ product, pairsWith }: ProductDetailIslandProps) {
  // Default: primera variante — la galería arranca con SUS fotos (las que el
  // admin subió a la variante), no con las genéricas del producto.
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    () => product.variants?.[0] ?? null,
  );

  // When a variant is selected and has images, show those; otherwise show product images
  const galleryImages = useMemo(() => {
    const toUrl = (img: any) => (typeof img === 'string' ? img : img?.url);
    if (selectedVariant?.images && selectedVariant.images.length > 0) {
      return selectedVariant.images.map(toUrl).filter(Boolean) as string[];
    }
    const productImages = product.images?.length
      ? product.images.map(toUrl).filter(Boolean) as string[]
      : [product.image ?? product.imageUrl].filter((img): img is string => Boolean(img));
    return productImages;
  }, [selectedVariant, product.images, product.image, product.imageUrl]);

  return (
    /* Izquierda: galería con scroll · Derecha: panel de compra fijo (sticky),
       estilo minabaie. */
    <div className="mt-4 grid grid-cols-1 items-start gap-6 md:grid-cols-[1.25fr_1fr] md:gap-10">
      <div className="max-w-full overflow-hidden">
        <ProductGallery images={galleryImages} name={product.name} />
      </div>
      <div className="md:sticky md:top-24">
        <ProductPurchaseOptions
          product={product}
          selectedVariant={selectedVariant}
          onVariantChange={setSelectedVariant}
          pairsWith={pairsWith}
        />
      </div>
    </div>
  );
}
