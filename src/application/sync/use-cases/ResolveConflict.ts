import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { ResolutionStrategy } from '../../../domain/sync/enums';
import { IConflictResolutionRepository } from '../../../domain/sync/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { ResolveConflictInputDTO, ConflictResolutionResponseDTO } from '../dtos/SyncDTOs';
import { ConflictResolutionMapper } from '../mappers/ConflictResolutionMapper';

export class ResolveConflict implements IUseCase<ResolveConflictInputDTO, ConflictResolutionResponseDTO> {
  constructor(
    private readonly conflictResolutionRepository: IConflictResolutionRepository,
  ) {}

  async execute(input: ResolveConflictInputDTO): Promise<Result<ConflictResolutionResponseDTO>> {
    try {
      if (!input.conflictId || input.conflictId.trim().length === 0) {
        return Result.fail<ConflictResolutionResponseDTO>('Conflict ID is required');
      }

      if (!input.resolutionStrategy || input.resolutionStrategy.trim().length === 0) {
        return Result.fail<ConflictResolutionResponseDTO>('Resolution strategy is required');
      }

      if (!input.resolvedBy || input.resolvedBy.trim().length === 0) {
        return Result.fail<ConflictResolutionResponseDTO>('Resolver user ID is required');
      }

      const validStrategies = Object.values(ResolutionStrategy);
      if (!validStrategies.includes(input.resolutionStrategy as ResolutionStrategy)) {
        return Result.fail<ConflictResolutionResponseDTO>(
          `Invalid resolution strategy. Valid values: ${validStrategies.join(', ')}`,
        );
      }

      const conflictId = new UniqueId(input.conflictId);
      const conflict = await this.conflictResolutionRepository.findById(conflictId);

      if (!conflict) {
        return Result.fail<ConflictResolutionResponseDTO>('Conflict not found');
      }

      if (conflict.isResolved()) {
        return Result.fail<ConflictResolutionResponseDTO>('Conflict has already been resolved');
      }

      const strategy = input.resolutionStrategy as ResolutionStrategy;
      const resolvedBy = new UniqueId(input.resolvedBy);

      conflict.resolve(strategy, resolvedBy);

      const updated = await this.conflictResolutionRepository.update(conflict);

      return Result.ok<ConflictResolutionResponseDTO>(ConflictResolutionMapper.toDTO(updated));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error resolving conflict';
      return Result.fail<ConflictResolutionResponseDTO>(message);
    }
  }
}
