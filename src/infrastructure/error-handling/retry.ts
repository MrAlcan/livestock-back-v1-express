import { Logger } from '../logging/logger.service';

export interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoffFactor?: number;
  shouldRetry?: (error: unknown) => boolean;
}

const defaultOptions: Required<RetryOptions> = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffFactor: 2,
  shouldRetry: () => true,
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const opts = { ...defaultOptions, ...options };
  const logger = new Logger('RetryLogic');

  let lastError: unknown;
  let delay = opts.delayMs;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (!opts.shouldRetry(error) || attempt === opts.maxAttempts) {
        throw error;
      }

      logger.warn(
        `Attempt ${attempt}/${opts.maxAttempts} failed, retrying in ${delay}ms...`,
        { error: error instanceof Error ? error.message : String(error) },
      );

      await sleep(delay);
      delay *= opts.backoffFactor;
    }
  }

  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
