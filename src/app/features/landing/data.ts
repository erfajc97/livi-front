import type { Banner, Product } from '@/app/types/global.types';

// Imágenes de la marca / placeholders editoriales
const IMG = {
  p1:  '/home-5.png',
  p2:  '/home-6.png',
  p3:  '/yara.png',
  p4:  '/img-9.png',
  p5:  '/home-4.png',
  p6:  '/home-3.png',
  p7:  '/home-2.png',
  p8:  '/home-1.png',
  b1:  '/banner-home.png',
  b2:  '/banner-home.png',
  b3:  '/banner-home.png',
};

export const MOCK_BANNERS: Banner[] = [
  {
    id: 'b1',
    title: 'For Modern Parenthood',
    subtitle: 'Pañaleras de cuero que no parecen de bebé — Envíos a todo Ecuador',
    image: IMG.b1,
    link: '/catalogo',
    isActive: true,
    order: 1,
  },
  {
    id: 'b2',
    title: 'Cuero premium',
    subtitle: 'Piezas pensadas para tu vida, no solo para la etapa',
    image: IMG.b2,
    link: '/catalogo',
    isActive: true,
    order: 2,
  },
  {
    id: 'b3',
    title: 'Nueva Colección',
    subtitle: 'Conoce lo último del taller',
    image: IMG.b3,
    link: '/catalogo',
    isActive: true,
    order: 3,
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Noé Leather Backpack',
    description: 'Mochila de cuero de grano completo con compartimentos inteligentes y cambiador acolchado incluido.',
    image: IMG.p1,
    images: [{ id: 'p1-i1', url: IMG.p1 }, { id: 'p1-i2', url: IMG.p2 }],
    variants: [
      { id: 'p1-v1', name: 'Negro', price: 129, availableQuantity: 10 },
      { id: 'p1-v2', name: 'Espresso', price: 129, availableQuantity: 10 },
    ],
    isActive: true,
    createdAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'p2',
    name: 'Olivia Maxi Tote',
    description: 'Pañalera tote de cuero que no parece de bebé: interior amplio con organizadores y correa ajustable.',
    image: IMG.p3,
    images: [{ id: 'p2-i1', url: IMG.p3 }],
    variants: [
      { id: 'p2-v1', name: 'Beige', price: 119, availableQuantity: 10 },
      { id: 'p2-v2', name: 'Espresso', price: 119, availableQuantity: 10 },
      { id: 'p2-v3', name: 'Negro', price: 119, availableQuantity: 10 },
    ],
    isActive: true,
    createdAt: '2026-02-05T00:00:00Z',
  },
  {
    id: 'p3',
    name: 'Cambiador de cuero',
    description: 'Cambiador portátil acolchado, forro lavable y cierre magnético.',
    image: IMG.p5,
    images: [{ id: 'p3-i1', url: IMG.p5 }],
    variants: [
      { id: 'p3-v1', name: 'Espresso', price: 39, availableQuantity: 15 },
    ],
    isActive: true,
    createdAt: '2026-02-10T00:00:00Z',
  },
  {
    id: 'p4',
    name: 'Organizador interior',
    description: 'Inserto organizador con bolsillos térmicos para biberones.',
    image: IMG.p6,
    images: [{ id: 'p4-i1', url: IMG.p6 }],
    variants: [
      { id: 'p4-v1', name: 'Beige', price: 29, availableQuantity: 20 },
    ],
    isActive: true,
    createdAt: '2026-02-12T00:00:00Z',
  },
];

// Últimos ingresos (más recientes)
export const MOCK_NEW_ARRIVALS = MOCK_PRODUCTS.slice(-4).reverse();

// Destacados
export const MOCK_FEATURED = MOCK_PRODUCTS;

// === CATEGORÍAS DE LA TIENDA (menú) ===
export const SHOP_CATEGORIES = [
  { label: 'TIENDA', marcas: ['Todo', 'Pañaleras', 'Mochilas', 'Accesorios', 'Regalo'] },
];

// === BLOG SECTION ===
export const BLOG_POSTS = [
  {
    id: 1,
    image: '/home-5.png',
    text: 'Cómo elegir una pañalera que combine con tu estilo: materiales, tamaños y compartimentos que sí importan.',
  },
  {
    id: 2,
    image: '/home-6.png',
    text: 'Del taller a tu casa: así curtimos y cosemos cada pieza de cuero LIVI.',
  },
  {
    id: 3,
    image: '/home-3.png',
    text: 'Qué llevar en la pañalera: la checklist real de una salida con bebé.',
  },
];

// === TESTIMONIALS SECTION ===
export const TESTIMONIALS = [
  {
    badge: 'COMPRADORA FRECUENTE',
    name: 'ANDREA VILLACÍS',
    text: 'La calidad del cuero es increíble. Nadie imagina que es una pañalera: la uso para trabajar y para salir con mi bebé.',
    rating: 5.0,
    avatar: '/avatar.png',
    productImage: '/home-1.png',
  },
  {
    badge: 'CLIENTE NUEVO',
    name: 'MARIANO TORRES',
    text: 'Compré la mochila Noé y superó lo que esperaba. Los compartimentos están pensados de verdad.',
    rating: 5.0,
    avatar: '/avatar.png',
    productImage: '/home-3.png',
  },
  {
    badge: 'CLIENTE FRECUENTE',
    name: 'CARLOS MENDOZA',
    text: 'El empaque, el acabado, la entrega: todo se siente premium. Repetiría sin dudarlo.',
    rating: 5.0,
    avatar: '/avatar.png',
    productImage: '/home-4.png',
  },
] as const;

// === FOOTER LINKS ===
export const FOOTER_SOCIAL_ICONS = [
  { alt: 'Facebook', href: '#' },
  { alt: 'Instagram', href: '#' },
  { alt: 'TikTok', href: '#' },
];

export const FOOTER_LINKS_COL1 = [
  { href: '/catalogo',  label: 'Tienda' },
  { href: '/nuestra-historia',  label: 'Nuestra Historia' },
  { href: '/el-taller',  label: 'El Taller' },
  { href: '/contacto',  label: 'Contacto' },
  { href: '/faq',       label: 'Preguntas frecuentes' },
  { href: '/rastrear',  label: 'Rastrear pedido' },
];
