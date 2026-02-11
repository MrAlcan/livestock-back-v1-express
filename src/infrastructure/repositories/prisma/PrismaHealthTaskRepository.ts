import { IHealthTaskRepository, TaskFilters } from '../../../domain/health/repositories';
import { HealthTask } from '../../../domain/health/entities/HealthTask';
import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { TaskType, TaskPriority, TaskStatus } from '../../../domain/health/enums';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaHealthTaskRepository
  extends PrismaBaseRepository
  implements IHealthTaskRepository {

  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaHealthTaskRepository');
  }

  async findById(id: UniqueId): Promise<HealthTask | null> {
    try {
      const record = await (this.prisma as any).healthTask.findUnique({
        where: { id: id.value },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByCode(code: string): Promise<HealthTask | null> {
    try {
      const record = await (this.prisma as any).healthTask.findFirst({
        where: { code },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(filters: TaskFilters, pagination: Pagination): Promise<HealthTask[]> {
    try {
      const where = this.buildFilters(filters);
      const records = await (this.prisma as any).healthTask.findMany({
        where,
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: { dueDate: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findPending(): Promise<HealthTask[]> {
    try {
      const records = await (this.prisma as any).healthTask.findMany({
        where: { status: TaskStatus.PENDING },
        orderBy: { dueDate: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findOverdue(): Promise<HealthTask[]> {
    try {
      const records = await (this.prisma as any).healthTask.findMany({
        where: {
          dueDate: { lt: new Date() },
          status: { notIn: [TaskStatus.COMPLETED, TaskStatus.CANCELLED] },
        },
        orderBy: { dueDate: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAssignedTo(userId: UniqueId): Promise<HealthTask[]> {
    try {
      const records = await (this.prisma as any).healthTask.findMany({
        where: { assignedTo: userId.value },
        orderBy: { dueDate: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(task: HealthTask): Promise<HealthTask> {
    try {
      const record = await (this.prisma as any).healthTask.create({
        data: {
          id: task.id.value,
          code: task.code,
          name: task.name,
          type: task.type,
          creatorId: task.creatorId.value,
          assignedTo: task.assignedTo?.value,
          productId: task.productId?.value,
          estimatedQuantity: task.estimatedQuantity,
          startDate: task.startDate,
          dueDate: task.dueDate,
          priority: task.priority,
          status: task.status,
          completedDate: task.completedDate,
          completionPct: task.completionPct,
          observations: task.observations,
          instructions: task.instructions,
          requiresNotification: task.requiresNotification,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(task: HealthTask): Promise<HealthTask> {
    try {
      const record = await (this.prisma as any).healthTask.update({
        where: { id: task.id.value },
        data: {
          code: task.code,
          name: task.name,
          type: task.type,
          assignedTo: task.assignedTo?.value,
          productId: task.productId?.value,
          estimatedQuantity: task.estimatedQuantity,
          startDate: task.startDate,
          dueDate: task.dueDate,
          priority: task.priority,
          status: task.status,
          completedDate: task.completedDate,
          completionPct: task.completionPct,
          observations: task.observations,
          instructions: task.instructions,
          requiresNotification: task.requiresNotification,
          updatedAt: task.updatedAt,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: UniqueId): Promise<void> {
    try {
      await (this.prisma as any).healthTask.delete({
        where: { id: id.value },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private buildFilters(filters: TaskFilters): Record<string, unknown> {
    const where: Record<string, unknown> = {};
    if (filters.type) where.type = filters.type;
    if (filters.priority) where.priority = filters.priority;
    if (filters.status) where.status = filters.status;
    if (filters.assignedTo) where.assignedTo = filters.assignedTo;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { code: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  private toDomain(record: any): HealthTask {
    return HealthTask.create(
      {
        code: record.code ?? undefined,
        name: record.name,
        type: record.type ? (record.type as TaskType) : undefined,
        creatorId: new UniqueId(record.creatorId),
        assignedTo: record.assignedTo ? new UniqueId(record.assignedTo) : undefined,
        productId: record.productId ? new UniqueId(record.productId) : undefined,
        estimatedQuantity: record.estimatedQuantity ?? undefined,
        startDate: record.startDate ? new Date(record.startDate) : undefined,
        dueDate: new Date(record.dueDate),
        priority: record.priority as TaskPriority,
        status: record.status as TaskStatus,
        completedDate: record.completedDate ? new Date(record.completedDate) : undefined,
        completionPct: record.completionPct,
        observations: record.observations ?? undefined,
        instructions: record.instructions ?? undefined,
        requiresNotification: record.requiresNotification,
      },
      new UniqueId(record.id),
      new Date(record.createdAt),
      new Date(record.updatedAt),
    );
  }
}
