import { useState, useEffect } from 'react';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import { colorHex } from '@/app/helpers/colorHex';
import TrustIcons from '@/app/components/UI/TrustIcons';
import { productUrl } from '@/app/helpers/productUrl';
import { useCartStore } from '@/app/store/cart/cartStore';
import { sonnerResponse } from '@/app/helpers/sonnerResponse';
import { DEFAULT_DISPATCH_CUTOFF_HOUR, deliveryRangeShort, dispatchDateShort } from '@/app/helpers/deliveryWindow';
import TruckLineIcon from '@/assets/svg/TruckLineIcon';
import { useDeliveryOffsetQuery, useDispatchCutoffQuery } from '@/app/tanstack-queries/settingsQuery';
import PaymentMethodIcons from '@/app/components/PaymentMethodIcons';
import type { Product, ProductVariant } from '@/app/types/global.types';

interface ProductPurchaseOptionsProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
  onVariantChange?: (variant: ProductVariant | null) => void;
  /** Productos "Combina con" (mini carrusel bajo los acordeones, ref. minabaie). */
  pairsWith?: Product[];
}

/**
 * Opciones de compra de la ficha LIVI. Las variantes son COLORES del mismo
 * producto y comparten el stock del producto (unidades). El precio puede
 * variar por color (`variant.price`), con fallback al precio del producto.
 */
/**
 * Opciones de compra de la ficha LIVI. Una variante es la COMBINACIÓN
 * color (name) + talla (size): los swatches eligen color, los botones eligen
 * talla, y juntos resuelven la variante exacta (su precio y sus fotos).
 * Si ninguna variante tiene talla, se usa el catálogo de tallas del producto
 * (product.sizes) como selector suelto; si tampoco hay, no se muestra talla.
 */
