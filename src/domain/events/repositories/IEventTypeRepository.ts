import { EventType } from '../entities/EventType';

export interface IEventTypeRepository {
  findByCode(code: string): Promise<EventType | null>;
  findByCategory(category: string): Promise<EventType[]>;
  findAll(): Promise<EventType[]>;
  findActive(): Promise<EventType[]>;
  create(eventType: EventType): Promise<EventType>;
  update(eventType: EventType): Promise<EventType>;
}
