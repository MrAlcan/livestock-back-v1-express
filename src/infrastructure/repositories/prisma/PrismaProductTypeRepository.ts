import { IProductTypeRepository } from '../../../domain/health/repositories';
import { ProductType } from '../../../domain/health/entities/ProductType';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaProductTypeRepository
  extends PrismaBaseRepository
  implements IProductTypeRepository {

  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaProductTypeRepository');
  }

  async findByCode(code: string): Promise<ProductType | null> {
    try {
      const record = await (this.prisma as any).productType.findFirst({
        where: { code },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(): Promise<ProductType[]> {
    try {
      const records = await (this.prisma as any).productType.findMany({
        orderBy: { name: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(type: ProductType): Promise<ProductType> {
    try {
      const record = await (this.prisma as any).productType.create({
        data: {
          code: type.code,
          name: type.name,
          parentCategory: type.parentCategory,
          description: type.description,
          requiresStockControl: type.requiresStockControl,
          requiresWithdrawal: type.requiresWithdrawal,
          defaultUnit: type.defaultUnit,
          active: type.active,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(type: ProductType): Promise<ProductType> {
    try {
      const record = await (this.prisma as any).productType.update({
        where: { code: type.code },
        data: {
          name: type.name,
          parentCategory: type.parentCategory,
          description: type.description,
          requiresStockControl: type.requiresStockControl,
          requiresWithdrawal: type.requiresWithdrawal,
          defaultUnit: type.defaultUnit,
          active: type.active,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private toDomain(record: any): ProductType {
    return ProductType.create({
      code: record.code,
      name: record.name,
      parentCategory: record.parentCategory ?? undefined,
      description: record.description ?? undefined,
      requiresStockControl: record.requiresStockControl,
      requiresWithdrawal: record.requiresWithdrawal,
      defaultUnit: record.defaultUnit ?? undefined,
      active: record.active,
    });
  }
}
