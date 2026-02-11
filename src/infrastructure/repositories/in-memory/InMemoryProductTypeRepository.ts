import { IProductTypeRepository } from '../../../domain/health/repositories';
import { ProductType } from '../../../domain/health/entities/ProductType';

export class InMemoryProductTypeRepository implements IProductTypeRepository {
  private items: Map<string, ProductType> = new Map();

  async findByCode(code: string): Promise<ProductType | null> {
    return this.items.get(code) ?? null;
  }

  async findAll(): Promise<ProductType[]> {
    return Array.from(this.items.values());
  }

  async create(type: ProductType): Promise<ProductType> {
    this.items.set(type.code, type);
    return type;
  }

  async update(type: ProductType): Promise<ProductType> {
    this.items.set(type.code, type);
    return type;
  }

  // Test helpers
  clear(): void {
    this.items.clear();
  }

  getAll(): ProductType[] {
    return Array.from(this.items.values());
  }
}
