import { Event } from '../../../domain/events/entities/Event';
import { EventBirth } from '../../../domain/events/entities/EventBirth';
import { EventWeighing } from '../../../domain/events/entities/EventWeighing';
import { EventReproduction } from '../../../domain/events/entities/EventReproduction';
import {
  EventResponseDTO,
  EventBirthResponseDTO,
  EventWeighingResponseDTO,
  EventReproductionResponseDTO,
} from '../dtos/EventDTOs';

export class EventMapper {
  static toDTO(event: Event): EventResponseDTO {
    return {
      id: event.id.value,
      sequenceNumber: event.sequenceNumber?.toString(),
      animalId: event.animalId.value,
      registeredBy: event.registeredBy.value,
      eventDate: event.eventDate.toISOString(),
      localRegistrationDate: event.localRegistrationDate.toISOString(),
      syncDate: event.syncDate?.toISOString(),
      eventType: event.eventType,
      eventCategory: event.eventCategory,
      lotContext: event.lotContext?.value,
      paddockContext: event.paddockContext?.value,
      gpsLocation: event.gpsLocation,
      deviceId: event.deviceId,
      offlineId: event.offlineId,
      isManual: event.isManual,
      observations: event.observations,
      syncStatus: event.syncStatus,
    };
  }

  static toBirthDTO(event: Event, birth: EventBirth): EventBirthResponseDTO {
    return {
      ...EventMapper.toDTO(event),
      birthType: birth.birthType,
      birthDifficulty: birth.birthDifficulty,
      birthWeight: birth.birthWeight?.kilograms,
      vitality: birth.vitality,
      confirmedMotherId: birth.confirmedMotherId?.value,
    };
  }

  static toWeighingDTO(event: Event, weighing: EventWeighing): EventWeighingResponseDTO {
    return {
      ...EventMapper.toDTO(event),
      weight: weighing.weightKg.kilograms,
      weighingType: weighing.weighingType,
      bodyCondition: weighing.bodyCondition,
      adg: weighing.adgSincePrevious?.kgPerDay,
      daysSincePrevious: weighing.daysSincePrevious,
    };
  }

  static toReproductionDTO(event: Event, reproduction: EventReproduction): EventReproductionResponseDTO {
    return {
      ...EventMapper.toDTO(event),
      serviceType: reproduction.serviceType,
      studId: reproduction.studId?.value,
      result: reproduction.result,
      diagnosisDate: reproduction.diagnosisDate?.toISOString(),
      estimatedBirthDate: reproduction.estimatedBirthDate?.toISOString(),
      attemptNumber: reproduction.attemptNumber,
    };
  }
}
