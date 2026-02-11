import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { Event } from '../../../domain/events/entities/Event';
import { EventWeaning } from '../../../domain/events/entities/EventWeaning';
import { EventCategory, WeaningType } from '../../../domain/events/enums';
import { SyncStatus } from '../../../domain/animals/enums';
import { Weight } from '../../../domain/animals/value-objects/Weight';
import { IEventRepository } from '../../../domain/events/repositories/IEventRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { RegisterEventWeaningInputDTO, EventResponseDTO } from '../dtos/EventDTOs';
import { EventMapper } from '../mappers/EventMapper';

export class RegisterEventWeaning implements IUseCase<RegisterEventWeaningInputDTO, EventResponseDTO> {
  constructor(
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(input: RegisterEventWeaningInputDTO): Promise<Result<EventResponseDTO>> {
    try {
      // Check for duplicate offline event
      if (input.offlineId) {
        const existing = await this.eventRepository.findByOfflineId(input.offlineId);
        if (existing) {
          return Result.fail<EventResponseDTO>('Event with this offlineId already exists');
        }
      }

      // Create base event entity
      const event = Event.create({
        animalId: new UniqueId(input.animalId),
        registeredBy: new UniqueId(input.registeredBy),
        eventDate: new Date(input.eventDate),
        localRegistrationDate: new Date(),
        eventType: input.eventType,
        eventCategory: input.eventCategory as EventCategory,
        lotContext: input.lotContext ? new UniqueId(input.lotContext) : undefined,
        paddockContext: input.paddockContext ? new UniqueId(input.paddockContext) : undefined,
        gpsLocation: input.gpsLocation,
        deviceId: input.deviceId,
        offlineId: input.offlineId,
        isManual: input.isManual ?? true,
        observations: input.observations,
        syncStatus: SyncStatus.PENDING,
      });

      // Persist the base event
      const savedEvent = await this.eventRepository.create(event);

      // Create weaning detail entity (for validation purposes)
      EventWeaning.create({
        eventId: savedEvent.id,
        weaningWeight: Weight.create(input.weaningWeight),
        ageDays: input.ageDays,
        weaningType: input.weaningType as WeaningType,
        motherPostWeanWeight: input.motherPostWeanWeight
          ? Weight.create(input.motherPostWeanWeight)
          : undefined,
      });

      return Result.ok<EventResponseDTO>(EventMapper.toDTO(savedEvent));
    } catch (error) {
      return Result.fail<EventResponseDTO>(
        error instanceof Error ? error.message : 'Failed to register weaning event',
      );
    }
  }
}
