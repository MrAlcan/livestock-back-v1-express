import { ValueObject } from '../../shared/ValueObject';

interface DeviceIdProps {
  value: string;
}

export class DeviceId extends ValueObject<DeviceIdProps> {
  private constructor(props: DeviceIdProps) {
    super(props);
  }

  get value(): string { return this.props.value; }

  static create(value: string): DeviceId {
    if (!value || value.trim().length === 0) {
      throw new Error('Device ID cannot be empty');
    }
    return new DeviceId({ value: value.trim() });
  }

  equals(other: DeviceId): boolean {
    return this.props.value === other.props.value;
  }

  toString(): string {
    return this.props.value;
  }
}
