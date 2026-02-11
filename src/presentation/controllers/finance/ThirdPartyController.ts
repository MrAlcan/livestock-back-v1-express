import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { parsePagination } from '../../utils/pagination';
import {
  CreateThirdParty,
  UpdateThirdParty,
  GetThirdPartyDetails,
  ListThirdParties,
} from '../../../application/finance';

export class ThirdPartyController extends BaseController {
  constructor(
    private readonly createThirdPartyUC: CreateThirdParty,
    private readonly updateThirdPartyUC: UpdateThirdParty,
    private readonly getThirdPartyDetailsUC: GetThirdPartyDetails,
    private readonly listThirdPartiesUC: ListThirdParties,
  ) {
    super();
  }

  readonly createThirdParty = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.createThirdPartyUC.execute(req.body);
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly updateThirdParty = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.updateThirdPartyUC.execute({
        id: req.params.id as string,
        ...req.body,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getThirdPartyDetails = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getThirdPartyDetailsUC.execute({ id: req.params.id as string });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly listThirdParties = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await this.listThirdPartiesUC.execute({
        filters: req.query as Record<string, string>,
        pagination: { page, pageSize: limit },
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };
}
