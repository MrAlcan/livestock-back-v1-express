import { Result } from '../../../domain/shared/Result';
import { createPagination } from '../../../domain/shared/Pagination';
import { IHealthTaskRepository, TaskFilters } from '../../../domain/health/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { PaginationInputDTO } from '../../shared/dtos/PaginationDTO';
import { TaskFiltersInputDTO, HealthTaskResponseDTO } from '../dtos/HealthDTOs';
import { HealthTaskMapper } from '../mappers/HealthTaskMapper';

interface ListHealthTasksInput {
  readonly filters: TaskFiltersInputDTO;
  readonly pagination: PaginationInputDTO;
}

export class ListHealthTasks implements IUseCase<ListHealthTasksInput, HealthTaskResponseDTO[]> {
  constructor(
    private readonly healthTaskRepository: IHealthTaskRepository,
  ) {}

  async execute(input: ListHealthTasksInput): Promise<Result<HealthTaskResponseDTO[]>> {
    try {
      const pagination = createPagination(input.pagination.page, input.pagination.pageSize);

      const filters: TaskFilters = {
        type: input.filters.type,
        priority: input.filters.priority,
        status: input.filters.status,
        assignedTo: input.filters.assignedTo,
        search: input.filters.search,
      };

      const tasks = await this.healthTaskRepository.findAll(filters, pagination);
      const dtos = tasks.map(HealthTaskMapper.toDTO);

      return Result.ok<HealthTaskResponseDTO[]>(dtos);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error listing health tasks';
      return Result.fail<HealthTaskResponseDTO[]>(message);
    }
  }
}
