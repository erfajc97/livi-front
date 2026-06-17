import { useCartStore, type CartItem } from '@/app/store/cart/cartStore';
import { ESTIMATED_SHIPPING } from '@/app/features/checkout/data';

export interface CartRow {
  item: CartItem;
  /** Unidades de este item que pertenecen a este grupo. */
  portionQty: number;
  /** Cantidad total del item (suma de ambos grupos). */
  total: number;
  /** El item también tiene unidades en el otro grupo (está partido). */
  split: boolean;
}

/** Divide un item en porción en-stock vs bajo-pedido según la regla de negocio. */
function splitItem(item: CartItem): { inStock: number; bajo: number } {
  const qty = item.quantity;
  // Combos: se tratan completos según su flag (no se parten).
  if (item.comboId != null) {
    return item.bajoPedido ? { inStock: 0, bajo: qty } : { inStock: qty, bajo: 0 };
  }
  // Producto 100% bajo pedido → todo bajo pedido.
  if (item.bajoPedido) return { inStock: 0, bajo: qty };
  // Frasco sellado con stock limitado → excedente bajo pedido.
  if (item.stockAvailable != null) {
    const inStock = Math.min(qty, item.stockAvailable);
    return { inStock, bajo: qty - inStock };
  }
  // Decant (topado por maxQty) o sin límite → todo en stock.
  return { inStock: qty, bajo: 0 };
}

/**
 * Lógica de la página de carrito: separa los items en dos grupos (envío
 * inmediato vs bajo pedido). Un mismo producto puede aparecer en AMBOS cuando
 * la cantidad pedida supera el stock disponible (excedente bajo pedido).
 */
export function useCartPageHook() {
  const items       = useCartStore((s) => s.items);
  const removeItem  = useCartStore((s) => s.removeItem);
  const updateQty   = useCartStore((s) => s.updateQty);
  const hasHydrated = useCartStore((s) => s._hasHydrated);

  const immediate: CartRow[] = [];
  const bajo: CartRow[] = [];
  let immediateSubtotal = 0;
  let bajoSubtotal = 0;

  for (const item of items) {
    const { inStock, bajoQty } = (() => {
      const r = splitItem(item);
      return { inStock: r.inStock, bajoQty: r.bajo };
    })();
    const isSplit = inStock > 0 && bajoQty > 0;
    if (inStock > 0) {
      immediate.push({ item, portionQty: inStock, total: item.quantity, split: isSplit });
      immediateSubtotal += item.price * inStock;
    }
    if (bajoQty > 0) {
      bajo.push({ item, portionQty: bajoQty, total: item.quantity, split: isSplit });
      bajoSubtotal += item.price * bajoQty;
    }
  }

  const immediateCount = immediate.reduce((a, r) => a + r.portionQty, 0);
  const bajoCount = bajo.reduce((a, r) => a + r.portionQty, 0);
  const subtotal = immediateSubtotal + bajoSubtotal;
  const shipping = items.length > 0 ? ESTIMATED_SHIPPING : 0;
  const total = subtotal + shipping;
  const itemCount = items.reduce((a, i) => a + i.quantity, 0);

  return {
    items,
    immediate,
    bajo,
    immediateSubtotal,
    bajoSubtotal,
    immediateCount,
    bajoCount,
    subtotal,
    shipping,
    total,
    itemCount,
    removeItem,
    updateQty,
    hasHydrated,
  };
}
