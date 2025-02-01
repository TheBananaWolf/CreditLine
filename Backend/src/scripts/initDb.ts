import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { Transaction } from "../entities/Transaction";
import { Application } from "../entities/Application";
import * as fs from 'fs';
import * as path from 'path';

async function initializeDatabase() {
  try {
    // Delete existing database file if it exists
    const dbPath = path.join(__dirname, '../../line-of-credit.sqlite');
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log("Deleted existing database file");
    }

    // Initialize the database connection
    await AppDataSource.initialize();
    console.log("Database connection initialized");

    // Create test users with credit limits
    const user1 = new User();
    user1.username = "john.doe";
    user1.creditLimit = 1000;
    user1.createdAt = new Date();
    user1.updatedAt = new Date();
    const savedUser1 = await AppDataSource.manager.save(user1);

    const user2 = new User();
    user2.username = "jane.smith";
    user2.creditLimit = 2000;
    user2.createdAt = new Date();
    user2.updatedAt = new Date();
    const savedUser2 = await AppDataSource.manager.save(user2);

    console.log("Test users created successfully");
    console.log("Available users for testing:");
    console.log("--------------------------------");
    console.log(`Username: ${savedUser1.username} (Credit Limit: $${savedUser1.creditLimit})`);
    console.log(`Username: ${savedUser2.username} (Credit Limit: $${savedUser2.creditLimit})`);
    console.log("--------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

initializeDatabase(); 