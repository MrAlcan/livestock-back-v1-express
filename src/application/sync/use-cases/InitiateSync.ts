import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { SyncLog } from '../../../domain/sync/entities/SyncLog';
import { SyncLogStatus } from '../../../domain/sync/enums';
import { ISyncLogRepository } from '../../../domain/sync/repositories';
import { SyncStartedEvent } from '../../../domain/sync/events';
import { IUseCase } from '../../shared/types/IUseCase';
import { IEventBus } from '../../shared/ports/IEventBus';
import { InitiateSyncInputDTO, SyncLogResponseDTO } from '../dtos/SyncDTOs';
import { SyncLogMapper } from '../mappers/SyncLogMapper';

export class InitiateSync implements IUseCase<InitiateSyncInputDTO, SyncLogResponseDTO> {
  constructor(
    private readonly syncLogRepository: ISyncLogRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: InitiateSyncInputDTO): Promise<Result<SyncLogResponseDTO>> {
    try {
      if (!input.deviceId || input.deviceId.trim().length === 0) {
        return Result.fail<SyncLogResponseDTO>('Device ID is required');
      }

      if (!input.userId || input.userId.trim().length === 0) {
        return Result.fail<SyncLogResponseDTO>('User ID is required');
      }

      const userId = new UniqueId(input.userId);

      const syncLog = SyncLog.create({
        deviceId: input.deviceId.trim(),
        userId,
        startDate: new Date(),
        status: SyncLogStatus.STARTED,
        deviceMetadata: input.deviceMetadata,
      });

      const saved = await this.syncLogRepository.create(syncLog);

      await this.eventBus.publish(
        new SyncStartedEvent({
          syncLogId: saved.id,
          deviceId: saved.deviceId,
          userId: saved.userId,
        }),
      );

      return Result.ok<SyncLogResponseDTO>(SyncLogMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error initiating sync';
      return Result.fail<SyncLogResponseDTO>(message);
    }
  }
}
