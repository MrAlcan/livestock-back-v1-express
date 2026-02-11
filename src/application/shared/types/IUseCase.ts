import { Result } from '../../../domain/shared/Result';

export interface IUseCase<TInput, TOutput> {
  execute(input: TInput): Promise<Result<TOutput>>;
}
