export enum SyncLogStatus {
  STARTED = 'STARTED',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
  PARTIAL = 'PARTIAL',
}

export enum ResolutionStrategy {
  ADMIN_DECIDES = 'ADMIN_DECIDES',
  SERVER_WINS = 'SERVER_WINS',
  CLIENT_WINS = 'CLIENT_WINS',
  MERGE = 'MERGE',
}
