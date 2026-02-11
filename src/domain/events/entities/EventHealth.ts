import { UniqueId } from '../../shared/Entity';
import { AdministrationRoute, TreatmentResult } from '../enums';

interface EventHealthProps {
  eventId: UniqueId;
  productId: UniqueId;
  productBatch?: string;
  productExpirationDate?: Date;
  appliedDose: string;
  doseUnit?: string;
  administrationRoute?: AdministrationRoute;
  applicationSite?: string;
  previousDiagnosis?: string;
  treatmentResult?: TreatmentResult;
  requiresFollowUp: boolean;
  nextCheckDate?: Date;
  adverseReaction?: string;
}

export class EventHealth {
  private readonly _eventId: UniqueId;
  private readonly _productId: UniqueId;
  private readonly _productBatch?: string;
  private readonly _productExpirationDate?: Date;
  private readonly _appliedDose: string;
  private readonly _doseUnit?: string;
  private readonly _administrationRoute?: AdministrationRoute;
  private readonly _applicationSite?: string;
  private readonly _previousDiagnosis?: string;
  private readonly _treatmentResult?: TreatmentResult;
  private readonly _requiresFollowUp: boolean;
  private readonly _nextCheckDate?: Date;
  private readonly _adverseReaction?: string;

  private constructor(props: EventHealthProps) {
    this._eventId = props.eventId;
    this._productId = props.productId;
    this._productBatch = props.productBatch;
    this._productExpirationDate = props.productExpirationDate;
    this._appliedDose = props.appliedDose;
    this._doseUnit = props.doseUnit;
    this._administrationRoute = props.administrationRoute;
    this._applicationSite = props.applicationSite;
    this._previousDiagnosis = props.previousDiagnosis;
    this._treatmentResult = props.treatmentResult;
    this._requiresFollowUp = props.requiresFollowUp;
    this._nextCheckDate = props.nextCheckDate;
    this._adverseReaction = props.adverseReaction;
  }

  static create(props: EventHealthProps): EventHealth {
    if (!props.appliedDose || props.appliedDose.trim().length === 0) {
      throw new Error('Applied dose is required');
    }
    return new EventHealth(props);
  }

  get eventId(): UniqueId { return this._eventId; }
  get productId(): UniqueId { return this._productId; }
  get productBatch(): string | undefined { return this._productBatch; }
  get productExpirationDate(): Date | undefined { return this._productExpirationDate; }
  get appliedDose(): string { return this._appliedDose; }
  get doseUnit(): string | undefined { return this._doseUnit; }
  get administrationRoute(): AdministrationRoute | undefined { return this._administrationRoute; }
  get applicationSite(): string | undefined { return this._applicationSite; }
  get previousDiagnosis(): string | undefined { return this._previousDiagnosis; }
  get treatmentResult(): TreatmentResult | undefined { return this._treatmentResult; }
  get requiresFollowUp(): boolean { return this._requiresFollowUp; }
  get nextCheckDate(): Date | undefined { return this._nextCheckDate; }
  get adverseReaction(): string | undefined { return this._adverseReaction; }
}
