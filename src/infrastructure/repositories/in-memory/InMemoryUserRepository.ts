import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { IUserRepository, UserFilters } from '../../../domain/auth/repositories/IUserRepository';
import { User } from '../../../domain/auth/entities/User';
import { Email } from '../../../domain/auth/value-objects/Email';

export class InMemoryUserRepository implements IUserRepository {
  private items: Map<string, User> = new Map();
  private userRoles: Map<string, Set<number>> = new Map();

  async findById(id: UniqueId): Promise<User | null> {
    return this.items.get(id.value) ?? null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const all = Array.from(this.items.values());
    return all.find((u) => u.email.equals(email)) ?? null;
  }

  async findAll(filters: UserFilters, pagination: Pagination): Promise<User[]> {
    let result = Array.from(this.items.values());
    if (filters.status) {
      result = result.filter((u) => u.status === filters.status);
    }
    if (filters.farmId) {
      result = result.filter((u) => u.farmId.value === filters.farmId);
    }
    if (filters.roleId !== undefined) {
      result = result.filter((u) => u.roleId === filters.roleId);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (u) =>
          u.fullName.toLowerCase().includes(search) ||
          u.email.value.toLowerCase().includes(search),
      );
    }
    return result.slice(pagination.offset, pagination.offset + pagination.limit);
  }

  async create(user: User): Promise<User> {
    this.items.set(user.id.value, user);
    return user;
  }

  async update(user: User): Promise<User> {
    this.items.set(user.id.value, user);
    return user;
  }

  async delete(id: UniqueId): Promise<void> {
    this.items.delete(id.value);
    this.userRoles.delete(id.value);
  }

  async assignRole(userId: UniqueId, roleId: number): Promise<void> {
    const roles = this.userRoles.get(userId.value) ?? new Set();
    roles.add(roleId);
    this.userRoles.set(userId.value, roles);
  }

  async removeRole(userId: UniqueId, roleId: number): Promise<void> {
    const roles = this.userRoles.get(userId.value);
    if (roles) {
      roles.delete(roleId);
    }
  }

  // Test helpers
  clear(): void {
    this.items.clear();
    this.userRoles.clear();
  }

  getAll(): User[] {
    return Array.from(this.items.values());
  }
}
