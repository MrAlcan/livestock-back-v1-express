import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { ReproductionResult } from '../../../domain/events/enums';
import { IUseCase } from '../../shared/types/IUseCase';
import { IEventBus } from '../../shared/ports/IEventBus';
import { RecordDiagnosisInputDTO, ReproductiveCycleResponseDTO } from '../dtos/ReproductionDTOs';
import { ReproductionCycleMapper } from '../mappers/ReproductionCycleMapper';
import { IReproductionCycleRepository } from '../services/IReproductionCycleRepository';

export class RecordDiagnosis
  implements IUseCase<RecordDiagnosisInputDTO, ReproductiveCycleResponseDTO>
{
  constructor(
    private readonly reproductionCycleRepository: IReproductionCycleRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(
    input: RecordDiagnosisInputDTO,
  ): Promise<Result<ReproductiveCycleResponseDTO>> {
    try {
      const femaleId = new UniqueId(input.femaleId);
      const diagnosisDate = new Date(input.diagnosisDate);

      // Find the active cycle for this female
      const cycles = await this.reproductionCycleRepository.findByFemale(femaleId);
      const activeCycle = cycles.find(
        (c) => c.result === ReproductionResult.SERVICED || c.result === ReproductionResult.PENDING,
      );

      if (!activeCycle) {
        return Result.fail<ReproductiveCycleResponseDTO>(
          'No active reproductive cycle found for this female',
        );
      }

      if (diagnosisDate < activeCycle.serviceDate) {
        return Result.fail<ReproductiveCycleResponseDTO>(
          'Diagnosis date cannot be before the service date',
        );
      }

      const updatedCycle = {
        ...activeCycle,
        diagnosisDate,
        result: input.result,
        estimatedBirthDate: input.estimatedBirthDate
          ? new Date(input.estimatedBirthDate)
          : activeCycle.estimatedBirthDate,
      };

      const saved = await this.reproductionCycleRepository.update(updatedCycle);

      return Result.ok<ReproductiveCycleResponseDTO>(ReproductionCycleMapper.toDTO(saved));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unexpected error recording diagnosis';
      return Result.fail<ReproductiveCycleResponseDTO>(message);
    }
  }
}
