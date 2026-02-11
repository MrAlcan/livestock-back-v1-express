import { UniqueId } from '../../shared/Entity';
import { Weight } from '../../animals/value-objects/Weight';
import { SaleType } from '../enums';

interface MoneyValue {
  amount: number;
  currency: string;
}

interface EventSaleProps {
  eventId: UniqueId;
  gmaId: UniqueId;
  destinationId: UniqueId;
  saleWeight: Weight;
  salePrice: MoneyValue;
  pricePerKg: MoneyValue;
  saleType: SaleType;
  qualityCategory?: string;
  totalFatteningDays?: number;
  totalWeightGain?: Weight;
  estimatedTotalCost?: MoneyValue;
  grossMargin?: MoneyValue;
}

export class EventSale {
  private readonly _eventId: UniqueId;
  private readonly _gmaId: UniqueId;
  private readonly _destinationId: UniqueId;
  private readonly _saleWeight: Weight;
  private readonly _salePrice: MoneyValue;
  private readonly _pricePerKg: MoneyValue;
  private readonly _saleType: SaleType;
  private readonly _qualityCategory?: string;
  private readonly _totalFatteningDays?: number;
  private readonly _totalWeightGain?: Weight;
  private readonly _estimatedTotalCost?: MoneyValue;
  private readonly _grossMargin?: MoneyValue;

  private constructor(props: EventSaleProps) {
    this._eventId = props.eventId;
    this._gmaId = props.gmaId;
    this._destinationId = props.destinationId;
    this._saleWeight = props.saleWeight;
    this._salePrice = props.salePrice;
    this._pricePerKg = props.pricePerKg;
    this._saleType = props.saleType;
    this._qualityCategory = props.qualityCategory;
    this._totalFatteningDays = props.totalFatteningDays;
    this._totalWeightGain = props.totalWeightGain;
    this._estimatedTotalCost = props.estimatedTotalCost;
    this._grossMargin = props.grossMargin;
  }

  static create(props: EventSaleProps): EventSale {
    if (props.salePrice.amount <= 0) {
      throw new Error('Sale price must be positive');
    }
    return new EventSale(props);
  }

  get eventId(): UniqueId { return this._eventId; }
  get gmaId(): UniqueId { return this._gmaId; }
  get destinationId(): UniqueId { return this._destinationId; }
  get saleWeight(): Weight { return this._saleWeight; }
  get salePrice(): MoneyValue { return this._salePrice; }
  get pricePerKg(): MoneyValue { return this._pricePerKg; }
  get saleType(): SaleType { return this._saleType; }
  get qualityCategory(): string | undefined { return this._qualityCategory; }
  get totalFatteningDays(): number | undefined { return this._totalFatteningDays; }
  get totalWeightGain(): Weight | undefined { return this._totalWeightGain; }
  get estimatedTotalCost(): MoneyValue | undefined { return this._estimatedTotalCost; }
  get grossMargin(): MoneyValue | undefined { return this._grossMargin; }

  calculateMargin(): MoneyValue | null {
    if (!this._estimatedTotalCost) return null;
    return {
      amount: this._salePrice.amount - this._estimatedTotalCost.amount,
      currency: this._salePrice.currency,
    };
  }
}
