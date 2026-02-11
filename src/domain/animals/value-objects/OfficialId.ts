import { ValueObject } from '../../shared/ValueObject';

interface OfficialIdProps {
  value: string;
}

export class OfficialId extends ValueObject<OfficialIdProps> {
  private static readonly MAX_LENGTH = 100;
  private static readonly VALID_PATTERN = /^[a-zA-Z0-9\-]+$/;

  private constructor(props: OfficialIdProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(value: string): OfficialId {
    if (!value || value.trim().length === 0) {
      throw new Error('Official ID cannot be empty');
    }
    const trimmed = value.trim();
    if (trimmed.length > OfficialId.MAX_LENGTH) {
      throw new Error(`Official ID must not exceed ${OfficialId.MAX_LENGTH} characters`);
    }
    if (!OfficialId.VALID_PATTERN.test(trimmed)) {
      throw new Error('Official ID can only contain letters, numbers, and hyphens');
    }
    return new OfficialId({ value: trimmed });
  }

  equals(other: OfficialId): boolean {
    return this.props.value === other.props.value;
  }

  toString(): string {
    return this.props.value;
  }
}
