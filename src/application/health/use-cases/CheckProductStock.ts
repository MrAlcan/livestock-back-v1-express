import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IProductRepository } from '../../../domain/health/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { StockStatusResponseDTO } from '../dtos/HealthDTOs';

export class CheckProductStock implements IUseCase<string, StockStatusResponseDTO> {
  constructor(
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(productId: string): Promise<Result<StockStatusResponseDTO>> {
    try {
      const product = await this.productRepository.findById(new UniqueId(productId));
      if (!product) {
        return Result.fail<StockStatusResponseDTO>('Product not found');
      }

      const dto: StockStatusResponseDTO = {
        productId: product.id.value,
        productName: product.name,
        currentStock: product.currentStock,
        minStock: product.minStock,
        maxStock: product.maxStock,
        isLowStock: product.isLowStock(),
        unit: product.unit,
      };

      return Result.ok<StockStatusResponseDTO>(dto);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error checking product stock';
      return Result.fail<StockStatusResponseDTO>(message);
    }
  }
}
