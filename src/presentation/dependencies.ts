import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

// Infrastructure - Repositories
import { PrismaUserRepository } from '../infrastructure/repositories/prisma/PrismaUserRepository';
import { PrismaRefreshTokenRepository } from '../infrastructure/repositories/prisma/PrismaRefreshTokenRepository';
import { PrismaRoleRepository } from '../infrastructure/repositories/prisma/PrismaRoleRepository';
import { PrismaPermissionRepository } from '../infrastructure/repositories/prisma/PrismaPermissionRepository';
import { PrismaAuditLogRepository } from '../infrastructure/repositories/prisma/PrismaAuditLogRepository';
import { PrismaAnimalRepository } from '../infrastructure/repositories/prisma/PrismaAnimalRepository';
import { PrismaBreedRepository } from '../infrastructure/repositories/prisma/PrismaBreedRepository';
import { PrismaGenealogyRepository } from '../infrastructure/repositories/prisma/PrismaGenealogyRepository';
import { PrismaEventRepository } from '../infrastructure/repositories/prisma/PrismaEventRepository';
import { PrismaProductRepository } from '../infrastructure/repositories/prisma/PrismaProductRepository';
import { PrismaInventoryMovementRepository } from '../infrastructure/repositories/prisma/PrismaInventoryMovementRepository';
import { PrismaHealthTaskRepository } from '../infrastructure/repositories/prisma/PrismaHealthTaskRepository';
import { PrismaRationRepository } from '../infrastructure/repositories/prisma/PrismaRationRepository';
import { PrismaRationIngredientRepository } from '../infrastructure/repositories/prisma/PrismaRationIngredientRepository';
import { PrismaLotRepository } from '../infrastructure/repositories/prisma/PrismaLotRepository';
import { PrismaPaddockRepository } from '../infrastructure/repositories/prisma/PrismaPaddockRepository';
import { PrismaReproductionCycleRepository } from '../infrastructure/repositories/prisma/PrismaReproductionCycleRepository';
import { PrismaGMARepository } from '../infrastructure/repositories/prisma/PrismaGMARepository';
import { PrismaRegulatoryDocumentRepository } from '../infrastructure/repositories/prisma/PrismaRegulatoryDocumentRepository';
import { PrismaFinancialMovementRepository } from '../infrastructure/repositories/prisma/PrismaFinancialMovementRepository';
import { PrismaThirdPartyRepository } from '../infrastructure/repositories/prisma/PrismaThirdPartyRepository';
import { PrismaFinancialCategoryRepository } from '../infrastructure/repositories/prisma/PrismaFinancialCategoryRepository';
import { PrismaSyncLogRepository } from '../infrastructure/repositories/prisma/PrismaSyncLogRepository';
import { PrismaConflictResolutionRepository } from '../infrastructure/repositories/prisma/PrismaConflictResolutionRepository';

// Infrastructure - Services
import { JwtServiceImpl } from '../infrastructure/security/jwt.service';
import { BcryptService } from '../infrastructure/security/bcrypt.service';
import { PrismaService } from '../infrastructure/database/prisma.service';
import { InMemoryEventBus } from '../infrastructure/event-bus/in-memory-event-bus';

// Domain Services
import { BirthProjectionService, ReproductionKPICalculatorService } from '../domain/reproduction/services';
import { ADGCalculatorService } from '../domain/events/services/ADGCalculatorService';
import { EstimatedBirthDateCalculatorService } from '../domain/events/services/EstimatedBirthDateCalculatorService';
import { InbreedingCalculatorService } from '../domain/animals/services/InbreedingCalculatorService';
import { WithdrawalPeriodCheckerService } from '../domain/health/services';
import { LotFinancialAnalyzerService } from '../domain/finance/services';
import { ConflictDetectorService } from '../domain/sync/services';
import { IEmailService, EmailOptions } from '../application/shared/ports/IEmailService';

// Application - Auth Use Cases
import { RegisterUser } from '../application/auth/use-cases/RegisterUser';
import { LoginUser } from '../application/auth/use-cases/LoginUser';
import { RefreshToken } from '../application/auth/use-cases/RefreshToken';
import { LogoutUser } from '../application/auth/use-cases/LogoutUser';
import { ChangePassword } from '../application/auth/use-cases/ChangePassword';
import { ResetPasswordRequest } from '../application/auth/use-cases/ResetPasswordRequest';
import { ResetPasswordConfirm } from '../application/auth/use-cases/ResetPasswordConfirm';
import { GetUserProfile } from '../application/auth/use-cases/GetUserProfile';
import { UpdateUserProfile } from '../application/auth/use-cases/UpdateUserProfile';
import { ListUsers } from '../application/auth/use-cases/ListUsers';
import { DeactivateUser } from '../application/auth/use-cases/DeactivateUser';
import { ActivateUser } from '../application/auth/use-cases/ActivateUser';
import { BlockUser } from '../application/auth/use-cases/BlockUser';
import { AssignRoleToUser } from '../application/auth/use-cases/AssignRoleToUser';
import { RemoveRoleFromUser } from '../application/auth/use-cases/RemoveRoleFromUser';
import { CreateRole } from '../application/auth/use-cases/CreateRole';
import { UpdateRole } from '../application/auth/use-cases/UpdateRole';
import { DeleteRole } from '../application/auth/use-cases/DeleteRole';
import { GetRoleDetails } from '../application/auth/use-cases/GetRoleDetails';
import { ListRoles } from '../application/auth/use-cases/ListRoles';
import { CreatePermission } from '../application/auth/use-cases/CreatePermission';
import { UpdatePermission } from '../application/auth/use-cases/UpdatePermission';
import { DeletePermission } from '../application/auth/use-cases/DeletePermission';
import { ListPermissions } from '../application/auth/use-cases/ListPermissions';
import { GetAuditLogs } from '../application/auth/use-cases/GetAuditLogs';

