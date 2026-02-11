import { Entity, UniqueId } from '../../shared/Entity';

interface RationIngredientProps {
  rationId: UniqueId;
  productId: UniqueId;
  percentage: number;
  kgPerTon?: number;
  order?: number;
}

export class RationIngredient extends Entity<RationIngredientProps> {
  private readonly _rationId: UniqueId;
  private readonly _productId: UniqueId;
  private _percentage: number;
  private _kgPerTon?: number;
  private _order?: number;

  private constructor(props: RationIngredientProps, id?: UniqueId) {
    super(id);
    this._rationId = props.rationId;
    this._productId = props.productId;
    this._percentage = props.percentage;
    this._kgPerTon = props.kgPerTon;
    this._order = props.order;
  }

  static create(props: RationIngredientProps, id?: UniqueId): RationIngredient {
    if (props.percentage <= 0 || props.percentage > 100) {
      throw new Error('Percentage must be between 0 (exclusive) and 100 (inclusive)');
    }
    return new RationIngredient(props, id);
  }

  get rationId(): UniqueId { return this._rationId; }
  get productId(): UniqueId { return this._productId; }
  get percentage(): number { return this._percentage; }
  get kgPerTon(): number | undefined { return this._kgPerTon; }
  get order(): number | undefined { return this._order; }
}
