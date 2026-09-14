export const prerender = false;

import type { APIRoute } from 'astro';
import axiosInstance from '@/app/config/axiosConfig';
import { API_ENDPOINTS } from '@/app/api/endpoints';
import { blogService } from '@/app/features/blog/services/blogService';
import { productUrl } from '@/app/helpers/productUrl';
import { absoluteImageUrl, SITE_ORIGIN } from '@/app/helpers/seoMeta';
import { mapProduct } from '@/app/tanstack-queries/productsQuery';

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function loc(
  path: string,
  lastmod?: string,
  changefreq = 'weekly',
  priority = '0.7',
  images: Array<{ url: string; title?: string }> = [],
) {
  const last = lastmod
    ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>`
    : '';
  const imageTags = images
    .filter((image) => image.url)
    .map((image) => {
      const title = image.title
        ? `\n      <image:title>${escapeXml(image.title)}</image:title>`
        : '';
      return `    <image:image>
      <image:loc>${escapeXml(image.url)}</image:loc>${title}
    </image:image>`;
    })
    .join('\n');
  return `  <url>
    <loc>${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}</loc>
    ${last}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${imageTags}
  </url>`;
}

async function homeUrl(): Promise<string> {
  try {
    const { data } = await axiosInstance.get(`${API_ENDPOINTS.BANNERS}/visible`, {
      timeout: 8_000,
    });
    const rows = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
    const images = rows
      .map((banner: { title?: string; imageUrl?: string; image?: string }) => ({
        url: absoluteImageUrl(banner.imageUrl || banner.image) ?? '',
        title: banner.title,
      }))
      .filter((image: { url: string }) => image.url);
    return loc('/', undefined, 'daily', '1.0', images);
  } catch {
    return loc('/', undefined, 'daily', '1.0');
  }
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
        const image = absoluteImageUrl(product.image || product.imageUrl);
        urls.push(
          loc(
            productUrl(product),
            lastmod,
            'weekly',
            '0.8',
            image ? [{ url: image, title: product.name }] : [],
          ),
        );
      }
      const totalPages = Number(payload?.totalPages ?? page);
      if (page >= totalPages) break;
    }
  } catch {
    return urls;
  }
  return urls;
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
  const [home, products, posts] = await Promise.all([
    homeUrl(),
    productUrls(),
    blogUrls(),
  ]);

  const staticPages = [
    home,
    loc('/catalogo', undefined, 'daily', '0.9'),
    loc('/nuestra-historia', undefined, 'monthly', '0.6'),
    loc('/el-taller', undefined, 'monthly', '0.6'),
    loc('/faq', undefined, 'monthly', '0.5'),
    loc('/cookies', undefined, 'yearly', '0.2'),
    loc('/blog', undefined, 'weekly', '0.6'),
    loc('/contacto', undefined, 'monthly', '0.4'),
    loc('/terminos', undefined, 'yearly', '0.2'),
    loc('/privacidad', undefined, 'yearly', '0.2'),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${[...staticPages, ...products, ...posts].join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800',
    },
  });
};
