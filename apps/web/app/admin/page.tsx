'use client';

import { useEffect, useState } from 'react';
import type { AdminOverview } from '@cinemo/shared';
import { AdminWeekPeople, AdminWeekTickets } from '@/components/admin/AdminCharts';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { getAdminOverviewRequest } from '@/lib/admin-api';
import { useAuthStore } from '@/lib/auth-store';

export default function AdminPage() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { analytics, error: chartError, loading: chartLoading } =
    useAdminAnalytics();

  useEffect(() => {
    if (!accessToken) return;
    const token = accessToken;
    let cancelled = false;
    async function load() {
      try {
        const data = await getAdminOverviewRequest(token);
        if (!cancelled) setOverview(data);
      } catch (error) {
        if (!cancelled)
          setError(
            error instanceof Error
              ? error.message
              : '현황을 불러오는데 실패했습니다.',
          );
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  return (
    <main className="admin-main">
      <h1 className="admin-title">오늘</h1>
      <p className="admin-sub">로비 = 로그인 손님 입장 하루 1회 · 구경 = 비로그인 후기방</p>
      {error ? <p className="admin-error">{error}</p> : null}
      {!overview && !error ? (
        <p className="admin-status">불러오는 중…</p>
      ) : null}
      {overview ? (
        <>
          <ul className="admin-cards">
            <li>
              전체
              <strong>{overview.userCount}</strong>
            </li>
            <li>
              가입
              <strong>{overview.todaySignupCount}</strong>
            </li>
            <li>
              로비
              <strong>{overview.todayVisitCount}</strong>
            </li>
            <li>
              구경
              <strong>{overview.todayAnonReviewCount}</strong>
            </li>
            <li>
              후기
              <strong>{overview.reviewCount}</strong>
            </li>
            <li>
              티켓
              <strong>{overview.todayTicketIssuedCount}</strong>
            </li>
            <li>
              카페
              <strong>{overview.cafeSeatedCount}</strong>
            </li>
          </ul>
          <h2 className="admin-section">이번주</h2>
          <p className="admin-sub admin-sub--tight">월–오늘</p>
          <ul className="admin-cards">
            <li>
              가입
              <strong>{overview.weekSignupCount}</strong>
            </li>
            <li>
              로비
              <strong>{overview.weekVisitCount}</strong>
            </li>
            <li>
              구경
              <strong>{overview.weekAnonReviewCount}</strong>
            </li>
          </ul>
        </>
      ) : null}
      <h2 className="admin-section">최근 7일</h2>
      <p className="admin-sub admin-sub--tight">날짜별 인원 · 선 / 비중</p>
      {chartError ? <p className="admin-error">{chartError}</p> : null}
      {chartLoading ? <p className="admin-status">불러오는 중…</p> : null}
      {analytics ? <AdminWeekPeople analytics={analytics} /> : null}
      <h2 className="admin-section">티켓</h2>
      <p className="admin-sub admin-sub--tight">발급 / 사용</p>
      {analytics ? <AdminWeekTickets analytics={analytics} /> : null}
    </main>
  );
}
