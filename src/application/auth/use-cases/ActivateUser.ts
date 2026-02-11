import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IUserRepository } from '../../../domain/auth/repositories/IUserRepository';
import { UserNotFoundError } from '../../../domain/auth/errors';
import { IUseCase } from '../../shared/types/IUseCase';

interface ActivateUserInput {
  readonly userId: string;
}

export class ActivateUser implements IUseCase<ActivateUserInput, void> {
  constructor(
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: ActivateUserInput): Promise<Result<void>> {
    const user = await this.userRepository.findById(new UniqueId(input.userId));
    if (!user) {
      return Result.fail<void>(
        new UserNotFoundError(input.userId).message,
      );
    }

    user.activate();
    await this.userRepository.update(user);

    return Result.ok<void>();
  }
}
