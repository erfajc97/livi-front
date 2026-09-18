import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/app/config/axiosConfig'
import { API_ENDPOINTS } from '@/app/api/endpoints'

export interface NavMarca {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string | null
  /** Portada vertical para teléfono. Si es null se usa `imageUrl`. */
  mobileImageUrl: string | null
  isActive: boolean
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
    marcas: (c.marcas ?? []).map((s: any) => ({
      id: String(s.id),
      name: s.name,
      slug: s.slug ?? s.name.toLowerCase(),
      description: s.description ?? '',
      imageUrl: s.imageUrl ?? null,
      mobileImageUrl: s.mobileImageUrl ?? null,
      isActive: s.isActive !== false,
    })),
  }))
}

/** Fuente única: TODAS las categorías con TODAS sus marcas (con sus flags
 *  `isActive`). El filtrado por sección se hace en cliente con `select`. */
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

/** Tienda: categorías activas → solo marcas activas. */
const selectActive = (cats: NavCategory[]): NavCategory[] =>
  cats
    .map((c) => ({ ...c, marcas: c.marcas.filter((m) => m.isActive) }))
    .filter((c) => c.isActive && c.marcas.length > 0)

/** Catálogo (filtros/banner/home): todas las categorías, solo marcas activas. */
const selectActiveMarcas = (cats: NavCategory[]): NavCategory[] =>
  cats.map((c) => ({ ...c, marcas: c.marcas.filter((m) => m.isActive) }))

/** Categorías activas con marcas activas. */
export const useCategoriesQuery = () => useAllCategories(selectActive)

/** Todas las categorías con marcas activas — usado por CatalogBanner/filtros. */
export const useCategoriesWithMarcasQuery = () => useAllCategories(selectActiveMarcas)

/** Tienda dropdown — categorías activas con sus marcas activas. */
export const useNormalCategoriesQuery = () => useAllCategories(selectActive)

/** Mega menú: categorías activas aunque todavía no tengan marcas cargadas
 *  (con `selectActive` una categoría sin marcas desaparecía del menú). */
const selectActiveWithOptionalMarcas = (cats: NavCategory[]): NavCategory[] =>
  cats
    .filter((c) => c.isActive)
    .map((c) => ({ ...c, marcas: c.marcas.filter((m) => m.isActive) }))

export const useMenuCategoriesQuery = () =>
  useAllCategories(selectActiveWithOptionalMarcas)

/** Sin filtrar — todas las categorías y todas sus marcas (banner: resolver una
 *  marca por id aunque esté inactiva). */
export const useRawCategoriesQuery = () => useAllCategories((cats) => cats)

/**
 * Orden editorial de categorías en los menús: Pañaleras → Mochilas →
 * Accesorios → el resto (conservando su orden original). Compara por nombre
 * normalizado (sin tildes, minúsculas), así no depende de IDs por entorno.
 */
export function sortCategoriesByHierarchy<T extends { name: string }>(cats: T[]): T[] {
  const rank = (name: string): number => {
    const n = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    if (/panal|diaper/.test(n)) return 0
    if (/mochila|backpack/.test(n)) return 1
    if (/accesorio|accessor/.test(n)) return 2
    return 3
  }
  return cats
    .map((c, i) => ({ c, i }))
    .sort((a, b) => rank(a.c.name) - rank(b.c.name) || a.i - b.i)
    .map(({ c }) => c)
}
