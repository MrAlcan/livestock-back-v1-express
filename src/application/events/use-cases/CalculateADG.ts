import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { Weight } from '../../../domain/animals/value-objects/Weight';
import { ADGCalculatorService } from '../../../domain/events/services/ADGCalculatorService';
import { IUseCase } from '../../shared/types/IUseCase';
import { ADGCalculationResponseDTO } from '../dtos/EventDTOs';

interface CalculateADGInputDTO {
  readonly animalId: string;
  readonly startWeight: number;
  readonly endWeight: number;
  readonly days: number;
}

export class CalculateADG implements IUseCase<CalculateADGInputDTO, ADGCalculationResponseDTO> {
  constructor(
    private readonly adgCalculator: ADGCalculatorService,
  ) {}

  async execute(input: CalculateADGInputDTO): Promise<Result<ADGCalculationResponseDTO>> {
    try {
      if (input.days <= 0) {
        return Result.fail<ADGCalculationResponseDTO>('Days must be a positive number');
      }

      const startWeight = Weight.create(input.startWeight);
      const endWeight = Weight.create(input.endWeight);

      const adg = this.adgCalculator.calculateADG(endWeight, startWeight, input.days);

      return Result.ok<ADGCalculationResponseDTO>({
        animalId: input.animalId,
        startWeight: startWeight.kilograms,
        endWeight: endWeight.kilograms,
        days: input.days,
        adg: adg.kgPerDay,
      });
    } catch (error) {
      return Result.fail<ADGCalculationResponseDTO>(
        error instanceof Error ? error.message : 'Failed to calculate ADG',
      );
    }
  }
}
