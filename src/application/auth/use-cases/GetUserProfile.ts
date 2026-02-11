import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IUserRepository } from '../../../domain/auth/repositories/IUserRepository';
import { UserNotFoundError } from '../../../domain/auth/errors';
import { IUseCase } from '../../shared/types/IUseCase';
import { UserResponseDTO } from '../dtos/AuthDTOs';
import { UserMapper } from '../mappers/UserMapper';

interface GetUserProfileInput {
  readonly userId: string;
}

export class GetUserProfile implements IUseCase<GetUserProfileInput, UserResponseDTO> {
  constructor(
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: GetUserProfileInput): Promise<Result<UserResponseDTO>> {
    const user = await this.userRepository.findById(new UniqueId(input.userId));
    if (!user) {
      return Result.fail<UserResponseDTO>(
        new UserNotFoundError(input.userId).message,
      );
    }

    return Result.ok<UserResponseDTO>(UserMapper.toDTO(user));
  }
}
