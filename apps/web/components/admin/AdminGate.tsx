'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';

export function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!accessToken) {
      router.replace('/login?next=/admin');
      return;
    }
    if (!user) return;
    if (user.role !== 'admin') router.replace('/');
  }, [ready, accessToken, user, router]);

  if (!ready || !accessToken || !user) {
    return <p className="admin-status">확인 중…</p>;
  }

  if (user.role !== 'admin') return null;

  return children;
}
