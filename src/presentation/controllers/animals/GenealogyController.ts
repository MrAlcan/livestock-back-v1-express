import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import {
  RecordGenealogy,
  GetGenealogyTree,
  CalculateInbreeding,
} from '../../../application/animals';

export class GenealogyController extends BaseController {
  constructor(
    private readonly recordGenealogyUC: RecordGenealogy,
    private readonly getGenealogyTreeUC: GetGenealogyTree,
    private readonly calculateInbreedingUC: CalculateInbreeding,
  ) {
    super();
  }

  readonly recordGenealogy = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.recordGenealogyUC.execute(req.body);
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getGenealogyTree = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getGenealogyTreeUC.execute({ animalId: req.params.animalId as string });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly calculateInbreeding = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.calculateInbreedingUC.execute({
        animal1Id: req.params.animalId as string,
        animal2Id: req.query.mateId as string,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };
}
