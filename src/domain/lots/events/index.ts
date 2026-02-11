import { DomainEvent } from '../../shared/DomainEvent';
import { UniqueId } from '../../shared/Entity';

export class LotCreatedEvent extends DomainEvent {
  readonly lotId: UniqueId;
  readonly code: string;
  readonly farmId: UniqueId;

  constructor(props: { lotId: UniqueId; code: string; farmId: UniqueId }) {
    super(props.lotId);
    this.lotId = props.lotId;
    this.code = props.code;
    this.farmId = props.farmId;
  }

  get eventName(): string { return 'LotCreatedEvent'; }
}

export class AnimalAddedToLotEvent extends DomainEvent {
  readonly animalId: UniqueId;
  readonly lotId: UniqueId;

  constructor(props: { animalId: UniqueId; lotId: UniqueId }) {
    super(props.lotId);
    this.animalId = props.animalId;
    this.lotId = props.lotId;
  }

  get eventName(): string { return 'AnimalAddedToLotEvent'; }
}

export class AnimalRemovedFromLotEvent extends DomainEvent {
  readonly animalId: UniqueId;
  readonly lotId: UniqueId;

  constructor(props: { animalId: UniqueId; lotId: UniqueId }) {
    super(props.lotId);
    this.animalId = props.animalId;
    this.lotId = props.lotId;
  }

  get eventName(): string { return 'AnimalRemovedFromLotEvent'; }
}

export class LotClosedEvent extends DomainEvent {
  readonly lotId: UniqueId;
  readonly closureDate: Date;
  readonly finalQuantity: number;

  constructor(props: { lotId: UniqueId; closureDate: Date; finalQuantity: number }) {
    super(props.lotId);
    this.lotId = props.lotId;
    this.closureDate = props.closureDate;
    this.finalQuantity = props.finalQuantity;
  }

  get eventName(): string { return 'LotClosedEvent'; }
}
