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
    author: 'María Fernanda C.',
    title: 'La mochila que necesitaba',
    text: 'El cuero se siente de verdad premium y tiene espacio para todo lo del bebé y lo mío. La uso todos los días.',
  },
  {
    id: '2',
    rating: 5,
    date: '06/30/2026',
    author: 'Kelly Gutierrez',
    title: 'Hermosa y práctica',
    text: 'Compré la Olivia Maxi Tote y superó mis expectativas. Los compartimentos internos son súper pensados.',
  },
  {
    id: '3',
    rating: 4,
    date: '05/15/2026',
    author: 'Juan Perez',
    title: 'Muy buena calidad',
    text: 'Excelente acabado, materiales duraderos y a buen precio. La recomiendo totalmente para el día a día.',
  },
];
