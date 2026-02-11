import { Lot } from '../../../domain/lots/entities/Lot';
import { LotResponseDTO } from '../dtos/LotDTOs';

export class LotMapper {
  static toDTO(lot: Lot): LotResponseDTO {
    return {
      id: lot.id.value,
      code: lot.code,
      name: lot.name,
      type: lot.type,
      farmId: lot.farmId.value,
      status: lot.status,
      creationDate: lot.creationDate.toISOString(),
      closureDate: lot.closureDate?.toISOString(),
      currentQuantity: lot.currentQuantity,
      currentAverageWeight: lot.currentAverageWeight,
      targetWeight: lot.targetWeight,
      targetDays: lot.targetDays,
      assignedRationId: lot.assignedRationId?.value,
    };
  }
}
