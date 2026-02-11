import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { Event } from '../../../domain/events/entities/Event';
import { EventReproduction } from '../../../domain/events/entities/EventReproduction';
import { EventCategory, ServiceType, ReproductionResult, DiagnosisMethod } from '../../../domain/events/enums';
import { SyncStatus } from '../../../domain/animals/enums';
import { EstimatedBirthDateCalculatorService } from '../../../domain/events/services/EstimatedBirthDateCalculatorService';
import { IEventRepository } from '../../../domain/events/repositories/IEventRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { RegisterEventReproductionInputDTO, EventReproductionResponseDTO } from '../dtos/EventDTOs';
import { EventMapper } from '../mappers/EventMapper';

export class RegisterEventReproduction implements IUseCase<RegisterEventReproductionInputDTO, EventReproductionResponseDTO> {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly birthDateCalculator: EstimatedBirthDateCalculatorService,
  ) {}

  async execute(input: RegisterEventReproductionInputDTO): Promise<Result<EventReproductionResponseDTO>> {
    try {
      // Check for duplicate offline event
      if (input.offlineId) {
        const existing = await this.eventRepository.findByOfflineId(input.offlineId);
        if (existing) {
          return Result.fail<EventReproductionResponseDTO>('Event with this offlineId already exists');
        }
      }

      // Calculate estimated birth date if this is a service event and no estimated date provided
      let estimatedBirthDate: Date | undefined = input.estimatedBirthDate
        ? new Date(input.estimatedBirthDate)
        : undefined;

      if (!estimatedBirthDate && input.serviceType) {
        estimatedBirthDate = this.birthDateCalculator.calculateEstimatedBirthDate(new Date(input.eventDate));
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

      // Create reproduction detail entity
      const reproductionDetail = EventReproduction.create({
        eventId: savedEvent.id,
        serviceType: input.serviceType ? input.serviceType as ServiceType : undefined,
        studId: input.studId ? new UniqueId(input.studId) : undefined,
        result: input.result ? input.result as ReproductionResult : undefined,
        diagnosisDate: input.diagnosisDate ? new Date(input.diagnosisDate) : undefined,
        diagnosisMethod: input.diagnosisMethod ? input.diagnosisMethod as DiagnosisMethod : undefined,
        estimatedBirthDate,
        attemptNumber: input.attemptNumber ?? 1,
      });

      return Result.ok<EventReproductionResponseDTO>(
        EventMapper.toReproductionDTO(savedEvent, reproductionDetail),
      );
    } catch (error) {
      return Result.fail<EventReproductionResponseDTO>(
        error instanceof Error ? error.message : 'Failed to register reproduction event',
      );
    }
  }
}
