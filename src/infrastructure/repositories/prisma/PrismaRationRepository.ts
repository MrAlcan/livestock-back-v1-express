import { IRationRepository } from '../../../domain/health/repositories';
import { Ration } from '../../../domain/health/entities/Ration';
import { UniqueId } from '../../../domain/shared/Entity';
import { RationType } from '../../../domain/health/enums';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaRationRepository
  extends PrismaBaseRepository
  implements IRationRepository {

  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaRationRepository');
  }

  async findById(id: UniqueId): Promise<Ration | null> {
    try {
      const record = await (this.prisma as any).ration.findUnique({
        where: { id: id.value },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByCode(code: string, farmId: UniqueId): Promise<Ration | null> {
    try {
      const record = await (this.prisma as any).ration.findFirst({
        where: { code, farmId: farmId.value },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByFarm(farmId: UniqueId): Promise<Ration[]> {
    try {
      const records = await (this.prisma as any).ration.findMany({
        where: { farmId: farmId.value },
        orderBy: { name: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findActive(farmId: UniqueId): Promise<Ration[]> {
    try {
      const records = await (this.prisma as any).ration.findMany({
        where: { farmId: farmId.value, active: true },
        orderBy: { name: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(ration: Ration): Promise<Ration> {
    try {
      const record = await (this.prisma as any).ration.create({
        data: {
          id: ration.id.value,
          code: ration.code,
          name: ration.name,
          type: ration.type,
          farmId: ration.farmId.value,
          description: ration.description,
          dryMatterPct: ration.dryMatterPct,
          proteinPct: ration.proteinPct,
          energyMcalKg: ration.energyMcalKg,
          costPerTon: ration.costPerTon,
          estimatedConversion: ration.estimatedConversion,
          active: ration.active,
          createdAt: ration.createdAt,
          updatedAt: ration.updatedAt,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(ration: Ration): Promise<Ration> {
    try {
      const record = await (this.prisma as any).ration.update({
        where: { id: ration.id.value },
        data: {
          code: ration.code,
          name: ration.name,
          type: ration.type,
          description: ration.description,
          dryMatterPct: ration.dryMatterPct,
          proteinPct: ration.proteinPct,
          energyMcalKg: ration.energyMcalKg,
          costPerTon: ration.costPerTon,
          estimatedConversion: ration.estimatedConversion,
          active: ration.active,
          updatedAt: ration.updatedAt,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: UniqueId): Promise<void> {
    try {
      await (this.prisma as any).ration.delete({
        where: { id: id.value },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private toDomain(record: any): Ration {
    return Ration.create(
      {
        code: record.code,
        name: record.name,
        type: record.type as RationType,
        farmId: new UniqueId(record.farmId),
        description: record.description ?? undefined,
        dryMatterPct: record.dryMatterPct ?? undefined,
        proteinPct: record.proteinPct ?? undefined,
        energyMcalKg: record.energyMcalKg ?? undefined,
        costPerTon: record.costPerTon ?? undefined,
        estimatedConversion: record.estimatedConversion ?? undefined,
        active: record.active,
      },
      new UniqueId(record.id),
      record.createdAt,
      record.updatedAt,
    );
  }
}
