import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { Password } from '../../../domain/auth/value-objects/Password';
import { IUserRepository } from '../../../domain/auth/repositories/IUserRepository';
import { InvalidTokenError } from '../../../domain/auth/errors';
import { IUseCase } from '../../shared/types/IUseCase';
import { IPasswordHasher } from '../../shared/ports/IPasswordHasher';
import { ResetPasswordConfirmInputDTO } from '../dtos/AuthDTOs';

/**
 * Confirms a password reset using a recovery token.
 *
 * Since IUserRepository does not provide a findByRecoveryToken method,
 * this use case expects an extended input that includes the userId.
 * The infrastructure/controller layer is responsible for resolving the
 * user from the recovery token before calling this use case.
 */
export class ResetPasswordConfirm implements IUseCase<ResetPasswordConfirmInputDTO & { userId: string }, void> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(input: ResetPasswordConfirmInputDTO & { userId: string }): Promise<Result<void>> {
    // Validate new password strength
    const passwordErrors = Password.validatePlainPassword(input.newPassword);
    if (passwordErrors.length > 0) {
      return Result.fail<void>(passwordErrors.join('; '));
    }

    // Find user
    const user = await this.userRepository.findById(new UniqueId(input.userId));
    if (!user) {
      return Result.fail<void>(new InvalidTokenError().message);
    }

    // Validate recovery token
    if (!user.recoveryToken || user.recoveryToken !== input.token) {
      return Result.fail<void>(new InvalidTokenError().message);
    }

    // Check token expiration
    if (!user.tokenExpiration || user.tokenExpiration < new Date()) {
      return Result.fail<void>(new InvalidTokenError().message);
    }

    // Hash and set new password (also clears recovery token)
    const newPasswordHash = await this.passwordHasher.hash(input.newPassword);
    user.changePassword(newPasswordHash);

    await this.userRepository.update(user);

    return Result.ok<void>();
  }
}
