import { io, type Socket } from 'socket.io-client';
import type {
  CafeHallResponse,
  CafeMessageItem,
  CafeTableId,
  CafeTableSnapshot,
} from '@cinemo/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3050';

export type CafeServerToClient = {
  hall: (payload: CafeHallResponse) => void;
  table: (payload: CafeTableSnapshot) => void;
  message: (payload: CafeMessageItem) => void;
};

export type CafeClientToServer = {
  joinHall: () => void;
  joinTable: (tableId: CafeTableId) => void;
  leaveTable: (tableId: CafeTableId) => void;
};

export type CafeSocket = Socket<CafeServerToClient, CafeClientToServer>;

export function connectCafeSocket(token: string): CafeSocket {
  return io(`${API_URL}/cafe`, {
    auth: { token },
    transports: ['websocket'],
  });
}
