'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { TicketStatus } from '@cinemo/shared';
import { useAuthStore } from '@/lib/auth-store';
import { getTodayTicketRequest, issueTicketRequest } from '@/lib/ticket-api';

type Props = {
  onStatusChange: (status: TicketStatus | null) => void;
};

export function TicketBooth({ onStatusChange }: Props) {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const clearSession = useAuthStore((s) => s.clearSession);

  const [status, setStatus] = useState<TicketStatus | null>(null);
  const [issuing, setIssuing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken || !user) {
      setStatus(null);
      onStatusChange(null);
      return;
    }
    let cancelled = false;
    async function loadStatus() {
      setError(null);
      try {
        const res = await getTodayTicketRequest(accessToken!);
        if (cancelled) return;
        setStatus(res.status);
        onStatusChange(res.status);
      } catch (error) {
        if (cancelled) return;
        setStatus(null);
        onStatusChange(null);
        setError(
          error instanceof Error
            ? error.message
            : '티켓 상태를 불러오는 중 오류가 발생했습니다.',
        );
      }
    }
    void loadStatus();
    return () => {
      cancelled = true;
    };
  }, [accessToken, user, onStatusChange]);

  async function issueTicket() {
    if (!accessToken) return;
    setIssuing(true);
    setError(null);
    try {
      await issueTicketRequest(accessToken);
      setStatus('issued');
      onStatusChange('issued');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : '티켓 발급 중 오류가 발생했습니다.',
      );
    } finally {
      setIssuing(false);
    }
  }

  if (!user) {
    return (
      <div className="lobby-desk">
        <p className="lobby-desk-title">티켓 발급</p>
        <div className="lobby-desk-actions">
          <Link href="/login" className="lobby-btn lobby-btn--primary">
            입장하기
          </Link>
          <Link href="/register" className="lobby-btn">
            회원가입
          </Link>
        </div>
      </div>
    );
  }

  const canIssue = status === 'none' || status === null;
  return (
    <div className="lobby-desk">
      <p className="lobby-desk-title">티켓 발급</p>
      {error ? <p className="lobby-desk-copy">{error}</p> : null}
      <div className="lobby-desk-actions">
        <button
          type="button"
          className="lobby-btn lobby-btn--primary"
          disabled={issuing || !canIssue}
          onClick={issueTicket}
        >
          발급받기
        </button>
        <button type="button" className="lobby-btn" onClick={clearSession}>
          나가기
        </button>
      </div>
    </div>
  );
}
