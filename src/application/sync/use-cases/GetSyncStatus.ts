import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { createPagination } from '../../../domain/shared/Pagination';
import { ISyncLogRepository, IConflictResolutionRepository } from '../../../domain/sync/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { SyncStatusResponseDTO } from '../dtos/SyncDTOs';

interface GetSyncStatusInput {
  readonly deviceId: string;
}

export class GetSyncStatus implements IUseCase<GetSyncStatusInput, SyncStatusResponseDTO> {
  constructor(
    private readonly syncLogRepository: ISyncLogRepository,
    private readonly conflictResolutionRepository: IConflictResolutionRepository,
  ) {}

  async execute(input: GetSyncStatusInput): Promise<Result<SyncStatusResponseDTO>> {
    try {
      if (!input.deviceId || input.deviceId.trim().length === 0) {
        return Result.fail<SyncStatusResponseDTO>('Device ID is required');
      }

      const pagination = createPagination(1, 1);
      const recentLogs = await this.syncLogRepository.findByDevice(input.deviceId.trim(), pagination);

      const lastSync = recentLogs.length > 0 ? recentLogs[0] : null;
      const lastSyncDate = lastSync?.endDate ?? lastSync?.startDate;

      const unresolvedConflicts = await this.conflictResolutionRepository.findUnresolved();

      // Pending changes are determined by logs that ended with errors
      const errorLogs = await this.syncLogRepository.findWithErrors();
      const pendingChanges = errorLogs.length;

      return Result.ok<SyncStatusResponseDTO>({
        pendingChanges,
        lastSyncDate: lastSyncDate?.toISOString(),
        conflicts: unresolvedConflicts.length,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error getting sync status';
      return Result.fail<SyncStatusResponseDTO>(message);
    }
  }
}
