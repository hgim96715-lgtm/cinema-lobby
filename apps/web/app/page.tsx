'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { TicketStatus } from '@cinemo/shared';
import { useAuthStore } from '@/lib/auth-store';
import { TicketBooth } from '@/components/lobby/TicketBooth';
import { guestTicketLabel } from '@/lib/lobby-speech';
import { GuestFigure } from '@/components/lobby/GuestFigure';
import './styles/lobby.css';

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
            <div className="lobby-board-track">
              <article className="lobby-chart">
                <p className="lobby-chart-label">오늘 입장</p>
                <div className="lobby-chart-viz" aria-hidden>
                  <div className="lobby-chart-plot">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <p className="lobby-chart-value">—</p>
              </article>
              <article className="lobby-chart">
                <p className="lobby-chart-label">오늘의 후기</p>
                <div className="lobby-chart-viz lobby-chart-viz--poster" aria-hidden>
                  <div className="lobby-chart-poster" />
                  <div className="lobby-chart-poster-meta">
                    <span className="lobby-chart-poster-title">—</span>
                  </div>
                </div>
                <p className="lobby-chart-value">—</p>
              </article>
              <article className="lobby-chart">
                <p className="lobby-chart-label">주간 하이라이트</p>
                <div className="lobby-chart-viz lobby-chart-viz--poster" aria-hidden>
                  <div className="lobby-chart-poster" />
                  <div className="lobby-chart-poster-meta">
                    <span className="lobby-chart-poster-title">—</span>
                  </div>
                </div>
                <p className="lobby-chart-value">—</p>
              </article>
            </div>
          </div>
        </section>

        <div className="lobby-hall">
          <div className="lobby-doors lobby-doors--left">
            <Link href="/gacha" className="lobby-door">
              <span className="lobby-door-frame" aria-hidden />
              <span className="lobby-door-label">뽑기방</span>
            </Link>
          </div>

          <section className="lobby-counter" aria-label="로비 중앙 매표소">
            <TicketBooth onStatusChange={setTicketStatus} />
          </section>

          <div className="lobby-doors lobby-doors--right">
            <Link href="/review" className="lobby-door">
              <span className="lobby-door-frame" aria-hidden />
              <span className="lobby-door-label">후기방</span>
            </Link>
            <span className="lobby-door lobby-door--soon" title="준비 중">
              <span className="lobby-door-frame" aria-hidden />
              <span className="lobby-door-label">카페</span>
            </span>
          </div>
        </div>

        <div className="lobby-guest" aria-label={user ? user.nickname : '손님'}>
          <div className="lobby-guest-bar">
            <div className="lobby-guest-identity">
              <GuestFigure />
              <p className="lobby-guest-name">
                {user ? user.nickname : '손님'}
              </p>
            </div>
            <p className="lobby-guest-ticket">
              <span className="lobby-ticket-stub">TICKET</span>
              {user
                ? guestTicketLabel(ticketStatus)
                : '입장 전 · 티켓 없음'}
            </p>
            <Link
              href={user ? '/room' : '/login'}
              className="lobby-mat"
              aria-label={user ? '내 방' : '입장 후 내 방'}
            >
              <span className="lobby-mat-label">MY ROOM</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
