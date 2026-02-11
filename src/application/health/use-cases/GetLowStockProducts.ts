import { Result } from '../../../domain/shared/Result';
import { IProductRepository } from '../../../domain/health/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { StockStatusResponseDTO } from '../dtos/HealthDTOs';

export class GetLowStockProducts implements IUseCase<void, StockStatusResponseDTO[]> {
  constructor(
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(): Promise<Result<StockStatusResponseDTO[]>> {
    try {
      const products = await this.productRepository.findLowStock();

      const dtos: StockStatusResponseDTO[] = products.map((product) => ({
        productId: product.id.value,
        productName: product.name,
        currentStock: product.currentStock,
        minStock: product.minStock,
        maxStock: product.maxStock,
        isLowStock: product.isLowStock(),
        unit: product.unit,
      }));

      return Result.ok<StockStatusResponseDTO[]>(dtos);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error getting low stock products';
      return Result.fail<StockStatusResponseDTO[]>(message);
    }
  }
}
