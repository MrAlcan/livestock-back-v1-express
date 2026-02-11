import { UniqueId } from '../../shared/Entity';
import { ILotRepository, IPaddockRepository } from '../repositories';
import { Paddock } from '../entities/Paddock';

export interface LotPerformanceKPIs {
  averageADG: number;
  averageInitialWeight: number;
  averageFinalWeight: number;
  averageTotalGain: number;
  averageFatteningDays: number;
  feedConversion?: number;
}

export interface SortingResult {
  punta: string[];   // Top 30%
  medio: string[];   // Middle 40%
  cola: string[];    // Bottom 30%
}

export class SortingStrategyService {
  categorizeByWeight(animalWeights: Array<{ animalId: string; weight: number }>): SortingResult {
    const sorted = [...animalWeights].sort((a, b) => b.weight - a.weight);
    const total = sorted.length;
    const puntaCut = Math.ceil(total * 0.3);
    const colaCut = Math.ceil(total * 0.3);

    return {
      punta: sorted.slice(0, puntaCut).map(a => a.animalId),
      medio: sorted.slice(puntaCut, total - colaCut).map(a => a.animalId),
      cola: sorted.slice(total - colaCut).map(a => a.animalId),
    };
  }
}

export class PastureRotationPlannerService {
  constructor(private readonly paddockRepository: IPaddockRepository) {}

  async suggestNextPaddock(currentPaddockId: UniqueId, farmId: UniqueId, lotSize: number): Promise<Paddock | null> {
    const paddocks = await this.paddockRepository.findAvailable(farmId);
    const candidates = paddocks.filter(p =>
      !p.id.equals(currentPaddockId) &&
      !p.needsRest() &&
      p.canReceiveAnimals(lotSize)
    );

    if (candidates.length === 0) return null;

    // Return the first suitable paddock
    return candidates[0];
  }
}
