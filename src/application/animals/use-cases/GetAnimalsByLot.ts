import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IAnimalRepository } from '../../../domain/animals/repositories/IAnimalRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { AnimalResponseDTO } from '../dtos/AnimalDTOs';
import { AnimalMapper } from '../mappers/AnimalMapper';

interface GetAnimalsByLotInput {
  readonly lotId: string;
}

export class GetAnimalsByLot implements IUseCase<GetAnimalsByLotInput, AnimalResponseDTO[]> {
  constructor(
    private readonly animalRepository: IAnimalRepository,
  ) {}

  async execute(input: GetAnimalsByLotInput): Promise<Result<AnimalResponseDTO[]>> {
    try {
      const animals = await this.animalRepository.findByLot(new UniqueId(input.lotId));
      const items = animals.map(AnimalMapper.toDTO);
      return Result.ok<AnimalResponseDTO[]>(items);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error getting animals by lot';
      return Result.fail<AnimalResponseDTO[]>(message);
    }
  }
}
