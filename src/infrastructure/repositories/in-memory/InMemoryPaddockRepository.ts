import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { IPaddockRepository, PaddockFilters } from '../../../domain/lots/repositories';
import { Paddock } from '../../../domain/lots/entities/Paddock';

export class InMemoryPaddockRepository implements IPaddockRepository {
  private items: Map<string, Paddock> = new Map();

  async findById(id: UniqueId): Promise<Paddock | null> {
    return this.items.get(id.value) ?? null;
  }

  async findByCode(code: string, farmId: UniqueId): Promise<Paddock | null> {
    const all = Array.from(this.items.values());
    return (
      all.find((p) => p.code === code && p.farmId.value === farmId.value) ?? null
    );
  }

  async findAll(filters: PaddockFilters, pagination: Pagination): Promise<Paddock[]> {
    let result = this.applyFilters(Array.from(this.items.values()), filters);
    return result.slice(pagination.offset, pagination.offset + pagination.limit);
  }

  async findByFarm(farmId: UniqueId): Promise<Paddock[]> {
    return Array.from(this.items.values()).filter(
      (p) => p.farmId.value === farmId.value,
    );
  }

  async findAvailable(farmId: UniqueId): Promise<Paddock[]> {
    return Array.from(this.items.values()).filter(
      (p) => p.farmId.value === farmId.value && !p.deletedAt && !p.needsRest(),
    );
  }

  async create(paddock: Paddock): Promise<Paddock> {
    this.items.set(paddock.id.value, paddock);
    return paddock;
  }

  async update(paddock: Paddock): Promise<Paddock> {
    this.items.set(paddock.id.value, paddock);
    return paddock;
  }

  async delete(id: UniqueId): Promise<void> {
    this.items.delete(id.value);
  }

  private applyFilters(paddocks: Paddock[], filters: PaddockFilters): Paddock[] {
    let result = paddocks;
    if (filters.pastureCondition) {
      result = result.filter((p) => p.pastureCondition === filters.pastureCondition);
    }
    if (filters.hasWater !== undefined) {
      result = result.filter((p) => p.hasWater === filters.hasWater);
    }
    if (filters.hasShade !== undefined) {
      result = result.filter((p) => p.hasShade === filters.hasShade);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.code.toLowerCase().includes(search) ||
          p.name.toLowerCase().includes(search),
      );
    }
    return result;
  }

  // Test helpers
  clear(): void {
    this.items.clear();
  }

  getAll(): Paddock[] {
    return Array.from(this.items.values());
  }
}
