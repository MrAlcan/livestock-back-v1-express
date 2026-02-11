import { UniqueId } from './Entity';

export abstract class DomainEvent {
  public readonly occurredAt: Date;
  public readonly aggregateId?: UniqueId;

  constructor(aggregateId?: UniqueId, occurredAt?: Date) {
    this.occurredAt = occurredAt ?? new Date();
    this.aggregateId = aggregateId;
  }

  abstract get eventName(): string;
}
