export class Result<T> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  private readonly _value?: T;
  private readonly _error?: string;

  private constructor(isSuccess: boolean, value?: T, error?: string) {
    if (isSuccess && error) {
      throw new Error('A successful result cannot have an error');
    }
    if (!isSuccess && !error) {
      throw new Error('A failing result must have an error message');
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this._value = value;
    this._error = error;
  }

  get value(): T {
    if (this.isFailure) {
      throw new Error('Cannot get value of a failed result');
    }
    return this._value as T;
  }

  get error(): string {
    if (this.isSuccess) {
      throw new Error('Cannot get error of a successful result');
    }
    return this._error as string;
  }

  static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, value);
  }

  static fail<U>(error: string): Result<U> {
    return new Result<U>(false, undefined, error);
  }

  static combine(results: Result<unknown>[]): Result<void> {
    for (const result of results) {
      if (result.isFailure) {
        return Result.fail(result.error);
      }
    }
    return Result.ok();
  }
}
