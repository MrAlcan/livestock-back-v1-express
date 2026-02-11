import { InventoryMovement } from '../../../domain/health/entities/InventoryMovement';
import { InventoryMovementResponseDTO } from '../dtos/HealthDTOs';

export class InventoryMovementMapper {
  static toDTO(movement: InventoryMovement): InventoryMovementResponseDTO {
    return {
      id: movement.id.value,
      productId: movement.productId.value,
      movementType: movement.movementType,
      quantity: movement.quantity,
      unit: movement.unit,
      unitCost: movement.unitCost,
      totalCost: movement.totalCost,
      previousStock: movement.previousStock,
      newStock: movement.newStock,
      movementDate: movement.movementDate.toISOString(),
      productBatch: movement.productBatch,
      registeredBy: movement.registeredBy.value,
      reason: movement.reason,
    };
  }
}
