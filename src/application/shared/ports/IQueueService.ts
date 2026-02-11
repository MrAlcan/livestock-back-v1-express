export interface IQueueService {
  publish(queue: string, message: Record<string, unknown>): Promise<void>;
  subscribe(queue: string, handler: (message: Record<string, unknown>) => Promise<void>): Promise<void>;
}
