import { ValueObject } from '../../shared/ValueObject';

interface AgeProps {
  years: number;
  months: number;
  days: number;
}

export class Age extends ValueObject<AgeProps> {
  private constructor(props: AgeProps) {
    super(props);
  }

  get years(): number { return this.props.years; }
  get months(): number { return this.props.months; }
  get days(): number { return this.props.days; }

  static fromBirthDate(birthDate: Date, referenceDate?: Date): Age {
    const ref = referenceDate ?? new Date();
    if (birthDate > ref) {
      throw new Error('Birth date cannot be in the future');
    }

    let years = ref.getFullYear() - birthDate.getFullYear();
    let months = ref.getMonth() - birthDate.getMonth();
    let days = ref.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(ref.getFullYear(), ref.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    return new Age({ years, months, days });
  }

  toMonths(): number {
    return this.props.years * 12 + this.props.months;
  }

  toDays(): number {
    return this.props.years * 365 + this.props.months * 30 + this.props.days;
  }

  isAdult(): boolean {
    return this.toMonths() >= 24;
  }

  equals(other: Age): boolean {
    return (
      this.props.years === other.props.years &&
      this.props.months === other.props.months &&
      this.props.days === other.props.days
    );
  }

  toString(): string {
    const parts: string[] = [];
    if (this.props.years > 0) {
      parts.push(`${this.props.years} año${this.props.years !== 1 ? 's' : ''}`);
    }
    if (this.props.months > 0) {
      parts.push(`${this.props.months} mes${this.props.months !== 1 ? 'es' : ''}`);
    }
    if (parts.length === 0 || (this.props.years === 0 && this.props.months === 0)) {
      parts.push(`${this.props.days} día${this.props.days !== 1 ? 's' : ''}`);
    }
    return parts.join(', ');
  }
}
