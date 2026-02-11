import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IHealthTaskRepository } from '../../../domain/health/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { IEventBus } from '../../shared/ports/IEventBus';
import { HealthTaskResponseDTO } from '../dtos/HealthDTOs';
import { HealthTaskMapper } from '../mappers/HealthTaskMapper';

export class CompleteHealthTask implements IUseCase<string, HealthTaskResponseDTO> {
  constructor(
    private readonly healthTaskRepository: IHealthTaskRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(taskId: string): Promise<Result<HealthTaskResponseDTO>> {
    try {
      const task = await this.healthTaskRepository.findById(new UniqueId(taskId));
      if (!task) {
        return Result.fail<HealthTaskResponseDTO>('Health task not found');
      }

      task.complete();

      const saved = await this.healthTaskRepository.update(task);

      // Publish domain events
      if (saved.domainEvents.length > 0) {
        await this.eventBus.publishAll(saved.domainEvents);
        saved.clearDomainEvents();
      }

      return Result.ok<HealthTaskResponseDTO>(HealthTaskMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error completing health task';
      return Result.fail<HealthTaskResponseDTO>(message);
    }
  }
}
