import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export class UniqueId {
  private readonly _value: string;

  constructor(value?: string) {
    if (value) {
      if (!uuidValidate(value)) {
        throw new Error(`Invalid UUID: ${value}`);
      }
      this._value = value;
    } else {
      this._value = uuidv4();
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: UniqueId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static generate(): UniqueId {
    return new UniqueId();
  }

  static isValid(value: string): boolean {
    return uuidValidate(value);
  }
}

export abstract class Entity<T> {
  protected readonly _id: UniqueId;
  protected _createdAt: Date;
  protected _updatedAt: Date;

  constructor(id?: UniqueId, createdAt?: Date, updatedAt?: Date) {
    this._id = id ?? UniqueId.generate();
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
  }

  get id(): UniqueId {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  protected touch(): void {
    this._updatedAt = new Date();
  }

  equals(other: Entity<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    return this._id.equals(other._id);
  }
}
