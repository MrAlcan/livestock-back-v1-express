import { ConflictResolution } from '../../../domain/sync/entities/ConflictResolution';
import { ConflictResolutionResponseDTO } from '../dtos/SyncDTOs';

export class ConflictResolutionMapper {
  static toDTO(conflict: ConflictResolution): ConflictResolutionResponseDTO {
    return {
      id: conflict.id.value,
      syncLogId: conflict.syncLogId.value,
      entityType: conflict.entityType,
      entityId: conflict.entityId.value,
      serverVersion: conflict.serverVersion,
      clientVersion: conflict.clientVersion,
      resolutionStrategy: conflict.resolutionStrategy,
      resolvedBy: conflict.resolvedBy?.value,
      resolvedAt: conflict.resolvedAt?.toISOString(),
      notes: conflict.notes,
    };
  }
}
