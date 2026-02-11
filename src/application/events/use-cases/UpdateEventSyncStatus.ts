import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { SyncStatus } from '../../../domain/animals/enums';
import { IEventRepository } from '../../../domain/events/repositories/IEventRepository';
import { IUseCase } from '../../shared/types/IUseCase';

interface UpdateEventSyncStatusInputDTO {
  readonly eventId: string;
  readonly syncStatus: string;
}

export class UpdateEventSyncStatus implements IUseCase<UpdateEventSyncStatusInputDTO, void> {
  constructor(
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(input: UpdateEventSyncStatusInputDTO): Promise<Result<void>> {
    try {
      // Validate the sync status
      const validStatuses = Object.values(SyncStatus);
      if (!validStatuses.includes(input.syncStatus as SyncStatus)) {
        return Result.fail<void>(
          `Invalid sync status: ${input.syncStatus}. Valid values: ${validStatuses.join(', ')}`,
        );
      }

      // Verify the event exists
      const event = await this.eventRepository.findById(new UniqueId(input.eventId));
      if (!event) {
        return Result.fail<void>('Event not found');
      }

      await this.eventRepository.updateSyncStatus(
        new UniqueId(input.eventId),
        input.syncStatus as SyncStatus,
      );

      return Result.ok<void>();
    } catch (error) {
      return Result.fail<void>(
        error instanceof Error ? error.message : 'Failed to update event sync status',
      );
    }
  }
}
