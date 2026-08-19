'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import type { CafeTableId, CafeTableSnapshot } from '@cinemo/shared';
import { getCafeHallRequest } from '@/lib/cafe-api';
import { CafeStaff } from '@/components/cafe/CafeStaff';
import { CafeFloor } from '@/components/cafe/CafeFloor';
import { useCafeHallSocket } from '@/hooks/useCafeHallSocket';
import { useAuthStore } from '@/lib/auth-store';
import '../styles/cafe.css';

export default function CafePage() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const hydrated = useAuthStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;
    if (accessToken === null) router.replace('/login?next=/cafe');
  }, [accessToken, router, hydrated]);

  const [tables, setTables] = useState<CafeTableSnapshot[]>([]);
  const [myTableId, setMyTableId] = useState<CafeTableId | null>(null);
  const [cafeJustClosed, setCafeJustClosed] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const staffLine = cafeJustClosed
    ? '오늘 카페는 닫았어요. 내일 또 와요~'
    : '주의사항을 보시려면 저를 눌러 주세요~';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!noticeOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNoticeOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [noticeOpen]);

  useEffect(() => {
    let cancelled = false;
    async function loadHall() {
      try {
        const hall = await getCafeHallRequest(accessToken);
        if (cancelled) return;
        setTables(hall.tables);
        setCafeJustClosed(hall.cafeJustClosed);
        setMyTableId(hall.myTableId);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : '카페를 불러오는데 실패했습니다.',
          );
        }
      }
    }
    void loadHall();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  useCafeHallSocket({ accessToken, setTables, setCafeJustClosed });

  return (
    <main className={`cafe${cafeJustClosed ? ' cafe--closed' : ''}`}>
      <div className="cafe-stage">
        <Link href="/" className="review-back">
          <ArrowLeft className="cafe-back-icon" aria-hidden />
          로비
        </Link>

        {cafeJustClosed ? (
          <p className="cafe-closed">오늘 카페는 닫혔어요</p>
        ) : null}
        {error ? <p className="cafe-error">{error}</p> : null}

        <section className="cafe-snackbar" aria-label="스낵 카운터">
          <div className="cafe-menu-board" aria-hidden>
            <span className="cafe-menu-kicker">CINEMO</span>
            <span className="cafe-menu-title">SNACK BAR</span>
            <ul className="cafe-menu-items">
              <li>
                <span>팝콘</span>
                <span>₩4,500</span>
              </li>
              <li>
                <span>콜라</span>
                <span>₩3,000</span>
              </li>
              <li>
                <span>나초</span>
                <span>₩5,500</span>
              </li>
            </ul>
          </div>

          <div className="cafe-counter-scene">
            <div className="cafe-snacks cafe-snacks--left" aria-hidden>
              <div className="cafe-popcorn">
                <span className="cafe-popcorn-kernel cafe-popcorn-kernel--a" />
                <span className="cafe-popcorn-kernel cafe-popcorn-kernel--b" />
                <span className="cafe-popcorn-kernel cafe-popcorn-kernel--c" />
                <span className="cafe-popcorn-bucket" />
              </div>
            </div>

            <div className="cafe-staff-slot">
              <CafeStaff
                speech={staffLine}
                onPersonClick={() => setNoticeOpen(true)}
              />
            </div>

            <div className="cafe-snacks cafe-snacks--right" aria-hidden>
              <div className="cafe-soda">
                <span className="cafe-soda-straw" />
                <span className="cafe-soda-cup" />
              </div>
              <div className="cafe-nachos">
                <span className="cafe-nacho cafe-nacho--a" />
                <span className="cafe-nacho cafe-nacho--b" />
                <span className="cafe-nacho cafe-nacho--c" />
                <span className="cafe-nacho-tray" />
              </div>
            </div>

            <div className="cafe-bar" aria-hidden />
          </div>
        </section>

        <CafeFloor tables={tables} myTableId={myTableId} />
      </div>

      {mounted && noticeOpen
        ? createPortal(
            <div
              className="cafe-notice-overlay"
              onClick={() => setNoticeOpen(false)}
            >
              <div
                className="cafe-notice"
                role="dialog"
                aria-modal="true"
                aria-labelledby="cafe-notice-title"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="cafe-notice-kicker">CINEMO SNACK BAR</p>
                <h2 id="cafe-notice-title" className="cafe-notice-title">
                  주의사항
                </h2>
                <span className="cafe-notice-perforation" aria-hidden />
                <ul className="cafe-notice-rules">
                  <li>짧은 한 줄 · 이모지 OK · 장문 SNS ❌</li>
                  <li>오늘 수다만 — 새벽 2시에 사라져요</li>
                  <li>남기고 싶은 말 → 후기방</li>
                  <li>첫 앉은 사람이 이름 · 공개/비공개</li>
                  <li>말하기 = 로그인 · 본인 말만 수정</li>
                </ul>
                <button
                  type="button"
                  className="cafe-notice-close"
                  onClick={() => setNoticeOpen(false)}
                >
                  닫기
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </main>
  );
}
