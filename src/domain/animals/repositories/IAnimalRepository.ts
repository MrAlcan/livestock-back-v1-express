import { UniqueId } from '../../shared/Entity';
import { Pagination } from '../../shared/Pagination';
import { Animal } from '../entities/Animal';
import { OfficialId } from '../value-objects/OfficialId';

export interface AnimalFilters {
  readonly status?: string;
  readonly sex?: string;
  readonly breedId?: string;
  readonly origin?: string;
  readonly lotId?: string;
  readonly paddockId?: string;
  readonly search?: string;
  readonly minWeight?: number;
  readonly maxWeight?: number;
  readonly minAge?: number;
  readonly maxAge?: number;
}

export interface IAnimalRepository {
  findById(id: UniqueId): Promise<Animal | null>;
  findByOfficialId(officialId: OfficialId): Promise<Animal | null>;
  findByElectronicId(eid: string): Promise<Animal | null>;
  findAll(filters: AnimalFilters, pagination: Pagination): Promise<Animal[]>;
  findByFarm(farmId: UniqueId, filters: AnimalFilters, pagination: Pagination): Promise<Animal[]>;
  findByLot(lotId: UniqueId): Promise<Animal[]>;
  findByPaddock(paddockId: UniqueId): Promise<Animal[]>;
  findByMother(motherId: UniqueId): Promise<Animal[]>;
  findByFather(fatherId: UniqueId): Promise<Animal[]>;
  findActiveByFarm(farmId: UniqueId): Promise<Animal[]>;
  countByFarm(farmId: UniqueId, filters: AnimalFilters): Promise<number>;
  create(animal: Animal): Promise<Animal>;
  update(animal: Animal): Promise<Animal>;
  delete(id: UniqueId): Promise<void>;
  bulkCreate(animals: Animal[]): Promise<Animal[]>;
}
