import { Result } from '../../../domain/shared/Result';
import { IBreedRepository } from '../../../domain/animals/repositories/IBreedRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { BreedResponseDTO } from '../dtos/AnimalDTOs';
import { BreedMapper } from '../mappers/BreedMapper';

interface GetBreedDetailsInput {
  readonly id: number;
}

export class GetBreedDetails implements IUseCase<GetBreedDetailsInput, BreedResponseDTO> {
  constructor(
    private readonly breedRepository: IBreedRepository,
  ) {}

  async execute(input: GetBreedDetailsInput): Promise<Result<BreedResponseDTO>> {
    try {
      const breed = await this.breedRepository.findById(input.id);
      if (!breed) {
        return Result.fail<BreedResponseDTO>('Breed not found');
      }

      return Result.ok<BreedResponseDTO>(BreedMapper.toDTO(breed));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error getting breed details';
      return Result.fail<BreedResponseDTO>(message);
    }
  }
}
