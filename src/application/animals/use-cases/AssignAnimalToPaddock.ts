import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IAnimalRepository } from '../../../domain/animals/repositories/IAnimalRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { AssignAnimalToPaddockInputDTO, AnimalResponseDTO } from '../dtos/AnimalDTOs';
import { AnimalMapper } from '../mappers/AnimalMapper';

export class AssignAnimalToPaddock implements IUseCase<AssignAnimalToPaddockInputDTO, AnimalResponseDTO> {
  constructor(
    private readonly animalRepository: IAnimalRepository,
  ) {}

  async execute(input: AssignAnimalToPaddockInputDTO): Promise<Result<AnimalResponseDTO>> {
    try {
      const animal = await this.animalRepository.findById(new UniqueId(input.animalId));
      if (!animal) {
        return Result.fail<AnimalResponseDTO>('Animal not found');
      }

      animal.assignToPaddock(new UniqueId(input.paddockId));

      const saved = await this.animalRepository.update(animal);
      return Result.ok<AnimalResponseDTO>(AnimalMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error assigning animal to paddock';
      return Result.fail<AnimalResponseDTO>(message);
    }
  }
}
