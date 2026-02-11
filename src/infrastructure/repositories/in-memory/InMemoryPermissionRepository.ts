import { IPermissionRepository } from '../../../domain/auth/repositories/IPermissionRepository';
import { Permission } from '../../../domain/auth/entities/Permission';

export class InMemoryPermissionRepository implements IPermissionRepository {
  private items: Map<number, Permission> = new Map();

  async findById(id: number): Promise<Permission | null> {
    return this.items.get(id) ?? null;
  }

  async findByCode(code: string): Promise<Permission | null> {
    const all = Array.from(this.items.values());
    return all.find((p) => p.code === code) ?? null;
  }

  async findByModule(module: string): Promise<Permission[]> {
    return Array.from(this.items.values()).filter((p) => p.module === module);
  }

  async findAll(): Promise<Permission[]> {
    return Array.from(this.items.values());
  }

  async create(permission: Permission): Promise<Permission> {
    this.items.set(permission.id, permission);
    return permission;
  }

  async update(permission: Permission): Promise<Permission> {
    this.items.set(permission.id, permission);
    return permission;
  }

  async delete(id: number): Promise<void> {
    this.items.delete(id);
  }

  // Test helpers
  clear(): void {
    this.items.clear();
  }

  getAll(): Permission[] {
    return Array.from(this.items.values());
  }
}
