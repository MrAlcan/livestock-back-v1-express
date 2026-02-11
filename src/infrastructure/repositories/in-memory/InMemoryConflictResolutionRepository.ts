import { UniqueId } from '../../../domain/shared/Entity';
import { IConflictResolutionRepository } from '../../../domain/sync/repositories';
import { ConflictResolution } from '../../../domain/sync/entities/ConflictResolution';

export class InMemoryConflictResolutionRepository implements IConflictResolutionRepository {
  private items: Map<string, ConflictResolution> = new Map();

  async findById(id: UniqueId): Promise<ConflictResolution | null> {
    return this.items.get(id.value) ?? null;
  }

  async findBySyncLog(syncLogId: UniqueId): Promise<ConflictResolution[]> {
    return Array.from(this.items.values()).filter(
      (cr) => cr.syncLogId.value === syncLogId.value,
    );
  }

  async findUnresolved(): Promise<ConflictResolution[]> {
    return Array.from(this.items.values()).filter((cr) => !cr.isResolved());
  }

  async create(conflict: ConflictResolution): Promise<ConflictResolution> {
    this.items.set(conflict.id.value, conflict);
    return conflict;
  }

  async update(conflict: ConflictResolution): Promise<ConflictResolution> {
    this.items.set(conflict.id.value, conflict);
    return conflict;
  }

  // Test helpers
  clear(): void {
    this.items.clear();
  }

  getAll(): ConflictResolution[] {
    return Array.from(this.items.values());
  }
}
