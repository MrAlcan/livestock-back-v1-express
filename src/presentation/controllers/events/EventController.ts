import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { parsePagination } from '../../utils/pagination';
import {
  RegisterEventBirth,
  RegisterEventDeath,
  RegisterEventHealth,
  RegisterEventMovement,
  RegisterEventWeighing,
  RegisterEventReproduction,
  RegisterEventSale,
  RegisterEventPurchase,
  RegisterEventWeaning,
  RegisterEventIdentification,
  GetEventDetails,
  ListEventsByAnimal,
  ListEventsByFarm,
  BulkRegisterEvents,
  CalculateADG,
  EstimateBirthDate,
} from '../../../application/events';

export class EventController extends BaseController {
  constructor(
    private readonly registerEventBirthUC: RegisterEventBirth,
    private readonly registerEventDeathUC: RegisterEventDeath,
    private readonly registerEventHealthUC: RegisterEventHealth,
    private readonly registerEventMovementUC: RegisterEventMovement,
    private readonly registerEventWeighingUC: RegisterEventWeighing,
    private readonly registerEventReproductionUC: RegisterEventReproduction,
    private readonly registerEventSaleUC: RegisterEventSale,
    private readonly registerEventPurchaseUC: RegisterEventPurchase,
    private readonly registerEventWeaningUC: RegisterEventWeaning,
    private readonly registerEventIdentificationUC: RegisterEventIdentification,
    private readonly getEventDetailsUC: GetEventDetails,
    private readonly listEventsByAnimalUC: ListEventsByAnimal,
    private readonly listEventsByFarmUC: ListEventsByFarm,
    private readonly bulkRegisterEventsUC: BulkRegisterEvents,
    private readonly calculateADGUC: CalculateADG,
    private readonly estimateBirthDateUC: EstimateBirthDate,
  ) {
    super();
  }

  readonly registerBirth = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.registerEventBirthUC.execute({
        ...req.body,
        registeredBy: req.user!.userId,
      });
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly registerDeath = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.registerEventDeathUC.execute({
        ...req.body,
        registeredBy: req.user!.userId,
      });
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly registerHealth = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.registerEventHealthUC.execute({
        ...req.body,
        registeredBy: req.user!.userId,
      });
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly registerMovement = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.registerEventMovementUC.execute({
        ...req.body,
        registeredBy: req.user!.userId,
      });
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly registerWeighing = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.registerEventWeighingUC.execute({
        ...req.body,
        registeredBy: req.user!.userId,
      });
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly registerReproduction = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.registerEventReproductionUC.execute({
        ...req.body,
        registeredBy: req.user!.userId,
      });
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly registerSale = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.registerEventSaleUC.execute({
        ...req.body,
        registeredBy: req.user!.userId,
      });
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly registerPurchase = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.registerEventPurchaseUC.execute({
        ...req.body,
        registeredBy: req.user!.userId,
      });
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly registerWeaning = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.registerEventWeaningUC.execute({
        ...req.body,
        registeredBy: req.user!.userId,
      });
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly registerIdentification = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.registerEventIdentificationUC.execute({
        ...req.body,
        registeredBy: req.user!.userId,
      });
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getEventDetails = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getEventDetailsUC.execute({ eventId: req.params.id as string });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly listEventsByAnimal = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await this.listEventsByAnimalUC.execute({
        animalId: req.params.animalId as string,
        pagination: { page, pageSize: limit },
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly listEventsByFarm = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await this.listEventsByFarmUC.execute({
        filters: { ...req.query, farmId: req.user!.farmId },
        pagination: { page, pageSize: limit },
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly bulkRegister = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.bulkRegisterEventsUC.execute({
        events: req.body.events,
      });
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly calculateADG = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.calculateADGUC.execute({
        animalId: req.params.animalId as string,
        startWeight: parseFloat(req.query.startWeight as string),
        endWeight: parseFloat(req.query.endWeight as string),
        days: parseInt(req.query.days as string, 10),
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly estimateBirthDate = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.estimateBirthDateUC.execute({
        serviceDate: req.query.serviceDate as string,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };
}
