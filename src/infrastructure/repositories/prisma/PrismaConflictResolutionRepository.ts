import { IConflictResolutionRepository } from '../../../domain/sync/repositories';
import { ConflictResolution } from '../../../domain/sync/entities/ConflictResolution';
import { UniqueId } from '../../../domain/shared/Entity';
import { ResolutionStrategy } from '../../../domain/sync/enums';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaConflictResolutionRepository
  extends PrismaBaseRepository
  implements IConflictResolutionRepository {

  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaConflictResolutionRepository');
  }

  async findById(id: UniqueId): Promise<ConflictResolution | null> {
    try {
      const record = await (this.prisma as any).conflictResolution.findUnique({
        where: { id: id.value },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findBySyncLog(syncLogId: UniqueId): Promise<ConflictResolution[]> {
    try {
      const records = await (this.prisma as any).conflictResolution.findMany({
        where: { syncLogId: syncLogId.value },
        orderBy: { createdAt: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findUnresolved(): Promise<ConflictResolution[]> {
    try {
      const records = await (this.prisma as any).conflictResolution.findMany({
        where: { resolvedAt: null },
        orderBy: { createdAt: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(conflict: ConflictResolution): Promise<ConflictResolution> {
    try {
      const record = await (this.prisma as any).conflictResolution.create({
        data: {
          id: conflict.id.value,
          syncLogId: conflict.syncLogId.value,
          entityType: conflict.entityType,
          entityId: conflict.entityId.value,
          serverVersion: conflict.serverVersion,
          clientVersion: conflict.clientVersion,
          resolutionStrategy: conflict.resolutionStrategy,
          resolvedBy: conflict.resolvedBy?.value,
          resolvedAt: conflict.resolvedAt,
          notes: conflict.notes,
          createdAt: conflict.createdAt,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(conflict: ConflictResolution): Promise<ConflictResolution> {
    try {
      const record = await (this.prisma as any).conflictResolution.update({
        where: { id: conflict.id.value },
        data: {
          resolutionStrategy: conflict.resolutionStrategy,
          resolvedBy: conflict.resolvedBy?.value,
          resolvedAt: conflict.resolvedAt,
          notes: conflict.notes,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private toDomain(record: any): ConflictResolution {
    return ConflictResolution.create(
      {
        syncLogId: new UniqueId(record.syncLogId),
        entityType: record.entityType,
        entityId: new UniqueId(record.entityId),
        serverVersion: record.serverVersion,
        clientVersion: record.clientVersion,
        resolutionStrategy: record.resolutionStrategy as ResolutionStrategy,
        resolvedBy: record.resolvedBy ? new UniqueId(record.resolvedBy) : undefined,
        resolvedAt: record.resolvedAt ?? undefined,
        notes: record.notes ?? undefined,
      },
      new UniqueId(record.id),
      record.createdAt,
    );
  }
}
