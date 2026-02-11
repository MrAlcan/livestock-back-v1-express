import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { ReproductionResult } from '../../../domain/events/enums';
import { Weight } from '../../../domain/animals/value-objects/Weight';
import { IUseCase } from '../../shared/types/IUseCase';
import { IEventBus } from '../../shared/ports/IEventBus';
import { RecordWeaningInputDTO, ReproductiveCycleResponseDTO } from '../dtos/ReproductionDTOs';
import { ReproductionCycleMapper } from '../mappers/ReproductionCycleMapper';
import { IReproductionCycleRepository } from '../services/IReproductionCycleRepository';

export class RecordWeaning
  implements IUseCase<RecordWeaningInputDTO, ReproductiveCycleResponseDTO>
{
  constructor(
    private readonly reproductionCycleRepository: IReproductionCycleRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(
    input: RecordWeaningInputDTO,
  ): Promise<Result<ReproductiveCycleResponseDTO>> {
    try {
      const femaleId = new UniqueId(input.femaleId);
      const weaningDate = new Date(input.weaningDate);

      // Find the cycle with a recorded birth for this female
      const cycles = await this.reproductionCycleRepository.findByFemale(femaleId);
      const cycleWithBirth = cycles.find(
        (c) => c.actualBirthDate !== undefined && c.weaningDate === undefined,
      );

      if (!cycleWithBirth) {
        return Result.fail<ReproductiveCycleResponseDTO>(
          'No cycle with a recorded birth (pending weaning) found for this female',
        );
      }

      if (weaningDate < cycleWithBirth.actualBirthDate!) {
        return Result.fail<ReproductiveCycleResponseDTO>(
          'Weaning date cannot be before the birth date',
        );
      }

      const weaningWeight = Weight.create(input.weaningWeight);

      const updatedCycle = {
        ...cycleWithBirth,
        weaningDate,
        weaningWeight,
      };

      const saved = await this.reproductionCycleRepository.update(updatedCycle);

      return Result.ok<ReproductiveCycleResponseDTO>(ReproductionCycleMapper.toDTO(saved));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unexpected error recording weaning';
      return Result.fail<ReproductiveCycleResponseDTO>(message);
    }
  }
}
