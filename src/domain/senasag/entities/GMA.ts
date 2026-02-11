import { AggregateRoot } from '../../shared/AggregateRoot';
import { UniqueId } from '../../shared/Entity';
import { GMAType, GMAStatus } from '../enums';

interface GMAProps {
  internalNumber: string;
  gmaCode?: string;
  temporaryCode?: string;
  registrarId: UniqueId;
  originFarmId: UniqueId;
  transporterId: UniqueId;
  destinationId: UniqueId;
  type: GMAType;
  requestDate: Date;
  issueDate?: Date;
  expirationDate?: Date;
  actualDepartureDate?: Date;
  estimatedArrivalDate?: Date;
  actualArrivalDate?: Date;
  status: GMAStatus;
  rejectionReason?: string;
  animalQuantity: number;
  estimatedTotalWeight?: number;
  actualTotalWeight?: number;
  distanceKm?: number;
  route?: string;
  observations?: string;
  documents?: Record<string, unknown>;
  tracking?: Record<string, unknown>;
}

export class GMA extends AggregateRoot<GMAProps> {
  private readonly _internalNumber: string;
  private _gmaCode?: string;
  private _temporaryCode?: string;
  private readonly _registrarId: UniqueId;
  private readonly _originFarmId: UniqueId;
  private readonly _transporterId: UniqueId;
  private readonly _destinationId: UniqueId;
  private readonly _type: GMAType;
  private readonly _requestDate: Date;
  private _issueDate?: Date;
  private _expirationDate?: Date;
  private _actualDepartureDate?: Date;
  private _estimatedArrivalDate?: Date;
  private _actualArrivalDate?: Date;
  private _status: GMAStatus;
  private _rejectionReason?: string;
  private _animalQuantity: number;
  private _estimatedTotalWeight?: number;
  private _actualTotalWeight?: number;
  private _distanceKm?: number;
  private _route?: string;
  private _observations?: string;
  private _documents?: Record<string, unknown>;
  private _tracking?: Record<string, unknown>;

  private constructor(props: GMAProps, id?: UniqueId, createdAt?: Date, updatedAt?: Date) {
    super(id, createdAt, updatedAt);
    this._internalNumber = props.internalNumber;
    this._gmaCode = props.gmaCode;
    this._temporaryCode = props.temporaryCode;
    this._registrarId = props.registrarId;
    this._originFarmId = props.originFarmId;
    this._transporterId = props.transporterId;
    this._destinationId = props.destinationId;
    this._type = props.type;
    this._requestDate = props.requestDate;
    this._issueDate = props.issueDate;
    this._expirationDate = props.expirationDate;
    this._actualDepartureDate = props.actualDepartureDate;
    this._estimatedArrivalDate = props.estimatedArrivalDate;
    this._actualArrivalDate = props.actualArrivalDate;
    this._status = props.status;
    this._rejectionReason = props.rejectionReason;
    this._animalQuantity = props.animalQuantity;
    this._estimatedTotalWeight = props.estimatedTotalWeight;
    this._actualTotalWeight = props.actualTotalWeight;
    this._distanceKm = props.distanceKm;
    this._route = props.route;
    this._observations = props.observations;
    this._documents = props.documents;
    this._tracking = props.tracking;
  }

  static create(props: GMAProps, id?: UniqueId, createdAt?: Date, updatedAt?: Date): GMA {
    if (!props.internalNumber || props.internalNumber.trim().length === 0) {
      throw new Error('Internal number is required');
    }
    if (props.animalQuantity <= 0) {
      throw new Error('Animal quantity must be positive');
    }
    if (props.status === GMAStatus.APPROVED && (!props.gmaCode || !props.issueDate)) {
      throw new Error('Approved GMAs must have a GMA code and issue date');
    }
    if (props.status === GMAStatus.IN_TRANSIT && !props.actualDepartureDate) {
      throw new Error('In-transit GMAs must have a departure date');
    }
    if (props.status === GMAStatus.CLOSED && !props.actualArrivalDate) {
      throw new Error('Closed GMAs must have an arrival date');
    }
    return new GMA(props, id, createdAt, updatedAt);
  }

  get internalNumber(): string { return this._internalNumber; }
  get gmaCode(): string | undefined { return this._gmaCode; }
  get temporaryCode(): string | undefined { return this._temporaryCode; }
  get registrarId(): UniqueId { return this._registrarId; }
  get originFarmId(): UniqueId { return this._originFarmId; }
  get transporterId(): UniqueId { return this._transporterId; }
  get destinationId(): UniqueId { return this._destinationId; }
  get type(): GMAType { return this._type; }
  get requestDate(): Date { return this._requestDate; }
  get issueDate(): Date | undefined { return this._issueDate; }
  get expirationDate(): Date | undefined { return this._expirationDate; }
  get actualDepartureDate(): Date | undefined { return this._actualDepartureDate; }
  get estimatedArrivalDate(): Date | undefined { return this._estimatedArrivalDate; }
  get actualArrivalDate(): Date | undefined { return this._actualArrivalDate; }
  get status(): GMAStatus { return this._status; }
  get rejectionReason(): string | undefined { return this._rejectionReason; }
  get animalQuantity(): number { return this._animalQuantity; }
  get estimatedTotalWeight(): number | undefined { return this._estimatedTotalWeight; }
  get actualTotalWeight(): number | undefined { return this._actualTotalWeight; }
  get distanceKm(): number | undefined { return this._distanceKm; }
  get route(): string | undefined { return this._route; }
  get observations(): string | undefined { return this._observations; }
  get documents(): Record<string, unknown> | undefined { return this._documents; }
  get tracking(): Record<string, unknown> | undefined { return this._tracking; }

  canBeIssued(): boolean {
    return this._status === GMAStatus.PENDING_APPROVAL;
  }

  approve(gmaCode: string, issueDate: Date): void {
    if (this._status !== GMAStatus.PENDING_APPROVAL) {
      throw new Error('Only pending GMAs can be approved');
    }
    this._gmaCode = gmaCode;
    this._issueDate = issueDate;
    this._status = GMAStatus.APPROVED;
    // Expiration 72 hours after issue
    this._expirationDate = new Date(issueDate.getTime() + 72 * 60 * 60 * 1000);
    this.touch();
  }

  reject(reason: string): void {
    if (this._status !== GMAStatus.PENDING_APPROVAL) {
      throw new Error('Only pending GMAs can be rejected');
    }
    this._rejectionReason = reason;
    this._status = GMAStatus.REJECTED;
    this.touch();
  }

  markInTransit(departureDate: Date): void {
    if (this._status !== GMAStatus.APPROVED) {
      throw new Error('Only approved GMAs can be marked in transit');
    }
    this._actualDepartureDate = departureDate;
    this._status = GMAStatus.IN_TRANSIT;
    this.touch();
  }

  close(arrivalDate: Date, actualWeight: number): void {
    if (this._status !== GMAStatus.IN_TRANSIT) {
      throw new Error('Only in-transit GMAs can be closed');
    }
    this._actualArrivalDate = arrivalDate;
    this._actualTotalWeight = actualWeight;
    this._status = GMAStatus.CLOSED;
    this.touch();
  }

  isExpired(): boolean {
    if (!this._expirationDate) return false;
    return new Date() > this._expirationDate;
  }

  isInTransit(): boolean {
    return this._status === GMAStatus.IN_TRANSIT;
  }

  isPending(): boolean {
    return this._status === GMAStatus.PENDING_APPROVAL;
  }
}
