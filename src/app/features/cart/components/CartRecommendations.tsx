import { useLandingSectionsActiveQuery } from '@/app/tanstack-queries/landingSectionsQuery';
import ProductCard from '@/app/features/product/components/ProductCard';
import ProductCardSkeleton from '@/app/components/UI/ProductCardSkeleton';
import type { Product } from '@/app/types/global.types';

/**
 * "No te pierdas estos productos" — publicidad de productos al pie del
 * carrito. Los productos salen de las secciones que el admin marcó con
 * ubicación "carrito" (mismo CRUD que las secciones de la landing).
 */
export default function CartRecommendations() {
  const { data: sections = [], isLoading } = useLandingSectionsActiveQuery('cart');

  // Esqueleto mientras llegan las secciones: misma hilera deslizable en
  // mobile y mismo grid de 4 en desktop que el contenido cargado.
  if (isLoading) {
    return (
      <section className="mt-12 border-t border-border pt-10 md:mt-16 md:pt-14" aria-hidden="true">
        <div className="mb-6 h-6 w-56 animate-pulse rounded-sm bg-surface-raised md:mb-8" />
        <div className="flex gap-5 overflow-hidden md:grid md:grid-cols-4 md:gap-6">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="shrink-0 basis-[calc(50%-0.625rem)]">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Una sola fila: se juntan las secciones de carrito y se quitan repetidos.
  const seen = new Set<string>();
  const products: Product[] = [];
  for (const section of [...sections].sort((a, b) => a.order - b.order)) {
    for (const product of section.products ?? []) {
      if (seen.has(product.id)) continue;
      seen.add(product.id);
      products.push(product);
    }
  }

  if (products.length === 0) return null;

  const title = sections[0]?.title || 'No te pierdas estos productos';

  return (
    <section className="mt-12 border-t border-border pt-10 md:mt-16 md:pt-14">
      <div className="mb-6 flex items-baseline justify-between md:mb-8">
        <div className="flex items-baseline gap-4">
          <span className="font-body text-[10px] uppercase tracking-[0.24em] text-text-muted">—</span>
          <h2 className="font-display text-2xl font-light text-text md:text-3xl">{title}</h2>
        </div>
        <a
          href="/catalogo/perfumes"
          className="hidden border-b border-text pb-0.5 font-body text-[11px] uppercase tracking-[0.18em] text-text transition-colors hover:border-accent hover:text-accent sm:inline-block"
        >
          Ver todo
        </a>
      </div>

      {/* Mobile: una sola hilera deslizable (2 cards por pantalla, ancho
          fijo para que el desplazamiento no desfase). Desktop: grid de 4. */}
      <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto md:grid md:snap-none md:grid-cols-4 md:gap-6 md:overflow-visible">
        {products.slice(0, 4).map((product) => (
          <div key={product.id} className="shrink-0 basis-[calc(50%-0.625rem)] snap-start md:snap-align-none">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