// Application - Animals Use Cases
import { RegisterAnimal } from '../application/animals/use-cases/RegisterAnimal';
import { UpdateAnimal } from '../application/animals/use-cases/UpdateAnimal';
import { IdentifyAnimal } from '../application/animals/use-cases/IdentifyAnimal';
import { UpdateAnimalWeight } from '../application/animals/use-cases/UpdateAnimalWeight';
import { MarkAnimalAsDead } from '../application/animals/use-cases/MarkAnimalAsDead';
import { MarkAnimalAsSold } from '../application/animals/use-cases/MarkAnimalAsSold';
import { AssignAnimalToLot } from '../application/animals/use-cases/AssignAnimalToLot';
import { AssignAnimalToPaddock } from '../application/animals/use-cases/AssignAnimalToPaddock';
import { GetAnimalDetails } from '../application/animals/use-cases/GetAnimalDetails';
import { ListAnimals } from '../application/animals/use-cases/ListAnimals';
import { GetActiveAnimals } from '../application/animals/use-cases/GetActiveAnimals';
import { GetAnimalsByLot } from '../application/animals/use-cases/GetAnimalsByLot';
import { SearchAnimals } from '../application/animals/use-cases/SearchAnimals';
import { CreateBreed } from '../application/animals/use-cases/CreateBreed';
import { UpdateBreed } from '../application/animals/use-cases/UpdateBreed';
import { DeleteBreed } from '../application/animals/use-cases/DeleteBreed';
import { GetBreedDetails } from '../application/animals/use-cases/GetBreedDetails';
import { ListBreeds } from '../application/animals/use-cases/ListBreeds';
import { RecordGenealogy } from '../application/animals/use-cases/RecordGenealogy';
import { GetGenealogyTree } from '../application/animals/use-cases/GetGenealogyTree';
import { CalculateInbreeding } from '../application/animals/use-cases/CalculateInbreeding';

// Application - Events Use Cases
import { RegisterEventBirth } from '../application/events/use-cases/RegisterEventBirth';
import { RegisterEventDeath } from '../application/events/use-cases/RegisterEventDeath';
import { RegisterEventHealth } from '../application/events/use-cases/RegisterEventHealth';
import { RegisterEventMovement } from '../application/events/use-cases/RegisterEventMovement';
import { RegisterEventWeighing } from '../application/events/use-cases/RegisterEventWeighing';
import { RegisterEventReproduction } from '../application/events/use-cases/RegisterEventReproduction';
import { RegisterEventSale } from '../application/events/use-cases/RegisterEventSale';
import { RegisterEventPurchase } from '../application/events/use-cases/RegisterEventPurchase';
import { RegisterEventWeaning } from '../application/events/use-cases/RegisterEventWeaning';
import { RegisterEventIdentification } from '../application/events/use-cases/RegisterEventIdentification';
import { GetEventDetails } from '../application/events/use-cases/GetEventDetails';
import { ListEventsByAnimal } from '../application/events/use-cases/ListEventsByAnimal';
import { ListEventsByFarm } from '../application/events/use-cases/ListEventsByFarm';
import { BulkRegisterEvents } from '../application/events/use-cases/BulkRegisterEvents';
import { CalculateADG } from '../application/events/use-cases/CalculateADG';
import { EstimateBirthDate } from '../application/events/use-cases/EstimateBirthDate';

