import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IPaddockRepository } from '../../../domain/lots/repositories';
import { IUseCase } from '../../shared/types/IUseCase';

interface DeletePaddockInputDTO {
  readonly id: string;
}

export class DeletePaddock implements IUseCase<DeletePaddockInputDTO, void> {
  constructor(
    private readonly paddockRepository: IPaddockRepository,
  ) {}

  async execute(input: DeletePaddockInputDTO): Promise<Result<void>> {
    try {
      const paddockId = new UniqueId(input.id);
      const paddock = await this.paddockRepository.findById(paddockId);
      if (!paddock) {
        return Result.fail<void>('Paddock not found');
      }

      await this.paddockRepository.delete(paddockId);

      return Result.ok<void>();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error deleting paddock';
      return Result.fail<void>(message);
    }
  }
}
