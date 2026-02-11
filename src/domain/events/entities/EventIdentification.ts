import { UniqueId } from '../../shared/Entity';
import { IdentificationType } from '../enums';

interface EventIdentificationProps {
  eventId: UniqueId;
  identificationType: IdentificationType;
  previousIdentifier?: string;
  newIdentifier: string;
  changeReason?: string;
  documentationUrl?: string;
}

export class EventIdentification {
  private readonly _eventId: UniqueId;
  private readonly _identificationType: IdentificationType;
  private readonly _previousIdentifier?: string;
  private readonly _newIdentifier: string;
  private readonly _changeReason?: string;
  private readonly _documentationUrl?: string;

  private constructor(props: EventIdentificationProps) {
    this._eventId = props.eventId;
    this._identificationType = props.identificationType;
    this._previousIdentifier = props.previousIdentifier;
    this._newIdentifier = props.newIdentifier;
    this._changeReason = props.changeReason;
    this._documentationUrl = props.documentationUrl;
  }

  static create(props: EventIdentificationProps): EventIdentification {
    if (!props.newIdentifier || props.newIdentifier.trim().length === 0) {
      throw new Error('New identifier is required');
    }
    return new EventIdentification(props);
  }

  get eventId(): UniqueId { return this._eventId; }
  get identificationType(): IdentificationType { return this._identificationType; }
  get previousIdentifier(): string | undefined { return this._previousIdentifier; }
  get newIdentifier(): string { return this._newIdentifier; }
  get changeReason(): string | undefined { return this._changeReason; }
  get documentationUrl(): string | undefined { return this._documentationUrl; }
}
