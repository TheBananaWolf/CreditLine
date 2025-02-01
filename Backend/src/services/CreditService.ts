import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { Application, ApplicationState } from "../entities/Application";
import { Transaction, TransactionType } from "../entities/Transaction";

export class CreditService {
  private userRepository = AppDataSource.getRepository(User);
  private applicationRepository = AppDataSource.getRepository(Application);
  private transactionRepository = AppDataSource.getRepository(Transaction);

  async createApplication(
    username: string,
    requestedAmount: number,
    expressDelivery: boolean
  ): Promise<Application> {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new Error("User not found");
    }

    if (requestedAmount > user.creditLimit) {
      throw new Error("Requested amount exceeds credit limit");
    }

    const application = new Application();
    application.user = user;
    application.userId = user.userId;
    application.requestedAmount = requestedAmount;
    application.outstandingBalance = 0;
    application.expressDelivery = expressDelivery;
    application.state = ApplicationState.OPEN;
    application.createdAt = new Date();
    application.updatedAt = new Date();

    return this.applicationRepository.save(application);
  }

  async disburse(applicationId: string): Promise<void> {
    try {
      const application = await this.applicationRepository.findOneBy({ applicationId });
      if (!application) {
        throw new Error(`Application not found with ID: ${applicationId}`);
      }

      if (application.state !== ApplicationState.OPEN) {
        throw new Error(`Application must be in OPEN state for disbursement. Current state: ${application.state}`);
      }

      // Start transaction
      await AppDataSource.transaction(async transactionalEntityManager => {
        const transaction = new Transaction();
        transaction.application = application;
        transaction.applicationId = applicationId;
        transaction.type = TransactionType.DISBURSEMENT;
        transaction.amount = application.requestedAmount;
        transaction.createdAt = new Date();

        await transactionalEntityManager.save(transaction);

        application.state = ApplicationState.OUTSTANDING;
        application.outstandingBalance = application.requestedAmount;
        application.updatedAt = new Date();
        
        await transactionalEntityManager.save(application);
      });
    } catch (error) {
      console.error('Disburse error:', error);
      throw error;
    }
  }

  async repay(applicationId: string, amount: number): Promise<void> {
    const application = await this.applicationRepository.findOneBy({ applicationId });
    if (!application) {
      throw new Error("Application not found");
    }

    if (application.state !== ApplicationState.OUTSTANDING) {
      throw new Error("Application must be in OUTSTANDING state for repayment");
    }

    if (amount > application.outstandingBalance) {
      throw new Error("Repayment amount exceeds outstanding balance");
    }

    const transaction = new Transaction();
    transaction.application = application;
    transaction.applicationId = applicationId;
    transaction.type = TransactionType.REPAYMENT;
    transaction.amount = amount;
    transaction.createdAt = new Date();

    await this.transactionRepository.save(transaction);

    application.outstandingBalance -= amount;
    application.state = application.outstandingBalance === 0 
      ? ApplicationState.REPAID 
      : ApplicationState.OUTSTANDING;
    application.updatedAt = new Date();

    await this.applicationRepository.save(application);
  }

  async cancel(applicationId: string): Promise<void> {
    const application = await this.applicationRepository.findOneBy({ applicationId });
    if (!application) {
      throw new Error("Application not found");
    }

    if (application.state !== ApplicationState.OPEN) {
      throw new Error("Only OPEN applications can be cancelled");
    }

    application.state = ApplicationState.CANCELLED;
    application.updatedAt = new Date();
    
    await this.applicationRepository.save(application);
  }

  async reject(applicationId: string): Promise<void> {
    const application = await this.applicationRepository.findOneBy({ applicationId });
    if (!application) {
      throw new Error("Application not found");
    }

    if (application.state !== ApplicationState.OPEN) {
      throw new Error("Only OPEN applications can be rejected");
    }

    application.state = ApplicationState.REJECTED;
    application.updatedAt = new Date();
    
    await this.applicationRepository.save(application);
  }

  async getUserApplications(username: string): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { user: { username } },
      relations: ["transactions"]
    });
  }
} 