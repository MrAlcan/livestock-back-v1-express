import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { createPagination } from '../../../domain/shared/Pagination';
import { IAnimalRepository, AnimalFilters } from '../../../domain/animals/repositories/IAnimalRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { PaginationInputDTO, PaginatedResponseDTO, createPaginatedResponse } from '../../shared/dtos/PaginationDTO';
import { AnimalFiltersInputDTO, AnimalResponseDTO } from '../dtos/AnimalDTOs';
import { AnimalMapper } from '../mappers/AnimalMapper';

interface ListAnimalsInput {
  readonly filters: AnimalFiltersInputDTO;
  readonly pagination: PaginationInputDTO;
}

export class ListAnimals implements IUseCase<ListAnimalsInput, PaginatedResponseDTO<AnimalResponseDTO>> {
  constructor(
    private readonly animalRepository: IAnimalRepository,
  ) {}

  async execute(input: ListAnimalsInput): Promise<Result<PaginatedResponseDTO<AnimalResponseDTO>>> {
    try {
      const { filters, pagination: paginationInput } = input;
      const farmId = new UniqueId(filters.farmId);
      const page = paginationInput.page ?? 1;
      const pageSize = paginationInput.pageSize ?? 20;
      const pagination = createPagination(page, pageSize);

      const domainFilters: AnimalFilters = {
        status: filters.status,
        sex: filters.sex,
        breedId: filters.breedId,
        origin: filters.origin,
        lotId: filters.lotId,
        paddockId: filters.paddockId,
        search: filters.search,
        minWeight: filters.minWeight,
        maxWeight: filters.maxWeight,
      };

      const [animals, total] = await Promise.all([
        this.animalRepository.findByFarm(farmId, domainFilters, pagination),
        this.animalRepository.countByFarm(farmId, domainFilters),
      ]);

      const items = animals.map(AnimalMapper.toDTO);
      const response = createPaginatedResponse(items, total, page, pageSize);

      return Result.ok<PaginatedResponseDTO<AnimalResponseDTO>>(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error listing animals';
      return Result.fail<PaginatedResponseDTO<AnimalResponseDTO>>(message);
    }
  }
}
