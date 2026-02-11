import { AggregateRoot } from '../../shared/AggregateRoot';
import { UniqueId } from '../../shared/Entity';
import { AnimalSex, AnimalStatus, AnimalOrigin, SyncStatus, IdentifierType } from '../enums';
import { OfficialId } from '../value-objects/OfficialId';
import { Weight } from '../value-objects/Weight';
import { Age } from '../value-objects/Age';
import { AnimalIdentifier } from '../value-objects/AnimalIdentifier';

interface AnimalProps {
  officialId?: OfficialId;
  temporaryId?: string;
  brandMark?: string;
  visualTag?: string;
  electronicId?: string;
  sex: AnimalSex;
  birthDate?: Date;
  isEstimatedBirthDate: boolean;
  breedId?: UniqueId;
  breedPercentage?: number;
  coatColor?: string;
  status: AnimalStatus;
  substatus?: string;
  exitDate?: Date;
  exitReason?: string;
  birthWeight?: Weight;
  currentWeight?: Weight;
  lastWeighingDate?: Date;
  motherId?: UniqueId;
  fatherId?: UniqueId;
  currentLotId?: UniqueId;
  currentPaddockId?: UniqueId;
  farmId: UniqueId;
  origin: AnimalOrigin;
  observations?: string;
  photoUrl?: string;
  syncStatus: SyncStatus;
  syncVersion: number;
  deviceId?: string;
  deletedAt?: Date;
}

export class Animal extends AggregateRoot<AnimalProps> {
  private _officialId?: OfficialId;
  private _temporaryId?: string;
  private _brandMark?: string;
  private _visualTag?: string;
  private _electronicId?: string;
  private readonly _sex: AnimalSex;
  private _birthDate?: Date;
  private _isEstimatedBirthDate: boolean;
  private _breedId?: UniqueId;
  private _breedPercentage?: number;
  private _coatColor?: string;
  private _status: AnimalStatus;
  private _substatus?: string;
  private _exitDate?: Date;
  private _exitReason?: string;
  private _birthWeight?: Weight;
  private _currentWeight?: Weight;
  private _lastWeighingDate?: Date;
  private _motherId?: UniqueId;
  private _fatherId?: UniqueId;
  private _currentLotId?: UniqueId;
  private _currentPaddockId?: UniqueId;
  private readonly _farmId: UniqueId;
  private readonly _origin: AnimalOrigin;
  private _observations?: string;
  private _photoUrl?: string;
  private _syncStatus: SyncStatus;
  private _syncVersion: number;
  private _deviceId?: string;
  private _deletedAt?: Date;

  private constructor(props: AnimalProps, id?: UniqueId, createdAt?: Date, updatedAt?: Date) {
    super(id, createdAt, updatedAt);
    this._officialId = props.officialId;
    this._temporaryId = props.temporaryId;
    this._brandMark = props.brandMark;
    this._visualTag = props.visualTag;
    this._electronicId = props.electronicId;
    this._sex = props.sex;
    this._birthDate = props.birthDate;
    this._isEstimatedBirthDate = props.isEstimatedBirthDate;
    this._breedId = props.breedId;
    this._breedPercentage = props.breedPercentage;
    this._coatColor = props.coatColor;
    this._status = props.status;
    this._substatus = props.substatus;
    this._exitDate = props.exitDate;
    this._exitReason = props.exitReason;
    this._birthWeight = props.birthWeight;
    this._currentWeight = props.currentWeight;
    this._lastWeighingDate = props.lastWeighingDate;
    this._motherId = props.motherId;
    this._fatherId = props.fatherId;
    this._currentLotId = props.currentLotId;
    this._currentPaddockId = props.currentPaddockId;
    this._farmId = props.farmId;
    this._origin = props.origin;
    this._observations = props.observations;
    this._photoUrl = props.photoUrl;
    this._syncStatus = props.syncStatus;
    this._syncVersion = props.syncVersion;
    this._deviceId = props.deviceId;
    this._deletedAt = props.deletedAt;
  }

  static create(props: AnimalProps, id?: UniqueId, createdAt?: Date, updatedAt?: Date): Animal {
    if (props.birthDate && props.birthDate > new Date()) {
      throw new Error('Birth date cannot be in the future');
    }
    if (props.motherId && props.fatherId && props.motherId.equals(props.fatherId)) {
      throw new Error('Mother and father cannot be the same animal');
    }
    if ((props.status === AnimalStatus.DEAD || props.status === AnimalStatus.SOLD) && !props.exitDate) {
      throw new Error('Dead or sold animals must have an exit date');
    }
    return new Animal(props, id, createdAt, updatedAt);
  }

