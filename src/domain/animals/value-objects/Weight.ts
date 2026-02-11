import { ValueObject } from '../../shared/ValueObject';

interface WeightProps {
  kilograms: number;
}

export class Weight extends ValueObject<WeightProps> {
  private static readonly MIN_WEIGHT = 0;
  private static readonly MAX_WEIGHT = 2000;

  private constructor(props: WeightProps) {
    super(props);
  }

  get kilograms(): number {
    return this.props.kilograms;
  }

  static create(kilograms: number): Weight {
    if (kilograms <= Weight.MIN_WEIGHT) {
      throw new Error('Weight must be positive');
    }
    if (kilograms > Weight.MAX_WEIGHT) {
      throw new Error(`Weight must not exceed ${Weight.MAX_WEIGHT} kg`);
    }
    const rounded = Math.round(kilograms * 100) / 100;
    return new Weight({ kilograms: rounded });
  }

  equals(other: Weight): boolean {
    return this.props.kilograms === other.props.kilograms;
  }

  isGreaterThan(other: Weight): boolean {
    return this.props.kilograms > other.props.kilograms;
  }

  subtract(other: Weight): Weight {
    const diff = this.props.kilograms - other.props.kilograms;
    if (diff <= 0) {
      throw new Error('Subtraction would result in non-positive weight');
    }
    return Weight.create(diff);
  }

  add(other: Weight): Weight {
    return Weight.create(this.props.kilograms + other.props.kilograms);
  }

  toString(): string {
    return `${this.props.kilograms.toFixed(2)} kg`;
  }
}
