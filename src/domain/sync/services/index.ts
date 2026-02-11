import { ResolutionStrategy } from '../enums';

export interface SyncConflict {
  entityType: string;
  entityId: string;
  serverVersion: number;
  clientVersion: number;
}

export class ConflictDetectorService {
  detectConflicts(
    clientData: Array<{ entityId: string; entityType: string; version: number }>,
    serverVersions: Map<string, number>,
  ): SyncConflict[] {
    const conflicts: SyncConflict[] = [];

    for (const item of clientData) {
      const serverVersion = serverVersions.get(item.entityId);
      if (serverVersion !== undefined && serverVersion > item.version) {
        conflicts.push({
          entityType: item.entityType,
          entityId: item.entityId,
          serverVersion,
          clientVersion: item.version,
        });
      }
    }

    return conflicts;
  }
}

export class ConflictResolverService {
  resolve<T extends Record<string, unknown>>(
    serverData: T,
    clientData: T,
    strategy: ResolutionStrategy,
  ): T {
    switch (strategy) {
      case ResolutionStrategy.SERVER_WINS:
        return serverData;
      case ResolutionStrategy.CLIENT_WINS:
        return clientData;
      case ResolutionStrategy.ADMIN_DECIDES:
        throw new Error('Admin must resolve this conflict manually');
      case ResolutionStrategy.MERGE:
        throw new Error('Merge strategy is not implemented');
      default:
        return serverData;
    }
  }
}
