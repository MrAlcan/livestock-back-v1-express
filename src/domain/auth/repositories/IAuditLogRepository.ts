import { UniqueId } from '../../shared/Entity';
import { Pagination } from '../../shared/Pagination';
import { AuditLog } from '../entities/AuditLog';

export interface IAuditLogRepository {
  create(log: AuditLog): Promise<AuditLog>;
  findByUserId(userId: UniqueId, pagination: Pagination): Promise<AuditLog[]>;
  findByTable(tableName: string, pagination: Pagination): Promise<AuditLog[]>;
  findByRecordId(tableName: string, recordId: string): Promise<AuditLog[]>;
}
