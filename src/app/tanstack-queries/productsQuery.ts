import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/app/config/axiosConfig';
import { API_ENDPOINTS } from '@/app/api/endpoints';
import { MOCK_ENABLED } from '@/app/lib/mock';
import { MOCK_PRODUCTS } from '@/app/features/landing/data';
import { parseProductId } from '@/app/helpers/productUrl';
import type { Product, ProductQueryParams, PaginatedResponse } from '@/app/types/global.types';

/** Extract image URLs in admin gallery order (1 = card, 2 = hover). */
const extractImages = (images: any): string[] => {
  if (!images || !Array.isArray(images)) return [];
  const urls = [...images]
    .filter((img: any) => img && (typeof img === 'string' || (img.url && img.isActive !== false)))
    .sort((a: any, b: any) => {
      if (typeof a === 'string' || typeof b === 'string') return 0;
      return (
        Number(a.displayOrder ?? 0) - Number(b.displayOrder ?? 0) ||
        Number(a.id ?? 0) - Number(b.id ?? 0)
      );
    })
    .map((img: any) => (typeof img === 'string' ? img : img.url))
    .filter(Boolean) as string[];
  return [...new Set(urls)];
};

/** Maps backend product shape to frontend Product interface */
export const mapProduct = (raw: any): Product => {
  const imageList = extractImages(raw.images);
  return {
    id: String(raw.id),
    name: raw.name ?? '',
    description: raw.description ?? '',
    image: imageList[0] || raw.image || raw.imageUrl || '',
    images: imageList.length > 0 ? imageList : [raw.imageUrl].filter(Boolean),
    variants: (raw.variations ?? raw.variants ?? []).map((v: any) => ({
      id: String(v.id),
      name: v.name ?? undefined,
      price: Number(v.price ?? 0),
      sku: v.sku ?? undefined,
      colorHex: v.colorHex ?? undefined,
      size: v.size ?? undefined,
      availableQuantity: Number(v.availableQuantity ?? 0),
      images: extractImages(v.images).map((url, i) => ({ id: i, url })),
    })),
    variationsCount: raw.variationsCount ?? (raw.variations ?? raw.variants ?? []).length,
    isActive: raw.isActive ?? true,
    discount: raw.discount ? Number(raw.discount) : undefined,
    detailDescription: raw.detailDescription ?? undefined,
    benefits: (() => {
      if (!raw.benefits) return undefined;
      try { const parsed = JSON.parse(raw.benefits); return Array.isArray(parsed) ? parsed : undefined; }
      catch { return undefined; }
    })(),
    commonUses: (() => {
      if (!raw.commonUses) return undefined;
      try { const parsed = JSON.parse(raw.commonUses); return Array.isArray(parsed) ? parsed : undefined; }
      catch { return undefined; }
    })(),
    pairsWith: (() => {
      if (!raw.pairsWith) return undefined;
      try {
        const parsed = JSON.parse(raw.pairsWith);
        return Array.isArray(parsed) ? parsed.map(Number).filter((n: number) => !Number.isNaN(n)) : undefined;
      } catch { return undefined; }
    })(),
    sizes: (() => {
      if (!raw.sizes) return undefined;
      try {
        const parsed = JSON.parse(raw.sizes);
        if (!Array.isArray(parsed)) return undefined;
        // Dedupe sin distinguir mayúsculas: el catálogo suelto llegaba con
        // "X, x" y la ficha pintaba dos botones de talla idénticos.
        const unique = new Map<string, string>();
        for (const value of parsed) {
          const label = String(value).replace(/\s+/g, ' ').trim();
          if (!label) continue;
          const key = label.toLocaleLowerCase();
          if (!unique.has(key)) unique.set(key, label);
        }
        return unique.size > 0 ? [...unique.values()] : undefined;
      } catch { return undefined; }
    })(),
    instagramPosts: (() => {
      if (!raw.instagramPosts) return undefined;
      try {
        const parsed = JSON.parse(raw.instagramPosts);
        return Array.isArray(parsed)
          ? parsed
              .filter((p: any) => p && p.url)
              .map((p: any) => ({ url: String(p.url), image: String(p.image ?? '') }))
          : undefined;
      } catch { return undefined; }
    })(),
    stock: raw.stock != null ? Number(raw.stock) : undefined,
    price: raw.price ? Number(raw.price) : undefined,
    minFormatPrice: raw.minFormatPrice != null ? Number(raw.minFormatPrice) : undefined,
    maxFormatPrice: raw.maxFormatPrice != null ? Number(raw.maxFormatPrice) : undefined,
    formats: Array.isArray(raw.formats)
      ? raw.formats.map((f: any) => ({
          id: String(f.id),
          name: f.name ?? undefined,
          price: Number(f.price),
          imageUrl: f.imageUrl ?? undefined,
          colorHex: f.colorHex ?? undefined,
          size: f.size ?? undefined,
        }))
      : undefined,
    categoryId: raw.categoryId != null ? Number(raw.categoryId) : (raw.marca?.categoryId != null ? Number(raw.marca.categoryId) : undefined),
    marcaId: raw.marcaId != null ? Number(raw.marcaId) : undefined,
    marca: raw.marca?.name
      ? {
          id: Number(raw.marca.id ?? raw.marcaId ?? 0),
          name: raw.marca.name,
          slug: raw.marca.slug ?? undefined,
        }
      : undefined,
    createdAt: raw.createdAt ?? '',
  };
};

