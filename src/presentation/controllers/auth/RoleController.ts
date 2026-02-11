import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import {
  CreateRole,
  UpdateRole,
  DeleteRole,
  GetRoleDetails,
  ListRoles,
} from '../../../application/auth';

export class RoleController extends BaseController {
  constructor(
    private readonly createRoleUC: CreateRole,
    private readonly updateRoleUC: UpdateRole,
    private readonly deleteRoleUC: DeleteRole,
    private readonly getRoleDetailsUC: GetRoleDetails,
    private readonly listRolesUC: ListRoles,
  ) {
    super();
  }

  readonly createRole = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.createRoleUC.execute(req.body);
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly updateRole = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.updateRoleUC.execute({
        id: parseInt(req.params.id as string, 10),
        ...req.body,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly deleteRole = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.deleteRoleUC.execute({ roleId: parseInt(req.params.id as string, 10) });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getRoleById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getRoleDetailsUC.execute({ roleId: parseInt(req.params.id as string, 10) });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly listRoles = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.listRolesUC.execute();
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };
}
