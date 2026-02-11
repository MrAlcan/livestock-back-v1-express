import { Entity, UniqueId } from '../../shared/Entity';
import { RelationType } from '../enums';

interface GenealogyProps {
  animalId: UniqueId;
  ancestorId: UniqueId;
  relationType: RelationType;
  generation: number;
  inbreedingCoefficient?: number;
}

export class Genealogy extends Entity<GenealogyProps> {
  private readonly _animalId: UniqueId;
  private readonly _ancestorId: UniqueId;
  private readonly _relationType: RelationType;
  private readonly _generation: number;
  private _inbreedingCoefficient?: number;

  private constructor(props: GenealogyProps, id?: UniqueId, createdAt?: Date) {
    super(id, createdAt);
    this._animalId = props.animalId;
    this._ancestorId = props.ancestorId;
    this._relationType = props.relationType;
    this._generation = props.generation;
    this._inbreedingCoefficient = props.inbreedingCoefficient;
  }

  static create(props: GenealogyProps, id?: UniqueId, createdAt?: Date): Genealogy {
    if (props.animalId.equals(props.ancestorId)) {
      throw new Error('An animal cannot be an ancestor of itself');
    }
    if (props.generation < 1) {
      throw new Error('Generation must be >= 1');
    }
    return new Genealogy(props, id, createdAt);
  }

  get animalId(): UniqueId { return this._animalId; }
  get ancestorId(): UniqueId { return this._ancestorId; }
  get relationType(): RelationType { return this._relationType; }
  get generation(): number { return this._generation; }
  get inbreedingCoefficient(): number | undefined { return this._inbreedingCoefficient; }

  isDirectParent(): boolean {
    return this._generation === 1;
  }

  isGrandparent(): boolean {
    return this._generation === 2;
  }
}
