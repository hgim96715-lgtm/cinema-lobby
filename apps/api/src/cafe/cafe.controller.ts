import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Patch,
} from '@nestjs/common';
import { CafeService } from './cafe.service';
import { SitCafeTableDto } from './dto/sit-cafe-table.dto';
import { SayCafeMessageDto } from './dto/say-cafe-message.dto';
import { UpdateCafeMessageDto } from './dto/update-cafe-message.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import type { CafeTableId, CafeTableSetup } from '@cinemo/shared';
import { UserId } from '../auth/decorators/user-id.decorator';

@ApiTags('cafe')
@ApiBearerAuth()
@Controller('cafe')
export class CafeController {
  constructor(private readonly cafeService: CafeService) {}

  @Public()
  @Get('hall')
  getHall() {
    return this.cafeService.getHall();
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
