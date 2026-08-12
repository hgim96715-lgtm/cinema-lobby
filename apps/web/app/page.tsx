'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';

function Staff() {
  return (
    <div className="lobby-staff" aria-hidden>
      <span className="lobby-staff-person">
        <span className="lobby-staff-head" />
        <span className="lobby-staff-body" />
      </span>
    </div>
  );
}

export default function HomePage() {
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);
  const lit = Boolean(user);

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
            <Staff />
            <div className="lobby-desk">
              <p className="lobby-desk-title">티켓 발급</p>
              {lit ? (
                <>
                  <p className="lobby-desk-copy">
                    오늘 뽑기 1회권을 받아 가세요.
                  </p>
                  <div className="lobby-desk-actions">
                    <button
                      type="button"
                      className="lobby-btn lobby-btn--primary"
                      disabled
                      title="Ticket API 연결 예정"
                    >
                      발급받기
                    </button>
                    <button
                      type="button"
                      className="lobby-btn"
                      onClick={clearSession}
                    >
                      나가기
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="lobby-desk-copy">
                    조명이 꺼져 있습니다.
                    <br />
                    입장 후 티켓을 발급할 수 있어요.
                  </p>
                  <div className="lobby-desk-actions">
                    <Link href="/login" className="lobby-btn lobby-btn--primary">
                      입장하기
                    </Link>
                    <Link href="/register" className="lobby-btn">
                      회원가입
                    </Link>
                  </div>
                </>
              )}
            </div>
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

        <div
          className="lobby-guest"
          aria-label={user ? user.nickname : '손님'}
        >
          <div className="lobby-guest-row">
            <div className="lobby-guest-figure" aria-hidden>
              <span className="lobby-guest-head" />
              <span className="lobby-guest-body" />
            </div>
            <div className="lobby-guest-info">
              {user ? (
                <>
                  <p className="lobby-guest-name">{user.nickname}</p>
                  <p className="lobby-guest-ticket">
                    <span className="lobby-ticket-stub">TICKET</span>
                    아직 없음
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
