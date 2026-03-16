export const PRODUCT_TYPE_LABELS: Record<string, string> = {
  SELLADO:   'Sellado',
  DECANT:    'Decant',
  NONDECANT: 'Nondecant',
};

export interface Review {
  id: string;
  rating: number;
  date: string;
  author: string;
  title: string;
  text: string;
}

export const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    rating: 5,
    date: '06/30/2026',
    author: 'Manuel Velázquez',
    title: 'Excelencia de perfume',
    text: 'Me parece un producto super delicioso gracias a este perfume soy un fuckboy, tengo todo lo que siempre desee',
  },
  {
    id: '2',
    rating: 5,
    date: '06/30/2026',
    author: 'Kelly Gutierrez',
    title: 'Me encanta, para mi novio ideal',
    text: 'Me parece un producto super delicioso gracias a este perfume soy un fuckboy, tengo todo lo que siempre desee',
  },
  {
    id: '3',
    rating: 4,
    date: '05/15/2026',
    author: 'Juan Perez',
    title: 'Muy buena fijación',
    text: 'Excelente aroma, duradero y a buen precio. Lo recomiendo totalmente para salidas nocturnas.',
  },
];
