import { Controller, Get, Post, Param, Body, Patch } from '@nestjs/common';
import { CafeService } from './cafe.service';
import { SitCafeTableDto } from './dto/sit-cafe-table.dto';
import { SayCafeMessageDto } from './dto/say-cafe-message.dto';
import { UpdateCafeMessageDto } from './dto/update-cafe-message.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { OptionalUserId } from '../auth/decorators/optional-user-id.decorator';
import type { CafeTableId, CafeTableSetup } from '@cinemo/shared';
import { UserId } from '../auth/decorators/user-id.decorator';
import { UpdateCafeNoticeDto } from './dto/update-cafe-notice.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('cafe')
@ApiBearerAuth()
@Controller('cafe')
export class CafeController {
  constructor(private readonly cafeService: CafeService) {}

  @Public()
  @Get('hall')
  getHall(@OptionalUserId() userId?: string) {
    return this.cafeService.getHall(userId);
  }

  @Public()
  @Get('notice')
  getNotice() {
    return this.cafeService.getNotice();
  }

  @Roles('admin')
  @Patch('notice')
  updateNotice(@Body() dto: UpdateCafeNoticeDto) {
    return this.cafeService.updateNotice(dto);
  }

  @Get('tables/:tableId/messages')
  getTableChat(@Param('tableId') tableId: CafeTableId) {
    return this.cafeService.getTableChat(tableId);
  }

  @Post('tables/:tableId/sit')
  sit(
    @UserId() userId: string,
    @Param('tableId') tableId: CafeTableId,
    @Body() dto: SitCafeTableDto,
  ) {
    return this.cafeService.sit(tableId, userId, dto);
  }

  @Post('tables/:tableId/stand')
  stand(@UserId() userId: string, @Param('tableId') tableId: CafeTableId) {
    return this.cafeService.stand(tableId, userId);
  }

  @Post('tables/:tableId/messages')
  say(
    @UserId() userId: string,
    @Param('tableId') tableId: CafeTableId,
    @Body() dto: SayCafeMessageDto,
  ) {
    return this.cafeService.say(tableId, userId, dto.body);
  }

  @Patch('messages/:id')
  updateMessage(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCafeMessageDto,
  ) {
    return this.cafeService.updateMessage(userId, id, dto.body);
  }
}
