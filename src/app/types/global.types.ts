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

// ── Modelos de API ──────────────────────────────────────
export interface ProductImage {
  id: number | string;
  url: string;
  alt?: string;
  displayOrder?: number;
}

export interface ProductVariant {
  id: string;
  /** Nombre de la variante (color): "Negro", "Espresso"… */
  name?: string;
  /** Talla de la variante (combo color×talla): "Midi", "Maxi"… — opcional. */
  size?: string;
  price: number;
  sku?: string;
  /** Color del swatch en hex (lo define el admin; fallback al mapa por nombre). */
  colorHex?: string;
  /** Unidades disponibles: el stock vive a nivel producto. */
  availableQuantity: number;
  images?: ProductImage[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
  imageUrl?: string;
  images?: ProductImage[];
  variants: ProductVariant[];
  /** Nº de variantes comprables (colores), del backend. */
  variationsCount?: number;
  /** Precio de la variante más barata / más cara (del backend). */
  minFormatPrice?: number;
  maxFormatPrice?: number;
  /** Lista compacta de variantes (colores) para las cards. */
  formats?: { id: string; name?: string; size?: string; price: number; imageUrl?: string; colorHex?: string }[];
  isActive: boolean;
  discount?: number;
  detailDescription?: string;
  benefits?: string[];
  /** Usos comunes (acordeón "Usos comunes" de la ficha). */
  commonUses?: string[];
  /** IDs de productos "Combina con" (Pairs With). */
  pairsWith?: number[];
  /** Tallas disponibles (selector "Talla" de la ficha). */
  sizes?: string[];
  /** Posts de Instagram de la ficha: enlace + imagen de la card. */
  instagramPosts?: { url: string; image: string }[];
  stock?: number;
  price?: number;
  categoryId?: number;
  marcaId?: number;
  /** Marca: la ficha la muestra sobre el título y enlaza a su catálogo. */
  marca?: { id: number; name: string; slug?: string };
  createdAt: string;
}

export interface Banner {
  id: string | number;
  title: string;
  subtitle?: string;
  image?: string;
  imageUrl?: string;
  /** Arte vertical subido para teléfono. Si falta se usa `imageUrl`. */
  mobileImageUrl?: string;
  link?: string;
  buttonText?: string;
  type?: 'hero' | 'category' | 'brand' | 'navbar' | 'catalog_perfumes';
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
  variationName?: string;
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
  categoryId?: number;
  marcaId?: number;
  hasDiscount?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'createdAt' | 'salesCount';
  sortOrder?: 'ASC' | 'DESC';
}
