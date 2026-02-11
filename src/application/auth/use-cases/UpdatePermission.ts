import { Result } from '../../../domain/shared/Result';
import { Permission } from '../../../domain/auth/entities/Permission';
import { IPermissionRepository } from '../../../domain/auth/repositories/IPermissionRepository';
import { PermissionNotFoundError } from '../../../domain/auth/errors';
import { IUseCase } from '../../shared/types/IUseCase';
import { UpdatePermissionInputDTO, PermissionResponseDTO } from '../dtos/AuthDTOs';
import { PermissionMapper } from '../mappers/PermissionMapper';

export class UpdatePermission implements IUseCase<UpdatePermissionInputDTO, PermissionResponseDTO> {
  constructor(
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(input: UpdatePermissionInputDTO): Promise<Result<PermissionResponseDTO>> {
    // Find existing permission
    const existingPermission = await this.permissionRepository.findById(input.id);
    if (!existingPermission) {
      return Result.fail<PermissionResponseDTO>(
        new PermissionNotFoundError(input.id).message,
      );
    }

    // If code is being changed, check uniqueness
    const newCode = input.code ?? existingPermission.code;
    if (input.code && input.code !== existingPermission.code) {
      const permissionWithCode = await this.permissionRepository.findByCode(input.code);
      if (permissionWithCode) {
        return Result.fail<PermissionResponseDTO>(
          `Permission with code "${input.code}" already exists`,
        );
      }
    }

    // Rebuild permission with updated props
    let updatedPermission: Permission;
    try {
      updatedPermission = Permission.create({
        id: existingPermission.id,
        code: newCode,
        module: input.module ?? existingPermission.module,
        action: input.action ?? existingPermission.action,
        description: input.description !== undefined ? input.description : existingPermission.description,
        createdAt: existingPermission.createdAt,
      });
    } catch (error) {
      return Result.fail<PermissionResponseDTO>(
        error instanceof Error ? error.message : 'Invalid permission data',
      );
    }

    const savedPermission = await this.permissionRepository.update(updatedPermission);

    return Result.ok<PermissionResponseDTO>(PermissionMapper.toDTO(savedPermission));
  }
}
