import { ValueObject } from '../../shared/ValueObject';
import { PregnancyStatusEnum, ConfidenceLevel } from '../enums';

interface PregnancyStatusProps {
  value: PregnancyStatusEnum;
}

export class PregnancyStatus extends ValueObject<PregnancyStatusProps> {
  private constructor(props: PregnancyStatusProps) {
    super(props);
  }

  get value(): PregnancyStatusEnum { return this.props.value; }

  static create(value: PregnancyStatusEnum): PregnancyStatus {
    return new PregnancyStatus({ value });
  }

  isPregnant(): boolean {
    return this.props.value === PregnancyStatusEnum.PREGNANT;
  }

  isEmpty(): boolean {
    return this.props.value === PregnancyStatusEnum.EMPTY;
  }

  equals(other: PregnancyStatus): boolean {
    return this.props.value === other.props.value;
  }
}

interface EstimatedBirthDateProps {
  date: Date;
  confidence: ConfidenceLevel;
}

export class EstimatedBirthDate extends ValueObject<EstimatedBirthDateProps> {
  private constructor(props: EstimatedBirthDateProps) {
    super(props);
  }

  get date(): Date { return this.props.date; }
  get confidence(): ConfidenceLevel { return this.props.confidence; }

  static create(date: Date, confidence: ConfidenceLevel): EstimatedBirthDate {
    return new EstimatedBirthDate({ date, confidence });
  }

  isImminent(): boolean {
    const daysUntil = this.daysUntilBirth();
    return daysUntil >= 0 && daysUntil <= 15;
  }

  daysUntilBirth(): number {
    const now = new Date();
    const diffMs = this.props.date.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  equals(other: EstimatedBirthDate): boolean {
    return this.props.date.getTime() === other.props.date.getTime() &&
      this.props.confidence === other.props.confidence;
  }
}
