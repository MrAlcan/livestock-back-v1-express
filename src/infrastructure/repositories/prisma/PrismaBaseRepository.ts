import { PrismaService } from '../../database/prisma.service';
import { Logger } from '../../logging/logger.service';

export abstract class PrismaBaseRepository {
  protected readonly logger: Logger;

  constructor(
    protected readonly prisma: PrismaService,
    loggerContext: string,
  ) {
    this.logger = new Logger(loggerContext);
  }

  protected handlePrismaError(error: unknown): never {
    const prismaError = error as { code?: string; message?: string };
    this.logger.error('Prisma error', error instanceof Error ? error : undefined);

    switch (prismaError.code) {
      case 'P2002':
        throw new Error('Unique constraint violation');
      case 'P2003':
        throw new Error('Foreign key constraint violation');
      case 'P2025':
        throw new Error('Record not found');
      case 'P2034':
        throw new Error('Transaction conflict (deadlock)');
      default:
        throw new Error('Database error: ' + (prismaError.message || 'Unknown error'));
    }
  }

  protected buildWhereWithSoftDelete(where: Record<string, unknown> = {}): Record<string, unknown> {
    return {
      ...where,
      deletedAt: null,
    };
  }
}
