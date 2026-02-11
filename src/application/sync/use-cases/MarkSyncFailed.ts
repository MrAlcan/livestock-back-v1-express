import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { SyncLogStatus } from '../../../domain/sync/enums';
import { ISyncLogRepository } from '../../../domain/sync/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { SyncLogResponseDTO } from '../dtos/SyncDTOs';
import { SyncLogMapper } from '../mappers/SyncLogMapper';

interface MarkSyncFailedInput {
  readonly syncLogId: string;
  readonly errorMessage: string;
}

export class MarkSyncFailed implements IUseCase<MarkSyncFailedInput, SyncLogResponseDTO> {
  constructor(
    private readonly syncLogRepository: ISyncLogRepository,
  ) {}

  async execute(input: MarkSyncFailedInput): Promise<Result<SyncLogResponseDTO>> {
    try {
      if (!input.syncLogId || input.syncLogId.trim().length === 0) {
        return Result.fail<SyncLogResponseDTO>('Sync log ID is required');
      }

      if (!input.errorMessage || input.errorMessage.trim().length === 0) {
        return Result.fail<SyncLogResponseDTO>('Error message is required');
      }

      const syncLogId = new UniqueId(input.syncLogId);
      const syncLog = await this.syncLogRepository.findById(syncLogId);

      if (!syncLog) {
        return Result.fail<SyncLogResponseDTO>('Sync log not found');
      }

      if (syncLog.status !== SyncLogStatus.STARTED) {
        return Result.fail<SyncLogResponseDTO>('Sync log is not in STARTED status');
      }

      syncLog.fail(input.errorMessage.trim());

      const updated = await this.syncLogRepository.update(syncLog);

      return Result.ok<SyncLogResponseDTO>(SyncLogMapper.toDTO(updated));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error marking sync as failed';
      return Result.fail<SyncLogResponseDTO>(message);
    }
  }
}
