import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { IHealthTaskRepository, TaskFilters } from '../../../domain/health/repositories';
import { HealthTask } from '../../../domain/health/entities/HealthTask';
import { TaskStatus } from '../../../domain/health/enums';

export class InMemoryHealthTaskRepository implements IHealthTaskRepository {
  private items: Map<string, HealthTask> = new Map();

  async findById(id: UniqueId): Promise<HealthTask | null> {
    return this.items.get(id.value) ?? null;
  }

  async findByCode(code: string): Promise<HealthTask | null> {
    const all = Array.from(this.items.values());
    return all.find((t) => t.code === code) ?? null;
  }

  async findAll(filters: TaskFilters, pagination: Pagination): Promise<HealthTask[]> {
    let result = Array.from(this.items.values());
    if (filters.type) {
      result = result.filter((t) => t.type === filters.type);
    }
    if (filters.priority) {
      result = result.filter((t) => t.priority === filters.priority);
    }
    if (filters.status) {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters.assignedTo) {
      result = result.filter((t) => t.assignedTo?.value === filters.assignedTo);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter((t) => t.name.toLowerCase().includes(search));
    }
    return result.slice(pagination.offset, pagination.offset + pagination.limit);
  }

  async findPending(): Promise<HealthTask[]> {
    return Array.from(this.items.values()).filter((t) => t.isPending());
  }

  async findOverdue(): Promise<HealthTask[]> {
    return Array.from(this.items.values()).filter((t) => t.isOverdue());
  }

  async findAssignedTo(userId: UniqueId): Promise<HealthTask[]> {
    return Array.from(this.items.values()).filter(
      (t) => t.assignedTo?.value === userId.value,
    );
  }

  async create(task: HealthTask): Promise<HealthTask> {
    this.items.set(task.id.value, task);
    return task;
  }

  async update(task: HealthTask): Promise<HealthTask> {
    this.items.set(task.id.value, task);
    return task;
  }

  async delete(id: UniqueId): Promise<void> {
    this.items.delete(id.value);
  }

  // Test helpers
  clear(): void {
    this.items.clear();
  }

  getAll(): HealthTask[] {
    return Array.from(this.items.values());
  }
}
