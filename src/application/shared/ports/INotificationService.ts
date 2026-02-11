export interface NotificationPayload {
  readonly userId: string;
  readonly title: string;
  readonly message: string;
  readonly type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  readonly data?: Record<string, unknown>;
}

export interface INotificationService {
  send(payload: NotificationPayload): Promise<void>;
  sendToMany(userIds: string[], payload: Omit<NotificationPayload, 'userId'>): Promise<void>;
  sendPush(userId: string, title: string, body: string): Promise<void>;
}
