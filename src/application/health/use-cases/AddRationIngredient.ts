import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { RationIngredient } from '../../../domain/health/entities/RationIngredient';
import { IRationRepository, IProductRepository } from '../../../domain/health/repositories';
import { IRationIngredientRepository } from '../services/IRationIngredientRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { AddRationIngredientInputDTO, RationIngredientResponseDTO } from '../dtos/HealthDTOs';
import { RationIngredientMapper } from '../mappers/RationIngredientMapper';

export class AddRationIngredient implements IUseCase<AddRationIngredientInputDTO, RationIngredientResponseDTO> {
  constructor(
    private readonly rationRepository: IRationRepository,
    private readonly productRepository: IProductRepository,
    private readonly rationIngredientRepository: IRationIngredientRepository,
  ) {}

  async execute(input: AddRationIngredientInputDTO): Promise<Result<RationIngredientResponseDTO>> {
    try {
      const rationId = new UniqueId(input.rationId);
      const productId = new UniqueId(input.productId);

      const ration = await this.rationRepository.findById(rationId);
      if (!ration) {
        return Result.fail<RationIngredientResponseDTO>('Ration not found');
      }

      const product = await this.productRepository.findById(productId);
      if (!product) {
        return Result.fail<RationIngredientResponseDTO>('Product not found');
      }

      // Validate that total percentage does not exceed 100
      const existingIngredients = await this.rationIngredientRepository.findByRation(rationId);
      const totalPercentage = existingIngredients.reduce((sum, ing) => sum + ing.percentage, 0);

      if (totalPercentage + input.percentage > 100) {
        return Result.fail<RationIngredientResponseDTO>(
          `Adding this ingredient would exceed 100% total. Current total: ${totalPercentage}%, attempting to add: ${input.percentage}%`,
        );
      }

      const nextOrder = existingIngredients.length + 1;

      const ingredient = RationIngredient.create({
        rationId,
        productId,
        percentage: input.percentage,
        kgPerTon: input.kgPerTon,
        order: nextOrder,
      });

      const saved = await this.rationIngredientRepository.create(ingredient);
      return Result.ok<RationIngredientResponseDTO>(RationIngredientMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error adding ration ingredient';
      return Result.fail<RationIngredientResponseDTO>(message);
    }
  }
}
