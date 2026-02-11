import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IUserRepository } from '../../../domain/auth/repositories/IUserRepository';
import { UserNotFoundError } from '../../../domain/auth/errors';
import { IUseCase } from '../../shared/types/IUseCase';

interface DeactivateUserInput {
  readonly userId: string;
}

export class DeactivateUser implements IUseCase<DeactivateUserInput, void> {
  constructor(
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: DeactivateUserInput): Promise<Result<void>> {
    const user = await this.userRepository.findById(new UniqueId(input.userId));
    if (!user) {
      return Result.fail<void>(
        new UserNotFoundError(input.userId).message,
      );
    }

    user.deactivate();
    await this.userRepository.update(user);

    return Result.ok<void>();
  }
}
