import { DomainEvent } from '../../../domain/shared/DomainEvent';

export interface IEventBus {
  publish(event: DomainEvent): Promise<void>;
  publishAll(events: ReadonlyArray<DomainEvent>): Promise<void>;
  subscribe(eventName: string, handler: (event: DomainEvent) => Promise<void>): void;
}
