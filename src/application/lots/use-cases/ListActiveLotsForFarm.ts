import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { ILotRepository } from '../../../domain/lots/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { LotResponseDTO } from '../dtos/LotDTOs';
import { LotMapper } from '../mappers/LotMapper';

interface ListActiveLotsForFarmInputDTO {
  readonly farmId: string;
}

export class ListActiveLotsForFarm implements IUseCase<ListActiveLotsForFarmInputDTO, LotResponseDTO[]> {
  constructor(
    private readonly lotRepository: ILotRepository,
  ) {}

  async execute(input: ListActiveLotsForFarmInputDTO): Promise<Result<LotResponseDTO[]>> {
    try {
      const farmId = new UniqueId(input.farmId);
      const lots = await this.lotRepository.findActive(farmId);
      const items = lots.map(LotMapper.toDTO);

      return Result.ok<LotResponseDTO[]>(items);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error listing active lots';
      return Result.fail<LotResponseDTO[]>(message);
    }
  }
}
