import { DomainError } from '../../shared/DomainError';

export class FemaleNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`Female not found: ${identifier}`, 'FEMALE_NOT_FOUND');
  }
}

export class InvalidServiceDateError extends DomainError {
  constructor(message: string = 'Invalid service date') {
    super(message, 'INVALID_SERVICE_DATE');
  }
}

export class AlreadyPregnantError extends DomainError {
  constructor(animalId: string) {
    super(`Animal ${animalId} is already pregnant`, 'ALREADY_PREGNANT');
  }
}

export class NotPregnantError extends DomainError {
  constructor(animalId: string) {
    super(`Animal ${animalId} is not pregnant`, 'NOT_PREGNANT');
  }
}

export class InvalidWeaningAgeError extends DomainError {
  constructor(ageDays: number) {
    super(`Invalid weaning age: ${ageDays} days`, 'INVALID_WEANING_AGE');
  }
}
