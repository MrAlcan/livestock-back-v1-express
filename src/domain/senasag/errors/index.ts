import { DomainError } from '../../shared/DomainError';

export class GMANotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`GMA not found: ${identifier}`, 'GMA_NOT_FOUND');
  }
}

export class RUNSANotFoundError extends DomainError {
  constructor(farmId: string) {
    super(`RUNSA not found for farm: ${farmId}`, 'RUNSA_NOT_FOUND');
  }
}

export class RUNSAExpiredError extends DomainError {
  constructor(farmId: string) {
    super(`RUNSA is expired for farm: ${farmId}`, 'RUNSA_EXPIRED');
  }
}

export class AnimalNotValidForGMAError extends DomainError {
  constructor(animalId: string, reason: string) {
    super(`Animal ${animalId} is not valid for GMA: ${reason}`, 'ANIMAL_NOT_VALID_FOR_GMA');
  }
}

export class VaccineNotValidError extends DomainError {
  constructor(animalId: string) {
    super(`Animal ${animalId} does not have a valid Aftosa vaccine`, 'VACCINE_NOT_VALID');
  }
}

export class WithdrawalPeriodViolationError extends DomainError {
  constructor(animalId: string) {
    super(`Animal ${animalId} is in a withdrawal period`, 'WITHDRAWAL_PERIOD_VIOLATION');
  }
}

export class GMAAlreadyApprovedError extends DomainError {
  constructor(gmaId: string) {
    super(`GMA ${gmaId} is already approved`, 'GMA_ALREADY_APPROVED');
  }
}

export class GMANotApprovedError extends DomainError {
  constructor(gmaId: string) {
    super(`GMA ${gmaId} is not approved yet`, 'GMA_NOT_APPROVED');
  }
}

export class GMAExpiredError extends DomainError {
  constructor(gmaId: string) {
    super(`GMA ${gmaId} has expired`, 'GMA_EXPIRED');
  }
}

export class InvalidGMACodeError extends DomainError {
  constructor(code: string) {
    super(`Invalid GMA code: ${code}`, 'INVALID_GMA_CODE');
  }
}
