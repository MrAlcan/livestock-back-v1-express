import { Result } from '../../../domain/shared/Result';
import { IHealthTaskRepository } from '../../../domain/health/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { HealthTaskResponseDTO } from '../dtos/HealthDTOs';
import { HealthTaskMapper } from '../mappers/HealthTaskMapper';

export class GetOverdueHealthTasks implements IUseCase<void, HealthTaskResponseDTO[]> {
  constructor(
    private readonly healthTaskRepository: IHealthTaskRepository,
  ) {}

  async execute(): Promise<Result<HealthTaskResponseDTO[]>> {
    try {
      const tasks = await this.healthTaskRepository.findOverdue();
      const dtos = tasks.map(HealthTaskMapper.toDTO);

      return Result.ok<HealthTaskResponseDTO[]>(dtos);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error getting overdue health tasks';
      return Result.fail<HealthTaskResponseDTO[]>(message);
    }
  }
}