  // Getters
  get officialId(): OfficialId | undefined { return this._officialId; }
  get temporaryId(): string | undefined { return this._temporaryId; }
  get brandMark(): string | undefined { return this._brandMark; }
  get visualTag(): string | undefined { return this._visualTag; }
  get electronicId(): string | undefined { return this._electronicId; }
  get sex(): AnimalSex { return this._sex; }
  get birthDate(): Date | undefined { return this._birthDate; }
  get isEstimatedBirthDate(): boolean { return this._isEstimatedBirthDate; }
  get breedId(): UniqueId | undefined { return this._breedId; }
  get breedPercentage(): number | undefined { return this._breedPercentage; }
  get coatColor(): string | undefined { return this._coatColor; }
  get status(): AnimalStatus { return this._status; }
  get substatus(): string | undefined { return this._substatus; }
  get exitDate(): Date | undefined { return this._exitDate; }
  get exitReason(): string | undefined { return this._exitReason; }
  get birthWeight(): Weight | undefined { return this._birthWeight; }
  get currentWeight(): Weight | undefined { return this._currentWeight; }
  get lastWeighingDate(): Date | undefined { return this._lastWeighingDate; }
  get motherId(): UniqueId | undefined { return this._motherId; }
  get fatherId(): UniqueId | undefined { return this._fatherId; }
  get currentLotId(): UniqueId | undefined { return this._currentLotId; }
  get currentPaddockId(): UniqueId | undefined { return this._currentPaddockId; }
  get farmId(): UniqueId { return this._farmId; }
  get origin(): AnimalOrigin { return this._origin; }
  get observations(): string | undefined { return this._observations; }
  get photoUrl(): string | undefined { return this._photoUrl; }
  get syncStatus(): SyncStatus { return this._syncStatus; }
  get syncVersion(): number { return this._syncVersion; }
  get deviceId(): string | undefined { return this._deviceId; }
  get deletedAt(): Date | undefined { return this._deletedAt; }

  // Business methods
  updateWeight(weight: Weight, date: Date): void {
    this._currentWeight = weight;
    this._lastWeighingDate = date;
    this.touch();
  }

  markAsDead(cause: string, date: Date): void {
    if (this._status === AnimalStatus.DEAD) {
      throw new Error('Animal is already dead');
    }
    if (this._status === AnimalStatus.SOLD) {
      throw new Error('Cannot mark a sold animal as dead');
    }
    this._status = AnimalStatus.DEAD;
    this._exitDate = date;
    this._exitReason = cause;
    this.touch();
  }

  markAsSold(date: Date): void {
    if (this._status === AnimalStatus.SOLD) {
      throw new Error('Animal is already sold');
    }
    if (this._status === AnimalStatus.DEAD) {
      throw new Error('Cannot sell a dead animal');
    }
    this._status = AnimalStatus.SOLD;
    this._exitDate = date;
    this.touch();
  }

  assignToLot(lotId: UniqueId): void {
    if (!this.canBeMoved()) {
      throw new Error('Animal cannot be moved in current status');
    }
    this._currentLotId = lotId;
    this.touch();
  }

  assignToPaddock(paddockId: UniqueId): void {
    if (!this.canBeMoved()) {
      throw new Error('Animal cannot be moved in current status');
    }
    this._currentPaddockId = paddockId;
    this.touch();
  }

  updateIdentification(officialId: OfficialId): void {
    this._officialId = officialId;
    this.touch();
  }

  canBeMoved(): boolean {
    return this._status === AnimalStatus.ACTIVE;
  }

  canBeInGMA(): boolean {
    return this._status === AnimalStatus.ACTIVE;
  }

  calculateAge(): Age | null {
    if (!this._birthDate) return null;
    return Age.fromBirthDate(this._birthDate);
  }

  isAdult(): boolean {
    const age = this.calculateAge();
    return age !== null && age.isAdult();
  }

  isFemale(): boolean {
    return this._sex === AnimalSex.FEMALE;
  }

  isMale(): boolean {
    return this._sex === AnimalSex.MALE;
  }

  isActive(): boolean {
    return this._status === AnimalStatus.ACTIVE;
  }

  getFullIdentifier(): string {
    if (this._officialId) return this._officialId.value;
    if (this._electronicId) return this._electronicId;
    if (this._visualTag) return this._visualTag;
    if (this._temporaryId) return this._temporaryId;
    return this.id.value;
  }

  getBestIdentifier(): AnimalIdentifier {
    if (this._officialId) {
      return AnimalIdentifier.create(IdentifierType.OFFICIAL, this._officialId.value);
    }
    if (this._electronicId) {
      return AnimalIdentifier.create(IdentifierType.ELECTRONIC, this._electronicId);
    }
    if (this._visualTag) {
      return AnimalIdentifier.create(IdentifierType.VISUAL, this._visualTag);
    }
    if (this._temporaryId) {
      return AnimalIdentifier.create(IdentifierType.TEMPORARY, this._temporaryId);
    }
    return AnimalIdentifier.create(IdentifierType.TEMPORARY, this.id.value);
  }

  validateParentNotSelf(parentId: UniqueId): void {
    if (this.id.equals(parentId)) {
      throw new Error('An animal cannot be its own parent');
    }
  }
}
