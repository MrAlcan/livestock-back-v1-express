import { ValueObject } from '../../shared/ValueObject';

interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MAX_LENGTH = 255;

  private constructor(props: EmailProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(value: string): Email {
    if (!value || value.trim().length === 0) {
      throw new Error('Email cannot be empty');
    }
    const trimmed = value.trim().toLowerCase();
    if (trimmed.length > Email.MAX_LENGTH) {
      throw new Error(`Email must not exceed ${Email.MAX_LENGTH} characters`);
    }
    if (!Email.EMAIL_REGEX.test(trimmed)) {
      throw new Error(`Invalid email format: ${trimmed}`);
    }
    return new Email({ value: trimmed });
  }

  equals(other: Email): boolean {
    return this.props.value === other.props.value;
  }

  toString(): string {
    return this.props.value;
  }
}
