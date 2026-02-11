import cron, { ScheduledTask } from 'node-cron';
import { PrismaService } from '../../database/prisma.service';
import { Logger } from '../../logging/logger.service';

export class CleanupOldLogsJob {
  private readonly logger: Logger;
  private task: ScheduledTask | null = null;

  /** Number of days to retain audit logs */
  private readonly retentionDays: number;

  constructor(private readonly prisma: PrismaService) {
    this.logger = new Logger('CleanupOldLogsJob');
    this.retentionDays = parseInt(process.env.LOG_RETENTION_DAYS || '90', 10);
  }

  start(): void {
    // Run weekly on Sundays at 3:00 AM
    this.task = cron.schedule('0 3 * * 0', async () => {
      await this.execute();
    });

    this.logger.info(
      `CleanupOldLogsJob scheduled (weekly on Sundays at 3:00 AM, retention: ${this.retentionDays} days)`,
    );
  }

  stop(): void {
    if (this.task) {
      this.task.stop();
      this.task = null;
      this.logger.info('CleanupOldLogsJob stopped');
    }
  }

  private async execute(): Promise<void> {
    const startTime = Date.now();
    this.logger.info(`Cleaning up logs older than ${this.retentionDays} days...`);

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);

      const db = this.prisma as any;

      // Clean up audit logs
      const auditResult: number = await db.$executeRawUnsafe(
        `DELETE FROM audit_logs WHERE created_at < $1`,
        cutoffDate,
      );

      // Clean up notification logs
      const notificationResult: number = await db.$executeRawUnsafe(
        `DELETE FROM notification_logs WHERE created_at < $1 AND read = true`,
        cutoffDate,
      );

      const duration = Date.now() - startTime;
      this.logger.info(
        `Log cleanup completed in ${duration}ms`,
        {
          auditLogsDeleted: auditResult,
          notificationLogsDeleted: notificationResult,
          cutoffDate: cutoffDate.toISOString(),
        },
      );
    } catch (error) {
      this.logger.error('Failed to clean up old logs', error);
    }
  }
}
