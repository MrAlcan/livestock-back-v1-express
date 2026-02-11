import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IGenealogyRepository } from '../../../domain/animals/repositories/IGenealogyRepository';
import { IAnimalRepository } from '../../../domain/animals/repositories/IAnimalRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { GenealogyResponseDTO } from '../dtos/AnimalDTOs';
import { GenealogyMapper } from '../mappers/GenealogyMapper';

interface GetGenealogyTreeInput {
  readonly animalId: string;
}

export class GetGenealogyTree implements IUseCase<GetGenealogyTreeInput, GenealogyResponseDTO[]> {
  constructor(
    private readonly genealogyRepository: IGenealogyRepository,
    private readonly animalRepository: IAnimalRepository,
  ) {}

  async execute(input: GetGenealogyTreeInput): Promise<Result<GenealogyResponseDTO[]>> {
    try {
      const animalId = new UniqueId(input.animalId);

      const animal = await this.animalRepository.findById(animalId);
      if (!animal) {
        return Result.fail<GenealogyResponseDTO[]>('Animal not found');
      }

      const genealogies = await this.genealogyRepository.findByAnimal(animalId);
      const items = genealogies.map(GenealogyMapper.toDTO);

      return Result.ok<GenealogyResponseDTO[]>(items);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error getting genealogy tree';
      return Result.fail<GenealogyResponseDTO[]>(message);
    }
  }
}
