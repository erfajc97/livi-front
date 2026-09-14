export interface FaqItem {
  question: string;
  answer: string;
}

/** Preguntas de producto — las mismas de /faq. */
export const PRODUCT_FAQ: FaqItem[] = [
  {
    question: '¿De qué material son las pañaleras y mochilas LIVI?',
    answer:
      'Cuero vacuno genuino premium, trabajado a mano por artesanos ecuatorianos. Cada pieza incluye dust bag y caja de regalo LIVI.',
  },
  {
    question: '¿Qué colores están disponibles?',
    answer:
      'Cada producto muestra sus colores disponibles en la ficha (Negro, Espresso, Beige…). El stock es por producto y compartido entre colores.',
  },
  {
    question: '¿Caben laptops o tablets?',
    answer:
      'Sí. Nuestras pañaleras y mochilas tienen compartimento acolchado para laptop o tablet de hasta 15 pulgadas, además de bolsillos organizadores.',
  },
  {
    question: '¿Cómo cuido el cuero?',
    answer:
      'Límpialo con un paño suave apenas húmedo y guárdalo en su dust bag cuando no lo uses. Evita la exposición prolongada al sol y a la lluvia.',
  },
  {
    question: '¿Cómo sé que la pieza es auténtica?',
    answer:
      'Cada pieza pasa por control de calidad en nuestro taller antes de despacharse. Comprando en livi.ec tienes la garantía completa de la marca.',
  },
];

export const SITE_FAQ: FaqItem[] = [
  ...PRODUCT_FAQ,
  {
    question: '¿Hacen envíos a todo Ecuador?',
    answer:
      'Sí. Servientrega a Guayaquil cuesta $3 y al resto de provincias $7. El plazo habitual es 24 a 72 horas hábiles. También puedes retirar en tienda sin costo de envío.',
  },
  {
    question: '¿Hasta qué hora despachan el mismo día?',
    answer:
      'Los pedidos confirmados hasta las 15:00 (hora de Ecuador) salen el mismo día. Después de esa hora, el despacho queda para el día siguiente.',
  },
  {
    question: '¿Tengo que crear una cuenta para comprar?',
    answer:
      'No. Puedes pagar como invitado. Si te registras, ves el historial de pedidos en Mi cuenta.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer:
      'Transferencia bancaria, Payphone y tarjetas. En Payphone se aplica un recargo del 6% que verás desglosado en el checkout antes de pagar.',
  },
  {
    question: '¿Puedo devolver un producto?',
    answer:
      'Los productos sin uso, con sus etiquetas y empaque original, se rigen por los Términos. Escríbenos por WhatsApp y lo revisamos caso por caso.',
  },
];
