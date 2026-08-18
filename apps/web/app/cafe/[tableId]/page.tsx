'use client';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import {
  CAFE_TABLE_SLOTS,
  type CafeMessageItem,
  type CafeTableId,
} from '@cinemo/shared';
import {
  getCafeTableChatRequest,
  sayCafeMessageRequest,
  sitCafeTableRequest,
  standCafeTableRequest,
} from '@/lib/cafe-api';
import { useAuthStore } from '@/lib/auth-store';
import '../../styles/cafe.css';
import { useCafeTableSocket } from '@/hooks/useCafeTableSocket';

function isTableId(value: string): value is CafeTableId {
  return (CAFE_TABLE_SLOTS as readonly string[]).includes(value);
}

export default function CafeTablePage() {
  const params = useParams();
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);

  const rawId = params.tableId;
  const tableId = typeof rawId === 'string' && isTableId(rawId) ? rawId : null;

  const [messages, setMessages] = useState<CafeMessageItem[]>([]);
  const [cafeJustClosed, setCafeJustClosed] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [tableLabel, setTableLabel] = useState<string>('');

  useEffect(() => {
    if (!accessToken) {
      router.replace('/login');
      return;
    }
    if (!tableId) {
      setError('유효하지 않은 테이블입니다.');
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function enterTable() {
      setLoading(true);
      setError(null);
      try {
        const sit = await sitCafeTableRequest(accessToken!, tableId!);
        if (cancelled) return;
        if (!sit.ok) {
          setError(
            sit.reason === 'locked'
              ? '비공개 테이블입니다.'
              : sit.reason === 'already-seated'
                ? '다른 테이블에 앉아 있어요. 먼저 나와 주세요.'
                : '입장할 수 없습니다.',
          );
          return;
        }
        setTableLabel(sit.snapshot.label ?? `테이블 ${tableId!}`);
        const chat = await getCafeTableChatRequest(accessToken!, tableId!);
        if (cancelled) return;
        setMessages(chat.messages);
        setCafeJustClosed(chat.cafeJustClosed);
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : '테이블을 불러오는데 실패했습니다.',
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void enterTable();
    return () => {
      cancelled = true;
    };
  }, [accessToken, tableId, router]);

  async function say(formData: FormData) {
    if (!accessToken || !tableId || cafeJustClosed) return;

    const text = formData.get('body');
    if (typeof text !== 'string' || !text.trim()) return;
    setSending(true);
    setError(null);
    try {
      const message = await sayCafeMessageRequest(
        accessToken,
        tableId,
        text.trim(),
      );
      setMessages((messages) =>
        messages.some((m) => m.id === message.id)
          ? messages
          : [...messages, message],
      );
      setMessageInput('');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : '메시지를 보내는데 실패했습니다.',
      );
    } finally {
      setSending(false);
    }
  }

  async function goToHall() {
    router.push('/cafe');
  }

  async function leaveTable() {
    if (!accessToken || !tableId || leaving) return;
    setLeaving(true);
    setError(null);
    try {
      await standCafeTableRequest(accessToken, tableId);
      router.push('/cafe');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : '테이블에서 나가는데 실패했습니다.',
      );
      setLeaving(false);
    }
  }

  const seated = !loading && !error && tableId !== null;
  useCafeTableSocket({
    accessToken,
    tableId,
    seated,
    setMessages,
  });

  return (
    <main className={`cafe cafe--chat${cafeJustClosed ? ' cafe--closed' : ''}`}>
      <div className="cafe-stage cafe-stage--chat">
        <header className="cafe-chat-header">
          <button type="button" className="review-back" onClick={goToHall}>
            <ArrowLeft className="cafe-back-icon" aria-hidden />홀
          </button>
          <div className="cafe-chat-heading">
            <h1 className="cafe-chat-title">{tableLabel}</h1>
            {user ? <p className="cafe-chat-sub">{user.nickname}</p> : null}
          </div>
          {seated ? (
            <button
              type="button"
              className="cafe-chat-leave"
              onClick={() => void leaveTable()}
              disabled={leaving}
            >
              {leaving ? '나가는 중…' : '나가기'}
            </button>
          ) : (
            <span className="cafe-chat-leave-spacer" aria-hidden />
          )}
        </header>
        {cafeJustClosed ? (
          <p className="cafe-closed">오늘 카페는 닫혔어요</p>
        ) : null}
        {error ? <p className="cafe-error">{error}</p> : null}
        {loading ? <p className="cafe-chat-status">입장 중…</p> : null}
        <ul className="cafe-chat-log" aria-live="polite">
          {messages.map((msg) => {
            const mine = user?.id === msg.userId;
            return (
              <li
                key={msg.id}
                className={`cafe-chat-line${mine ? ' cafe-chat-line--mine' : ''}`}
              >
                {mine ? null : (
                  <span className="cafe-chat-nick">{msg.nickname}</span>
                )}
                <span className="cafe-chat-body">{msg.body}</span>
              </li>
            );
          })}
        </ul>
        {!loading && !error ? (
          <form className="cafe-chat-form" action={say}>
            <input
              name="body"
              className="cafe-chat-input"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="짧은 한 줄…"
              maxLength={200}
              disabled={cafeJustClosed || sending}
            />
            <button
              type="submit"
              className="cafe-chat-send"
              disabled={cafeJustClosed || sending || !messageInput.trim()}
            >
              보내기
            </button>
          </form>
        ) : null}
      </div>
    </main>
  );
}
