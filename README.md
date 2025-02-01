# Line of Credit Management System

A full-stack application for managing credit line applications, disbursements, and repayments.

## Features

- Users can create credit line applications
- Support for express delivery option (3-day delivery)
- Multiple application states (Open, Outstanding, Repaid, Cancelled, Rejected)
- Disbursement and repayment functionality
- Admin rejection capability
- View historical applications and transactions

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for components
- Axios for API calls

### Backend
- Node.js with Express
- TypeScript
- TypeORM for database management
- SQLite database

## Getting Started

### Prerequisites
- Node.js
- npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd line-of-credit-frontend
npm install
```

### Running the Application

1. Initialize the database with test users:
```bash
npm run init-db
```

2. Start the backend server (default port 3000):
```bash
npm run dev
```

3. Start the frontend development server (in a new terminal):
```bash
cd line-of-credit-frontend
npm start
```

The application will be available at `http://localhost:3001`

## Test Users

The system comes with two pre-configured test users:
- Username: `john.doe` (Credit Limit: $1000)
- Username: `jane.smith` (Credit Limit: $2000)

## Application States

- **OPEN**: Initial state after application creation
- **OUTSTANDING**: After funds are disbursed
- **REPAID**: After full repayment
- **CANCELLED**: User-initiated cancellation
- **REJECTED**: Admin-rejected application

## API Endpoints

- `POST /applications` - Create new application
- `GET /users/:username/applications` - Get user's applications
- `POST /applications/:id/disburse` - Disburse funds
- `POST /applications/:id/repay` - Make repayment
- `POST /applications/:id/cancel` - Cancel application
- `POST /applications/:id/reject` - Reject application

## Data Model

### User
- UUID identifier
- Unique username
- Credit limit
- One-to-many relationship with Applications

### Application
- UUID identifier
- Reference to User
- Application state
- Requested amount
- Outstanding balance
- Express delivery flag
- Creation and update timestamps
- One-to-many relationship with Transactions

### Transaction
- UUID identifier
- Reference to Application
- Transaction type (DISBURSEMENT/REPAYMENT)
- Amount
- Creation timestamp

## Project Structure
```
├── src/
│   ├── entities/           # Database entities
│   ├── services/          # Business logic
│   ├── scripts/           # Database initialization
│   └── server.ts          # Express server setup
│
├── line-of-credit-frontend/
│   ├── src/
│   │   ├── services/     # API client
│   │   ├── types/        # TypeScript types
│   │   └── App.tsx       # Main React component
│   └── package.json
│
└── package.json
```

## Development Notes

### Database
- Uses SQLite for simplicity and development
- TypeORM handles database schema and migrations
- Transactions ensure data consistency

### Frontend
- Material-UI components for consistent UI
- Real-time updates after actions
- Error handling and user feedback
- Responsive design

### Backend
- RESTful API architecture
- TypeScript for type safety
- Error handling middleware
- Transaction management

## Future Improvements

1. Authentication & Authorization
   - User authentication
   - Role-based access control
   - Session management

2. Enhanced Features
   - Interest calculation
   - Payment scheduling
   - Email notifications
   - Document upload

3. Production Readiness
   - PostgreSQL migration
   - Docker containerization
   - CI/CD pipeline
   - Monitoring and logging

4. UI/UX Improvements
   - Better error messages
   - Loading states
   - Confirmation dialogs
   - Mobile optimization

## License

MIT License
