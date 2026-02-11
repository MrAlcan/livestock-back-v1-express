import { IQueueService } from '../../application/shared/ports/IQueueService';
import { Logger } from '../logging/logger.service';

type QueueHandler = (message: Record<string, unknown>) => Promise<void>;

interface QueueMessage {
  id: number;
  data: Record<string, unknown>;
  createdAt: Date;
}

/**
 * In-Memory Queue Adapter
 *
 * Simple in-memory queue implementation for MVP / development.
 * Messages are processed immediately when a subscriber is registered.
 * Replace with Redis-based (BullMQ) or RabbitMQ implementation for production.
 */
export class InMemoryQueueAdapter implements IQueueService {
  private readonly logger: Logger;
  private readonly queues: Map<string, QueueMessage[]>;
  private readonly subscribers: Map<string, QueueHandler>;
  private messageCounter: number;

  constructor() {
    this.logger = new Logger('InMemoryQueueAdapter');
    this.queues = new Map();
    this.subscribers = new Map();
    this.messageCounter = 0;
  }

  async publish(queue: string, message: Record<string, unknown>): Promise<void> {
    this.messageCounter++;
    const queueMessage: QueueMessage = {
      id: this.messageCounter,
      data: message,
      createdAt: new Date(),
    };

    const handler = this.subscribers.get(queue);
    if (handler) {
      // Process immediately if a subscriber exists
      this.logger.debug(`Processing message on queue: ${queue}`, { messageId: queueMessage.id });
      try {
        await handler(message);
        this.logger.debug(`Message processed on queue: ${queue}`, { messageId: queueMessage.id });
      } catch (error) {
        this.logger.error(`Failed to process message on queue: ${queue}`, error, {
          messageId: queueMessage.id,
        });
        // Store for retry
        this.enqueue(queue, queueMessage);
      }
    } else {
      // Buffer the message until a subscriber registers
      this.logger.debug(`Message buffered on queue: ${queue}`, { messageId: queueMessage.id });
      this.enqueue(queue, queueMessage);
    }
  }

  async subscribe(
    queue: string,
    handler: (message: Record<string, unknown>) => Promise<void>,
  ): Promise<void> {
    this.subscribers.set(queue, handler);
    this.logger.info(`Subscriber registered for queue: ${queue}`);

    // Process any buffered messages
    const buffered = this.queues.get(queue);
    if (buffered && buffered.length > 0) {
      this.logger.info(`Processing ${buffered.length} buffered messages on queue: ${queue}`);
      const messages = [...buffered];
      this.queues.set(queue, []);

      for (const msg of messages) {
        try {
          await handler(msg.data);
        } catch (error) {
          this.logger.error(`Failed to process buffered message on queue: ${queue}`, error, {
            messageId: msg.id,
          });
        }
      }
    }
  }

  private enqueue(queue: string, message: QueueMessage): void {
    const existing = this.queues.get(queue) ?? [];
    existing.push(message);
    this.queues.set(queue, existing);
  }
}
