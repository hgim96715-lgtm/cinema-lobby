'use client';

import type { AdminAnalytics } from '@cinemo/shared';

function dayLabel(date: string) {
  return date.slice(5).replace('-', '/');
}

function hourLabel(hour: number) {
  return `${String(hour).padStart(2, '0')}시`;
}

function BarTrack({
  values,
  labels,
  max,
}: {
  values: number[];
  labels: string[];
  max: number;
}) {
  const peak = Math.max(max, 1);
  return (
    <div className="admin-bars-track">
      {values.map((value, i) => (
        <div key={`${labels[i]}-${i}`} className="admin-bar">
          <span className="admin-bar-n">{value > 0 ? value : ''}</span>
          <span className="admin-bar-well">
            <span
              className="admin-bar-fill"
              style={{
                height: `${Math.max(value > 0 ? 10 : 2, (value / peak) * 100)}%`,
              }}
            />
          </span>
          <span className="admin-bar-x">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function BarRow({
  name,
  values,
  labels,
}: {
  name: string;
  values: number[];
  labels: string[];
}) {
  return (
    <div className="admin-bars-row">
      <p className="admin-bars-name">{name}</p>
      <BarTrack values={values} labels={labels} max={Math.max(0, ...values)} />
    </div>
  );
}

export function AdminWeekPeople({ analytics }: { analytics: AdminAnalytics }) {
  const labels = analytics.series.map((row) => dayLabel(row.date));
  const empty = analytics.series.every(
    (row) => row.signups === 0 && row.visits === 0 && row.logins === 0,
  );
  if (empty) {
    return <p className="admin-status">아직 집계가 없어요</p>;
  }
  return (
    <div className="admin-bars">
      <BarRow
        name="가입"
        values={analytics.series.map((row) => row.signups)}
        labels={labels}
      />
      <BarRow
        name="로비"
        values={analytics.series.map((row) => row.visits)}
        labels={labels}
      />
      <BarRow
        name="로그인"
        values={analytics.series.map((row) => row.logins)}
        labels={labels}
      />
    </div>
  );
}

export function AdminWeekTickets({ analytics }: { analytics: AdminAnalytics }) {
  const labels = analytics.series.map((row) => dayLabel(row.date));
  const empty = analytics.series.every(
    (row) => row.ticketsIssued === 0 && row.ticketsUsed === 0,
  );
  if (empty) {
    return <p className="admin-status">아직 집계가 없어요</p>;
  }
  return (
    <div className="admin-bars">
      <BarRow
        name="발급"
        values={analytics.series.map((row) => row.ticketsIssued)}
        labels={labels}
      />
      <BarRow
        name="사용"
        values={analytics.series.map((row) => row.ticketsUsed)}
        labels={labels}
      />
    </div>
  );
}

export function AdminHoursChart({ analytics }: { analytics: AdminAnalytics }) {
  const today = analytics.to;
  const todayLabel = dayLabel(today);
  const values = Array.from({ length: 24 }, (_, hour) => {
    const row = analytics.hours.find(
      (item) => item.date === today && item.hour === hour,
    );
    return row?.visits ?? 0;
  });
  const labels = Array.from({ length: 24 }, (_, hour) =>
    hour % 3 === 0 ? String(hour) : '',
  );
  const peak = Math.max(0, ...values);
  const log = [...analytics.hours]
    .filter((row) => row.visits > 0)
    .sort((a, b) =>
      a.date === b.date ? b.hour - a.hour : a.date < b.date ? 1 : -1,
    );

  return (
    <div className="admin-hours-panel">
      <p className="admin-chart-label">오늘 {todayLabel} · 로비 방문</p>
      {peak === 0 ? (
        <p className="admin-status">오늘 로비 방문이 아직 없어요</p>
      ) : (
        <div className="admin-bars admin-bars--hours">
          <BarTrack values={values} labels={labels} max={peak} />
        </div>
      )}
      <p className="admin-chart-label">최근 7일 기록</p>
      {log.length === 0 ? (
        <p className="admin-status">방문 기록이 없어요</p>
      ) : (
        <ul className="admin-hour-log">
          {log.map((row) => (
            <li key={`${row.date}-${row.hour}`}>
              <span>
                {dayLabel(row.date)} {hourLabel(row.hour)}
              </span>
              <strong>{row.visits}명</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
