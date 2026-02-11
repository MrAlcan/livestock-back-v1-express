import { UniqueId } from '../../shared/Entity';
import { Pagination } from '../../shared/Pagination';
import { Lot } from '../entities/Lot';
import { Paddock } from '../entities/Paddock';

export interface LotFilters {
  readonly type?: string;
  readonly status?: string;
  readonly search?: string;
}

export interface PaddockFilters {
  readonly pastureCondition?: string;
  readonly hasWater?: boolean;
  readonly hasShade?: boolean;
  readonly search?: string;
}

export interface ILotRepository {
  findById(id: UniqueId): Promise<Lot | null>;
  findByCode(code: string, farmId: UniqueId): Promise<Lot | null>;
  findAll(filters: LotFilters, pagination: Pagination): Promise<Lot[]>;
  findByFarm(farmId: UniqueId, filters: LotFilters): Promise<Lot[]>;
  findActive(farmId: UniqueId): Promise<Lot[]>;
  create(lot: Lot): Promise<Lot>;
  update(lot: Lot): Promise<Lot>;
  delete(id: UniqueId): Promise<void>;
  updateQuantity(lotId: UniqueId, newQuantity: number): Promise<void>;
  updateAverageWeight(lotId: UniqueId, newAverage: number): Promise<void>;
}

export interface IPaddockRepository {
  findById(id: UniqueId): Promise<Paddock | null>;
  findByCode(code: string, farmId: UniqueId): Promise<Paddock | null>;
  findAll(filters: PaddockFilters, pagination: Pagination): Promise<Paddock[]>;
  findByFarm(farmId: UniqueId): Promise<Paddock[]>;
  findAvailable(farmId: UniqueId): Promise<Paddock[]>;
  create(paddock: Paddock): Promise<Paddock>;
  update(paddock: Paddock): Promise<Paddock>;
  delete(id: UniqueId): Promise<void>;
}
