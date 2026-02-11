import { PrismaClient } from '@prisma/client';
import { IUnitOfWork } from '../../application/shared/ports/IUnitOfWork';
import { PrismaService } from './prisma.service';
import { Logger } from '../logging/logger.service';

export class TransactionService implements IUnitOfWork {
  private readonly logger: Logger;

  constructor(private readonly prisma: PrismaService) {
    this.logger = new Logger('TransactionService');
  }

  async begin(): Promise<void> {
    this.logger.debug('Transaction begin requested (managed by execute)');
  }

  async commit(): Promise<void> {
    this.logger.debug('Transaction commit requested (managed by execute)');
  }

  async rollback(): Promise<void> {
    this.logger.debug('Transaction rollback requested (managed by execute)');
  }

  async execute<T>(work: () => Promise<T>): Promise<T> {
    try {
      return await this.prisma.$transaction(async () => {
        return await work();
      });
    } catch (error) {
      this.logger.error('Transaction failed', error);
      throw error;
    }
  }

  async executeWithRetry<T>(
    callback: (prisma: PrismaClient) => Promise<T>,
    maxRetries: number = 3,
    timeout: number = 10000,
  ): Promise<T> {
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        return await this.prisma.$transaction(
          async (tx) => {
            return await callback(tx as unknown as PrismaClient);
          },
          {
            maxWait: 5000,
            timeout,
          },
        );
      } catch (error: unknown) {
        attempt++;
        const prismaError = error as { code?: string };

        if (
          (prismaError.code === 'P2034' || prismaError.code === 'P2024') &&
          attempt < maxRetries
        ) {
          this.logger.warn(
            `Transaction failed (attempt ${attempt}/${maxRetries}), retrying...`,
          );
          await this.sleep(1000 * attempt);
          continue;
        }

        this.logger.error(`Transaction failed after ${attempt} attempts`, error);
        throw error;
      }
    }

    throw new Error('Transaction failed after max retries');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
