import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { SyncLogStatus } from '../../../domain/sync/enums';
import { ISyncLogRepository } from '../../../domain/sync/repositories';
import { SyncCompletedEvent } from '../../../domain/sync/events';
import { IUseCase } from '../../shared/types/IUseCase';
import { IEventBus } from '../../shared/ports/IEventBus';
import { SyncLogResponseDTO } from '../dtos/SyncDTOs';
import { SyncLogMapper } from '../mappers/SyncLogMapper';

interface MarkSyncCompletedInput {
  readonly syncLogId: string;
  readonly uploadedRecords: number;
  readonly downloadedRecords: number;
}

export class MarkSyncCompleted implements IUseCase<MarkSyncCompletedInput, SyncLogResponseDTO> {
  constructor(
    private readonly syncLogRepository: ISyncLogRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: MarkSyncCompletedInput): Promise<Result<SyncLogResponseDTO>> {
    try {
      if (!input.syncLogId || input.syncLogId.trim().length === 0) {
        return Result.fail<SyncLogResponseDTO>('Sync log ID is required');
      }

      if (input.uploadedRecords < 0) {
        return Result.fail<SyncLogResponseDTO>('Uploaded records count cannot be negative');
      }

      if (input.downloadedRecords < 0) {
        return Result.fail<SyncLogResponseDTO>('Downloaded records count cannot be negative');
      }

      const syncLogId = new UniqueId(input.syncLogId);
      const syncLog = await this.syncLogRepository.findById(syncLogId);

      if (!syncLog) {
        return Result.fail<SyncLogResponseDTO>('Sync log not found');
      }

      if (syncLog.status !== SyncLogStatus.STARTED) {
        return Result.fail<SyncLogResponseDTO>('Sync log is not in STARTED status');
      }

      syncLog.complete(input.uploadedRecords, input.downloadedRecords);

      const updated = await this.syncLogRepository.update(syncLog);

      await this.eventBus.publish(
        new SyncCompletedEvent({
          syncLogId: updated.id,
          uploadedRecords: input.uploadedRecords,
          downloadedRecords: input.downloadedRecords,
          conflictRecords: updated.conflictRecords ?? 0,
        }),
      );

      return Result.ok<SyncLogResponseDTO>(SyncLogMapper.toDTO(updated));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error marking sync as completed';
      return Result.fail<SyncLogResponseDTO>(message);
    }
  }
}
