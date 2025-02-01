import express, { Request, Response } from "express";
import cors from "cors";
import { AppDataSource } from "./src/config/database";
import { CreditService } from "./src/services/CreditService";
import { User } from "./src/entities/User";

const app = express();
app.use(express.json());
app.use(cors());

const creditService = new CreditService();

// Initialize database connection
AppDataSource.initialize()
  .then(async () => {
    console.log("Database connection initialized");
    
    // Fetch and display all users
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    console.log("\nAvailable Users for Testing:");
    console.log("--------------------------------");
    users.forEach(user => {
      console.log(`Username: ${user.username}`);
      console.log(`Credit Limit: $${user.creditLimit}`);
      console.log("--------------------------------");
    });
    console.log("\nUse these usernames to test the application\n");
  })
  .catch((error: Error) => console.log(error));

// Create application
app.post("/applications", async (req: Request, res: Response) => {
  try {
    const { username, requestedAmount, expressDelivery } = req.body;
    console.log('Received application request:', req.body);

    if (!username || !requestedAmount) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['username', 'requestedAmount'],
        received: req.body 
      });
    }

    const application = await creditService.createApplication(
      username,
      Number(requestedAmount),
      expressDelivery || false
    );
    res.status(201).json(application);
  } catch (error: any) {
    console.error('Error creating application:', error);
    res.status(400).json({ 
      error: error.message,
      details: error.stack 
    });
  }
});

// Disburse funds
app.post("/applications/:id/disburse", async (req: Request, res: Response) => {
  try {
    console.log(`Attempting to disburse funds for application: ${req.params.id}`);
    await creditService.disburse(req.params.id);
    res.status(200).json({ message: "Funds disbursed successfully" });
  } catch (error: any) {
    console.error('Disburse error:', error);
    res.status(400).json({ 
      error: error.message,
      details: error.stack
    });
  }
});

// Repay
app.post("/applications/:id/repay", async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    await creditService.repay(req.params.id, amount);
    res.status(200).json({ message: "Repayment successful" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Cancel application
app.post("/applications/:id/cancel", async (req: Request, res: Response) => {
  try {
    await creditService.cancel(req.params.id);
    res.status(200).json({ message: "Application cancelled" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Reject application (admin only)
app.post("/applications/:id/reject", async (req: Request, res: Response) => {
  try {
    await creditService.reject(req.params.id);
    res.status(200).json({ message: "Application rejected" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get user applications
app.get("/users/:username/applications", async (req: Request, res: Response) => {
  try {
    const applications = await creditService.getUserApplications(req.params.username);
    res.status(200).json(applications);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});