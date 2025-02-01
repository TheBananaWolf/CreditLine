import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Application } from "../entities/Application";
import { Transaction } from "../entities/Transaction";
import path from "path";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: path.join(__dirname, "../../line-of-credit.sqlite"), // Store in project root
  entities: [User, Application, Transaction],
  synchronize: true, // This will auto-create tables in development
  logging: true
});

export default AppDataSource;