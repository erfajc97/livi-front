import type { Banner, Product } from '@/app/types/global.types';

// Imágenes Unsplash — fragancias y lujo dark
const IMG = {
  p1:  '/home-5.png',
  p2:  '/home-6.png',
  p3:  '/yara.png',
  p4:  '/img-9.png',
  p5:  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=480&h=580&fit=crop&q=80',
  p6:  'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=480&h=580&fit=crop&q=80',
  p7:  'https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=480&h=580&fit=crop&q=80',
  p8:  'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=480&h=580&fit=crop&q=80',
  p9:  '/home-4.png',
  p10: '/home-3.png',
  p11: '/home-2.png',
  p12: '/home-1.png',
  b1:  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&h=560&fit=crop&q=80',
  b2:  'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1400&h=560&fit=crop&q=80',
  b3:  'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1400&h=560&fit=crop&q=80',
};

export const MOCK_BANNERS: Banner[] = [
  {
    id: 'b1',
    title: 'Única Experiencia',
    subtitle: 'Decants & Sellados — Envíos a todo Ecuador',
    image: IMG.b1,
    link: '/catalogo',
    isActive: true,
    order: 1,
  },
  {
    id: 'b2',
    title: 'Fragancias Exclusivas',
    subtitle: 'Las mejores marcas, en el tamaño que quieres',
    image: IMG.b2,
    link: '/catalogo?type=SELLADO',
    isActive: true,
    order: 2,
  },
  {
    id: 'b3',
    title: 'Nueva Colección',
    subtitle: 'Últimos ingresos disponibles ahora',
    image: IMG.b3,
    link: '/catalogo?type=NONDECANT',
    isActive: true,
    order: 3,
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Le Male',
    brand: 'Jean Paul Gaultier',
    description: 'Icónica fragancia masculina con notas de lavanda, menta y vainilla. Un clásico atemporal.',
    type: 'SELLADO',
    image: IMG.p1,
    images: [IMG.p1, IMG.p2],
    variants: [
      { id: 'p1-v1', ml: 125, price: 89, stock: 5 },
      { id: 'p1-v2', ml: 75,  price: 65, stock: 3 },
    ],
    isActive: true,
    createdAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'p2',
    name: 'Stronger With You',
    brand: 'Emporio Armani',
    description: 'Fragancia cálida y sensual con notas de castaña, salvia y vainilla.',
    type: 'SELLADO',
    image: IMG.p2,
    images: [IMG.p2],
    variants: [
      { id: 'p2-v1', ml: 100, price: 95, stock: 4 },
      { id: 'p2-v2', ml: 50,  price: 65, stock: 8 },
    ],
    isActive: true,
    createdAt: '2026-02-05T00:00:00Z',
  },
  {
    id: 'p3',
    name: 'Sauvage EDP',
    brand: 'Dior',
    description: 'Poderoso y noble, Sauvage evoca cielos abiertos y naturaleza salvaje.',
    type: 'SELLADO',
    image: IMG.p3,
    images: [IMG.p3],
    variants: [
      { id: 'p3-v1', ml: 100, price: 145, stock: 2 },
      { id: 'p3-v2', ml: 60,  price: 98,  stock: 6 },
    ],
    isActive: true,
    createdAt: '2026-02-10T00:00:00Z',
  },
  {
    id: 'p4',
    name: 'Bleu de Chanel EDP',
    brand: 'Chanel',
    description: 'La expresión de una libertad que desafía las convenciones. Madera cedro y sándalo.',
    type: 'DECANT',
    image: IMG.p4,
    images: [IMG.p4],
    variants: [
      { id: 'p4-v1', ml: 10, price: 22, stock: 15 },
      { id: 'p4-v2', ml: 20, price: 38, stock: 10 },
      { id: 'p4-v3', ml: 30, price: 52, stock: 7  },
    ],
    isActive: true,
    createdAt: '2026-02-12T00:00:00Z',
  },
  {
    id: 'p5',
    name: 'Spicebomb Extreme',
    brand: 'Viktor & Rolf',
    description: 'Una bomba de especias con vainilla y tabaco. Proyección excepcional.',
    type: 'DECANT',
    image: IMG.p5,
    images: [IMG.p5],
    variants: [
      { id: 'p5-v1', ml: 5,  price: 12, stock: 20 },
      { id: 'p5-v2', ml: 10, price: 21, stock: 14 },
      { id: 'p5-v3', ml: 20, price: 38, stock: 8  },
    ],
    isActive: true,
    createdAt: '2026-02-15T00:00:00Z',
  },
  {
    id: 'p6',
    name: 'Noir EDP',
    brand: 'Tom Ford',
    description: 'Oriental sofisticado con bergamota, cardamomo y ámbar gris. Lujo absoluto.',
    type: 'DECANT',
    image: IMG.p6,
    images: [IMG.p6],
    variants: [
      { id: 'p6-v1', ml: 5,  price: 18, stock: 12 },
      { id: 'p6-v2', ml: 10, price: 32, stock: 7  },
    ],
    isActive: true,
    createdAt: '2026-02-18T00:00:00Z',
  },
  {
    id: 'p7',
    name: 'Perfume Árabe Lattafa',
    brand: 'Lattafa',
    description: 'Fragancia oriental de alta proyección con notas de oud, rosa y almizcle.',
    type: 'NONDECANT',
    image: IMG.p7,
    images: [IMG.p7],
    variants: [
      { id: 'p7-v1', ml: 100, price: 42, stock: 9 },
    ],
    isActive: true,
    createdAt: '2026-02-20T00:00:00Z',
  },
  {
    id: 'p8',
    name: '9pm Rebel',
    brand: 'Afnan',
    description: 'Fragancia nocturna intensa. Madera oscura, vainilla y almizcle blanco.',
    type: 'NONDECANT',
    image: IMG.p8,
    images: [IMG.p8],
    variants: [
      { id: 'p8-v1', ml: 100, price: 38, stock: 11 },
      { id: 'p8-v2', ml: 50,  price: 24, stock: 6  },
    ],
    isActive: true,
    createdAt: '2026-02-22T00:00:00Z',
  },
  {
    id: 'p9',
    name: 'Perfume Valentino',
    brand: 'Giorgio Armani',
    description: 'La profundidad del océano en una fragancia. Acuático, marino y mineral.',
    type: 'SELLADO',
    image: IMG.p9,
    images: [IMG.p9],
    variants: [
      { id: 'p9-v1', ml: 75, price: 98, stock: 4 },
    ],
    isActive: true,
    createdAt: '2026-02-25T00:00:00Z',
  },
  {
    id: 'p10',
    name: 'Bourbon EDP',
    brand: 'Valentino',
    description: 'El hombre Valentino. Bergamota italiana, iris y cedro de Virginia.',
    type: 'DECANT',
    image: IMG.p10,
    images: [IMG.p10],
    variants: [
      { id: 'p10-v1', ml: 5,  price: 14, stock: 18 },
      { id: 'p10-v2', ml: 10, price: 24, stock: 10 },
      { id: 'p10-v3', ml: 30, price: 58, stock: 3  },
    ],
    isActive: true,
    createdAt: '2026-02-26T00:00:00Z',
  },
  {
    id: 'p11',
    name: 'Lataffa H&G',
    brand: 'Yves Saint Laurent',
    description: 'Seductor y sensual. Cardamomo, madera cedro y vetiver. Perfecto para la noche.',
    type: 'DECANT',
    image: IMG.p11,
    images: [IMG.p11],
    variants: [
      { id: 'p11-v1', ml: 10, price: 19, stock: 22 },
      { id: 'p11-v2', ml: 20, price: 34, stock: 15 },
    ],
    isActive: true,
    createdAt: '2026-02-27T00:00:00Z',
  },
  {
    id: 'p12',
    name: 'Perfume Arabe',
    brand: 'Fragrance World',
    description: 'Fragancia oriental amaderada con notas de bourbon, cuero y especias.',
    type: 'NONDECANT',
    image: IMG.p12,
    images: [IMG.p12],
    variants: [
      { id: 'p12-v1', ml: 100, price: 35, stock: 14 },
    ],
    isActive: true,
    createdAt: '2026-02-28T00:00:00Z',
  },
];

