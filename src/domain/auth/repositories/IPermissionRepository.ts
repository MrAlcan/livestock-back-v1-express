import { Permission } from '../entities/Permission';

export interface IPermissionRepository {
  findById(id: number): Promise<Permission | null>;
  findByCode(code: string): Promise<Permission | null>;
  findByModule(module: string): Promise<Permission[]>;
  findAll(): Promise<Permission[]>;
  create(permission: Permission): Promise<Permission>;
  update(permission: Permission): Promise<Permission>;
  delete(id: number): Promise<void>;
}
