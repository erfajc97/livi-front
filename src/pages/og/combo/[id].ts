export const prerender = false;

import type { APIRoute } from 'astro';
import { fetchComboById } from '@/app/tanstack-queries/combosQuery';
import { fallbackOgRedirect, jpegResponse, renderShareJpeg } from '@/app/helpers/ogCard';

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return fallbackOgRedirect();

  const combo = await fetchComboById(id);
  try {
    const jpeg = await renderShareJpeg(combo?.imageUrl);
    if (!jpeg) return fallbackOgRedirect();
    return jpegResponse(jpeg);
  } catch {
    return fallbackOgRedirect();
  }
};

export const HEAD: APIRoute = GET;