// Application - Health Use Cases
import { CreateProduct } from '../application/health/use-cases/CreateProduct';
import { UpdateProduct } from '../application/health/use-cases/UpdateProduct';
import { DeactivateProduct } from '../application/health/use-cases/DeactivateProduct';
import { GetProductDetails } from '../application/health/use-cases/GetProductDetails';
import { ListProducts } from '../application/health/use-cases/ListProducts';
import { GetLowStockProducts } from '../application/health/use-cases/GetLowStockProducts';
import { RecordInventoryMovement } from '../application/health/use-cases/RecordInventoryMovement';
import { CheckProductStock } from '../application/health/use-cases/CheckProductStock';
import { CheckWithdrawalPeriod } from '../application/health/use-cases/CheckWithdrawalPeriod';
import { CreateHealthTask } from '../application/health/use-cases/CreateHealthTask';
import { UpdateHealthTask } from '../application/health/use-cases/UpdateHealthTask';
import { CompleteHealthTask } from '../application/health/use-cases/CompleteHealthTask';
import { CancelHealthTask } from '../application/health/use-cases/CancelHealthTask';
import { GetHealthTask } from '../application/health/use-cases/GetHealthTask';
import { ListHealthTasks } from '../application/health/use-cases/ListHealthTasks';
import { GetOverdueHealthTasks } from '../application/health/use-cases/GetOverdueHealthTasks';
import { CreateRation } from '../application/health/use-cases/CreateRation';
import { UpdateRation } from '../application/health/use-cases/UpdateRation';
import { GetRationDetails } from '../application/health/use-cases/GetRationDetails';
import { ListRations } from '../application/health/use-cases/ListRations';
import { AddRationIngredient } from '../application/health/use-cases/AddRationIngredient';
import { AssignRationToLot } from '../application/health/use-cases/AssignRationToLot';

// Application - Lots Use Cases
import { CreateLot } from '../application/lots/use-cases/CreateLot';
import { CloseLot } from '../application/lots/use-cases/CloseLot';
import { GetLotDetails } from '../application/lots/use-cases/GetLotDetails';
import { ListLots } from '../application/lots/use-cases/ListLots';
import { ListActiveLotsForFarm } from '../application/lots/use-cases/ListActiveLotsForFarm';
import { UpdateLotAverageWeight } from '../application/lots/use-cases/UpdateLotAverageWeight';
import { CheckLotTargetWeight } from '../application/lots/use-cases/CheckLotTargetWeight';
import { CreatePaddock } from '../application/lots/use-cases/CreatePaddock';
import { UpdatePaddock } from '../application/lots/use-cases/UpdatePaddock';
import { DeletePaddock } from '../application/lots/use-cases/DeletePaddock';
import { GetPaddockDetails } from '../application/lots/use-cases/GetPaddockDetails';
import { ListPaddocks } from '../application/lots/use-cases/ListPaddocks';
import { CheckPaddockCapacity } from '../application/lots/use-cases/CheckPaddockCapacity';
import { UpdatePaddockCondition } from '../application/lots/use-cases/UpdatePaddockCondition';

// Application - Reproduction Use Cases
import { RegisterReproductiveService } from '../application/reproduction/use-cases/RegisterReproductiveService';
import { RecordDiagnosis } from '../application/reproduction/use-cases/RecordDiagnosis';
import { RecordBirth } from '../application/reproduction/use-cases/RecordBirth';
import { RecordWeaning } from '../application/reproduction/use-cases/RecordWeaning';
import { GetReproductiveCycle } from '../application/reproduction/use-cases/GetReproductiveCycle';
import { ListActiveReproductiveCycles } from '../application/reproduction/use-cases/ListActiveReproductiveCycles';
import { CalculateReproductivePerformance } from '../application/reproduction/use-cases/CalculateReproductivePerformance';
import { GetFarmReproductiveStats } from '../application/reproduction/use-cases/GetFarmReproductiveStats';

// Application - SENASAG Use Cases
import { CreateGMA } from '../application/senasag/use-cases/CreateGMA';
import { ApproveGMA } from '../application/senasag/use-cases/ApproveGMA';
import { RejectGMA } from '../application/senasag/use-cases/RejectGMA';
import { MarkGMAInTransit } from '../application/senasag/use-cases/MarkGMAInTransit';
import { CloseGMA } from '../application/senasag/use-cases/CloseGMA';
import { GetGMADetails } from '../application/senasag/use-cases/GetGMADetails';
import { ListGMAs } from '../application/senasag/use-cases/ListGMAs';
import { AddAnimalToGMA } from '../application/senasag/use-cases/AddAnimalToGMA';
import { GetGMAAnimals } from '../application/senasag/use-cases/GetGMAAnimals';
import { CreateRegulatoryDocument } from '../application/senasag/use-cases/CreateRegulatoryDocument';
import { UpdateDocumentStatus } from '../application/senasag/use-cases/UpdateDocumentStatus';
import { ListRegulatoryDocuments } from '../application/senasag/use-cases/ListRegulatoryDocuments';
import { GetExpiringDocuments } from '../application/senasag/use-cases/GetExpiringDocuments';

// Application - Finance Use Cases
import { RecordFinancialMovement } from '../application/finance/use-cases/RecordFinancialMovement';
import { ApproveFinancialMovement } from '../application/finance/use-cases/ApproveFinancialMovement';
import { MarkAsPayment } from '../application/finance/use-cases/MarkAsPayment';
import { CancelFinancialMovement } from '../application/finance/use-cases/CancelFinancialMovement';
import { GetFinancialMovementDetails } from '../application/finance/use-cases/GetFinancialMovementDetails';
import { ListFinancialMovements } from '../application/finance/use-cases/ListFinancialMovements';
import { GetOverduePayments } from '../application/finance/use-cases/GetOverduePayments';
import { CalculateProfit } from '../application/finance/use-cases/CalculateProfit';
import { CalculateLotProfitability } from '../application/finance/use-cases/CalculateLotProfitability';
import { CreateThirdParty } from '../application/finance/use-cases/CreateThirdParty';
import { UpdateThirdParty } from '../application/finance/use-cases/UpdateThirdParty';
import { GetThirdPartyDetails } from '../application/finance/use-cases/GetThirdPartyDetails';
import { ListThirdParties } from '../application/finance/use-cases/ListThirdParties';
import { CreateFinancialCategory } from '../application/finance/use-cases/CreateFinancialCategory';
import { ListFinancialCategories } from '../application/finance/use-cases/ListFinancialCategories';

