import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { parsePagination } from '../../utils/pagination';
import {
  CreateGMA,
  ApproveGMA,
  RejectGMA,
  MarkGMAInTransit,
  CloseGMA,
  GetGMADetails,
  ListGMAs,
  AddAnimalToGMA,
  GetGMAAnimals,
} from '../../../application/senasag';

export class GMAController extends BaseController {
  constructor(
    private readonly createGMAUC: CreateGMA,
    private readonly approveGMAUC: ApproveGMA,
    private readonly rejectGMAUC: RejectGMA,
    private readonly markInTransitUC: MarkGMAInTransit,
    private readonly closeGMAUC: CloseGMA,
    private readonly getGMADetailsUC: GetGMADetails,
    private readonly listGMAsUC: ListGMAs,
    private readonly addAnimalToGMAUC: AddAnimalToGMA,
    private readonly getGMAAnimalsUC: GetGMAAnimals,
  ) {
    super();
  }

  readonly createGMA = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.createGMAUC.execute({
        ...req.body,
        registrarId: req.user!.userId,
        originFarmId: req.user!.farmId,
      });
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly approveGMA = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.approveGMAUC.execute({
        gmaId: req.params.id as string,
        ...req.body,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly rejectGMA = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.rejectGMAUC.execute({
        gmaId: req.params.id as string,
        ...req.body,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly markInTransit = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.markInTransitUC.execute({
        gmaId: req.params.id as string,
        ...req.body,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly closeGMA = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.closeGMAUC.execute({
        gmaId: req.params.id as string,
        ...req.body,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getGMADetails = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getGMADetailsUC.execute({ gmaId: req.params.id as string });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly listGMAs = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await this.listGMAsUC.execute({
        filters: { ...req.query, farmId: req.user!.farmId },
        pagination: { page, pageSize: limit },
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly addAnimal = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.addAnimalToGMAUC.execute({
        gmaId: req.params.id as string,
        ...req.body,
      });
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getGMAAnimals = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getGMAAnimalsUC.execute({ gmaId: req.params.id as string });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };
}
