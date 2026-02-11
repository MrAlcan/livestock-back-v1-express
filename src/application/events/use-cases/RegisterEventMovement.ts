import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { Event } from '../../../domain/events/entities/Event';
import { EventMovement } from '../../../domain/events/entities/EventMovement';
import { EventCategory, MovementType } from '../../../domain/events/enums';
import { SyncStatus } from '../../../domain/animals/enums';
import { Weight } from '../../../domain/animals/value-objects/Weight';
import { IEventRepository } from '../../../domain/events/repositories/IEventRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { RegisterEventMovementInputDTO, EventResponseDTO } from '../dtos/EventDTOs';
import { EventMapper } from '../mappers/EventMapper';

export class RegisterEventMovement implements IUseCase<RegisterEventMovementInputDTO, EventResponseDTO> {
  constructor(
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(input: RegisterEventMovementInputDTO): Promise<Result<EventResponseDTO>> {
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

      // Create movement detail entity (for validation purposes)
      EventMovement.create({
        eventId: savedEvent.id,
        movementType: input.movementType as MovementType,
        originLotId: input.originLotId ? new UniqueId(input.originLotId) : undefined,
        destinationLotId: input.destinationLotId ? new UniqueId(input.destinationLotId) : undefined,
        originPaddockId: input.originPaddockId ? new UniqueId(input.originPaddockId) : undefined,
        destinationPaddockId: input.destinationPaddockId ? new UniqueId(input.destinationPaddockId) : undefined,
        reason: input.reason,
        weightAtMovement: input.weightAtMovement ? Weight.create(input.weightAtMovement) : undefined,
      });

      return Result.ok<EventResponseDTO>(EventMapper.toDTO(savedEvent));
    } catch (error) {
      return Result.fail<EventResponseDTO>(
        error instanceof Error ? error.message : 'Failed to register movement event',
      );
    }
  }
}
