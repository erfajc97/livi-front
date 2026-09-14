/**
 * Hex de los colores de la paleta LIVI para los swatches/dots de color.
 * Coincidencia por nombre de variante (color).
 */
export function colorHex(name?: string): string {
  const n = (name ?? '').toLowerCase();
  if (n.includes('negro') || n.includes('black')) return '#12100E';
  if (n.includes('espresso') || n.includes('café') || n.includes('cafe')) return '#3B2418';
  if (n.includes('beige') || n.includes('arena')) return '#D8C9B4';
  if (n.includes('burgundy') || n.includes('vino')) return '#4D0E12';
  if (n.includes('sage') || n.includes('verde')) return '#9EAA8F';
  if (n.includes('celeste') || n.includes('azul') || n.includes('dusty')) return '#A5BCD6';
  if (n.includes('butter') || n.includes('crema')) return '#F5EFC6';
  return '#8A7B6B';
}
