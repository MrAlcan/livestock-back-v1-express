import { PrismaService } from '../database/prisma.service';
import { Logger } from '../logging/logger.service';
import { RefreshMaterializedViewsJob } from './cron/refresh-materialized-views.job';
import { CheckExpiringDocumentsJob } from './cron/check-expiring-documents.job';
import { GenerateBirthAlertsJob } from './cron/generate-birth-alerts.job';
import { CleanupOldLogsJob } from './cron/cleanup-old-logs.job';

export class JobScheduler {
  private readonly logger: Logger;
  private readonly refreshMaterializedViewsJob: RefreshMaterializedViewsJob;
  private readonly checkExpiringDocumentsJob: CheckExpiringDocumentsJob;
  private readonly generateBirthAlertsJob: GenerateBirthAlertsJob;
  private readonly cleanupOldLogsJob: CleanupOldLogsJob;

  constructor(prisma: PrismaService) {
    this.logger = new Logger('JobScheduler');
    this.refreshMaterializedViewsJob = new RefreshMaterializedViewsJob(prisma);
    this.checkExpiringDocumentsJob = new CheckExpiringDocumentsJob(prisma);
    this.generateBirthAlertsJob = new GenerateBirthAlertsJob(prisma);
    this.cleanupOldLogsJob = new CleanupOldLogsJob(prisma);
  }

  startAll(): void {
    this.logger.info('Starting all scheduled jobs...');

    this.refreshMaterializedViewsJob.start();
    this.checkExpiringDocumentsJob.start();
    this.generateBirthAlertsJob.start();
    this.cleanupOldLogsJob.start();

    this.logger.info('All scheduled jobs started');
  }

  stopAll(): void {
    this.logger.info('Stopping all scheduled jobs...');

    this.refreshMaterializedViewsJob.stop();
    this.checkExpiringDocumentsJob.stop();
    this.generateBirthAlertsJob.stop();
    this.cleanupOldLogsJob.stop();

    this.logger.info('All scheduled jobs stopped');
  }
}
