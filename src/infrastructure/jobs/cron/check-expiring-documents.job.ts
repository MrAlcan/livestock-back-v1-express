import cron, { ScheduledTask } from 'node-cron';
import { PrismaService } from '../../database/prisma.service';
import { Logger } from '../../logging/logger.service';

export class CheckExpiringDocumentsJob {
  private readonly logger: Logger;
  private task: ScheduledTask | null = null;

  constructor(private readonly prisma: PrismaService) {
    this.logger = new Logger('CheckExpiringDocumentsJob');
  }

  start(): void {
    // Run daily at 8:00 AM
    this.task = cron.schedule('0 8 * * *', async () => {
      await this.execute();
    });

    this.logger.info('CheckExpiringDocumentsJob scheduled (daily at 8:00 AM)');
  }

  stop(): void {
    if (this.task) {
      this.task.stop();
      this.task = null;
      this.logger.info('CheckExpiringDocumentsJob stopped');
    }
  }

  private async execute(): Promise<void> {
    this.logger.info('Checking for expiring SENASAG documents...');

    try {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const fifteenDaysFromNow = new Date();
      fifteenDaysFromNow.setDate(fifteenDaysFromNow.getDate() + 15);

      const db = this.prisma as any;

      // Find documents expiring within 30 days
      const expiringDocuments: Array<{
        id: string;
        document_type: string;
        expiration_date: Date;
        ranch_id: string;
      }> = await db.$queryRawUnsafe(
        `SELECT id, document_type, expiration_date, ranch_id
         FROM senasag_documents
         WHERE expiration_date <= $1
         AND expiration_date > NOW()
         AND status = 'ACTIVE'`,
        thirtyDaysFromNow,
      );

      if (expiringDocuments.length > 0) {
        this.logger.warn(
          `Found ${expiringDocuments.length} SENASAG documents expiring within 30 days`,
        );

        // Find critical ones expiring within 15 days
        const criticalDocs = expiringDocuments.filter(
          (doc) => new Date(doc.expiration_date) <= fifteenDaysFromNow,
        );

        if (criticalDocs.length > 0) {
          this.logger.warn(
            `CRITICAL: ${criticalDocs.length} documents expiring within 15 days!`,
            { documentIds: criticalDocs.map((d) => d.id) },
          );
        }
      } else {
        this.logger.info('No expiring documents found');
      }
    } catch (error) {
      this.logger.error('Failed to check expiring documents', error);
    }
  }
}
