import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { ILotRepository } from '../../../domain/lots/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { LotResponseDTO } from '../dtos/LotDTOs';
import { LotMapper } from '../mappers/LotMapper';

interface UpdateLotAverageWeightInputDTO {
  readonly lotId: string;
  readonly newAverageWeight: number;
}

export class UpdateLotAverageWeight implements IUseCase<UpdateLotAverageWeightInputDTO, LotResponseDTO> {
  constructor(
    private readonly lotRepository: ILotRepository,
  ) {}

  async execute(input: UpdateLotAverageWeightInputDTO): Promise<Result<LotResponseDTO>> {
    try {
      if (input.newAverageWeight <= 0) {
        return Result.fail<LotResponseDTO>('Average weight must be positive');
      }

      const lotId = new UniqueId(input.lotId);
      const lot = await this.lotRepository.findById(lotId);
      if (!lot) {
        return Result.fail<LotResponseDTO>('Lot not found');
      }

      lot.updateAverageWeight(input.newAverageWeight);

      const saved = await this.lotRepository.update(lot);

      return Result.ok<LotResponseDTO>(LotMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error updating lot average weight';
      return Result.fail<LotResponseDTO>(message);
    }
  }
}
