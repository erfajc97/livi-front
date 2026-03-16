import { useState, useEffect } from 'react';
import { useAuthStore } from '@/app/store/auth/authStore';
import type { ProfileTabId } from '../types';

export function useProfileHook() {
  const [activeTab, setActiveTab] = useState<ProfileTabId>('seguimiento');
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated]);

  return { activeTab, setActiveTab, user };
}
