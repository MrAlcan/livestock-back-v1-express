import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { IProductRepository, ProductFilters } from '../../../domain/health/repositories';
import { Product } from '../../../domain/health/entities/Product';

export class InMemoryProductRepository implements IProductRepository {
  private items: Map<string, Product> = new Map();

  async findById(id: UniqueId): Promise<Product | null> {
    return this.items.get(id.value) ?? null;
  }

  async findByCode(code: string): Promise<Product | null> {
    const all = Array.from(this.items.values());
    return all.find((p) => p.code === code) ?? null;
  }

  async findAll(filters: ProductFilters, pagination: Pagination): Promise<Product[]> {
    let result = Array.from(this.items.values());
    if (filters.type) {
      result = result.filter((p) => p.type === filters.type);
    }
    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters.active !== undefined) {
      result = result.filter((p) => p.active === filters.active);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.code.toLowerCase().includes(search) ||
          (p.commercialName?.toLowerCase().includes(search) ?? false),
      );
    }
    if (filters.lowStock) {
      result = result.filter((p) => p.isLowStock());
    }
    return result.slice(pagination.offset, pagination.offset + pagination.limit);
  }

  async findByType(type: string): Promise<Product[]> {
    return Array.from(this.items.values()).filter((p) => p.type === type);
  }

  async findLowStock(): Promise<Product[]> {
    return Array.from(this.items.values()).filter((p) => p.isLowStock());
  }

  async findWithWithdrawalPeriod(): Promise<Product[]> {
    return Array.from(this.items.values()).filter((p) => p.hasWithdrawalPeriod());
  }

  async create(product: Product): Promise<Product> {
    this.items.set(product.id.value, product);
    return product;
  }

  async update(product: Product): Promise<Product> {
    this.items.set(product.id.value, product);
    return product;
  }

  async delete(id: UniqueId): Promise<void> {
    this.items.delete(id.value);
  }

  async updateStock(productId: UniqueId, newStock: number): Promise<void> {
    // In-memory: The product entity would already have been updated via entity methods
    // This is a persistence-level update that we track by storing the entity
    const product = this.items.get(productId.value);
    if (product) {
      // Stock is already updated on the entity in use-case layer
      this.items.set(productId.value, product);
    }
  }

  // Test helpers
  clear(): void {
    this.items.clear();
  }

  getAll(): Product[] {
    return Array.from(this.items.values());
  }
}
