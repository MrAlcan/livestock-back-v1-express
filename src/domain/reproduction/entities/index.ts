import { UniqueId } from '../../shared/Entity';
import { Weight } from '../../animals/value-objects/Weight';
import { ServiceType, ReproductionResult } from '../../events/enums';

export interface ReproductionCycle {
  femaleId: UniqueId;
  studId?: UniqueId;
  serviceDate: Date;
  serviceType: ServiceType;
  diagnosisDate?: Date;
  result: ReproductionResult;
  estimatedBirthDate?: Date;
  actualBirthDate?: Date;
  calfId?: UniqueId;
  weaningDate?: Date;
  weaningWeight?: Weight;
}

export function isReproductionCycleComplete(cycle: ReproductionCycle): boolean {
  return cycle.weaningDate !== undefined;
}

export function calculateGestationDays(cycle: ReproductionCycle): number | null {
  if (!cycle.actualBirthDate) return null;
  const diffMs = cycle.actualBirthDate.getTime() - cycle.serviceDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}
