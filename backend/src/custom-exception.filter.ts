import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
@Catch()
export class CustomExceptionFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    response.statusCode = exception.getStatus();

    const res = exception.getResponse() as { message: string[] | string };
    const message = Array.isArray(res?.message)
      ? res?.message?.join(',')
      : res?.message;

    response.json({
      code: exception.getStatus(),
      message: message || exception.message,
      data: null,
    });
  }
}
