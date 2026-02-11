import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IUserRepository } from '../../../domain/auth/repositories/IUserRepository';
import { IRoleRepository } from '../../../domain/auth/repositories/IRoleRepository';
import { UserNotFoundError, RoleNotFoundError } from '../../../domain/auth/errors';
import { IUseCase } from '../../shared/types/IUseCase';

interface AssignRoleToUserInput {
  readonly userId: string;
  readonly roleId: number;
}

export class AssignRoleToUser implements IUseCase<AssignRoleToUserInput, void> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(input: AssignRoleToUserInput): Promise<Result<void>> {
    // Verify user exists
    const userId = new UniqueId(input.userId);
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return Result.fail<void>(
        new UserNotFoundError(input.userId).message,
      );
    }

    // Verify role exists
    const role = await this.roleRepository.findById(input.roleId);
    if (!role) {
      return Result.fail<void>(
        new RoleNotFoundError(input.roleId).message,
      );
    }

    await this.userRepository.assignRole(userId, input.roleId);

    return Result.ok<void>();
  }
}
