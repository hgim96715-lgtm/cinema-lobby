import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { TicketStatus as SharedTicketStatus } from '@cinemo/shared';
import { todayKstDate } from '../lib/date-kst';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  async getToday(userId: string): Promise<{ status: SharedTicketStatus }> {
    const ticket = await this.prisma.ticket.findUnique({
      where: {
        userId_ticketDate: { userId, ticketDate: todayKstDate() },
      },
    });
    if (!ticket) return { status: 'none' };
    return { status: ticket.status };
  }

  async issueToday(userId: string) {
    const ticketDate = todayKstDate();
    const existing = await this.prisma.ticket.findUnique({
      where: { userId_ticketDate: { userId, ticketDate } },
    });
    if (existing) throw new ConflictException('이미 오늘 티켓을 발급했습니다.');
    const ticket = await this.prisma.ticket.create({
      data: { userId, ticketDate, status: 'issued', issuedAt: new Date() },
    });
    return { id: ticket.id };
  }

  async useToday(userId: string) {
    const ticketDate = todayKstDate();
    const ticket = await this.prisma.ticket.findUnique({
      where: { userId_ticketDate: { userId, ticketDate } },
    });
    if (!ticket) throw new NotFoundException('오늘 발급된 티켓이 없습니다.');
    if (ticket.status === 'used')
      throw new ConflictException('이미 사용한 티켓입니다.');
    return this.prisma.ticket.update({
      where: { id: ticket.id },
      data: { status: 'used', usedAt: new Date() },
    });
  }
}
