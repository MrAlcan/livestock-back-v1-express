import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../infrastructure/logging/logger.service';
import { sendError } from '../utils/http-response';

const logger = new Logger('ErrorHandler');

export function errorHandlerMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  logger.error('Unhandled error', error);

  if (error.name === 'MulterError') {
    sendError(res, 400, 'FILE_UPLOAD_ERROR', error.message);
    return;
  }

  if (error.name === 'SyntaxError' && 'body' in error) {
    sendError(res, 400, 'INVALID_JSON', 'JSON inválido en el cuerpo de la petición');
    return;
  }

  const statusCode = 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Error interno del servidor'
    : error.message;

  sendError(res, statusCode, 'INTERNAL_ERROR', message);
}
