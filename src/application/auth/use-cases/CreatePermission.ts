import { Result } from '../../../domain/shared/Result';
import { Permission } from '../../../domain/auth/entities/Permission';
import { IPermissionRepository } from '../../../domain/auth/repositories/IPermissionRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { CreatePermissionInputDTO, PermissionResponseDTO } from '../dtos/AuthDTOs';
import { PermissionMapper } from '../mappers/PermissionMapper';

export class CreatePermission implements IUseCase<CreatePermissionInputDTO, PermissionResponseDTO> {
  constructor(
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(input: CreatePermissionInputDTO): Promise<Result<PermissionResponseDTO>> {
    // Check if permission code already exists
    const existingPermission = await this.permissionRepository.findByCode(input.code);
    if (existingPermission) {
      return Result.fail<PermissionResponseDTO>(
        `Permission with code "${input.code}" already exists`,
      );
    }

    // Create permission entity
    let permission: Permission;
    try {
      permission = Permission.create({
        id: 0, // Will be assigned by the database
        code: input.code,
        module: input.module,
        action: input.action,
        description: input.description,
        createdAt: new Date(),
      });
    } catch (error) {
      return Result.fail<PermissionResponseDTO>(
        error instanceof Error ? error.message : 'Invalid permission data',
      );
    }

    const savedPermission = await this.permissionRepository.create(permission);

    return Result.ok<PermissionResponseDTO>(PermissionMapper.toDTO(savedPermission));
  }
}
