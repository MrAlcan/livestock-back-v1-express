export interface EmailOptions {
  readonly to: string;
  readonly subject: string;
  readonly body: string;
  readonly html?: string;
  readonly attachments?: ReadonlyArray<{ filename: string; content: Buffer }>;
}

export interface IEmailService {
  send(options: EmailOptions): Promise<void>;
  sendPasswordReset(email: string, token: string, userName: string): Promise<void>;
  sendWelcome(email: string, userName: string): Promise<void>;
}