// Application - Sync Use Cases
import { InitiateSync } from '../application/sync/use-cases/InitiateSync';
import { ApplySyncChanges } from '../application/sync/use-cases/ApplySyncChanges';
import { ResolveConflict } from '../application/sync/use-cases/ResolveConflict';
import { GetSyncStatus } from '../application/sync/use-cases/GetSyncStatus';
import { GetSyncHistory } from '../application/sync/use-cases/GetSyncHistory';
import { ListUnresolvedConflicts } from '../application/sync/use-cases/ListUnresolvedConflicts';

// Presentation - Controllers
import { AuthController } from './controllers/auth/AuthController';
import { UserController } from './controllers/auth/UserController';
import { RoleController } from './controllers/auth/RoleController';
import { PermissionController } from './controllers/auth/PermissionController';
import { AuditController } from './controllers/auth/AuditController';

// Import other controllers (we'll create simple stubs for now)
import { AnimalController } from './controllers/animals/AnimalController';
import { BreedController } from './controllers/animals/BreedController';
import { GenealogyController } from './controllers/animals/GenealogyController';
import { EventController } from './controllers/events/EventController';
import { ProductController } from './controllers/health/ProductController';
import { HealthTaskController } from './controllers/health/HealthTaskController';
import { RationController } from './controllers/health/RationController';
import { LotController } from './controllers/lots/LotController';
import { PaddockController } from './controllers/lots/PaddockController';
import { ReproductionController } from './controllers/reproduction/ReproductionController';
import { GMAController } from './controllers/senasag/GMAController';
import { RegulatoryDocumentController } from './controllers/senasag/RegulatoryDocumentController';
import { FinancialMovementController } from './controllers/finance/FinancialMovementController';
import { ThirdPartyController } from './controllers/finance/ThirdPartyController';
import { FinancialCategoryController } from './controllers/finance/FinancialCategoryController';
import { SyncController } from './controllers/admin/SyncController';

import { RouteControllers } from './routes/v1';

export interface Dependencies {
  jwtService: JwtServiceImpl;
  controllers: RouteControllers;
}

