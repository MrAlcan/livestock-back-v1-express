import { AggregateRoot } from '../../shared/AggregateRoot';
import { UniqueId } from '../../shared/Entity';

interface ProductProps {
  code: string;
  name: string;
  commercialName?: string;
  genericName?: string;
  type: string;
  category?: string;
  currentStock: number;
  minStock?: number;
  maxStock?: number;
  unit: string;
  unitCost?: number;
  salePrice?: number;
  withdrawalDays: number;
  activeIngredient?: string;
  concentration?: string;
  manufacturer?: string;
  requiresPrescription: boolean;
  isRefrigerated: boolean;
  storageTemperature?: string;
  observations?: string;
  active: boolean;
  deletedAt?: Date;
}

export class Product extends AggregateRoot<ProductProps> {
  private _code: string;
  private _name: string;
  private _commercialName?: string;
  private _genericName?: string;
  private readonly _type: string;
  private _category?: string;
  private _currentStock: number;
  private _minStock?: number;
  private _maxStock?: number;
  private _unit: string;
  private _unitCost?: number;
  private _salePrice?: number;
  private _withdrawalDays: number;
  private _activeIngredient?: string;
  private _concentration?: string;
  private _manufacturer?: string;
  private _requiresPrescription: boolean;
  private _isRefrigerated: boolean;
  private _storageTemperature?: string;
  private _observations?: string;
  private _active: boolean;
  private _deletedAt?: Date;

  private constructor(props: ProductProps, id?: UniqueId, createdAt?: Date, updatedAt?: Date) {
    super(id, createdAt, updatedAt);
    this._code = props.code;
    this._name = props.name;
    this._commercialName = props.commercialName;
    this._genericName = props.genericName;
    this._type = props.type;
    this._category = props.category;
    this._currentStock = props.currentStock;
    this._minStock = props.minStock;
    this._maxStock = props.maxStock;
    this._unit = props.unit;
    this._unitCost = props.unitCost;
    this._salePrice = props.salePrice;
    this._withdrawalDays = props.withdrawalDays;
    this._activeIngredient = props.activeIngredient;
    this._concentration = props.concentration;
    this._manufacturer = props.manufacturer;
    this._requiresPrescription = props.requiresPrescription;
    this._isRefrigerated = props.isRefrigerated;
    this._storageTemperature = props.storageTemperature;
    this._observations = props.observations;
    this._active = props.active;
    this._deletedAt = props.deletedAt;
  }

  static create(props: ProductProps, id?: UniqueId, createdAt?: Date, updatedAt?: Date): Product {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Product code is required');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Product name is required');
    }
    if (props.currentStock < 0) {
      throw new Error('Current stock cannot be negative');
    }
    if (props.withdrawalDays < 0) {
      throw new Error('Withdrawal days cannot be negative');
    }
    return new Product(props, id, createdAt, updatedAt);
  }

  get code(): string { return this._code; }
  get name(): string { return this._name; }
  get commercialName(): string | undefined { return this._commercialName; }
  get genericName(): string | undefined { return this._genericName; }
  get type(): string { return this._type; }
  get category(): string | undefined { return this._category; }
  get currentStock(): number { return this._currentStock; }
  get minStock(): number | undefined { return this._minStock; }
  get maxStock(): number | undefined { return this._maxStock; }
  get unit(): string { return this._unit; }
  get unitCost(): number | undefined { return this._unitCost; }
  get salePrice(): number | undefined { return this._salePrice; }
  get withdrawalDays(): number { return this._withdrawalDays; }
  get activeIngredient(): string | undefined { return this._activeIngredient; }
  get concentration(): string | undefined { return this._concentration; }
  get manufacturer(): string | undefined { return this._manufacturer; }
  get requiresPrescription(): boolean { return this._requiresPrescription; }
  get isRefrigerated(): boolean { return this._isRefrigerated; }
  get storageTemperature(): string | undefined { return this._storageTemperature; }
  get observations(): string | undefined { return this._observations; }
  get active(): boolean { return this._active; }
  get deletedAt(): Date | undefined { return this._deletedAt; }

  isLowStock(): boolean {
    return this._minStock !== undefined && this._currentStock < this._minStock;
  }

  hasWithdrawalPeriod(): boolean {
    return this._withdrawalDays > 0;
  }

  canBeUsed(): boolean {
    return this._active && this._currentStock > 0;
  }

  deductStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Deduct quantity must be positive');
    }
    if (this._currentStock - quantity < 0) {
      throw new Error('Insufficient stock');
    }
    this._currentStock -= quantity;
    this.touch();
  }

  addStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Add quantity must be positive');
    }
    this._currentStock += quantity;
    this.touch();
  }
}
