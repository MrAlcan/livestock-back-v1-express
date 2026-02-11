import { DomainError } from '../../shared/DomainError';

export class LotNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`Lot not found: ${identifier}`, 'LOT_NOT_FOUND');
  }
}

export class LotAlreadyClosedError extends DomainError {
  constructor(lotId: string) {
    super(`Lot ${lotId} is already closed`, 'LOT_ALREADY_CLOSED');
  }
}

export class PaddockNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`Paddock not found: ${identifier}`, 'PADDOCK_NOT_FOUND');
  }
}

export class PaddockAtCapacityError extends DomainError {
  constructor(paddockId: string) {
    super(`Paddock ${paddockId} is at capacity`, 'PADDOCK_AT_CAPACITY');
  }
}

export class PaddockNeedsRestError extends DomainError {
  constructor(paddockId: string) {
    super(`Paddock ${paddockId} needs rest`, 'PADDOCK_NEEDS_REST');
  }
}

export class InvalidLotQuantityError extends DomainError {
  constructor(message: string = 'Invalid lot quantity') {
    super(message, 'INVALID_LOT_QUANTITY');
  }
}
