import { ISyncLogRepository } from '../../../domain/sync/repositories';
import { SyncLog } from '../../../domain/sync/entities/SyncLog';
import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { SyncLogStatus } from '../../../domain/sync/enums';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaSyncLogRepository
  extends PrismaBaseRepository
  implements ISyncLogRepository {

  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaSyncLogRepository');
  }

  async findById(id: UniqueId): Promise<SyncLog | null> {
    try {
      const record = await (this.prisma as any).syncLog.findUnique({
        where: { id: id.value },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByDevice(deviceId: string, pagination: Pagination): Promise<SyncLog[]> {
    try {
      const records = await (this.prisma as any).syncLog.findMany({
        where: { deviceId },
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: { startTime: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByUser(userId: UniqueId, pagination: Pagination): Promise<SyncLog[]> {
    try {
      const records = await (this.prisma as any).syncLog.findMany({
        where: { userId: userId.value },
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: { startTime: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findWithErrors(): Promise<SyncLog[]> {
    try {
      const records = await (this.prisma as any).syncLog.findMany({
        where: { status: SyncLogStatus.ERROR },
        orderBy: { startTime: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(log: SyncLog): Promise<SyncLog> {
    try {
      const record = await (this.prisma as any).syncLog.create({
        data: {
          id: log.id.value,
          deviceId: log.deviceId,
          userId: log.userId.value,
          startTime: log.startDate,
          endTime: log.endDate,
          status: log.status,
          recordsSent: log.uploadedRecords ?? 0,
          recordsReceived: log.downloadedRecords ?? 0,
          conflictsFound: log.conflictRecords ?? 0,
          conflictsResolved: 0,
          errorMessage: log.errorMessage,
          createdAt: log.createdAt,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(log: SyncLog): Promise<SyncLog> {
    try {
      const record = await (this.prisma as any).syncLog.update({
        where: { id: log.id.value },
        data: {
          endTime: log.endDate,
          status: log.status,
          recordsSent: log.uploadedRecords ?? 0,
          recordsReceived: log.downloadedRecords ?? 0,
          conflictsFound: log.conflictRecords ?? 0,
          errorMessage: log.errorMessage,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private toDomain(record: any): SyncLog {
    return SyncLog.create(
      {
        deviceId: record.deviceId,
        userId: new UniqueId(record.userId),
        startDate: new Date(record.startTime),
        endDate: record.endTime ? new Date(record.endTime) : undefined,
        status: record.status as SyncLogStatus,
        uploadedRecords: record.recordsSent ?? undefined,
        downloadedRecords: record.recordsReceived ?? undefined,
        conflictRecords: record.conflictsFound ?? undefined,
        conflicts: undefined,
        errorMessage: record.errorMessage ?? undefined,
        durationSeconds: undefined,
        deviceMetadata: undefined,
      },
      new UniqueId(record.id),
      new Date(record.createdAt),
    );
  }
}
