import { useState } from 'react';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import { useCartStore, type CartItem } from '@/app/store/cart/cartStore';
import { sonnerResponse } from '@/app/helpers/sonnerResponse';
import type { Product } from '@/app/types/global.types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [hovered, setHovered] = useState(false);

  const productImages = (product.images ?? [])
    .map((img: any) => (typeof img === 'string' ? img : img.url))
    .filter(Boolean);
  const productImage = productImages[0] || product.image || product.imageUrl;
  const hoverImage = productImages[1];

  const variants = product.variants ?? [];
  // Formatos: preferir la lista compacta del backend; si no, derivar de las
  // variantes cargadas (mock / detalle).
  const formats = (product.formats && product.formats.length
    ? product.formats
    : variants.map((v) => ({
        id: v.id,
        ml: v.ml,
        price: v.price,
        isFullBottle: v.isFullBottle,
      }))
  ).filter((f) => f.ml > 0 || f.price > 0);

  const prices = formats.map((f) => f.price).filter((n) => n > 0);
  const minPrice =
    product.minFormatPrice ?? (prices.length ? Math.min(...prices) : (product.price ?? 0));
  const maxPrice =
    product.maxFormatPrice ?? (prices.length ? Math.max(...prices) : (product.price ?? 0));
  const hasRange = maxPrice > minPrice;

  // Number(): el backend manda los decimales como string y `openMl + stock*ml`
  // concatenaría en vez de sumar.
  const sealedStock = Number(product.stock ?? 0);
  const openMl = Number(product.openBottleMlRemaining ?? 0);
  const totalMl = Number(product.totalMl ?? 0);
  const availableMl = openMl + sealedStock * totalMl;
  const hasStock = sealedStock > 0 || availableMl > 0;

  const discount = product.discount ?? 0;
  const hasDiscount = discount > 0;
  const applyDiscount = (n: number) => (hasDiscount ? n * (1 - discount / 100) : n);
  const discountedMin = applyDiscount(minPrice);
  const discountedMax = applyDiscount(maxPrice);

  // Máximo 2 formatos como chips; el "+" solo aparece si hay más de 2.
  const chipFormats = formats.slice(0, 2);
  const hasMoreFormats = formats.length > 2;

  const productUrl = `/producto/${product.id}`;

  /**
   * Añadido rápido: usa el formato más barato disponible (normalmente el decant
   * más pequeño). Si ese formato no se puede vender, cae al frasco completo.
   * Devuelve null cuando no hay nada que añadir → se manda al detalle.
   */
  const buildQuickAddItem = (): CartItem | null => {
    const image = productImage || '';
    const fullIsBackorder = !!product.bajoPedido || sealedStock <= 0;

    const buildFull = (price: number): CartItem => ({
      productId: product.id,
      variantId: `full-${product.id}`,
      name: product.name,
      image,
      ml: totalMl,
      price: applyDiscount(price),
      quantity: 1,
      bajoPedido: fullIsBackorder,
      // El frasco no tiene tope: el excedente se desglosa como bajo pedido.
      maxQty: undefined,
      stockAvailable: fullIsBackorder ? undefined : sealedStock,
      availableMl,
    });

    const sorted = [...formats].filter((f) => f.price > 0).sort((a, b) => a.price - b.price);

    for (const f of sorted) {
      if (f.isFullBottle) return buildFull(f.price);
      // Decant: topado por los ml disponibles del producto.
      const maxQty = f.ml > 0 ? Math.floor(availableMl / f.ml) : 0;
      if (maxQty < 1) continue;
      return {
        productId: product.id,
        variantId: f.id,
        name: product.name,
        image,
        ml: f.ml,
        price: applyDiscount(f.price),
        quantity: 1,
        bajoPedido: false,
        maxQty,
        availableMl,
      };
    }

    // Sin decants preparables: queda el frasco (siempre comprable si hay precio).
    const price = product.price ?? minPrice;
    return price > 0 ? buildFull(price) : null;
  };

  const handleQuickAdd = () => {
    const item = buildQuickAddItem();
    if (!item) {
      window.location.href = productUrl;
      return;
    }
    addItem(item);
    sonnerResponse(`${product.name} · ${item.ml} ml añadido al carrito.`, 'success');
  };

  return (
    <div
      className="group/card flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Imagen — tile blanco cuadrado; el cambio a la 2ª foto es inmediato.
          `data-card-media` lo usa el carrusel para centrar sus flechas. */}
      <div data-card-media className="relative aspect-square overflow-hidden bg-white">
        <a href={productUrl} className="block h-full w-full">
          {productImage ? (
            <img
              src={hovered && hoverImage ? hoverImage : productImage}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-contain p-3 sm:p-4"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-text-muted">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75">
                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
        </a>

        {hasDiscount && (
          <span className="absolute left-3 top-3 bg-accent px-2.5 py-1 font-body text-[9px] font-medium uppercase tracking-[0.18em] text-bg">
            -{discount}%
          </span>
        )}

        {/* Añadir al carrito — siempre visible en móvil, al hover en desktop.
            Negro con texto beige; al pasar el cursor por encima se invierte. */}
        <button
          type="button"
          onClick={handleQuickAdd}
          className="absolute inset-x-0 bottom-0 z-10 border-t border-text bg-text py-2.5 font-body text-[10px] uppercase tracking-[0.18em] text-bg transition-[background-color,color,opacity,transform] duration-150 hover:bg-bg hover:text-text sm:translate-y-full sm:opacity-0 sm:group-hover/card:translate-y-0 sm:group-hover/card:opacity-100"
        >
          Añadir al carrito
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 pt-2.5">
        <a href={productUrl}>
          <h3 className="font-display text-[15px] font-normal leading-snug tracking-[-0.005em] text-text transition-colors group-hover/card:text-accent">
            {product.name}
          </h3>
        </a>

        {/* Precio (rango) + estado — en móvil el estado baja a su propia línea */}
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
          <span className="font-body text-[11px] tracking-[0.02em] text-text">
            {hasDiscount && (
              <span className="mr-1.5 text-text-muted line-through">{formatCurrency(minPrice)}</span>
            )}
            Desde {formatCurrency(discountedMin)}
            {hasRange && <> – {formatCurrency(discountedMax)}</>}
          </span>
          <span
            className={`shrink-0 font-body text-[9px] uppercase tracking-[0.16em] ${
              product.bajoPedido ? 'text-accent' : hasStock ? 'text-text-muted' : 'text-error'
            }`}
          >
            {product.bajoPedido ? 'Bajo pedido' : hasStock ? 'En stock' : 'Sin stock'}
          </span>
        </div>

        {/* Chips de formato (máx 2); el "+" solo si hay más de 2 → detalle */}
        {chipFormats.length > 0 && (
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
            {chipFormats.map((f) => (
              <a
                key={f.id}
                href={productUrl}
                className="border border-border px-2.5 py-1 font-body text-[10px] uppercase tracking-[0.08em] text-text-soft transition-colors hover:border-text hover:text-text"
              >
                {f.ml} ml
              </a>
            ))}
            {hasMoreFormats && (
              <a
                href={productUrl}
                aria-label="Ver todos los formatos"
                className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-text-soft transition-colors hover:border-text hover:text-text"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
