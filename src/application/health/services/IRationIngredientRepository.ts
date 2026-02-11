import { UniqueId } from '../../../domain/shared/Entity';
import { RationIngredient } from '../../../domain/health/entities/RationIngredient';

export interface IRationIngredientRepository {
  findByRation(rationId: UniqueId): Promise<RationIngredient[]>;
  create(ingredient: RationIngredient): Promise<RationIngredient>;
  delete(id: UniqueId): Promise<void>;
}
