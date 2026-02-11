import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { Event } from '../../../domain/events/entities/Event';
import { EventWeighing } from '../../../domain/events/entities/EventWeighing';
import { EventCategory, WeighingType } from '../../../domain/events/enums';
import { SyncStatus } from '../../../domain/animals/enums';
import { Weight } from '../../../domain/animals/value-objects/Weight';
import { ADGCalculatorService } from '../../../domain/events/services/ADGCalculatorService';
import { IEventRepository } from '../../../domain/events/repositories/IEventRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { RegisterEventWeighingInputDTO, EventWeighingResponseDTO } from '../dtos/EventDTOs';
import { EventMapper } from '../mappers/EventMapper';

export class RegisterEventWeighing implements IUseCase<RegisterEventWeighingInputDTO, EventWeighingResponseDTO> {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly adgCalculator: ADGCalculatorService,
  ) {}

  async execute(input: RegisterEventWeighingInputDTO): Promise<Result<EventWeighingResponseDTO>> {
    try {
      // Check for duplicate offline event
      if (input.offlineId) {
        const existing = await this.eventRepository.findByOfflineId(input.offlineId);
        if (existing) {
          return Result.fail<EventWeighingResponseDTO>('Event with this offlineId already exists');
        }
      }

      const currentWeight = Weight.create(input.weight);

      // Try to calculate ADG from the last weighing
      const lastWeighing = await this.eventRepository.getLastWeighing(new UniqueId(input.animalId));
      let adgSincePrevious = undefined;
      let daysSincePrevious = undefined;
      let previousWeighingId = undefined;

      if (lastWeighing) {
        previousWeighingId = lastWeighing.eventId;
        // Find the previous event to get the event date
        const previousEvent = await this.eventRepository.findById(lastWeighing.eventId);
        if (previousEvent) {
          const eventDate = new Date(input.eventDate);
          const diffMs = eventDate.getTime() - previousEvent.eventDate.getTime();
          daysSincePrevious = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          if (daysSincePrevious > 0) {
            try {
              adgSincePrevious = this.adgCalculator.calculateADG(
                currentWeight,
                lastWeighing.weightKg,
                daysSincePrevious,
              );
            } catch {
              // ADG calculation may fail if values are out of range; continue without ADG
            }
          }
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

      // Create weighing detail entity
      const weighingDetail = EventWeighing.create({
        eventId: savedEvent.id,
        weightKg: currentWeight,
        weighingType: input.weighingType as WeighingType,
        bodyCondition: input.bodyCondition,
        adgSincePrevious,
        daysSincePrevious,
        previousWeighingId,
        scaleDevice: input.scaleDevice,
      });

      return Result.ok<EventWeighingResponseDTO>(EventMapper.toWeighingDTO(savedEvent, weighingDetail));
    } catch (error) {
      return Result.fail<EventWeighingResponseDTO>(
        error instanceof Error ? error.message : 'Failed to register weighing event',
      );
    }
  }
}