// Últimos ingresos (más recientes)
export const MOCK_NEW_ARRIVALS = MOCK_PRODUCTS.slice(-4).reverse();

// Más vendidos (selección de 4 destacados)
export const MOCK_FEATURED = [
  MOCK_PRODUCTS[0],
  MOCK_PRODUCTS[2],
  MOCK_PRODUCTS[4],
  MOCK_PRODUCTS[6],
  MOCK_PRODUCTS[8],
  MOCK_PRODUCTS[9],
  MOCK_PRODUCTS[10],
  MOCK_PRODUCTS[11],
];

// === PERFUME CATEGORIES (Bajo Pedido dropdown) ===
export const PERFUME_CATEGORIES = [
  { label: 'NICHO', subcategories: ['Tom Ford', 'Creed', 'Parfums de Marly', 'Xerjoff', 'Initio', 'Nishane', 'Ver todos'] },
  { label: 'DISEÑADOR', subcategories: ['Dior', 'Chanel', 'Versace', 'Prada', 'YSL', 'Dolce & Gabbana', 'Ver todos'] },
  { label: 'ÁRABES', subcategories: ['Lattafa', 'Asad', 'Armaf', 'Shaghaf', 'Khama', 'Yara Moi', 'Azrap', 'Qaed', 'Ver todos'] },
  { label: 'GENERO', subcategories: ['Masculino', 'Femenino', 'Unisex'] },
  { label: 'HORA DEL DIA', subcategories: ['Día', 'Noche', 'Versátil'] },
];

