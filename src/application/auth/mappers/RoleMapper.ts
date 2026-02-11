import { Role } from '../../../domain/auth/entities/Role';
import { Permission } from '../../../domain/auth/entities/Permission';
import { RoleResponseDTO } from '../dtos/AuthDTOs';
import { PermissionMapper } from './PermissionMapper';

export class RoleMapper {
  static toDTO(role: Role, permissions: Permission[] = []): RoleResponseDTO {
    return {
      id: role.id,
      code: role.code,
      name: role.name,
      description: role.description,
      accessLevel: role.accessLevel,
      isSystem: role.isSystem,
      permissions: permissions.map((p) => PermissionMapper.toDTO(p)),
    };
  }
}
