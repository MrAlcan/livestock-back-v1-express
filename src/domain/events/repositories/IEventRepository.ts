import { UniqueId } from '../../shared/Entity';
import { Pagination } from '../../shared/Pagination';
import { SyncStatus } from '../../animals/enums';
import { Event } from '../entities/Event';
import { EventWeighing } from '../entities/EventWeighing';
import { EventReproduction } from '../entities/EventReproduction';

export interface EventFilters {
  readonly eventType?: string;
  readonly eventCategory?: string;
  readonly startDate?: Date;
  readonly endDate?: Date;
  readonly animalId?: string;
  readonly syncStatus?: string;
}

export interface IEventRepository {
  findById(id: UniqueId): Promise<Event | null>;
  findByAnimal(animalId: UniqueId, pagination: Pagination): Promise<Event[]>;
  findByAnimalAndType(animalId: UniqueId, eventType: string): Promise<Event[]>;
  findByFarm(farmId: UniqueId, filters: EventFilters, pagination: Pagination): Promise<Event[]>;
  findPendingSync(): Promise<Event[]>;
  findByOfflineId(offlineId: string): Promise<Event | null>;
  getLastWeighing(animalId: UniqueId): Promise<EventWeighing | null>;
  getLastReproductionEvent(animalId: UniqueId): Promise<EventReproduction | null>;
  create(event: Event): Promise<Event>;
  bulkCreate(events: Event[]): Promise<Event[]>;
  updateSyncStatus(eventId: UniqueId, status: SyncStatus): Promise<void>;
}
