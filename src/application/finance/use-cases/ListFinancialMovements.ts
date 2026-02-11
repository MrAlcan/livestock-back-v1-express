import { Result } from '../../../domain/shared/Result';
import { createPagination } from '../../../domain/shared/Pagination';
import { IFinancialMovementRepository, FinancialFilters } from '../../../domain/finance/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { PaginationInputDTO, PaginatedResponseDTO, createPaginatedResponse } from '../../shared/dtos/PaginationDTO';
import { FinancialFiltersInputDTO, FinancialMovementResponseDTO } from '../dtos/FinanceDTOs';
import { FinancialMovementMapper } from '../mappers/FinancialMovementMapper';

interface ListFinancialMovementsInput {
  readonly filters: FinancialFiltersInputDTO;
  readonly pagination: PaginationInputDTO;
}

export class ListFinancialMovements implements IUseCase<ListFinancialMovementsInput, PaginatedResponseDTO<FinancialMovementResponseDTO>> {
  constructor(
    private readonly movementRepository: IFinancialMovementRepository,
  ) {}

  async execute(input: ListFinancialMovementsInput): Promise<Result<PaginatedResponseDTO<FinancialMovementResponseDTO>>> {
    try {
      const { filters, pagination: paginationInput } = input;
      const page = paginationInput.page ?? 1;
      const pageSize = paginationInput.pageSize ?? 20;
      const pagination = createPagination(page, pageSize);

      const domainFilters: FinancialFilters = {
        type: filters.type,
        category: filters.category,
        status: filters.status,
        startDate: filters.startDate ? new Date(filters.startDate) : undefined,
        endDate: filters.endDate ? new Date(filters.endDate) : undefined,
        thirdPartyId: filters.thirdPartyId,
        lotId: filters.lotId,
        search: filters.search,
      };

      const movements = await this.movementRepository.findAll(domainFilters, pagination);
      const items = movements.map(FinancialMovementMapper.toDTO);
      const response = createPaginatedResponse(items, items.length, page, pageSize);

      return Result.ok<PaginatedResponseDTO<FinancialMovementResponseDTO>>(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error listing financial movements';
      return Result.fail<PaginatedResponseDTO<FinancialMovementResponseDTO>>(message);
    }
  }
}
