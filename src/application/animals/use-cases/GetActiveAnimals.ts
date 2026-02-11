import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IAnimalRepository } from '../../../domain/animals/repositories/IAnimalRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { AnimalResponseDTO } from '../dtos/AnimalDTOs';
import { AnimalMapper } from '../mappers/AnimalMapper';

interface GetActiveAnimalsInput {
  readonly farmId: string;
}

export class GetActiveAnimals implements IUseCase<GetActiveAnimalsInput, AnimalResponseDTO[]> {
  constructor(
    private readonly animalRepository: IAnimalRepository,
  ) {}

  async execute(input: GetActiveAnimalsInput): Promise<Result<AnimalResponseDTO[]>> {
    try {
      const animals = await this.animalRepository.findActiveByFarm(new UniqueId(input.farmId));
      const items = animals.map(AnimalMapper.toDTO);
      return Result.ok<AnimalResponseDTO[]>(items);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error getting active animals';
      return Result.fail<AnimalResponseDTO[]>(message);
    }
  }
}
