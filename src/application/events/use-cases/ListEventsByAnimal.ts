import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { createPagination } from '../../../domain/shared/Pagination';
import { IEventRepository } from '../../../domain/events/repositories/IEventRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { PaginationInputDTO } from '../../shared/dtos/PaginationDTO';
import { EventResponseDTO } from '../dtos/EventDTOs';
import { EventMapper } from '../mappers/EventMapper';

interface ListEventsByAnimalInputDTO {
  readonly animalId: string;
  readonly pagination?: PaginationInputDTO;
}

export class ListEventsByAnimal implements IUseCase<ListEventsByAnimalInputDTO, EventResponseDTO[]> {
  constructor(
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(input: ListEventsByAnimalInputDTO): Promise<Result<EventResponseDTO[]>> {
    try {
      const pagination = createPagination(
        input.pagination?.page,
        input.pagination?.pageSize,
      );

      const events = await this.eventRepository.findByAnimal(
        new UniqueId(input.animalId),
        pagination,
      );

      const eventDTOs = events.map((event) => EventMapper.toDTO(event));

      return Result.ok<EventResponseDTO[]>(eventDTOs);
    } catch (error) {
      return Result.fail<EventResponseDTO[]>(
        error instanceof Error ? error.message : 'Failed to list events by animal',
      );
    }
  }
}
