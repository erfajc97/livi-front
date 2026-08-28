// Formatea un número como precio en USD.
// TypeORM `decimal` llega como string en JSON — Number() antes de formatear.
export const formatCurrency = (amount: number | string): string => {
  const n = Number(amount);
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);
};
