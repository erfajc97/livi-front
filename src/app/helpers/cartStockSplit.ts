import type { CartItem } from '@/app/store/cart/cartStore';

export interface StockSplit {
  /** Unidades que salen del stock físico (envío inmediato). */
  inStock: number;
  /** Unidades que se importan bajo pedido (13–17 días). */
  bajo: number;
}

/** Un item es decant cuando no es combo ni el frasco completo del producto. */
export const isDecantItem = (item: CartItem) =>
  item.comboId == null && !item.variantId.startsWith('full-');

/**
 * Reparte cada línea del carrito entre stock inmediato y bajo pedido teniendo
 * en cuenta que frascos y decants comparten el MISMO inventario físico.
 *
 * Regla de negocio: los frascos sellados tienen prioridad. Si el carrito lleva
 * 2 frascos de 100 ml de un producto con 2 frascos en stock, esos 200 ml ya
 * están comprometidos, así que los decants del mismo producto pasan a bajo
 * pedido (antes se vendían como si el inventario alcanzara para ambos).
 *
 * Devuelve un mapa `variantId → { inStock, bajo }`.
 */
export function splitCartStock(items: CartItem[]): Map<string, StockSplit> {
  const result = new Map<string, StockSplit>();
  // ml físicos que quedan por producto para preparar decants.
  const remainingMl = new Map<string, number>();
  // Los carritos guardados pueden traer los ml como string ("100.00").
  const ml = (item: CartItem) => Number(item.ml) || 0;

  // Pool inicial por producto: el ml disponible que informó el detalle del
  // producto (frascos sellados + frasco abierto). Los carritos guardados antes
  // de esta regla no lo traen → esos items conservan el comportamiento previo.
  for (const item of items) {
    if (item.comboId != null || item.availableMl == null) continue;
    const pool = Number(item.availableMl) || 0;
    const prev = remainingMl.get(item.productId);
    if (prev == null || pool > prev) {
      remainingMl.set(item.productId, pool);
    }
  }

  // 1ª pasada — combos y frascos completos: consumen el stock sellado.
  for (const item of items) {
    const qty = item.quantity;

    if (item.comboId != null) {
      result.set(
        item.variantId,
        item.bajoPedido ? { inStock: 0, bajo: qty } : { inStock: qty, bajo: 0 },
      );
      continue;
    }
    if (isDecantItem(item)) continue;

    // Frasco 100% bajo pedido (importación) → no toca el inventario local.
    if (item.bajoPedido || item.stockAvailable == null) {
      result.set(
        item.variantId,
        item.bajoPedido ? { inStock: 0, bajo: qty } : { inStock: qty, bajo: 0 },
      );
      continue;
    }

    const inStock = Math.min(qty, item.stockAvailable);
    result.set(item.variantId, { inStock, bajo: qty - inStock });

    // Cada frasco sellado vendido saca sus ml del pool de decants.
    const pool = remainingMl.get(item.productId);
    if (pool != null && ml(item) > 0) {
      remainingMl.set(item.productId, Math.max(0, pool - inStock * ml(item)));
    }
  }

  // 2ª pasada — decants: se preparan con el ml que sobró; el resto va bajo pedido.
  for (const item of items) {
    if (!isDecantItem(item)) continue;
    const qty = item.quantity;

    if (item.bajoPedido) {
      result.set(item.variantId, { inStock: 0, bajo: qty });
      continue;
    }

    const pool = remainingMl.get(item.productId);
    if (pool == null || ml(item) <= 0) {
      result.set(item.variantId, { inStock: qty, bajo: 0 });
      continue;
    }

    const inStock = Math.min(qty, Math.floor(pool / ml(item)));
    remainingMl.set(item.productId, pool - inStock * ml(item));
    result.set(item.variantId, { inStock, bajo: qty - inStock });
  }

  return result;
}

/** Split de un item concreto, con fallback seguro si no está en el mapa. */
export function getSplit(
  splits: Map<string, StockSplit>,
  item: CartItem,
): StockSplit {
  return splits.get(item.variantId) ?? { inStock: item.quantity, bajo: 0 };
}
