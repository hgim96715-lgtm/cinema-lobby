import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { Prisma } from '../generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const response = host.switchToHttp().getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '데이터베이스 오류가 발생했습니다.';

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        message = '이미 처리된 요청입니다.';
        break;
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = '요청한 데이터를 찾을 수 없습니다.';
        break;
    }

    response.status(status).json({ statusCode: status, message });
  }
}
