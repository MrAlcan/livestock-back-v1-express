import { DomainEvent } from '../../shared/DomainEvent';
import { UniqueId } from '../../shared/Entity';
import { Weight } from '../../animals/value-objects/Weight';
import { ADG } from '../value-objects/ADG';

export class EventRecordedEvent extends DomainEvent {
  readonly eventId: UniqueId;
  readonly animalId: UniqueId;
  readonly eventType: string;

  constructor(props: { eventId: UniqueId; animalId: UniqueId; eventType: string }) {
    super(props.eventId);
    this.eventId = props.eventId;
    this.animalId = props.animalId;
    this.eventType = props.eventType;
  }

  get eventName(): string { return 'EventRecordedEvent'; }
}

export class WeighingRecordedEvent extends DomainEvent {
  readonly eventId: UniqueId;
  readonly animalId: UniqueId;
  readonly weight: Weight;
  readonly adg?: ADG;

  constructor(props: { eventId: UniqueId; animalId: UniqueId; weight: Weight; adg?: ADG }) {
    super(props.eventId);
    this.eventId = props.eventId;
    this.animalId = props.animalId;
    this.weight = props.weight;
    this.adg = props.adg;
  }

  get eventName(): string { return 'WeighingRecordedEvent'; }
}
