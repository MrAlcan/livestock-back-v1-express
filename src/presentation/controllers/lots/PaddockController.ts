import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { parsePagination } from '../../utils/pagination';
import {
  CreatePaddock,
  UpdatePaddock,
  DeletePaddock,
  GetPaddockDetails,
  ListPaddocks,
  CheckPaddockCapacity,
  UpdatePaddockCondition,
} from '../../../application/lots';

export class PaddockController extends BaseController {
  constructor(
    private readonly createPaddockUC: CreatePaddock,
    private readonly updatePaddockUC: UpdatePaddock,
    private readonly deletePaddockUC: DeletePaddock,
    private readonly getPaddockDetailsUC: GetPaddockDetails,
    private readonly listPaddocksUC: ListPaddocks,
    private readonly checkPaddockCapacityUC: CheckPaddockCapacity,
    private readonly updatePaddockConditionUC: UpdatePaddockCondition,
  ) {
    super();
  }

  readonly createPaddock = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.createPaddockUC.execute({
        ...req.body,
        farmId: req.user!.farmId,
      });
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly updatePaddock = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.updatePaddockUC.execute({
        id: req.params.id as string,
        ...req.body,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly deletePaddock = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.deletePaddockUC.execute({ id: req.params.id as string });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getPaddockDetails = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getPaddockDetailsUC.execute({ id: req.params.id as string });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly listPaddocks = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await this.listPaddocksUC.execute({
        filters: { ...req.query, farmId: req.user!.farmId },
        pagination: { page, pageSize: limit },
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly checkCapacity = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.checkPaddockCapacityUC.execute({
        paddockId: req.params.id as string,
        requestedQuantity: parseInt(req.query.quantity as string || '1', 10),
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly updateCondition = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.updatePaddockConditionUC.execute({
        paddockId: req.params.id as string,
        newCondition: req.body.condition,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };
}
