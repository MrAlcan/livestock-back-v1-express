import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { Event } from '../../../domain/events/entities/Event';
import { EventHealth } from '../../../domain/events/entities/EventHealth';
import { EventCategory, AdministrationRoute, TreatmentResult } from '../../../domain/events/enums';
import { SyncStatus } from '../../../domain/animals/enums';
import { IEventRepository } from '../../../domain/events/repositories/IEventRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { RegisterEventHealthInputDTO, EventResponseDTO } from '../dtos/EventDTOs';
import { EventMapper } from '../mappers/EventMapper';

export class RegisterEventHealth implements IUseCase<RegisterEventHealthInputDTO, EventResponseDTO> {
  constructor(
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(input: RegisterEventHealthInputDTO): Promise<Result<EventResponseDTO>> {
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

      // Create health detail entity (for validation purposes)
      EventHealth.create({
        eventId: savedEvent.id,
        productId: new UniqueId(input.productId),
        productBatch: input.productBatch,
        appliedDose: input.appliedDose,
        doseUnit: input.doseUnit,
        administrationRoute: input.administrationRoute
          ? input.administrationRoute as AdministrationRoute
          : undefined,
        applicationSite: input.applicationSite,
        treatmentResult: input.treatmentResult
          ? input.treatmentResult as TreatmentResult
          : undefined,
        requiresFollowUp: input.requiresFollowUp ?? false,
        nextCheckDate: input.nextCheckDate ? new Date(input.nextCheckDate) : undefined,
      });

      return Result.ok<EventResponseDTO>(EventMapper.toDTO(savedEvent));
    } catch (error) {
      return Result.fail<EventResponseDTO>(
        error instanceof Error ? error.message : 'Failed to register health event',
      );
    }
  }
}
