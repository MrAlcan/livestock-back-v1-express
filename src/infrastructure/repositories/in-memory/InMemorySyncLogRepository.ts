import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { ISyncLogRepository } from '../../../domain/sync/repositories';
import { SyncLog } from '../../../domain/sync/entities/SyncLog';
import { SyncLogStatus } from '../../../domain/sync/enums';

export class InMemorySyncLogRepository implements ISyncLogRepository {
  private items: Map<string, SyncLog> = new Map();

  async findById(id: UniqueId): Promise<SyncLog | null> {
    return this.items.get(id.value) ?? null;
  }

  async findByDevice(deviceId: string, pagination: Pagination): Promise<SyncLog[]> {
    const filtered = Array.from(this.items.values()).filter(
      (sl) => sl.deviceId === deviceId,
    );
    return filtered.slice(pagination.offset, pagination.offset + pagination.limit);
  }

  async findByUser(userId: UniqueId, pagination: Pagination): Promise<SyncLog[]> {
    const filtered = Array.from(this.items.values()).filter(
      (sl) => sl.userId.value === userId.value,
    );
    return filtered.slice(pagination.offset, pagination.offset + pagination.limit);
  }

  async findWithErrors(): Promise<SyncLog[]> {
    return Array.from(this.items.values()).filter(
      (sl) => sl.status === SyncLogStatus.ERROR,
    );
  }

  async create(log: SyncLog): Promise<SyncLog> {
    this.items.set(log.id.value, log);
    return log;
  }

  async update(log: SyncLog): Promise<SyncLog> {
    this.items.set(log.id.value, log);
    return log;
  }

  // Test helpers
  clear(): void {
    this.items.clear();
  }

  getAll(): SyncLog[] {
    return Array.from(this.items.values());
  }
}
