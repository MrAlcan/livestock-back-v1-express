import { DomainEvent } from '../../shared/DomainEvent';
import { UniqueId } from '../../shared/Entity';
import { Weight } from '../value-objects/Weight';

export class AnimalBornEvent extends DomainEvent {
  readonly animalId: UniqueId;
  readonly motherId?: UniqueId;
  readonly birthDate: Date;
  readonly birthWeight?: Weight;
  readonly farmId: UniqueId;

  constructor(props: {
    animalId: UniqueId;
    motherId?: UniqueId;
    birthDate: Date;
    birthWeight?: Weight;
    farmId: UniqueId;
  }) {
    super(props.animalId);
    this.animalId = props.animalId;
    this.motherId = props.motherId;
    this.birthDate = props.birthDate;
    this.birthWeight = props.birthWeight;
    this.farmId = props.farmId;
  }

  get eventName(): string { return 'AnimalBornEvent'; }
}

export class AnimalIdentifiedEvent extends DomainEvent {
  readonly animalId: UniqueId;
  readonly previousId?: string;
  readonly newOfficialId: string;

  constructor(props: {
    animalId: UniqueId;
    previousId?: string;
    newOfficialId: string;
  }) {
    super(props.animalId);
    this.animalId = props.animalId;
    this.previousId = props.previousId;
    this.newOfficialId = props.newOfficialId;
  }

  get eventName(): string { return 'AnimalIdentifiedEvent'; }
}

export class AnimalDiedEvent extends DomainEvent {
  readonly animalId: UniqueId;
  readonly cause: string;
  readonly date: Date;
  readonly farmId: UniqueId;

  constructor(props: {
    animalId: UniqueId;
    cause: string;
    date: Date;
    farmId: UniqueId;
  }) {
    super(props.animalId);
    this.animalId = props.animalId;
    this.cause = props.cause;
    this.date = props.date;
    this.farmId = props.farmId;
  }

  get eventName(): string { return 'AnimalDiedEvent'; }
}

export class AnimalSoldEvent extends DomainEvent {
  readonly animalId: UniqueId;
  readonly gmaId: UniqueId;
  readonly saleDate: Date;

  constructor(props: {
    animalId: UniqueId;
    gmaId: UniqueId;
    saleDate: Date;
  }) {
    super(props.animalId);
    this.animalId = props.animalId;
    this.gmaId = props.gmaId;
    this.saleDate = props.saleDate;
  }

  get eventName(): string { return 'AnimalSoldEvent'; }
}

export class AnimalMovedToLotEvent extends DomainEvent {
  readonly animalId: UniqueId;
  readonly fromLotId?: UniqueId;
  readonly toLotId: UniqueId;

  constructor(props: {
    animalId: UniqueId;
    fromLotId?: UniqueId;
    toLotId: UniqueId;
  }) {
    super(props.animalId);
    this.animalId = props.animalId;
    this.fromLotId = props.fromLotId;
    this.toLotId = props.toLotId;
  }

  get eventName(): string { return 'AnimalMovedToLotEvent'; }
}
