import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { SyncStatus } from '../../../domain/animals/enums';
import { IEventRepository, EventFilters } from '../../../domain/events/repositories/IEventRepository';
import { Event } from '../../../domain/events/entities/Event';
import { EventWeighing } from '../../../domain/events/entities/EventWeighing';
import { EventReproduction } from '../../../domain/events/entities/EventReproduction';

export class InMemoryEventRepository implements IEventRepository {
  private items: Map<string, Event> = new Map();
  private weighings: Map<string, EventWeighing> = new Map();
  private reproductions: Map<string, EventReproduction> = new Map();

  async findById(id: UniqueId): Promise<Event | null> {
    return this.items.get(id.value) ?? null;
  }

  async findByAnimal(animalId: UniqueId, pagination: Pagination): Promise<Event[]> {
    const filtered = Array.from(this.items.values()).filter(
      (e) => e.animalId.value === animalId.value,
    );
    return filtered.slice(pagination.offset, pagination.offset + pagination.limit);
  }

  async findByAnimalAndType(animalId: UniqueId, eventType: string): Promise<Event[]> {
    return Array.from(this.items.values()).filter(
      (e) => e.animalId.value === animalId.value && e.eventType === eventType,
    );
  }

  async findByFarm(farmId: UniqueId, filters: EventFilters, pagination: Pagination): Promise<Event[]> {
    // Events don't have farmId directly; we filter by context if available.
    // For in-memory testing, we assume events belong to a farm via their lotContext or we store all.
    let result = Array.from(this.items.values());
    if (filters.eventType) {
      result = result.filter((e) => e.eventType === filters.eventType);
    }
    if (filters.eventCategory) {
      result = result.filter((e) => e.eventCategory === filters.eventCategory);
    }
    if (filters.startDate) {
      result = result.filter((e) => e.eventDate >= filters.startDate!);
    }
    if (filters.endDate) {
      result = result.filter((e) => e.eventDate <= filters.endDate!);
    }
    if (filters.animalId) {
      result = result.filter((e) => e.animalId.value === filters.animalId);
    }
    if (filters.syncStatus) {
      result = result.filter((e) => e.syncStatus === filters.syncStatus);
    }
    return result.slice(pagination.offset, pagination.offset + pagination.limit);
  }

  async findPendingSync(): Promise<Event[]> {
    return Array.from(this.items.values()).filter(
      (e) => e.syncStatus === SyncStatus.PENDING,
    );
  }

  async findByOfflineId(offlineId: string): Promise<Event | null> {
    const all = Array.from(this.items.values());
    return all.find((e) => e.offlineId === offlineId) ?? null;
  }

  async getLastWeighing(animalId: UniqueId): Promise<EventWeighing | null> {
    // Find events for this animal that have a weighing record
    const animalEvents = Array.from(this.items.values())
      .filter((e) => e.animalId.value === animalId.value)
      .sort((a, b) => b.eventDate.getTime() - a.eventDate.getTime());

    for (const event of animalEvents) {
      const weighing = this.weighings.get(event.id.value);
      if (weighing) {
        return weighing;
      }
    }
    return null;
  }

  async getLastReproductionEvent(animalId: UniqueId): Promise<EventReproduction | null> {
    const animalEvents = Array.from(this.items.values())
      .filter((e) => e.animalId.value === animalId.value)
      .sort((a, b) => b.eventDate.getTime() - a.eventDate.getTime());

    for (const event of animalEvents) {
      const reproduction = this.reproductions.get(event.id.value);
      if (reproduction) {
        return reproduction;
      }
    }
    return null;
  }

  async create(event: Event): Promise<Event> {
    this.items.set(event.id.value, event);
    return event;
  }

  async bulkCreate(events: Event[]): Promise<Event[]> {
    for (const event of events) {
      this.items.set(event.id.value, event);
    }
    return events;
  }

  async updateSyncStatus(eventId: UniqueId, status: SyncStatus): Promise<void> {
    const event = this.items.get(eventId.value);
    if (event && status === SyncStatus.SYNCED) {
      event.markAsSynced(new Date());
    }
  }

  // Test helpers for associated detail records
  addWeighing(weighing: EventWeighing): void {
    this.weighings.set(weighing.eventId.value, weighing);
  }

  addReproduction(reproduction: EventReproduction): void {
    this.reproductions.set(reproduction.eventId.value, reproduction);
  }

  clear(): void {
    this.items.clear();
    this.weighings.clear();
    this.reproductions.clear();
  }

  getAll(): Event[] {
    return Array.from(this.items.values());
  }
}
