# Personal Finance Tracker

A full-stack personal finance management application with receipt scanning capabilities, built with React and Node.js/Express.

## Features

- **Authentication**: Secure signup and login with JWT tokens
- **Manual Transaction Entry**: Add, edit, and delete transactions with details like amount, category, date, location, and tax
- **Receipt Scanning**: Upload receipt images (JPG, PNG) and automatically extract transaction information using OCR
- **Reports**: Skeleton structure ready for future report implementations
- **Protected Routes**: All transaction features require authentication

## Technology Stack

### Backend
- Node.js with Express
- SQLite database
- JWT authentication
- Tesseract.js for OCR
- Multer for file uploads

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- React DatePicker for date selection

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory (optional, defaults are provided):
```env
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000` and automatically open in your browser.

## Project Structure

```
Personal Finance Tracker/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration and initialization
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── transactionController.js  # Transaction CRUD operations
│   │   ├── receiptController.js # Receipt upload and OCR processing
│   │   └── reportController.js  # Reports placeholder
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT authentication middleware
│   ├── models/
│   │   ├── User.js              # User model
│   │   └── Transaction.js       # Transaction model
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── transactions.js      # Transaction routes
│   │   ├── receipts.js          # Receipt routes
│   │   └── reports.js           # Reports routes
│   ├── utils/
│   │   └── ocrService.js        # OCR text extraction service
│   ├── server.js                # Express server setup
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/            # Login and Signup components
│   │   │   ├── transactions/    # Transaction form and list
│   │   │   ├── receipts/        # Receipt upload component
│   │   │   ├── reports/         # Reports view (skeleton)
│   │   │   └── common/          # Navbar and ProtectedRoute
│   │   ├── services/
│   │   │   ├── api.js           # Axios API configuration
│   │   │   └── auth.js          # Authentication service
│   │   ├── App.js               # Main app component with routing
│   │   └── index.js             # React entry point
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Login and receive JWT token

### Transactions (Protected)
- `GET /api/transactions` - Get all transactions for the authenticated user
- `POST /api/transactions` - Create a new transaction
- `GET /api/transactions/:id` - Get a specific transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction

### Receipts (Protected)
- `POST /api/receipts/upload` - Upload and scan a receipt image

### Reports (Protected)
- `GET /api/reports` - Get reports (placeholder for future implementation)

## Usage

1. **Sign Up**: Create a new account with username, email, and password
2. **Login**: Sign in with your email and password
3. **Add Transactions**:
   - Manually enter transaction details in the Transactions page
   - Or upload a receipt image to automatically extract information
4. **View Transactions**: See all your transactions in a list format
5. **Edit/Delete**: Modify or remove transactions as needed
6. **Reports**: View the reports page (currently shows placeholder)

## Receipt Scanning

The receipt scanning feature uses Tesseract.js OCR to extract:
- Total amount
- Tax amount
- Date
- Location
- Description/Items

Upload a clear image (JPG or PNG) of a receipt for best results. The extracted data can be reviewed and edited before creating a transaction.

## Security Features

- Passwords are hashed using bcrypt (10 salt rounds)
- JWT tokens with expiration
- SQL injection prevention via parameterized queries
- File upload validation (type and size limits)
- CORS configuration for secure frontend-backend communication

## Future Enhancements

- Complete reports implementation with charts and visualizations
- PDF receipt support
- Category-based spending analysis
- Export transactions to CSV/Excel
- Recurring transaction support
- Budget tracking and alerts

## License

ISC
