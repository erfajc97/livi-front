export const prerender = false;

import type { APIRoute } from 'astro';
import axiosInstance from '@/app/config/axiosConfig';
import { API_ENDPOINTS } from '@/app/api/endpoints';
import { blogService } from '@/app/features/blog/services/blogService';
import { productUrl } from '@/app/helpers/productUrl';
import { SITE_ORIGIN } from '@/app/helpers/seoMeta';
import { mapProduct } from '@/app/tanstack-queries/productsQuery';

function loc(path: string, lastmod?: string, changefreq = 'weekly', priority = '0.7') {
  const last = lastmod
    ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>`
    : '';
  return `  <url>
    <loc>${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}</loc>
    ${last}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function productUrls(): Promise<string[]> {
  const urls: string[] = [];
  try {
    for (let page = 1; page <= 20; page++) {
      const { data } = await axiosInstance.get(API_ENDPOINTS.PRODUCTS, {
        params: { page, limit: 100 },
        timeout: 8_000,
      });
      const payload = data?.data ?? data;
      const rows = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.content)
            ? payload.content
            : [];
      if (!rows.length) break;
      for (const raw of rows) {
        const product = mapProduct(raw);
        if (!product.id) continue;
        const lastmod = product.createdAt || undefined;
        urls.push(loc(productUrl(product), lastmod, 'weekly', '0.8'));
      }
      const totalPages = Number(payload?.totalPages ?? page);
      if (page >= totalPages) break;
    }
  } catch {
    return urls;
  }
  return urls;
}

async function comboUrls(): Promise<string[]> {
  try {
    const { data } = await axiosInstance.get(API_ENDPOINTS.COMBOS_ACTIVE, { timeout: 8_000 });
    const payload = data?.data ?? data;
    const rows = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
    return rows
      .filter((combo: { id?: number }) => combo?.id != null)
      .map((combo: { id: number }) => loc(`/combo/${combo.id}`, undefined, 'weekly', '0.6'));
  } catch {
    return [];
  }
}

async function blogUrls(): Promise<string[]> {
  try {
    const posts = await blogService.fetchPublishedPosts();
    return posts.map((post) =>
      loc(`/blog/${post.slug}`, post.updatedAt || post.publishedAt || post.createdAt, 'monthly', '0.5'),
    );
  } catch {
    return [];
  }
}

export const GET: APIRoute = async () => {
  const [products, combos, posts] = await Promise.all([
    productUrls(),
    comboUrls(),
    blogUrls(),
  ]);

  const staticPages = [
    loc('/', undefined, 'daily', '1.0'),
    loc('/catalogo', undefined, 'daily', '0.9'),
    loc('/catalogo/perfumes', undefined, 'daily', '0.9'),
    loc('/catalogo/combos', undefined, 'weekly', '0.8'),
    loc('/bajo-pedido', undefined, 'daily', '0.8'),
    loc('/blog', undefined, 'weekly', '0.6'),
    loc('/contacto', undefined, 'monthly', '0.4'),
    loc('/terminos', undefined, 'yearly', '0.2'),
    loc('/privacidad', undefined, 'yearly', '0.2'),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages, ...products, ...combos, ...posts].join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800',
    },
  });
};
