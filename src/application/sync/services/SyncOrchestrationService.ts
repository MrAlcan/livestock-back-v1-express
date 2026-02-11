import { Result } from '../../../domain/shared/Result';
import { ISyncLogRepository, IConflictResolutionRepository } from '../../../domain/sync/repositories';
import { ConflictDetectorService } from '../../../domain/sync/services';
import { IEventBus } from '../../shared/ports/IEventBus';
import {
  InitiateSyncInputDTO,
  ApplySyncChangesInputDTO,
  SyncLogResponseDTO,
  SyncStatusResponseDTO,
  ConflictResolutionResponseDTO,
} from '../dtos/SyncDTOs';
import { InitiateSync } from '../use-cases/InitiateSync';
import { ApplySyncChanges } from '../use-cases/ApplySyncChanges';
import { MarkSyncCompleted } from '../use-cases/MarkSyncCompleted';
import { MarkSyncFailed } from '../use-cases/MarkSyncFailed';
import { GetSyncStatus } from '../use-cases/GetSyncStatus';
import { ListUnresolvedConflicts } from '../use-cases/ListUnresolvedConflicts';

export class SyncOrchestrationService {
  private readonly initiateSync: InitiateSync;
  private readonly applySyncChanges: ApplySyncChanges;
  private readonly markSyncCompleted: MarkSyncCompleted;
  private readonly markSyncFailed: MarkSyncFailed;
  private readonly getSyncStatus: GetSyncStatus;
  private readonly listUnresolvedConflicts: ListUnresolvedConflicts;

  constructor(
    private readonly syncLogRepository: ISyncLogRepository,
    private readonly conflictResolutionRepository: IConflictResolutionRepository,
    private readonly conflictDetector: ConflictDetectorService,
    private readonly eventBus: IEventBus,
  ) {
    this.initiateSync = new InitiateSync(syncLogRepository, eventBus);
    this.applySyncChanges = new ApplySyncChanges(
      syncLogRepository,
      conflictResolutionRepository,
      conflictDetector,
      eventBus,
    );
    this.markSyncCompleted = new MarkSyncCompleted(syncLogRepository, eventBus);
    this.markSyncFailed = new MarkSyncFailed(syncLogRepository);
    this.getSyncStatus = new GetSyncStatus(syncLogRepository, conflictResolutionRepository);
    this.listUnresolvedConflicts = new ListUnresolvedConflicts(conflictResolutionRepository);
  }

  /**
   * Orchestrates the full sync flow: initiate, apply changes, and finalize.
   */
  async performFullSync(
    initInput: InitiateSyncInputDTO,
    changesInput: Omit<ApplySyncChangesInputDTO, 'syncLogId'>,
  ): Promise<Result<SyncLogResponseDTO>> {
    // Step 1: Initiate sync
    const initiateResult = await this.initiateSync.execute(initInput);
    if (initiateResult.isFailure) {
      return Result.fail<SyncLogResponseDTO>(initiateResult.error);
    }

    const syncLogId = initiateResult.value.id;

    try {
      // Step 2: Apply changes
      const applyResult = await this.applySyncChanges.execute({
        syncLogId,
        changes: changesInput.changes,
        strategy: changesInput.strategy,
      });

      if (applyResult.isFailure) {
        // Mark sync as failed if changes could not be applied
        await this.markSyncFailed.execute({
          syncLogId,
          errorMessage: applyResult.error,
        });
        return Result.fail<SyncLogResponseDTO>(applyResult.error);
      }

      return Result.ok<SyncLogResponseDTO>(applyResult.value);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error during full sync';

      // Best-effort: mark the sync as failed
      await this.markSyncFailed.execute({
        syncLogId,
        errorMessage: message,
      });

      return Result.fail<SyncLogResponseDTO>(message);
    }
  }

  /**
   * Gets the current sync status for a device.
   */
  async getDeviceSyncStatus(deviceId: string): Promise<Result<SyncStatusResponseDTO>> {
    return this.getSyncStatus.execute({ deviceId });
  }

  /**
   * Lists all unresolved conflicts, optionally filtered by sync log.
   */
  async getUnresolvedConflicts(syncLogId?: string): Promise<Result<ConflictResolutionResponseDTO[]>> {
    return this.listUnresolvedConflicts.execute({ syncLogId });
  }
}
