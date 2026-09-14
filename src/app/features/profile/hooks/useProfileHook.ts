import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/app/store/auth/authStore';
import type { ProfileTabId } from '../types';

const VALID_TABS: ProfileTabId[] = ['perfil', 'direcciones', 'pedidos'];

function tabFromHash(): ProfileTabId {
  if (typeof window === 'undefined') return 'perfil';
  const hash = window.location.hash.replace('#', '') as ProfileTabId;
  return VALID_TABS.includes(hash) ? hash : 'perfil';
}

export function useProfileHook() {
  // La pestaña vive en el hash (#perfil / #direcciones / #pedidos): los enlaces
  // del sidebar navegan de forma nativa, el botón atrás del navegador funciona
  // y cada sección tiene URL propia.
  // OJO: el estado inicial SIEMPRE es 'perfil' (igual que el SSR); el hash se
  // aplica tras montar, si no la hidratación rompe al entrar con #direcciones.
  const [activeTab, setActiveTabState] = useState<ProfileTabId>('perfil');
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated]);

  // Aplicar el hash inicial (tras montar) y escuchar cambios.
  useEffect(() => {
    setActiveTabState(tabFromHash());
    const onHashChange = () => setActiveTabState(tabFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const setActiveTab = useCallback((tab: ProfileTabId) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined' && window.location.hash !== `#${tab}`) {
      window.location.hash = tab;
    }
  }, []);

  return { activeTab, setActiveTab, user };
}
