import { BreedAptitude } from '../enums';

interface BreedProps {
  id: number;
  code: string;
  name: string;
  description?: string;
  origin?: string;
  averageAdultWeight?: number;
  aptitude?: BreedAptitude;
  active: boolean;
  createdAt: Date;
}

export class Breed {
  private readonly _id: number;
  private _code: string;
  private _name: string;
  private _description?: string;
  private _origin?: string;
  private _averageAdultWeight?: number;
  private _aptitude?: BreedAptitude;
  private _active: boolean;
  private readonly _createdAt: Date;

  private constructor(props: BreedProps) {
    this._id = props.id;
    this._code = props.code;
    this._name = props.name;
    this._description = props.description;
    this._origin = props.origin;
    this._averageAdultWeight = props.averageAdultWeight;
    this._aptitude = props.aptitude;
    this._active = props.active;
    this._createdAt = props.createdAt;
  }

  static create(props: BreedProps): Breed {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Breed code is required');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Breed name is required');
    }
    return new Breed(props);
  }

  get id(): number { return this._id; }
  get code(): string { return this._code; }
  get name(): string { return this._name; }
  get description(): string | undefined { return this._description; }
  get origin(): string | undefined { return this._origin; }
  get averageAdultWeight(): number | undefined { return this._averageAdultWeight; }
  get aptitude(): BreedAptitude | undefined { return this._aptitude; }
  get active(): boolean { return this._active; }
  get createdAt(): Date { return this._createdAt; }

  isForMeat(): boolean {
    return this._aptitude === BreedAptitude.MEAT;
  }

  isForMilk(): boolean {
    return this._aptitude === BreedAptitude.MILK;
  }

  isDualPurpose(): boolean {
    return this._aptitude === BreedAptitude.DUAL_PURPOSE;
  }
}
