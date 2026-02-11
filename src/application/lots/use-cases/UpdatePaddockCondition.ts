import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { PastureCondition } from '../../../domain/lots/enums';
import { IPaddockRepository } from '../../../domain/lots/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { PaddockResponseDTO } from '../dtos/LotDTOs';
import { PaddockMapper } from '../mappers/PaddockMapper';

interface UpdatePaddockConditionInputDTO {
  readonly paddockId: string;
  readonly newCondition: PastureCondition;
}

export class UpdatePaddockCondition implements IUseCase<UpdatePaddockConditionInputDTO, PaddockResponseDTO> {
  constructor(
    private readonly paddockRepository: IPaddockRepository,
  ) {}

  async execute(input: UpdatePaddockConditionInputDTO): Promise<Result<PaddockResponseDTO>> {
    try {
      const paddock = await this.paddockRepository.findById(new UniqueId(input.paddockId));
      if (!paddock) {
        return Result.fail<PaddockResponseDTO>('Paddock not found');
      }

      paddock.updateCondition(input.newCondition);

      const saved = await this.paddockRepository.update(paddock);

      return Result.ok<PaddockResponseDTO>(PaddockMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error updating paddock condition';
      return Result.fail<PaddockResponseDTO>(message);
    }
  }
}
