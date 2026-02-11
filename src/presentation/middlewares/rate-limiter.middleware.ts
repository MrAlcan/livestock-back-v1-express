import rateLimit from 'express-rate-limit';

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Demasiados requests. Intenta de nuevo más tarde.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1000,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Has excedido el límite de requests. Intenta de nuevo en 1 hora.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Demasiados intentos de login. Intenta de nuevo en 15 minutos.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
