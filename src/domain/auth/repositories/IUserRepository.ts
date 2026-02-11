import { UniqueId } from '../../shared/Entity';
import { Pagination } from '../../shared/Pagination';
import { User } from '../entities/User';
import { Email } from '../value-objects/Email';

export interface UserFilters {
  readonly status?: string;
  readonly farmId?: string;
  readonly roleId?: number;
  readonly search?: string;
}

export interface IUserRepository {
  findById(id: UniqueId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findAll(filters: UserFilters, pagination: Pagination): Promise<User[]>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: UniqueId): Promise<void>;
  assignRole(userId: UniqueId, roleId: number): Promise<void>;
  removeRole(userId: UniqueId, roleId: number): Promise<void>;
}
