const TZ = 'America/Guayaquil';

/** Hora de corte de despacho (Ecuador). Tras esa hora, el envío sale al día siguiente. */
export const DEFAULT_DISPATCH_CUTOFF_HOUR = 15;

function tzParts(now: Date, options: Intl.DateTimeFormatOptions): Record<string, string> {
  return Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { timeZone: TZ, ...options })
      .formatToParts(now)
      .filter((p) => p.type !== 'literal')
      .map((p) => [p.type, p.value]),
  );
}

/** Calendario de Ecuador (mediodía UTC) para sumar días sin cruzar medianoche local. */
function guayaquilDate(now = new Date()): Date {
  const p = tzParts(now, { year: 'numeric', month: '2-digit', day: '2-digit' });
  return new Date(Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), 12));
}

function addDaysFromToday(days: number, now = new Date()): Date {
  const date = guayaquilDate(now);
  date.setUTCDate(date.getUTCDate() + days);
  return date;
}

function dateShort(d: Date): string {
  return d
    .toLocaleDateString('es-EC', { day: 'numeric', month: 'short', timeZone: TZ })
    .replace('.', '');
}

export function guayaquilHour(now = new Date()): number {
  return Number(tzParts(now, { hour: '2-digit', hourCycle: 'h23' }).hour);
}

/**
 * 0 = se despacha hoy (antes del corte en Ecuador).
 * 1 = se despacha mañana (pedido confirmado a partir de las `cutoffHour`).
 */
export function dispatchDayOffset(cutoffHour = DEFAULT_DISPATCH_CUTOFF_HOUR, now = new Date()): number {
  return guayaquilHour(now) >= cutoffHour ? 1 : 0;
}

/** Texto del despacho: "Hoy 26 ago" o "27 ago" si ya pasó el corte. */
export function dispatchDateShort(cutoffHour = DEFAULT_DISPATCH_CUTOFF_HOUR, now = new Date()): string {
  const offset = dispatchDayOffset(cutoffHour, now);
  if (offset === 0) return `Hoy ${dateShort(guayaquilDate(now))}`;
  return dateShort(addDaysFromToday(1, now));
}

/**
 * Ventana de entrega en texto: mañana y pasado mañana ("6 y 7 de agosto").
 * `offsetDays` viene del setting `delivery_days_offset` del admin (días
 * adicionales que se suman a la promesa de entrega).
 * `cutoffHour` viene de `dispatch_cutoff_hour` (por defecto 15:00 Ecuador).
 */
export function deliveryWindow(
  offsetDays = 0,
  cutoffHour = DEFAULT_DISPATCH_CUTOFF_HOUR,
): string {
  const start = dispatchDayOffset(cutoffHour);
  const first = addDaysFromToday(1 + start + offsetDays);
  const second = addDaysFromToday(2 + start + offsetDays);

  const withMonth = (d: Date) =>
    d.toLocaleDateString('es-EC', { day: 'numeric', month: 'long', timeZone: TZ });

  // Mismo mes → "6 y 7 de agosto". Distinto mes → "31 de julio y 1 de agosto".
  return first.getUTCMonth() === second.getUTCMonth()
    ? `${first.getUTCDate()} y ${withMonth(second)}`
    : `${withMonth(first)} y ${withMonth(second)}`;
}

/** Fecha de hoy en Ecuador, formato corto de la ficha: "26 ago". */
export function todayShort(): string {
  return dateShort(guayaquilDate());
}

/** Rango corto para la ficha/carrito: "27 ago – 28 ago". */
export function deliveryRangeShort(
  offsetDays = 0,
  cutoffHour = DEFAULT_DISPATCH_CUTOFF_HOUR,
): string {
  const start = dispatchDayOffset(cutoffHour);
  return `${dateShort(addDaysFromToday(1 + start + offsetDays))} – ${dateShort(addDaysFromToday(2 + start + offsetDays))}`;
}

/** Días que tarda una importación bajo pedido. */
export const BACKORDER_LABEL = '13–17 días';

interface Split {
  inStock: number;
  bajo: number;
}

/** Etiqueta por línea del pedido: cuándo llega ese producto. */
export function lineDeliveryLabel(
  split: Split,
  offsetDays = 0,
  cutoffHour = DEFAULT_DISPATCH_CUTOFF_HOUR,
): string {
  const window = deliveryWindow(offsetDays, cutoffHour);
  if (split.bajo === 0) return `Lo recibes entre el ${window}`;
  if (split.inStock === 0) return `Bajo pedido · lo recibes en ${BACKORDER_LABEL}`;
  return `${split.inStock} entre el ${window} · ${split.bajo} en ${BACKORDER_LABEL}`;
}

/** Resumen del pedido completo, debajo del desglose de productos. */
export function orderDeliveryLabel(
  splits: Split[],
  offsetDays = 0,
  cutoffHour = DEFAULT_DISPATCH_CUTOFF_HOUR,
): string {
  const window = deliveryWindow(offsetDays, cutoffHour);
  const hasImmediate = splits.some((s) => s.inStock > 0);
  const hasBackorder = splits.some((s) => s.bajo > 0);

  if (hasImmediate && hasBackorder) {
    return `Recibirás parte de tu pedido entre el ${window} y el resto en ${BACKORDER_LABEL}.`;
  }
  if (hasBackorder) return `Recibirás tu pedido en ${BACKORDER_LABEL}.`;
  return `Recibirás tu pedido entre el ${window}.`;
}
