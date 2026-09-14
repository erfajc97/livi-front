import type { ProfileTabId } from './types';

export const PROFILE_TABS: { id: ProfileTabId; label: string }[] = [
  { id: 'perfil', label: 'Perfil' },
  { id: 'direcciones', label: 'Direcciones' },
  { id: 'pedidos', label: 'Mis Pedidos' },
];

// === TRACKING TIMELINE ===
export interface TrackingStep {
  title: string;
  description: string;
  date: string;
  completed: boolean;
  active: boolean;
}

export const MOCK_TRACKING_STEPS: TrackingStep[] = [
  { title: 'Pedido confirmado', description: 'Tu pedido ha sido registrado exitosamente', date: '20 febrero 2026 - 10:30', completed: true, active: false },
  { title: 'Preparando tu pedido', description: 'Estamos seleccionando tus piezas', date: '20 febrero 2026 - 10:30', completed: true, active: false },
  { title: 'Empacando tu pedido', description: 'Envuelto con presentación premium', date: '20 febrero 2026 - 10:30', completed: true, active: false },
  { title: 'Enviado exitosamente', description: 'Tu paquete salió de nuestro almacén', date: '20 febrero 2026 - 10:30', completed: true, active: false },
  { title: 'En tránsito', description: 'En camino a tu Ciudad', date: '20 febrero 2026 - 10:30', completed: true, active: true },
  { title: 'En reparto', description: 'Tu pedido está cada vez más cerca', date: '20 febrero 2026 - 10:30', completed: false, active: false },
  { title: 'Entregado', description: 'Disfruta tu nueva LIVI.', date: '', completed: false, active: false },
];

export const MOCK_TRACKING_ORDER = {
  id: 'ORD-2045Y-NOE',
  name: 'Noé Leather Backpack',
  image: '/home-3.png',
  status: 'En tránsito' as const,
  progress: 83,
  estimatedDate: '25/08/2026',
};

// === ORDERS (no entregados) ===
export const MOCK_PENDING_ORDERS = [
  { id: 'ORD-2045Y-50ML', name: 'Noé Leather Backpack', image: '/home-3.png', date: '20 Febrero 2026', price: 129, status: 'En tránsito' },
  { id: 'ORD-2045Y-50ML', name: 'Noé Leather Backpack', image: '/home-3.png', date: '20 Febrero 2026', price: 129, status: 'Entregado' },
  { id: 'ORD-2045Y-50ML', name: 'Noé Leather Backpack', image: '/home-3.png', date: '20 Febrero 2026', price: 129, status: 'Entregado' },
  { id: 'ORD-2045Y-50ML', name: 'Noé Leather Backpack', image: '/home-3.png', date: '20 Febrero 2026', price: 129, status: 'Entregado' },
];

// === PROFILE ===
export const MOCK_PROFILE = {
  name: 'Alejandro Magno',
  email: 'phillipediaz@shepwashi.com',
  phone: '+525512324567',
};

export const MOCK_ADDRESSES = [
  { id: '1', label: 'Casa', address: 'Avenida 456 Ecuador Guayaquil', selected: true },
  { id: '2', label: 'Oficina', address: 'Avenida 456 Ecuador Guayaquil', selected: false },
];

export const MOCK_PREFERENCES = ['Pañaleras', 'Mochilas'];

// === PAYMENTS ===
export const MOCK_PAYMENTS = [
  { id: '1', name: 'Noé Leather Backpack', image: '/home-3.png', method: 'efectivo', amount: 129, date: '4 de Enero 2026', status: 'Pagado' },
  { id: '2', name: 'Noé Leather Backpack', image: '/home-3.png', method: 'efectivo', amount: 129, date: '4 de Enero 2026', status: 'Pagado' },
  { id: '3', name: 'Noé Leather Backpack', image: '/home-3.png', method: 'efectivo', amount: 129, date: '4 de Enero 2026', status: 'Pagado' },
];
