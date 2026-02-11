import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { User } from '../../../domain/auth/entities/User';
import { Email } from '../../../domain/auth/value-objects/Email';
import { Password } from '../../../domain/auth/value-objects/Password';
import { UserStatus } from '../../../domain/auth/enums/UserStatus';
import { IUserRepository } from '../../../domain/auth/repositories/IUserRepository';
import { UserAlreadyExistsError } from '../../../domain/auth/errors';
import { IUseCase } from '../../shared/types/IUseCase';
import { IPasswordHasher } from '../../shared/ports/IPasswordHasher';
import { RegisterUserInputDTO } from '../dtos/AuthDTOs';
import { UserResponseDTO } from '../dtos/AuthDTOs';
import { UserMapper } from '../mappers/UserMapper';

export class RegisterUser implements IUseCase<RegisterUserInputDTO, UserResponseDTO> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(input: RegisterUserInputDTO): Promise<Result<UserResponseDTO>> {
    // Validate password strength
    const passwordErrors = Password.validatePlainPassword(input.password);
    if (passwordErrors.length > 0) {
      return Result.fail<UserResponseDTO>(passwordErrors.join('; '));
    }

    // Check if user already exists
    let email: Email;
    try {
      email = Email.create(input.email);
    } catch (error) {
      return Result.fail<UserResponseDTO>(
        error instanceof Error ? error.message : 'Invalid email format',
      );
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      return Result.fail<UserResponseDTO>(
        new UserAlreadyExistsError(input.email).message,
      );
    }

    // Hash password
    const passwordHash = await this.passwordHasher.hash(input.password);

    // Create user entity
    const user = User.create({
      fullName: input.fullName,
      email,
      passwordHash,
      roleId: 0, // Default role, to be assigned later
      farmId: new UniqueId(), // Default farm, to be assigned later
      phone: input.phoneNumber,
      avatarUrl: input.avatarUrl,
      status: UserStatus.ACTIVE,
    });

    // Persist user
    const savedUser = await this.userRepository.create(user);

    return Result.ok<UserResponseDTO>(UserMapper.toDTO(savedUser));
  }
}
