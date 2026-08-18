'use client';
import { useState } from 'react';
import type { CafeTableAccess, CafeTableSetup } from '@cinemo/shared';

type Props = {
  onCancel: () => void;
  onConfirm: (setup: CafeTableSetup) => void;
};

export function CafeTableSetupModal({ onCancel, onConfirm }: Props) {
  const [label, setLabel] = useState('');
  const [access, setAccess] = useState<CafeTableAccess>('open');

  async function confirm(formData: FormData) {
    const rawLabel = formData.get('label');
    const rawAccess = formData.get('access');
    const nextLabel = typeof rawLabel === 'string' ? rawLabel.trim() : '';
    const nextAccess: CafeTableAccess =
      rawAccess === 'locked' ? 'locked' : 'open';

    onConfirm({ label: nextLabel || null, access: nextAccess });
    setLabel('');
    setAccess('open');
  }
  return (
    <div className="cafe-notice-overlay" onClick={onCancel}>
      <div
        className="cafe-notice cafe-notice--setup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cafe-setup-title"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="cafe-notice-kicker">TABLE</p>
        <h2 id="cafe-setup-title" className="cafe-notice-title">
          테이블 정하기
        </h2>
        <span className="cafe-notice-perforation" aria-hidden />
        <form className="cafe-setup-form" action={confirm}>
          <label className="cafe-setup-field">
            이름 (선택)
            <input
              name="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              maxLength={24}
              placeholder="빈 테이블"
            />
          </label>
          <fieldset className="cafe-setup-access">
            <legend>입장 설정</legend>
            <label>
              <input
                type="radio"
                name="access"
                value="open"
                checked={access === 'open'}
                onChange={() => setAccess('open')}
              />
              공개
            </label>
            <label className="cafe-setup-access-option--disabled">
              <input
                type="radio"
                name="access"
                value="locked"
                checked={false}
                disabled
              />
              비공개
            </label>
          </fieldset>
          <div className="cafe-setup-actions">
            <button type="button" className="cafe-setup-cancel" onClick={onCancel}>
              취소
            </button>
            <button type="submit" className="cafe-notice-close">
              앉기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
