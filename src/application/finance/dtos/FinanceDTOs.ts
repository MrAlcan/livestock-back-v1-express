import { FinancialType, FinancialStatus, PaymentMethod, IDType } from '../../../domain/finance/enums';

// ── Financial Movement Input DTOs ─────────────────────────────────────────────

export interface RecordFinancialMovementInputDTO {
  readonly voucherNumber?: string;
  readonly type: FinancialType;
  readonly category: string;
  readonly subcategory?: string;
  readonly amount: number;
  readonly currency?: string;
  readonly exchangeRate?: number;
  readonly date: string;
  readonly dueDate?: string;
  readonly paymentMethod?: PaymentMethod;
  readonly description: string;
  readonly thirdPartyId?: string;
  readonly gmaId?: string;
  readonly lotId?: string;
  readonly productId?: string;
  readonly registeredBy: string;
  readonly isRecurring?: boolean;
  readonly frequency?: string;
  readonly documentUrl?: string;
  readonly observations?: string;
}

export interface ApproveFinancialMovementInputDTO {
  readonly movementId: string;
  readonly approvedBy: string;
}

export interface MarkAsPaymentInputDTO {
  readonly movementId: string;
  readonly paymentDate: string;
  readonly paymentMethod: PaymentMethod;
}

export interface FinancialMovementResponseDTO {
  readonly id: string;
  readonly voucherNumber?: string;
  readonly type: string;
  readonly category: string;
  readonly subcategory?: string;
  readonly amount: number;
  readonly currency: string;
  readonly exchangeRate?: number;
  readonly baseAmount?: number;
  readonly date: string;
  readonly dueDate?: string;
  readonly paymentDate?: string;
  readonly paymentMethod?: string;
  readonly description: string;
  readonly thirdPartyId?: string;
  readonly gmaId?: string;
  readonly lotId?: string;
  readonly productId?: string;
  readonly registeredBy: string;
  readonly approvedBy?: string;
  readonly status: string;
  readonly isRecurring: boolean;
  readonly frequency?: string;
  readonly documentUrl?: string;
  readonly observations?: string;
}

export interface FinancialFiltersInputDTO {
  readonly type?: FinancialType;
  readonly category?: string;
  readonly status?: FinancialStatus;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly thirdPartyId?: string;
  readonly lotId?: string;
  readonly search?: string;
}

// ── Third Party Input DTOs ────────────────────────────────────────────────────

export interface CreateThirdPartyInputDTO {
  readonly code?: string;
  readonly name: string;
  readonly tradeName?: string;
  readonly type: string;
  readonly subtype?: string;
  readonly taxId?: string;
  readonly idType?: IDType;
  readonly address?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly contactPerson?: string;
  readonly creditDays?: number;
  readonly creditLimit?: number;
  readonly observations?: string;
}

export interface UpdateThirdPartyInputDTO {
  readonly id: string;
  readonly name?: string;
  readonly tradeName?: string;
  readonly address?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly contactPerson?: string;
  readonly creditDays?: number;
  readonly creditLimit?: number;
  readonly observations?: string;
}

export interface ThirdPartyResponseDTO {
  readonly id: string;
  readonly code?: string;
  readonly name: string;
  readonly tradeName?: string;
  readonly type: string;
  readonly subtype?: string;
  readonly taxId?: string;
  readonly idType?: string;
  readonly address?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly contactPerson?: string;
  readonly rating?: number;
  readonly creditDays?: number;
  readonly creditLimit?: number;
  readonly currentBalance?: number;
  readonly active: boolean;
  readonly observations?: string;
}

export interface ThirdPartyFiltersInputDTO {
  readonly type?: string;
  readonly subtype?: string;
  readonly active?: boolean;
  readonly search?: string;
}

// ── Financial Category DTOs ───────────────────────────────────────────────────

export interface CreateFinancialCategoryInputDTO {
  readonly code: string;
  readonly name: string;
  readonly type?: FinancialType;
  readonly parentId?: number;
  readonly description?: string;
}

export interface FinancialCategoryResponseDTO {
  readonly id: number;
  readonly code: string;
  readonly name: string;
  readonly type?: string;
  readonly parentId?: number;
  readonly level?: number;
  readonly description?: string;
  readonly active: boolean;
}

// ── Report / Analysis DTOs ────────────────────────────────────────────────────

export interface ProfitCalculationResponseDTO {
  readonly startDate: string;
  readonly endDate: string;
  readonly totalIncome: number;
  readonly totalExpense: number;
  readonly profit: number;
  readonly profitMargin: number;
}

export interface LotProfitabilityResponseDTO {
  readonly lotId: string;
  readonly totalCost: number;
  readonly totalIncome: number;
  readonly profit: number;
  readonly roi: number;
  readonly profitPerAnimal?: number;
}

export interface OverduePaymentResponseDTO {
  readonly id: string;
  readonly voucherNumber?: string;
  readonly amount: number;
  readonly currency: string;
  readonly dueDate: string;
  readonly daysOverdue: number;
  readonly thirdPartyId?: string;
}
