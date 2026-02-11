import { UniqueId } from '../../shared/Entity';
import { Weight } from '../../animals/value-objects/Weight';
import { BirthType, BirthDifficulty, Vitality } from '../enums';

interface EventBirthProps {
  eventId: UniqueId;
  birthType: BirthType;
  birthDifficulty: BirthDifficulty;
  birthWeight?: Weight;
  vitality: Vitality;
  confirmedMotherId?: UniqueId;
  birthObservations?: string;
}

export class EventBirth {
  private readonly _eventId: UniqueId;
  private readonly _birthType: BirthType;
  private readonly _birthDifficulty: BirthDifficulty;
  private readonly _birthWeight?: Weight;
  private readonly _vitality: Vitality;
  private readonly _confirmedMotherId?: UniqueId;
  private readonly _birthObservations?: string;

  private constructor(props: EventBirthProps) {
    this._eventId = props.eventId;
    this._birthType = props.birthType;
    this._birthDifficulty = props.birthDifficulty;
    this._birthWeight = props.birthWeight;
    this._vitality = props.vitality;
    this._confirmedMotherId = props.confirmedMotherId;
    this._birthObservations = props.birthObservations;
  }

  static create(props: EventBirthProps): EventBirth {
    return new EventBirth(props);
  }

  get eventId(): UniqueId { return this._eventId; }
  get birthType(): BirthType { return this._birthType; }
  get birthDifficulty(): BirthDifficulty { return this._birthDifficulty; }
  get birthWeight(): Weight | undefined { return this._birthWeight; }
  get vitality(): Vitality { return this._vitality; }
  get confirmedMotherId(): UniqueId | undefined { return this._confirmedMotherId; }
  get birthObservations(): string | undefined { return this._birthObservations; }
}
