'use client';

import Link from 'next/link';
import type { CafeTableId } from '@cinemo/shared';

type Props = {
  myTableId: CafeTableId | null;
  onClose: () => void;
};

export function CafeAlreadySeatedModal({ myTableId, onClose }: Props) {
  return (
    <div className="cafe-notice-overlay" onClick={onClose}>
      <div
        className="cafe-notice"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cafe-already-seated-title"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="cafe-notice-kicker">TABLE</p>
        <h2 id="cafe-already-seated-title" className="cafe-notice-title">
          다른 테이블에 앉아 있어요
        </h2>
        <span className="cafe-notice-perforation" aria-hidden />
        <p className="cafe-notice-body">먼저 나와 주세요.</p>
        <div className="cafe-setup-actions">
          <button type="button" className="cafe-setup-cancel" onClick={onClose}>
            닫기
          </button>
          {myTableId ? (
            <Link href={`/cafe/${myTableId}`} className="cafe-notice-close">
              내 테이블로
            </Link>
          ) : (
            <Link href="/cafe" className="cafe-notice-close">
              홀로
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
