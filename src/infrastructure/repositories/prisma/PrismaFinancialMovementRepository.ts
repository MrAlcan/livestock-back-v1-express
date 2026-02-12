import { IFinancialMovementRepository, FinancialFilters } from '../../../domain/finance/repositories';
import { FinancialMovement } from '../../../domain/finance/entities/FinancialMovement';
import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { FinancialType, PaymentMethod, FinancialStatus } from '../../../domain/finance/enums';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaFinancialMovementRepository
  extends PrismaBaseRepository
  implements IFinancialMovementRepository {

  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaFinancialMovementRepository');
  }

  async findById(id: UniqueId): Promise<FinancialMovement | null> {
    try {
      const record = await (this.prisma as any).financialMovement.findUnique({
        where: { id: id.value },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByVoucherNumber(voucherNumber: string): Promise<FinancialMovement | null> {
    try {
      const record = await (this.prisma as any).financialMovement.findFirst({
        where: { voucherNumber },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(filters: FinancialFilters, pagination: Pagination): Promise<FinancialMovement[]> {
    try {
      const where = this.buildFilters(filters);
      const records = await (this.prisma as any).financialMovement.findMany({
        where,
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: { movementDate: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByDateRange(startDate: Date, endDate: Date, type?: FinancialType): Promise<FinancialMovement[]> {
    try {
      const where: Record<string, unknown> = {
        date: { gte: startDate, lte: endDate },
      };
      if (type) where.type = type;
      const records = await (this.prisma as any).financialMovement.findMany({
        where,
        orderBy: { date: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByThirdParty(thirdPartyId: UniqueId): Promise<FinancialMovement[]> {
    try {
      const records = await (this.prisma as any).financialMovement.findMany({
        where: { thirdPartyId: thirdPartyId.value },
        orderBy: { date: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByLot(lotId: UniqueId): Promise<FinancialMovement[]> {
    try {
      const records = await (this.prisma as any).financialMovement.findMany({
        where: { lotId: lotId.value },
        orderBy: { date: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findOverdue(): Promise<FinancialMovement[]> {
    try {
      const records = await (this.prisma as any).financialMovement.findMany({
        where: {
          dueDate: { lt: new Date() },
          status: { notIn: [FinancialStatus.PAID, FinancialStatus.CANCELLED] },
        },
        orderBy: { dueDate: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findPendingApproval(): Promise<FinancialMovement[]> {
    try {
      const records = await (this.prisma as any).financialMovement.findMany({
        where: { status: FinancialStatus.PENDING },
        orderBy: { movementDate: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(movement: FinancialMovement): Promise<FinancialMovement> {
    try {
      const record = await (this.prisma as any).financialMovement.create({
        data: this.toData(movement),
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(movement: FinancialMovement): Promise<FinancialMovement> {
    try {
      const data = this.toData(movement);
      delete data.id;
      delete data.createdAt;
      const record = await (this.prisma as any).financialMovement.update({
        where: { id: movement.id.value },
        data,
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: UniqueId): Promise<void> {
    try {
      await (this.prisma as any).financialMovement.delete({
        where: { id: id.value },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private buildFilters(filters: FinancialFilters): Record<string, unknown> {
    const where: Record<string, unknown> = {};
    if (filters.type) where.type = filters.type;
    if (filters.category) where.category = filters.category;
    if (filters.status) where.status = filters.status;
    if (filters.thirdPartyId) where.thirdPartyId = filters.thirdPartyId;
    if (filters.lotId) where.lotId = filters.lotId;
    if (filters.startDate || filters.endDate) {
      const dateFilter: Record<string, Date> = {};
      if (filters.startDate) dateFilter.gte = filters.startDate;
      if (filters.endDate) dateFilter.lte = filters.endDate;
      where.movementDate = dateFilter;
    }
    if (filters.search) {
      where.OR = [
        { description: { contains: filters.search, mode: 'insensitive' } },
        { voucherNumber: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  private toData(movement: FinancialMovement): Record<string, unknown> {
    return {
      id: movement.id.value,
      voucherNumber: movement.voucherNumber,
      type: movement.type,
      category: movement.category,
      subcategory: movement.subcategory,
      amount: movement.amount,
      currency: movement.currency,
      exchangeRate: movement.exchangeRate,
      baseAmount: movement.baseAmount,
      movementDate: movement.date,
      dueDate: movement.dueDate,
      paidDate: movement.paymentDate,
      paymentMethod: movement.paymentMethod,
      description: movement.description,
      thirdPartyId: movement.thirdPartyId?.value,
      gmaId: movement.gmaId?.value,
      lotId: movement.lotId?.value,
      productId: movement.productId?.value,
      registeredBy: movement.registeredBy.value,
      approvedBy: movement.approvedBy?.value,
      status: movement.status,
      isRecurring: movement.isRecurring,
      frequency: movement.frequency,
      documentUrl: movement.documentUrl,
      observations: movement.observations,
      createdAt: movement.createdAt,
      updatedAt: movement.updatedAt,
    };
  }

  private toDomain(record: any): FinancialMovement {
    return FinancialMovement.create(
      {
        voucherNumber: record.voucherNumber ?? undefined,
        type: record.type as FinancialType,
        category: record.category,
        subcategory: record.subcategory ?? undefined,
        amount: record.amount,
        currency: record.currency,
        exchangeRate: record.exchangeRate ?? undefined,
        baseAmount: record.baseAmount ?? undefined,
        date: new Date(record.movementDate),
        dueDate: record.dueDate ? new Date(record.dueDate) : undefined,
        paymentDate: record.paidDate ? new Date(record.paidDate) : undefined,
        paymentMethod: record.paymentMethod ? (record.paymentMethod as PaymentMethod) : undefined,
        description: record.description,
        thirdPartyId: record.thirdPartyId ? new UniqueId(record.thirdPartyId) : undefined,
        gmaId: record.gmaId ? new UniqueId(record.gmaId) : undefined,
        lotId: record.lotId ? new UniqueId(record.lotId) : undefined,
        productId: record.productId ? new UniqueId(record.productId) : undefined,
        registeredBy: new UniqueId(record.registeredBy),
        approvedBy: record.approvedBy ? new UniqueId(record.approvedBy) : undefined,
        status: record.status as FinancialStatus,
        isRecurring: record.isRecurring,
        frequency: record.frequency ?? undefined,
        documentUrl: record.documentUrl ?? undefined,
        observations: record.observations ?? undefined,
      },
      new UniqueId(record.id),
      new Date(record.createdAt),
      new Date(record.updatedAt),
    );
  }
}
