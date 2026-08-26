function addDaysFromToday(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

/**
 * Ventana de entrega en texto: mañana y pasado mañana ("6 y 7 de agosto").
 * `offsetDays` viene del setting `delivery_days_offset` del admin (días
 * adicionales que se suman a la promesa de entrega).
 */
export function deliveryWindow(offsetDays = 0): string {
  const first = addDaysFromToday(1 + offsetDays);
  const second = addDaysFromToday(2 + offsetDays);

  const withMonth = (d: Date) =>
    d.toLocaleDateString('es-EC', { day: 'numeric', month: 'long' });

  // Mismo mes → "6 y 7 de agosto". Distinto mes → "31 de julio y 1 de agosto".
  return first.getMonth() === second.getMonth()
    ? `${first.getDate()} y ${withMonth(second)}`
    : `${withMonth(first)} y ${withMonth(second)}`;
}

function dateShort(d: Date): string {
  return d.toLocaleDateString('es-EC', { day: 'numeric', month: 'short' }).replace('.', '');
}

/** Fecha de hoy en el mismo formato corto de la ficha: "26 ago". */
export function todayShort(): string {
  return dateShort(new Date());
}

/** Rango corto para la ficha/carrito: "27 ago – 28 ago". */
export function deliveryRangeShort(offsetDays = 0): string {
  return `${dateShort(addDaysFromToday(1 + offsetDays))} – ${dateShort(addDaysFromToday(2 + offsetDays))}`;
}

/** Días que tarda una importación bajo pedido. */
export const BACKORDER_LABEL = '13–17 días';

interface Split {
  inStock: number;
  bajo: number;
}

/** Etiqueta por línea del pedido: cuándo llega ese producto. */
export function lineDeliveryLabel(split: Split, offsetDays = 0): string {
  const window = deliveryWindow(offsetDays);
  if (split.bajo === 0) return `Lo recibes entre el ${window}`;
  if (split.inStock === 0) return `Bajo pedido · lo recibes en ${BACKORDER_LABEL}`;
  return `${split.inStock} entre el ${window} · ${split.bajo} en ${BACKORDER_LABEL}`;
}

/** Resumen del pedido completo, debajo del desglose de productos. */
export function orderDeliveryLabel(splits: Split[], offsetDays = 0): string {
  const window = deliveryWindow(offsetDays);
  const hasImmediate = splits.some((s) => s.inStock > 0);
  const hasBackorder = splits.some((s) => s.bajo > 0);

  if (hasImmediate && hasBackorder) {
    return `Recibirás parte de tu pedido entre el ${window} y el resto en ${BACKORDER_LABEL}.`;
  }
  if (hasBackorder) return `Recibirás tu pedido en ${BACKORDER_LABEL}.`;
  return `Recibirás tu pedido entre el ${window}.`;
}
