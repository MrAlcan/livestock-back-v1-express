import { DomainError } from '../../shared/DomainError';

export class AnimalNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`Animal not found: ${identifier}`, 'ANIMAL_NOT_FOUND');
  }
}

export class InvalidWeightError extends DomainError {
  constructor(message: string = 'Invalid weight value') {
    super(message, 'INVALID_WEIGHT');
  }
}

export class InvalidBirthDateError extends DomainError {
  constructor(message: string = 'Invalid birth date') {
    super(message, 'INVALID_BIRTH_DATE');
  }
}

export class AnimalCannotBeSelfParentError extends DomainError {
  constructor() {
    super('An animal cannot be its own parent', 'ANIMAL_SELF_PARENT');
  }
}

export class AnimalAlreadyDeadError extends DomainError {
  constructor(animalId: string) {
    super(`Animal ${animalId} is already dead`, 'ANIMAL_ALREADY_DEAD');
  }
}

export class AnimalAlreadySoldError extends DomainError {
  constructor(animalId: string) {
    super(`Animal ${animalId} is already sold`, 'ANIMAL_ALREADY_SOLD');
  }
}

export class MotherMustBeFemaleError extends DomainError {
  constructor() {
    super('Mother must be female', 'MOTHER_MUST_BE_FEMALE');
  }
}

export class FatherMustBeMaleError extends DomainError {
  constructor() {
    super('Father must be male', 'FATHER_MUST_BE_MALE');
  }
}
