import { IFinancialCategoryRepository } from '../../../domain/finance/repositories';
import { FinancialCategory } from '../../../domain/finance/entities/FinancialCategory';
import { FinancialType } from '../../../domain/finance/enums';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaFinancialCategoryRepository
  extends PrismaBaseRepository
  implements IFinancialCategoryRepository {

  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaFinancialCategoryRepository');
  }

  async findById(id: number): Promise<FinancialCategory | null> {
    try {
      const record = await (this.prisma as any).financialCategory.findUnique({
        where: { id },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByCode(code: string): Promise<FinancialCategory | null> {
    try {
      const record = await (this.prisma as any).financialCategory.findFirst({
        where: { code },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(): Promise<FinancialCategory[]> {
    try {
      const records = await (this.prisma as any).financialCategory.findMany({
        orderBy: { code: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByType(type: FinancialType): Promise<FinancialCategory[]> {
    try {
      const records = await (this.prisma as any).financialCategory.findMany({
        where: { type },
        orderBy: { code: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByParent(parentId: number): Promise<FinancialCategory[]> {
    try {
      const records = await (this.prisma as any).financialCategory.findMany({
        where: { parentId },
        orderBy: { code: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(category: FinancialCategory): Promise<FinancialCategory> {
    try {
      const record = await (this.prisma as any).financialCategory.create({
        data: {
          id: category.id,
          code: category.code,
          name: category.name,
          type: category.type,
          parentId: category.parentId,
          level: category.level,
          description: category.description,
          active: category.active,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(category: FinancialCategory): Promise<FinancialCategory> {
    try {
      const record = await (this.prisma as any).financialCategory.update({
        where: { id: category.id },
        data: {
          code: category.code,
          name: category.name,
          type: category.type,
          parentId: category.parentId,
          level: category.level,
          description: category.description,
          active: category.active,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await (this.prisma as any).financialCategory.delete({
        where: { id },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private toDomain(record: any): FinancialCategory {
    return FinancialCategory.create({
      id: record.id,
      code: record.code,
      name: record.name,
      type: record.type ? (record.type as FinancialType) : undefined,
      parentId: record.parentId ?? undefined,
      level: record.level ?? undefined,
      description: record.description ?? undefined,
      active: record.active,
    });
  }
}
