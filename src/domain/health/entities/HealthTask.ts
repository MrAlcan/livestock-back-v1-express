import { AggregateRoot } from '../../shared/AggregateRoot';
import { UniqueId } from '../../shared/Entity';
import { TaskType, TaskPriority, TaskStatus } from '../enums';

interface HealthTaskProps {
  code?: string;
  name: string;
  type?: TaskType;
  creatorId: UniqueId;
  assignedTo?: UniqueId;
  productId?: UniqueId;
  estimatedQuantity?: number;
  startDate?: Date;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  completedDate?: Date;
  completionPct: number;
  observations?: string;
  instructions?: string;
  requiresNotification: boolean;
}

export class HealthTask extends AggregateRoot<HealthTaskProps> {
  private _code?: string;
  private _name: string;
  private _type?: TaskType;
  private readonly _creatorId: UniqueId;
  private _assignedTo?: UniqueId;
  private _productId?: UniqueId;
  private _estimatedQuantity?: number;
  private _startDate?: Date;
  private _dueDate: Date;
  private _priority: TaskPriority;
  private _status: TaskStatus;
  private _completedDate?: Date;
  private _completionPct: number;
  private _observations?: string;
  private _instructions?: string;
  private _requiresNotification: boolean;

  private constructor(props: HealthTaskProps, id?: UniqueId, createdAt?: Date, updatedAt?: Date) {
    super(id, createdAt, updatedAt);
    this._code = props.code;
    this._name = props.name;
    this._type = props.type;
    this._creatorId = props.creatorId;
    this._assignedTo = props.assignedTo;
    this._productId = props.productId;
    this._estimatedQuantity = props.estimatedQuantity;
    this._startDate = props.startDate;
    this._dueDate = props.dueDate;
    this._priority = props.priority;
    this._status = props.status;
    this._completedDate = props.completedDate;
    this._completionPct = props.completionPct;
    this._observations = props.observations;
    this._instructions = props.instructions;
    this._requiresNotification = props.requiresNotification;
  }

  static create(props: HealthTaskProps, id?: UniqueId, createdAt?: Date, updatedAt?: Date): HealthTask {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Task name is required');
    }
    if (props.completionPct < 0 || props.completionPct > 100) {
      throw new Error('Completion percentage must be between 0 and 100');
    }
    if (props.startDate && props.dueDate < props.startDate) {
      throw new Error('Due date must be >= start date');
    }
    if (props.status === TaskStatus.COMPLETED && !props.completedDate) {
      throw new Error('Completed tasks must have a completed date');
    }
    return new HealthTask(props, id, createdAt, updatedAt);
  }

  get code(): string | undefined { return this._code; }
  get name(): string { return this._name; }
  get type(): TaskType | undefined { return this._type; }
  get creatorId(): UniqueId { return this._creatorId; }
  get assignedTo(): UniqueId | undefined { return this._assignedTo; }
  get productId(): UniqueId | undefined { return this._productId; }
  get estimatedQuantity(): number | undefined { return this._estimatedQuantity; }
  get startDate(): Date | undefined { return this._startDate; }
  get dueDate(): Date { return this._dueDate; }
  get priority(): TaskPriority { return this._priority; }
  get status(): TaskStatus { return this._status; }
  get completedDate(): Date | undefined { return this._completedDate; }
  get completionPct(): number { return this._completionPct; }
  get observations(): string | undefined { return this._observations; }
  get instructions(): string | undefined { return this._instructions; }
  get requiresNotification(): boolean { return this._requiresNotification; }

  isPending(): boolean {
    return this._status === TaskStatus.PENDING;
  }

  isCompleted(): boolean {
    return this._status === TaskStatus.COMPLETED;
  }

  isOverdue(): boolean {
    return this._dueDate < new Date() && this._status !== TaskStatus.COMPLETED && this._status !== TaskStatus.CANCELLED;
  }

  complete(): void {
    if (this._status === TaskStatus.COMPLETED) {
      throw new Error('Task is already completed');
    }
    this._status = TaskStatus.COMPLETED;
    this._completedDate = new Date();
    this._completionPct = 100;
    this.touch();
  }

  cancel(): void {
    this._status = TaskStatus.CANCELLED;
    this.touch();
  }

  assignTo(userId: UniqueId): void {
    this._assignedTo = userId;
    this.touch();
  }
}