export default function ProductPurchaseOptions({
  product,
  selectedVariant: externalVariant,
  onVariantChange,
  pairsWith = [],
}: ProductPurchaseOptionsProps) {
  const variants = product.variants ?? [];

  // Colores únicos por nombre, en orden de aparición (cada entrada representa
  // un color; su variante sirve para swatch, hex y fotos).
  const colors = (() => {
    const seen = new Map<string, ProductVariant>();
    for (const v of variants) {
      const key = v.name ?? '';
      if (!seen.has(key)) seen.set(key, v);
    }
    return [...seen.values()];
  })();

  // Tallas: las que traen las variantes (combo real); si ninguna trae, cae al
  // catálogo del producto (tallas sueltas, sin variante por combinación).
  const variantSizes = [...new Set(variants.map((v) => v.size).filter(Boolean))] as string[];
  const hasComboSizes = variantSizes.length > 0;
  const sizes = hasComboSizes ? variantSizes : (product.sizes ?? []);

  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0]?.name ?? null);
  const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0] ?? null);
  const [hasHydrated, setHasHydrated] = useState(false);

  const addItem = useCartStore((s) => s.addItem);

  // Variante resuelta: color + talla exactos; si el combo no existe, el
  // primero del color (mantiene precio/fotos del color aunque falte la talla).
  const selected =
    variants.find((v) => (v.name ?? null) === selectedColor && (v.size ?? null) === selectedSize) ??
    variants.find((v) => (v.name ?? null) === selectedColor) ??
    variants[0] ??
    null;

  // Avisar a la galería cuando cambia la variante resuelta.
  useEffect(() => {
    onVariantChange?.(selected);
  }, [selected?.id]);

  const handleSelectColor = (name: string) => {
    setSelectedColor(name);
    // Si la talla elegida no existe para este color, saltar a la primera que sí.
    if (hasComboSizes && selectedSize) {
      const exists = variants.some((v) => (v.name ?? null) === name && v.size === selectedSize);
      if (!exists) {
        const firstForColor = variants.find((v) => (v.name ?? null) === name && v.size);
        setSelectedSize(firstForColor?.size ?? sizes[0] ?? null);
      }
    }
  };

  // Sync external variant prop (galería): null = volver al default.
  useEffect(() => {
    if (externalVariant === null) {
      setSelectedColor(colors[0]?.name ?? null);
      setSelectedSize(sizes[0] ?? null);
    }
  }, [externalVariant]);

  useEffect(() => {
    const unsub = useCartStore.subscribe((state: any) => {
      if (state._hasHydrated) setHasHydrated(true);
    });
    if (useCartStore.getState()._hasHydrated) setHasHydrated(true);
    return unsub;
  }, []);

  // ?variant=<id> — se llega desde el "+" de la card con un color ya elegido.
  // Se aplica tras montar (no en el estado inicial) para no romper la hidratación.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const variantId = new URLSearchParams(window.location.search).get('variant');
    if (!variantId) return;

    const variant = variants.find((v) => String(v.id) === variantId);
    if (variant) {
      setSelectedColor(variant.name ?? null);
      if (variant.size) setSelectedSize(variant.size);
    }
  }, [product.id]);

  // Días extra de entrega configurados en el admin (setting opcional).
  const { data: deliveryOffset = 0 } = useDeliveryOffsetQuery();
  const { data: cutoffHour = DEFAULT_DISPATCH_CUTOFF_HOUR } = useDispatchCutoffQuery();

  // Number(): los decimales llegan como string desde el backend.
  const basePrice = Number(product.price ?? 0);
  const stock = Number(product.stock ?? 0);

  const currentPrice = Number(selected?.price ?? basePrice);
  const discount = product.discount ?? 0;
  const hasDiscount = discount > 0;
  const discountedPrice = hasDiscount ? currentPrice * (1 - discount / 100) : currentPrice;

  const inStock = stock > 0;
  const statusLabel = inStock ? 'En stock' : 'Agotado';
  const statusIsBad = !inStock;

  const getCartItem = () => {
    if (!selected) return null;
    return {
      productId: product.id,
      // Con combos reales (variante.color+talla) el id ya ES la combinación.
      // El "|talla" solo aplica al fallback de catálogo suelto (product.sizes);
      // en ambos casos el backend recibe el id numérico (parseInt corta en "|").
      variantId:
        !hasComboSizes && sizes.length > 0 && selectedSize
          ? `${selected.id}|${selectedSize}`
          : String(selected.id),
      name: product.name,
      variationName: selected.name,
      size: selectedSize ?? undefined,
      image: selected.images?.[0]?.url ?? product.image ?? product.imageUrl ?? '',
      price: hasDiscount ? discountedPrice : currentPrice,
      quantity: 1,
      maxQty: inStock ? stock : undefined,
      stockAvailable: stock,
    };
  };

  const proceedAdd = () => {
    const item = getCartItem();
    if (!item) return;
    addItem(item);
    // Añadir abre el carrito drawer (ref. PDF carrito): el cliente ve su
    // pieza entrar sin salir de la ficha. Para pagar: FINALIZAR COMPRA.
    useCartStore.getState().setDrawerOpen(true);
    sonnerResponse(`${product.name} agregado al carrito.`, 'success');
  };

  const proceedFastPurchase = () => {
    const item = getCartItem();
    if (!item) return;
    addItem(item);
    window.location.href = '/checkout';
  };

  const sizeMissing = sizes.length > 0 && !selectedSize;

  const handleAddToCart = () => {
    if (!hasHydrated) { sonnerResponse('Cargando carrito...', 'error'); return; }
    if (!selected) { sonnerResponse('Selecciona un color.', 'error'); return; }
    if (sizeMissing) { sonnerResponse('Selecciona una talla.', 'error'); return; }
    if (!inStock) { sonnerResponse('No hay stock disponible.', 'error'); return; }
    proceedAdd();
  };

  const handleFastPurchase = () => {
    if (!hasHydrated) { sonnerResponse('Cargando carrito...', 'error'); return; }
    if (!selected) { sonnerResponse('Selecciona un color.', 'error'); return; }
    if (sizeMissing) { sonnerResponse('Selecciona una talla.', 'error'); return; }
    if (!inStock) { sonnerResponse('No hay stock disponible.', 'error'); return; }
    proceedFastPurchase();
  };

  const handleWhatsapp = () => {
    const url =
      typeof window !== 'undefined'
        ? window.location.href
        : `https://livi.ec${productUrl(product)}`;
    const msg = `Hola, me interesa ${product.name} de LIVI: ${url}`;
    window.open(`https://wa.me/593992305463?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="flex flex-col gap-3 text-text">
      {/* Title + precio (ref. PDF ficha) */}
      <div>
        <h1 className="font-heading text-3xl font-normal leading-[1.02] tracking-[-0.01em] text-text md:text-4xl">{product.name}</h1>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="font-heading text-2xl text-text md:text-3xl">
            {formatCurrency(discountedPrice)}
          </span>
          {hasDiscount && (
            <span className="font-body text-sm text-text-muted line-through">
              {formatCurrency(currentPrice)}
            </span>
          )}
          <span className={`ml-auto font-mono text-[10px] uppercase tracking-[0.2em] ${statusIsBad ? 'text-error' : 'text-text-muted'}`}>
            {statusLabel}
          </span>
        </div>
        {product.description && <Description text={product.description} />}
      </div>

      {/* Selector de color — puntos redondos (ref. PDF ficha). Se mapean los
          COLORES únicos (una variante puede repetir color con distinta talla);
          el hex lo define el admin en la variante y si falta se infiere. */}
      {colors.length > 0 && (
        <div>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-text-muted">
            Color{selectedColor ? ` · ${selectedColor}` : ''}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {colors.map((v) => {
              const active = selectedColor === (v.name ?? null);
              return (
                <button
                  key={v.name ?? 'unico'}
                  onClick={() => handleSelectColor(v.name ?? '')}
                  title={v.name ?? 'Color'}
                  aria-label={`Color ${v.name ?? 'único'}`}
                  aria-pressed={active}
                  className={`h-9 w-9 rounded-full border border-border transition-all ${
                    active ? 'outline outline-2 outline-offset-[3px] outline-accent' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: v.colorHex ?? colorHex(v.name) }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Selector de talla (ref. minabaie "Size: Full / Midi / Mini"). Con
          combos reales, la talla que no existe para el color queda apagada. */}
      {sizes.length > 0 && (
        <div>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-text-muted">
            Talla{selectedSize ? ` · ${selectedSize}` : ''}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {sizes.map((size) => {
              const active = selectedSize === size;
              const available =
                !hasComboSizes ||
                selectedColor === null ||
                variants.some((v) => (v.name ?? null) === selectedColor && v.size === size);
              return (
                <button
                  key={size}
                  type="button"
                  disabled={!available}
                  onClick={() => setSelectedSize(size)}
                  aria-pressed={active}
                  className={`min-w-16 border px-5 py-2.5 font-body text-xs tracking-[0.04em] transition-colors ${
                    active
                      ? 'border-text bg-text text-bg'
                      : available
                        ? 'border-border bg-transparent text-text hover:border-text'
                        : 'cursor-not-allowed border-border bg-transparent text-text-muted opacity-40 line-through'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Entrega — una sola línea editorial, sin caja (ref. minabaie). */}
      <div className="-mx-4 flex items-center gap-3 border-y border-border px-4 py-3">
        <span className="commit-icon commit-icon--drive inline-flex h-5 w-5 shrink-0 text-text-soft">
          <TruckLineIcon size={16} />
        </span>
        <p className="font-body text-xs leading-snug text-text-soft">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-muted">
            Se despacha&nbsp;
          </span>
          <span className="text-text">{dispatchDateShort(cutoffHour)}</span>
          <span className="text-text-muted"> · entrega estimada </span>
          <span className="text-text">{deliveryRangeShort(deliveryOffset, cutoffHour)}</span>
        </p>
      </div>

      <TrustIcons />

      <div className="fixed inset-x-0 bottom-0 z-40 flex flex-col gap-2 border-t border-border bg-bg/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm md:static md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className="gold-frame flex w-full items-center justify-center gap-2 bg-accent py-4 font-mono text-[11px] uppercase tracking-[0.24em] text-bg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {inStock ? 'Añadir al carrito' : 'Agotado'}
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleFastPurchase}
            disabled={!inStock}
            className="flex-1 border border-text py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-text transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            Comprar ahora
          </button>
          <button
            onClick={handleWhatsapp}
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center bg-[#25D366] text-white transition-colors hover:bg-[#1EBE5B]"
            title="Consultar por WhatsApp"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.996 2C6.474 2 2 6.474 2 11.996C2 13.921 2.548 15.717 3.511 17.25L2.146 22.18L7.204 20.852C8.683 21.688 10.297 22.158 11.996 22.158C17.518 22.158 22 17.684 22 12.162C22 6.64 17.518 2.166 11.996 2.166V2ZM17.152 16.315C16.94 16.91 16.1 17.433 15.441 17.545C14.945 17.625 14.284 17.682 11.838 16.669C8.91 15.452 7.027 12.441 6.884 12.253C6.741 12.064 5.72 10.71 5.72 9.31C5.72 7.91 6.442 7.238 6.741 6.93C6.983 6.681 7.404 6.551 7.82 6.551C7.962 6.551 8.089 6.558 8.199 6.564C8.484 6.577 8.627 6.602 8.814 7.051C9.05 7.618 9.623 9.022 9.693 9.172C9.764 9.322 9.851 9.531 9.742 9.742C9.643 9.941 9.551 10.035 9.408 10.203C9.266 10.372 9.13 10.493 8.979 10.672C8.847 10.832 8.694 10.992 8.865 11.282C9.036 11.571 9.625 12.532 10.489 13.303C11.603 14.298 12.51 14.611 12.83 14.743C13.151 14.875 13.34 14.856 13.568 14.613C13.797 14.368 14.441 13.621 14.713 13.313C14.985 13.003 15.241 13.041 15.526 13.144C15.811 13.248 17.324 13.996 17.625 14.145C17.925 14.295 18.125 14.369 18.196 14.494C18.267 14.618 18.267 15.308 17.965 15.939L17.152 16.315Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Envoltura de regalo (ref. PDF ficha) — el empaque de regalo LIVI
          viene incluido en cada pedido; se muestra como compromiso, no como add-on. */}
      <div className="flex items-center gap-3 border border-border px-4 py-3.5">
        <img src="/caballito-burgundy.png" alt="" width="26" height="21" className="h-[21px] w-[26px] object-contain" aria-hidden />
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text">
            Envoltura de regalo LIVI incluida
          </p>
          <p className="mt-0.5 font-body text-xs text-text-muted">
            Caja beige, faja burgundy y tarjeta firmada — sin costo.
          </p>
        </div>
      </div>

      {/* Acordeones de la ficha (estilo minabaie, en español):
          Características y detalles · Usos comunes · Medidas y organización ·
          Envío y devoluciones (quemado) · Nuestra garantía (quemado). */}
      <div className="border-t border-border">
        {product.detailDescription && (
          <Accordion title="Características y detalles" defaultOpen>
            <p className="font-body text-sm leading-relaxed text-text-soft">
              {product.detailDescription}
            </p>
          </Accordion>
        )}
        {(product.commonUses ?? []).length > 0 && (
          <Accordion title="Usos comunes">
            <ul className="flex flex-col gap-2">
              {(product.commonUses ?? []).map((u) => (
                <li key={u} className="font-body text-sm leading-relaxed text-text-soft">
                  — {u}
                </li>
              ))}
            </ul>
          </Accordion>
        )}
        {(product.benefits ?? []).length > 0 && (
          <Accordion title="Medidas y organización">
            <ul className="flex flex-col gap-2">
              {(product.benefits ?? []).map((b) => (
                <li key={b} className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-text-soft">
                  {b}
                </li>
              ))}
            </ul>
          </Accordion>
        )}
        <Accordion title="Envío y devoluciones">
          <ul className="flex flex-col gap-2">
            <li className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-text-soft">
              Envíos a todo Ecuador · Servientrega 24–72 h
            </li>
            <li className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-text-soft">
              El valor del envío se calcula en el checkout
            </li>
            <li className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-text-soft">
              Empaque de regalo LIVI incluido
            </li>
            <li className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-text-soft">
              Cambios dentro de 15 días · pieza sin uso
            </li>
          </ul>
        </Accordion>
        <Accordion title="Nuestra garantía">
          <p className="font-body text-sm leading-relaxed text-text-soft">
            Cada pieza LIVI pasa por control de calidad en nuestro taller antes
            de salir. Si llega con un defecto de fabricación, la reparamos o
            reemplazamos sin costo dentro de los 30 días posteriores a la
            entrega.
          </p>
        </Accordion>
      </div>

      {/* Combina con — mini carrusel dentro del panel (ref. minabaie "Pairs
          With"): cards pequeñas con dots y enlace Agregar. */}
      {pairsWith.length > 0 && <PairsWithRail products={pairsWith} />}

      {/* Pago — medios aceptados */}
      <div className="border-t border-border pt-3">
        <span className="eyebrow">Pago</span>
        <PaymentMethodIcons className="mt-2" />
      </div>
    </div>
  );
}

/* Acordeón de la ficha — borde fino, título editorial, contenido mono. */
function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <span className="font-body text-sm font-medium text-text">{title}</span>
        <span className={`text-text-muted transition-transform ${open ? 'rotate-45' : ''}`} aria-hidden>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 5v14M5 12h14" /></svg>
        </span>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

/* Los hex viven en @/app/helpers/colorHex (compartido con las cards). */

/* Descripción con "Ver más" (ref. minabaie "Show More"): se corta a 3 líneas
   y se despliega en línea. */
function Description({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 140;
  return (
    <div className="mt-3">
      <p className={`font-body text-sm leading-relaxed text-text-soft ${!expanded && isLong ? 'line-clamp-3' : ''}`}>
        {text}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-1.5 border-b border-text pb-0.5 font-body text-xs text-text transition-colors hover:border-accent hover:text-accent"
        >
          {expanded ? 'Ver menos' : 'Ver más'}
        </button>
      )}
    </div>
  );
}

/* "Combina con" (Pairs With) — mini carrusel bajo los acordeones, dentro del
   panel derecho (ref. minabaie). Cards compactas: foto, nombre, color, precio,
   dots y enlace "Agregar" que hace quick-add del primer color. */
function PairsWithRail({ products }: { products: Product[] }) {
  const railRef = useState(() => ({ current: null as HTMLDivElement | null }))[0];
  const addItem = useCartStore((s) => s.addItem);

  const scrollBy = (dir: -1 | 1) => {
    railRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' });
  };

  const quickAdd = (p: Product) => {
    const format = (p.formats ?? []).find((f) => f.price > 0);
    const price = Number(format?.price ?? p.minFormatPrice ?? p.price ?? 0);
    if (!format || price <= 0) {
      window.location.href = `/producto/${p.id}`;
      return;
    }
    addItem({
      productId: p.id,
      variantId: String(format.id),
      name: p.name,
      variationName: format.name,
      image: format.imageUrl || p.image || '',
      price,
      quantity: 1,
      maxQty: Number(p.stock ?? 0) > 0 ? Number(p.stock) : undefined,
      stockAvailable: Number(p.stock ?? 0),
    });
    useCartStore.getState().setDrawerOpen(true);
    sonnerResponse(`${p.name} agregado al carrito.`, 'success');
  };

  return (
    <div className="border-t border-border pt-3">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="font-body text-sm font-medium text-text">Combina con</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => scrollBy(-1)}
            className="flex h-6 w-6 items-center justify-center text-text-muted transition-colors hover:text-text"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={() => scrollBy(1)}
            className="flex h-6 w-6 items-center justify-center text-text-muted transition-colors hover:text-text"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>

      <div
        ref={(el) => { railRef.current = el; }}
        className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p) => {
          const formats = (p.formats ?? []).filter((f) => f.price > 0);
          const first = formats[0];
          const price = Number(first?.price ?? p.minFormatPrice ?? p.price ?? 0);
          const img = first?.imageUrl || p.image || '';
          return (
            <div key={p.id} className="w-[118px] shrink-0">
              <a href={`/producto/${p.id}`} className="block aspect-[4/5] overflow-hidden bg-bg-alt">
                {img && (
                  <img
                    src={img}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                  />
                )}
              </a>
              <a href={`/producto/${p.id}`}>
                <p className="mt-1.5 line-clamp-1 font-body text-[11px] leading-snug text-text">{p.name}</p>
              </a>
              {first?.name && (
                <p className="line-clamp-1 font-body text-[10px] text-text-muted">{first.name}</p>
              )}
              <p className="mt-0.5 font-body text-[11px] text-text">{formatCurrency(price)}</p>
              <div className="mt-1 flex items-center gap-1.5">
                {formats.slice(0, 4).map((f) => (
                  <span
                    key={f.id}
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: f.colorHex ?? colorHex(f.name) }}
                    title={f.name ?? 'Color'}
                  />
                ))}
                {formats.length > 4 && (
                  <span className="font-body text-[9px] text-text-muted">+{formats.length - 4}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => quickAdd(p)}
                className="mt-1 border-b border-text pb-px font-body text-[11px] text-text transition-colors hover:border-accent hover:text-accent"
              >
                Agregar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
