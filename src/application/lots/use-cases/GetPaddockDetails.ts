import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IPaddockRepository } from '../../../domain/lots/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { PaddockResponseDTO } from '../dtos/LotDTOs';
import { PaddockMapper } from '../mappers/PaddockMapper';

interface GetPaddockDetailsInputDTO {
  readonly id: string;
}

export class GetPaddockDetails implements IUseCase<GetPaddockDetailsInputDTO, PaddockResponseDTO> {
  constructor(
    private readonly paddockRepository: IPaddockRepository,
  ) {}

  async execute(input: GetPaddockDetailsInputDTO): Promise<Result<PaddockResponseDTO>> {
    try {
      const paddock = await this.paddockRepository.findById(new UniqueId(input.id));
      if (!paddock) {
        return Result.fail<PaddockResponseDTO>('Paddock not found');
      }

      return Result.ok<PaddockResponseDTO>(PaddockMapper.toDTO(paddock));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error getting paddock details';
      return Result.fail<PaddockResponseDTO>(message);
    }
  }
}
