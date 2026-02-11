import { Result } from '../../../domain/shared/Result';
import { IRoleRepository } from '../../../domain/auth/repositories/IRoleRepository';
import { IPermissionRepository } from '../../../domain/auth/repositories/IPermissionRepository';
import { RoleNotFoundError } from '../../../domain/auth/errors';
import { IUseCase } from '../../shared/types/IUseCase';
import { RoleResponseDTO } from '../dtos/AuthDTOs';
import { RoleMapper } from '../mappers/RoleMapper';
import { Permission } from '../../../domain/auth/entities/Permission';

interface GetRoleDetailsInput {
  readonly roleId: number;
}

export class GetRoleDetails implements IUseCase<GetRoleDetailsInput, RoleResponseDTO> {
  constructor(
    private readonly roleRepository: IRoleRepository,
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(input: GetRoleDetailsInput): Promise<Result<RoleResponseDTO>> {
    const role = await this.roleRepository.findById(input.roleId);
    if (!role) {
      return Result.fail<RoleResponseDTO>(
        new RoleNotFoundError(input.roleId).message,
      );
    }

    // Resolve permissions from the role's permissions record
    const permissionCodes = Object.keys(role.permissions);
    const permissions: Permission[] = [];

    for (const code of permissionCodes) {
      const permission = await this.permissionRepository.findByCode(code);
      if (permission) {
        permissions.push(permission);
      }
    }

    return Result.ok<RoleResponseDTO>(RoleMapper.toDTO(role, permissions));
  }
}
