'use client';
import { useEffect, useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { getCafeNoticeRequest, updateCafeNoticeRequest } from '@/lib/cafe-api';

export default function CafeNoticePage() {
  const token = useAuthStore((s) => s.accessToken);
  const [kicker, setKicker] = useState('');
  const [title, setTitle] = useState('');
  const [rulesText, setRulesText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadNotice() {
      setLoading(true);
      setError(null);
      try {
        const notice = await getCafeNoticeRequest();
        if (cancelled) return;
        setKicker(notice.kicker);
        setTitle(notice.title);
        setRulesText(notice.rules.join('\n'));
      } catch (error) {
        if (!cancelled)
          setError(error instanceof Error ? error.message : String(error));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadNotice();
    return () => {
      cancelled = true;
    };
  }, []);

  async function saveNotice() {
    if (!token) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const rules = rulesText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      await updateCafeNoticeRequest(token, { kicker, title, rules });
      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="admin-main">
      <h2 className="admin-title">카페</h2>
      <p className="admin-sub">스낵바 주의사항 모달 문구.</p>
      <section className="admin-ops-card">
        {loading ? (
          <p className="admin-ops-hint">불러오는 중…</p>
        ) : (
          <>
            <label className="admin-ops-field">
              <span>Kicker</span>
              <input
                className="admin-ops-input admin-ops-input--wide"
                value={kicker}
                onChange={(e) => setKicker(e.target.value)}
                maxLength={64}
              />
            </label>
            <label className="admin-ops-field admin-cafe-field">
              <span>제목</span>
              <input
                className="admin-ops-input admin-ops-input--wide"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={128}
              />
            </label>
            <label className="admin-ops-field admin-cafe-field">
              <span>규칙 (한 줄 = 한 항목)</span>
              <textarea
                className="admin-ops-input admin-cafe-rules"
                value={rulesText}
                onChange={(e) => setRulesText(e.target.value)}
                rows={6}
              />
            </label>
            <div className="admin-ops-toolbar admin-cafe-toolbar">
              <button
                type="button"
                className="admin-ops-btn admin-ops-btn--primary"
                onClick={() => void saveNotice()}
                disabled={saving || !token}
              >
                {saving ? '저장 중…' : '저장'}
              </button>
            </div>
            {error ? (
              <div className="admin-ops-result admin-ops-result--error">
                <AlertCircle size={14} />
                {error}
              </div>
            ) : null}
            {success ? (
              <div className="admin-ops-result">
                <Check size={14} className="admin-ops-icon--ok" />
                저장됨
              </div>
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}
