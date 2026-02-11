import { InventoryMovementType, TaskType, TaskPriority, TaskStatus, RationType } from '../../../domain/health/enums';

// ── Product Input DTOs ───────────────────────────────────────────────────────

export interface CreateProductInputDTO {
  readonly code: string;
  readonly name: string;
  readonly commercialName?: string;
  readonly genericName?: string;
  readonly type: string;
  readonly category?: string;
  readonly currentStock: number;
  readonly minStock?: number;
  readonly maxStock?: number;
  readonly unit: string;
  readonly unitCost?: number;
  readonly salePrice?: number;
  readonly withdrawalDays: number;
  readonly activeIngredient?: string;
  readonly concentration?: string;
  readonly manufacturer?: string;
  readonly requiresPrescription?: boolean;
  readonly isRefrigerated?: boolean;
  readonly storageTemperature?: string;
  readonly observations?: string;
}

export interface UpdateProductInputDTO {
  readonly id: string;
  readonly name?: string;
  readonly commercialName?: string;
  readonly category?: string;
  readonly unitCost?: number;
  readonly salePrice?: number;
  readonly minStock?: number;
  readonly maxStock?: number;
  readonly observations?: string;
}

// ── Product Response DTOs ────────────────────────────────────────────────────

export interface ProductResponseDTO {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly commercialName?: string;
  readonly genericName?: string;
  readonly type: string;
  readonly category?: string;
  readonly currentStock: number;
  readonly minStock?: number;
  readonly maxStock?: number;
  readonly unit: string;
  readonly unitCost?: number;
  readonly salePrice?: number;
  readonly withdrawalDays: number;
  readonly activeIngredient?: string;
  readonly concentration?: string;
  readonly manufacturer?: string;
  readonly requiresPrescription: boolean;
  readonly isRefrigerated: boolean;
  readonly storageTemperature?: string;
  readonly observations?: string;
  readonly active: boolean;
}

// ── Product Filters ──────────────────────────────────────────────────────────

export interface ProductFiltersInputDTO {
  readonly type?: string;
  readonly category?: string;
  readonly active?: boolean;
  readonly search?: string;
  readonly lowStock?: boolean;
}

// ── Inventory Movement DTOs ──────────────────────────────────────────────────

export interface RecordInventoryMovementInputDTO {
  readonly productId: string;
  readonly movementType: InventoryMovementType;
  readonly quantity: number;
  readonly unit: string;
  readonly unitCost?: number;
  readonly movementDate: string;
  readonly productBatch?: string;
  readonly expirationDate?: string;
  readonly supplierId?: string;
  readonly reason?: string;
  readonly registeredBy: string;
}

export interface InventoryMovementResponseDTO {
  readonly id: string;
  readonly productId: string;
  readonly movementType: string;
  readonly quantity: number;
  readonly unit: string;
  readonly unitCost?: number;
  readonly totalCost?: number;
  readonly previousStock: number;
  readonly newStock: number;
  readonly movementDate: string;
  readonly productBatch?: string;
  readonly registeredBy: string;
  readonly reason?: string;
}

// ── Stock Status ─────────────────────────────────────────────────────────────

export interface StockStatusResponseDTO {
  readonly productId: string;
  readonly productName: string;
  readonly currentStock: number;
  readonly minStock?: number;
  readonly maxStock?: number;
  readonly isLowStock: boolean;
  readonly unit: string;
}

// ── Health Task Input DTOs ───────────────────────────────────────────────────

export interface CreateHealthTaskInputDTO {
  readonly name: string;
  readonly type?: TaskType;
  readonly creatorId: string;
  readonly assignedTo?: string;
  readonly productId?: string;
  readonly estimatedQuantity?: number;
  readonly startDate?: string;
  readonly dueDate: string;
  readonly priority: TaskPriority;
  readonly requiresNotification?: boolean;
  readonly instructions?: string;
  readonly observations?: string;
}

export interface UpdateHealthTaskInputDTO {
  readonly id: string;
  readonly name?: string;
  readonly assignedTo?: string;
  readonly status?: TaskStatus;
  readonly completionPct?: number;
  readonly observations?: string;
}

// ── Health Task Response DTO ─────────────────────────────────────────────────

export interface HealthTaskResponseDTO {
  readonly id: string;
  readonly code?: string;
  readonly name: string;
  readonly type?: string;
  readonly creatorId: string;
  readonly assignedTo?: string;
  readonly productId?: string;
  readonly estimatedQuantity?: number;
  readonly startDate?: string;
  readonly dueDate: string;
  readonly priority: string;
  readonly status: string;
  readonly completedDate?: string;
  readonly completionPct: number;
  readonly observations?: string;
  readonly instructions?: string;
  readonly requiresNotification: boolean;
}

// ── Health Task Filters ──────────────────────────────────────────────────────

export interface TaskFiltersInputDTO {
  readonly type?: string;
  readonly priority?: string;
  readonly status?: string;
  readonly assignedTo?: string;
  readonly search?: string;
}

// ── Ration Input DTOs ────────────────────────────────────────────────────────

export interface CreateRationInputDTO {
  readonly code: string;
  readonly name: string;
  readonly type: RationType;
  readonly farmId: string;
  readonly description?: string;
  readonly dryMatterPct?: number;
  readonly proteinPct?: number;
  readonly energyMcalKg?: number;
  readonly costPerTon?: number;
  readonly estimatedConversion?: number;
}

export interface UpdateRationInputDTO {
  readonly id: string;
  readonly name?: string;
  readonly description?: string;
  readonly dryMatterPct?: number;
  readonly proteinPct?: number;
  readonly energyMcalKg?: number;
  readonly costPerTon?: number;
  readonly estimatedConversion?: number;
}

// ── Ration Response DTOs ─────────────────────────────────────────────────────

export interface RationResponseDTO {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly type: string;
  readonly farmId: string;
  readonly description?: string;
  readonly dryMatterPct?: number;
  readonly proteinPct?: number;
  readonly energyMcalKg?: number;
  readonly costPerTon?: number;
  readonly estimatedConversion?: number;
  readonly active: boolean;
}

// ── Ration Ingredient DTOs ───────────────────────────────────────────────────

export interface AddRationIngredientInputDTO {
  readonly rationId: string;
  readonly productId: string;
  readonly percentage: number;
  readonly kgPerTon?: number;
}

export interface RationIngredientResponseDTO {
  readonly id: string;
  readonly rationId: string;
  readonly productId: string;
  readonly percentage: number;
  readonly kgPerTon?: number;
  readonly order?: number;
}

// ── Ration Detail ────────────────────────────────────────────────────────────

export interface RationDetailResponseDTO extends RationResponseDTO {
  readonly ingredients: RationIngredientResponseDTO[];
}

// ── Assign Ration To Lot ─────────────────────────────────────────────────────

export interface AssignRationToLotInputDTO {
  readonly rationId: string;
  readonly lotId: string;
}
