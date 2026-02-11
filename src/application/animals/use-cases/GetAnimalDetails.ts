import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IAnimalRepository } from '../../../domain/animals/repositories/IAnimalRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { AnimalResponseDTO } from '../dtos/AnimalDTOs';
import { AnimalMapper } from '../mappers/AnimalMapper';

interface GetAnimalDetailsInput {
  readonly id: string;
}

export class GetAnimalDetails implements IUseCase<GetAnimalDetailsInput, AnimalResponseDTO> {
  constructor(
    private readonly animalRepository: IAnimalRepository,
  ) {}

  async execute(input: GetAnimalDetailsInput): Promise<Result<AnimalResponseDTO>> {
    try {
      const animal = await this.animalRepository.findById(new UniqueId(input.id));
      if (!animal) {
        return Result.fail<AnimalResponseDTO>('Animal not found');
      }

      return Result.ok<AnimalResponseDTO>(AnimalMapper.toDTO(animal));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error getting animal details';
      return Result.fail<AnimalResponseDTO>(message);
    }
  }
}
