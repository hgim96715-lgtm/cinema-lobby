'use client';

import { useState } from 'react';
import type { TicketStatus } from '@cinemo/shared';
import { useAuthStore } from '@/lib/auth-store';
import { TicketBooth } from '@/components/lobby/TicketBooth';
import { staffSpeech, guestSpeech, guestTicketLabel } from '@/lib/lobby-speech';
import { Staff } from '@/components/lobby/Staff';
import { GuestFigure } from '@/components/lobby/GuestFigure';

export default function HomePage() {
  const user = useAuthStore((s) => s.user);
  const lit = Boolean(user);
  const [ticketStatus, setTicketStatus] = useState<TicketStatus | null>(null);

  return (
    <main className={`lobby ${lit ? 'lobby--lit' : 'lobby--dim'}`}>
      <div className="lobby-atmosphere" aria-hidden />

      <div className="lobby-stage">
        <section className="lobby-board-block">
          <div className="lobby-board-lights" aria-hidden>
            <span className="lobby-lamp">
              <span className="lobby-lamp-stem" />
              <span className="lobby-lamp-shade" />
            </span>
            <span className="lobby-lamp">
              <span className="lobby-lamp-stem" />
              <span className="lobby-lamp-shade" />
            </span>
          </div>
          <h1 className="lobby-board-brand">CINEMO</h1>
          <div className="lobby-board" aria-label="전광판 분석">
            <p className="lobby-board-kicker">전광판 분석</p>
            <div className="lobby-board-charts">
              <article className="lobby-chart">
                <p className="lobby-chart-label">오늘 입장</p>
                <div className="lobby-chart-plot" aria-hidden />
                <p className="lobby-chart-value">—</p>
              </article>
              <article className="lobby-chart">
                <p className="lobby-chart-label">티켓 발급</p>
                <div className="lobby-chart-plot" aria-hidden />
                <p className="lobby-chart-value">—</p>
              </article>
              <article className="lobby-chart">
                <p className="lobby-chart-label">뽑기 횟수</p>
                <div className="lobby-chart-plot" aria-hidden />
                <p className="lobby-chart-value">—</p>
              </article>
            </div>
          </div>
        </section>

        <div className="lobby-hall">
          <div className="lobby-doors lobby-doors--left">
            <span className="lobby-door" title="준비 중">
              뽑기방
            </span>
          </div>

          <section className="lobby-counter" aria-label="로비 중앙 매표소">
            <Staff speech={staffSpeech(user?.nickname, ticketStatus)} />
            <TicketBooth onStatusChange={setTicketStatus} />
            <p className="lobby-counter-label">로비 중앙</p>
          </section>

          <div className="lobby-doors lobby-doors--right">
            <span className="lobby-door" title="준비 중">
              후기방
            </span>
            <span className="lobby-door" title="준비 중">
              카페
            </span>
          </div>
        </div>

        <div className="lobby-guest" aria-label={user ? user.nickname : '손님'}>
          {user ? (
            <p
              className="lobby-speech"
              role="status"
              key={ticketStatus ?? 'none'}
            >
              {guestSpeech(ticketStatus)}
            </p>
          ) : null}
          <div className="lobby-guest-row">
            <GuestFigure />
            <div className="lobby-guest-info">
              {user ? (
                <>
                  <p className="lobby-guest-name">{user.nickname}</p>
                  <p className="lobby-guest-ticket">
                    <span className="lobby-ticket-stub">TICKET</span>
                    {guestTicketLabel(ticketStatus)}
                  </p>
                </>
              ) : (
                <>
                  <p className="lobby-guest-name">손님</p>
                  <p className="lobby-guest-ticket">입장 전 · 티켓 없음</p>
                </>
              )}
            </div>
          </div>
          <div className="lobby-mat" aria-hidden>
            <span className="lobby-mat-label">ENTER</span>
          </div>
        </div>
      </div>
    </main>
  );
}
