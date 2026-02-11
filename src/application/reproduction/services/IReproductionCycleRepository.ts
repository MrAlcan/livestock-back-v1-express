import { UniqueId } from '../../../domain/shared/Entity';
import { ReproductionCycle } from '../../../domain/reproduction/entities';

export interface IReproductionCycleRepository {
  findByFemale(femaleId: UniqueId): Promise<ReproductionCycle[]>;
  findActiveCycles(farmId: UniqueId): Promise<ReproductionCycle[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<ReproductionCycle[]>;
  create(cycle: ReproductionCycle): Promise<ReproductionCycle>;
  update(cycle: ReproductionCycle): Promise<ReproductionCycle>;
}
