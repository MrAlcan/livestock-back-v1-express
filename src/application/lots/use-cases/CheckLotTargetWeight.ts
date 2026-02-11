import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { ILotRepository } from '../../../domain/lots/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { LotMetricsResponseDTO } from '../dtos/LotDTOs';

interface CheckLotTargetWeightInputDTO {
  readonly lotId: string;
}

export class CheckLotTargetWeight implements IUseCase<CheckLotTargetWeightInputDTO, LotMetricsResponseDTO> {
  constructor(
    private readonly lotRepository: ILotRepository,
  ) {}

  async execute(input: CheckLotTargetWeightInputDTO): Promise<Result<LotMetricsResponseDTO>> {
    try {
      const lotId = new UniqueId(input.lotId);
      const lot = await this.lotRepository.findById(lotId);
      if (!lot) {
        return Result.fail<LotMetricsResponseDTO>('Lot not found');
      }

      const now = new Date();
      const daysActive = Math.floor(
        (now.getTime() - lot.creationDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      const metrics: LotMetricsResponseDTO = {
        lotId: lot.id.value,
        animalCount: lot.currentQuantity,
        averageWeight: lot.currentAverageWeight,
        targetWeight: lot.targetWeight,
        daysActive,
        hasReachedTarget: lot.hasReachedTargetWeight(),
      };

      return Result.ok<LotMetricsResponseDTO>(metrics);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error checking lot target weight';
      return Result.fail<LotMetricsResponseDTO>(message);
    }
  }
}
