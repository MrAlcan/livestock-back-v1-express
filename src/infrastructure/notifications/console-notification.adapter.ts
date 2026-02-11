import { INotificationService, NotificationPayload } from '../../application/shared/ports/INotificationService';
import { Logger } from '../logging/logger.service';

/**
 * Console Notification Adapter
 *
 * Placeholder implementation for MVP that logs notifications to the console.
 * Replace with a real notification provider (WebSocket, Firebase, etc.) for production.
 */
export class ConsoleNotificationAdapter implements INotificationService {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger('NotificationService');
  }

  async send(payload: NotificationPayload): Promise<void> {
    this.logger.info(`[NOTIFICATION] [${payload.type}] -> User: ${payload.userId}`, {
      title: payload.title,
      message: payload.message,
      data: payload.data,
    });
  }

  async sendToMany(
    userIds: string[],
    payload: Omit<NotificationPayload, 'userId'>,
  ): Promise<void> {
    this.logger.info(
      `[NOTIFICATION] [${payload.type}] -> ${userIds.length} users`,
      {
        title: payload.title,
        message: payload.message,
        userIds,
        data: payload.data,
      },
    );
  }

  async sendPush(userId: string, title: string, body: string): Promise<void> {
    this.logger.info(`[PUSH NOTIFICATION] -> User: ${userId}`, {
      title,
      body,
    });
  }
}
