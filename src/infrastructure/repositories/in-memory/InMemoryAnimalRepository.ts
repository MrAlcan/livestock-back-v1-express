import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { IAnimalRepository, AnimalFilters } from '../../../domain/animals/repositories/IAnimalRepository';
import { Animal } from '../../../domain/animals/entities/Animal';
import { OfficialId } from '../../../domain/animals/value-objects/OfficialId';
import { AnimalStatus } from '../../../domain/animals/enums';

export class InMemoryAnimalRepository implements IAnimalRepository {
  private items: Map<string, Animal> = new Map();

  async findById(id: UniqueId): Promise<Animal | null> {
    return this.items.get(id.value) ?? null;
  }

  async findByOfficialId(officialId: OfficialId): Promise<Animal | null> {
    const all = Array.from(this.items.values());
    return all.find((a) => a.officialId?.value === officialId.value) ?? null;
  }

  async findByElectronicId(eid: string): Promise<Animal | null> {
    const all = Array.from(this.items.values());
    return all.find((a) => a.electronicId === eid) ?? null;
  }

  async findAll(filters: AnimalFilters, pagination: Pagination): Promise<Animal[]> {
    let result = this.applyFilters(Array.from(this.items.values()), filters);
    return result.slice(pagination.offset, pagination.offset + pagination.limit);
  }

  async findByFarm(farmId: UniqueId, filters: AnimalFilters, pagination: Pagination): Promise<Animal[]> {
    let result = Array.from(this.items.values()).filter(
      (a) => a.farmId.value === farmId.value,
    );
    result = this.applyFilters(result, filters);
    return result.slice(pagination.offset, pagination.offset + pagination.limit);
  }

  async findByLot(lotId: UniqueId): Promise<Animal[]> {
    return Array.from(this.items.values()).filter(
      (a) => a.currentLotId?.value === lotId.value,
    );
  }

  async findByPaddock(paddockId: UniqueId): Promise<Animal[]> {
    return Array.from(this.items.values()).filter(
      (a) => a.currentPaddockId?.value === paddockId.value,
    );
  }

  async findByMother(motherId: UniqueId): Promise<Animal[]> {
    return Array.from(this.items.values()).filter(
      (a) => a.motherId?.value === motherId.value,
    );
  }

  async findByFather(fatherId: UniqueId): Promise<Animal[]> {
    return Array.from(this.items.values()).filter(
      (a) => a.fatherId?.value === fatherId.value,
    );
  }

  async findActiveByFarm(farmId: UniqueId): Promise<Animal[]> {
    return Array.from(this.items.values()).filter(
      (a) => a.farmId.value === farmId.value && a.status === AnimalStatus.ACTIVE,
    );
  }

  async countByFarm(farmId: UniqueId, filters: AnimalFilters): Promise<number> {
    let result = Array.from(this.items.values()).filter(
      (a) => a.farmId.value === farmId.value,
    );
    result = this.applyFilters(result, filters);
    return result.length;
  }

  async create(animal: Animal): Promise<Animal> {
    this.items.set(animal.id.value, animal);
    return animal;
  }

  async update(animal: Animal): Promise<Animal> {
    this.items.set(animal.id.value, animal);
    return animal;
  }

  async delete(id: UniqueId): Promise<void> {
    this.items.delete(id.value);
  }

  async bulkCreate(animals: Animal[]): Promise<Animal[]> {
    for (const animal of animals) {
      this.items.set(animal.id.value, animal);
    }
    return animals;
  }

  private applyFilters(animals: Animal[], filters: AnimalFilters): Animal[] {
    let result = animals;
    if (filters.status) {
      result = result.filter((a) => a.status === filters.status);
    }
    if (filters.sex) {
      result = result.filter((a) => a.sex === filters.sex);
    }
    if (filters.breedId) {
      result = result.filter((a) => a.breedId?.value === filters.breedId);
    }
    if (filters.origin) {
      result = result.filter((a) => a.origin === filters.origin);
    }
    if (filters.lotId) {
      result = result.filter((a) => a.currentLotId?.value === filters.lotId);
    }
    if (filters.paddockId) {
      result = result.filter((a) => a.currentPaddockId?.value === filters.paddockId);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.getFullIdentifier().toLowerCase().includes(search) ||
          (a.visualTag?.toLowerCase().includes(search) ?? false),
      );
    }
    if (filters.minWeight !== undefined) {
      result = result.filter(
        (a) => a.currentWeight !== undefined && a.currentWeight.kilograms >= filters.minWeight!,
      );
    }
    if (filters.maxWeight !== undefined) {
      result = result.filter(
        (a) => a.currentWeight !== undefined && a.currentWeight.kilograms <= filters.maxWeight!,
      );
    }
    if (filters.minAge !== undefined) {
      result = result.filter((a) => {
        const age = a.calculateAge();
        return age !== null && age.toMonths() >= filters.minAge!;
      });
    }
    if (filters.maxAge !== undefined) {
      result = result.filter((a) => {
        const age = a.calculateAge();
        return age !== null && age.toMonths() <= filters.maxAge!;
      });
    }
    return result;
  }

  // Test helpers
  clear(): void {
    this.items.clear();
  }

  getAll(): Animal[] {
    return Array.from(this.items.values());
  }
}
