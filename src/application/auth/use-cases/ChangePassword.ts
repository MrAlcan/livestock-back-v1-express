import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { Password } from '../../../domain/auth/value-objects/Password';
import { IUserRepository } from '../../../domain/auth/repositories/IUserRepository';
import { UserNotFoundError, InvalidCredentialsError } from '../../../domain/auth/errors';
import { IUseCase } from '../../shared/types/IUseCase';
import { IPasswordHasher } from '../../shared/ports/IPasswordHasher';
import { ChangePasswordInputDTO } from '../dtos/AuthDTOs';

export class ChangePassword implements IUseCase<ChangePasswordInputDTO, void> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(input: ChangePasswordInputDTO): Promise<Result<void>> {
    // Validate new password strength
    const passwordErrors = Password.validatePlainPassword(input.newPassword);
    if (passwordErrors.length > 0) {
      return Result.fail<void>(passwordErrors.join('; '));
    }

    // Find user
    const userId = new UniqueId(input.userId);
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return Result.fail<void>(
        new UserNotFoundError(input.userId).message,
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await this.passwordHasher.compare(
      input.currentPassword,
      user.passwordHash,
    );
    if (!isCurrentPasswordValid) {
      return Result.fail<void>(
        new InvalidCredentialsError().message,
      );
    }

    // Hash and set new password
    const newPasswordHash = await this.passwordHasher.hash(input.newPassword);
    user.changePassword(newPasswordHash);

    await this.userRepository.update(user);

    return Result.ok<void>();
  }
}
