export interface MappedError {
  statusCode: number;
  code: string;
  message: string;
}

const ERROR_MAP: Record<string, { statusCode: number; code: string }> = {
  ANIMAL_NOT_FOUND: { statusCode: 404, code: 'ANIMAL_NOT_FOUND' },
  USER_NOT_FOUND: { statusCode: 404, code: 'USER_NOT_FOUND' },
  LOT_NOT_FOUND: { statusCode: 404, code: 'LOT_NOT_FOUND' },
  PADDOCK_NOT_FOUND: { statusCode: 404, code: 'PADDOCK_NOT_FOUND' },
  EVENT_NOT_FOUND: { statusCode: 404, code: 'EVENT_NOT_FOUND' },
  GMA_NOT_FOUND: { statusCode: 404, code: 'GMA_NOT_FOUND' },
  PRODUCT_NOT_FOUND: { statusCode: 404, code: 'PRODUCT_NOT_FOUND' },
  BREED_NOT_FOUND: { statusCode: 404, code: 'BREED_NOT_FOUND' },
  ROLE_NOT_FOUND: { statusCode: 404, code: 'ROLE_NOT_FOUND' },
  MOVEMENT_NOT_FOUND: { statusCode: 404, code: 'MOVEMENT_NOT_FOUND' },
  THIRD_PARTY_NOT_FOUND: { statusCode: 404, code: 'THIRD_PARTY_NOT_FOUND' },
  DOCUMENT_NOT_FOUND: { statusCode: 404, code: 'DOCUMENT_NOT_FOUND' },
  TASK_NOT_FOUND: { statusCode: 404, code: 'TASK_NOT_FOUND' },
  RATION_NOT_FOUND: { statusCode: 404, code: 'RATION_NOT_FOUND' },

  INVALID_CREDENTIALS: { statusCode: 401, code: 'INVALID_CREDENTIALS' },
  TOKEN_EXPIRED: { statusCode: 401, code: 'TOKEN_EXPIRED' },
  INVALID_TOKEN: { statusCode: 401, code: 'INVALID_TOKEN' },
  REFRESH_TOKEN_EXPIRED: { statusCode: 401, code: 'REFRESH_TOKEN_EXPIRED' },

  INSUFFICIENT_PERMISSIONS: { statusCode: 403, code: 'INSUFFICIENT_PERMISSIONS' },

  DUPLICATE_EMAIL: { statusCode: 409, code: 'DUPLICATE_EMAIL' },
  DUPLICATE_OFFICIAL_ID: { statusCode: 409, code: 'DUPLICATE_OFFICIAL_ID' },
  DUPLICATE_CODE: { statusCode: 409, code: 'DUPLICATE_CODE' },
  DUPLICATE_TAX_ID: { statusCode: 409, code: 'DUPLICATE_TAX_ID' },

  WITHDRAWAL_PERIOD_VIOLATION: { statusCode: 422, code: 'WITHDRAWAL_PERIOD_VIOLATION' },
  INSUFFICIENT_STOCK: { statusCode: 422, code: 'INSUFFICIENT_STOCK' },
  GMA_VALIDATION_FAILED: { statusCode: 422, code: 'GMA_VALIDATION_FAILED' },
  RUNSA_EXPIRED: { statusCode: 422, code: 'RUNSA_EXPIRED' },
  INVALID_STATUS_TRANSITION: { statusCode: 422, code: 'INVALID_STATUS_TRANSITION' },
  LOT_FULL: { statusCode: 422, code: 'LOT_FULL' },
  PADDOCK_FULL: { statusCode: 422, code: 'PADDOCK_FULL' },
  ANIMAL_ALREADY_DEAD: { statusCode: 422, code: 'ANIMAL_ALREADY_DEAD' },
  ANIMAL_ALREADY_SOLD: { statusCode: 422, code: 'ANIMAL_ALREADY_SOLD' },
  PASSWORD_MISMATCH: { statusCode: 422, code: 'PASSWORD_MISMATCH' },
  USER_BLOCKED: { statusCode: 422, code: 'USER_BLOCKED' },
  USER_INACTIVE: { statusCode: 422, code: 'USER_INACTIVE' },
};

export function mapDomainError(errorMessage: string): MappedError {
  const upperError = errorMessage.toUpperCase().replace(/ /g, '_');

  for (const [key, value] of Object.entries(ERROR_MAP)) {
    if (upperError.includes(key)) {
      return {
        statusCode: value.statusCode,
        code: value.code,
        message: errorMessage,
      };
    }
  }

  return {
    statusCode: 400,
    code: 'BUSINESS_RULE_VIOLATION',
    message: errorMessage,
  };
}
