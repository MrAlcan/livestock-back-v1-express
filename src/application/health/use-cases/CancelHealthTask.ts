import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IHealthTaskRepository } from '../../../domain/health/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { HealthTaskResponseDTO } from '../dtos/HealthDTOs';
import { HealthTaskMapper } from '../mappers/HealthTaskMapper';

export class CancelHealthTask implements IUseCase<string, HealthTaskResponseDTO> {
  constructor(
    private readonly healthTaskRepository: IHealthTaskRepository,
  ) {}

  async execute(taskId: string): Promise<Result<HealthTaskResponseDTO>> {
    try {
      const task = await this.healthTaskRepository.findById(new UniqueId(taskId));
      if (!task) {
        return Result.fail<HealthTaskResponseDTO>('Health task not found');
      }

      if (task.isCompleted()) {
        return Result.fail<HealthTaskResponseDTO>('Cannot cancel a completed task');
      }

      task.cancel();

      const saved = await this.healthTaskRepository.update(task);
      return Result.ok<HealthTaskResponseDTO>(HealthTaskMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error cancelling health task';
      return Result.fail<HealthTaskResponseDTO>(message);
    }
  }
}
