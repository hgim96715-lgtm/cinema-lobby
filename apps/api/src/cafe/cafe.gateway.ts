import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import type {
  CafeHallResponse,
  CafeMessageItem,
  CafeTableId,
  CafeTableSnapshot,
} from '@cinemo/shared';
import type { JwtPayload } from '../auth/jwt-payload';
import { PrismaService } from '../prisma/prisma.service';
import { isCafeTableId } from './cafe-join';

@WebSocketGateway({
  namespace: '/cafe',
  cors: { origin: true, credentials: true },
})
export class CafeGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  emitHall(payload: CafeHallResponse) {
    this.server.to('hall').emit('hall', payload);
  }
  emitTableSnapshot(snapshot: CafeTableSnapshot) {
    this.server.to('hall').emit('table', snapshot);
  }
  emitMessage(tableId: CafeTableId, message: CafeMessageItem) {
    this.server.to(`table:${tableId}`).emit('message', message);
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    if (typeof token !== 'string' || !token) {
      client.disconnect();
      return;
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      client.data.userId = payload.sub;
    } catch {
      client.disconnect();
    }
  }
  @SubscribeMessage('joinHall')
  joinHall(@ConnectedSocket() client: Socket) {
    void client.join('hall');
    return { ok: true };
  }
  @SubscribeMessage('joinTable')
  async joinTable(
    @ConnectedSocket() client: Socket,
    @MessageBody() tableId: string,
  ) {
    const userId = client.data.userId as string | undefined;
    if (!userId) return { ok: false, reason: '로그인이 필요합니다.' };
    if (!isCafeTableId(tableId))
      return { ok: false, reason: '유효하지 않은 테이블입니다.' };

    const seated = await this.prisma.cafeTableSeat.findUnique({
      where: { tableId_userId: { tableId, userId } },
    });
    if (!seated) return { ok: false, reason: '좌석에 앉아있지 않습니다.' };
    void client.join(`table:${tableId}`);
    return { ok: true };
  }

  @SubscribeMessage('leaveTable')
  leaveTable(
    @ConnectedSocket() client: Socket,
    @MessageBody() tableId: string,
  ) {
    if (isCafeTableId(tableId)) void client.leave(`table:${tableId}`);
    return { ok: true as const };
  }
}
