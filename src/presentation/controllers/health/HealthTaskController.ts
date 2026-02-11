import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { parsePagination } from '../../utils/pagination';
import {
  CreateHealthTask,
  UpdateHealthTask,
  CompleteHealthTask,
  CancelHealthTask,
  GetHealthTask,
  ListHealthTasks,
  GetOverdueHealthTasks,
} from '../../../application/health';

export class HealthTaskController extends BaseController {
  constructor(
    private readonly createHealthTaskUC: CreateHealthTask,
    private readonly updateHealthTaskUC: UpdateHealthTask,
    private readonly completeHealthTaskUC: CompleteHealthTask,
    private readonly cancelHealthTaskUC: CancelHealthTask,
    private readonly getHealthTaskUC: GetHealthTask,
    private readonly listHealthTasksUC: ListHealthTasks,
    private readonly getOverdueHealthTasksUC: GetOverdueHealthTasks,
  ) {
    super();
  }

  readonly createTask = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.createHealthTaskUC.execute({
        ...req.body,
        creatorId: req.user!.userId,
      });
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly updateTask = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.updateHealthTaskUC.execute({
        id: req.params.id as string,
        ...req.body,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly completeTask = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.completeHealthTaskUC.execute(req.params.id as string);
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly cancelTask = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.cancelHealthTaskUC.execute(req.params.id as string);
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getTaskDetails = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getHealthTaskUC.execute(req.params.id as string);
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly listTasks = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await this.listHealthTasksUC.execute({
        filters: req.query as Record<string, string>,
        pagination: { page, pageSize: limit },
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getOverdueTasks = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getOverdueHealthTasksUC.execute();
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };
}
