import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { OptionalUserId } from '../auth/decorators/optional-user-id.decorator';
import { AnonService } from './anon.service';
import { RecordAnonVisitDto } from './dto/record-anon-visit.dto';

@ApiTags('anon')
@Controller('anon')
export class AnonController {
  constructor(private readonly anonService: AnonService) {}

  @Public()
  @Post('visit')
  recordVisit(
    @Body() dto: RecordAnonVisitDto,
    @OptionalUserId() userId?: string,
  ) {
    if (userId) return { ok: true as const };
    return this.anonService.recordVisit(dto.visitorKey, dto.place);
  }
}
