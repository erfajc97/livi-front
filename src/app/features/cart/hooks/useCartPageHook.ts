import { useCartStore, type CartItem } from '@/app/store/cart/cartStore';
import { ESTIMATED_SHIPPING } from '@/app/features/checkout/data';
import { splitCartStock, getSplit } from '@/app/helpers/cartStockSplit';
import { useDeliveryOffsetQuery } from '@/app/tanstack-queries/settingsQuery';

export interface CartRow {
  item: CartItem;
  /** Unidades de este item que pertenecen a este grupo. */
  portionQty: number;
  /** Cantidad total del item (suma de ambos grupos). */
  total: number;
  /** El item también tiene unidades en el otro grupo (está partido). */
  split: boolean;
}

/**
 * Lógica de la página de carrito: separa los items en dos grupos (envío
 * inmediato vs bajo pedido). Un mismo producto puede aparecer en AMBOS cuando
 * la cantidad pedida supera el stock disponible (excedente bajo pedido).
 * El reparto es a nivel de carrito: frascos y decants del mismo producto
 * comparten inventario (ver `splitCartStock`).
 */
export function useCartPageHook() {
  const items       = useCartStore((s) => s.items);
  const removeItem  = useCartStore((s) => s.removeItem);
  const updateQty   = useCartStore((s) => s.updateQty);
  const hasHydrated = useCartStore((s) => s._hasHydrated);
  const { data: deliveryOffset = 0 } = useDeliveryOffsetQuery();

  const immediate: CartRow[] = [];
  const bajo: CartRow[] = [];
  let immediateSubtotal = 0;
  let bajoSubtotal = 0;

  const splits = splitCartStock(items);

  for (const item of items) {
    const { inStock, bajo: bajoQty } = getSplit(splits, item);
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
    deliveryOffset,
  };
}
