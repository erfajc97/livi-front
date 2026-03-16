import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/app/config/axiosConfig';
import { API_ENDPOINTS } from '@/app/api/endpoints';
import { MOCK_ENABLED } from '@/app/lib/mock';
import { MOCK_PRODUCTS } from '@/app/features/landing/data';
import type { Product, ProductQueryParams, PaginatedResponse } from '@/app/types/global.types';

const applyMockFilters = (params: ProductQueryParams): PaginatedResponse<Product> => {
  let filtered = [...MOCK_PRODUCTS];
  if (params.type)   filtered = filtered.filter(p => p.type === params.type);
  if (params.search) filtered = filtered.filter(p =>
    p.name.toLowerCase().includes(params.search!.toLowerCase()) ||
    p.brand.toLowerCase().includes(params.search!.toLowerCase())
  );
  if (params.inStock) filtered = filtered.filter(p => p.variants.some(v => v.stock > 0));
  if (params.sortBy === 'createdAt') {
    filtered.sort((a, b) =>
      params.order === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
      return { content: responseData, pagination: { page: 1, limit: responseData.length, total: responseData.length, totalPages: 1 } };
    }

    // If it's already in the correct format with content property
    if (responseData?.content) {
      return responseData;
    }

    // Map backend response format to expected format
    if (responseData?.data && Array.isArray(responseData.data)) {
      return {
        content: responseData.data,
        pagination: {
          page: responseData.page ?? 1,
          limit: responseData.limit ?? 20,
          total: responseData.total ?? 0,
          totalPages: responseData.totalPages ?? 1,
        },
      };
    }

    return responseData || applyMockFilters(params);
  } catch (error) {
    console.warn('Error fetching products, using mock:', error);
    return applyMockFilters(params);
  }
};

export const fetchProductById = async (id: string): Promise<Product> => {
  if (MOCK_ENABLED) {
    const found = MOCK_PRODUCTS.find(p => p.id === id);
    if (found) return found;
  }
  try {
    const { data } = await axiosInstance.get(`${API_ENDPOINTS.PRODUCT}/${id}`);
    // Backend returns: { statusCode, message, data: Product, ... }
    const productData = data?.data ?? data;
    if (productData && typeof productData === 'object') {
      return productData;
    }
    return data;
  } catch (error) {
    console.warn(`Error fetching product ${id}:`, error);
    return MOCK_PRODUCTS.find(p => p.id === id) ?? MOCK_PRODUCTS[0];
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
