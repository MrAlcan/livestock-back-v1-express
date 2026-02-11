import { FinancialType } from '../enums';

interface FinancialCategoryProps {
  id: number;
  code: string;
  name: string;
  type?: FinancialType;
  parentId?: number;
  level?: number;
  description?: string;
  active: boolean;
}

export class FinancialCategory {
  private readonly _id: number;
  private _code: string;
  private _name: string;
  private _type?: FinancialType;
  private _parentId?: number;
  private _level?: number;
  private _description?: string;
  private _active: boolean;

  private constructor(props: FinancialCategoryProps) {
    this._id = props.id;
    this._code = props.code;
    this._name = props.name;
    this._type = props.type;
    this._parentId = props.parentId;
    this._level = props.level;
    this._description = props.description;
    this._active = props.active;
  }

  static create(props: FinancialCategoryProps): FinancialCategory {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Financial category code is required');
    }
    return new FinancialCategory(props);
  }

  get id(): number { return this._id; }
  get code(): string { return this._code; }
  get name(): string { return this._name; }
  get type(): FinancialType | undefined { return this._type; }
  get parentId(): number | undefined { return this._parentId; }
  get level(): number | undefined { return this._level; }
  get description(): string | undefined { return this._description; }
  get active(): boolean { return this._active; }

  hasParent(): boolean {
    return this._parentId !== undefined;
  }
}
