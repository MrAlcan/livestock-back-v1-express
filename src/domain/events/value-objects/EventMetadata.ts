import { ValueObject } from '../../shared/ValueObject';

interface EventMetadataProps {
  data: Record<string, unknown>;
}

export class EventMetadata extends ValueObject<EventMetadataProps> {
  private constructor(props: EventMetadataProps) {
    super(props);
  }

  static create(data: Record<string, unknown> = {}): EventMetadata {
    return new EventMetadata({ data: { ...data } });
  }

  get(key: string): unknown {
    return this.props.data[key];
  }

  toJSON(): Record<string, unknown> {
    return { ...this.props.data };
  }

  equals(other: EventMetadata): boolean {
    return JSON.stringify(this.props.data) === JSON.stringify(other.props.data);
  }
}
