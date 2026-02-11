import cron, { ScheduledTask } from 'node-cron';
import { PrismaService } from '../../database/prisma.service';
import { Logger } from '../../logging/logger.service';

export class RefreshMaterializedViewsJob {
  private readonly logger: Logger;
  private task: ScheduledTask | null = null;

  constructor(private readonly prisma: PrismaService) {
    this.logger = new Logger('RefreshMaterializedViewsJob');
  }

  start(): void {
    // Run every 30 minutes
    this.task = cron.schedule('*/30 * * * *', async () => {
      await this.execute();
    });

    this.logger.info('RefreshMaterializedViewsJob scheduled (every 30 minutes)');
  }

  stop(): void {
    if (this.task) {
      this.task.stop();
      this.task = null;
      this.logger.info('RefreshMaterializedViewsJob stopped');
    }
  }

  private async execute(): Promise<void> {
    const startTime = Date.now();
    this.logger.info('Refreshing materialized views...');

    try {
      const db = this.prisma as any;
      // Refresh materialized views using raw SQL
      await db.$executeRawUnsafe(
        'REFRESH MATERIALIZED VIEW CONCURRENTLY IF EXISTS mv_animal_statistics',
      );
      await db.$executeRawUnsafe(
        'REFRESH MATERIALIZED VIEW CONCURRENTLY IF EXISTS mv_lot_summary',
      );
      await db.$executeRawUnsafe(
        'REFRESH MATERIALIZED VIEW CONCURRENTLY IF EXISTS mv_health_summary',
      );
      await db.$executeRawUnsafe(
        'REFRESH MATERIALIZED VIEW CONCURRENTLY IF EXISTS mv_financial_summary',
      );

      const duration = Date.now() - startTime;
      this.logger.info(`Materialized views refreshed successfully in ${duration}ms`);
    } catch (error) {
      this.logger.error('Failed to refresh materialized views', error);
    }
  }
}
