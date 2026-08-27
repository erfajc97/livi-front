export interface FaqItem {
  question: string;
  answer: string;
}

/** Preguntas de decants — las mismas de /decants y /faq. */
export const DECANT_FAQ: FaqItem[] = [
  {
    question: '¿El decant es el mismo perfume que el frasco?',
    answer:
      'Sí. Sale de la botella original de la casa. Lo único que cambia es el envase: un atomizador de 3, 5 o 10 ml.',
  },
  {
    question: '¿Cuántos usos trae un decant de 3 ml?',
    answer:
      'Unas 33 pulsaciones. Con cuatro al día, alrededor de una semana: suficiente para saber si vale el frasco.',
  },
  {
    question: '¿Puedo comprar el frasco después?',
    answer:
      'Sí, y es la idea. Cada ficha ofrece los decants y el frasco sellado en la misma página.',
  },
  {
    question: '¿Y si el perfume que quiero no está en decant?',
    answer:
      'Lo traemos por encargo en frasco, en 13 a 17 días. Si nos lo piden lo suficiente, abrimos una botella para decants.',
  },
  {
    question: '¿Cómo sé que es original?',
    answer:
      'Cada frasco se verifica antes de abrirlo. Los decants se extraen de esa misma botella, con instrumento propio por fragancia.',
  },
];

export const SITE_FAQ: FaqItem[] = [
  ...DECANT_FAQ,
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
    question: '¿Cuánto tarda un perfume bajo pedido?',
    answer:
      'Entre 13 y 17 días después de confirmar el pago. Lo importamos exclusivamente para ti y lo verificamos antes de enviártelo.',
  },
  {
    question: '¿Puedo devolver un decant o un sellado?',
    answer:
      'Los sellados sin abrir se rigen por los Términos. Un decant, al estar abierto y ser de uso personal, no se cambia salvo defecto de fabricación. Escríbenos por WhatsApp y lo revisamos.',
  },
];
