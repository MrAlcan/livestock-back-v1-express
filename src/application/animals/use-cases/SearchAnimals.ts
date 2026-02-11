import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { createPagination } from '../../../domain/shared/Pagination';
import { IAnimalRepository, AnimalFilters } from '../../../domain/animals/repositories/IAnimalRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { PaginationInputDTO, PaginatedResponseDTO, createPaginatedResponse } from '../../shared/dtos/PaginationDTO';
import { AnimalResponseDTO } from '../dtos/AnimalDTOs';
import { AnimalMapper } from '../mappers/AnimalMapper';

interface SearchAnimalsInput {
  readonly farmId: string;
  readonly search: string;
  readonly pagination: PaginationInputDTO;
}

export class SearchAnimals implements IUseCase<SearchAnimalsInput, PaginatedResponseDTO<AnimalResponseDTO>> {
  constructor(
    private readonly animalRepository: IAnimalRepository,
  ) {}

  async execute(input: SearchAnimalsInput): Promise<Result<PaginatedResponseDTO<AnimalResponseDTO>>> {
    try {
      const farmId = new UniqueId(input.farmId);
      const page = input.pagination.page ?? 1;
      const pageSize = input.pagination.pageSize ?? 20;
      const pagination = createPagination(page, pageSize);

      const filters: AnimalFilters = {
        search: input.search,
      };

      const [animals, total] = await Promise.all([
        this.animalRepository.findByFarm(farmId, filters, pagination),
        this.animalRepository.countByFarm(farmId, filters),
      ]);

      const items = animals.map(AnimalMapper.toDTO);
      const response = createPaginatedResponse(items, total, page, pageSize);

      return Result.ok<PaginatedResponseDTO<AnimalResponseDTO>>(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error searching animals';
      return Result.fail<PaginatedResponseDTO<AnimalResponseDTO>>(message);
    }
  }
}
