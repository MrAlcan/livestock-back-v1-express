import { IEventBus } from '../../application/shared/ports/IEventBus';
import { DomainEvent } from '../../domain/shared/DomainEvent';
import { Logger } from '../logging/logger.service';

type EventHandler = (event: DomainEvent) => Promise<void>;

export class InMemoryEventBus implements IEventBus {
  private readonly logger: Logger;
  private readonly handlers: Map<string, EventHandler[]>;

  constructor() {
    this.logger = new Logger('InMemoryEventBus');
    this.handlers = new Map();
  }

  async publish(event: DomainEvent): Promise<void> {
    const eventName = event.eventName;
    const eventHandlers = this.handlers.get(eventName);

    if (!eventHandlers || eventHandlers.length === 0) {
      this.logger.debug(`No handlers registered for event: ${eventName}`);
      return;
    }

    this.logger.info(`Publishing event: ${eventName}`, {
      aggregateId: event.aggregateId?.toString(),
      handlerCount: eventHandlers.length,
    });

    const results = await Promise.allSettled(
      eventHandlers.map((handler) => handler(event)),
    );

    for (const result of results) {
      if (result.status === 'rejected') {
        this.logger.error(
          `Event handler failed for event: ${eventName}`,
          result.reason instanceof Error ? result.reason : new Error(String(result.reason)),
        );
      }
    }
  }

  async publishAll(events: ReadonlyArray<DomainEvent>): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  subscribe(eventName: string, handler: (event: DomainEvent) => Promise<void>): void {
    const existing = this.handlers.get(eventName) ?? [];
    existing.push(handler);
    this.handlers.set(eventName, existing);
    this.logger.debug(`Handler subscribed to event: ${eventName}`, {
      totalHandlers: existing.length,
    });
  }
}
