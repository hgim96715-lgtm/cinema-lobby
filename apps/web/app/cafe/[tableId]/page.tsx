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
  getCafeHallRequest,
  getCafeTableChatRequest,
  sayCafeMessageRequest,
  sitCafeTableRequest,
  standCafeTableRequest,
  updateCafeMessageRequest,
} from '@/lib/cafe-api';
import { useAuthStore } from '@/lib/auth-store';
import '../../styles/cafe.css';
import { useCafeTableSocket } from '@/hooks/useCafeTableSocket';
import { CafeAlreadySeatedModal } from '@/components/cafe/CafeAlreadySeatedModal';

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [alreadySeatedOpen, setAlreadySeatedOpen] = useState(false);
  const [blockedMyTableId, setBlockedMyTableId] = useState<CafeTableId | null>(
    null,
  );

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
    async function loadTableContent(
      label: string | null | undefined,
    ): Promise<void> {
      setTableLabel(label?.trim() || `테이블 ${tableId!}`);
      const chat = await getCafeTableChatRequest(accessToken!, tableId!);
      if (cancelled) return;
      setMessages(chat.messages);
      setCafeJustClosed(chat.cafeJustClosed);
    }

    async function enterTable() {
      setLoading(true);
      setError(null);
      try {
        const sit = await sitCafeTableRequest(accessToken!, tableId!);
        if (cancelled) return;
        if (!sit.ok) {
          if (sit.reason === 'already-seated') {
            const hall = await getCafeHallRequest(accessToken!);
            if (cancelled) return;
            setBlockedMyTableId(hall.myTableId);
            setAlreadySeatedOpen(true);
            return;
          }
          setError(
            sit.reason === 'locked'
              ? '비공개 테이블입니다.'
              : '입장할 수 없습니다.',
          );
          return;
        }
        await loadTableContent(sit.snapshot.label);
      } catch (error) {
        if (cancelled) return;
        const message =
          error instanceof Error
            ? error.message
            : '테이블을 불러오는데 실패했습니다.';
        if (message === '이미 처리된 요청입니다.') {
          try {
            const sit = await sitCafeTableRequest(accessToken!, tableId!);
            if (cancelled) return;
            if (sit.ok) {
              await loadTableContent(sit.snapshot.label);
              return;
            }
          } catch {
            // fall through
          }
        }
        setError(message);
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

  async function editMessage(messageId: string, body: string) {
    if (!accessToken || cafeJustClosed || !body.trim() || savingEdit) return;
    setSavingEdit(true);
    setError(null);
    try {
      const updated = await updateCafeMessageRequest(
        accessToken,
        messageId,
        body.trim(),
      );
      setMessages((messages) =>
        messages.map((m) => (m.id === updated.id ? updated : m)),
      );
      setEditingId(null);
      setEditInput('');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : '메시지를 수정하는데 실패했습니다.',
      );
    } finally {
      setSavingEdit(false);
    }
  }

  function startEdit(msg: CafeMessageItem) {
    setEditingId(msg.id);
    setEditInput(msg.body);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditInput('');
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
      {alreadySeatedOpen ? (
        <CafeAlreadySeatedModal
          myTableId={blockedMyTableId}
          onClose={() => router.push('/cafe')}
        />
      ) : null}
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
            const editing = editingId === msg.id;
            const edited =
              msg.updatedAt !== msg.createdAt &&
              new Date(msg.updatedAt).getTime() >
                new Date(msg.createdAt).getTime() + 1000;
            return (
              <li
                key={msg.id}
                className={`cafe-chat-line${mine ? ' cafe-chat-line--mine' : ''}`}
              >
                {mine ? null : (
                  <span className="cafe-chat-nick">{msg.nickname}</span>
                )}
                {editing ? (
                  <form
                    className="cafe-chat-body cafe-chat-body--edit"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void editMessage(msg.id, editInput);
                    }}
                  >
                    <input
                      className="cafe-chat-edit-input"
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      maxLength={200}
                      disabled={savingEdit}
                      autoFocus
                    />
                    <div className="cafe-chat-foot cafe-chat-foot--actions">
                      <button
                        type="button"
                        className="cafe-chat-edit-cancel"
                        onClick={cancelEdit}
                        disabled={savingEdit}
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="cafe-chat-edit-save"
                        disabled={
                          savingEdit ||
                          !editInput.trim() ||
                          editInput.trim() === msg.body
                        }
                      >
                        {savingEdit ? '저장 중…' : '저장'}
                      </button>
                    </div>
                  </form>
                ) : mine ? (
                  <div className="cafe-chat-body">
                    <p className="cafe-chat-text">{msg.body}</p>
                    {!cafeJustClosed || edited ? (
                      <div className="cafe-chat-foot">
                        {edited ? (
                          <span className="cafe-chat-edited">수정됨</span>
                        ) : (
                          <span className="cafe-chat-foot-spacer" aria-hidden />
                        )}
                        {!cafeJustClosed ? (
                          <button
                            type="button"
                            className="cafe-chat-edit-btn"
                            onClick={() => startEdit(msg)}
                          >
                            수정
                          </button>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <span className="cafe-chat-body">{msg.body}</span>
                )}
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
              placeholder="메시지를 입력하세요"
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
