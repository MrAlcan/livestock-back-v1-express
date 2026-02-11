import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { HealthTask } from '../../../domain/health/entities/HealthTask';
import { TaskStatus } from '../../../domain/health/enums';
import { IHealthTaskRepository } from '../../../domain/health/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { CreateHealthTaskInputDTO, HealthTaskResponseDTO } from '../dtos/HealthDTOs';
import { HealthTaskMapper } from '../mappers/HealthTaskMapper';

export class CreateHealthTask implements IUseCase<CreateHealthTaskInputDTO, HealthTaskResponseDTO> {
  constructor(
    private readonly healthTaskRepository: IHealthTaskRepository,
  ) {}

  async execute(input: CreateHealthTaskInputDTO): Promise<Result<HealthTaskResponseDTO>> {
    try {
      const task = HealthTask.create({
        name: input.name,
        type: input.type,
        creatorId: new UniqueId(input.creatorId),
        assignedTo: input.assignedTo ? new UniqueId(input.assignedTo) : undefined,
        productId: input.productId ? new UniqueId(input.productId) : undefined,
        estimatedQuantity: input.estimatedQuantity,
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        dueDate: new Date(input.dueDate),
        priority: input.priority,
        status: TaskStatus.PENDING,
        completionPct: 0,
        requiresNotification: input.requiresNotification ?? false,
        instructions: input.instructions,
        observations: input.observations,
      });

      const saved = await this.healthTaskRepository.create(task);
      return Result.ok<HealthTaskResponseDTO>(HealthTaskMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error creating health task';
      return Result.fail<HealthTaskResponseDTO>(message);
    }
  }
}
