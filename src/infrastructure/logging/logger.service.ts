import { winstonLogger } from './winston.logger';

export class Logger {
  constructor(private readonly context?: string) {}

  debug(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.debug(message, { context: this.context, ...meta });
  }

  info(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.info(message, { context: this.context, ...meta });
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.warn(message, { context: this.context, ...meta });
  }

  error(message: string, error?: unknown, meta?: Record<string, unknown>): void {
    if (error instanceof Error) {
      winstonLogger.error(message, {
        context: this.context,
        error: error.message,
        stack: error.stack,
        ...meta,
      });
    } else {
      winstonLogger.error(message, {
        context: this.context,
        error,
        ...meta,
      });
    }
  }

  fatal(message: string, error?: unknown, meta?: Record<string, unknown>): void {
    if (error instanceof Error) {
      winstonLogger.error(`[FATAL] ${message}`, {
        context: this.context,
        error: error.message,
        stack: error.stack,
        ...meta,
      });
    } else {
      winstonLogger.error(`[FATAL] ${message}`, {
        context: this.context,
        error,
        ...meta,
      });
    }
  }
}
