import { DomainEvent } from '../../shared/DomainEvent';
import { UniqueId } from '../../shared/Entity';

export class GMARequestedEvent extends DomainEvent {
  readonly gmaId: UniqueId;
  readonly internalNumber: string;
  readonly animalQuantity: number;

  constructor(props: { gmaId: UniqueId; internalNumber: string; animalQuantity: number }) {
    super(props.gmaId);
    this.gmaId = props.gmaId;
    this.internalNumber = props.internalNumber;
    this.animalQuantity = props.animalQuantity;
  }

  get eventName(): string { return 'GMARequestedEvent'; }
}

export class GMAApprovedEvent extends DomainEvent {
  readonly gmaId: UniqueId;
  readonly gmaCode: string;
  readonly issueDate: Date;

  constructor(props: { gmaId: UniqueId; gmaCode: string; issueDate: Date }) {
    super(props.gmaId);
    this.gmaId = props.gmaId;
    this.gmaCode = props.gmaCode;
    this.issueDate = props.issueDate;
  }

  get eventName(): string { return 'GMAApprovedEvent'; }
}

export class GMAInTransitEvent extends DomainEvent {
  readonly gmaId: UniqueId;
  readonly departureDate: Date;

  constructor(props: { gmaId: UniqueId; departureDate: Date }) {
    super(props.gmaId);
    this.gmaId = props.gmaId;
    this.departureDate = props.departureDate;
  }

  get eventName(): string { return 'GMAInTransitEvent'; }
}

export class GMAClosedEvent extends DomainEvent {
  readonly gmaId: UniqueId;
  readonly arrivalDate: Date;
  readonly actualTotalWeight: number;

  constructor(props: { gmaId: UniqueId; arrivalDate: Date; actualTotalWeight: number }) {
    super(props.gmaId);
    this.gmaId = props.gmaId;
    this.arrivalDate = props.arrivalDate;
    this.actualTotalWeight = props.actualTotalWeight;
  }

  get eventName(): string { return 'GMAClosedEvent'; }
}

export class RUNSAExpiringSoonEvent extends DomainEvent {
  readonly farmId: UniqueId;
  readonly expirationDate: Date;
  readonly daysRemaining: number;

  constructor(props: { farmId: UniqueId; expirationDate: Date; daysRemaining: number }) {
    super(props.farmId);
    this.farmId = props.farmId;
    this.expirationDate = props.expirationDate;
    this.daysRemaining = props.daysRemaining;
  }

  get eventName(): string { return 'RUNSAExpiringSoonEvent'; }
}
