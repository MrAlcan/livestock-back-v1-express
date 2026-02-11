interface PermissionProps {
  id: number;
  code: string;
  module: string;
  action: string;
  description?: string;
  createdAt: Date;
}

export class Permission {
  private static readonly CODE_FORMAT = /^[a-z_]+:[a-z_]+$/;

  private readonly _id: number;
  private _code: string;
  private _module: string;
  private _action: string;
  private _description?: string;
  private readonly _createdAt: Date;

  private constructor(props: PermissionProps) {
    this._id = props.id;
    this._code = props.code;
    this._module = props.module;
    this._action = props.action;
    this._description = props.description;
    this._createdAt = props.createdAt;
  }

  static create(props: PermissionProps): Permission {
    if (!Permission.CODE_FORMAT.test(props.code)) {
      throw new Error(`Permission code must follow format "module:action", got: ${props.code}`);
    }
    return new Permission(props);
  }

  get id(): number { return this._id; }
  get code(): string { return this._code; }
  get module(): string { return this._module; }
  get action(): string { return this._action; }
  get description(): string | undefined { return this._description; }
  get createdAt(): Date { return this._createdAt; }

  belongsToModule(moduleName: string): boolean {
    return this._module === moduleName;
  }
}
