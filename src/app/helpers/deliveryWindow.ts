/**
 * Ventana de entrega en texto: mañana y pasado mañana ("6 y 7 de agosto").
 * `offsetDays` viene del setting `delivery_days_offset` del admin (días
 * adicionales que se suman a la promesa de entrega).
 */
export function deliveryWindow(offsetDays = 0): string {
  const first = new Date();
  first.setDate(first.getDate() + 1 + offsetDays);
  const second = new Date();
  second.setDate(second.getDate() + 2 + offsetDays);

  const withMonth = (d: Date) =>
    d.toLocaleDateString('es-EC', { day: 'numeric', month: 'long' });

  // Mismo mes → "6 y 7 de agosto". Distinto mes → "31 de julio y 1 de agosto".
  return first.getMonth() === second.getMonth()
    ? `${first.getDate()} y ${withMonth(second)}`
    : `${withMonth(first)} y ${withMonth(second)}`;
}
