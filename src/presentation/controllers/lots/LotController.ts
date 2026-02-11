import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { parsePagination } from '../../utils/pagination';
import {
  CreateLot,
  CloseLot,
  GetLotDetails,
  ListLots,
  ListActiveLotsForFarm,
  UpdateLotAverageWeight,
  CheckLotTargetWeight,
} from '../../../application/lots';

export class LotController extends BaseController {
  constructor(
    private readonly createLotUC: CreateLot,
    private readonly closeLotUC: CloseLot,
    private readonly getLotDetailsUC: GetLotDetails,
    private readonly listLotsUC: ListLots,
    private readonly listActiveLotsForFarmUC: ListActiveLotsForFarm,
    private readonly updateLotAverageWeightUC: UpdateLotAverageWeight,
    private readonly checkLotTargetWeightUC: CheckLotTargetWeight,
  ) {
    super();
  }

  readonly createLot = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.createLotUC.execute({
        ...req.body,
        farmId: req.user!.farmId,
      });
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getLotDetails = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getLotDetailsUC.execute({ id: req.params.id as string });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly listLots = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await this.listLotsUC.execute({
        filters: { ...req.query, farmId: req.user!.farmId },
        pagination: { page, pageSize: limit },
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly listActiveLotsForFarm = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.listActiveLotsForFarmUC.execute({ farmId: req.user!.farmId });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly closeLot = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.closeLotUC.execute({ id: req.params.id as string });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly updateLotAverageWeight = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.updateLotAverageWeightUC.execute({
        lotId: req.params.id as string,
        newAverageWeight: req.body.newAverageWeight,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly checkLotTargetWeight = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.checkLotTargetWeightUC.execute({ lotId: req.params.id as string });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };
}
