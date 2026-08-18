'use client';
import { useEffect } from 'react';
import type { CafeMessageItem, CafeTableId } from '@cinemo/shared';
import { connectCafeSocket } from '@/lib/cafe-socket';

type Args = {
  accessToken: string | null;
  tableId: CafeTableId | null;
  seated: boolean;
  setMessages: React.Dispatch<React.SetStateAction<CafeMessageItem[]>>;
};

export function useCafeTableSocket({
  accessToken,
  tableId,
  seated,
  setMessages,
}: Args) {
  useEffect(() => {
    if (!accessToken || !tableId || !seated) return;
    const socket = connectCafeSocket(accessToken);
    socket.on('connect', () => {
      socket.emit('joinTable', tableId);
    });

    socket.on('message', (message) => {
      if (message.tableId !== tableId) return;
      setMessages((messages) => {
        if (messages.some((m) => m.id === message.id)) return messages;
        return [...messages, message];
      });
    });

    return () => {
      socket.emit('leaveTable', tableId);
      socket.disconnect();
    };
  }, [accessToken, tableId, seated, setMessages]);
}
