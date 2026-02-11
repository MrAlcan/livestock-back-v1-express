import { UniqueId } from '../../shared/Entity';
import { Pagination } from '../../shared/Pagination';
import { ThirdParty } from '../entities/ThirdParty';
import { FinancialMovement } from '../entities/FinancialMovement';
import { FinancialCategory } from '../entities/FinancialCategory';
import { FinancialType } from '../enums';
import { Money } from '../value-objects/Money';

export interface ThirdPartyFilters {
  readonly type?: string;
  readonly subtype?: string;
  readonly active?: boolean;
  readonly search?: string;
}

export interface FinancialFilters {
  readonly type?: string;
  readonly category?: string;
  readonly status?: string;
  readonly startDate?: Date;
  readonly endDate?: Date;
  readonly thirdPartyId?: string;
  readonly lotId?: string;
  readonly search?: string;
}

export interface IThirdPartyRepository {
  findById(id: UniqueId): Promise<ThirdParty | null>;
  findByCode(code: string): Promise<ThirdParty | null>;
  findByTaxId(taxId: string): Promise<ThirdParty | null>;
  findAll(filters: ThirdPartyFilters, pagination: Pagination): Promise<ThirdParty[]>;
  findByType(type: string): Promise<ThirdParty[]>;
  findSuppliers(): Promise<ThirdParty[]>;
  findCustomers(): Promise<ThirdParty[]>;
  findTransporters(): Promise<ThirdParty[]>;
  create(thirdParty: ThirdParty): Promise<ThirdParty>;
  update(thirdParty: ThirdParty): Promise<ThirdParty>;
  delete(id: UniqueId): Promise<void>;
  updateBalance(id: UniqueId, newBalance: number): Promise<void>;
}

export interface IFinancialMovementRepository {
  findById(id: UniqueId): Promise<FinancialMovement | null>;
  findByVoucherNumber(voucherNumber: string): Promise<FinancialMovement | null>;
  findAll(filters: FinancialFilters, pagination: Pagination): Promise<FinancialMovement[]>;
  findByDateRange(startDate: Date, endDate: Date, type?: FinancialType): Promise<FinancialMovement[]>;
  findByThirdParty(thirdPartyId: UniqueId): Promise<FinancialMovement[]>;
  findByLot(lotId: UniqueId): Promise<FinancialMovement[]>;
  findOverdue(): Promise<FinancialMovement[]>;
  findPendingApproval(): Promise<FinancialMovement[]>;
  create(movement: FinancialMovement): Promise<FinancialMovement>;
  update(movement: FinancialMovement): Promise<FinancialMovement>;
  delete(id: UniqueId): Promise<void>;
}

export interface IFinancialCategoryRepository {
  findById(id: number): Promise<FinancialCategory | null>;
  findByCode(code: string): Promise<FinancialCategory | null>;
  findAll(): Promise<FinancialCategory[]>;
  findByType(type: FinancialType): Promise<FinancialCategory[]>;
  findByParent(parentId: number): Promise<FinancialCategory[]>;
  create(category: FinancialCategory): Promise<FinancialCategory>;
  update(category: FinancialCategory): Promise<FinancialCategory>;
  delete(id: number): Promise<void>;
}
