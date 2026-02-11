import { Result } from '../../../domain/shared/Result';
import { Product } from '../../../domain/health/entities/Product';
import { IProductRepository } from '../../../domain/health/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { CreateProductInputDTO, ProductResponseDTO } from '../dtos/HealthDTOs';
import { ProductMapper } from '../mappers/ProductMapper';

export class CreateProduct implements IUseCase<CreateProductInputDTO, ProductResponseDTO> {
  constructor(
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(input: CreateProductInputDTO): Promise<Result<ProductResponseDTO>> {
    try {
      const existingProduct = await this.productRepository.findByCode(input.code);
      if (existingProduct) {
        return Result.fail<ProductResponseDTO>('A product with this code already exists');
      }

      const product = Product.create({
        code: input.code,
        name: input.name,
        commercialName: input.commercialName,
        genericName: input.genericName,
        type: input.type,
        category: input.category,
        currentStock: input.currentStock,
        minStock: input.minStock,
        maxStock: input.maxStock,
        unit: input.unit,
        unitCost: input.unitCost,
        salePrice: input.salePrice,
        withdrawalDays: input.withdrawalDays,
        activeIngredient: input.activeIngredient,
        concentration: input.concentration,
        manufacturer: input.manufacturer,
        requiresPrescription: input.requiresPrescription ?? false,
        isRefrigerated: input.isRefrigerated ?? false,
        storageTemperature: input.storageTemperature,
        observations: input.observations,
        active: true,
      });

      const saved = await this.productRepository.create(product);
      return Result.ok<ProductResponseDTO>(ProductMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error creating product';
      return Result.fail<ProductResponseDTO>(message);
    }
  }
}
