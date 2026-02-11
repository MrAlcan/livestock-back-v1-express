import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { ILotRepository } from '../../../domain/lots/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { LotResponseDTO } from '../dtos/LotDTOs';
import { LotMapper } from '../mappers/LotMapper';

interface GetLotDetailsInputDTO {
  readonly id: string;
}

export class GetLotDetails implements IUseCase<GetLotDetailsInputDTO, LotResponseDTO> {
  constructor(
    private readonly lotRepository: ILotRepository,
  ) {}

  async execute(input: GetLotDetailsInputDTO): Promise<Result<LotResponseDTO>> {
    try {
      const lot = await this.lotRepository.findById(new UniqueId(input.id));
      if (!lot) {
        return Result.fail<LotResponseDTO>('Lot not found');
      }

      return Result.ok<LotResponseDTO>(LotMapper.toDTO(lot));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error getting lot details';
      return Result.fail<LotResponseDTO>(message);
    }
  }
}
