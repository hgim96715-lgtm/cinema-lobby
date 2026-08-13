import { Controller, Get, Post } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserId } from '../auth/decorators/user-id.decorator';

@ApiTags('tickets')
@ApiBearerAuth()
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get('today')
  getToday(@UserId() userId: string) {
    return this.ticketService.getToday(userId);
  }
  @Post('issue')
  issueToday(@UserId() userId: string) {
    return this.ticketService.issueToday(userId);
  }
  @Post('use')
  useToday(@UserId() userId: string) {
    return this.ticketService.useToday(userId);
  }
}
