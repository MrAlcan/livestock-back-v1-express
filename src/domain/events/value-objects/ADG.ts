import { ValueObject } from '../../shared/ValueObject';

interface ADGProps {
  kgPerDay: number;
}

export class ADG extends ValueObject<ADGProps> {
  private static readonly MIN_ADG = -1;
  private static readonly MAX_ADG = 3;

  private constructor(props: ADGProps) {
    super(props);
  }

  get kgPerDay(): number {
    return this.props.kgPerDay;
  }

  static create(kgPerDay: number): ADG {
    if (kgPerDay < ADG.MIN_ADG || kgPerDay > ADG.MAX_ADG) {
      throw new Error(`ADG must be between ${ADG.MIN_ADG} and ${ADG.MAX_ADG} kg/day, got ${kgPerDay}`);
    }
    const rounded = Math.round(kgPerDay * 1000) / 1000;
    return new ADG({ kgPerDay: rounded });
  }

  isPositive(): boolean {
    return this.props.kgPerDay > 0;
  }

  isNegative(): boolean {
    return this.props.kgPerDay < 0;
  }

  equals(other: ADG): boolean {
    return this.props.kgPerDay === other.props.kgPerDay;
  }

  toString(): string {
    const sign = this.props.kgPerDay >= 0 ? '+' : '';
    return `${sign}${this.props.kgPerDay.toFixed(3)} kg/día`;
  }
}