const applyMockFilters = (params: ProductQueryParams): PaginatedResponse<Product> => {
  let filtered = [...MOCK_PRODUCTS];
  if (params.search) filtered = filtered.filter(p =>
    p.name.toLowerCase().includes(params.search!.toLowerCase())
  );
  if (params.inStock) filtered = filtered.filter(p => (p.stock ?? 0) > 0);
  if (params.hasDiscount) filtered = filtered.filter(p => (p.discount ?? 0) > 0);
  if (params.minPrice !== undefined) {
    filtered = filtered.filter(p => (p.price ?? 0) >= params.minPrice!);
  }
  if (params.maxPrice !== undefined) {
    filtered = filtered.filter(p => (p.price ?? 0) <= params.maxPrice!);
  }
  if (params.sortBy === 'createdAt') {
    filtered.sort((a, b) =>
      params.sortOrder === 'ASC'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else if (params.sortBy === 'price') {
    filtered.sort((a, b) =>
      params.sortOrder === 'ASC'
        ? (a.price ?? 0) - (b.price ?? 0)
        : (b.price ?? 0) - (a.price ?? 0)
    );
  }
  const limit = params.limit ?? 12;
  const page  = params.page  ?? 1;
  const total = filtered.length;
  const start = (page - 1) * limit;
  return {
    content:    filtered.slice(start, start + limit),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const fetchProducts = async (params: ProductQueryParams): Promise<PaginatedResponse<Product>> => {
  if (MOCK_ENABLED) return applyMockFilters(params);
  try {
    const { data } = await axiosInstance.get(API_ENDPOINTS.PRODUCTS, { params });

    // Backend returns: { statusCode, message, data: { data: [...], total, page, limit, totalPages }, ... }
    const responseData = data?.data ?? data;

    if (Array.isArray(responseData)) {
      return { content: responseData.map(mapProduct), pagination: { page: 1, limit: responseData.length, total: responseData.length, totalPages: 1 } };
    }

    if (responseData?.content) {
      return {
        ...responseData,
        content: responseData.content.map(mapProduct),
      };
    }

    // Map backend response format to expected format
    if (responseData?.data && Array.isArray(responseData.data)) {
      return {
        content: responseData.data.map(mapProduct),
        pagination: {
          page: responseData.page ?? 1,
          limit: responseData.limit ?? 20,
          total: responseData.total ?? 0,
          totalPages: responseData.totalPages ?? 1,
        },
      };
    }

    return responseData || applyMockFilters(params);
  } catch (error: any) {
    console.error('[fetchProducts] API error — falling back to mock filters:', error?.response?.status, error?.response?.data ?? error?.message);
    return applyMockFilters(params);
  }
};

export const fetchProductById = async (id: string): Promise<Product> => {
  // La ruta pública es /producto/{id}-{slug}: resolver por el id numérico.
  const numericId = parseProductId(id);
  if (MOCK_ENABLED) {
    const found = MOCK_PRODUCTS.find(p => p.id === numericId);
    if (found) return found;
  }
  try {
    const { data } = await axiosInstance.get(`${API_ENDPOINTS.PRODUCT}/${numericId}`);
    // Backend returns: { statusCode, message, data: Product, ... }
    const productData = data?.data ?? data;
    if (productData && typeof productData === 'object') {
      return mapProduct(productData);
    }
    return mapProduct(data);
  } catch (error) {
    console.warn(`Error fetching product ${numericId}:`, error);
    return MOCK_PRODUCTS.find(p => p.id === numericId) ?? MOCK_PRODUCTS[0];
  }
};

interface UseProductsQueryOptions {
  queryParams?: ProductQueryParams;
  enabled?: boolean;
}

export const useProductsQuery = ({ queryParams = {}, enabled = true }: UseProductsQueryOptions = {}) =>
  useQuery<PaginatedResponse<Product>>({
    queryKey: ['products', queryParams],
    queryFn:  () => fetchProducts(queryParams),
    enabled,
  });

export const useProductByIdQuery = (id: string, enabled = true) =>
  useQuery<Product>({
    queryKey: ['products', id],
    queryFn:  () => fetchProductById(id),
    enabled:  enabled && !!id,
  });
