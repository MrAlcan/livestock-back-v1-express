import { UniqueId } from '../../shared/Entity';

interface HealthTaskLotProps {
  taskId: UniqueId;
  lotId: UniqueId;
  animalQuantity?: number;
  completed: boolean;
  completedDate?: Date;
}

export class HealthTaskLot {
  private readonly _taskId: UniqueId;
  private readonly _lotId: UniqueId;
  private _animalQuantity?: number;
  private _completed: boolean;
  private _completedDate?: Date;

  private constructor(props: HealthTaskLotProps) {
    this._taskId = props.taskId;
    this._lotId = props.lotId;
    this._animalQuantity = props.animalQuantity;
    this._completed = props.completed;
    this._completedDate = props.completedDate;
  }

  static create(props: HealthTaskLotProps): HealthTaskLot {
    return new HealthTaskLot(props);
  }

  get taskId(): UniqueId { return this._taskId; }
  get lotId(): UniqueId { return this._lotId; }
  get animalQuantity(): number | undefined { return this._animalQuantity; }
  get completed(): boolean { return this._completed; }
  get completedDate(): Date | undefined { return this._completedDate; }

  markAsCompleted(): void {
    this._completed = true;
    this._completedDate = new Date();
  }
}
