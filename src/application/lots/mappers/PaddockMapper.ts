import { Paddock } from '../../../domain/lots/entities/Paddock';
import { PaddockResponseDTO } from '../dtos/LotDTOs';

export class PaddockMapper {
  static toDTO(paddock: Paddock): PaddockResponseDTO {
    return {
      id: paddock.id.value,
      code: paddock.code,
      name: paddock.name,
      hectares: paddock.hectares,
      maxCapacityAU: paddock.maxCapacityAU,
      pastureType: paddock.pastureType,
      pastureCondition: paddock.pastureCondition,
      lastSeedingDate: paddock.lastSeedingDate?.toISOString(),
      recommendedRestDays: paddock.recommendedRestDays,
      lastEntryDate: paddock.lastEntryDate?.toISOString(),
      hasWater: paddock.hasWater,
      hasShade: paddock.hasShade,
      farmId: paddock.farmId.value,
      observations: paddock.observations,
    };
  }
}
