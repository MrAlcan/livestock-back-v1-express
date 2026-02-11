import { ValueObject } from '../../shared/ValueObject';

interface GMACodeProps {
  value: string;
}

export class GMACode extends ValueObject<GMACodeProps> {
  private constructor(props: GMACodeProps) {
    super(props);
  }

  get value(): string { return this.props.value; }

  static create(value: string): GMACode {
    if (!value || value.trim().length === 0) {
      throw new Error('GMA code cannot be empty');
    }
    return new GMACode({ value: value.trim() });
  }

  equals(other: GMACode): boolean {
    return this.props.value === other.props.value;
  }

  toString(): string {
    return this.props.value;
  }
}

interface RUNSACodeProps {
  value: string;
}

export class RUNSACode extends ValueObject<RUNSACodeProps> {
  private constructor(props: RUNSACodeProps) {
    super(props);
  }

  get value(): string { return this.props.value; }

  static create(value: string): RUNSACode {
    if (!value || value.trim().length === 0) {
      throw new Error('RUNSA code cannot be empty');
    }
    return new RUNSACode({ value: value.trim() });
  }

  equals(other: RUNSACode): boolean {
    return this.props.value === other.props.value;
  }

  toString(): string {
    return this.props.value;
  }
}
