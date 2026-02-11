import { UniqueId } from '../../shared/Entity';
import { ServiceType, ReproductionResult, DiagnosisMethod } from '../enums';

interface EventReproductionProps {
  eventId: UniqueId;
  serviceType?: ServiceType;
  studId?: UniqueId;
  geneticProductId?: UniqueId;
  strawBatch?: string;
  aiTechnique?: string;
  serviceTime?: string;
  estrusPhase?: string;
  result?: ReproductionResult;
  diagnosisDate?: Date;
  diagnosisMethod?: DiagnosisMethod;
  estimatedGestationDays?: number;
  estimatedBirthDate?: Date;
  attemptNumber: number;
}

export class EventReproduction {
  private readonly _eventId: UniqueId;
  private readonly _serviceType?: ServiceType;
  private readonly _studId?: UniqueId;
  private readonly _geneticProductId?: UniqueId;
  private readonly _strawBatch?: string;
  private readonly _aiTechnique?: string;
  private readonly _serviceTime?: string;
  private readonly _estrusPhase?: string;
  private readonly _result?: ReproductionResult;
  private readonly _diagnosisDate?: Date;
  private readonly _diagnosisMethod?: DiagnosisMethod;
  private readonly _estimatedGestationDays?: number;
  private readonly _estimatedBirthDate?: Date;
  private readonly _attemptNumber: number;

  private constructor(props: EventReproductionProps) {
    this._eventId = props.eventId;
    this._serviceType = props.serviceType;
    this._studId = props.studId;
    this._geneticProductId = props.geneticProductId;
    this._strawBatch = props.strawBatch;
    this._aiTechnique = props.aiTechnique;
    this._serviceTime = props.serviceTime;
    this._estrusPhase = props.estrusPhase;
    this._result = props.result;
    this._diagnosisDate = props.diagnosisDate;
    this._diagnosisMethod = props.diagnosisMethod;
    this._estimatedGestationDays = props.estimatedGestationDays;
    this._estimatedBirthDate = props.estimatedBirthDate;
    this._attemptNumber = props.attemptNumber;
  }

  static create(props: EventReproductionProps): EventReproduction {
    if (props.attemptNumber < 1) {
      throw new Error('Attempt number must be >= 1');
    }
    return new EventReproduction(props);
  }

  get eventId(): UniqueId { return this._eventId; }
  get serviceType(): ServiceType | undefined { return this._serviceType; }
  get studId(): UniqueId | undefined { return this._studId; }
  get geneticProductId(): UniqueId | undefined { return this._geneticProductId; }
  get strawBatch(): string | undefined { return this._strawBatch; }
  get aiTechnique(): string | undefined { return this._aiTechnique; }
  get serviceTime(): string | undefined { return this._serviceTime; }
  get estrusPhase(): string | undefined { return this._estrusPhase; }
  get result(): ReproductionResult | undefined { return this._result; }
  get diagnosisDate(): Date | undefined { return this._diagnosisDate; }
  get diagnosisMethod(): DiagnosisMethod | undefined { return this._diagnosisMethod; }
  get estimatedGestationDays(): number | undefined { return this._estimatedGestationDays; }
  get estimatedBirthDate(): Date | undefined { return this._estimatedBirthDate; }
  get attemptNumber(): number { return this._attemptNumber; }

  isService(): boolean {
    return this._serviceType !== undefined;
  }

  isDiagnosis(): boolean {
    return this._diagnosisMethod !== undefined;
  }

  isPregnant(): boolean {
    return this._result === ReproductionResult.PREGNANT;
  }
}
