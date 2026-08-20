'use client';

import { useCallback, useEffect, useState } from 'react';
import type { WeeklyRevealWinner } from '@cinemo/shared';
import { getWeeklyRevealRequest } from '@/lib/lobby-board-api';
import { kstDateKey } from '@/lib/date-kst';

function isKstMonday(now = new Date()) {
  return (
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Seoul',
      weekday: 'short',
    }).format(now) === 'Mon'
  );
}

function weeklyRevealSeenKey(userId: string) {
  return `cinemo:weekly-reveal:${userId}:${kstDateKey()}`;
}

export function useWeeklyReveal(userId: string | undefined) {
  const [winner, setWinner] = useState<WeeklyRevealWinner | null>(null);

  useEffect(() => {
    if (!userId || !isKstMonday()) return;

    const seenKey = weeklyRevealSeenKey(userId);
    if (localStorage.getItem(seenKey)) return;

    let cancelled = false;

    async function fetchWinner() {
      try {
        const data = await getWeeklyRevealRequest();
        if (cancelled || !data) return;
        setWinner(data);
      } catch {
        // API 실패 → 모달만 안 띄움
      }
    }
    void fetchWinner();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const dismiss = useCallback(() => {
    if (!userId) return;
    localStorage.setItem(weeklyRevealSeenKey(userId), '1');
    setWinner(null);
  }, [userId]);

  return { winner, dismiss };
}
