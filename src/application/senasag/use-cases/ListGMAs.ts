import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { createPagination } from '../../../domain/shared/Pagination';
import { GMAFilters, IGMARepository } from '../../../domain/senasag/repositories/IGMARepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { PaginationInputDTO } from '../../shared/dtos/PaginationDTO';
import { GMAFiltersInputDTO, GMAResponseDTO } from '../dtos/SenasagDTOs';
import { GMAMapper } from '../mappers/GMAMapper';

interface ListGMAsInputDTO {
  readonly filters: GMAFiltersInputDTO;
  readonly pagination?: PaginationInputDTO;
}

export class ListGMAs implements IUseCase<ListGMAsInputDTO, GMAResponseDTO[]> {
  constructor(
    private readonly gmaRepository: IGMARepository,
  ) {}

  async execute(input: ListGMAsInputDTO): Promise<Result<GMAResponseDTO[]>> {
    try {
      const filters: GMAFilters = {
        status: input.filters.status,
        type: input.filters.type,
        startDate: input.filters.startDate ? new Date(input.filters.startDate) : undefined,
        endDate: input.filters.endDate ? new Date(input.filters.endDate) : undefined,
        search: input.filters.search,
      };

      const farmId = new UniqueId(input.filters.farmId);
      const gmas = await this.gmaRepository.findByFarm(farmId, filters);

      const dtos = gmas.map(GMAMapper.toDTO);
      return Result.ok<GMAResponseDTO[]>(dtos);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error listing GMAs';
      return Result.fail<GMAResponseDTO[]>(message);
    }
  }
}
