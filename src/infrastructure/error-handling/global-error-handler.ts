import { Logger } from '../logging/logger.service';

export interface AppError {
  code: string;
  message: string;
  statusCode: number;
  isOperational: boolean;
  stack?: string;
}

export class ErrorHandler {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger('ErrorHandler');
  }

  handleError(error: Error | AppError): void {
    const appError = this.normalizeError(error);

    if (appError.isOperational) {
      this.logger.warn('Operational error', appError as unknown as Record<string, unknown>);
    } else {
      this.logger.error('Unexpected error', error instanceof Error ? error : undefined);
    }
  }

  private normalizeError(error: Error | AppError): AppError {
    if (this.isAppError(error)) {
      return error;
    }

    return {
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'An unexpected error occurred',
      statusCode: 500,
      isOperational: false,
      stack: error instanceof Error ? error.stack : undefined,
    };
  }

  private isAppError(error: unknown): error is AppError {
    return typeof error === 'object' && error !== null && 'isOperational' in error;
  }
}
