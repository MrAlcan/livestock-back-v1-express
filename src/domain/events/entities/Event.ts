import { AggregateRoot } from '../../shared/AggregateRoot';
import { UniqueId } from '../../shared/Entity';
import { SyncStatus } from '../../animals/enums';
import { EventCategory } from '../enums';
import { EventMetadata } from '../value-objects/EventMetadata';

interface EventProps {
  sequenceNumber?: bigint;
  animalId: UniqueId;
  registeredBy: UniqueId;
  eventDate: Date;
  localRegistrationDate: Date;
  syncDate?: Date;
  eventType: string;
  eventCategory: EventCategory;
  lotContext?: UniqueId;
  paddockContext?: UniqueId;
  gpsLocation?: string;
  deviceId?: string;
  offlineId?: string;
  isManual: boolean;
  observations?: string;
  metadata?: EventMetadata;
  syncStatus: SyncStatus;
}

export class Event extends AggregateRoot<EventProps> {
  private readonly _sequenceNumber?: bigint;
  private readonly _animalId: UniqueId;
  private readonly _registeredBy: UniqueId;
  private readonly _eventDate: Date;
  private readonly _localRegistrationDate: Date;
  private _syncDate?: Date;
  private readonly _eventType: string;
  private readonly _eventCategory: EventCategory;
  private readonly _lotContext?: UniqueId;
  private readonly _paddockContext?: UniqueId;
  private readonly _gpsLocation?: string;
  private readonly _deviceId?: string;
  private readonly _offlineId?: string;
  private readonly _isManual: boolean;
  private readonly _observations?: string;
  private readonly _metadata?: EventMetadata;
  private _syncStatus: SyncStatus;

  private constructor(props: EventProps, id?: UniqueId, createdAt?: Date) {
    super(id, createdAt, createdAt);
    this._sequenceNumber = props.sequenceNumber;
    this._animalId = props.animalId;
    this._registeredBy = props.registeredBy;
    this._eventDate = props.eventDate;
    this._localRegistrationDate = props.localRegistrationDate;
    this._syncDate = props.syncDate;
    this._eventType = props.eventType;
    this._eventCategory = props.eventCategory;
    this._lotContext = props.lotContext;
    this._paddockContext = props.paddockContext;
    this._gpsLocation = props.gpsLocation;
    this._deviceId = props.deviceId;
    this._offlineId = props.offlineId;
    this._isManual = props.isManual;
    this._observations = props.observations;
    this._metadata = props.metadata;
    this._syncStatus = props.syncStatus;
  }

  static create(props: EventProps, id?: UniqueId, createdAt?: Date): Event {
    if (props.eventDate > new Date()) {
      throw new Error('Event date cannot be in the future');
    }
    if (props.localRegistrationDate < props.eventDate) {
      throw new Error('Local registration date must be >= event date');
    }
    if (props.syncDate && props.syncDate < props.localRegistrationDate) {
      throw new Error('Sync date must be >= local registration date');
    }
    return new Event(props, id, createdAt);
  }

  get sequenceNumber(): bigint | undefined { return this._sequenceNumber; }
  get animalId(): UniqueId { return this._animalId; }
  get registeredBy(): UniqueId { return this._registeredBy; }
  get eventDate(): Date { return this._eventDate; }
  get localRegistrationDate(): Date { return this._localRegistrationDate; }
  get syncDate(): Date | undefined { return this._syncDate; }
  get eventType(): string { return this._eventType; }
  get eventCategory(): EventCategory { return this._eventCategory; }
  get lotContext(): UniqueId | undefined { return this._lotContext; }
  get paddockContext(): UniqueId | undefined { return this._paddockContext; }
  get gpsLocation(): string | undefined { return this._gpsLocation; }
  get deviceId(): string | undefined { return this._deviceId; }
  get offlineId(): string | undefined { return this._offlineId; }
  get isManual(): boolean { return this._isManual; }
  get observations(): string | undefined { return this._observations; }
  get metadata(): EventMetadata | undefined { return this._metadata; }
  get syncStatus(): SyncStatus { return this._syncStatus; }

  isSynced(): boolean {
    return this._syncStatus === SyncStatus.SYNCED;
  }

  isPending(): boolean {
    return this._syncStatus === SyncStatus.PENDING;
  }

  hasConflict(): boolean {
    return this._syncStatus === SyncStatus.CONFLICT;
  }

  belongsToCategory(category: EventCategory): boolean {
    return this._eventCategory === category;
  }

  markAsSynced(syncDate: Date): void {
    this._syncDate = syncDate;
    this._syncStatus = SyncStatus.SYNCED;
  }
}
