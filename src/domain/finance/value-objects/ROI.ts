import { ValueObject } from '../../shared/ValueObject';

interface ROIProps {
  percentage: number;
}

export class ROI extends ValueObject<ROIProps> {
  private constructor(props: ROIProps) {
    super(props);
  }

  get percentage(): number { return this.props.percentage; }

  static create(percentage: number): ROI {
    return new ROI({ percentage: Math.round(percentage * 100) / 100 });
  }

  static fromValues(investment: number, revenue: number): ROI {
    if (investment === 0) {
      throw new Error('Investment cannot be zero for ROI calculation');
    }
    const roi = ((revenue - investment) / investment) * 100;
    return ROI.create(roi);
  }

  isPositive(): boolean {
    return this.props.percentage > 0;
  }

  isNegative(): boolean {
    return this.props.percentage < 0;
  }

  equals(other: ROI): boolean {
    return this.props.percentage === other.props.percentage;
  }

  toString(): string {
    const sign = this.props.percentage >= 0 ? '+' : '';
    return `${sign}${this.props.percentage.toFixed(2)}%`;
  }
}
