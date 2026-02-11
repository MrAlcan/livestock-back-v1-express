import { IAnimalRepository, AnimalFilters } from '../../../domain/animals/repositories/IAnimalRepository';
import { Animal } from '../../../domain/animals/entities/Animal';
import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { OfficialId } from '../../../domain/animals/value-objects/OfficialId';
import { Weight } from '../../../domain/animals/value-objects/Weight';
import { AnimalSex, AnimalStatus, AnimalOrigin, SyncStatus } from '../../../domain/animals/enums';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaAnimalRepository
  extends PrismaBaseRepository
  implements IAnimalRepository {

  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaAnimalRepository');
  }

  async findById(id: UniqueId): Promise<Animal | null> {
    try {
      const record = await (this.prisma as any).animal.findUnique({
        where: this.buildWhereWithSoftDelete({ id: id.value }),
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByOfficialId(officialId: OfficialId): Promise<Animal | null> {
    try {
      const record = await (this.prisma as any).animal.findFirst({
        where: this.buildWhereWithSoftDelete({ officialId: officialId.value }),
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByElectronicId(eid: string): Promise<Animal | null> {
    try {
      const record = await (this.prisma as any).animal.findFirst({
        where: this.buildWhereWithSoftDelete({ electronicId: eid }),
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(filters: AnimalFilters, pagination: Pagination): Promise<Animal[]> {
    try {
      const where = this.buildWhereWithSoftDelete(this.buildFilters(filters));
      const records = await (this.prisma as any).animal.findMany({
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

  async findByFarm(farmId: UniqueId, filters: AnimalFilters, pagination: Pagination): Promise<Animal[]> {
    try {
      const where = this.buildWhereWithSoftDelete({
        farmId: farmId.value,
        ...this.buildFilters(filters),
      });
      const records = await (this.prisma as any).animal.findMany({
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

  async findByLot(lotId: UniqueId): Promise<Animal[]> {
    try {
      const records = await (this.prisma as any).animal.findMany({
        where: this.buildWhereWithSoftDelete({ currentLotId: lotId.value }),
        orderBy: { createdAt: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByPaddock(paddockId: UniqueId): Promise<Animal[]> {
    try {
      const records = await (this.prisma as any).animal.findMany({
        where: this.buildWhereWithSoftDelete({ currentPaddockId: paddockId.value }),
        orderBy: { createdAt: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByMother(motherId: UniqueId): Promise<Animal[]> {
    try {
      const records = await (this.prisma as any).animal.findMany({
        where: this.buildWhereWithSoftDelete({ motherId: motherId.value }),
        orderBy: { createdAt: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByFather(fatherId: UniqueId): Promise<Animal[]> {
    try {
      const records = await (this.prisma as any).animal.findMany({
        where: this.buildWhereWithSoftDelete({ fatherId: fatherId.value }),
        orderBy: { createdAt: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findActiveByFarm(farmId: UniqueId): Promise<Animal[]> {
    try {
      const records = await (this.prisma as any).animal.findMany({
        where: this.buildWhereWithSoftDelete({
          farmId: farmId.value,
          status: AnimalStatus.ACTIVE,
        }),
        orderBy: { createdAt: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async countByFarm(farmId: UniqueId, filters: AnimalFilters): Promise<number> {
    try {
      const where = this.buildWhereWithSoftDelete({
        farmId: farmId.value,
        ...this.buildFilters(filters),
      });
      const count = await (this.prisma as any).animal.count({ where });
      return count;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(animal: Animal): Promise<Animal> {
    try {
      const record = await (this.prisma as any).animal.create({
        data: this.toData(animal),
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(animal: Animal): Promise<Animal> {
    try {
      const data = this.toData(animal);
      delete data.id;
      delete data.createdAt;
      const record = await (this.prisma as any).animal.update({
        where: { id: animal.id.value },
        data,
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: UniqueId): Promise<void> {
    try {
      await (this.prisma as any).animal.update({
        where: { id: id.value },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async bulkCreate(animals: Animal[]): Promise<Animal[]> {
    try {
      const data = animals.map((a) => this.toData(a));
      await (this.prisma as any).animal.createMany({ data });
      const ids = animals.map((a) => a.id.value);
      const records = await (this.prisma as any).animal.findMany({
        where: { id: { in: ids } },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private buildFilters(filters: AnimalFilters): Record<string, unknown> {
    const where: Record<string, unknown> = {};
    if (filters.status) where.status = filters.status;
    if (filters.sex) where.sex = filters.sex;
    if (filters.breedId) where.breedId = filters.breedId;
    if (filters.origin) where.origin = filters.origin;
    if (filters.lotId) where.currentLotId = filters.lotId;
    if (filters.paddockId) where.currentPaddockId = filters.paddockId;
    if (filters.minWeight !== undefined || filters.maxWeight !== undefined) {
      const weightFilter: Record<string, number> = {};
      if (filters.minWeight !== undefined) weightFilter.gte = filters.minWeight;
      if (filters.maxWeight !== undefined) weightFilter.lte = filters.maxWeight;
      where.currentWeightKg = weightFilter;
    }
    if (filters.minAge !== undefined || filters.maxAge !== undefined) {
      const now = new Date();
      const birthDateFilter: Record<string, Date> = {};
      if (filters.maxAge !== undefined) {
        const minBirth = new Date(now);
        minBirth.setMonth(minBirth.getMonth() - filters.maxAge);
        birthDateFilter.gte = minBirth;
      }
      if (filters.minAge !== undefined) {
        const maxBirth = new Date(now);
        maxBirth.setMonth(maxBirth.getMonth() - filters.minAge);
        birthDateFilter.lte = maxBirth;
      }
      where.birthDate = birthDateFilter;
    }
    if (filters.search) {
      where.OR = [
        { officialId: { contains: filters.search, mode: 'insensitive' } },
        { temporaryId: { contains: filters.search, mode: 'insensitive' } },
        { electronicId: { contains: filters.search, mode: 'insensitive' } },
        { visualTag: { contains: filters.search, mode: 'insensitive' } },
        { brandMark: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  private toData(animal: Animal): Record<string, unknown> {
    return {
      id: animal.id.value,
      officialId: animal.officialId?.value,
      temporaryId: animal.temporaryId,
      brandMark: animal.brandMark,
      visualTag: animal.visualTag,
      electronicId: animal.electronicId,
      sex: animal.sex,
      birthDate: animal.birthDate,
      isEstimatedBirthDate: animal.isEstimatedBirthDate,
      breedId: animal.breedId ? parseInt(animal.breedId.value) : undefined,
      breedPercentage: animal.breedPercentage,
      coatColor: animal.coatColor,
      status: animal.status,
      substatus: animal.substatus,
      exitDate: animal.exitDate,
      exitReason: animal.exitReason,
      birthWeightKg: animal.birthWeight?.kilograms,
      currentWeightKg: animal.currentWeight?.kilograms,
      lastWeighingDate: animal.lastWeighingDate,
      motherId: animal.motherId?.value,
      fatherId: animal.fatherId?.value,
      currentLotId: animal.currentLotId?.value,
      currentPaddockId: animal.currentPaddockId?.value,
      farmId: animal.farmId.value,
      origin: animal.origin,
      observations: animal.observations,
      photoUrl: animal.photoUrl,
      syncStatus: animal.syncStatus,
      syncVersion: animal.syncVersion,
      deviceId: animal.deviceId,
      createdAt: animal.createdAt,
      updatedAt: animal.updatedAt,
    };
  }

  private toDomain(record: any): Animal {
    return Animal.create(
      {
        officialId: record.officialId ? OfficialId.create(record.officialId) : undefined,
        temporaryId: record.temporaryId ?? undefined,
        brandMark: record.brandMark ?? undefined,
        visualTag: record.visualTag ?? undefined,
        electronicId: record.electronicId ?? undefined,
        sex: record.sex as AnimalSex,
        birthDate: record.birthDate ? new Date(record.birthDate) : undefined,
        isEstimatedBirthDate: record.isEstimatedBirthDate,
        breedId: record.breedId ? new UniqueId(record.breedId.toString()) : undefined,
        breedPercentage: record.breedPercentage ?? undefined,
        coatColor: record.coatColor ?? undefined,
        status: record.status as AnimalStatus,
        substatus: record.substatus ?? undefined,
        exitDate: record.exitDate ? new Date(record.exitDate) : undefined,
        exitReason: record.exitReason ?? undefined,
        birthWeight: record.birthWeightKg ? Weight.create(record.birthWeightKg) : undefined,
        currentWeight: record.currentWeightKg ? Weight.create(record.currentWeightKg) : undefined,
        lastWeighingDate: record.lastWeighingDate ? new Date(record.lastWeighingDate) : undefined,
        motherId: record.motherId ? new UniqueId(record.motherId) : undefined,
        fatherId: record.fatherId ? new UniqueId(record.fatherId) : undefined,
        currentLotId: record.currentLotId ? new UniqueId(record.currentLotId) : undefined,
        currentPaddockId: record.currentPaddockId ? new UniqueId(record.currentPaddockId) : undefined,
        farmId: new UniqueId(record.farmId),
        origin: record.origin as AnimalOrigin,
        observations: record.observations ?? undefined,
        photoUrl: record.photoUrl ?? undefined,
        syncStatus: record.syncStatus as SyncStatus,
        syncVersion: record.syncVersion,
        deviceId: record.deviceId ?? undefined,
        deletedAt: record.deletedAt ? new Date(record.deletedAt) : undefined,
      },
      new UniqueId(record.id),
      new Date(record.createdAt),
      new Date(record.updatedAt),
    );
  }
}
