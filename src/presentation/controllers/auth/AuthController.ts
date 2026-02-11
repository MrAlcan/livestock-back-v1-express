import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import {
  RegisterUser,
  LoginUser,
  RefreshToken,
  LogoutUser,
  ChangePassword,
  ResetPasswordRequest,
  ResetPasswordConfirm,
  GetUserProfile,
  UpdateUserProfile,
} from '../../../application/auth';

export class AuthController extends BaseController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly loginUser: LoginUser,
    private readonly refreshTokenUC: RefreshToken,
    private readonly logoutUser: LogoutUser,
    private readonly changePasswordUC: ChangePassword,
    private readonly resetPasswordRequestUC: ResetPasswordRequest,
    private readonly resetPasswordConfirmUC: ResetPasswordConfirm,
    private readonly getUserProfile: GetUserProfile,
    private readonly updateUserProfileUC: UpdateUserProfile,
  ) {
    super();
  }

  readonly register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.registerUser.execute(req.body);
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.loginUser.execute({
        ...req.body,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly refreshToken = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.refreshTokenUC.execute(req.body);
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly logout = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.logoutUser.execute({ userId: req.user!.userId });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly changePassword = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.changePasswordUC.execute({
        userId: req.user!.userId,
        ...req.body,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly resetPasswordRequest = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.resetPasswordRequestUC.execute(req.body);
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly resetPasswordConfirm = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.resetPasswordConfirmUC.execute(req.body);
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getUserProfile.execute({ userId: req.user!.userId });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly updateProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.updateUserProfileUC.execute({
        userId: req.user!.userId,
        ...req.body,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };
}
