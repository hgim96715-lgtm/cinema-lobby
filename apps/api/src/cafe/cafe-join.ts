import {
  CAFE_TABLE_SLOTS,
  DEFAULT_CAFE_TABLE_ACCESS,
  type CafeTableId,
  type CafeTableSetup,
  type CafeTableSnapshot,
} from '@cinemo/shared';

export type CafeJoinRejectReason = 'locked' | 'invalid-table' | 'already-seated';

export function isCafeTableId(value: string): value is CafeTableId {
  return (CAFE_TABLE_SLOTS as readonly string[]).includes(value);
}

export function createEmptyCafeTableSnapshot(
  tableId: CafeTableId,
): CafeTableSnapshot {
  return {
    tableId,
    label: null,
    access: DEFAULT_CAFE_TABLE_ACCESS,
    seatedCount: 0,
  };
}

export function canJoinCafeTable(
  table: CafeTableSnapshot,
  userId: string,
  seatedUserIds: string[],
): { ok: true } | { ok: false; reason: CafeJoinRejectReason } {
  if (table.access === 'locked' && !seatedUserIds.includes(userId)) {
    return { ok: false, reason: 'locked' };
  }
  return { ok: true };
}

export function applyFirstSeatSetup(
  table: CafeTableSnapshot,
  setup?: CafeTableSetup,
): CafeTableSnapshot {
  if (table.seatedCount > 0) return table;
  return {
    ...table,
    label: setup?.label?.trim() || null,
    access: setup?.access ?? DEFAULT_CAFE_TABLE_ACCESS,
  };
}

export function resetCafeTableSession(tableId: CafeTableId): CafeTableSnapshot {
  return createEmptyCafeTableSnapshot(tableId);
}
