import { UniqueId } from '../../shared/Entity';
import { Pagination } from '../../shared/Pagination';
import { Product } from '../entities/Product';
import { ProductType } from '../entities/ProductType';
import { InventoryMovement } from '../entities/InventoryMovement';
import { HealthTask } from '../entities/HealthTask';
import { Ration } from '../entities/Ration';

export interface ProductFilters {
  readonly type?: string;
  readonly category?: string;
  readonly active?: boolean;
  readonly search?: string;
  readonly lowStock?: boolean;
}

export interface TaskFilters {
  readonly type?: string;
  readonly priority?: string;
  readonly status?: string;
  readonly assignedTo?: string;
  readonly search?: string;
}

export interface IProductRepository {
  findById(id: UniqueId): Promise<Product | null>;
  findByCode(code: string): Promise<Product | null>;
  findAll(filters: ProductFilters, pagination: Pagination): Promise<Product[]>;
  findByType(type: string): Promise<Product[]>;
  findLowStock(): Promise<Product[]>;
  findWithWithdrawalPeriod(): Promise<Product[]>;
  create(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  delete(id: UniqueId): Promise<void>;
  updateStock(productId: UniqueId, newStock: number): Promise<void>;
}

export interface IProductTypeRepository {
  findByCode(code: string): Promise<ProductType | null>;
  findAll(): Promise<ProductType[]>;
  create(type: ProductType): Promise<ProductType>;
  update(type: ProductType): Promise<ProductType>;
}

export interface IInventoryMovementRepository {
  findById(id: UniqueId): Promise<InventoryMovement | null>;
  findByProduct(productId: UniqueId, pagination: Pagination): Promise<InventoryMovement[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<InventoryMovement[]>;
  create(movement: InventoryMovement): Promise<InventoryMovement>;
}

export interface IHealthTaskRepository {
  findById(id: UniqueId): Promise<HealthTask | null>;
  findByCode(code: string): Promise<HealthTask | null>;
  findAll(filters: TaskFilters, pagination: Pagination): Promise<HealthTask[]>;
  findPending(): Promise<HealthTask[]>;
  findOverdue(): Promise<HealthTask[]>;
  findAssignedTo(userId: UniqueId): Promise<HealthTask[]>;
  create(task: HealthTask): Promise<HealthTask>;
  update(task: HealthTask): Promise<HealthTask>;
  delete(id: UniqueId): Promise<void>;
}

export interface IRationRepository {
  findById(id: UniqueId): Promise<Ration | null>;
  findByCode(code: string, farmId: UniqueId): Promise<Ration | null>;
  findByFarm(farmId: UniqueId): Promise<Ration[]>;
  findActive(farmId: UniqueId): Promise<Ration[]>;
  create(ration: Ration): Promise<Ration>;
  update(ration: Ration): Promise<Ration>;
  delete(id: UniqueId): Promise<void>;
}
