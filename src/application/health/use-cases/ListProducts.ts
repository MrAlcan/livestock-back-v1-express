import { Result } from '../../../domain/shared/Result';
import { createPagination } from '../../../domain/shared/Pagination';
import { IProductRepository, ProductFilters } from '../../../domain/health/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { PaginationInputDTO } from '../../shared/dtos/PaginationDTO';
import { ProductFiltersInputDTO, ProductResponseDTO } from '../dtos/HealthDTOs';
import { ProductMapper } from '../mappers/ProductMapper';

interface ListProductsInput {
  readonly filters: ProductFiltersInputDTO;
  readonly pagination: PaginationInputDTO;
}

export class ListProducts implements IUseCase<ListProductsInput, ProductResponseDTO[]> {
  constructor(
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(input: ListProductsInput): Promise<Result<ProductResponseDTO[]>> {
    try {
      const pagination = createPagination(input.pagination.page, input.pagination.pageSize);

      const filters: ProductFilters = {
        type: input.filters.type,
        category: input.filters.category,
        active: input.filters.active,
        search: input.filters.search,
        lowStock: input.filters.lowStock,
      };

      const products = await this.productRepository.findAll(filters, pagination);
      const dtos = products.map(ProductMapper.toDTO);

      return Result.ok<ProductResponseDTO[]>(dtos);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error listing products';
      return Result.fail<ProductResponseDTO[]>(message);
    }
  }
}
