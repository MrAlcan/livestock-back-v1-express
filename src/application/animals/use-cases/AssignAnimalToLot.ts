import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IAnimalRepository } from '../../../domain/animals/repositories/IAnimalRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { IEventBus } from '../../shared/ports/IEventBus';
import { AnimalMovedToLotEvent } from '../../../domain/animals/events';
import { AssignAnimalToLotInputDTO, AnimalResponseDTO } from '../dtos/AnimalDTOs';
import { AnimalMapper } from '../mappers/AnimalMapper';

export class AssignAnimalToLot implements IUseCase<AssignAnimalToLotInputDTO, AnimalResponseDTO> {
  constructor(
    private readonly animalRepository: IAnimalRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: AssignAnimalToLotInputDTO): Promise<Result<AnimalResponseDTO>> {
    try {
      const animal = await this.animalRepository.findById(new UniqueId(input.animalId));
      if (!animal) {
        return Result.fail<AnimalResponseDTO>('Animal not found');
      }

      const previousLotId = animal.currentLotId;
      const newLotId = new UniqueId(input.lotId);

      animal.assignToLot(newLotId);

      const saved = await this.animalRepository.update(animal);

      await this.eventBus.publish(
        new AnimalMovedToLotEvent({
          animalId: saved.id,
          fromLotId: previousLotId,
          toLotId: newLotId,
        }),
      );

      return Result.ok<AnimalResponseDTO>(AnimalMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error assigning animal to lot';
      return Result.fail<AnimalResponseDTO>(message);
    }
  }
}
