import { AggregateRoot } from '../../shared/AggregateRoot';
import { UniqueId } from '../../shared/Entity';
import { PastureCondition } from '../enums';

interface PaddockProps {
  code: string;
  name: string;
  hectares?: number;
  maxCapacityAU?: number;
  pastureType?: string;
  pastureCondition?: PastureCondition;
  lastSeedingDate?: Date;
  recommendedRestDays?: number;
  lastEntryDate?: Date;
  location?: Record<string, unknown>;
  hasWater: boolean;
  hasShade: boolean;
  farmId: UniqueId;
  observations?: string;
  deletedAt?: Date;
}

export class Paddock extends AggregateRoot<PaddockProps> {
  private _code: string;
  private _name: string;
  private _hectares?: number;
  private _maxCapacityAU?: number;
  private _pastureType?: string;
  private _pastureCondition?: PastureCondition;
  private _lastSeedingDate?: Date;
  private _recommendedRestDays?: number;
  private _lastEntryDate?: Date;
  private _location?: Record<string, unknown>;
  private _hasWater: boolean;
  private _hasShade: boolean;
  private readonly _farmId: UniqueId;
  private _observations?: string;
  private _deletedAt?: Date;

  private constructor(props: PaddockProps, id?: UniqueId, createdAt?: Date, updatedAt?: Date) {
    super(id, createdAt, updatedAt);
    this._code = props.code;
    this._name = props.name;
    this._hectares = props.hectares;
    this._maxCapacityAU = props.maxCapacityAU;
    this._pastureType = props.pastureType;
    this._pastureCondition = props.pastureCondition;
    this._lastSeedingDate = props.lastSeedingDate;
    this._recommendedRestDays = props.recommendedRestDays;
    this._lastEntryDate = props.lastEntryDate;
    this._location = props.location;
    this._hasWater = props.hasWater;
    this._hasShade = props.hasShade;
    this._farmId = props.farmId;
    this._observations = props.observations;
    this._deletedAt = props.deletedAt;
  }

  static create(props: PaddockProps, id?: UniqueId, createdAt?: Date, updatedAt?: Date): Paddock {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Paddock code is required');
    }
    if (props.hectares !== undefined && props.hectares <= 0) {
      throw new Error('Hectares must be positive');
    }
    if (props.maxCapacityAU !== undefined && props.maxCapacityAU <= 0) {
      throw new Error('Max capacity must be positive');
    }
    if (props.recommendedRestDays !== undefined && props.recommendedRestDays < 0) {
      throw new Error('Recommended rest days cannot be negative');
    }
    return new Paddock(props, id, createdAt, updatedAt);
  }

  get code(): string { return this._code; }
  get name(): string { return this._name; }
  get hectares(): number | undefined { return this._hectares; }
  get maxCapacityAU(): number | undefined { return this._maxCapacityAU; }
  get pastureType(): string | undefined { return this._pastureType; }
  get pastureCondition(): PastureCondition | undefined { return this._pastureCondition; }
  get lastSeedingDate(): Date | undefined { return this._lastSeedingDate; }
  get recommendedRestDays(): number | undefined { return this._recommendedRestDays; }
  get lastEntryDate(): Date | undefined { return this._lastEntryDate; }
  get location(): Record<string, unknown> | undefined { return this._location; }
  get hasWater(): boolean { return this._hasWater; }
  get hasShade(): boolean { return this._hasShade; }
  get farmId(): UniqueId { return this._farmId; }
  get observations(): string | undefined { return this._observations; }
  get deletedAt(): Date | undefined { return this._deletedAt; }

  needsRest(): boolean {
    if (!this._lastEntryDate || !this._recommendedRestDays) return false;
    const daysSinceEntry = Math.floor((new Date().getTime() - this._lastEntryDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceEntry < this._recommendedRestDays;
  }

  canReceiveAnimals(quantity: number): boolean {
    if (!this._maxCapacityAU) return true;
    return quantity <= this._maxCapacityAU;
  }

  updateCondition(newCondition: PastureCondition): void {
    this._pastureCondition = newCondition;
    this.touch();
  }

  registerEntry(): void {
    this._lastEntryDate = new Date();
    this.touch();
  }
}
