import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import {
  CreateBreed,
  UpdateBreed,
  DeleteBreed,
  GetBreedDetails,
  ListBreeds,
} from '../../../application/animals';

export class BreedController extends BaseController {
  constructor(
    private readonly createBreedUC: CreateBreed,
    private readonly updateBreedUC: UpdateBreed,
    private readonly deleteBreedUC: DeleteBreed,
    private readonly getBreedDetailsUC: GetBreedDetails,
    private readonly listBreedsUC: ListBreeds,
  ) {
    super();
  }

  readonly createBreed = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.createBreedUC.execute(req.body);
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly updateBreed = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.updateBreedUC.execute({
        id: parseInt(req.params.id as string, 10),
        ...req.body,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly deleteBreed = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.deleteBreedUC.execute({ id: parseInt(req.params.id as string, 10) });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getBreedDetails = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getBreedDetailsUC.execute({ id: parseInt(req.params.id as string, 10) });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly listBreeds = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.listBreedsUC.execute({});
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };
}
