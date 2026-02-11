import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { IInventoryMovementRepository } from '../../../domain/health/repositories';
import { InventoryMovement } from '../../../domain/health/entities/InventoryMovement';

export class InMemoryInventoryMovementRepository implements IInventoryMovementRepository {
  private items: Map<string, InventoryMovement> = new Map();

  async findById(id: UniqueId): Promise<InventoryMovement | null> {
    return this.items.get(id.value) ?? null;
  }

  async findByProduct(productId: UniqueId, pagination: Pagination): Promise<InventoryMovement[]> {
    const filtered = Array.from(this.items.values()).filter(
      (m) => m.productId.value === productId.value,
    );
    return filtered.slice(pagination.offset, pagination.offset + pagination.limit);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<InventoryMovement[]> {
    return Array.from(this.items.values()).filter(
      (m) => m.movementDate >= startDate && m.movementDate <= endDate,
    );
  }

  async create(movement: InventoryMovement): Promise<InventoryMovement> {
    this.items.set(movement.id.value, movement);
    return movement;
  }

  // Test helpers
  clear(): void {
    this.items.clear();
  }

  getAll(): InventoryMovement[] {
    return Array.from(this.items.values());
  }
}
