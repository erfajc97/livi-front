import type { Order, OrderStatus } from '@/app/types/global.types';

// === SHIPMENT TRACKER ===
export type SearchType = 'guia' | 'remision' | 'factura';

export const SEARCH_OPTIONS: { value: SearchType; label: string }[] = [
  { value: 'guia', label: 'Guía' },
  { value: 'remision', label: 'Remisión' },
  { value: 'factura', label: 'Factura' },
];

export const SEARCH_PLACEHOLDERS: Record<SearchType, string> = {
  guia: 'Número de Guía : Ejemplo 34353466',
  remision: 'Número de Remisión : Ejemplo 12345678',
  factura: 'Número de Factura : Ejemplo 87654321',
};

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  PENDING:    { label: 'Pendiente',    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' },
  CONFIRMED:  { label: 'Confirmada',   color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
  PROCESSING: { label: 'En proceso',   color: 'bg-purple-500/20 text-purple-400 border-purple-500/40' },
  SHIPPED:    { label: 'Enviada',      color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40' },
  DELIVERED:  { label: 'Entregada',    color: 'bg-success/20 text-success border-success/40' },
  CANCELLED:  { label: 'Cancelada',    color: 'bg-error/20 text-error border-error/40' },
};

export const MOCK_ORDER: Order = {
  id: 'ord-demo-001-nondecants',
  status: 'CONFIRMED',
  paymentMethod: 'PAYPHONE',
  deliveryMethod: 'SERVIENTREGA_GYE',
  subtotal: 60,
  deliveryCost: 3,
  payphoneSurcharge: 3.78,
  total: 66.78,
  customerName: 'María García',
  customerEmail: 'maria@ejemplo.com',
  customerPhone: '0991234567',
  city: 'Guayaquil',
  address: 'Av. 9 de Octubre 123, Piso 2',
  trackingCode: undefined,
  items: [
    { productId: 'p4', variantId: 'p4-v1', name: 'Bleu de Chanel EDP', ml: 10, price: 22, quantity: 1 },
    { productId: 'p5', variantId: 'p5-v2', name: 'Spicebomb Extreme', ml: 10, price: 21, quantity: 1 },
    { productId: 'p7', variantId: 'p7-v1', name: 'Perfume Árabe Lattafa', ml: 100, price: 17, quantity: 1 },
  ],
  createdAt: '2026-03-01T15:30:00Z',
  updatedAt: '2026-03-01T15:31:00Z',
};
