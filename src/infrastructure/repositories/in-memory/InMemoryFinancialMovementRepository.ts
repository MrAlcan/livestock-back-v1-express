import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { IFinancialMovementRepository, FinancialFilters } from '../../../domain/finance/repositories';
import { FinancialMovement } from '../../../domain/finance/entities/FinancialMovement';
import { FinancialType, FinancialStatus } from '../../../domain/finance/enums';

export class InMemoryFinancialMovementRepository implements IFinancialMovementRepository {
  private items: Map<string, FinancialMovement> = new Map();

  async findById(id: UniqueId): Promise<FinancialMovement | null> {
    return this.items.get(id.value) ?? null;
  }

  async findByVoucherNumber(voucherNumber: string): Promise<FinancialMovement | null> {
    const all = Array.from(this.items.values());
    return all.find((fm) => fm.voucherNumber === voucherNumber) ?? null;
  }

  async findAll(filters: FinancialFilters, pagination: Pagination): Promise<FinancialMovement[]> {
    let result = this.applyFilters(Array.from(this.items.values()), filters);
    return result.slice(pagination.offset, pagination.offset + pagination.limit);
  }

  async findByDateRange(startDate: Date, endDate: Date, type?: FinancialType): Promise<FinancialMovement[]> {
    let result = Array.from(this.items.values()).filter(
      (fm) => fm.date >= startDate && fm.date <= endDate,
    );
    if (type !== undefined) {
      result = result.filter((fm) => fm.type === type);
    }
    return result;
  }

  async findByThirdParty(thirdPartyId: UniqueId): Promise<FinancialMovement[]> {
    return Array.from(this.items.values()).filter(
      (fm) => fm.thirdPartyId?.value === thirdPartyId.value,
    );
  }

  async findByLot(lotId: UniqueId): Promise<FinancialMovement[]> {
    return Array.from(this.items.values()).filter(
      (fm) => fm.lotId?.value === lotId.value,
    );
  }

  async findOverdue(): Promise<FinancialMovement[]> {
    return Array.from(this.items.values()).filter((fm) => fm.isOverdue());
  }

  async findPendingApproval(): Promise<FinancialMovement[]> {
    return Array.from(this.items.values()).filter(
      (fm) => fm.status === FinancialStatus.PENDING,
    );
  }

  async create(movement: FinancialMovement): Promise<FinancialMovement> {
    this.items.set(movement.id.value, movement);
    return movement;
  }

  async update(movement: FinancialMovement): Promise<FinancialMovement> {
    this.items.set(movement.id.value, movement);
    return movement;
  }

  async delete(id: UniqueId): Promise<void> {
    this.items.delete(id.value);
  }

  private applyFilters(movements: FinancialMovement[], filters: FinancialFilters): FinancialMovement[] {
    let result = movements;
    if (filters.type) {
      result = result.filter((fm) => fm.type === filters.type);
    }
    if (filters.category) {
      result = result.filter((fm) => fm.category === filters.category);
    }
    if (filters.status) {
      result = result.filter((fm) => fm.status === filters.status);
    }
    if (filters.startDate) {
      result = result.filter((fm) => fm.date >= filters.startDate!);
    }
    if (filters.endDate) {
      result = result.filter((fm) => fm.date <= filters.endDate!);
    }
    if (filters.thirdPartyId) {
      result = result.filter((fm) => fm.thirdPartyId?.value === filters.thirdPartyId);
    }
    if (filters.lotId) {
      result = result.filter((fm) => fm.lotId?.value === filters.lotId);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (fm) =>
          fm.description.toLowerCase().includes(search) ||
          (fm.voucherNumber?.toLowerCase().includes(search) ?? false),
      );
    }
    return result;
  }

  // Test helpers
  clear(): void {
    this.items.clear();
  }

  getAll(): FinancialMovement[] {
    return Array.from(this.items.values());
  }
}
