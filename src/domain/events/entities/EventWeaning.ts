import { UniqueId } from '../../shared/Entity';
import { Weight } from '../../animals/value-objects/Weight';
import { WeaningType } from '../enums';

interface EventWeaningProps {
  eventId: UniqueId;
  weaningWeight: Weight;
  ageDays: number;
  weaningType: WeaningType;
  motherPostWeanWeight?: Weight;
  birthEventId?: UniqueId;
}

export class EventWeaning {
  private readonly _eventId: UniqueId;
  private readonly _weaningWeight: Weight;
  private readonly _ageDays: number;
  private readonly _weaningType: WeaningType;
  private readonly _motherPostWeanWeight?: Weight;
  private readonly _birthEventId?: UniqueId;

  private constructor(props: EventWeaningProps) {
    this._eventId = props.eventId;
    this._weaningWeight = props.weaningWeight;
    this._ageDays = props.ageDays;
    this._weaningType = props.weaningType;
    this._motherPostWeanWeight = props.motherPostWeanWeight;
    this._birthEventId = props.birthEventId;
  }

  static create(props: EventWeaningProps): EventWeaning {
    if (props.ageDays <= 0) {
      throw new Error('Age in days must be positive');
    }
    return new EventWeaning(props);
  }

  get eventId(): UniqueId { return this._eventId; }
  get weaningWeight(): Weight { return this._weaningWeight; }
  get ageDays(): number { return this._ageDays; }
  get weaningType(): WeaningType { return this._weaningType; }
  get motherPostWeanWeight(): Weight | undefined { return this._motherPostWeanWeight; }
  get birthEventId(): UniqueId | undefined { return this._birthEventId; }

  isEarlyWeaning(): boolean {
    return this._ageDays < 180;
  }

  isLateWeaning(): boolean {
    return this._ageDays > 300;
  }
}
