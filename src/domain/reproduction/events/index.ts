import { DomainEvent } from '../../shared/DomainEvent';
import { UniqueId } from '../../shared/Entity';
import { Weight } from '../../animals/value-objects/Weight';
import { ServiceType } from '../../events/enums';

export class ServiceRecordedEvent extends DomainEvent {
  readonly femaleId: UniqueId;
  readonly studId?: UniqueId;
  readonly serviceType: ServiceType;
  readonly serviceDate: Date;

  constructor(props: { femaleId: UniqueId; studId?: UniqueId; serviceType: ServiceType; serviceDate: Date }) {
    super(props.femaleId);
    this.femaleId = props.femaleId;
    this.studId = props.studId;
    this.serviceType = props.serviceType;
    this.serviceDate = props.serviceDate;
  }

  get eventName(): string { return 'ServiceRecordedEvent'; }
}

export class PregnancyConfirmedEvent extends DomainEvent {
  readonly femaleId: UniqueId;
  readonly diagnosisDate: Date;
  readonly estimatedBirthDate: Date;

  constructor(props: { femaleId: UniqueId; diagnosisDate: Date; estimatedBirthDate: Date }) {
    super(props.femaleId);
    this.femaleId = props.femaleId;
    this.diagnosisDate = props.diagnosisDate;
    this.estimatedBirthDate = props.estimatedBirthDate;
  }

  get eventName(): string { return 'PregnancyConfirmedEvent'; }
}

export class WeaningCompletedEvent extends DomainEvent {
  readonly calfId: UniqueId;
  readonly motherId: UniqueId;
  readonly weaningDate: Date;
  readonly weaningWeight: Weight;
  readonly ageDays: number;

  constructor(props: { calfId: UniqueId; motherId: UniqueId; weaningDate: Date; weaningWeight: Weight; ageDays: number }) {
    super(props.calfId);
    this.calfId = props.calfId;
    this.motherId = props.motherId;
    this.weaningDate = props.weaningDate;
    this.weaningWeight = props.weaningWeight;
    this.ageDays = props.ageDays;
  }

  get eventName(): string { return 'WeaningCompletedEvent'; }
}