// === BLOG SECTION ===
export const BLOG_POSTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=380&fit=crop&q=80',
    text: 'Excepturi praesentium beatae ut nemo commodi. Nemo omnis repudiandae culpa quaerat soluta dolorem aspernatur et. Repellendus sint reprehenderit dignissimos consequatur maiores.',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=380&fit=crop&q=80',
    text: 'Excepturi praesentium beatae ut nemo commodi. Nemo omnis repudiandae culpa quaerat soluta dolorem aspernatur et. Repellendus sint reprehenderit dignissimos consequatur maiores.',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=380&fit=crop&q=80',
    text: 'Excepturi praesentium beatae ut nemo commodi. Nemo omnis repudiandae culpa quaerat soluta dolorem aspernatur et. Repellendus sint reprehenderit dignissimos consequatur maiores.',
  },
];

// === TESTIMONIALS SECTION ===
export const TESTIMONIALS = [
  {
    badge: 'COMPRADOR FRECUENTE',
    name: 'MARIANO TORRES',
    text: 'Excepturi praesentium beatae ut nemo commodi. Nemo omnis repudiandae culpa quaerat soluta dolorem aspernatur et. Repellendus sint reprehenderit dignissimos consequatur maiores.',
    rating: 5.0,
    avatar: '/avatar.png',
    productImage: '/home-3.png',
  },
  {
    badge: 'CLIENTE NUEVO',
    name: 'ANDREA VILLACÍS',
    text: 'Increíble calidad en cada decant. Los aromas son exactamente como los originales y el servicio fue rápido y profesional. Definitivamente volvería a comprar.',
    rating: 5.0,
    avatar: '/avatar.png',
    productImage: '/home-1.png',
  },
  {
    badge: 'CLIENTE FRECUENTE',
    name: 'CARLOS MENDOZA',
    text: 'La variedad de fragancias es impresionante. Pude probar varios decants antes de decidirme. El packaging es excelente y la entrega fue en tiempo récord.',
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

export const FOOTER_PAYMENT_ICONS = [
  { alt: 'PayPhone' },
  { alt: 'Visa' },
  { alt: 'Diners Club' },
  { alt: 'American Express' },
  { alt: 'Discover' },
];

export const FOOTER_LINKS_COL1 = [
  { href: '/catalogo',              label: 'Perfumes' },
  { href: '/catalogo?type=SELLADO', label: 'Sellados' },
  { href: '/catalogo?type=DECANT',  label: 'Decants' },
  { href: '/catalogo?type=NONDECANT', label: 'Nondecants' },
  { href: '/catalogo',              label: 'Combos' },
];

export const FOOTER_LINKS_COL2 = [
  { href: '#', label: 'Acerca de' },
  { href: '#', label: 'Sucursales' },
  { href: '#', label: 'Blog' },
  { href: '#', label: 'Bajo pedido' },
  { href: '#', label: 'FAQ' },
];
