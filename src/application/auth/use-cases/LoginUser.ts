import { Result } from '../../../domain/shared/Result';
import { Email } from '../../../domain/auth/value-objects/Email';
import { UserStatus } from '../../../domain/auth/enums/UserStatus';
import { IUserRepository } from '../../../domain/auth/repositories/IUserRepository';
import { IRefreshTokenRepository } from '../../../domain/auth/repositories/IRefreshTokenRepository';
import { RefreshToken } from '../../../domain/auth/entities/RefreshToken';
import { InvalidCredentialsError, AccountBlockedError } from '../../../domain/auth/errors';
import { IUseCase } from '../../shared/types/IUseCase';
import { IPasswordHasher } from '../../shared/ports/IPasswordHasher';
import { IJwtService, JwtPayload } from '../../shared/ports/IJwtService';
import { LoginInputDTO, LoginResponseDTO } from '../dtos/AuthDTOs';
import { UserMapper } from '../mappers/UserMapper';

export class LoginUser implements IUseCase<LoginInputDTO, LoginResponseDTO> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly jwtService: IJwtService,
  ) {}

  async execute(input: LoginInputDTO): Promise<Result<LoginResponseDTO>> {
    // Parse email
    let email: Email;
    try {
      email = Email.create(input.email);
    } catch (error) {
      return Result.fail<LoginResponseDTO>(
        new InvalidCredentialsError().message,
      );
    }

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return Result.fail<LoginResponseDTO>(
        new InvalidCredentialsError().message,
      );
    }

    // Check if account is blocked
    if (user.status === UserStatus.BLOCKED) {
      return Result.fail<LoginResponseDTO>(
        new AccountBlockedError().message,
      );
    }

    // Check if account is active
    if (!user.isActive()) {
      return Result.fail<LoginResponseDTO>(
        'Account is not active',
      );
    }

    // Verify password
    const isPasswordValid = await this.passwordHasher.compare(
      input.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      return Result.fail<LoginResponseDTO>(
        new InvalidCredentialsError().message,
      );
    }

    // Generate tokens
    const jwtPayload: JwtPayload = {
      userId: user.id.value,
      email: user.email.value,
      roleId: user.roleId,
      farmId: user.farmId.value,
    };

    const accessToken = this.jwtService.generateAccessToken(jwtPayload);
    const refreshToken = this.jwtService.generateRefreshToken(jwtPayload);
    const expiresIn = this.jwtService.getAccessTokenExpiration();

    // Store refresh token
    const refreshTokenExpiration = new Date();
    refreshTokenExpiration.setDate(refreshTokenExpiration.getDate() + 30); // 30 days

    const refreshTokenEntity = RefreshToken.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshTokenExpiration,
    });

    await this.refreshTokenRepository.create(refreshTokenEntity);

    // Update last access
    user.updateLastAccess(input.ipAddress ?? 'unknown');
    await this.userRepository.update(user);

    return Result.ok<LoginResponseDTO>({
      accessToken,
      refreshToken,
      expiresIn,
      user: UserMapper.toDTO(user),
    });
  }
}
