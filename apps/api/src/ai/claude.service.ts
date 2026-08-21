import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { EnvKeys } from '../config/env.keys';
import type { IAiProvider } from './ai.interface';

@Injectable()
export class ClaudeService implements IAiProvider {
  private readonly logger = new Logger(ClaudeService.name);
  private readonly claudeClient: Anthropic;
  constructor(private readonly configService: ConfigService) {
    this.claudeClient = new Anthropic({
      apiKey: this.configService.getOrThrow(EnvKeys.CLAUDE_KEY),
    });
  }

  async translateOverview(
    titleEn: string,
    overviewEn: string,
  ): Promise<string | null> {
    try {
      const msg = await this.claudeClient.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 512,
        messages: [
          {
            role: 'user',
            content:
              `영화 "${titleEn}"의 줄거리를 자연스러운 한국어로 2~3문장으로 번역해줘.\n` +
              `번역문만 출력해. 설명, 따옴표, 부연 일절 없이.\n\n` +
              overviewEn,
          },
        ],
      });
      return msg.content.find((c) => c.type === 'text')?.text?.trim() ?? null;
    } catch (error) {
      this.logger.warn(
        `translateOverview 실패 (${titleEn}): ${(error as Error).message}`,
      );
      return null;
    }
  }

  async koreanTitle(titleEn: string, year: string): Promise<string | null> {
    try {
      const msg = await this.claudeClient.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 64,
        messages: [
          {
            role: 'user',
            content:
              `영화 "${titleEn}" (${year})의 한국 개봉 제목 또는 통용 한국어 표기를 알려줘.\n` +
              `제목만 출력해. 설명, 따옴표, 부연 일절 없이.`,
          },
        ],
      });
      // 거절 문구 or 너무 긴 응답은 null로 처리
      const text =
        msg.content.find((c) => c.type === 'text')?.text?.trim() ?? null;
      if (
        !text ||
        text.length > 40 ||
        /죄송|알 수 없|확인|모르|없어/.test(text)
      ) {
        return null;
      }
      return text;
    } catch (error) {
      this.logger.warn(
        `koreanTitle 실패 (${titleEn}): ${(error as Error).message}`,
      );
      return null;
    }
  }

  async koreanDirector(name: string): Promise<string | null> {
    try {
      const msg = await this.claudeClient.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 32,
        messages: [
          {
            role: 'user',
            content:
              `영화 감독 "${name}"의 한국어 표기(한글)를 알려줘.\n` +
              `한글 이름만 출력해. 설명, 따옴표, 부연 일절 없이.`,
          },
        ],
      });
      const text = msg.content.find((c) => c.type === 'text')?.text?.trim();
      if (!text || text.length > 20 || /죄송|알 수 없|모르|없어/.test(text)) {
        return null;
      }
      return text;
    } catch (err) {
      this.logger.warn(
        `koreanDirector 실패 (${name}): ${(err as Error).message}`,
      );
      return null;
    }
  }
}
