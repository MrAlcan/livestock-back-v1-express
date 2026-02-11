import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IAnimalRepository } from '../../../domain/animals/repositories/IAnimalRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { IEventBus } from '../../shared/ports/IEventBus';
import { MarkAnimalAsSoldInputDTO, AnimalResponseDTO } from '../dtos/AnimalDTOs';
import { AnimalMapper } from '../mappers/AnimalMapper';

export class MarkAnimalAsSold implements IUseCase<MarkAnimalAsSoldInputDTO, AnimalResponseDTO> {
  constructor(
    private readonly animalRepository: IAnimalRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: MarkAnimalAsSoldInputDTO): Promise<Result<AnimalResponseDTO>> {
    try {
      const animal = await this.animalRepository.findById(new UniqueId(input.id));
      if (!animal) {
        return Result.fail<AnimalResponseDTO>('Animal not found');
      }

      const date = new Date(input.date);
      animal.markAsSold(date);

      const saved = await this.animalRepository.update(animal);

      // Publish domain events if any accumulated on the aggregate
      if (saved.domainEvents.length > 0) {
        await this.eventBus.publishAll(saved.domainEvents);
        saved.clearDomainEvents();
      }

      return Result.ok<AnimalResponseDTO>(AnimalMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error marking animal as sold';
      return Result.fail<AnimalResponseDTO>(message);
    }
  }
}
