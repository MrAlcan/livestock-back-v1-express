import { UniqueId } from '../../shared/Entity';
import { Pagination } from '../../shared/Pagination';
import { SyncLog } from '../entities/SyncLog';
import { ConflictResolution } from '../entities/ConflictResolution';

export interface ISyncLogRepository {
  findById(id: UniqueId): Promise<SyncLog | null>;
  findByDevice(deviceId: string, pagination: Pagination): Promise<SyncLog[]>;
  findByUser(userId: UniqueId, pagination: Pagination): Promise<SyncLog[]>;
  findWithErrors(): Promise<SyncLog[]>;
  create(log: SyncLog): Promise<SyncLog>;
  update(log: SyncLog): Promise<SyncLog>;
}

export interface IConflictResolutionRepository {
  findById(id: UniqueId): Promise<ConflictResolution | null>;
  findBySyncLog(syncLogId: UniqueId): Promise<ConflictResolution[]>;
  findUnresolved(): Promise<ConflictResolution[]>;
  create(conflict: ConflictResolution): Promise<ConflictResolution>;
  update(conflict: ConflictResolution): Promise<ConflictResolution>;
}
