import StarRating from './StarRating';

interface TestimonialCardProps {
  badge: string;
  name: string;
  text: string;
  rating: number;
  avatar: string;
  productImage: string;
}

export default function TestimonialCard({
  badge,
  name,
  text,
  rating,
  avatar,
  productImage,
}: TestimonialCardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      {/* ── Columna izquierda: review ── */}
      <div className="flex flex-col gap-6">
        {/* Reviewer info + quote */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={avatar}
              alt={name}
              className="w-16 h-16 rounded-full object-cover shrink-0"
            />
            <div className="flex flex-col">
              <span className="font-body text-xs text-text-muted uppercase tracking-widest">
                {badge}
              </span>
              <span className="font-heading text-xl font-black text-bg uppercase leading-tight">
                {name}
              </span>
            </div>
          </div>
          {/* Quote decorativo */}
          <svg width="48" height="40" viewBox="0 0 48 40" fill="none" aria-hidden className="shrink-0 opacity-20">
            <path d="M0 40V24C0 10.745 8.053 2.96 24.16 0l2.88 4.32C18.987 6.027 14.827 10.24 13.92 16.96H20V40H0zm28 0V24C28 10.745 36.053 2.96 52.16 0l2.88 4.32C46.987 6.027 42.827 10.24 41.92 16.96H48V40H28z" fill="#1B1919"/>
          </svg>
        </div>

        {/* Texto */}
        <p className="font-body text-sm leading-relaxed text-gray-600">
          {text}
        </p>

        {/* Stars */}
        <StarRating rating={rating} size={20} />
      </div>

      {/* ── Columna derecha: imagen producto ── */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-xs rounded-2xl overflow-hidden bg-bg">
          <img
            src={productImage}
            alt="Producto reseñado"
            className="w-full h-72 object-cover object-center"
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="font-body text-sm text-gray-500">
            Review ({rating.toFixed(1)})
          </span>
          <StarRating rating={rating} size={16} />
        </div>
      </div>
    </div>
  );
}
