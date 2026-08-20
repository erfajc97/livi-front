import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/app/config/axiosConfig'
import { API_ENDPOINTS } from '@/app/api/endpoints'

export interface NavMarca {
  id: string
  name: string
  slug: string
  imageUrl: string | null
  /** Portada vertical para teléfono. Si es null se usa `imageUrl`. */
  mobileImageUrl: string | null
  isActive: boolean
  bajoPedido: boolean
}

export interface NavCategory {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string | null
  /** Portada vertical para teléfono. Si es null se usa `imageUrl`. */
  mobileImageUrl: string | null
  isActive: boolean
  bajoPedido: boolean
  marcas: NavMarca[]
}

function mapCategories(raw: any[]): NavCategory[] {
  if (!Array.isArray(raw)) return []
  return raw.map((c: any) => ({
    id: String(c.id),
    name: c.name,
    slug: c.slug ?? c.name.toLowerCase(),
    description: c.description ?? '',
    imageUrl: c.imageUrl ?? null,
    mobileImageUrl: c.mobileImageUrl ?? null,
    isActive: c.isActive !== false,
    bajoPedido: c.bajoPedido ?? false,
    marcas: (c.marcas ?? []).map((s: any) => ({
      id: String(s.id),
      name: s.name,
      slug: s.slug ?? s.name.toLowerCase(),
      imageUrl: s.imageUrl ?? null,
      mobileImageUrl: s.mobileImageUrl ?? null,
      isActive: s.isActive !== false,
      bajoPedido: s.bajoPedido ?? false,
    })),
  }))
}

/**
 * Fuente única: TODAS las categorías con TODAS sus marcas (incluyendo sus flags
 * `isActive` y `bajoPedido`). El backend filtra por categoría cuando se le pasa
 * `?bajoPedido`, así que NO se le pasa: el filtrado por sección se hace en
 * cliente con `select`, para respetar la regla por marca:
 *   · Perfumes    → marca.isActive  (independiente de bajoPedido)
 *   · Bajo Pedido → marca.bajoPedido (independiente de isActive)
 * Así: activa+bajoPedido → ambos lados · inactiva+bajoPedido → solo bajo pedido
 *      · activa+!bajoPedido → solo perfumes · inactiva+!bajoPedido → ninguno.
 */
function useAllCategories<T>(select: (cats: NavCategory[]) => T) {
  return useQuery<NavCategory[], unknown, T>({
    queryKey: ['categories', 'all'],
    queryFn: async () => {
      const { data } = await axiosInstance.get(API_ENDPOINTS.CATEGORIES)
      const raw = data?.data?.data ?? data?.data ?? data ?? []
      return mapCategories(raw)
    },
    select,
    staleTime: 5 * 60_000,
    retry: 1,
  })
}

/** Perfumes: categorías activas → solo marcas activas (cualquier bajoPedido). */
const selectPerfumes = (cats: NavCategory[]): NavCategory[] =>
  cats
    .map((c) => ({ ...c, marcas: c.marcas.filter((m) => m.isActive) }))
    .filter((c) => c.isActive && c.marcas.length > 0)

/** Bajo Pedido: solo marcas con bajoPedido=true (cualquier isActive). */
const selectBajoPedido = (cats: NavCategory[]): NavCategory[] =>
  cats
    .map((c) => ({ ...c, marcas: c.marcas.filter((m) => m.bajoPedido) }))
    .filter((c) => c.marcas.length > 0)

/** Catálogo (filtros/banner/home): todas las categorías, solo marcas activas. */
const selectActiveMarcas = (cats: NavCategory[]): NavCategory[] =>
  cats.map((c) => ({ ...c, marcas: c.marcas.filter((m) => m.isActive) }))

/** Compat: `true` → bajo pedido · `false` → perfumes · undefined → activas. */
export const useCategoriesQuery = (bajoPedido?: boolean) =>
  useAllCategories(
    bajoPedido === true
      ? selectBajoPedido
      : bajoPedido === false
        ? selectPerfumes
        : selectActiveMarcas,
  )

/** Todas las categorías con marcas activas — usado por CatalogBanner/filtros. */
export const useCategoriesWithMarcasQuery = () => useAllCategories(selectActiveMarcas)

/** Perfumes dropdown — categorías activas con sus marcas activas. */
export const useNormalCategoriesQuery = () => useAllCategories(selectPerfumes)

/** Bajo Pedido dropdown — marcas con bajoPedido=true. */
export const useBajoPedidoCategoriesQuery = () => useAllCategories(selectBajoPedido)

/** Sin filtrar — todas las categorías y todas sus marcas (banner: resolver una
 *  marca por id aunque esté inactiva, p. ej. una marca solo de bajo pedido). */
export const useRawCategoriesQuery = () => useAllCategories((cats) => cats)

/**
 * Jerarquía editorial de categorías en los menús: ÁRABES → DISEÑADOR →
 * NICHOS → el resto (conservando su orden original). Compara por nombre
 * normalizado (sin tildes, minúsculas), así no depende de IDs por entorno.
 */
export function sortCategoriesByHierarchy<T extends { name: string }>(cats: T[]): T[] {
  const rank = (name: string): number => {
    const n = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    if (/arab/.test(n)) return 0
    if (/disenador|designer/.test(n)) return 1
    if (/nicho|niche/.test(n)) return 2
    return 3
  }
  return cats
    .map((c, i) => ({ c, i }))
    .sort((a, b) => rank(a.c.name) - rank(b.c.name) || a.i - b.i)
    .map(({ c }) => c)
}
