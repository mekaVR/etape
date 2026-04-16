import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import type { Response } from 'express';
import type { ApiErrorResponse } from '@etape/types/types/api-error';
import { extractBusinessError, isZodValidationError } from '../utils';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    if (statusCode === 400 && isZodValidationError(exceptionResponse)) {
      const { issues } = exceptionResponse;
      const fields: Record<string, string> = {};

      for (const issue of issues) {
        fields[issue.path.join('.')] = issue.message;
      }

      const payload: ApiErrorResponse = {
        statusCode: 400,
        error: 'Validation failed',
        fields,
      };

      return response.status(statusCode).json(payload);
    }

    const { message, error, fields } = extractBusinessError(
      exceptionResponse,
      exception,
    );

    const payload: ApiErrorResponse = {
      statusCode: statusCode as 401 | 403 | 404 | 409,
      error,
      message,
    };
    if (fields) payload.fields = fields;

    return response.status(statusCode).json(payload);
  }
}
