import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import {
  CreateRation,
  UpdateRation,
  GetRationDetails,
  ListRations,
  AddRationIngredient,
  AssignRationToLot,
} from '../../../application/health';

export class RationController extends BaseController {
  constructor(
    private readonly createRationUC: CreateRation,
    private readonly updateRationUC: UpdateRation,
    private readonly getRationDetailsUC: GetRationDetails,
    private readonly listRationsUC: ListRations,
    private readonly addRationIngredientUC: AddRationIngredient,
    private readonly assignRationToLotUC: AssignRationToLot,
  ) {
    super();
  }

  readonly createRation = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.createRationUC.execute({
        ...req.body,
        farmId: req.user!.farmId,
      });
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly updateRation = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.updateRationUC.execute({
        id: req.params.id as string,
        ...req.body,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getRationDetails = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getRationDetailsUC.execute(req.params.id as string);
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly listRations = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.listRationsUC.execute({
        farmId: req.user!.farmId,
        activeOnly: req.query.activeOnly === 'true',
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly addIngredient = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.addRationIngredientUC.execute({
        rationId: req.params.id as string,
        ...req.body,
      });
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly assignToLot = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.assignRationToLotUC.execute(req.body);
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };
}
