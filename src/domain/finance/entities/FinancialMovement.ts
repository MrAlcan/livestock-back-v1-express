import { AggregateRoot } from '../../shared/AggregateRoot';
import { UniqueId } from '../../shared/Entity';
import { FinancialType, PaymentMethod, FinancialStatus } from '../enums';

interface FinancialMovementProps {
  voucherNumber?: string;
  type: FinancialType;
  category: string;
  subcategory?: string;
  amount: number;
  currency: string;
  exchangeRate?: number;
  baseAmount?: number;
  date: Date;
  dueDate?: Date;
  paymentDate?: Date;
  paymentMethod?: PaymentMethod;
  description: string;
  thirdPartyId?: UniqueId;
  gmaId?: UniqueId;
  lotId?: UniqueId;
  productId?: UniqueId;
  registeredBy: UniqueId;
  approvedBy?: UniqueId;
  status: FinancialStatus;
  isRecurring: boolean;
  frequency?: string;
  documentUrl?: string;
  observations?: string;
}

export class FinancialMovement extends AggregateRoot<FinancialMovementProps> {
  private _voucherNumber?: string;
  private readonly _type: FinancialType;
  private _category: string;
  private _subcategory?: string;
  private readonly _amount: number;
  private readonly _currency: string;
  private _exchangeRate?: number;
  private _baseAmount?: number;
  private readonly _date: Date;
  private _dueDate?: Date;
  private _paymentDate?: Date;
  private _paymentMethod?: PaymentMethod;
  private _description: string;
  private _thirdPartyId?: UniqueId;
  private _gmaId?: UniqueId;
  private _lotId?: UniqueId;
  private _productId?: UniqueId;
  private readonly _registeredBy: UniqueId;
  private _approvedBy?: UniqueId;
  private _status: FinancialStatus;
  private _isRecurring: boolean;
  private _frequency?: string;
  private _documentUrl?: string;
  private _observations?: string;

  private constructor(props: FinancialMovementProps, id?: UniqueId, createdAt?: Date, updatedAt?: Date) {
    super(id, createdAt, updatedAt);
    this._voucherNumber = props.voucherNumber;
    this._type = props.type;
    this._category = props.category;
    this._subcategory = props.subcategory;
    this._amount = props.amount;
    this._currency = props.currency;
    this._exchangeRate = props.exchangeRate;
    this._baseAmount = props.baseAmount;
    this._date = props.date;
    this._dueDate = props.dueDate;
    this._paymentDate = props.paymentDate;
    this._paymentMethod = props.paymentMethod;
    this._description = props.description;
    this._thirdPartyId = props.thirdPartyId;
    this._gmaId = props.gmaId;
    this._lotId = props.lotId;
    this._productId = props.productId;
    this._registeredBy = props.registeredBy;
    this._approvedBy = props.approvedBy;
    this._status = props.status;
    this._isRecurring = props.isRecurring;
    this._frequency = props.frequency;
    this._documentUrl = props.documentUrl;
    this._observations = props.observations;
  }

  static create(props: FinancialMovementProps, id?: UniqueId, createdAt?: Date, updatedAt?: Date): FinancialMovement {
    if (props.amount <= 0) {
      throw new Error('Amount must be positive');
    }
    if (props.status === FinancialStatus.PAID && !props.paymentDate) {
      throw new Error('Paid movements must have a payment date');
    }
    if (props.paymentDate && props.paymentDate < props.date) {
      throw new Error('Payment date cannot be before movement date');
    }
    return new FinancialMovement(props, id, createdAt, updatedAt);
  }

  get voucherNumber(): string | undefined { return this._voucherNumber; }
  get type(): FinancialType { return this._type; }
  get category(): string { return this._category; }
  get subcategory(): string | undefined { return this._subcategory; }
  get amount(): number { return this._amount; }
  get currency(): string { return this._currency; }
  get exchangeRate(): number | undefined { return this._exchangeRate; }
  get baseAmount(): number | undefined { return this._baseAmount; }
  get date(): Date { return this._date; }
  get dueDate(): Date | undefined { return this._dueDate; }
  get paymentDate(): Date | undefined { return this._paymentDate; }
  get paymentMethod(): PaymentMethod | undefined { return this._paymentMethod; }
  get description(): string { return this._description; }
  get thirdPartyId(): UniqueId | undefined { return this._thirdPartyId; }
  get gmaId(): UniqueId | undefined { return this._gmaId; }
  get lotId(): UniqueId | undefined { return this._lotId; }
  get productId(): UniqueId | undefined { return this._productId; }
  get registeredBy(): UniqueId { return this._registeredBy; }
  get approvedBy(): UniqueId | undefined { return this._approvedBy; }
  get status(): FinancialStatus { return this._status; }
  get isRecurring(): boolean { return this._isRecurring; }
  get frequency(): string | undefined { return this._frequency; }
  get documentUrl(): string | undefined { return this._documentUrl; }
  get observations(): string | undefined { return this._observations; }

  isIncome(): boolean {
    return this._type === FinancialType.INCOME;
  }

  isExpense(): boolean {
    return this._type === FinancialType.EXPENSE;
  }

  isPaid(): boolean {
    return this._status === FinancialStatus.PAID;
  }

  isOverdue(): boolean {
    if (!this._dueDate) return false;
    return this._dueDate < new Date() && this._status !== FinancialStatus.PAID && this._status !== FinancialStatus.CANCELLED;
  }

  approve(userId: UniqueId): void {
    this._approvedBy = userId;
    this._status = FinancialStatus.APPROVED;
    this.touch();
  }

  markAsPaid(date: Date): void {
    this._paymentDate = date;
    this._status = FinancialStatus.PAID;
    this.touch();
  }
}
