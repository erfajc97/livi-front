import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/app/config/axiosConfig'
import { API_ENDPOINTS } from '@/app/api/endpoints'

export interface NavMarca {
  id: string
  name: string
  slug: string
  imageUrl: string | null
}

export interface NavCategory {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string | null
  bajoPedido: boolean
  marcas: NavMarca[]
}

function mapCategories(raw: any[], bajoPedido?: boolean): NavCategory[] {
  return raw.map((c: any) => ({
    id: String(c.id),
    name: c.name,
    slug: c.slug ?? c.name.toLowerCase(),
    description: c.description ?? '',
    imageUrl: c.imageUrl ?? null,
    bajoPedido: c.bajoPedido ?? false,
    marcas: (c.marcas ?? [])
      .filter((s: any) => s.isActive !== false)
      .filter((s: any) => bajoPedido === undefined || (s.bajoPedido ?? false) === bajoPedido)
      .map((s: any) => ({
        id: String(s.id),
        name: s.name,
        slug: s.slug ?? s.name.toLowerCase(),
        imageUrl: s.imageUrl ?? null,
      })),
  }))
}

export const useCategoriesQuery = (bajoPedido?: boolean) =>
  useQuery<NavCategory[]>({
    queryKey: ['categories', bajoPedido ?? 'all'],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (bajoPedido !== undefined) params.bajoPedido = String(bajoPedido)
      const { data } = await axiosInstance.get(API_ENDPOINTS.CATEGORIES, { params })
      const raw = data?.data?.data ?? data?.data ?? data ?? []
      if (!Array.isArray(raw)) return []
      return mapCategories(raw, bajoPedido)
    },
    staleTime: 5 * 60_000,
    retry: 1,
  })

/** All categories (no filter) — used by CatalogBanner */
export const useCategoriesWithMarcasQuery = () => useCategoriesQuery()

/** Only normal categories (bajoPedido=false) — Perfumes dropdown */
export const useNormalCategoriesQuery = () => useCategoriesQuery(false)

/** Only bajo pedido categories (bajoPedido=true) — Bajo Pedido dropdown */
export const useBajoPedidoCategoriesQuery = () => useCategoriesQuery(true)
