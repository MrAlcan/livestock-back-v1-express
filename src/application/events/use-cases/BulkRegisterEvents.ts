import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { Event } from '../../../domain/events/entities/Event';
import { EventCategory } from '../../../domain/events/enums';
import { SyncStatus } from '../../../domain/animals/enums';
import { IEventRepository } from '../../../domain/events/repositories/IEventRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { RegisterEventInputDTO, EventResponseDTO } from '../dtos/EventDTOs';
import { EventMapper } from '../mappers/EventMapper';

interface BulkRegisterEventsInputDTO {
  readonly events: RegisterEventInputDTO[];
}

export class BulkRegisterEvents implements IUseCase<BulkRegisterEventsInputDTO, EventResponseDTO[]> {
  constructor(
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(input: BulkRegisterEventsInputDTO): Promise<Result<EventResponseDTO[]>> {
    try {
      if (!input.events || input.events.length === 0) {
        return Result.fail<EventResponseDTO[]>('No events provided for bulk registration');
      }

      // Check for duplicate offline IDs in the batch
      const offlineIds = input.events
        .map((e) => e.offlineId)
        .filter((id): id is string => id !== undefined);
      const uniqueOfflineIds = new Set(offlineIds);
      if (offlineIds.length !== uniqueOfflineIds.size) {
        return Result.fail<EventResponseDTO[]>('Duplicate offlineIds found in the batch');
      }

      // Check for existing offline IDs in the database
      for (const offlineId of offlineIds) {
        const existing = await this.eventRepository.findByOfflineId(offlineId);
        if (existing) {
          return Result.fail<EventResponseDTO[]>(
            `Event with offlineId '${offlineId}' already exists`,
          );
        }
      }

      // Create all event entities
      const eventEntities: Event[] = [];
      for (const eventInput of input.events) {
        const event = Event.create({
          animalId: new UniqueId(eventInput.animalId),
          registeredBy: new UniqueId(eventInput.registeredBy),
          eventDate: new Date(eventInput.eventDate),
          localRegistrationDate: new Date(),
          eventType: eventInput.eventType,
          eventCategory: eventInput.eventCategory as EventCategory,
          lotContext: eventInput.lotContext ? new UniqueId(eventInput.lotContext) : undefined,
          paddockContext: eventInput.paddockContext ? new UniqueId(eventInput.paddockContext) : undefined,
          gpsLocation: eventInput.gpsLocation,
          deviceId: eventInput.deviceId,
          offlineId: eventInput.offlineId,
          isManual: eventInput.isManual ?? true,
          observations: eventInput.observations,
          syncStatus: SyncStatus.PENDING,
        });
        eventEntities.push(event);
      }

      // Persist all events in bulk
      const savedEvents = await this.eventRepository.bulkCreate(eventEntities);

      const eventDTOs = savedEvents.map((event) => EventMapper.toDTO(event));

      return Result.ok<EventResponseDTO[]>(eventDTOs);
    } catch (error) {
      return Result.fail<EventResponseDTO[]>(
        error instanceof Error ? error.message : 'Failed to bulk register events',
      );
    }
  }
}
