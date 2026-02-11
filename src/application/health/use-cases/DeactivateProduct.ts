import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { Product } from '../../../domain/health/entities/Product';
import { IProductRepository } from '../../../domain/health/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { ProductResponseDTO } from '../dtos/HealthDTOs';
import { ProductMapper } from '../mappers/ProductMapper';

export class DeactivateProduct implements IUseCase<string, ProductResponseDTO> {
  constructor(
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(productId: string): Promise<Result<ProductResponseDTO>> {
    try {
      const product = await this.productRepository.findById(new UniqueId(productId));
      if (!product) {
        return Result.fail<ProductResponseDTO>('Product not found');
      }

      if (!product.active) {
        return Result.fail<ProductResponseDTO>('Product is already deactivated');
      }

      const deactivatedProduct = Product.create(
        {
          code: product.code,
          name: product.name,
          commercialName: product.commercialName,
          genericName: product.genericName,
          type: product.type,
          category: product.category,
          currentStock: product.currentStock,
          minStock: product.minStock,
          maxStock: product.maxStock,
          unit: product.unit,
          unitCost: product.unitCost,
          salePrice: product.salePrice,
          withdrawalDays: product.withdrawalDays,
          activeIngredient: product.activeIngredient,
          concentration: product.concentration,
          manufacturer: product.manufacturer,
          requiresPrescription: product.requiresPrescription,
          isRefrigerated: product.isRefrigerated,
          storageTemperature: product.storageTemperature,
          observations: product.observations,
          active: false,
          deletedAt: new Date(),
        },
        product.id,
        product.createdAt,
      );

      const saved = await this.productRepository.update(deactivatedProduct);
      return Result.ok<ProductResponseDTO>(ProductMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error deactivating product';
      return Result.fail<ProductResponseDTO>(message);
    }
  }
}
