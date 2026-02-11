import { Result } from '../../../domain/shared/Result';
import { IPermissionRepository } from '../../../domain/auth/repositories/IPermissionRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { PermissionResponseDTO } from '../dtos/AuthDTOs';
import { PermissionMapper } from '../mappers/PermissionMapper';

interface ListPermissionsInput {
  readonly module?: string;
}

export class ListPermissions implements IUseCase<ListPermissionsInput, PermissionResponseDTO[]> {
  constructor(
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(input: ListPermissionsInput): Promise<Result<PermissionResponseDTO[]>> {
    let permissions;

    if (input.module) {
      permissions = await this.permissionRepository.findByModule(input.module);
    } else {
      permissions = await this.permissionRepository.findAll();
    }

    const permissionDTOs = permissions.map((p) => PermissionMapper.toDTO(p));

    return Result.ok<PermissionResponseDTO[]>(permissionDTOs);
  }
}
