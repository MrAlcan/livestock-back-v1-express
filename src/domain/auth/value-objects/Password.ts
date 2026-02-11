import { ValueObject } from '../../shared/ValueObject';

interface PasswordProps {
  hash: string;
}

export class Password extends ValueObject<PasswordProps> {
  private static readonly MIN_LENGTH = 8;
  private static readonly HAS_UPPERCASE = /[A-Z]/;
  private static readonly HAS_LOWERCASE = /[a-z]/;
  private static readonly HAS_NUMBER = /[0-9]/;
  private static readonly HAS_SPECIAL = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

  private constructor(props: PasswordProps) {
    super(props);
  }

  get hash(): string {
    return this.props.hash;
  }

  static fromHash(hash: string): Password {
    if (!hash || hash.trim().length === 0) {
      throw new Error('Password hash cannot be empty');
    }
    return new Password({ hash });
  }

  static validatePlainPassword(plainPassword: string): string[] {
    const errors: string[] = [];
    if (!plainPassword || plainPassword.length < Password.MIN_LENGTH) {
      errors.push(`Password must be at least ${Password.MIN_LENGTH} characters`);
    }
    if (!Password.HAS_UPPERCASE.test(plainPassword)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!Password.HAS_LOWERCASE.test(plainPassword)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!Password.HAS_NUMBER.test(plainPassword)) {
      errors.push('Password must contain at least one number');
    }
    if (!Password.HAS_SPECIAL.test(plainPassword)) {
      errors.push('Password must contain at least one special character');
    }
    return errors;
  }

  equals(other: Password): boolean {
    return this.props.hash === other.props.hash;
  }
}
