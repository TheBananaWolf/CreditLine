import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Application } from "./Application";

export enum TransactionType {
  DISBURSEMENT = "DISBURSEMENT",
  REPAYMENT = "REPAYMENT"
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  applicationId: string;

  @ManyToOne(() => Application)
  @JoinColumn({ name: "applicationId" })
  application: Application;

  @Column({
    type: "simple-enum",
    enum: TransactionType
  })
  type: TransactionType;

  @Column("decimal")
  amount: number;

  @Column()
  createdAt: Date;
}