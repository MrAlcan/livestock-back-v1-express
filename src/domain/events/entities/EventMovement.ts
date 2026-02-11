import { UniqueId } from '../../shared/Entity';
import { Weight } from '../../animals/value-objects/Weight';
import { MovementType } from '../enums';

interface EventMovementProps {
  eventId: UniqueId;
  movementType: MovementType;
  originLotId?: UniqueId;
  destinationLotId?: UniqueId;
  originPaddockId?: UniqueId;
  destinationPaddockId?: UniqueId;
  reason?: string;
  weightAtMovement?: Weight;
  distanceKm?: number;
}

export class EventMovement {
  private readonly _eventId: UniqueId;
  private readonly _movementType: MovementType;
  private readonly _originLotId?: UniqueId;
  private readonly _destinationLotId?: UniqueId;
  private readonly _originPaddockId?: UniqueId;
  private readonly _destinationPaddockId?: UniqueId;
  private readonly _reason?: string;
  private readonly _weightAtMovement?: Weight;
  private readonly _distanceKm?: number;

  private constructor(props: EventMovementProps) {
    this._eventId = props.eventId;
    this._movementType = props.movementType;
    this._originLotId = props.originLotId;
    this._destinationLotId = props.destinationLotId;
    this._originPaddockId = props.originPaddockId;
    this._destinationPaddockId = props.destinationPaddockId;
    this._reason = props.reason;
    this._weightAtMovement = props.weightAtMovement;
    this._distanceKm = props.distanceKm;
  }

  static create(props: EventMovementProps): EventMovement {
    return new EventMovement(props);
  }

  get eventId(): UniqueId { return this._eventId; }
  get movementType(): MovementType { return this._movementType; }
  get originLotId(): UniqueId | undefined { return this._originLotId; }
  get destinationLotId(): UniqueId | undefined { return this._destinationLotId; }
  get originPaddockId(): UniqueId | undefined { return this._originPaddockId; }
  get destinationPaddockId(): UniqueId | undefined { return this._destinationPaddockId; }
  get reason(): string | undefined { return this._reason; }
  get weightAtMovement(): Weight | undefined { return this._weightAtMovement; }
  get distanceKm(): number | undefined { return this._distanceKm; }
}
