import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IConflictResolutionRepository } from '../../../domain/sync/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { ConflictResolutionResponseDTO } from '../dtos/SyncDTOs';
import { ConflictResolutionMapper } from '../mappers/ConflictResolutionMapper';

interface ListUnresolvedConflictsInput {
  readonly syncLogId?: string;
}

export class ListUnresolvedConflicts implements IUseCase<ListUnresolvedConflictsInput, ConflictResolutionResponseDTO[]> {
  constructor(
    private readonly conflictResolutionRepository: IConflictResolutionRepository,
  ) {}

  async execute(input: ListUnresolvedConflictsInput): Promise<Result<ConflictResolutionResponseDTO[]>> {
    try {
      let conflicts;

      if (input.syncLogId) {
        const syncLogId = new UniqueId(input.syncLogId);
        const allForSync = await this.conflictResolutionRepository.findBySyncLog(syncLogId);
        conflicts = allForSync.filter((c) => !c.isResolved());
      } else {
        conflicts = await this.conflictResolutionRepository.findUnresolved();
      }

      const items = conflicts.map(ConflictResolutionMapper.toDTO);

      return Result.ok<ConflictResolutionResponseDTO[]>(items);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error listing unresolved conflicts';
      return Result.fail<ConflictResolutionResponseDTO[]>(message);
    }
  }
}
