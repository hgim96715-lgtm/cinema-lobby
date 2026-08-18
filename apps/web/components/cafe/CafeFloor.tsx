'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type {
  CafeTableId,
  CafeTableSetup,
  CafeTableSnapshot,
} from '@cinemo/shared';
import { sitCafeTableRequest } from '@/lib/cafe-api';
import { useAuthStore } from '@/lib/auth-store';
import { CafeTableSetupModal } from '@/components/cafe/CafeTableSetup';

type Props = {
  tables: CafeTableSnapshot[];
};

export function CafeFloor({ tables }: Props) {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [setupTableId, setSetupTableId] = useState<CafeTableId | null>(null);
  const [error, setError] = useState<string | null>(null);

  function openEmptyTable(tableId: CafeTableId) {
    if (!accessToken) {
      router.push('/login');
      return;
    }
    setSetupTableId(tableId);
  }

  async function confirmSetup(setup: CafeTableSetup) {
    if (!accessToken || !setupTableId) return;
    const tableId = setupTableId;
    setSetupTableId(null);
    try {
      const sit = await sitCafeTableRequest(accessToken, tableId, setup);
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
      router.push(`/cafe/${tableId}`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : '테이블에 앉는데 실패했습니다.',
      );
    }
  }
  return (
    <>
      {error ? <p className="cafe-error">{error}</p> : null}
      <section className="cafe-floor" aria-label="테이블">
        {tables.map((table) => {
          const locked = table.access === 'locked';
          const label = locked ? '비공개' : table.label?.trim() || '빈 테이블';
          const className = `cafe-table${locked ? ' cafe-table--locked' : ''}${table.seatedCount === 0 ? ' cafe-table--empty' : ''}`;
          const inner = (
            <>
              <div className="cafe-chairs" aria-hidden>
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="cafe-tabletop">
                <p className="cafe-table-label">{label}</p>
                <p className="cafe-table-count">{table.seatedCount}명</p>
              </div>
            </>
          );
          if (locked) {
            return (
              <article key={table.tableId} className={className}>
                {inner}
              </article>
            );
          }
          if (table.seatedCount === 0) {
            return (
              <button
                key={table.tableId}
                type="button"
                className={className}
                onClick={() => openEmptyTable(table.tableId)}
              >
                {inner}
              </button>
            );
          }
          return (
            <Link
              key={table.tableId}
              href={`/cafe/${table.tableId}`}
              className={className}
            >
              {inner}
            </Link>
          );
        })}
      </section>
      {setupTableId
        ? createPortal(
            <CafeTableSetupModal
              onCancel={() => setSetupTableId(null)}
              onConfirm={confirmSetup}
            />,
            document.body,
          )
        : null}
    </>
  );
}
