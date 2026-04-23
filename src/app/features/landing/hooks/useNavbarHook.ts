import { useEffect, useRef, useState } from 'react';
import { useCartStore } from '@/app/store/cart/cartStore';
import { useAuthStore } from '@/app/store/auth/authStore';

export const NAV_LINKS = [
  { href: '/',                   label: 'Inicio',             exact: true,  dropdown: false,      dropdownId: '' },
  { href: '/catalogo/perfumes',  label: 'Perfumes',           exact: true,  dropdown: true,       dropdownId: 'perfumes' },
  { href: '/catalogo/combos',    label: 'Combos',             exact: true,  dropdown: false,      dropdownId: '' },
  { href: '/bajo-pedido',        label: 'Bajo Pedido',        exact: true,  dropdown: true,       dropdownId: 'bajoPedido' },
  { href: '/blog',               label: 'Blog',               exact: true,  dropdown: false,      dropdownId: '' },
  { href: '/rastrear',           label: 'Rastrear tú pedido', exact: true,  dropdown: false,      dropdownId: '' },
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [pathname, setPathname] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    if (!openDropdown) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenDropdown(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [openDropdown]);

  const handleDropdownEnter = (dropdownId: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setOpenDropdown(dropdownId);
    setActiveCategory(0);
  };

  const handleDropdownLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  const handleDropdownContentEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  };

  const handleDropdownContentLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  return {
    itemCount,
    setDrawerOpen,
    isAuthenticated,
    authOpen,
    setAuthOpen,
    mobileOpen,
    setMobileOpen,
    openDropdown,
    setOpenDropdown,
    activeCategory,
    setActiveCategory,
    dropdownRef,
    pathname,
    isScrolled,
    handleDropdownEnter,
    handleDropdownLeave,
    handleDropdownContentEnter,
    handleDropdownContentLeave,
  };
}
