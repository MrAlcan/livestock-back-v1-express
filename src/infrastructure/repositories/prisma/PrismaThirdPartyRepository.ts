import { IThirdPartyRepository, ThirdPartyFilters } from '../../../domain/finance/repositories';
import { ThirdParty } from '../../../domain/finance/entities/ThirdParty';
import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { IDType } from '../../../domain/finance/enums';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaThirdPartyRepository
  extends PrismaBaseRepository
  implements IThirdPartyRepository {

  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaThirdPartyRepository');
  }

  async findById(id: UniqueId): Promise<ThirdParty | null> {
    try {
      const record = await (this.prisma as any).thirdParty.findUnique({
        where: this.buildWhereWithSoftDelete({ id: id.value }),
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByCode(code: string): Promise<ThirdParty | null> {
    try {
      const record = await (this.prisma as any).thirdParty.findFirst({
        where: this.buildWhereWithSoftDelete({ code }),
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByTaxId(taxId: string): Promise<ThirdParty | null> {
    try {
      const record = await (this.prisma as any).thirdParty.findFirst({
        where: this.buildWhereWithSoftDelete({ taxId }),
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(filters: ThirdPartyFilters, pagination: Pagination): Promise<ThirdParty[]> {
    try {
      const where = this.buildWhereWithSoftDelete(this.buildFilters(filters));
      const records = await (this.prisma as any).thirdParty.findMany({
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

  async findByType(type: string): Promise<ThirdParty[]> {
    try {
      const records = await (this.prisma as any).thirdParty.findMany({
        where: this.buildWhereWithSoftDelete({ type }),
        orderBy: { name: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findSuppliers(): Promise<ThirdParty[]> {
    try {
      const records = await (this.prisma as any).thirdParty.findMany({
        where: this.buildWhereWithSoftDelete({ type: 'proveedor', active: true }),
        orderBy: { name: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findCustomers(): Promise<ThirdParty[]> {
    try {
      const records = await (this.prisma as any).thirdParty.findMany({
        where: this.buildWhereWithSoftDelete({ type: 'cliente', active: true }),
        orderBy: { name: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findTransporters(): Promise<ThirdParty[]> {
    try {
      const records = await (this.prisma as any).thirdParty.findMany({
        where: this.buildWhereWithSoftDelete({ type: 'transportista', active: true }),
        orderBy: { name: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(thirdParty: ThirdParty): Promise<ThirdParty> {
    try {
      const record = await (this.prisma as any).thirdParty.create({
        data: this.toData(thirdParty),
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(thirdParty: ThirdParty): Promise<ThirdParty> {
    try {
      const data = this.toData(thirdParty);
      delete data.id;
      delete data.createdAt;
      const record = await (this.prisma as any).thirdParty.update({
        where: { id: thirdParty.id.value },
        data,
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: UniqueId): Promise<void> {
    try {
      await (this.prisma as any).thirdParty.update({
        where: { id: id.value },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async updateBalance(id: UniqueId, newBalance: number): Promise<void> {
    try {
      await (this.prisma as any).thirdParty.update({
        where: { id: id.value },
        data: { currentBalance: newBalance, updatedAt: new Date() },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private buildFilters(filters: ThirdPartyFilters): Record<string, unknown> {
    const where: Record<string, unknown> = {};
    if (filters.type) where.type = filters.type;
    if (filters.subtype) where.subtype = filters.subtype;
    if (filters.active !== undefined) where.active = filters.active;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { tradeName: { contains: filters.search, mode: 'insensitive' } },
        { code: { contains: filters.search, mode: 'insensitive' } },
        { taxId: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  private toData(thirdParty: ThirdParty): Record<string, unknown> {
    return {
      id: thirdParty.id.value,
      code: thirdParty.code,
      name: thirdParty.name,
      tradeName: thirdParty.tradeName,
      type: thirdParty.type,
      subtype: thirdParty.subtype,
      taxId: thirdParty.taxId,
      idType: thirdParty.idType,
      rtaCode: thirdParty.rtaCode,
      rtaExpiration: thirdParty.rtaExpiration,
      address: thirdParty.address,
      location: thirdParty.location,
      phone: thirdParty.phone,
      email: thirdParty.email,
      contactPerson: thirdParty.contactPerson,
      website: thirdParty.website,
      rating: thirdParty.rating,
      creditDays: thirdParty.creditDays,
      creditLimit: thirdParty.creditLimit,
      currentBalance: thirdParty.currentBalance,
      active: thirdParty.active,
      observations: thirdParty.observations,
      createdAt: thirdParty.createdAt,
      updatedAt: thirdParty.updatedAt,
    };
  }

  private toDomain(record: any): ThirdParty {
    return ThirdParty.create(
      {
        code: record.code ?? undefined,
        name: record.name,
        tradeName: record.tradeName ?? undefined,
        type: record.type,
        subtype: record.subtype ?? undefined,
        taxId: record.taxId ?? undefined,
        idType: record.idType ? (record.idType as IDType) : undefined,
        rtaCode: record.rtaCode ?? undefined,
        rtaExpiration: record.rtaExpiration ?? undefined,
        address: record.address ?? undefined,
        location: record.location ?? undefined,
        phone: record.phone ?? undefined,
        email: record.email ?? undefined,
        contactPerson: record.contactPerson ?? undefined,
        website: record.website ?? undefined,
        rating: record.rating ?? undefined,
        creditDays: record.creditDays ?? undefined,
        creditLimit: record.creditLimit ?? undefined,
        currentBalance: record.currentBalance ?? 0,
        active: record.active,
        observations: record.observations ?? undefined,
        deletedAt: record.deletedAt ?? undefined,
      },
      new UniqueId(record.id),
      record.createdAt,
      record.updatedAt,
    );
  }
}
