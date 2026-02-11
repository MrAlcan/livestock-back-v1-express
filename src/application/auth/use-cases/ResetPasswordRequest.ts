import { Result } from '../../../domain/shared/Result';
import { Email } from '../../../domain/auth/value-objects/Email';
import { IUserRepository } from '../../../domain/auth/repositories/IUserRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { IEmailService } from '../../shared/ports/IEmailService';
import { ResetPasswordRequestInputDTO } from '../dtos/AuthDTOs';
import { v4 as uuidv4 } from 'uuid';

export class ResetPasswordRequest implements IUseCase<ResetPasswordRequestInputDTO, void> {
  private static readonly TOKEN_EXPIRATION_HOURS = 24;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailService: IEmailService,
  ) {}

  async execute(input: ResetPasswordRequestInputDTO): Promise<Result<void>> {
    // Parse email
    let email: Email;
    try {
      email = Email.create(input.email);
    } catch (error) {
      return Result.fail<void>(
        error instanceof Error ? error.message : 'Invalid email format',
      );
    }

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return Result.ok<void>();
    }

    // Check if user is active
    if (!user.isActive()) {
      // Return success silently to prevent information leakage
      return Result.ok<void>();
    }

    // Generate recovery token and expiration
    const recoveryToken = uuidv4();
    const tokenExpiration = new Date();
    tokenExpiration.setHours(
      tokenExpiration.getHours() + ResetPasswordRequest.TOKEN_EXPIRATION_HOURS,
    );

    // Set recovery token on user
    user.setRecoveryToken(recoveryToken, tokenExpiration);
    await this.userRepository.update(user);

    // Send password reset email
    await this.emailService.sendPasswordReset(
      user.email.value,
      recoveryToken,
      user.fullName,
    );

    return Result.ok<void>();
  }
}
