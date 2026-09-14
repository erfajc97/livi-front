import { productUrl } from '@/app/helpers/productUrl';
import type { Product } from '@/app/types/global.types';

export const SITE_ORIGIN = 'https://livi.ec';

/** Copy de la tarjeta al compartir (WhatsApp, Linktree, Facebook). */
export const SHARE_DESCRIPTION =
  'Pañaleras y mochilas de cuero premium, hechas a mano en Ecuador.';
export const SHARE_TITLE = `LIVI — ${SHARE_DESCRIPTION.replace(/\.$/, '')}`;

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalized, SITE_ORIGIN).href;
}

export function absoluteImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  return absoluteUrl(url);
}

export function clipMeta(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

/** TypeORM `decimal` llega como string en JSON. Number() antes de toFixed. */
export function formatUsd(amount: number | string): string {
  const n = Number(amount);
  return Number.isFinite(n) ? n.toFixed(2).replace('.', ',') : '0,00';
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LIVI',
    url: SITE_ORIGIN,
    logo: absoluteUrl('/favicon.png'),
    sameAs: [
      'https://www.instagram.com/livi.ec',
      'https://www.tiktok.com/@livi.ec',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+593992305463',
      contactType: 'customer service',
      areaServed: 'EC',
      availableLanguage: ['Spanish'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'EC',
    },
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LIVI',
    url: SITE_ORIGIN,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_ORIGIN}/catalogo?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/** Imágenes del home para que Google pueda armar miniaturas en la SERP. */
export function homepageBannersJsonLd(
  banners: Array<{ title?: string; subtitle?: string; imageUrl?: string; image?: string }>,
) {
  const images = banners
    .map((banner) => ({
      url: absoluteImageUrl(banner.imageUrl || banner.image),
      name: (banner.title || 'LIVI').trim(),
      description: (banner.subtitle || banner.title || 'Pañaleras de cuero premium en Ecuador').trim(),
    }))
    .filter((item): item is { url: string; name: string; description: string } => Boolean(item.url));

  if (!images.length) return undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Banners LIVI',
    numberOfItems: images.length,
    itemListElement: images.map((image, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'ImageObject',
        contentUrl: image.url,
        url: image.url,
        name: image.name,
        description: image.description,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function productDisplayName(product: Product): string {
  const marca = product.marca?.name?.trim();
  const name = product.name.trim();
  if (marca && name.toLowerCase().startsWith(marca.toLowerCase())) return name;
  return [marca, name].filter(Boolean).join(' ');
}

export function minOfferPrice(product: Product): number | undefined {
  const prices = [
    product.minFormatPrice,
    product.price,
    ...(product.formats ?? []).map((format) => format.price),
    ...(product.variants ?? []).map((variant) => variant.price),
  ].filter((value): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0);
  return prices.length > 0 ? Math.min(...prices) : undefined;
}

export function maxOfferPrice(product: Product): number | undefined {
  const prices = [
    product.maxFormatPrice,
    product.price,
    ...(product.formats ?? []).map((format) => format.price),
    ...(product.variants ?? []).map((variant) => variant.price),
  ].filter((value): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0);
  return prices.length > 0 ? Math.max(...prices) : undefined;
}

function schemaAvailability(inStock: boolean): string {
  return inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
}

export function productSeoTitle(product: Product): string {
  return `${productDisplayName(product)} | LIVI`;
}

export function productSeoDescription(product: Product): string {
  const name = productDisplayName(product);
  const body = (product.description || product.detailDescription || '')
    .replace(/\s+/g, ' ')
    .trim();
  const min = minOfferPrice(product);
  const priceBit = min != null ? `desde $${formatUsd(min)}` : '';
  if (body) return clipMeta(`${name}. ${body}`);
  return clipMeta(
    `${name} en Ecuador. Cuero premium, hecho a mano${priceBit ? `, ${priceBit}` : ''}.`,
  );
}

export function productJsonLd(product: Product) {
  const images = [
    product.image,
    product.imageUrl,
    ...(product.images ?? []).map((img: any) => (typeof img === 'string' ? img : img?.url)),
  ]
    .map((url) => absoluteImageUrl(url))
    .filter((url, index, list): url is string => !!url && list.indexOf(url) === index);

  const inStock = (product.stock ?? 0) > 0;
  const formats = (product.formats?.length ? product.formats : undefined) ??
    product.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      price: variant.price,
    }));

  const offers = formats.map((format) => ({
    '@type': 'Offer',
    name: format.name ? `Color ${format.name}` : productDisplayName(product),
    price: Number(format.price).toFixed(2),
    priceCurrency: 'USD',
    availability: schemaAvailability(inStock),
    url: absoluteUrl(productUrl(product)),
  }));

  const low = minOfferPrice(product);
  const high = maxOfferPrice(product);
  const aggregateOffers = offers.length
    ? {
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        lowPrice: low != null ? low.toFixed(2) : undefined,
        highPrice: high != null ? high.toFixed(2) : undefined,
        offerCount: offers.length,
        availability: schemaAvailability(inStock),
        offers,
      }
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productDisplayName(product),
    description: clipMeta(product.description || product.detailDescription || productDisplayName(product), 300),
    image: images,
    brand: product.marca?.name
      ? { '@type': 'Brand', name: product.marca.name }
      : { '@type': 'Brand', name: 'LIVI' },
    sku: String(product.id),
    url: absoluteUrl(productUrl(product)),
    offers: aggregateOffers,
  };
}

export function articleJsonLd(post: {
  title: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: clipMeta(post.excerpt || post.title),
    image: absoluteImageUrl(post.imageUrl),
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    author: { '@type': 'Organization', name: 'LIVI' },
    publisher: {
      '@type': 'Organization',
      name: 'LIVI',
      logo: { '@type': 'ImageObject', url: absoluteUrl('/favicon.png') },
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };
}

export function faqPageJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
