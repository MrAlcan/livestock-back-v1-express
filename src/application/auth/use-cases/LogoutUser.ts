import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IRefreshTokenRepository } from '../../../domain/auth/repositories/IRefreshTokenRepository';
import { IUseCase } from '../../shared/types/IUseCase';

interface LogoutUserInput {
  readonly userId: string;
}

export class LogoutUser implements IUseCase<LogoutUserInput, void> {
  constructor(
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(input: LogoutUserInput): Promise<Result<void>> {
    try {
      const userId = new UniqueId(input.userId);
      await this.refreshTokenRepository.revokeAllByUser(userId);
      return Result.ok<void>();
    } catch (error) {
      return Result.fail<void>(
        error instanceof Error ? error.message : 'Failed to logout user',
      );
    }
  }
}
