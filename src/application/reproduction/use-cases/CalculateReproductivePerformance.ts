import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { ReproductionResult } from '../../../domain/events/enums';
import { calculateGestationDays } from '../../../domain/reproduction/entities';
import { ReproductionKPICalculatorService } from '../../../domain/reproduction/services';
import { IUseCase } from '../../shared/types/IUseCase';
import { ReproductivePerformanceResponseDTO } from '../dtos/ReproductionDTOs';
import { IReproductionCycleRepository } from '../services/IReproductionCycleRepository';

interface CalculateReproductivePerformanceInputDTO {
  readonly femaleId: string;
}

export class CalculateReproductivePerformance
  implements IUseCase<CalculateReproductivePerformanceInputDTO, ReproductivePerformanceResponseDTO>
{
  constructor(
    private readonly reproductionCycleRepository: IReproductionCycleRepository,
    private readonly kpiCalculator: ReproductionKPICalculatorService,
  ) {}

  async execute(
    input: CalculateReproductivePerformanceInputDTO,
  ): Promise<Result<ReproductivePerformanceResponseDTO>> {
    try {
      const femaleId = new UniqueId(input.femaleId);
      const cycles = await this.reproductionCycleRepository.findByFemale(femaleId);

      if (cycles.length === 0) {
        return Result.ok<ReproductivePerformanceResponseDTO>({
          femaleId: input.femaleId,
          totalCycles: 0,
          successfulCycles: 0,
          failedCycles: 0,
          fertilityRate: 0,
        });
      }

      const totalCycles = cycles.length;
      const successfulCycles = cycles.filter(
        (c) => c.result === ReproductionResult.PREGNANT || c.actualBirthDate !== undefined,
      ).length;
      const failedCycles = cycles.filter(
        (c) => c.result === ReproductionResult.EMPTY,
      ).length;

      const fertilityRate = this.kpiCalculator.calculatePregnancyRate(
        successfulCycles,
        totalCycles,
      );

      // Calculate average gestation days from cycles that have actual birth dates
      const gestationDaysList = cycles
        .map(calculateGestationDays)
        .filter((days): days is number => days !== null);

      const averageGestationDays =
        gestationDaysList.length > 0
          ? Math.round(
              gestationDaysList.reduce((sum, days) => sum + days, 0) / gestationDaysList.length,
            )
          : undefined;

      // Calculate average calving interval from cycles with actual birth dates
      const birthDates = cycles
        .filter((c) => c.actualBirthDate !== undefined)
        .map((c) => c.actualBirthDate!.getTime())
        .sort((a, b) => a - b);

      let averageCalvingInterval: number | undefined;
      if (birthDates.length >= 2) {
        const intervals: number[] = [];
        for (let i = 1; i < birthDates.length; i++) {
          const diffDays = Math.floor(
            (birthDates[i] - birthDates[i - 1]) / (1000 * 60 * 60 * 24),
          );
          intervals.push(diffDays);
        }
        averageCalvingInterval = Math.round(
          intervals.reduce((sum, d) => sum + d, 0) / intervals.length,
        );
      }

      return Result.ok<ReproductivePerformanceResponseDTO>({
        femaleId: input.femaleId,
        totalCycles,
        successfulCycles,
        failedCycles,
        fertilityRate,
        averageGestationDays,
        averageCalvingInterval,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unexpected error calculating reproductive performance';
      return Result.fail<ReproductivePerformanceResponseDTO>(message);
    }
  }
}
