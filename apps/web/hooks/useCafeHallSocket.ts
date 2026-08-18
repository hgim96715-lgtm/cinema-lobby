'use client';
import { useEffect } from 'react';
import type { CafeTableSnapshot } from '@cinemo/shared';
import { connectCafeSocket } from '@/lib/cafe-socket';

type Args = {
  accessToken: string | null;
  setTables: React.Dispatch<React.SetStateAction<CafeTableSnapshot[]>>;
  setCafeJustClosed: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useCafeHallSocket({
  accessToken,
  setTables,
  setCafeJustClosed,
}: Args) {
  useEffect(() => {
    if (!accessToken) return;
    const socket = connectCafeSocket(accessToken);
    socket.on('connect', () => {
      socket.emit('joinHall');
    });

    socket.on('table', (snapshot) => {
      setTables((tables) =>
        tables.map((table) =>
          table.tableId === snapshot.tableId ? snapshot : table,
        ),
      );
    });

    socket.on('hall', (hall) => {
      setTables(hall.tables);
      setCafeJustClosed(hall.cafeJustClosed);
    });

    return () => {
      socket.disconnect();
    };
  }, [accessToken, setTables, setCafeJustClosed]);
}
