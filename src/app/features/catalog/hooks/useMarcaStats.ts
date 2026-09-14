import { useProductsQuery } from '@/app/tanstack-queries/productsQuery';
import type { Product } from '@/app/types/global.types';

const STATS_LIMIT = 100;

function formatsOf(product: Product) {
  if (product.formats?.length) return product.formats;
  return product.variants ?? [];
}

function minPriceOf(product: Product): number | null {
  if (product.minFormatPrice != null && Number.isFinite(Number(product.minFormatPrice))) {
    return Number(product.minFormatPrice);
  }
  const prices = formatsOf(product)
    .map((format) => Number(format.price))
    .filter((price) => Number.isFinite(price) && price > 0);
  if (prices.length) return Math.min(...prices);
  const fallback = Number(product.price);
  if (Number.isFinite(fallback) && fallback > 0) return fallback;
  return null;
}

export function useMarcaStats(marcaId?: number) {
  const enabled = marcaId != null;
  const query = useProductsQuery({
    queryParams: { marcaId, page: 1, limit: STATS_LIMIT },
    enabled,
  });

  const products = query.data?.content ?? [];
  const prices = products.map(minPriceOf).filter((price): price is number => price != null);

  return {
    total: query.data?.pagination?.total ?? products.length,
    fromPrice: prices.length ? Math.min(...prices) : null,
    isLoading: enabled && query.isLoading,
  };
}
