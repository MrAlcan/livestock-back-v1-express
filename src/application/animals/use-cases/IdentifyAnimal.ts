import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IAnimalRepository } from '../../../domain/animals/repositories/IAnimalRepository';
import { OfficialId } from '../../../domain/animals/value-objects/OfficialId';
import { IUseCase } from '../../shared/types/IUseCase';
import { IEventBus } from '../../shared/ports/IEventBus';
import { AnimalIdentifiedEvent } from '../../../domain/animals/events';
import { IdentifyAnimalInputDTO, AnimalResponseDTO } from '../dtos/AnimalDTOs';
import { AnimalMapper } from '../mappers/AnimalMapper';

export class IdentifyAnimal implements IUseCase<IdentifyAnimalInputDTO, AnimalResponseDTO> {
  constructor(
    private readonly animalRepository: IAnimalRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: IdentifyAnimalInputDTO): Promise<Result<AnimalResponseDTO>> {
    try {
      const animal = await this.animalRepository.findById(new UniqueId(input.id));
      if (!animal) {
        return Result.fail<AnimalResponseDTO>('Animal not found');
      }

      const newOfficialId = OfficialId.create(input.officialId);

      // Check uniqueness of the new official ID
      const existing = await this.animalRepository.findByOfficialId(newOfficialId);
      if (existing && !existing.id.equals(animal.id)) {
        return Result.fail<AnimalResponseDTO>('An animal with this official ID already exists');
      }

      const previousId = animal.officialId?.value;
      animal.updateIdentification(newOfficialId);

      const saved = await this.animalRepository.update(animal);

      await this.eventBus.publish(
        new AnimalIdentifiedEvent({
          animalId: saved.id,
          previousId,
          newOfficialId: input.officialId,
        }),
      );

      return Result.ok<AnimalResponseDTO>(AnimalMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error identifying animal';
      return Result.fail<AnimalResponseDTO>(message);
    }
  }
}
