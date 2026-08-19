'use client';

import { AdminHoursChart } from '@/components/admin/AdminCharts';
import { AdminChartPage } from '@/components/admin/AdminChartPage';

export default function AdminHoursPage() {
  return (
    <AdminChartPage title="시간" sub="오늘 로비 방문 · 최근 7일 기록">
      {(analytics) => <AdminHoursChart analytics={analytics} />}
    </AdminChartPage>
  );
}
