import { ILotRepository, LotFilters } from '../../../domain/lots/repositories';
import { Lot } from '../../../domain/lots/entities/Lot';
import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { LotType, LotStatus } from '../../../domain/lots/enums';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaLotRepository
  extends PrismaBaseRepository
  implements ILotRepository {

  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaLotRepository');
  }

  async findById(id: UniqueId): Promise<Lot | null> {
    try {
      const record = await (this.prisma as any).lot.findUnique({
        where: this.buildWhereWithSoftDelete({ id: id.value }),
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByCode(code: string, farmId: UniqueId): Promise<Lot | null> {
    try {
      const record = await (this.prisma as any).lot.findFirst({
        where: this.buildWhereWithSoftDelete({ code, farmId: farmId.value }),
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(filters: LotFilters, pagination: Pagination): Promise<Lot[]> {
    try {
      const where = this.buildWhereWithSoftDelete(this.buildFilters(filters));
      const records = await (this.prisma as any).lot.findMany({
        where,
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByFarm(farmId: UniqueId, filters: LotFilters): Promise<Lot[]> {
    try {
      const where = this.buildWhereWithSoftDelete({
        farmId: farmId.value,
        ...this.buildFilters(filters),
      });
      const records = await (this.prisma as any).lot.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findActive(farmId: UniqueId): Promise<Lot[]> {
    try {
      const records = await (this.prisma as any).lot.findMany({
        where: this.buildWhereWithSoftDelete({
          farmId: farmId.value,
          status: LotStatus.ACTIVE,
        }),
        orderBy: { name: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(lot: Lot): Promise<Lot> {
    try {
      const record = await (this.prisma as any).lot.create({
        data: {
          id: lot.id.value,
          code: lot.code,
          name: lot.name,
          type: lot.type,
          farmId: lot.farmId.value,
          description: lot.description,
          status: lot.status,
          currentQuantity: lot.currentQuantity,
          averageWeight: lot.currentAverageWeight,
          createdAt: lot.createdAt,
          updatedAt: lot.updatedAt,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(lot: Lot): Promise<Lot> {
    try {
      const record = await (this.prisma as any).lot.update({
        where: { id: lot.id.value },
        data: {
          code: lot.code,
          name: lot.name,
          type: lot.type,
          description: lot.description,
          status: lot.status,
          currentQuantity: lot.currentQuantity,
          averageWeight: lot.currentAverageWeight,
          updatedAt: lot.updatedAt,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: UniqueId): Promise<void> {
    try {
      await (this.prisma as any).lot.update({
        where: { id: id.value },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async updateQuantity(lotId: UniqueId, newQuantity: number): Promise<void> {
    try {
      await (this.prisma as any).lot.update({
        where: { id: lotId.value },
        data: { currentQuantity: newQuantity, updatedAt: new Date() },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async updateAverageWeight(lotId: UniqueId, newAverage: number): Promise<void> {
    try {
      await (this.prisma as any).lot.update({
        where: { id: lotId.value },
        data: { averageWeight: newAverage, updatedAt: new Date() },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private buildFilters(filters: LotFilters): Record<string, unknown> {
    const where: Record<string, unknown> = {};
    if (filters.type) where.type = filters.type;
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { code: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  private toDomain(record: any): Lot {
    return Lot.create(
      {
        code: record.code,
        name: record.name,
        type: record.type ? (record.type as LotType) : undefined,
        farmId: new UniqueId(record.farmId),
        description: record.description ?? undefined,
        creationDate: record.createdAt ? new Date(record.createdAt) : new Date(),
        closureDate: record.deletedAt ? new Date(record.deletedAt) : undefined,
        status: record.status as LotStatus,
        currentQuantity: record.currentQuantity,
        currentAverageWeight: record.averageWeight ?? undefined,
        targetWeight: undefined,
        targetDays: undefined,
        assignedRationId: undefined,
        deletedAt: record.deletedAt ? new Date(record.deletedAt) : undefined,
      },
      new UniqueId(record.id),
      new Date(record.createdAt),
      new Date(record.updatedAt),
    );
  }
}
