import { Permission } from '../../../domain/auth/entities/Permission';
import { PermissionResponseDTO } from '../dtos/AuthDTOs';

export class PermissionMapper {
  static toDTO(permission: Permission): PermissionResponseDTO {
    return {
      id: permission.id,
      code: permission.code,
      module: permission.module,
      action: permission.action,
      description: permission.description,
    };
  }
}
