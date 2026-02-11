import { IInventoryMovementRepository } from '../../../domain/health/repositories';
import { InventoryMovement } from '../../../domain/health/entities/InventoryMovement';
import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { InventoryMovementType } from '../../../domain/health/enums';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaInventoryMovementRepository
  extends PrismaBaseRepository
  implements IInventoryMovementRepository {

  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaInventoryMovementRepository');
  }

  async findById(id: UniqueId): Promise<InventoryMovement | null> {
    try {
      const record = await (this.prisma as any).inventoryMovement.findUnique({
        where: { id: id.value },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByProduct(productId: UniqueId, pagination: Pagination): Promise<InventoryMovement[]> {
    try {
      const records = await (this.prisma as any).inventoryMovement.findMany({
        where: { productId: productId.value },
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: { movementDate: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<InventoryMovement[]> {
    try {
      const records = await (this.prisma as any).inventoryMovement.findMany({
        where: {
          movementDate: { gte: startDate, lte: endDate },
        },
        orderBy: { movementDate: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(movement: InventoryMovement): Promise<InventoryMovement> {
    try {
      const record = await (this.prisma as any).inventoryMovement.create({
        data: {
          id: movement.id.value,
          productId: movement.productId.value,
          movementType: movement.movementType,
          quantity: movement.quantity,
          unit: movement.unit,
          unitCost: movement.unitCost,
          totalCost: movement.totalCost,
          previousStock: movement.previousStock,
          newStock: movement.newStock,
          movementDate: movement.movementDate,
          productBatch: movement.productBatch,
          expirationDate: movement.expirationDate,
          supplierId: movement.supplierId?.value,
          linkedEventId: movement.linkedEventId?.value,
          registeredBy: movement.registeredBy.value,
          reason: movement.reason,
          referenceDocument: movement.referenceDocument,
          observations: movement.observations,
          createdAt: movement.createdAt,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private toDomain(record: any): InventoryMovement {
    return InventoryMovement.create(
      {
        productId: new UniqueId(record.productId),
        movementType: record.movementType as InventoryMovementType,
        quantity: record.quantity,
        unit: record.unit,
        unitCost: record.unitCost ?? undefined,
        totalCost: record.totalCost ?? undefined,
        previousStock: record.previousStock,
        newStock: record.newStock,
        movementDate: new Date(record.movementDate),
        productBatch: record.productBatch ?? undefined,
        expirationDate: record.expirationDate ? new Date(record.expirationDate) : undefined,
        supplierId: record.supplierId ? new UniqueId(record.supplierId) : undefined,
        linkedEventId: record.linkedEventId ? new UniqueId(record.linkedEventId) : undefined,
        registeredBy: new UniqueId(record.registeredBy),
        reason: record.reason ?? undefined,
        referenceDocument: record.referenceDocument ?? undefined,
        observations: record.observations ?? undefined,
      },
      new UniqueId(record.id),
      new Date(record.createdAt),
    );
  }
}
