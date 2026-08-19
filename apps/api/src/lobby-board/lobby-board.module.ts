import { Module } from '@nestjs/common';
import { LobbyBoardService } from './lobby-board.service';
import { LobbyBoardController } from './lobby-board.controller';
import { TmdbModule } from '../tmdb/tmdb.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [TmdbModule, AdminModule],
  controllers: [LobbyBoardController],
  providers: [LobbyBoardService],
})
export class LobbyBoardModule {}
