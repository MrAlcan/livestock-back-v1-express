import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { createPagination } from '../../../domain/shared/Pagination';
import { EventFilters, IEventRepository } from '../../../domain/events/repositories/IEventRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { PaginationInputDTO } from '../../shared/dtos/PaginationDTO';
import { EventFiltersInputDTO, EventResponseDTO } from '../dtos/EventDTOs';
import { EventMapper } from '../mappers/EventMapper';

interface ListEventsByFarmInputDTO {
  readonly filters: EventFiltersInputDTO;
  readonly pagination?: PaginationInputDTO;
}

export class ListEventsByFarm implements IUseCase<ListEventsByFarmInputDTO, EventResponseDTO[]> {
  constructor(
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(input: ListEventsByFarmInputDTO): Promise<Result<EventResponseDTO[]>> {
    try {
      const pagination = createPagination(
        input.pagination?.page,
        input.pagination?.pageSize,
      );

      const filters: EventFilters = {
        eventType: input.filters.eventType,
        eventCategory: input.filters.eventCategory,
        startDate: input.filters.startDate ? new Date(input.filters.startDate) : undefined,
        endDate: input.filters.endDate ? new Date(input.filters.endDate) : undefined,
        animalId: input.filters.animalId,
        syncStatus: input.filters.syncStatus,
      };

      const events = await this.eventRepository.findByFarm(
        new UniqueId(input.filters.farmId),
        filters,
        pagination,
      );

      const eventDTOs = events.map((event) => EventMapper.toDTO(event));

      return Result.ok<EventResponseDTO[]>(eventDTOs);
    } catch (error) {
      return Result.fail<EventResponseDTO[]>(
        error instanceof Error ? error.message : 'Failed to list events by farm',
      );
    }
  }
}
