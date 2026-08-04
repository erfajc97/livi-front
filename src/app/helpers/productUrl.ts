/**
 * Slugs de producto para URLs legibles/SEO: /producto/123-sauvage-elixir.
 * El id numérico va primero para que el backend siga resolviendo por id sin
 * necesitar una columna slug en la base de datos.
 */
export const slugify = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // tildes y diacríticos (U+0300–U+036F)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** URL pública del detalle: /producto/{id}-{slug-del-nombre} */
export const productUrl = (product: { id: string | number; name?: string }): string => {
  const slug = slugify(product.name ?? '');
  return `/producto/${product.id}${slug ? `-${slug}` : ''}`;
};

/** Extrae el id numérico de un parámetro de ruta con slug ("123-sauvage" → "123"). */
export const parseProductId = (param: string): string =>
  String(param).match(/^\d+/)?.[0] ?? String(param);
