import { Ration } from '../../../domain/health/entities/Ration';
import { RationIngredient } from '../../../domain/health/entities/RationIngredient';
import { RationResponseDTO, RationDetailResponseDTO } from '../dtos/HealthDTOs';
import { RationIngredientMapper } from './RationIngredientMapper';

export class RationMapper {
  static toDTO(ration: Ration): RationResponseDTO {
    return {
      id: ration.id.value,
      code: ration.code,
      name: ration.name,
      type: ration.type,
      farmId: ration.farmId.value,
      description: ration.description,
      dryMatterPct: ration.dryMatterPct,
      proteinPct: ration.proteinPct,
      energyMcalKg: ration.energyMcalKg,
      costPerTon: ration.costPerTon,
      estimatedConversion: ration.estimatedConversion,
      active: ration.active,
    };
  }

  static toDetailDTO(ration: Ration, ingredients: RationIngredient[]): RationDetailResponseDTO {
    return {
      ...RationMapper.toDTO(ration),
      ingredients: ingredients.map(RationIngredientMapper.toDTO),
    };
  }
}
