export const prerender = false;

import type { APIRoute } from 'astro';
import { fetchProductById } from '@/app/tanstack-queries/productsQuery';
import { fallbackOgRedirect, jpegResponse, renderShareJpeg } from '@/app/helpers/ogCard';

function firstProductImage(product: {
  image?: string;
  imageUrl?: string;
  images?: string[];
  formats?: { imageUrl?: string }[];
  variants?: { images?: string[] }[];
}): string | undefined {
  return (
    product.image ||
    product.imageUrl ||
    product.images?.find(Boolean) ||
    product.formats?.find((format) => format.imageUrl)?.imageUrl ||
    product.variants?.flatMap((variant) => variant.images ?? []).find(Boolean)
  );
}

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return fallbackOgRedirect();

  const product = await fetchProductById(id);
  try {
    const jpeg = await renderShareJpeg(firstProductImage(product));
    if (!jpeg) return fallbackOgRedirect();
    return jpegResponse(jpeg);
  } catch {
    return fallbackOgRedirect();
  }
};

export const HEAD: APIRoute = GET;
