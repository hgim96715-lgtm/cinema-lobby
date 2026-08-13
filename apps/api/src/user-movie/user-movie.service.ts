import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserMovieKind } from '../generated/prisma/enums';
import { TmdbService } from '../tmdb/tmdb.service';

@Injectable()
export class UserMovieService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tmdbService: TmdbService,
  ) {}

  // active true: 영화 추가, false: 영화 삭제
  async toggle(userId: string, tmdbId: number, kind: 'wish' | 'watched') {
    const existing = await this.prisma.userMovie.findUnique({
      where: {
        userId_tmdbId_kind: { userId, tmdbId, kind },
      },
    });
    if (existing) {
      await this.prisma.userMovie.delete({ where: { id: existing.id } });
      return { tmdbId, kind, active: false };
    }
    await this.prisma.userMovie.create({
      data: { userId, tmdbId, kind },
    });
    return { tmdbId, kind, active: true };
  }

  async getMarks(userId: string, tmdbId: number) {
    const rows = await this.prisma.userMovie.findMany({
      where: { userId, tmdbId },
      select: { kind: true },
    });
    return {
      tmdbId,
      wish: rows.some((row) => row.kind === 'wish'),
      watched: rows.some((row) => row.kind === 'watched'),
    };
  }

  async listByKind(userId: string, kind: UserMovieKind) {
    const rows = await this.prisma.userMovie.findMany({
      where: { userId, kind },
      orderBy: { updatedAt: 'desc' },
      select: { tmdbId: true, updatedAt: true },
    });
    return Promise.all(
      rows.map(async (row) => ({
        tmdbId: row.tmdbId,
        updatedAt: row.updatedAt.toISOString(),
        movie: await this.tmdbService.getMovie(row.tmdbId),
      })),
    );
  }
}
