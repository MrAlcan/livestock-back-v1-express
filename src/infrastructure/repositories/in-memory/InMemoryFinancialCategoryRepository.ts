import { IFinancialCategoryRepository } from '../../../domain/finance/repositories';
import { FinancialCategory } from '../../../domain/finance/entities/FinancialCategory';
import { FinancialType } from '../../../domain/finance/enums';

export class InMemoryFinancialCategoryRepository implements IFinancialCategoryRepository {
  private items: Map<number, FinancialCategory> = new Map();

  async findById(id: number): Promise<FinancialCategory | null> {
    return this.items.get(id) ?? null;
  }

  async findByCode(code: string): Promise<FinancialCategory | null> {
    const all = Array.from(this.items.values());
    return all.find((c) => c.code === code) ?? null;
  }

  async findAll(): Promise<FinancialCategory[]> {
    return Array.from(this.items.values());
  }

  async findByType(type: FinancialType): Promise<FinancialCategory[]> {
    return Array.from(this.items.values()).filter((c) => c.type === type);
  }

  async findByParent(parentId: number): Promise<FinancialCategory[]> {
    return Array.from(this.items.values()).filter((c) => c.parentId === parentId);
  }

  async create(category: FinancialCategory): Promise<FinancialCategory> {
    this.items.set(category.id, category);
    return category;
  }

  async update(category: FinancialCategory): Promise<FinancialCategory> {
    this.items.set(category.id, category);
    return category;
  }

  async delete(id: number): Promise<void> {
    this.items.delete(id);
  }

  // Test helpers
  clear(): void {
    this.items.clear();
  }

  getAll(): FinancialCategory[] {
    return Array.from(this.items.values());
  }
}
