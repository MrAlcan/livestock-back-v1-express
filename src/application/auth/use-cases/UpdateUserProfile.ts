import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { User } from '../../../domain/auth/entities/User';
import { IUserRepository } from '../../../domain/auth/repositories/IUserRepository';
import { UserNotFoundError } from '../../../domain/auth/errors';
import { IUseCase } from '../../shared/types/IUseCase';
import { UpdateUserProfileInputDTO, UserResponseDTO } from '../dtos/AuthDTOs';
import { UserMapper } from '../mappers/UserMapper';

export class UpdateUserProfile implements IUseCase<UpdateUserProfileInputDTO, UserResponseDTO> {
  constructor(
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: UpdateUserProfileInputDTO): Promise<Result<UserResponseDTO>> {
    const user = await this.userRepository.findById(new UniqueId(input.userId));
    if (!user) {
      return Result.fail<UserResponseDTO>(
        new UserNotFoundError(input.userId).message,
      );
    }

    // Rebuild user with updated fields.
    // Since the User entity uses private fields with getters and no setters
    // for profile fields, we recreate with updated props.
    const updatedUser = User.create(
      {
        fullName: input.fullName ?? user.fullName,
        email: user.email,
        passwordHash: user.passwordHash,
        roleId: user.roleId,
        farmId: user.farmId,
        phone: input.phone !== undefined ? input.phone : user.phone,
        avatarUrl: input.avatarUrl !== undefined ? input.avatarUrl : user.avatarUrl,
        status: user.status,
        lastAccess: user.lastAccess,
        lastAccessIp: user.lastAccessIp,
        preferences: input.preferences !== undefined ? input.preferences : user.preferences,
        recoveryToken: user.recoveryToken,
        tokenExpiration: user.tokenExpiration,
        deletedAt: user.deletedAt,
      },
      user.id,
      user.createdAt,
      new Date(),
    );

    const savedUser = await this.userRepository.update(updatedUser);

    return Result.ok<UserResponseDTO>(UserMapper.toDTO(savedUser));
  }
}
