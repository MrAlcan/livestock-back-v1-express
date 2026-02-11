import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { parsePagination } from '../../utils/pagination';
import {
  CreateProduct,
  UpdateProduct,
  DeactivateProduct,
  GetProductDetails,
  ListProducts,
  GetLowStockProducts,
  RecordInventoryMovement,
  CheckProductStock,
  CheckWithdrawalPeriod,
} from '../../../application/health';

export class ProductController extends BaseController {
  constructor(
    private readonly createProductUC: CreateProduct,
    private readonly updateProductUC: UpdateProduct,
    private readonly deactivateProductUC: DeactivateProduct,
    private readonly getProductDetailsUC: GetProductDetails,
    private readonly listProductsUC: ListProducts,
    private readonly getLowStockProductsUC: GetLowStockProducts,
    private readonly recordInventoryMovementUC: RecordInventoryMovement,
    private readonly checkProductStockUC: CheckProductStock,
    private readonly checkWithdrawalPeriodUC: CheckWithdrawalPeriod,
  ) {
    super();
  }

  readonly createProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.createProductUC.execute(req.body);
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly updateProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.updateProductUC.execute({
        id: req.params.id as string,
        ...req.body,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly deactivateProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.deactivateProductUC.execute(req.params.id as string);
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getProductDetails = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getProductDetailsUC.execute(req.params.id as string);
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly listProducts = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await this.listProductsUC.execute({
        filters: req.query as Record<string, string>,
        pagination: { page, pageSize: limit },
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getLowStockProducts = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getLowStockProductsUC.execute();
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly recordInventoryMovement = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.recordInventoryMovementUC.execute({
        ...req.body,
        registeredBy: req.user!.userId,
      });
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly checkStock = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.checkProductStockUC.execute(req.params.id as string);
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly checkWithdrawalPeriod = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.checkWithdrawalPeriodUC.execute({
        animalId: req.params.animalId as string,
        checkDate: new Date().toISOString(),
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };
}
