import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IAnimalRepository } from '../../../domain/animals/repositories/IAnimalRepository';
import { Weight } from '../../../domain/animals/value-objects/Weight';
import { IUseCase } from '../../shared/types/IUseCase';
import { UpdateAnimalWeightInputDTO, AnimalResponseDTO } from '../dtos/AnimalDTOs';
import { AnimalMapper } from '../mappers/AnimalMapper';

export class UpdateAnimalWeight implements IUseCase<UpdateAnimalWeightInputDTO, AnimalResponseDTO> {
  constructor(
    private readonly animalRepository: IAnimalRepository,
  ) {}

  async execute(input: UpdateAnimalWeightInputDTO): Promise<Result<AnimalResponseDTO>> {
    try {
      const animal = await this.animalRepository.findById(new UniqueId(input.id));
      if (!animal) {
        return Result.fail<AnimalResponseDTO>('Animal not found');
      }

      const weight = Weight.create(input.weight);
      const date = new Date(input.date);

      animal.updateWeight(weight, date);

      const saved = await this.animalRepository.update(animal);
      return Result.ok<AnimalResponseDTO>(AnimalMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error updating weight';
      return Result.fail<AnimalResponseDTO>(message);
    }
  }
}
