import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { ILotRepository, LotFilters } from '../../../domain/lots/repositories';
import { Lot } from '../../../domain/lots/entities/Lot';
import { LotStatus } from '../../../domain/lots/enums';

export class InMemoryLotRepository implements ILotRepository {
  private items: Map<string, Lot> = new Map();

  async findById(id: UniqueId): Promise<Lot | null> {
    return this.items.get(id.value) ?? null;
  }

  async findByCode(code: string, farmId: UniqueId): Promise<Lot | null> {
    const all = Array.from(this.items.values());
    return (
      all.find((l) => l.code === code && l.farmId.value === farmId.value) ?? null
    );
  }

  async findAll(filters: LotFilters, pagination: Pagination): Promise<Lot[]> {
    let result = this.applyFilters(Array.from(this.items.values()), filters);
    return result.slice(pagination.offset, pagination.offset + pagination.limit);
  }

  async findByFarm(farmId: UniqueId, filters: LotFilters): Promise<Lot[]> {
    let result = Array.from(this.items.values()).filter(
      (l) => l.farmId.value === farmId.value,
    );
    return this.applyFilters(result, filters);
  }

  async findActive(farmId: UniqueId): Promise<Lot[]> {
    return Array.from(this.items.values()).filter(
      (l) => l.farmId.value === farmId.value && l.status === LotStatus.ACTIVE,
    );
  }

  async create(lot: Lot): Promise<Lot> {
    this.items.set(lot.id.value, lot);
    return lot;
  }

  async update(lot: Lot): Promise<Lot> {
    this.items.set(lot.id.value, lot);
    return lot;
  }

  async delete(id: UniqueId): Promise<void> {
    this.items.delete(id.value);
  }

  async updateQuantity(lotId: UniqueId, newQuantity: number): Promise<void> {
    const lot = this.items.get(lotId.value);
    if (lot) {
      this.items.set(lotId.value, lot);
    }
  }

  async updateAverageWeight(lotId: UniqueId, newAverage: number): Promise<void> {
    const lot = this.items.get(lotId.value);
    if (lot) {
      lot.updateAverageWeight(newAverage);
      this.items.set(lotId.value, lot);
    }
  }

  private applyFilters(lots: Lot[], filters: LotFilters): Lot[] {
    let result = lots;
    if (filters.type) {
      result = result.filter((l) => l.type === filters.type);
    }
    if (filters.status) {
      result = result.filter((l) => l.status === filters.status);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (l) =>
          l.code.toLowerCase().includes(search) ||
          l.name.toLowerCase().includes(search),
      );
    }
    return result;
  }

  // Test helpers
  clear(): void {
    this.items.clear();
  }

  getAll(): Lot[] {
    return Array.from(this.items.values());
  }
}
