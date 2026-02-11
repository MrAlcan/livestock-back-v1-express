import { ValueObject } from '../../shared/ValueObject';
import { IdentifierType } from '../enums';

interface AnimalIdentifierProps {
  type: IdentifierType;
  value: string;
}

export class AnimalIdentifier extends ValueObject<AnimalIdentifierProps> {
  private constructor(props: AnimalIdentifierProps) {
    super(props);
  }

  get type(): IdentifierType { return this.props.type; }
  get value(): string { return this.props.value; }

  static create(type: IdentifierType, value: string): AnimalIdentifier {
    if (!value || value.trim().length === 0) {
      throw new Error('Identifier value cannot be empty');
    }
    return new AnimalIdentifier({ type, value: value.trim() });
  }

  equals(other: AnimalIdentifier): boolean {
    return this.props.type === other.props.type && this.props.value === other.props.value;
  }

  toString(): string {
    return `[${this.props.type}] ${this.props.value}`;
  }
}
