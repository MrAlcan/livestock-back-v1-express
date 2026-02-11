import { Result } from '../../../domain/shared/Result';
import { IPermissionRepository } from '../../../domain/auth/repositories/IPermissionRepository';
import { PermissionNotFoundError } from '../../../domain/auth/errors';
import { IUseCase } from '../../shared/types/IUseCase';

interface DeletePermissionInput {
  readonly permissionId: number;
}

export class DeletePermission implements IUseCase<DeletePermissionInput, void> {
  constructor(
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(input: DeletePermissionInput): Promise<Result<void>> {
    const permission = await this.permissionRepository.findById(input.permissionId);
    if (!permission) {
      return Result.fail<void>(
        new PermissionNotFoundError(input.permissionId).message,
      );
    }

    await this.permissionRepository.delete(input.permissionId);

    return Result.ok<void>();
  }
}
