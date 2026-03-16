// Re-exporta tipos relevantes para la feature landing
export type { Banner, Product } from '@/app/types/global.types';

// Tipos propios de la feature landing
export interface NavLink {
  href: string;
  label: string;
  exact: boolean;
  dropdown: boolean;
}

export interface FooterLink {
  href: string;
  label: string;
}

export interface SocialIcon {
  src: string;
  alt: string;
  href: string;
}

export interface PaymentIcon {
  src: string;
  alt: string;
}

export interface BlogPost {
  id: number;
  image: string;
  text: string;
}

export interface FeatureItem {
  Icon: any;
  label: string;
}

export interface Testimonial {
  badge: string;
  name: string;
  text: string;
  rating: number;
  avatar: string;
  productImage: string;
}
