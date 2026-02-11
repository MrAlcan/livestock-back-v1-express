import { DomainError } from '../../shared/DomainError';

export class UserNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`, 'USER_NOT_FOUND');
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Invalid email or password', 'INVALID_CREDENTIALS');
  }
}

export class UserAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`User with email ${email} already exists`, 'USER_ALREADY_EXISTS');
  }
}

export class InvalidTokenError extends DomainError {
  constructor() {
    super('Invalid or expired token', 'INVALID_TOKEN');
  }
}

export class RoleNotFoundError extends DomainError {
  constructor(identifier: string | number) {
    super(`Role not found: ${identifier}`, 'ROLE_NOT_FOUND');
  }
}

export class PermissionNotFoundError extends DomainError {
  constructor(identifier: string | number) {
    super(`Permission not found: ${identifier}`, 'PERMISSION_NOT_FOUND');
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 'UNAUTHORIZED');
  }
}

export class AccountBlockedError extends DomainError {
  constructor() {
    super('Account is blocked', 'ACCOUNT_BLOCKED');
  }
}
