import { AggregateRoot } from '../../shared/AggregateRoot';
import { UniqueId } from '../../shared/Entity';
import { LotType, LotStatus } from '../enums';

interface LotProps {
  code: string;
  name: string;
  type?: LotType;
  farmId: UniqueId;
  description?: string;
  creationDate: Date;
  closureDate?: Date;
  status: LotStatus;
  currentQuantity: number;
  currentAverageWeight?: number;
  targetWeight?: number;
  targetDays?: number;
  assignedRationId?: UniqueId;
  deletedAt?: Date;
}

export class Lot extends AggregateRoot<LotProps> {
  private _code: string;
  private _name: string;
  private _type?: LotType;
  private readonly _farmId: UniqueId;
  private _description?: string;
  private readonly _creationDate: Date;
  private _closureDate?: Date;
  private _status: LotStatus;
  private _currentQuantity: number;
  private _currentAverageWeight?: number;
  private _targetWeight?: number;
  private _targetDays?: number;
  private _assignedRationId?: UniqueId;
  private _deletedAt?: Date;

  private constructor(props: LotProps, id?: UniqueId, createdAt?: Date, updatedAt?: Date) {
    super(id, createdAt, updatedAt);
    this._code = props.code;
    this._name = props.name;
    this._type = props.type;
    this._farmId = props.farmId;
    this._description = props.description;
    this._creationDate = props.creationDate;
    this._closureDate = props.closureDate;
    this._status = props.status;
    this._currentQuantity = props.currentQuantity;
    this._currentAverageWeight = props.currentAverageWeight;
    this._targetWeight = props.targetWeight;
    this._targetDays = props.targetDays;
    this._assignedRationId = props.assignedRationId;
    this._deletedAt = props.deletedAt;
  }

  static create(props: LotProps, id?: UniqueId, createdAt?: Date, updatedAt?: Date): Lot {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Lot code is required');
    }
    if (props.currentQuantity < 0) {
      throw new Error('Current quantity cannot be negative');
    }
    if (props.targetWeight !== undefined && props.targetWeight <= 0) {
      throw new Error('Target weight must be positive');
    }
    if (props.status === LotStatus.CLOSED && !props.closureDate) {
      throw new Error('Closed lots must have a closure date');
    }
    return new Lot(props, id, createdAt, updatedAt);
  }

  get code(): string { return this._code; }
  get name(): string { return this._name; }
  get type(): LotType | undefined { return this._type; }
  get farmId(): UniqueId { return this._farmId; }
  get description(): string | undefined { return this._description; }
  get creationDate(): Date { return this._creationDate; }
  get closureDate(): Date | undefined { return this._closureDate; }
  get status(): LotStatus { return this._status; }
  get currentQuantity(): number { return this._currentQuantity; }
  get currentAverageWeight(): number | undefined { return this._currentAverageWeight; }
  get targetWeight(): number | undefined { return this._targetWeight; }
  get targetDays(): number | undefined { return this._targetDays; }
  get assignedRationId(): UniqueId | undefined { return this._assignedRationId; }
  get deletedAt(): Date | undefined { return this._deletedAt; }

  isActive(): boolean {
    return this._status === LotStatus.ACTIVE;
  }

  isClosed(): boolean {
    return this._status === LotStatus.CLOSED;
  }

  close(): void {
    if (this._status === LotStatus.CLOSED) {
      throw new Error('Lot is already closed');
    }
    this._status = LotStatus.CLOSED;
    this._closureDate = new Date();
    this.touch();
  }

  addAnimal(): void {
    if (!this.isActive()) {
      throw new Error('Cannot add animal to a non-active lot');
    }
    this._currentQuantity++;
    this.touch();
  }

  removeAnimal(): void {
    if (this._currentQuantity <= 0) {
      throw new Error('Lot has no animals to remove');
    }
    this._currentQuantity--;
    this.touch();
  }

  updateAverageWeight(newAverage: number): void {
    this._currentAverageWeight = newAverage;
    this.touch();
  }

  hasReachedTargetWeight(): boolean {
    if (!this._targetWeight || !this._currentAverageWeight) return false;
    return this._currentAverageWeight >= this._targetWeight;
  }
}
