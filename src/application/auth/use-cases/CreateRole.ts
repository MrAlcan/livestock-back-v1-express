import { Result } from '../../../domain/shared/Result';
import { Role } from '../../../domain/auth/entities/Role';
import { IRoleRepository } from '../../../domain/auth/repositories/IRoleRepository';
import { IPermissionRepository } from '../../../domain/auth/repositories/IPermissionRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { CreateRoleInputDTO, RoleResponseDTO } from '../dtos/AuthDTOs';
import { RoleMapper } from '../mappers/RoleMapper';

export class CreateRole implements IUseCase<CreateRoleInputDTO, RoleResponseDTO> {
  constructor(
    private readonly roleRepository: IRoleRepository,
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(input: CreateRoleInputDTO): Promise<Result<RoleResponseDTO>> {
    // Check if role code already exists
    const existingRole = await this.roleRepository.findByCode(input.code);
    if (existingRole) {
      return Result.fail<RoleResponseDTO>(
        `Role with code "${input.code}" already exists`,
      );
    }

    // Validate permissions exist
    const permissions = [];
    for (const permissionId of input.permissionIds) {
      const permission = await this.permissionRepository.findById(permissionId);
      if (!permission) {
        return Result.fail<RoleResponseDTO>(
          `Permission with id ${permissionId} not found`,
        );
      }
      permissions.push(permission);
    }

    // Build permissions record from the permission codes
    const permissionsRecord: Record<string, unknown> = {};
    for (const permission of permissions) {
      permissionsRecord[permission.code] = true;
    }

    // Create role entity
    const now = new Date();
    const role = Role.create({
      id: 0, // Will be assigned by the database
      code: input.code,
      name: input.name,
      description: input.description,
      accessLevel: 0,
      permissions: permissionsRecord,
      isSystem: false,
      createdAt: now,
      updatedAt: now,
    });

    const savedRole = await this.roleRepository.create(role);

    return Result.ok<RoleResponseDTO>(RoleMapper.toDTO(savedRole, permissions));
  }
}
