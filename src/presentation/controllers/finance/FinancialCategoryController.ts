import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import {
  CreateFinancialCategory,
  ListFinancialCategories,
} from '../../../application/finance';

export class FinancialCategoryController extends BaseController {
  constructor(
    private readonly createCategoryUC: CreateFinancialCategory,
    private readonly listCategoriesUC: ListFinancialCategories,
  ) {
    super();
  }

  readonly createCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.createCategoryUC.execute(req.body);
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly listCategories = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.listCategoriesUC.execute({});
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };
}
