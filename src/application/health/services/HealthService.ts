import { Result } from '../../../domain/shared/Result';
import { IProductRepository, IInventoryMovementRepository, IHealthTaskRepository, IRationRepository } from '../../../domain/health/repositories';
import { ILotRepository } from '../../../domain/lots/repositories';
import { WithdrawalPeriodCheckerService } from '../../../domain/health/services';
import { IEventBus } from '../../shared/ports/IEventBus';
import { PaginationInputDTO } from '../../shared/dtos/PaginationDTO';
import { IRationIngredientRepository } from './IRationIngredientRepository';

import {
  CreateProductInputDTO,
  UpdateProductInputDTO,
  ProductResponseDTO,
  ProductFiltersInputDTO,
  RecordInventoryMovementInputDTO,
  InventoryMovementResponseDTO,
  StockStatusResponseDTO,
  CreateHealthTaskInputDTO,
  UpdateHealthTaskInputDTO,
  HealthTaskResponseDTO,
  TaskFiltersInputDTO,
  CreateRationInputDTO,
  UpdateRationInputDTO,
  RationResponseDTO,
  RationDetailResponseDTO,
  AddRationIngredientInputDTO,
  RationIngredientResponseDTO,
} from '../dtos/HealthDTOs';

import { CreateProduct } from '../use-cases/CreateProduct';
import { UpdateProduct } from '../use-cases/UpdateProduct';
import { DeactivateProduct } from '../use-cases/DeactivateProduct';
import { GetProductDetails } from '../use-cases/GetProductDetails';
import { ListProducts } from '../use-cases/ListProducts';
import { GetLowStockProducts } from '../use-cases/GetLowStockProducts';
import { RecordInventoryMovement } from '../use-cases/RecordInventoryMovement';
import { CheckProductStock } from '../use-cases/CheckProductStock';
import { CheckWithdrawalPeriod } from '../use-cases/CheckWithdrawalPeriod';
import { CreateHealthTask } from '../use-cases/CreateHealthTask';
import { UpdateHealthTask } from '../use-cases/UpdateHealthTask';
import { CompleteHealthTask } from '../use-cases/CompleteHealthTask';
import { CancelHealthTask } from '../use-cases/CancelHealthTask';
import { GetHealthTask } from '../use-cases/GetHealthTask';
import { ListHealthTasks } from '../use-cases/ListHealthTasks';
import { GetOverdueHealthTasks } from '../use-cases/GetOverdueHealthTasks';
import { CreateRation } from '../use-cases/CreateRation';
import { UpdateRation } from '../use-cases/UpdateRation';
import { ListRations } from '../use-cases/ListRations';
import { GetRationDetails } from '../use-cases/GetRationDetails';
import { AddRationIngredient } from '../use-cases/AddRationIngredient';
import { AssignRationToLot } from '../use-cases/AssignRationToLot';

export class HealthService {
  private readonly createProductUC: CreateProduct;
  private readonly updateProductUC: UpdateProduct;
  private readonly deactivateProductUC: DeactivateProduct;
  private readonly getProductDetailsUC: GetProductDetails;
  private readonly listProductsUC: ListProducts;
  private readonly getLowStockProductsUC: GetLowStockProducts;
  private readonly recordInventoryMovementUC: RecordInventoryMovement;
  private readonly checkProductStockUC: CheckProductStock;
  private readonly checkWithdrawalPeriodUC: CheckWithdrawalPeriod;
  private readonly createHealthTaskUC: CreateHealthTask;
  private readonly updateHealthTaskUC: UpdateHealthTask;
  private readonly completeHealthTaskUC: CompleteHealthTask;
  private readonly cancelHealthTaskUC: CancelHealthTask;
  private readonly getHealthTaskUC: GetHealthTask;
  private readonly listHealthTasksUC: ListHealthTasks;
  private readonly getOverdueHealthTasksUC: GetOverdueHealthTasks;
  private readonly createRationUC: CreateRation;
  private readonly updateRationUC: UpdateRation;
  private readonly listRationsUC: ListRations;
  private readonly getRationDetailsUC: GetRationDetails;
  private readonly addRationIngredientUC: AddRationIngredient;
  private readonly assignRationToLotUC: AssignRationToLot;

