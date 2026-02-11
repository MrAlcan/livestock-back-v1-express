import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { RefreshToken as RefreshTokenEntity } from '../../../domain/auth/entities/RefreshToken';
import { IUserRepository } from '../../../domain/auth/repositories/IUserRepository';
import { IRefreshTokenRepository } from '../../../domain/auth/repositories/IRefreshTokenRepository';
import { InvalidTokenError, UserNotFoundError } from '../../../domain/auth/errors';
import { IUseCase } from '../../shared/types/IUseCase';
import { IJwtService, JwtPayload } from '../../shared/ports/IJwtService';
import { RefreshTokenInputDTO, LoginResponseDTO } from '../dtos/AuthDTOs';
import { UserMapper } from '../mappers/UserMapper';

export class RefreshToken implements IUseCase<RefreshTokenInputDTO, LoginResponseDTO> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly jwtService: IJwtService,
  ) {}

  async execute(input: RefreshTokenInputDTO): Promise<Result<LoginResponseDTO>> {
    // Verify the refresh token JWT
    const payload = this.jwtService.verifyRefreshToken(input.refreshToken);
    if (!payload) {
      return Result.fail<LoginResponseDTO>(
        new InvalidTokenError().message,
      );
    }

    // Find the stored refresh token
    const storedToken = await this.refreshTokenRepository.findByToken(input.refreshToken);
    if (!storedToken || !storedToken.isValid()) {
      return Result.fail<LoginResponseDTO>(
        new InvalidTokenError().message,
      );
    }

    // Revoke the old refresh token
    await this.refreshTokenRepository.revoke(input.refreshToken);

    // Find the user
    const user = await this.userRepository.findById(new UniqueId(payload.userId));
    if (!user) {
      return Result.fail<LoginResponseDTO>(
        new UserNotFoundError(payload.userId).message,
      );
    }

    // Check user is still active
    if (!user.isActive()) {
      return Result.fail<LoginResponseDTO>('Account is not active');
    }

    // Generate new token pair
    const jwtPayload: JwtPayload = {
      userId: user.id.value,
      email: user.email.value,
      roleId: user.roleId,
      farmId: user.farmId.value,
    };

    const newAccessToken = this.jwtService.generateAccessToken(jwtPayload);
    const newRefreshToken = this.jwtService.generateRefreshToken(jwtPayload);
    const expiresIn = this.jwtService.getAccessTokenExpiration();

    // Store new refresh token
    const refreshTokenExpiration = new Date();
    refreshTokenExpiration.setDate(refreshTokenExpiration.getDate() + 30);

    const refreshTokenEntity = RefreshTokenEntity.create({
      token: newRefreshToken,
      userId: user.id,
      expiresAt: refreshTokenExpiration,
    });

    await this.refreshTokenRepository.create(refreshTokenEntity);

    return Result.ok<LoginResponseDTO>({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn,
      user: UserMapper.toDTO(user),
    });
  }
}
