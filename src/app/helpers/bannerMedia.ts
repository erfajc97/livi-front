import type { Banner } from '@/app/types/global.types';

/**
 * La portada de la home puede ser una imagen o un video: el admin sube el
 * archivo al mismo campo del banner (`imageUrl`) y el backend marca
 * `mediaType`. Los banners creados antes de esa columna no lo traen, así que
 * el tipo también se deduce de la URL.
 */

const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;

/** `true` si la URL apunta a un video (extensión o ruta de Cloudinary). */
export function isVideoUrl(url?: string | null): boolean {
  if (!url) return false;
  return VIDEO_EXTENSIONS.test(url) || url.includes('/video/upload/');
}

export interface BannerMedia {
  /** URL del archivo principal (imagen o video). */
  src: string;
  isVideo: boolean;
  /** Imagen a mostrar antes/en-vez-del video. Siempre que se pueda, hay una. */
  poster: string | null;
  /** Arte vertical para móvil, si el admin lo subió y es una imagen. */
  mobileImage: string | null;
  alt: string;
}

/**
 * Cloudinary genera un fotograma del video sirviendo la misma URL con
 * extensión de imagen: sirve de `poster` sin pedirle nada al admin.
 */
function cloudinaryVideoPoster(url: string): string | null {
  if (!url.includes('/video/upload/')) return null;
  return url.replace(/\.(mp4|webm|mov|m4v)(\?.*)?$/i, '.jpg');
}

/**
 * Normaliza lo que trae un banner para pintar la portada. Devuelve `null` si
 * el banner no tiene archivo: quien llama debe usar su propio respaldo.
 */
export function resolveBannerMedia(
  banner: Banner | null | undefined,
  fallbackAlt: string,
): BannerMedia | null {
  const src = banner?.imageUrl || banner?.image;
  if (!src) return null;

  const isVideo = banner?.mediaType === 'video' || isVideoUrl(src);
  const mobileRaw = banner?.mobileImageUrl || null;
  // El arte móvil es siempre imagen; si por lo que sea trae un video, no
  // sirve ni de poster ni de fondo.
  const mobileImage = mobileRaw && !isVideoUrl(mobileRaw) ? mobileRaw : null;

  return {
    src,
    isVideo,
    poster: isVideo ? (mobileImage ?? cloudinaryVideoPoster(src)) : null,
    mobileImage,
    alt: banner?.title?.trim() || fallbackAlt,
  };
}
