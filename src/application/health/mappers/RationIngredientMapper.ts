import { RationIngredient } from '../../../domain/health/entities/RationIngredient';
import { RationIngredientResponseDTO } from '../dtos/HealthDTOs';

export class RationIngredientMapper {
  static toDTO(ingredient: RationIngredient): RationIngredientResponseDTO {
    return {
      id: ingredient.id.value,
      rationId: ingredient.rationId.value,
      productId: ingredient.productId.value,
      percentage: ingredient.percentage,
      kgPerTon: ingredient.kgPerTon,
      order: ingredient.order,
    };
  }
}
