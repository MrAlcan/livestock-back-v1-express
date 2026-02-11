import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { InbreedingCalculatorService } from '../../../domain/animals/services/InbreedingCalculatorService';
import { IAnimalRepository } from '../../../domain/animals/repositories/IAnimalRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { InbreedingResultDTO } from '../dtos/AnimalDTOs';

interface CalculateInbreedingInput {
  readonly animal1Id: string;
  readonly animal2Id: string;
}

export class CalculateInbreeding implements IUseCase<CalculateInbreedingInput, InbreedingResultDTO> {
  constructor(
    private readonly inbreedingCalculator: InbreedingCalculatorService,
    private readonly animalRepository: IAnimalRepository,
  ) {}

  async execute(input: CalculateInbreedingInput): Promise<Result<InbreedingResultDTO>> {
    try {
      const animal1Id = new UniqueId(input.animal1Id);
      const animal2Id = new UniqueId(input.animal2Id);

      // Validate that both animals exist
      const [animal1, animal2] = await Promise.all([
        this.animalRepository.findById(animal1Id),
        this.animalRepository.findById(animal2Id),
      ]);

      if (!animal1) {
        return Result.fail<InbreedingResultDTO>('First animal not found');
      }
      if (!animal2) {
        return Result.fail<InbreedingResultDTO>('Second animal not found');
      }

      const coefficient = await this.inbreedingCalculator.calculateInbreedingCoefficient(
        animal1Id,
        animal2Id,
      );

      const riskLevel = this.determineRiskLevel(coefficient);

      return Result.ok<InbreedingResultDTO>({
        animal1Id: input.animal1Id,
        animal2Id: input.animal2Id,
        coefficient,
        riskLevel,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error calculating inbreeding';
      return Result.fail<InbreedingResultDTO>(message);
    }
  }

  private determineRiskLevel(coefficient: number): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (coefficient < 0.0625) {
      return 'LOW';
    }
    if (coefficient < 0.25) {
      return 'MEDIUM';
    }
    return 'HIGH';
  }
}
