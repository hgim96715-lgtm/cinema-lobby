import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envValidationSchema } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { TicketModule } from './ticket/ticket.module';
import { TmdbModule } from './tmdb/tmdb.module';
import { UserMovieModule } from './user-movie/user-movie.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: envValidationSchema,
      validationOptions: { convert: true },
    }),
    PrismaModule,
    AuthModule,
    HealthModule,
    TicketModule,
    TmdbModule,
    UserMovieModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
