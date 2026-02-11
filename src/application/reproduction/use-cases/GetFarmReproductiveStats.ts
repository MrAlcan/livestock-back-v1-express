import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { ReproductionResult } from '../../../domain/events/enums';
import { calculateGestationDays } from '../../../domain/reproduction/entities';
import { ReproductionKPICalculatorService } from '../../../domain/reproduction/services';
import { IUseCase } from '../../shared/types/IUseCase';
import { FarmReproductiveStatsResponseDTO } from '../dtos/ReproductionDTOs';
import { IReproductionCycleRepository } from '../services/IReproductionCycleRepository';

interface GetFarmReproductiveStatsInputDTO {
  readonly farmId: string;
}

export class GetFarmReproductiveStats
  implements IUseCase<GetFarmReproductiveStatsInputDTO, FarmReproductiveStatsResponseDTO>
{
  constructor(
    private readonly reproductionCycleRepository: IReproductionCycleRepository,
    private readonly kpiCalculator: ReproductionKPICalculatorService,
  ) {}

  async execute(
    input: GetFarmReproductiveStatsInputDTO,
  ): Promise<Result<FarmReproductiveStatsResponseDTO>> {
    try {
      const farmId = new UniqueId(input.farmId);
      const activeCycles = await this.reproductionCycleRepository.findActiveCycles(farmId);

      // Unique females with active cycles
      const uniqueFemaleIds = new Set(activeCycles.map((c) => c.femaleId.value));
      const totalFemales = uniqueFemaleIds.size;

      // Active females are those with a cycle in SERVICED or PREGNANT status
      const activeFemaleIds = new Set(
        activeCycles
          .filter(
            (c) =>
              c.result === ReproductionResult.SERVICED ||
              c.result === ReproductionResult.PREGNANT,
          )
          .map((c) => c.femaleId.value),
      );
      const activeFemales = activeFemaleIds.size;

      // Currently pregnant females
      const pregnantFemaleIds = new Set(
        activeCycles
          .filter((c) => c.result === ReproductionResult.PREGNANT)
          .map((c) => c.femaleId.value),
      );
      const currentlyPregnant = pregnantFemaleIds.size;

      const pregnancyRate = this.kpiCalculator.calculatePregnancyRate(
        currentlyPregnant,
        totalFemales,
      );

      // Average gestation days from cycles that have actual birth dates
      const gestationDaysList = activeCycles
        .map(calculateGestationDays)
        .filter((days): days is number => days !== null);

      const averageGestationDays =
        gestationDaysList.length > 0
          ? Math.round(
              gestationDaysList.reduce((sum, days) => sum + days, 0) / gestationDaysList.length,
            )
          : undefined;

      return Result.ok<FarmReproductiveStatsResponseDTO>({
        totalFemales,
        activeFemales,
        currentlyPregnant,
        pregnancyRate,
        averageGestationDays,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unexpected error retrieving farm reproductive stats';
      return Result.fail<FarmReproductiveStatsResponseDTO>(message);
    }
  }
}
