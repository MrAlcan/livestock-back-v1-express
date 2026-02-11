import { IProductRepository, ProductFilters } from '../../../domain/health/repositories';
import { Product } from '../../../domain/health/entities/Product';
import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaProductRepository
  extends PrismaBaseRepository
  implements IProductRepository {

  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaProductRepository');
  }

  async findById(id: UniqueId): Promise<Product | null> {
    try {
      const record = await (this.prisma as any).product.findUnique({
        where: this.buildWhereWithSoftDelete({ id: id.value }),
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByCode(code: string): Promise<Product | null> {
    try {
      const record = await (this.prisma as any).product.findFirst({
        where: this.buildWhereWithSoftDelete({ code }),
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(filters: ProductFilters, pagination: Pagination): Promise<Product[]> {
    try {
      const where = this.buildWhereWithSoftDelete(this.buildFilters(filters));
      const records = await (this.prisma as any).product.findMany({
        where,
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: { name: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByType(type: string): Promise<Product[]> {
    try {
      const records = await (this.prisma as any).product.findMany({
        where: this.buildWhereWithSoftDelete({ type }),
        orderBy: { name: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findLowStock(): Promise<Product[]> {
    try {
      const records = await (this.prisma as any).product.findMany({
        where: this.buildWhereWithSoftDelete({
          active: true,
          minStock: { not: null },
          currentStock: { lt: (this.prisma as any).product.fields?.minStock },
        }),
      });
      // Fallback: filter in memory since Prisma doesn't easily support column comparison
      const allRecords = await (this.prisma as any).product.findMany({
        where: this.buildWhereWithSoftDelete({
          active: true,
          minStock: { not: null },
        }),
      });
      const lowStockRecords = allRecords.filter((r: any) => r.minStock != null && r.currentStock < r.minStock);
      return lowStockRecords.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findWithWithdrawalPeriod(): Promise<Product[]> {
    try {
      const records = await (this.prisma as any).product.findMany({
        where: this.buildWhereWithSoftDelete({
          withdrawalDays: { gt: 0 },
          active: true,
        }),
        orderBy: { name: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(product: Product): Promise<Product> {
    try {
      const record = await (this.prisma as any).product.create({
        data: this.toData(product),
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(product: Product): Promise<Product> {
    try {
      const data = this.toData(product);
      delete data.id;
      delete data.createdAt;
      const record = await (this.prisma as any).product.update({
        where: { id: product.id.value },
        data,
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: UniqueId): Promise<void> {
    try {
      await (this.prisma as any).product.update({
        where: { id: id.value },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async updateStock(productId: UniqueId, newStock: number): Promise<void> {
    try {
      await (this.prisma as any).product.update({
        where: { id: productId.value },
        data: { currentStock: newStock, updatedAt: new Date() },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private buildFilters(filters: ProductFilters): Record<string, unknown> {
    const where: Record<string, unknown> = {};
    if (filters.type) where.type = filters.type;
    if (filters.category) where.category = filters.category;
    if (filters.active !== undefined) where.active = filters.active;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { code: { contains: filters.search, mode: 'insensitive' } },
        { commercialName: { contains: filters.search, mode: 'insensitive' } },
        { activeIngredient: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  private toData(product: Product): Record<string, unknown> {
    return {
      id: product.id.value,
      code: product.code,
      name: product.name,
      commercialName: product.commercialName,
      genericName: product.genericName,
      type: product.type,
      category: product.category,
      currentStock: product.currentStock,
      minStock: product.minStock,
      maxStock: product.maxStock,
      unit: product.unit,
      unitCost: product.unitCost,
      salePrice: product.salePrice,
      withdrawalDays: product.withdrawalDays,
      activeIngredient: product.activeIngredient,
      concentration: product.concentration,
      manufacturer: product.manufacturer,
      requiresPrescription: product.requiresPrescription,
      isRefrigerated: product.isRefrigerated,
      storageTemperature: product.storageTemperature,
      observations: product.observations,
      active: product.active,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private toDomain(record: any): Product {
    return Product.create(
      {
        code: record.code,
        name: record.name,
        commercialName: record.commercialName ?? undefined,
        genericName: record.genericName ?? undefined,
        type: record.type,
        category: record.category ?? undefined,
        currentStock: record.currentStock,
        minStock: record.minStock ?? undefined,
        maxStock: record.maxStock ?? undefined,
        unit: record.unit,
        unitCost: record.unitCost ?? undefined,
        salePrice: record.salePrice ?? undefined,
        withdrawalDays: record.withdrawalDays,
        activeIngredient: record.activeIngredient ?? undefined,
        concentration: record.concentration ?? undefined,
        manufacturer: record.manufacturer ?? undefined,
        requiresPrescription: record.requiresPrescription,
        isRefrigerated: record.isRefrigerated,
        storageTemperature: record.storageTemperature ?? undefined,
        observations: record.observations ?? undefined,
        active: record.active,
        deletedAt: record.deletedAt ?? undefined,
      },
      new UniqueId(record.id),
      record.createdAt,
      record.updatedAt,
    );
  }
}
