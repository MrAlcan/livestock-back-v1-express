import { Result } from '../../../domain/shared/Result';
import { IBreedRepository } from '../../../domain/animals/repositories/IBreedRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { BreedResponseDTO } from '../dtos/AnimalDTOs';
import { BreedMapper } from '../mappers/BreedMapper';

interface ListBreedsInput {
  readonly activeOnly?: boolean;
}

export class ListBreeds implements IUseCase<ListBreedsInput, BreedResponseDTO[]> {
  constructor(
    private readonly breedRepository: IBreedRepository,
  ) {}

  async execute(input: ListBreedsInput): Promise<Result<BreedResponseDTO[]>> {
    try {
      const breeds = input.activeOnly
        ? await this.breedRepository.findActive()
        : await this.breedRepository.findAll();

      const items = breeds.map(BreedMapper.toDTO);
      return Result.ok<BreedResponseDTO[]>(items);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error listing breeds';
      return Result.fail<BreedResponseDTO[]>(message);
    }
  }
}
