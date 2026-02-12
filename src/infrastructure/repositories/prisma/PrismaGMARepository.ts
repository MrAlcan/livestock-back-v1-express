import { IGMARepository, GMAFilters } from '../../../domain/senasag/repositories';
import { GMA } from '../../../domain/senasag/entities/GMA';
import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { Weight } from '../../../domain/animals/value-objects/Weight';
import { GMAType, GMAStatus } from '../../../domain/senasag/enums';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaGMARepository
  extends PrismaBaseRepository
  implements IGMARepository {

  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaGMARepository');
  }

  async findById(id: UniqueId): Promise<GMA | null> {
    try {
      const record = await (this.prisma as any).gMA.findUnique({
        where: { id: id.value },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByInternalNumber(internalNumber: string): Promise<GMA | null> {
    try {
      const record = await (this.prisma as any).gMA.findFirst({
        where: { internalNumber },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByGMACode(gmaCode: string): Promise<GMA | null> {
    try {
      const record = await (this.prisma as any).gMA.findFirst({
        where: { gmaCode },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(filters: GMAFilters, pagination: Pagination): Promise<GMA[]> {
    try {
      const where = this.buildFilters(filters);
      const records = await (this.prisma as any).gMA.findMany({
        where,
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: { issueDate: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByFarm(farmId: UniqueId, filters: GMAFilters): Promise<GMA[]> {
    try {
      const where = {
        originFarmId: farmId.value,
        ...this.buildFilters(filters),
      };
      const records = await (this.prisma as any).gMA.findMany({
        where,
        orderBy: { issueDate: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findPendingApproval(): Promise<GMA[]> {
    try {
      const records = await (this.prisma as any).gMA.findMany({
        where: { status: GMAStatus.PENDING_APPROVAL },
        orderBy: { issueDate: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findInTransit(): Promise<GMA[]> {
    try {
      const records = await (this.prisma as any).gMA.findMany({
        where: { status: GMAStatus.IN_TRANSIT },
        orderBy: { actualDepartureDate: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(gma: GMA): Promise<GMA> {
    try {
      const record = await (this.prisma as any).gMA.create({
        data: this.toData(gma),
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(gma: GMA): Promise<GMA> {
    try {
      const data = this.toData(gma);
      delete data.id;
      delete data.createdAt;
      const record = await (this.prisma as any).gMA.update({
        where: { id: gma.id.value },
        data,
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async addAnimal(gmaId: UniqueId, animalId: UniqueId, weight?: Weight): Promise<void> {
    try {
      await (this.prisma as any).gMAAnimal.create({
        data: {
          gmaId: gmaId.value,
          animalId: animalId.value,
          weightKg: weight?.kilograms,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async removeAnimal(gmaId: UniqueId, animalId: UniqueId): Promise<void> {
    try {
      await (this.prisma as any).gMAAnimal.deleteMany({
        where: {
          gmaId: gmaId.value,
          animalId: animalId.value,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private buildFilters(filters: GMAFilters): Record<string, unknown> {
    const where: Record<string, unknown> = {};
    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;
    if (filters.startDate || filters.endDate) {
      const dateFilter: Record<string, Date> = {};
      if (filters.startDate) dateFilter.gte = filters.startDate;
      if (filters.endDate) dateFilter.lte = filters.endDate;
      where.issueDate = dateFilter;
    }
    if (filters.search) {
      where.OR = [
        { internalNumber: { contains: filters.search, mode: 'insensitive' } },
        { gmaCode: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  private toData(gma: GMA): Record<string, unknown> {
    return {
      id: gma.id.value,
      internalNumber: gma.internalNumber,
      gmaCode: gma.gmaCode,
      temporaryCode: gma.temporaryCode,
      registrarId: gma.registrarId.value,
      originFarmId: gma.originFarmId.value,
      transporterId: gma.transporterId.value,
      destinationId: gma.destinationId.value,
      type: gma.type,
      issueDate: gma.issueDate,
      expirationDate: gma.expirationDate,
      actualDepartureDate: gma.actualDepartureDate,
      estimatedArrivalDate: gma.estimatedArrivalDate,
      actualArrivalDate: gma.actualArrivalDate,
      status: gma.status,
      rejectionReason: gma.rejectionReason,
      animalQuantity: gma.animalQuantity,
      estimatedTotalWeight: gma.estimatedTotalWeight,
      actualTotalWeight: gma.actualTotalWeight,
      distanceKm: gma.distanceKm,
      route: gma.route,
      observations: gma.observations,
      documents: gma.documents,
      tracking: gma.tracking,
      createdAt: gma.createdAt,
      updatedAt: gma.updatedAt,
    };
  }

  private toDomain(record: any): GMA {
    return GMA.create(
      {
        internalNumber: record.internalNumber,
        gmaCode: record.gmaCode ?? undefined,
        temporaryCode: record.temporaryCode ?? undefined,
        registrarId: new UniqueId(record.registrarId),
        originFarmId: new UniqueId(record.originFarmId),
        transporterId: new UniqueId(record.transporterId),
        destinationId: new UniqueId(record.destinationId),
        type: record.type as GMAType,
        issueDate: record.issueDate ? new Date(record.issueDate) : undefined,
        expirationDate: record.expirationDate ? new Date(record.expirationDate) : undefined,
        actualDepartureDate: record.actualDepartureDate ? new Date(record.actualDepartureDate) : undefined,
        estimatedArrivalDate: record.estimatedArrivalDate ? new Date(record.estimatedArrivalDate) : undefined,
        actualArrivalDate: record.actualArrivalDate ? new Date(record.actualArrivalDate) : undefined,
        status: record.status as GMAStatus,
        rejectionReason: record.rejectionReason ?? undefined,
        animalQuantity: record.animalQuantity,
        estimatedTotalWeight: record.estimatedTotalWeight ?? undefined,
        actualTotalWeight: record.actualTotalWeight ?? undefined,
        distanceKm: record.distanceKm ?? undefined,
        route: record.route ?? undefined,
        observations: record.observations ?? undefined,
        documents: record.documents ?? undefined,
        tracking: record.tracking ?? undefined,
      },
      new UniqueId(record.id),
      new Date(record.createdAt),
      new Date(record.updatedAt),
    );
  }
}
