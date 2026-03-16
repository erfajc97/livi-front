import ProductCard from '@/app/features/product/components/ProductCard';
import Loader from '@/app/components/Loader';
import type { Product } from '@/app/types/global.types';

interface FeaturedProductsSectionProps {
  products: Product[];
  isLoading: boolean;
}

export default function FeaturedProductsSection({ products, isLoading }: FeaturedProductsSectionProps) {
  return (
    <section className="bg-white border-t border-gray-200 py-14 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header - TITLE ONLY */}
        <div className="flex items-start mb-6">
          <h2 className="font-heading text-xl sm:text-2xl font-black md:text-[28px] text-bg uppercase tracking-wide">
            LOS MÁS VENDIDOS
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size={40} />
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-[--color-text-muted] py-10 text-sm">
            No hay productos disponibles.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {/* CTA mobile */}
        <div className="sm:hidden text-center mt-8">
          <a
            href="/catalogo"
            className="inline-block px-8 py-3 border border-[--color-border-accent] text-[--color-accent] font-heading text-xs uppercase tracking-widest hover:bg-[--color-surface] transition-colors"
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            Ver todo el catálogo
          </a>
        </div>
      </div>
    </section>
  );
}
