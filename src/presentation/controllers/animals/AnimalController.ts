import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { parsePagination } from '../../utils/pagination';
import {
  RegisterAnimal,
  UpdateAnimal,
  IdentifyAnimal,
  UpdateAnimalWeight,
  MarkAnimalAsDead,
  MarkAnimalAsSold,
  AssignAnimalToLot,
  AssignAnimalToPaddock,
  GetAnimalDetails,
  ListAnimals,
  GetActiveAnimals,
  GetAnimalsByLot,
  SearchAnimals,
} from '../../../application/animals';

export class AnimalController extends BaseController {
  constructor(
    private readonly registerAnimalUC: RegisterAnimal,
    private readonly updateAnimalUC: UpdateAnimal,
    private readonly identifyAnimalUC: IdentifyAnimal,
    private readonly updateAnimalWeightUC: UpdateAnimalWeight,
    private readonly markAnimalAsDeadUC: MarkAnimalAsDead,
    private readonly markAnimalAsSoldUC: MarkAnimalAsSold,
    private readonly assignAnimalToLotUC: AssignAnimalToLot,
    private readonly assignAnimalToPaddockUC: AssignAnimalToPaddock,
    private readonly getAnimalDetailsUC: GetAnimalDetails,
    private readonly listAnimalsUC: ListAnimals,
    private readonly getActiveAnimalsUC: GetActiveAnimals,
    private readonly getAnimalsByLotUC: GetAnimalsByLot,
    private readonly searchAnimalsUC: SearchAnimals,
  ) {
    super();
  }

  readonly registerAnimal = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.registerAnimalUC.execute({
        ...req.body,
        farmId: req.user!.farmId,
      });
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly updateAnimal = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.updateAnimalUC.execute({
        id: req.params.id as string,
        ...req.body,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly identifyAnimal = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.identifyAnimalUC.execute({
        id: req.params.id as string,
        officialId: req.body.officialId,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly updateWeight = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.updateAnimalWeightUC.execute({
        id: req.params.id as string,
        ...req.body,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly markAsDead = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.markAnimalAsDeadUC.execute({
        id: req.params.id as string,
        ...req.body,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly markAsSold = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.markAnimalAsSoldUC.execute({
        id: req.params.id as string,
        ...req.body,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly assignToLot = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.assignAnimalToLotUC.execute({
        animalId: req.params.id as string,
        lotId: req.body.lotId,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly assignToPaddock = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.assignAnimalToPaddockUC.execute({
        animalId: req.params.id as string,
        paddockId: req.body.paddockId,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getAnimalDetails = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getAnimalDetailsUC.execute({ id: req.params.id as string });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly listAnimals = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await this.listAnimalsUC.execute({
        filters: { ...req.query, farmId: req.user!.farmId },
        pagination: { page, pageSize: limit },
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getActiveAnimals = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getActiveAnimalsUC.execute({ farmId: req.user!.farmId });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getAnimalsByLot = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getAnimalsByLotUC.execute({ lotId: req.params.lotId as string });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly searchAnimals = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await this.searchAnimalsUC.execute({
        search: req.query.q as string || '',
        farmId: req.user!.farmId,
        pagination: { page, pageSize: limit },
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };
}
