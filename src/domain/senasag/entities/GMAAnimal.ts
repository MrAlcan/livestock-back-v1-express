import { UniqueId } from '../../shared/Entity';
import { Weight } from '../../animals/value-objects/Weight';

interface GMAAnimalProps {
  gmaId: UniqueId;
  animalId: UniqueId;
  departureWeight?: Weight;
  arrivalWeight?: Weight;
  departureStatus?: string;
  arrivalStatus?: string;
  observations?: string;
}

export class GMAAnimal {
  private readonly _gmaId: UniqueId;
  private readonly _animalId: UniqueId;
  private _departureWeight?: Weight;
  private _arrivalWeight?: Weight;
  private _departureStatus?: string;
  private _arrivalStatus?: string;
  private _observations?: string;

  private constructor(props: GMAAnimalProps) {
    this._gmaId = props.gmaId;
    this._animalId = props.animalId;
    this._departureWeight = props.departureWeight;
    this._arrivalWeight = props.arrivalWeight;
    this._departureStatus = props.departureStatus;
    this._arrivalStatus = props.arrivalStatus;
    this._observations = props.observations;
  }

  static create(props: GMAAnimalProps): GMAAnimal {
    return new GMAAnimal(props);
  }

  get gmaId(): UniqueId { return this._gmaId; }
  get animalId(): UniqueId { return this._animalId; }
  get departureWeight(): Weight | undefined { return this._departureWeight; }
  get arrivalWeight(): Weight | undefined { return this._arrivalWeight; }
  get departureStatus(): string | undefined { return this._departureStatus; }
  get arrivalStatus(): string | undefined { return this._arrivalStatus; }
  get observations(): string | undefined { return this._observations; }

  calculateWeightLoss(): number | null {
    if (!this._departureWeight || !this._arrivalWeight) return null;
    return this._departureWeight.kilograms - this._arrivalWeight.kilograms;
  }
}
