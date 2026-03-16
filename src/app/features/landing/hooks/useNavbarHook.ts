import { useEffect, useRef, useState } from 'react';
import { useCartStore } from '@/app/store/cart/cartStore';
import { useAuthStore } from '@/app/store/auth/authStore';

export const NAV_LINKS = [
  { href: '/',                   label: 'Inicio',             exact: true,  dropdown: false },
  { href: '/catalogo/perfumes',  label: 'Perfumes',           exact: true,  dropdown: false },
  { href: '/catalogo/combos',    label: 'Combos',             exact: true,  dropdown: false },
  { href: '/bajo-pedido',        label: 'Bajo Pedido',        exact: true,  dropdown: true  },
  { href: '/blog',               label: 'Blog',               exact: true,  dropdown: false },
  { href: '/rastrear',           label: 'Rastrear tú pedido', exact: true,  dropdown: false },
];

export function isLinkActive(href: string, currentUrl: string, exact: boolean) {
  // Links con hash nunca están activos en la navbar
  if (href.startsWith('#')) return false;

  // Extraer solo pathname (sin query strings)
  const currentPathname = currentUrl.split('?')[0];

  if (exact) {
    return currentPathname === href;
  }

  // Para comparación no exacta, verificar si comienza con href
  return currentPathname.startsWith(href);
}

export function useNavbarHook() {
  const itemCount = useCartStore((s) => s.itemCount());
  const setDrawerOpen = useCartStore((s) => s.setDrawerOpen);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [authOpen, setAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [perfumesOpen, setPerfumesOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(2);
  const [pathname, setPathname] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Pathname tracking + scroll detection
  useEffect(() => {
    const updatePathname = () => {
      const url = window.location.pathname + window.location.search;
      setPathname(url);
    };

    updatePathname();

    window.addEventListener('popstate', updatePathname);
    window.addEventListener('hashchange', updatePathname);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('popstate', updatePathname);
      window.removeEventListener('hashchange', updatePathname);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    if (!perfumesOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPerfumesOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPerfumesOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [perfumesOpen]);

  return {
    itemCount,
    setDrawerOpen,
    isAuthenticated,
    authOpen,
    setAuthOpen,
    mobileOpen,
    setMobileOpen,
    perfumesOpen,
    setPerfumesOpen,
    activeCategory,
    setActiveCategory,
    dropdownRef,
    pathname,
    isScrolled,
  };
}
