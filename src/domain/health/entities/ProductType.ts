interface ProductTypeProps {
  code: string;
  name: string;
  parentCategory?: string;
  description?: string;
  requiresStockControl: boolean;
  requiresWithdrawal: boolean;
  defaultUnit?: string;
  active: boolean;
}

export class ProductType {
  private readonly _code: string;
  private _name: string;
  private _parentCategory?: string;
  private _description?: string;
  private _requiresStockControl: boolean;
  private _requiresWithdrawal: boolean;
  private _defaultUnit?: string;
  private _active: boolean;

  private constructor(props: ProductTypeProps) {
    this._code = props.code;
    this._name = props.name;
    this._parentCategory = props.parentCategory;
    this._description = props.description;
    this._requiresStockControl = props.requiresStockControl;
    this._requiresWithdrawal = props.requiresWithdrawal;
    this._defaultUnit = props.defaultUnit;
    this._active = props.active;
  }

  static create(props: ProductTypeProps): ProductType {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('ProductType code is required');
    }
    return new ProductType(props);
  }

  get code(): string { return this._code; }
  get name(): string { return this._name; }
  get parentCategory(): string | undefined { return this._parentCategory; }
  get description(): string | undefined { return this._description; }
  get requiresStockControl(): boolean { return this._requiresStockControl; }
  get requiresWithdrawal(): boolean { return this._requiresWithdrawal; }
  get defaultUnit(): string | undefined { return this._defaultUnit; }
  get active(): boolean { return this._active; }
}
