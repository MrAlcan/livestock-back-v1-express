import { Result } from '../../../domain/shared/Result';
import { createPagination } from '../../../domain/shared/Pagination';
import { IThirdPartyRepository, ThirdPartyFilters } from '../../../domain/finance/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { PaginationInputDTO, PaginatedResponseDTO, createPaginatedResponse } from '../../shared/dtos/PaginationDTO';
import { ThirdPartyFiltersInputDTO, ThirdPartyResponseDTO } from '../dtos/FinanceDTOs';
import { ThirdPartyMapper } from '../mappers/ThirdPartyMapper';

interface ListThirdPartiesInput {
  readonly filters: ThirdPartyFiltersInputDTO;
  readonly pagination: PaginationInputDTO;
}

export class ListThirdParties implements IUseCase<ListThirdPartiesInput, PaginatedResponseDTO<ThirdPartyResponseDTO>> {
  constructor(
    private readonly thirdPartyRepository: IThirdPartyRepository,
  ) {}

  async execute(input: ListThirdPartiesInput): Promise<Result<PaginatedResponseDTO<ThirdPartyResponseDTO>>> {
    try {
      const { filters, pagination: paginationInput } = input;
      const page = paginationInput.page ?? 1;
      const pageSize = paginationInput.pageSize ?? 20;
      const pagination = createPagination(page, pageSize);

      const domainFilters: ThirdPartyFilters = {
        type: filters.type,
        subtype: filters.subtype,
        active: filters.active,
        search: filters.search,
      };

      const thirdParties = await this.thirdPartyRepository.findAll(domainFilters, pagination);
      const items = thirdParties.map(ThirdPartyMapper.toDTO);
      const response = createPaginatedResponse(items, items.length, page, pageSize);

      return Result.ok<PaginatedResponseDTO<ThirdPartyResponseDTO>>(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error listing third parties';
      return Result.fail<PaginatedResponseDTO<ThirdPartyResponseDTO>>(message);
    }
  }
}
