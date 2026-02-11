import { DomainError } from '../../shared/DomainError';

export class ThirdPartyNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`Third party not found: ${identifier}`, 'THIRD_PARTY_NOT_FOUND');
  }
}

export class InvalidAmountError extends DomainError {
  constructor(message: string = 'Invalid amount') {
    super(message, 'INVALID_AMOUNT');
  }
}

export class PaymentOverdueError extends DomainError {
  constructor(movementId: string) {
    super(`Payment is overdue for movement ${movementId}`, 'PAYMENT_OVERDUE');
  }
}

export class CreditLimitExceededError extends DomainError {
  constructor(thirdPartyName: string) {
    super(`Credit limit exceeded for ${thirdPartyName}`, 'CREDIT_LIMIT_EXCEEDED');
  }
}

export class FinancialMovementNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`Financial movement not found: ${identifier}`, 'FINANCIAL_MOVEMENT_NOT_FOUND');
  }
}

export class InvalidRTAError extends DomainError {
  constructor(thirdPartyName: string) {
    super(`RTA is invalid or expired for ${thirdPartyName}`, 'INVALID_RTA');
  }
}

export class CategoryNotFoundError extends DomainError {
  constructor(identifier: string | number) {
    super(`Financial category not found: ${identifier}`, 'CATEGORY_NOT_FOUND');
  }
}
