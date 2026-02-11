import { ValueObject } from '../../shared/ValueObject';

interface CapacityProps {
  animalUnits: number;
}

export class Capacity extends ValueObject<CapacityProps> {
  private constructor(props: CapacityProps) {
    super(props);
  }

  get animalUnits(): number { return this.props.animalUnits; }

  static create(animalUnits: number): Capacity {
    if (animalUnits <= 0) {
      throw new Error('Capacity must be positive');
    }
    return new Capacity({ animalUnits });
  }

  canAccommodate(quantity: number): boolean {
    return quantity <= this.props.animalUnits;
  }

  equals(other: Capacity): boolean {
    return this.props.animalUnits === other.props.animalUnits;
  }
}

interface BodyConditionProps {
  score: number;
}

export class BodyCondition extends ValueObject<BodyConditionProps> {
  private static readonly MIN_SCORE = 1.0;
  private static readonly MAX_SCORE = 5.0;

  private constructor(props: BodyConditionProps) {
    super(props);
  }

  get score(): number { return this.props.score; }

  static create(score: number): BodyCondition {
    if (score < BodyCondition.MIN_SCORE || score > BodyCondition.MAX_SCORE) {
      throw new Error(`Body condition score must be between ${BodyCondition.MIN_SCORE} and ${BodyCondition.MAX_SCORE}`);
    }
    return new BodyCondition({ score: Math.round(score * 10) / 10 });
  }

  isThin(): boolean {
    return this.props.score < 2.5;
  }

  isIdeal(): boolean {
    return this.props.score >= 3.0 && this.props.score <= 3.5;
  }

  isOverweight(): boolean {
    return this.props.score > 4.0;
  }

  equals(other: BodyCondition): boolean {
    return this.props.score === other.props.score;
  }
}
