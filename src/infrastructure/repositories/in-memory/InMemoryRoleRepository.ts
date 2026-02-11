import { IRoleRepository } from '../../../domain/auth/repositories/IRoleRepository';
import { Role } from '../../../domain/auth/entities/Role';

export class InMemoryRoleRepository implements IRoleRepository {
  private items: Map<number, Role> = new Map();

  async findById(id: number): Promise<Role | null> {
    return this.items.get(id) ?? null;
  }

  async findByCode(code: string): Promise<Role | null> {
    const all = Array.from(this.items.values());
    return all.find((r) => r.code === code) ?? null;
  }

  async findAll(): Promise<Role[]> {
    return Array.from(this.items.values());
  }

  async create(role: Role): Promise<Role> {
    this.items.set(role.id, role);
    return role;
  }

  async update(role: Role): Promise<Role> {
    this.items.set(role.id, role);
    return role;
  }

  async delete(id: number): Promise<void> {
    this.items.delete(id);
  }

  // Test helpers
  clear(): void {
    this.items.clear();
  }

  getAll(): Role[] {
    return Array.from(this.items.values());
  }
}
