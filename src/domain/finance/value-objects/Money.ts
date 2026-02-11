import { ValueObject } from '../../shared/ValueObject';

interface MoneyProps {
  amount: number;
  currency: string;
}

export class Money extends ValueObject<MoneyProps> {
  private static readonly DEFAULT_CURRENCY = 'BOB';

  private constructor(props: MoneyProps) {
    super(props);
  }

  get amount(): number { return this.props.amount; }
  get currency(): string { return this.props.currency; }

  static create(amount: number, currency: string = Money.DEFAULT_CURRENCY): Money {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
    const rounded = Math.round(amount * 100) / 100;
    return new Money({ amount: rounded, currency });
  }

  static zero(currency: string = Money.DEFAULT_CURRENCY): Money {
    return new Money({ amount: 0, currency });
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return Money.create(this.props.amount + other.props.amount, this.props.currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    const result = this.props.amount - other.props.amount;
    if (result < 0) {
      throw new Error('Subtraction would result in negative amount');
    }
    return Money.create(result, this.props.currency);
  }

  multiply(factor: number): Money {
    return Money.create(this.props.amount * factor, this.props.currency);
  }

  divide(factor: number): Money {
    if (factor === 0) {
      throw new Error('Cannot divide by zero');
    }
    return Money.create(this.props.amount / factor, this.props.currency);
  }

  isGreaterThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this.props.amount > other.props.amount;
  }

  equals(other: Money): boolean {
    return this.props.amount === other.props.amount && this.props.currency === other.props.currency;
  }

  toString(): string {
    return `${this.props.currency} ${this.props.amount.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  private assertSameCurrency(other: Money): void {
    if (this.props.currency !== other.props.currency) {
      throw new Error(`Cannot operate on different currencies: ${this.props.currency} and ${other.props.currency}`);
    }
  }
}
