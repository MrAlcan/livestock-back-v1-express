import { UniqueId } from '../../shared/Entity';
import { Weight } from '../../animals/value-objects/Weight';

interface MoneyValue {
  amount: number;
  currency: string;
}

interface EventPurchaseProps {
  eventId: UniqueId;
  supplierId: UniqueId;
  originGmaId?: UniqueId;
  purchasePrice: MoneyValue;
  purchaseWeight?: Weight;
  pricePerKg?: MoneyValue;
  certificates?: Record<string, unknown>;
  entryObservations?: string;
}

export class EventPurchase {
  private readonly _eventId: UniqueId;
  private readonly _supplierId: UniqueId;
  private readonly _originGmaId?: UniqueId;
  private readonly _purchasePrice: MoneyValue;
  private readonly _purchaseWeight?: Weight;
  private readonly _pricePerKg?: MoneyValue;
  private readonly _certificates?: Record<string, unknown>;
  private readonly _entryObservations?: string;

  private constructor(props: EventPurchaseProps) {
    this._eventId = props.eventId;
    this._supplierId = props.supplierId;
    this._originGmaId = props.originGmaId;
    this._purchasePrice = props.purchasePrice;
    this._purchaseWeight = props.purchaseWeight;
    this._pricePerKg = props.pricePerKg;
    this._certificates = props.certificates;
    this._entryObservations = props.entryObservations;
  }

  static create(props: EventPurchaseProps): EventPurchase {
    if (props.purchasePrice.amount <= 0) {
      throw new Error('Purchase price must be positive');
    }
    return new EventPurchase(props);
  }

  get eventId(): UniqueId { return this._eventId; }
  get supplierId(): UniqueId { return this._supplierId; }
  get originGmaId(): UniqueId | undefined { return this._originGmaId; }
  get purchasePrice(): MoneyValue { return this._purchasePrice; }
  get purchaseWeight(): Weight | undefined { return this._purchaseWeight; }
  get pricePerKg(): MoneyValue | undefined { return this._pricePerKg; }
  get certificates(): Record<string, unknown> | undefined { return this._certificates; }
  get entryObservations(): string | undefined { return this._entryObservations; }
}
