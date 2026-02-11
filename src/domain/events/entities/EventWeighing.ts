import { UniqueId } from '../../shared/Entity';
import { Weight } from '../../animals/value-objects/Weight';
import { WeighingType } from '../enums';
import { ADG } from '../value-objects/ADG';

interface EventWeighingProps {
  eventId: UniqueId;
  weightKg: Weight;
  weighingType: WeighingType;
  bodyCondition?: number;
  adgSincePrevious?: ADG;
  daysSincePrevious?: number;
  previousWeighingId?: UniqueId;
  scaleDevice?: string;
}

export class EventWeighing {
  private readonly _eventId: UniqueId;
  private readonly _weightKg: Weight;
  private readonly _weighingType: WeighingType;
  private readonly _bodyCondition?: number;
  private readonly _adgSincePrevious?: ADG;
  private readonly _daysSincePrevious?: number;
  private readonly _previousWeighingId?: UniqueId;
  private readonly _scaleDevice?: string;

  private constructor(props: EventWeighingProps) {
    this._eventId = props.eventId;
    this._weightKg = props.weightKg;
    this._weighingType = props.weighingType;
    this._bodyCondition = props.bodyCondition;
    this._adgSincePrevious = props.adgSincePrevious;
    this._daysSincePrevious = props.daysSincePrevious;
    this._previousWeighingId = props.previousWeighingId;
    this._scaleDevice = props.scaleDevice;
  }

  static create(props: EventWeighingProps): EventWeighing {
    if (props.bodyCondition !== undefined && (props.bodyCondition < 1 || props.bodyCondition > 5)) {
      throw new Error('Body condition must be between 1 and 5');
    }
    return new EventWeighing(props);
  }

  get eventId(): UniqueId { return this._eventId; }
  get weightKg(): Weight { return this._weightKg; }
  get weighingType(): WeighingType { return this._weighingType; }
  get bodyCondition(): number | undefined { return this._bodyCondition; }
  get adgSincePrevious(): ADG | undefined { return this._adgSincePrevious; }
  get daysSincePrevious(): number | undefined { return this._daysSincePrevious; }
  get previousWeighingId(): UniqueId | undefined { return this._previousWeighingId; }
  get scaleDevice(): string | undefined { return this._scaleDevice; }

  hasADG(): boolean {
    return this._adgSincePrevious !== undefined;
  }
}
