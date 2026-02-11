import { IReproductionCycleRepository } from '../../../application/reproduction/services/IReproductionCycleRepository';
import { ReproductionCycle } from '../../../domain/reproduction/entities';
import { UniqueId } from '../../../domain/shared/Entity';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';
import { ReproductionResult, ServiceType } from '../../../domain/events/enums';

export class PrismaReproductionCycleRepository
  extends PrismaBaseRepository
  implements IReproductionCycleRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaReproductionCycleRepository');
  }

  async findByFemale(femaleId: UniqueId): Promise<ReproductionCycle[]> {
    try {
      const records = await (this.prisma as any).reproductionCycle.findMany({
        where: this.buildWhereWithSoftDelete({ femaleId: femaleId.value }),
        orderBy: { serviceDate: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findActiveCycles(farmId: UniqueId): Promise<ReproductionCycle[]> {
    try {
      const records = await (this.prisma as any).reproductionCycle.findMany({
        where: this.buildWhereWithSoftDelete({
          animal: { farmId: farmId.value },
          result: { in: [ReproductionResult.SERVICED, ReproductionResult.PREGNANT] },
        }),
        include: { animal: true },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<ReproductionCycle[]> {
    try {
      const records = await (this.prisma as any).reproductionCycle.findMany({
        where: this.buildWhereWithSoftDelete({
          serviceDate: { gte: startDate, lte: endDate },
        }),
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(cycle: ReproductionCycle): Promise<ReproductionCycle> {
    try {
      const data = this.toPersistence(cycle);
      const record = await (this.prisma as any).reproductionCycle.create({ data });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(cycle: ReproductionCycle): Promise<ReproductionCycle> {
    try {
      const data = this.toPersistence(cycle);
      // Since ReproductionCycle doesn't have an id, we identify by femaleId + serviceDate
      const record = await (this.prisma as any).reproductionCycle.updateMany({
        where: {
          femaleId: cycle.femaleId.value,
          serviceDate: cycle.serviceDate,
        },
        data,
      });
      return cycle; // Return the updated cycle as-is since updateMany doesn't return the record
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private toDomain(record: any): ReproductionCycle {
    return {
      femaleId: new UniqueId(record.femaleId),
      studId: record.studId ? new UniqueId(record.studId) : undefined,
      serviceDate: new Date(record.serviceDate),
      serviceType: record.serviceType as ServiceType,
      diagnosisDate: record.diagnosisDate ? new Date(record.diagnosisDate) : undefined,
      result: record.result as ReproductionResult,
      estimatedBirthDate: record.estimatedBirthDate ? new Date(record.estimatedBirthDate) : undefined,
      actualBirthDate: record.actualBirthDate ? new Date(record.actualBirthDate) : undefined,
      weaningDate: record.weaningDate ? new Date(record.weaningDate) : undefined,
    };
  }

  private toPersistence(cycle: ReproductionCycle): any {
    return {
      femaleId: cycle.femaleId.value,
      studId: cycle.studId?.value,
      serviceDate: cycle.serviceDate,
      serviceType: cycle.serviceType,
      diagnosisDate: cycle.diagnosisDate,
      result: cycle.result,
      estimatedBirthDate: cycle.estimatedBirthDate,
      actualBirthDate: cycle.actualBirthDate,
      weaningDate: cycle.weaningDate,
    };
  }
}
