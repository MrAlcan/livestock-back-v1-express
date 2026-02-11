import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { parsePagination } from '../../utils/pagination';
import {
  ListUsers,
  GetUserProfile,
  DeactivateUser,
  ActivateUser,
  BlockUser,
  AssignRoleToUser,
  RemoveRoleFromUser,
} from '../../../application/auth';

export class UserController extends BaseController {
  constructor(
    private readonly listUsersUC: ListUsers,
    private readonly getUserProfile: GetUserProfile,
    private readonly deactivateUserUC: DeactivateUser,
    private readonly activateUserUC: ActivateUser,
    private readonly blockUserUC: BlockUser,
    private readonly assignRoleToUser: AssignRoleToUser,
    private readonly removeRoleFromUser: RemoveRoleFromUser,
  ) {
    super();
  }

  readonly listUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await this.listUsersUC.execute({
        filters: { ...req.query, farmId: req.user!.farmId },
        pagination: { page, pageSize: limit },
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getUserProfile.execute({ userId: req.params.id as string });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly deactivateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.deactivateUserUC.execute({ userId: req.params.id as string });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly activateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.activateUserUC.execute({ userId: req.params.id as string });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly blockUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.blockUserUC.execute({ userId: req.params.id as string });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly assignRole = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.assignRoleToUser.execute({
        userId: req.params.id as string,
        roleId: req.body.roleId,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly removeRole = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.removeRoleFromUser.execute({
        userId: req.params.id as string,
        roleId: req.body.roleId,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };
}
