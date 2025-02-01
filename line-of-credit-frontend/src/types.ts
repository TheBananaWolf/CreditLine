export enum ApplicationState {
  OPEN = 'OPEN',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
  OUTSTANDING = 'OUTSTANDING',
  REPAID = 'REPAID'
}

export interface Application {
  applicationId: string;
  userId: string;
  state: ApplicationState;
  requestedAmount: number;
  outstandingBalance: number;
  expressDelivery: boolean;
  createdAt: Date;
  updatedAt: Date;
} 