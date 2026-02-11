import { DomainError } from '../../shared/DomainError';

export class EventNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`Event not found: ${identifier}`, 'EVENT_NOT_FOUND');
  }
}

export class InvalidEventDateError extends DomainError {
  constructor(message: string = 'Invalid event date') {
    super(message, 'INVALID_EVENT_DATE');
  }
}

export class EventImmutableError extends DomainError {
  constructor() {
    super('Events are immutable and cannot be modified after creation', 'EVENT_IMMUTABLE');
  }
}

export class InvalidADGError extends DomainError {
  constructor(value: number) {
    super(`ADG value ${value} is out of valid range (-1 to 3 kg/day)`, 'INVALID_ADG');
  }
}

export class PreviousWeighingNotFoundError extends DomainError {
  constructor(animalId: string) {
    super(`No previous weighing found for animal ${animalId}`, 'PREVIOUS_WEIGHING_NOT_FOUND');
  }
}

export class InvalidGestationPeriodError extends DomainError {
  constructor(message: string = 'Invalid gestation period') {
    super(message, 'INVALID_GESTATION_PERIOD');
  }
}
