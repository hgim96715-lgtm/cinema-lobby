import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { todayKstDate } from '../lib/date-kst';

@Injectable()
export class AnonService {
  constructor(private readonly prisma: PrismaService) {}

  async recordVisit(visitorKey: string, place: 'review') {
    const visitDate = todayKstDate();
    await this.prisma.anonVisit.createMany({
      data: { visitorKey, place, visitDate },
      skipDuplicates: true,
    });
    return { ok: true as const };
  }
}
