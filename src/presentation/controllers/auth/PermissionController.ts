import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import {
  CreatePermission,
  UpdatePermission,
  DeletePermission,
  ListPermissions,
} from '../../../application/auth';

export class PermissionController extends BaseController {
  constructor(
    private readonly createPermissionUC: CreatePermission,
    private readonly updatePermissionUC: UpdatePermission,
    private readonly deletePermissionUC: DeletePermission,
    private readonly listPermissionsUC: ListPermissions,
  ) {
    super();
  }

  readonly createPermission = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.createPermissionUC.execute(req.body);
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly updatePermission = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.updatePermissionUC.execute({
        id: parseInt(req.params.id as string, 10),
        ...req.body,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly deletePermission = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.deletePermissionUC.execute({ permissionId: parseInt(req.params.id as string, 10) });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly listPermissions = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.listPermissionsUC.execute({});
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };
}
