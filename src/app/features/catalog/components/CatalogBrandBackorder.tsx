import ProductGrid from './ProductGrid';
import type { Product } from '@/app/types/global.types';

interface CatalogBrandBackorderProps {
  products: Product[];
  isLoading: boolean;
  isFetching: boolean;
  marcaName?: string;
  marcaSlug?: string;
  total: number;
}

export default function CatalogBrandBackorder({
  products,
  isLoading,
  isFetching,
  marcaName,
  marcaSlug,
  total,
}: CatalogBrandBackorderProps) {
  if (!isLoading && products.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-10">
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow">Por encargo</span>
          <h2 className="mt-2 font-display text-2xl font-light text-text md:text-3xl">
            Bajo pedido{marcaName ? ` · ${marcaName}` : ''}
          </h2>
        </div>
        <span className="font-body text-[11px] uppercase tracking-[0.16em] text-text-muted">
          Plazo 13–17 días
        </span>
      </div>
      <ProductGrid products={products} isLoading={isLoading} isFetching={isFetching} />
      {marcaSlug && total > products.length && (
        <p className="mt-6">
          <a
            href={`/bajo-pedido?marca=${marcaSlug}`}
            className="font-body text-[11px] uppercase tracking-[0.16em] text-text transition-colors hover:text-accent"
          >
            Ver todos en bajo pedido →
          </a>
        </p>
      )}
    </section>
  );
}
