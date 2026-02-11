import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { Event } from '../../../domain/events/entities/Event';
import { EventBirth } from '../../../domain/events/entities/EventBirth';
import { EventCategory, BirthType, BirthDifficulty, Vitality } from '../../../domain/events/enums';
import { SyncStatus } from '../../../domain/animals/enums';
import { Weight } from '../../../domain/animals/value-objects/Weight';
import { IEventRepository } from '../../../domain/events/repositories/IEventRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { RegisterEventBirthInputDTO, EventBirthResponseDTO } from '../dtos/EventDTOs';
import { EventMapper } from '../mappers/EventMapper';

export class RegisterEventBirth implements IUseCase<RegisterEventBirthInputDTO, EventBirthResponseDTO> {
  constructor(
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(input: RegisterEventBirthInputDTO): Promise<Result<EventBirthResponseDTO>> {
    try {
      // Check for duplicate offline event
      if (input.offlineId) {
        const existing = await this.eventRepository.findByOfflineId(input.offlineId);
        if (existing) {
          return Result.fail<EventBirthResponseDTO>('Event with this offlineId already exists');
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

      // Create birth detail entity
      const birthDetail = EventBirth.create({
        eventId: savedEvent.id,
        birthType: input.birthType as BirthType,
        birthDifficulty: input.birthDifficulty as BirthDifficulty,
        vitality: input.vitality as Vitality,
        confirmedMotherId: input.confirmedMotherId ? new UniqueId(input.confirmedMotherId) : undefined,
        birthWeight: input.birthWeight ? Weight.create(input.birthWeight) : undefined,
        birthObservations: input.birthObservations,
      });

      return Result.ok<EventBirthResponseDTO>(EventMapper.toBirthDTO(savedEvent, birthDetail));
    } catch (error) {
      return Result.fail<EventBirthResponseDTO>(
        error instanceof Error ? error.message : 'Failed to register birth event',
      );
    }
  }
}
