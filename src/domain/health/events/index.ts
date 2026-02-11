import { DomainEvent } from '../../shared/DomainEvent';
import { UniqueId } from '../../shared/Entity';

export class ProductStockDepletedEvent extends DomainEvent {
  readonly productId: UniqueId;
  readonly productName: string;
  readonly currentStock: number;
  readonly minStock: number;

  constructor(props: { productId: UniqueId; productName: string; currentStock: number; minStock: number }) {
    super(props.productId);
    this.productId = props.productId;
    this.productName = props.productName;
    this.currentStock = props.currentStock;
    this.minStock = props.minStock;
  }

  get eventName(): string { return 'ProductStockDepletedEvent'; }
}

export class HealthTaskAssignedEvent extends DomainEvent {
  readonly taskId: UniqueId;
  readonly assignedToUserId: UniqueId;
  readonly dueDate: Date;

  constructor(props: { taskId: UniqueId; assignedToUserId: UniqueId; dueDate: Date }) {
    super(props.taskId);
    this.taskId = props.taskId;
    this.assignedToUserId = props.assignedToUserId;
    this.dueDate = props.dueDate;
  }

  get eventName(): string { return 'HealthTaskAssignedEvent'; }
}

export class HealthTaskCompletedEvent extends DomainEvent {
  readonly taskId: UniqueId;
  readonly completedBy: UniqueId;
  readonly completedDate: Date;

  constructor(props: { taskId: UniqueId; completedBy: UniqueId; completedDate: Date }) {
    super(props.taskId);
    this.taskId = props.taskId;
    this.completedBy = props.completedBy;
    this.completedDate = props.completedDate;
  }

  get eventName(): string { return 'HealthTaskCompletedEvent'; }
}
