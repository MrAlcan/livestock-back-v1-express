import { AggregateRoot } from '../../shared/AggregateRoot';
import { UniqueId } from '../../shared/Entity';
import { RationType } from '../enums';

interface RationProps {
  code: string;
  name: string;
  type: RationType;
  farmId: UniqueId;
  description?: string;
  dryMatterPct?: number;
  proteinPct?: number;
  energyMcalKg?: number;
  costPerTon?: number;
  estimatedConversion?: number;
  active: boolean;
}

export class Ration extends AggregateRoot<RationProps> {
  private _code: string;
  private _name: string;
  private _type: RationType;
  private readonly _farmId: UniqueId;
  private _description?: string;
  private _dryMatterPct?: number;
  private _proteinPct?: number;
  private _energyMcalKg?: number;
  private _costPerTon?: number;
  private _estimatedConversion?: number;
  private _active: boolean;

  private constructor(props: RationProps, id?: UniqueId, createdAt?: Date, updatedAt?: Date) {
    super(id, createdAt, updatedAt);
    this._code = props.code;
    this._name = props.name;
    this._type = props.type;
    this._farmId = props.farmId;
    this._description = props.description;
    this._dryMatterPct = props.dryMatterPct;
    this._proteinPct = props.proteinPct;
    this._energyMcalKg = props.energyMcalKg;
    this._costPerTon = props.costPerTon;
    this._estimatedConversion = props.estimatedConversion;
    this._active = props.active;
  }

  static create(props: RationProps, id?: UniqueId, createdAt?: Date, updatedAt?: Date): Ration {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Ration code is required');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Ration name is required');
    }
    return new Ration(props, id, createdAt, updatedAt);
  }

  get code(): string { return this._code; }
  get name(): string { return this._name; }
  get type(): RationType { return this._type; }
  get farmId(): UniqueId { return this._farmId; }
  get description(): string | undefined { return this._description; }
  get dryMatterPct(): number | undefined { return this._dryMatterPct; }
  get proteinPct(): number | undefined { return this._proteinPct; }
  get energyMcalKg(): number | undefined { return this._energyMcalKg; }
  get costPerTon(): number | undefined { return this._costPerTon; }
  get estimatedConversion(): number | undefined { return this._estimatedConversion; }
  get active(): boolean { return this._active; }
}
