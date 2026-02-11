import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { Product } from '../../../domain/health/entities/Product';
import { IProductRepository } from '../../../domain/health/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { UpdateProductInputDTO, ProductResponseDTO } from '../dtos/HealthDTOs';
import { ProductMapper } from '../mappers/ProductMapper';

export class UpdateProduct implements IUseCase<UpdateProductInputDTO, ProductResponseDTO> {
  constructor(
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(input: UpdateProductInputDTO): Promise<Result<ProductResponseDTO>> {
    try {
      const product = await this.productRepository.findById(new UniqueId(input.id));
      if (!product) {
        return Result.fail<ProductResponseDTO>('Product not found');
      }

      const updatedProduct = Product.create(
        {
          code: product.code,
          name: input.name !== undefined ? input.name : product.name,
          commercialName: input.commercialName !== undefined ? input.commercialName : product.commercialName,
          genericName: product.genericName,
          type: product.type,
          category: input.category !== undefined ? input.category : product.category,
          currentStock: product.currentStock,
          minStock: input.minStock !== undefined ? input.minStock : product.minStock,
          maxStock: input.maxStock !== undefined ? input.maxStock : product.maxStock,
          unit: product.unit,
          unitCost: input.unitCost !== undefined ? input.unitCost : product.unitCost,
          salePrice: input.salePrice !== undefined ? input.salePrice : product.salePrice,
          withdrawalDays: product.withdrawalDays,
          activeIngredient: product.activeIngredient,
          concentration: product.concentration,
          manufacturer: product.manufacturer,
          requiresPrescription: product.requiresPrescription,
          isRefrigerated: product.isRefrigerated,
          storageTemperature: product.storageTemperature,
          observations: input.observations !== undefined ? input.observations : product.observations,
          active: product.active,
          deletedAt: product.deletedAt,
        },
        product.id,
        product.createdAt,
      );

      const saved = await this.productRepository.update(updatedProduct);
      return Result.ok<ProductResponseDTO>(ProductMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error updating product';
      return Result.fail<ProductResponseDTO>(message);
    }
  }
}
