import type { PaymentMethod } from './types';

export const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; description: string }[] = [
  {
    value:       'PAYPHONE',
    label:       'Payphone',
    description: 'Pago con tarjeta de crédito/débito. Recargo del 6%.',
  },
  {
    value:       'TRANSFERENCIA',
    label:       'Transferencia bancaria',
    description: 'Te enviamos los datos por WhatsApp/email.',
  },
  {
    value:       'EFECTIVO',
    label:       'Efectivo',
    description: 'Solo para retiro en tienda (Daule).',
  },
];

// Constantes de negocio
export const PAYPHONE_SURCHARGE_PERCENTAGE = 6;
export const PAYPHONE_SURCHARGE_MESSAGE = 'Recargo del 6% por pago con tarjeta';
export const ESTIMATED_SHIPPING = 3;
