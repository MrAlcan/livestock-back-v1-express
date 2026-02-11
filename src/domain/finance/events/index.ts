import { DomainEvent } from '../../shared/DomainEvent';
import { UniqueId } from '../../shared/Entity';

export class ExpenseRecordedEvent extends DomainEvent {
  readonly movementId: UniqueId;
  readonly amount: number;
  readonly currency: string;
  readonly category: string;

  constructor(props: { movementId: UniqueId; amount: number; currency: string; category: string }) {
    super(props.movementId);
    this.movementId = props.movementId;
    this.amount = props.amount;
    this.currency = props.currency;
    this.category = props.category;
  }

  get eventName(): string { return 'ExpenseRecordedEvent'; }
}

export class IncomeRecordedEvent extends DomainEvent {
  readonly movementId: UniqueId;
  readonly amount: number;
  readonly currency: string;
  readonly category: string;

  constructor(props: { movementId: UniqueId; amount: number; currency: string; category: string }) {
    super(props.movementId);
    this.movementId = props.movementId;
    this.amount = props.amount;
    this.currency = props.currency;
    this.category = props.category;
  }

  get eventName(): string { return 'IncomeRecordedEvent'; }
}

export class PaymentOverdueEvent extends DomainEvent {
  readonly movementId: UniqueId;
  readonly dueDate: Date;
  readonly thirdPartyId: UniqueId;
  readonly amount: number;

  constructor(props: { movementId: UniqueId; dueDate: Date; thirdPartyId: UniqueId; amount: number }) {
    super(props.movementId);
    this.movementId = props.movementId;
    this.dueDate = props.dueDate;
    this.thirdPartyId = props.thirdPartyId;
    this.amount = props.amount;
  }

  get eventName(): string { return 'PaymentOverdueEvent'; }
}
