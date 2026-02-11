import { Entity, UniqueId } from '../../shared/Entity';
import { InventoryMovementType } from '../enums';

interface InventoryMovementProps {
  productId: UniqueId;
  movementType: InventoryMovementType;
  quantity: number;
  unit: string;
  unitCost?: number;
  totalCost?: number;
  previousStock: number;
  newStock: number;
  movementDate: Date;
  productBatch?: string;
  expirationDate?: Date;
  supplierId?: UniqueId;
  linkedEventId?: UniqueId;
  registeredBy: UniqueId;
  reason?: string;
  referenceDocument?: string;
  observations?: string;
}

export class InventoryMovement extends Entity<InventoryMovementProps> {
  private readonly _productId: UniqueId;
  private readonly _movementType: InventoryMovementType;
  private readonly _quantity: number;
  private readonly _unit: string;
  private readonly _unitCost?: number;
  private readonly _totalCost?: number;
  private readonly _previousStock: number;
  private readonly _newStock: number;
  private readonly _movementDate: Date;
  private readonly _productBatch?: string;
  private readonly _expirationDate?: Date;
  private readonly _supplierId?: UniqueId;
  private readonly _linkedEventId?: UniqueId;
  private readonly _registeredBy: UniqueId;
  private readonly _reason?: string;
  private readonly _referenceDocument?: string;
  private readonly _observations?: string;

  private constructor(props: InventoryMovementProps, id?: UniqueId, createdAt?: Date) {
    super(id, createdAt);
    this._productId = props.productId;
    this._movementType = props.movementType;
    this._quantity = props.quantity;
    this._unit = props.unit;
    this._unitCost = props.unitCost;
    this._totalCost = props.totalCost;
    this._previousStock = props.previousStock;
    this._newStock = props.newStock;
    this._movementDate = props.movementDate;
    this._productBatch = props.productBatch;
    this._expirationDate = props.expirationDate;
    this._supplierId = props.supplierId;
    this._linkedEventId = props.linkedEventId;
    this._registeredBy = props.registeredBy;
    this._reason = props.reason;
    this._referenceDocument = props.referenceDocument;
    this._observations = props.observations;
  }

  static create(props: InventoryMovementProps, id?: UniqueId, createdAt?: Date): InventoryMovement {
    if (props.quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    if (props.newStock < 0) {
      throw new Error('New stock cannot be negative');
    }
    return new InventoryMovement(props, id, createdAt);
  }

  get productId(): UniqueId { return this._productId; }
  get movementType(): InventoryMovementType { return this._movementType; }
  get quantity(): number { return this._quantity; }
  get unit(): string { return this._unit; }
  get unitCost(): number | undefined { return this._unitCost; }
  get totalCost(): number | undefined { return this._totalCost; }
  get previousStock(): number { return this._previousStock; }
  get newStock(): number { return this._newStock; }
  get movementDate(): Date { return this._movementDate; }
  get productBatch(): string | undefined { return this._productBatch; }
  get expirationDate(): Date | undefined { return this._expirationDate; }
  get supplierId(): UniqueId | undefined { return this._supplierId; }
  get linkedEventId(): UniqueId | undefined { return this._linkedEventId; }
  get registeredBy(): UniqueId { return this._registeredBy; }
  get reason(): string | undefined { return this._reason; }
  get referenceDocument(): string | undefined { return this._referenceDocument; }
  get observations(): string | undefined { return this._observations; }

  isEntry(): boolean {
    return this._movementType === InventoryMovementType.ENTRY;
  }

  isExit(): boolean {
    return this._movementType === InventoryMovementType.EXIT;
  }

  isAdjustment(): boolean {
    return this._movementType === InventoryMovementType.ADJUSTMENT;
  }
}
