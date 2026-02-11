import { DomainError } from '../../shared/DomainError';

export class ProductNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`Product not found: ${identifier}`, 'PRODUCT_NOT_FOUND');
  }
}

export class InsufficientStockError extends DomainError {
  constructor(productName: string, available: number, required: number) {
    super(`Insufficient stock for ${productName}: available ${available}, required ${required}`, 'INSUFFICIENT_STOCK');
  }
}

export class InvalidStockQuantityError extends DomainError {
  constructor(message: string = 'Invalid stock quantity') {
    super(message, 'INVALID_STOCK_QUANTITY');
  }
}

export class ProductInWithdrawalPeriodError extends DomainError {
  constructor(animalId: string, endDate: Date) {
    super(`Animal ${animalId} is in withdrawal period until ${endDate.toISOString()}`, 'PRODUCT_IN_WITHDRAWAL');
  }
}

export class HealthTaskNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`Health task not found: ${identifier}`, 'HEALTH_TASK_NOT_FOUND');
  }
}

export class TaskAlreadyCompletedError extends DomainError {
  constructor(taskId: string) {
    super(`Task ${taskId} is already completed`, 'TASK_ALREADY_COMPLETED');
  }
}

export class RationNotBalancedError extends DomainError {
  constructor(totalPercentage: number) {
    super(`Ration is not balanced: total percentage is ${totalPercentage}%, expected 100%`, 'RATION_NOT_BALANCED');
  }
}

export class InvalidDoseError extends DomainError {
  constructor(message: string = 'Invalid dose') {
    super(message, 'INVALID_DOSE');
  }
}
