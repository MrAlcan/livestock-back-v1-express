interface EventTypeProps {
  code: string;
  name: string;
  category: string;
  description?: string;
  requiresDetail?: string;
  isSystem: boolean;
  active: boolean;
  icon?: string;
  color?: string;
  createdAt: Date;
}

export class EventType {
  private readonly _code: string;
  private _name: string;
  private _category: string;
  private _description?: string;
  private _requiresDetail?: string;
  private readonly _isSystem: boolean;
  private _active: boolean;
  private _icon?: string;
  private _color?: string;
  private readonly _createdAt: Date;

  private constructor(props: EventTypeProps) {
    this._code = props.code;
    this._name = props.name;
    this._category = props.category;
    this._description = props.description;
    this._requiresDetail = props.requiresDetail;
    this._isSystem = props.isSystem;
    this._active = props.active;
    this._icon = props.icon;
    this._color = props.color;
    this._createdAt = props.createdAt;
  }

  static create(props: EventTypeProps): EventType {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('EventType code is required');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('EventType name is required');
    }
    return new EventType(props);
  }

  get code(): string { return this._code; }
  get name(): string { return this._name; }
  get category(): string { return this._category; }
  get description(): string | undefined { return this._description; }
  get requiresDetail(): string | undefined { return this._requiresDetail; }
  get isSystem(): boolean { return this._isSystem; }
  get active(): boolean { return this._active; }
  get icon(): string | undefined { return this._icon; }
  get color(): string | undefined { return this._color; }
  get createdAt(): Date { return this._createdAt; }

  requiresDetailTable(): boolean {
    return this._requiresDetail !== undefined && this._requiresDetail !== null;
  }
}
