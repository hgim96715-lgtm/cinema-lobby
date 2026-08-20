'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import type { WeeklyRevealWinner } from '@cinemo/shared';
import { tmdbPosterUrl } from '@/lib/tmdb-image';
import { kstPreviousWeekRangeLabel } from '@/lib/date-kst';
import { providerLogoUrl } from '@/lib/watch-providers';
import {
  getUserMovieMarksRequest,
  toggleUserMovieRequest,
} from '@/lib/user-movie-api';

type Step = 'teaser' | 'flash' | 'reveal';

export function WeeklyRevealModal({
  winner,
  accessToken,
  onClose,
}: {
  winner: WeeklyRevealWinner;
  accessToken?: string | null;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>('teaser');
  const [watched, setWatched] = useState(false);
  const [wish, setWish] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const rangeLabel = kstPreviousWeekRangeLabel();
  const poster = tmdbPosterUrl(winner.movie.poster_path, 'w342');
  const providers = winner.movie.providers ?? [];

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    async function loadMarks() {
      try {
        const marks = await getUserMovieMarksRequest(
          accessToken!,
          winner.tmdbId,
        );
        if (cancelled) return;
        setWatched(marks.watched);
        setWish(marks.wish);
      } catch {
        // marks 실패해도 모달은 진행
      }
    }
    void loadMarks();

    return () => {
      cancelled = true;
    };
  }, [accessToken, winner.tmdbId]);

  useEffect(() => {
    if (step !== 'flash') return;
    const id = window.setTimeout(() => setStep('reveal'), 1200);
    return () => window.clearTimeout(id);
  }, [step]);

  async function toggleWish() {
    if (!accessToken) return;
    const prev = wish;
    setWish(!prev);
    try {
      const res = await toggleUserMovieRequest(
        accessToken,
        winner.tmdbId,
        'wish',
      );
      setWish(res.active);
    } catch {
      setWish(prev);
    }
  }

  return (
    <div className="weekly-reveal" role="dialog" aria-modal="true">
      <div className="weekly-reveal-backdrop" onClick={onClose} aria-hidden />

      {step === 'teaser' ? (
        <div className="weekly-reveal-content weekly-reveal-content--teaser">
          <p className="weekly-reveal-eyebrow">Weekly Reveal</p>
          <p className="weekly-reveal-teaser-copy">
            {rangeLabel} 사이,
            <br />
            사람들이 제일 많이 남긴 후기는…
          </p>
          <button
            type="button"
            className="weekly-reveal-open"
            onClick={() => setStep('flash')}
          >
            두구두구 · 열어보세요
          </button>
          {/* <button
            type="button"
            className="weekly-reveal-skip"
            onClick={onClose}
          >
            닫기
          </button> */}
        </div>
      ) : null}

      {step === 'flash' ? (
        <div className="weekly-reveal-gate" aria-hidden>
          <div className="weekly-reveal-gate-frame">
            <div className="weekly-reveal-gate-screen">
              <p className="weekly-reveal-gate-kicker">NOW SHOWING</p>
              <div className="weekly-reveal-gate-beats">
                <span />
                <span />
                <span />
              </div>
              <p className="weekly-reveal-gate-title">{winner.movie.title}</p>
            </div>
            <div className="weekly-reveal-gate-scan" />
            <div className="weekly-reveal-gate-shutter">
              {Array.from({ length: 8 }, (_, i) => (
                <span key={i} />
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {step === 'reveal' ? (
        <div className="weekly-reveal-content weekly-reveal-content--reveal">
          <p className="weekly-reveal-eyebrow">지난주 1위 후기</p>

          <div className="weekly-reveal-poster">
            {poster ? (
              <img src={poster} alt={winner.movie.title} />
            ) : (
              <span className="weekly-reveal-poster-empty">No Poster</span>
            )}
          </div>

          <h2 className="weekly-reveal-title">{winner.movie.title}</h2>
          <p className="weekly-reveal-count">후기 {winner.count}건</p>

          {winner.sampleBody ? (
            <div className="weekly-reveal-spoiler">
              {!quoteOpen ? (
                <button
                  type="button"
                  className="weekly-reveal-spoiler-btn"
                  onClick={() => setQuoteOpen(true)}
                >
                  대표 후기 보기 · 스포일러 주의
                </button>
              ) : (
                <blockquote className="weekly-reveal-quote">
                  “{winner.sampleBody}”
                </blockquote>
              )}
            </div>
          ) : null}

          {!watched ? (
            <div className="weekly-reveal-cta">
              <p className="weekly-reveal-cta-copy">
                아직 안 보셨다면, 한번 보시는 건 어때요?
              </p>
              {providers.length > 0 ? (
                <div className="weekly-reveal-providers">
                  {providers.map((p) => (
                    <img
                      key={p.id}
                      src={providerLogoUrl(p.logo_path)}
                      alt={p.name}
                      title={p.name}
                      className="weekly-reveal-provider-logo"
                    />
                  ))}
                </div>
              ) : null}
              <div className="weekly-reveal-actions">
                <Link
                  href="/review"
                  className="weekly-reveal-btn weekly-reveal-btn--primary"
                  onClick={onClose}
                >
                  후기방에서 더 읽기
                </Link>
                {accessToken ? (
                  <button
                    type="button"
                    className={`weekly-reveal-btn${wish ? ' is-on' : ''}`}
                    onClick={() => void toggleWish()}
                    aria-pressed={wish}
                  >
                    <Heart
                      size={14}
                      strokeWidth={1.75}
                      fill={wish ? 'currentColor' : 'none'}
                      aria-hidden
                    />
                    찜
                  </button>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="weekly-reveal-cta">
              <p className="weekly-reveal-cta-copy">이미 보셨군요.</p>
              <div className="weekly-reveal-actions">
                <Link
                  href="/review"
                  className="weekly-reveal-btn weekly-reveal-btn--primary"
                  onClick={onClose}
                >
                  후기 더 읽기
                </Link>
                <Link
                  href="/review"
                  className="weekly-reveal-btn"
                  onClick={onClose}
                >
                  이번 주 TOP 보러 후기방
                </Link>
              </div>
            </div>
          )}

          <button
            type="button"
            className="weekly-reveal-skip"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      ) : null}
    </div>
  );
}
