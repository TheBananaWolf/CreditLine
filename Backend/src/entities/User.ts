import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Application } from "./Application";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  userId: string;

  @Column({ unique: true })
  username: string;

  @Column("decimal")
  creditLimit: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @OneToMany(() => Application, application => application.user)
  applications: Application[];
}