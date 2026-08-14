'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { UserMovieCounts } from '@cinemo/shared';
import { useAuthStore } from '@/lib/auth-store';
import { GuestFigure } from '@/components/lobby/GuestFigure';
import { getUserMovieCountsRequest } from '@/lib/user-movie-api';
import '../styles/room.css';
import '../styles/lobby.css';

export default function MyRoomPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const clearSession = useAuthStore((s) => s.clearSession);
  const [counts, setCounts] = useState<UserMovieCounts | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    async function loadCounts() {
      try {
        const res = await getUserMovieCountsRequest(accessToken!);
        if (!cancelled) setCounts(res);
      } catch {
        if (!cancelled) setCounts(null);
      }
    }
    void loadCounts();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  if (!user) {
    return (
      <main className="room">
        <p className="room-copy">내 방은 입장 후 이용할 수 있어요.</p>
        <div className="room-actions">
          <Link href="/login" className="lobby-btn lobby-btn--primary">
            입장하기
          </Link>
          <Link href="/" className="lobby-btn">
            로비로
          </Link>
        </div>
      </main>
    );
  }

  function logout() {
    clearSession();
    router.push('/');
  }

  return (
    <main className="room">
      <header className="room-header">
        <p className="room-kicker">MY ROOM</p>
        <h1 className="room-title">{user.nickname}의 방</h1>
      </header>

      <div className="room-stage">
        <div className="room-me">
          <GuestFigure />
          <p className="room-me-name">{user.nickname}</p>
        </div>

        <nav className="room-doors" aria-label="영화 선반">
          <Link href="/room/wish" className="room-door">
            <span className="room-door-label">찜 선반</span>
            <span className="room-door-count">{counts?.wish ?? '—'}</span>
          </Link>
          <Link href="/room/watched" className="room-door">
            <span className="room-door-label">봤어요 선반</span>
            <span className="room-door-count">{counts?.watched ?? '—'}</span>
          </Link>
        </nav>

        <nav className="room-zones" aria-label="내 방 구역">
          <button type="button" className="room-zone" disabled title="준비 중">
            프로필
          </button>
          <button type="button" className="room-zone" disabled title="준비 중">
            옷방
          </button>
          <button type="button" className="room-zone" disabled title="준비 중">
            고객센터
          </button>
        </nav>
      </div>

      <div className="room-actions">
        <Link href="/" className="lobby-btn lobby-btn--primary">
          로비로
        </Link>
        <button type="button" className="lobby-btn" onClick={logout}>
          로그아웃
        </button>
      </div>
    </main>
  );
}
