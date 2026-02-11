import { ValueObject } from '../../shared/ValueObject';

interface StockProps {
  quantity: number;
  unit: string;
}

export class Stock extends ValueObject<StockProps> {
  private constructor(props: StockProps) {
    super(props);
  }

  get quantity(): number { return this.props.quantity; }
  get unit(): string { return this.props.unit; }

  static create(quantity: number, unit: string): Stock {
    if (quantity < 0) {
      throw new Error('Stock quantity cannot be negative');
    }
    return new Stock({ quantity, unit });
  }

  add(amount: number): Stock {
    return Stock.create(this.props.quantity + amount, this.props.unit);
  }

  subtract(amount: number): Stock {
    const newQuantity = this.props.quantity - amount;
    if (newQuantity < 0) {
      throw new Error('Stock cannot go below zero');
    }
    return Stock.create(newQuantity, this.props.unit);
  }

  isZero(): boolean {
    return this.props.quantity === 0;
  }

  isLessThan(threshold: number): boolean {
    return this.props.quantity < threshold;
  }

  equals(other: Stock): boolean {
    return this.props.quantity === other.props.quantity && this.props.unit === other.props.unit;
  }
}

interface WithdrawalPeriodProps {
  days: number;
}

export class WithdrawalPeriod extends ValueObject<WithdrawalPeriodProps> {
  private constructor(props: WithdrawalPeriodProps) {
    super(props);
  }

  get days(): number { return this.props.days; }

  static create(days: number): WithdrawalPeriod {
    if (days < 0) {
      throw new Error('Withdrawal period days cannot be negative');
    }
    return new WithdrawalPeriod({ days });
  }

  calculateEndDate(applicationDate: Date): Date {
    const endDate = new Date(applicationDate);
    endDate.setDate(endDate.getDate() + this.props.days);
    return endDate;
  }

  isActiveAt(date: Date, applicationDate: Date): boolean {
    const endDate = this.calculateEndDate(applicationDate);
    return date <= endDate;
  }

  equals(other: WithdrawalPeriod): boolean {
    return this.props.days === other.props.days;
  }
}

interface DoseProps {
  amount: number;
  unit: string;
}

export class Dose extends ValueObject<DoseProps> {
  private constructor(props: DoseProps) {
    super(props);
  }

  get amount(): number { return this.props.amount; }
  get unit(): string { return this.props.unit; }

  static create(amount: number, unit: string): Dose {
    if (amount <= 0) {
      throw new Error('Dose amount must be positive');
    }
    return new Dose({ amount, unit });
  }

  equals(other: Dose): boolean {
    return this.props.amount === other.props.amount && this.props.unit === other.props.unit;
  }

  toString(): string {
    return `${this.props.amount} ${this.props.unit}`;
  }
}
