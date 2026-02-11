import { Result } from '../../../domain/shared/Result';
import { Role } from '../../../domain/auth/entities/Role';
import { IRoleRepository } from '../../../domain/auth/repositories/IRoleRepository';
import { IPermissionRepository } from '../../../domain/auth/repositories/IPermissionRepository';
import { RoleNotFoundError } from '../../../domain/auth/errors';
import { IUseCase } from '../../shared/types/IUseCase';
import { UpdateRoleInputDTO, RoleResponseDTO } from '../dtos/AuthDTOs';
import { RoleMapper } from '../mappers/RoleMapper';
import { Permission } from '../../../domain/auth/entities/Permission';

export class UpdateRole implements IUseCase<UpdateRoleInputDTO, RoleResponseDTO> {
  constructor(
    private readonly roleRepository: IRoleRepository,
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(input: UpdateRoleInputDTO): Promise<Result<RoleResponseDTO>> {
    // Find existing role
    const existingRole = await this.roleRepository.findById(input.id);
    if (!existingRole) {
      return Result.fail<RoleResponseDTO>(
        new RoleNotFoundError(input.id).message,
      );
    }

    // If code is being changed, check uniqueness
    if (input.code && input.code !== existingRole.code) {
      const roleWithCode = await this.roleRepository.findByCode(input.code);
      if (roleWithCode) {
        return Result.fail<RoleResponseDTO>(
          `Role with code "${input.code}" already exists`,
        );
      }
    }

    // Resolve permissions if being updated
    let permissions: Permission[] = [];
    let permissionsRecord = existingRole.permissions;

    if (input.permissionIds !== undefined) {
      permissions = [];
      permissionsRecord = {};
      for (const permissionId of input.permissionIds) {
        const permission = await this.permissionRepository.findById(permissionId);
        if (!permission) {
          return Result.fail<RoleResponseDTO>(
            `Permission with id ${permissionId} not found`,
          );
        }
        permissions.push(permission);
        permissionsRecord[permission.code] = true;
      }
    }

    // Rebuild role with updated props
    const updatedRole = Role.create({
      id: existingRole.id,
      code: input.code ?? existingRole.code,
      name: input.name ?? existingRole.name,
      description: input.description !== undefined ? input.description : existingRole.description,
      accessLevel: existingRole.accessLevel,
      permissions: permissionsRecord,
      isSystem: existingRole.isSystem,
      createdAt: existingRole.createdAt,
      updatedAt: new Date(),
    });

    const savedRole = await this.roleRepository.update(updatedRole);

    return Result.ok<RoleResponseDTO>(RoleMapper.toDTO(savedRole, permissions));
  }
}
