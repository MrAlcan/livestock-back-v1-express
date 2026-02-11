export interface IUnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  execute<T>(work: () => Promise<T>): Promise<T>;
}
