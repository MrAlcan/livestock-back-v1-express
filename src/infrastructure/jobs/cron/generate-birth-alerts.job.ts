import cron, { ScheduledTask } from 'node-cron';
import { PrismaService } from '../../database/prisma.service';
import { Logger } from '../../logging/logger.service';

export class GenerateBirthAlertsJob {
  private readonly logger: Logger;
  private task: ScheduledTask | null = null;

  constructor(private readonly prisma: PrismaService) {
    this.logger = new Logger('GenerateBirthAlertsJob');
  }

  start(): void {
    // Run daily at 7:00 AM
    this.task = cron.schedule('0 7 * * *', async () => {
      await this.execute();
    });

    this.logger.info('GenerateBirthAlertsJob scheduled (daily at 7:00 AM)');
  }

  stop(): void {
    if (this.task) {
      this.task.stop();
      this.task = null;
      this.logger.info('GenerateBirthAlertsJob stopped');
    }
  }

  private async execute(): Promise<void> {
    this.logger.info('Checking for upcoming births...');

    try {
      // Average cattle gestation is approximately 283 days
      // Alert when within 15 days of expected birth
      const fifteenDaysFromNow = new Date();
      fifteenDaysFromNow.setDate(fifteenDaysFromNow.getDate() + 15);

      const today = new Date();
      const db = this.prisma as any;

      const upcomingBirths: Array<{
        id: string;
        animal_id: string;
        expected_birth_date: Date;
        ranch_id: string;
      }> = await db.$queryRawUnsafe(
        `SELECT r.id, r.animal_id, r.expected_birth_date, a.ranch_id
         FROM reproduction_records r
         JOIN animals a ON a.id = r.animal_id
         WHERE r.expected_birth_date IS NOT NULL
         AND r.expected_birth_date BETWEEN $1 AND $2
         AND r.status = 'PREGNANT'
         AND r.birth_date IS NULL`,
        today,
        fifteenDaysFromNow,
      );

      if (upcomingBirths.length > 0) {
        this.logger.info(`Found ${upcomingBirths.length} expected births within 15 days`, {
          animalIds: upcomingBirths.map((b) => b.animal_id),
        });
      } else {
        this.logger.info('No upcoming births found');
      }
    } catch (error) {
      this.logger.error('Failed to check upcoming births', error);
    }
  }
}
