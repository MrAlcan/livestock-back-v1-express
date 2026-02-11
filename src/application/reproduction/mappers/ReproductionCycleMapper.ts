import { ReproductionCycle, calculateGestationDays } from '../../../domain/reproduction/entities';
import { ReproductiveCycleResponseDTO } from '../dtos/ReproductionDTOs';

export class ReproductionCycleMapper {
  static toDTO(cycle: ReproductionCycle): ReproductiveCycleResponseDTO {
    return {
      femaleId: cycle.femaleId.value,
      studId: cycle.studId?.value,
      serviceDate: cycle.serviceDate.toISOString(),
      serviceType: cycle.serviceType,
      diagnosisDate: cycle.diagnosisDate?.toISOString(),
      result: cycle.result,
      estimatedBirthDate: cycle.estimatedBirthDate?.toISOString(),
      actualBirthDate: cycle.actualBirthDate?.toISOString(),
      calfId: cycle.calfId?.value,
      weaningDate: cycle.weaningDate?.toISOString(),
      weaningWeight: cycle.weaningWeight?.kilograms,
      gestationDays: calculateGestationDays(cycle) ?? undefined,
    };
  }
}
