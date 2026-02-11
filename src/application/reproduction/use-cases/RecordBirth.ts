import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { ReproductionResult } from '../../../domain/events/enums';
import { Weight } from '../../../domain/animals/value-objects/Weight';
import { IUseCase } from '../../shared/types/IUseCase';
import { IEventBus } from '../../shared/ports/IEventBus';
import { RecordBirthInputDTO, ReproductiveCycleResponseDTO } from '../dtos/ReproductionDTOs';
import { ReproductionCycleMapper } from '../mappers/ReproductionCycleMapper';
import { IReproductionCycleRepository } from '../services/IReproductionCycleRepository';

export class RecordBirth
  implements IUseCase<RecordBirthInputDTO, ReproductiveCycleResponseDTO>
{
  constructor(
    private readonly reproductionCycleRepository: IReproductionCycleRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(
    input: RecordBirthInputDTO,
  ): Promise<Result<ReproductiveCycleResponseDTO>> {
    try {
      const femaleId = new UniqueId(input.femaleId);
      const actualBirthDate = new Date(input.actualBirthDate);

      // Find the pregnant cycle for this female
      const cycles = await this.reproductionCycleRepository.findByFemale(femaleId);
      const pregnantCycle = cycles.find(
        (c) => c.result === ReproductionResult.PREGNANT,
      );

      if (!pregnantCycle) {
        return Result.fail<ReproductiveCycleResponseDTO>(
          'No pregnant cycle found for this female',
        );
      }

      if (actualBirthDate < pregnantCycle.serviceDate) {
        return Result.fail<ReproductiveCycleResponseDTO>(
          'Birth date cannot be before the service date',
        );
      }

      const updatedCycle = {
        ...pregnantCycle,
        actualBirthDate,
        calfId: input.calfId ? new UniqueId(input.calfId) : undefined,
        weaningWeight: input.birthWeight ? Weight.create(input.birthWeight) : pregnantCycle.weaningWeight,
      };

      const saved = await this.reproductionCycleRepository.update(updatedCycle);

      return Result.ok<ReproductiveCycleResponseDTO>(ReproductionCycleMapper.toDTO(saved));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unexpected error recording birth';
      return Result.fail<ReproductiveCycleResponseDTO>(message);
    }
  }
}
