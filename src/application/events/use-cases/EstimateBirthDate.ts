import { Result } from '../../../domain/shared/Result';
import { EstimatedBirthDateCalculatorService } from '../../../domain/events/services/EstimatedBirthDateCalculatorService';
import { IUseCase } from '../../shared/types/IUseCase';
import { EstimatedBirthDateResponseDTO } from '../dtos/EventDTOs';

interface EstimateBirthDateInputDTO {
  readonly serviceDate: string;
}

export class EstimateBirthDate implements IUseCase<EstimateBirthDateInputDTO, EstimatedBirthDateResponseDTO> {
  private static readonly GESTATION_DAYS = 283;

  constructor(
    private readonly birthDateCalculator: EstimatedBirthDateCalculatorService,
  ) {}

  async execute(input: EstimateBirthDateInputDTO): Promise<Result<EstimatedBirthDateResponseDTO>> {
    try {
      const serviceDate = new Date(input.serviceDate);

      if (isNaN(serviceDate.getTime())) {
        return Result.fail<EstimatedBirthDateResponseDTO>('Invalid service date');
      }

      const estimatedBirthDate = this.birthDateCalculator.calculateEstimatedBirthDate(serviceDate);

      return Result.ok<EstimatedBirthDateResponseDTO>({
        serviceDate: serviceDate.toISOString(),
        estimatedBirthDate: estimatedBirthDate.toISOString(),
        gestationDays: EstimateBirthDate.GESTATION_DAYS,
      });
    } catch (error) {
      return Result.fail<EstimatedBirthDateResponseDTO>(
        error instanceof Error ? error.message : 'Failed to estimate birth date',
      );
    }
  }
}