  constructor(
    private readonly productRepository: IProductRepository,
    private readonly inventoryMovementRepository: IInventoryMovementRepository,
    private readonly healthTaskRepository: IHealthTaskRepository,
    private readonly rationRepository: IRationRepository,
    private readonly rationIngredientRepository: IRationIngredientRepository,
    private readonly lotRepository: ILotRepository,
    private readonly withdrawalPeriodChecker: WithdrawalPeriodCheckerService,
    private readonly eventBus: IEventBus,
  ) {
    this.createProductUC = new CreateProduct(productRepository);
    this.updateProductUC = new UpdateProduct(productRepository);
    this.deactivateProductUC = new DeactivateProduct(productRepository);
    this.getProductDetailsUC = new GetProductDetails(productRepository);
    this.listProductsUC = new ListProducts(productRepository);
    this.getLowStockProductsUC = new GetLowStockProducts(productRepository);
    this.recordInventoryMovementUC = new RecordInventoryMovement(productRepository, inventoryMovementRepository);
    this.checkProductStockUC = new CheckProductStock(productRepository);
    this.checkWithdrawalPeriodUC = new CheckWithdrawalPeriod(withdrawalPeriodChecker);
    this.createHealthTaskUC = new CreateHealthTask(healthTaskRepository);
    this.updateHealthTaskUC = new UpdateHealthTask(healthTaskRepository);
    this.completeHealthTaskUC = new CompleteHealthTask(healthTaskRepository, eventBus);
    this.cancelHealthTaskUC = new CancelHealthTask(healthTaskRepository);
    this.getHealthTaskUC = new GetHealthTask(healthTaskRepository);
    this.listHealthTasksUC = new ListHealthTasks(healthTaskRepository);
    this.getOverdueHealthTasksUC = new GetOverdueHealthTasks(healthTaskRepository);
    this.createRationUC = new CreateRation(rationRepository);
    this.updateRationUC = new UpdateRation(rationRepository);
    this.listRationsUC = new ListRations(rationRepository);
    this.getRationDetailsUC = new GetRationDetails(rationRepository, rationIngredientRepository);
    this.addRationIngredientUC = new AddRationIngredient(rationRepository, productRepository, rationIngredientRepository);
    this.assignRationToLotUC = new AssignRationToLot(rationRepository, lotRepository);
  }

  // ── Product operations ───────────────────────────────────────────────────

  async createProduct(input: CreateProductInputDTO): Promise<Result<ProductResponseDTO>> {
    return this.createProductUC.execute(input);
  }

  async updateProduct(input: UpdateProductInputDTO): Promise<Result<ProductResponseDTO>> {
    return this.updateProductUC.execute(input);
  }

  async deactivateProduct(productId: string): Promise<Result<ProductResponseDTO>> {
    return this.deactivateProductUC.execute(productId);
  }

  async getProductDetails(productId: string): Promise<Result<ProductResponseDTO>> {
    return this.getProductDetailsUC.execute(productId);
  }

  async listProducts(filters: ProductFiltersInputDTO, pagination: PaginationInputDTO): Promise<Result<ProductResponseDTO[]>> {
    return this.listProductsUC.execute({ filters, pagination });
  }

  async getLowStockProducts(): Promise<Result<StockStatusResponseDTO[]>> {
    return this.getLowStockProductsUC.execute();
  }

  // ── Inventory operations ─────────────────────────────────────────────────

  async recordInventoryMovement(input: RecordInventoryMovementInputDTO): Promise<Result<InventoryMovementResponseDTO>> {
    return this.recordInventoryMovementUC.execute(input);
  }

  async checkProductStock(productId: string): Promise<Result<StockStatusResponseDTO>> {
    return this.checkProductStockUC.execute(productId);
  }

  async checkWithdrawalPeriod(animalId: string, checkDate: string): Promise<Result<{ animalId: string; isInWithdrawalPeriod: boolean; withdrawalEndDate?: string }>> {
    return this.checkWithdrawalPeriodUC.execute({ animalId, checkDate });
  }

  // ── Health task operations ───────────────────────────────────────────────

  async createHealthTask(input: CreateHealthTaskInputDTO): Promise<Result<HealthTaskResponseDTO>> {
    return this.createHealthTaskUC.execute(input);
  }

  async updateHealthTask(input: UpdateHealthTaskInputDTO): Promise<Result<HealthTaskResponseDTO>> {
    return this.updateHealthTaskUC.execute(input);
  }

  async completeHealthTask(taskId: string): Promise<Result<HealthTaskResponseDTO>> {
    return this.completeHealthTaskUC.execute(taskId);
  }

  async cancelHealthTask(taskId: string): Promise<Result<HealthTaskResponseDTO>> {
    return this.cancelHealthTaskUC.execute(taskId);
  }

  async getHealthTask(taskId: string): Promise<Result<HealthTaskResponseDTO>> {
    return this.getHealthTaskUC.execute(taskId);
  }

  async listHealthTasks(filters: TaskFiltersInputDTO, pagination: PaginationInputDTO): Promise<Result<HealthTaskResponseDTO[]>> {
    return this.listHealthTasksUC.execute({ filters, pagination });
  }

  async getOverdueHealthTasks(): Promise<Result<HealthTaskResponseDTO[]>> {
    return this.getOverdueHealthTasksUC.execute();
  }

  // ── Ration operations ────────────────────────────────────────────────────

  async createRation(input: CreateRationInputDTO): Promise<Result<RationResponseDTO>> {
    return this.createRationUC.execute(input);
  }

  async updateRation(input: UpdateRationInputDTO): Promise<Result<RationResponseDTO>> {
    return this.updateRationUC.execute(input);
  }

  async listRations(farmId: string, activeOnly?: boolean): Promise<Result<RationResponseDTO[]>> {
    return this.listRationsUC.execute({ farmId, activeOnly });
  }

  async getRationDetails(rationId: string): Promise<Result<RationDetailResponseDTO>> {
    return this.getRationDetailsUC.execute(rationId);
  }

  async addRationIngredient(input: AddRationIngredientInputDTO): Promise<Result<RationIngredientResponseDTO>> {
    return this.addRationIngredientUC.execute(input);
  }

  async assignRationToLot(rationId: string, lotId: string): Promise<Result<{ lotId: string; rationId: string; success: boolean }>> {
    return this.assignRationToLotUC.execute({ rationId, lotId });
  }
}
