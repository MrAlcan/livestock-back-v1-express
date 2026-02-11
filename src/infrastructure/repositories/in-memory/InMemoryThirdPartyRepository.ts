import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { IThirdPartyRepository, ThirdPartyFilters } from '../../../domain/finance/repositories';
import { ThirdParty } from '../../../domain/finance/entities/ThirdParty';

export class InMemoryThirdPartyRepository implements IThirdPartyRepository {
  private items: Map<string, ThirdParty> = new Map();

  async findById(id: UniqueId): Promise<ThirdParty | null> {
    return this.items.get(id.value) ?? null;
  }

  async findByCode(code: string): Promise<ThirdParty | null> {
    const all = Array.from(this.items.values());
    return all.find((tp) => tp.code === code) ?? null;
  }

  async findByTaxId(taxId: string): Promise<ThirdParty | null> {
    const all = Array.from(this.items.values());
    return all.find((tp) => tp.taxId === taxId) ?? null;
  }

  async findAll(filters: ThirdPartyFilters, pagination: Pagination): Promise<ThirdParty[]> {
    let result = this.applyFilters(Array.from(this.items.values()), filters);
    return result.slice(pagination.offset, pagination.offset + pagination.limit);
  }

  async findByType(type: string): Promise<ThirdParty[]> {
    return Array.from(this.items.values()).filter((tp) => tp.type === type);
  }

  async findSuppliers(): Promise<ThirdParty[]> {
    return Array.from(this.items.values()).filter((tp) => tp.isSupplier());
  }

  async findCustomers(): Promise<ThirdParty[]> {
    return Array.from(this.items.values()).filter((tp) => tp.isCustomer());
  }

  async findTransporters(): Promise<ThirdParty[]> {
    return Array.from(this.items.values()).filter((tp) => tp.isTransporter());
  }

  async create(thirdParty: ThirdParty): Promise<ThirdParty> {
    this.items.set(thirdParty.id.value, thirdParty);
    return thirdParty;
  }

  async update(thirdParty: ThirdParty): Promise<ThirdParty> {
    this.items.set(thirdParty.id.value, thirdParty);
    return thirdParty;
  }

  async delete(id: UniqueId): Promise<void> {
    this.items.delete(id.value);
  }

  async updateBalance(id: UniqueId, newBalance: number): Promise<void> {
    const tp = this.items.get(id.value);
    if (tp) {
      this.items.set(id.value, tp);
    }
  }

  private applyFilters(thirdParties: ThirdParty[], filters: ThirdPartyFilters): ThirdParty[] {
    let result = thirdParties;
    if (filters.type) {
      result = result.filter((tp) => tp.type === filters.type);
    }
    if (filters.subtype) {
      result = result.filter((tp) => tp.subtype === filters.subtype);
    }
    if (filters.active !== undefined) {
      result = result.filter((tp) => tp.active === filters.active);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (tp) =>
          tp.name.toLowerCase().includes(search) ||
          (tp.tradeName?.toLowerCase().includes(search) ?? false) ||
          (tp.taxId?.toLowerCase().includes(search) ?? false),
      );
    }
    return result;
  }

  // Test helpers
  clear(): void {
    this.items.clear();
  }

  getAll(): ThirdParty[] {
    return Array.from(this.items.values());
  }
}
