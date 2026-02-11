import { IAuditLogRepository } from '../../../domain/auth/repositories/IAuditLogRepository';
import { AuditLog } from '../../../domain/auth/entities/AuditLog';
import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { AuditAction } from '../../../domain/auth/enums/AuditAction';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaAuditLogRepository
  extends PrismaBaseRepository
  implements IAuditLogRepository {

  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaAuditLogRepository');
  }

  async create(log: AuditLog): Promise<AuditLog> {
    try {
      const record = await (this.prisma as any).auditLog.create({
        data: {
          id: log.id.value,
          userId: log.userId.value,
          action: log.action,
          tableName: log.tableName,
          recordId: log.recordId,
          oldValues: log.oldValues,
          newValues: log.newValues,
          ipAddress: log.ipAddress,
          userAgent: log.userAgent,
          createdAt: log.createdAt,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByUserId(userId: UniqueId, pagination: Pagination): Promise<AuditLog[]> {
    try {
      const records = await (this.prisma as any).auditLog.findMany({
        where: { userId: userId.value },
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByTable(tableName: string, pagination: Pagination): Promise<AuditLog[]> {
    try {
      const records = await (this.prisma as any).auditLog.findMany({
        where: { tableName },
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByRecordId(tableName: string, recordId: string): Promise<AuditLog[]> {
    try {
      const records = await (this.prisma as any).auditLog.findMany({
        where: { tableName, recordId },
        orderBy: { createdAt: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private toDomain(record: any): AuditLog {
    return AuditLog.create(
      {
        userId: new UniqueId(record.userId),
        action: record.action as AuditAction,
        tableName: record.tableName,
        recordId: record.recordId,
        oldValues: record.oldValues ?? undefined,
        newValues: record.newValues ?? undefined,
        ipAddress: record.ipAddress ?? undefined,
        userAgent: record.userAgent ?? undefined,
      },
      new UniqueId(record.id),
      record.createdAt,
    );
  }
}
