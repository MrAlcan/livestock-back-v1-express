import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../infrastructure/logging/logger.service';

const logger = new Logger('HTTP');

export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const userId = req.user?.userId || 'anonymous';
    const message = `${req.method} ${req.originalUrl} - User: ${userId} - ${duration}ms - ${res.statusCode}`;

    if (res.statusCode >= 500) {
      logger.error(message);
    } else if (res.statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.info(message);
    }
  });

  next();
}
