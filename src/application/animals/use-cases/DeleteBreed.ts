import { Result } from '../../../domain/shared/Result';
import { IBreedRepository } from '../../../domain/animals/repositories/IBreedRepository';
import { IUseCase } from '../../shared/types/IUseCase';

interface DeleteBreedInput {
  readonly id: number;
}

export class DeleteBreed implements IUseCase<DeleteBreedInput, void> {
  constructor(
    private readonly breedRepository: IBreedRepository,
  ) {}

  async execute(input: DeleteBreedInput): Promise<Result<void>> {
    try {
      const existing = await this.breedRepository.findById(input.id);
      if (!existing) {
        return Result.fail<void>('Breed not found');
      }

      await this.breedRepository.delete(input.id);
      return Result.ok<void>();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error deleting breed';
      return Result.fail<void>(message);
    }
  }
}
