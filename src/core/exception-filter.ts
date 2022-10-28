import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import RequestError from './errors/RequestError';

@Catch()
export class CatchAllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.log(exception);

    if (exception instanceof RequestError) {
      return response
        .status(exception.status)
        .json({ message: exception.message, errorType: exception.errorType });
    }

    return response.status(HttpStatus.BAD_REQUEST).json({
      message: 'Unknown error',
      errorType: 'server_error',
    });
  }
}
