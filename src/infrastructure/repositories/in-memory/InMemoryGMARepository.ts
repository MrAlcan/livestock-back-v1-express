import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { IGMARepository, GMAFilters } from '../../../domain/senasag/repositories';
import { GMA } from '../../../domain/senasag/entities/GMA';
import { GMAStatus } from '../../../domain/senasag/enums';
import { Weight } from '../../../domain/animals/value-objects/Weight';

export class InMemoryGMARepository implements IGMARepository {
  private items: Map<string, GMA> = new Map();
  private gmaAnimals: Map<string, Set<string>> = new Map();

  async findById(id: UniqueId): Promise<GMA | null> {
    return this.items.get(id.value) ?? null;
  }

  async findByInternalNumber(internalNumber: string): Promise<GMA | null> {
    const all = Array.from(this.items.values());
    return all.find((g) => g.internalNumber === internalNumber) ?? null;
  }

  async findByGMACode(gmaCode: string): Promise<GMA | null> {
    const all = Array.from(this.items.values());
    return all.find((g) => g.gmaCode === gmaCode) ?? null;
  }

  async findAll(filters: GMAFilters, pagination: Pagination): Promise<GMA[]> {
    let result = this.applyFilters(Array.from(this.items.values()), filters);
    return result.slice(pagination.offset, pagination.offset + pagination.limit);
  }

  async findByFarm(farmId: UniqueId, filters: GMAFilters): Promise<GMA[]> {
    let result = Array.from(this.items.values()).filter(
      (g) => g.originFarmId.value === farmId.value,
    );
    return this.applyFilters(result, filters);
  }

  async findPendingApproval(): Promise<GMA[]> {
    return Array.from(this.items.values()).filter(
      (g) => g.status === GMAStatus.PENDING_APPROVAL,
    );
  }

  async findInTransit(): Promise<GMA[]> {
    return Array.from(this.items.values()).filter(
      (g) => g.status === GMAStatus.IN_TRANSIT,
    );
  }

  async create(gma: GMA): Promise<GMA> {
    this.items.set(gma.id.value, gma);
    this.gmaAnimals.set(gma.id.value, new Set());
    return gma;
  }

  async update(gma: GMA): Promise<GMA> {
    this.items.set(gma.id.value, gma);
    return gma;
  }

  async addAnimal(gmaId: UniqueId, animalId: UniqueId, _weight?: Weight): Promise<void> {
    const animals = this.gmaAnimals.get(gmaId.value) ?? new Set();
    animals.add(animalId.value);
    this.gmaAnimals.set(gmaId.value, animals);
  }

  async removeAnimal(gmaId: UniqueId, animalId: UniqueId): Promise<void> {
    const animals = this.gmaAnimals.get(gmaId.value);
    if (animals) {
      animals.delete(animalId.value);
    }
  }

  private applyFilters(gmas: GMA[], filters: GMAFilters): GMA[] {
    let result = gmas;
    if (filters.status) {
      result = result.filter((g) => g.status === filters.status);
    }
    if (filters.type) {
      result = result.filter((g) => g.type === filters.type);
    }
    if (filters.startDate) {
      result = result.filter((g) => g.requestDate >= filters.startDate!);
    }
    if (filters.endDate) {
      result = result.filter((g) => g.requestDate <= filters.endDate!);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (g) =>
          g.internalNumber.toLowerCase().includes(search) ||
          (g.gmaCode?.toLowerCase().includes(search) ?? false),
      );
    }
    return result;
  }

  // Test helpers
  clear(): void {
    this.items.clear();
    this.gmaAnimals.clear();
  }

  getAll(): GMA[] {
    return Array.from(this.items.values());
  }

  getGMAAnimals(gmaId: string): string[] {
    return Array.from(this.gmaAnimals.get(gmaId) ?? []);
  }
}
