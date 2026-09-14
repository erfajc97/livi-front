import sharp from 'sharp';
import { absoluteImageUrl, SITE_ORIGIN } from '@/app/helpers/seoMeta';

/** Butter del tema LIVI — el lienzo de la tarjeta al compartir en WhatsApp. */
const CARD_BG = { r: 245, g: 239, b: 198 };
const CARD_W = 1200;
const CARD_H = 630;
const MAX_BYTES = 8 * 1024 * 1024;

function isAllowedImageHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === 'livi.ec' ||
    host === 'www.livi.ec' ||
    host.endsWith('.livi.ec') ||
    host.endsWith('.amazonaws.com')
  );
}

export function productShareImagePath(id: string | number): string {
  return `${SITE_ORIGIN}/og/producto/${id}`;
}

export async function renderShareJpeg(rawUrl?: string | null): Promise<Buffer | null> {
  const src = absoluteImageUrl(rawUrl);
  if (!src) return null;

  let parsed: URL;
  try {
    parsed = new URL(src);
  } catch {
    return null;
  }
  if (!['http:', 'https:'].includes(parsed.protocol) || !isAllowedImageHost(parsed.hostname)) {
    return null;
  }

  const res = await fetch(src, { signal: AbortSignal.timeout(8_000) });
  if (!res.ok) return null;
  const len = Number(res.headers.get('content-length') ?? 0);
  if (len > MAX_BYTES) return null;

  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.byteLength === 0 || buf.byteLength > MAX_BYTES) return null;

  return sharp(buf)
    .rotate()
    .resize(CARD_W, CARD_H, { fit: 'contain', background: CARD_BG })
    .flatten({ background: CARD_BG })
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();
}

export function jpegResponse(body: Buffer): Response {
  return new Response(new Uint8Array(body), {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}

export function fallbackOgRedirect(): Response {
  return new Response(null, {
    status: 302,
    headers: { Location: `${SITE_ORIGIN}/og-image.jpg` },
  });
}
