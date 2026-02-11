import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { HealthTask } from '../../../domain/health/entities/HealthTask';
import { IHealthTaskRepository } from '../../../domain/health/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { UpdateHealthTaskInputDTO, HealthTaskResponseDTO } from '../dtos/HealthDTOs';
import { HealthTaskMapper } from '../mappers/HealthTaskMapper';

export class UpdateHealthTask implements IUseCase<UpdateHealthTaskInputDTO, HealthTaskResponseDTO> {
  constructor(
    private readonly healthTaskRepository: IHealthTaskRepository,
  ) {}

  async execute(input: UpdateHealthTaskInputDTO): Promise<Result<HealthTaskResponseDTO>> {
    try {
      const task = await this.healthTaskRepository.findById(new UniqueId(input.id));
      if (!task) {
        return Result.fail<HealthTaskResponseDTO>('Health task not found');
      }

      const updatedTask = HealthTask.create(
        {
          code: task.code,
          name: input.name !== undefined ? input.name : task.name,
          type: task.type,
          creatorId: task.creatorId,
          assignedTo: input.assignedTo !== undefined ? new UniqueId(input.assignedTo) : task.assignedTo,
          productId: task.productId,
          estimatedQuantity: task.estimatedQuantity,
          startDate: task.startDate,
          dueDate: task.dueDate,
          priority: task.priority,
          status: input.status !== undefined ? input.status : task.status,
          completedDate: task.completedDate,
          completionPct: input.completionPct !== undefined ? input.completionPct : task.completionPct,
          observations: input.observations !== undefined ? input.observations : task.observations,
          instructions: task.instructions,
          requiresNotification: task.requiresNotification,
        },
        task.id,
        task.createdAt,
      );

      const saved = await this.healthTaskRepository.update(updatedTask);
      return Result.ok<HealthTaskResponseDTO>(HealthTaskMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error updating health task';
      return Result.fail<HealthTaskResponseDTO>(message);
    }
  }
}
