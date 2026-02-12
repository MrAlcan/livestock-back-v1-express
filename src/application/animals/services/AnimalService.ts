import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IAnimalRepository } from '../../../domain/animals/repositories/IAnimalRepository';
import { IBreedRepository } from '../../../domain/animals/repositories/IBreedRepository';
import { IGenealogyRepository } from '../../../domain/animals/repositories/IGenealogyRepository';
import { AnimalResponseDTO, BreedResponseDTO } from '../dtos/AnimalDTOs';
import { AnimalMapper } from '../mappers/AnimalMapper';
import { BreedMapper } from '../mappers/BreedMapper';

export class AnimalService {
  constructor(
    private readonly animalRepository: IAnimalRepository,
    private readonly breedRepository: IBreedRepository,
    private readonly genealogyRepository: IGenealogyRepository,
  ) {}

  async getAnimalWithBreed(animalId: string): Promise<Result<{ animal: AnimalResponseDTO; breed?: BreedResponseDTO }>> {
    try {
      const animal = await this.animalRepository.findById(new UniqueId(animalId));
      if (!animal) {
        return Result.fail('Animal not found');
      }

      const animalDTO = AnimalMapper.toDTO(animal);
      let breedDTO: BreedResponseDTO | undefined;

      if (animal.breedId) {
        const breed = await this.breedRepository.findById(animal.breedId);
        if (breed) {
          breedDTO = BreedMapper.toDTO(breed);
        }
      }

      return Result.ok({ animal: animalDTO, breed: breedDTO });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error';
      return Result.fail(message);
    }
  }

  async getOffspring(animalId: string): Promise<Result<AnimalResponseDTO[]>> {
    try {
      const id = new UniqueId(animalId);
      const animal = await this.animalRepository.findById(id);
      if (!animal) {
        return Result.fail('Animal not found');
      }

      const offspring = animal.isFemale()
        ? await this.animalRepository.findByMother(id)
        : await this.animalRepository.findByFather(id);

      const items = offspring.map(AnimalMapper.toDTO);
      return Result.ok(items);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error';
      return Result.fail(message);
    }
  }

  async getParents(animalId: string): Promise<Result<{ mother?: AnimalResponseDTO; father?: AnimalResponseDTO }>> {
    try {
      const animal = await this.animalRepository.findById(new UniqueId(animalId));
      if (!animal) {
        return Result.fail('Animal not found');
      }

      let motherDTO: AnimalResponseDTO | undefined;
      let fatherDTO: AnimalResponseDTO | undefined;

      if (animal.motherId) {
        const mother = await this.animalRepository.findById(animal.motherId);
        if (mother) {
          motherDTO = AnimalMapper.toDTO(mother);
        }
      }

      if (animal.fatherId) {
        const father = await this.animalRepository.findById(animal.fatherId);
        if (father) {
          fatherDTO = AnimalMapper.toDTO(father);
        }
      }

      return Result.ok({ mother: motherDTO, father: fatherDTO });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error';
      return Result.fail(message);
    }
  }

  async countAnimalsByFarm(farmId: string): Promise<Result<number>> {
    try {
      const count = await this.animalRepository.countByFarm(new UniqueId(farmId), {});
      return Result.ok(count);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error';
      return Result.fail(message);
    }
  }
}
