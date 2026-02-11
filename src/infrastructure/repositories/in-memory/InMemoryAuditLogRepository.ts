import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { IAuditLogRepository } from '../../../domain/auth/repositories/IAuditLogRepository';
import { AuditLog } from '../../../domain/auth/entities/AuditLog';

export class InMemoryAuditLogRepository implements IAuditLogRepository {
  private items: Map<string, AuditLog> = new Map();

  async create(log: AuditLog): Promise<AuditLog> {
    this.items.set(log.id.value, log);
    return log;
  }

  async findByUserId(userId: UniqueId, pagination: Pagination): Promise<AuditLog[]> {
    const filtered = Array.from(this.items.values()).filter(
      (log) => log.userId.value === userId.value,
    );
    return filtered.slice(pagination.offset, pagination.offset + pagination.limit);
  }

  async findByTable(tableName: string, pagination: Pagination): Promise<AuditLog[]> {
    const filtered = Array.from(this.items.values()).filter(
      (log) => log.tableName === tableName,
    );
    return filtered.slice(pagination.offset, pagination.offset + pagination.limit);
  }

  async findByRecordId(tableName: string, recordId: string): Promise<AuditLog[]> {
    return Array.from(this.items.values()).filter(
      (log) => log.tableName === tableName && log.recordId === recordId,
    );
  }

  // Test helpers
  clear(): void {
    this.items.clear();
  }

  getAll(): AuditLog[] {
    return Array.from(this.items.values());
  }
}
