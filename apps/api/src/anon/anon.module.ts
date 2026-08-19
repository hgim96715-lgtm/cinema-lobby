import { Module } from '@nestjs/common';
import { AnonController } from './anon.controller';
import { AnonService } from './anon.service';

@Module({
  controllers: [AnonController],
  providers: [AnonService],
})
export class AnonModule {}
