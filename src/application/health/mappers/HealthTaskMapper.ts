import { HealthTask } from '../../../domain/health/entities/HealthTask';
import { HealthTaskResponseDTO } from '../dtos/HealthDTOs';

export class HealthTaskMapper {
  static toDTO(task: HealthTask): HealthTaskResponseDTO {
    return {
      id: task.id.value,
      code: task.code,
      name: task.name,
      type: task.type,
      creatorId: task.creatorId.value,
      assignedTo: task.assignedTo?.value,
      productId: task.productId?.value,
      estimatedQuantity: task.estimatedQuantity,
      startDate: task.startDate?.toISOString(),
      dueDate: task.dueDate.toISOString(),
      priority: task.priority,
      status: task.status,
      completedDate: task.completedDate?.toISOString(),
      completionPct: task.completionPct,
      observations: task.observations,
      instructions: task.instructions,
      requiresNotification: task.requiresNotification,
    };
  }
}
