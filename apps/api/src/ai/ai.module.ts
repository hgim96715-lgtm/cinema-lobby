import { Module } from '@nestjs/common';
import { ClaudeService } from './claude.service';
import { AiService } from './ai.service';
import { AI_PROVIDER } from './ai.interface';

@Module({
  providers: [
    { provide: AI_PROVIDER, useClass: ClaudeService }, // ← GPT로 바꾸려면 여기만 수정
    AiService,
  ],
  exports: [AiService],
})
export class AiModule {}
