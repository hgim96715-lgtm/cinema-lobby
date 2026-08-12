'use client';

import { useEffect } from 'react';
import { meRequest } from '@/lib/auth-api';
import { useAuthStore } from '@/lib/auth-store';

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((state) => state.hydrate);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!accessToken) return;
    const token = accessToken;
    let cancelled = false;

    async function fetchUser() {
      try {
        const me = await meRequest(token);
        if (cancelled) return;
        setSession(token, me);
      } catch {
        if (!cancelled) clearSession();
      }
    }

    fetchUser();
    return () => {
      cancelled = true;
    };
  }, [accessToken, clearSession, setSession]);

  return children;
}
