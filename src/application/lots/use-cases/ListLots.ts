import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { createPagination } from '../../../domain/shared/Pagination';
import { ILotRepository, LotFilters } from '../../../domain/lots/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { PaginatedResponseDTO, createPaginatedResponse, PaginationInputDTO } from '../../shared/dtos/PaginationDTO';
import { LotFiltersInputDTO, LotResponseDTO } from '../dtos/LotDTOs';
import { LotMapper } from '../mappers/LotMapper';

interface ListLotsInputDTO {
  readonly filters: LotFiltersInputDTO;
  readonly pagination?: PaginationInputDTO;
}

export class ListLots implements IUseCase<ListLotsInputDTO, PaginatedResponseDTO<LotResponseDTO>> {
  constructor(
    private readonly lotRepository: ILotRepository,
  ) {}

  async execute(input: ListLotsInputDTO): Promise<Result<PaginatedResponseDTO<LotResponseDTO>>> {
    try {
      const page = input.pagination?.page ?? 1;
      const pageSize = input.pagination?.pageSize ?? 20;
      const pagination = createPagination(page, pageSize);

      const filters: LotFilters = {
        type: input.filters.type,
        status: input.filters.status,
        search: input.filters.search,
      };

      const farmId = new UniqueId(input.filters.farmId);
      const lots = await this.lotRepository.findByFarm(farmId, filters);

      // Apply pagination manually since findByFarm returns all results
      const total = lots.length;
      const paginatedLots = lots.slice(pagination.offset, pagination.offset + pagination.limit);
      const items = paginatedLots.map(LotMapper.toDTO);

      return Result.ok<PaginatedResponseDTO<LotResponseDTO>>(
        createPaginatedResponse(items, total, page, pageSize),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error listing lots';
      return Result.fail<PaginatedResponseDTO<LotResponseDTO>>(message);
    }
  }
}
