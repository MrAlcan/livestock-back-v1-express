import { IEventTypeRepository } from '../../../domain/events/repositories/IEventTypeRepository';
import { EventType } from '../../../domain/events/entities/EventType';

export class InMemoryEventTypeRepository implements IEventTypeRepository {
  private items: Map<string, EventType> = new Map();

  async findByCode(code: string): Promise<EventType | null> {
    return this.items.get(code) ?? null;
  }

  async findByCategory(category: string): Promise<EventType[]> {
    return Array.from(this.items.values()).filter((et) => et.category === category);
  }

  async findAll(): Promise<EventType[]> {
    return Array.from(this.items.values());
  }

  async findActive(): Promise<EventType[]> {
    return Array.from(this.items.values()).filter((et) => et.active);
  }

  async create(eventType: EventType): Promise<EventType> {
    this.items.set(eventType.code, eventType);
    return eventType;
  }

  async update(eventType: EventType): Promise<EventType> {
    this.items.set(eventType.code, eventType);
    return eventType;
  }

  // Test helpers
  clear(): void {
    this.items.clear();
  }

  getAll(): EventType[] {
    return Array.from(this.items.values());
  }
}
