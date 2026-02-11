import { UniqueId } from '../../shared/Entity';
import { DeathCategory } from '../enums';

interface MoneyValue {
  amount: number;
  currency: string;
}

interface EventDeathProps {
  eventId: UniqueId;
  deathCause: string;
  causeCategory: DeathCategory;
  necropsyPerformed: boolean;
  necropsyDiagnosis?: string;
  isNotifiableSenasag: boolean;
  estimatedLossValue?: MoneyValue;
  documentationUrl?: string;
}

export class EventDeath {
  private readonly _eventId: UniqueId;
  private readonly _deathCause: string;
  private readonly _causeCategory: DeathCategory;
  private readonly _necropsyPerformed: boolean;
  private readonly _necropsyDiagnosis?: string;
  private readonly _isNotifiableSenasag: boolean;
  private readonly _estimatedLossValue?: MoneyValue;
  private readonly _documentationUrl?: string;

  private constructor(props: EventDeathProps) {
    this._eventId = props.eventId;
    this._deathCause = props.deathCause;
    this._causeCategory = props.causeCategory;
    this._necropsyPerformed = props.necropsyPerformed;
    this._necropsyDiagnosis = props.necropsyDiagnosis;
    this._isNotifiableSenasag = props.isNotifiableSenasag;
    this._estimatedLossValue = props.estimatedLossValue;
    this._documentationUrl = props.documentationUrl;
  }

  static create(props: EventDeathProps): EventDeath {
    if (!props.deathCause || props.deathCause.trim().length === 0) {
      throw new Error('Death cause is required');
    }
    return new EventDeath(props);
  }

  get eventId(): UniqueId { return this._eventId; }
  get deathCause(): string { return this._deathCause; }
  get causeCategory(): DeathCategory { return this._causeCategory; }
  get necropsyPerformed(): boolean { return this._necropsyPerformed; }
  get necropsyDiagnosis(): string | undefined { return this._necropsyDiagnosis; }
  get isNotifiableSenasag(): boolean { return this._isNotifiableSenasag; }
  get estimatedLossValue(): MoneyValue | undefined { return this._estimatedLossValue; }
  get documentationUrl(): string | undefined { return this._documentationUrl; }
}
