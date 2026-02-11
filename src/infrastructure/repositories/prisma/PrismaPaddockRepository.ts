import { IPaddockRepository, PaddockFilters } from '../../../domain/lots/repositories';
import { Paddock } from '../../../domain/lots/entities/Paddock';
import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { PastureCondition } from '../../../domain/lots/enums';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaPaddockRepository
  extends PrismaBaseRepository
  implements IPaddockRepository {

  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaPaddockRepository');
  }

  async findById(id: UniqueId): Promise<Paddock | null> {
    try {
      const record = await (this.prisma as any).paddock.findUnique({
        where: this.buildWhereWithSoftDelete({ id: id.value }),
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByCode(code: string, farmId: UniqueId): Promise<Paddock | null> {
    try {
      const record = await (this.prisma as any).paddock.findFirst({
        where: this.buildWhereWithSoftDelete({ code, farmId: farmId.value }),
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(filters: PaddockFilters, pagination: Pagination): Promise<Paddock[]> {
    try {
      const where = this.buildWhereWithSoftDelete(this.buildFilters(filters));
      const records = await (this.prisma as any).paddock.findMany({
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

  async findByFarm(farmId: UniqueId): Promise<Paddock[]> {
    try {
      const records = await (this.prisma as any).paddock.findMany({
        where: this.buildWhereWithSoftDelete({ farmId: farmId.value }),
        orderBy: { name: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAvailable(farmId: UniqueId): Promise<Paddock[]> {
    try {
      const records = await (this.prisma as any).paddock.findMany({
        where: this.buildWhereWithSoftDelete({
          farmId: farmId.value,
          pastureCondition: { notIn: [PastureCondition.POOR, PastureCondition.RESTING] },
        }),
        orderBy: { name: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(paddock: Paddock): Promise<Paddock> {
    try {
      const record = await (this.prisma as any).paddock.create({
        data: {
          id: paddock.id.value,
          code: paddock.code,
          name: paddock.name,
          hectares: paddock.hectares,
          maxCapacityAU: paddock.maxCapacityAU,
          pastureType: paddock.pastureType,
          pastureCondition: paddock.pastureCondition,
          lastSeedingDate: paddock.lastSeedingDate,
          recommendedRestDays: paddock.recommendedRestDays,
          lastEntryDate: paddock.lastEntryDate,
          location: paddock.location,
          hasWater: paddock.hasWater,
          hasShade: paddock.hasShade,
          farmId: paddock.farmId.value,
          observations: paddock.observations,
          createdAt: paddock.createdAt,
          updatedAt: paddock.updatedAt,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(paddock: Paddock): Promise<Paddock> {
    try {
      const record = await (this.prisma as any).paddock.update({
        where: { id: paddock.id.value },
        data: {
          code: paddock.code,
          name: paddock.name,
          hectares: paddock.hectares,
          maxCapacityAU: paddock.maxCapacityAU,
          pastureType: paddock.pastureType,
          pastureCondition: paddock.pastureCondition,
          lastSeedingDate: paddock.lastSeedingDate,
          recommendedRestDays: paddock.recommendedRestDays,
          lastEntryDate: paddock.lastEntryDate,
          location: paddock.location,
          hasWater: paddock.hasWater,
          hasShade: paddock.hasShade,
          observations: paddock.observations,
          updatedAt: paddock.updatedAt,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: UniqueId): Promise<void> {
    try {
      await (this.prisma as any).paddock.update({
        where: { id: id.value },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private buildFilters(filters: PaddockFilters): Record<string, unknown> {
    const where: Record<string, unknown> = {};
    if (filters.pastureCondition) where.pastureCondition = filters.pastureCondition;
    if (filters.hasWater !== undefined) where.hasWater = filters.hasWater;
    if (filters.hasShade !== undefined) where.hasShade = filters.hasShade;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { code: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  private toDomain(record: any): Paddock {
    return Paddock.create(
      {
        code: record.code,
        name: record.name,
        hectares: record.hectares ?? undefined,
        maxCapacityAU: record.maxCapacityAU ?? undefined,
        pastureType: record.pastureType ?? undefined,
        pastureCondition: record.pastureCondition ? (record.pastureCondition as PastureCondition) : undefined,
        lastSeedingDate: record.lastSeedingDate ? new Date(record.lastSeedingDate) : undefined,
        recommendedRestDays: record.recommendedRestDays ?? undefined,
        lastEntryDate: record.lastEntryDate ? new Date(record.lastEntryDate) : undefined,
        location: record.location ?? undefined,
        hasWater: record.hasWater,
        hasShade: record.hasShade,
        farmId: new UniqueId(record.farmId),
        observations: record.observations ?? undefined,
        deletedAt: record.deletedAt ? new Date(record.deletedAt) : undefined,
      },
      new UniqueId(record.id),
      new Date(record.createdAt),
      new Date(record.updatedAt),
    );
  }
}