export function createDependencies(prisma: PrismaClient, redis: Redis): Dependencies {
  // === Infrastructure Layer ===

  // Services
  // Note: PrismaService extends PrismaClient, so we need to use it directly
  // We'll type-cast the provided prisma client as PrismaService for now
  const prismaService = prisma as unknown as PrismaService;
  const jwtService = new JwtServiceImpl();
  const passwordHasher = new BcryptService();

  // Repositories - Auth
  const userRepository = new PrismaUserRepository(prismaService);
  const refreshTokenRepository = new PrismaRefreshTokenRepository(prismaService);
  const roleRepository = new PrismaRoleRepository(prismaService);
  const permissionRepository = new PrismaPermissionRepository(prismaService);
  const auditLogRepository = new PrismaAuditLogRepository(prismaService);

  // Repositories - Animals
  const animalRepository = new PrismaAnimalRepository(prismaService);
  const breedRepository = new PrismaBreedRepository(prismaService);
  const genealogyRepository = new PrismaGenealogyRepository(prismaService);

  // Repositories - Events
  const eventRepository = new PrismaEventRepository(prismaService);

  // Repositories - Health
  const productRepository = new PrismaProductRepository(prismaService);
  const inventoryMovementRepository = new PrismaInventoryMovementRepository(prismaService);
  const healthTaskRepository = new PrismaHealthTaskRepository(prismaService);
  const rationRepository = new PrismaRationRepository(prismaService);
  const rationIngredientRepository = new PrismaRationIngredientRepository(prismaService);

  // Repositories - Lots
  const lotRepository = new PrismaLotRepository(prismaService);
  const paddockRepository = new PrismaPaddockRepository(prismaService);

  // Repositories - Reproduction
  const reproductionCycleRepository = new PrismaReproductionCycleRepository(prismaService);

  // Repositories - SENASAG
  const gmaRepository = new PrismaGMARepository(prismaService);
  const regulatoryDocumentRepository = new PrismaRegulatoryDocumentRepository(prismaService);

  // Repositories - Finance
  const financialMovementRepository = new PrismaFinancialMovementRepository(prismaService);
  const thirdPartyRepository = new PrismaThirdPartyRepository(prismaService);
  const financialCategoryRepository = new PrismaFinancialCategoryRepository(prismaService);

  // Repositories - Sync
  const syncLogRepository = new PrismaSyncLogRepository(prismaService);
  const conflictResolutionRepository = new PrismaConflictResolutionRepository(prismaService);

  // Domain Services
  const eventBus = new InMemoryEventBus();
  const birthProjectionService = new BirthProjectionService();
  const adgCalculatorService = new ADGCalculatorService();
  const estimatedBirthDateCalculatorService = new EstimatedBirthDateCalculatorService();
  const inbreedingCalculatorService = new InbreedingCalculatorService(genealogyRepository);
  const withdrawalPeriodCheckerService = new WithdrawalPeriodCheckerService(eventRepository, productRepository);
  const lotFinancialAnalyzerService = new LotFinancialAnalyzerService();
  const conflictDetectorService = new ConflictDetectorService();
  const reproductionKPICalculatorService = new ReproductionKPICalculatorService();

  // Mock Email Service (for now, implement properly later)
  const emailService: IEmailService = {
    async send(options: EmailOptions): Promise<void> {
      console.log('Email sent:', options.to, options.subject);
    },
    async sendPasswordReset(email: string, token: string, userName: string): Promise<void> {
      console.log('Password reset email sent to:', email);
    },
    async sendWelcome(email: string, userName: string): Promise<void> {
      console.log('Welcome email sent to:', email);
    },
  };

  // === Application Layer - Use Cases ===

  // Auth Use Cases - Authentication
  const registerUser = new RegisterUser(userRepository, passwordHasher);
  const loginUser = new LoginUser(userRepository, refreshTokenRepository, passwordHasher, jwtService);
  const refreshTokenUC = new RefreshToken(userRepository, refreshTokenRepository, jwtService);
  const logoutUser = new LogoutUser(refreshTokenRepository);
  const changePasswordUC = new ChangePassword(userRepository, passwordHasher);
  const resetPasswordRequestUC = new ResetPasswordRequest(userRepository, emailService);
  const resetPasswordConfirmUC = new ResetPasswordConfirm(userRepository, passwordHasher);
  const getUserProfile = new GetUserProfile(userRepository);
  const updateUserProfileUC = new UpdateUserProfile(userRepository);

  // Auth Use Cases - User Management
  const listUsersUC = new ListUsers(userRepository);
  const deactivateUserUC = new DeactivateUser(userRepository);
  const activateUserUC = new ActivateUser(userRepository);
  const blockUserUC = new BlockUser(userRepository);
  const assignRoleToUserUC = new AssignRoleToUser(userRepository, roleRepository);
  const removeRoleFromUserUC = new RemoveRoleFromUser(userRepository, roleRepository);

  // Auth Use Cases - Role Management
  const createRoleUC = new CreateRole(roleRepository, permissionRepository);
  const updateRoleUC = new UpdateRole(roleRepository, permissionRepository);
  const deleteRoleUC = new DeleteRole(roleRepository);
  const getRoleDetailsUC = new GetRoleDetails(roleRepository, permissionRepository);
  const listRolesUC = new ListRoles(roleRepository);

  // Auth Use Cases - Permission Management
  const createPermissionUC = new CreatePermission(permissionRepository);
  const updatePermissionUC = new UpdatePermission(permissionRepository);
  const deletePermissionUC = new DeletePermission(permissionRepository);
  const listPermissionsUC = new ListPermissions(permissionRepository);

  // Auth Use Cases - Audit
  const getAuditLogsUC = new GetAuditLogs(auditLogRepository);

  // Animals Use Cases - Animal Management
  const registerAnimalUC = new RegisterAnimal(animalRepository, eventBus);
  const updateAnimalUC = new UpdateAnimal(animalRepository);
  const identifyAnimalUC = new IdentifyAnimal(animalRepository, eventBus);
  const updateAnimalWeightUC = new UpdateAnimalWeight(animalRepository);
  const markAnimalAsDeadUC = new MarkAnimalAsDead(animalRepository, eventBus);
  const markAnimalAsSoldUC = new MarkAnimalAsSold(animalRepository, eventBus);
  const assignAnimalToLotUC = new AssignAnimalToLot(animalRepository, eventBus);
  const assignAnimalToPaddockUC = new AssignAnimalToPaddock(animalRepository);
  const getAnimalDetailsUC = new GetAnimalDetails(animalRepository);
  const listAnimalsUC = new ListAnimals(animalRepository);
  const getActiveAnimalsUC = new GetActiveAnimals(animalRepository);
  const getAnimalsByLotUC = new GetAnimalsByLot(animalRepository);
  const searchAnimalsUC = new SearchAnimals(animalRepository);

  // Animals Use Cases - Breed Management
  const createBreedUC = new CreateBreed(breedRepository);
  const updateBreedUC = new UpdateBreed(breedRepository);
  const deleteBreedUC = new DeleteBreed(breedRepository);
  const getBreedDetailsUC = new GetBreedDetails(breedRepository);
  const listBreedsUC = new ListBreeds(breedRepository);

  // Animals Use Cases - Genealogy
  const recordGenealogyUC = new RecordGenealogy(genealogyRepository, animalRepository);
  const getGenealogyTreeUC = new GetGenealogyTree(genealogyRepository, animalRepository);
  const calculateInbreedingUC = new CalculateInbreeding(inbreedingCalculatorService, animalRepository);

  // Events Use Cases
  const registerEventBirthUC = new RegisterEventBirth(eventRepository);
  const registerEventDeathUC = new RegisterEventDeath(eventRepository);
  const registerEventHealthUC = new RegisterEventHealth(eventRepository);
  const registerEventMovementUC = new RegisterEventMovement(eventRepository);
  const registerEventWeighingUC = new RegisterEventWeighing(eventRepository, adgCalculatorService);
  const registerEventReproductionUC = new RegisterEventReproduction(eventRepository, estimatedBirthDateCalculatorService);
  const registerEventSaleUC = new RegisterEventSale(eventRepository);
  const registerEventPurchaseUC = new RegisterEventPurchase(eventRepository);
  const registerEventWeaningUC = new RegisterEventWeaning(eventRepository);
  const registerEventIdentificationUC = new RegisterEventIdentification(eventRepository);
  const getEventDetailsUC = new GetEventDetails(eventRepository);
  const listEventsByAnimalUC = new ListEventsByAnimal(eventRepository);
  const listEventsByFarmUC = new ListEventsByFarm(eventRepository);
  const bulkRegisterEventsUC = new BulkRegisterEvents(eventRepository);
  const calculateADGUC = new CalculateADG(adgCalculatorService);
  const estimateBirthDateUC = new EstimateBirthDate(estimatedBirthDateCalculatorService);

  // Health Use Cases - Product Management
  const createProductUC = new CreateProduct(productRepository);
  const updateProductUC = new UpdateProduct(productRepository);
  const deactivateProductUC = new DeactivateProduct(productRepository);
  const getProductDetailsUC = new GetProductDetails(productRepository);
  const listProductsUC = new ListProducts(productRepository);
  const getLowStockProductsUC = new GetLowStockProducts(productRepository);
  const recordInventoryMovementUC = new RecordInventoryMovement(productRepository, inventoryMovementRepository);
  const checkProductStockUC = new CheckProductStock(productRepository);
  const checkWithdrawalPeriodUC = new CheckWithdrawalPeriod(withdrawalPeriodCheckerService);

  // Health Use Cases - Health Task Management
  const createHealthTaskUC = new CreateHealthTask(healthTaskRepository);
  const updateHealthTaskUC = new UpdateHealthTask(healthTaskRepository);
  const completeHealthTaskUC = new CompleteHealthTask(healthTaskRepository, eventBus);
  const cancelHealthTaskUC = new CancelHealthTask(healthTaskRepository);
  const getHealthTaskUC = new GetHealthTask(healthTaskRepository);
  const listHealthTasksUC = new ListHealthTasks(healthTaskRepository);
  const getOverdueHealthTasksUC = new GetOverdueHealthTasks(healthTaskRepository);

  // Health Use Cases - Ration Management
  const createRationUC = new CreateRation(rationRepository);
  const updateRationUC = new UpdateRation(rationRepository);
  const getRationDetailsUC = new GetRationDetails(rationRepository, rationIngredientRepository);
  const listRationsUC = new ListRations(rationRepository);
  const addRationIngredientUC = new AddRationIngredient(rationRepository, productRepository, rationIngredientRepository);
  const assignRationToLotUC = new AssignRationToLot(rationRepository, lotRepository);

  // Lots Use Cases - Lot Management
  const createLotUC = new CreateLot(lotRepository, eventBus);
  const closeLotUC = new CloseLot(lotRepository, eventBus);
  const getLotDetailsUC = new GetLotDetails(lotRepository);
  const listLotsUC = new ListLots(lotRepository);
  const listActiveLotsForFarmUC = new ListActiveLotsForFarm(lotRepository);
  const updateLotAverageWeightUC = new UpdateLotAverageWeight(lotRepository);
  const checkLotTargetWeightUC = new CheckLotTargetWeight(lotRepository);

  // Lots Use Cases - Paddock Management
  const createPaddockUC = new CreatePaddock(paddockRepository);
  const updatePaddockUC = new UpdatePaddock(paddockRepository);
  const deletePaddockUC = new DeletePaddock(paddockRepository);
  const getPaddockDetailsUC = new GetPaddockDetails(paddockRepository);
  const listPaddocksUC = new ListPaddocks(paddockRepository);
  const checkPaddockCapacityUC = new CheckPaddockCapacity(paddockRepository);
  const updatePaddockConditionUC = new UpdatePaddockCondition(paddockRepository);

  // Reproduction Use Cases
  const registerReproductiveServiceUC = new RegisterReproductiveService(reproductionCycleRepository, birthProjectionService, eventBus);
  const recordDiagnosisUC = new RecordDiagnosis(reproductionCycleRepository, eventBus);
  const recordBirthUC = new RecordBirth(reproductionCycleRepository, eventBus);
  const recordWeaningUC = new RecordWeaning(reproductionCycleRepository, eventBus);
  const getReproductiveCycleUC = new GetReproductiveCycle(reproductionCycleRepository);
  const listActiveReproductiveCyclesUC = new ListActiveReproductiveCycles(reproductionCycleRepository);
  const calculateReproductivePerformanceUC = new CalculateReproductivePerformance(reproductionCycleRepository, reproductionKPICalculatorService);
  const getFarmReproductiveStatsUC = new GetFarmReproductiveStats(reproductionCycleRepository, reproductionKPICalculatorService);

  // SENASAG Use Cases - GMA Management
  const createGMAUC = new CreateGMA(gmaRepository, regulatoryDocumentRepository, eventBus);
  const approveGMAUC = new ApproveGMA(gmaRepository, eventBus);
  const rejectGMAUC = new RejectGMA(gmaRepository, eventBus);
  const markGMAInTransitUC = new MarkGMAInTransit(gmaRepository, eventBus);
  const closeGMAUC = new CloseGMA(gmaRepository, eventBus);
  const getGMADetailsUC = new GetGMADetails(gmaRepository);
  const listGMAsUC = new ListGMAs(gmaRepository);
  const addAnimalToGMAUC = new AddAnimalToGMA(gmaRepository);
  const getGMAAnimalsUC = new GetGMAAnimals(gmaRepository);

  // SENASAG Use Cases - Regulatory Documents
  const createRegulatoryDocumentUC = new CreateRegulatoryDocument(regulatoryDocumentRepository);
  const updateDocumentStatusUC = new UpdateDocumentStatus(regulatoryDocumentRepository);
  const listRegulatoryDocumentsUC = new ListRegulatoryDocuments(regulatoryDocumentRepository);
  const getExpiringDocumentsUC = new GetExpiringDocuments(regulatoryDocumentRepository);

  // Finance Use Cases - Financial Movements
  const recordFinancialMovementUC = new RecordFinancialMovement(financialMovementRepository, eventBus);
  const approveFinancialMovementUC = new ApproveFinancialMovement(financialMovementRepository);
  const markAsPaymentUC = new MarkAsPayment(financialMovementRepository);
  const cancelFinancialMovementUC = new CancelFinancialMovement(financialMovementRepository);
  const getFinancialMovementDetailsUC = new GetFinancialMovementDetails(financialMovementRepository);
  const listFinancialMovementsUC = new ListFinancialMovements(financialMovementRepository);
  const getOverduePaymentsUC = new GetOverduePayments(financialMovementRepository);
  const calculateProfitUC = new CalculateProfit(financialMovementRepository);
  const calculateLotProfitabilityUC = new CalculateLotProfitability(financialMovementRepository, lotFinancialAnalyzerService);

  // Finance Use Cases - Third Party Management
  const createThirdPartyUC = new CreateThirdParty(thirdPartyRepository);
  const updateThirdPartyUC = new UpdateThirdParty(thirdPartyRepository);
  const getThirdPartyDetailsUC = new GetThirdPartyDetails(thirdPartyRepository);
  const listThirdPartiesUC = new ListThirdParties(thirdPartyRepository);

  // Finance Use Cases - Category Management
  const createFinancialCategoryUC = new CreateFinancialCategory(financialCategoryRepository);
  const listFinancialCategoriesUC = new ListFinancialCategories(financialCategoryRepository);

  // Sync Use Cases
  const initiateSyncUC = new InitiateSync(syncLogRepository, eventBus);
  const applySyncChangesUC = new ApplySyncChanges(syncLogRepository, conflictResolutionRepository, conflictDetectorService, eventBus);
  const resolveConflictUC = new ResolveConflict(conflictResolutionRepository);
  const getSyncStatusUC = new GetSyncStatus(syncLogRepository, conflictResolutionRepository);
  const getSyncHistoryUC = new GetSyncHistory(syncLogRepository);
  const listUnresolvedConflictsUC = new ListUnresolvedConflicts(conflictResolutionRepository);

  // === Presentation Layer - Controllers ===

  const authController = new AuthController(
    registerUser,
    loginUser,
    refreshTokenUC,
    logoutUser,
    changePasswordUC,
    resetPasswordRequestUC,
    resetPasswordConfirmUC,
    getUserProfile,
    updateUserProfileUC,
  );

  const userController = new UserController(
    listUsersUC,
    getUserProfile,
    deactivateUserUC,
    activateUserUC,
    blockUserUC,
    assignRoleToUserUC,
    removeRoleFromUserUC,
  );

  const roleController = new RoleController(
    createRoleUC,
    updateRoleUC,
    deleteRoleUC,
    getRoleDetailsUC,
    listRolesUC,
  );

  const permissionController = new PermissionController(
    createPermissionUC,
    updatePermissionUC,
    deletePermissionUC,
    listPermissionsUC,
  );

  const auditController = new AuditController(
    getAuditLogsUC,
  );

  // Animal Controllers
  const animalController = new AnimalController(
    registerAnimalUC,
    updateAnimalUC,
    identifyAnimalUC,
    updateAnimalWeightUC,
    markAnimalAsDeadUC,
    markAnimalAsSoldUC,
    assignAnimalToLotUC,
    assignAnimalToPaddockUC,
    getAnimalDetailsUC,
    listAnimalsUC,
    getActiveAnimalsUC,
    getAnimalsByLotUC,
    searchAnimalsUC,
  );

  const breedController = new BreedController(
    createBreedUC,
    updateBreedUC,
    deleteBreedUC,
    getBreedDetailsUC,
    listBreedsUC,
  );

  const genealogyController = new GenealogyController(
    recordGenealogyUC,
    getGenealogyTreeUC,
    calculateInbreedingUC,
  );

  // Event Controllers
  const eventController = new EventController(
    registerEventBirthUC,
    registerEventDeathUC,
    registerEventHealthUC,
    registerEventMovementUC,
    registerEventWeighingUC,
    registerEventReproductionUC,
    registerEventSaleUC,
    registerEventPurchaseUC,
    registerEventWeaningUC,
    registerEventIdentificationUC,
    getEventDetailsUC,
    listEventsByAnimalUC,
    listEventsByFarmUC,
    bulkRegisterEventsUC,
    calculateADGUC,
    estimateBirthDateUC,
  );

  // Health Controllers
  const productController = new ProductController(
    createProductUC,
    updateProductUC,
    deactivateProductUC,
    getProductDetailsUC,
    listProductsUC,
    getLowStockProductsUC,
    recordInventoryMovementUC,
    checkProductStockUC,
    checkWithdrawalPeriodUC,
  );

  const healthTaskController = new HealthTaskController(
    createHealthTaskUC,
    updateHealthTaskUC,
    completeHealthTaskUC,
    cancelHealthTaskUC,
    getHealthTaskUC,
    listHealthTasksUC,
    getOverdueHealthTasksUC,
  );

  const rationController = new RationController(
    createRationUC,
    updateRationUC,
    getRationDetailsUC,
    listRationsUC,
    addRationIngredientUC,
    assignRationToLotUC,
  );

  // Lot Controllers
  const lotController = new LotController(
    createLotUC,
    closeLotUC,
    getLotDetailsUC,
    listLotsUC,
    listActiveLotsForFarmUC,
    updateLotAverageWeightUC,
    checkLotTargetWeightUC,
  );

  const paddockController = new PaddockController(
    createPaddockUC,
    updatePaddockUC,
    deletePaddockUC,
    getPaddockDetailsUC,
    listPaddocksUC,
    checkPaddockCapacityUC,
    updatePaddockConditionUC,
  );

  // Reproduction Controllers
  const reproductionController = new ReproductionController(
    registerReproductiveServiceUC,
    recordDiagnosisUC,
    recordBirthUC,
    recordWeaningUC,
    getReproductiveCycleUC,
    listActiveReproductiveCyclesUC,
    calculateReproductivePerformanceUC,
    getFarmReproductiveStatsUC,
  );

  // SENASAG Controllers
  const gmaController = new GMAController(
    createGMAUC,
    approveGMAUC,
    rejectGMAUC,
    markGMAInTransitUC,
    closeGMAUC,
    getGMADetailsUC,
    listGMAsUC,
    addAnimalToGMAUC,
    getGMAAnimalsUC,
  );

  const regulatoryDocumentController = new RegulatoryDocumentController(
    createRegulatoryDocumentUC,
    updateDocumentStatusUC,
    listRegulatoryDocumentsUC,
    getExpiringDocumentsUC,
  );

  // Finance Controllers
  const financialMovementController = new FinancialMovementController(
    recordFinancialMovementUC,
    approveFinancialMovementUC,
    markAsPaymentUC,
    cancelFinancialMovementUC,
    getFinancialMovementDetailsUC,
    listFinancialMovementsUC,
    getOverduePaymentsUC,
    calculateProfitUC,
    calculateLotProfitabilityUC,
  );

  const thirdPartyController = new ThirdPartyController(
    createThirdPartyUC,
    updateThirdPartyUC,
    getThirdPartyDetailsUC,
    listThirdPartiesUC,
  );

  const financialCategoryController = new FinancialCategoryController(
    createFinancialCategoryUC,
    listFinancialCategoriesUC,
  );

  // Sync Controllers
  const syncController = new SyncController(
    initiateSyncUC,
    applySyncChangesUC,
    resolveConflictUC,
    getSyncStatusUC,
    getSyncHistoryUC,
    listUnresolvedConflictsUC,
  );

  const controllers: RouteControllers = {
    auth: {
      authController,
      userController,
      roleController,
      permissionController,
      auditController,
    },
    animals: {
      animalController,
      breedController,
      genealogyController,
    },
    events: {
      eventController,
    },
    health: {
      productController,
      healthTaskController,
      rationController,
    },
    lots: {
      lotController,
      paddockController,
    },
    reproduction: {
      reproductionController,
    },
    senasag: {
      gmaController,
      documentController: regulatoryDocumentController,
    },
    finance: {
      movementController: financialMovementController,
      thirdPartyController,
      categoryController: financialCategoryController,
    },
    admin: {
      syncController,
    },
  };

  return {
    jwtService,
    controllers,
  };
}
