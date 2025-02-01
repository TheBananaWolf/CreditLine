import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Transaction } from "./Transaction";

export enum ApplicationState {
  OPEN = "OPEN",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
  OUTSTANDING = "OUTSTANDING",
  REPAID = "REPAID"
}

@Entity()
export class Application {
  @PrimaryGeneratedColumn("uuid")
  applicationId: string;

  @ManyToOne(() => User, user => user.applications)
  user: User;

  @Column()
  userId: string;

  @Column({
    type: "simple-enum",
    enum: ApplicationState,
    default: ApplicationState.OPEN
  })
  state: ApplicationState;

  @Column("decimal")
  requestedAmount: number;

  @Column("decimal")
  outstandingBalance: number;

  @Column()
  expressDelivery: boolean;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @OneToMany(() => Transaction, transaction => transaction.application)
  transactions: Transaction[];
}