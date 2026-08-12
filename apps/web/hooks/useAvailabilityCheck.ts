'use client';

import { useEffect, useRef, useState } from 'react';

export type AvailabilityCheckStatus =
  | 'idle'
  | 'checking'
  | 'ok'
  | 'taken'
  | 'invalid';

type Options = {
  value: string;
  validate: (value: string) => boolean;
  check: (value: string) => Promise<{ available: boolean }>;
  delayMs?: number;
};

export function useAvailabilityCheck({
  value,
  validate,
  check,
  delayMs = 400,
}: Options) {
  const [status, setStatus] = useState<AvailabilityCheckStatus>('idle');
  const validateRef = useRef(validate);
  const checkRef = useRef(check);
  validateRef.current = validate;
  checkRef.current = check;

  useEffect(() => {
    const trimmed = value.trim();
    if (!trimmed) {
      setStatus('idle');
      return;
    }
    if (!validateRef.current(trimmed)) {
      setStatus('invalid');
      return;
    }

    setStatus('idle');
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setStatus('checking');
      try {
        const { available } = await checkRef.current(trimmed);
        if (!cancelled) setStatus(available ? 'ok' : 'taken');
      } catch {
        if (!cancelled) setStatus('idle');
      }
    }, delayMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [value, delayMs]);

  return status;
}
