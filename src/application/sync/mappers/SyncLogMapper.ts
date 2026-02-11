import { SyncLog } from '../../../domain/sync/entities/SyncLog';
import { SyncLogResponseDTO } from '../dtos/SyncDTOs';

export class SyncLogMapper {
  static toDTO(syncLog: SyncLog): SyncLogResponseDTO {
    return {
      id: syncLog.id.value,
      deviceId: syncLog.deviceId,
      userId: syncLog.userId.value,
      startDate: syncLog.startDate.toISOString(),
      endDate: syncLog.endDate?.toISOString(),
      status: syncLog.status,
      uploadedRecords: syncLog.uploadedRecords,
      downloadedRecords: syncLog.downloadedRecords,
      conflictRecords: syncLog.conflictRecords,
      errorMessage: syncLog.errorMessage,
      durationSeconds: syncLog.durationSeconds,
    };
  }
}
