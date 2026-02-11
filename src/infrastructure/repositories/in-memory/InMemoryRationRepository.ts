import { UniqueId } from '../../../domain/shared/Entity';
import { IRationRepository } from '../../../domain/health/repositories';
import { Ration } from '../../../domain/health/entities/Ration';

export class InMemoryRationRepository implements IRationRepository {
  private items: Map<string, Ration> = new Map();

  async findById(id: UniqueId): Promise<Ration | null> {
    return this.items.get(id.value) ?? null;
  }

  async findByCode(code: string, farmId: UniqueId): Promise<Ration | null> {
    const all = Array.from(this.items.values());
    return (
      all.find((r) => r.code === code && r.farmId.value === farmId.value) ?? null
    );
  }

  async findByFarm(farmId: UniqueId): Promise<Ration[]> {
    return Array.from(this.items.values()).filter(
      (r) => r.farmId.value === farmId.value,
    );
  }

  async findActive(farmId: UniqueId): Promise<Ration[]> {
    return Array.from(this.items.values()).filter(
      (r) => r.farmId.value === farmId.value && r.active,
    );
  }

  async create(ration: Ration): Promise<Ration> {
    this.items.set(ration.id.value, ration);
    return ration;
  }

  async update(ration: Ration): Promise<Ration> {
    this.items.set(ration.id.value, ration);
    return ration;
  }

  async delete(id: UniqueId): Promise<void> {
    this.items.delete(id.value);
  }

  // Test helpers
  clear(): void {
    this.items.clear();
  }

  getAll(): Ration[] {
    return Array.from(this.items.values());
  }
}
