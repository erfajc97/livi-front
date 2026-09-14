/**
 * InstagramSection — "Join our community" estilo minabaie.
 *
 * No usamos la API de Instagram (requiere app de Meta y tokens que caducan):
 * las fotos son curadas y viven en /productos; cada card enlaza al perfil.
 * El handle se puede cambiar desde aquí cuando LIVI confirme su cuenta.
 */
const INSTAGRAM_URL = 'https://www.instagram.com/livi.ec';
const INSTAGRAM_HANDLE = '@livi.ec';

interface IgPost {
  url: string;
  image: string;
}

/* Selección general de marca (fotos curadas en /productos). Un producto puede
   traer sus propios posts desde el admin ("Instagram de la ficha"). */
const DEFAULT_POSTS: IgPost[] = [
  { url: INSTAGRAM_URL, image: '/productos/marca-familia.jpg' },
  { url: INSTAGRAM_URL, image: '/productos/noe-lifestyle-1.jpg' },
  { url: INSTAGRAM_URL, image: '/productos/marca-taller.jpg' },
  { url: INSTAGRAM_URL, image: '/productos/marca-empaque.jpg' },
];

interface InstagramSectionProps {
  /** Posts propios del producto ({ url, image }); vacío = selección de marca. */
  posts?: IgPost[];
}

export default function InstagramSection({ posts }: InstagramSectionProps) {
  const items = (posts?.length ? posts : DEFAULT_POSTS).filter((p) => p.image);

  return (
    <section className="px-6 py-8 md:px-14 md:py-12">
      <div className="mx-auto max-w-[1400px]">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group mb-6 block text-center md:mb-10"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-muted">
            Síguenos en Instagram
          </p>
          <h2 className="mt-2 font-display text-3xl font-light italic leading-none tracking-[-0.02em] text-text transition-colors group-hover:text-accent md:text-4xl">
            {INSTAGRAM_HANDLE}
          </h2>
        </a>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {items.map((post) => (
            <a
              key={`${post.url}-${post.image}`}
              href={post.url || INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Post de Instagram de LIVI"
              className="group/ig relative block aspect-square overflow-hidden bg-bg-alt"
            >
              <img
                src={post.image}
                alt="Post de Instagram de LIVI"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover/ig:scale-[1.04]"
              />
              {/* Icono Instagram al hover */}
              <span className="absolute inset-0 flex items-center justify-center bg-text/0 transition-colors duration-300 group-hover/ig:bg-text/30">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-bg opacity-0 transition-opacity duration-300 group-hover/ig:opacity-100"
                >
                  <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
                  <circle cx="12" cy="12" r="4.5" />
                  <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
