import { useCartStore, type CartItem } from '@/app/store/cart/cartStore';
import { ESTIMATED_SHIPPING } from '@/app/features/checkout/data';
import { DEFAULT_DISPATCH_CUTOFF_HOUR } from '@/app/helpers/deliveryWindow';
import { useDeliveryOffsetQuery, useDispatchCutoffQuery } from '@/app/tanstack-queries/settingsQuery';

export interface CartRow {
  item: CartItem;
  /** Unidades de este item que pertenecen a este grupo. */
  portionQty: number;
  /** Cantidad total del item. */
  total: number;
  /** El item también tiene unidades en el otro grupo (está partido). */
  split: boolean;
}

/**
 * Lógica de la página de carrito. En LIVI todos los items son de envío
 * inmediato (stock por unidades a nivel producto): no hay bajo pedido,
 * así que el grupo `bajo` siempre va vacío y nada se parte.
 */
export function useCartPageHook() {
  const items       = useCartStore((s) => s.items);
  const removeItem  = useCartStore((s) => s.removeItem);
  const updateQty   = useCartStore((s) => s.updateQty);
  const hasHydrated = useCartStore((s) => s._hasHydrated);
  const { data: deliveryOffset = 0 } = useDeliveryOffsetQuery();
  const { data: cutoffHour = DEFAULT_DISPATCH_CUTOFF_HOUR } = useDispatchCutoffQuery();

  const immediate: CartRow[] = [];
  const bajo: CartRow[] = [];
  let immediateSubtotal = 0;
  const bajoSubtotal = 0;

  for (const item of items) {
    immediate.push({ item, portionQty: item.quantity, total: item.quantity, split: false });
    immediateSubtotal += item.price * item.quantity;
  }

  const immediateCount = immediate.reduce((a, r) => a + r.portionQty, 0);
  const bajoCount = 0;
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
    cutoffHour,
  };
}
