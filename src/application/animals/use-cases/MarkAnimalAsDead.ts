import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IAnimalRepository } from '../../../domain/animals/repositories/IAnimalRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { IEventBus } from '../../shared/ports/IEventBus';
import { AnimalDiedEvent } from '../../../domain/animals/events';
import { MarkAnimalAsDeadInputDTO, AnimalResponseDTO } from '../dtos/AnimalDTOs';
import { AnimalMapper } from '../mappers/AnimalMapper';

export class MarkAnimalAsDead implements IUseCase<MarkAnimalAsDeadInputDTO, AnimalResponseDTO> {
  constructor(
    private readonly animalRepository: IAnimalRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: MarkAnimalAsDeadInputDTO): Promise<Result<AnimalResponseDTO>> {
    try {
      const animal = await this.animalRepository.findById(new UniqueId(input.id));
      if (!animal) {
        return Result.fail<AnimalResponseDTO>('Animal not found');
      }

      const date = new Date(input.date);
      animal.markAsDead(input.cause, date);

      const saved = await this.animalRepository.update(animal);

      await this.eventBus.publish(
        new AnimalDiedEvent({
          animalId: saved.id,
          cause: input.cause,
          date,
          farmId: saved.farmId,
        }),
      );

      return Result.ok<AnimalResponseDTO>(AnimalMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error marking animal as dead';
      return Result.fail<AnimalResponseDTO>(message);
    }
  }
}
