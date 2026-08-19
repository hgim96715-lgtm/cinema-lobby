'use client';

import { AdminHoursChart } from '@/components/admin/AdminCharts';
import { AdminChartPage } from '@/components/admin/AdminChartPage';

export default function AdminHoursPage() {
  return (
    <AdminChartPage title="시간" sub="오늘 로비 막대 · 7일 시간대 히트맵">
      {(analytics) => <AdminHoursChart analytics={analytics} />}
    </AdminChartPage>
  );
}
