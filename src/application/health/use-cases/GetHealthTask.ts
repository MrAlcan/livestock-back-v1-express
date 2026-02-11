import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IHealthTaskRepository } from '../../../domain/health/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { HealthTaskResponseDTO } from '../dtos/HealthDTOs';
import { HealthTaskMapper } from '../mappers/HealthTaskMapper';

export class GetHealthTask implements IUseCase<string, HealthTaskResponseDTO> {
  constructor(
    private readonly healthTaskRepository: IHealthTaskRepository,
  ) {}

  async execute(taskId: string): Promise<Result<HealthTaskResponseDTO>> {
    try {
      const task = await this.healthTaskRepository.findById(new UniqueId(taskId));
      if (!task) {
        return Result.fail<HealthTaskResponseDTO>('Health task not found');
      }

      return Result.ok<HealthTaskResponseDTO>(HealthTaskMapper.toDTO(task));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error getting health task';
      return Result.fail<HealthTaskResponseDTO>(message);
    }
  }
}
