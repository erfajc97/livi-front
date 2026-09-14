import { useState } from 'react';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import { colorHex } from '@/app/helpers/colorHex';
import { productUrl as productUrlHelper } from '@/app/helpers/productUrl';
import { useCartStore, type CartItem } from '@/app/store/cart/cartStore';
import { sonnerResponse } from '@/app/helpers/sonnerResponse';
import type { Product } from '@/app/types/global.types';

interface ProductCardProps {
  product: Product;
}

interface Format {
  id: string;
  name?: string;
  price: number;
  imageUrl?: string;
  colorHex?: string;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  // Galería del producto: [0] principal, [1] hover. La foto del color elegido
  // (formato) entra cuando el chip seleccionado trae imagen propia.
  const productImages = (product.images ?? [])
    .map((img: any) => (typeof img === 'string' ? img : img.url))
    .filter(Boolean)
    .filter((url, i, arr) => arr.indexOf(url) === i);
  const productImage = productImages[0] || product.image || product.imageUrl;

  const variants = product.variants ?? [];
  // Formatos (colores): preferir la lista compacta del backend; si no, derivar
  // de las variantes cargadas (mock / detalle).
  const formats: Format[] = (product.formats && product.formats.length
    ? product.formats
    : variants.map((v) => ({
        id: String(v.id),
        name: v.name,
        price: Number(v.price),
        imageUrl: v.images?.[0]?.url,
        colorHex: v.colorHex,
      }))
  )
    .filter((f) => f.price > 0)
    .slice();

  // Formato elegido desde la propia card: cambia el precio sin salir de aquí.
  const [selectedId, setSelectedId] = useState<string | null>(formats[0]?.id ?? null);
  const selected = formats.find((f) => f.id === selectedId) ?? formats[0] ?? null;

  const stock = Number(product.stock ?? 0);
  const hasStock = stock > 0;

  const discount = product.discount ?? 0;
  const hasDiscount = discount > 0;
  const applyDiscount = (n: number) => (hasDiscount ? n * (1 - discount / 100) : n);

  // Precio del color seleccionado (antes se mostraba el rango del producto).
  const basePrice = Number(selected?.price ?? product.minFormatPrice ?? product.price ?? 0);
  const finalPrice = applyDiscount(basePrice);

  const formatImage = selected?.imageUrl;
  const displayImage = formatImage || productImage;
  const hoverImage = formatImage ? undefined : productImages[1];

  // Máximo 4 dots de color; el "+n" indica cuántos más hay (ref. minabaie).
  const dotFormats = formats.slice(0, 4);
  const extraFormats = formats.length - dotFormats.length;

  const productUrl = productUrlHelper(product);
  // El "+" abre el detalle ya posicionado en el color elegido aquí.
  const detailUrl = selected ? `${productUrl}?variant=${selected.id}` : productUrl;

  /** Item de carrito del color elegido en la card. */
  const buildCartItem = (): CartItem | null => {
    if (!selected || basePrice <= 0) return null;
    return {
      productId: product.id,
      variantId: String(selected.id),
      name: product.name,
      variationName: selected.name,
      image: displayImage || '',
      price: finalPrice,
      quantity: 1,
      maxQty: hasStock ? stock : undefined,
      stockAvailable: stock,
    };
  };

  const handleQuickAdd = () => {
    if (!hasStock) {
      window.location.href = productUrl;
      return;
    }
    const item = buildCartItem();
    if (!item) {
      window.location.href = productUrl;
      return;
    }
    addItem(item);
    sonnerResponse(
      `${product.name}${item.variationName ? ` · ${item.variationName}` : ''} añadido al carrito.`,
      'success',
    );
  };

  return (
    /* Card estilo minabaie: sin contenedor blanco — la foto respira sobre un
       tile beige y la info va suelta debajo, con dots de color. */
    <div className="group/card flex h-full flex-col">
      {/* Imagen — tile beige 4:5; 1ª de galería + 2ª al hover en desktop. */}
      <div data-card-media className="relative aspect-[4/5] overflow-hidden bg-bg-alt">
        <a href={productUrl} className="relative block h-full w-full">
          {displayImage ? (
            <>
              <img
                data-gallery-role="principal"
                src={displayImage}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 md:group-hover/card:scale-[1.03]"
              />
              {hoverImage && (
                <img
                  data-gallery-role="hover"
                  src={hoverImage}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 md:group-hover/card:opacity-100"
                />
              )}
            </>
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

        {/* Añadir al carrito — siempre visible en móvil, al hover en desktop. */}
        <button
          type="button"
          onClick={handleQuickAdd}
          className="absolute inset-x-0 bottom-0 z-10 bg-accent py-2.5 font-body text-[10px] uppercase tracking-[0.18em] text-bg transition-[background-color,opacity,transform] duration-150 hover:bg-accent-hover sm:translate-y-full sm:opacity-0 sm:group-hover/card:translate-y-0 sm:group-hover/card:opacity-100"
        >
          Añadir al carrito
        </button>
      </div>

      {/* Info suelta — sin caja */}
      <div className="flex flex-1 flex-col gap-1 pb-1 pt-3">
        <a href={productUrl}>
          {/* Altura mínima de 2 líneas: los nombres largos ya no desalinean
              los dots de color entre cards vecinas */}
          <h3 className="line-clamp-2 min-h-[2.6em] font-body text-[13px] font-normal leading-snug tracking-[0.01em] text-text transition-colors group-hover/card:text-accent">
            {product.name}
          </h3>
        </a>

        {/* Precio del color elegido + estado */}
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-body text-[12px] tracking-[0.02em] text-text">
            {hasDiscount && (
              <span className="mr-1.5 text-text-muted line-through">{formatCurrency(basePrice)}</span>
            )}
            {formatCurrency(finalPrice)}
          </span>
          <span
            className={`shrink-0 font-body text-[9px] uppercase tracking-[0.16em] ${
              hasStock ? 'text-text-muted' : 'text-error'
            }`}
          >
            {hasStock ? 'En stock' : 'Sin stock'}
          </span>
        </div>

        {/* Dots de color (máx 4 + "+n"): seleccionan y actualizan el precio
            aquí mismo. `mt-auto` los fija al pie para alinear entre cards. */}
        {dotFormats.length > 0 && (
          <div className="mt-auto flex flex-nowrap items-center gap-2 pt-1.5">
            {dotFormats.map((f) => {
              const isSelected = selected?.id === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedId(f.id)}
                  aria-label={`Color ${f.name ?? 'único'}`}
                  aria-pressed={isSelected}
                  title={f.name ?? 'Color'}
                  className={`h-3.5 w-3.5 rounded-full transition-transform hover:scale-110 ${
                    isSelected ? 'ring-1 ring-text ring-offset-2 ring-offset-bg' : ''
                  }`}
                  style={{ backgroundColor: f.colorHex ?? colorHex(f.name) }}
                />
              );
            })}
            {extraFormats > 0 && (
              <a
                href={detailUrl}
                aria-label="Ver todos los colores"
                className="font-body text-[10px] tracking-[0.06em] text-text-muted transition-colors hover:text-text"
              >
                +{extraFormats}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
