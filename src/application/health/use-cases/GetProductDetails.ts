import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IProductRepository } from '../../../domain/health/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { ProductResponseDTO } from '../dtos/HealthDTOs';
import { ProductMapper } from '../mappers/ProductMapper';

export class GetProductDetails implements IUseCase<string, ProductResponseDTO> {
  constructor(
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(productId: string): Promise<Result<ProductResponseDTO>> {
    try {
      const product = await this.productRepository.findById(new UniqueId(productId));
      if (!product) {
        return Result.fail<ProductResponseDTO>('Product not found');
      }

      return Result.ok<ProductResponseDTO>(ProductMapper.toDTO(product));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error getting product details';
      return Result.fail<ProductResponseDTO>(message);
    }
  }
}
