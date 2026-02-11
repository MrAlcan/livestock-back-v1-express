import { Result } from '../../../domain/shared/Result';
import { IRoleRepository } from '../../../domain/auth/repositories/IRoleRepository';
import { RoleNotFoundError } from '../../../domain/auth/errors';
import { IUseCase } from '../../shared/types/IUseCase';

interface DeleteRoleInput {
  readonly roleId: number;
}

export class DeleteRole implements IUseCase<DeleteRoleInput, void> {
  constructor(
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(input: DeleteRoleInput): Promise<Result<void>> {
    const role = await this.roleRepository.findById(input.roleId);
    if (!role) {
      return Result.fail<void>(
        new RoleNotFoundError(input.roleId).message,
      );
    }

    if (!role.canBeDeleted()) {
      return Result.fail<void>(
        'Cannot delete a system role',
      );
    }

    await this.roleRepository.delete(input.roleId);

    return Result.ok<void>();
  }
}
