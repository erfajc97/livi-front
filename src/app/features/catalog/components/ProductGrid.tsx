import ProductCard from '@/app/features/product/components/ProductCard';
import Loader from '@/app/components/Loader';
import type { Product } from '@/app/types/global.types';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  isFetching: boolean;
}

export default function ProductGrid({ products, isLoading, isFetching }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader size={45} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-500 text-sm">
          No se encontraron productos con esos filtros.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity ${
        isFetching ? 'opacity-60' : 'opacity-100'
      }`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
