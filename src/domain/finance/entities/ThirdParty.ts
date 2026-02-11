import { AggregateRoot } from '../../shared/AggregateRoot';
import { UniqueId } from '../../shared/Entity';
import { IDType } from '../enums';

interface ThirdPartyProps {
  code?: string;
  name: string;
  tradeName?: string;
  type: string;
  subtype?: string;
  taxId?: string;
  idType?: IDType;
  rtaCode?: string;
  rtaExpiration?: Date;
  address?: string;
  location?: Record<string, unknown>;
  phone?: string;
  email?: string;
  contactPerson?: string;
  website?: string;
  rating?: number;
  creditDays?: number;
  creditLimit?: number;
  currentBalance?: number;
  active: boolean;
  observations?: string;
  deletedAt?: Date;
}

export class ThirdParty extends AggregateRoot<ThirdPartyProps> {
  private _code?: string;
  private _name: string;
  private _tradeName?: string;
  private readonly _type: string;
  private _subtype?: string;
  private _taxId?: string;
  private _idType?: IDType;
  private _rtaCode?: string;
  private _rtaExpiration?: Date;
  private _address?: string;
  private _location?: Record<string, unknown>;
  private _phone?: string;
  private _email?: string;
  private _contactPerson?: string;
  private _website?: string;
  private _rating?: number;
  private _creditDays?: number;
  private _creditLimit?: number;
  private _currentBalance: number;
  private _active: boolean;
  private _observations?: string;
  private _deletedAt?: Date;

  private constructor(props: ThirdPartyProps, id?: UniqueId, createdAt?: Date, updatedAt?: Date) {
    super(id, createdAt, updatedAt);
    this._code = props.code;
    this._name = props.name;
    this._tradeName = props.tradeName;
    this._type = props.type;
    this._subtype = props.subtype;
    this._taxId = props.taxId;
    this._idType = props.idType;
    this._rtaCode = props.rtaCode;
    this._rtaExpiration = props.rtaExpiration;
    this._address = props.address;
    this._location = props.location;
    this._phone = props.phone;
    this._email = props.email;
    this._contactPerson = props.contactPerson;
    this._website = props.website;
    this._rating = props.rating;
    this._creditDays = props.creditDays;
    this._creditLimit = props.creditLimit;
    this._currentBalance = props.currentBalance ?? 0;
    this._active = props.active;
    this._observations = props.observations;
    this._deletedAt = props.deletedAt;
  }

  static create(props: ThirdPartyProps, id?: UniqueId, createdAt?: Date, updatedAt?: Date): ThirdParty {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Third party name is required');
    }
    if (props.rating !== undefined && (props.rating < 0 || props.rating > 5)) {
      throw new Error('Rating must be between 0 and 5');
    }
    if (props.type === 'transportista' && !props.rtaCode) {
      throw new Error('Transporters must have an RTA code');
    }
    return new ThirdParty(props, id, createdAt, updatedAt);
  }

  get code(): string | undefined { return this._code; }
  get name(): string { return this._name; }
  get tradeName(): string | undefined { return this._tradeName; }
  get type(): string { return this._type; }
  get subtype(): string | undefined { return this._subtype; }
  get taxId(): string | undefined { return this._taxId; }
  get idType(): IDType | undefined { return this._idType; }
  get rtaCode(): string | undefined { return this._rtaCode; }
  get rtaExpiration(): Date | undefined { return this._rtaExpiration; }
  get address(): string | undefined { return this._address; }
  get location(): Record<string, unknown> | undefined { return this._location; }
  get phone(): string | undefined { return this._phone; }
  get email(): string | undefined { return this._email; }
  get contactPerson(): string | undefined { return this._contactPerson; }
  get website(): string | undefined { return this._website; }
  get rating(): number | undefined { return this._rating; }
  get creditDays(): number | undefined { return this._creditDays; }
  get creditLimit(): number | undefined { return this._creditLimit; }
  get currentBalance(): number { return this._currentBalance; }
  get active(): boolean { return this._active; }
  get observations(): string | undefined { return this._observations; }
  get deletedAt(): Date | undefined { return this._deletedAt; }

  isSupplier(): boolean { return this._type === 'proveedor'; }
  isCustomer(): boolean { return this._type === 'cliente'; }
  isTransporter(): boolean { return this._type === 'transportista'; }

  hasRTAValid(): boolean {
    if (!this._rtaCode || !this._rtaExpiration) return false;
    return new Date() < this._rtaExpiration;
  }

  updateBalance(amount: number): void {
    this._currentBalance += amount;
    this.touch();
  }

  hasExceededCreditLimit(): boolean {
    if (!this._creditLimit) return false;
    return this._currentBalance > this._creditLimit;
  }
}
