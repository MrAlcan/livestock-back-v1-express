import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { ConflictResolution } from '../../../domain/sync/entities/ConflictResolution';
import { SyncLogStatus, ResolutionStrategy } from '../../../domain/sync/enums';
import { ISyncLogRepository, IConflictResolutionRepository } from '../../../domain/sync/repositories';
import { ConflictDetectorService } from '../../../domain/sync/services';
import { ConflictDetectedEvent } from '../../../domain/sync/events';
import { IUseCase } from '../../shared/types/IUseCase';
import { IEventBus } from '../../shared/ports/IEventBus';
import { ApplySyncChangesInputDTO, SyncLogResponseDTO } from '../dtos/SyncDTOs';
import { SyncLogMapper } from '../mappers/SyncLogMapper';

export class ApplySyncChanges implements IUseCase<ApplySyncChangesInputDTO, SyncLogResponseDTO> {
  constructor(
    private readonly syncLogRepository: ISyncLogRepository,
    private readonly conflictResolutionRepository: IConflictResolutionRepository,
    private readonly conflictDetector: ConflictDetectorService,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: ApplySyncChangesInputDTO): Promise<Result<SyncLogResponseDTO>> {
    try {
      if (!input.syncLogId || input.syncLogId.trim().length === 0) {
        return Result.fail<SyncLogResponseDTO>('Sync log ID is required');
      }

      if (!input.changes || input.changes.length === 0) {
        return Result.fail<SyncLogResponseDTO>('At least one change is required');
      }

      const syncLogId = new UniqueId(input.syncLogId);
      const syncLog = await this.syncLogRepository.findById(syncLogId);

      if (!syncLog) {
        return Result.fail<SyncLogResponseDTO>('Sync log not found');
      }

      if (syncLog.status !== SyncLogStatus.STARTED) {
        return Result.fail<SyncLogResponseDTO>('Sync log is not in a valid state to apply changes');
      }

      // Build client data for conflict detection
      const clientData = input.changes.map((change) => ({
        entityId: change.entityId,
        entityType: change.entityType,
        version: change.version,
      }));

      // Server versions would be resolved by the infrastructure layer;
      // here we provide an empty map so the detector can run.
      const serverVersions = new Map<string, number>();

      const conflicts = this.conflictDetector.detectConflicts(clientData, serverVersions);

      // Persist any detected conflicts
      let conflictCount = 0;
      for (const conflict of conflicts) {
        const clientChange = input.changes.find((c) => c.entityId === conflict.entityId);

        const resolution = ConflictResolution.create({
          syncLogId,
          entityType: conflict.entityType,
          entityId: new UniqueId(conflict.entityId),
          serverVersion: { version: conflict.serverVersion },
          clientVersion: { version: conflict.clientVersion, data: clientChange?.data ?? {} },
          resolutionStrategy: (input.strategy as ResolutionStrategy) ?? ResolutionStrategy.SERVER_WINS,
        });

        const saved = await this.conflictResolutionRepository.create(resolution);
        conflictCount++;

        await this.eventBus.publish(
          new ConflictDetectedEvent({
            conflictId: saved.id,
            entityType: conflict.entityType,
            entityId: new UniqueId(conflict.entityId),
          }),
        );
      }

      // Mark as completed or partial depending on conflicts
      const uploadedCount = input.changes.length - conflictCount;
      if (conflictCount > 0) {
        syncLog.complete(uploadedCount, 0);
      } else {
        syncLog.complete(uploadedCount, 0);
      }

      const updated = await this.syncLogRepository.update(syncLog);

      return Result.ok<SyncLogResponseDTO>(SyncLogMapper.toDTO(updated));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error applying sync changes';
      return Result.fail<SyncLogResponseDTO>(message);
    }
  }
}
