// ── Utilidades ──────────────────────────────────────────
export interface PaginatedResponse<T> {
  content: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ── Enums de negocio ────────────────────────────────────
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'PAYPHONE' | 'TRANSFERENCIA' | 'EFECTIVO';

export type DeliveryMethod = 'RETIRO' | 'ENTREGA_PERSONAL' | 'RETIRO_PIWU' | 'SERVIENTREGA_GYE' | 'SERVIENTREGA_NACIONAL';

// ── Enums de producto ────────────────────────────────────
export type Gender = 'HOMBRE' | 'MUJER' | 'UNISEX';
export type TimeOfDay = 'DIA' | 'NOCHE';
export type Concentration = 'EAU_DE_PARFUM' | 'EAU_DE_TOILETTE' | 'ELIXIR_DE_PARFUM' | 'EAU_DE_COLOGNE' | 'BODY_MIST' | 'PARFUM_EXTRAIT';
export type Projection = 'DISCRETA' | 'MODERADA' | 'ALTA';

// ── Modelos de API ──────────────────────────────────────
export interface ProductVariant {
  id: string;
  ml: number;
  price: number;
  mlSize: number;
  isFullBottle: boolean;
  availableQuantity: number;
  images?: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
  imageUrl?: string;
  images?: string[];
  variants: ProductVariant[];
  /** Nº de formatos comprables (frasco + decants), del backend. */
  variationsCount?: number;
  /** Precio del formato más barato / más caro (del backend). */
  minFormatPrice?: number;
  maxFormatPrice?: number;
  /** Lista compacta de formatos (frasco + decants) para las cards. */
  formats?: { id: string; ml: number; price: number; isFullBottle: boolean; imageUrl?: string }[];
  totalMl: number;
  openBottleMlRemaining: number;
  availableMl: number;
  isActive: boolean;
  bajoPedido?: boolean;
  gender?: Gender;
  timeOfDay?: TimeOfDay;
  concentration?: Concentration;
  projection?: Projection;
  discount?: number;
  detailDescription?: string;
  benefits?: string[];
  stock?: number;
  price?: number;
  categoryId?: number;
  marcaId?: number;
  createdAt: string;
  // ── PDP editorial ──
  scentProfileTitle?: string;
  scentSections?: { title: string; notes: { name: string; color: string }[]; description: string }[];
  mood?: string[];
  occasion?: string[];
  longevity?: number;
  projectionScore?: number;
  signatureTitle?: string;
  signatureDescription?: string;
  signatureImageUrl?: string;
}

export interface Banner {
  id: string | number;
  title: string;
  subtitle?: string;
  image?: string;
  imageUrl?: string;
  link?: string;
  buttonText?: string;
  type?: 'hero' | 'category';
  isActive?: boolean;
  isVisible?: boolean;
  order?: number;
  position?: number;
}

export interface LandingSection {
  id: number;
  title: string;
  order: number;
  isActive: boolean;
  products: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryOption {
  id: string;
  method: DeliveryMethod;
  label: string;
  cost: number;
  cities: string[];
}

export interface OrderItem {
  productId: string;
  variantId: string;
  name: string;
  ml: number;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  subtotal: number;
  deliveryCost: number;
  payphoneSurcharge: number;
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  city: string;
  address?: string;
  trackingCode?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// ── Combos ─────────────────────────────────────────────
export interface ComboProduct {
  id: number;
  productId: number;
  productVariationId?: number;
  quantity: number;
  product: Product;
  productVariation?: ProductVariant;
}

export interface Combo {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  finalPrice: number;
  discount?: number;
  isActive: boolean;
  comboProducts: ComboProduct[];
  /** Si es una versión, ID del combo base. */
  parentComboId?: number | null;
  /** Versiones del combo (mismo nombre, otros productos/precio). Solo en el base. */
  versions?: Combo[];
}

// ── Parámetros de query comunes ─────────────────────────
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  inStock?: boolean;
  isActive?: boolean;
  bajoPedido?: boolean;
  categoryId?: number;
  marcaId?: number;
  gender?: Gender;
  timeOfDay?: TimeOfDay;
  concentration?: Concentration;
  projection?: Projection;
  hasDiscount?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'createdAt' | 'salesCount';
  sortOrder?: 'ASC' | 'DESC';
}
