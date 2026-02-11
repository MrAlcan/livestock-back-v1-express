import { Result } from '../../../domain/shared/Result';
import { IUserRepository } from '../../../domain/auth/repositories/IUserRepository';
import { IRefreshTokenRepository } from '../../../domain/auth/repositories/IRefreshTokenRepository';
import { IPasswordHasher } from '../../shared/ports/IPasswordHasher';
import { IJwtService } from '../../shared/ports/IJwtService';
import {
  LoginInputDTO,
  LoginResponseDTO,
  RefreshTokenInputDTO,
  RegisterUserInputDTO,
  UserResponseDTO,
} from '../dtos/AuthDTOs';
import { LoginUser } from '../use-cases/LoginUser';
import { LogoutUser } from '../use-cases/LogoutUser';
import { RefreshToken } from '../use-cases/RefreshToken';
import { RegisterUser } from '../use-cases/RegisterUser';

/**
 * AuthenticationService orchestrates authentication-related use cases,
 * providing a unified facade for login, logout, token refresh, and registration.
 *
 * This service creates and delegates to the individual use case instances,
 * simplifying dependency wiring for consumers that need multiple auth operations.
 */
export class AuthenticationService {
  private readonly loginUser: LoginUser;
  private readonly logoutUser: LogoutUser;
  private readonly refreshToken: RefreshToken;
  private readonly registerUser: RegisterUser;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly jwtService: IJwtService,
  ) {
    this.loginUser = new LoginUser(
      userRepository,
      refreshTokenRepository,
      passwordHasher,
      jwtService,
    );

    this.logoutUser = new LogoutUser(refreshTokenRepository);

    this.refreshToken = new RefreshToken(
      userRepository,
      refreshTokenRepository,
      jwtService,
    );

    this.registerUser = new RegisterUser(
      userRepository,
      passwordHasher,
    );
  }

  async login(input: LoginInputDTO): Promise<Result<LoginResponseDTO>> {
    return this.loginUser.execute(input);
  }

  async logout(userId: string): Promise<Result<void>> {
    return this.logoutUser.execute({ userId });
  }

  async refresh(input: RefreshTokenInputDTO): Promise<Result<LoginResponseDTO>> {
    return this.refreshToken.execute(input);
  }

  async register(input: RegisterUserInputDTO): Promise<Result<UserResponseDTO>> {
    return this.registerUser.execute(input);
  }
}
