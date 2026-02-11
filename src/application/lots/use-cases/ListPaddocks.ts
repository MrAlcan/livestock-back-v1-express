import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { createPagination } from '../../../domain/shared/Pagination';
import { IPaddockRepository, PaddockFilters } from '../../../domain/lots/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { PaginatedResponseDTO, createPaginatedResponse, PaginationInputDTO } from '../../shared/dtos/PaginationDTO';
import { PaddockFiltersInputDTO, PaddockResponseDTO } from '../dtos/LotDTOs';
import { PaddockMapper } from '../mappers/PaddockMapper';

interface ListPaddocksInputDTO {
  readonly filters: PaddockFiltersInputDTO;
  readonly pagination?: PaginationInputDTO;
}

export class ListPaddocks implements IUseCase<ListPaddocksInputDTO, PaginatedResponseDTO<PaddockResponseDTO>> {
  constructor(
    private readonly paddockRepository: IPaddockRepository,
  ) {}

  async execute(input: ListPaddocksInputDTO): Promise<Result<PaginatedResponseDTO<PaddockResponseDTO>>> {
    try {
      const page = input.pagination?.page ?? 1;
      const pageSize = input.pagination?.pageSize ?? 20;
      const pagination = createPagination(page, pageSize);

      const filters: PaddockFilters = {
        pastureCondition: input.filters.pastureCondition,
        hasWater: input.filters.hasWater,
        hasShade: input.filters.hasShade,
        search: input.filters.search,
      };

      const farmId = new UniqueId(input.filters.farmId);
      const paddocks = await this.paddockRepository.findByFarm(farmId);

      // Apply filters manually
      let filtered = paddocks;
      if (filters.pastureCondition) {
        filtered = filtered.filter(p => p.pastureCondition === filters.pastureCondition);
      }
      if (filters.hasWater !== undefined) {
        filtered = filtered.filter(p => p.hasWater === filters.hasWater);
      }
      if (filters.hasShade !== undefined) {
        filtered = filtered.filter(p => p.hasShade === filters.hasShade);
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(
          p => p.name.toLowerCase().includes(search) || p.code.toLowerCase().includes(search),
        );
      }

      const total = filtered.length;
      const paginatedPaddocks = filtered.slice(pagination.offset, pagination.offset + pagination.limit);
      const items = paginatedPaddocks.map(PaddockMapper.toDTO);

      return Result.ok<PaginatedResponseDTO<PaddockResponseDTO>>(
        createPaginatedResponse(items, total, page, pageSize),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error listing paddocks';
      return Result.fail<PaginatedResponseDTO<PaddockResponseDTO>>(message);
    }
  }
}
