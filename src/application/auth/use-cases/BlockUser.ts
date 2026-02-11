import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IUserRepository } from '../../../domain/auth/repositories/IUserRepository';
import { UserNotFoundError } from '../../../domain/auth/errors';
import { IUseCase } from '../../shared/types/IUseCase';

interface BlockUserInput {
  readonly userId: string;
}

export class BlockUser implements IUseCase<BlockUserInput, void> {
  constructor(
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: BlockUserInput): Promise<Result<void>> {
    const user = await this.userRepository.findById(new UniqueId(input.userId));
    if (!user) {
      return Result.fail<void>(
        new UserNotFoundError(input.userId).message,
      );
    }

    user.block();
    await this.userRepository.update(user);

    return Result.ok<void>();
  }
}
