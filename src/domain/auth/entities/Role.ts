interface RoleProps {
  id: number;
  code: string;
  name: string;
  description?: string;
  accessLevel: number;
  permissions: Record<string, unknown>;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Role {
  private readonly _id: number;
  private _code: string;
  private _name: string;
  private _description?: string;
  private _accessLevel: number;
  private _permissions: Record<string, unknown>;
  private readonly _isSystem: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: RoleProps) {
    this._id = props.id;
    this._code = props.code;
    this._name = props.name;
    this._description = props.description;
    this._accessLevel = props.accessLevel;
    this._permissions = props.permissions;
    this._isSystem = props.isSystem;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: RoleProps): Role {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('Role code is required');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Role name is required');
    }
    if (props.accessLevel < 0 || props.accessLevel > 100) {
      throw new Error('Access level must be between 0 and 100');
    }
    return new Role(props);
  }

  get id(): number { return this._id; }
  get code(): string { return this._code; }
  get name(): string { return this._name; }
  get description(): string | undefined { return this._description; }
  get accessLevel(): number { return this._accessLevel; }
  get permissions(): Record<string, unknown> { return { ...this._permissions }; }
  get isSystem(): boolean { return this._isSystem; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  hasPermission(permission: string): boolean {
    return permission in this._permissions;
  }

  canBeDeleted(): boolean {
    return !this._isSystem;
  }
}
